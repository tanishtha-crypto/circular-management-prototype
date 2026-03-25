/* =============================================================
   assign-actions.js
   Call: renderAssignActions()
   Appends overlay to body. Uses #content-area like other modules.
   ============================================================= */

/* ── TEAM ROSTER ─────────────────────────────────────────── */
const AA_TEAM = [
  { id: 'u1', name: 'Priya Nair', role: 'Compliance Lead', dept: 'Compliance', av: 'PN' },
  { id: 'u2', name: 'Raj Iyer', role: 'IT Manager', dept: 'IT', av: 'RI' },
  { id: 'u3', name: 'Anand Krishnan', role: 'Risk Analyst', dept: 'Risk', av: 'AK' },
  { id: 'u4', name: 'Sneha Das', role: 'Compliance Officer', dept: 'Compliance', av: 'SD' },
  { id: 'u5', name: 'Suresh Kumar', role: 'Ops Head', dept: 'Operations', av: 'SK' },
  { id: 'u6', name: 'Meera Pillai', role: 'HR Lead', dept: 'HR', av: 'MP' },
  { id: 'u7', name: 'Karan Shah', role: 'Legal Counsel', dept: 'Legal', av: 'KS' },
  { id: 'u8', name: 'Pooja Verma', role: 'IT Engineer', dept: 'IT', av: 'PV' },
];

/* ── DUMMY DATA  (4 circulars, varied assignee state) ─────── */
const AA_DATA = [
  {
    id: 'CIRC-001', title: 'Cybersecurity & IT Governance',
    regulator: 'RBI', risk: 'High', due: '2025-03-09',
    obligations: [
      {
        id: 'O1', clause: '§C3.1', text: 'Appoint a full-time CISO reporting to the Board.',
        obligations:"KYC should be done",
        actions: [
          { id: 'A-001', name: 'Draft CISO Job Description', dept: 'HR', uid: null, status: 'Unassigned', due: '2025-02-28' },
          { id: 'A-002', name: 'Board Resolution for CISO', dept: 'Compliance', uid: 'u1', status: 'In Progress', due: '2025-03-05' },
          { id: 'A-003', name: 'CISO Onboarding & System Access', dept: 'IT', uid: null, status: 'Unassigned', due: '2025-03-15' },
        ]
      },
      {
        id: 'O2', clause: '§C5.2', text: 'Deploy SIEM with 24×7 SOC monitoring within 180 days.',
         obligations:"Conduct a meeting for loan approval",
        actions: [
          { id: 'A-004', name: 'SIEM Vendor Evaluation & RFP', dept: 'IT', uid: 'u2', status: 'Assigned', due: '2025-02-15' },
          { id: 'A-005', name: 'SOC Team Hiring Plan', dept: 'HR', uid: null, status: 'Unassigned', due: '2025-03-20' },
        ]
      },
      {
        id: 'O3', clause: '§C9.3', text: 'Annual cybersecurity awareness training for all staff.',
        actions: [] /* no actions mapped */
      },
    ]
  },
  {
    id: 'CIRC-002', title: 'Enhanced Due Diligence (EDD) Guidelines',
    regulator: 'RBI', risk: 'High', due: '2025-03-09',
    obligations: [
      {
        id: 'O4', clause: '§C2.1', text: 'Maintain current EDD SOP for all PEPs and High-Risk customers.',
        actions: [
          { id: 'A-006', name: 'Document EDD SOP v2', dept: 'Compliance', uid: 'u4', status: 'In Progress', due: '2025-03-20' },
          { id: 'A-007', name: 'Legal Review of EDD SOP', dept: 'Legal', uid: null, status: 'Unassigned', due: '2025-03-28' },
        ]
      },
      {
        id: 'O5', clause: '§4.1', text: 'Flag cross-border transactions above ₹10L within 24 hours.',
        actions: [
          { id: 'A-008', name: 'Configure Transaction Monitoring', dept: 'IT', uid: 'u8', status: 'Assigned', due: '2025-03-15' },
          { id: 'A-009', name: 'Create Escalation Workflow', dept: 'Compliance', uid: null, status: 'Unassigned', due: '2025-03-18' },
        ]
      },
    ]
  },
  {
    id: 'CIRC-005', title: 'Outsourcing & Third-Party Risk Policy',
    regulator: 'RBI', risk: 'High', due: '2025-02-28',
    obligations: [
      {
        id: 'O6', clause: '§2.1', text: 'Classify all vendor arrangements as Critical, Important, or Standard.',
        actions: [
          { id: 'A-010', name: 'Vendor Inventory Compilation', dept: 'Operations', uid: 'u5', status: 'Overdue', due: '2025-01-31' },
          { id: 'A-011', name: 'Risk Tier Classification Framework', dept: 'Risk', uid: null, status: 'Unassigned', due: '2025-02-20' },
          { id: 'A-012', name: 'Board Sign-off on Classification', dept: 'Compliance', uid: null, status: 'Unassigned', due: '2025-02-28' },
        ]
      },
    ]
  },
  {
    id: 'CIRC-007', title: 'AML / KYC Policy Revised Guidelines',
    regulator: 'FIU', risk: 'Medium', due: '2025-05-15',
    obligations: [
      {
        id: 'O7', clause: '§3.1', text: 'Implement risk-based KYC (Enhanced / Standard / Simplified) for all segments.',
        actions: [
          { id: 'A-013', name: 'Update KYC Risk Scoring Model', dept: 'IT', uid: 'u8', status: 'Assigned', due: '2025-04-10' },
          { id: 'A-014', name: 'Process Redesign for Risk-Based KYC', dept: 'Compliance', uid: null, status: 'Unassigned', due: '2025-04-15' },
        ]
      },
      {
        id: 'O8', clause: '§5.1', text: 'File all STRs via FINnet 2.0 within 48 hours of detection.',
        actions: [
          { id: 'A-015', name: 'FINnet 2.0 System Integration', dept: 'IT', uid: null, status: 'Unassigned', due: '2025-04-20' },
          { id: 'A-016', name: 'STR Filing Procedure Documentation', dept: 'Compliance', uid: 'u1', status: 'Assigned', due: '2025-04-25' },
        ]
      },
    ]
  },
];

/* ── STATE ───────────────────────────────────────────────── */
let _aa = {
  tab: 'unassigned',  // 'unassigned' | 'inprogress' | 'all'
  search: '',
  fRisk: '',
  fDept: '',
  fCirc: '',
  selected: new Set(),
  picker: null,          // actId of open picker
};

/* ── ENTRY ───────────────────────────────────────────────── */
function renderAssignActions() {
  _aa = { tab: 'unassigned', search: '', fRisk: '', fDept: '', fCirc: '', selected: new Set(), picker: null };
  _aaStyles();

  const area = document.getElementById('content-area');
  if (!area) return;

  area.innerHTML = `
  <div id="aa-wrap">

    <!-- Header -->
    <div class="aa-header">
      <div>
        <div class="aa-htitle">Assign Actions</div>
        <div class="aa-hsub">Assign compliance actions to team members across obligations</div>
      </div>
      <button class="aa-btn-bulk" id="aa-bulk-btn" onclick="aaBulkOpen()" style="display:none">
        👥 Bulk Assign &nbsp;<span id="aa-bulk-n">0</span>
      </button>
    </div>

    <!-- Tab bar + Search -->
    <div class="aa-topbar">
      <div class="aa-tabs">
        <button class="aa-tab act" id="aa-tab-unassigned" onclick="aaTab('unassigned')">Unassigned <span class="aa-tbadge" id="aa-bn-u">0</span></button>
        <button class="aa-tab"     id="aa-tab-inprogress" onclick="aaTab('inprogress')">In Progress <span class="aa-tbadge" id="aa-bn-i">0</span></button>
        <button class="aa-tab"     id="aa-tab-all"        onclick="aaTab('all')">All Actions <span class="aa-tbadge" id="aa-bn-a">0</span></button>
      </div>
      <div class="aa-search-wrap">
        <span class="aa-si">&#9906;</span>
        <input id="aa-search" placeholder="Search actions or obligations…"
               oninput="_aa.search=this.value;aaRender()"/>
      </div>
    </div>

    <!-- Filter row -->
    <div class="aa-filters">
      <select class="aa-sel" id="aa-f-circ" onchange="_aa.fCirc=this.value;aaRender()">
        <option value="">All Circulars</option>
        ${AA_DATA.map(c => `<option value="${c.id}">${c.id}</option>`).join('')}
      </select>
      <select class="aa-sel" id="aa-f-risk" onchange="_aa.fRisk=this.value;aaRender()">
        <option value="">All Risk Levels</option>
        <option>High</option><option>Medium</option><option>Low</option>
      </select>
      <select class="aa-sel" id="aa-f-dept" onchange="_aa.fDept=this.value;aaRender()">
        <option value="">All Departments</option>
        <option>IT</option><option>HR</option><option>Finance</option>
        <option>Legal</option><option>Compliance</option><option>Risk</option><option>Operations</option>
      </select>
      <button class="aa-clr" onclick="aaClearFilters()">✕ Clear</button>
    </div>

    <!-- Content -->
    <div id="aa-content"></div>
  </div>

  <!-- Bulk assign modal (appended to body) -->
  <div id="aa-bulk-modal" style="display:none" class="aa-modal-overlay" onclick="if(event.target===this)aaBulkClose()">
    <div class="aa-modal-box">
      <div class="aa-modal-head">
        <div>
          <div class="aa-modal-title">Bulk Assign</div>
          <div class="aa-modal-sub" id="aa-bulk-sub"></div>
        </div>
        <button class="aa-x" onclick="aaBulkClose()">✕</button>
      </div>
      <div class="aa-modal-search">
        <span class="aa-si">&#9906;</span>
        <input placeholder="Search team member…" oninput="aaRenderBulkList(this.value)"/>
      </div>
      <div class="aa-modal-list" id="aa-bulk-list"></div>
    </div>
  </div>`;

  aaRender();
  document.addEventListener('click', _aaOutsideClick);
}

/* ── RENDER ──────────────────────────────────────────────── */
function aaRender() {
  _aaBadges();
  _aaContent();
}

function _aaBadges() {
  const all = _aaAll();
  const u = all.filter(a => !a.uid || a.status === 'Unassigned').length;
  const i = all.filter(a => a.status === 'In Progress').length;
  _set('aa-bn-u', u);
  _set('aa-bn-i', i);
  _set('aa-bn-a', all.length);
}

function _aaContent() {
  const rows = _aaFiltered();
  const box = document.getElementById('aa-content');
  if (!box) return;

  if (!rows.length) {
    box.innerHTML = `<div class="aa-empty">
      <div class="aa-empty-icon">✓</div>
      <div class="aa-empty-title">All clear</div>
      <div class="aa-empty-sub">No actions match the current filter.</div>
    </div>`;
    return;
  }

  box.innerHTML = rows.map(c => _aaCircBlock(c)).join('');
}

/* ── CIRCULAR BLOCK ──────────────────────────────────────── */
function _aaCircBlock(c) {
  const allActs = c.obligations.flatMap(o => o.actions);
  const unasn = allActs.filter(a => !a.uid || a.status === 'Unassigned').length;
  const riskClass = { High: 'aa-risk-h', Medium: 'aa-risk-m', Low: 'aa-risk-l' }[c.risk] || '';

  return `
  <div class="aa-circ">
    <!-- Circular label strip -->
    <div class="aa-circ-strip">
      <div class="aa-circ-strip-left">
        <span class="aa-circ-id">${c.id}</span>
        <span class="aa-circ-title">${c.title}</span>
        <span class="aa-reg-pill">${c.regulator}</span>
        <span class="aa-risk-pill ${riskClass}">${c.risk}</span>
        <span class="aa-due-label">Due ${_aaFmt(c.due)}</span>
      </div>
      <div class="aa-circ-strip-right">
        ${unasn > 0
      ? `<span class="aa-unasn-badge">${unasn} unassigned</span>`
      : `<span class="aa-done-badge">All assigned ✓</span>`}
      </div>
    </div>

    <!-- Obligations -->
    ${c.obligations.map(o => _aaOblBlock(o)).join('')}
  </div>`;
}

/* ── OBLIGATION BLOCK ────────────────────────────────────── */
function _aaOblBlock(o) {
  if (!o.actions.length) return `
    <div class="aa-obl-row">
     <div class="aa-obl-left">
  <span class="aa-clause">${o.clause}</span>
  <span class="aa-obl-full-text">${o.text}</span>
</div>
      <span class="aa-no-act">No actions mapped</span>
    </div>`;

  return `
  <div class="aa-obl-section">
    <!-- Obligation header -->
    <div class="aa-obl-row">
     <span class="aa-clause">${o.clause}</span>
<span class="aa-obl-text">${o.text}</span> 
<span class="aa-obl-text">${o.obligations ? `ℹ️ ${o.obligations}` : ""}</span> 
      <span class="aa-act-count">${o.actions.length} action${o.actions.length > 1 ? 's' : ''}</span>
    </div>

    <!-- Actions table -->
    <table class="aa-table">
      <thead>
        <tr>
          <th class="aa-col-chk">
            <input type="checkbox" class="aa-chk" onchange="aaSelObl(this,'${o.id}')"/>
          </th>
          <th class="aa-col-id">Action ID</th>
          <th>Action Name</th>
          <th class="aa-col-dept">Dept</th>
          <th class="aa-col-asn">Assignee</th>
          <th class="aa-col-due">Due</th>
          <th class="aa-col-st">Status</th>
        </tr>
      </thead>
      <tbody>
        ${o.actions.map(a => _aaRow(a, o.id)).join('')}
      </tbody>
    </table>
  </div>`;
}

/* ── ACTION ROW ──────────────────────────────────────────── */
function _aaRow(a, oblId) {
  const user = AA_TEAM.find(u => u.id === a.uid);
  const over = _aaOver(a.due);
  const near = _aaNear(a.due);
  const { bg, fg } = _aaSC(a.status);
  const rowCls = !a.uid ? 'aa-row-u' : over ? 'aa-row-o' : a.status === 'In Progress' ? 'aa-row-i' : '';
  const dueCls = over ? 'aa-td-over' : near ? 'aa-td-near' : 'aa-td-ok';

  return `
  <tr class="aa-row ${rowCls}" id="aa-r-${a.id}" data-obl="${oblId}">
    <td class="aa-col-chk">
      <input type="checkbox" class="aa-chk aa-rchk" data-id="${a.id}"
             ${_aa.selected.has(a.id) ? 'checked' : ''}
             onchange="aaSel('${a.id}',this.checked)"/>
    </td>
    <td class="aa-col-id"><code class="aa-id-tag">${a.id}</code></td>
    <td class="aa-col-name">
      <div class="aa-act-name">${a.name}</div>
    </td>
    <td class="aa-col-dept">
      <select class="aa-dept-sel" onchange="aaSetDept('${a.id}',this.value)">
        ${['IT', 'HR', 'Finance', 'Legal', 'Compliance', 'Risk', 'Operations']
      .map(d => `<option${d === a.dept ? ' selected' : ''}>${d}</option>`).join('')}
      </select>
    </td>
    <td class="aa-col-asn" id="aa-ac-${a.id}">
      ${user
      ? `<div class="aa-asn-face" onclick="aaPickerOpen('${a.id}',event)">
             <span class="aa-av">${user.av}</span>
             <span class="aa-asn-name">${user.name}</span>
             <span class="aa-asn-edit">✎</span>
           </div>`
      : `<button class="aa-asn-btn" onclick="aaPickerOpen('${a.id}',event)">＋ Assign</button>`}
    </td>
    <td class="aa-col-due"><span class="${dueCls}">${_aaFmt(a.due)}</span></td>
    <td class="aa-col-st">
      <span class="aa-status-pill" style="background:${bg};color:${fg}">${a.status}</span>
    </td>
  </tr>`;
}

/* ── INLINE PICKER ───────────────────────────────────────── */
window.aaPickerOpen = function (actId, e) {
  e.stopPropagation();
  if (_aa.picker === actId) { _aaPickerClose(); return; }
  _aaPickerClose();
  _aa.picker = actId;

  const cell = document.getElementById(`aa-ac-${actId}`);
  if (!cell) return;

  const drop = document.createElement('div');
  drop.id = 'aa-picker';
  drop.className = 'aa-picker-drop';
  drop.innerHTML = `
    <div class="aa-picker-search">
      <span class="aa-si">&#9906;</span>
      <input placeholder="Search…" autofocus oninput="_aaPickerFilter('${actId}',this.value)"/>
    </div>
    <div class="aa-picker-list" id="aa-plist">${_aaPickerItems(AA_TEAM, actId)}</div>
    <div class="aa-picker-foot">
      <button class="aa-btn-unasn" onclick="aaPickerUnassign('${actId}')">✕ Unassign</button>
    </div>`;

  drop.addEventListener('click', e => e.stopPropagation());
  cell.appendChild(drop);
  setTimeout(() => drop.querySelector('input')?.focus(), 40);
};

function _aaPickerClose() {
  document.getElementById('aa-picker')?.remove();
  _aa.picker = null;
}

function _aaPickerItems(members, actId) {
  if (!members.length) return `<div class="aa-picker-empty">No match</div>`;
  const cur = _aaFind(actId)?.uid;
  return members.map(u => `
    <div class="aa-picker-item${cur === u.id ? ' aa-picker-cur' : ''}"
         onclick="aaPickerAssign('${actId}','${u.id}')">
      <span class="aa-av aa-av-sm">${u.av}</span>
      <div>
        <div class="aa-pi-name">${u.name}</div>
        <div class="aa-pi-role">${u.role} · ${u.dept}</div>
      </div>
      ${cur === u.id ? '<span class="aa-pi-tick">✓</span>' : ''}
    </div>`).join('');
}

window._aaPickerFilter = function (actId, q) {
  const f = q.toLowerCase();
  const m = AA_TEAM.filter(u => !f || u.name.toLowerCase().includes(f) || u.dept.toLowerCase().includes(f));
  const el = document.getElementById('aa-plist');
  if (el) el.innerHTML = _aaPickerItems(m, actId);
};

window.aaPickerAssign = function (actId, uid) {
  const a = _aaFind(actId); if (!a) return;
  a.uid = uid;
  if (a.status === 'Unassigned') a.status = 'Assigned';
  _aaPickerClose();
  _aaRefreshRow(actId);
  _aaBadges();
  const u = AA_TEAM.find(t => t.id === uid);
  _aaToast(`Assigned to ${u?.name}`);
};

window.aaPickerUnassign = function (actId) {
  const a = _aaFind(actId); if (!a) return;
  a.uid = null; a.status = 'Unassigned';
  _aaPickerClose();
  _aaRefreshRow(actId);
  _aaBadges();
  _aaToast('Unassigned', 'warn');
};

function _aaRefreshRow(actId) {
  const a = _aaFind(actId); if (!a) return;
  const user = AA_TEAM.find(u => u.id === a.uid);
  const { bg, fg } = _aaSC(a.status);
  const over = _aaOver(a.due);
  const row = document.getElementById(`aa-r-${actId}`); if (!row) return;

  row.className = 'aa-row ' + (!a.uid ? 'aa-row-u' : over ? 'aa-row-o' : a.status === 'In Progress' ? 'aa-row-i' : '');

  const ac = document.getElementById(`aa-ac-${actId}`);
  if (ac) ac.innerHTML = user
    ? `<div class="aa-asn-face" onclick="aaPickerOpen('${actId}',event)">
         <span class="aa-av">${user.av}</span>
         <span class="aa-asn-name">${user.name}</span>
         <span class="aa-asn-edit">✎</span>
       </div>`
    : `<button class="aa-asn-btn" onclick="aaPickerOpen('${actId}',event)">＋ Assign</button>`;

  row.querySelectorAll('.aa-status-pill').forEach(p => {
    p.style.background = bg; p.style.color = fg; p.textContent = a.status;
  });
}

/* ── SELECT / BULK ───────────────────────────────────────── */
window.aaSel = function (id, checked) {
  if (checked) _aa.selected.add(id); else _aa.selected.delete(id);
  _aaUpdateBulkBtn();
};

window.aaSelObl = function (cb, oblId) {
  document.querySelectorAll(`.aa-rchk[data-obl="${oblId}"], .aa-row[data-obl="${oblId}"] .aa-rchk`)
    .forEach(c => { c.checked = cb.checked; if (cb.checked) _aa.selected.add(c.dataset.id); else _aa.selected.delete(c.dataset.id); });
  // also target data-obl on tr
  document.querySelectorAll(`tr.aa-row[data-obl="${oblId}"] .aa-rchk`).forEach(c => {
    c.checked = cb.checked;
    if (cb.checked) _aa.selected.add(c.dataset.id); else _aa.selected.delete(c.dataset.id);
  });
  _aaUpdateBulkBtn();
};

function _aaUpdateBulkBtn() {
  const btn = document.getElementById('aa-bulk-btn');
  const cnt = document.getElementById('aa-bulk-n');
  if (!btn) return;
  btn.style.display = _aa.selected.size > 0 ? 'inline-flex' : 'none';
  if (cnt) cnt.textContent = _aa.selected.size;
}

window.aaBulkOpen = function () {
  const sub = document.getElementById('aa-bulk-sub');
  if (sub) sub.textContent = `${_aa.selected.size} action${_aa.selected.size !== 1 ? 's' : ''} selected`;
  aaRenderBulkList('');
  document.getElementById('aa-bulk-modal').style.display = 'flex';
};

window.aaBulkClose = function () {
  document.getElementById('aa-bulk-modal').style.display = 'none';
};

window.aaRenderBulkList = function (q) {
  const f = q.toLowerCase();
  const m = AA_TEAM.filter(u => !f || u.name.toLowerCase().includes(f) || u.dept.toLowerCase().includes(f));
  const el = document.getElementById('aa-bulk-list');
  if (!el) return;
  el.innerHTML = m.map(u => `
    <div class="aa-picker-item" onclick="aaBulkAssign('${u.id}')">
      <span class="aa-av aa-av-sm">${u.av}</span>
      <div><div class="aa-pi-name">${u.name}</div><div class="aa-pi-role">${u.role} · ${u.dept}</div></div>
    </div>`).join('');
};

window.aaBulkAssign = function (uid) {
  const u = AA_TEAM.find(t => t.id === uid);
  _aa.selected.forEach(actId => {
    const a = _aaFind(actId); if (!a) return;
    a.uid = uid; if (a.status === 'Unassigned') a.status = 'Assigned';
  });
  aaBulkClose();
  _aa.selected.clear();
  _aaUpdateBulkBtn();
  aaRender();
  _aaToast(`Bulk assigned to ${u?.name}`);
};

/* ── TABS / FILTERS ──────────────────────────────────────── */
window.aaTab = function (tab) {
  _aa.tab = tab;
  _aa.selected.clear();
  _aaUpdateBulkBtn();
  document.querySelectorAll('.aa-tab').forEach(b => b.classList.remove('act'));
  document.getElementById(`aa-tab-${tab}`)?.classList.add('act');
  aaRender();
};

window.aaClearFilters = function () {
  _aa.fCirc = ''; _aa.fRisk = ''; _aa.fDept = ''; _aa.search = '';
  ['aa-f-circ', 'aa-f-risk', 'aa-f-dept', 'aa-search'].forEach(id => {
    const el = document.getElementById(id); if (el) el.value = '';
  });
  aaRender();
};

window.aaSetDept = function (actId, dept) {
  const a = _aaFind(actId); if (a) a.dept = dept;
};

function _aaFiltered() {
  const s = _aa.search.toLowerCase();
  return AA_DATA
    .filter(c => !_aa.fCirc || c.id === _aa.fCirc)
    .filter(c => !_aa.fRisk || c.risk === _aa.fRisk)
    .map(c => ({
      ...c,
      obligations: c.obligations.map(o => ({
        ...o,
        actions: o.actions.filter(a => {
          if (_aa.tab === 'unassigned' && a.uid && a.status !== 'Unassigned') return false;
          if (_aa.tab === 'inprogress' && a.status !== 'In Progress') return false;
          if (_aa.fDept && a.dept !== _aa.fDept) return false;
          if (s && !`${a.id} ${a.name} ${o.text}`.toLowerCase().includes(s)) return false;
          return true;
        })
      })).filter(o => o.actions.length > 0 || _aa.tab === 'all')
        .filter(o => _aa.tab !== 'all' ? o.actions.length > 0 : true)
    }))
    .filter(c => c.obligations.some(o => o.actions.length > 0) ||
      (_aa.tab === 'all' && c.obligations.length > 0))
    .filter(c => {
      if (_aa.tab === 'all') return true;
      return c.obligations.some(o => o.actions.length > 0);
    });
}

/* ── HELPERS ─────────────────────────────────────────────── */
function _aaAll() { return AA_DATA.flatMap(c => c.obligations.flatMap(o => o.actions)); }
function _aaFind(id) { for (const c of AA_DATA) for (const o of c.obligations) { const a = o.actions.find(a => a.id === id); if (a) return a; } return null; }
function _aaFmt(ds) { if (!ds) return '—'; return new Date(ds + 'T00:00:00').toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }); }
function _aaOver(ds) { return !!ds && new Date(ds + 'T00:00:00') < new Date(); }
function _aaNear(ds) { if (!ds) return false; const d = Math.ceil((new Date(ds + 'T00:00:00') - new Date()) / 86400000); return d >= 0 && d <= 14; }
function _set(id, v) { const el = document.getElementById(id); if (el) el.textContent = v; }
function _aaSC(s) { return ({ Unassigned: { bg: '#fee2e2', fg: '#991b1b' }, Assigned: { bg: '#ecfdf5', fg: '#065f46' }, 'In Progress': { bg: '#e0f2fe', fg: '#0369a1' }, Complete: { bg: '#f0fdf4', fg: '#166534' }, Overdue: { bg: '#fff7ed', fg: '#9a3412' } })[s] || { bg: '#f1f5f9', fg: '#475569' }; }
function _aaOutsideClick(e) { if (_aa.picker && !e.target.closest('.aa-col-asn')) _aaPickerClose(); }

function _aaToast(msg, type = 'ok') {
  if (typeof showToast === 'function') { showToast(msg, type === 'ok' ? 'success' : 'warning'); return; }
  const t = document.createElement('div');
  t.style.cssText = `position:fixed;bottom:24px;right:24px;z-index:9999;background:#1e293b;color:#fff;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:600;padding:11px 20px;border-radius:10px;box-shadow:0 6px 24px rgba(0,0,0,.2);opacity:0;transition:opacity .2s;pointer-events:none;`;
  t.textContent = msg; document.body.appendChild(t);
  requestAnimationFrame(() => t.style.opacity = '1');
  setTimeout(() => { t.style.opacity = '0'; setTimeout(() => t.remove(), 300); }, 2400);
}

/* ── STYLES ──────────────────────────────────────────────── */
function _aaStyles() {
  if (document.getElementById('aa-css')) return;
  const el = document.createElement('style'); el.id = 'aa-css';
  el.textContent = `

  /* ── ROOT ─────────────────────────────────────────────── */
  #aa-wrap {
    font-family: 'DM Sans', sans-serif;
    padding-bottom: 60px;
  }

  /* ── HEADER ───────────────────────────────────────────── */
  .aa-header {
    display: flex; align-items: flex-start;
    justify-content: space-between; flex-wrap: wrap;
    gap: 12px; margin-bottom: 20px;
  }
  .aa-htitle { font-size: 22px; font-weight: 800; color: var(--text-primary, #0f172a); margin-bottom: 3px; }
  .aa-hsub   { font-size: 13px; color: #64748b; }

  .aa-btn-bulk {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 9px 18px; background: #6366f1; color: #fff;
    border: none; border-radius: 9px; font-size: 14px;
    font-weight: 700; font-family: inherit; cursor: pointer;
    transition: background .15s;
  }
  .aa-btn-bulk:hover { background: #4f46e5; }

  /* ── TOP BAR ──────────────────────────────────────────── */
  .aa-topbar {
    display: flex; align-items: center; gap: 12px;
    flex-wrap: wrap; margin-bottom: 10px;
  }

  /* Tabs */
  .aa-tabs { display: flex; background: #f1f5f9; border-radius: 9px; padding: 4px; gap: 3px; }
  .aa-tab {
    display: flex; align-items: center; gap: 7px;
    padding: 8px 15px; border-radius: 6px; border: none;
    background: transparent; font-family: inherit;
    font-size: 13px; font-weight: 600; color: #64748b;
    cursor: pointer; transition: all .15s; white-space: nowrap;
  }
  .aa-tab:hover { background: #fff; color: #0f172a; }
  .aa-tab.act   { background: #fff; color: #0f172a; box-shadow: 0 1px 4px rgba(0,0,0,.09); }
  .aa-tbadge {
    font-size: 10px; font-weight: 800; padding: 1px 7px;
    border-radius: 99px; background: #6366f1; color: #fff; min-width: 20px; text-align: center;
  }
  .aa-tab.act .aa-tbadge { background: #ef4444; }

  /* Search */
  .aa-search-wrap { position: relative; flex: 1; min-width: 180px; max-width: 300px; }
  .aa-search-wrap input {
    width: 100%; padding: 9px 12px 9px 34px;
    border: 1px solid var(--border, #e2e8f0); border-radius: 9px;
    font-family: inherit; font-size: 14px; outline: none;
    background: #fff; transition: border-color .18s, box-shadow .18s;
  }
  .aa-search-wrap input:focus {
    border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,.09);
  }
  .aa-si {
    position: absolute; left: 11px; top: 50%; transform: translateY(-50%);
    color: #94a3b8; font-size: 15px; pointer-events: none;
  }

  /* ── FILTER ROW ───────────────────────────────────────── */
  .aa-filters {
    display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
    background: #fff; border: 1px solid var(--border, #e2e8f0);
    border-radius: 10px; padding: 10px 14px; margin-bottom: 20px;
  }
  .aa-sel {
    padding: 7px 26px 7px 10px; border: 1px solid var(--border, #e2e8f0);
    border-radius: 7px; font-family: inherit; font-size: 13px;
    color: #0f172a; cursor: pointer; outline: none;
    background: #f8fafc url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='9' height='5'%3E%3Cpath d='M0 0l4.5 5L9 0z' fill='%2394a3b8'/%3E%3C/svg%3E") no-repeat right 8px center;
    -webkit-appearance: none; appearance: none; transition: border-color .18s;
  }
  .aa-sel:focus { border-color: #6366f1; }
  .aa-clr {
    padding: 6px 12px; background: none; border: 1px solid #fca5a5;
    border-radius: 7px; font-size: 12px; font-weight: 700; color: #ef4444;
    cursor: pointer; transition: background .15s; margin-left: auto;
  }
  .aa-clr:hover { background: #fee2e2; }

  /* ── CIRCULAR BLOCK ───────────────────────────────────── */
  .aa-circ {
    background: #fff; border: 1px solid var(--border, #e2e8f0);
    border-radius: 12px; margin-bottom: 18px; overflow: hidden;
    box-shadow: 0 1px 4px rgba(0,0,0,.04);
  }

  .aa-circ-strip {
    display: flex; align-items: center; justify-content: space-between;
    gap: 12px; padding: 13px 18px;
    
    background: #1e293b; border-bottom: 1px solid var(--border, #e2e8f0);
  }
  .aa-circ-strip-left  { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
  .aa-circ-strip-right { flex-shrink: 0; }

  .aa-circ-id {
    font-size: 11px; font-weight: 700; font-family: 'DM Mono', monospace;
    background: #eef2ff; color: #4338ca; border: 1px solid #c7d2fe;
    padding: 3px 9px; border-radius: 6px; white-space: nowrap;
  }
  .aa-circ-title { font-size: 14px; font-weight: 700; color: #fff; }
  .aa-reg-pill   { font-size: 10px; font-weight: 700; padding: 2px 8px; background: #ede9fe; color: #5b21b6; border-radius: 99px; }
  .aa-risk-pill  { font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 99px; }
  .aa-risk-h     { background: #fee2e2; color: #991b1b; }
  .aa-risk-m     { background: #fef9c3; color: #854d0e; }
  .aa-risk-l     { background: #dcfce7; color: #166534; }
  .aa-due-label  { font-size: 12px; color: #fff; }
  .aa-unasn-badge { font-size: 11px; font-weight: 700; color: #ef4444; }
  .aa-done-badge  { font-size: 11px; font-weight: 700; color: #10b981; }

  /* ── OBLIGATION ROW ───────────────────────────────────── */
  .aa-obl-row {
    display: flex; align-items: flex-start; gap: 10px;
    padding: 10px 18px; background:  #cbc4c4;
    border-bottom: 1px solid #f1f5f9;
  }
  .aa-clause {
    font-size: 10px; font-weight: 700; font-family: 'DM Mono', monospace;
    background: #eef2ff; color: #4338ca; border: 1px solid #c7d2fe;
    padding: 2px 7px; border-radius: 5px; white-space: nowrap;
    flex-shrink: 0; margin-top: 1px;
  }
  .aa-obl-text {
    font-size: 13px; color: #000000; line-height: 1.55; flex: 1;
    border-left: 2px solid #e2e8f0; padding-left: 10px;
  }
    .aa-obl-obl{
     color: #4338ca;
    }
  
  .aa-obl-left {
  display: flex;
  flex-direction: column;
  gap: 5px;
  flex: 1;
}

.aa-obl-full-text {
  font-size: 12.5px;
  color: #64748b;
  line-height: 1.55;
  padding-left: 2px;
}
  .aa-obl-name {
  display: block;
  font-size: 12px;
  font-weight: 700;
  color: #4338ca;
  cursor: default;
  margin-bottom: 2px;
}

.aa-obl-hover-text {
  display: none;
  font-size: 12.5px;
  color: #475569;
  line-height: 1.5;
}

.aa-obl-text:hover .aa-obl-hover-text,
.aa-obl-text:focus-within .aa-obl-hover-text {
  display: block;
}

  .aa-act-count { font-size: 11px; color: #94a3b8; white-space: nowrap; flex-shrink: 0; padding-top: 2px; }
  .aa-no-act    { font-size: 12px; color: #cbd5e1; font-style: italic; flex-shrink: 0; padding-top: 2px; }

  /* ── OBLIGATION SECTION ───────────────────────────────── */
  .aa-obl-section { border-bottom: 1px solid var(--border, #e2e8f0); }
  .aa-obl-section:last-child { border-bottom: none; }

  /* ── TABLE ────────────────────────────────────────────── */
  .aa-table { width: 100%; border-collapse: collapse; font-size: 13.5px; }
  .aa-table thead tr { background: #f8fafc; }
  .aa-table th {
    padding: 9px 13px; text-align: left;
    font-size: 10.5px; font-weight: 700; text-transform: uppercase;
    letter-spacing: .06em; color: #161718;
    border-bottom: 1px solid var(--border, #e2e8f0); white-space: nowrap;
  }
  .aa-table td { padding: 10px 13px; border-bottom: 1px solid #f4f5f8; vertical-align: middle; }
  .aa-table tbody tr:last-child td { border-bottom: none; }
  .aa-table tbody tr:hover td { background: #fafbff; }

  /* Column widths */
  .aa-col-chk  { width: 34px; }
  .aa-col-id   { width: 90px; }
  .aa-col-dept { width: 115px; }
  .aa-col-asn  { width: 190px; position: relative; }
  .aa-col-due  { width: 95px; }
  .aa-col-st   { width: 115px; }

  /* Row accent lines */
  .aa-row-u td:first-child { border-left: 3px solid #ef4444; }
  .aa-row-o td:first-child { border-left: 3px solid #f97316; }
  .aa-row-i td:first-child { border-left: 3px solid #f59e0b; }

  .aa-chk { width: 15px; height: 15px; cursor: pointer; accent-color: #6366f1; }

  .aa-id-tag {
    font-family: 'DM Mono', monospace; font-size: 11px; font-weight: 600;
    background: #eef2ff; color: #4338ca; border: 1px solid #c7d2fe;
    padding: 2px 7px; border-radius: 5px; display: inline-block;
  }
  .aa-act-name { font-weight: 600; font-size: 13.5px; color: #0f172a; }

  /* Dept select */
  .aa-dept-sel {
    padding: 5px 22px 5px 8px; border: 1px solid var(--border, #e2e8f0);
    border-radius: 6px; font-family: inherit; font-size: 12px;
    background: #f8fafc url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='4'%3E%3Cpath d='M0 0l4 4 4-4z' fill='%2394a3b8'/%3E%3C/svg%3E") no-repeat right 6px center;
    -webkit-appearance: none; appearance: none; cursor: pointer; outline: none;
    transition: border-color .15s;
  }
  .aa-dept-sel:focus { border-color: #6366f1; }

  /* Due */
  .aa-td-over { color: #dc2626; font-weight: 700; font-size: 12.5px; }
  .aa-td-near { color: #d97706; font-weight: 700; font-size: 12.5px; }
  .aa-td-ok   { color: #64748b; font-size: 12.5px; }

  /* Status pill */
  .aa-status-pill { display: inline-block; font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 99px; white-space: nowrap; }

  /* ── ASSIGNEE CELL ────────────────────────────────────── */
  .aa-asn-btn {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 6px 12px; background: #6366f1; color: #fff;
    border: none; border-radius: 7px; font-size: 12.5px; font-weight: 700;
    font-family: inherit; cursor: pointer; transition: background .15s;
  }
  .aa-asn-btn:hover { background: #4f46e5; }

  .aa-asn-face {
    display: inline-flex; align-items: center; gap: 7px;
    cursor: pointer; padding: 4px 7px; border-radius: 8px;
    border: 1px solid transparent; transition: all .15s;
  }
  .aa-asn-face:hover { background: #eef2ff; border-color: #c7d2fe; }
  .aa-asn-name { font-size: 13px; font-weight: 600; color: #0f172a; }
  .aa-asn-edit { font-size: 11px; color: #c7d2fe; }

  .aa-av {
    width: 30px; height: 30px; border-radius: 50%;
    background: #eef2ff; color: #4338ca; font-size: 10px; font-weight: 800;
    display: inline-flex; align-items: center; justify-content: center;
    border: 1.5px solid #c7d2fe; flex-shrink: 0;
  }
  .aa-av-sm { width: 34px; height: 34px; font-size: 11px; }

  /* ── PICKER DROPDOWN ──────────────────────────────────── */
  .aa-picker-drop {
    position: absolute; left: 0; top: calc(100% + 5px); z-index: 800;
    width: 270px; background: #fff;
    border: 1px solid var(--border, #e2e8f0); border-radius: 12px;
    box-shadow: 0 8px 28px rgba(0,0,0,.13); overflow: hidden;
  }
  .aa-picker-search {
    position: relative; padding: 9px 9px 6px;
    border-bottom: 1px solid var(--border, #e2e8f0);
  }
  .aa-picker-search input {
    width: 100%; padding: 7px 9px 7px 30px;
    border: 1px solid var(--border, #e2e8f0); border-radius: 7px;
    font-family: inherit; font-size: 13px; outline: none;
    background: #f8fafc; transition: border-color .15s;
  }
  .aa-picker-search input:focus { border-color: #6366f1; background: #fff; }
  .aa-picker-search .aa-si { left: 17px; }
  .aa-picker-list   { max-height: 220px; overflow-y: auto; }
  .aa-picker-list::-webkit-scrollbar { width: 3px; }
  .aa-picker-list::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 99px; }
  .aa-picker-item {
    display: flex; align-items: center; gap: 9px;
    padding: 9px 13px; cursor: pointer; transition: background .12s;
  }
  .aa-picker-item:hover { background: #f5f6ff; }
  .aa-picker-cur  { background: #eef2ff; }
  .aa-pi-name  { font-size: 13px; font-weight: 700; color: #0f172a; }
  .aa-pi-role  { font-size: 11px; color: #94a3b8; }
  .aa-pi-tick  { margin-left: auto; color: #10b981; font-weight: 800; font-size: 13px; }
  .aa-picker-empty { padding: 18px; text-align: center; font-size: 13px; color: #94a3b8; }
  .aa-picker-foot  {
    padding: 8px 10px; border-top: 1px solid var(--border, #e2e8f0);
    display: flex; justify-content: flex-end;
  }
  .aa-btn-unasn {
    padding: 5px 10px; background: none;
    border: 1px solid #fca5a5; border-radius: 6px;
    font-size: 11px; font-weight: 700; color: #ef4444;
    cursor: pointer; transition: background .15s;
  }
  .aa-btn-unasn:hover { background: #fee2e2; }

  /* ── BULK MODAL ───────────────────────────────────────── */
  .aa-modal-overlay {
    position: fixed; inset: 0; background: rgba(15,18,40,.38);
    z-index: 9000; display: flex; align-items: center; justify-content: center;
  }
  .aa-modal-box {
    background: #fff; border-radius: 15px; width: 320px;
    max-height: 78vh; display: flex; flex-direction: column;
    box-shadow: 0 18px 52px rgba(0,0,0,.18); overflow: hidden;
  }
  .aa-modal-head {
    display: flex; align-items: flex-start;
    justify-content: space-between; gap: 10px;
    padding: 18px 18px 13px; border-bottom: 1px solid var(--border, #e2e8f0);
  }
  .aa-modal-title { font-size: 16px; font-weight: 800; }
  .aa-modal-sub   { font-size: 12px; color: #64748b; margin-top: 2px; }
  .aa-modal-search {
    position: relative; padding: 9px;
    border-bottom: 1px solid var(--border, #e2e8f0);
  }
  .aa-modal-search input {
    width: 100%; padding: 7px 9px 7px 30px;
    border: 1px solid var(--border, #e2e8f0); border-radius: 7px;
    font-family: inherit; font-size: 13px; outline: none;
    background: #f8fafc;
  }
  .aa-modal-search input:focus { border-color: #6366f1; }
  .aa-modal-search .aa-si { left: 17px; }
  .aa-modal-list { flex: 1; overflow-y: auto; }
  .aa-x {
    background: none; border: 1px solid var(--border, #e2e8f0);
    border-radius: 6px; width: 28px; height: 28px; cursor: pointer;
    font-size: 12px; color: #64748b; display: flex;
    align-items: center; justify-content: center; flex-shrink: 0;
  }
  .aa-x:hover { background: #fee2e2; color: #ef4444; border-color: #fca5a5; }

  /* ── EMPTY ────────────────────────────────────────────── */
  .aa-empty { text-align: center; padding: 64px 24px; }
  .aa-empty-icon  { font-size: 44px; margin-bottom: 12px; }
  .aa-empty-title { font-size: 17px; font-weight: 800; color: #0f172a; margin-bottom: 6px; }
  .aa-empty-sub   { font-size: 14px; color: #64748b; }
  `;
  document.head.appendChild(el);
}