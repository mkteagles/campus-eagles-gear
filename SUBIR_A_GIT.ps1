$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "=== EAGLES CAMPUS · CVT ELITE ===" -ForegroundColor Yellow
Write-Host ""

if (-not (Test-Path ".git")) {
  Write-Host "ERROR: Ejecuta este script dentro de la carpeta campus-eagles-gear." -ForegroundColor Red
  exit 1
}

Write-Host "1/4 Instalando dependencias..." -ForegroundColor Cyan
npm install
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "2/4 Revisando build..." -ForegroundColor Cyan
npm run build
if ($LASTEXITCODE -ne 0) {
  Write-Host "El build falló. No se subieron cambios a Git." -ForegroundColor Red
  exit $LASTEXITCODE
}

Write-Host "3/4 Preparando commit..." -ForegroundColor Cyan
git status
git add .

git diff --cached --quiet
if ($LASTEXITCODE -eq 0) {
  Write-Host "No hay cambios nuevos para subir." -ForegroundColor Yellow
  exit 0
}

$commitMessage = "Agrega dashboard CVT Elite al Campus"
git commit -m $commitMessage
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "4/4 Subiendo a GitHub..." -ForegroundColor Cyan
git push origin main
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host ""
Write-Host "LISTO. Cambios subidos a main." -ForegroundColor Green
