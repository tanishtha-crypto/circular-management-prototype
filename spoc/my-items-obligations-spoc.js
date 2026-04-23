const SPOC_PROFILE = window.SPOC_PROFILE || { name: 'Priya Sharma', initials: 'PS', branch: 'Bangalore', branchCode: 'BLR', departments: ['IT', 'Risk', 'Compliance'], color: '#eef2ff', textColor: '#4338ca' };
const SPOC_BRANCH = SPOC_PROFILE.branch;
const SPOC_DEPTS = SPOC_PROFILE.departments || [];

let spocTabMode = 'obligations';
let spocFilters = { status: '', search: '', from: '', to: '' };

const SPOC_DEPT_MEMBERS = {
    'IT': ['Raj Iyer', 'Anand Kumar', 'Sneha Mehta', 'Vikram Nair'],
    'Risk': ['Rahul Verma', 'Deepak Joshi', 'Anita Singh'],
    'Compliance': ['Priya Nair', 'Meera Rao', 'Suresh Pillai'],
    'Legal': ['Kavitha Menon', 'Deepak Iyer', 'Nisha Gupta'],
    'Finance': ['Neha Patel', 'Ravi Krishnan', 'Amit Shah'],
    'Operations': ['Suresh Kumar', 'Divya Iyer', 'Rajesh Menon'],
};

function renderMyItemsObligations() {
    spocFilters = { status: '', search: '', from: '', to: '' };
    const area = document.getElementById('content-area');
    area.innerHTML = buildSpocShell();
    initSpocListeners();
    renderSpocContent();
}

function buildSpocShell() {
    return `
  <div class="fade-in">

    <!-- TAB TOGGLE -->
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:14px;flex-wrap:wrap;">
      <div style="display:flex;background:#f1f5f9;border-radius:8px;padding:3px;gap:2px;">
        <button id="spoc-tab-obligations" onclick="spocSetTab('obligations')"
          style="padding:6px 14px;border:none;border-radius:6px;font-size:12px;font-weight:700;cursor:pointer;background:#6366f1;color:#fff;font-family:inherit;transition:all .15s;">
          Obligations
        </button>
        <button id="spoc-tab-activities" onclick="spocSetTab('activities')"
          style="padding:6px 14px;border:none;border-radius:6px;font-size:12px;font-weight:700;cursor:pointer;background:transparent;color:#64748b;font-family:inherit;transition:all .15s;">
          Activities
        </button>
      </div>
      <div style="flex:1;"></div>
      <span id="spoc-count" style="font-size:11px;font-weight:600;color:#94a3b8;white-space:nowrap;"></span>
    </div>

    <!-- SUMMARY CARDS -->
<div id="spoc-cards-container"></div>

<!-- FILTERS -->
<div style="background:#fff;border:1px solid #e2e8f0;...">

    <!-- FILTERS -->
    <div style="background:#fff;border:1px solid #e2e8f0;border-radius:10px;overflow:hidden;margin-bottom:14px;">
      <div style="display:flex;align-items:center;gap:10px;padding:10px 16px;flex-wrap:nowrap;">
        <input type="text" id="spoc-search" class="form-control" placeholder="🔍  Search…" style="flex:1;min-width:0;"/>
        <select class="form-control" id="spoc-filter-status" style="flex:0 0 140px;width:140px;">
          <option value="">All Statuses</option>
          <option>Open</option>
          <option>In Progress</option>
          <option>Complete</option>
          <option>Overdue</option>
        </select>
        <input type="date" class="form-control" id="spoc-filter-from" style="width:138px;padding:5px 8px;font-size:12px;"/>
        <input type="date" class="form-control" id="spoc-filter-to" style="width:138px;padding:5px 8px;font-size:12px;"/>
        <button class="btn btn-ghost btn-sm" id="spoc-clear-filters" style="white-space:nowrap;">✕ Clear</button>
      </div>
    </div>

    <!-- CONTENT -->
    <div id="spoc-content"></div>

  </div>`;
}

window.spocSetTab = function (tab) {
    spocTabMode = tab;
    ['obligations', 'activities'].forEach(t => {
        const btn = document.getElementById(`spoc-tab-${t}`);
        if (!btn) return;
        const active = t === tab;
        btn.style.background = active ? '#6366f1' : 'transparent';
        btn.style.color = active ? '#fff' : '#64748b';
    });
    renderSpocContent();
};

function renderSpocContent() {
    const content = document.getElementById('spoc-content');
    if (!content) return;

    if (spocTabMode === 'obligations') {
        let items = getSpocObligations();
        items = applySpocFilters(items);
        updateSpocCount(items.length, 'obligation');
       // obligations block:
const rawObl = getSpocObligations();
document.getElementById('spoc-cards-container').innerHTML = buildSpocSummaryCards(rawObl);
content.innerHTML = buildSpocObligationsTable(items);

    } else {
        let items = getSpocActivities();
        items = applySpocFilters(items);
        updateSpocCount(items.length, 'activity');
        // activities block:
const rawAct = getSpocActivities();
document.getElementById('spoc-cards-container').innerHTML = buildSpocSummaryCards(rawAct);
content.innerHTML = buildSpocActivitiesTable(items);
    }
}

function getSpocObligations() {
    const all = CMS_DATA.spocDashboard?.spocObligations || [];
    return all.filter(o => o.branch === SPOC_BRANCH);
}

function getSpocActivities() {
    const all = CMS_DATA.spocDashboard?.spocActivities || [];
    return all.filter(a => a.branch === SPOC_BRANCH);
}

function applySpocFilters(items) {
    if (spocFilters.search) {
        const s = spocFilters.search.toLowerCase();
        items = items.filter(i =>
            (i.title || '').toLowerCase().includes(s) ||
            (i.id || '').toLowerCase().includes(s) ||
            (i.assignee || '').toLowerCase().includes(s) ||
            (i.department || '').toLowerCase().includes(s)
        );
    }
    if (spocFilters.status) items = items.filter(i => i.status === spocFilters.status);
    if (spocFilters.from) items = items.filter(i => i.dueDate && i.dueDate >= spocFilters.from);
    if (spocFilters.to) items = items.filter(i => i.dueDate && i.dueDate <= spocFilters.to);
    return items;
}

function updateSpocCount(n, type) {
    const el = document.getElementById('spoc-count');
    if (el) el.textContent = `${n} ${type}${n !== 1 ? 's' : ''}`;
}

function spocStatusBadge(status) {
    const cfg = {
        'Complete': 'background:#dcfce7;color:#15803d;border:1px solid #86efac;',
        'Overdue': 'background:#fee2e2;color:#dc2626;border:1px solid #fca5a5;',
        'In Progress': 'background:#dbeafe;color:#1d4ed8;border:1px solid #93c5fd;',
        'Open': 'background:#f1f5f9;color:#475569;border:1px solid #e2e8f0;',
    };
    return `<span style="display:inline-block;padding:3px 10px;border-radius:99px;font-size:11px;font-weight:700;white-space:nowrap;${cfg[status] || cfg['Open']}">${status}</span>`;
}

function spocDueDate(dateStr) {
    if (!dateStr) return `<span style="color:#94a3b8;font-size:12px;">N/A</span>`;
    const due = new Date(dateStr);
    const now = new Date(); now.setHours(0, 0, 0, 0);
    const diff = Math.ceil((due - now) / 86400000);
    const color = diff < 0 ? '#dc2626' : diff <= 7 ? '#b45309' : diff <= 30 ? '#0369a1' : '#64748b';
    const bg = diff < 0 ? '#fee2e2' : diff <= 7 ? '#fef9c3' : diff <= 30 ? '#dbeafe' : '#f1f5f9';
    const border = diff < 0 ? '#fca5a5' : diff <= 7 ? '#fde68a' : diff <= 30 ? '#93c5fd' : '#e2e8f0';
    const label = due.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    return `<span style="background:${bg};color:${color};border:1px solid ${border};padding:2px 9px;border-radius:99px;font-size:11px;font-weight:700;white-space:nowrap;">${label}</span>`;
}

function spocInitials(name) {
    return (name || '?').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

/* ── OBLIGATIONS TABLE ── */
function buildSpocObligationsTable(items) {
    if (!items.length) return `<div class="empty-state"><div class="empty-state-icon">◉</div><div class="empty-state-text">No obligations for ${SPOC_BRANCH} branch</div></div>`;
    return `
  <div class="table-card">
    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Obligation ID</th>
            <th>Obligation Name</th>
           <th>Action</th>
            <th>Assigned To</th>
            <th>Due Date</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          ${items.map(t => `
          <tr>
            <td>
              <span style="font-family:monospace;font-size:11px;font-weight:700;color:#6366f1;background:#eef2ff;padding:2px 8px;border-radius:4px;">
                ${t.id}
              </span>
            </td>
            <td style="max-width:220px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="${t.title}">
              <span style="font-size:13px;font-weight:500;color:#1e293b;">${t.title}</span>
            </td>
             <td style="max-width:220px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="${t.title}">
              <span style="font-size:13px;font-weight:500;color:#1e293b;">${t.action}</span>
            </td>
           
            <td>
              <div style="display:flex;align-items:center;gap:6px;">
                <div style="width:26px;height:26px;border-radius:50%;background:#eef2ff;color:#4338ca;font-size:9px;font-weight:800;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                  ${spocInitials(t.assignee || '?')}
                </div>
                <span style="font-size:12px;font-weight:500;color:#1e293b;">${t.assignee || '—'}</span>
              </div>
            </td>
            <td>${spocDueDate(t.dueDate)}</td>
            <td>${spocStatusBadge(t.status)}</td>
            <td>
              <button onclick="spocOpenActionScreen('${t.id}','obligations')"
                style="padding:5px 12px;background:#6366f1;color:#fff;border:none;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer;white-space:nowrap;">
                Take Action →
              </button>
            </td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
  </div>`;
}

/* ── ACTIVITIES TABLE ── */
function buildSpocActivitiesTable(items) {
    if (!items.length) return `<div class="empty-state"><div class="empty-state-icon">◉</div><div class="empty-state-text">No activities for ${SPOC_BRANCH} branch</div></div>`;
    return `
  <div class="table-card">
    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Activity ID</th>
            <th>Activity Name</th>
            <th>Obligation Ref</th>
           
            <th>Assigned To</th>
            <th>Due Date</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          ${items.map(a => `
          <tr>
            <td>
              <span style="font-family:monospace;font-size:11px;font-weight:700;color:#2563eb;background:#eff6ff;padding:2px 8px;border-radius:4px;">
                ${a.id}
              </span>
            </td>
            <td style="max-width:200px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="${a.title}">
              ${a.title}
            </td>
            <td>
              <span style="font-family:monospace;font-size:10px;font-weight:700;color:#6366f1;background:#eef2ff;padding:2px 7px;border-radius:4px;">${a.obligation || '—'}</span>
            </td>
           
            <td>
              <div style="display:flex;align-items:center;gap:6px;">
                <div style="width:26px;height:26px;border-radius:50%;background:#eef2ff;color:#4338ca;font-size:9px;font-weight:800;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                  ${spocInitials(a.assignee || '?')}
                </div>
                <span style="font-size:12px;font-weight:500;color:#1e293b;">${a.assignee || '—'}</span>
              </div>
            </td>
            <td>${spocDueDate(a.dueDate)}</td>
            <td>${spocStatusBadge(a.status)}</td>
            <td>
              <button onclick="spocOpenActionScreen('${a.id}','activities')"
                style="padding:5px 12px;background:#6366f1;color:#fff;border:none;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer;white-space:nowrap;">
                Take Action →
              </button>
            </td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
  </div>`;
}

/* ── OPEN ACTION SCREEN ── */
window.spocOpenActionScreen = function (itemId, tab) {
    const data = tab === 'obligations'
        ? CMS_DATA.spocDashboard?.spocObligations
        : CMS_DATA.spocDashboard?.spocActivities;
    const item = (data || []).find(i => i.id === itemId);
    if (!item) return;
    renderSpocActionScreen(item, tab);
};

/* ── ACTION SCREEN ── */
/* ── ACTION SCREEN ── */
function renderSpocActionScreen(item, tab) {
    const dept = item.department;
    const approvers = {
        'IT': ['Vikram Nair', 'CTO Office'],
        'Risk': ['Anita Singh', 'Chief Risk Officer'],
        'Compliance': ['Suresh Pillai', 'CCO Office'],
        'Legal': ['Arjun Shah', 'General Counsel'],
        'Finance': ['Ravi Krishnan', 'CFO Office'],
        'Operations': ['Divya Iyer', 'COO Office'],
    }[dept] || ['Approver'];

    if (!item._comments) item._comments = [
        { author: 'System', role: 'Auto', time: 'just now', text: 'Action screen opened for this obligation.' }
    ];

    const area = document.getElementById('content-area');
    area.innerHTML = `
  <div style="display:flex;flex-direction:column;min-height:100vh;font-family:'DM Sans',system-ui,sans-serif;">

    <!-- STICKY HEADER -->
    <div style="padding:20px 24px 0;border-bottom:1px solid #e2e8f0;background:#fff;position:sticky;top:0;z-index:20;box-shadow:0 1px 6px rgba(0,0,0,.06);">
      <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:10px;">
        <div style="min-width:0;flex:1;">
          <div style="display:flex;align-items:center;gap:6px;font-size:13px;margin-bottom:6px;">
            <span onclick="renderMyItemsObligations()" style="color:#6366f1;font-weight:700;cursor:pointer;font-size:14px;">← Obligations</span>
            <span style="color:#cbd5e1;">/</span>
            <span style="font-family:monospace;font-size:12px;color:#6366f1;font-weight:700;">${item.id}</span>
           
          </div>
          <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;">

  <!-- TITLE -->
  
  <div style="font-size:18px;font-weight:800;color:#0f172a;line-height:1.3;">
    ${item.title}
  </div>
<div>

  <!-- INLINE PILLS -->
  ${spocStatusBadge(item.status)}
  ${spocDueDate(item.dueDate)}

  <span style="background:#f1f5f9;color:#475569;border:1px solid #e2e8f0;padding:2px 8px;border-radius:99px;font-size:10px;font-weight:700;">
    👤 ${item.assignee || '—'}
  </span>

  <span style="background:#f1f5f9;color:#475569;border:1px solid #e2e8f0;padding:2px 8px;border-radius:99px;font-size:10px;font-weight:700;">
    🏢 ${item.department || '—'}
  </span>

  ${item._actionStatus ? `
    <span style="background:${item._actionStatus.bg};color:${item._actionStatus.color};border:1px solid ${item._actionStatus.border};padding:2px 8px;border-radius:99px;font-size:10px;font-weight:700;">
      ${item._actionStatus.icon} ${item._actionStatus.label}
    </span>
  ` : ''}
  </div>

</div>
        </div>
      </div>
      
    </div>

    <!-- BODY -->
    <div style="display:flex;flex:1;min-height:0;">

      <!-- VERTICAL TABS -->
      <nav style="width:84px;flex-shrink:0;display:flex;flex-direction:column;gap:2px;padding:14px 6px;border-right:1px solid #e2e8f0;background:#f8fafc;">
        ${[['spoc-vt-overview', '◈', 'Overview'], ['spoc-vt-actions', '⚡', 'Actions'], ['spoc-vt-evidence', '📎', 'Evidence'], ['spoc-vt-comments', '💬', 'Comments']].map(([id, ic, lb]) => `
        <button id="${id}" onclick="spocSwitchTab('${id.replace('spoc-vt-', '')}')"
          style="display:flex;flex-direction:column;align-items:center;gap:4px;padding:11px 4px;border-radius:8px;border:none;background:transparent;cursor:pointer;color:#1e293b;font-family:inherit;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.3px;transition:all .15s;text-align:center;">
          <span style="font-size:18px;line-height:1;">${ic}</span>
          <span style="line-height:1.2;font-size:10px;">${lb}</span>
        </button>`).join('')}
      </nav>

      <!-- PANE -->
      <div id="spoc-action-pane" style="flex:1;overflow-y:auto;background:#fafbff;padding:22px 24px 48px;"></div>

    </div>

  </div>`;

    /* inject styles if not already */
    if (!document.getElementById('spoc-action-styles')) {
        const s = document.createElement('style');
        s.id = 'spoc-action-styles';
        s.textContent = `
      @keyframes spocPaneIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:none} }
      #spoc-action-pane { animation: spocPaneIn .2s ease; }
      .spoc-acc-head { display:flex;align-items:center;justify-content:space-between;padding:13px 16px;cursor:pointer;user-select:none; }
      .spoc-acc-head:hover { filter:brightness(.97); }
      .spoc-acc-body { border-top:1px solid #e2e8f0; }
      .spoc-input { background:#fff;border:1.5px solid #e2e8f0;border-radius:8px;color:#0f172a;font-family:inherit;font-size:13px;padding:9px 12px;outline:none;width:100%;transition:border-color .15s;box-sizing:border-box; }
      .spoc-input:focus { border-color:#6366f1;box-shadow:0 0 0 3px rgba(99,102,241,.1); }
      .spoc-cmt { display:flex;gap:12px;align-items:flex-start; }
      .spoc-cmt-body { flex:1;background:#fff;border:1px solid #e2e8f0;border-radius:4px 12px 12px 12px;padding:12px 14px; }
      .spoc-av { width:28px;height:28px;border-radius:50%;background:#eef2ff;color:#4338ca;font-size:10px;font-weight:800;display:flex;align-items:center;justify-content:center;flex-shrink:0;border:1px solid #c7d2fe; }
    `;
        document.head.appendChild(s);
    }

    /* store item ref on window for tab switching */
    window._spocActionItem = item;
    window._spocActionTab = tab;
    window._spocApprovers = approvers;

    spocSwitchTab('overview');
}

/* ── TAB SWITCHER ── */
window.spocSwitchTab = function (tab) {
    ['overview', 'actions', 'evidence', 'comments'].forEach(t => {
        const btn = document.getElementById(`spoc-vt-${t}`);
        if (!btn) return;
        btn.style.background = t === tab ? '#1e293b' : 'transparent';
        btn.style.color = t === tab ? '#fff' : '#1e293b';
    });
    const pane = document.getElementById('spoc-action-pane');
    if (!pane) return;
    pane.style.animation = 'none';
    void pane.offsetHeight;
    pane.style.animation = 'spocPaneIn .2s ease';

    const item = window._spocActionItem;
    const tab2 = window._spocActionTab;
    const approvers = window._spocApprovers || [];

    if (tab === 'overview') pane.innerHTML = spocPaneOverview(item, tab2, approvers);
    if (tab === 'actions') pane.innerHTML = spocPaneActions(item);
    if (tab === 'evidence') pane.innerHTML = spocPaneEvidence(item);
    if (tab === 'comments') pane.innerHTML = spocPaneComments(item);
};

/* ── OVERVIEW PANE ── */
function spocPaneOverview(item, tab, approvers) {
    return `
  <div>

    <!-- RAISE A REQUEST -->
    <div style="border:1px solid #e2e8f0;border-radius:10px;overflow:hidden;margin-bottom:12px;">
      <div class="spoc-acc-head" onclick="spocToggleAcc('raise')" style="background:#fff7ed;">
        <span style="font-size:12px;font-weight:800;color:#92400e;text-transform:uppercase;letter-spacing:.07em;display:flex;align-items:center;gap:8px;">
          <span style="width:3px;height:14px;background:#f59e0b;border-radius:2px;display:inline-block;"></span>
          Take Action
        </span>
        <span id="spoc-arr-raise" style="color:#94a3b8;font-size:14px;transition:transform .2s;">▼</span>
      </div>
      <div id="spoc-acc-raise" class="spoc-acc-body" style="background:#fff;padding:16px 18px;display:flex;flex-direction:column;gap:12px;">

        <!-- Request type + Send to + Send btn -->
        <div style="display:flex;align-items:flex-end;gap:10px;flex-wrap:wrap;">
          <div style="display:flex;flex-direction:column;gap:4px;flex:1;min-width:150px;">
            <label style="font-size:10px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:.06em;">Request Type</label>
            <select id="spoc-req-type" class="spoc-input" onchange="spocReqTypeChange('${item.id}')">
              <option value="">— Select type —</option>
              <option value="Ask for Clarification">Send for Clarification</option>
              <option value="Send for Closure">Send for Closure</option>
              <option value="Send to Recall">Send to Recall</option>
             
            </select>
          </div>
          <div style="display:flex;flex-direction:column;gap:4px;flex:1;min-width:150px;">
            <label style="font-size:10px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:.06em;">Send To</label>
            <select id="spoc-req-person" class="spoc-input">
              <option value="">— Select person —</option>

              <option value="CO Team">CO : Arjun </option>

              <option value="CO Team">Approver : Meera </option>
            </select>
          </div>
          <button onclick="spocRaiseSubmit('${item.id}','${tab}')"
            style="padding:9px 18px;background:#6366f1;color:#fff;border:none;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer;white-space:nowrap;align-self:flex-end;">
            Send →
          </button>
        </div>

        <!-- Note -->
        <div style="display:flex;flex-direction:column;gap:4px;">
          <label style="font-size:10px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:.06em;">Note / Message</label>
          <textarea id="spoc-req-note" class="spoc-input" rows="3"
            placeholder="Describe the clarification needed, reason for closure, or any context…"
            style="resize:vertical;line-height:1.6;min-height:80px;"></textarea>
        </div>

        <!-- Attach evidence -->
        <div style="padding:12px 14px;background:#f8fafc;border:1.5px dashed #cbd5e1;border-radius:8px;display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;">
          <div>
            <div style="font-size:13px;font-weight:700;color:#334155;">Attach Evidence (optional)</div>
            <div style="font-size:11px;color:#64748b;margin-top:2px;">Upload supporting documents for this request</div>
          </div>
          <label style="display:inline-flex;align-items:center;gap:7px;padding:8px 16px;background:#fff;border:1.5px solid #6366f1;border-radius:7px;font-size:12px;font-weight:700;color:#6366f1;cursor:pointer;white-space:nowrap;">
            📎 Attach File
            <input type="file" style="display:none;" onchange="spocAttachFile(this,'${item.id}')"/>
          </label>
        </div>
        <div id="spoc-attach-list-${item.id}" style="display:flex;flex-wrap:wrap;gap:6px;"></div>

        <!-- status note -->
        <div id="spoc-req-status" style="display:none;padding:10px 14px;border-radius:7px;font-size:12px;font-weight:600;"></div>
      </div>
    </div>

    <!-- OBLIGATION DETAILS -->
    <div style="border:1px solid #e2e8f0;border-radius:10px;overflow:hidden;margin-bottom:12px;">
      <div class="spoc-acc-head" onclick="spocToggleAcc('obldetail')" style="background:#f8fafc;">
        <span style="font-size:12px;font-weight:800;color:#475569;text-transform:uppercase;letter-spacing:.07em;display:flex;align-items:center;gap:8px;">
          <span style="width:3px;height:14px;background:#6366f1;border-radius:2px;display:inline-block;"></span>
          Obligation Details
        </span>
        <span id="spoc-arr-obldetail" style="color:#94a3b8;font-size:14px;transform:rotate(-90deg);transition:transform .2s;">▼</span>
      </div>
      <div id="spoc-acc-obldetail" style="display:none;background:#fff;padding:16px;">
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;">
          ${[
            ['ID', item.id],
            ['Department', item.department || '—'],
            ['Branch', item.branch || SPOC_BRANCH],
            ['Assigned To', item.assignee || '—'],
            ['Approver', item.approver || '—'],
            ['Status', item.status],
            ['Due Date', item.dueDate || '—'],
            ['Circular', item.circular || '—'],
            ['Risk', item.risk || '—'],
        ].map(([l, v]) => `
          <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:10px 13px;">
            <div style="font-size:10px;font-weight:800;color:#94a3b8;text-transform:uppercase;letter-spacing:.07em;margin-bottom:3px;">${l}</div>
            <div style="font-size:13px;font-weight:600;color:#1e293b;">${v}</div>
          </div>`).join('')}
        </div>
      </div>
    </div>


    

  </div>`;
}

function spocPaneActions(item) {
    const actions = item._actions || [
  {
    id: 'ACT-001-1',
    title: 'Draft CISO Job Description',
    assignee: 'Priya Nair',
    department: 'HR',
    dueDate: '2025-01-15',
    status: 'Complete'
  },
  {
    id: 'ACT-001-2',
    title: 'Board Resolution for CISO',
    assignee: 'Arjun Kumar',
    department: 'Compliance',
    dueDate: '2025-01-15',
    status: 'Complete'
  },
  {
    id: 'ACT-001-3',
    title: 'CISO Onboarding & Access Setup',
    assignee: 'Raj Iyer',
    department: 'IT',
    dueDate: '2025-02-15',
    status: 'In Progress'
  }
];

if (!actions.length) return `<div class="empty-state"><div class="empty-state-icon">◉</div><div class="empty-state-text">No activities for ${SPOC_BRANCH} branch</div></div>`;
    return `
  <div class="table-card">
    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Activity ID</th>
            <th>Activity Name</th>
            
           

            <th>Assigned To</th>
            <th>Due Date</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          ${actions.map(a => `
          <tr>
            <td>
              <span style="font-family:monospace;font-size:11px;font-weight:700;color:#2563eb;background:#eff6ff;padding:2px 8px;border-radius:4px;">
                ${a.id}
              </span>
            </td>
            <td style="max-width:200px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="${a.title}">
              ${a.title}
            </td>
           
           
            <td>
              <div style="display:flex;align-items:center;gap:6px;">
                <div style="width:26px;height:26px;border-radius:50%;background:#eef2ff;color:#4338ca;font-size:9px;font-weight:800;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                  ${spocInitials(a.assignee || '?')}
                </div>
                <span style="font-size:12px;font-weight:500;color:#1e293b;">${a.assignee || '—'}</span>
              </div>
            </td>
            <td>${spocDueDate(a.dueDate)}</td>
            <td>${spocStatusBadge(a.status)}</td>
            <td>
              <button onclick="spocOpenActionScreen('${a.id}','activities')"
                style="padding:5px 12px;background:#6366f1;color:#fff;border:1px solid gray;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer;white-space:nowrap;">
                Take Action →
              </button>
            </td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
  </div>`;
}

function spocEvidenceListHTML(item) {
    const files = item._evidence || [];

    if (!files.length) {
        return `<div style="text-align:center;color:#94a3b8;font-size:13px;">No evidence uploaded.</div>`;
    }

    return `
    <div style="display:flex;flex-wrap:wrap;gap:8px;">
      ${files.map(f => `
        <div style="display:flex;align-items:center;gap:6px;padding:6px 12px;background:#f1f5f9;border:1px solid #e2e8f0;border-radius:20px;font-size:12px;font-weight:600;color:#334155;">
          📄 ${f}
        </div>
      `).join('')}
    </div>
  `;
}

function spocCommentsListHTML(item) {
    const comments = item._comments || [];

    if (!comments.length) {
        return `<div style="text-align:center;color:#94a3b8;font-size:13px;">No comments yet.</div>`;
    }

    return `
    <div style="display:flex;flex-direction:column;gap:12px;">
      ${comments.map(c => spocCmtHTML(c)).join('')}
    </div>
  `;
}

function spocEvidenceTableHTML(item) {
    // Dummy data if no real evidence
    const files = item._evidence?.length
        ? item._evidence.map(f => ({
            id: item.id,
            name: item.title,
            file: f
        }))
        : [
            { id: item.id, name: item.title, file: 'compliance_report.pdf' },
            { id: item.id, name: item.title, file: 'audit_evidence.xlsx' }
        ];

    return `
    <div class="table-card">
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Obligation ID</th>
              <th>Obligation Name</th>
              <th>Evidence File</th>
            </tr>
          </thead>
          <tbody>
            ${files.map(f => `
              <tr>
                <td>
                  <span style="font-family:monospace;font-size:11px;font-weight:700;color:#6366f1;background:#eef2ff;padding:2px 8px;border-radius:4px;">
                    ${f.id}
                  </span>
                </td>
                <td style="max-width:240px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
                  ${f.name}
                </td>
                <td>
                  <span style="display:inline-flex;align-items:center;gap:6px;font-size:12px;font-weight:600;color:#334155;">
                    📄 ${f.file}
                  </span>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

/* ── EVIDENCE PANE ── */
function spocPaneEvidence(item) {
    return `
  <div>

    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">
      <div style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.08em;color:#94a3b8;">
        Evidence Documents
      </div>
      <button onclick="spocOpenEvidenceUpload('${item.id}')"
        style="padding:6px 14px;background:#6366f1;color:#fff;border:none;border-radius:7px;font-size:12px;font-weight:600;cursor:pointer;">
        ＋ Upload Evidence
      </button>
    </div>

    ${spocEvidenceTableFull(item)}

  </div>`;
}
function spocEvidenceTableFull(item) {
  let files = item._evidence;

  // ✅ If no real data → inject ONE dummy row
  if (!files || !files.length) {
    files = [
      {
        name: 'Sample Evidence',
        file: 'compliance_proof.pdf'
      }
    ];
  }

  return `
    <div class="table-card">
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Obligation ID</th>
              <th>Obligation Name</th>
              <th>Evidence Name</th>
              <th>File</th>
            </tr>
          </thead>
          <tbody>
            ${files.map(f => `
              <tr>
                <td>
                  <span style="font-family:monospace;font-size:11px;font-weight:700;color:#6366f1;background:#eef2ff;padding:2px 8px;border-radius:4px;">
                    ${item.id}
                  </span>
                </td>
                <td style="max-width:240px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
                  ${item.title}
                </td>
                <td>${f.name}</td>
                <td>📄 ${f.file}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

window.spocOpenEvidenceUpload = function (itemId) {
    const overlay = document.createElement('div');

    overlay.style.cssText = `
    position:fixed;inset:0;background:rgba(15,23,42,.55);
    z-index:9000;display:flex;align-items:center;justify-content:center;
  `;

    overlay.innerHTML = `
  <div style="background:#fff;border-radius:12px;width:100%;max-width:420px;padding:20px;display:flex;flex-direction:column;gap:14px;">

    <div style="font-size:16px;font-weight:700;">Upload Evidence</div>

    <!-- Evidence Name -->
    <div>
      <label style="font-size:11px;font-weight:700;color:#94a3b8;">Evidence Name</label>
      <input id="ev-name" class="spoc-input" placeholder="Enter evidence name"/>
    </div>

    <!-- File -->
    <div>
      <label style="font-size:11px;font-weight:700;color:#94a3b8;">Attach File</label>
      <input type="file" id="ev-file" class="spoc-input"/>
    </div>

    <!-- Actions -->
    <div style="display:flex;justify-content:flex-end;gap:10px;">
      <button onclick="this.closest('div[style*=fixed]').remove()"
        style="padding:6px 12px;border:1px solid #e2e8f0;border-radius:6px;background:#fff;">
        Cancel
      </button>
      <button onclick="spocSaveEvidence('${itemId}', this)"
        style="padding:6px 14px;background:#6366f1;color:#fff;border:none;border-radius:6px;">
        Save
      </button>
    </div>

  </div>`;

    document.body.appendChild(overlay);
};


window.spocSaveEvidence = function (itemId, btn) {
    const name = document.getElementById('ev-name')?.value.trim();
    const fileInput = document.getElementById('ev-file');
    const file = fileInput?.files[0];

    if (!name) {
        showToast('Enter evidence name', 'warning');
        return;
    }
    if (!file) {
        showToast('Attach a file', 'warning');
        return;
    }

    const item = window._spocActionItem;
    if (!item._evidence) item._evidence = [];

    item._evidence.push({
        name: name,
        file: file.name
    });

    showToast('Evidence uploaded', 'success');

    // close popup
    btn.closest('div[style*=fixed]').remove();

    // refresh evidence tab
    spocSwitchTab('evidence');
};


/* ── COMMENTS PANE ── */
function spocPaneComments(item) {
    const comments = item._comments || [];
    return `
  <div>
    <div style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.08em;color:#94a3b8;margin-bottom:16px;">Comments & Updates</div>
    <div id="spoc-comment-thread" style="display:flex;flex-direction:column;gap:14px;margin-bottom:18px;">
      ${comments.map(c => spocCmtHTML(c)).join('')}
    </div>
    <div style="display:flex;gap:12px;align-items:flex-start;padding-top:14px;border-top:1px solid #e2e8f0;">
      <div class="spoc-av" style="background:#1e293b;color:#fff;border-color:#1e293b;">${spocInitials(SPOC_PROFILE.name)}</div>
      <div style="flex:1;">
        <textarea id="spoc-new-comment" class="spoc-input" rows="3"
          placeholder="Add a comment or update…" style="resize:vertical;line-height:1.6;"></textarea>
        <div style="display:flex;justify-content:flex-end;margin-top:8px;">
          <button onclick="spocPostComment('${item.id}')"
            style="padding:8px 18px;background:#6366f1;color:#fff;border:none;border-radius:7px;font-size:13px;font-weight:700;cursor:pointer;">
            Post Comment
          </button>
        </div>
      </div>
    </div>
  </div>`;
}

function spocCmtHTML(c) {
    return `
  <div class="spoc-cmt">
    <div class="spoc-av">${spocInitials(c.author)}</div>
    <div class="spoc-cmt-body">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:5px;flex-wrap:wrap;">
        <strong style="font-size:14px;font-weight:700;">${c.author}</strong>
        <span style="font-size:12px;color:#94a3b8;">${c.role}</span>
        <span style="font-size:12px;color:#cbd5e1;margin-left:auto;">${c.time}</span>
      </div>
      <div style="font-size:14px;color:#475569;line-height:1.6;">${c.text}</div>
    </div>
  </div>`;
}

function buildSpocSummaryCards(items) {
  const now = new Date(); now.setHours(0,0,0,0);
  const total    = items.length;
  const overdue  = items.filter(i => i.status === 'Overdue' || (i.dueDate && new Date(i.dueDate) < now && i.status !== 'Complete')).length;
  const open     = items.filter(i => i.status === 'Open').length;
  const inProg   = items.filter(i => i.status === 'In Progress').length;
  const complete = items.filter(i => i.status === 'Complete').length;
  const dueSoon  = items.filter(i => { if (!i.dueDate) return false; const d = Math.ceil((new Date(i.dueDate)-now)/86400000); return d>=0&&d<=7; }).length;

  const card = (icon, label, value, bg, color, border, filterVal) =>
    `<div onclick="spocQuickFilter('${filterVal}')"
      style="flex:1;min-width:100px;background:${bg};border:1.5px solid ${border};border-radius:12px;padding:13px 15px;cursor:pointer;"
      onmouseover="this.style.boxShadow='0 4px 14px rgba(0,0,0,.09)'" onmouseout="this.style.boxShadow='none'">
      <div style="font-size:18px;margin-bottom:3px;">${icon}</div>
      <div style="font-size:22px;font-weight:800;color:${color};line-height:1;">${value}</div>
      <div style="font-size:11px;font-weight:600;color:#64748b;margin-top:3px;">${label}</div>
    </div>`;

  return `<div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:14px;">
    ${card('📋','Total Actions',     total,   '#f8fafc','#1e293b','#e2e8f0','')}
    ${card('🔴','Overdue Actions',   overdue, '#fff1f2','#dc2626','#fca5a5','Overdue')}
   
    ${card('🟠','In Progress Actions',inProg, '#fff7ed','#c2410c','#fdba74','In Progress')}
   
  </div>`;
}

window.spocPostComment = function (itemId) {
    const item = window._spocActionItem;
    if (!item) return;
    const el = document.getElementById('spoc-new-comment');
    const text = el?.value?.trim();
    if (!text) { showToast('Type something first', 'warning'); return; }
    if (!item._comments) item._comments = [];
    const c = { author: SPOC_PROFILE.name, role: 'SPOC', time: 'just now', text };
    item._comments.push(c);
    const thread = document.getElementById('spoc-comment-thread');
    if (thread) {
        const d = document.createElement('div');
        d.innerHTML = spocCmtHTML(c);
        thread.appendChild(d.firstChild);
        el.value = '';
    }
    showToast('Comment posted', 'success');
};

/* ── ACCORDION TOGGLE ── */
window.spocToggleAcc = function (key) {
    const body = document.getElementById(`spoc-acc-${key}`);
    const arr = document.getElementById(`spoc-arr-${key}`);
    if (!body) return;
    const open = body.style.display !== 'none';
    body.style.display = open ? 'none' : 'block';
    if (arr) arr.style.transform = open ? 'rotate(-90deg)' : 'rotate(0deg)';
};

/* ── REQUEST TYPE CHANGE ── */
window.spocReqTypeChange = function (itemId) {
    const type = document.getElementById('spoc-req-type')?.value;
    const person = document.getElementById('spoc-req-person');
    const item = window._spocActionItem;
    if (!person || !item) return;
    const approvers = window._spocApprovers || [];
    if (type === 'Send to Approver') {
        person.innerHTML = approvers.map(a => `<option value="${a}">${a}</option>`).join('');
    } else if (type === 'Send to CO') {
        person.innerHTML = `<option value="CO Team">CO Team</option><option value="Rahul Sharma — CO">Rahul Sharma — CO</option><option value="Anita Verma — CO">Anita Verma — CO</option>`;
    } else {
        person.innerHTML = `
      <option value="">— Select person —</option>
      ${item.assignee ? `<option value="${item.assignee}">${item.assignee}</option>` : ''}
      ${approvers.map(a => `<option value="${a}"> ${a}</option>`).join('')}
      <option value="CO Team">CO: CO Team</option>`;
    }
};

/* ── RAISE SUBMIT ── */
window.spocRaiseSubmit = function (itemId, tab) {
    const type = document.getElementById('spoc-req-type')?.value;
    const person = document.getElementById('spoc-req-person')?.value;
    const note = document.getElementById('spoc-req-note')?.value?.trim();
    if (!type) { showToast('Select a request type', 'warning'); return; }
    if (!person) { showToast('Select a person to send to', 'warning'); return; }

    const item = window._spocActionItem;
    if (!item) return;

    /* set workflow state */
    const stateMap = {
        'Send for Clarification': 'clarification_sent',
        'Send for Closure': 'sent_for_closure',
        'Send to Approver': 'sent_to_approver',
        'Send to CO': 'sent_to_co',
    };
    item._workflowState = stateMap[type] || '';
    item._lastSentTo = person;
    item._lastComment = note;

    /* action status for badge */
    const cfg = {
        'Send for Clarification': { label: 'Sent for Clarification', color: '#854d0e', bg: '#fef9c3', border: '#fde68a', icon: '💬' },
        'Send for Closure': { label: 'Sent for Closure', color: '#166534', bg: '#dcfce7', border: '#86efac', icon: '✅' },
        'Send to Approver': { label: 'Sent to Approver', color: '#6d28d9', bg: '#f5f3ff', border: '#c4b5fd', icon: '📨' },
        'Send to CO': { label: 'Sent to CO', color: '#1d4ed8', bg: '#dbeafe', border: '#93c5fd', icon: '📨' },
    };
    item._actionStatus = cfg[type];

    /* show status note in panel */
    const statusEl = document.getElementById('spoc-req-status');
    if (statusEl && item._actionStatus) {
        statusEl.style.display = 'block';
        statusEl.style.background = item._actionStatus.bg;
        statusEl.style.color = item._actionStatus.color;
        statusEl.textContent = `✓ "${type}" sent to ${person}`;
    }

    showToast(`"${type}" sent to ${person} ✓`, 'success');

    /* add auto comment */
    if (!item._comments) item._comments = [];
    item._comments.push({ author: SPOC_PROFILE.name, role: 'SPOC', time: 'just now', text: `${type} sent to ${person}${note ? ': ' + note : ''}` });

    /* reset form */
    const typeEl = document.getElementById('spoc-req-type');
    const personEl = document.getElementById('spoc-req-person');
    const noteEl = document.getElementById('spoc-req-note');
    if (typeEl) typeEl.value = '';
    if (personEl) personEl.value = '';
    if (noteEl) noteEl.value = '';
};

/* ── ATTACH FILE ── */
window.spocAttachFile = function (input, itemId) {
    const file = input.files[0]; if (!file) return;
    const list = document.getElementById(`spoc-attach-list-${itemId}`);
    if (!list) return;
    const chip = document.createElement('div');
    chip.style.cssText = 'display:inline-flex;align-items:center;gap:6px;padding:4px 10px;background:#f1f5f9;border:1px solid #e2e8f0;border-radius:20px;font-size:12px;font-weight:600;color:#334155;';
    chip.innerHTML = `📄 ${file.name} <button onclick="this.parentElement.remove()" style="background:none;border:none;color:#94a3b8;cursor:pointer;font-size:14px;line-height:1;">×</button>`;
    list.appendChild(chip);
    showToast(`${file.name} attached.`, 'success');
};

/* ── INFO MODAL ── */
window.spocShowInfoModal = function (itemId) {
    const item = window._spocActionItem; if (!item) return;
    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(15,23,42,.55);z-index:9000;display:flex;align-items:center;justify-content:center;padding:24px;backdrop-filter:blur(3px);';
    overlay.onclick = e => { if (e.target === overlay) overlay.remove(); };
    overlay.innerHTML = `
  <div style="background:#fff;border-radius:14px;width:100%;max-width:600px;max-height:88vh;display:flex;flex-direction:column;overflow:hidden;box-shadow:0 24px 60px rgba(0,0,0,.22);" onclick="event.stopPropagation()">
    <div style="display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:1px solid #e2e8f0;background:#f8fafc;">
      <div style="font-size:14px;font-weight:700;color:#1e293b;">Regulatory Profile — ${item.id}</div>
      <button onclick="this.closest('div[style*=fixed]').remove()" style="width:28px;height:28px;border-radius:50%;background:#e2e8f0;border:none;cursor:pointer;font-size:13px;color:#64748b;">✕</button>
    </div>
    <div style="padding:20px;overflow-y:auto;display:flex;flex-direction:column;gap:16px;">
      <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:14px 16px;font-size:13px;color:#334155;line-height:1.75;">
        This obligation is derived from <strong>${item.circular || '—'}</strong>. It requires the <strong>${item.department}</strong> department to comply by <strong>${item.dueDate || '—'}</strong>. Risk: <strong>${item.risk || '—'}</strong>.
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
        ${[['Branch', item.branch || SPOC_BRANCH], ['Department', item.department || '—'], ['Assigned To', item.assignee || '—'], ['Approver', item.approver || '—'], ['Due Date', item.dueDate || '—'], ['Risk', item.risk || '—'], ['Circular', item.circular || '—'], ['Status', item.status]].map(([l, v]) => `
        <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:7px;padding:10px 13px;">
          <div style="font-size:9px;font-weight:800;color:#94a3b8;text-transform:uppercase;letter-spacing:.07em;margin-bottom:3px;">${l}</div>
          <div style="font-size:13px;font-weight:600;color:#1e293b;">${v}</div>
        </div>`).join('')}
      </div>
    </div>
    <div style="padding:14px 20px;border-top:1px solid #e2e8f0;background:#f8fafc;display:flex;justify-content:flex-end;">
      <button onclick="this.closest('div[style*=fixed]').remove()" style="padding:8px 18px;background:#1e293b;border:none;border-radius:7px;font-size:13px;font-weight:700;color:#fff;cursor:pointer;">Close</button>
    </div>
  </div>`;
    document.body.appendChild(overlay);
};

/* ── SUBMIT ── */
window.spocSubmitAction = function (itemId, tab, sendTo) {
    const data = tab === 'obligations'
        ? CMS_DATA.spocDashboard?.spocObligations
        : CMS_DATA.spocDashboard?.spocActivities;
    const item = (data || []).find(i => i.id === itemId);
    if (!item) return;
    const person = sendTo === 'approver'
        ? document.getElementById('spoc-as-approver-sel')?.value
        : document.getElementById('spoc-as-co-sel')?.value;
    item._workflowState = sendTo === 'approver' ? 'sent_to_approver' : 'sent_to_co';
    item._lastSentTo = person;
    item._lastComment = document.getElementById('spoc-as-comment')?.value?.trim();
    showToast(`Sent to ${person} successfully.`, 'success');
    setTimeout(() => renderMyItemsObligations(), 800);
};

/* ── EVIDENCE UPLOAD ── */
window.spocHandleEvidenceUpload = function (input, itemId) {
    const file = input.files[0]; if (!file) return;
    const list = document.getElementById(`spoc-ev-list-${itemId}`);
    if (!list) return;
    const chip = document.createElement('div');
    chip.style.cssText = 'display:inline-flex;align-items:center;gap:6px;padding:4px 10px;background:#f1f5f9;border:1px solid #e2e8f0;border-radius:20px;font-size:12px;font-weight:600;color:#334155;';
    chip.innerHTML = `📄 ${file.name} <button onclick="this.parentElement.remove()" style="background:none;border:none;color:#94a3b8;cursor:pointer;font-size:14px;line-height:1;">×</button>`;
    list.appendChild(chip);
    showToast(`${file.name} attached.`, 'success');
};

/* ── LISTENERS ── */
function initSpocListeners() {
    document.getElementById('spoc-search')?.addEventListener('input', e => {
        spocFilters.search = e.target.value.trim();
        renderSpocContent();
    });
    document.getElementById('spoc-filter-status')?.addEventListener('change', e => {
        spocFilters.status = e.target.value;
        renderSpocContent();
    });
    document.getElementById('spoc-filter-from')?.addEventListener('change', e => {
        spocFilters.from = e.target.value;
        renderSpocContent();
    });
    document.getElementById('spoc-filter-to')?.addEventListener('change', e => {
        spocFilters.to = e.target.value;
        renderSpocContent();
    });
    document.getElementById('spoc-clear-filters')?.addEventListener('click', () => {
        spocFilters = { status: '', search: '', from: '', to: '' };
        document.getElementById('spoc-search').value = '';
        document.getElementById('spoc-filter-status').value = '';
        document.getElementById('spoc-filter-from').value = '';
        document.getElementById('spoc-filter-to').value = '';
        renderSpocContent();
    });
}

window.spocQuickFilter = function(val) {
  spocFilters.status = val === 'dueSoon' ? '' : val;
  const sel = document.getElementById('spoc-filter-status');
  if (sel) sel.value = spocFilters.status;
  renderSpocContent();
};

function showToast(msg, type) {
    const colors = { success: '#10b981', warning: '#f59e0b', info: '#4f7cff', error: '#ef4444' };
    const t = document.createElement('div');
    t.textContent = msg;
    t.style.cssText = `position:fixed;bottom:24px;right:24px;z-index:9999;background:${colors[type] || '#4f7cff'};color:#fff;padding:10px 18px;border-radius:8px;font-size:13px;font-weight:600;box-shadow:0 4px 16px rgba(0,0,0,.2);max-width:380px;`;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 2500);
}

function oblSwitchMainTab(tab) {
    spocSetTab(tab === 'activities' ? 'activities' : 'obligations');
}