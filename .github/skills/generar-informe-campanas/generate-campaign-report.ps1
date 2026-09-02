#!/usr/bin/env pwsh

<#
.SYNOPSIS
    Genera informe completo de campañas Google Ads con tabla WhatsApp y lo publica

.PARAMETER StartDate
    Fecha inicio (ej: 2026-08-01)

.PARAMETER EndDate
    Fecha fin (ej: 2026-08-31)

.PARAMETER MonthName
    Nombre del mes en español para output (ej: agosto)

.PARAMETER Year
    Año (ej: 2026)

.EXAMPLE
    .\generate-campaign-report.ps1 -StartDate "2026-08-01" -EndDate "2026-08-31" -MonthName "agosto" -Year "2026"
#>

param(
    [string]$StartDate = (Get-Date -Format "yyyy-MM-01"),
    [string]$EndDate = (Get-Date -Format "yyyy-MM-dd"),
    [string]$MonthName = (Get-Date -Format "MMMM" -ErrorAction Ignore),
    [string]$Year = (Get-Date -Format "yyyy")
)

$ErrorActionPreference = "Stop"

# Paths
$GA4_SCRIPTS = "C:\Users\ADM\Documents\WebCamProyecto\ga4-export"
$REPO_PATH = "C:\Users\ADM\Documents\WebCamProyecto\RepoLanding"
$INFORME_SOURCE = "C:\Users\ADM\Documents\WebCamProyecto\informe-campanas-agosto-2026.html"
$INFORME_DEST = "$REPO_PATH\public\informe-$MonthName-$Year.html"

Write-Host "🚀 Iniciando generación de informe: $StartDate a $EndDate" -ForegroundColor Cyan

# 1. Extraer datos GA4
Write-Host "`n📊 Paso 1: Extrayendo datos GA4..." -ForegroundColor Yellow
Push-Location $GA4_SCRIPTS
node ga4-timestamps-detalle.js --startDate $StartDate --endDate $EndDate
Pop-Location

# 2. Generar HTML con tabla
Write-Host "`n🎨 Paso 2: Generando HTML con tabla interactiva..." -ForegroundColor Yellow
Push-Location $GA4_SCRIPTS
node build-html-table.js --csv "whatsapp_verificacion_*.csv" --output "$INFORME_SOURCE"
Pop-Location

# 3. Copiar a repo
Write-Host "`n📁 Paso 3: Copiando a repositorio..." -ForegroundColor Yellow
Copy-Item $INFORME_SOURCE $INFORME_DEST -Force
Write-Host "✅ Copiado a: $INFORME_DEST" -ForegroundColor Green

# 4. Git commit + push
Write-Host "`n🔧 Paso 4: Commiteando cambios..." -ForegroundColor Yellow
Push-Location $REPO_PATH
git add public/informe-$MonthName-$Year.html
git commit -m "docs: informe campanas $MonthName $Year con tabla verificacion whatsapp"
git push
Pop-Location

# 5. Esperar a Netlify
Write-Host "`n⏳ Paso 5: Esperando redeploy de Netlify (~30s)..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# 6. Confirmar URL
$url = "https://goldmodelsstudio.com/informe-$MonthName-$Year.html"
Write-Host "`n✅ COMPLETADO" -ForegroundColor Green
Write-Host "🔗 Informe publicado en: $url" -ForegroundColor Cyan
Write-Host "`n📋 Próximas acciones:" -ForegroundColor Yellow
Write-Host "  1. Abre el link en browser"
Write-Host "  2. Por cada clic, busca en WhatsApp Business"
Write-Host "  3. Haz click en checkbox: ☐ → ✓ (gestionado) o ✗ (no aplica)"
