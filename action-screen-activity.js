/**
 * action-screen-activity.js — Activity Detail Panel
 * Reads from ACTD_DUMMY defined in my-items-activity.js
 * UI mirrors action-screen.js exactly. All functions prefixed 'actd'.
 */

let _actdTask = null;
let _actdTab  = 'overview';

/* ── GET ACTIVITY ────────────────────────────────────────────── */
function actdGetActivity(actId) {
  // direct lookup first
  if (typeof ACTD_DUMMY !== 'undefined' && ACTD_DUMMY[actId]) {
    return ACTD_DUMMY[actId];
  }
  console.warn('actdGetActivity: no entry found for', actId, '— available keys:', typeof ACTD_DUMMY !== 'undefined' ? Object.keys(ACTD_DUMMY) : 'ACTD_DUMMY not defined');
  return null;
}

/* ── OPEN ────────────────────────────────────────────────────── */
window.openActivityDetail = function(actId) {
  const act = actdGetActivity(actId);
  if (!act) {
    if (typeof showToast === 'function') showToast('Activity not found', 'warning');
    return;
  }
  _actdTask = act;
  _actdTab  = 'overview';
  actdInjectStyles();
  const area = document.getElementById('content-area');
  if (!area) return;
  area.innerHTML = `<div class="tds-full" id="tds-full">${actdBuildPanel(act)}</div>`;
  actdSwitchTab('overview');
};

/* ── CLOSE ───────────────────────────────────────────────────── */
window.closeActivityDetail = function() {
  _actdTask = null;
  const area = document.getElementById('content-area');
  if (!area) return;
  if (typeof renderMyItemsActivity === 'function') renderMyItemsActivity();
  else area.innerHTML = '<div style="padding:40px;text-align:center;color:#94a3b8">No renderer found.</div>';
};

/* ── NAVIGATE TO AI ──────────────────────────────────────────── */
window._actdGoToAI = function(circId) {
  if (typeof renderAISuggestionPage === 'function') renderAISuggestionPage(circId);
  else if (typeof window.CMS !== 'undefined' && window.CMS.navigateTo) window.CMS.navigateTo('ai-suggestion', circId);
};

/* ── PANEL SHELL ─────────────────────────────────────────────── */
function actdBuildPanel(a) {
  const sc = s => ({Complete:'#10b981','In Progress':'#f59e0b',Overdue:'#ef4444',Open:'#6366f1'})[s]||'#64748b';
  const sb = s => ({Complete:'#dcfce7','In Progress':'#fef9c3',Overdue:'#fee2e2',Open:'#eef2ff'})[s]||'#f1f5f9';

  const siblings  = Object.values(ACTD_DUMMY).filter(x => x.obligationId === a.obligationId);
  const doneCount = siblings.filter(x => x.status === 'Complete').length;
  const pct       = siblings.length ? Math.round(doneCount / siblings.length * 100) : 0;
  const pctColor  = pct === 100 ? '#10b981' : pct >= 50 ? '#f59e0b' : '#ef4444';

  return `
  <div class="tdp-wrap">

    <!-- STICKY HEADER -->
    <div class="tdp-header">
      <div class="tdp-hrow">
        <div style="min-width:0;flex:1">
          <div class="tdp-bc">
            <span class="tdp-back" onclick="closeActivityDetail()">← Activities</span>
            <span class="tdp-bc-sep">/</span>
           <!-- <span class="tdp-bc-id" style="color:#6366f1;font-weight:700;cursor:pointer"
                  onclick="openTaskDetail('${a.obligationId}')"
                  title="View Obligation">${a.obligationId} ↗</span>-->
            <span class="tdp-bc-sep">/</span>
            <span class="tdp-bc-id">${a.id}</span>
            <span style="margin-left:auto">
              <button class="tdp-hdr-btn" onclick="actdShowInfoModal('${a.id}')">ⓘ Refer to more</button>
            </span>
          </div>
          <div class="tdp-title">${a.name}</div>
        </div>
        
      </div>
    </div>

    <!-- BODY: left sidebar + vertical tabs + pane -->
    <div class="tdp-body">

     

      <!-- ── VERTICAL TABS ── -->
      <nav class="tdp-vtabs">
        ${[
          ['overview',   '◈',  'Overview'],
          ['evidence',   '📎', 'Evidence'],
          ['activities', '⊞',  'Activities'],
          ['comments',   '💬', 'Comments'],
        ].map(([id,ic,lb]) => `
          <button class="tdp-vtab" id="actd-vt-${id}" onclick="actdSwitchTab('${id}')">
            <span class="tdp-vt-icon">${ic}</span>
            <span class="tdp-vt-lbl">${lb}</span>
          </button>`).join('')}
      </nav>

      <!-- ── MAIN PANE ── -->
      <div class="tdp-pane" id="actd-pane"></div>

    </div>

  </div>`;
}


window.actdShowInfoModal = function(actId) {
  const a = ACTD_DUMMY[actId];
  if (!a) return;

  const existing = document.getElementById('actd-info-overlay');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.id = 'actd-info-overlay';
  overlay.className = 'tdp-lineage-overlay';
  overlay.onclick = e => { if (e.target === overlay) overlay.remove(); };

  overlay.innerHTML = `
  <div class="tdp-lineage-modal" style="max-width:720px">

    <!-- Head -->
    <div class="tdp-lineage-head">
      <div>
        <div class="tdp-lineage-eyebrow">Activity Profile</div>
        <div class="tdp-lineage-title">${a.id} — ${a.name}</div>
      </div>
      <button class="tdp-x" onclick="document.getElementById('actd-info-overlay').remove()">✕</button>
    </div>

    <div style="padding:22px 24px;overflow-y:auto;display:flex;flex-direction:column;gap:24px;max-height:72vh">

      <!-- About -->
      <div>
        <div class="tdp-info-section-lbl">About this Activity</div>
        <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;
                    padding:14px 16px;font-size:13.5px;color:#334155;line-height:1.75;">
          ${a.description || `This activity is part of obligation <strong>${a.obligationId}</strong> 
          under circular <strong>${a.circularId}</strong>. It is assigned to 
          <strong>${a.assignee}</strong> from the <strong>${a.dept}</strong> department 
          and is due by <strong>${actdFmtDate(a.dueDate)}</strong>. 
          The activity carries a <strong>${a.risk} risk</strong> rating and is 
          classified as <strong>${a.priority} priority</strong>.`}
        </div>
      </div>

      <!-- Regulatory Structure -->
      <div>
        <div class="tdp-info-section-lbl">Regulatory Structure</div>
        <div class="tdp-info-grid">
          ${actdInfoRow('Circular Ref',    `<span class="tdp-link" style="color:#6366f1;font-weight:700;cursor:pointer"
                                             onclick="_actdGoToAI('${a.circularId}');document.getElementById('actd-info-overlay').remove()">
                                             ${a.circularId} ↗</span>`)}
          ${actdInfoRow('Obligation',      `<span class="tdp-link" style="color:#6366f1;font-weight:700;cursor:pointer"
                                             onclick="openTaskDetail('${a.obligationId}');document.getElementById('actd-info-overlay').remove()">
                                             ${a.obligationId} — ${a.obligationTitle} ↗</span>`)}
          ${actdInfoRow('Clause No.',      a.clauseRef  || '—')}
          ${actdInfoRow('Regulatory Body', a.regulatoryBody || 'Reserve Bank of India (RBI)')}
          ${actdInfoRow('Frequency',       a.frequency  || 'One-Time')}
          ${actdInfoRow('Issue Date',      a.issueDate  || '—')}
        </div>

        <!-- Clause text -->
        ${a.clauseTitle ? `
        <div class="tdp-clause-block" style="margin-top:12px">
          <div class="tdp-clause-label">Clause Text — ${a.clauseRef}</div>
          <div class="tdp-clause-text">${a.clauseTitle}</div>
        </div>` : ''}
      </div>

      <!-- Classification -->
      <div>
        <div class="tdp-info-section-lbl">Classification</div>
        <div class="tdp-info-grid">
          ${actdInfoRow('Department',          a.dept       || '—')}
          ${actdInfoRow('Assigned To',         a.assignee   || '—')}
          ${actdInfoRow('Owner',               a.owner      || '—')}
          ${actdInfoRow('Reviewer',            a.reviewer   || '—')}
          ${actdInfoRow('Priority',            a.priority   || '—')}
          ${actdInfoRow('Risk Level',          a.risk       || '—')}
          ${actdInfoRow('Obligation Type',     a.obligationType || 'Mandatory')}
          ${actdInfoRow('Due Date',            actdFmtDate(a.dueDate))}
        </div>
      </div>

      // Inside the modal body, add this section after Classification:

      <!-- Document Reference -->
      <div>
        <div class="tdp-info-section-lbl">Document Reference</div>
        <div class="tdp-doc-card">
          <span class="tdp-doc-icon">📄</span>
          <div class="tdp-doc-info">
            <div class="tdp-doc-name">${a.circularId}_Master_Direction.pdf</div>
            <div class="tdp-doc-meta">Source regulatory circular for ${a.circularId}</div>
          </div>
          <button class="tdp-btn tdp-btn-ghost tdp-btn-sm"
                  onclick="(typeof showToast==='function')&&showToast('No document attached','warning')">
            View PDF
          </button>
        </div>
      </div>

    </div>

    <!-- Footer -->
    <div class="tdp-lineage-foot">
      <button class="tdp-btn tdp-btn-ghost"
              onclick="document.getElementById('actd-info-overlay').remove()">Close</button>
      <button class="tdp-btn tdp-btn-primary"
              onclick="_actdGoToAI('${a.circularId}');document.getElementById('actd-info-overlay').remove()">
        View AI Suggestions ↗
      </button>
    </div>

  </div>`;

  document.body.appendChild(overlay);
};

function actdInfoRow(label, value) {
  return `
  <div class="tdp-info-row">
    <span class="tdp-info-lbl">${label}</span>
    <span class="tdp-info-val">${value}</span>
  </div>`;
}

/* ── SWITCH TAB ──────────────────────────────────────────────── */
window.actdSwitchTab = function(tab) {
  _actdTab = tab;
  document.querySelectorAll('.tdp-vtab').forEach(b => b.classList.remove('active'));
  const btn = document.getElementById(`actd-vt-${tab}`);
  if (btn) btn.classList.add('active');
  const pane = document.getElementById('actd-pane');
  if (!pane || !_actdTask) return;
  const map = {
    overview:   actdPaneOverview,
    evidence:   actdPaneEvidence,
    activities: actdPaneActivities,
    comments:   actdPaneComments,
  };
  pane.innerHTML = (map[tab]||actdPaneOverview)(_actdTask);
  pane.style.animation = 'none';
  void pane.offsetHeight;
  pane.style.animation = 'tdpIn .2s ease';
};

/* ══════════════════════════════════════════════════════════════
   PANE: OVERVIEW — mirrors obligation overview exactly
   ══════════════════════════════════════════════════════════════ */
/* ══════════════════════════════════════════════════════════════
   PANE: OVERVIEW
   ══════════════════════════════════════════════════════════════ */
function actdDueDateColored(dateStr) {
  if (!dateStr) return `<span style="color:#94a3b8;font-weight:600">N/A</span>`;
  const due = new Date(dateStr), now = new Date();
  const diff = Math.ceil((due - now) / (1000*60*60*24));
  let color='#10b981', bg='#dcfce7';
  if (diff < 0)      { color='#ef4444'; bg='#fee2e2'; }
  else if (diff <= 7){ color='#f59e0b'; bg='#fef9c3'; }
  else if (diff > 60){ color='#94a3b8'; bg='#f1f5f9'; }
  return `<span style="background:${bg};color:${color};font-weight:700;padding:2px 9px;border-radius:99px;font-size:12px;">${actdFmtDate(dateStr)}</span>`;
}

function actdApplyActionStatus(act, type) {
  const cfg = {
    'Send for Clarification': { label:'💬 Sent for Clarification', color:'#854d0e', bg:'#fef9c3', border:'#fde68a', icon:'💬', time:'just now' },
    'Send for Closure':       { label:'✅ Sent for Closure',       color:'#166534', bg:'#dcfce7', border:'#86efac', icon:'✅', time:'just now' },
    'Send for Recall':        { label:'🔁 Sent for Recall',        color:'#991b1b', bg:'#fee2e2', border:'#fca5a5', icon:'🔁', time:'just now' },
  };
  act._actionStatus = cfg[type] || { label:type, color:'#475569', bg:'#f1f5f9', border:'#e2e8f0', icon:'→', time:'just now' };
  /* refresh list table cell if visible */
  const cell = document.getElementById(`act-action-cell-${act.id}`);
  if (cell) cell.innerHTML = `<span style="background:${act._actionStatus.bg};color:${act._actionStatus.color};border:1px solid ${act._actionStatus.border};padding:3px 10px;border-radius:99px;font-size:11px;font-weight:700;">${act._actionStatus.label}</span>`;
}

function actdToggleAcc(id) {
  const body = document.getElementById('actd-acc-' + id);
  const arr  = document.getElementById('actd-arr-' + id);
  if (!body) return;
  const open = body.style.display !== 'none';
  body.style.display = open ? 'none' : 'block';
  if (arr) arr.style.transform = open ? 'rotate(-90deg)' : 'rotate(0deg)';
}
window.actdToggleAcc = actdToggleAcc;

function actdPaneOverview(a) {
  const sc = s => ({Complete:'#10b981','In Progress':'#f59e0b',Overdue:'#ef4444',Open:'#6366f1'})[s]||'#64748b';
  const sb = s => ({Complete:'#dcfce7','In Progress':'#fef9c3',Overdue:'#fee2e2',Open:'#eef2ff'})[s]||'#f1f5f9';

  const wfSteps   = ['Assign','Draft','Execution','Review','Closed'];
  const wfIdx     = wfSteps.indexOf(a.workflowStage);
  const stepPeople = [
    { step:'Assign',    role:'Assignee', name:a.assignee||'—', dept:a.dept||'', level:1 },
    { step:'Draft',     role:'Owner',    name:a.owner   ||'—', dept:'',          level:2 },
    { step:'Execution', role:'Assignee', name:a.assignee||'—', dept:a.dept||'', level:3 },
    { step:'Review',    role:'Reviewer', name:a.reviewer||'—', dept:'',          level:4 },
    { step:'Closed',    role:'Approver', name:a.owner   ||'—', dept:'',          level:5 },
  ];

  if (!a._requests) a._requests = [];

  const actionStatus = a._actionStatus;
  const actionBannerHTML = actionStatus ? `
    <div style="display:flex;align-items:center;gap:10px;padding:10px 14px;border-radius:8px;margin-bottom:16px;
      background:${actionStatus.bg};border:1px solid ${actionStatus.border};font-size:13px;font-weight:600;color:${actionStatus.color};">
      ${actionStatus.icon} <span>${actionStatus.label}</span>
      <span style="margin-left:auto;font-size:11px;font-weight:500;opacity:.75;">${actionStatus.time}</span>
    </div>` : '';

  return `
  <div class="tdp-inner">

    ${actionBannerHTML}

    <!-- ① RAISE A REQUEST — open by default -->
    <div style="border:1px solid #e2e8f0;border-radius:10px;overflow:hidden;margin-bottom:12px;">
      <div onclick="actdToggleAcc('raise-req-${a.id}')" style="display:flex;align-items:center;justify-content:space-between;padding:13px 16px;background:#fff7ed;cursor:pointer;user-select:none;">
        <span style="font-size:12px;font-weight:800;color:#92400e;text-transform:uppercase;letter-spacing:.07em;display:flex;align-items:center;gap:8px;">
          <span style="width:3px;height:14px;background:#f59e0b;border-radius:2px;display:inline-block;"></span>
          Take Action 
        </span>
        <span id="actd-arr-raise-req-${a.id}" style="color:#94a3b8;font-size:14px;transition:transform .2s;">▼</span>
      </div>
      <div id="actd-acc-raise-req-${a.id}" style="border-top:1px solid #fde68a;background:#fff;">
        <div class="tdp-action-row-card" style="border:none;border-radius:0;box-shadow:none;">
          <div class="tdp-action-row-inner">
            <div class="tdp-ar-field">
              <label class="tdp-ar-label">Request Action</label>
              <select class="tdp-input tdp-ar-sel" id="actd-ar-type-${a.id}" onchange="actdArChange('${a.id}',this)">
                <option value="">— Select type —</option>
                <option value="Send for Clarification">Send for Clarification</option>
                <option value="Send for Closure">Send for Closure</option>
                <option value="Send for Recall">Send for Recall</option>
              </select>
            </div>
            <div class="tdp-ar-field">
              <label class="tdp-ar-label">Send To</label>
              <select class="tdp-input tdp-ar-sel" id="actd-ar-person-${a.id}">
                <option value="">— Select person —</option>
                ${a.assignee?`<option value="${a.assignee}"> ${a.assignee}</option>`:''}
                ${a.reviewer?`<option value="${a.reviewer}">${a.reviewer}</option>`:''}
                ${a.owner   ?`<option value="${a.owner}">${a.owner}</option>`:''}
              </select>
            </div>
            <button class="tdp-btn tdp-btn-primary" style="align-self:flex-end" onclick="actdArSubmit('${a.id}')">Send →</button>
          </div>
          <div style="padding:0 16px 12px;">
            <label class="tdp-ar-label">Note / Message</label>
            <textarea class="tdp-input" id="actd-ar-note-${a.id}" rows="3"
              placeholder="Describe the clarification needed or reason for closure…"
              style="width:100%;margin-top:4px;resize:vertical;line-height:1.6;"></textarea>
          </div>
          <div style="margin:0 16px 12px;padding:14px 16px;background:#f8fafc;border:1.5px dashed #cbd5e1;border-radius:8px;display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;">
            <div>
              <div style="font-size:13px;font-weight:700;color:#334155;">Attach Evidence (optional)</div>
              <div style="font-size:11px;color:#64748b;margin-top:2px;">Upload supporting documents for this request</div>
            </div>
            <label style="display:inline-flex;align-items:center;gap:7px;padding:8px 16px;background:#fff;border:1.5px solid #6366f1;border-radius:7px;font-size:12px;font-weight:700;color:#6366f1;cursor:pointer;white-space:nowrap;">
              📎 Attach File
              <input type="file" style="display:none;" onchange="actdArAttachWithScore(this,'${a.id}')"/>
            </label>
          </div>
          <div id="actd-ar-attach-list-${a.id}" style="margin:0 16px 12px;display:flex;flex-wrap:wrap;gap:6px;"></div>
          <div class="tdp-ar-status-note" id="actd-ar-note-disp-${a.id}" style="display:none;margin:0 16px 12px;border-radius:7px;"></div>
        </div>
      </div>
    </div>

    <!-- ② ACTIVITY DETAILS — collapsed -->
    <div style="border:1px solid #e2e8f0;border-radius:10px;overflow:hidden;margin-bottom:12px;">
      <div onclick="actdToggleAcc('act-details-${a.id}')" style="display:flex;align-items:center;justify-content:space-between;padding:13px 16px;background:#f8fafc;cursor:pointer;user-select:none;">
        <span style="font-size:12px;font-weight:800;color:#475569;text-transform:uppercase;letter-spacing:.07em;display:flex;align-items:center;gap:8px;">
          <span style="width:3px;height:14px;background:#6366f1;border-radius:2px;display:inline-block;"></span>
          Activity Details
        </span>
        <span id="actd-arr-act-details-${a.id}" style="color:#94a3b8;font-size:14px;transition:transform .2s;transform:rotate(-90deg);">▼</span>
      </div>
      <div id="actd-acc-act-details-${a.id}" style="display:none;padding:16px;border-top:1px solid #e2e8f0;background:#fff;">
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;">
          <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:10px 13px;">
            <div style="font-size:10px;font-weight:800;color:#94a3b8;text-transform:uppercase;letter-spacing:.07em;margin-bottom:5px;">Due Date</div>
            <div>${actdDueDateColored(a.dueDate)}</div>
          </div>
          <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:10px 13px;">
            <div style="font-size:10px;font-weight:800;color:#94a3b8;text-transform:uppercase;letter-spacing:.07em;margin-bottom:5px;">Department</div>
            <div style="font-size:13px;font-weight:600;color:#1e293b;">${a.dept||'—'}</div>
          </div>
          <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:10px 13px;">
            <div style="font-size:10px;font-weight:800;color:#94a3b8;text-transform:uppercase;letter-spacing:.07em;margin-bottom:5px;">Status</div>
            <span style="background:${sb(a.status)};color:${sc(a.status)};border:1px solid ${sc(a.status)}44;padding:3px 11px;border-radius:99px;font-size:12px;font-weight:700;">${a.status}</span>
          </div>
          <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:10px 13px;">
            <div style="font-size:10px;font-weight:800;color:#94a3b8;text-transform:uppercase;letter-spacing:.07em;margin-bottom:5px;">Assigned To</div>
            <div style="font-size:13px;font-weight:600;color:#1e293b;">${a.assignee||'—'}</div>
          </div>
          <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:10px 13px;grid-column:span 2;">
            <div style="font-size:10px;font-weight:800;color:#94a3b8;text-transform:uppercase;letter-spacing:.07em;margin-bottom:5px;">Parent Obligation</div>
            <span style="font-size:13px;font-weight:600;color:#6366f1;cursor:pointer;" onclick="openTaskDetail('${a.obligationId}')">${a.obligationId} — ${a.obligationTitle} ↗</span>
          </div>
          <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:10px 13px;grid-column:span 3;">
            <div style="font-size:10px;font-weight:800;color:#94a3b8;text-transform:uppercase;letter-spacing:.07em;margin-bottom:5px;">Action Taken</div>
            <span style="font-size:12px;font-weight:600;color:${a._actionStatus?a._actionStatus.color:'#94a3b8'}">
              ${a._actionStatus?a._actionStatus.label:'— No action yet —'}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- ③ WORKFLOW — collapsed -->
    <div style="border:1px solid #e2e8f0;border-radius:10px;overflow:hidden;">
      <div onclick="actdToggleAcc('workflow-${a.id}')" style="display:flex;align-items:center;justify-content:space-between;padding:13px 16px;background:#f8fafc;cursor:pointer;user-select:none;">
        <span style="font-size:12px;font-weight:800;color:#475569;text-transform:uppercase;letter-spacing:.07em;display:flex;align-items:center;gap:8px;">
          <span style="width:3px;height:14px;background:#10b981;border-radius:2px;display:inline-block;"></span>
          Workflow
        </span>
        <span id="actd-arr-workflow-${a.id}" style="color:#94a3b8;font-size:14px;transition:transform .2s;transform:rotate(-90deg);">▼</span>
      </div>
      <div id="actd-acc-workflow-${a.id}" style="display:none;border-top:1px solid #e2e8f0;background:#fff;">
        <div class="tdp-wf-details-card" style="border:none;border-radius:0;box-shadow:none;">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:4px">
            <span style="font-size:10px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:.07em">Current Level</span>
            <span style="background:#eef2ff;color:#4338ca;border:1px solid #c7d2fe;border-radius:20px;font-size:12px;font-weight:800;padding:3px 12px;">
              Level ${a.workflowLevel||0} — ${a.workflowStage||'—'}
            </span>
          </div>
          <div class="tdp-wf-stepper-people">
            ${wfSteps.map((st,i) => {
              const p = stepPeople[i];
              const done = i <= wfIdx, curr = st === a.workflowStage;
              return `
              <div class="tdp-wfsp-col ${done?'done':''} ${curr?'current':''}">
                <div class="tdp-wfsp-level-badge ${done?'done':''} ${curr?'current':''}">L${p.level}</div>
                <div class="tdp-wfsp-dot">${i < wfIdx ? '✓' : i+1}</div>
                <div class="tdp-wfsp-step-lbl">${st}</div>
                <div class="tdp-wfsp-person-card">
                  <span class="tdp-av tdp-av-sm">${actdInitials(p.name)}</span>
                  <div>
                    <div class="tdp-wfsp-role">${p.role}</div>
                    <div class="tdp-wfsp-name">${p.name}</div>
                    ${p.dept?`<div class="tdp-wfsp-dept">${p.dept}</div>`:''}
                  </div>
                </div>
              </div>
              ${i<wfSteps.length-1?`<div class="tdp-wfsp-connector ${i<wfIdx?'done':''}"></div>`:''}`;
            }).join('')}
          </div>
        </div>
      </div>
    </div>

  </div>`;
}

function actdReqRowHTML(r) {
  const statusMap = {
    Pending:   { bg:'#fef9c3', color:'#854d0e' },
    Responded: { bg:'#dcfce7', color:'#166534' },
    Closed:    { bg:'#f1f5f9', color:'#64748b' },
  };
  const st = statusMap[r.status] || { bg:'#eef2ff', color:'#4338ca' };

  return `
  <div style="display:flex;align-items:flex-start;gap:10px;padding:10px 12px;
              background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;">
    <div style="flex:1;min-width:0">
      <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:3px">
        <span style="font-size:12px;font-weight:700;color:#0f172a">${r.type}</span>
        <span style="font-size:11px;color:#94a3b8">→ ${r.to}</span>
        <span style="font-size:10px;color:#cbd5e1;margin-left:auto;white-space:nowrap">
          ${r.sentAt}
        </span>
      </div>
      ${r.note ? `
      <div style="font-size:12px;color:#475569;line-height:1.5;
                  font-style:italic;margin-top:2px">
        "${r.note}"
      </div>` : ''}
    </div>
    <span style="font-size:10px;font-weight:700;padding:3px 9px;border-radius:99px;
                 background:${st.bg};color:${st.color};white-space:nowrap;flex-shrink:0;
                 margin-top:1px">
      ${r.status}
    </span>
  </div>`;
}

function actdPaneActivities(a) {
  const sc = s => ({Complete:'#10b981','In Progress':'#f59e0b',Overdue:'#ef4444',Open:'#6366f1'})[s]||'#64748b';
  const sb = s => ({Complete:'#dcfce7','In Progress':'#fef9c3',Overdue:'#fee2e2',Open:'#eef2ff'})[s]||'#f1f5f9';

  const siblings  = Object.values(ACTD_DUMMY).filter(x => x.obligationId === a.obligationId);
  const doneCount = siblings.filter(x => x.status === 'Complete').length;
  const pct       = siblings.length ? Math.round(doneCount / siblings.length * 100) : 0;
  const pctColor  = pct === 100 ? '#10b981' : pct >= 50 ? '#f59e0b' : '#ef4444';

  return `
  <div class="tdp-inner">

    <!-- Obligation header -->
   
<!-- Section label -->
    <div class="tdp-section-label">Activities</div>

    <!-- Obligation context card -->
    <div style="display:flex;align-items:center;gap:12px;padding:12px 16px;
                background:#eef2ff;border:1px solid #c7d2fe;border-radius:10px;
                margin-bottom:16px">
      <div style="width:36px;height:36px;border-radius:8px;background:#6366f1;
                  display:flex;align-items:center;justify-content:center;
                  font-size:16px;flex-shrink:0">📋</div>
      <div style="min-width:0;flex:1">
        <div style="font-size:10px;font-weight:700;color:#6366f1;
                    text-transform:uppercase;letter-spacing:.07em;margin-bottom:2px">
          Parent Obligation
        </div>
        <div style="font-size:13px;font-weight:700;color:#0f172a;
                    white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
          ${a.obligationTitle}
        </div>
        <div style="font-size:11px;color:#6366f1;margin-top:1px">
          ${a.obligationId} · ${a.circularId}
        </div>
      </div>
      <!--<span style="font-size:11px;font-weight:700;cursor:pointer;color:#6366f1;
                   background:#fff;border:1px solid #c7d2fe;padding:5px 12px;
                   border-radius:7px;white-space:nowrap;flex-shrink:0"
            onclick="openTaskDetail('${a.obligationId}')">
        View Obligation ↗
      </span>-->
    </div>
    <!-- Progress bar -->
    <div style="background:#fff;border:1px solid var(--border,#e2e8f0);
                border-radius:10px;padding:14px 16px;margin-bottom:16px">
      <div style="display:flex;justify-content:space-between;
                  align-items:center;margin-bottom:8px">
        <span style="font-size:12px;font-weight:700;color:#475569">
          Overall Progress
        </span>
        <span style="font-size:13px;font-weight:800;color:${pctColor}">
          ${doneCount} / ${siblings.length} complete
        </span>
      </div>
      <div style="height:6px;background:#e2e8f0;border-radius:99px;overflow:hidden">
        <div style="height:100%;border-radius:99px;background:${pctColor};
                    width:${pct}%;transition:width .4s"></div>
      </div>
    </div>

    <!-- Activities table -->
    <div class="tdp-tbl-wrap">
      <table class="tdp-tbl">
        <thead>
          <tr>
            <th>Activity ID</th>
            <th>Activity Name</th>
            <th>Assigned To</th>
            <th>Department</th>
            <th>Due Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${siblings.map(s => {
            const isCurrent = s.id === a.id;
            return `
            <tr style="${isCurrent ? 'background:#eef2ff;' : ''}">
              <td>
                ${isCurrent
                  ? `<div style="display:flex;align-items:center;gap:6px">
                       <span style="font-family:monospace;font-size:12px;font-weight:800;
                                    color:#fff;background:#6366f1;border:1px solid #6366f1;
                                    padding:3px 8px;border-radius:6px;white-space:nowrap">
                         ${s.id}
                       </span>
                       <span style="font-size:9px;font-weight:800;color:#6366f1;
                                    background:#c7d2fe;padding:2px 6px;
                                    border-radius:99px;text-transform:uppercase;
                                    letter-spacing:.05em">you</span>
                     </div>`
                  : `<span style="font-family:monospace;font-size:12px;font-weight:700;
                                  color:#6366f1;background:#eef2ff;border:1px solid #c7d2fe;
                                  padding:3px 8px;border-radius:6px;cursor:pointer;
                                  white-space:nowrap"
                           onclick="openActivityDetail('${s.id}')">
                       ${s.id}
                     </span>`}
              </td>
              <td style="font-size:13px;font-weight:${isCurrent?'700':'500'};
                         max-width:200px;white-space:nowrap;overflow:hidden;
                         text-overflow:ellipsis"
                  title="${s.name}">${s.name}</td>
              <td style="font-size:12px">${s.assignee||'—'}</td>
              <td><span class="task-dept-chip">${s.dept||'—'}</span></td>
              <td style="font-size:12px">${actdFmtDate(s.dueDate)}</td>
              <td>
                <span style="font-size:11px;font-weight:700;padding:3px 10px;
                             border-radius:99px;background:${sb(s.status)};
                             color:${sc(s.status)}">
                  ${s.status}
                </span>
              </td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>
    </div>

  </div>`;
}

/* ══════════════════════════════════════════════════════════════
   PANE: EVIDENCE — mirrors obligation evidence exactly
   ══════════════════════════════════════════════════════════════ */
function actdPaneEvidence(a) {
  const uploadedEvs = (a.evidence || []).map(ev => ({ ...ev, activityName: a.name }));

  const DUMMY_EV = [
    { id:'ADEV-001', activityName:a.name, type:'Policy Document',  file:'Activity_SOP_v1.pdf',         uploadedBy:a.assignee||'Priya Nair',  date:'12 Jan 2025', status:'Verified',       score:92, scoreLabel:'Excellent', scoreBg:'#dcfce7', scoreColor:'#15803d' },
    { id:'ADEV-002', activityName:a.name, type:'Audit Report',     file:'Internal_Review_Q1.pdf',       uploadedBy:a.reviewer||'Anita Verma', date:'20 Jan 2025', status:'Pending Review', score:71, scoreLabel:'Good',      scoreBg:'#fef9c3', scoreColor:'#b45309' },
    { id:'ADEV-003', activityName:a.name, type:'Training Record',  file:'Staff_Completion_Log.xlsx',    uploadedBy:'Raj Iyer',               date:'05 Feb 2025', status:'Pending Review', score:55, scoreLabel:'Moderate',  scoreBg:'#fef3c7', scoreColor:'#d97706' },
    { id:'ADEV-004', activityName:a.name, type:'Board Resolution', file:'Board_Sign_Off.pdf',           uploadedBy:a.assignee||'Priya Nair',  date:'14 Feb 2025', status:'Verified',       score:87, scoreLabel:'Strong',   scoreBg:'#dcfce7', scoreColor:'#15803d' },
  ];

  const allEvs = [...uploadedEvs, ...DUMMY_EV];
  const sc  = s => s==='Verified'?'#10b981':'#f59e0b';
  const sb  = s => s==='Verified'?'#dcfce7':'#fef9c3';

  const avgScore = Math.round(allEvs.reduce((sum, e) => sum + (e.score||70), 0) / allEvs.length);
  const overallLabel = avgScore>=90?'Excellent':avgScore>=75?'Strong':avgScore>=60?'Good':'Needs Improvement';
  const overallColor = avgScore>=90?'#15803d':avgScore>=75?'#0369a1':avgScore>=60?'#b45309':'#dc2626';
  const overallBg    = avgScore>=90?'#dcfce7':avgScore>=75?'#dbeafe':avgScore>=60?'#fef9c3':'#fee2e2';

  return `
  <div class="tdp-inner">

    <!-- Header row -->
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;flex-wrap:wrap;gap:10px;">
      <div>
        <div style="font-size:12px;font-weight:800;color:#475569;text-transform:uppercase;letter-spacing:.07em;">Evidence Documents</div>
        <div style="font-size:13px;color:#64748b;margin-top:2px;">${allEvs.length} document${allEvs.length!==1?'s':''} uploaded</div>
      </div>
      <button onclick="actdToggleAddEv('${a.id}')"
        style="display:inline-flex;align-items:center;gap:7px;padding:9px 18px;background:#6366f1;color:#fff;border:none;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer;"
        onmouseover="this.style.background='#4f46e5'" onmouseout="this.style.background='#6366f1'">
        📎 Upload Evidence
      </button>
    </div>

    <!-- Add form (hidden by default) -->
    <div id="actd-add-ev-${a.id}"
         style="display:none;background:#fafbff;border:1px solid #c7d2fe;border-radius:9px;padding:16px;margin-bottom:16px;">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px;">
        <div class="tdp-ar-field">
          <label class="tdp-ar-label">Evidence Type</label>
          <select class="tdp-input" id="actd-ev-type-${a.id}">
            <option>Policy Document</option><option>Audit Report</option>
            <option>Training Records</option><option>Board Resolution</option>
            <option>System Log</option><option>Screenshot</option><option>Other</option>
          </select>
        </div>
        <div class="tdp-ar-field">
          <label class="tdp-ar-label">File / Link</label>
          <input class="tdp-input" id="actd-ev-file-${a.id}" placeholder="filename.pdf or https://…"/>
        </div>
      </div>

      <!-- AI hint -->
      <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:8px;padding:10px 14px;font-size:12px;color:#92400e;line-height:1.6;margin-bottom:10px;">
        💡 <strong>AI Relevance Scoring:</strong> Once uploaded, AI will analyse the document and assign a relevance score (0–100).
      </div>

      <div style="display:flex;gap:8px;justify-content:flex-end;">
        <button class="tdp-btn tdp-btn-ghost tdp-btn-sm" onclick="actdToggleAddEv('${a.id}')">Cancel</button>
        <button class="tdp-btn tdp-btn-primary tdp-btn-sm" onclick="actdSaveEvWithScore('${a.id}')">📎 Upload & Score</button>
      </div>
    </div>

    <!-- Score card -->
    <div style="background:linear-gradient(135deg,${overallBg} 0%,#fff 100%);border:1.5px solid #e2e8f0;border-radius:12px;padding:16px 20px;margin-bottom:16px;display:flex;align-items:center;gap:20px;flex-wrap:wrap;">
      <div style="text-align:center;flex-shrink:0;">
        <div style="width:72px;height:72px;border-radius:50%;background:${overallBg};border:3px solid ${overallColor};display:flex;flex-direction:column;align-items:center;justify-content:center;">
          <span style="font-size:22px;font-weight:800;color:${overallColor};line-height:1;">${avgScore}</span>
          <span style="font-size:8px;font-weight:700;color:${overallColor};text-transform:uppercase;letter-spacing:.04em;">Score</span>
        </div>
      </div>
      <div style="flex:1;min-width:180px;">
        <div style="font-size:14px;font-weight:800;color:#1e293b;">Evidence Relevance Score</div>
        <div style="font-size:12px;color:#64748b;margin-top:3px;line-height:1.6;">AI-assessed — <strong style="color:${overallColor};">${overallLabel}</strong></div>
        <div style="margin-top:10px;height:6px;background:#e2e8f0;border-radius:99px;overflow:hidden;">
          <div style="height:100%;width:${avgScore}%;background:${overallColor};border-radius:99px;"></div>
        </div>
      </div>
      <div style="display:flex;flex-direction:column;gap:6px;flex-shrink:0;">
        ${[['Verified',allEvs.filter(e=>e.status==='Verified').length,'#10b981'],['Pending',allEvs.filter(e=>e.status!=='Verified').length,'#f59e0b']].map(([l,n,c])=>`
        <div style="display:flex;align-items:center;gap:8px;">
          <span style="width:8px;height:8px;border-radius:50%;background:${c};display:inline-block;"></span>
          <span style="font-size:12px;font-weight:600;color:#334155;">${l}: ${n}</span>
        </div>`).join('')}
      </div>
    </div>

    <!-- Table -->
    <div style="border:1px solid #e2e8f0;border-radius:10px;overflow:hidden;overflow-x:auto;">
      <table style="width:100%;border-collapse:collapse;font-size:13px;min-width:700px;">
        <thead>
          <tr style="background:#f8fafc;border-bottom:2px solid #e2e8f0;">
            <th style="padding:11px 14px;text-align:left;font-size:10px;font-weight:800;color:#64748b;text-transform:uppercase;letter-spacing:.07em;">Activity</th>
            <th style="padding:11px 14px;text-align:left;font-size:10px;font-weight:800;color:#64748b;text-transform:uppercase;letter-spacing:.07em;">Type</th>
            <th style="padding:11px 14px;text-align:left;font-size:10px;font-weight:800;color:#64748b;text-transform:uppercase;letter-spacing:.07em;">File</th>
            <th style="padding:11px 14px;text-align:left;font-size:10px;font-weight:800;color:#64748b;text-transform:uppercase;letter-spacing:.07em;">Uploaded By</th>
            <th style="padding:11px 14px;text-align:left;font-size:10px;font-weight:800;color:#64748b;text-transform:uppercase;letter-spacing:.07em;">Date</th>
            <th style="padding:11px 14px;text-align:left;font-size:10px;font-weight:800;color:#64748b;text-transform:uppercase;letter-spacing:.07em;">AI Score</th>
            <th style="padding:11px 14px;text-align:left;font-size:10px;font-weight:800;color:#64748b;text-transform:uppercase;letter-spacing:.07em;">Status</th>
            
          </tr>
        </thead>
        <tbody>
          ${allEvs.map(ev => {
            const score = ev.score||70;
            const scoreBg    = ev.scoreBg    || (score>=80?'#dcfce7':score>=60?'#fef9c3':'#fee2e2');
            const scoreColor = ev.scoreColor || (score>=80?'#15803d':score>=60?'#b45309':'#dc2626');
            return `
            <tr style="border-bottom:1px solid #f1f5f9;" onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='transparent'">
              <td style="padding:12px 14px;max-width:160px;">
                <span style="font-size:12px;font-weight:600;color:#1e293b;display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${ev.activityName||a.name}</span>
              </td>
              <td style="padding:12px 14px;">
                <span style="background:#ede9fe;color:#6d28d9;padding:2px 9px;border-radius:10px;font-size:11px;font-weight:700;">${ev.type}</span>
              </td>
              <td style="padding:12px 14px;font-size:12px;color:#334155;">${actdFIcon(ev.file)} <span style="font-weight:500;">${ev.file}</span></td>
              <td style="padding:12px 14px;font-size:12px;color:#64748b;">${ev.uploadedBy}</td>
              <td style="padding:12px 14px;font-size:12px;color:#94a3b8;white-space:nowrap;">${ev.date}</td>
              <td style="padding:12px 14px;">
                <div style="display:flex;align-items:center;gap:7px;">
                  <div style="width:36px;height:36px;border-radius:50%;background:${scoreBg};border:2px solid ${scoreColor};display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;color:${scoreColor};flex-shrink:0;">${score}</div>
                  <div>
                    <div style="height:4px;background:#e2e8f0;border-radius:99px;overflow:hidden;width:60px;">
                      <div style="height:100%;width:${score}%;background:${scoreColor};border-radius:99px;"></div>
                    </div>
                    <div style="font-size:10px;color:${scoreColor};font-weight:700;margin-top:2px;">${ev.scoreLabel||(score>=80?'Strong':score>=60?'Good':'Moderate')}</div>
                  </div>
                </div>
              </td>
              <td style="padding:12px 14px;">
                <span style="background:${sb(ev.status)};color:${sc(ev.status)};padding:3px 10px;border-radius:10px;font-size:11px;font-weight:700;">${ev.status==='Verified'?'✓ ':''}${ev.status}</span>
              </td>
             
            </tr>`;
          }).join('')}
        </tbody>
      </table>
    </div>

  </div>`;
}
/* ══════════════════════════════════════════════════════════════
   PANE: COMMENTS — mirrors obligation comments exactly
   ══════════════════════════════════════════════════════════════ */
function actdPaneComments(a) {
  return `
  <div class="tdp-inner">
    <div class="tdp-section-label">Comments & Updates</div>
    <div class="tdp-thread" id="actd-thread-${a.id}">
      ${(a._comments||[]).map(c => actdCmtHTML(c)).join('')}
    </div>
    <div class="tdp-new-cmt">
      <span class="tdp-av tdp-self-av">YO</span>
      <div style="flex:1">
        <textarea class="tdp-input" id="actd-cmt-${a.id}" rows="3"
                  placeholder="Add a comment, update, or question…"></textarea>
        <div style="display:flex;justify-content:flex-end;margin-top:8px">
          <button class="tdp-btn tdp-btn-primary"
                  onclick="actdPostCmt('${a.id}')">Post Comment</button>
        </div>
      </div>
    </div>
  </div>`;
}

function actdCmtHTML(c) {
  return `
  <div class="tdp-cmt">
    <span class="tdp-av">${actdInitials(c.author)}</span>
    <div class="tdp-cmt-body">
      <div class="tdp-cmt-meta">
        <strong>${c.author}</strong>
        <span class="tdp-cmt-role">${c.role}</span>
        <span class="tdp-cmt-time">${c.time}</span>
      </div>
      <div class="tdp-cmt-text">${c.text}</div>
    </div>
  </div>`;
}

/* ── HANDLERS ────────────────────────────────────────────────── */
window.actdSetStatus = function(sel, actId) {
  if (ACTD_DUMMY[actId]) ACTD_DUMMY[actId].status = sel.value;
  if (_actdTask && _actdTask.id === actId) _actdTask.status = sel.value;
  const c = ({Complete:'#10b981','In Progress':'#f59e0b',Overdue:'#ef4444',Open:'#6366f1'})[sel.value]||'#64748b';
  sel.style.color=c; sel.style.borderColor=c+'44'; sel.style.background=c+'10';
  if (typeof showToast==='function') showToast(`Status → "${sel.value}"`,'success');
};

window.actdArChange = function(actId, sel) {
  const nd = document.getElementById(`actd-ar-note-disp-${actId}`);
  if (!nd) return;
  const notes = {
    'Send for Clarification': { bg:'#fef9c3', color:'#854d0e', text:'A clarification request will be sent. Activity stays open until resolved.' },
    'Send for Closure':       { bg:'#dcfce7', color:'#166534', text:'A closure request will be sent to your reviewer for approval.' },
    'Send for Recall':        { bg:'#fee2e2', color:'#991b1b', text:'The activity will be recalled and the selected person notified.' },
  };
  const n = notes[sel.value];
  if (n) { nd.style.display='block'; nd.style.background=n.bg; nd.style.color=n.color; nd.textContent=n.text; }
  else   { nd.style.display='none'; }

  if (document.body?.dataset?.userRole === 'assignee') {
    const personSel = document.getElementById(`actd-ar-person-${actId}`);
    if (!personSel) return;
    const a = (typeof ACTD_DUMMY !== 'undefined' && ACTD_DUMMY[actId]) ? ACTD_DUMMY[actId] : {};
    if (sel.value === 'Ask for Closure') {
      personSel.innerHTML = `
        <option value="">— Select person —</option>
        <option value="Priya Sharma">SPOC: Priya Sharma</option>
        ${a.reviewer ? `<option value="${a.reviewer}">Reviewer: ${a.reviewer}</option>` : ''}
        ${a.owner    ? `<option value="${a.owner}">Owner / Approver: ${a.owner}</option>` : ''}
      `;
    } else {
      personSel.innerHTML = `
        <option value="">— Select person —</option>
        ${a.assignee ? `<option value="${a.assignee}"> ${a.assignee}</option>` : ''}
        ${a.reviewer ? `<option value="${a.reviewer}"> ${a.reviewer}</option>` : ''}
        ${a.owner    ? `<option value="${a.owner}">${a.owner}</option>` : ''}
      `;
    }
  }
};

window.actdArAttachWithScore = function(input, actId) {
  const file = input.files[0]; if (!file) return;
  const list = document.getElementById(`actd-ar-attach-list-${actId}`);
  if (list) {
    const chip = document.createElement('div');
    chip.style.cssText = 'display:inline-flex;align-items:center;gap:6px;padding:4px 10px;background:#f1f5f9;border:1px solid #e2e8f0;border-radius:20px;font-size:12px;font-weight:600;color:#334155;';
    chip.innerHTML = `${actdFIcon(file.name)} ${file.name} <button onclick="this.parentElement.remove()" style="background:none;border:none;color:#94a3b8;cursor:pointer;font-size:14px;line-height:1;">×</button>`;
    list.appendChild(chip);
  }
  const aiScore = Math.floor(60 + Math.random() * 38);
  const scoreLabel = aiScore >= 90 ? 'Excellent' : aiScore >= 75 ? 'Strong' : aiScore >= 60 ? 'Good' : 'Moderate';
  const scoreColor = aiScore >= 80 ? '#15803d' : aiScore >= 60 ? '#b45309' : '#dc2626';
  const toastDiv = document.createElement('div');
  toastDiv.style.cssText = `position:fixed;bottom:28px;right:28px;z-index:9999;background:#fff;border:1.5px solid #e2e8f0;border-radius:12px;padding:16px 20px;box-shadow:0 8px 28px rgba(0,0,0,.14);max-width:320px;animation:tdpIn .22s ease;display:flex;flex-direction:column;gap:8px;`;
  toastDiv.innerHTML = `
    <div style="display:flex;align-items:center;gap:10px;">
      <div style="width:46px;height:46px;border-radius:50%;background:${aiScore>=80?'#dcfce7':aiScore>=60?'#fef9c3':'#fee2e2'};border:2px solid ${scoreColor};display:flex;align-items:center;justify-content:center;font-size:15px;font-weight:800;color:${scoreColor};flex-shrink:0;">${aiScore}</div>
      <div>
        <div style="font-size:13px;font-weight:700;color:#1e293b;">Evidence Attached ✓</div>
        <div style="font-size:11px;color:${scoreColor};font-weight:700;">AI Relevance Score: ${aiScore}/100 — ${scoreLabel}</div>
      </div>
    </div>
    <div style="height:5px;background:#e2e8f0;border-radius:99px;overflow:hidden;">
      <div style="height:100%;width:${aiScore}%;background:${scoreColor};border-radius:99px;"></div>
    </div>
    <div style="font-size:11px;color:#64748b;line-height:1.5;">${aiScore>=75?'Strong alignment detected.':'Some gaps — consider adding additional supporting documents.'}</div>`;
  document.body.appendChild(toastDiv);
  setTimeout(() => toastDiv.remove(), 6000);
};

window.actdArSubmit = function(actId) {
  const type   = document.getElementById(`actd-ar-type-${actId}`)?.value;
  const person = document.getElementById(`actd-ar-person-${actId}`)?.value;
  const noteEl = document.getElementById(`actd-ar-note-${actId}`);
  const note   = noteEl?.value.trim();

  if (!type)   { if (typeof showToast==='function') showToast('Select a request type','warning'); return; }
  if (!person) { if (typeof showToast==='function') showToast('Select a person to send to','warning'); return; }

  const req = {
    id:     `REQ-${Date.now().toString().slice(-5)}`,
    type,
    to:     person,
    note:   note || '',
    sentAt: new Date().toLocaleString('en-IN',{
              day:'2-digit', month:'short',
              hour:'2-digit', minute:'2-digit'
            }),
    status: 'Pending',
  };

  // write to data
  const a = ACTD_DUMMY[actId];
  if (a) { if (!a._requests) a._requests=[]; a._requests.push(req); }
  if (_actdTask && _actdTask.id===actId) {
    if (!_actdTask._requests) _actdTask._requests=[];
    _actdTask._requests.push(req);
  }

  /* apply action status */
  if (a) actdApplyActionStatus(a, type);
  if (_actdTask && _actdTask.id === actId) actdApplyActionStatus(_actdTask, type);
  /* re-render to show banner */
  actdSwitchTab('overview');

  // show thread container
  const thread = document.getElementById(`actd-req-thread-${actId}`);
  if (thread) thread.style.display = 'block';

  // append row to list
  const list = document.getElementById(`actd-req-list-${actId}`);
  if (list) {
    const d = document.createElement('div');
    d.innerHTML = actdReqRowHTML(req);
    const node = d.firstChild;
    node.style.animation = 'tdpIn .2s ease';
    list.appendChild(node);
    node.scrollIntoView({ behavior:'smooth', block:'nearest' });
  }

  // update count badge
  const countBadge = document.getElementById(`actd-req-count-${actId}`);
  if (countBadge) {
    const total = (ACTD_DUMMY[actId]?._requests||[]).length;
    countBadge.textContent = `${total} sent`;
  }

  if (typeof showToast==='function') showToast(`"${type}" sent to ${person} ✓`,'success');

  // clear form
  document.getElementById(`actd-ar-type-${actId}`).value   = '';
  document.getElementById(`actd-ar-person-${actId}`).value = '';
  if (noteEl) noteEl.value = '';
  const disp = document.getElementById(`actd-ar-note-disp-${actId}`);
  if (disp) disp.style.display = 'none';
};

window.actdToggleAddEv = function(actId) {
  const f = document.getElementById(`actd-add-ev-${actId}`);
  if (f) f.style.display = f.style.display==='none' ? 'block' : 'none';
};

window.actdSaveEvWithScore = function(actId) {
  const a = ACTD_DUMMY[actId]; if (!a) return;
  const file = document.getElementById(`actd-ev-file-${actId}`)?.value.trim();
  if (!file) { if (typeof showToast==='function') showToast('Enter a file or link','warning'); return; }
  const ev = {
    id:         `ADEV-${Date.now().toString().slice(-5)}`,
    type:       document.getElementById(`actd-ev-type-${actId}`)?.value || 'Document',
    file, activityName: a.name,
    status:     'Pending Review',
    uploadedBy: 'You',
    date:       new Date().toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'})
  };
  a.evidence.push(ev);
  if (_actdTask && _actdTask.id===actId) _actdTask.evidence.push(ev);

  document.getElementById(`actd-add-ev-${actId}`)?.style && (document.getElementById(`actd-add-ev-${actId}`).style.display='none');

  /* score popup */
  const aiScore = Math.floor(60 + Math.random() * 38);
  const scoreLabel = aiScore>=90?'Excellent':aiScore>=75?'Strong':aiScore>=60?'Good':'Moderate';
  const scoreColor = aiScore>=80?'#15803d':aiScore>=60?'#b45309':'#dc2626';
  const toastDiv = document.createElement('div');
  toastDiv.style.cssText = `position:fixed;bottom:28px;right:28px;z-index:9999;background:#fff;border:1.5px solid #e2e8f0;border-radius:12px;padding:16px 20px;box-shadow:0 8px 28px rgba(0,0,0,.14);max-width:320px;animation:tdpIn .22s ease;display:flex;flex-direction:column;gap:8px;`;
  toastDiv.innerHTML = `
    <div style="display:flex;align-items:center;gap:10px;">
      <div style="width:46px;height:46px;border-radius:50%;background:${aiScore>=80?'#dcfce7':aiScore>=60?'#fef9c3':'#fee2e2'};border:2px solid ${scoreColor};display:flex;align-items:center;justify-content:center;font-size:15px;font-weight:800;color:${scoreColor};flex-shrink:0;">${aiScore}</div>
      <div>
        <div style="font-size:13px;font-weight:700;color:#1e293b;">Evidence Uploaded ✓</div>
        <div style="font-size:11px;color:${scoreColor};font-weight:700;">AI Relevance Score: ${aiScore}/100 — ${scoreLabel}</div>
      </div>
    </div>
    <div style="height:5px;background:#e2e8f0;border-radius:99px;overflow:hidden;">
      <div style="height:100%;width:${aiScore}%;background:${scoreColor};border-radius:99px;"></div>
    </div>
    <div style="font-size:11px;color:#64748b;line-height:1.5;">${aiScore>=75?'Strong alignment detected.':'Some gaps — consider adding additional supporting documents.'}</div>`;
  document.body.appendChild(toastDiv);
  setTimeout(() => toastDiv.remove(), 6000);

  actdSwitchTab('evidence');
};

window.actdSaveEv = window.actdSaveEvWithScore;

window.actdVerifyEv = function(evId, actId) {
  const a = ACTD_DUMMY[actId]; if (!a) return;
  const ev = (a.evidence||[]).find(e => e.id===evId);
  if (ev) {
    ev.status = 'Verified';
    if (_actdTask && _actdTask.id===actId) {
      const lev = (_actdTask.evidence||[]).find(e => e.id===evId);
      if (lev) lev.status = 'Verified';
    }
    if (typeof showToast==='function') showToast('Marked Verified ✓','success');
  }
  actdSwitchTab('evidence');
};

window.actdPostCmt = function(actId) {
  const a  = ACTD_DUMMY[actId]; if (!a) return;
  const el = document.getElementById(`actd-cmt-${actId}`);
  const text = el?.value.trim();
  if (!text) { if (typeof showToast==='function') showToast('Type something first','warning'); return; }
  const c = { author:'You', role:'Current User', time:'just now', text };
  if (!a._comments) a._comments=[];
  a._comments.push(c);
  if (_actdTask && _actdTask.id===actId) _actdTask._comments.push(c);
  const thread = document.getElementById(`actd-thread-${actId}`);
  if (thread) {
    const d = document.createElement('div');
    d.innerHTML = actdCmtHTML(c);
    const node = d.firstChild;
    node.style.animation = 'tdpCmt .22s ease';
    thread.appendChild(node);
    el.value = '';
    node.scrollIntoView({behavior:'smooth',block:'nearest'});
  }
  if (typeof showToast==='function') showToast('Comment posted','success');
};

/* ── HELPERS ─────────────────────────────────────────────────── */
function actdRow(lbl, val) {
  return `<div class="tdp-drow">
    <span class="tdp-dlbl">${lbl}</span>
    <span class="tdp-dval">${val}</span>
  </div>`;
}
function actdInitials(n){ return (n||'?').split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2); }
function actdFIcon(f=''){
  const e=(f.split('.').pop()||'').toLowerCase();
  return ({pdf:'📄',zip:'🗜',xlsx:'📊',xls:'📊',docx:'📝',doc:'📝',png:'🖼',jpg:'🖼'})[e]||'📄';
}
function actdFmtDate(d){
  if(!d) return '—';
  return new Date(d).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'});
}

/* ── STYLES — adds only what action-screen.js doesn't already have ── */
function actdInjectStyles() {
  if (document.getElementById('actd-styles')) return;
  const s = document.createElement('style');
  s.id = 'actd-styles';
  s.textContent = `
  @keyframes tdpIn  { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }
  @keyframes tdpCmt { from{opacity:0;transform:translateY(5px)} to{opacity:1;transform:none} }
  @keyframes fadeIn { from{opacity:0} to{opacity:1} }

  /* INFO MODAL */
  /* DOC CARD */
  /* ── LEFT SIDEBAR ─────────────────────────────────────────── */
  .actd-sidebar {
    width: 220px;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    border-right: 1px solid var(--border, #e2e8f0);
    background: #fff;
    overflow-y: auto;
  }
  .actd-sidebar::-webkit-scrollbar { width: 3px; }
  .actd-sidebar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 99px; }

  .actd-sidebar-head {
    padding: 14px 14px 10px;
    border-bottom: 1px solid var(--border, #e2e8f0);
    background: #f8fafc;
  }
  .actd-sidebar-title {
    font-size: 11px; font-weight: 800; text-transform: uppercase;
    letter-spacing: .07em; color: #475569; margin-bottom: 3px;
  }
  .actd-sidebar-sub {
    font-size: 11px; font-weight: 500; color: #94a3b8;
    line-height: 1.4; white-space: nowrap; overflow: hidden;
    text-overflow: ellipsis;
  }

  .actd-sidebar-progress {
    padding: 10px 14px;
    border-bottom: 1px solid #f1f5f9;
  }
  .actd-sidebar-prog-row {
    display: flex; justify-content: space-between;
    align-items: center; margin-bottom: 6px;
  }
  .actd-sidebar-prog-lbl {
    font-size: 10px; font-weight: 700; color: #94a3b8;
    text-transform: uppercase; letter-spacing: .06em;
  }
  .actd-sidebar-prog-val {
    font-size: 11px; font-weight: 800;
  }
  .actd-sidebar-prog-track {
    height: 5px; background: #e2e8f0;
    border-radius: 99px; overflow: hidden;
  }

  .actd-sidebar-list {
    display: flex; flex-direction: column;
    padding: 8px 8px; gap: 4px; flex: 1;
  }

  .actd-sidebar-item {
    padding: 10px 10px;
    border-radius: 8px;
    border: 1px solid transparent;
    transition: all .15s;
  }
  .actd-sidebar-item:hover:not(.actd-sidebar-item-active) {
    background: #f8fafc;
    border-color: #e2e8f0;
  }
  .actd-sidebar-item-active {
    background: #eef2ff;
    border-color: #c7d2fe;
  }

  .actd-sidebar-item-top {
    display: flex; align-items: center;
    justify-content: space-between; margin-bottom: 4px;
  }
  .actd-sidebar-item-id {
    font-family: monospace; font-size: 10px; font-weight: 800;
    color: #6366f1; background: #eef2ff; border: 1px solid #c7d2fe;
    padding: 1px 6px; border-radius: 4px;
  }
  .actd-sidebar-item-active .actd-sidebar-item-id {
    background: #6366f1; color: #fff; border-color: #6366f1;
  }
  .actd-sidebar-you {
    font-size: 9px; font-weight: 800; color: #6366f1;
    background: #c7d2fe; padding: 1px 6px; border-radius: 99px;
    text-transform: uppercase; letter-spacing: .05em;
  }
  .actd-sidebar-item-name {
    font-size: 12px; font-weight: 600; color: #0f172a;
    line-height: 1.4; margin-bottom: 6px;
    display: -webkit-box; -webkit-line-clamp: 2;
    -webkit-box-orient: vertical; overflow: hidden;
  }
  .actd-sidebar-item-meta {
    display: flex; align-items: center;
    justify-content: space-between; flex-wrap: wrap; gap: 4px;
  }
  .actd-sidebar-status-pill {
    font-size: 9px; font-weight: 700;
    padding: 2px 7px; border-radius: 99px;
    white-space: nowrap;
  }
  .tdp-doc-card{display:flex;align-items:center;gap:12px;padding:12px 14px;background:#fff;border:1px solid var(--border,#e2e8f0);border-radius:8px;}
  .tdp-doc-icon{font-size:22px;flex-shrink:0;}
  .tdp-doc-info{flex:1;min-width:0;}
  .tdp-doc-name{font-size:13px;font-weight:600;color:#0f172a;}
  .tdp-doc-meta{font-size:11px;color:#94a3b8;margin-top:2px;}
  .tdp-info-section-lbl{font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.08em;color:#94a3b8;margin-bottom:12px;padding-bottom:6px;border-bottom:1px solid #e2e8f0;}
  .tdp-info-grid{display:grid;grid-template-columns:1fr 1fr;gap:2px;}
  .tdp-info-row{display:flex;flex-direction:column;gap:3px;padding:9px 10px;border-radius:7px;transition:background .1s;}
  .tdp-info-row:hover{background:#f8fafc;}
  .tdp-info-lbl{font-size:10px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:.06em;}
  .tdp-info-val{font-size:13px;font-weight:500;color:#0f172a;line-height:1.5;}
  /* LINEAGE OVERLAY (reused for info modal) */
  .tdp-lineage-overlay{position:fixed;inset:0;background:rgba(15,23,42,.5);backdrop-filter:blur(3px);z-index:9000;display:flex;align-items:center;justify-content:center;animation:fadeIn .2s ease;}
  .tdp-lineage-modal{background:#fff;border-radius:14px;width:100%;max-width:560px;box-shadow:0 24px 64px rgba(15,23,42,.25);display:flex;flex-direction:column;overflow:hidden;max-height:90vh;}
  .tdp-lineage-head{display:flex;align-items:flex-start;justify-content:space-between;padding:20px 22px 16px;border-bottom:1px solid var(--border,#e2e8f0);background:#f8fafc;}
  .tdp-lineage-eyebrow{font-size:10px;font-weight:700;color:#6366f1;text-transform:uppercase;letter-spacing:.08em;margin-bottom:5px;}
  .tdp-lineage-title{font-size:14px;font-weight:800;color:#0f172a;line-height:1.4;}
  .tdp-lineage-foot{display:flex;gap:8px;justify-content:flex-end;padding:14px 22px;border-top:1px solid var(--border,#e2e8f0);background:#f8fafc;}
  .tdp-hdr-btn{padding:6px 12px;background:#fff;border:1px solid var(--border,#e2e8f0);border-radius:7px;font-family:inherit;font-size:11px;font-weight:600;color:#475569;cursor:pointer;transition:all .14s;white-space:nowrap;}
  .tdp-hdr-btn:hover{border-color:#6366f1;color:#6366f1;background:#eef2ff;}
  .tdp-x{flex-shrink:0;background:transparent;border:1px solid var(--border,#e2e8f0);color:#94a3b8;border-radius:7px;width:32px;height:32px;cursor:pointer;font-size:13px;display:flex;align-items:center;justify-content:center;transition:all .15s;}
  .tdp-x:hover{background:#fee2e2;color:#ef4444;border-color:#fca5a5;}
  .tds-full{width:100%;min-height:100%;}
  .tdp-wrap{display:flex;flex-direction:column;min-height:100vh;font-family:'DM Sans',sans-serif;}
  .tdp-header{padding:20px 22px 14px;border-bottom:1px solid var(--border,#e2e8f0);background:#fff;position:sticky;top:0;z-index:20;box-shadow:0 1px 6px rgba(0,0,0,.06);}
  .tdp-hrow{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:10px;}
  .tdp-bc{display:flex;align-items:center;gap:6px;font-size:13px;margin-bottom:6px;}
  .tdp-back{color:#6366f1;font-weight:700;cursor:pointer;font-size:14px;}
  .tdp-back:hover{text-decoration:underline;}
  .tdp-bc-sep{color:#cbd5e1;}
  .tdp-bc-id{font-family:monospace;font-size:12px;color:#94a3b8;}
  .tdp-title{font-size:20px;font-weight:800;color:var(--text-primary,#0f172a);line-height:1.3;}
  .tdp-st-sel{font-size:13px;font-weight:700;padding:4px 10px;border-radius:7px;border:1.5px solid;cursor:pointer;outline:none;font-family:inherit;transition:all .15s;}
  .tdp-body{display:flex;flex:1;min-height:0;}
  .tdp-vtabs{width:84px;flex-shrink:0;display:flex;flex-direction:column;gap:2px;padding:14px 6px;border-right:1px solid var(--border,#e2e8f0);background:#f8fafc;}
  .tdp-vtab{display:flex;flex-direction:column;align-items:center;gap:4px;padding:11px 4px;border-radius:8px;border:none;background:transparent;cursor:pointer;color:#1e293b;font-family:inherit;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.3px;transition:all .15s;text-align:center;}
  .tdp-vtab:hover{background:#e2e8f0;color:#1e293b;}
  .tdp-vtab.active{background:#1e293b;color:#fff;}
  .tdp-vt-icon{font-size:18px;line-height:1;}
  .tdp-vt-lbl{line-height:1.2;font-size:10px;}
  .tdp-pane{flex:1;overflow-y:auto;animation:tdpIn .2s ease;background:#fafbff;}
  .tdp-pane::-webkit-scrollbar{width:4px;} .tdp-pane::-webkit-scrollbar-thumb{background:#e2e8f0;border-radius:99px;}
  .tdp-inner{padding:22px 24px 48px;}
  .tdp-section-label{font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.08em;color:#94a3b8;margin-bottom:14px;display:flex;align-items:center;gap:10px;}
  .tdp-section-label::after{content:'';flex:1;height:1px;background:var(--border,#e2e8f0);}
  .tdp-dl{display:flex;flex-direction:column;gap:2px;}
  .tdp-drow{display:flex;align-items:baseline;gap:12px;padding:8px 10px;border-radius:7px;transition:background .1s;}
  .tdp-drow:hover{background:#f1f5f9;}
  .tdp-dlbl{font-size:12px;font-weight:700;color:#94a3b8;min-width:110px;flex-shrink:0;}
  .tdp-dval{font-size:14px;font-weight:500;color:var(--text-primary,#0f172a);}
  .tdp-link{color:#6366f1;cursor:pointer;font-weight:600;} .tdp-link:hover{text-decoration:underline;}
  .tdp-code{font-family:monospace;font-size:12px;background:#eef2ff;color:#4338ca;border:1px solid #c7d2fe;padding:2px 8px;border-radius:5px;}
  .tdp-clause-block{background:#eef2ff;border:1px solid #c7d2fe;border-left:4px solid #6366f1;border-radius:8px;padding:14px 16px;margin-bottom:4px;}
  .tdp-clause-label{font-size:10px;font-weight:700;color:#6366f1;text-transform:uppercase;letter-spacing:.08em;margin-bottom:7px;}
  .tdp-clause-text{font-size:13.5px;font-weight:500;color:#0f172a;line-height:1.7;}
  .tdp-action-row-card{background:#fff;border:1px solid var(--border,#e2e8f0);border-radius:10px;overflow:hidden;}
  .tdp-action-row-inner{display:flex;align-items:flex-end;gap:12px;padding:14px 16px;flex-wrap:wrap;}
  .tdp-ar-field{display:flex;flex-direction:column;gap:5px;min-width:160px;}
  .tdp-ar-field-grow{flex:1;}
  .tdp-ar-label{font-size:10px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:.06em;}
  .tdp-ar-sel{min-width:160px;}
  .tdp-ar-status-note{padding:10px 16px;font-size:12px;line-height:1.55;border-top:1px solid var(--border,#e2e8f0);}
  .tdp-wf-details-card{background:#fff;border:1px solid var(--border,#e2e8f0);border-radius:10px;padding:16px 18px;display:flex;flex-direction:column;gap:16px;}
  .tdp-wf-stepper-people{display:flex;align-items:flex-start;width:100%;padding:8px 0 4px;}
  .tdp-wfsp-col{display:flex;flex-direction:column;align-items:center;gap:6px;flex-shrink:0;min-width:100px;}
  .tdp-wfsp-connector{flex:1;height:2px;background:#e2e8f0;margin-top:22px;min-width:12px;transition:background .2s;}
  .tdp-wfsp-connector.done{background:#6366f1;}
  .tdp-wfsp-dot{width:28px;height:28px;border-radius:50%;background:#e2e8f0;color:#94a3b8;font-size:11px;font-weight:800;display:flex;align-items:center;justify-content:center;border:2px solid #e2e8f0;transition:all .2s;}
  .tdp-wfsp-col.done .tdp-wfsp-dot{background:#6366f1;border-color:#6366f1;color:#fff;}
  .tdp-wfsp-col.current .tdp-wfsp-dot{background:#6366f1;border-color:#6366f1;color:#fff;box-shadow:0 0 0 4px #eef2ff;}
  .tdp-wfsp-step-lbl{font-size:9px;font-weight:800;color:#94a3b8;text-transform:uppercase;letter-spacing:.06em;white-space:nowrap;}
  .tdp-wfsp-col.done .tdp-wfsp-step-lbl,.tdp-wfsp-col.current .tdp-wfsp-step-lbl{color:#6366f1;}
  .tdp-wfsp-person-card{display:flex;align-items:center;gap:8px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:8px 10px;margin-top:4px;width:100%;box-sizing:border-box;}
  .tdp-wfsp-col.current .tdp-wfsp-person-card{border-color:#c7d2fe;background:#eef2ff;}
  .tdp-wfsp-level-badge{font-size:9px;font-weight:800;color:#94a3b8;background:#f1f5f9;border:1px solid #e2e8f0;border-radius:20px;padding:2px 7px;letter-spacing:.04em;white-space:nowrap;margin-bottom:2px;}
  .tdp-wfsp-level-badge.done{background:#eef2ff;color:#6366f1;border-color:#c7d2fe;}
  .tdp-wfsp-level-badge.current{background:#6366f1;color:#fff;border-color:#6366f1;}
  .tdp-av{width:28px;height:28px;border-radius:50%;background:#eef2ff;color:#4338ca;font-size:10px;font-weight:800;display:flex;align-items:center;justify-content:center;flex-shrink:0;border:1px solid #c7d2fe;}
  .tdp-av-sm{width:24px;height:24px;font-size:8px;flex-shrink:0;}
  .tdp-self-av{background:#1e293b;color:#fff;border-color:#1e293b;}
  .tdp-wfsp-role{font-size:9px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:.05em;}
  .tdp-wfsp-name{font-size:12px;font-weight:700;color:#0f172a;line-height:1.3;}
  .tdp-wfsp-dept{font-size:10px;color:#94a3b8;margin-top:1px;}
  .tdp-tbl-wrap{overflow-x:auto;border:1px solid var(--border,#e2e8f0);border-radius:10px;background:#fff;}
  .tdp-tbl{width:100%;border-collapse:collapse;font-size:14px;}
  .tdp-tbl thead tr{background:#f8fafc;}
  .tdp-tbl th{padding:11px 14px;text-align:left;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.06em;color:#94a3b8;border-bottom:1px solid var(--border,#e2e8f0);white-space:nowrap;}
  .tdp-tbl td{padding:12px 14px;border-bottom:1px solid #f1f5f9;color:var(--text-primary,#0f172a);vertical-align:middle;}
  .tdp-tbl tbody tr:last-child td{border-bottom:none;}
  .tdp-tbl tbody tr:hover td{background:#f8fafc;}
  .tdp-ev-type-chip{font-size:11px;font-weight:600;background:#f1f5f9;color:#475569;border:1px solid #e2e8f0;padding:2px 8px;border-radius:5px;}
  .tdp-ev-chip{font-size:11px;font-weight:700;padding:3px 9px;border-radius:99px;}
  .tdp-thread{display:flex;flex-direction:column;gap:14px;margin-bottom:18px;}
  .tdp-cmt{display:flex;gap:12px;align-items:flex-start;}
  .tdp-cmt-body{flex:1;background:#fff;border:1px solid var(--border,#e2e8f0);border-radius:4px 12px 12px 12px;padding:12px 14px;}
  .tdp-cmt-meta{display:flex;align-items:center;gap:8px;margin-bottom:5px;flex-wrap:wrap;}
  .tdp-cmt-meta strong{font-size:14px;font-weight:700;}
  .tdp-cmt-role{font-size:12px;color:#94a3b8;}
  .tdp-cmt-time{font-size:12px;color:#cbd5e1;margin-left:auto;}
  .tdp-cmt-text{font-size:14px;color:#475569;line-height:1.6;}
  .tdp-new-cmt{display:flex;gap:12px;align-items:flex-start;padding-top:14px;border-top:1px solid var(--border,#e2e8f0);}
  .tdp-input{background:#fff;border:1px solid var(--border,#e2e8f0);border-radius:8px;color:var(--text-primary,#0f172a);font-family:inherit;font-size:14px;padding:9px 12px;outline:none;width:100%;transition:border-color .18s,box-shadow .18s;}
  .tdp-input:focus{border-color:#6366f1;box-shadow:0 0 0 3px rgba(99,102,241,.1);}
  textarea.tdp-input{resize:vertical;min-height:72px;}
  .tdp-btn{display:inline-flex;align-items:center;gap:6px;font-family:inherit;font-size:14px;font-weight:600;padding:9px 18px;border-radius:8px;border:none;cursor:pointer;transition:all .15s;white-space:nowrap;}
  .tdp-btn-primary{background:#6366f1;color:#fff;} .tdp-btn-primary:hover{background:#4f46e5;}
  .tdp-btn-ghost{background:#fff;color:#475569;border:1px solid var(--border,#e2e8f0);} .tdp-btn-ghost:hover{background:#f8fafc;}
  .tdp-btn-success{background:#dcfce7;color:#166534;border:1px solid #86efac;} .tdp-btn-success:hover{background:#bbf7d0;}
  .tdp-btn-sm{padding:6px 12px;font-size:12px;}
  .tdp-btn-xs{padding:4px 9px;font-size:11px;}
  .tdp-empty{text-align:center;padding:40px 20px;color:#94a3b8;} .tdp-empty p{font-size:14px;line-height:1.7;}
  `;



  
  document.head.appendChild(s);
}