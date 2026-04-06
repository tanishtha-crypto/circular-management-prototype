/**
 * ai-engine.js — CMS Circular Management System
 */

const AI_LIFECYCLE_STATE = {
  selectedCircularId: null,
  uploadedCircular:   null,
  circularType:       null,
};

async function renderAIEngine(subPage) {
  const area = document.getElementById('content-area');
  area.innerHTML = buildAIEngineShell(subPage || 'overview');
  initAITabs(subPage || 'overview');
}

function buildAIEngineShell(activeTab) {
  const tabs = [
    { id: 'overview',      label: 'Overview',           icon: '🗂️' },
    { id: 'applicability', label: 'Applicability',       icon: '🎯' },
    { id: 'summary',       label: 'Executive Summary',   icon: '📝' },
    { id: 'clause',        label: 'Clause -> Obligation -> Action Generation',   icon: '🔗' },
    // { id: 'evidence',      label: 'Evidence Evaluation', icon: '🔍' },
  ];
  return `
  <div class="fade-in">
    
    </div>
    <div class="ai-panel ${activeTab==='overview'      ?'active':''}" id="panel-overview"></div>
    <div class="ai-panel ${activeTab==='applicability' ?'active':''}" id="panel-applicability"></div>
    <div class="ai-panel ${activeTab==='summary'       ?'active':''}" id="panel-summary"></div>
    <div class="ai-panel ${activeTab==='clause'        ?'active':''}" id="panel-clause"></div>
    <div class="ai-panel ${activeTab==='evidence'      ?'active':''}" id="panel-evidence">
      <div id="ai-evidence-root"></div>
    </div>
  </div>
  <style>
    .ai-tab-bar { display:flex;gap:4px;background:#fff;border:1px solid #dde0e6;border-radius:12px;padding:6px;margin-bottom:16px;box-shadow:0 1px 4px rgba(0,0,0,0.04);overflow-x:auto; }
    .ai-tab { display:inline-flex;align-items:center;gap:7px;padding:8px 16px;border:none;border-radius:8px;background:transparent;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;color:#9499aa;cursor:pointer;white-space:nowrap;transition:all 0.15s;flex-shrink:0; }
    .ai-tab:hover  { background:#f5f6f8;color:#1a1a2e; }
    .ai-tab.active { background:#1a1a2e;color:#fff; }
    .ai-panel { display:none; }
    .ai-panel.active { display:block; }
  </style>`;
}

function initAITabs(activeTab) {
  _renderPanel(activeTab);
  document.querySelectorAll('.ai-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      let t = tab.dataset.tab;

      /* if no circular selected and user clicks any analysis tab → send to overview */
      if (['applicability','summary','clause','evidence'].includes(t) && !AI_LIFECYCLE_STATE.selectedCircularId) {
        t = 'overview';
        document.querySelectorAll('.ai-tab').forEach(x => x.classList.remove('active'));
        document.querySelector('[data-tab="overview"]')?.classList.add('active');
        document.querySelectorAll('.ai-panel').forEach(x => x.classList.remove('active'));
        document.getElementById('panel-overview')?.classList.add('active');
        _renderPanel('overview');
        showToast('Please select a circular in Overview first.', 'warning');
        return;
      }

      document.querySelectorAll('.ai-tab').forEach(x => x.classList.remove('active'));
      document.querySelectorAll('.ai-panel').forEach(x => x.classList.remove('active'));
      tab.classList.add('active');
      const panel = document.getElementById(`panel-${t}`);
      if (panel) panel.classList.add('active');
      _renderPanel(t);
    });
  });
}

function _renderPanel(t) {
  const panel = document.getElementById(`panel-${t}`);
  if (!panel) return;
  if (t === 'overview') {
    panel.innerHTML = buildOverviewPanel();
    initOverviewListeners();
    return;
  }
  if (t === 'applicability') {
    panel.innerHTML = buildApplicabilityPanel();
    initApplicabilityListeners();
    return;
  }
  if (t === 'summary') {
    if (!panel.innerHTML.trim()) panel.innerHTML = buildSummaryPanel();
    initSummaryListeners();
    return;
  }
  if (t === 'clause') {
    if (!panel.innerHTML.trim()) panel.innerHTML = buildClausePanel();
    initClauseListeners();
    return;
  }
  if (t === 'evidence') {
    setTimeout(() => EvidencePanel.init('ai-evidence-root', CMS_DATA), 0);
  }
}

/* ── shared helpers ── */
function loadingHTML(msg) {
  return `<div class="ai-loading"><div class="spinner"></div><div class="ai-loading-text">${msg}</div></div>`;
}
function getObligation(cl) { return cl.obligation || cl.obligations || 'No obligation mapped'; }
function getActionable(cl) { return cl.actionable || cl.actionables || cl.actionabless || ''; }
function extractActions(text) {
  if (!text) return [];
  let a = text.split(';').map(x=>x.trim()).filter(Boolean);
  if (a.length===1 && text.includes(',')) { const c=text.split(',').map(x=>x.trim()).filter(Boolean); if(c.length>1) a=c; }
  if (!a.length && text) a=[text];
  return a;
}
function showToast(msg, type) {
  const t = document.createElement('div');
  t.textContent = msg;
  const bg = type==='warning'?'#f59e0b':type==='danger'?'#ef4444':type==='info'?'#2563eb':'#10b981';
  t.style.cssText = `position:fixed;bottom:24px;right:24px;z-index:9999;background:${bg};color:#fff;padding:12px 18px;border-radius:8px;font-size:13px;font-weight:600;box-shadow:0 4px 16px rgba(0,0,0,0.3);`;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2500);
}
function initGlobalAIInput() {}

/* ── evidence helpers ── */
function showCircularInfo(circularId) {
  const circ = CMS_DATA.circulars.find(c => c.id === circularId);
  if (!circ) return;
  const el = document.getElementById('circular-info');
  const st = document.getElementById('circular-status');
  if (!el||!st) return;
  const statusColor = circ.status==='Active'?'var(--success)':'var(--warning)';
  const riskColor   = circ.risk==='High'?'var(--danger)':circ.risk==='Medium'?'var(--warning)':'var(--success)';
  st.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center;"><div><div style="font-weight:600;color:var(--text-primary);margin-bottom:4px;">${circ.title}</div><div style="font-size:11px;color:var(--text-secondary);">Regulator: ${circ.regulator} | Type: ${circ.type||'N/A'}</div></div><div style="display:flex;gap:12px;align-items:center;"><span style="padding:4px 10px;background:rgba(0,0,0,0.1);border-radius:4px;font-size:11px;font-weight:600;color:${statusColor};">${circ.status}</span><span style="padding:4px 10px;background:rgba(0,0,0,0.1);border-radius:4px;font-size:11px;font-weight:600;color:${riskColor};">${circ.risk} Risk</span></div></div>`;
  el.style.display = 'block';
}
function renderEvidenceTable(circId) {
  const output = document.getElementById('evidence-output');
  const circ   = CMS_DATA.circulars.find(c => c.id === circId);
  if (!circ||!output) return;
  let items = [];
  circ.chapters?.forEach(ch => { ch.clauses?.forEach(cl => { const at=getActionable(cl); if(at) extractActions(at).forEach(act => { const mock=(CMS_DATA.aiEvidenceResults||[])[Math.floor(Math.random()*((CMS_DATA.aiEvidenceResults||[]).length||1))]||{status:'Partial',score:65,reasoning:'Pending review.'}; items.push({circularId:circ.id,clauseId:cl.id,clauseTitle:cl.text,action:act,status:mock.status,score:mock.score,reasoning:mock.reasoning,dept:cl.department,risk:cl.risk}); }); }); });
  if (!items.length) { output.innerHTML=`<div class="empty-state"><div class="empty-state-icon">📭</div><h3>No Evidence Items</h3></div>`; return; }
  const sColor=s=>s==='Complete'?'#10b981':s==='Partial'?'#f59e0b':'#ef4444';
  output.innerHTML=`<div style="margin-top:24px;"><div class="table-wrapper"><table class="clean-table"><thead><tr><th>Clause</th><th>Action</th><th>Dept</th><th>Risk</th><th>Status</th><th>Score</th><th>Actions</th></tr></thead><tbody>${items.map(item=>`<tr><td><strong style="color:var(--primary);">${item.clauseId}</strong></td><td>${item.action.substring(0,40)}...</td><td>${item.dept||'—'}</td><td><span class="risk-badge risk-${(item.risk||'').toLowerCase()}">${item.risk}</span></td><td><span class="status-badge status-${item.status.toLowerCase()}">${item.status}</span></td><td>${item.score}%</td><td><button class="btn btn-primary btn-sm" onclick="openUploadModal('${item.clauseId}','${item.action.replace(/'/g,"\\'")}')">Upload</button></td></tr>`).join('')}</tbody></table></div></div>`;
}
function renderBulkUploadInterface(circId) {}
function showAnalysisModal(clauseId, action) {}
function openUploadModal(clauseId, action) {
  showToast(`Upload modal for ${clauseId}`, 'info');
}
function submitUploadEvidence() { showToast('✓ Evidence uploaded', 'success'); document.querySelector('.modal')?.remove(); }
function submitBulkEvidence()   { showToast('✓ All evidence submitted', 'success'); }
function downloadEvidence(clauseId) { showToast(`📥 Downloading ${clauseId}...`, 'info'); }