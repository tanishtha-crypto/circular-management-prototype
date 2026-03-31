/**
 * app.js — CMS Circular Management System
 * Main application controller: routing, navigation, global modals.
 * Must be loaded LAST (after all other modules).
 */

(function () {
  'use strict';

  /* ================================================================
     ROUTER — Maps page IDs to render functions
     ================================================================ */
  const ROUTES = {
    'dashboard': () => { setTitle('Dashboard'); renderDashboard(); },
    'ai-engine': () => { setTitle('AI Engine'); renderAIEngine('applicability'); },
    'ai-overview': () => { setTitle('AI Engine'); renderAIEngine('overview'); },
    'ai-applicability': () => { setTitle('AI Engine'); renderAIEngine('applicability'); },
    'ai-summary': () => { setTitle('AI Engine'); renderAIEngine('summary'); },
    'ai-clause': () => { setTitle('AI Engine'); renderAIEngine('clause'); },
    'ai-evidence': () => { setTitle('AI Engine'); renderAIEngine('evidence'); },
    'ai-suggestion': () => { setTitle('AI Suggestion'); renderAISuggestionPage(); },
    'circular-library': () => { setTitle('Circular Library'); renderCircularLibrary(); },
    'drafts-circular-library': () => { setTitle('Draft Circular Library'); renderMyDraftsPage(); },
    'my-items-obligations': () => { setTitle('My Items - Obligations'); renderMyItemsObligations(); },
    'my-items-activity': () => { setTitle('My Items - Activity'); renderMyItemsActivity(); },
    'assign-activity': () => { setTitle('Assign Activity'); renderAssignActivity(); },
    'assign-obligation': () => { setTitle('Assign Obligation'); renderAssignObligation(); },
    'assign-activity-obligation': () => { setTitle('Assign Obligation'); renderAssignActivityObligation(); },
    //  'assign-activity':() => { setTitle('Assign Action'); renderAssignActions(); },
'circular-explorer': () => {
  setTitle('Circular Hierarchy');
  document.getElementById('content-area').innerHTML = '<div id="circular-explorer"></div>';
  CircularExplorer.init({ containerId: 'circular-explorer' });
},
    'flagged-evidence': () => { setTitle('Missing / Inaccurate Evidence'); renderFlaggedEvidence(); },
    'reports': () => { setTitle('Reports'); renderReports(); },
    'settings': () => { setTitle('Settings'); renderSettings(); }
  };

  let currentPage = 'dashboard';

  /* ================================================================
     NAVIGATION
     ================================================================ */
  function navigateTo(page, params) {
    if (!ROUTES[page]) { console.warn('Unknown page:', page); return; }

    currentPage = page;

    // Sidebar active state
    updateSidebarActive(page);

    // Route with params
    if (page === 'circular-library' && params) {
      setTitle('Circular Library');
      renderCircularLibrary(params);
    } else {
      ROUTES[page]();
    }

    // Scroll content to top
    const content = document.getElementById('content-area');
    if (content) content.scrollTop = 0;
  }

  function setTitle(title) {
    const el = document.getElementById('page-title');
    if (el) el.textContent = title;
  }

  /* ================================================================
     SIDEBAR NAVIGATION LISTENERS
     ================================================================ */
  function initSidebar() {
    const navItems = document.querySelectorAll('#nav-menu .nav-item');

    navItems.forEach(item => {
      const page = item.dataset.page;
      if (!page) return;

      if (item.classList.contains('has-submenu')) {
        // Submenu toggle
        const link = item.querySelector('.nav-link');
        if (link) {
          link.addEventListener('click', (e) => {
            e.preventDefault();
            item.classList.toggle('open');
            const submenu = item.querySelector('.submenu');
            if (submenu) submenu.classList.toggle('open');
          });
        }
        // Submenu item clicks
        item.querySelectorAll('.submenu li').forEach(subItem => {
          const subPage = subItem.dataset.page;
          if (!subPage) return;
          subItem.querySelector('a').addEventListener('click', (e) => {
            e.preventDefault();
            navigateTo(subPage);
            // Mark sub item active
            item.querySelectorAll('.submenu li').forEach(s => s.classList.remove('active'));
            subItem.classList.add('active');
          });
        });
      } else {
        // Regular nav item
        const link = item.querySelector('.nav-link');
        if (link) {
          link.addEventListener('click', (e) => {
            e.preventDefault();
            navigateTo(page);
          });
        }
      }
    });
  }

  function updateSidebarActive(page) {
    // Remove all active states
    document.querySelectorAll('#nav-menu .nav-item').forEach(item => {
      item.classList.remove('active');
    });
    document.querySelectorAll('#nav-menu .submenu li').forEach(li => {
      li.classList.remove('active');
    });

    // AI sub-pages
    const aiSubPages = ['ai-applicability', 'ai-summary', 'ai-clause', 'ai-evidence'];
    if (aiSubPages.includes(page)) {
      const aiParent = document.querySelector('.nav-item.has-submenu');
      if (aiParent) {
        aiParent.classList.add('active');
        // Open submenu
        aiParent.classList.add('open');
        const submenu = aiParent.querySelector('.submenu');
        if (submenu) submenu.classList.add('open');
        // Highlight sub item
        const subItem = aiParent.querySelector(`.submenu li[data-page="${page}"]`);
        if (subItem) subItem.classList.add('active');
      }
    } else {
      const item = document.querySelector(`.nav-item[data-page="${page}"]`);
      if (item) item.classList.add('active');
    }
  }

  /* ================================================================
     GLOBAL AI SEARCH MODAL
     ================================================================ */
  function initSearchModal() {
    const openBtn = document.getElementById('global-search-btn');
    const closeBtn = document.getElementById('close-search-modal');
    const modal = document.getElementById('search-modal');
    const input = document.getElementById('ai-search-input');
    const body = document.getElementById('search-modal-body');

    if (!openBtn || !modal) return;

    openBtn.addEventListener('click', () => {
      modal.classList.remove('hidden');
      setTimeout(() => input && input.focus(), 100);
    });

    closeBtn && closeBtn.addEventListener('click', () => modal.classList.add('hidden'));
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.add('hidden'); });

    // Keyboard shortcut Cmd/Ctrl + K
    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        modal.classList.toggle('hidden');
        if (!modal.classList.contains('hidden')) setTimeout(() => input && input.focus(), 100);
      }
      if (e.key === 'Escape') modal.classList.add('hidden');
    });

    // Search on Enter
    input && input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && input.value.trim()) runAISearch(input.value.trim());
    });

    // Suggestion chips
    document.querySelectorAll('.suggestion-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const q = chip.dataset.q;
        if (input) { input.value = q; }
        runAISearch(q);
      });
    });
  }

  function runAISearch(query) {
    const body = document.getElementById('search-modal-body');
    if (!body) return;

    body.innerHTML = `
      <div class="ai-loading">
        <div class="spinner"></div>
        <div class="ai-loading-text">AI is searching across all circulars...</div>
      </div>`;

    setTimeout(() => {
      const lq = query.toLowerCase();
      let response = null;

      // Match against keyword categories
      for (const [key, data] of Object.entries(CMS_DATA.aiSearchResponses)) {
        if (key === 'default') continue;
        if (data.query_match && data.query_match.some(kw => lq.includes(kw))) {
          response = data;
          break;
        }
      }
      if (!response) response = CMS_DATA.aiSearchResponses.default;

      body.innerHTML = `
        <div style="margin-bottom:14px">
          <div style="font-size:12px;color:var(--text-muted);margin-bottom:4px">AI Results for: <strong>"${query}"</strong></div>
          <div style="font-size:11px;color:var(--text-muted)">${response.results.length} circular(s) matched</div>
        </div>
        ${response.results.map(r => `
          <div class="search-result-item">
            <div class="sri-header">
              <span class="sri-id" onclick="openFromSearch('${r.circularId}')">${r.circularId}</span>
              <span class="sri-score">▲ ${r.confidence}% confidence</span>
            </div>
            <div style="font-size:12.5px;font-weight:600;margin-bottom:4px">${r.title}</div>
            <div class="sri-clause">Clause: ${r.clauseRef}</div>
            <div class="sri-desc">${r.explanation}</div>
            <button class="btn btn-outline btn-sm" style="margin-top:8px" 
                    onclick="openFromSearch('${r.circularId}')">
              View Circular →
            </button>
          </div>
        `).join('')}
      `;
    }, 1500);
  }

  window.openFromSearch = function (circId) {
    document.getElementById('search-modal').classList.add('hidden');
    navigateTo('circular-library', circId);
  };

  /* ================================================================
     NOTIFICATION PANEL
     ================================================================ */
  function initNotifications() {
    const btn = document.getElementById('notif-btn');
    const panel = document.getElementById('notif-panel');
    const close = document.getElementById('close-notif');
    const list = document.getElementById('notif-list');

    if (!btn || !panel) return;

    // Render notifications
    list.innerHTML = CMS_DATA.notifications.map(n => `
      <div class="notif-item">
        <div class="notif-item-title">${n.title}</div>
        <div class="notif-item-desc">${n.desc}</div>
        <div class="notif-item-time">${n.time}</div>
      </div>
    `).join('');

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      panel.classList.toggle('hidden');
    });
    close && close.addEventListener('click', () => panel.classList.add('hidden'));
    document.addEventListener('click', (e) => {
      if (!panel.contains(e.target) && e.target !== btn) {
        panel.classList.add('hidden');
      }
    });
  }

  /* ================================================================
     PROFILE DROPDOWN
     ================================================================ */
  function initProfileDropdown() {
    const btn = document.getElementById('profile-btn');
    const dropdown = document.getElementById('profile-dropdown');
    if (!btn || !dropdown) return;

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
      if (!dropdown.contains(e.target) && e.target !== btn) {
        dropdown.classList.remove('open');
      }
    });
  }

  /* ================================================================
     GENERIC MODAL CLOSE
     ================================================================ */
  function initGenericModal() {
    const modal = document.getElementById('generic-modal');
    const closeBtn = document.getElementById('close-generic-modal');
    if (!modal) return;

    closeBtn && closeBtn.addEventListener('click', () => modal.classList.add('hidden'));
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.add('hidden'); });
  }

  /* ================================================================
     REPORTS PAGE
     ================================================================ */
  window.renderReports = function () {
    const area = document.getElementById('content-area');
    const reports = [
      { icon: '📊', title: 'Compliance Summary', desc: 'Overall compliance status across all circulars' },
      { icon: '📋', title: 'Task Status Report', desc: 'Breakdown of tasks by status and department' },
      { icon: '⚠️', title: 'Risk Heat Map', desc: 'High-risk obligations requiring immediate attention' },
      { icon: '📅', title: 'Deadline Tracker', desc: 'Upcoming and overdue compliance deadlines' },
      { icon: '🔍', title: 'Audit Trail', desc: 'Complete log of compliance activities and updates' },
      { icon: '📈', title: 'Trend Analysis', desc: 'Compliance improvement trends over time' }
    ];

    area.innerHTML = `
    <div class="fade-in">
      <div class="section-title"><span class="dot"></span> Available Reports</div>
      <div class="report-cards">
        ${reports.map(r => `
          <div class="report-card" onclick="showToastGlobal('Report generation coming soon: ${r.title}')">
            <div class="report-card-icon">${r.icon}</div>
            <div class="report-card-title">${r.title}</div>
            <div class="report-card-desc">${r.desc}</div>
            <button class="btn btn-outline btn-sm" style="margin-top:14px">Generate</button>
          </div>
        `).join('')}
      </div>
    </div>`;
  };

  /* ================================================================
     SETTINGS PAGE
     ================================================================ */
  window.renderSettings = function () {
    const area = document.getElementById('content-area');
    area.innerHTML = `
    <div class="fade-in">
      <div class="settings-section">
        <div class="settings-section-title">General Settings</div>
        ${buildSettingRow('Email Notifications', 'Receive compliance alerts via email', true)}
        ${buildSettingRow('Dashboard Auto-Refresh', 'Refresh dashboard data every 5 minutes', true)}
        ${buildSettingRow('Dark Mode', 'Enable dark theme (coming soon)', false)}
      </div>
      <div class="settings-section">
        <div class="settings-section-title">AI Engine Settings</div>
        ${buildSettingRow('Auto Applicability Analysis', 'Run AI analysis on newly added circulars', true)}
        ${buildSettingRow('Evidence Auto-Evaluation', 'Automatically evaluate uploaded evidence', false)}
        ${buildSettingRow('AI Confidence Threshold', 'Show results below 60% confidence', false)}
      </div>
      <div class="settings-section">
        <div class="settings-section-title">Notification Preferences</div>
        ${buildSettingRow('Overdue Task Alerts', 'Alert when tasks become overdue', true)}
        ${buildSettingRow('New Circular Notifications', 'Notify on new regulatory circulars', true)}
        ${buildSettingRow('Weekly Digest', 'Receive a weekly compliance summary email', false)}
      </div>
      <div class="settings-section">
        <div class="settings-section-title">Organisation</div>
        <div class="form-group">
          <label class="form-label">Organisation Name</label>
          <input type="text" class="form-control" value="Acme Financial Services Ltd." style="max-width:400px"/>
        </div>
        <div class="form-group">
          <label class="form-label">Primary Regulator</label>
          <select class="form-control" style="max-width:400px">
            <option selected>RBI</option><option>SEBI</option><option>IRDAI</option><option>MeitY</option>
          </select>
        </div>
        <button class="btn btn-primary btn-sm" onclick="showToastGlobal('Settings saved successfully!')">Save Changes</button>
      </div>
    </div>`;
  };

  function buildSettingRow(label, desc, checked) {
    return `
    <div class="setting-row">
      <div class="setting-info">
        <div class="setting-label">${label}</div>
        <div class="setting-desc">${desc}</div>
      </div>
      <label class="toggle-switch">
        <input type="checkbox" ${checked ? 'checked' : ''}/>
        <span class="toggle-slider"></span>
      </label>
    </div>`;
  }

  /* ================================================================
     GLOBAL TOAST HELPER (accessible globally)
     ================================================================ */
  window.showToastGlobal = function (msg, type) {
    const colors = { success: '#10b981', warning: '#f59e0b', info: '#4f7cff' };
    const t = document.createElement('div');
    t.textContent = msg;
    t.style.cssText = `
      position:fixed;bottom:24px;right:24px;z-index:9999;
      background:${colors[type] || '#4f7cff'};color:#fff;
      padding:10px 18px;border-radius:8px;font-size:13px;font-weight:600;
      box-shadow:0 4px 16px rgba(0,0,0,.2);animation:fadeIn 0.3s ease;max-width:380px;
    `;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 2500);
  };

  /* ================================================================
     EXPOSE CMS NAMESPACE
     ================================================================ */
  window.CMS = { navigateTo };

  /* ================================================================
     BOOT
     ================================================================ */
  function boot() {
    initSidebar();
    initSearchModal();
    initNotifications();
    initProfileDropdown();
    initGenericModal();
    initSidebarCollapse();

    // Load initial page
    navigateTo('dashboard');
  }

  function initSidebarCollapse() {
    const btn = document.getElementById('sidebar-toggle');
    const sidebar = document.getElementById('sidebar');
    const wrapper = document.getElementById('main-wrapper');
    if (!btn || !sidebar) return;
    btn.addEventListener('click', () => {
      const collapsed = sidebar.classList.toggle('collapsed');
      btn.textContent = collapsed ? '›' : '‹';
      btn.title = collapsed ? 'Expand sidebar' : 'Collapse sidebar';
      if (wrapper) wrapper.style.marginLeft = collapsed ? '60px' : '';
    });
  }

  // Run after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

})();