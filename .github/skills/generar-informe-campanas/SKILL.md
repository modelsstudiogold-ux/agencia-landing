---
name: generar-informe-campanas
description: "Genera informe ejecutivo de campañas Google Ads con tabla de verificación WhatsApp. Extrae datos GA4, agrupa por hora/ciudad, y publica online en goldmodelsstudio.com. Use cuando: necesites informe de campaña, revisar KPIs, verificar clics WhatsApp."
---

# Generar Informe de Campañas

Crea un reporte completo de campañas Google Ads con:
- **Resumen ejecutivo**: CPA, conversiones, gasto, CTR
- **Rendimiento por campaña**: desglose de costos y conversiones
- **Tabla interactiva**: 151+ clics con timestamp y checkbox para verificación WhatsApp
- **Análisis de horarios**: puja recomendaciones por hora
- **Recomendaciones**: acciones para optimizar próxima etapa

## Flujo

1. **Solicita fechas**: Pide rango de fechas (ej: 1-31 agosto 2026)
2. **Extrae GA4**: Ejecuta script Node.js `ga4-timestamps-detalle.js` con API de Google Analytics
3. **Genera HTML**: Construye tabla interactiva con `build-html-table.js`
4. **Publica**: Copia informe a `public/informe-[mes]-[año].html` y hace push a GitHub
5. **Netlify**: Redeploy automático en goldmodelsstudio.com

## Requisitos

- Servicio GA4: `ga4-export/` con scripts y credenciales `service-account.json`
- Propiedad GA4: 535148793
- Repositorio: `agencia-landing` en GitHub
- Netlify: Conectado a rama `master`

## Uso

```
/generar-informe-campanas
→ ¿Qué rango de fechas? (ej: 18-31 agosto 2026)
→ ✅ Generando informe...
→ 🔗 Publicado: https://goldmodelsstudio.com/informe-agosto-2026.html
```
