CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabla de Usuarios (Clientes y Administradores de Negocio)
CREATE TABLE usuarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol VARCHAR(20) CHECK (rol IN ('cliente', 'adminNegocio')) NOT NULL,
    telefono VARCHAR(20),
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Administradores del Sistema
CREATE TABLE admin_sistema (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID REFERENCES usuarios(id),
    nombre VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    telefono VARCHAR(20)
);

-- Tabla de Negocios
CREATE TABLE negocios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_negocio_id UUID REFERENCES usuarios(id),
    nombre VARCHAR(200) NOT NULL,
    categoria VARCHAR(100) NOT NULL,
    descripcion TEXT,
    ubicacion_lat DECIMAL(10, 8),
    ubicacion_lng DECIMAL(11, 8),
    telefono VARCHAR(20),
    correo VARCHAR(255),
    imagen_url VARCHAR(500),
    estado BOOLEAN DEFAULT TRUE,
    hora_atencion VARCHAR(100),
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Estaciones/Sucursales
CREATE TABLE estaciones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    negocio_id UUID REFERENCES negocios(id) ON DELETE CASCADE,
    nombre VARCHAR(200) NOT NULL,
    estado VARCHAR(20) CHECK (estado IN ('activo', 'inactivo')) DEFAULT 'activo',
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Horarios de Atención
CREATE TABLE horarios_atencion (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    estacion_id UUID REFERENCES estaciones(id) ON DELETE CASCADE,
    dia_semana INTEGER CHECK (dia_semana BETWEEN 1 AND 7),
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Servicios
CREATE TABLE servicios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    negocio_id UUID REFERENCES negocios(id) ON DELETE CASCADE,
    nombre VARCHAR(200) NOT NULL,
    codigo VARCHAR(50),
    descripcion TEXT,
    duracion_minutos INTEGER NOT NULL,
    capacidad INTEGER DEFAULT 1,
    requiere_cita BOOLEAN DEFAULT TRUE,
    precio_centavos INTEGER DEFAULT 0,
    visible BOOLEAN DEFAULT TRUE,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Citas
CREATE TABLE citas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID REFERENCES usuarios(id),
    servicio_id UUID REFERENCES servicios(id),
    fecha DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    estado VARCHAR(20) CHECK (estado IN ('pendiente', 'atendida', 'cancelada')) DEFAULT 'pendiente',
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Franjas Horarias (Flias)
CREATE TABLE fila (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    estacion_id UUID REFERENCES estaciones(id) ON DELETE CASCADE,
    fecha DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    estado VARCHAR(20) CHECK (estado IN ('abierta', 'cerrada')) DEFAULT 'abierta',
    capacidad_disponible INTEGER DEFAULT 1,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Notificaciones
CREATE TABLE notificaciones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID REFERENCES usuarios(id),
    cita_id UUID REFERENCES citas(id),
    tipo VARCHAR(50) CHECK (tipo IN ('cita_confirmada', 'cita_recordatorio', 'cita_cancelada')),
    contenido JSONB,
    estado VARCHAR(20) CHECK (estado IN ('pendiente', 'enviada', 'fallida')) DEFAULT 'pendiente',
    enviada_en TIMESTAMP,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);