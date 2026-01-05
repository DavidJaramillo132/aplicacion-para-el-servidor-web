-- ============================================================================
-- ESQUEMA DE BASE DE DATOS PARA WEBHOOKS
-- TALLER 2: ARQUITECTURA EVENT-DRIVEN CON WEBHOOKS Y SERVERLESS
-- ============================================================================

-- ============================================================================
-- TABLA: webhook_subscriptions
-- Descripción: Gestiona las suscripciones a eventos webhook
-- Almacena URLs de destino, secrets para firma HMAC, y configuración de retry
-- ============================================================================
CREATE TABLE IF NOT EXISTS webhook_subscriptions (
    id SERIAL PRIMARY KEY,
    event_type VARCHAR(100) NOT NULL,
    url VARCHAR(500) NOT NULL,
    secret VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    retry_config JSONB DEFAULT '{
        "max_attempts": 6,
        "backoff_type": "exponential",
        "initial_delay_ms": 60000
    }'::jsonb,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    last_triggered_at TIMESTAMP,
    CONSTRAINT unique_event_url UNIQUE(event_type, url)
);

-- ============================================================================
-- TABLA: webhook_events
-- Descripción: Registro de todos los eventos webhook recibidos
-- Garantiza idempotencia mediante idempotency_key único
-- ============================================================================
CREATE TABLE IF NOT EXISTS webhook_events (
    id SERIAL PRIMARY KEY,
    event_id VARCHAR(255) UNIQUE NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    idempotency_key VARCHAR(255) UNIQUE NOT NULL,
    payload JSONB NOT NULL,
    metadata JSONB,
    received_at TIMESTAMP NOT NULL DEFAULT NOW(),
    processed_at TIMESTAMP,
    CONSTRAINT event_type_check CHECK (event_type IN (
        'transferencia.iniciada',
        'transferencia.completada',
        'transferencia.fallida',
        'cuenta.creada',
        'cuenta.actualizada'
    ))
);

-- ============================================================================
-- TABLA: webhook_deliveries
-- Descripción: Auditoría completa de todos los intentos de entrega de webhooks
-- Registra cada intento, estado, errores y duración
-- ============================================================================
CREATE TABLE IF NOT EXISTS webhook_deliveries (
    id SERIAL PRIMARY KEY,
    subscription_id INTEGER REFERENCES webhook_subscriptions(id) ON DELETE CASCADE,
    event_id VARCHAR(255) REFERENCES webhook_events(event_id) ON DELETE CASCADE,
    attempt_number INTEGER NOT NULL CHECK (attempt_number > 0),
    status_code INTEGER,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('success', 'failed', 'pending', 'timeout')),
    error_message TEXT,
    response_body TEXT,
    delivered_at TIMESTAMP NOT NULL DEFAULT NOW(),
    next_retry_at TIMESTAMP,
    duration_ms INTEGER,
    CONSTRAINT attempt_status_check CHECK (
        (status = 'success' AND status_code >= 200 AND status_code < 300) OR
        (status = 'failed' AND status_code IS NOT NULL) OR
        (status = 'pending' AND status_code IS NULL) OR
        (status = 'timeout' AND status_code IS NULL)
    )
);

-- ============================================================================
-- TABLA: processed_webhooks
-- Descripción: Control de idempotencia para deduplicar eventos duplicados
-- Versión mejorada: incluye seguimiento por evento y correlación
-- ============================================================================
CREATE TABLE IF NOT EXISTS processed_webhooks (
    id SERIAL PRIMARY KEY,
    idempotency_key VARCHAR(255) UNIQUE NOT NULL,
    event_id INTEGER REFERENCES webhook_events(id) ON DELETE CASCADE,
    source_service VARCHAR(100) NOT NULL,
    correlation_id VARCHAR(255),
    result JSONB,
    processed_at TIMESTAMP NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMP NOT NULL DEFAULT (NOW() + INTERVAL '7 days'),
    CONSTRAINT processed_webhook_unique UNIQUE(idempotency_key, source_service)
);

-- ============================================================================
-- TABLA: webhook_dead_letter_queue
-- Descripción: Almacena webhooks que fallaron todos los reintentos
-- Permite investigación post-mortem y replay manual
-- ============================================================================
CREATE TABLE IF NOT EXISTS webhook_dead_letter_queue (
    id SERIAL PRIMARY KEY,
    subscription_id INTEGER REFERENCES webhook_subscriptions(id),
    event_id VARCHAR(255) REFERENCES webhook_events(event_id),
    payload JSONB NOT NULL,
    reason TEXT NOT NULL,
    failed_attempts INTEGER NOT NULL,
    last_error TEXT,
    added_at TIMESTAMP NOT NULL DEFAULT NOW(),
    resolved_at TIMESTAMP,
    is_resolved BOOLEAN DEFAULT false
);

-- ============================================================================
-- ÍNDICES PARA OPTIMIZAR PERFORMANCE
-- ============================================================================

-- webhook_events
CREATE INDEX IF NOT EXISTS idx_webhook_events_event_type 
    ON webhook_events(event_type);
CREATE INDEX IF NOT EXISTS idx_webhook_events_idempotency_key 
    ON webhook_events(idempotency_key);
CREATE INDEX IF NOT EXISTS idx_webhook_events_received_at 
    ON webhook_events(received_at DESC);
CREATE INDEX IF NOT EXISTS idx_webhook_events_event_id 
    ON webhook_events(event_id);

-- webhook_deliveries
CREATE INDEX IF NOT EXISTS idx_webhook_deliveries_delivered_at 
    ON webhook_deliveries(delivered_at DESC);
CREATE INDEX IF NOT EXISTS idx_webhook_deliveries_subscription_status 
    ON webhook_deliveries(subscription_id, status);
CREATE INDEX IF NOT EXISTS idx_webhook_deliveries_event_id 
    ON webhook_deliveries(event_id);
CREATE INDEX IF NOT EXISTS idx_webhook_deliveries_next_retry 
    ON webhook_deliveries(next_retry_at) 
    WHERE status = 'pending' AND next_retry_at IS NOT NULL;

-- processed_webhooks
CREATE INDEX IF NOT EXISTS idx_processed_webhooks_idempotency_key 
    ON processed_webhooks(idempotency_key);
CREATE INDEX IF NOT EXISTS idx_processed_webhooks_expires_at 
    ON processed_webhooks(expires_at);
CREATE INDEX IF NOT EXISTS idx_processed_webhooks_source 
    ON processed_webhooks(source_service);
CREATE INDEX IF NOT EXISTS idx_processed_webhooks_correlation 
    ON processed_webhooks(correlation_id);

-- webhook_subscriptions
CREATE INDEX IF NOT EXISTS idx_webhook_subscriptions_event_type 
    ON webhook_subscriptions(event_type);
CREATE INDEX IF NOT EXISTS idx_webhook_subscriptions_active 
    ON webhook_subscriptions(is_active) 
    WHERE is_active = true;

-- webhook_dead_letter_queue
CREATE INDEX IF NOT EXISTS idx_dlq_added_at 
    ON webhook_dead_letter_queue(added_at DESC);
CREATE INDEX IF NOT EXISTS idx_dlq_resolved 
    ON webhook_dead_letter_queue(is_resolved);

-- ============================================================================
-- FUNCIONES AUXILIARES
-- ============================================================================

-- Función para limpiar processed_webhooks expirados
CREATE OR REPLACE FUNCTION clean_expired_webhooks()
RETURNS void AS $$
BEGIN
    DELETE FROM processed_webhooks
    WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Función para calcular el siguiente tiempo de reintento con exponential backoff
CREATE OR REPLACE FUNCTION calculate_next_retry(
    p_attempt_number INTEGER,
    p_initial_delay_ms INTEGER DEFAULT 60000
)
RETURNS TIMESTAMP AS $$
DECLARE
    v_delay_ms INTEGER;
BEGIN
    -- Exponential backoff: 1min, 5min, 30min, 2h, 12h, 24h
    v_delay_ms := CASE p_attempt_number
        WHEN 1 THEN 60000          -- 1 minuto
        WHEN 2 THEN 300000         -- 5 minutos
        WHEN 3 THEN 1800000        -- 30 minutos
        WHEN 4 THEN 7200000        -- 2 horas
        WHEN 5 THEN 43200000       -- 12 horas
        ELSE 86400000              -- 24 horas (default)
    END;
    
    RETURN NOW() + (v_delay_ms || ' milliseconds')::INTERVAL;
END;
$$ LANGUAGE plpgsql;

-- Función para registrar webhook fallido en DLQ
CREATE OR REPLACE FUNCTION move_to_dlq(
    p_subscription_id INTEGER,
    p_event_id VARCHAR(255),
    p_reason TEXT
)
RETURNS void AS $$
DECLARE
    v_payload JSONB;
    v_failed_attempts INTEGER;
    v_last_error TEXT;
BEGIN
    -- Obtener datos del evento
    SELECT payload INTO v_payload
    FROM webhook_events
    WHERE event_id = p_event_id;
    
    -- Contar intentos fallidos
    SELECT COUNT(*), COALESCE(MAX(error_message), 'Unknown error')
    INTO v_failed_attempts, v_last_error
    FROM webhook_deliveries
    WHERE subscription_id = p_subscription_id
    AND event_id = p_event_id;
    
    -- Insertar en DLQ
    INSERT INTO webhook_dead_letter_queue (
        subscription_id,
        event_id,
        payload,
        reason,
        failed_attempts,
        last_error
    ) VALUES (
        p_subscription_id,
        p_event_id,
        v_payload,
        p_reason,
        v_failed_attempts,
        v_last_error
    );
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- DATOS DE EJEMPLO PARA WEBHOOK_SUBSCRIPTIONS
-- ============================================================================

-- Suscripción 1: Edge Function Event Logger (Auditoría)
INSERT INTO webhook_subscriptions (event_type, url, secret, retry_config)
VALUES (
    'transferencia.iniciada',
    'https://YOUR_SUPABASE_PROJECT.supabase.co/functions/v1/webhook-event-logger',
    'webhook_secret_123456',
    '{
        "max_attempts": 6,
        "backoff_type": "exponential",
        "initial_delay_ms": 60000
    }'::jsonb
) ON CONFLICT (event_type, url) DO NOTHING;

-- Suscripción 2: Edge Function External Notifier (Notificaciones)
INSERT INTO webhook_subscriptions (event_type, url, secret, retry_config)
VALUES (
    'transferencia.completada',
    'https://YOUR_SUPABASE_PROJECT.supabase.co/functions/v1/webhook-external-notifier',
    'webhook_secret_123456',
    '{
        "max_attempts": 6,
        "backoff_type": "exponential",
        "initial_delay_ms": 60000
    }'::jsonb
) ON CONFLICT (event_type, url) DO NOTHING;

-- Suscripción 3: Eventos de transferencias fallidas
INSERT INTO webhook_subscriptions (event_type, url, secret, retry_config)
VALUES (
    'transferencia.fallida',
    'https://YOUR_SUPABASE_PROJECT.supabase.co/functions/v1/webhook-event-logger',
    'webhook_secret_123456',
    '{
        "max_attempts": 6,
        "backoff_type": "exponential",
        "initial_delay_ms": 60000
    }'::jsonb
) ON CONFLICT (event_type, url) DO NOTHING;

-- ============================================================================
-- COMENTARIO: EJECUCIÓN DE ESTE SCRIPT
-- ============================================================================
-- Este script debe ejecutarse en AMBAS bases de datos:
-- 1. postgres-master (cuentas_db)
-- 2. postgres-worker (transferencias_db)
-- 
-- O alternativamente, crear una tercera base de datos "webhooks_db" 
-- con replicación desde ms-master y ms-worker
--
-- Comando de ejecución:
-- psql -h localhost -p 5432 -U postgres -d cuentas_db -f WEBHOOK_SCHEMA.sql
-- psql -h localhost -p 5432 -U postgres -d transferencias_db -f WEBHOOK_SCHEMA.sql
-- ============================================================================
