# Skill: Generar Informe de Campañas

Crea un informe ejecutivo completo de campañas Google Ads con tabla interactiva de verificación WhatsApp.

## Flujo

```
/generar-informe-campanas
↓
📊 "¿Qué fechas? (ej: 1-31 agosto 2026)"
↓
✅ Extrae GA4 (151+ clics)
↓
✅ Genera tabla HTML interactiva
↓
✅ Publica en goldmodelsstudio.com
↓
🔗 https://goldmodelsstudio.com/informe-agosto-2026.html
```

## Contenido del Informe

1. **Resumen Ejecutivo** — KPIs (CPA, conversiones, gasto, CTR)
2. **Rendimiento por Campaña** — Desglose de costos
3. **Horarios Pico** — Recomendaciones de puja por hora
4. **Tabla de Verificación** — 151+ filas con:
   - Fecha y hora (Colombia)
   - Ciudad, país, dispositivo, fuente, campaña
   - Checkbox interactivo: ☐ (sin verificar) → ✓ (gestionado) → ✗ (no aplica)

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
→ Automático: extrae → genera → publica
```

## Requisitos

- **Node.js**: v14+
- **GA4 API**: `google-analytics/data` package
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
| `Git push falla` | Sin acceso al repo | Verificar credenciales de GitHub |
| `Netlify no actualiza` | Deploy en progreso | Esperar 1-2 minutos y recargar URL |

## Resultado

URL predictable: `https://goldmodelsstudio.com/informe-[mes]-[año].html`

Ejemplo: `https://goldmodelsstudio.com/informe-agosto-2026.html`

## Siguiente

Usa **[informe-dia-anterior](../informe-dia-anterior/SKILL.md)** para un reporte diario rápido.
