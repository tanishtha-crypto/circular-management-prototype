/* =============================================================
   approval-required.js
   Call: renderApprovalRequired()
   Renders into #approval-required
   ============================================================= */

const AR_ITEMS = [
  {
    id:'ACT-002', title:'SIEM Vendor Evaluation & RFP',
    circularId:'CIRC-001', clauseRef:'§5.2',
    submittedBy:'Raj Iyer', submittedOn:'08 Mar 2025',
    dept:'IT', risk:'High', sendFor:'Closure',
    notes:'All 3 vendors evaluated. RFP submitted. Recommending Microsoft Sentinel.',
    evidence:['SIEM_Vendor_Matrix.xlsx'],
    status:'Pending Closure',
  },
  {
    id:'ACT-004', title:'Configure Transaction Monitoring Rules',
    circularId:'CIRC-002', clauseRef:'§4.1',
    submittedBy:'Pooja Verma', submittedOn:'05 Mar 2025',
    dept:'IT', risk:'High', sendFor:'Closure',
    notes:'CBS alert config complete. UAT passed. Ready for sign-off.',
    evidence:['CBS_Alert_Config_Draft.pdf'],
    status:'Pending Closure',
  },
  {
    id:'ACT-006', title:'Draft Exit Strategy Template',
    circularId:'CIRC-005', clauseRef:'§5.1',
    submittedBy:'Karan Shah', submittedOn:'09 Mar 2025',
    dept:'Legal', risk:'Medium', sendFor:'Closure',
    notes:'Template drafted and reviewed by legal. Attached for sign-off.',
    evidence:['Exit_Strategy_Template_v1.docx'],
    status:'Pending Closure',
  },
];

let _ar = { selected: null };

/* ── ENTRY ── */
function renderApprovalRequired() {
  const wrap = document.getElementById('approval-required');
  if (!wrap) return;
  _arStyles();
  _ar.selected = null;
  wrap.innerHTML = _arList();
}

/* ── LIST VIEW ── */
function _arList() {
  const pending = AR_ITEMS.filter(i => i.status === 'Pending Closure');
  const closed  = AR_ITEMS.filter(i => i.status === 'Closed');

  return `
  <div id="ar-root">
    <div class="ar-page-header">
      <div>
        <div class="ar-page-title">Approval Required</div>
        <div class="ar-page-sub">Actions submitted for your closure — review and close from your side</div>
      </div>
      <div class="ar-header-stats">
        <div class="ar-stat"><div class="ar-stat-v" style="color:#f59e0b">${pending.length}</div><div class="ar-stat-l">Pending</div></div>
        <div class="ar-stat"><div class="ar-stat-v" style="color:#10b981">${closed.length}</div><div class="ar-stat-l">Closed</div></div>
      </div>
    </div>

    <div class="ar-table-wrap">
      <table class="ar-table">
        <thead>
          <tr>
            <th>Action ID</th>
            <th>Action Title</th>
            <th>Circular</th>
            <th>Submitted By</th>
            <th>Submitted On</th>
            
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          ${AR_ITEMS.map(item => `
          <tr class="ar-row" onclick="arOpenDetail('${item.id}')">
            <td><code class="ar-id">${item.id}</code></td>
            <td>
              <div class="ar-title">${item.title}</div>
              <div class="ar-sub">${item.clauseRef} · ${item.dept}</div>
            </td>
            <td><span class="ar-circ">${item.circularId}</span></td>
            <td>
              <div style="display:flex;align-items:center;gap:7px">
                <span class="ar-av">${item.submittedBy.split(' ').map(w=>w[0]).join('')}</span>
                <span style="font-size:13px">${item.submittedBy}</span>
              </div>
            </td>
            <td style="font-size:12.5px;color:#64748b">${item.submittedOn}</td>
           
            <td><span class="ar-pill" style="background:${_arSC(item.status).bg};color:${_arSC(item.status).fg}">${item.status}</span></td>
            <td>
              <button class="ar-btn ar-btn-primary ar-btn-sm" onclick="event.stopPropagation();arOpenDetail('${item.id}')">
                Review →
              </button>
            </td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
  </div>`;
}

/* ── DETAIL (full screen) ── */
window.arOpenDetail = function(id) {
  const item = AR_ITEMS.find(i => i.id === id);
  if (!item) return;
  _ar.selected = id;

  const wrap = document.getElementById('approval-required');
  const rc   = _arRisk(item.risk);
  const sc   = _arSC(item.status);
  const isClosed = item.status === 'Closed';

  wrap.innerHTML = `
  <div id="ar-detail">

    <!-- Back + header -->
    <div class="ar-dh">
      <div class="ar-bc">
        <span class="ar-back" onclick="renderApprovalRequired()">← Approval Required</span>
        <span class="ar-bc-sep">/</span>
        <code style="font-size:11px;color:#94a3b8">${item.id}</code>
      </div>
      <div class="ar-dh-row">
        <div class="ar-dh-title">${item.title}</div>
        <span class="ar-pill" style="background:${sc.bg};color:${sc.fg};font-size:12px;padding:4px 12px">${item.status}</span>
      </div>
      <div class="ar-chips">
        <span class="ar-pill" style="background:${rc.bg};color:${rc.fg}">${item.risk} Risk</span>
        <span class="ar-chip-blue">${item.circularId}</span>
        <span class="ar-chip-grey">${item.clauseRef}</span>
        <span class="ar-chip-grey">${item.dept}</span>
      </div>
    </div>

    <!-- Body -->
    <div class="ar-detail-body">

      <!-- Left: info -->
      <div class="ar-detail-left">
        <div class="ar-sec-label">Submission Details</div>
        ${_arDR('Action ID',     `<code class="ar-code">${item.id}</code>`)}
        ${_arDR('Submitted By',  item.submittedBy)}
        ${_arDR('Submitted On',  item.submittedOn)}
        ${_arDR('Department',    item.dept)}
        ${_arDR('Sent For',      `<span style="color:#6366f1;font-weight:700">${item.sendFor}</span>`)}

        <div class="ar-sec-label" style="margin-top:20px">Notes from Assignee</div>
        <div style="font-size:13px;color:#475569;line-height:1.7;border-left:2px solid #6366f1;padding-left:12px">
          ${item.notes}
        </div>

        <div class="ar-sec-label" style="margin-top:20px">Evidence Attached</div>
        ${item.evidence.length
          ? item.evidence.map(f=>`
            <div style="display:flex;align-items:center;gap:8px;padding:8px 0;border-bottom:1px solid #f1f5f9">
              <span style="font-size:16px">📎</span>
              <span style="font-size:13px;color:#0f172a;font-weight:500">${f}</span>
              <button class="ar-btn ar-btn-ghost ar-btn-sm" style="margin-left:auto">⬇ Download</button>
            </div>`).join('')
          : `<div style="color:#94a3b8;font-size:13px">No evidence attached</div>`}
      </div>

      <!-- Right: close action -->
      <div class="ar-detail-right">
        <div class="ar-close-box ${isClosed?'ar-closed-box':''}">
          ${isClosed ? `
            <div class="ar-closed-icon">✓</div>
            <div class="ar-closed-title">Action Closed</div>
            <div class="ar-closed-sub">You closed this action from your side.</div>
          ` : `
            <div class="ar-close-title">Close this Action</div>
            <div class="ar-close-sub">Review the submission above. If satisfied, close the action from your side.</div>
            <div class="ar-sec-label" style="margin-top:16px">Your Remarks</div>
            <textarea class="ar-input" rows="4" id="ar-remarks-${id}"
                      placeholder="Add closing remarks…"></textarea>
            <div style="margin-top:14px;display:flex;flex-direction:column;gap:8px">
              <button class="ar-btn ar-btn-close" onclick="arClose('${id}')">✓ Close Action</button>
              <button class="ar-btn ar-btn-reject" onclick="arSendBack('${id}')">↩ Send Back for Revision</button>
            </div>
          `}
        </div>
      </div>

    </div>
  </div>`;
};

/* ── ACTIONS ── */
window.arClose = function(id) {
  const item = AR_ITEMS.find(i=>i.id===id); if(!item) return;
  const remarks = document.getElementById(`ar-remarks-${id}`)?.value.trim();
  if (!remarks) { _arToast('Add closing remarks first','warn'); return; }
  item.status = 'Closed';
  _arToast('Action closed ✓');
  setTimeout(()=>arOpenDetail(id), 400);
};

window.arSendBack = function(id) {
  const item = AR_ITEMS.find(i=>i.id===id); if(!item) return;
  item.status = 'Sent Back';
  _arToast('Sent back for revision','warn');
  setTimeout(()=>renderApprovalRequired(), 400);
};

/* ── HELPERS ── */
function _arDR(l,v) {
  return `<div class="ar-drow">
    <span class="ar-dlbl">${l}</span>
    <span class="ar-dval">${v}</span>
  </div>`;
}
function _arRisk(r)   { return({High:{bg:'#fee2e2',fg:'#991b1b'},Medium:{bg:'#fef9c3',fg:'#854d0e'},Low:{bg:'#dcfce7',fg:'#166534'}})[r]||{bg:'#f1f5f9',fg:'#475569'}; }
function _arSC(s)     { return({'Pending Closure':{bg:'#fef9c3',fg:'#854d0e'},Closed:{bg:'#ecfdf5',fg:'#065f46'},'Sent Back':{bg:'#fee2e2',fg:'#991b1b'}})[s]||{bg:'#f1f5f9',fg:'#475569'}; }
function _arToast(msg,type='ok') {
  if(typeof showToast==='function'){showToast(msg,type==='ok'?'success':'warning');return;}
  const t=document.createElement('div');
  t.style.cssText=`position:fixed;bottom:24px;right:24px;z-index:9999;background:#1e293b;color:#fff;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:600;padding:11px 20px;border-radius:10px;box-shadow:0 6px 24px rgba(0,0,0,.2);opacity:0;transition:opacity .2s;`;
  t.textContent=msg;document.body.appendChild(t);
  requestAnimationFrame(()=>t.style.opacity='1');
  setTimeout(()=>{t.style.opacity='0';setTimeout(()=>t.remove(),300);},2400);
}

/* ── STYLES ── */
function _arStyles() {
  if (document.getElementById('ar-css')) return;
  const el = document.createElement('style'); el.id='ar-css';
  el.textContent = `
  #ar-root, #ar-detail { font-family:'DM Sans',sans-serif; }

  .ar-page-header { display:flex; align-items:flex-start; justify-content:space-between; flex-wrap:wrap; gap:12px; margin-bottom:20px; }
  .ar-page-title  { font-size:22px; font-weight:800; color:var(--text-primary,#0f172a); margin-bottom:3px; }
  .ar-page-sub    { font-size:13px; color:#64748b; }
  .ar-header-stats{ display:flex; gap:20px; }
  .ar-stat   { text-align:center; }
  .ar-stat-v { font-size:22px; font-weight:800; line-height:1; }
  .ar-stat-l { font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:.05em; color:#94a3b8; margin-top:2px; }

  /* Table */
  .ar-table-wrap { border:1px solid var(--border,#e2e8f0); border-radius:12px; overflow:hidden; background:#fff; }
  .ar-table { width:100%; border-collapse:collapse; font-size:13.5px; }
  .ar-table thead tr { background:#f8fafc; }
  .ar-table th { padding:10px 14px; font-size:10.5px; font-weight:700; text-transform:uppercase; letter-spacing:.06em; color:#94a3b8; border-bottom:1px solid var(--border,#e2e8f0); white-space:nowrap; }
  .ar-table td { padding:12px 14px; border-bottom:1px solid #f4f5f8; vertical-align:middle; }
  .ar-table tbody tr:last-child td { border-bottom:none; }
  .ar-row { cursor:pointer; transition:background .12s; }
  .ar-row:hover td { background:#f5f6ff; }

  .ar-id    { font-family:'DM Mono',monospace; font-size:11px; font-weight:600; background:#eef2ff; color:#4338ca; border:1px solid #c7d2fe; padding:2px 7px; border-radius:5px; }
  .ar-title { font-weight:600; font-size:13.5px; color:#0f172a; }
  .ar-sub   { font-size:11px; color:#94a3b8; margin-top:2px; }
  .ar-circ  { font-size:10.5px; font-weight:700; background:#eef2ff; color:#4338ca; border:1px solid #c7d2fe; padding:2px 7px; border-radius:4px; font-family:'DM Mono',monospace; }
  .ar-pill  { display:inline-block; font-size:11px; font-weight:700; padding:3px 9px; border-radius:99px; white-space:nowrap; }
  .ar-av    { width:26px; height:26px; border-radius:50%; background:#eef2ff; color:#4338ca; font-size:9px; font-weight:800; display:inline-flex; align-items:center; justify-content:center; border:1.5px solid #c7d2fe; flex-shrink:0; }

  /* Detail */
  .ar-dh { padding:0 0 16px; border-bottom:1px solid var(--border,#e2e8f0); margin-bottom:24px; }
  .ar-bc  { display:flex; align-items:center; gap:5px; font-size:12px; margin-bottom:8px; }
  .ar-back { color:#6366f1; font-weight:700; cursor:pointer; font-size:13px; }
  .ar-back:hover { text-decoration:underline; }
  .ar-bc-sep { color:#cbd5e1; }
  .ar-dh-row  { display:flex; align-items:flex-start; justify-content:space-between; gap:12px; margin-bottom:10px; }
  .ar-dh-title{ font-size:20px; font-weight:800; color:#0f172a; line-height:1.3; }
  .ar-chips   { display:flex; gap:6px; flex-wrap:wrap; align-items:center; }
  .ar-chip-blue{ font-size:11px; font-weight:700; padding:3px 9px; border-radius:99px; background:#eef2ff; color:#4338ca; border:1px solid #c7d2fe; }
  .ar-chip-grey{ font-size:11px; font-weight:700; padding:3px 9px; border-radius:99px; background:#f1f5f9; color:#64748b; border:1px solid #e2e8f0; }

  .ar-detail-body  { display:grid; grid-template-columns:1fr 340px; gap:32px; align-items:start; }
  .ar-detail-left  { display:flex; flex-direction:column; }
  .ar-detail-right { position:sticky; top:20px; }

  .ar-sec-label { font-size:10px; font-weight:800; text-transform:uppercase; letter-spacing:.08em; color:#94a3b8; margin-bottom:10px; display:flex; align-items:center; gap:8px; }
  .ar-sec-label::after { content:''; flex:1; height:1px; background:var(--border,#e2e8f0); }
  .ar-drow  { display:flex; align-items:baseline; gap:10px; padding:6px 0; border-bottom:1px solid #f1f5f9; }
  .ar-dlbl  { font-size:11px; font-weight:700; color:#94a3b8; min-width:90px; flex-shrink:0; }
  .ar-dval  { font-size:13px; color:#0f172a; }
  .ar-code  { font-family:'DM Mono',monospace; font-size:11px; background:#eef2ff; color:#4338ca; border:1px solid #c7d2fe; padding:2px 6px; border-radius:4px; }

  /* Close box */
  .ar-close-box {
    background:#f8fafc; border:1px solid var(--border,#e2e8f0);
    border-radius:12px; padding:20px;
  }
  .ar-closed-box {
    background:#f0fdf4; border-color:#86efac; text-align:center; padding:32px 20px;
  }
  .ar-closed-icon { font-size:40px; color:#10b981; margin-bottom:10px; }
  .ar-closed-title{ font-size:18px; font-weight:800; color:#166534; margin-bottom:6px; }
  .ar-closed-sub  { font-size:13px; color:#4ade80; }
  .ar-close-title { font-size:16px; font-weight:800; color:#0f172a; margin-bottom:6px; }
  .ar-close-sub   { font-size:13px; color:#64748b; line-height:1.6; }

  /* Buttons */
  .ar-btn { display:inline-flex; align-items:center; justify-content:center; gap:5px; font-family:inherit; font-size:13px; font-weight:700; padding:9px 18px; border-radius:8px; border:none; cursor:pointer; transition:all .15s; white-space:nowrap; width:100%; }
  .ar-btn-primary { background:#6366f1; color:#fff; }
  .ar-btn-primary:hover { background:#4f46e5; }
  .ar-btn-ghost   { background:#fff; color:#475569; border:1px solid var(--border,#e2e8f0); width:auto; }
  .ar-btn-ghost:hover { background:#f8fafc; }
  .ar-btn-close   { background:#10b981; color:#fff; }
  .ar-btn-close:hover { background:#059669; }
  .ar-btn-reject  { background:#fff; color:#ef4444; border:1px solid #fca5a5; }
  .ar-btn-reject:hover { background:#fee2e2; }
  .ar-btn-sm { padding:5px 11px; font-size:12px; border-radius:6px; width:auto; }

  /* Input */
  .ar-input { background:#fff; border:1px solid var(--border,#e2e8f0); border-radius:7px; color:#0f172a; font-family:inherit; font-size:13px; padding:8px 10px; outline:none; width:100%; transition:border-color .15s; resize:vertical; }
  .ar-input:focus { border-color:#6366f1; box-shadow:0 0 0 3px rgba(99,102,241,.08); }
  `;
  document.head.appendChild(el);
}