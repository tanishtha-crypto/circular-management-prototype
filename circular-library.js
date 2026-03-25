/**
 * circular-library.js — CMS Circular Management System
 * Renders the Circular Library with search, filters, PDF viewer, and detail view.
 */

let libFilter = { search: '', regulator: '', type: '', risk: '' };

/** Entry point */
function renderCircularLibrary(highlightId) {
  const area = document.getElementById('content-area');
  area.innerHTML = buildLibraryHTML();
  initLibraryListeners();
  renderCircularTable();
  injectPDFViewerStyles();
  if (highlightId) {
    setTimeout(() => openCircularScreen(highlightId), 100);
  }
}

/* ================================================================
   INJECT PDF VIEWER STYLES
   ================================================================ */
function injectPDFViewerStyles() {
  if (document.getElementById('pdf-viewer-styles')) return;
  const style = document.createElement('style');
  style.id = 'pdf-viewer-styles';
  style.textContent = `
    #pdf-viewer-overlay {
      position: fixed; inset: 0;
      background: rgba(10, 15, 28, 0.75);
      backdrop-filter: blur(4px);
      z-index: 9000;
      display: flex; align-items: center; justify-content: center;
      animation: pdfFadeIn 0.2s ease;
    }
    @keyframes pdfFadeIn { from{opacity:0} to{opacity:1} }
    #pdf-viewer-box {
      background: #1e293b; border-radius: 16px;
      width: min(92vw, 1000px); height: min(92vh, 860px);
      display: flex; flex-direction: column;
      box-shadow: 0 32px 80px rgba(0,0,0,0.5);
      overflow: hidden;
      animation: pdfSlideUp 0.25s ease;
    }
    @keyframes pdfSlideUp { from{transform:translateY(20px);opacity:0} to{transform:translateY(0);opacity:1} }
    #pdf-viewer-header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 14px 20px; border-bottom: 1px solid rgba(255,255,255,0.08);
      background: #0f172a; flex-shrink: 0;
    }
    .pdf-viewer-title { display: flex; align-items: center; gap: 10px; }
    .pdf-icon-badge {
      width: 32px; height: 32px;
      background: linear-gradient(135deg, #ef4444, #dc2626);
      border-radius: 8px; display: flex; align-items: center; justify-content: center;
      font-size: 11px; color: #fff; font-weight: 800;
      font-family: 'DM Mono', monospace; flex-shrink: 0;
    }
    .pdf-title-text .pdf-doc-name { font-size: 14px; font-weight: 700; color: #f1f5f9; }
    .pdf-title-text .pdf-doc-meta { font-size: 11px; color: #64748b; margin-top: 1px; }
    .pdf-viewer-actions { display: flex; align-items: center; gap: 8px; }
    .pdf-action-btn {
      display: flex; align-items: center; gap: 6px;
      padding: 7px 14px; border-radius: 8px;
      border: 1px solid rgba(255,255,255,0.1);
      background: rgba(255,255,255,0.06); color: #94a3b8;
      font-family: inherit; font-size: 12px; font-weight: 600;
      cursor: pointer; transition: all 0.15s;
    }
    .pdf-action-btn:hover { background: rgba(255,255,255,0.1); color: #f1f5f9; }
    .pdf-close-btn {
      width: 32px; height: 32px; border-radius: 8px;
      border: 1px solid rgba(255,255,255,0.1);
      background: rgba(255,255,255,0.06); color: #94a3b8;
      font-size: 16px; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      transition: all 0.15s;
    }
    .pdf-close-btn:hover { background: #ef4444; color: #fff; border-color: #ef4444; }
    #pdf-viewer-frame { flex: 1; border: none; background: #374151; width: 100%; }

    .circ-action-btn {
      width: 30px; height: 30px; border-radius: 7px;
      border: 1px solid var(--border, #e2e8f0);
      background: #fff; cursor: pointer;
      display: inline-flex; align-items: center; justify-content: center;
      font-size: 14px; transition: all 0.15s;
      color: var(--text-secondary, #64748b);
    }
    .circ-action-btn:hover {
      background: var(--accent-light, #eef2ff);
      border-color: var(--accent, #6366f1);
      color: var(--accent, #6366f1);
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(99,102,241,0.15);
    }
    .circ-action-btn.download:hover {
      background: #f0fdf4; border-color: #22c55e; color: #16a34a;
      box-shadow: 0 2px 8px rgba(34,197,94,0.15);
    }
    .circ-action-cell { display: flex; gap: 6px; align-items: center; }
    .cms-toast {
      position: fixed; bottom: 24px; right: 24px; z-index: 9999;
      background: #1e293b; color: #fff;
      padding: 11px 18px; border-radius: 10px;
      font-size: 13px; font-weight: 600;
      box-shadow: 0 6px 24px rgba(0,0,0,0.2);
      display: flex; align-items: center; gap: 8px;
      animation: pdfFadeIn 0.2s ease;
    }
  `;
  document.head.appendChild(style);
}

/* ================================================================
   BUILD LIBRARY HTML
   ================================================================ */
function buildLibraryHTML() {
  return `
  <div class="fade-in">

    <div style="margin-bottom:20px">
      <h2 style="font-size:20px;font-weight:800;color:var(--text-primary);margin-bottom:4px">Circular Library</h2>
      <p style="font-size:13px;color:var(--text-secondary)">Browse, search and review all regulatory circulars issued to your organisation.</p>
    </div>

    <!-- TOOLBAR -->
    <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:16px;
      padding:12px 16px;background:#fff;border:1px solid var(--border);border-radius:10px">

      <div style="position:relative;flex:1;min-width:220px;max-width:320px">
        <span style="position:absolute;left:10px;top:50%;transform:translateY(-50%);color:var(--text-muted);font-size:14px;pointer-events:none">⌕</span>
        <input type="text" class="form-control" id="lib-search"
          placeholder="Search by title, ID or regulator…"
          style="padding-left:30px;width:100%"/>
      </div>

      <select class="form-control" id="lib-filter-regulator" style="min-width:130px">
        <option value="">All Regulators</option>
        <option>RBI</option><option>SEBI</option><option>MeitY</option><option>IRDAI</option>
      </select>

      <select class="form-control" id="lib-filter-type" style="min-width:120px">
        <option value="">All Types</option>
        <option>Master</option><option>Regular</option>
      </select>

      <select class="form-control" id="lib-filter-risk" style="min-width:130px">
        <option value="">All Risk Levels</option>
        <option>High</option><option>Medium</option><option>Low</option>
      </select>

      <div style="margin-left:auto;display:flex;gap:8px;align-items:center">
        <span id="lib-count" style="font-size:12px;color:var(--text-muted);white-space:nowrap"></span>
        <button class="btn btn-ghost btn-sm" id="lib-clear-filters"
          style="font-size:12px;white-space:nowrap">✕ Clear</button>
      </div>
    </div>

    <!-- TABLE CARD -->
    <div style="border-radius:12px;overflow:hidden;border:1px solid var(--border);background:#fff">
      <div style="display:flex;align-items:center;justify-content:space-between;
        padding:14px 18px;background:#fafbff;border-bottom:1px solid var(--border)">
        <div>
          <div style="font-size:14px;font-weight:800;color:var(--text-primary)">Regulatory Circulars</div>
          <div style="font-size:12px;color:var(--text-muted);margin-top:2px">Click any row to view full details · Use icons to preview or download</div>
        </div>
      </div>
      <div style="overflow-x:auto">
        <table style="width:100%;border-collapse:collapse">
          <thead>
            <tr style="background:#f8fafc">
              ${['Circular ID','Title','Regulator','Type','Issued','Effective','Due Date','Departments','View Circular']
                .map((h,i) => `<th style="padding:10px 14px;text-align:${i===8?'center':'left'};
                  font-size:10.5px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;
                  color:var(--text-muted);border-bottom:1px solid var(--border);white-space:nowrap">${h}</th>`)
                .join('')}
            </tr>
          </thead>
          <tbody id="lib-table-body"></tbody>
        </table>
      </div>
    </div>
  </div>
  `;
}

/* ================================================================
   TABLE RENDER
   ================================================================ */
function renderCircularTable() {
  const tbody = document.getElementById('lib-table-body');
  if (!tbody) return;

  let circulars = [...CMS_DATA.circulars];

  if (libFilter.search) {
    const s = libFilter.search.toLowerCase();
    circulars = circulars.filter(c =>
      c.id.toLowerCase().includes(s) ||
      c.title.toLowerCase().includes(s) ||
      c.regulator.toLowerCase().includes(s)
    );
  }
  if (libFilter.regulator) circulars = circulars.filter(c => c.regulator === libFilter.regulator);
  if (libFilter.type)      circulars = circulars.filter(c => c.type === libFilter.type);
  if (libFilter.risk)      circulars = circulars.filter(c => c.risk === libFilter.risk);

  const countEl = document.getElementById('lib-count');
  if (countEl) countEl.textContent = `${circulars.length} of ${CMS_DATA.circulars.length} circulars`;

  if (circulars.length === 0) {
    tbody.innerHTML = `
      <tr><td colspan="9" style="text-align:center;padding:52px 24px">
        <div style="font-size:32px;margin-bottom:10px">🔍</div>
        <div style="font-size:15px;font-weight:700;color:var(--text-primary);margin-bottom:4px">No circulars found</div>
        <div style="font-size:13px;color:var(--text-muted)">Try adjusting your search or filter criteria.</div>
      </td></tr>`;
    return;
  }

  // PDF map — extend as you add more circulars with real PDFs
  const pdfMap = {
    'CIRC-2024-001': 'RBI_Master_Circular.pdf',
    'CIRC-2024-002': 'RBI_Master_Circular.pdf',
    'CIRC-2024-003': 'RBI_Master_Circular.pdf',
  };

  tbody.innerHTML = circulars.map(c => {
    const depts = c.departments
      .map(d => `<span class="task-dept-chip" style="margin:1px;font-size:11px">${d}</span>`)
      .join('');
    const typeStyle = c.type === 'Master'
      ? 'background:#ede9fe;color:#5b21b6'
      : 'background:#f0fdf4;color:#065f46';
    const pdfFile = pdfMap[c.id] || 'RBI_Master_Circular.pdf';
    const safeTitleAttr = c.title.replace(/'/g, "\\'");

    return `
    <tr style="border-bottom:1px solid #f4f5f8;cursor:pointer;transition:background .12s"
        onmouseover="this.style.background='#f5f6ff'"
        onmouseout="this.style.background=''"
        onclick="openCircularScreen('${c.id}')">

      <td style="padding:12px 14px" onclick="event.stopPropagation()">
  <span style="font-family:'DM Mono',monospace;font-size:11px;font-weight:700;
    background:#eef2ff;color:#4338ca;border:1px solid #c7d2fe;
    padding:3px 8px;border-radius:5px;white-space:nowrap;cursor:pointer;
    "
    onclick="openDraftReviewForCircular('${c.id}')"
    title="Open in Draft Review">${c.id}</span>
</td>

      <td style="padding:12px 14px;max-width:240px">
        <div style="font-size:13.5px;font-weight:600;color:var(--text-primary);
          white-space:nowrap;overflow:hidden;text-overflow:ellipsis" title="${c.title}">${c.title}</div>
        <div style="font-size:11px;color:${c.risk==='High'?'#dc2626':c.risk==='Medium'?'#d97706':'#059669'};font-weight:600;margin-top:2px">
          ${c.risk ? c.risk + ' Risk' : ''}
        </div>
      </td>

      <td style="padding:12px 14px">
        <div style="display:flex;align-items:center;gap:6px">
          <span style="width:6px;height:6px;border-radius:50%;background:var(--accent);flex-shrink:0"></span>
          <span style="font-size:13px;font-weight:600">${c.regulator}</span>
        </div>
      </td>

      <td style="padding:12px 14px">
        <span style="padding:3px 10px;border-radius:99px;font-size:11px;font-weight:700;${typeStyle}">${c.type}</span>
      </td>

      <td style="padding:12px 14px;font-size:12.5px;color:var(--text-secondary);white-space:nowrap">
        ${formatDate(c.issuedDate)}
      </td>

      <td style="padding:12px 14px;font-size:12.5px;color:var(--text-secondary);white-space:nowrap">
        ${formatDate(c.effectiveDate)}
      </td>

      <td style="padding:12px 14px;white-space:nowrap">
        ${dueDateBadge(c.dueDate)}
      </td>

      <td style="padding:12px 14px;max-width:200px">${depts}</td>

      <td style="padding:12px 14px" onclick="event.stopPropagation()">
        <div class="circ-action-cell" style="justify-content:center">
          <button class="circ-action-btn" title="Preview circular document"
            onclick="openPDFViewer('${pdfFile}','${c.id}','${safeTitleAttr}')">👁</button>
          <button class="circ-action-btn download" title="Download circular document"
            onclick="dummyDownload('${c.id}')">⬇</button>
        </div>
      </td>

    </tr>`;
  }).join('');
}

/* ================================================================
   DUE DATE BADGE
   ================================================================ */
function dueDateBadge(dateStr) {
  if (!dateStr) return '<span style="color:#94a3b8">—</span>';
  const d = new Date(dateStr + 'T00:00:00');
  const diffDays = Math.ceil((d - new Date()) / 86400000);
  const color = diffDays < 0 ? '#dc2626' : diffDays <= 14 ? '#d97706' : '#475569';
  const icon  = diffDays < 0 ? '⚠ ' : '';
  return `<span style="font-size:12.5px;font-weight:${diffDays<=14?'700':'400'};color:${color}">${icon}${formatDate(dateStr)}</span>`;
}

/* ================================================================
   PDF VIEWER
   ================================================================ */
function openPDFViewer(pdfFile, circularId, circularTitle) {
  const existing = document.getElementById('pdf-viewer-overlay');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.id = 'pdf-viewer-overlay';
  overlay.innerHTML = `
    <div id="pdf-viewer-box">
      <div id="pdf-viewer-header">
        <div class="pdf-viewer-title">
          <div class="pdf-icon-badge">PDF</div>
          <div class="pdf-title-text">
            <div class="pdf-doc-name">${circularTitle}</div>
            <div class="pdf-doc-meta">${circularId} &nbsp;·&nbsp; ${pdfFile}</div>
          </div>
        </div>
        <div class="pdf-viewer-actions">
          <button class="pdf-action-btn" onclick="dummyDownload('${circularId}')">⬇ &nbsp;Download</button>
          <button class="pdf-close-btn" title="Close" onclick="closePDFViewer()">✕</button>
        </div>
      </div>
      <iframe id="pdf-viewer-frame"
        src="${pdfFile}#toolbar=1&navpanes=0&view=FitH"
        title="Circular Document Viewer">
      </iframe>
    </div>
  `;

  overlay.addEventListener('click', e => { if (e.target === overlay) closePDFViewer(); });
  document._pdfEscListener = e => { if (e.key === 'Escape') closePDFViewer(); };
  document.addEventListener('keydown', document._pdfEscListener);
  document.body.appendChild(overlay);
}

function closePDFViewer() {
  const overlay = document.getElementById('pdf-viewer-overlay');
  if (overlay) {
    overlay.style.opacity = '0';
    overlay.style.transition = 'opacity 0.2s';
    setTimeout(() => overlay.remove(), 200);
  }
  if (document._pdfEscListener) {
    document.removeEventListener('keydown', document._pdfEscListener);
    delete document._pdfEscListener;
  }
}

function dummyDownload(circularId) {
  const toast = document.createElement('div');
  toast.className = 'cms-toast';
  toast.innerHTML = `⬇ &nbsp;Downloading ${circularId}… <span style="font-weight:400;color:#94a3b8;font-size:12px">(demo)</span>`;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0'; toast.style.transition = 'opacity 0.3s';
    setTimeout(() => toast.remove(), 300);
  }, 2400);
}

/* ================================================================
   CIRCULAR FULL SCREEN VIEW
   ================================================================ */
function openCircularScreen(circularId) {
  const circular = CMS_DATA.circulars.find(c => c.id === circularId);
  if (!circular) return;
  window._currentCircular = circular;

  const area = document.getElementById('content-area');
  const safeTitleAttr = circular.title.replace(/'/g, "\\'");

  area.innerHTML = `
  <div class="fade-in" style="padding:24px">

    <!-- BREADCRUMB + HEADER -->
    <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:20px;gap:16px">
      <div>
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
          <button onclick="renderCircularLibrary()"
            style="background:none;border:none;cursor:pointer;font-size:13px;
              color:var(--accent);font-weight:700;padding:0;font-family:inherit">
            ← Circular Library
          </button>
          <span style="color:#cbd5e1">/</span>
          <span style="font-size:12px;color:var(--text-muted);font-family:'DM Mono',monospace">${circular.id}</span>
        </div>
        <h2 style="font-size:20px;font-weight:800;color:var(--text-primary);margin:0 0 4px">${circular.title}</h2>
        <div style="font-size:13px;color:var(--text-muted)">
          ${circular.id} &nbsp;·&nbsp; ${circular.regulator} &nbsp;·&nbsp; Issued ${formatDate(circular.issuedDate)}
        </div>
      </div>
      <div style="display:flex;gap:8px;flex-shrink:0">
        <button class="btn btn-ghost btn-sm"
          onclick="openPDFViewer('RBI_Master_Circular.pdf','${circular.id}','${safeTitleAttr}')">
          👁 &nbsp;View PDF
        </button>
        <button class="btn btn-ghost btn-sm" onclick="dummyDownload('${circular.id}')">
          ⬇ &nbsp;Download
        </button>
      </div>
    </div>

    <!-- INFO CARDS -->
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(155px,1fr));gap:12px;margin-bottom:24px">
      ${infoCard('Issued Date',    formatDate(circular.issuedDate),     '📅')}
      ${infoCard('Effective Date', formatDate(circular.effectiveDate),  '📆')}
      ${infoCard('Due Date',       formatDate(circular.dueDate),        '⏱')}
      ${infoCard('Risk Level',     circular.risk,                       '⚠️')}
      ${infoCard('Compliance',     (circular.complianceScore || '—') + '%', '📊')}
      ${infoCard('Type',           circular.type,                       '📋')}
      ${infoCard('Regulator',      circular.regulator,                  '🏛')}
      ${infoCard('Departments',    circular.departments.length + ' units', '🏢')}
    </div>

    <!-- TABS -->
    <div style="display:flex;gap:4px;border-bottom:2px solid var(--border);margin-bottom:20px">
      <button class="tab active" onclick="switchTab('overview',event)">Overview</button>
      <button class="tab" onclick="switchTab('applicability',event)">Applicability</button>
      <button class="tab" onclick="switchTab('clauses',event)">Clauses</button>
      <button class="tab" onclick="switchTab('audit',event)">Audit Log</button>
    </div>

    <div id="tab-content">
      ${renderOverviewTab(circular)}
    </div>

  </div>
  `;
}

/* ================================================================
   INFO CARD
   ================================================================ */
function infoCard(title, value, icon) {
  return `
    <div style="background:#fff;padding:14px 16px;border-radius:10px;border:1px solid var(--border);transition:box-shadow .2s"
         onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.07)'"
         onmouseout="this.style.boxShadow='none'">
      <div style="font-size:10.5px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--text-muted);margin-bottom:6px">
        ${icon ? icon + ' &nbsp;' : ''}${title}
      </div>
      <div style="font-weight:700;font-size:14px;color:var(--text-primary)">${value || '—'}</div>
    </div>`;
}

/* ================================================================
   TAB: OVERVIEW
   ================================================================ */
function renderOverviewTab(c) {
  return `
    <div style="display:flex;flex-direction:column;gap:20px">
      <div style="background:#fff;border:1px solid var(--border);border-radius:14px;padding:24px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
          <div>
            <div style="font-size:10.5px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--text-muted);margin-bottom:3px">Circular ID</div>
            <div style="font-weight:700;font-size:15px;font-family:'DM Mono',monospace;color:var(--accent)">${c.id}</div>
          </div>
          <div style="text-align:right">
            <div style="font-size:10.5px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--text-muted);margin-bottom:3px">Issuing Authority</div>
            <div style="font-weight:700;font-size:15px">${c.regulator}</div>
          </div>
        </div>
        <div style="margin-bottom:18px">
          <div style="font-size:10.5px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--text-muted);margin-bottom:8px">Executive Summary</div>
          <div style="line-height:1.75;font-size:13.5px;color:var(--text-secondary);
            border-left:3px solid var(--accent);background:#f8f9ff;
            border-radius:0 8px 8px 0;padding:12px 14px">
            ${c.summary || 'AI-generated executive summary will appear here after analysis.'}
          </div>
        </div>
        <hr style="border:none;border-top:1px solid #f1f5f9;margin:16px 0">
        <div style="display:flex;gap:32px;flex-wrap:wrap">
          <div>
            <div style="font-size:11px;color:var(--text-muted);font-weight:600;margin-bottom:3px">Issued Date</div>
            <div style="font-weight:600;font-size:13px">${formatDate(c.issuedDate)}</div>
          </div>
          <div>
            <div style="font-size:11px;color:var(--text-muted);font-weight:600;margin-bottom:3px">Effective Date</div>
            <div style="font-weight:600;font-size:13px">${formatDate(c.effectiveDate)}</div>
          </div>
          <div>
            <div style="font-size:11px;color:var(--text-muted);font-weight:600;margin-bottom:3px">Compliance Due</div>
            <div style="font-weight:600;font-size:13px">${formatDate(c.dueDate)}</div>
          </div>
        </div>
      </div>
      <div style="background:#f9fafb;border:1px solid var(--border);border-radius:14px;padding:20px">
        <div style="font-size:10.5px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--text-muted);margin-bottom:12px">Impacted Departments</div>
        <div style="display:flex;flex-wrap:wrap;gap:8px">
          ${c.departments.map(d => `
            <span style="background:#eef2ff;color:#3730a3;padding:6px 14px;
              border-radius:99px;font-size:12px;font-weight:600;border:1px solid #c7d2fe">${d}</span>
          `).join('')}
        </div>
      </div>
    </div>`;
}

/* ================================================================
   TAB: APPLICABILITY
   ================================================================ */
function renderApplicabilityTab(c) {
  if (typeof _seedSavedFlow === 'function') _seedSavedFlow(c);
  const a = window._savedFlow?.[c.id]?.applicability;

  let aiData = null;
  Object.values(CMS_DATA.aiSearchResponses || {}).forEach(cat => {
    (cat.results || []).forEach(r => { if (r.circularId === c.id) aiData = r; });
  });
  const confidence = aiData ? aiData.confidence : 0;
  const reasoning  = aiData ? aiData.explanation : 'No AI analysis available. Please run analysis from the AI Engine.';

  const verdictColor  = a?.applicable ? '#15803d' : '#b91c1c';
  const verdictBg     = a?.applicable ? '#dcfce7'  : '#fee2e2';
  const verdictBorder = a?.applicable ? '#86efac'  : '#fca5a5';

  return `
  <div style="display:flex;flex-direction:column;gap:16px">

    <!-- VERDICT BANNER -->
    <div style="display:flex;align-items:center;gap:14px;padding:14px 18px;
      background:${verdictBg};border:1.5px solid ${verdictBorder};border-radius:10px;flex-wrap:wrap;">
      <span style="font-size:20px;font-weight:700;color:${verdictColor}">${a?.applicable ? '✓' : '✗'}</span>
      <div style="flex:1">
        <div style="font-size:14px;font-weight:800;color:${verdictColor}">${a?.verdict || (confidence >= 70 ? 'Applicable' : 'Review Required')}</div>
        <div style="font-size:11px;color:#4a5068;margin-top:2px">Entity Type: ${a?.entityType || '—'} · Scope: ${a?.scope || '—'}</div>
      </div>
      <div style="text-align:right;flex-shrink:0">
        <div style="font-size:9px;font-weight:700;color:#9499aa;text-transform:uppercase;letter-spacing:.05em;margin-bottom:2px">AI Confidence</div>
        <div style="font-size:18px;font-weight:800;color:#1a1a2e">${confidence}%</div>
      </div>
      <div style="text-align:right;flex-shrink:0;margin-left:12px">
        <div style="font-size:9px;font-weight:700;color:#9499aa;text-transform:uppercase;letter-spacing:.05em;margin-bottom:2px">Deadline</div>
        <div style="font-size:14px;font-weight:800;color:#1a1a2e">${a?.deadline || '—'}</div>
      </div>
    </div>

    <!-- APPLICABLE ENTITIES TABLE -->
    ${a?.entities?.length ? `
    <div style="background:#fff;border:1px solid var(--border);border-radius:12px;overflow:hidden">
      <div style="padding:12px 16px;background:#fafbff;border-bottom:1px solid var(--border)">
        <div style="font-size:10.5px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--text-muted)">Applicable Entities</div>
      </div>
      <table style="width:100%;border-collapse:collapse;font-size:12px">
        <thead>
          <tr style="background:#f8fafc">
            ${['Entity','Type','Applicable','Reason'].map(h=>`
              <th style="padding:9px 14px;text-align:left;font-size:10.5px;font-weight:700;
                text-transform:uppercase;letter-spacing:.06em;color:var(--text-muted);
                border-bottom:1px solid var(--border)">${h}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${a.entities.map(e=>`
          <tr style="border-bottom:1px solid #f4f5f8">
            <td style="padding:10px 14px;font-weight:600;color:var(--text-primary)">${e.name}</td>
            <td style="padding:10px 14px;color:var(--text-secondary)">${e.type}</td>
            <td style="padding:10px 14px">
              <span style="padding:2px 10px;border-radius:20px;font-size:11px;font-weight:700;
                background:${e.applicable?'#dcfce7':'#fee2e2'};
                color:${e.applicable?'#15803d':'#b91c1c'}">
                ${e.applicable?'✓ Yes':'✗ No'}
              </span>
            </td>
            <td style="padding:10px 14px;font-size:12px;color:#9499aa">${e.reason||'Based on entity classification'}</td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>` : ''}

    <!-- REQUIREMENTS APPLICABILITY TABLE -->
    ${a?.requirementsApplicability?.length ? `
    <div style="background:#fff;border:1px solid var(--border);border-radius:12px;overflow:hidden">
      <div style="padding:12px 16px;background:#fafbff;border-bottom:1px solid var(--border)">
        <div style="font-size:10.5px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--text-muted)">Requirements Applicability</div>
      </div>
      <table style="width:100%;border-collapse:collapse;font-size:12px">
        <thead>
          <tr style="background:#f8fafc">
            ${['Requirement','Applicable','Threshold','Status'].map(h=>`
              <th style="padding:9px 14px;text-align:left;font-size:10.5px;font-weight:700;
                text-transform:uppercase;letter-spacing:.06em;color:var(--text-muted);
                border-bottom:1px solid var(--border)">${h}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${a.requirementsApplicability.map(r=>`
          <tr style="border-bottom:1px solid #f4f5f8">
            <td style="padding:10px 14px;font-weight:600;color:var(--text-primary)">${r.requirement}</td>
            <td style="padding:10px 14px">
              <span style="padding:2px 10px;border-radius:20px;font-size:11px;font-weight:700;
                background:${r.applicable?'#dcfce7':'#fee2e2'};
                color:${r.applicable?'#15803d':'#b91c1c'}">
                ${r.applicable?'✓ Yes':'✗ No'}
              </span>
            </td>
            <td style="padding:10px 14px;color:var(--text-secondary)">${r.threshold}</td>
            <td style="padding:10px 14px">
              <span style="font-size:10px;font-weight:700;padding:3px 10px;border-radius:4px;
                background:${r.status==='Compliant'?'#dcfce7':r.status==='In Progress'?'#fef9c3':'#fee2e2'};
                color:${r.status==='Compliant'?'#15803d':r.status==='In Progress'?'#b45309':'#b91c1c'}">
                ${r.status}
              </span>
            </td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>` : ''}

    <!-- IMPACTED BUSINESS UNITS -->
    <div style="background:#fff;border:1px solid var(--border);border-radius:12px;padding:16px">
      <div style="font-size:10.5px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--text-muted);margin-bottom:10px">Impacted Business Units</div>
      <div style="display:flex;flex-wrap:wrap;gap:8px">
        ${c.departments.map(d=>`
          <span style="background:#eef2ff;color:#3730a3;padding:5px 12px;border-radius:99px;font-size:12px;font-weight:600;border:1px solid #c7d2fe">${d}</span>
        `).join('')}
      </div>
    </div>

    <!-- NOTES -->
    ${a?.notes ? `
    <div style="background:#f5f6f8;border:1px solid var(--border);border-radius:10px;padding:14px 16px">
      <div style="font-size:10.5px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--text-muted);margin-bottom:6px">Applicability Notes</div>
      <div style="font-size:13px;color:var(--text-secondary);line-height:1.7">${a.notes}</div>
    </div>` : ''}

    <!-- AI REASONING -->
    <div style="background:#f9fafb;border:1px solid var(--border);border-radius:12px;padding:20px">
      <div style="font-size:10.5px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--text-muted);margin-bottom:10px">AI Reasoning &amp; Regulatory Interpretation</div>
      <div style="line-height:1.75;font-size:13.5px;color:var(--text-secondary)">${reasoning}</div>
    </div>

    <!-- FOOTER -->
    <div style="display:flex;justify-content:flex-end;padding:4px 0">
      <button class="btn btn-ghost btn-sm" onclick="openDraftReviewForCircular('${c.id}')">
        ✎ Edit in Draft Review →
      </button>
    </div>

  </div>`;
}

/* ================================================================
   TAB: CLAUSES
   ================================================================ */
function renderClausesTab(c) {
  if (!CMS_DATA || !CMS_DATA.aiSearchResponses) {
    return `<div style="padding:40px;text-align:center;color:#ef4444">AI search data not available.</div>`;
  }
  let clauses = [];
  Object.values(CMS_DATA.aiSearchResponses).forEach(cat => {
    (cat.results || []).forEach(r => {
      if (r.circularId === c.id) {
        const refs = r.clauseRef.toLowerCase().includes('all') ? ['Full Circular'] : r.clauseRef.split(',').map(x => x.trim());
        refs.forEach(ref => clauses.push({
          number: ref, title: r.title, explanation: r.explanation, confidence: r.confidence,
          risk: r.confidence >= 90 ? 'High' : r.confidence >= 75 ? 'Medium' : 'Low',
          obligations: generateObligations(r.explanation),
          actionables: clauses.length < 2
            ? ['Update internal policy document as per clause requirement.', 'Conduct compliance review and submit report to regulator.']
            : []
        }));
      }
    });
  });

  if (clauses.length === 0) {
    return `<div style="padding:52px;text-align:center;color:var(--text-muted)">
      <div style="font-size:32px;margin-bottom:10px">📋</div>
      <div style="font-weight:700;font-size:15px;margin-bottom:4px">No clause analysis available</div>
      <div style="font-size:13px">Run AI Engine analysis to generate clause breakdowns for this circular.</div>
    </div>`;
  }

  return clauses.map((cl, i) => {
    const riskColor = cl.risk === 'High' ? '#dc2626' : cl.risk === 'Medium' ? '#d97706' : '#059669';
    if (!cl.actionables) cl.actionables = [];
    return `
    <div style="border:1px solid var(--border);border-radius:14px;margin-bottom:16px;background:#fff;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.04)">
      <div style="padding:16px 20px;cursor:pointer;display:flex;justify-content:space-between;align-items:center;background:#f9fafb;transition:background .15s"
           onmouseover="this.style.background='#f0f2ff'" onmouseout="this.style.background='#f9fafb'"
           onclick="toggleAccordion(${i})">
        <div>
          <div style="font-weight:700;font-size:14px">Clause ${cl.number}</div>
          <div style="font-size:12px;color:var(--text-muted);margin-top:2px">${cl.title}</div>
        </div>
        <div style="display:flex;gap:8px;align-items:center">
          <span style="font-size:11px;background:#eef2ff;color:#3730a3;padding:4px 10px;border-radius:99px;font-weight:600;border:1px solid #c7d2fe">${cl.confidence}% Confidence</span>
          <span style="font-size:11px;font-weight:700;color:${riskColor}">${cl.risk} Risk</span>
          <span style="color:var(--text-muted);font-size:14px" id="acc-arrow-${i}">▾</span>
        </div>
      </div>
      <div id="acc-${i}" style="display:none;padding:20px;border-top:1px solid #f1f5f9">
        <div style="margin-bottom:18px">
          <div style="font-size:10.5px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--text-muted);margin-bottom:8px">Clause Explanation</div>
          <div style="font-size:13.5px;line-height:1.7;color:var(--text-secondary)">${cl.explanation}</div>
        </div>
        <div style="margin-bottom:18px">
          <div style="font-size:10.5px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--text-muted);margin-bottom:8px">Obligations</div>
          ${cl.obligations && cl.obligations.length
            ? `<ul style="padding-left:18px;font-size:13.5px;color:var(--text-secondary);line-height:1.7">
                ${cl.obligations.map(o => `<li style="margin-bottom:6px">${o}</li>`).join('')}
               </ul>`
            : `<div style="font-size:13px;color:var(--text-muted)">No obligations derived yet.</div>`
          }
        </div>
        ${cl.actionables && cl.actionables.length
          ? cl.actionables.map(a => `
            <div style="border:1px solid var(--border);border-radius:10px;padding:14px;margin-bottom:12px;background:#fafbff">
              <div style="font-size:10.5px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--text-muted);margin-bottom:6px">Action Required</div>
              <div style="font-size:13.5px;margin-bottom:10px;color:var(--text-primary)">${a}</div>
              <div style="font-size:12.5px;color:var(--text-secondary)"><strong>Evidence Required:</strong> Policy document, approval record, or system screenshot demonstrating compliance.</div>
            </div>`).join('')
          : ''}
      </div>
    </div>`;
  }).join('');
}

/* ================================================================
   TAB: AUDIT
   ================================================================ */
function renderAuditTab(c) {
  const events = [
    ['📤', 'Circular uploaded to CMS',                'System',             '01 Mar 2025'],
    ['◈',  'AI Engine analysis triggered',            'System',             '01 Mar 2025'],
    ['✅', 'Applicability confirmed',                  'Compliance Officer', '02 Mar 2025'],
    ['📋', 'Clauses extracted and reviewed',           'Priya Nair',         '03 Mar 2025'],
    ['🔔', 'Notifications dispatched to departments', 'System',             '03 Mar 2025'],
  ];
  return `
    <div style="background:#fff;border:1px solid var(--border);border-radius:12px;padding:24px">
      <div style="font-size:10.5px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--text-muted);margin-bottom:16px">Audit Trail</div>
      <div>
        ${events.map(([icon, action, actor, date]) => `
          <div style="display:flex;align-items:flex-start;gap:12px;padding:12px 0;border-bottom:1px solid #f4f5f8">
            <div style="width:30px;height:30px;border-radius:50%;background:#eef2ff;display:flex;align-items:center;justify-content:center;font-size:13px;flex-shrink:0">${icon}</div>
            <div style="flex:1">
              <div style="font-size:13px;font-weight:600;color:var(--text-primary)">${action}</div>
              <div style="font-size:11.5px;color:var(--text-muted);margin-top:2px">${actor} &nbsp;·&nbsp; ${date}</div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>`;
}

/* ================================================================
   ACCORDION
   ================================================================ */
function toggleAccordion(index) {
  const el    = document.getElementById('acc-' + index);
  const arrow = document.getElementById('acc-arrow-' + index);
  if (!el) return;
  const open = el.style.display !== 'none';
  el.style.display = open ? 'none' : 'block';
  if (arrow) arrow.textContent = open ? '▾' : '▴';
}

/* ================================================================
   SWITCH TAB
   ================================================================ */
function switchTab(tab, event) {
  const c = window._currentCircular;
  if (!c) return;
  const container = document.getElementById('tab-content');
  if (!container) return;
  const map = {
    overview:      () => renderOverviewTab(c),
    applicability: () => renderApplicabilityTab(c),
    clauses:       () => renderClausesTab(c),
    audit:         () => renderAuditTab(c),
  };
  container.innerHTML = (map[tab] || map.overview)();
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  if (event && event.target) event.target.classList.add('active');
}

/* ================================================================
   AI HELPERS
   ================================================================ */
function generateObligations(text) {
  const obligations = [];
  const lower = text.toLowerCase();
  if (lower.includes('board'))      obligations.push('Obtain Board approval and document governance review');
  if (lower.includes('incident'))   obligations.push('Implement 6-hour incident reporting workflow');
  if (lower.includes('assessment')) obligations.push('Conduct annual risk assessment and submit report');
  if (lower.includes('edd'))        obligations.push('Perform Enhanced Due Diligence above INR 10 lakhs');
  if (lower.includes('pep'))        obligations.push('Implement daily PEP screening mechanism');
  if (lower.includes('vendor') || lower.includes('third')) obligations.push('Conduct vendor due diligence and risk review');
  if (obligations.length === 0) obligations.push('Review circular and align internal policy controls');
  return obligations;
}

/* ================================================================
   LISTENERS
   ================================================================ */
function initLibraryListeners() {
  const searchInput = document.getElementById('lib-search');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      libFilter.search = searchInput.value.trim();
      renderCircularTable();
    });
  }
  ['regulator', 'type', 'risk'].forEach(f => {
    const el = document.getElementById(`lib-filter-${f}`);
    if (el) el.addEventListener('change', () => { libFilter[f] = el.value; renderCircularTable(); });
  });
  const clearBtn = document.getElementById('lib-clear-filters');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      libFilter = { search: '', regulator: '', type: '', risk: '' };
      const s = document.getElementById('lib-search');
      if (s) s.value = '';
      ['regulator', 'type', 'risk'].forEach(f => {
        const el = document.getElementById(`lib-filter-${f}`);
        if (el) el.value = '';
      });
      renderCircularTable();
    });
  }
}

/* ================================================================
   HELPERS
   ================================================================ */
function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function statusClass(status) {
  const map = { 'Open': 'open', 'In Progress': 'inprogress', 'Complete': 'complete', 'Overdue': 'overdue', 'Active': 'active', 'Closed': 'closed' };
  return map[status] || 'na';
}

function showToast(msg) {
  const t = document.createElement('div');
  t.className = 'cms-toast';
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => { t.style.opacity = '0'; t.style.transition = 'opacity .3s'; setTimeout(() => t.remove(), 300); }, 3000);
}

function openDraftReviewForCircular(circId) {
  // Navigate to draft review page
  if (window.CMS && window.CMS.navigateTo) {
    window.CMS.navigateTo('ai-suggestion');
  }
  // Wait for page to render, then auto-select the circular
  setTimeout(() => {
    const circ = CMS_DATA.circulars.find(c => c.id === circId);
    if (!circ) return;

    // Seed the flow data
    if (typeof _seedSavedFlow === 'function') _seedSavedFlow(circ);

    // Find and click the matching item in the custom dropdown
    const item = document.querySelector(`.dr-csel-item[data-id="${circId}"]`);
    if (item) {
      item.click();
      return;
    }

    // Fallback: manually trigger if dropdown not rendered yet
    setTimeout(() => {
      const item2 = document.querySelector(`.dr-csel-item[data-id="${circId}"]`);
      if (item2) item2.click();
    }, 300);
  }, 150);
}