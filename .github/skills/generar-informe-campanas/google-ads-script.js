/**
 * Google Ads Script — Exporta métricas de campañas a Google Sheet
 *
 * INSTALACIÓN:
 * 1. En Google Ads: Herramientas y configuración > Acciones masivas > Scripts
 * 2. Crea un script nuevo, pega este código completo
 * 3. Reemplaza SHEET_URL con la URL de tu Google Sheet (crea uno vacío primero)
 * 4. Autoriza el script (pedirá permisos la primera vez)
 * 5. Ejecuta "Vista previa" para probar, luego "Ejecutar"
 * 6. Programa (Frequency): Diario, cada mañana a las 7am
 *
 * QUÉ HACE:
 * - Lee todas las campañas (activas y detenidas) con sus métricas
 * - Escribe una fila por campaña en la pestaña "CampaignData"
 * - Escribe totales combinados en la pestaña "Summary"
 * - Usa el rango de fechas configurado en la pestaña "Config" (celda B2)
 */

// ⚠️ REEMPLAZAR con la URL de tu Google Sheet
const SHEET_URL = 'https://docs.google.com/spreadsheets/d/1aVNnv1WSLV9F9pivG66gJ8QaO7zi_CTqfbbolaz5eRA/edit';

function main() {
  const sheet = SpreadsheetApp.openByUrl(SHEET_URL);

  const config = getOrCreateConfigSheet(sheet);
  const dateRange = readDateRange(config);

  const campaignRows = getCampaignData(dateRange.start, dateRange.end);
  writeCampaignData(sheet, campaignRows);
  writeSummary(sheet, campaignRows, dateRange);

  Logger.log('✅ Datos exportados: ' + campaignRows.length + ' campañas, periodo ' + dateRange.start + ' a ' + dateRange.end);
}

function getOrCreateConfigSheet(sheet) {
  let config = sheet.getSheetByName('Config');
  if (!config) {
    config = sheet.insertSheet('Config');
    config.getRange('A1').setValue('Fecha inicio (YYYYMMDD)');
    config.getRange('A2').setValue('Fecha fin (YYYYMMDD)');
    // Por defecto: desde hace 30 días hasta ayer
    const today = new Date();
    const yesterday = new Date(today.getTime() - 86400000);
    const start = new Date(today.getTime() - 30 * 86400000);
    config.getRange('B1').setValue(formatDate(start));
    config.getRange('B2').setValue(formatDate(yesterday));
  }
  return config;
}

function readDateRange(config) {
  const start = config.getRange('B1').getValue().toString().replace(/-/g, '');
  const end = config.getRange('B2').getValue().toString().replace(/-/g, '');
  return { start: start, end: end };
}

function formatDate(date) {
  return Utilities.formatDate(date, AdsApp.currentAccount().getTimeZone(), 'yyyyMMdd');
}

function getCampaignData(startDate, endDate) {
  const query = `
    SELECT
      campaign.name,
      campaign.status,
      campaign_budget.amount_micros,
      metrics.cost_micros,
      metrics.conversions,
      metrics.clicks,
      metrics.impressions,
      metrics.ctr
    FROM campaign
    WHERE segments.date BETWEEN '${formatDashed(startDate)}' AND '${formatDashed(endDate)}'
    ORDER BY metrics.cost_micros DESC
  `;

  const report = AdsApp.report(query);
  const rows = report.rows();
  const result = [];

  while (rows.hasNext()) {
    const row = rows.next();
    const costMicros = parseFloat(row['metrics.cost_micros']) || 0;
    const conversions = parseFloat(row['metrics.conversions']) || 0;
    const clicks = parseFloat(row['metrics.clicks']) || 0;
    const impressions = parseFloat(row['metrics.impressions']) || 0;
    const ctr = parseFloat(row['metrics.ctr']) || 0;
    const budgetMicros = parseFloat(row['campaign_budget.amount_micros']) || 0;

    const cost = costMicros / 1e6;
    const cpa = conversions > 0 ? cost / conversions : 0;

    result.push({
      name: row['campaign.name'],
      status: row['campaign.status'],
      budgetDiario: budgetMicros / 1e6,
      gasto: cost,
      conversiones: conversions,
      clics: clicks,
      impresiones: impressions,
      ctr: ctr * 100,
      cpa: cpa,
    });
  }

  return result;
}

function formatDashed(yyyymmdd) {
  return yyyymmdd.substring(0, 4) + '-' + yyyymmdd.substring(4, 6) + '-' + yyyymmdd.substring(6, 8);
}

function writeCampaignData(sheet, rows) {
  let data = sheet.getSheetByName('CampaignData');
  if (!data) data = sheet.insertSheet('CampaignData');
  data.clear();

  const headers = ['Campaña', 'Estado', 'Presupuesto Diario', 'Gasto', 'Conversiones', 'Clics', 'Impresiones', 'CTR %', 'CPA'];
  data.getRange(1, 1, 1, headers.length).setValues([headers]);

  if (rows.length === 0) return;

  const values = rows.map(r => [
    r.name, r.status, r.budgetDiario, r.gasto, r.conversiones, r.clics, r.impresiones, r.ctr, r.cpa,
  ]);
  data.getRange(2, 1, values.length, headers.length).setValues(values);
}

function writeSummary(sheet, rows, dateRange) {
  let summary = sheet.getSheetByName('Summary');
  if (!summary) summary = sheet.insertSheet('Summary');
  summary.clear();

  const activeRows = rows.filter(r => r.status === 'ENABLED');
  const totalGasto = activeRows.reduce((a, r) => a + r.gasto, 0);
  const totalConversiones = activeRows.reduce((a, r) => a + r.conversiones, 0);
  const totalClics = activeRows.reduce((a, r) => a + r.clics, 0);
  const totalImpresiones = activeRows.reduce((a, r) => a + r.impresiones, 0);
  const cpaCombinado = totalConversiones > 0 ? totalGasto / totalConversiones : 0;
  const ctrCombinado = totalImpresiones > 0 ? (totalClics / totalImpresiones) * 100 : 0;

  const values = [
    ['Periodo', formatDashed(dateRange.start) + ' a ' + formatDashed(dateRange.end)],
    ['Actualizado', new Date().toISOString()],
    ['Gasto Total', totalGasto],
    ['Conversiones Total', totalConversiones],
    ['CPA Combinado', cpaCombinado],
    ['CTR Combinado %', ctrCombinado],
    ['Clics Total', totalClics],
    ['Impresiones Total', totalImpresiones],
    ['Campañas Activas', activeRows.length],
  ];

  summary.getRange(1, 1, values.length, 2).setValues(values);
}
