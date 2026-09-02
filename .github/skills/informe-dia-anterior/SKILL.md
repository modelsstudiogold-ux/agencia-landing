---
name: informe-dia-anterior
description: "Genera informe rápido del día anterior (ayer). Extrae clics WhatsApp de GA4 y publica tabla interactiva en 30 segundos. Use cuando: necesites verificación diaria, comparar ayer vs hoy, seguimiento rápido."
---

# Informe del Día Anterior

Genera automáticamente un reporte **solo para ayer**, sin prompts:

- Fecha automática: Usa `date-1` (ayer)
- Tabla interactiva: clics con checkbox para gestionado/no gestionado
- Publicación rápida: URL predictable `informe-ayer-[fecha].html`

## Flujo Rápido

```
/informe-dia-anterior
↓
✅ Extrayendo clics de ayer...
↓
✅ Generando tabla...
↓
🔗 Publicado: https://goldmodelsstudio.com/informe-ayer-2026-09-01.html
```

Sin preguntas. Solo ejecuta.

## Ejemplo de Salida

Tabla con:
- **Clics ayer**: 34 clics totales
- **Por hora**: Desglose 0-23h
- **Por ciudad**: Bogotá (28), Medellín (4), Cali (2)
- **Por fuente**: Google Search (30), Organic (4)
- **Checkbox**: Cada fila clickeable para marcar ☐/✓/✗

Ideal para daily standup y seguimiento WhatsApp Business.
