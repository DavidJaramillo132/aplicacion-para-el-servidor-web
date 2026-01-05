-- ============================================================================
-- DATOS DE EJEMPLO PARA PRUEBA DEL SISTEMA
-- ============================================================================
-- Base de Datos: cuentas_db (ms-master)
-- Este archivo contiene datos de ejemplo para probar el funcionamiento completo

-- ============================================================================
-- CREAR CUENTAS DE EJEMPLO
-- ============================================================================
INSERT INTO public.cuentas (numero, "titularNombre", saldo, estado, "fechaCreacion", "fechaActualizacion") VALUES
('1001', 'Juan Pérez González', 5000.00, 'ACTIVA', NOW(), NOW()),
('1002', 'María López Rodríguez', 3500.50, 'ACTIVA', NOW(), NOW()),
('1003', 'Carlos García Martínez', 2250.75, 'ACTIVA', NOW(), NOW()),
('1004', 'Ana Fernández Silva', 8000.00, 'ACTIVA', NOW(), NOW()),
('1005', 'Miguel Sánchez Torres', 1500.25, 'ACTIVA', NOW(), NOW()),
('1006', 'Laura Díaz Moreno', 6500.00, 'ACTIVA', NOW(), NOW()),
('1007', 'Roberto Jiménez López', 4200.50, 'ACTIVA', NOW(), NOW()),
('1008', 'Sofía Ruiz García', 7800.00, 'ACTIVA', NOW(), NOW());

-- ============================================================================
-- DATOS DE EJEMPLO PARA TRANSFERENCIAS (transferencias_db)
-- Nota: Estos se insertarán después de ejecutar las transacciones
-- ============================================================================

-- El siguiente comentario muestra la estructura que tendrán las transferencias
-- INSERT INTO public.transferencias (
--   "transferenciaId",
--   "cuentaOrigenId",
--   "cuentaDestinoId",
--   monto,
--   estado,
--   "idempotencyKey",
--   "errorMessage",
--   "fechaCreacion",
--   "fechaActualizacion"
-- ) VALUES
-- ('TRF-001', 1, 2, 500.00, 'PROCESADA', NULL, NULL, NOW(), NOW()),
-- ('TRF-002', 2, 3, 250.50, 'PROCESADA', NULL, NULL, NOW(), NOW()),
-- ('TRF-003', 4, 5, 1000.00, 'PROCESADA', NULL, NULL, NOW(), NOW());
