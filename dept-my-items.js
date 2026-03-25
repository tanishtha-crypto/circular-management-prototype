/* =============================================================
   dept-manager-items.js
   Call: renderManagerMyItems()
   Renders into #dept-my-items div (does NOT touch #content-area)
   
   Split panel: left = table with filters
                right = detail panel (Overview / Actions / Evidence / Comments)
                        with inline assignee picker
   ============================================================= */

/* ── TEAM (dept manager can assign to) ───────────────────── */
const MI_TEAM = [
  { id:'u1',  name:'Priya Nair',     role:'Compliance Officer', dept:'Compliance', av:'PN' },
  { id:'u2',  name:'Raj Iyer',       role:'IT Engineer',        dept:'IT',         av:'RI' },
  { id:'u3',  name:'Anand Krishnan', role:'Risk Analyst',       dept:'Risk',       av:'AK' },
  { id:'u4',  name:'Sneha Das',      role:'Legal Analyst',      dept:'Legal',      av:'SD' },
  { id:'u5',  name:'Suresh Kumar',   role:'Ops Analyst',        dept:'Operations', av:'SK' },
  { id:'u6',  name:'Meera Pillai',   role:'HR Specialist',      dept:'HR',         av:'MP' },
  { id:'u7',  name:'Karan Shah',     role:'Finance Analyst',    dept:'Finance',    av:'KS' },
  { id:'u8',  name:'Pooja Verma',    role:'IT Analyst',         dept:'IT',         av:'PV' },
];

const LIFECYCLE_CONFIG = {
  'flow-1': {
    name: 'Direct Assign',
    steps: [
      { role:'Manager',  label:'Manager',  icon:'◈' },
      { role:'Assignee', label:'Assignee', icon:'◉' },
      { role:'Manager',  label:'Review',   icon:'◈' },
    ]
  },
  'flow-2': {
    name: 'Assign → Review',
    steps: [
      { role:'Manager',  label:'Manager',  icon:'◈' },
      { role:'Assignee', label:'Assignee', icon:'◉' },
      { role:'Reviewer', label:'Reviewer', icon:'◇' },
      { role:'Manager',  label:'Approval', icon:'◈' },
    ]
  },
  'flow-3': {
    name: 'Full Lifecycle',
    steps: [
      { role:'Manager',  label:'Manager',  icon:'◈' },
      { role:'Assignee', label:'Assignee', icon:'◉' },
      { role:'Reviewer', label:'Reviewer', icon:'◇' },
      { role:'Approver', label:'Approver', icon:'✦' },
      { role:'Manager',  label:'Close',    icon:'◈' },
    ]
  },
};


/* ── DUMMY INBOX DATA ─────────────────────────────────────── */
const MI_ITEMS = [
  {
    id:'ACT-001', circularId:'CIRC-001', circularTitle:'Cybersecurity & IT Governance Framework',
    obligation:'Appoint a full-time CISO reporting directly to the Board of Directors.',
    clauseRef:'§3.1', title:'Draft CISO Job Description',
    dept:'HR', risk:'High', priority:'Critical',
    dueDate:'2025-03-15', status:'Unassigned', assigneeId:null,
    assignedBy:'Arjun Kumar', assignedOn:'2025-02-20',
    description:'Prepare a detailed job description for the Chief Information Security Officer role including reporting lines, responsibilities, qualifications and compensation band.',
    evidence:[], comments:[
      { author:'Arjun Kumar', role:'Compliance Head', time:'5 days ago', text:'Please prioritise this — board meeting in 3 weeks.' }
    ],
    flowId:'flow-2', currentStep:0
  },
  {
    id:'ACT-002', circularId:'CIRC-001', circularTitle:'Cybersecurity & IT Governance Framework',
    obligation:'Deploy a SIEM platform with 24×7 SOC monitoring within 180 days.',
    clauseRef:'§5.2', title:'SIEM Vendor Evaluation & RFP',
    dept:'IT', risk:'High', priority:'High',
    dueDate:'2025-03-20', status:'In Progress', assigneeId:'u2',
    assignedBy:'Arjun Kumar', assignedOn:'2025-02-18',
    description:'Evaluate minimum 3 SIEM vendors, prepare RFP document, shortlist and present recommendation to CISO.',
    evidence:[
      { id:'EV-001', type:'Vendor Comparison', file:'SIEM_Vendor_Matrix.xlsx', actionTitle:'SIEM Vendor Evaluation & RFP', status:'Pending Review', uploadedBy:'Raj Iyer', date:'12 Mar 2025' }
    ],
    comments:[
      { author:'Raj Iyer', role:'IT Engineer', time:'2 days ago', text:'Shortlisted Microsoft Sentinel, Splunk and IBM QRadar. RFP being drafted.' }
    ],
    flowId:'flow-3', currentStep:1,
  },
  {
    id:'ACT-003', circularId:'CIRC-002', circularTitle:'Enhanced Due Diligence (EDD) Guidelines',
    obligation:'Maintain a current EDD Standard Operating Procedure for all PEPs and High-Risk Customers.',
    clauseRef:'§2.1', title:'Document EDD SOP v2',
    dept:'Compliance', risk:'High', priority:'High',
    dueDate:'2025-03-28', status:'Unassigned', assigneeId:null,
    assignedBy:'Arjun Kumar', assignedOn:'2025-02-22',
    description:'Update the existing EDD SOP to incorporate new RBI guidelines. Must cover PEPs, HNIs and cross-border customers. Include escalation matrix and review cycle.',
    evidence:[], comments:[],
    flowId:'flow-1', currentStep:0,
  },
  {
    id:'ACT-004', circularId:'CIRC-002', circularTitle:'Enhanced Due Diligence (EDD) Guidelines',
    obligation:'Flag and review all cross-border transactions above ₹10 lakh within 24 hours.',
    clauseRef:'§4.1', title:'Configure Transaction Monitoring Rules',
    dept:'IT', risk:'High', priority:'Critical',
    dueDate:'2025-03-15', status:'Overdue', assigneeId:'u8',
    assignedBy:'Arjun Kumar', assignedOn:'2025-02-10',
    description:'Configure alert rules in the core banking system to flag all cross-border transactions above ₹10 lakh. Integrate with compliance dashboard.',
    evidence:[
      { id:'EV-002', type:'Config Document', file:'CBS_Alert_Config_Draft.pdf', actionTitle:'Configure Transaction Monitoring Rules', status:'Verified', uploadedBy:'Pooja Verma', date:'05 Mar 2025' }
    ],
    comments:[
      { author:'Pooja Verma', role:'IT Analyst', time:'4 days ago', text:'Config drafted but pending UAT sign-off from Compliance.' },
      { author:'Arjun Kumar', role:'Compliance Head', time:'3 days ago', text:'Please expedite — this is overdue.' }
    ],
    flowId:'flow-2', currentStep:1,
  },
  {
    id:'ACT-005', circularId:'CIRC-005', circularTitle:'Outsourcing & Third-Party Risk Policy',
    obligation:'Classify all vendor arrangements as Critical, Important, or Standard.',
    clauseRef:'§2.1', title:'Vendor Inventory Compilation',
    dept:'Operations', risk:'High', priority:'High',
    dueDate:'2025-01-31', status:'Overdue', assigneeId:'u5',
    assignedBy:'Arjun Kumar', assignedOn:'2025-01-15',
    description:'Compile a complete inventory of all vendors with contract value, service type, data access level and business criticality score.',
    evidence:[], comments:[
      { author:'Suresh Kumar', role:'Ops Analyst', time:'1 week ago', text:'Inventory 70% complete. Awaiting IT to share cloud vendor list.' }
    ],
    flowId:'flow-1', currentStep:0,
  },
  {
    id:'ACT-006', circularId:'CIRC-005', circularTitle:'Outsourcing & Third-Party Risk Policy',
    obligation:'Document and test exit strategies for all critical outsourcing arrangements annually.',
    clauseRef:'§5.1', title:'Draft Exit Strategy Template',
    dept:'Legal', risk:'Medium', priority:'Medium',
    dueDate:'2025-04-10', status:'Unassigned', assigneeId:null,
    assignedBy:'Arjun Kumar', assignedOn:'2025-03-01',
    description:'Create a standardised exit strategy template covering data migration, service continuity, transition timelines and legal obligations.',
    evidence:[], comments:[]
  },
  {
    id:'ACT-007', circularId:'CIRC-007', circularTitle:'AML / KYC Policy Revised Guidelines',
    obligation:'Implement risk-based KYC for all customer segments.',
    clauseRef:'§3.1', title:'Update KYC Risk Scoring Model',
    dept:'IT', risk:'Medium', priority:'High',
    dueDate:'2025-04-10', status:'Assigned', assigneeId:'u2',
    assignedBy:'Arjun Kumar', assignedOn:'2025-03-05',
    description:'Update the KYC risk scoring algorithm to incorporate new risk factors per revised RBI guidelines. Include PEP flag, transaction velocity and geographic risk.',
    evidence:[], comments:[
      { author:'Raj Iyer', role:'IT Engineer', time:'1 day ago', text:'Model design complete. Starting development sprint next week.' }
    ]
  },
];

/* ── STATE ───────────────────────────────────────────────── */
let _mi = {
  selected:   null,   // active item id
  tab:        'overview',
  search:     '',
  fStatus:    '',
  fRisk:      '',
  fCirc:      '',
  fPriority:  '',
  picker:     false,
};

/* ── ENTRY POINT ─────────────────────────────────────────── */
function renderManagerMyItems() {
  const wrap = document.getElementById('dept-my-items');
  if (!wrap) return;

  _mi = { selected:null, tab:'overview', search:'', fStatus:'', fRisk:'', fCirc:'', fPriority:'', picker:false };
  _miStyles();

  wrap.innerHTML = `
  <div id="mi-root">

    <!-- ── PAGE HEADER ── -->
    <div class="mi-page-header">
      
      <div class="mi-header-stats" id="mi-header-stats"></div>
    </div>

    <!-- ── SPLIT LAYOUT ── -->
    <div class="mi-split" id="mi-split">

      <!-- LEFT: filter + table -->
      <div class="mi-left" id="mi-left">

        <!-- Search + filter bar -->
        <div class="mi-filterbar">
          <div class="mi-search-wrap">
            <span class="mi-si">&#9906;</span>
            <input id="mi-search" placeholder="Search actions, circulars…"
                   oninput="_mi.search=this.value;miRenderTable()"/>
          </div>
          <select class="mi-sel" id="mi-f-status" onchange="_mi.fStatus=this.value;miRenderTable()">
            <option value="">All Status</option>
            <option>Unassigned</option><option>Assigned</option>
            <option>In Progress</option><option>Overdue</option><option>Complete</option>
          </select>
          <select class="mi-sel" id="mi-f-risk" onchange="_mi.fRisk=this.value;miRenderTable()">
            <option value="">All Risk</option>
            <option>High</option><option>Medium</option><option>Low</option>
          </select>
          <select class="mi-sel" id="mi-f-priority" onchange="_mi.fPriority=this.value;miRenderTable()">
            <option value="">All Priority</option>
            <option>Critical</option><option>High</option><option>Medium</option><option>Low</option>
          </select>
          <select class="mi-sel" id="mi-f-circ" onchange="_mi.fCirc=this.value;miRenderTable()" style="max-width:160px">
            <option value="">All Circulars</option>
            ${[...new Set(MI_ITEMS.map(i=>i.circularId))].map(id=>`<option value="${id}">${id}</option>`).join('')}
          </select>
          <button class="mi-clr" onclick="miClearFilters()">✕</button>
        </div>

        <!-- Table -->
        <div class="mi-table-wrap" id="mi-table-wrap"></div>

      </div>

      <!-- RIGHT: detail panel (hidden until row selected) -->
      <div class="mi-right" id="mi-right" style="display:none"></div>

    </div>
  </div>`;

  miRenderHeaderStats();
  miRenderTable();
}

/* ── HEADER STATS ────────────────────────────────────────── */
function miRenderHeaderStats() {
  const total    = MI_ITEMS.length;
  const unsn     = MI_ITEMS.filter(i=>i.status==='Unassigned').length;
  const overdue  = MI_ITEMS.filter(i=>i.status==='Overdue').length;
  const done     = MI_ITEMS.filter(i=>i.status==='Complete').length;

  document.getElementById('mi-header-stats').innerHTML = [
    { l:'Total',     v:total,   c:'#6366f1' },
    { l:'Unassigned',v:unsn,    c:'#ef4444' },
    { l:'Overdue',   v:overdue, c:'#f97316' },
    { l:'Complete',  v:done,    c:'#10b981' },
  ].map(s=>`
    <div class="mi-stat">
      <div class="mi-stat-v" style="color:${s.c}">${s.v}</div>
      <div class="mi-stat-l">${s.l}</div>
    </div>`).join('');
}

/* ── TABLE ───────────────────────────────────────────────── */
function miRenderTable() {
  const items  = miFiltered();
  const wrap   = document.getElementById('mi-table-wrap');
  if (!wrap) return;

  if (!items.length) {
    wrap.innerHTML = `<div class="mi-empty"><div class="mi-empty-icon">✓</div><div class="mi-empty-t">No items match</div><div class="mi-empty-s">Adjust filters or clear search</div></div>`;
    return;
  }

  wrap.innerHTML = `
  <table class="mi-table">
    <thead>
      <tr>
        <th style="width:100px">Action ID</th>
        <th>Action Name</th>
        <th style="width:90px">Circular</th>
       
        <th style="width:75px">Priority</th>
        <th style="width:100px">Assignee</th>
        <th style="width:90px">Due Date</th>
        <th style="width:110px">Status</th>
      </tr>
    </thead>
    <tbody>
      ${items.map(item => miTableRow(item)).join('')}
    </tbody>
  </table>`;
}

function miTableRow(item) {
  const user    = MI_TEAM.find(u=>u.id===item.assigneeId);
  const sc      = miStatusColor(item.status);
//   const rc      = miRiskColor(item.risk);
  const pc      = miPrioColor(item.priority);
  const over    = miIsOver(item.dueDate);
  const near    = miIsNear(item.dueDate);
  const isActive= _mi.selected === item.id;

  return `
  <tr class="mi-row${isActive?' mi-row-active':''} ${!item.assigneeId?'mi-row-u':over?'mi-row-o':''}"
      onclick="miOpenDetail('${item.id}')" id="mi-tr-${item.id}">
    <td>
      <code class="mi-id-tag">${item.id}</code>
    </td>
    <td>
      <div class="mi-act-title">${item.title}</div>
      <div class="mi-act-clause">${item.clauseRef} · ${item.circularId}</div>
    </td>
    <td><span class="mi-circ-tag">${item.circularId}</span></td>

    <td><span class="" style=";color:${pc.fg}">${item.priority}</span></td>
    <td>
      ${user
        ? `<div class="mi-asn-mini"><span class="mi-av-xs">${user.av}</span><span class="mi-asn-mini-name">${user.name.split(' ')[0]}</span></div>`
        : `<span class="mi-unasn-tag">Unassigned</span>`}
    </td>
    <td><span class="${over?'mi-due-over':near?'mi-due-near':'mi-due-ok'}">${miFmt(item.dueDate)}</span></td>
    <td><span class="" style="color:${sc.fg}">${item.status}</span></td>
  </tr>`;
}

/* ── OPEN DETAIL ─────────────────────────────────────────── */
function miOpenDetail(id) {
  _mi.selected = id;
  _mi.tab = 'overview';
  _mi.picker = false;

  const wrap = document.getElementById('mi-root');
  if (!wrap) return;
  wrap.innerHTML = miDetailShell(id);
  miRenderTab('overview');
}

/* ── CLOSE DETAIL ────────────────────────────────────────── */
window.miCloseDetail = function() {
  _mi.selected = null;
  renderManagerMyItems();
};

/* ── DETAIL SHELL ────────────────────────────────────────── */
function miDetailShell(id) {
  const item = MI_ITEMS.find(i=>i.id===id);
  if (!item) return '';
  const sc = miStatusColor(item.status);
  const rc = miRiskColor(item.risk);

  return `
  <div class="mi-detail">

    <!-- Sticky header -->
    <div class="mi-dh">
      <div class="mi-dh-top">
        <div style="min-width:0;flex:1">
          <div class="mi-dh-bc">
            <span class="mi-dh-back" onclick="miCloseDetail()">← My Items</span>
            <span class="mi-dh-sep">/</span>
            <code class="mi-dh-id">${item.id}</code>
          </div>
          <div class="mi-dh-title">${item.title}</div>
        </div>
        <button class="mi-x" onclick="miCloseDetail()">✕</button>
      </div>
      <div class="mi-dh-chips">
        <span class="mi-chip" style="background:${rc.bg};color:${rc.fg}">${item.risk} Risk</span>
        <span class="mi-chip mi-chip-blue">${item.circularId}</span>
        <span class="mi-chip mi-chip-grey">${item.dept}</span>
        <code class="mi-chip mi-chip-mono">${item.clauseRef}</code>
        <span class="mi-status-badge" style="background:${sc.bg};color:${sc.fg}">${item.status}</span>
      </div>
    </div>
   

    <!-- Vertical tabs + pane -->
    <div class="mi-dbody">
      <nav class="mi-vtabs">
        ${[['overview','◈','Overview'],['actions','⚡','Assign'],['evidence','📎','Evidence'],['comments','💬','Comments']]
          .map(([tid,ic,lb])=>`
          <button class="mi-vtab" id="mi-vt-${tid}" onclick="miRenderTab('${tid}')">
            <span class="mi-vt-ic">${ic}</span>
            <span class="mi-vt-lb">${lb}</span>
            ${tid==='evidence'?`<span class="mi-vt-badge">${item.evidence.length}</span>`:''}
            ${tid==='comments'?`<span class="mi-vt-badge">${item.comments.length}</span>`:''}
          </button>`).join('')}
      </nav>
      <div class="mi-pane" id="mi-pane"></div>
    </div>

            <span class="mi-dh-sep">/</span>
  </div>`;
}

/* ── SWITCH TAB ──────────────────────────────────────────── */
window.miRenderTab = function(tab) {
  _mi.tab = tab;
  document.querySelectorAll('.mi-vtab').forEach(b=>b.classList.remove('active'));
  document.getElementById(`mi-vt-${tab}`)?.classList.add('active');
  const pane = document.getElementById('mi-pane');
  if (!pane) return;
  const item = MI_ITEMS.find(i=>i.id===_mi.selected);
  if (!item) return;
  const map = { overview:miPaneOverview, actions:miPaneAssign, evidence:miPaneEvidence, comments:miPaneComments };
  pane.innerHTML = (map[tab]||miPaneOverview)(item);
  pane.style.animation='none'; void pane.offsetHeight; pane.style.animation='miIn .18s ease';
};

/* ══════════════════════════════════════════════════════════
   PANE: OVERVIEW
   ══════════════════════════════════════════════════════════ */
function miPaneOverview(item) {
  const rc = miRiskColor(item.risk);
  const sc = miStatusColor(item.status);
  const over = miIsOver(item.dueDate);
  const near = miIsNear(item.dueDate);

  return `
  <div class="mi-inner">
    <div class="mi-sec-label">Action Details</div>
    <div class="mi-dl" style="display:grid; grid-template-columns:repeat(3,1fr); gap:10px;">
      ${miDR('Action ID',   `<code class="mi-code">${item.id}</code>`)}
      ${miDR('Circular',    `<span class="mi-link">${item.circularId} — ${item.circularTitle}</span>`)}
      ${miDR('Clause',      `<code class="mi-code">${item.clauseRef}</code>`)}
      ${miDR('Department',  item.dept)}
      ${miDR('Priority',    item.priority)}
      ${miDR('Risk',        `<span style="color:${rc.fg};font-weight:700">${item.risk}</span>`)}
      ${miDR('Due Date',    `<span class="${over?'mi-due-over':near?'mi-due-near':'mi-due-ok'}">${miFmt(item.dueDate)}</span>`)}
      ${miDR('Status',      `<span style="color:${sc.fg};font-weight:700">${item.status}</span>`)}
      ${miDR('Assigned By', item.assignedBy)}
      ${miDR('Assigned On', item.assignedOn)}
    </div>

    <div class="mi-sec-label" style="margin-top:20px">Obligation</div>
   <div style="background:white;font-size:13px;color:#64748b;line-height:1.7;padding-left:4px;border-left:2px solid #6366f1;padding-left:12px">${item.obligation}</div>

    <div class="mi-sec-label" style="margin-top:20px">Description</div>
    <div style="background:white; font-size:13px;color:#64748b;line-height:1.7;padding-left:4px">${item.description}</div>
         <div>
  <span class="mi-dh-back" onclick="miShowAISuggestions()">🤝 AI Actions Suggestion</span>
</div>

<div id="mi-ai-container" style="display:none; margin-top:10px; border:1px solid #ddd; padding:10px;">
  <b>AI Suggestions</b>
  <div id="mi-ai-content">
    Suggested actions will appear here...
  </div>
</div>
    </div>`;
}

function miShowAISuggestions() {
  const el = document.getElementById("mi-ai-container");
  el.style.display = "block";
}
/* ══════════════════════════════════════════════════════════
   PANE: ASSIGN (the main action — assign to team member)
   ══════════════════════════════════════════════════════════ */
function miPaneAssign(item) {
  const flow  = LIFECYCLE_CONFIG[item.flowId];
  const steps = flow ? flow.steps.filter(s => s.role !== 'Manager') : [];

  const sections = steps.map((s, i) => {
    const assigneeKey = `assignee_${s.role.toLowerCase()}`;
    const uid  = item[assigneeKey] || null;
    const user = MI_TEAM.find(u => u.id === uid);

    return `
    <div class="mi-asn-section" id="mi-asns-${s.role.toLowerCase()}">
      <div class="mi-sec-label">Assign ${s.label}</div>
      ${user ? `
        <div class="mi-asn-set">
          <div class="mi-av-lg">${user.av}</div>
          <div>
            <div class="mi-asn-name-lg">${user.name}</div>
            <div class="mi-asn-role-lg">${user.role} · ${user.dept}</div>
          </div>
          <div style="margin-left:auto;display:flex;gap:8px">
            <button class="mi-btn mi-btn-ghost mi-btn-sm" onclick="miOpenRolePicker('${item.id}','${s.role}')">✎ Change</button>
            <button class="mi-btn mi-btn-danger-ghost mi-btn-sm" onclick="miUnassignRole('${item.id}','${s.role}')">✕</button>
          </div>
        </div>` : `
        <div style="display:flex;align-items:center;gap:12px;padding:6px 0">
          <div class="mi-av-lg" style="background:#f1f5f9;color:#cbd5e1;border-color:#e2e8f0">?</div>
          <div style="color:#94a3b8;font-size:13px">No one assigned yet</div>
          <button class="mi-btn mi-btn-primary mi-btn-sm" style="margin-left:auto" onclick="miOpenRolePicker('${item.id}','${s.role}')">＋ Assign</button>
        </div>`}
      <div id="mi-rp-${s.role.toLowerCase()}"></div>
    </div>`;
  }).join('');

  return `
  <div class="mi-inner">
    ${sections}

    <div class="mi-sec-label" style="margin-top:24px">Remarks</div>
    <textarea class="mi-input" rows="3" id="mi-remarks-${item.id}"
              placeholder="Add notes or instructions…"></textarea>
    <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:10px">
      <button class="mi-btn mi-btn-ghost mi-btn-sm" onclick="miCloseDetail()">Cancel</button>
      <button class="mi-btn mi-btn-primary" onclick="miSaveAssignment('${item.id}')">✓ Save</button>
    </div>
  </div>`;
}

window.miOpenRolePicker = function(itemId, role) {
  // close any other open picker first
  document.querySelectorAll('[id^="mi-rp-"]').forEach(el => el.innerHTML = '');

  const roleKey = role.toLowerCase();
  const wrap    = document.getElementById(`mi-rp-${roleKey}`);
  if (!wrap) return;

  const ROLE_MAP = {
    'Assignee': ['Compliance Officer','IT Engineer','Risk Analyst','Ops Analyst','HR Specialist','Finance Analyst','IT Analyst'],
    'Reviewer': ['Compliance Lead','Risk Analyst','Legal Counsel'],
    'Approver': ['Compliance Head','Legal Counsel'],
    'Filer':    ['Compliance Officer','Legal Analyst'],
  };

  const allowed  = ROLE_MAP[role] || [];
  const filtered = MI_TEAM.filter(u => !allowed.length || allowed.includes(u.role));
  const item     = MI_ITEMS.find(i => i.id === itemId);

  wrap.innerHTML = `
  <div class="mi-picker-box" style="margin-top:10px">
    <div class="mi-picker-search">
      <span class="mi-si">&#9906;</span>
      <input placeholder="Search…" autofocus
             oninput="miFilterRolePicker('${itemId}','${role}',this.value)"/>
    </div>
    <div class="mi-picker-list" id="mi-rplist-${roleKey}">
      ${miRolePickerItems(filtered, itemId, role)}
    </div>
  </div>`;

  setTimeout(() => wrap.querySelector('input')?.focus(), 40);
};

function miRolePickerItems(members, itemId, role) {
  if (!members.length) return `<div class="mi-picker-empty">No team members for this role</div>`;
  const assigneeKey = `assignee_${role.toLowerCase()}`;
  const item = MI_ITEMS.find(i => i.id === itemId);
  const cur  = item?.[assigneeKey];

  return members.map(u => `
    <div class="mi-picker-item ${cur===u.id?'mi-picker-cur':''}"
         onclick="miPickRoleAssign('${itemId}','${role}','${u.id}')">
      <div class="mi-av-sm">${u.av}</div>
      <div>
        <div class="mi-pi-name">${u.name}</div>
        <div class="mi-pi-role">${u.role} · ${u.dept}</div>
      </div>
      ${cur===u.id?'<span class="mi-pi-tick">✓</span>':''}
    </div>`).join('');
}

window.miFilterRolePicker = function(itemId, role, q) {
  const ROLE_MAP = {
    'Assignee': ['Compliance Officer','IT Engineer','Risk Analyst','Ops Analyst','HR Specialist','Finance Analyst','IT Analyst'],
    'Reviewer': ['Compliance Lead','Risk Analyst','Legal Counsel'],
    'Approver': ['Compliance Head','Legal Counsel'],
    'Filer':    ['Compliance Officer','Legal Analyst'],
  };
  const allowed  = ROLE_MAP[role] || [];
  const f        = q.toLowerCase();
  const filtered = MI_TEAM.filter(u =>
    (!allowed.length || allowed.includes(u.role)) &&
    (!f || u.name.toLowerCase().includes(f) || u.dept.toLowerCase().includes(f))
  );
  const el = document.getElementById(`mi-rplist-${role.toLowerCase()}`);
  if (el) el.innerHTML = miRolePickerItems(filtered, itemId, role);
};

window.miPickRoleAssign = function(itemId, role, uid) {
  const item = MI_ITEMS.find(i => i.id === itemId); if (!item) return;
  item[`assignee_${role.toLowerCase()}`] = uid;
  document.querySelectorAll('[id^="mi-rp-"]').forEach(el => el.innerHTML = '');
  miRenderTab('actions');
  _miToast(`${role} assigned to ${MI_TEAM.find(u=>u.id===uid)?.name}`);
};

window.miUnassignRole = function(itemId, role) {
  const item = MI_ITEMS.find(i => i.id === itemId); if (!item) return;
  item[`assignee_${role.toLowerCase()}`] = null;
  miRenderTab('actions');
  _miToast(`${role} unassigned`, 'warn');
};

/* ── PICKER inside assign pane ───────────────────────────── */
window.miOpenPicker = function(itemId) {
  const wrap = document.getElementById('mi-picker-wrap');
  if (!wrap) return;
  _mi.picker = true;
  wrap.innerHTML = `
  <div class="mi-picker-box">
    <div class="mi-picker-header">
      <div class="mi-sec-label" style="margin-bottom:0">Select Team Member</div>
      <button class="mi-x-sm" onclick="miClosePicker()">✕</button>
    </div>
    <div class="mi-picker-search">
      <span class="mi-si">&#9906;</span>
      <input placeholder="Search by name or department…"
             oninput="miFilterPicker('${itemId}',this.value)" autofocus/>
    </div>
    <div class="mi-picker-list" id="mi-plist">${miPickerItems(MI_TEAM, itemId)}</div>
  </div>`;
  setTimeout(()=>wrap.querySelector('input')?.focus(),40);
};

window.miClosePicker = function() {
  const wrap = document.getElementById('mi-picker-wrap');
  if (wrap) wrap.innerHTML = '';
  _mi.picker = false;
};

function miPickerItems(members, itemId) {
  if (!members.length) return `<div class="mi-picker-empty">No match</div>`;
  const item = MI_ITEMS.find(i=>i.id===itemId);
  return members.map(u=>`
    <div class="mi-picker-item${item?.assigneeId===u.id?' mi-picker-cur':''}"
         onclick="miPickAssign('${itemId}','${u.id}')">
      <div class="mi-av-sm">${u.av}</div>
      <div>
        <div class="mi-pi-name">${u.name}</div>
        <div class="mi-pi-role">${u.role} · ${u.dept}</div>
      </div>
      ${item?.assigneeId===u.id?'<span class="mi-pi-tick">✓</span>':''}
    </div>`).join('');
}

window.miFilterPicker = function(itemId, q) {
  const f = q.toLowerCase();
  const m = MI_TEAM.filter(u=>!f||u.name.toLowerCase().includes(f)||u.dept.toLowerCase().includes(f));
  const el = document.getElementById('mi-plist');
  if (el) el.innerHTML = miPickerItems(m, itemId);
};

window.miPickAssign = function(itemId, uid) {
  const item = MI_ITEMS.find(i=>i.id===itemId); if (!item) return;
  item.assigneeId = uid;
  if (item.status === 'Unassigned') item.status = 'Assigned';
  miClosePicker();
  miRenderTab('actions');
  miRenderTable();
  miRenderHeaderStats();
  _miToast(`Assigned to ${MI_TEAM.find(u=>u.id===uid)?.name}`);
};

window.miUnassign = function(itemId) {
  const item = MI_ITEMS.find(i=>i.id===itemId); if (!item) return;
  item.assigneeId = null; item.status = 'Unassigned';
  miRenderTab('actions');
  miRenderTable();
  miRenderHeaderStats();
  _miToast('Unassigned', 'warn');
};

window.miSetStatus = function(itemId, status) {
  const item = MI_ITEMS.find(i=>i.id===itemId); if (!item) return;
  item.status = status;
  miRenderTab('actions');
  miRenderTable();
  _miToast(`Status → ${status}`);
};

window.miSetSendFor = function(itemId, status) {
  const item = MI_ITEMS.find(i=>i.id===itemId); if (!item) return;
  item.status = staus;
  miRenderTab('actions');
  miRenderTable();
  _miToast(`Status → ${status}`);
};

window.miSaveAssignment = function(itemId) {
  const item = MI_ITEMS.find(i=>i.id===itemId); if (!item) return;
  const notes = document.getElementById(`mi-remarks-${itemId}`)?.value;
  if (notes) item._remarks = notes;
  _miToast('Assignment saved ✓');
  miCloseDetail();
};

function miFlowBar(item) {
  const flow = LIFECYCLE_CONFIG[item.flowId];
  if (!flow) return '';
  const steps = flow.steps;

  return `
  <div class="mi-flow-bar">
    <div class="mi-flow-name">${flow.name}</div>
    <div class="mi-flow-steps">
      ${steps.map((s, i) => {
        const done    = i < item.currentStep;
        const current = i === item.currentStep;
        const cls     = done ? 'mi-fs-done' : current ? 'mi-fs-cur' : 'mi-fs-up';
        return `
        <div class="mi-flow-step ${cls}">
          <div class="mi-fs-dot">${done ? '✓' : s.icon}</div>
          <div class="mi-fs-label">${s.label}</div>
          ${current ? `<div class="mi-fs-you">you are here</div>` : ''}
        </div>
        ${i < steps.length - 1 ? `<div class="mi-fs-line ${done?'mi-fs-line-done':''}"></div>` : ''}`;
      }).join('')}
    </div>
  </div>`;
}

/* ══════════════════════════════════════════════════════════
   PANE: EVIDENCE
   ══════════════════════════════════════════════════════════ */
function miPaneEvidence(item) {
  const sc = s => s==='Verified'?{bg:'#ecfdf5',fg:'#065f46'}:{bg:'#fef9c3',fg:'#854d0e'};
  return `
  <div class="mi-inner">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px">
      <div class="mi-sec-label" style="margin-bottom:0">Evidence Documents</div>
      <button class="mi-btn mi-btn-primary mi-btn-sm" onclick="miAddEvToggle('${item.id}')">＋ Add</button>
    </div>

    <!-- Add form -->
    <div id="mi-add-ev-${item.id}" style="display:none" class="mi-ev-add-form">
      <div class="mi-fg"><label>Type</label>
        <select class="mi-input" id="mi-ev-type-${item.id}">
          <option>Policy Document</option><option>Audit Trail</option>
          <option>Training Records</option><option>Screenshot</option>
          <option>API Logs</option><option>Other</option>
        </select>
      </div>
      <div class="mi-fg"><label>File / Link</label>
        <input class="mi-input" id="mi-ev-file-${item.id}" placeholder="filename.pdf or https://…"/>
      </div>
      <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:8px">
        <button class="mi-btn mi-btn-ghost mi-btn-sm" onclick="miAddEvToggle('${item.id}')">Cancel</button>
        <button class="mi-btn mi-btn-primary mi-btn-sm" onclick="miSaveEv('${item.id}')">Save</button>
      </div>
    </div>

    ${!item.evidence.length
      ? `<div class="mi-ev-empty"><div style="font-size:32px;margin-bottom:10px">📎</div><div>No evidence uploaded yet</div></div>`
      : `<div class="mi-tbl-wrap"><table class="mi-tbl">
          <thead><tr>
            <th>Action</th><th>Type</th><th>File</th>
            <th>Uploaded By</th><th>Date</th><th>Status</th><th></th>
          </tr></thead>
          <tbody>
            ${item.evidence.map(ev=>`<tr>
              <td style="font-size:12px;max-width:120px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${ev.actionTitle}">${ev.actionTitle}</td>
              <td><span class="mi-ev-type">${ev.type}</span></td>
              <td style="font-size:12px">${ev.file}</td>
              <td style="font-size:12px">${ev.uploadedBy}</td>
              <td style="font-size:12px;color:#64748b">${ev.date}</td>
              <td><span class="mi-pill" style="background:${sc(ev.status).bg};color:${sc(ev.status).fg}">${ev.status}</span></td>
              <td>${ev.status!=='Verified'?`<button class="mi-btn mi-btn-success mi-btn-xs" onclick="miVerifyEv('${ev.id}','${item.id}')">Verify</button>`:`<span style="color:#10b981;font-weight:700;font-size:12px">✓</span>`}</td>
            </tr>`).join('')}
          </tbody>
        </table></div>`}
  </div>`;
}

window.miAddEvToggle = function(id) {
  const f = document.getElementById(`mi-add-ev-${id}`);
  if (f) f.style.display = f.style.display==='none' ? 'block' : 'none';
};

window.miSaveEv = function(itemId) {
  const item = MI_ITEMS.find(i=>i.id===itemId); if (!item) return;
  const file = document.getElementById(`mi-ev-file-${itemId}`)?.value.trim();
  if (!file) { _miToast('Enter a file or link','warn'); return; }
  item.evidence.push({
    id:`EV-${Date.now().toString().slice(-4)}`,
    type: document.getElementById(`mi-ev-type-${itemId}`)?.value||'Document',
    file, actionTitle: item.title,
    status:'Pending Review', uploadedBy:'You',
    date: new Date().toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'})
  });
  _miToast('Evidence added ✓');
  miRenderTab('evidence');
};

window.miVerifyEv = function(evId, itemId) {
  const item = MI_ITEMS.find(i=>i.id===itemId); if (!item) return;
  const ev = item.evidence.find(e=>e.id===evId);
  if (ev) { ev.status='Verified'; _miToast('Marked Verified ✓'); miRenderTab('evidence'); }
};

/* ══════════════════════════════════════════════════════════
   PANE: COMMENTS
   ══════════════════════════════════════════════════════════ */
function miPaneComments(item) {
  return `
  <div class="mi-inner">
    <div class="mi-sec-label">Comments & Updates</div>
    <div class="mi-thread" id="mi-thread-${item.id}">
      ${item.comments.length
        ? item.comments.map(c=>miCmtHTML(c)).join('')
        : `<div class="mi-ev-empty"><div style="font-size:28px;margin-bottom:8px">💬</div><div>No comments yet</div></div>`}
    </div>
    <div class="mi-new-cmt">
      <span class="mi-av-xs" style="width:30px;height:30px;font-size:10px;background:#1e293b;color:#fff;border-color:#1e293b">YO</span>
      <div style="flex:1">
        <textarea class="mi-input" id="mi-cmt-${item.id}" rows="3"
                  placeholder="Add a comment or update…"></textarea>
        <div style="display:flex;justify-content:flex-end;margin-top:8px">
          <button class="mi-btn mi-btn-primary mi-btn-sm" onclick="miPostCmt('${item.id}')">Post</button>
        </div>
      </div>
    </div>
  </div>`;
}

function miCmtHTML(c) {
  const av = (c.author||'?').split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2);
  return `
  <div class="mi-cmt">
    <span class="mi-av-xs">${av}</span>
    <div class="mi-cmt-body">
      <div class="mi-cmt-meta">
        <strong>${c.author}</strong>
        <span class="mi-cmt-role">${c.role}</span>
        <span class="mi-cmt-time">${c.time}</span>
      </div>
      <div class="mi-cmt-text">${c.text}</div>
    </div>
  </div>`;
}

window.miPostCmt = function(itemId) {
  const item = MI_ITEMS.find(i=>i.id===itemId); if (!item) return;
  const el   = document.getElementById(`mi-cmt-${itemId}`);
  const text = el?.value.trim();
  if (!text) { _miToast('Type something first','warn'); return; }
  const c = { author:'You', role:'Department Manager', time:'just now', text };
  item.comments.push(c);
  const thread = document.getElementById(`mi-thread-${itemId}`);
  if (thread) {
    const d = document.createElement('div');
    d.innerHTML = miCmtHTML(c);
    const node = d.firstChild;
    node.style.animation = 'miIn .2s ease';
    thread.appendChild(node);
    el.value='';
    node.scrollIntoView({behavior:'smooth',block:'nearest'});
  }
  document.querySelectorAll(`#mi-vt-comments .mi-vt-badge`).forEach(b=>b.textContent=item.comments.length);
  _miToast('Comment posted');
};

/* ── FILTER ──────────────────────────────────────────────── */
function miFiltered() {
  const s = _mi.search.toLowerCase();
  return MI_ITEMS.filter(i => {
    if (_mi.fStatus   && i.status   !== _mi.fStatus)   return false;
    if (_mi.fRisk     && i.risk     !== _mi.fRisk)     return false;
    if (_mi.fPriority && i.priority !== _mi.fPriority) return false;
    if (_mi.fCirc     && i.circularId !== _mi.fCirc)   return false;
    if (s && !`${i.id} ${i.title} ${i.circularId} ${i.obligation}`.toLowerCase().includes(s)) return false;
    return true;
  });
}

window.miClearFilters = function() {
  _mi.search=''; _mi.fStatus=''; _mi.fRisk=''; _mi.fPriority=''; _mi.fCirc='';
  ['mi-search','mi-f-status','mi-f-risk','mi-f-priority','mi-f-circ']
    .forEach(id=>{const el=document.getElementById(id);if(el)el.value='';});
  miRenderTable();
};

/* ── HELPERS ─────────────────────────────────────────────── */
function miDR(l,v) { return `<div class="mi-drow"><span class="mi-dlbl">${l}</span><span class="mi-dval">${v}</span></div>`; }
function miFmt(ds) { if(!ds)return'—'; return new Date(ds+'T00:00:00').toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'}); }
function miIsOver(ds) { return !!ds && new Date(ds+'T00:00:00') < new Date(); }
function miIsNear(ds) { if(!ds)return false; const d=Math.ceil((new Date(ds+'T00:00:00')-new Date())/86400000); return d>=0&&d<=14; }
function miStatusColor(s) { return({Unassigned:{bg:'#fee2e2',fg:'#991b1b'},Assigned:{bg:'#ecfdf5',fg:'#065f46'},'In Progress':{bg:'#e0f2fe',fg:'#0369a1'},Complete:{bg:'#f0fdf4',fg:'#166534'},Overdue:{bg:'#fff7ed',fg:'#9a3412'}})[s]||{bg:'#f1f5f9',fg:'#475569'}; }
function miRiskColor(r)   { return({High:{bg:'#fee2e2',fg:'#991b1b'},Medium:{bg:'#fef9c3',fg:'#854d0e'},Low:{bg:'#dcfce7',fg:'#166534'}})[r]||{bg:'#f1f5f9',fg:'#475569'}; }
function miPrioColor(p)   { return({Critical:{bg:'#fdf2f8',fg:'#9d174d'},High:{bg:'#fee2e2',fg:'#991b1b'},Medium:{bg:'#fef9c3',fg:'#854d0e'},Low:{bg:'#f1f5f9',fg:'#64748b'}})[p]||{bg:'#f1f5f9',fg:'#475569'}; }

function _miToast(msg, type='ok') {
  if (typeof showToast==='function') { showToast(msg, type==='ok'?'success':'warning'); return; }
  const t=document.createElement('div');
  t.style.cssText=`position:fixed;bottom:24px;right:24px;z-index:9999;background:#1e293b;color:#fff;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:600;padding:11px 20px;border-radius:10px;box-shadow:0 6px 24px rgba(0,0,0,.2);opacity:0;transition:opacity .2s;pointer-events:none;`;
  t.textContent=msg; document.body.appendChild(t);
  requestAnimationFrame(()=>t.style.opacity='1');
  setTimeout(()=>{t.style.opacity='0';setTimeout(()=>t.remove(),300);},2400);
}

/* ── STYLES ──────────────────────────────────────────────── */
function _miStyles() {
  if (document.getElementById('mi-css')) return;
  const el = document.createElement('style'); el.id='mi-css';
  el.textContent = `
  @keyframes miIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:none} }

  #mi-root { font-family:'DM Sans',sans-serif; height:100%; display:flex; flex-direction:column; }

  /* ── PAGE HEADER ── */
  .mi-page-header {
    display:flex; align-items:flex-end; justify-content:center;
    flex-wrap:wrap; gap:12px; margin-bottom:20px;
  }
  .mi-page-title { font-size:22px; font-weight:800; color:var(--text-primary,#0f172a); margin-bottom:3px; }
  .mi-page-sub   { font-size:13px; color:#64748b; }
  .mi-header-stats { display:flex; gap:16px; align-items:center; }
  .mi-stat { text-align:center; }
  .mi-stat-v { font-size:22px; font-weight:800; line-height:1; }
  .mi-stat-l { font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:.05em; color:#94a3b8; margin-top:2px; }

  /* ── SPLIT ── */
  .mi-split { display:flex; gap:0; flex:1; min-height:0; border:1px solid var(--border,#e2e8f0); border-radius:12px; overflow:hidden; background:#fff; }
  .mi-left  { flex:1; min-width:0; display:flex; flex-direction:column; overflow:hidden; }
  .mi-right { width:420px; flex-shrink:0; display:flex; flex-direction:column; border-left:1px solid var(--border,#e2e8f0); overflow-y:auto; }
  .mi-right::-webkit-scrollbar { width:3px; }
  .mi-right::-webkit-scrollbar-thumb { background:#e2e8f0; border-radius:99px; }
  .mi-split-open .mi-left { border-right:1px solid var(--border,#e2e8f0); }

  /* ── FILTER BAR ── */
  .mi-filterbar {
    display:flex; align-items:center; gap:8px; flex-wrap:wrap;
    padding:12px 14px; border-bottom:1px solid var(--border,#e2e8f0);
    background:#f8fafc;
  }
  .mi-search-wrap { position:relative; min-width:180px; flex:1; max-width:260px; }
  .mi-search-wrap input {
    width:100%; padding:8px 10px 8px 32px;
    border:1px solid var(--border,#e2e8f0); border-radius:8px;
    font-family:inherit; font-size:13px; outline:none; background:#fff;
    transition:border-color .18s;
  }
  .mi-search-wrap input:focus { border-color:#6366f1; }
  .mi-si { position:absolute; left:10px; top:50%; transform:translateY(-50%); color:#94a3b8; font-size:14px; pointer-events:none; }
  .mi-sel {
    padding:7px 24px 7px 9px; border:1px solid var(--border,#e2e8f0); border-radius:7px;
    font-family:inherit; font-size:12px; color:#0f172a; cursor:pointer; outline:none;
    background:#fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='4'%3E%3Cpath d='M0 0l4 4 4-4z' fill='%2394a3b8'/%3E%3C/svg%3E") no-repeat right 7px center;
    -webkit-appearance:none; appearance:none; transition:border-color .15s;
  }
  .mi-sel:focus { border-color:#6366f1; }
  .mi-clr { padding:6px 10px; background:none; border:1px solid #fca5a5; border-radius:7px; font-size:12px; font-weight:700; color:#ef4444; cursor:pointer; }
  .mi-clr:hover { background:#fee2e2; }

  /* ── TABLE ── */
  .mi-table-wrap { flex:1; overflow-y:auto; }
  .mi-table-wrap::-webkit-scrollbar { width:3px; }
  .mi-table-wrap::-webkit-scrollbar-thumb { background:#e2e8f0; border-radius:99px; }
  .mi-table { width:100%; border-collapse:collapse; font-size:13.5px; }
  .mi-table thead tr { background:#f8fafc; position:sticky; top:0; z-index:1; }
  .mi-table th { padding:10px 13px; text-align:left; font-size:10.5px; font-weight:700; text-transform:uppercase; letter-spacing:.06em; color:#94a3b8; border-bottom:1px solid var(--border,#e2e8f0); white-space:nowrap; }
  .mi-table td { padding:11px 13px; border-bottom:1px solid #f4f5f8; vertical-align:middle; }
  .mi-table tbody tr:last-child td { border-bottom:none; }
  .mi-row { cursor:pointer; transition:background .12s; }
  .mi-row:hover td { background:#f5f6ff; }
  .mi-row-active td { background:#eef2ff !important; }
  .mi-row-u td:first-child { border-left:3px solid #ef4444; }
  .mi-row-o td:first-child { border-left:3px solid #f97316; }

  .mi-id-tag { font-family:'DM Mono',monospace; font-size:11px; font-weight:600; background:#eef2ff; color:#4338ca; border:1px solid #c7d2fe; padding:2px 7px; border-radius:5px; }
  .mi-act-title  { font-weight:600; font-size:13.5px; color:#0f172a; }
  .mi-act-clause { font-size:11px; color:#94a3b8; margin-top:2px; }
  .mi-circ-tag   { font-size:10.5px; font-weight:700; color:#4338ca;  padding:2px 7px; border-radius:4px; font-family:'DM Mono',monospace; }
  .mi-pill       { display:inline-block; font-size:11px; font-weight:700; padding:3px 9px; border-radius:99px; white-space:nowrap; }
  .mi-unasn-tag  { font-size:11px; font-weight:700; color:#ef4444; background:#fee2e2; padding:2px 8px; border-radius:99px; }
  .mi-asn-mini   { display:flex; align-items:center; gap:5px; }
  .mi-asn-mini-name { font-size:12px; font-weight:600; }
  .mi-due-over   { color:#dc2626; font-weight:700; font-size:12.5px; }
  .mi-due-near   { color:#d97706; font-weight:700; font-size:12.5px; }
  .mi-due-ok     { color:#64748b; font-size:12.5px; }
    .mi-due-over,
.mi-due-near,
.mi-due-ok{
  white-space: nowrap;
}

/* ── FLOW BAR ── */
.mi-flow-bar {
  padding: 14px 16px 12px;
  border-bottom: 1px solid var(--border, #e2e8f0);
  background: #fafbff;
}
.mi-flow-name {
  font-size: 10px; font-weight: 700; text-transform: uppercase;
  letter-spacing: .08em; color: #94a3b8; margin-bottom: 12px;
}
.mi-flow-steps {
  display: flex; align-items: center; gap: 0;
}
.mi-flow-step {
  display: flex; flex-direction: column;
  align-items: center; gap: 4px; position: relative;
  min-width: 64px;
}
.mi-fs-dot {
  width: 30px; height: 30px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 12px; font-weight: 800; border: 2px solid transparent;
  transition: all .2s;
}
.mi-fs-label {
  font-size: 10px; font-weight: 700; text-align: center;
  white-space: nowrap;
}
.mi-fs-you {
  font-size: 9px; font-weight: 700; color: #6366f1;
  text-transform: uppercase; letter-spacing: .05em;
  background: #eef2ff; padding: 1px 5px; border-radius: 99px;
  white-space: nowrap;
}

/* done */
.mi-fs-done .mi-fs-dot  { background: #10b981; color: #fff; border-color: #10b981; }
.mi-fs-done .mi-fs-label{ color: #10b981; }

/* current */
.mi-fs-cur .mi-fs-dot   { background: #6366f1; color: #fff; border-color: #6366f1;
                           box-shadow: 0 0 0 4px rgba(99,102,241,.15); }
.mi-fs-cur .mi-fs-label { color: #6366f1; font-weight: 800; }

/* upcoming */
.mi-fs-up .mi-fs-dot    { background: #fff; color: #cbd5e1; border-color: #e2e8f0; }
.mi-fs-up .mi-fs-label  { color: #cbd5e1; }

/* connector line */
.mi-fs-line {
  flex: 1; height: 2px; background: #e2e8f0;
  margin-bottom: 20px; min-width: 20px;
}
.mi-fs-line-done { background: #10b981; }

.mi-asn-section {
  padding-bottom: 20px;
  margin-bottom: 20px;
  border-bottom: 1px solid var(--border, #e2e8f0);
}
.mi-asn-section:last-of-type {
  border-bottom: none;
}

  /* ── DETAIL PANEL ── */
  .mi-detail { display:flex; flex-direction:column; height:100%; }
  .mi-dh {
    padding:16px 16px 12px; border-bottom:1px solid var(--border,#e2e8f0);
    background:#fff; position:sticky; top:0; z-index:10;
  }
  .mi-dh-top { display:flex; align-items:flex-start; justify-content:space-between; gap:8px; margin-bottom:10px; }
  .mi-dh-bc  { display:flex; align-items:center; gap:5px; font-size:12px; margin-bottom:5px; }
  .mi-dh-back { color:#6366f1; font-weight:700; cursor:pointer; font-size:13px; }
  .mi-dh-back:hover { text-decoration:underline; }
  .mi-dh-sep  { color:#cbd5e1; }
  .mi-dh-id   { font-family:'DM Mono',monospace; font-size:10px; color:#94a3b8; background:none; border:none; padding:0; }
  .mi-dh-title { font-size:16px; font-weight:800; color:#0f172a; line-height:1.35; }
  .mi-x { background:none; border:1px solid var(--border,#e2e8f0); color:#94a3b8; border-radius:6px; width:28px; height:28px; cursor:pointer; font-size:11px; display:flex; align-items:center; justify-content:center; flex-shrink:0; transition:all .15s; }
  .mi-x:hover { background:#fee2e2; color:#ef4444; border-color:#fca5a5; }
  .mi-dh-chips { display:flex; gap:5px; flex-wrap:wrap; align-items:center; }
  .mi-chip      { font-size:11px; font-weight:700; padding:3px 9px; border-radius:99px; border:1px solid transparent; }
  .mi-chip-blue { background:#eef2ff; color:#4338ca; border-color:#c7d2fe; }
  .mi-chip-grey { background:#f1f5f9; color:#64748b; border-color:#e2e8f0; }
  .mi-chip-mono { background:#f1f5f9; color:#64748b; border-color:#e2e8f0; font-family:'DM Mono',monospace; }
  .mi-status-badge { font-size:11px; font-weight:700; padding:3px 9px; border-radius:99px; }

  /* ── VTABS ── */
  .mi-dbody { display:flex; flex:1; overflow:hidden; }
  .mi-vtabs { width:68px; flex-shrink:0; display:flex; flex-direction:column; gap:1px; padding:10px 4px; border-right:1px solid var(--border,#e2e8f0); background:#f8fafc; }
  .mi-vtab  { display:flex; flex-direction:column; align-items:center; gap:3px; padding:10px 3px; border-radius:7px; border:none; background:transparent; cursor:pointer; color:#94a3b8; font-family:inherit; font-size:9px; font-weight:700; text-transform:uppercase; letter-spacing:.3px; transition:all .15s; position:relative; text-align:center; }
  .mi-vtab:hover { background:#fff; color:#475569; }
  .mi-vtab.active { background:#eef2ff; color:#4338ca; }
  .mi-vt-ic { font-size:16px; line-height:1; }
  .mi-vt-lb { line-height:1.2; }
  .mi-vt-badge { position:absolute; top:5px; right:4px; background:#6366f1; color:#fff; font-size:8px; font-weight:800; padding:1px 4px; border-radius:99px; }
  .mi-pane { flex:1; overflow-y:auto; animation:miIn .18s ease; }
  .mi-pane::-webkit-scrollbar { width:3px; }
  .mi-pane::-webkit-scrollbar-thumb { background:#e2e8f0; border-radius:99px; }
  .mi-inner { padding:16px 16px 32px; }

  /* ── CONTENT ── */
  .mi-sec-label { font-size:10px; font-weight:800; text-transform:uppercase; letter-spacing:.08em; color:#94a3b8; margin-bottom:10px; display:flex; align-items:center; gap:8px; }
  .mi-sec-label::after { content:''; flex:1; height:1px; background:var(--border,#e2e8f0); }
  .mi-dl    { display:flex; flex-direction:column; gap:1px; }
 .mi-drow { display:flex; align-items:baseline; gap:10px; padding:5px 0; border-bottom:1px solid #f1f5f9; }
  .mi-dlbl  { font-size:11px; font-weight:700; color:#94a3b8; min-width:80px; flex-shrink:0; }
  .mi-dval  { font-size:13px; font-weight:500; color:#0f172a; }
  .mi-link  { color:#6366f1; font-size:13px; }
  .mi-code  { font-family:'DM Mono',monospace; font-size:11px; background:#eef2ff; color:#4338ca; border:1px solid #c7d2fe; padding:2px 6px; border-radius:4px; }


  /* ── ASSIGN PANE ── */
  .mi-asn-card { padding:4px 0; }
  .mi-asn-set  { display:flex; align-items:center; gap:12px; margin-bottom:12px; }
  .mi-asn-name-lg { font-size:15px; font-weight:800; color:#0f172a; }
  .mi-asn-role-lg { font-size:12px; color:#64748b; margin-top:2px; }
  .mi-asn-actions { display:flex; gap:8px; }
  .mi-unasn-card  { text-align:center; padding:20px 16px; }
  .mi-unasn-icon  { font-size:36px; margin-bottom:8px; }
  .mi-unasn-text  { font-size:14px; color:#94a3b8; margin-bottom:14px; }

  /* Status options */
  .mi-status-opt { padding:6px 14px; border-radius:7px; border:1.5px solid var(--border,#e2e8f0); background:#fff; font-family:inherit; font-size:12px; font-weight:600; color:#64748b; cursor:pointer; transition:all .15s; }
  .mi-status-opt:hover { border-color:#6366f1; color:#6366f1; background:#eef2ff; }
  .mi-status-opt.active { font-weight:700; }

  /* Picker */
  .mi-picker-box { background:#fff; border:1px solid var(--border,#e2e8f0); border-radius:12px; overflow:hidden; box-shadow:0 4px 18px rgba(0,0,0,.1); animation:miIn .15s ease; }
  .mi-picker-header { display:flex; align-items:center; justify-content:space-between; padding:12px 12px 8px; border-bottom:1px solid var(--border,#e2e8f0); }
  .mi-picker-search { position:relative; padding:8px 10px; border-bottom:1px solid var(--border,#e2e8f0); }
  .mi-picker-search input { width:100%; padding:7px 9px 7px 30px; border:1px solid var(--border,#e2e8f0); border-radius:7px; font-family:inherit; font-size:13px; outline:none; background:#f8fafc; }
  .mi-picker-search input:focus { border-color:#6366f1; background:#fff; }
  .mi-picker-search .mi-si { left:18px; }
  .mi-picker-list { max-height:200px; overflow-y:auto; }
  .mi-picker-item { display:flex; align-items:center; gap:9px; padding:9px 12px; cursor:pointer; transition:background .12s; }
  .mi-picker-item:hover { background:#f5f6ff; }
  .mi-picker-cur  { background:#eef2ff; }
  .mi-pi-name { font-size:13px; font-weight:700; }
  .mi-pi-role { font-size:11px; color:#94a3b8; }
  .mi-pi-tick { margin-left:auto; color:#10b981; font-weight:800; font-size:13px; }
  .mi-picker-empty { padding:18px; text-align:center; font-size:13px; color:#94a3b8; }
  .mi-x-sm { background:none; border:1px solid var(--border,#e2e8f0); border-radius:5px; width:22px; height:22px; cursor:pointer; font-size:10px; color:#94a3b8; display:flex; align-items:center; justify-content:center; }
  .mi-x-sm:hover { background:#fee2e2; color:#ef4444; }

  /* Avatar */
  .mi-av-lg { width:40px; height:40px; border-radius:50%; background:#eef2ff; color:#4338ca; font-size:12px; font-weight:800; display:flex; align-items:center; justify-content:center; border:1.5px solid #c7d2fe; flex-shrink:0; }
  .mi-av-sm { width:34px; height:34px; border-radius:50%; background:#eef2ff; color:#4338ca; font-size:11px; font-weight:800; display:flex; align-items:center; justify-content:center; border:1.5px solid #c7d2fe; flex-shrink:0; }
  .mi-av-xs { width:26px; height:26px; border-radius:50%; background:#eef2ff; color:#4338ca; font-size:9px; font-weight:800; display:inline-flex; align-items:center; justify-content:center; border:1.5px solid #c7d2fe; flex-shrink:0; }

  /* Evidence */
  .mi-tbl-wrap { overflow-x:auto; border:1px solid var(--border,#e2e8f0); border-radius:8px; }
  .mi-tbl { width:100%; border-collapse:collapse; font-size:12.5px; }
  .mi-tbl thead tr { background:#f8fafc; }
  .mi-tbl th { padding:8px 12px; font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:.06em; color:#94a3b8; border-bottom:1px solid var(--border,#e2e8f0); }
  .mi-tbl td { padding:9px 12px; border-bottom:1px solid #f4f5f8; vertical-align:middle; }
  .mi-tbl tbody tr:last-child td { border-bottom:none; }
  .mi-ev-type { font-size:10.5px; font-weight:600; background:#f1f5f9; color:#475569; border:1px solid #e2e8f0; padding:2px 7px; border-radius:4px; }
  .mi-ev-add-form { background:none; border:1px solid #ddd6fe; border-radius:9px; padding:12px 14px; margin-bottom:12px; display:flex; flex-direction:column; gap:8px; }
  .mi-ev-empty { text-align:center; padding:28px 16px; color:#94a3b8; font-size:13px; }
  .mi-fg { display:flex; flex-direction:column; gap:4px; }
  .mi-fg label { font-size:11px; font-weight:700; color:#94a3b8; text-transform:uppercase; letter-spacing:.05em; }

  /* Comments */
  .mi-thread { display:flex; flex-direction:column; gap:12px; margin-bottom:16px; }
  .mi-cmt    { display:flex; gap:9px; align-items:flex-start; }
  .mi-cmt-body { flex:1; background:#f8fafc; border:1px solid var(--border,#e2e8f0); border-radius:4px 10px 10px 10px; padding:10px 12px; }
  .mi-cmt-meta { display:flex; align-items:center; gap:6px; margin-bottom:4px; flex-wrap:wrap; }
  .mi-cmt-meta strong { font-size:13px; font-weight:700; }
  .mi-cmt-role { font-size:11px; color:#94a3b8; }
  .mi-cmt-time { font-size:11px; color:#cbd5e1; margin-left:auto; }
  .mi-cmt-text { font-size:13px; color:#475569; line-height:1.55; }
  .mi-new-cmt  { display:flex; gap:9px; align-items:flex-start; padding-top:12px; border-top:1px solid var(--border,#e2e8f0); }

  /* Inputs + buttons */
  .mi-input { background:#fff; border:1px solid var(--border,#e2e8f0); border-radius:7px; color:#0f172a; font-family:inherit; font-size:13px; padding:8px 10px; outline:none; width:100%; transition:border-color .15s; }
  .mi-input:focus { border-color:#6366f1; box-shadow:0 0 0 3px rgba(99,102,241,.08); }
  textarea.mi-input { resize:vertical; min-height:60px; }
  .mi-btn { display:inline-flex; align-items:center; gap:5px; font-family:inherit; font-size:13px; font-weight:600; padding:8px 16px; border-radius:8px; border:none; cursor:pointer; transition:all .15s; white-space:nowrap; }
  .mi-btn-primary      { background:#6366f1; color:#fff; }
  .mi-btn-primary:hover{ background:#4f46e5; }
  .mi-btn-ghost        { background:#fff; color:#475569; border:1px solid var(--border,#e2e8f0); }
  .mi-btn-ghost:hover  { background:#f8fafc; }
  .mi-btn-success      { background:#dcfce7; color:#166534; border:1px solid #86efac; }
  .mi-btn-danger-ghost { background:#fff; color:#ef4444; border:1px solid #fca5a5; }
  .mi-btn-danger-ghost:hover { background:#fee2e2; }
  .mi-btn-sm  { padding:5px 11px; font-size:12px; border-radius:6px; }
  .mi-btn-xs  { padding:3px 8px; font-size:11px; border-radius:5px; }

  /* Empty */
  .mi-empty { text-align:center; padding:52px 24px; }
  .mi-empty-icon { font-size:40px; margin-bottom:10px; }
  .mi-empty-t    { font-size:16px; font-weight:800; color:#0f172a; margin-bottom:4px; }
  .mi-empty-s    { font-size:13px; color:#94a3b8; }
  `;
  document.head.appendChild(el);
}