// 

/**
 * dashboard.js — CMS Circular Management System
 * CHANGES v3:
 *  ✓ 5 metric cards only (Total, Active, Open Actionables, Overdue, Completion Rate)
 *  ✓ REMOVED: Compliance Trend line chart
 *  ✓ REMOVED: Recent Activity feed
 *  ✓ Circulars section → Today's Circulars only (due/effective today)
 *  ✓ Calendar → overdue days red, open-task days amber; click → show items with status badge
 *  ✓ Dummy data baked in — works without data.js
 */

let pieChart = null, barChart = null;

/* ═══════════════════════════════════════════════════════════════
   DUMMY DATA  (fallback when CMS_DATA not available)
   ═══════════════════════════════════════════════════════════════ */

const TODAY = '2026-03-06';

const DUMMY_DATA = {
  circulars: [

    {
      id: "CIRC-2026-001",
      title: "Housing Finance",
      regulator: "RBI",
      risk: "High",
      status: "Active",
      complianceScore: 72,
      effectiveDate: "2026-03-06"
    },

    {
      id: "CIRC-2026-002",
      title: "Master Circular – Housing Finance ",
      regulator: "RBI",
      risk: "High",
      status: "Active",
      complianceScore: 64,
      effectiveDate: "2026-03-07"
    },

    {
      id: "CIRC-2026-003",
      title: "Master Circular - Bank Finance to Non-Banking Financial Companies (NBFCs)",
      regulator: "SEBI",
      risk: "Medium",
      status: "Active",
      complianceScore: 88,
      effectiveDate: "2026-03-10"
    },

    {
      id: "CIRC-2026-004",
      title: "AML Transaction Monitoring Rules",
      regulator: "RBI",
      risk: "High",
      status: "Active",
      complianceScore: 59,
      effectiveDate: "2026-03-12"
    },

    {
      id: "CIRC-2026-005",
      title: "Operational Risk Reporting Format",
      regulator: "RBI",
      risk: "Low",
      status: "Closed",
      complianceScore: 92,
      effectiveDate: "2026-03-15"
    },

    {
      id: "CIRC-2026-006",
      title: "IT Governance for NBFCs",
      regulator: "RBI",
      risk: "Medium",
      status: "Active",
      complianceScore: 81,
      effectiveDate: "2026-03-18"
    },

    {
      id: "CIRC-2026-007",
      title: "Digital Lending Transparency",
      regulator: "RBI",
      risk: "High",
      status: "Active",
      complianceScore: 67,
      effectiveDate: "2026-03-21"
    },

    {
      id: "CIRC-2026-008",
      title: "Market Abuse Prevention Framework",
      regulator: "SEBI",
      risk: "Medium",
      status: "Active",
      complianceScore: 79,
      effectiveDate: "2026-03-24"
    },

    {
      id: "CIRC-2026-009",
      title: "Customer Data Protection Standards",
      regulator: "RBI",
      risk: "High",
      status: "Active",
      complianceScore: 73,
      effectiveDate: "2026-03-27"
    },

    {
      id: "CIRC-2026-010",
      title: "Liquidity Risk Stress Testing",
      regulator: "RBI",
      risk: "Medium",
      status: "Active",
      complianceScore: 85,
      effectiveDate: "2026-03-30"
    }

  ],

  tasks: [
    { id:'T-001', department:'IT', status:'Open' },
    { id:'T-002', department:'IT', status:'Overdue' },
    { id:'T-003', department:'Risk', status:'Complete' },
    { id:'T-004', department:'Compliance', status:'In Progress' },
    { id:'T-005', department:'Finance', status:'Open' },
    { id:'T-006', department:'Operations', status:'NA' },
    { id:'T-007', department:'HR', status:'Open' },
    { id:'T-008', department:'Procurement', status:'Overdue' }
  ]
};
function DATA() {
  return (typeof CMS_DATA !== 'undefined') ? CMS_DATA : DUMMY_DATA;
}

/* ═══════════════════════════════════════════════════════════════
   ENTRY POINT
   ═══════════════════════════════════════════════════════════════ */
function renderDashboard() {
  const area = document.getElementById('content-area');
  area.innerHTML = buildDashboardHTML();
  initMetricCards();
  initCharts();
  renderTodaysCirculars(null);
  renderCalendar();
  renderAlertBanner();
  showCalEvents(TODAY);
}

/* ═══════════════════════════════════════════════════════════════
   METRICS — 5 cards
   ═══════════════════════════════════════════════════════════════ */
function getMetrics() {
  const { tasks, circulars } = DATA();
  const completed     = tasks.filter(t => t.status === 'Complete').length;
  const completionPct = Math.round((completed / tasks.length) * 100);
  return [
    { filter:'total',      icon:'◫', accent:'#3b82f6', label:'Total Circulars',
      value: circulars.length,
      sub: `${circulars.filter(c=>c.type==='Master').length} master · ${circulars.filter(c=>c.type==='Regular').length} regular`,
      trend:'↑ +2 this month', trendUp:true },
    // { filter:'active',     icon:'◉', accent:'#10b981', label:'Active Circulars',
    //   value: circulars.filter(c=>c.status==='Active').length,
    //   sub:'Currently monitored', trend:'✓ All tracked', trendUp:true },
    { filter:'open',       icon:'⊡', accent:'#f59e0b', label:'Open Actionables',
      value: tasks.filter(t=>t.status==='Open').length,
      sub:`${tasks.filter(t=>t.status==='In Progress').length} in progress`,
      trend:'↑ Needs attention', trendUp:false },
    { filter:'overdue',    icon:'⚠', accent:'#ef4444', label:'Overdue Actions',
      value: tasks.filter(t=>t.status==='Overdue').length,
      sub:'Past due date — act now', trend:'↑ Immediate action', trendUp:false },
    { filter:'completion', icon:'◎', accent:'#0ea5e9', label:'Completion Rate',
      value: completionPct+'%',
      sub:`${completed} of ${tasks.length} tasks done`,
      trend:'↑ +8% vs last month', trendUp:true }
  ];
}

/* =========================
   DUMMY REGULATORY EVENTS
========================= */



/* ═══════════════════════════════════════════════════════════════
   BUILD HTML
   ═══════════════════════════════════════════════════════════════ */
function buildDashboardHTML() {
  const cards = getMetrics().map((d,i) => `
    <div class="metric-card-v2" data-filter="${d.filter}"
         style="--mc2-accent:${d.accent};animation-delay:${i*60}ms">
      <div class="mc2-shine"></div>
      <div class="mc2-top">
        <div class="mc2-icon-wrap"><span class="mc2-icon">${d.icon}</span></div>
        <div class="mc2-trend ${d.trendUp?'trend-up':'trend-dn'}">${d.trend}</div>
      </div>
      <div class="mc2-value">${d.value}</div>
      <div class="mc2-label">${d.label}</div>
      <div class="mc2-sub">${d.sub}</div>
    </div>`).join('');

  return `
  <div class="fade-in">
    <div id="alert-banner"></div>

    <!-- ── 5 METRIC CARDS ── -->
    <div class="db-section-header">
      <div class="db-section-title">Overview</div>
      <div class="db-section-meta" id="filter-label">All data · Updated just now</div>
    </div>
    <div class="metrics-grid-v2" id="metrics-grid">${cards}</div>

    <!-- ── MAIN GRID ── -->
    <div class="db-main-grid">

      <!-- LEFT col -->
      <div class="db-left-col">
        <div class="db-section-header">
          <div class="db-section-title">Analytics</div>
        </div>

        <!-- Two charts — NO compliance trend line chart -->
        <div class="charts-grid-v2" style="margin-bottom:24px">
          <div class="chart-card-v2">
            <div class="chart-card-label">Task Distribution</div>
            <div style="height:186px;position:relative"><canvas id="pie-chart"></canvas></div>
          </div>
          <div class="chart-card-v2">
            <div class="chart-card-label">Department Workload</div>
            <div style="height:186px;position:relative"><canvas id="bar-chart"></canvas></div>
          </div>
        </div>

        <!-- TODAY'S CIRCULARS — not the full list -->
        <div class="db-section-header">
          <div class="db-section-title">
            Today's Circulars
            <span id="today-date-badge"
                  style="font-size:12px;font-weight:400;color:var(--text-muted);margin-left:8px"></span>
          </div>
          <span id="today-circ-meta" class="text-xs text-muted"></span>
        </div>
        <div class="table-card" style="margin-bottom:24px">
          <div class="table-wrapper">
            <table>
              <thead><tr>
                <th>ID</th><th>Title</th><th>Regulator</th>
                <th>Event</th><th>Status</th><th>Risk</th><th>Compliance</th>
              </tr></thead>
              <tbody id="today-circulars-body"></tbody>
            </table>
          </div>
        </div>
      </div><!-- /db-left-col -->

      <!-- RIGHT col — calendar only, NO activity feed -->
      <div class="db-right-col">
        <div class="db-section-header">
          <div class="db-section-title">Regulatory Calendar</div>
          <button class="db-nav-btn" id="cal-today-btn">Today</button>
        </div>
        <div class="calendar-widget">
          <div class="cal-header">
            <button class="cal-nav" id="cal-prev">‹</button>
            <span class="cal-month-label" id="cal-month-label"></span>
            <button class="cal-nav" id="cal-next">›</button>
          </div>
          <div class="cal-weekdays">
            <span>Su</span><span>Mo</span><span>Tu</span>
            <span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
          </div>
          <div class="cal-days" id="cal-days"></div>
          <div class="cal-legend">
            <span class="cal-dot overdue"></span><span>Overdue</span>
            <span class="cal-dot open-task"></span><span>Open Task</span>
            <span class="cal-dot deadline"></span><span>Due</span>
            <span class="cal-dot effective"></span><span>Effective</span>
          </div>
          
        </div>
      </div><!-- /db-right-col -->

    </div><!-- /db-main-grid -->
  </div>`;
}

/* ═══════════════════════════════════════════════════════════════
   ALERT BANNER
   ═══════════════════════════════════════════════════════════════ */
function renderAlertBanner() {
  const banner = document.getElementById('alert-banner');
  if (!banner) return;
  const { tasks, circulars } = DATA();
  const overdue  = tasks.filter(t => t.status === 'Overdue');
  const highOpen = tasks.filter(t => t.risk === 'High' && t.status === 'Open');
  const nearDue  = circulars.filter(c => { const d = getDaysLeft(c.dueDate); return d >= 0 && d <= 14 && c.status === 'Active'; });
  if (!overdue.length && !highOpen.length && !nearDue.length) { banner.innerHTML = ''; return; }
  const pills = [];
  if (overdue.length)  pills.push(`<span class="alert-pill danger">🔴 ${overdue.length} Overdue Task${overdue.length>1?'s':''}: ${overdue.map(t=>t.id).join(', ')}</span>`);
  if (highOpen.length) pills.push(`<span class="alert-pill warning">⚠ ${highOpen.length} High-Risk Open Actionable${highOpen.length>1?'s':''}</span>`);
  if (nearDue.length)  pills.push(`<span class="alert-pill info">📅 ${nearDue.length} Deadline${nearDue.length>1?'s':''} within 14 days</span>`);
  banner.innerHTML = `
    <div class="alert-banner-strip">
      <span class="alert-banner-icon">📢</span>
      <div class="alert-banner-pills">${pills.join('')}</div>
      <button class="alert-banner-close" onclick="this.closest('.alert-banner-strip').remove()">✕</button>
    </div>`;
}

/* ═══════════════════════════════════════════════════════════════
   METRIC CARD CLICKS → filter today's circulars table
   ═══════════════════════════════════════════════════════════════ */
let activeFilter = null;

function initMetricCards() {
  document.querySelectorAll('.metric-card-v2').forEach(card => {
    card.addEventListener('click', () => {
      const f = card.dataset.filter;
      if (activeFilter === f) {
        activeFilter = null;
        document.querySelectorAll('.metric-card-v2').forEach(c => c.classList.remove('selected'));
        renderTodaysCirculars(null);
        document.getElementById('filter-label').textContent = 'All data · Updated just now';
      } else {
        activeFilter = f;
        document.querySelectorAll('.metric-card-v2').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        renderTodaysCirculars(f);
        document.getElementById('filter-label').textContent =
          `Filtered: ${card.querySelector('.mc2-label').textContent}`;
      }
    });
  });
}

/* ═══════════════════════════════════════════════════════════════
   TODAY'S CIRCULARS TABLE
   Shows only circulars whose dueDate OR effectiveDate = today.
   Fallback: if none today → next 5 upcoming sorted by dueDate.
   Metric-card filter further narrows the result.
   ═══════════════════════════════════════════════════════════════ */
function renderTodaysCirculars(filter) {
  const tbody  = document.getElementById('today-circulars-body');
  const metaEl = document.getElementById('today-circ-meta');
  const dateEl = document.getElementById('today-date-badge');
  console.log("body",tbody)
  if (!tbody) return;

  const { circulars, tasks } = DATA();
  const todayStr = new Date().toISOString().slice(0, 10);
  if (dateEl) dateEl.textContent = formatDate(todayStr);

  /* open/overdue task count per circular */
  const taskCount = {};
  tasks.forEach(t => {
    if (t.status === 'Open' || t.status === 'In Progress' || t.status === 'Overdue') {
      taskCount[t.circularId] = (taskCount[t.circularId] || 0) + 1;
    }
  });

  /* find today's circulars */
  let rows = [];
  circulars.forEach(c => {
    const tags = [];
    if (c.dueDate       && c.dueDate.slice(0,10)       === todayStr) tags.push({ label:'Due Today',       cls:'badge-due-today' });
    if (c.effectiveDate && c.effectiveDate.slice(0,10) === todayStr) tags.push({ label:'Effective Today', cls:'badge-effective' });
    if (tags.length) rows.push({ c, tags });
  });

  /* fallback: nothing today → show next 5 upcoming */
  let isFallback = false;
  if (!rows.length) {
    isFallback = true;
    rows = circulars
      .filter(c => c.status === 'Active' && getDaysLeft(c.dueDate) >= 0)
      .sort((a,b) => new Date(a.dueDate) - new Date(b.dueDate))
      .slice(0, 5)
      .map(c => ({ c, tags:[{ label:`Due in ${getDaysLeft(c.dueDate)}d`, cls:'badge-upcoming' }] }));
  }

  /* apply metric card filter */
  if (filter === 'active') {
    rows = rows.filter(r => r.c.status === 'Active');
  } else if (filter === 'overdue') {
    const ids = new Set(tasks.filter(t => t.status === 'Overdue').map(t => t.circularId));
    rows = rows.filter(r => ids.has(r.c.id));
  } else if (filter === 'open') {
    const ids = new Set(tasks.filter(t => t.status === 'Open' || t.status === 'In Progress').map(t => t.circularId));
    rows = rows.filter(r => ids.has(r.c.id));
  }
  /* 'total' and 'completion' show all rows — no extra filter */

  if (metaEl) metaEl.textContent = isFallback
    ? `No circulars today — showing next ${rows.length} upcoming`
    : `${rows.length} circular${rows.length!==1?'s':''} due or effective today`;

  if (!rows.length) {
    tbody.innerHTML = `<tr><td colspan="7"
      style="text-align:center;color:var(--text-muted);padding:28px">
      No circulars match this filter.</td></tr>`;
    return;
  }

  tbody.innerHTML = rows.map(({ c, tags }) => {
    const sc   = c.complianceScore >= 80 ? '' : c.complianceScore >= 50 ? 'yellow' : 'red';
    const open = taskCount[c.id] || 0;
    const taskBadge = open
      ? `<span style="margin-left:5px;font-size:10px;padding:1px 6px;
           background:#fef3c7;color:#92400e;border-radius:4px;font-weight:700">
           ${open} Effective ${open>1?'s':''}</span>` : '';
    const tagBadges = tags.map(t =>
      `<span class="db-event-tag ${t.cls}">${t.label}</span>`).join(' ');

    return `
      <tr class="clickable"
          onclick="window.CMS && window.CMS.navigateTo('circular-library','${c.id}')">
        <td><span class="text-accent font-bold"
                  style="font-size:11px;font-family:monospace">${c.id}</span></td>
        <td style="max-width:200px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis"
            title="${c.title}">
          ${c.title}
          ${c.type==='Master'?`<span style="margin-left:4px;font-size:9px;padding:1px 5px;
            background:#ede9fe;color:#5b21b6;border-radius:3px;font-weight:700">M</span>`:''}
          ${taskBadge}
        </td>
        <td><span style="font-size:11px;font-weight:600">${c.regulator}</span></td>
        <td style="white-space:nowrap">${tagBadges}</td>
        <td><span class="badge-status badge-${c.status.toLowerCase()}">${c.status}</span></td>
        <td><span class="risk-badge risk-${c.risk.toLowerCase()}">${c.risk}</span></td>
        <td>
          <div style="display:flex;align-items:center;gap:6px">
            <div class="compliance-bar-bg" style="width:56px;flex-shrink:0">
              <div class="compliance-bar-fill ${sc}" style="width:${c.complianceScore}%"></div>
            </div>
            <span class="text-xs font-bold">${c.complianceScore}%</span>
          </div>
        </td>
      </tr>`;
  }).join('');
}

/* ═══════════════════════════════════════════════════════════════
   REGULATORY CALENDAR
   – overdue task dates  → red highlight (cal-hl-overdue)
   – open/in-progress   → amber highlight (cal-hl-open)
   – circular due/eff   → dot indicator + has-events class
   – click a date       → shows all items with status badge
   ═══════════════════════════════════════════════════════════════ */
let calDate = new Date();

function renderCalendar() {
  renderCalendarMonth();
  document.getElementById('cal-prev').addEventListener('click', () => {
    calDate.setMonth(calDate.getMonth() - 1); renderCalendarMonth();
  });
  document.getElementById('cal-next').addEventListener('click', () => {
    calDate.setMonth(calDate.getMonth() + 1); renderCalendarMonth();
  });
  document.getElementById('cal-today-btn').addEventListener('click', () => {
    calDate = new Date();
    renderCalendarMonth();
    setTimeout(() => showCalEvents(new Date().toISOString().slice(0,10)), 50);
  });
   setTimeout(() => showCalEvents(new Date().toISOString().slice(0,10)), 50);
}

function buildCalEvents(){
  const events = {};

  DUMMY_DATA.circulars.forEach(c => {
    const d = c.effectiveDate;
    if(!d) return;

    const key = d.slice(0,10);

    if(!events[key]) events[key] = [];

    events[key].push({
      type:'effective',
      id:c.id,
      label:`${c.id} — ${c.title}`,
      risk:c.risk,
      status:c.status
    });
  });
  console.log("Ecvev",events)
  return events;
}

function renderCalendarMonth() {
  const label = document.getElementById('cal-month-label');
  const grid  = document.getElementById('cal-days');
  if (!label || !grid) return;

  const year  = calDate.getFullYear();
  const month = calDate.getMonth();
  const today = new Date();
  const ev    = buildCalEvents();
  console.log("EV",ev)

  label.textContent = calDate.toLocaleDateString('en-IN', { month:'long', year:'numeric' });

  const firstDay    = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month+1, 0).getDate();
  let html = '';
  for (let i = 0; i < firstDay; i++) html += '<span class="cal-day empty"></span>';

  for (let d = 1; d <= daysInMonth; d++) {
    const dk = `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const isToday = d === today.getDate() && month === today.getMonth() && year === today.getFullYear();
    const de = ev[dk] || [];

    const hasOverdue  = de.some(e => e.type === 'overdue');
    const hasOpen     = de.some(e => e.type === 'open-task');
    const hasDeadline = de.some(e => e.type === 'deadline');
    const hasEff      = de.some(e => e.type === 'effective');

    /* visual highlight priority: overdue > open > any event */
    const hlClass = hasOverdue ? 'cal-hl-overdue'
                  : hasOpen    ? 'cal-hl-open'
                  : de.length  ? 'has-events'
                  : '';

    const dots = [
      hasOverdue  ? '<span class="cal-day-dot overdue"></span>'   : '',
      hasOpen     ? '<span class="cal-day-dot open-task"></span>' : '',
      hasDeadline ? '<span class="cal-day-dot deadline"></span>'  : '',
      hasEff      ? '<span class="cal-day-dot effective"></span>' : '',
    ].filter(Boolean).join('');

    html += `
      <span class="cal-day ${isToday?'today':''} ${hlClass}"
            data-date="${dk}" onclick="showCalEvents('${dk}')">
        ${d}
        ${dots ? `<span class="cal-dots">${dots}</span>` : ''}
      </span>`;
  }
  grid.innerHTML = html;
}

function showCalEvents(dateKey) {

  const { circulars, tasks } = DATA();
  const tbody  = document.getElementById('today-circulars-body');
  const metaEl = document.getElementById('today-circ-meta');
  const dateEl = document.getElementById('today-date-badge');

  if (!tbody) return;

  if (dateEl) dateEl.textContent = formatDate(dateKey);

  const allEvents = buildCalEvents();
console.log("ALL EVENTS", allEvents);

const ev = allEvents[dateKey] || [];
console.log("EV show cal", ev);
  document.querySelectorAll('.cal-day').forEach(d => d.classList.remove('cal-selected'));
  const sel = document.querySelector(`.cal-day[data-date="${dateKey}"]`);
  if (sel) sel.classList.add('cal-selected');

  if (!ev.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align:center;padding:28px;color:var(--text-muted)">
          No circular events on ${formatDate(dateKey)}
        </td>
      </tr>`;
    return;
  }

  /* map events to circular rows */
 const rows = [];

ev.forEach(e => {

  let circ = circulars.find(c => c.id === e.id);

  if (!circ) {
    circ = circulars.find(c => c.id === e.circularId);
  }

  if (circ) {
    rows.push(circ);   // push circular directly
  }

});


  tbody.innerHTML = rows.map(c => {

    const sc = c.complianceScore >= 80 ? '' :
               c.complianceScore >= 50 ? 'yellow' : 'red';

    return `
      <tr class="clickable"
        onclick="window.CMS && window.CMS.navigateTo('circular-library','${c.id}')">

        <td>
          <span class="text-accent font-bold"
            style="font-size:11px;font-family:monospace">
            ${c.id}
          </span>
        </td>

        <td style="max-width:200px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
          ${c.title}
        </td>

        <td>
          <span style="font-size:11px;font-weight:600">
            ${c.regulator}
          </span>
        </td>

        <td>
          ${formatDate(dateKey)}
        </td>

        <td>
          <span class="badge-status badge-${c.status.toLowerCase()}">
            ${c.status}
          </span>
        </td>

        <td>
          <span class="risk-badge risk-${c.risk.toLowerCase()}">
            ${c.risk}
          </span>
        </td>

        <td>
          <div style="display:flex;align-items:center;gap:6px">
            <div class="compliance-bar-bg" style="width:56px">
              <div class="compliance-bar-fill ${sc}" style="width:${c.complianceScore}%"></div>
            </div>
            <span class="text-xs font-bold">${c.complianceScore}%</span>
          </div>
        </td>

      </tr>`;
  }).join('');

  if (metaEl) {
    metaEl.textContent =
      `${rows.length} circular event${rows.length !== 1 ? 's' : ''} on ${formatDate(dateKey)}`;
  }
}

// function showCalEvents(dateKey) {
//   const list = document.getElementById('cal-event-list');
//   const ev   = buildCalEvents()[dateKey] || [];

//   document.querySelectorAll('.cal-day').forEach(d => d.classList.remove('cal-selected'));
//   const sel = document.querySelector(`.cal-day[data-date="${dateKey}"]`);
//   if (sel) sel.classList.add('cal-selected');

//   if (!ev.length) {
//     list.innerHTML = `<div class="cal-event-placeholder">No events on ${formatDate(dateKey)}</div>`;
//     return;
//   }

//   const statusStyle = {
//     'Overdue':     'background:#fee2e2;color:#991b1b',
//     'Open':        'background:#fef3c7;color:#92400e',
//     'In Progress': 'background:#e0f2fe;color:#0369a1',
//     'Complete':    'background:#dcfce7;color:#166534',
//     'Active':      'background:#dcfce7;color:#166534',
//     'Closed':      'background:#f3f4f6;color:#6b7280',
//   };
//   const typeMeta = {
//     'overdue':   { icon:'🔴', label:'Overdue Task'       },
//     'open-task': { icon:'🟡', label:'Open Task'          },
//     'deadline':  { icon:'📅', label:'Circular Due'       },
//     'effective': { icon:'✅', label:'Circular Effective' },
//   };

//   list.innerHTML = `
//     <div style="font-size:12px;font-weight:700;color:var(--text-muted);
//                 padding:8px 12px 6px;border-bottom:1px solid var(--border)">
//       ${formatDate(dateKey)} &nbsp;·&nbsp; ${ev.length} item${ev.length!==1?'s':''}
//     </div>
//     ${ev.map(e => {
//       const tm = typeMeta[e.type] || { icon:'●', label:e.type };
//       const ss = statusStyle[e.status] || 'background:#f3f4f6;color:#374151';
//       return `
//         <div class="cal-event-item ${e.type}"
//              onclick="window.CMS && window.CMS.navigateTo('circular-library','${e.id}')"
//              style="display:flex;align-items:flex-start;gap:10px;padding:10px 12px;
//                     border-bottom:1px solid var(--border-light);cursor:pointer"
//              onmouseover="this.style.background='#f8fafc'"
//              onmouseout="this.style.background=''">
//           <span style="font-size:15px;margin-top:1px">${tm.icon}</span>
//           <div style="flex:1;min-width:0">
//             <div style="font-size:10px;font-weight:700;color:var(--text-muted);
//                         text-transform:uppercase;letter-spacing:.05em;margin-bottom:2px">
//               ${tm.label} · ${e.source}
//             </div>
//             <div style="font-size:12px;font-weight:600;white-space:nowrap;
//                         overflow:hidden;text-overflow:ellipsis" title="${e.label}">
//               ${e.label}
//             </div>
//             <div style="display:flex;align-items:center;gap:6px;margin-top:5px;flex-wrap:wrap">
//               <span style="font-size:10px;font-weight:700;padding:2px 7px;border-radius:4px;${ss}">
//                 ${e.status}
//               </span>
//               ${e.risk       ? `<span style="font-size:10px;color:var(--text-muted)">${e.risk} risk</span>`:''}
//               ${e.regulator  ? `<span style="font-size:10px;color:var(--text-muted)">${e.regulator}</span>`:''}
//               ${e.assignee   ? `<span style="font-size:10px;color:var(--text-muted)">👤 ${e.assignee}</span>`:''}
//               ${e.department ? `<span style="font-size:10px;color:var(--text-muted)">🏢 ${e.department}</span>`:''}
//             </div>
//           </div>
//         </div>`;
//     }).join('')}`;
// }

/* ═══════════════════════════════════════════════════════════════
   CHARTS  (pie + bar only — line/trend chart removed entirely)
   ═══════════════════════════════════════════════════════════════ */
function initCharts() {
  destroyCharts();
  renderPieChart();
  renderBarChart();
}

function destroyCharts() {
  if (pieChart) { pieChart.destroy(); pieChart = null; }
  if (barChart) { barChart.destroy(); barChart = null; }
}

function renderPieChart() {
  const ctx = document.getElementById('pie-chart');
  if (!ctx) return;
  const { tasks } = DATA();
  pieChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Open','In Progress','Complete','Overdue'],
      datasets: [{
        data: [
          tasks.filter(t=>t.status==='Open').length,
          tasks.filter(t=>t.status==='In Progress').length,
          tasks.filter(t=>t.status==='Complete').length,
          tasks.filter(t=>t.status==='Overdue').length,
        ],
        backgroundColor: ['#f59e0b','#6366f1','#10b981','#ef4444'],
        borderWidth: 3, borderColor: '#fff', hoverOffset: 8
      }]
    },
    options: {
      responsive:true, maintainAspectRatio:false, cutout:'68%',
      plugins:{ legend:{ position:'bottom', labels:{ font:{size:10}, boxWidth:10, padding:8 } } }
    }
  });
}

// aggregate tasks by department and status for workload chart
function getDepartmentWorkload() {
  const { tasks } = DATA();
  const stats = {};
  const statuses = ['Open','In Progress','Complete','Overdue','NA'];
  tasks.forEach(t => {
    const dept = t.department || 'NA';
    if (!stats[dept]) stats[dept] = { Open:0, 'In Progress':0, Complete:0, Overdue:0, NA:0 };
    const st = statuses.includes(t.status) ? t.status : 'NA';
    stats[dept][st] = (stats[dept][st] || 0) + 1;
  });
  const labels = Object.keys(stats);
  // build datasets per status for stacked bar
  const datasets = statuses.map((st, idx) => ({
    label: st,
    data: labels.map(d => stats[d][st] || 0),
    backgroundColor: ['#f59e0b','#6366f1','#10b981','#ef4444','#9ca3af'][idx],
    stack: 'Stack 0'
  }));
  return { labels, datasets, stats, statuses };
}

function renderBarChart() {
  const ctx = document.getElementById('bar-chart');
  if (!ctx) return;
  const workload = getDepartmentWorkload();
  barChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: workload.labels,
      datasets: workload.datasets
    },
    options: {
      responsive:true, maintainAspectRatio:false,
      plugins:{
        legend:{ position:'bottom', labels:{boxWidth:10,font:{size:10}} },
        tooltip:{ mode:'index', intersect:false }
      },
      scales:{
        x:{ stacked:true, grid:{ display:false }, ticks:{ font:{size:9} } },
        y:{ stacked:true, beginAtZero:true, grid:{ color:'#f3f4f6' }, ticks:{ stepSize:1, font:{size:9} } }
      },
      onClick(evt, elements) {
        if (!elements.length) return;
        const el = elements[0];
        const dept = this.data.labels[el.index];
        showDeptPopover(dept, workload.stats[dept], evt);
      }
    }
  });
}

// simple popover showing detailed counts and heatmap
function showDeptPopover(dept, counts, evt) {
  // remove existing popover
  const existing = document.getElementById('dept-popover');
  if (existing) existing.remove();
  const pop = document.createElement('div');
  pop.id = 'dept-popover';
  pop.style.position = 'absolute';
  pop.style.zIndex = 9999;
  pop.style.background = '#fff';
  pop.style.border = '1px solid #ccc';
  pop.style.borderRadius = '6px';
  pop.style.padding = '12px';
  pop.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
  pop.style.minWidth = '180px';
  pop.innerHTML = `<strong>${dept} workload</strong><br>`;
  const statusOrder = ['Open','In Progress','Complete','Overdue','NA'];
  statusOrder.forEach(s => {
    pop.innerHTML += `<div style="margin:4px 0">${s}: ${counts[s] || 0}</div>`;
  });
  // heatmap table
  pop.innerHTML += '<div style="margin-top:8px;font-size:12px">Heat map</div>';
  const totalMax = Math.max(...statusOrder.map(s=>counts[s]||0),1);
  const heatTable = document.createElement('table');
  heatTable.style.borderCollapse = 'collapse';
  const row = heatTable.insertRow();
  statusOrder.forEach(s => {
    const cell = row.insertCell();
    const val = counts[s] || 0;
    const pct = Math.round((val/totalMax)*100);
    cell.textContent = val;
    cell.style.padding = '4px 6px';
    cell.style.background = `hsl(200, ${pct}%, ${100 - pct/2}%)`;
    cell.style.color = pct>50?'#000':'#000';
  });
  pop.appendChild(heatTable);

  document.body.appendChild(pop);
  // position near click
  const rect = evt.chart.canvas.getBoundingClientRect();
  pop.style.left = rect.left + evt.x + 'px';
  pop.style.top  = rect.top  + evt.y + 'px';
}


/* ═══════════════════════════════════════════════════════════════
   EXTRA INLINE STYLES (injected once at load)
   ═══════════════════════════════════════════════════════════════ */
(function injectStyles() {
  if (document.getElementById('_db-extra')) return;
  const s = document.createElement('style');
  s.id = '_db-extra';
  s.textContent = `
    /* Calendar: overdue day highlight */
    .cal-day.cal-hl-overdue {
      background: #fee2e2 !important;
      border: 1.5px solid #ef4444 !important;
      font-weight: 700;
      color: #991b1b;
    }
    /* Calendar: open task day highlight */
    .cal-day.cal-hl-open {
      background: #fef9c3 !important;
      border: 1.5px solid #f59e0b !important;
    }
    /* Orange dot for open tasks */
    .cal-day-dot.open-task { background: #f59e0b; }

    /* Calendar event list left-border by type */
    .cal-event-item.overdue   { border-left: 3px solid #ef4444; }
    .cal-event-item.open-task { border-left: 3px solid #f59e0b; }
    .cal-event-item.deadline  { border-left: 3px solid #6366f1; }
    .cal-event-item.effective { border-left: 3px solid #10b981; }

    /* Today's circulars event tag badges */
    .db-event-tag {
      display: inline-block;
      font-size: 10px; font-weight: 700;
      padding: 2px 7px; border-radius: 4px;
      white-space: nowrap; margin-right: 2px;
    }
    .db-event-tag.badge-due-today { background: #ede9fe; color: #5b21b6; }
    .db-event-tag.badge-effective { background: #dcfce7; color: #166534; }
    .db-event-tag.badge-upcoming  { background: #e0f2fe; color: #0369a1; }

    /* popover for department workload */
    #dept-popover { font-size:13px; }
    #dept-popover table { margin-top:4px; }
    #dept-popover td { text-align:center; border:1px solid #e5e7eb; }
  `;
  document.head.appendChild(s);
})();

/* ═══════════════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════════════ */
function formatDate(ds) {
  if (!ds) return '—';
  return new Date(ds).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' });
}
function getDaysLeft(ds) {
  if (!ds) return 999;
  return Math.ceil((new Date(ds) - new Date()) / 86400000);
}

// hide popover when clicking outside
document.addEventListener('click', e => {
  const pop = document.getElementById('dept-popover');
  if (pop && !pop.contains(e.target)) pop.remove();
});

window.showCalEvents = showCalEvents;
console.log("D",DATA());