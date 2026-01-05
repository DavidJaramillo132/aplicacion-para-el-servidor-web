#!/usr/bin/env powershell
# INSTRUCCIONES PARA INICIAR DOCKER Y EL PROYECTO

Write-Host @"

================================================================================
  GUIA RAPIDA: COMO INICIAR TODO
================================================================================

PROBLEMA DETECTADO: Docker Desktop no está corriendo

SOLUCION PASO A PASO:

1. INICIA DOCKER DESKTOP MANUALMENTE
   ├─ Abre el Menu de Inicio
   ├─ Busca "Docker Desktop"
   ├─ Haz click para iniciar
   └─ Espera a que aparezca el logo de Docker en la bandeja (30-60 seg)

2. VERIFICA QUE DOCKER ESTÁ LISTO
   ├─ Abre PowerShell
   ├─ Ejecuta: docker ps
   └─ Si ves "CONTAINER ID   IMAGE..." estás listo

3. INICIA LOS SERVICIOS
   ├─ En PowerShell, ve al proyecto:
   │  cd "c:\Users\kelly\OneDrive\Documentos\AplicacionParaElServidorWeb\SegundoParcial"
   │
   ├─ Ejecuta:
   │  docker-compose up -d
   │
   └─ Espera 30-60 segundos a que todo esté listo

4. VERIFICA QUE TODO FUNCIONA
   ├─ Ejecuta: docker-compose ps
   ├─ Deberías ver 7 contenedores con estado "Up"
   └─ Prueba: curl http://localhost:3000/health

5. EJECUTA LA DEMO
   ├─ En PowerShell:
   │  .\demo.ps1
   │
   └─ Deberías ver transferencias funcionando


================================================================================
  SI ALGO FALLA
================================================================================

"Si docker ps da error":
  → Docker Desktop NO está corriendo
  → Ve al paso 1 y asegurate de que el logo aparece en la bandeja

"Si docker-compose falla":
  → Espera 30 segundos y vuelve a intentar
  → Docker necesita tiempo para inicializar

"Si los servicios no inician":
  → Ejecuta: docker-compose logs
  → Para ver qué está pasando

"Si quieres parar todo":
  → docker-compose down

"Para ver logs de un servicio específico":
  → docker logs gateway -f
  → docker logs ms-master -f
  → docker logs ms-worker -f


================================================================================
  VERIFICACION RAPIDA
================================================================================

Copia y pega esto en PowerShell después de que Docker esté listo:

@"
cd "c:\Users\kelly\OneDrive\Documentos\AplicacionParaElServidorWeb\SegundoParcial"
docker-compose up -d
Start-Sleep -Seconds 10
docker-compose ps
"@

"@ -ForegroundColor Cyan

Write-Host ""
Write-Host "Presiona ENTER para continuar..." -ForegroundColor Yellow
Read-Host
