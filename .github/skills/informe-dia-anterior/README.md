# Skill: Informe del Día Anterior

Genera **automáticamente** un informe con solo los clics WhatsApp de ayer.  
Sin preguntas. Solo ejecuta.

## Característica Principal

- ✅ Fecha automática: ayer
- ✅ Tabla interactiva con checkboxes
- ✅ Publicado en 30 segundos
- ✅ URL predictable para bookmarking

## Flujo

```
/informe-dia-anterior
↓
✅ Extrae clics de ayer automáticamente
↓
✅ Genera tabla
↓
✅ Publica
↓
🔗 https://goldmodelsstudio.com/informe-ayer-2026-09-01.html
```

## Uso

### Manual (Powershell)

```powershell
cd C:\Users\ADM\Documents\WebCamProyecto\RepoLanding\.github\skills\informe-dia-anterior
.\generate-yesterday-report.ps1
```

Sale inmediatamente sin prompts.

### En el chat

```
/informe-dia-anterior
↓
✅ COMPLETADO
🔗 https://goldmodelsstudio.com/informe-ayer-YYYY-MM-DD.html
```

## Salida

Tabla con:
- **N° de clics ayer** (ej: 34)
- **Por hora** (0-23h)
- **Por ciudad** (Bogotá, Medellín, etc.)
- **Por fuente** (Google Search, Organic, etc.)
- **Checkbox** en cada fila para marcar ☐/✓/✗

## Ideal Para

- 📱 Daily standup (8:30 AM)
- ✅ Verificación contra WhatsApp Business
- 📊 Comparación ayer vs hoy
- 🚀 Seguimiento rápido sin overhead

## URL Patrón

```
https://goldmodelsstudio.com/informe-ayer-YYYY-MM-DD.html
```

Reemplaza `YYYY-MM-DD` con la fecha de ayer automáticamente.

Ejemplo:
- Hoy: 2026-09-02 → informe-ayer-2026-09-01.html
- Hoy: 2026-09-03 → informe-ayer-2026-09-02.html

## Ver También

- [generar-informe-campanas](../generar-informe-campanas/SKILL.md) — Informe completo con rango de fechas
