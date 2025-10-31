# Práctica 1 - Frontend con Flask

## Integrantes
- Kelly Canchingre
- David Jaramillo
- Kevin Calderón

## Objetivo de la Práctica

Desarrollar una aplicación web frontend utilizando Flask (Python) para crear un sistema de gestión con múltiples vistas y rutas. Esta práctica tiene como objetivo familiarizarse con el framework Flask, el sistema de plantillas HTML, y la estructura básica de una aplicación web con servidor de desarrollo integrado.

## Instrucciones para Ejecutar el Proyecto

### Prerrequisitos

- Python 3.8 o superior
- pip (gestor de paquetes de Python)
- Flask

### Pasos de Instalación

1. Abrir la terminal o línea de comandos.

2. Navegar hasta el directorio raíz del proyecto:
   ```powershell
   cd "c:\Users\djdav\OneDrive - ULEAM\IngenieriaSoftware\Quinto Semestre\aplicacion-para-el-servidor-web\PrimerParcial\practica1-frontend"
   ```

3. (Recomendado) Crear un entorno virtual:
   ```powershell
   python -m venv venv
   .\venv\Scripts\Activate.ps1
   ```

4. Instalar las dependencias del proyecto:
   ```powershell
   pip install flask
   ```

### Pasos de Ejecución

1. Una vez que todas las dependencias estén instaladas, ejecutar el comando para iniciar el servidor de desarrollo:
   ```powershell
   python app.py
   ```

2. La aplicación se iniciará en modo debug y estará disponible en el navegador.

## Puerto y Rutas de Prueba Principales

### Puerto de Ejecución
- **http://localhost:5000**

### Rutas Principales de Prueba

- **GET /** - Página principal (index.html)
  - Ruta de inicio de la aplicación

- **GET /about** - Página "Acerca de" (about.html)
  - Información sobre el proyecto o la empresa

- **GET /contact** - Página de contacto (contact.html)
  - Formulario de contacto

- **GET /contacto** - Página de contacto alternativa (contacto.html)
  - Vista alternativa de contacto

- **GET /Reserva** - Página de reservas (Reserva.html)
  - Sistema de reservas

- **GET /filaVirtual** - Página de fila virtual (filaVirtual.html)
  - Sistema de gestión de turnos o fila virtual

## Estructura del Proyecto

```
practica1-frontend/
├── app.py                 # Archivo principal de la aplicación Flask
├── static/                # Archivos estáticos (CSS, imágenes, JS)
│   ├── css/              # Hojas de estilo
│   └── images/           # Imágenes del proyecto
└── templates/            # Plantillas HTML
    ├── about.html
    ├── contact.html
    ├── contacto.html
    ├── filaVirtual.html
    ├── index.html
    └── Reserva.html
```

## Tecnologías Utilizadas

- **Flask**: Framework web de Python
- **HTML5**: Estructura de las páginas web
- **CSS3**: Estilos y diseño visual
- **Python**: Lenguaje de programación del backend
