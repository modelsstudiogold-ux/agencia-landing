#!/usr/bin/env node

/**
 * Build HTML Table
 * 
 * Lee CSV de clics WhatsApp y embebe tabla interactiva en template HTML
 * 
 * Uso:
 *   node build-html-table.js --csv whatsapp_verificacion_2026_08_01_2026_08_31.csv --output informe-agosto-2026.html
 */

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
let csvFile = 'whatsapp_verificacion.csv';
let outputFile = 'informe-campanas.html';

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--csv') csvFile = args[++i];
  if (args[i] === '--output') outputFile = args[++i];
}

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        current += '"';
        i++;
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === ',' && !insideQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
}

function buildTable() {
  if (!fs.existsSync(csvFile)) {
    console.error(`❌ Archivo CSV no encontrado: ${csvFile}`);
    process.exit(1);
  }

  const csv = fs.readFileSync(csvFile, 'utf-8');
  const lines = csv.trim().split('\n');

  // Skip header
  const rows = lines.slice(1);

  let htmlTable = `
    <table class="verificacion-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Fecha</th>
          <th>Hora (Col)</th>
          <th>Ciudad</th>
          <th>País</th>
          <th>Dispositivo</th>
          <th>Fuente</th>
          <th>Campaña</th>
          <th>Gestionado</th>
        </tr>
      </thead>
      <tbody>
`;

  for (let i = 0; i < rows.length; i++) {
    const cols = parseCSVLine(rows[i]);
    if (cols.length < 8) continue;

    const [fecha, hora, ciudad, pais, dispositivo, fuente, campana, gestionado] = cols;
    htmlTable += `
        <tr data-index="${i + 1}">
          <td>${i + 1}</td>
          <td>${fecha}</td>
          <td>${hora}</td>
          <td>${ciudad}</td>
          <td>${pais}</td>
          <td>${dispositivo}</td>
          <td>${fuente}</td>
          <td>${campana}</td>
          <td onclick="toggleCheck(this)" class="checkbox-cell">☐</td>
        </tr>
`;
  }

  htmlTable += `
      </tbody>
    </table>

    <script>
      function toggleCheck(td) {
        const states = ['☐', '✓', '✗'];
        let current = td.textContent.trim();
        let index = states.indexOf(current);
        let next = states[(index + 1) % states.length];

        td.textContent = next;
        td.parentRow = td.parentElement;

        if (next === '✓') {
          td.parentElement.style.backgroundColor = '#d4edda';
          td.style.color = 'green';
        } else if (next === '✗') {
          td.parentElement.style.backgroundColor = '#f8d7da';
          td.style.color = 'red';
        } else {
          td.parentElement.style.backgroundColor = '';
          td.style.color = '';
        }
      }
    </script>

    <style>
      .verificacion-table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 20px;
        font-size: 12px;
      }

      .verificacion-table th {
        background-color: #1a3a3a;
        color: white;
        padding: 10px;
        text-align: left;
        font-weight: bold;
      }

      .verificacion-table td {
        padding: 8px;
        border-bottom: 1px solid #ddd;
      }

      .verificacion-table tbody tr:hover {
        background-color: #f5f5f5;
      }

      .checkbox-cell {
        cursor: pointer;
        text-align: center;
        font-weight: bold;
        user-select: none;
      }

      .checkbox-cell:hover {
        text-decoration: underline;
      }
    </style>
`;

  console.log(`✅ Tabla HTML generada con ${rows.length} filas`);
  return htmlTable;
}

const tableHtml = buildTable();

// Aquí iría lógica para embeber en template o guardar como archivo
console.log(tableHtml);
