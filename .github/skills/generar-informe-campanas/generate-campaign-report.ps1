#!/usr/bin/env pwsh

<#
.SYNOPSIS
    Genera informe completo de campañas (Google Ads + GA4) y lo publica

.PARAMETER StartDate
    Fecha inicio (ej: 2026-08-01)

.PARAMETER EndDate
    Fecha fin (ej: 2026-08-31)

.PARAMETER MonthName
    Nombre del mes en español para output (ej: agosto)

.PARAMETER Year
    Año (ej: 2026)

.PARAMETER SheetId
    ID del Google Sheet donde el Google Ads Script exporta las metricas (opcional).
    Si no se pasa, el informe se genera solo con datos de GA4 (sin gasto/CPA de Ads).

.EXAMPLE
    .\generate-campaign-report.ps1 -StartDate "2026-08-01" -EndDate "2026-08-31" -MonthName "agosto" -Year "2026" -SheetId "abc123"
#>

param(
    [string]$StartDate = (Get-Date -Format "yyyy-MM-01"),
    [string]$EndDate = (Get-Date -Format "yyyy-MM-dd"),
    [string]$MonthName = (Get-Date -Format "MMMM" -ErrorAction Ignore),
    [string]$Year = (Get-Date -Format "yyyy"),
    [string]$SheetId = ""
)

$ErrorActionPreference = "Stop"

# Paths
$GA4_SCRIPTS = "C:\Users\ADM\Documents\WebCamProyecto\ga4-export"
$REPO_PATH = "C:\Users\ADM\Documents\WebCamProyecto\RepoLanding"
$CSV_NAME = "whatsapp_verificacion_$MonthName`_$Year.csv"
$GA4_JSON = "report_data_$MonthName`_$Year.json"
$ADS_JSON = "ads_data_$MonthName`_$Year.json"
$LOCAL_OUTPUT = Join-Path $GA4_SCRIPTS "informe-$MonthName-$Year.html"
$INFORME_DEST = Join-Path $REPO_PATH "public\informe-$MonthName-$Year.html"

Write-Host "Iniciando generacion de informe: $StartDate a $EndDate" -ForegroundColor Cyan

Push-Location $GA4_SCRIPTS

# 1. Extraer datos GA4 (clics individuales para tabla de verificacion)
Write-Host "`nPaso 1: Extrayendo clics WhatsApp (GA4)..." -ForegroundColor Yellow
node ga4-timestamps-detalle.js --desde=$StartDate --hasta=$EndDate --salida=$CSV_NAME

if (-not (Test-Path $CSV_NAME)) {
    Write-Host "No hay clics en ese rango de fechas." -ForegroundColor Yellow
    Pop-Location
    exit 0
}

# 2. Extraer datos GA4 completos (embudo, geografia, horarios, fuentes)
Write-Host "`nPaso 2: Extrayendo metricas GA4 completas..." -ForegroundColor Yellow
node ga4-full-report-data.js --desde=$StartDate --hasta=$EndDate --salida=$GA4_JSON

# 3. Extraer datos de Google Ads (opcional, si hay Sheet configurado)
$adsArg = ""
if ($SheetId -ne "") {
    Write-Host "`nPaso 3: Extrayendo datos de Google Ads (Sheet)..." -ForegroundColor Yellow
    node read-ads-sheet.js --sheetId=$SheetId --salida=$ADS_JSON
    if (Test-Path $ADS_JSON) { $adsArg = "--ads=$ADS_JSON" }
} else {
    Write-Host "`nPaso 3: Sin SheetId -> se omiten datos de Google Ads (gasto/CPA)" -ForegroundColor Yellow
}

# 4. Generar HTML completo (secciones 1,2,3,4,7,8,9 dinamicas)
Write-Host "`nPaso 4: Generando informe HTML completo..." -ForegroundColor Yellow
node build-full-report.js --ga4=$GA4_JSON --csv=$CSV_NAME $adsArg --output=$LOCAL_OUTPUT --titulo="$MonthName $Year"

Pop-Location

# 5. Copiar a repo
Write-Host "`nPaso 5: Copiando a repositorio..." -ForegroundColor Yellow
Copy-Item $LOCAL_OUTPUT $INFORME_DEST -Force
Write-Host "Copiado a: $INFORME_DEST" -ForegroundColor Green

# 6. Git commit + push
Write-Host "`nPaso 6: Commiteando cambios..." -ForegroundColor Yellow
Push-Location $REPO_PATH
git add "public/informe-$MonthName-$Year.html"
git commit -m "docs: informe campanas $MonthName $Year con tabla verificacion whatsapp"
git push
Pop-Location

# 7. Esperar a Netlify
Write-Host "`nPaso 7: Esperando redeploy de Netlify (~30s)..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# 8. Confirmar URL
$url = "https://goldmodelsstudio.com/informe-$MonthName-$Year.html"
Write-Host "`nCOMPLETADO" -ForegroundColor Green
Write-Host "Informe publicado en: $url" -ForegroundColor Cyan
Write-Host "`nProximas acciones:" -ForegroundColor Yellow
Write-Host "  1. Abre el link en browser"
Write-Host "  2. Por cada clic, busca en WhatsApp Business"
Write-Host "  3. Haz click en checkbox: [ ] -> [OK] (gestionado) o [X] (no aplica)"
