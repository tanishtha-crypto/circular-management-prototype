
/**
 * task-management.js — CMS Circular Management System
 * Renders obligation list (table & card view), add task modal, status updates.
 * CHANGES: From/To date filters added; table shows Obligation ID + Obligation Name;
 *          Circular and Clause columns removed.
 */

let USER_ROLE, IS_ASSIGNEE, IS_CO;
let taskView = 'table';
let taskFilters = { status: '', department: '', search: '', from: '', to: '' };

window.statusBadge = function(t) {
  const ds = getDisplayStatus(t);
  return `<span style="display:inline-block;padding:3px 10px;border-radius:99px;
    font-size:11px;font-weight:700;white-space:nowrap;
    background:${ds.bg};color:${ds.color};border:1px solid ${ds.border};">${ds.label}</span>`;
};
/** Entry point */
function renderMyItemsObligations() {
  USER_ROLE   = document.body.dataset.userRole || 'co';
  IS_ASSIGNEE = USER_ROLE === 'assignee';
  IS_CO       = USER_ROLE === 'co';
  window._coTrackingMode = false;
  taskFilters = { status: '', department: '', search: '', from: '', to: '' };
  const area = document.getElementById('content-area');
  area.innerHTML = buildTaskManagementHTML();
  initTaskListeners();
  renderTasks();
}

/* ================================================================
   BUILD HTML
   ================================================================ */
function buildTaskManagementHTML() {
  const depts = [...new Set(CMS_DATA.tasks.map(t => t.department))].sort();

  return `
  
  <div class="fade-in">
  <div class="aa-tab-switch" style="margin-top:10px; display:flex; flex-direction:row-reverse; gap:8px; margin-bottom:10px;">
  <button
   style="padding:6px 12px; border:1px solid #111827; background:#111827; color:#fff; border-radius:6px; cursor:pointer;"
    onclick="oblSwitchMainTab('activities')">
    Actionables
  </button>
  <button
    style="padding:6px 12px; border:1px solid #d1d5db; background:#fff; color:#111827; border-radius:6px; cursor:pointer;"
    onclick="oblSwitchMainTab('obligations')">
    Obligations
  </button>
</div>
<div id="mi-cards-container"></div>
    <div class="task-toolbar-wrap">

      <!-- ROW 1: Search · Status · Department · Clear · Count — full width single row -->
      <div class="tb-row tb-row-filters">
        <input  type="text"   class="form-control tb-search" id="task-search"
                placeholder="🔍  Search obligations…"/>
        <select class="form-control tb-select" id="task-filter-status">
          <option value="">All Statuses</option>
          <option>Open</option>
          <option>In Progress</option>
          <option>Complete</option>
          <option>Overdue</option>
        </select>
        <select class="form-control tb-select" id="task-filter-dept">
          <option value="">All Departments</option>
          ${depts.map(d => `<option>${d}</option>`).join('')}
        </select>
        <button class="btn btn-ghost btn-sm tb-clear" id="clear-task-filters">✕ Clear</button>
        <span   id="task-count" class="tb-count"></span>
      </div>

      <!-- ROW 2: Date Range (left) · View Toggle (right) -->
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
          <button class="view-toggle-btn ${taskView === 'card'  ? 'active' : ''}" data-view="card">⊞ Cards</button>
        </div>
      </div>

    </div>

    <div id="task-content"></div>

    <style>
      .task-toolbar-wrap {
        background: var(--surface, #fff);
        border: 1px solid var(--border, #e2e8f0);
        border-radius: 10px;
        overflow: hidden;
        margin-bottom: 16px;
      }
      .tb-row {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px 16px;
        width: 100%;
        box-sizing: border-box;
      }
      /* ROW 1 — no wrap, everything on one line */
      .tb-row-filters {
        border-bottom: 1px solid var(--border, #e2e8f0);
        flex-wrap: nowrap;
      }
      .tb-search {
        flex: 1 1 0;
        min-width: 0;
      }
      .tb-select {
        flex: 0 0 140px;
        width: 140px;
      }
      .tb-clear {
        flex-shrink: 0;
        white-space: nowrap;
      }
      .tb-count {
        flex-shrink: 0;
        font-size: 11px;
        font-weight: 600;
        color: var(--text-muted, #94a3b8);
        white-space: nowrap;
      }
      /* ROW 2 */
      .tb-row-date {
        background: #f8fafc;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 8px;
      }
      .tb-date-group {
        display: flex;
        align-items: center;
        gap: 10px;
        flex-wrap: wrap;
      }
      .tb-date-label {
        font-size: 10px;
        font-weight: 700;
        color: #94a3b8;
        text-transform: uppercase;
        letter-spacing: .07em;
        white-space: nowrap;
      }
      .tb-date-field {
        display: flex;
        align-items: center;
        gap: 6px;
      }
      .tb-field-label {
        font-size: 11px;
        font-weight: 600;
        color: #64748b;
        white-space: nowrap;
      }
      .tb-date-inp {
        width: 138px !important;
        padding: 5px 8px !important;
        font-size: 12px !important;
      }
      .tb-arrow {
        font-size: 13px;
        color: #cbd5e1;
        font-weight: 700;
      }
      .tb-date-hint {
        display: none;
        font-size: 11px;
        font-weight: 600;
        color: #6366f1;
        background: #eef2ff;
        border: 1px solid #c7d2fe;
        padding: 3px 10px;
        border-radius: 20px;
        white-space: nowrap;
      }
      .tb-date-hint.visible { display: inline; }
    </style>
  </div>
  `;
}

/* ================================================================
   RENDER TASKS
   ================================================================ */
function renderTasks() {
  const content = document.getElementById('task-content');
  if (!content) return;
   const cardsEl = document.getElementById('mi-cards-container');
  if (cardsEl && !window._coTrackingMode) {
    cardsEl.innerHTML = buildSummaryCards([...CMS_DATA.tasks]);
  }

  let tasks = [...CMS_DATA.tasks];



  // Apply filters
  if (taskFilters.search) {
    const s = taskFilters.search.toLowerCase();
  tasks = tasks.filter(t =>
  (t.title || '').toLowerCase().includes(s) ||
  (t.id || '').toLowerCase().includes(s) ||
  (t.department || '').toLowerCase().includes(s) ||
  (t.clauseRef || '').toLowerCase().includes(s)
);
  }
  if (taskFilters.status)     tasks = tasks.filter(t => t.status === taskFilters.status);
  if (taskFilters.department) tasks = tasks.filter(t => t.department === taskFilters.department);
  if (taskFilters.from)       tasks = tasks.filter(t => t.dueDate && t.dueDate >= taskFilters.from);
  if (taskFilters.to)         tasks = tasks.filter(t => t.dueDate && t.dueDate <= taskFilters.to);

  const countEl = document.getElementById('task-count');
  if (countEl) countEl.textContent = `${tasks.length} tasks`;

  if (tasks.length === 0) {
    content.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">◉</div>
        <div class="empty-state-text">No tasks match your filters</div>
        <div class="empty-state-sub">Try clearing filters or adding a new task.</div>
      </div>`;
    return;
  }

  if (taskView === 'table') {
    content.innerHTML = buildTaskTable(tasks);
    bindStatusDropdowns();
  } else {
    content.innerHTML = buildTaskCards(tasks);
    bindStatusDropdowns();
  }

  // at bottom of renderTasks()

}

/* ================================================================
   TABLE VIEW
   ================================================================ */
function fmtDueDateColored(dateStr) {
  if (!dateStr) return `<span style="color:#94a3b8;font-weight:600;font-size:12px;">N/A</span>`;
  const due = new Date(dateStr);
  const now = new Date();
  now.setHours(0,0,0,0);
  const diffDays = Math.ceil((due - now) / (1000 * 60 * 60 * 24));
  let color, bg, border;
  if (diffDays < 0)       { color='#dc2626'; bg='#fee2e2'; border='#fca5a5'; }
  else if (diffDays <= 7) { color='#b45309'; bg='#fef9c3'; border='#fde68a'; }
  else if (diffDays <= 30){ color='#0369a1'; bg='#dbeafe'; border='#93c5fd'; }
  else                    { color='#64748b'; bg='#f1f5f9'; border='#e2e8f0'; }
  const label = new Date(dateStr).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' });
  return `<span style="background:${bg};color:${color};border:1px solid ${border};padding:2px 9px;border-radius:99px;font-size:11px;font-weight:700;white-space:nowrap;">${label}</span>`;
}

function getActionLabel(t) {
  if (t._workflowState === 'sent_for_closure') {
    return `
    <div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap;">
      <span style="background:#dcfce7;color:#15803d;border:1px solid #86efac;padding:3px 10px;border-radius:99px;font-size:11px;font-weight:700;white-space:nowrap;">✓ Closure Received</span>
      <button onclick="handleCOApprove('${t.id}',this)"
        style="padding:3px 10px;background:#15803d;color:#fff;border:none;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer;white-space:nowrap;">
        ✓ Approve & Close
      </button>
    </div>`;
  }
  if (t._workflowState === 'clarification_requested') {
    return `
    <div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap;">
      <span style="background:#fef9c3;color:#b45309;border:1px solid #fde68a;padding:3px 10px;border-radius:99px;font-size:11px;font-weight:700;white-space:nowrap;">💬 Clarification Requested</span>
      <button onclick="handleCOSendClarification('${t.id}',this)"
        style="padding:3px 10px;background:#f59e0b;color:#fff;border:none;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer;white-space:nowrap;">
        📨 Send Clarification
      </button>
    </div>`;
  }
  if (t._workflowState === 'clarification_sent') {
    return `<span style="background:#e0f2fe;color:#0369a1;border:1px solid #93c5fd;padding:3px 10px;border-radius:99px;font-size:11px;font-weight:700;white-space:nowrap;">📨 Clarification Sent — Awaiting Assignee</span>`;
  }
  if (t._workflowState === 'closed') {
    return `<span style="background:#dcfce7;color:#15803d;border:1px solid #86efac;padding:3px 10px;border-radius:99px;font-size:11px;font-weight:700;white-space:nowrap;">✓ Closed</span>`;
  }
  return `
  <button onclick="handleCOSendClarification('${t.id}',this)"
    style="padding:3px 10px;background:#f59e0b;color:#fff;border:none;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer;white-space:nowrap;">
    💬 Send for Clarification
  </button>`;
}

function _buildAssigneeActions(t) {
  if (t._workflowState === 'sent_for_closure') {
    return `<span style="font-size:11px;font-weight:700;color:#15803d;background:#dcfce7;border:1px solid #86efac;padding:3px 10px;border-radius:99px;white-space:nowrap;">✓ Sent for Closure</span>`;
  }
  if (t._workflowState === 'clarification_requested') {
    return `<span style="font-size:11px;font-weight:700;color:#b45309;background:#fef9c3;border:1px solid #fde68a;padding:3px 10px;border-radius:99px;white-space:nowrap;">💬 Clarification Requested</span>`;
  }
  if (t._workflowState === 'clarification_sent') {
    return `
    <div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center;">
      <span style="font-size:10px;font-weight:600;color:#b45309;background:#fef9c3;border:1px solid #fde68a;padding:3px 8px;border-radius:99px;white-space:nowrap;">⚠ CO sent clarification</span>
      <button onclick="handleAssigneeAction('${t.id}','closure',this)"
        style="padding:4px 10px;background:#2563eb;color:#fff;border:none;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer;white-space:nowrap;">
        📤 Send for Closure
      </button>
    </div>`;
  }
  return `
  <div style="display:flex;gap:6px;flex-wrap:wrap;">
    <button onclick="handleAssigneeAction('${t.id}','closure',this)"
      style="padding:4px 10px;background:#2563eb;color:#fff;border:none;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer;white-space:nowrap;">
      📤 Send for Closure
    </button>
    <button onclick="handleAssigneeAction('${t.id}','clarification',this)"
      style="padding:4px 10px;background:#f59e0b;color:#fff;border:none;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer;white-space:nowrap;">
      💬 Ask Clarification
    </button>
  </div>`;
}
function buildSummaryCards(tasks) {
  const total       = tasks.length;
  const pending     = tasks.filter(t => !t._workflowState || t._workflowState === 'assigned').length;
  const overdue     = tasks.filter(t => t.status === 'Overdue').length;
  const closureReq  = tasks.filter(t => t._workflowState === 'sent_for_closure').length;
  const clarReq     = tasks.filter(t => t._workflowState === 'clarification_requested').length;
  const closed      = tasks.filter(t => t._workflowState === 'closed' || t.status === 'Complete' || t.status === 'Closed').length;

  const card = (icon, label, value, bg, color, border, filterVal) =>
    `<div onclick="miQuickFilter('${filterVal}')"
      style="flex:1;min-width:110px;background:${bg};border:1.5px solid ${border};
      border-radius:12px;padding:13px 15px;cursor:pointer;"
      onmouseover="this.style.boxShadow='0 4px 14px rgba(0,0,0,.09)'"
      onmouseout="this.style.boxShadow='none'">
      <div style="font-size:18px;margin-bottom:3px;">${icon}</div>
      <div style="font-size:22px;font-weight:800;color:${color};line-height:1;">${value}</div>
      <div style="font-size:11px;font-weight:600;color:#64748b;margin-top:3px;">${label}</div>
    </div>`;

  return `<div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:14px;">
    ${card('📋','Total',            total,      '#f8fafc','#1e293b','#e2e8f0','')}
    ${card('⏳','Actions Pending',  pending,    '#eff6ff','#2563eb','#93c5fd','')}
    ${card('🔴','Overdue',          6,    '#fff1f2','#dc2626','#fca5a5','Overdue')}
   
  </div>`;
}

function _buildWorkflowStatus(t) {
  const state = t._workflowState || 'assigned';
  const steps = [
    { label: 'Assigned',        done: true },
    { label: 'In Progress',     done: ['clarification_requested','clarification_sent','sent_for_closure','closed'].includes(state) },
    { label: 'Clarification',   done: ['clarification_sent'].includes(state), warn: state === 'clarification_requested' },
    { label: 'Sent for Closure',done: ['sent_for_closure','closed'].includes(state) },
    { label: 'Closed',          done: state === 'closed' },
  ];
  return `
  <div style="display:flex;align-items:center;gap:2px;">
    ${steps.map((s, i) => `
      <div style="display:flex;align-items:center;gap:2px;">
        <div title="${s.label}" style="
          width:20px;height:20px;border-radius:50%;display:flex;align-items:center;justify-content:center;
          font-size:9px;font-weight:700;flex-shrink:0;cursor:default;
          ${s.warn
            ? 'background:#fef9c3;color:#b45309;border:2px solid #fde68a;'
            : s.done
            ? 'background:#2563eb;color:#fff;border:2px solid #2563eb;'
            : 'background:#fff;color:#94a3b8;border:2px solid #e2e8f0;'
          }">${s.done ? '✓' : s.warn ? '!' : (i+1)}</div>
        <span style="font-size:9px;font-weight:600;color:${s.done||s.warn?'#2563eb':'#94a3b8'};white-space:nowrap;display:none;">${s.label}</span>
        ${i < steps.length-1 ? `<div style="width:10px;height:2px;background:${steps[i+1].done||s.done?'#2563eb':'#e2e8f0'};flex-shrink:0;"></div>` : ''}
      </div>
    `).join('')}
  </div>`;
}

window.handleAssigneeAction = function(taskId, actionType, btn) {
  const task = CMS_DATA.tasks.find(t => t.id === taskId);
  if (!task) return;
  if (actionType === 'closure') {
    task._workflowState = 'sent_for_closure';
    task.status = 'Complete';
    showToast(`Obligation ${taskId} sent for closure — awaiting CO approval.`, 'success');
  } else if (actionType === 'clarification') {
    task._workflowState = 'clarification_requested';
    showToast(`Clarification requested for ${taskId} — CO has been notified.`, 'warning');
  }
  const actionCell = document.getElementById(`action-cell-${taskId}`);
  const workflowCell = document.getElementById(`workflow-cell-${taskId}`);
  if (actionCell) actionCell.innerHTML = _buildAssigneeActions(task);
  if (workflowCell) workflowCell.innerHTML = _buildWorkflowStatus(task);
};

window.handleCOSendClarification = function(taskId, btn) {
  const task = CMS_DATA.tasks.find(t => t.id === taskId);
  if (!task) return;
  task._workflowState = 'clarification_sent';
  showToast(`Clarification sent to assignee for ${taskId}.`, 'warning');
  const cell = document.getElementById(`action-cell-${taskId}`);
  if (cell) cell.innerHTML = getActionLabel(task);
};

window.handleCOApprove = function(taskId, btn) {
  const task = CMS_DATA.tasks.find(t => t.id === taskId);
  if (!task) return;
  task._workflowState = 'closed';
  task.status = 'Complete';
  showToast(`Obligation ${taskId} approved and closed.`, 'success');
  renderTasks();
};

function buildTaskTable(tasks) {
  return `
  <div class="table-card">
    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
          <th>Obligation ID</th>
<th>Obligation Name</th>
<th>Action Name</th>

${IS_CO ? '<th>Pending Action</th>' : '<th>Department</th>'}
${IS_CO ? '<th>From</th>' : ''}
<th>Due Date</th>
<th>Action</th>
          </tr>
        </thead>
        <tbody>
          ${tasks.map(t => `
          <tr>
            <td>
              <span class="text-accent font-bold task-id-link"
                    onclick="openTaskDetail('${t.id}')"
                    style="cursor:pointer;text-decoration:underline dotted;">
                ${t.obligationId || t.id}
              </span>
            </td>
            <td style="max-width:260px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis" title="${t.title}">
              ${t.title}
            </td>
             <td style="max-width:260px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis" title="${t.title}">
              ${t.activities[0].name}
            </td>
            
   ${IS_CO ? `
  <td>${_buildInboxTypeBadge(t)}</td>
  <td style="font-size:12px;color:#475569">${(function(){
  var a = t.assignee;
  if (!a) return '—';
  if (typeof a === 'string') return a;
  if (typeof a === 'object') return Object.values(a).filter(Boolean).join(', ');
  return '—';
})()}</td>
` : `<td><span class="task-dept-chip">${t.department}</span></td>`}
            <td>${fmtDueDateColored(t.dueDate)}</td>
            
           <td id="action-cell-${t.id}">
  <button onclick="openTaskDetail('${t.id}')"
    style="padding:4px 12px;background:#6366f1;color:#fff;border:none;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer;white-space:nowrap;">
    Take Action →
  </button>
</td>
          </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  </div>`;
}

/* ================================================================
   CARD VIEW
   ================================================================ */
function buildTaskCards(tasks) {
  return `
  <div class="task-cards-grid">
    ${tasks.map(t => `
    <div class="task-card risk-${t.risk.toLowerCase()}">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:6px">
        <span class="text-xs text-muted font-bold">${t.id}</span>
        <span class="risk-badge risk-${t.risk.toLowerCase()}">${t.risk}</span>
      </div>
      <div class="task-card-title">${t.title}</div>
      <div class="task-card-meta">
        <span class="task-dept-chip">${t.department}</span>
        <span style="font-size:10px;color:var(--text-muted)">📅 ${formatDate(t.dueDate)}</span>
      </div>
      <div style="font-size:11px;color:var(--text-secondary);margin-bottom:10px">
        👤 ${(function(){ var a = t.assignee; if (!a) return '—'; if (typeof a === 'string') return a; if (typeof a === 'object') return Object.values(a).filter(Boolean).join(', '); return '—'; })()}
      </div>
      <div class="task-card-footer">
        <span class="risk-badge ${priorityClass(t.priority)}">${t.priority}</span>
        <select class="status-select ${statusSelectClass(t.status)}"
                data-task-id="${t.id}" onchange="handleStatusChange(this)" style="font-size:11px">
          <option value="Open"        ${t.status === 'Open'        ? 'selected' : ''}>Open</option>
          <option value="In Progress" ${t.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
          <option value="Complete"    ${t.status === 'Complete'    ? 'selected' : ''}>Complete</option>
          <option value="Overdue"     ${t.status === 'Overdue'     ? 'selected' : ''}>Overdue</option>
        </select>
      </div>
    </div>
    `).join('')}
  </div>`;
}

/* ================================================================
   STATUS CHANGE HANDLER
   ================================================================ */
function handleStatusChange(selectEl) {
  const taskId    = selectEl.dataset.taskId;
  const newStatus = selectEl.value;
  CMS_DATA.updateTaskStatus(taskId, newStatus);
  selectEl.className = `status-select ${statusSelectClass(newStatus)}`;
  const dashboardArea = document.querySelector('.metrics-grid');
  if (dashboardArea) refreshDashboardMetrics();
  /* refresh action cell if visible */
  const task = CMS_DATA.tasks.find(t => t.id === taskId);
  const cell = document.getElementById(`action-cell-${taskId}`);
  if (cell && task) cell.innerHTML = getActionLabel(task);
  showToast(`Task ${taskId} updated to "${newStatus}"`, 'success');
}

function bindStatusDropdowns() {}

window.openTaskDetail = window.openTaskDetail || function(taskId) {
  const task = CMS_DATA.tasks.find(t => t.id === taskId);
  if (!task) return;
  const modal = document.getElementById('generic-modal');
  const box   = document.getElementById('generic-modal-box');
  const title = document.getElementById('generic-modal-title');
  const body  = document.getElementById('generic-modal-body');
  if (!modal || !body) { showToast('Detail view not available.', 'info'); return; }
  box.style.maxWidth = '640px';
  title.textContent  = task.obligationId || task.id;
  const a = task.assignee;
  const assigneeStr = !a ? '—' : typeof a === 'string' ? a : Object.entries(a).map(e => e[0]+': '+e[1]).join(' | ');
  body.innerHTML = `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px;">
      <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:12px;">
        <div style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;margin-bottom:4px;">Obligation</div>
        <div style="font-size:13px;font-weight:600;color:#111827;">${task.title}</div>
      </div>
      <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:12px;">
        <div style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;margin-bottom:4px;">Department</div>
        <div style="font-size:13px;font-weight:600;color:#111827;">${task.department || '—'}</div>
      </div>
      <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:12px;">
        <div style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;margin-bottom:4px;">Assigned To</div>
        <div style="font-size:13px;font-weight:600;color:#111827;">${assigneeStr}</div>
      </div>
      <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:12px;">
        <div style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;margin-bottom:4px;">Due Date</div>
        <div style="font-size:13px;font-weight:600;color:#111827;">${task.dueDate || '—'}</div>
      </div>
      <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:12px;">
        <div style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;margin-bottom:4px;">Status</div>
        <div>${statusBadge(task)}</div>
      </div>
      <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:12px;">
        <div style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;margin-bottom:4px;">Priority</div>
        <div style="font-size:13px;font-weight:600;color:#111827;">${task.priority || '—'}</div>
      </div>
    </div>
    <div style="background:#f0f9ff;border:1px solid #bae6fd;border-radius:8px;padding:14px;margin-bottom:16px;">
      <div style="font-size:10px;font-weight:700;color:#0369a1;text-transform:uppercase;margin-bottom:8px;">Actions</div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;">
        <button onclick="handleAssigneeAction('${task.id}','closure',this);document.getElementById('generic-modal').classList.add('hidden');"
          style="padding:7px 16px;background:#2563eb;color:#fff;border:none;border-radius:6px;font-size:12px;font-weight:700;cursor:pointer;">
          📤 Send for Closure
        </button>
        <button onclick="handleAssigneeAction('${task.id}','clarification',this);document.getElementById('generic-modal').classList.add('hidden');"
          style="padding:7px 16px;background:#f59e0b;color:#fff;border:none;border-radius:6px;font-size:12px;font-weight:700;cursor:pointer;">
          💬 Ask Clarification
        </button>
      </div>
    </div>
    <div class="form-actions">
      <button class="btn btn-ghost" onclick="document.getElementById('generic-modal').classList.add('hidden')">Close</button>
    </div>`;
  modal.classList.remove('hidden');
};

/* ================================================================
   ADD TASK MODAL
   ================================================================ */
function openAddTaskModal() {
  const modal = document.getElementById('generic-modal');
  const box   = document.getElementById('generic-modal-box');
  const title = document.getElementById('generic-modal-title');
  const body  = document.getElementById('generic-modal-body');

  box.style.maxWidth = '600px';
  title.textContent  = '+ Add New Task';

  const circularOptions = CMS_DATA.circulars.map(c =>
    `<option value="${c.id}">${c.id} – ${c.title}</option>`
  ).join('');

  body.innerHTML = `
  <div class="form-grid-2">
    <div class="form-group" style="grid-column:span 2">
      <label class="form-label">Task Title *</label>
      <input type="text" class="form-control" id="new-task-title" placeholder="Enter task title..."/>
    </div>
    <div class="form-group">
      <label class="form-label">Circular Reference *</label>
      <select class="form-control" id="new-task-circular">
        <option value="">Select circular...</option>
        ${circularOptions}
      </select>
    </div>
    <div class="form-group">
      <label class="form-label">Clause Reference</label>
      <input type="text" class="form-control" id="new-task-clause" placeholder="e.g. C1.1"/>
    </div>
    <div class="form-group">
      <label class="form-label">Department *</label>
      <select class="form-control" id="new-task-dept">
        <option value="">Select department...</option>
        <option>IT</option><option>Risk</option><option>Compliance</option>
        <option>Legal</option><option>Finance</option><option>Operations</option>
        <option>HR</option><option>Procurement</option>
      </select>
    </div>
    <div class="form-group">
      <label class="form-label">Department Head</label>
      <select class="form-control" id="new-task-assignee">
        <option value="">Select Assignee</option>
        <option value="Rahul Sharma">Rahul Sharma</option>
        <option value="Anita Verma">Anita Verma</option>
        <option value="Vikram Singh">Vikram Singh</option>
        <option value="Neha Patel">Neha Patel</option>
      </select>
    </div>
    <div class="form-group">
      <label class="form-label">Due Date *</label>
      <input type="date" class="form-control" id="new-task-due"/>
    </div>
    <div class="form-group">
      <label class="form-label">Priority</label>
      <select class="form-control" id="new-task-priority">
        <option>High</option><option>Medium</option><option>Low</option><option>Critical</option>
      </select>
    </div>
    <div class="form-group">
      <label class="form-label">Risk Level</label>
      <select class="form-control" id="new-task-risk">
        <option>High</option><option>Medium</option><option>Low</option>
      </select>
    </div>
    <div class="form-group">
      <label class="form-label">Status</label>
      <select class="form-control" id="new-task-status">
        <option>Open</option><option>In Progress</option><option>Complete</option>
      </select>
    </div>
  </div>
  <div class="form-actions">
    <button class="btn btn-ghost" onclick="document.getElementById('generic-modal').classList.add('hidden')">Cancel</button>
    <button class="btn btn-primary" id="save-task-btn">Save Task</button>
  </div>
  `;

  modal.classList.remove('hidden');
  document.getElementById('save-task-btn').addEventListener('click', saveNewTask);
}


function _buildInboxTypeBadge(t) {
  const state = t._workflowState || '';
  if (state === 'sent_for_closure')
    return `<span style="background:#dcfce7;color:#15803d;border:1px solid #86efac;padding:2px 10px;border-radius:99px;font-size:11px;font-weight:700;white-space:nowrap;">✓ Closure Request</span>`;
  if (state === 'clarification_requested')
    return `<span style="background:#fef9c3;color:#b45309;border:1px solid #fde68a;padding:2px 10px;border-radius:99px;font-size:11px;font-weight:700;white-space:nowrap;">💬 Clarification Req</span>`;
  if (state === 'clarification_sent')
    return `<span style="background:#e0f2fe;color:#0369a1;border:1px solid #93c5fd;padding:2px 10px;border-radius:99px;font-size:11px;font-weight:700;white-space:nowrap;">📨 Awaiting Assignee</span>`;
  if (state === 'closed')
    return `<span style="background:#f1f5f9;color:#475569;border:1px solid #e2e8f0;padding:2px 10px;border-radius:99px;font-size:11px;font-weight:700;white-space:nowrap;">✓ Closed</span>`;
  return `<span style="background:#f1f5f9;color:#475569;border:1px solid #e2e8f0;padding:2px 10px;border-radius:99px;font-size:11px;font-weight:700;white-space:nowrap;">Clarification Request</span>`;
}

function _buildDaysWaiting(t) {
  if (!t._assignedAt) return `<span style="color:#94a3b8;font-size:12px;">—</span>`;
  const days = Math.floor((Date.now() - new Date(t._assignedAt)) / 86400000);
  const color = days >= 7 ? '#dc2626' : days >= 3 ? '#b45309' : '#15803d';
  const bg    = days >= 7 ? '#fee2e2' : days >= 3 ? '#fef9c3' : '#dcfce7';
  const border= days >= 7 ? '#fca5a5' : days >= 3 ? '#fde68a' : '#86efac';
  return `<span style="background:${bg};color:${color};border:1px solid ${border};padding:2px 9px;border-radius:99px;font-size:11px;font-weight:700;">${days}d</span>`;
}

function saveNewTask() {
  const title  = document.getElementById('new-task-title').value.trim();
  const circId = document.getElementById('new-task-circular').value;
  const dept   = document.getElementById('new-task-dept').value;
  const due    = document.getElementById('new-task-due').value;

  if (!title || !circId || !dept || !due) {
    showToast('Please fill in all required fields (*).', 'warning');
    return;
  }

  const newTask = {
    id:         `OB-${String(CMS_DATA.tasks.length + 1).padStart(3, '0')}`,
    title,
    circularId: circId,
    clauseRef:  document.getElementById('new-task-clause').value || 'TBD',
    department: dept,
    dueDate:    due,
    priority:   document.getElementById('new-task-priority').value,
    risk:       document.getElementById('new-task-risk').value,
    status:     document.getElementById('new-task-status').value,
    assignee:   document.getElementById('new-task-assignee').value || 'Unassigned'
  };

  CMS_DATA.tasks.push(newTask);
  document.getElementById('generic-modal').classList.add('hidden');
  renderTasks();
  showToast(`Task "${newTask.id}" created successfully!`, 'success');
}

/* ================================================================
   LISTENERS
   ================================================================ */
function initTaskListeners() {
  const isTracking = typeof renderTrackingTasks === 'function' 
    && document.getElementById('co-tracking-mode'); // optional flag
  // then w
  const searchInput = document.getElementById('task-search');
  if (searchInput) searchInput.addEventListener('input', () => {
    taskFilters.search = searchInput.value.trim();
    window._coTrackingMode ? renderTrackingTasks() : renderTasks();
  });

  const statusFilter = document.getElementById('task-filter-status');
  if (statusFilter) statusFilter.addEventListener('change', () => {
    taskFilters.status = statusFilter.value;
   window._coTrackingMode ? renderTrackingTasks() : renderTasks();
  });

  const deptFilter = document.getElementById('task-filter-dept');
  if (deptFilter) deptFilter.addEventListener('change', () => {
    taskFilters.department = deptFilter.value;
    window._coTrackingMode ? renderTrackingTasks() : renderTasks();
  });

  const fromFilter = document.getElementById('task-filter-from');
  if (fromFilter) fromFilter.addEventListener('change', () => {
    taskFilters.from = fromFilter.value;
    _updateDateHint();
   window._coTrackingMode ? renderTrackingTasks() : renderTasks();
  });

  const toFilter = document.getElementById('task-filter-to');
  if (toFilter) toFilter.addEventListener('change', () => {
    taskFilters.to = toFilter.value;
    _updateDateHint();
    window._coTrackingMode ? renderTrackingTasks() : renderTasks();
  });

  const clearBtn = document.getElementById('clear-task-filters');
  if (clearBtn) clearBtn.addEventListener('click', () => {
    taskFilters = { status: '', department: '', search: '', from: '', to: '' };
    document.getElementById('task-search').value        = '';
    document.getElementById('task-filter-status').value = '';
    document.getElementById('task-filter-dept').value   = '';
    document.getElementById('task-filter-from').value   = '';
    document.getElementById('task-filter-to').value     = '';
    _updateDateHint();
    window._coTrackingMode ? renderTrackingTasks() : renderTasks();
  });

  document.querySelectorAll('.view-toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      taskView = btn.dataset.view;
      document.querySelectorAll('.view-toggle-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      window._coTrackingMode ? renderTrackingTasks() : renderTasks();
    });
  });

  // const addBtn = document.getElementById('add-task-btn');
  // if (addBtn) addBtn.addEventListener('click', openAddTaskModal);
}

/* ================================================================
   HELPERS
   ================================================================ */
function _updateDateHint() {
  const hint = document.getElementById('task-date-hint');
  if (!hint) return;
  const f = taskFilters.from, t = taskFilters.to;
  if (f && t)      { hint.textContent = `${_fmtShort(f)} → ${_fmtShort(t)}`; hint.classList.add('visible'); }
  else if (f)      { hint.textContent = `From ${_fmtShort(f)}`;               hint.classList.add('visible'); }
  else if (t)      { hint.textContent = `Until ${_fmtShort(t)}`;              hint.classList.add('visible'); }
  else             { hint.textContent = '';                                    hint.classList.remove('visible'); }
}
function _fmtShort(d) {
  return new Date(d).toLocaleDateString('en-IN', { day:'2-digit', month:'short' });
}
function statusSelectClass(status) {
  const map = {
    'Open': 'open', 'In Progress': 'inprogress',
    'Complete': 'complete', 'Overdue': 'overdue'
  };
  return map[status] || 'open';
}

function priorityClass(p) {
  const map = { 'Critical': 'risk-high', 'High': 'risk-high', 'Medium': 'risk-medium', 'Low': 'risk-low' };
  return map[p] || '';
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function showToast(msg, type) {
  const colors = { success: '#10b981', warning: '#f59e0b', info: '#4f7cff' };
  const t = document.createElement('div');
  t.textContent = msg;
  t.style.cssText = `
    position:fixed;bottom:24px;right:24px;z-index:9999;
    background:${colors[type] || '#4f7cff'};color:#fff;
    padding:10px 18px;border-radius:8px;
    font-size:13px;font-weight:600;
    box-shadow:0 4px 16px rgba(0,0,0,.2);
    animation:fadeIn 0.3s ease;max-width:380px;
  `;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2500);
}

function oblSwitchMainTab(tab) {
  if (tab === 'activities') {
    if (typeof renderMyItemsActivity === 'function') {
      renderMyItemsActivity();
    } else {
      console.error('renderMyItemsActivity is not loaded');
    }
  } else {
    renderMyItemsObligations();
  }
}


function renderCOTrackingView() {
  USER_ROLE   = document.body.dataset.userRole || 'co';
  IS_ASSIGNEE = false;
  IS_CO       = true;
  taskFilters = { status: '', department: '', search: '', from: '', to: '' };
  const area = document.getElementById('content-area');
  area.innerHTML = buildTaskManagementHTML();
  initTaskListeners();
  renderTrackingTasks(); // ← different render function
}


function renderTrackingTasks() {
    
  const content = document.getElementById('task-content');
  if (!content) return;

  // cards always show unfiltered totals
  const cardsEl = document.getElementById('mi-cards-container');
  // if (cardsEl) cardsEl.innerHTML = buildTrackingSummaryCards([...CMS_DATA.tasks]);

  let tasks = [...CMS_DATA.tasks];

  if (taskFilters.search) {
    const s = taskFilters.search.toLowerCase();
    tasks = tasks.filter(t =>
      (t.title || '').toLowerCase().includes(s) ||
      (t.id || '').toLowerCase().includes(s) ||
      (t.department || '').toLowerCase().includes(s)
    );
  }
  if (taskFilters.status)     tasks = tasks.filter(t => t.status === taskFilters.status);
  if (taskFilters.department) tasks = tasks.filter(t => t.department === taskFilters.department);
  if (taskFilters.from)       tasks = tasks.filter(t => t.dueDate && t.dueDate >= taskFilters.from);
  if (taskFilters.to)         tasks = tasks.filter(t => t.dueDate && t.dueDate <= taskFilters.to);

  const countEl = document.getElementById('task-count');
  if (countEl) countEl.textContent = `${tasks.length} obligations`;

  content.innerHTML = buildTrackingTable(tasks);
}


function buildTrackingTable(tasks) {
  return `
  <div class="table-card">
    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Obligation ID</th>
            <th>Obligation Name</th>
            <th>Department</th>
            <th>Due Date</th>
            <th>Current Status</th>
            <th>With Whom</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          ${tasks.map(t => {
            const state = t._workflowState || '';
            const currentStatus =
              !t.assignee || t.assignee === 'Unassigned' ? 'Unassigned'
              : state === 'closed'                        ? 'Closed'
              : state === 'sent_for_closure'              ? 'Sent for Closure'
              : state === 'clarification_requested'       ? 'Clarification Req'
              : state === 'clarification_sent'            ? 'Sent for Clarification'
              : t.status === 'Complete'                   ? 'Closed'
              : t.status === 'In Progress'                ? 'In Progress'
              : t.status === 'Overdue'                    ? 'Overdue'
              : t.assigneeStatus || 'Open';

            const statusStyle =
              currentStatus === 'Closed' || currentStatus === 'Complete'  ? 'background:#dcfce7;color:#15803d;border:1px solid #86efac;' :
              currentStatus === 'Overdue'                                  ? 'background:#fee2e2;color:#dc2626;border:1px solid #fca5a5;' :
              currentStatus === 'In Progress'                              ? 'background:#dbeafe;color:#1d4ed8;border:1px solid #93c5fd;' :
              currentStatus === 'Sent for Closure'                         ? 'background:#dcfce7;color:#15803d;border:1px solid #86efac;' :
              currentStatus === 'Clarification Req'                        ? 'background:#fef9c3;color:#b45309;border:1px solid #fde68a;' :
              currentStatus === 'Sent for Clarification'                   ? 'background:#e0f2fe;color:#0369a1;border:1px solid #93c5fd;' :
              currentStatus === 'Unassigned'                               ? 'background:#f1f5f9;color:#64748b;border:1px solid #e2e8f0;' :
                                                                             'background:#f1f5f9;color:#475569;border:1px solid #e2e8f0;';

            const withWhom =
              state === 'sent_for_closure' || state === 'clarification_requested'
                ? `<span style="font-size:11px;font-weight:700;color:#b45309;">📥 CO</span>`
              : state === 'closed'
                ? `<span style="font-size:11px;font-weight:700;color:#15803d;">✅ Done</span>`
              : state === 'clarification_sent'
                ? `<span style="font-size:11px;font-weight:700;color:#0369a1;">👤 Assignee</span>`
              : !t.assignee || t.assignee === 'Unassigned'
                ? `<span style="font-size:11px;color:#94a3b8;">— Unassigned</span>`
                : `<span style="font-size:11px;font-weight:700;color:#475569;">👤 ${(function(){ var a = t.assignee; if (!a) return '—'; if (typeof a === 'string') return a; if (typeof a === 'object') return Object.values(a).filter(Boolean).join(', '); return '—'; })()}</span>`;

            return `
            <tr>
              <td>
                <span onclick="openTaskDetail('${t.id}')"
                  style="cursor:pointer;font-family:monospace;font-size:11px;font-weight:700;
                  color:#4338ca;background:#eef2ff;padding:2px 8px;border-radius:4px;
                  text-decoration:underline dotted;">
                  ${t.obligationId || t.id}
                </span>
              </td>
              <td style="max-width:200px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis"
                  title="${t.title}">${t.title}</td>
              <td><span class="task-dept-chip">${t.department}</span></td>
              <td>${fmtDueDateColored(t.dueDate)}</td>
              <td>${statusBadge(t)}</td>
              <td>${withWhom}</td>
              <td>
                <button onclick="openTaskDetail('${t.id}')"
                  style="padding:4px 12px;background:#6366f1;color:#fff;border:none;
                  border-radius:6px;font-size:11px;font-weight:700;cursor:pointer;">
                  View →
                </button>
              </td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>
    </div>
  </div>`;
}

function buildTrackingSummaryCards(tasks) {
  const total         = tasks.length;
  const assigned      = tasks.filter(t => t.status === 'Assigned' && !t._workflowState).length;
  const inProgress    = tasks.filter(t => t.status === 'In Progress').length;
  const overdue       = tasks.filter(t => t.status === 'Overdue').length;
  const complete      = tasks.filter(t => t.status === 'Complete' || t.status === 'Closed' || t._workflowState === 'closed').length;
  const withCO        = tasks.filter(t => t._workflowState === 'sent_for_closure' || t._workflowState === 'clarification_requested').length;
  const sentClosure   = tasks.filter(t => t._workflowState === 'sent_for_closure').length;
  const clarReq       = tasks.filter(t => t._workflowState === 'clarification_requested').length;
  const clarSent      = tasks.filter(t => t._workflowState === 'clarification_sent').length;

  const card = (icon, label, value, bg, color, border, filterVal) =>
    `<div onclick="miQuickFilter('${filterVal}')"
      style="flex:1;min-width:110px;background:${bg};border:1.5px solid ${border};
      border-radius:12px;padding:13px 15px;cursor:pointer;"
      onmouseover="this.style.boxShadow='0 4px 14px rgba(0,0,0,.09)'"
      onmouseout="this.style.boxShadow='none'">
      <div style="font-size:16px;margin-bottom:3px;">${icon}</div>
      <div style="font-size:20px;font-weight:800;color:${color};line-height:1;">${value || 9} </div>
      <div style="font-size:11px;font-weight:600;color:#64748b;margin-top:3px;">${label}</div>
    </div>`;

  return `
  
  <div style="font-size:10px;font-weight:800;color:#94a3b8;text-transform:uppercase;letter-spacing:.07em;margin-bottom:6px;">Action Queue</div>
  <div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:14px;">
    ${card('📥','With CO',         withCO,      '#fef9c3','#b45309','#fde68a','')}
    ${card('✅','Sent for Closure', sentClosure, '#dcfce7','#15803d','#86efac','')}
    ${card('💬','Clarif. Requested',clarReq,    '#fef9c3','#b45309','#fde68a','')}
    ${card('📨','Clarif. Sent',     clarSent,   '#e0f2fe','#0369a1','#93c5fd','')}
  </div>`;
}

window.miQuickFilter = function(val) {
  taskFilters.status = val === 'dueSoon' ? '' : val;
  const sel = document.getElementById('task-filter-status');
  if (sel) sel.value = taskFilters.status;
  if (window._coTrackingMode) renderTrackingTasks();
  else renderTasks();
};