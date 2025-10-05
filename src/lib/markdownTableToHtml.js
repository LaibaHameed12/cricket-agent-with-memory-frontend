// src/lib/markdownTableToHtml.js
/**
 * Convert a simple markdown table (pipe-separated) into HTML table.
 * Expects the markdown produced by your backend (first line header, second line ---).
 *
 * Safe, minimal parser (no external deps).
 */
export function markdownTableToHtml(md) {
  if (!md || typeof md !== 'string') return md;

  const lines = md.trim().split('\n').map(l => l.trim()).filter(Boolean);
  if (lines.length < 2) return md;

  // quick test: second line should contain --- separators
  if (!/^\|?[-\s|:]+$/.test(lines[1])) return md;

  const headerLine = lines[0];
  const headerCells = headerLine.split('|').map(s => s.trim()).filter(Boolean);

  const rows = [];
  for (let i = 2; i < lines.length; i++) {
    const rowCells = lines[i].split('|').map(s => s.trim()).filter(Boolean);
    if (rowCells.length === 0) continue;
    rows.push(rowCells);
  }

  // produce HTML with modern styling
  let html = '<div class="overflow-x-auto custom-table-scroll"><style>.custom-table-scroll::-webkit-scrollbar{height:6px}.custom-table-scroll::-webkit-scrollbar-track{background:rgba(51,65,85,0.3)}.custom-table-scroll::-webkit-scrollbar-thumb{background:linear-gradient(to right,#10b981,#06b6d4);border-radius:3px}.custom-table-scroll::-webkit-scrollbar-thumb:hover{background:linear-gradient(to right,#059669,#0891b2)}</style>';
  html += '<table class="min-w-full text-sm border-collapse bg-slate-900/40 backdrop-blur-sm" style="clip-path: polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)">';
  html += '<thead><tr class="bg-gradient-to-r from-emerald-500/20 to-cyan-500/20">';
  headerCells.forEach((h) => {
    html += `<th class="px-4 py-3 text-left font-bold text-emerald-300 border-b border-slate-700/50">${escapeHtml(h)}</th>`;
  });
  html += '</tr></thead><tbody>';
  rows.forEach((r, idx) => {
    html += `<tr class="hover:bg-slate-800/50 transition-colors duration-150 ${idx % 2 === 0 ? 'bg-slate-800/20' : ''}">`;
    r.forEach((c) => {
      html += `<td class="px-4 py-3 align-top border-b border-slate-800/50 text-slate-200">${escapeHtml(c)}</td>`;
    });
    html += '</tr>';
  });
  html += '</tbody></table></div>';
  return html;
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}