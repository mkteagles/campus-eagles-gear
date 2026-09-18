$ErrorActionPreference = "Stop"

Write-Host "=== CAMPUS EAGLES GEAR · NUEVOS CURSOS ==="
Write-Host "Carpeta actual: $(Get-Location)"
Write-Host ""

if (!(Test-Path ".git")) {
    throw "Este script debe ejecutarse dentro de C:\Users\gwero\Documents\campus-eagles-gear"
}

Write-Host "=== INSTALANDO DEPENDENCIAS ==="
npm install
if ($LASTEXITCODE -ne 0) { throw "npm install falló." }

Write-Host "=== PROBANDO BUILD ==="
npm run build
if ($LASTEXITCODE -ne 0) { throw "EL BUILD FALLÓ. NO SE HARÁ PUSH." }

Write-Host "=== PREPARANDO GIT ==="
git add .
git diff --cached --quiet

if ($LASTEXITCODE -eq 1) {
    git commit -m "Prepara nuevos cursos del Campus"
} else {
    Write-Host "No hay cambios nuevos para hacer commit."
}

Write-Host "=== SUBIENDO A MAIN ==="
git push origin HEAD:main
if ($LASTEXITCODE -ne 0) { throw "El push a GitHub falló." }

Write-Host ""
Write-Host "=========================================="
Write-Host "LISTO"
Write-Host "NUEVOS CURSOS SUBIDOS A GITHUB MAIN"
Write-Host "=========================================="
