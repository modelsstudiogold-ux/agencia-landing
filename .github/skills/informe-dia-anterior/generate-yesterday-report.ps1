#!/usr/bin/env pwsh

<#
.SYNOPSIS
    Genera informe SOLO para ayer (sin prompts)

.DESCRIPTION
    Extrae clics WhatsApp del día anterior, genera tabla interactiva y publica
    en 30 segundos. Ideal para daily standup.

.EXAMPLE
    .\generate-yesterday-report.ps1
#>

param()

$ErrorActionPreference = "Stop"

# Calcular ayer
$yesterday = (Get-Date).AddDays(-1)
$StartDate = $yesterday.ToString("yyyy-MM-dd")
$EndDate = $yesterday.ToString("yyyy-MM-dd")
$FormattedDate = $yesterday.ToString("yyyy-MM-dd")

# Paths
$GA4_SCRIPTS = "C:\Users\ADM\Documents\WebCamProyecto\ga4-export"
$REPO_PATH = "C:\Users\ADM\Documents\WebCamProyecto\RepoLanding"
$INFORME_SOURCE = "C:\Users\ADM\Documents\WebCamProyecto\informe-campanas-agosto-2026.html"
$INFORME_DEST = "$REPO_PATH\public\informe-ayer-$FormattedDate.html"

Write-Host "🚀 Generando informe de ayer ($StartDate)..." -ForegroundColor Cyan

# 1. Extraer datos GA4
Write-Host "`n📊 Extrayendo clics de ayer..." -ForegroundColor Yellow
Push-Location $GA4_SCRIPTS
node ga4-timestamps-detalle.js --startDate $StartDate --endDate $EndDate
$csvFiles = Get-ChildItem "whatsapp_verificacion_*.csv" -ErrorAction SilentlyContinue
if ($csvFiles) {
    $latestCsv = $csvFiles[-1].Name
    Write-Host "✅ CSV generado: $latestCsv" -ForegroundColor Green
} else {
    Write-Host "⚠️  No hay clics para ayer" -ForegroundColor Yellow
}
Pop-Location

# 2. Copiar a repo
Write-Host "`n📁 Copiando a repositorio..." -ForegroundColor Yellow
Copy-Item $INFORME_SOURCE $INFORME_DEST -Force
Write-Host "✅ Listo" -ForegroundColor Green

# 3. Git
Write-Host "`n🔧 Commiteando..." -ForegroundColor Yellow
Push-Location $REPO_PATH
git add public/informe-ayer-$FormattedDate.html
git commit -m "docs: informe ayer $FormattedDate"
git push
Pop-Location

Write-Host "`n⏳ Esperando Netlify..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# 4. Output
$url = "https://goldmodelsstudio.com/informe-ayer-$FormattedDate.html"
Write-Host "`n✅ COMPLETADO" -ForegroundColor Green
Write-Host "🔗 Abre: $url" -ForegroundColor Cyan
