#!/usr/bin/env node

/**
 * GA4 Export — Timestamps con Detalle
 * 
 * Extrae cada clic de WhatsApp desde GA4 con precision de minuto
 * Outputs: CSV con fecha, hora, minuto, ciudad, país, dispositivo, fuente, campaña
 * 
 * Uso:
 *   node ga4-timestamps-detalle.js --startDate 2026-08-01 --endDate 2026-08-31
 */

const { BetaAnalyticsDataClient } = require('@google-analytics/data');
const fs = require('fs');
const path = require('path');

// Parse arguments
const args = process.argv.slice(2);
let startDate = '2026-08-01';
let endDate = '2026-08-31';

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--startDate') startDate = args[++i];
  if (args[i] === '--endDate') endDate = args[++i];
}

const client = new BetaAnalyticsDataClient({
  keyFilename: path.join(__dirname, 'service-account.json'),
});

const PROPERTY_ID = '535148793';

async function runReport() {
  try {
    console.log(`📊 Extrayendo clics WhatsApp de ${startDate} a ${endDate}...`);

    const response = await client.runReport({
      property: `properties/${PROPERTY_ID}`,
      dateRanges: [
        {
          startDate: startDate,
          endDate: endDate,
        },
      ],
      dimensions: [
        { name: 'date' },
        { name: 'hour' },
        { name: 'minute' },
        { name: 'city' },
        { name: 'country' },
        { name: 'deviceCategory' },
        { name: 'sessionSourceMedium' },
        { name: 'sessionCampaignName' },
      ],
      metrics: [
        { name: 'eventCount' },
        { name: 'totalUsers' },
      ],
      dimensionFilter: {
        filter: {
          fieldName: 'eventName',
          stringFilter: {
            matchType: 'EXACT',
            value: 'click_whatsapp',
          },
        },
      },
      orderBys: [
        {
          dimension: { orderType: 'ALPHANUMERIC', dimensionName: 'date' },
        },
        {
          dimension: { orderType: 'NUMERIC', dimensionName: 'hour' },
        },
        {
          dimension: { orderType: 'NUMERIC', dimensionName: 'minute' },
        },
      ],
      limit: 10000,
    });

    // Build CSV
    let csv = 'Fecha,Hora:Minuto (Colombia),Ciudad,País,Dispositivo,Fuente,Campaña,Gestionado en WhatsApp\n';
    let totalClicks = 0;

    if (response.rows && response.rows.length > 0) {
      for (const row of response.rows) {
        const [date, hour, minute, city, country, device, source, campaign] = row.dimensionValues.map(
          (d) => d.value
        );
        const [eventCount] = row.metricValues.map((m) => parseInt(m.value, 10));

        // Expand rows por eventCount (si hay más de 1 clic en esa hora/minuto)
        for (let i = 0; i < eventCount; i++) {
          const dateObj = new Date(date.slice(0, 4), parseInt(date.slice(4, 6)) - 1, date.slice(6, 8));
          const formattedDate = dateObj.toLocaleDateString('es-CO', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
          const timeStr = `${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`;

          csv += `${formattedDate},${timeStr},${city || 'N/A'},${country || 'N/A'},${device || 'N/A'},${source || 'N/A'},${campaign || 'N/A'},\n`;
          totalClicks++;
        }
      }
    }

    const filename = `whatsapp_verificacion_${startDate.replace(/-/g, '_')}_${endDate.replace(/-/g, '_')}.csv`;
    fs.writeFileSync(filename, csv, 'utf-8');

    console.log(`✅ Generado: ${filename}`);
    console.log(`📊 Total clics: ${totalClicks}`);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

runReport();
