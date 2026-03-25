/* =============================================================
   dept-actions.js
   Call: renderDeptActions()
   Renders into #actions div
   Requires: LIFECYCLE_CONFIG and MI_TEAM from dept-manager-items.js
   ============================================================= */

/* ── ACTIONS DATA ─────────────────────────────────────────── */
const DA_ITEMS = [
  {
    id:'SK-001', title:'Establish Board Cybersecurity Committee',
    circularId:'CIRC-2024-001', clauseRef:'C1.1',
    dept:'IT', risk:'High', dueDate:'2025-03-15',
    flowId:'flow-3', currentStep:1,
    status:'In Progress',
    roles:{
      assignee: { uid:'u2', status:'In Progress' },
      reviewer: { uid:'u3', status:'Pending' },
      approver: { uid:'u7', status:'Waiting' },
    },
    obligation:'Establish a Board-level Cybersecurity Committee with defined charter and reporting lines.',
    description:'Set up the committee with board members, define the charter, meeting cadence and reporting structure to CISO.',
    evidence:[],
    comments:[
      { author:'Raj Iyer', role:'IT Engineer', time:'2 days ago', text:'Committee charter draft is ready for review.' }
    ]
  },
  {
    id:'SK-002', title:'Data Privacy Compliance Review',
    circularId:'CIRC-2024-002', clauseRef:'C2.3',
    dept:'Compliance', risk:'High', dueDate:'2025-03-20',
    flowId:'flow-2', currentStep:1,
    status:'In Progress',
    roles:{
      assignee: { uid:'u4', status:'In Progress' },
      reviewer: { uid:'u1', status:'Pending' },
    },
    obligation:'Conduct a full review of data privacy practices against updated RBI guidelines.',
    description:'Review all data privacy policies, identify gaps against latest RBI circular and prepare remediation plan.',
    evidence:[
      { id:'EV-010', type:'Policy Document', file:'Privacy_Policy_Review_v1.pdf', actionTitle:'Data Privacy Compliance Review', status:'Pending Review', uploadedBy:'Sneha Das', date:'10 Mar 2025' }
    ],
    comments:[]
  },
  {
    id:'SK-003', title:'Policy Framework Update',
    circularId:'CIRC-2024-003', clauseRef:'C1.5',
    dept:'Compliance', risk:'Medium', dueDate:'2025-04-10',
    flowId:'flow-1', currentStep:1,
    status:'Assigned',
    roles:{
      assignee: { uid:'u1', status:'Assigned' },
    },
    obligation:'Update the internal policy framework to align with revised compliance guidelines.',
    description:'Review existing policy documents, identify gaps and update framework accordingly.',
    evidence:[],
    comments:[]
  },
  {
    id:'SK-004', title:'Vendor Risk Assessment',
    circularId:'CIRC-2024-001', clauseRef:'C3.2',
    dept:'Operations', risk:'High', dueDate:'2025-03-25',
    flowId:'flow-3', currentStep:2,
    status:'In Review',
    roles:{
      assignee: { uid:'u5', status:'Complete' },
      reviewer: { uid:'u3', status:'In Progress' },
      approver: { uid:'u7', status:'Waiting' },
    },
    obligation:'Conduct risk assessment for all critical and important vendors.',
    description:'Assess each vendor against the risk classification framework and document findings.',
    evidence:[
      { id:'EV-011', type:'Audit Trail', file:'Vendor_Risk_Assessment.xlsx', actionTitle:'Vendor Risk Assessment', status:'Verified', uploadedBy:'Suresh Kumar', date:'08 Mar 2025' }
    ],
    comments:[
      { author:'Suresh Kumar', role:'Ops Analyst', time:'3 days ago', text:'Assessment complete, sent for review.' },
      { author:'Anand Krishnan', role:'Risk Analyst', time:'1 day ago', text:'Reviewing now, will revert by EOD.' }
    ]
  },
  {
    id:'SK-005', title:'KYC Risk Scoring Model Update',
    circularId:'CIRC-2024-002', clauseRef:'C4.1',
    dept:'IT', risk:'Medium', dueDate:'2025-04-15',
    flowId:'flow-2', currentStep:0,
    status:'Unassigned',
    roles:{
      assignee: { uid:null, status:'Unassigned' },
      reviewer: { uid:null, status:'Waiting' },
    },
    obligation:'Update KYC risk scoring model to incorporate new risk factors per revised guidelines.',
    description:'Update the algorithm and integrate with core banking system.',
    evidence:[],
    comments:[]
  },
];

/* ── STATE ───────────────────────────────────────────────── */
let _da = {
  tab:     'all',
  search:  '',
  fStatus: '',
  fCirc:   '',
  fRisk:   '',
  selected: null,
};

/* ── ENTRY ───────────────────────────────────────────────── */
function renderDeptActions() {
  const wrap = document.getElementById('actions');
  if (!wrap) return;
  _da = { tab:'all', search:'', fStatus:'', fCirc:'', fRisk:'', selected:null };
  _daStyles();
  _da.selected = null;
  wrap.innerHTML = _daRoot();
  _daRender();
}

/* ── ROOT SHELL ──────────────────────────────────────────── */
function _daRoot() {
  /* union of all non-manager roles across all actions */
  const allRoles = [...new Set(
    DA_ITEMS.flatMap(i => {
      const f = LIFECYCLE_CONFIG[i.flowId];
      return f ? f.steps.filter(s => s.role !== 'Manager').map(s => s.role) : [];
    })
  )];

  /* active flow — richest one present */
  const richFlow = LIFECYCLE_CONFIG['flow-3'];

  return `
  <div id="da-root">

    <!-- Page header -->
    <div class="da-page-header">
      <div>
        <div class="da-page-title">Department Actions</div>
        <div class="da-page-sub">All actions assigned to your department — monitor by role</div>
      </div>
     
    </div>

    <!-- Summary cards -->
    <div class="da-summary" id="da-summary"></div>

    <!-- Tab bar + filters -->
    <div class="da-topbar">
      <div class="da-tabs">
        <button class="da-tab act" id="da-tab-all" onclick="daTab('all')">
          All <span class="da-tbadge" id="da-bn-all">0</span>
        </button>
        ${allRoles.map(role=>`
          <button class="da-tab" id="da-tab-${role.toLowerCase()}"
                  onclick="daTab('${role.toLowerCase()}')">
            ${role}
            <span class="da-tbadge da-tbadge-dim" id="da-bn-${role.toLowerCase()}">0</span>
          </button>`).join('')}
      </div>
      <div class="da-filters">
        <div class="da-search-wrap">
          <span class="da-si">&#9906;</span>
          <input id="da-search" placeholder="Search actions…"
                 oninput="_da.search=this.value;_daRender()"/>
        </div>
        <select class="da-sel" onchange="_da.fStatus=this.value;_daRender()">
          <option value="">All Status</option>
          <option>Unassigned</option><option>Assigned</option>
          <option>In Progress</option><option>In Review</option>
          <option>Complete</option><option>Overdue</option>
        </select>
        <select class="da-sel" onchange="_da.fRisk=this.value;_daRender()">
          <option value="">All Risk</option>
          <option>High</option><option>Medium</option><option>Low</option>
        </select>
        <select class="da-sel" onchange="_da.fCirc=this.value;_daRender()">
          <option value="">All Circulars</option>
          ${[...new Set(DA_ITEMS.map(i=>i.circularId))].map(c=>`<option>${c}</option>`).join('')}
        </select>
        <button class="da-clr" onclick="daClear()">✕</button>
      </div>
    </div>

    <!-- Content -->
    <div id="da-content"></div>
  </div>`;
}

/* ── RENDER ──────────────────────────────────────────────── */
function _daRender() {
  _daBadges();
  _daSummary();
  _daContent();
}

/* ── BADGES ──────────────────────────────────────────────── */
function _daBadges() {
  const allRoles = [...new Set(
    DA_ITEMS.flatMap(i => {
      const f = LIFECYCLE_CONFIG[i.flowId];
      return f ? f.steps.filter(s=>s.role!=='Manager').map(s=>s.role) : [];
    })
  )];

  const el = document.getElementById('da-bn-all');
  if (el) el.textContent = DA_ITEMS.length;

  allRoles.forEach(role => {
    const el = document.getElementById(`da-bn-${role.toLowerCase()}`);
    if (!el) return;
    const count = DA_ITEMS.filter(i => {
      const f = LIFECYCLE_CONFIG[i.flowId];
      return f && f.steps.some(s=>s.role===role);
    }).length;
    el.textContent = count;
  });
}

/* ── SUMMARY CARDS ───────────────────────────────────────── */
function _daSummary() {
  const box = document.getElementById('da-summary');
  if (!box) return;
  const total    = DA_ITEMS.length;
  const unasn    = DA_ITEMS.filter(i=>i.status==='Unassigned').length;
  const inprog   = DA_ITEMS.filter(i=>i.status==='In Progress').length;
  const review   = DA_ITEMS.filter(i=>i.status==='In Review').length;
  const overdue  = DA_ITEMS.filter(i=>_daIsOver(i.dueDate)).length;
  const complete = DA_ITEMS.filter(i=>i.status==='Complete').length;

  box.innerHTML = [
    { l:'Total',       v:total,    c:'#6366f1' },
    { l:'Unassigned',  v:unasn,    c:'#ef4444' },
    { l:'In Progress', v:inprog,   c:'#f59e0b' },
    { l:'In Review',   v:review,   c:'#06b6d4' },
    { l:'Overdue',     v:overdue,  c:'#f97316' },
    { l:'Complete',    v:complete, c:'#10b981' },
  ].map(s=>`
    <div class="da-stat">
      <div class="da-stat-v" style="color:${s.c}">${s.v}</div>
      <div class="da-stat-l">${s.l}</div>
    </div>`).join('');
}

/* ── CONTENT ─────────────────────────────────────────────── */
function _daContent() {
  const box = document.getElementById('da-content');
  if (!box) return;

  const items = _daFiltered();
  if (!items.length) {
    box.innerHTML = `<div class="da-empty"><div class="da-empty-icon">✓</div><div class="da-empty-t">No actions match</div><div class="da-empty-s">Adjust filters or clear search</div></div>`;
    return;
  }

  if (_da.tab === 'all') {
    box.innerHTML = _daAllView(items);
  } else {
    box.innerHTML = _daRoleView(items, _da.tab);
  }
}

/* ── ALL TAB — grouped by action showing all roles ───────── */
function _daAllView(items) {
  /* collect all non-manager roles across visible items for dynamic columns */
  const allRoles = [...new Set(
    items.flatMap(i => {
      const f = LIFECYCLE_CONFIG[i.flowId];
      return f ? f.steps.filter(s=>s.role!=='Manager').map(s=>s.role) : [];
    })
  )];

  return `
  <div class="da-table-wrap">
    <table class="da-table">
      <thead>
        <tr>
          <th>Action ID</th>
          <th>Action Title</th>
          <th>Circular</th>
          <th>Risk</th>
          ${allRoles.map(r=>`<th>${r}</th>`).join('')}
          <th>Due Date</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        ${items.map(item => {
          const sc  = _daSC(item.status);
          const rc  = _daRisk(item.risk);
          const over= _daIsOver(item.dueDate);
          const near= _daNear(item.dueDate);

          return `
          <tr class="da-row" onclick="daOpenDetail('${item.id}')">
            <td><code class="da-id">${item.id}</code></td>
            <td>
              <div class="da-ab-title" style="font-size:13.5px">${item.title}</div>
              <div class="da-ab-sub">${item.dept}</div>
            </td>
            <td><span class="da-circ">${item.circularId}</span></td>
            <td><span class="da-pill" style="background:${rc.bg};color:${rc.fg}">${item.risk}</span></td>
            ${allRoles.map(role => {
              const f        = LIFECYCLE_CONFIG[item.flowId];
              const hasRole  = f && f.steps.some(s=>s.role===role);
              const roleData = item.roles[role.toLowerCase()];
              const user     = MI_TEAM.find(u=>u.id===roleData?.uid);
              if (!hasRole) return `<td><span style="color:#e2e8f0;font-size:13px">—</span></td>`;
              return `<td>
                ${user
                  ? `<div class="da-role-user">
                       <span class="da-av-xs">${user.av}</span>
                       <span class="da-role-uname">${user.name.split(' ')[0]}</span>
                     </div>`
                  : `<span class="da-role-empty">Unassigned</span>`}
              </td>`;
            }).join('')}
            <td><span class="${over?'da-due-over':near?'da-due-near':'da-due-ok'}">${_daFmt(item.dueDate)}</span></td>
            <td><span class="da-pill" style="background:${sc.bg};color:${sc.fg}">${item.status}</span></td>
          </tr>`;
        }).join('')}
      </tbody>
    </table>
  </div>`;
}

/* ── ROLE TAB — flat table filtered to that role ─────────── */
function _daRoleView(items, roleKey) {
  const role = roleKey.charAt(0).toUpperCase() + roleKey.slice(1);

  return `
  <div class="da-table-wrap">
    <table class="da-table">
      <thead>
        <tr>
          <th>Action ID</th>
          <th>Action Title</th>
          <th>Circular</th>
          <th>Clause</th>
          <th style="width:160px">Assigned As ${role}</th>
          <th>Due Date</th>
          <th>Action Status</th>
          <th>${role} Status</th>
        </tr>
      </thead>
      <tbody>
        ${items.map(item => {
          const roleData = item.roles[roleKey];
          const user     = MI_TEAM.find(u=>u.id===roleData?.uid);
          const sc       = _daSC(item.status);
          const rsc      = _daRoleSC(roleData?.status||'Waiting');
          const rc       = _daRisk(item.risk);
          const over     = _daIsOver(item.dueDate);

          return `
          <tr class="da-row" onclick="daOpenDetail('${item.id}')">
            <td><code class="da-id">${item.id}</code></td>
            <td>
              <div class="da-ab-title" style="font-size:13.5px">${item.title}</div>
              <div class="da-ab-sub">${item.dept}</div>
            </td>
            <td><span class="da-circ">${item.circularId}</span></td>
            <td style="font-size:12px;color:#64748b">${item.clauseRef}</td>
            <td>
              ${user ? `
                <div class="da-role-user">
                  <span class="da-av-xs">${user.av}</span>
                  <span class="da-role-uname">${user.name}</span>
                </div>` : `
                <span class="da-role-empty">Not assigned</span>`}
            </td>
            <td><span class="${over?'da-due-over':'da-due-ok'}">${_daFmt(item.dueDate)}</span></td>
            <td><span class="da-pill" style="background:${sc.bg};color:${sc.fg}">${item.status}</span></td>
            <td><span class="da-pill" style="background:${rsc.bg};color:${rsc.fg}">${roleData?.status||'Waiting'}</span></td>
          </tr>`;
        }).join('')}
      </tbody>
    </table>
  </div>`;
}

/* ── DETAIL (full screen — reuses same pattern) ──────────── */
window.daOpenDetail = function(id) {
  const item = DA_ITEMS.find(i=>i.id===id);
  if (!item) return;
  _da.selected = id;

  const wrap = document.getElementById('actions');
  const f    = LIFECYCLE_CONFIG[item.flowId];
  const rc   = _daRisk(item.risk);
  const sc   = _daSC(item.status);
  const over = _daIsOver(item.dueDate);
  const near = _daNear(item.dueDate);

  wrap.innerHTML = `
  <div id="da-detail">

    <!-- Header -->
    <div class="da-dh">
      <div class="da-bc">
        <span class="da-back" onclick="renderDeptActions()">← Actions</span>
        <span style="color:#cbd5e1">/</span>
        <code style="font-size:11px;color:#94a3b8">${item.id}</code>
      </div>
      <div class="da-dh-row">
        <div class="da-dh-title">${item.title}</div>
        <span class="da-pill" style="background:${sc.bg};color:${sc.fg};font-size:12px;padding:4px 12px">${item.status}</span>
      </div>
      <div class="da-chips">
        <span class="da-pill" style="background:${rc.bg};color:${rc.fg}">${item.risk} Risk</span>
        <span class="da-chip-blue">${item.circularId}</span>
        <span class="da-chip-grey">${item.clauseRef}</span>
        <span class="da-chip-grey">${item.dept}</span>
        <span class="${over?'da-due-over':near?'da-due-near':'da-due-ok'}" style="font-size:12px">Due ${_daFmt(item.dueDate)}</span>
      </div>

      <!-- Flow progress -->
      ${_daFlowBar(item)}
    </div>

    <!-- Tabs + pane -->
    <div class="da-dbody">
      <nav class="da-vtabs">
        ${[['overview','◈','Overview'],['roles','⚡','Roles'],['evidence','📎','Evidence'],['comments','💬','Comments']]
          .map(([tid,ic,lb])=>`
          <button class="da-vtab${tid==='overview'?' active':''}" id="da-vt-${tid}"
                  onclick="daTab2('${tid}','${id}')">
            <span style="font-size:16px">${ic}</span>
            <span style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.3px">${lb}</span>
            ${tid==='evidence'?`<span class="da-vt-badge">${item.evidence.length}</span>`:''}
            ${tid==='comments'?`<span class="da-vt-badge">${item.comments.length}</span>`:''}
          </button>`).join('')}
      </nav>
      <div class="da-pane" id="da-pane">${_daDetailOverview(item)}</div>
    </div>
  </div>`;
};

/* ── DETAIL TABS ─────────────────────────────────────────── */
window.daTab2 = function(tab, id) {
  document.querySelectorAll('.da-vtab').forEach(b=>b.classList.remove('active'));
  document.getElementById(`da-vt-${tab}`)?.classList.add('active');
  const pane = document.getElementById('da-pane');
  const item = DA_ITEMS.find(i=>i.id===id);
  if (!pane||!item) return;
  const map = { overview:_daDetailOverview, roles:_daDetailRoles, evidence:_daDetailEvidence, comments:_daDetailComments };
  pane.innerHTML = (map[tab]||_daDetailOverview)(item);
  pane.style.animation='none'; void pane.offsetHeight; pane.style.animation='daIn .18s ease';
};

/* ── DETAIL: OVERVIEW ────────────────────────────────────── */
function _daDetailOverview(item) {
  const over = _daIsOver(item.dueDate);
  const near = _daNear(item.dueDate);
  return `
  <div class="da-inner">
    <div class="da-sec-label">Action Details</div>
    ${_daDR('Action ID',   `<code class="da-code">${item.id}</code>`)}
    ${_daDR('Circular',    `${item.circularId}`)}
    ${_daDR('Clause',      `<code class="da-code">${item.clauseRef}</code>`)}
    ${_daDR('Department',  item.dept)}
    ${_daDR('Risk',        item.risk)}
    ${_daDR('Due Date',    `<span class="${over?'da-due-over':near?'da-due-near':'da-due-ok'}">${_daFmt(item.dueDate)}</span>`)}
    ${_daDR('Status',      item.status)}
    ${_daDR('Flow',        LIFECYCLE_CONFIG[item.flowId]?.name||item.flowId)}

    <div class="da-sec-label" style="margin-top:20px">Obligation</div>
    <div style="font-size:13px;color:#475569;line-height:1.7;border-left:2px solid #6366f1;padding-left:12px">${item.obligation}</div>

    <div class="da-sec-label" style="margin-top:20px">Description</div>
    <div style="font-size:13px;color:#64748b;line-height:1.7">${item.description}</div>
  </div>`;
}

/* ── DETAIL: ROLES ───────────────────────────────────────── */
function _daDetailRoles(item) {
  const f = LIFECYCLE_CONFIG[item.flowId];
  if (!f) return `<div class="da-inner"><div style="color:#94a3b8">No flow defined</div></div>`;

  const nonMgrSteps = f.steps.filter(s=>s.role!=='Manager');

  return `
  <div class="da-inner">
    <div class="da-sec-label">Role Assignments</div>
    ${nonMgrSteps.map(s => {
      const roleKey  = s.role.toLowerCase();
      const roleData = item.roles[roleKey];
      const user     = MI_TEAM.find(u=>u.id===roleData?.uid);
      const rsc      = _daRoleSC(roleData?.status||'Waiting');

      return `
      <div class="da-role-detail-row">
        <div class="da-role-detail-left">
          <div class="da-role-detail-tag">${s.label}</div>
          ${user ? `
            <div class="da-role-user" style="gap:10px">
              <span class="da-av-sm">${user.av}</span>
              <div>
                <div style="font-size:14px;font-weight:700;color:#0f172a">${user.name}</div>
                <div style="font-size:12px;color:#64748b">${user.role} · ${user.dept}</div>
              </div>
            </div>` : `
            <div style="display:flex;align-items:center;gap:10px">
              <div class="da-av-sm" style="background:#f1f5f9;color:#cbd5e1;border-color:#e2e8f0">?</div>
              <span style="color:#94a3b8;font-size:13px">Not assigned</span>
            </div>`}
        </div>
        <span class="da-pill" style="background:${rsc.bg};color:${rsc.fg}">${roleData?.status||'Waiting'}</span>
      </div>`;
    }).join('')}
  </div>`;
}

/* ── DETAIL: EVIDENCE ────────────────────────────────────── */
function _daDetailEvidence(item) {
  const sc = s=>s==='Verified'?{bg:'#ecfdf5',fg:'#065f46'}:{bg:'#fef9c3',fg:'#854d0e'};
  return `
  <div class="da-inner">
    <div class="da-sec-label">Evidence Documents</div>
    ${!item.evidence.length
      ? `<div style="color:#94a3b8;font-size:13px;padding:16px 0">No evidence uploaded yet</div>`
      : `<div class="da-ev-wrap">
          <table class="da-ev-table">
            <thead><tr>
              <th>Type</th><th>File</th><th>Uploaded By</th><th>Date</th><th>Status</th>
            </tr></thead>
            <tbody>
              ${item.evidence.map(ev=>`<tr>
                <td><span class="da-ev-type">${ev.type}</span></td>
                <td style="font-size:12.5px">📎 ${ev.file}</td>
                <td style="font-size:12.5px">${ev.uploadedBy}</td>
                <td style="font-size:12px;color:#64748b">${ev.date}</td>
                <td><span class="da-pill" style="background:${sc(ev.status).bg};color:${sc(ev.status).fg}">${ev.status}</span></td>
              </tr>`).join('')}
            </tbody>
          </table>
        </div>`}
  </div>`;
}

/* ── DETAIL: COMMENTS ────────────────────────────────────── */
function _daDetailComments(item) {
  return `
  <div class="da-inner">
    <div class="da-sec-label">Comments</div>
    <div id="da-thread-${item.id}" style="display:flex;flex-direction:column;gap:12px;margin-bottom:16px">
      ${item.comments.length
        ? item.comments.map(c=>_daCmtHTML(c)).join('')
        : `<div style="color:#94a3b8;font-size:13px;padding:8px 0">No comments yet</div>`}
    </div>
    <div style="display:flex;gap:9px;align-items:flex-start;padding-top:12px;border-top:1px solid var(--border,#e2e8f0)">
      <span class="da-av-xs" style="background:#1e293b;color:#fff;border-color:#1e293b">YO</span>
      <div style="flex:1">
        <textarea class="da-input" rows="3" id="da-cmt-${item.id}" placeholder="Add a comment…"></textarea>
        <div style="display:flex;justify-content:flex-end;margin-top:8px">
          <button class="da-btn da-btn-primary da-btn-sm" onclick="daPostCmt('${item.id}')">Post</button>
        </div>
      </div>
    </div>
  </div>`;
}

function _daCmtHTML(c) {
  const av=(c.author||'?').split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2);
  return `
  <div style="display:flex;gap:9px;align-items:flex-start">
    <span class="da-av-xs">${av}</span>
    <div style="flex:1;background:#f8fafc;border:1px solid var(--border,#e2e8f0);border-radius:4px 10px 10px 10px;padding:10px 12px">
      <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px;flex-wrap:wrap">
        <strong style="font-size:13px">${c.author}</strong>
        <span style="font-size:11px;color:#94a3b8">${c.role}</span>
        <span style="font-size:11px;color:#cbd5e1;margin-left:auto">${c.time}</span>
      </div>
      <div style="font-size:13px;color:#475569;line-height:1.55">${c.text}</div>
    </div>
  </div>`;
}

window.daPostCmt = function(itemId) {
  const item = DA_ITEMS.find(i=>i.id===itemId); if(!item) return;
  const el   = document.getElementById(`da-cmt-${itemId}`);
  const text = el?.value.trim();
  if (!text) { _daToast('Type something first','warn'); return; }
  const c = { author:'You', role:'Department Manager', time:'just now', text };
  item.comments.push(c);
  const thread = document.getElementById(`da-thread-${itemId}`);
  if (thread) {
    const d=document.createElement('div'); d.innerHTML=_daCmtHTML(c);
    const node=d.firstChild; node.style.animation='daIn .2s ease';
    thread.appendChild(node); el.value='';
    node.scrollIntoView({behavior:'smooth',block:'nearest'});
  }
  _daToast('Comment posted');
};

/* ── FLOW BAR ────────────────────────────────────────────── */
function _daFlowBar(item) {
  const flow = LIFECYCLE_CONFIG[item.flowId];
  if (!flow) return '';
  return `
  <div class="da-flow-bar">
    <div class="da-flow-bar-steps">
      ${flow.steps.map((s,i)=>{
        const done    = i < item.currentStep;
        const current = i === item.currentStep;
        const cls     = done?'da-fbs-done':current?'da-fbs-cur':'da-fbs-up';
        return `
        <div class="da-fbs ${cls}">
          <div class="da-fbs-dot">${done?'✓':s.icon}</div>
          <div class="da-fbs-lbl">${s.label}</div>
          ${current?`<div class="da-fbs-here">current</div>`:''}
        </div>
        ${i<flow.steps.length-1?`<div class="da-fbs-line${done?' da-fbs-line-done':''}"></div>`:''}`;
      }).join('')}
    </div>
  </div>`;
}

/* ── TABS ────────────────────────────────────────────────── */
window.daTab = function(tab) {
  _da.tab = tab;
  document.querySelectorAll('.da-tab').forEach(b=>b.classList.remove('act'));
  document.getElementById(`da-tab-${tab}`)?.classList.add('act');
  _daContent();
};

window.daClear = function() {
  _da.search=''; _da.fStatus=''; _da.fRisk=''; _da.fCirc='';
  document.getElementById('da-search').value='';
  document.querySelectorAll('.da-sel').forEach(s=>s.value='');
  _daRender();
};

/* ── FILTER ──────────────────────────────────────────────── */
function _daFiltered() {
  const s = _da.search.toLowerCase();
  return DA_ITEMS.filter(i => {
    if (_da.fStatus && i.status !== _da.fStatus) return false;
    if (_da.fRisk   && i.risk   !== _da.fRisk)   return false;
    if (_da.fCirc   && i.circularId !== _da.fCirc) return false;
    if (s && !`${i.id} ${i.title} ${i.circularId}`.toLowerCase().includes(s)) return false;

    /* role tab filter */
    if (_da.tab !== 'all') {
      const role = _da.tab.charAt(0).toUpperCase() + _da.tab.slice(1);
      const f    = LIFECYCLE_CONFIG[i.flowId];
      if (!f || !f.steps.some(step=>step.role===role)) return false;
    }
    return true;
  });
}

/* ── HELPERS ─────────────────────────────────────────────── */
function _daDR(l,v) { return `<div class="da-drow"><span class="da-dlbl">${l}</span><span class="da-dval">${v}</span></div>`; }
function _daFmt(ds) { if(!ds)return'—'; return new Date(ds+'T00:00:00').toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'}); }
function _daIsOver(ds) { return !!ds && new Date(ds+'T00:00:00') < new Date(); }
function _daNear(ds)   { if(!ds)return false; const d=Math.ceil((new Date(ds+'T00:00:00')-new Date())/86400000); return d>=0&&d<=14; }
function _daRisk(r)  { return({High:{bg:'#fee2e2',fg:'#991b1b'},Medium:{bg:'#fef9c3',fg:'#854d0e'},Low:{bg:'#dcfce7',fg:'#166534'}})[r]||{bg:'#f1f5f9',fg:'#475569'}; }
function _daSC(s)    { return({Unassigned:{bg:'#fee2e2',fg:'#991b1b'},Assigned:{bg:'#ecfdf5',fg:'#065f46'},'In Progress':{bg:'#e0f2fe',fg:'#0369a1'},'In Review':{bg:'#ede9fe',fg:'#5b21b6'},Complete:{bg:'#f0fdf4',fg:'#166534'},Overdue:{bg:'#fff7ed',fg:'#9a3412'}})[s]||{bg:'#f1f5f9',fg:'#475569'}; }
function _daRoleSC(s){ return({Complete:{bg:'#ecfdf5',fg:'#065f46'},'In Progress':{bg:'#e0f2fe',fg:'#0369a1'},Pending:{bg:'#fef9c3',fg:'#854d0e'},Waiting:{bg:'#f1f5f9',fg:'#94a3b8'},Assigned:{bg:'#ecfdf5',fg:'#065f46'}})[s]||{bg:'#f1f5f9',fg:'#475569'}; }

function _daToast(msg,type='ok') {
  if(typeof showToast==='function'){showToast(msg,type==='ok'?'success':'warning');return;}
  const t=document.createElement('div');
  t.style.cssText=`position:fixed;bottom:24px;right:24px;z-index:9999;background:#1e293b;color:#fff;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:600;padding:11px 20px;border-radius:10px;box-shadow:0 6px 24px rgba(0,0,0,.2);opacity:0;transition:opacity .2s;`;
  t.textContent=msg;document.body.appendChild(t);
  requestAnimationFrame(()=>t.style.opacity='1');
  setTimeout(()=>{t.style.opacity='0';setTimeout(()=>t.remove(),300);},2400);
}

/* ── STYLES ──────────────────────────────────────────────── */
function _daStyles() {
  if (document.getElementById('da-css')) return;
  const el=document.createElement('style'); el.id='da-css';
  el.textContent=`
  @keyframes daIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:none} }
  #da-root,#da-detail { font-family:'DM Sans',sans-serif; }

  /* Header */
  .da-page-header { display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:12px;margin-bottom:18px; }
  .da-page-title  { font-size:22px;font-weight:800;color:var(--text-primary,#0f172a);margin-bottom:3px; }
  .da-page-sub    { font-size:13px;color:#64748b; }

  /* Flow strip */
  .da-flow-strip { display:flex;align-items:center;gap:10px;background:#f8fafc;border:1px solid var(--border,#e2e8f0);border-radius:9px;padding:8px 14px; }
  .da-flow-lbl   { font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#94a3b8;white-space:nowrap; }
  .da-flow-steps { display:flex;align-items:center;gap:5px; }
  .da-fs         { font-size:12px;font-weight:600;color:#475569; }
  .da-fs-arr     { font-size:11px;color:#cbd5e1; }

  /* Summary */
  .da-summary { display:flex;gap:20px;flex-wrap:wrap;margin-bottom:16px; }
  .da-stat   { text-align:center; }
  .da-stat-v { font-size:22px;font-weight:800;line-height:1; }
  .da-stat-l { font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.05em;color:#94a3b8;margin-top:2px; }

  /* Topbar */
  .da-topbar  { display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:16px; }
  .da-tabs    { display:flex;background:#f1f5f9;border-radius:9px;padding:4px;gap:3px; }
  .da-tab     { display:flex;align-items:center;gap:6px;padding:7px 13px;border-radius:6px;border:none;background:transparent;font-family:inherit;font-size:13px;font-weight:600;color:#64748b;cursor:pointer;transition:all .15s;white-space:nowrap; }
  .da-tab:hover{ background:#fff;color:#0f172a; }
  .da-tab.act  { background:#fff;color:#0f172a;box-shadow:0 1px 4px rgba(0,0,0,.09); }
  .da-tbadge     { font-size:10px;font-weight:800;padding:1px 7px;border-radius:99px;background:#6366f1;color:#fff;min-width:18px;text-align:center; }
  .da-tbadge-dim { background:#e2e8f0;color:#64748b; }
  .da-tab.act .da-tbadge { background:#6366f1;color:#fff; }

  /* Filters */
  .da-filters { display:flex;align-items:center;gap:8px;flex-wrap:wrap; }
  .da-search-wrap { position:relative;min-width:160px; }
  .da-search-wrap input { width:100%;padding:7px 10px 7px 30px;border:1px solid var(--border,#e2e8f0);border-radius:7px;font-family:inherit;font-size:13px;outline:none;background:#fff;transition:border-color .18s; }
  .da-search-wrap input:focus { border-color:#6366f1; }
  .da-si { position:absolute;left:9px;top:50%;transform:translateY(-50%);color:#94a3b8;font-size:13px;pointer-events:none; }
  .da-sel { padding:7px 22px 7px 9px;border:1px solid var(--border,#e2e8f0);border-radius:7px;font-family:inherit;font-size:12px;color:#0f172a;cursor:pointer;outline:none;background:#fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='4'%3E%3Cpath d='M0 0l4 4 4-4z' fill='%2394a3b8'/%3E%3C/svg%3E") no-repeat right 6px center;-webkit-appearance:none;appearance:none; }
  .da-sel:focus { border-color:#6366f1; }
  .da-clr { padding:6px 10px;background:none;border:1px solid #fca5a5;border-radius:7px;font-size:12px;font-weight:700;color:#ef4444;cursor:pointer; }
  .da-clr:hover { background:#fee2e2; }

  /* All view blocks */
  .da-all-wrap { display:flex;flex-direction:column;gap:10px; }
  .da-action-block { background:#fff;border:1px solid var(--border,#e2e8f0);border-radius:10px;overflow:hidden;cursor:pointer;transition:box-shadow .15s; }
  .da-action-block:hover { box-shadow:0 2px 12px rgba(99,102,241,.1);border-color:#c7d2fe; }
  .da-ab-header { display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px 16px;border-bottom:1px solid #f4f5f8; }
  .da-ab-left   { display:flex;align-items:flex-start;gap:10px;min-width:0; }
  .da-ab-right  { display:flex;align-items:center;gap:8px;flex-shrink:0; }
  .da-ab-title  { font-weight:700;font-size:14px;color:#0f172a; }
  .da-ab-sub    { font-size:11px;color:#94a3b8;margin-top:2px; }
  .da-arr       { font-size:14px;color:#c7d2fe; }

  /* Role rows inside all view */
  .da-role-rows { padding:0 16px 4px; }
  .da-role-row  { display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid #f8fafc; }
  .da-role-row:last-child { border-bottom:none; }
  .da-role-tag  { font-size:10px;font-weight:700;background:#eef2ff;color:#4338ca;border:1px solid #c7d2fe;padding:2px 8px;border-radius:4px;white-space:nowrap;min-width:62px;text-align:center; }
  .da-role-user { display:flex;align-items:center;gap:7px; }
  .da-role-uname{ font-size:13px;font-weight:600;color:#0f172a; }
  .da-role-udept{ font-size:11px;color:#94a3b8; }
  .da-role-empty{ font-size:12px;color:#cbd5e1;font-style:italic; }

  /* Role tab table */
  .da-table-wrap { border:1px solid var(--border,#e2e8f0);border-radius:10px;overflow:hidden;background:#fff; }
  .da-table { width:100%;border-collapse:collapse;font-size:13.5px; }
  .da-table thead tr { background:#f8fafc; }
  .da-table th { padding:10px 13px;font-size:10.5px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#94a3b8;border-bottom:1px solid var(--border,#e2e8f0);white-space:nowrap; }
  .da-table td { padding:11px 13px;border-bottom:1px solid #f4f5f8;vertical-align:middle; }
  .da-table tbody tr:last-child td { border-bottom:none; }
  .da-row { cursor:pointer;transition:background .12s; }
  .da-row:hover td { background:#f5f6ff; }

  /* Detail */
  .da-dh { padding:0 0 16px;border-bottom:1px solid var(--border,#e2e8f0);margin-bottom:0; }
  .da-bc { display:flex;align-items:center;gap:5px;font-size:12px;margin-bottom:8px; }
  .da-back { color:#6366f1;font-weight:700;cursor:pointer;font-size:13px; }
  .da-back:hover { text-decoration:underline; }
  .da-dh-row { display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:10px; }
  .da-dh-title { font-size:20px;font-weight:800;color:#0f172a;line-height:1.3; }
  .da-chips { display:flex;gap:6px;flex-wrap:wrap;align-items:center;margin-bottom:14px; }
  .da-chip-blue { font-size:11px;font-weight:700;padding:3px 9px;border-radius:99px;background:#eef2ff;color:#4338ca;border:1px solid #c7d2fe; }
  .da-chip-grey { font-size:11px;font-weight:700;padding:3px 9px;border-radius:99px;background:#f1f5f9;color:#64748b;border:1px solid #e2e8f0; }

  /* Vtabs */
  .da-dbody { display:flex;min-height:400px; }
  .da-vtabs { width:68px;flex-shrink:0;display:flex;flex-direction:column;gap:1px;padding:10px 4px;border-right:1px solid var(--border,#e2e8f0);background:#f8fafc; }
  .da-vtab  { display:flex;flex-direction:column;align-items:center;gap:3px;padding:10px 3px;border-radius:7px;border:none;background:transparent;cursor:pointer;color:#94a3b8;font-family:inherit;transition:all .15s;position:relative; }
  .da-vtab:hover { background:#fff;color:#475569; }
  .da-vtab.active{ background:#eef2ff;color:#4338ca; }
  .da-vt-badge { position:absolute;top:5px;right:4px;background:#6366f1;color:#fff;font-size:8px;font-weight:800;padding:1px 4px;border-radius:99px; }
  .da-pane { flex:1;overflow-y:auto;animation:daIn .18s ease; }
  .da-pane::-webkit-scrollbar { width:3px; }
  .da-pane::-webkit-scrollbar-thumb { background:#e2e8f0;border-radius:99px; }
  .da-inner { padding:16px 16px 32px; }

  /* Flow bar */
  .da-flow-bar { margin-top:4px; }
  .da-flow-bar-steps { display:flex;align-items:center;gap:0; }
  .da-fbs { display:flex;flex-direction:column;align-items:center;gap:3px;min-width:60px; }
  .da-fbs-dot { width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;border:2px solid transparent; }
  .da-fbs-lbl { font-size:9px;font-weight:700;text-align:center;white-space:nowrap; }
  .da-fbs-here{ font-size:8px;font-weight:700;color:#6366f1;background:#eef2ff;padding:1px 5px;border-radius:99px;white-space:nowrap; }
  .da-fbs-done .da-fbs-dot { background:#10b981;color:#fff;border-color:#10b981; }
  .da-fbs-done .da-fbs-lbl { color:#10b981; }
  .da-fbs-cur  .da-fbs-dot { background:#6366f1;color:#fff;border-color:#6366f1;box-shadow:0 0 0 3px rgba(99,102,241,.15); }
  .da-fbs-cur  .da-fbs-lbl { color:#6366f1;font-weight:800; }
  .da-fbs-up   .da-fbs-dot { background:#fff;color:#cbd5e1;border-color:#e2e8f0; }
  .da-fbs-up   .da-fbs-lbl { color:#cbd5e1; }
  .da-fbs-line      { flex:1;height:2px;background:#e2e8f0;margin-bottom:18px;min-width:16px; }
  .da-fbs-line-done { background:#10b981; }

  /* Content elements */
  .da-sec-label { font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.08em;color:#94a3b8;margin-bottom:10px;display:flex;align-items:center;gap:8px; }
  .da-sec-label::after { content:'';flex:1;height:1px;background:var(--border,#e2e8f0); }
  .da-drow  { display:flex;align-items:baseline;gap:10px;padding:6px 0;border-bottom:1px solid #f1f5f9; }
  .da-dlbl  { font-size:11px;font-weight:700;color:#94a3b8;min-width:80px;flex-shrink:0; }
  .da-dval  { font-size:13px;color:#0f172a; }
  .da-code  { font-family:'DM Mono',monospace;font-size:11px;background:#eef2ff;color:#4338ca;border:1px solid #c7d2fe;padding:2px 6px;border-radius:4px; }

  .da-role-detail-row  { display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px 0;border-bottom:1px solid #f1f5f9; }
  .da-role-detail-row:last-child { border-bottom:none; }
  .da-role-detail-left { display:flex;align-items:center;gap:12px; }
  .da-role-detail-tag  { font-size:11px;font-weight:700;background:#eef2ff;color:#4338ca;border:1px solid #c7d2fe;padding:3px 10px;border-radius:5px;min-width:68px;text-align:center; }

  /* Evidence table */
  .da-ev-wrap  { border:1px solid var(--border,#e2e8f0);border-radius:8px;overflow:hidden; }
  .da-ev-table { width:100%;border-collapse:collapse;font-size:12.5px; }
  .da-ev-table thead tr { background:#f8fafc; }
  .da-ev-table th { padding:8px 12px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#94a3b8;border-bottom:1px solid var(--border,#e2e8f0); }
  .da-ev-table td { padding:9px 12px;border-bottom:1px solid #f4f5f8;vertical-align:middle; }
  .da-ev-table tbody tr:last-child td { border-bottom:none; }
  .da-ev-type { font-size:10.5px;font-weight:600;background:#f1f5f9;color:#475569;border:1px solid #e2e8f0;padding:2px 7px;border-radius:4px; }

  /* Shared atoms */
  .da-id   { font-family:'DM Mono',monospace;font-size:11px;font-weight:600;background:#eef2ff;color:#4338ca;border:1px solid #c7d2fe;padding:2px 7px;border-radius:5px; }
  .da-circ { font-size:10.5px;font-weight:700;background:#eef2ff;color:#4338ca;border:1px solid #c7d2fe;padding:2px 7px;border-radius:4px;font-family:'DM Mono',monospace; }
  .da-pill { display:inline-block;font-size:11px;font-weight:700;padding:3px 9px;border-radius:99px;white-space:nowrap; }
  .da-pill-sm { padding:2px 7px;font-size:10px; }
  .da-due-over { color:#dc2626;font-weight:700;font-size:12.5px; }
  .da-due-near { color:#d97706;font-weight:700;font-size:12.5px; }
  .da-due-ok   { color:#64748b;font-size:12.5px; }
  .da-av-xs { width:26px;height:26px;border-radius:50%;background:#eef2ff;color:#4338ca;font-size:9px;font-weight:800;display:inline-flex;align-items:center;justify-content:center;border:1.5px solid #c7d2fe;flex-shrink:0; }
  .da-av-sm { width:34px;height:34px;border-radius:50%;background:#eef2ff;color:#4338ca;font-size:11px;font-weight:800;display:flex;align-items:center;justify-content:center;border:1.5px solid #c7d2fe;flex-shrink:0; }

  /* Input + button */
  .da-input { background:#fff;border:1px solid var(--border,#e2e8f0);border-radius:7px;color:#0f172a;font-family:inherit;font-size:13px;padding:8px 10px;outline:none;width:100%;transition:border-color .15s;resize:vertical; }
  .da-input:focus { border-color:#6366f1;box-shadow:0 0 0 3px rgba(99,102,241,.08); }
  .da-btn { display:inline-flex;align-items:center;gap:5px;font-family:inherit;font-size:13px;font-weight:600;padding:8px 16px;border-radius:8px;border:none;cursor:pointer;transition:all .15s;white-space:nowrap; }
  .da-btn-primary { background:#6366f1;color:#fff; }
  .da-btn-primary:hover { background:#4f46e5; }
  .da-btn-sm { padding:5px 11px;font-size:12px;border-radius:6px; }

  /* Empty */
  .da-empty { text-align:center;padding:52px 24px; }
  .da-empty-icon { font-size:40px;margin-bottom:10px; }
  .da-empty-t { font-size:16px;font-weight:800;color:#0f172a;margin-bottom:4px; }
  .da-empty-s { font-size:13px;color:#94a3b8; }
  `;
  document.head.appendChild(el);
}