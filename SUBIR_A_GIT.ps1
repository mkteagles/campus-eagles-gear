$ErrorActionPreference = "Stop"

Set-Location $PSScriptRoot

Write-Host ""
Write-Host "=== EAGLES CAMPUS · CVT ELITE + 10 MANUALES ===" -ForegroundColor Yellow
Write-Host "Proyecto: $PSScriptRoot" -ForegroundColor DarkGray
Write-Host ""

if (-not (Test-Path ".git")) {
  Write-Host "ERROR: Esta carpeta no contiene el repositorio .git." -ForegroundColor Red
  exit 1
}

Write-Host "1/4 Instalando dependencias..." -ForegroundColor Cyan
npm install
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "2/4 Revisando build..." -ForegroundColor Cyan
npm run build
if ($LASTEXITCODE -ne 0) {
  Write-Host "El build fallo. NO se hizo commit ni push." -ForegroundColor Red
  exit $LASTEXITCODE
}

Write-Host "3/4 Preparando commit..." -ForegroundColor Cyan
git add .

git diff --cached --quiet
if ($LASTEXITCODE -eq 0) {
  Write-Host "No hay cambios nuevos para subir." -ForegroundColor Yellow
  exit 0
}

git status
git commit -m "Agrega 10 manuales y entregables a CVT Elite"
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "4/4 Subiendo el commit actual a main..." -ForegroundColor Cyan
git push origin HEAD:main
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host ""
Write-Host "LISTO. Campus actualizado en origin/main." -ForegroundColor Green
