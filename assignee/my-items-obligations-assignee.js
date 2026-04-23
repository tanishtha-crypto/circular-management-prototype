/**
 * my-items-obligations-assignee.js
 * Assignee-specific obligation list view with workflow stepper.
 */

let taskView = 'table';
let taskFilters = { status: '', department: '', search: '', from: '', to: '' };

function renderMyItemsObligations() {
  taskFilters = { status: '', department: '', search: '', from: '', to: '' };
  const area = document.getElementById('content-area');
  area.innerHTML = buildTaskManagementHTML();
  initTaskListeners();
  renderTasks();
}

function buildTaskManagementHTML() {
  return `
  <div class="fade-in">
    <div style="display:flex;gap:6px;margin-top:10px;margin-bottom:10px;">
  <button id="mi-vt-table" onclick="miSetView('table')"
    style="padding:6px 16px;border:none;border-radius:6px;font-size:12px;font-weight:700;cursor:pointer;background:#111827;color:#fff;font-family:inherit;">
    ≡ Table
  </button>
  <button id="mi-vt-hierarchy" onclick="miSetView('hierarchy')"
    style="padding:6px 16px;border:none;border-radius:6px;font-size:12px;font-weight:700;cursor:pointer;background:#f1f5f9;color:#64748b;font-family:inherit;">
    ⊕ Hierarchy
  </button>
</div>

    <div class="task-toolbar-wrap">
      <div class="tb-row tb-row-filters">
        <input type="text" class="form-control tb-search" id="task-search" placeholder="🔍  Search obligations…"/>
        <select class="form-control tb-select" id="task-filter-status">
          <option value="">All Statuses</option>
          <option>Open</option>
          <option>In Progress</option>
          <option>Complete</option>
          <option>Overdue</option>
        </select>
        <button class="btn btn-ghost btn-sm tb-clear" id="clear-task-filters">✕ Clear</button>
        <span id="task-count" class="tb-count"></span>
      </div>
      <div class="tb-row tb-row-date">
        <div class="tb-date-group">
          <span class="tb-date-label">Due Date</span>
          <span class="tb-date-field">
            <label class="tb-field-label">From</label>
            <input type="date" class="form-control tb-date-inp" id="task-filter-from"/>
          </span>
          <span class="tb-arrow">→</span>
          <span class="tb-date-field">
            <label class="tb-field-label">To</label>
            <input type="date" class="form-control tb-date-inp" id="task-filter-to"/>
          </span>
          <span class="tb-date-hint" id="task-date-hint"></span>
        </div>
        <div class="view-toggle">
          <button class="view-toggle-btn ${taskView === 'table' ? 'active' : ''}" data-view="table">≡ Table</button>
          <button class="view-toggle-btn ${taskView === 'card' ? 'active' : ''}" data-view="card">⊞ Cards</button>
        </div>
      </div>
    </div>

    <div id="mi-cards-container"></div>
<div id="task-content"></div>

    <style>
      .task-toolbar-wrap { background:#fff;border:1px solid #e2e8f0;border-radius:10px;overflow:hidden;margin-bottom:16px; }
      .tb-row { display:flex;align-items:center;gap:10px;padding:10px 16px;width:100%;box-sizing:border-box; }
      .tb-row-filters { border-bottom:1px solid #e2e8f0;flex-wrap:nowrap; }
      .tb-search { flex:1 1 0;min-width:0; }
      .tb-select { flex:0 0 140px;width:140px; }
      .tb-clear { flex-shrink:0;white-space:nowrap; }
      .tb-count { flex-shrink:0;font-size:11px;font-weight:600;color:#94a3b8;white-space:nowrap; }
      .tb-row-date { background:#f8fafc;justify-content:space-between;flex-wrap:wrap;gap:8px; }
      .tb-date-group { display:flex;align-items:center;gap:10px;flex-wrap:wrap; }
      .tb-date-label { font-size:10px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:.07em;white-space:nowrap; }
      .tb-date-field { display:flex;align-items:center;gap:6px; }
      .tb-field-label { font-size:11px;font-weight:600;color:#64748b;white-space:nowrap; }
      .tb-date-inp { width:138px !important;padding:5px 8px !important;font-size:12px !important; }
      .tb-arrow { font-size:13px;color:#cbd5e1;font-weight:700; }
      .tb-date-hint { display:none;font-size:11px;font-weight:600;color:#6366f1;background:#eef2ff;border:1px solid #c7d2fe;padding:3px 10px;border-radius:20px;white-space:nowrap; }
      .tb-date-hint.visible { display:inline; }

      /* Workflow stepper in table */
      .asgn-wf { display:flex;align-items:center;gap:2px; }
      .asgn-wf-dot { width:20px;height:20px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:700;flex-shrink:0;border:2px solid #e2e8f0;background:#fff;color:#94a3b8; }
      .asgn-wf-dot.done { background:#2563eb;border-color:#2563eb;color:#fff; }
      .asgn-wf-dot.warn { background:#fef9c3;border-color:#fde68a;color:#b45309; }
      .asgn-wf-line { width:10px;height:2px;background:#e2e8f0;flex-shrink:0; }
      .asgn-wf-line.done { background:#2563eb; }
    </style>
  </div>`;
}

window.miSetView = function(mode) {
  taskView = mode;
  document.getElementById('mi-vt-table').style.background  = mode==='table'     ? '#111827' : '#f1f5f9';
  document.getElementById('mi-vt-table').style.color       = mode==='table'     ? '#fff'    : '#64748b';
  document.getElementById('mi-vt-hierarchy').style.background = mode==='hierarchy' ? '#111827' : '#f1f5f9';
  document.getElementById('mi-vt-hierarchy').style.color      = mode==='hierarchy' ? '#fff'    : '#64748b';
  renderTasks();
};

function renderTasks() {
  const content = document.getElementById('task-content');
  if (!content) return;

  let tasks = [...CMS_DATA.tasks];

  // Render summary cards using unfiltered data
const cardsEl = document.getElementById('mi-cards-container');
if (cardsEl) cardsEl.innerHTML = buildSummaryCards([...CMS_DATA.tasks]);
  if (taskFilters.search) {
    const s = taskFilters.search.toLowerCase();
    tasks = tasks.filter(t =>
      (t.title || '').toLowerCase().includes(s) ||
      (t.id || '').toLowerCase().includes(s) ||
      (t.department || '').toLowerCase().includes(s)
    );
  }
  if (taskFilters.status)   tasks = tasks.filter(t => t.status === taskFilters.status);
  if (taskFilters.from)     tasks = tasks.filter(t => t.dueDate && t.dueDate >= taskFilters.from);
  if (taskFilters.to)       tasks = tasks.filter(t => t.dueDate && t.dueDate <= taskFilters.to);

  const countEl = document.getElementById('task-count');
  if (countEl) countEl.textContent = `${tasks.length} tasks`;

  if (!tasks.length) {
    content.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">◉</div>
        <div class="empty-state-text">No tasks found</div>
      </div>`;
    return;
  }

  content.innerHTML = taskView === 'hierarchy' ? buildHierarchyView(tasks) : buildFlatTable(tasks);
}

function fmtDueDateColored(dateStr) {
  if (!dateStr) return `<span style="color:#94a3b8;font-weight:600;font-size:12px;">N/A</span>`;
  const due = new Date(dateStr);
  const now = new Date(); now.setHours(0,0,0,0);
  const diff = Math.ceil((due - now) / 86400000);
  const color = diff < 0 ? '#dc2626' : diff <= 7 ? '#b45309' : diff <= 30 ? '#0369a1' : '#64748b';
  const bg    = diff < 0 ? '#fee2e2' : diff <= 7 ? '#fef9c3' : diff <= 30 ? '#dbeafe' : '#f1f5f9';
  const border= diff < 0 ? '#fca5a5' : diff <= 7 ? '#fde68a' : diff <= 30 ? '#93c5fd' : '#e2e8f0';
  const label = due.toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' });
  return `<span style="background:${bg};color:${color};border:1px solid ${border};padding:2px 9px;border-radius:99px;font-size:11px;font-weight:700;white-space:nowrap;">${label}</span>`;
}

function _buildWorkflowStepper(t) {
  const state = t._workflowState || 'Open';
  const steps = [
    { label: 'Open',    done: true },
    { label: 'In Progress', done: ['clarification_requested','clarification_sent','sent_for_closure','closed'].includes(state) },
    { label: 'Clarify',     done: state === 'clarification_sent', warn: state === 'clarification_requested' },
    { label: 'Closure',     done: ['sent_for_closure','closed'].includes(state) },
    { label: 'Closed',      done: state === 'closed' },
  ];
  return `
  <div class="asgn-wf">
    ${steps.map((s, i) => `
      <div class="asgn-wf-dot ${s.warn ? 'warn' : s.done ? 'done' : ''}" title="${s.label}">
        ${s.done ? '✓' : s.warn ? '!' : (i+1)}
      </div>
      ${i < steps.length - 1 ? `<div class="asgn-wf-line ${steps[i+1].done || s.done ? 'done' : ''}"></div>` : ''}
    `).join('')}
  </div>`;
}

function _buildMyActions(t) {
  const state = t._workflowState || '';

  if (state === 'sent_for_closure') {
    return `<span style="font-size:11px;font-weight:700;color:#15803d;background:#dcfce7;border:1px solid #86efac;padding:3px 10px;border-radius:99px;white-space:nowrap;">✓ Sent for Closure</span>`;
  }
  if (state === 'clarification_requested') {
    return `<span style="font-size:11px;font-weight:700;color:#b45309;background:#fef9c3;border:1px solid #fde68a;padding:3px 10px;border-radius:99px;white-space:nowrap;">💬 Clarification Requested</span>`;
  }
  if (state === 'clarification_sent') {
    return `
    <div style="display:flex;flex-direction:column;gap:4px;">
      <span style="font-size:10px;font-weight:600;color:#b45309;background:#fef9c3;border:1px solid #fde68a;padding:2px 8px;border-radius:99px;white-space:nowrap;">⚠ CO sent clarification</span>
      <button onclick="assigneeAction('${t.id}','closure',this)"
        style="padding:4px 10px;background:#2563eb;color:#fff;border:none;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer;white-space:nowrap;">
        📤 Send for Closure
      </button>
    </div>`;
  }
  if (state === 'closed') {
    return `<span style="font-size:11px;font-weight:700;color:#15803d;background:#dcfce7;border:1px solid #86efac;padding:3px 10px;border-radius:99px;white-space:nowrap;">✓ Closed</span>`;
  }

  return `
  <button onclick="miNavigateToOb('${t.id}')"
    style="padding:4px 10px;background:#6366f1;color:#fff;border:none;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer;white-space:nowrap;">
    Take Action →
  </button>`;
}

function buildFlatTable(tasks) {
  const rows = [];
  tasks.forEach(t => {
    const acts = t.activities || [];
    if (!acts.length) {
      // one row for the obl with no action items
      rows.push(`
      <tr>
        <td>
          <span style="font-family:monospace;font-size:11px;font-weight:700;color:#4338ca;background:#eef2ff;padding:2px 8px;border-radius:4px;">
            ${t.obligationId || t.id}
          </span>
        </td>
        <td style="max-width:220px;font-size:13px;font-weight:500;color:#1e293b;">${t.title}</td>
        <td style="font-size:11px;color:#94a3b8;">—</td>
        <td>${fmtDueDateColored(t.dueDate)}</td>
        <td>${statusBadge(t)}</td>
        <td id="action-cell-${t.id}">${_buildMyActions(t)}</td>
      </tr>`);
    } else {
      acts.forEach((a, idx) => {
        rows.push(`
        <tr style="border-bottom:1px solid #f1f5f9;">
          <td>
            <span style="font-family:monospace;font-size:11px;font-weight:700;color:#4338ca;background:#eef2ff;padding:2px 8px;border-radius:4px;">${t.obligationId || t.id}</span>
          </td>
          <td style="max-width:220px;font-size:13px;font-weight:500;color:#1e293b;">${t.title}</td>
          <td style="font-size:12px;color:#1e293b;padding:10px 14px;">
            <span style="font-family:monospace;font-size:10px;font-weight:700;color:#6366f1;background:#eef2ff;padding:2px 7px;border-radius:4px;margin-right:6px;">${a.id}</span>
            ${a.name}
          </td>
          <td>${fmtDueDateColored(a.dueDate || t.dueDate)}</td>
          <td>
            ${(() => { const s = t.assigneeStatus || 'Open';
              const style = s==='Open'||s==='Closed' ? 'background:#dcfce7;color:#15803d;border:1px solid #86efac;' :
                            s==='Overdue'  ? 'background:#fee2e2;color:#dc2626;border:1px solid #fca5a5;' :
                            'background:#f1f5f9;color:#475569;border:1px solid #e2e8f0;';
              return `<span style="display:inline-block;padding:3px 10px;border-radius:99px;font-size:11px;font-weight:700;${style}">${s}</span>`;
            })()}
          </td>
          <td id="action-cell-${a.id}">${_buildMyActions({...t, id: a.id})}</td>
        </tr>`);
      });
    }
  });

  return `
  <div class="table-card">
    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Obl ID</th>
            <th>Obligation Name</th>
            <th>Action Item</th>
            <th>Due Date</th>
            <th>Compliance Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>${rows.join('')}</tbody>
      </table>
    </div>
  </div>`;
}

function buildHierarchyView(tasks) {
  return `<div style="display:flex;flex-direction:column;gap:10px;">
    ${tasks.map(t => {
      const acts = t.activities || [];
      const safeId = (t.id||'').replace(/[^a-zA-Z0-9]/g,'_');
      return `
      <div style="border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">

        <!-- OBL HEADER — light gray -->
        <div style="background:linear-gradient(135deg,#f1f5f9,#e8edf5);border-bottom:2px solid #cbd5e1;padding:13px 18px;display:flex;align-items:center;gap:10px;cursor:pointer;"
          onclick="miToggleOb('${safeId}')">
          <span style="font-size:12px;color:#64748b;">▼</span>
          <span style="font-family:monospace;font-size:11px;font-weight:700;color:#4338ca;background:#eef2ff;padding:2px 8px;border-radius:4px;">${t.obligationId||t.id}</span>
          <span style="font-size:13px;font-weight:600;color:#1e293b;flex:1;">${t.title}</span>
          <span style="font-size:11px;color:#64748b;">${acts.length} actions</span>
          <span style="background:${t.assigneeStatus==='Open'?'#dcfce7':t.status==='Overdue'?'#fee2e2':'#dbeafe'};
            color:${t.assigneeStatus==='Open'?'#15803d':t.assigneeStatus==='Overdue'?'#dc2626':'#1d4ed8'};
            padding:2px 10px;border-radius:99px;font-size:11px;font-weight:700;">${t.assigneeStatus}</span>
          ${fmtDueDateColored(t.dueDate)}
        </div>

        <!-- BULK BAR -->
        <div id="mi-bulk-${safeId}" style="display:none;align-items:center;gap:8px;padding:8px 16px;background:#f8fafc;border-bottom:1px solid #e2e8f0;">
          <span id="mi-bulk-count-${safeId}" style="font-size:12px;font-weight:700;color:#6366f1;background:#eef2ff;padding:2px 10px;border-radius:20px;"></span>
          <button onclick="miBulkAction('${t.id}','closure','${safeId}')"
            style="padding:5px 12px;background:#15803d;color:#fff;border:none;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer;">
            ✓ Close Selected
          </button>
          <button onclick="miNavigateToOb('${t.id}')"
            style="padding:5px 12px;background:#6366f1;color:#fff;border:none;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer;">
            Take Action →
          </button>
          <button onclick="miClearSel('${safeId}')"
            style="padding:5px 10px;background:#fff;color:#64748b;border:1.5px solid #e2e8f0;border-radius:6px;font-size:11px;cursor:pointer;">
            ✕ Clear
          </button>
        </div>

        <!-- ACTIVITY TABLE -->
        <div id="mi-ob-body-${safeId}" style="background:#fff;overflow-x:auto;">
          ${acts.length ? `
          <table style="width:100%;border-collapse:collapse;font-size:13px;">
            <thead>
              <tr style="background:#f8fafc;">
                <th style="padding:9px 14px;text-align:left;font-size:10px;font-weight:700;text-transform:uppercase;color:#94a3b8;border-bottom:1px solid #e2e8f0;">
                  <input type="checkbox" onchange="miObCheckAll(this,'${safeId}')" style="accent-color:#6366f1;cursor:pointer;"/>
                </th>
                <th style="padding:9px 14px;text-align:left;font-size:10px;font-weight:700;text-transform:uppercase;color:#94a3b8;border-bottom:1px solid #e2e8f0;">Action ID</th>
                <th style="padding:9px 14px;text-align:left;font-size:10px;font-weight:700;text-transform:uppercase;color:#94a3b8;border-bottom:1px solid #e2e8f0;">Action</th>
                <th style="padding:9px 14px;text-align:left;font-size:10px;font-weight:700;text-transform:uppercase;color:#94a3b8;border-bottom:1px solid #e2e8f0;">Due Date</th>
                <th style="padding:9px 14px;text-align:left;font-size:10px;font-weight:700;text-transform:uppercase;color:#94a3b8;border-bottom:1px solid #e2e8f0;">Compliance Status</th>
                <th style="padding:9px 14px;text-align:left;font-size:10px;font-weight:700;text-transform:uppercase;color:#94a3b8;border-bottom:1px solid #e2e8f0;">Action</th>
              </tr>
            </thead>
            <tbody>
              ${acts.map(a => `
              <tr style="border-bottom:1px solid #f9fafb;" onmouseover="this.style.background='#fafbff'" onmouseout="this.style.background=''">
                <td style="padding:10px 14px;">
                  <input type="checkbox" class="mi-act-chk" data-obid="${safeId}" data-actid="${a.id}"
                    onchange="miRowCheck('${safeId}')"
                    style="accent-color:#6366f1;cursor:pointer;"/>
                </td>
                <td style="padding:10px 14px;">
                  <span style="font-family:monospace;font-size:10px;font-weight:700;color:#6366f1;background:#eef2ff;padding:2px 7px;border-radius:4px;">${a.id}</span>
                </td>
                <td style="padding:10px 14px;font-size:12px;font-weight:500;color:#1e293b;max-width:260px;">${a.name}</td>
                <td style="padding:10px 14px;">${fmtDueDateColored(a.dueDate||t.dueDate)}</td>
                <td style="padding:10px 14px;" id="mi-status-${a.id}">
                  ${(() => {
                    const s = a.status || t.assigneeStatus || 'Open';
                    const style = s==='Closed' ? 'background:#dcfce7;color:#15803d;border:1px solid #86efac;' :
                                  s==='Open'   ? 'background:#dcfce7;color:#15803d;border:1px solid #86efac;' :
                                  s==='Overdue'? 'background:#fee2e2;color:#dc2626;border:1px solid #fca5a5;' :
                                  s==='Assigned'? 'background:#dbeafe;color:#1d4ed8;border:1px solid #93c5fd;' :
                                  s==='In Progress'? 'background:#fef9c3;color:#b45309;border:1px solid #fde68a;' :
                                  'background:#f1f5f9;color:#475569;border:1px solid #e2e8f0;';
                    return `<span style="display:inline-block;padding:3px 10px;border-radius:99px;font-size:11px;font-weight:700;${style}">${s}</span>`;
                  })()}
                </td>
                <td style="padding:10px 14px;" id="mi-act-action-${a.id}">
                  ${_buildMyActions({...t, id: a.id})}
                </td>
              </tr>`).join('')}
            </tbody>
          </table>` : `<div style="padding:20px;text-align:center;color:#94a3b8;font-size:13px;">No action items</div>`}
        </div>
      </div>`;
    }).join('')}
  </div>`;
}

window.miNavigateToOb = function(taskId){
  window.SELECTED_OBLIGATION = taskId;

  // taskId might be an activity id — find the parent task
  let resolvedId = taskId;
  const tasks = (typeof CMS_DATA !== 'undefined' && CMS_DATA.tasks) ? CMS_DATA.tasks : [];
  const directMatch = tasks.find(t => t.id === taskId);
  if (!directMatch) {
    const parent = tasks.find(t => (t.activities || []).some(a => a.id === taskId));
    if (parent) resolvedId = parent.id;
  }

  if (typeof openTaskDetail === 'function') {
    openTaskDetail(resolvedId);
    setTimeout(() => tdSwitchTab('Actions'), 100);
  }
};

window.miToggleOb = function(safeId) {
  const body = document.getElementById(`mi-ob-body-${safeId}`);
  if (body) body.style.display = body.style.display === 'none' ? '' : 'none';
};

window.miObCheckAll = function(master, safeId) {
  document.querySelectorAll(`.mi-act-chk[data-obid="${safeId}"]`).forEach(c => c.checked = master.checked);
  miRowCheck(safeId);
};

window.miRowCheck = function(safeId) {
  const sel = document.querySelectorAll(`.mi-act-chk[data-obid="${safeId}"]:checked`);
  const bar = document.getElementById(`mi-bulk-${safeId}`);
  const cnt = document.getElementById(`mi-bulk-count-${safeId}`);
  if (bar) bar.style.display = sel.length ? 'flex' : 'none';
  if (cnt) cnt.textContent = `${sel.length} selected`;
};

window.miClearSel = function(safeId) {
  document.querySelectorAll(`.mi-act-chk[data-obid="${safeId}"]`).forEach(c => c.checked = false);
  const bar = document.getElementById(`mi-bulk-${safeId}`);
  if (bar) bar.style.display = 'none';
};

function _setClosedBadge(actId) {
  const badge = `<span style="display:inline-block;padding:3px 10px;border-radius:99px;font-size:11px;font-weight:700;background:#dcfce7;color:#15803d;border:1px solid #86efac;">Closed</span>`;
  // by named status cell id (hierarchy)
  const byId = document.getElementById(`mi-status-${actId}`);
  if (byId) { byId.innerHTML = badge; return; }
  // fallback: walk up from action cell
  ['action-cell-', 'mi-act-action-'].forEach(prefix => {
    const cell = document.getElementById(`${prefix}${actId}`);
    if (cell) {
      const row = cell.closest('tr');
      if (row) { const td = row.querySelectorAll('td')[4]; if (td) td.innerHTML = badge; }
    }
  });
}

window.miBulkAction = function(taskId, actionType, safeId) {
  const selIds = [...document.querySelectorAll(`.mi-act-chk[data-obid="${safeId}"]:checked`)].map(c => c.dataset.actid);
  if (!selIds.length) return;
  const tasks = (typeof CMS_DATA !== 'undefined' && CMS_DATA.tasks) ? CMS_DATA.tasks : [];
  selIds.forEach(actId => {
    const cell = document.getElementById(`mi-act-action-${actId}`);
    const workflowState = actionType === 'closure' ? 'sent_for_closure' : 'clarification_requested';
    const fakeTask = { id: actId, _workflowState: workflowState };
    if (cell) cell.innerHTML = _buildMyActions(fakeTask);

    if (actionType === 'closure') {
  target._workflowState = 'sent_for_closure';
  target.status         = 'In Progress';
  target.assigneeStatus = 'Closed';  // ← ye change karo
  showToast('Sent for closure — awaiting CO approval.', 'success');
}
  });
  miClearSel(safeId);
  showToast(`${selIds.length} action${selIds.length>1?'s':''} ${actionType === 'closure' ? 'closed' : 'updated'}`, 'success');
};

window.miQuickFilter = function(label) {
  const map = { 'Total':'', 'Open':'Open', 'In Progress':'In Progress', 'Closed':'Closed', 'Overdue':'Overdue', 'Due Soon':'' };
  taskFilters.status = map[label] ?? '';
  const sel = document.getElementById('task-filter-status');
  if (sel) sel.value = taskFilters.status;
  renderTasks();
};


// status badge update in same row
['action-cell-', 'mi-act-action-'].forEach(prefix => {
  const cell = document.getElementById(`${prefix}${taskId}`);
  if (!cell) return;
  const row = cell.closest('tr');
  if (!row) return;
  const tds = row.querySelectorAll('td');
  const statusTd = tds[tds.length - 2];
  if (statusTd) statusTd.innerHTML = `
    <span style="display:inline-block;padding:3px 10px;border-radius:99px;
    font-size:11px;font-weight:700;background:#dcfce7;color:#15803d;
    border:1px solid #86efac;">Closed</span>`;
});

// cards refresh
const cardsEl = document.getElementById('mi-cards-container');
if (cardsEl) cardsEl.innerHTML = buildSummaryCards([...CMS_DATA.tasks]);
window.assigneeAction = function(taskId, actionType, btn) {
  let task = CMS_DATA.tasks.find(t => t.id === taskId);
  let activity = null;
  if (!task) {
    task = CMS_DATA.tasks.find(t => (t.activities||[]).some(a => a.id === taskId));
    if (task) activity = task.activities.find(a => a.id === taskId);
  }
  if (!task) return;

  const target = activity || task;

  if (actionType === 'closure') {
    target._workflowState = 'sent_for_closure';
    target.status         = 'In Progress';
    target.assigneeStatus = 'In Progress';
    showToast('Sent for closure — awaiting CO approval.', 'success');
  } else if (actionType === 'clarification') {
    target._workflowState = 'clarification_requested';
    target.status         = 'In Progress';
    target.assigneeStatus = 'In Progress';
    showToast('Clarification requested.', 'warning');
  }

  // update action button
  ['action-cell-', 'mi-act-action-'].forEach(prefix => {
    const cell = document.getElementById(`${prefix}${taskId}`);
    if (!cell) return;
    cell.innerHTML = _buildMyActions(target);
    // update status badge in same row
    const row = cell.closest('tr');
    if (!row) return;
    const tds = row.querySelectorAll('td');
    const statusTd = tds[tds.length - 2];
    if (statusTd) statusTd.innerHTML = statusBadge(target);
  });

  // refresh cards
  const cardsEl = document.getElementById('mi-cards-container');
  if (cardsEl) cardsEl.innerHTML = buildSummaryCards([...CMS_DATA.tasks]);
};
function initTaskListeners() {
  document.getElementById('task-search')?.addEventListener('input', e => {
    taskFilters.search = e.target.value.trim(); renderTasks();
  });
  document.getElementById('task-filter-status')?.addEventListener('change', e => {
    taskFilters.status = e.target.value; renderTasks();
  });
  document.getElementById('task-filter-from')?.addEventListener('change', e => {
    taskFilters.from = e.target.value; _updateDateHint(); renderTasks();
  });
  document.getElementById('task-filter-to')?.addEventListener('change', e => {
    taskFilters.to = e.target.value; _updateDateHint(); renderTasks();
  });
  document.getElementById('clear-task-filters')?.addEventListener('click', () => {
    taskFilters = { status:'', department:'', search:'', from:'', to:'' };
    document.getElementById('task-search').value = '';
    document.getElementById('task-filter-status').value = '';
    document.getElementById('task-filter-from').value = '';
    document.getElementById('task-filter-to').value = '';
    _updateDateHint(); renderTasks();
  });
  document.querySelectorAll('.view-toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      taskView = btn.dataset.view;
      document.querySelectorAll('.view-toggle-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderTasks();
    });
  });
}

function _updateDateHint() {
  const hint = document.getElementById('task-date-hint');
  if (!hint) return;
  const f = taskFilters.from, t = taskFilters.to;
  if (f && t)      { hint.textContent = `${_fmtShort(f)} → ${_fmtShort(t)}`; hint.classList.add('visible'); }
  else if (f)      { hint.textContent = `From ${_fmtShort(f)}`;               hint.classList.add('visible'); }
  else if (t)      { hint.textContent = `Until ${_fmtShort(t)}`;              hint.classList.add('visible'); }
  else             { hint.textContent = '';                                    hint.classList.remove('visible'); }
}
function _fmtShort(d) { return new Date(d).toLocaleDateString('en-IN', { day:'2-digit', month:'short' }); }
function formatDate(d) { if (!d) return '—'; return new Date(d).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' }); }
function statusSelectClass(s) { return ({ 'Open':'open','In Progress':'inprogress','Complete':'complete','Overdue':'overdue' })[s] || 'open'; }

function showToast(msg, type) {
  const colors = { success:'#10b981', warning:'#f59e0b', info:'#4f7cff' };
  const t = document.createElement('div');
  t.textContent = msg;
  t.style.cssText = `position:fixed;bottom:24px;right:24px;z-index:9999;background:${colors[type]||'#4f7cff'};color:#fff;padding:10px 18px;border-radius:8px;font-size:13px;font-weight:600;box-shadow:0 4px 16px rgba(0,0,0,.2);max-width:380px;`;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2500);
}

function oblSwitchMainTab(tab) {
  if (tab === 'activities') {
    if (typeof renderMyItemsActivity === 'function') renderMyItemsActivity();
  } else {
    renderMyItemsObligations();
  }
}

function buildSummaryCards(tasks) {
  const now = new Date(); now.setHours(0,0,0,0);

  const total    = tasks.length;
  const overdue  = tasks.filter(t => t.assigneeStatus === 'Overdue' || (t.dueDate && new Date(t.dueDate) < now && t.assigneeStatus !== 'Closed')).length;
  const open     = tasks.filter(t => t.assigneeStatus === 'Open').length;
  const inProg   = tasks.filter(t => t.assigneeStatus === 'In Progress').length;
  const closed   = tasks.filter(t => t.assigneeStatus === 'Closed').length;
  const dueSoon  = tasks.filter(t => { if (!t.dueDate) return false; const d = Math.ceil((new Date(t.dueDate)-now)/86400000); return d>=0 && d<=7; }).length;

  const card = (icon, label, value, bg, color, border) =>
    `<div onclick="miQuickFilter('${label}')" style="flex:1;min-width:110px;background:${bg};border:1.5px solid ${border};border-radius:12px;padding:14px 16px;cursor:pointer;transition:box-shadow .15s;" onmouseover="this.style.boxShadow='0 4px 16px rgba(0,0,0,.08)'" onmouseout="this.style.boxShadow='none'">
      <div style="font-size:20px;margin-bottom:4px;">${icon}</div>
      <div style="font-size:22px;font-weight:800;color:${color};line-height:1;">${value}</div>
      <div style="font-size:11px;font-weight:600;color:#64748b;margin-top:4px;">${label}</div>
    </div>`;

  return `<div id="mi-summary-cards" style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:16px;">
    ${card('📋', 'Total',      total,   '#f8fafc', '#1e293b', '#e2e8f0')}
    ${card('🔴', 'Overdue',    overdue, '#fff1f2', '#dc2626', '#fca5a5')}
    ${card('🟡', 'Due Soon',   dueSoon, '#fffbeb', '#b45309', '#fde68a')}
    ${card('🔵', 'Open',       16,    '#eff6ff', '#2563eb', '#93c5fd')}
   
    ${card('🟢', 'Closed',     closed,  '#f0fdf4', '#15803d', '#86efac')}
  </div>`;
}