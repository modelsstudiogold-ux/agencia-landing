# Skill: Generar Informe de Campañas

Crea un informe ejecutivo completo de campañas con tabla interactiva de verificación WhatsApp.
Todas las métricas (GA4 y, opcionalmente, Google Ads) se obtienen **en vivo vía API** en cada
generación — no hay datos hardcodeados que se queden desactualizados.

## Flujo

```
/generar-informe-campanas
↓
📊 "¿Qué fechas? (ej: 1-31 agosto 2026)"
↓
✅ Extrae GA4 completo (clics WhatsApp, embudo, geografía, horarios, tabla de verificación)
↓
✅ Extrae Google Ads (gasto/CPA/conversiones) — si hay Sheet configurado
↓
✅ Genera HTML completo (9 secciones)
↓
✅ Publica en goldmodelsstudio.com
↓
🔗 https://goldmodelsstudio.com/informe-agosto-2026.html
```

## Contenido del Informe (todo dinámico vía API)

1. **Resumen Ejecutivo** — Gasto, CPA, conversiones, CTR (requiere Ads Sheet)
2. **Rendimiento por Campaña** — Desglose de costos por campaña (requiere Ads Sheet)
3. **Clics WhatsApp (GA4)** — Total, usuarios únicos, distribución diaria
4. **Embudo de Conversión** — Visitas → Popup → Clic WhatsApp
5. **Detalle por Fuente/Campaña** — Desde GA4
6. **Horarios Pico** — Usuarios únicos por hora del día
7. **Tabla de Verificación** — Una fila por clic con:
   - Fecha y hora (Colombia)
   - Ciudad, país, dispositivo, fuente, campaña
   - Checkbox interactivo: ☐ (sin verificar) → ✓ (gestionado) → ✗ (no aplica)

## Archivos

- `SKILL.md` — Documentación
- `README.md` — Guía de uso (este archivo)
- `google-ads-script.js` — Script para pegar en Google Ads (exporta métricas a un Sheet)
- `generate-campaign-report.ps1` — Orquesta: extrae GA4 → extrae Ads (opcional) → genera → publica

Los scripts de extracción/generación (`ga4-timestamps-detalle.js`, `ga4-full-report-data.js`,
`read-ads-sheet.js`, `build-full-report.js`, `report-template-base.html`) viven en
`C:\Users\ADM\Documents\WebCamProyecto\ga4-export\` (carpeta de trabajo local, no versionada en este repo).

## Configurar datos de Google Ads (opcional, recomendado)

Sin esto, el informe se genera igual pero **sin** la sección de gasto/CPA/conversiones de Ads
(solo con datos de GA4: clics WhatsApp, embudo, geografía, horarios).

1. Crea un Google Sheet vacío nuevo → copia su ID (parte de la URL entre `/d/` y `/edit`)
2. En Google Ads: **Herramientas y configuración → Acciones masivas → Scripts**
3. Crea un script nuevo, pega el contenido de `google-ads-script.js`
4. Reemplaza `SHEET_URL` con la URL de tu Sheet
5. Autoriza el script (primera vez) → Ejecuta "Vista previa" para probar
6. Programa: **Frecuencia diaria**, por ejemplo 7:00 AM
7. Comparte el Sheet con el email de la service account (ver `service-account.json` → `client_email`) como **Lector**
8. Pasa el `-SheetId` al generar el informe:
   ```powershell
   .\generate-campaign-report.ps1 -StartDate "2026-08-01" -EndDate "2026-08-31" -MonthName "agosto" -Year "2026" -SheetId "TU_SHEET_ID"
   ```

## Uso

### Manual (Powershell)

```powershell
cd C:\Users\ADM\Documents\WebCamProyecto\RepoLanding\.github\skills\generar-informe-campanas
.\generate-campaign-report.ps1 -StartDate "2026-08-01" -EndDate "2026-08-31" -MonthName "agosto" -Year "2026"
```

### En el chat (cuando el skill esté registrado)

```
/generar-informe-campanas
→ Selecciona rango de fechas
→ Automático: extrae GA4 (+ Ads si hay Sheet) → genera → publica
```

## Requisitos

- **Node.js**: v14+
- **GA4 API**: `@google-analytics/data` + `googleapis` (para Sheets)
- **Service Account**: `ga4-export/service-account.json` con credenciales
- **GA4 Property**: 535148793
- **Git + GitHub**: Repositorio `agencia-landing` sincronizado
- **Netlify**: Deployado en rama `master`

## Archivos

- `SKILL.md` — Documentación (este)
- `ga4-timestamps-detalle.js` — Extrae clics de GA4 con precision de minuto
- `build-html-table.js` — Convierte CSV a tabla HTML interactiva
- `generate-campaign-report.ps1` — Orquesta todo (extrae → genera → publica)

## Troubleshooting

| Error | Causa | Solución |
|-------|-------|----------|
| `PERMISSION_DENIED` | GA4 API no habilitado | Verificar service account en GA4 property |
| `CSV no encontrado` | Script GA4 falló | Verificar `service-account.json` y GA4 property ID |
| `No hay datos de campañas en el Sheet` | Ads Script no corrió aún | Ejecutar manualmente el script en Ads UI una vez |
| `Git push falla` | Sin acceso al repo | Verificar credenciales de GitHub |
| `Netlify no actualiza` | Deploy en progreso | Esperar 1-2 minutos y recargar URL |

## Resultado

URL predictable: `https://goldmodelsstudio.com/informe-[mes]-[año].html`

Ejemplo: `https://goldmodelsstudio.com/informe-agosto-2026.html`

## Siguiente

Usa **[informe-dia-anterior](../informe-dia-anterior/SKILL.md)** para un reporte diario rápido.
