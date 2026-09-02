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
2. **Extrae GA4 completo**: clics WhatsApp, embudo popup→clic, geografía, horarios, tabla de verificación (todo vía API, sin datos hardcodeados)
3. **Extrae Google Ads** (opcional): gasto, CPA, conversiones por campaña, vía Google Sheet alimentado por un Ads Script
4. **Genera HTML completo**: las 9 secciones se arman dinámicamente con `build-full-report.js`
5. **Publica**: Copia informe a `public/informe-[mes]-[año].html` y hace push a GitHub
6. **Netlify**: Redeploy automático en goldmodelsstudio.com

## Requisitos

- Servicio GA4: `ga4-export/` con scripts y credenciales `service-account.json`
- Propiedad GA4: 535148793
- Google Ads (opcional): Sheet + Ads Script (ver README para configuración) para gasto/CPA
- Repositorio: `agencia-landing` en GitHub
- Netlify: Conectado a rama `master`

## Uso

```
/generar-informe-campanas
→ ¿Qué rango de fechas? (ej: 18-31 agosto 2026)
→ ✅ Generando informe...
→ 🔗 Publicado: https://goldmodelsstudio.com/informe-agosto-2026.html
```
