#!/usr/bin/env pwsh

<#
.SYNOPSIS
    Genera informe SOLO para ayer (sin prompts)

.DESCRIPTION
    Extrae clics WhatsApp del dia anterior, genera tabla interactiva y publica
    en 30 segundos. Ideal para daily standup.

.PARAMETER SheetId
    ID del Google Sheet con metricas de Google Ads (opcional).

.EXAMPLE
    .\generate-yesterday-report.ps1
    .\generate-yesterday-report.ps1 -SheetId "abc123"
#>

param(
    [string]$SheetId = ""
)

$ErrorActionPreference = "Stop"

# Calcular ayer
$yesterday = (Get-Date).AddDays(-1)
$Desde = $yesterday.ToString("yyyy-MM-dd")
$Hasta = $yesterday.ToString("yyyy-MM-dd")
$FormattedDate = $yesterday.ToString("yyyy-MM-dd")
$PeriodoLabel = $yesterday.ToString("dd MMM yyyy")

# Paths
$GA4_SCRIPTS = "C:\Users\ADM\Documents\WebCamProyecto\ga4-export"
$REPO_PATH = "C:\Users\ADM\Documents\WebCamProyecto\RepoLanding"
$CSV_NAME = "whatsapp_ayer_$($FormattedDate.Replace('-','')).csv"
$GA4_JSON = "report_data_ayer_$($FormattedDate.Replace('-','')).json"
$ADS_JSON = "ads_data_ayer_$($FormattedDate.Replace('-','')).json"
$LOCAL_OUTPUT = Join-Path $GA4_SCRIPTS "informe-ayer-$FormattedDate.html"
$INFORME_DEST = Join-Path $REPO_PATH "public\informe-ayer-$FormattedDate.html"

Write-Host "Generando informe de ayer ($Desde)..." -ForegroundColor Cyan

Push-Location $GA4_SCRIPTS

# 1. Extraer clics individuales (tabla de verificacion)
Write-Host "`nExtrayendo clics de ayer..." -ForegroundColor Yellow
node ga4-timestamps-detalle.js --desde=$Desde --hasta=$Hasta --salida=$CSV_NAME

if (-not (Test-Path $CSV_NAME)) {
    Write-Host "No hay clics para ayer, no se genera informe." -ForegroundColor Yellow
    Pop-Location
    exit 0
}

# 2. Extraer metricas GA4 completas (embudo, geografia, horarios, fuentes)
Write-Host "`nExtrayendo metricas GA4 completas..." -ForegroundColor Yellow
node ga4-full-report-data.js --desde=$Desde --hasta=$Hasta --salida=$GA4_JSON

# 3. Datos de Google Ads (opcional)
$adsArg = ""
if ($SheetId -ne "") {
    Write-Host "`nExtrayendo datos de Google Ads..." -ForegroundColor Yellow
    node read-ads-sheet.js --sheetId=$SheetId --salida=$ADS_JSON
    if (Test-Path $ADS_JSON) { $adsArg = "--ads=$ADS_JSON" }
}

# 4. Generar HTML completo
Write-Host "`nGenerando informe completo..." -ForegroundColor Yellow
node build-full-report.js --ga4=$GA4_JSON --csv=$CSV_NAME $adsArg --output=$LOCAL_OUTPUT --titulo="$PeriodoLabel"

Pop-Location

# 5. Copiar a repo
Write-Host "`nCopiando a repositorio..." -ForegroundColor Yellow
Copy-Item $LOCAL_OUTPUT $INFORME_DEST -Force
Write-Host "Listo" -ForegroundColor Green

# 6. Git
Write-Host "`nCommiteando..." -ForegroundColor Yellow
Push-Location $REPO_PATH
git add "public/informe-ayer-$FormattedDate.html"
git commit -m "docs: informe ayer $FormattedDate"
git push
Pop-Location

Write-Host "`nEsperando Netlify..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# 4. Output
$url = "https://goldmodelsstudio.com/informe-ayer-$FormattedDate.html"
Write-Host "`nCOMPLETADO" -ForegroundColor Green
Write-Host "Abre: $url" -ForegroundColor Cyan
