window._savedFlow    = window._savedFlow    || {};
window._draftStore   = window._draftStore   || {};
window._mappedClauses= window._mappedClauses|| {};
window._mappedObligs = window._mappedObligs || {};

function _seedSavedFlow(circ) {
  if (!circ || window._savedFlow[circ.id]) return;
  var id = circ.id;
  window._savedFlow[id] = {
    circularId: id,
    overview: { ...circ },
    applicability: {
      applicable: true, verdict: 'Applicable',
      entityType: 'NBFC', scope: 'Full — All parameters',
      deadline: circ.deadline || '2025-03-31',
      owner: 'Chief Compliance Officer',
      notes: 'Applies to all NBFCs with asset size above ₹500 Cr. Full compliance required across all departments.',
      threshold: 'Asset size ≥ ₹500 Cr; Deposit-taking NBFCs; All licensed payment aggregators',
      requirements: [
        'Board-approved compliance policy within 30 days',
        'Designated Compliance Officer with Board reporting',
        'Monthly regulatory reporting by 7th of each month',
        'Real-time transaction monitoring system',
        'Annual third-party compliance audit',
      ],
      entities: [
        { name:'Head Office',       type:'Primary',   applicable:true  },
        { name:'Branch Operations', type:'Secondary', applicable:true  },
        { name:'Treasury',          type:'Secondary', applicable:false },
        { name:'IT Division',       type:'Support',   applicable:true  },
      ],
      requirementsApplicability: [
        { requirement:'Board-approved Compliance Policy',       applicable:true,  threshold:'All regulated entities',         status:'In Progress' },
        { requirement:'Designated Compliance Officer',          applicable:true,  threshold:'Asset size ≥ ₹500 Cr',          status:'Pending'     },
        { requirement:'Monthly Regulatory Reporting',           applicable:true,  threshold:'All licensed NBFCs',             status:'Compliant'   },
        { requirement:'Real-time Transaction Monitoring',       applicable:true,  threshold:'Turnover > ₹100 Cr',            status:'Pending'     },
        { requirement:'Annual Third-party Compliance Audit',    applicable:true,  threshold:'All regulated entities',         status:'Compliant'   },
        { requirement:'Customer Grievance Redressal Framework', applicable:false, threshold:'Deposit-taking entities only',   status:'Exempt'      },
      ],
    },
    summary: {
      audience:'Senior Management', depth:'Detailed',
      purpose:'This circular issued by ' + (circ.regulator||'the Regulator') + ' mandates enhanced compliance requirements for regulated entities. The directive addresses critical governance gaps identified during supervisory reviews and introduces structured obligations across operational, technological, and reporting domains.',
      keyUpdates:[
        'Enhanced KYC/AML requirements with stricter verification timelines',
        'Mandatory Board-level compliance committee with quarterly reporting',
        'Real-time transaction monitoring system implementation required',
        'New customer grievance redressal framework within 30 days',
        'Annual third-party audit of compliance infrastructure mandated',
      ],
      risks:[
        { level:'High',   text:'Penalty up to ₹10 Cr for non-submission of reports' },
        { level:'High',   text:'License revocation risk for repeated non-compliance' },
        { level:'Medium', text:'Reputational risk if customer-facing changes delayed' },
        { level:'Low',    text:'Minor operational disruption during system migration' },
      ],
      immediateActions:[
        'Appoint designated Compliance Officer within 15 days',
        'Update all customer-facing policies and disclosures',
        'Submit initial compliance status report to regulator',
        'Conduct all-staff awareness training within 60 days',
      ],
      orgImpact:{
        departments:4, headcount:120, systems:3, budget:'₹45L',
        description:'Impacts Compliance, IT, Operations and Legal departments. Requires system upgrades, policy redrafts, and dedicated compliance headcount addition.',
      },
      technical:[
        'Transaction monitoring system upgrade to real-time processing',
        'API integration with regulatory reporting portal',
        'Data encryption upgrade for customer PII fields',
        'Audit trail logging enabled across all core banking modules',
        'Access control matrix revamp for compliance-sensitive functions',
      ],
    },
    clauses: circ.chapters && circ.chapters.length ? circ.chapters : _buildDemoClauses(),
  };
}

function _buildDemoClauses() {
  return [
    { title:'Governance & Policy', clauses:[
      { id:'1.1', text:'The entity shall maintain a Board-approved compliance policy covering all aspects of this circular, reviewed annually.', risk:'High',   department:'Compliance', status:'Pending',     obligation:'Maintain and review Board-approved compliance policy', actionable:'Draft policy;Present to Board;Distribute to departments;Schedule annual review' },
      { id:'1.2', text:'A designated Compliance Officer shall be appointed with direct reporting to the Board Audit Committee.',               risk:'High',   department:'Legal',      status:'In Progress', obligation:'Appoint Compliance Officer with Board reporting line',    actionable:'Identify candidate;Issue appointment letter;Notify regulator;Define mandate' },
      { id:'1.3', text:'Compliance Committee meetings shall be held at least quarterly with minutes submitted to the regulator.',              risk:'Medium', department:'Compliance', status:'Pending',     obligation:'Conduct quarterly Compliance Committee meetings',         actionable:'Schedule meetings;Prepare agenda;Record minutes;Submit to regulator' },
    ]},
    { title:'Operational Requirements', clauses:[
      { id:'2.1', text:'All customer-facing processes must be updated to reflect new regulatory requirements within 30 days of the effective date.', risk:'High',   department:'Operations', status:'Pending',     obligation:'Update customer-facing processes within 30 days',      actionable:'Map all affected processes;Update SOPs;Train frontline staff;Test updated workflows' },
      { id:'2.2', text:'Transaction monitoring systems shall be upgraded to detect and report suspicious activity in real-time.',                    risk:'High',   department:'IT',         status:'In Progress', obligation:'Upgrade transaction monitoring to real-time detection', actionable:'Assess current system gaps;Procure upgraded solution;UAT testing;Go-live sign-off' },
    ]},
    { title:'Reporting & Disclosure', clauses:[
      { id:'3.1', text:'Monthly compliance status reports shall be submitted to the regulator in the prescribed format by the 7th of each month.', risk:'High',   department:'Compliance', status:'Pending',     obligation:'Submit monthly compliance reports by 7th of each month', actionable:'Build reporting template;Establish data pipeline;Implement maker-checker;Set deadline alerts' },
      { id:'3.2', text:'Annual third-party audit of the compliance infrastructure must be completed and findings submitted to the Board.',          risk:'Medium', department:'Legal',      status:'Pending',     obligation:'Commission annual third-party compliance audit',          actionable:'Identify audit firm;Define audit scope;Facilitate audit process;Present findings to Board' },
    ]},
  ];
}

/* ================================================================ MAIN RENDER */
function renderAISuggestionPage(circId) {
  var area = document.getElementById('content-area');
  if (!area) return;
  if (!CMS_DATA || !CMS_DATA.circulars || !CMS_DATA.circulars.length) {
    area.innerHTML = '<div style="padding:40px;text-align:center;color:#9499aa;">No Circular Data Available</div>';
    return;
  }
  injectDraftReviewCSS();

  /* ── If no circular selected, show the My Library listing ── */
  if (!circId) {
    _mlRenderLibrary();
    return;
  }

  area.innerHTML =
    '<div class="dr-page">' +
    '<div class="dr-page-head">' +
      '<div>' +
        '<div class="dr-page-title">Compliance Draft Review</div>' +
        '<div class="dr-page-sub">Review and edit saved AI Engine output &middot; Tag &middot; Map &middot; Assign &middot; Publish</div>' +
      '</div>' +
      '<div class="dr-head-actions">' +
        '<button class="dr-btn dr-btn-sec" onclick="saveDraftReview()">&#x1F4BE; Save Draft</button>' +
        '<button class="dr-btn dr-btn-pri" onclick="publishToLibrary()">&#x1F4DA; Add to Central Library</button>' +
      '</div>' +
    '</div>' +
    '<div class="dr-picker-card">' +
      '<div class="dr-picker-icon">&#x1F4CB;</div>' +
      '<div class="dr-picker-inner">' +
        '<div class="dr-picker-label">Select Circular to Review</div>' +
        '<div class="dr-custom-select-wrap" id="dr-csel-wrap">' +
          '<button class="dr-custom-select-btn" id="dr-csel-btn">' +
            '<span id="dr-csel-text" class="dr-csel-placeholder">Choose a circular\u2026</span>' +
            '<span class="dr-csel-arrow">&#9662;</span>' +
          '</button>' +
          '<div class="dr-custom-dropdown" id="dr-csel-dropdown" style="display:none;">' +
            '<div class="dr-csel-search-wrap"><input class="dr-csel-search" id="dr-csel-search" placeholder="Search\u2026" autocomplete="off"/></div>' +
            '<div class="dr-csel-list" id="dr-csel-list">' +
              CMS_DATA.circulars.map(function(c) {
                var riskCls = c.risk ? ' dr-csel-risk-' + c.risk.toLowerCase() : '';
                return '<div class="dr-csel-item" data-id="' + c.id + '">' +
                  '<div class="dr-csel-item-top">' +
                    '<span class="dr-csel-item-id">' + c.id + '</span>' +
                    (c.risk ? '<span class="dr-csel-risk' + riskCls + '">' + c.risk + '</span>' : '') +
                    '<span class="dr-csel-reg">' + (c.regulator||'') + '</span>' +
                  '</div>' +
                  '<div class="dr-csel-item-title">' + c.title + '</div>' +
                '</div>';
              }).join('') +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div id="dr-status-badge" class="dr-status-badge" style="display:none;"></div>' +
    '</div>' +
    '<div id="dr-body" style="display:none;">' +
      '<div class="dr-stepper" id="dr-stepper">' +
        ['Overview','Applicability','Executive Summary','Clause Generation'].map(function(s,i) {
          return '<button class="dr-step-btn' + (i===0?' active':'') + '" data-step="' + i + '">' +
            '<span class="dr-step-num">' + (i+1) + '</span>' +
            '<span class="dr-step-label">' + s + '</span>' +
          '</button>' + (i<3?'<div class="dr-step-line"></div>':'');
        }).join('') +
      '</div>' +
      '<div id="dr-panel-area"></div>' +
    '</div>' +
    '</div>';

  _initCustomSelect(circId);
}

function _initCustomSelect(circId) {
  var btn      = document.getElementById('dr-csel-btn');
  var dropdown = document.getElementById('dr-csel-dropdown');
  var search   = document.getElementById('dr-csel-search');
  var list     = document.getElementById('dr-csel-list');
  var text     = document.getElementById('dr-csel-text');
  var selected = null;

  /* ── shared selection logic (called by click AND auto-select) ── */
  function _selectCirc(item) {
    selected = item.dataset.id;
    var circ = CMS_DATA.circulars.find(function(c) { return c.id === selected; });
    if (!circ) return;
    text.textContent = circ.id + ' \u2014 ' + circ.title;
    text.classList.remove('dr-csel-placeholder');
    dropdown.style.display = 'none';
    _seedSavedFlow(circ);
    document.getElementById('dr-body').style.display = 'block';
    _drRenderStep(0, circ.id);
    _drUpdateBadge(circ.id);
    list.querySelectorAll('.dr-csel-item').forEach(function(i) { i.classList.remove('selected'); });
    item.classList.add('selected');
  }

  if (btn) btn.addEventListener('click', function(e) {
    e.stopPropagation();
    var open = dropdown.style.display !== 'none';
    dropdown.style.display = open ? 'none' : 'block';
    if (!open && search) search.focus();
  });

  document.addEventListener('click', function(e) {
    var wrap = document.getElementById('dr-csel-wrap');
    if (wrap && !wrap.contains(e.target) && dropdown) dropdown.style.display = 'none';
  });

  if (search) search.addEventListener('input', function() {
    var q = search.value.toLowerCase();
    if (list) list.querySelectorAll('.dr-csel-item').forEach(function(item) {
      item.style.display = item.textContent.toLowerCase().includes(q) ? 'block' : 'none';
    });
  });

  if (list) list.querySelectorAll('.dr-csel-item').forEach(function(item) {
    item.addEventListener('click', function() { _selectCirc(item); });
  });

  document.addEventListener('click', function(e) {
    var stepBtn = e.target.closest('.dr-step-btn');
    if (!stepBtn || !selected) return;
    document.querySelectorAll('.dr-step-btn').forEach(function(b) { b.classList.remove('active'); });
    stepBtn.classList.add('active');
    _drRenderStep(parseInt(stepBtn.dataset.step), selected);
  });

  /* ── AUTO-SELECT: runs AFTER all listeners are bound ── */
  if (circId && list) {
    var autoItem = list.querySelector('.dr-csel-item[data-id="' + circId + '"]');
    if (autoItem) _selectCirc(autoItem);
  }
}

/* ================================================================
   MY LIBRARY — listing view (table + hierarchical)
   ================================================================ */

/* ── Persistent filter state across view switches ── */
window._mlFilters    = { circ: '', dept: '', status: '', from: '', to: '', search: '' };
window._mlActiveView = 'table';

function _mlRenderLibrary() {
  var area = document.getElementById('content-area');
  if (!area) return;
  _aaInjectStyles();   /* pull in aa- CSS vars & classes */

  /* reset filters each time the library page is freshly opened */
  window._mlFilters    = { circ: '', dept: '', status: '', from: '', to: '', search: '' };
  window._mlActiveView = 'table';

  area.innerHTML =
    '<div class="dr-page">' +
      '<div class="dr-page-head">' +
        '<div>' +
          '<div class="dr-page-title">My Library</div>' +
          '<div class="dr-page-sub">Your saved and reviewed circulars</div>' +
        '</div>' +
        '<div class="dr-head-actions">' +
          '<div class="ml-seg-ctrl" id="ml-seg">' +
            '<button class="ml-seg-btn active" data-view="table">&#8801;&nbsp; Table View</button>' +
            '<button class="ml-seg-btn" data-view="hierarchical">&#8862;&nbsp; Hierarchical View</button>' +
'<button class="ml-seg-btn" data-view="chapter">&#9776;&nbsp; Chapter View</button>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div id="ml-view-area"></div>' +
    '</div>';

  _mlShowTableView();
  _mlBindSegToggle();
}

/* ── Segmented toggle ── */
function _mlBindSegToggle() {
  var seg = document.getElementById('ml-seg');
  if (!seg) return;
  seg.querySelectorAll('.ml-seg-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      seg.querySelectorAll('.ml-seg-btn').forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
      if (btn.dataset.view === 'table') {
        _mlShowTableView();
      } else if (btn.dataset.view === 'hierarchical') {
        _mlShowHierarchicalView();
      } else {
        _mlShowChapterView();
      }
    });
  });
}

/* ── Helpers shared by both views ── */
function _mlGetAllDepts() {
  var d = [];
  CMS_DATA.circulars.forEach(function(c) {
    (c.departments||[]).forEach(function(dep) { if (d.indexOf(dep) < 0) d.push(dep); });
  });
  return d.sort();
}

function _mlGetFilteredCircs() {
  var f = window._mlFilters;
  return CMS_DATA.circulars.filter(function(c) {
    if (f.circ   && c.id !== f.circ) return false;
    if (f.dept   && !(c.departments||[]).includes(f.dept)) return false;
    if (f.status && (c.libraryStatus||'Reviewed & Applicable') !== f.status) return false;
    if (f.from   && c.issuedDate && c.issuedDate < f.from) return false;
    if (f.to     && c.issuedDate && c.issuedDate > f.to) return false;
    if (f.search) {
      var q = f.search.toLowerCase();
      if (!((c.id||'').toLowerCase().includes(q) ||
            (c.title||'').toLowerCase().includes(q) ||
            (c.regulator||'').toLowerCase().includes(q))) return false;
    }
    return true;
  });
}

function _mlBuildFilterBar() {
  var f      = window._mlFilters;
  var circs  = CMS_DATA.circulars;
  var depts  = _mlGetAllDepts();
  var activeCirc = circs.find(function(c) { return c.id === f.circ; }) || null;

  var total      = circs.length;
  var assigned   = circs.filter(function(c) { return (c.libraryStatus||'Reviewed & Applicable') === 'Assigned'; }).length;
  var unassigned = total - assigned;

  return (
    '<div class="aa-filter-card" id="ml-flt-card">' +
      '<div class="aa-fc-field">' +
        '<span class="aa-fc-label">Circular</span>' +
        '<div class="aa-custom-sel-wrap" id="ml-csel-wrap">' +
          '<button class="aa-custom-sel-btn" id="ml-csel-btn">' +
            (activeCirc
              ? '<span class="aa-csel-id">' + activeCirc.id + '</span>' +
                '<span class="aa-csel-title">' + activeCirc.title.substring(0,30) + (activeCirc.title.length > 30 ? '\u2026' : '') + '</span>'
              : '<span class="aa-csel-title" style="color:var(--aa-text-mut);">All Circulars</span>') +
            '<span class="aa-csel-arr">&#9662;</span>' +
          '</button>' +
          '<div class="aa-csel-drop" id="ml-csel-drop" style="display:none;">' +
            '<input class="aa-csel-search" id="ml-csel-search" placeholder="Search\u2026" autocomplete="off"/>' +
            '<div class="aa-csel-list" id="ml-csel-list">' +
              '<div class="aa-csel-item' + (!f.circ ? ' active' : '') + '" data-id="">' +
                '<span class="aa-csel-item-title" style="color:var(--aa-text-mut);">All Circulars</span>' +
              '</div>' +
              circs.map(function(c) {
                return '<div class="aa-csel-item' + (c.id === f.circ ? ' active' : '') + '" data-id="' + c.id + '">' +
                  '<span class="aa-csel-item-id">' + c.id + '</span>' +
                  '<span class="aa-csel-item-title">' + c.title + '</span>' +
                '</div>';
              }).join('') +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="aa-fc-field">' +
        '<span class="aa-fc-label">Department</span>' +
        '<select class="aa-flt-sel" id="ml-flt-dept">' +
          '<option value="">All Departments</option>' +
          depts.map(function(d) { return '<option' + (d === f.dept ? ' selected' : '') + '>' + d + '</option>'; }).join('') +
        '</select>' +
      '</div>' +
      '<div class="aa-fc-field">' +
        '<span class="aa-fc-label">Status</span>' +
        '<select class="aa-flt-sel" id="ml-flt-status">' +
          '<option value="">All Statuses</option>' +
          '<option' + (f.status === 'Reviewed & Applicable' ? ' selected' : '') + '>Reviewed &amp; Applicable</option>' +
          '<option' + (f.status === 'Assigned' ? ' selected' : '') + '>Assigned</option>' +
        '</select>' +
      '</div>' +
      '<div class="aa-fc-field">' +
        '<span class="aa-fc-label">From Date</span>' +
        '<input type="date" class="aa-flt-date" id="ml-flt-from" value="' + (f.from||'') + '"/>' +
      '</div>' +
      '<div class="aa-fc-field">' +
        '<span class="aa-fc-label">To Date</span>' +
        '<input type="date" class="aa-flt-date" id="ml-flt-to" value="' + (f.to||'') + '"/>' +
      '</div>' +
      '<div class="aa-fc-field aa-fc-search">' +
        '<span class="aa-fc-label">Search</span>' +
        '<input class="aa-search-inp" id="ml-flt-search" placeholder="Search activities, obligations\u2026" value="' + (f.search||'') + '"/>' +
      '</div>' +
      '<div class="aa-stats-row">' +
        '<div class="aa-stat-pill" id="ml-sp-total">'      + total      + ' total</div>' +
        '<div class="aa-stat-pill aa-sp-amber" id="ml-sp-unassigned">' + unassigned + ' unassigned</div>' +
        '<div class="aa-stat-pill aa-sp-green"  id="ml-sp-assigned">'  + assigned   + ' assigned</div>' +
      '</div>' +
    '</div>'
  );
}

function _mlBindFilterBar() {
  /* ── Circular custom dropdown ── */
  var cselBtn    = document.getElementById('ml-csel-btn');
  var cselDrop   = document.getElementById('ml-csel-drop');
  var cselSearch = document.getElementById('ml-csel-search');
  var cselList   = document.getElementById('ml-csel-list');

  if (cselBtn && cselDrop) {
    cselBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      cselDrop.style.display = cselDrop.style.display === 'none' ? 'block' : 'none';
      if (cselDrop.style.display !== 'none' && cselSearch) cselSearch.focus();
    });
    /* close on outside click */
    function _mlCselOutside(e) {
      var wrap = document.getElementById('ml-csel-wrap');
      if (!wrap || !wrap.contains(e.target)) {
        cselDrop.style.display = 'none';
        document.removeEventListener('click', _mlCselOutside);
      }
    }
    document.addEventListener('click', _mlCselOutside);
  }

  if (cselSearch && cselList) {
    cselSearch.addEventListener('input', function() {
      var q = cselSearch.value.toLowerCase();
      cselList.querySelectorAll('.aa-csel-item').forEach(function(item) {
        item.style.display = item.textContent.toLowerCase().includes(q) ? '' : 'none';
      });
    });
  }

  if (cselList) {
    cselList.querySelectorAll('.aa-csel-item').forEach(function(item) {
      item.addEventListener('click', function() {
        window._mlFilters.circ = item.dataset.id || '';
        if (cselDrop) cselDrop.style.display = 'none';
        _mlApplyAllFilters();
      });
    });
  }

  /* ── Standard filter controls ── */
  var deptSel   = document.getElementById('ml-flt-dept');
  var statusSel = document.getElementById('ml-flt-status');
  var fromInp   = document.getElementById('ml-flt-from');
  var toInp     = document.getElementById('ml-flt-to');
  var searchInp = document.getElementById('ml-flt-search');

  if (deptSel)   deptSel.addEventListener('change', _mlApplyAllFilters);
  if (statusSel) statusSel.addEventListener('change', _mlApplyAllFilters);
  if (fromInp)   fromInp.addEventListener('change', _mlApplyAllFilters);
  if (toInp)     toInp.addEventListener('change', _mlApplyAllFilters);
  if (searchInp) searchInp.addEventListener('input', _mlApplyAllFilters);
}

function _mlApplyAllFilters() {
  /* Read current control values into filter state */
  var f = window._mlFilters;
  var deptSel   = document.getElementById('ml-flt-dept');
  var statusSel = document.getElementById('ml-flt-status');
  var fromInp   = document.getElementById('ml-flt-from');
  var toInp     = document.getElementById('ml-flt-to');
  var searchInp = document.getElementById('ml-flt-search');

  if (deptSel)   f.dept   = deptSel.value;
  if (statusSel) f.status = statusSel.value;
  if (fromInp)   f.from   = fromInp.value;
  if (toInp)     f.to     = toInp.value;
  if (searchInp) f.search = searchInp.value;

  var filtered   = _mlGetFilteredCircs();
  var total      = filtered.length;
  var assigned   = filtered.filter(function(c) { return (c.libraryStatus||'Reviewed & Applicable') === 'Assigned'; }).length;
  var unassigned = total - assigned;

  /* Update badge counts */
  var spTotal = document.getElementById('ml-sp-total');
  var spUn    = document.getElementById('ml-sp-unassigned');
  var spAss   = document.getElementById('ml-sp-assigned');
  if (spTotal) spTotal.textContent = total      + ' total';
  if (spUn)    spUn.textContent    = unassigned + ' unassigned';
  if (spAss)   spAss.textContent   = assigned   + ' assigned';

  /* Update circular dropdown label to reflect selection */
  var activeCirc = CMS_DATA.circulars.find(function(c) { return c.id === f.circ; }) || null;
  var cselBtn    = document.getElementById('ml-csel-btn');
  if (cselBtn) {
    cselBtn.innerHTML =
      (activeCirc
        ? '<span class="aa-csel-id">' + activeCirc.id + '</span>' +
          '<span class="aa-csel-title">' + activeCirc.title.substring(0,30) + (activeCirc.title.length > 30 ? '\u2026' : '') + '</span>'
        : '<span class="aa-csel-title" style="color:var(--aa-text-mut);">All Circulars</span>') +
      '<span class="aa-csel-arr">&#9662;</span>';
  }

  /* Re-render the appropriate content area */
  if (window._mlActiveView === 'table') {
    _mlRenderTable(filtered);
  } else if (window._mlActiveView === 'chapter') {
    _mlRenderChapterView(filtered);
  } else {
    _mlRenderHierCards(filtered);
  }
}



window._mlToggleRegDetails = function() {
  var el = document.getElementById('ml-reg-details');
  var btn = document.getElementById('ml-reg-toggle');
  if (!el) return;
  var open = el.style.display !== 'none';
  el.style.display = open ? 'none' : 'block';
  if (btn) btn.innerHTML = (open ? '&#x25B6;' : '&#x25BC;') + ' Regulatory Details';
};


window._drGoNext = function(currentStep) {
  var next = document.querySelector('[data-step="' + (currentStep+1) + '"]');
  if (next) next.click();
  var stepper = document.getElementById('dr-stepper');
  if (stepper) stepper.scrollIntoView({ behavior:'smooth', block:'nearest' });
};

window._DR_HISTORY = window._DR_HISTORY || {};
window._drCurrentCircId = null;

window._drRecordHistory = function(circId, panel, action, detail) {
  if (!circId) return;
  if (!window._DR_HISTORY[circId]) window._DR_HISTORY[circId] = {};
  if (!window._DR_HISTORY[circId][panel]) window._DR_HISTORY[circId][panel] = [];
  window._DR_HISTORY[circId][panel].push({ ts: new Date(), label: action, detail: detail || '' });
};

window._drGetHistory = function(panel) {
  var id = window._drCurrentCircId;
  return (id && window._DR_HISTORY[id] && window._DR_HISTORY[id][panel]) || [];
};

function _drRenderStep(step, circId) {
  var flow  = window._savedFlow[circId];
  var panel = document.getElementById('dr-panel-area');
  if (!flow || !panel) return;
  window._drCurrentCircId = circId;
  var fns = [_drPanelOverview, _drPanelApplicability, _drPanelSummary, _drPanelClauses];
  panel.innerHTML = fns[step] ? fns[step](flow, circId) : '';
  _drBindPanel(step, flow, circId);
}

/* ================================================================ PANEL 0 — OVERVIEW */
function _drPanelOverview(flow) {
  var c = flow.overview;
  if (!c) return _drNotSaved('Overview');
  var fields = [
    ['Circular ID', c.id],                          ['Regulator', c.regulator||'—'],
    ['Issue Date', c.issuedDate||c.date||'—'],       ['Effective Date', c.effectiveDate||'—'], ['Deadline', c.dueDate||'—'],
    ['Risk Level', c.risk||'—'],                     ['Type', c.type||'—'],
    ['Status', c.status||'—'],                       ['Department', c.departments||'—'],        ['__viewBtn__', ''],
  ];
  return (
    '<div class="dr-panel">' +
    '<div class="dr-panel-toolbar">' +
      '<div class="dr-panel-title-wrap"><span class="dr-panel-icon">&#x1F4CB;</span><span class="dr-panel-title">' + (c.title || 'Overview') + '</span></div>' +
      '<div class="dr-toolbar-actions">' +
        '<div class="dr-kebab-wrap">' +
          '<button class="dr-kebab-btn" onclick="event.stopPropagation();this.closest(\'.dr-kebab-wrap\').classList.toggle(\'open\')">&#x22EE;</button>' +
          '<div class="dr-kebab-menu">' +
            '<label class="dr-kebab-item"><input type="file" style="display:none;" accept=".pdf,.docx" onchange="this.closest(\'.dr-kebab-wrap\').classList.remove(\'open\')"/>&#x1F4C1;&nbsp; Upload Circular</label>' +
            '<button class="dr-kebab-item dr-tool-edit-toggle" data-target="dr-ov-edit" data-hide="dr-ov-details" onclick="this.closest(\'.dr-kebab-wrap\').classList.remove(\'open\')">&#x270E;&nbsp; Edit</button>' +
            '<button class="dr-kebab-item" onclick="this.closest(\'.dr-kebab-wrap\').classList.remove(\'open\');window._cmsShowHistoryModal(\'Overview History\', window._drGetHistory(\'Overview\'))">&#x1F551;&nbsp; History</button>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>' +
    '<div class="dr-edit-drawer" id="dr-ov-edit" style="display:none;">' +
      '<div class="dr-edit-grid">' +
        [['Circular ID',c.id],['Regulator',c.regulator||''],['Issue Date',c.issueDate||c.date||''],['Effective Date',c.effectiveDate||''],['Deadline',c.deadline||''],['Risk Level',c.risk||''],['Type',c.type||''],['Status',c.status||''],['Department',c.department||'']].map(function(f) { return '<div class="dr-edit-field"><label class="dr-edit-label">' + f[0] + '</label><input class="dr-edit-input" value="' + f[1] + '"/></div>'; }).join('') +
        '<div class="dr-edit-field dr-edit-field-full"><label class="dr-edit-label">Summary</label><textarea class="dr-edit-ta">' + (c.summary||'') + '</textarea></div>' +
        '<div class="dr-edit-field dr-edit-field-full"><label class="dr-edit-label">Tags (comma separated)</label><input class="dr-edit-input" value="' + (c.tags||[]).join(', ') + '"/></div>' +
      '</div>' +
      '<div class="dr-edit-foot">' +
        '<button class="dr-btn dr-btn-ghost" data-close="dr-ov-edit" data-show="dr-ov-details">&#x2715; Cancel</button>' +
        '<button class="dr-btn dr-btn-pri dr-btn-sm" onclick="_drRecordHistory(window._drCurrentCircId,\'Overview\',\'Fields Edited\',\'Overview fields updated\');showToast(\'Changes saved.\',\'success\');document.getElementById(\'dr-ov-edit\').style.display=\'none\';document.getElementById(\'dr-ov-details\').style.display=\'block\';">&#x2713; Save Changes</button>' +
      '</div>' +
    '</div>' +
    '<div id="dr-ov-details" style="background:#fff;padding:16px 18px;">' +
      (c.summary ? '<div class="dr-block-pad" style="margin-bottom:14px;"><div class="dr-info-block"><div class="dr-ib-label">Summary</div><div class="dr-ib-text">' + c.summary + '</div></div></div>' : '') +
      '<div style="border:1px solid var(--dr-border,#e2e5ed);border-radius:8px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,.06);">' +
        '<div class="dr-detail-grid dr-detail-grid-5">' +
          fields.map(function(f) {
            if (f[0] === '__viewBtn__') return '<div class="dr-detail-cell" style="display:flex;align-items:center;justify-content:center;background:#f5f6f8;"><button class="dr-btn dr-view-circ-btn" onclick="showToast(\'Opening circular...\',\'info\')">&#x1F4C4; View Circular</button></div>';
            if (!f[0]) return '<div class="dr-detail-cell" style="background:#f5f6f8;"></div>';
            return '<div class="dr-detail-cell" style="background:#f5f6f8;"><div class="dr-dc-label">' + f[0] + '</div><div class="dr-dc-val">' + f[1] + '</div></div>';
          }).join('') +
        '</div>' +
      '</div>' +
      ((c.tags||[]).length ? '<div class="dr-tags-row">' + c.tags.map(function(t){return '<span class="dr-tag">'+t+'</span>';}).join('') + '</div>' : '') +
    '</div>' +
    '<div class="dr-panel-foot" style="background:#fff;"><span></span><button class="dr-btn dr-btn-next" onclick="_drGoNext(0)">Applicability Analysis &#x2192;</button></div>' +
    '</div>'
  );
}

/* ================================================================ PANEL 1 — APPLICABILITY */

/* ================================================================ PANEL 2 — EXECUTIVE SUMMARY */

window._drOpenMapModal = function(circId, clauseId, ck, type, oi) {
  var otherCircs = (CMS_DATA && CMS_DATA.circulars || []).filter(function(c){return c.id !== circId;});
  var allRows = [];
  otherCircs.forEach(function(c) {
    (c.chapters||[]).forEach(function(ch){
      (ch.clauses||[]).forEach(function(cl){
        allRows.push({ circId:c.id, circTitle:c.title, regulator:c.regulator||'', chTitle:ch.title||'', clauseId:cl.id, clauseText:cl.text||'' });
      });
    });
  });
  var currentFlow   = window._savedFlow[circId];
  var currentClause = null;
  if (currentFlow) { (currentFlow.clauses||[]).forEach(function(ch){ (ch.clauses||[]).forEach(function(cl){ if(cl.id===clauseId) currentClause=cl; }); }); }
  var mapKey   = circId + ':' + clauseId;
  var existing = window._mappedClauses[mapKey] || [];
  var overlay  = document.createElement('div');
  overlay.className = 'dr-modal-overlay'; overlay.id = 'dr-map-modal';
  var rowsHtml = allRows.map(function(r){
    var already = existing.some(function(e){return e.clauseId===r.clauseId&&e.circId===r.circId;});
    var rowData = JSON.stringify({circId:r.circId,clauseId:r.clauseId,clauseText:r.clauseText}).replace(/"/g,'&quot;');
    return '<tr class="dr-map-row' + (already?' dr-map-row-mapped':'') + '" data-search="'+r.circId+' '+r.clauseId+' '+r.clauseText.substring(0,60)+' '+r.circTitle+'">' +
      '<td><button class="dr-map-row-btn'+(already?' mapped':'')+'" data-row="'+rowData+'" data-mapkey="'+mapKey+'" data-ck="'+ck+'">'+(already?'&#x2713; Mapped':'Map')+'</button></td>' +
      '<td><span class="dr-map-cid">'+r.clauseId+'</span></td>' +
      '<td><div class="dr-map-circ-id">'+r.circId+'</div><div class="dr-map-circ-title">'+r.circTitle.substring(0,40)+(r.circTitle.length>40?'…':'')+'</div></td>' +
      '<td class="dr-map-ch">'+r.chTitle.substring(0,28)+(r.chTitle.length>28?'…':'')+'</td>' +
      '<td class="dr-map-text">'+r.clauseText.substring(0,80)+(r.clauseText.length>80?'…':'')+'</td>' +
    '</tr>';
  }).join('');
  overlay.innerHTML = '<div class="dr-modal"><div class="dr-modal-head"><div class="dr-modal-head-left"><div class="dr-modal-eyebrow">Map Clause</div><div class="dr-modal-subject">' + clauseId + ' — ' + (currentClause?(currentClause.text||'').substring(0,80):'') + '</div></div><button class="dr-modal-close" onclick="document.getElementById(\'dr-map-modal\').remove()">&#x2715;</button></div>' + (existing.length?'<div class="dr-modal-mapped-bar"><span class="dr-modal-mapped-label">Mapped ('+existing.length+')</span>'+existing.map(function(m){return '<span class="dr-mapped-chip dr-mapped-chip-sm">'+m.circId+' · '+m.clauseId+'</span>';}).join('')+'</div>':'') + '<div class="dr-modal-search-bar"><input class="dr-modal-search" id="dr-map-search" placeholder="Search clauses…" autocomplete="off"/></div><div class="dr-modal-body"><table class="dr-map-table" id="dr-map-table"><thead><tr><th></th><th>Clause</th><th>Circular</th><th>Chapter</th><th>Text</th></tr></thead><tbody>'+rowsHtml+'</tbody></table></div><div class="dr-modal-foot"><span class="dr-modal-foot-note">Cross-reference related clauses across circulars.</span><button class="dr-btn dr-btn-pri" onclick="document.getElementById(\'dr-map-modal\').remove();showToast(\'Mappings saved.\',\'success\')">Done</button></div></div>';
  document.body.appendChild(overlay);
  overlay.addEventListener('click', function(e){ if(e.target===overlay) overlay.remove(); });
  document.getElementById('dr-map-search').addEventListener('input', function(){ var q=this.value.toLowerCase(); document.querySelectorAll('#dr-map-modal .dr-map-row').forEach(function(row){ row.style.display=row.dataset.search.toLowerCase().includes(q)?'':'none'; }); });
  overlay.querySelectorAll('.dr-map-row-btn').forEach(function(btn){
    btn.addEventListener('click', function(){
      var mk=btn.dataset.mapkey, bck=btn.dataset.ck;
      window._mappedClauses[mk]=window._mappedClauses[mk]||[];
      var rowData; try{rowData=JSON.parse(btn.dataset.row.replace(/&quot;/g,'"'));}catch(e){return;}
      var idx=window._mappedClauses[mk].findIndex(function(x){return x.clauseId===rowData.clauseId&&x.circId===rowData.circId;});
      if(idx>=0){window._mappedClauses[mk].splice(idx,1);btn.innerHTML='Map';btn.classList.remove('mapped');btn.closest('tr').classList.remove('dr-map-row-mapped');}
      else{window._mappedClauses[mk].push(rowData);btn.innerHTML='&#x2713; Mapped';btn.classList.add('mapped');btn.closest('tr').classList.add('dr-map-row-mapped');}
      _drRefreshMappedRefs(bck, mk, 'clause');
    });
  });
};

window._drRefreshMappedRefs = function(ck, mapKey, type) {
  var el    = document.getElementById('dr-mapped-refs-' + ck); if (!el) return;
  var store = type==='clause' ? window._mappedClauses : window._mappedObligs;
  var items = store[mapKey] || [];
  el.innerHTML = items.length
    ? '<span class="dr-mapped-label">Mapped:</span>' + items.map(function(m){return '<span class="dr-mapped-chip">'+m.circId+' · '+m.clauseId+'</span>';}).join('')
    : '<span class="dr-mapped-empty">No cross-references mapped yet</span>';
};

/* ================================================================ BIND PANEL */
function _drBindPanel(step, flow, circId) {
  /* close kebab menu when clicking outside */
  document.addEventListener('click', function _kebabOutside(e) {
    if (!e.target.closest('.dr-kebab-wrap')) {
      document.querySelectorAll('.dr-kebab-wrap.open').forEach(function(w){ w.classList.remove('open'); });
    }
  });

  /* edit toggles */
  document.querySelectorAll('.dr-tool-edit-toggle').forEach(function(btn){
    btn.addEventListener('click', function(){
      var drawer=document.getElementById(btn.dataset.target), details=btn.dataset.hide?document.getElementById(btn.dataset.hide):null;
      if(!drawer)return;
      var opening=drawer.style.display==='none';
      drawer.style.display=opening?'block':'none';
      if(details)details.style.display=opening?'none':'block';
    });
  });
  document.querySelectorAll('[data-close]').forEach(function(btn){
    btn.addEventListener('click', function(){
      var drawer=document.getElementById(btn.dataset.close), show=btn.dataset.show?document.getElementById(btn.dataset.show):null;
      if(drawer)drawer.style.display='none'; if(show)show.style.display='block';
    });
  });

  /* Executive Summary accordions */
  document.querySelectorAll('.dr-acc-trigger').forEach(function(btn){
    btn.addEventListener('click', function(){
      var id   = btn.dataset.acc;
      var body = document.getElementById('dr-acc-body-' + id);
      var arr  = btn.querySelector('.dr-acc-arrow');
      if (!body) return;
      var open = body.classList.contains('open');
      body.classList.toggle('open', !open);
      if (arr) arr.style.transform = open ? '' : 'rotate(180deg)';
    });
  });
  document.querySelectorAll('.dr-acc-add-btn').forEach(function(btn){
    btn.addEventListener('click', function(e){
      e.stopPropagation();
      var accId = btn.dataset.accId;
      var body    = document.getElementById('dr-acc-body-' + accId);
      var trigger = document.querySelector('.dr-acc-trigger[data-acc="' + accId + '"]');
      var arr     = trigger ? trigger.querySelector('.dr-acc-arrow') : null;
      if (body && !body.classList.contains('open')) { body.classList.add('open'); if (arr) arr.style.transform = 'rotate(180deg)'; }
      var rows = document.getElementById('dr-acc-rows-' + accId); if (!rows) return;
      var div = document.createElement('div'); div.className = 'dr-sum-row';
      div.innerHTML = '<span class="dr-sum-dot"></span><span class="dr-sum-item" contenteditable="true" style="outline:1.5px dashed #b2ddef;border-radius:3px;padding:1px 5px;">New item\u2026</span><button class="dr-row-del" onclick="this.closest(\'.dr-sum-row\').remove()">&#x2715;</button>';
      rows.appendChild(div);
      var ed = div.querySelector('[contenteditable]');
      if (ed) { ed.focus(); ed.addEventListener('keydown', function(ev){ if(ev.key==='Enter'){ev.preventDefault();ed.blur();} }); }
    });
  });

  /* Clause panel: chapter nav toggles */
  document.querySelectorAll('.dr-cl-nav-ch-btn').forEach(function(btn){
    btn.addEventListener('click', function(){
      var ci   = btn.dataset.ci;
      var body = document.getElementById('dr-cl-nav-body-' + ci);
      var arr  = btn.querySelector('.dr-cl-nav-ch-arrow');
      if (!body) return;
      var open = body.classList.contains('open');
      body.classList.toggle('open', !open);
      if (arr) arr.textContent = open ? '\u25B6' : '\u25BC';
    });
  });

  /* Section click → show clause stack on RIGHT panel */
  document.querySelectorAll('.dr-cl-nav-sec-btn').forEach(function(btn){
    btn.addEventListener('click', function(){
      /* highlight active */
      document.querySelectorAll('.dr-cl-nav-sec-btn').forEach(function(b){b.classList.remove('dr-cl-nav-active');});
      btn.classList.add('dr-cl-nav-active');

      var ci       = parseInt(btn.dataset.ci);
      var cId      = circId;
      var chNum    = btn.dataset.chnum || ('Chapter ' + (ci+1));
      var chTitle  = btn.dataset.chtitle || '';
      var secLabel = btn.dataset.seclabel || '';

      /* decode clauses from data attribute */
      var clauses = [];
      try {
        clauses = JSON.parse(decodeURIComponent(escape(atob(btn.dataset.clauses))));
      } catch(e) {
        /* fallback: get all chapter clauses */
        var fl = window._savedFlow[cId];
        var ch = fl && fl.clauses && fl.clauses[ci];
        clauses = (ch && ch.clauses) || [];
      }

      window._drShowClauseStack(ci, cId, clauses, chNum, chTitle, secLabel);
    });
  });

  /* Add Chapter */
  var addChBtn = document.getElementById('dr-cl-add-ch-btn');
  if (addChBtn) addChBtn.addEventListener('click', function(){
    var tree = document.getElementById('dr-cl-nav-tree'); if (!tree) return;
    var ci   = tree.querySelectorAll('.dr-cl-nav-chapter').length;
    _drRecordHistory(window._drCurrentCircId, 'Clause Generation', 'Chapter Added', 'New Chapter ' + (ci + 1) + ' added');
    var div  = document.createElement('div');
    div.innerHTML = _drBuildNavChapter({title:'New Chapter '+(ci+1), clauses:[]}, ci, circId);
    tree.appendChild(div.firstElementChild);
    var newChBtn = tree.querySelector('[data-ci="'+ci+'"]');
    if (newChBtn) newChBtn.addEventListener('click', function(){
      var body = document.getElementById('dr-cl-nav-body-'+ci), arr=newChBtn.querySelector('.dr-cl-nav-ch-arrow');
      if (!body) return;
      var open = body.classList.contains('open');
      body.classList.toggle('open', !open);
      if (arr) arr.textContent = open ? '\u25B6' : '\u25BC';
    });
    showToast('Chapter added.','success');
  });
}

/* ================================================================ HELPERS */
window._drAddClause = function(ci, circId) {
  var fl  = window._savedFlow[circId];
  var ch  = fl && fl.clauses && fl.clauses[ci];
  if (!ch) return;
  var cli   = (ch.clauses||[]).length;
  var newCl = { id:(ci+1)+'.'+(cli+1), text:'New clause\u2026', risk:'Low', department:'Compliance', status:'Pending', obligation:'', actionable:'' };
  if (!ch.clauses) ch.clauses = [];
  ch.clauses.push(newCl);

  /* Rebuild this chapter's nav entry */
  var chEl = document.getElementById('dr-cl-nav-ch-' + ci);
  if (chEl) {
    var newDiv = document.createElement('div');
    newDiv.innerHTML = _drBuildNavChapter(ch, ci, circId);
    chEl.replaceWith(newDiv.firstElementChild);
    /* re-bind chapter toggle */
    var newChEl = document.getElementById('dr-cl-nav-ch-' + ci);
    var chBtn   = newChEl && newChEl.querySelector('.dr-cl-nav-ch-btn');
    if (chBtn) chBtn.addEventListener('click', function(){
      var body = document.getElementById('dr-cl-nav-body-'+ci), arr=chBtn.querySelector('.dr-cl-nav-ch-arrow');
      if(!body)return; var open=body.classList.contains('open');
      body.classList.toggle('open',!open); if(arr)arr.textContent=open?'\u25B6':'\u25BC';
    });
    /* re-bind section clicks */
    if (newChEl) newChEl.querySelectorAll('.dr-cl-nav-sec-btn').forEach(function(btn){
      btn.addEventListener('click', function(){
        document.querySelectorAll('.dr-cl-nav-sec-btn').forEach(function(b){b.classList.remove('dr-cl-nav-active');});
        btn.classList.add('dr-cl-nav-active');
        var clauses=[];
        try{clauses=JSON.parse(decodeURIComponent(escape(atob(btn.dataset.clauses))));}catch(e){clauses=ch.clauses||[];}
        window._drShowClauseStack(ci,circId,clauses,btn.dataset.chnum||('Chapter '+(ci+1)),btn.dataset.chtitle||'',btn.dataset.seclabel||'');
      });
    });
    /* auto-open the chapter */
    var body = document.getElementById('dr-cl-nav-body-' + ci);
    if (body) { body.classList.add('open'); if(chBtn){var arr=chBtn.querySelector('.dr-cl-nav-ch-arrow');if(arr)arr.textContent='\u25BC';} }
  }
  showToast('Clause added. Select the section to see it.','success');
};

window._drAddObligation = function(ck, circId, clauseId) {
  var wrap = document.getElementById('dr-oblig-wrap-' + ck);
  var noOb = document.getElementById('dr-no-oblig-' + ck);
  if (noOb) noOb.remove();
  if (!wrap) return;
  var oi  = wrap.querySelectorAll('.dr-oblig-item').length;
  var div = document.createElement('div');
  div.innerHTML = _drBuildObligationItem('New obligation\u2026', [], ck, circId, clauseId, oi, false);
  wrap.appendChild(div.firstElementChild);
  var trigger = wrap.querySelector('#dr-oblig-'+oi+'-'+ck+' .dr-oblig-trigger');
  if (trigger) trigger.addEventListener('click', function(){
    var body = document.getElementById('dr-oblig-body-'+oi+'-'+ck);
    var arr  = trigger.querySelector('.dr-oblig-arr');
    if (!body) return;
    var open = body.classList.contains('open');
    body.classList.toggle('open', !open);
    if (arr) arr.textContent = open ? '▶' : '▼';
  });
  var ed = wrap.querySelector('#dr-oblig-'+oi+'-'+ck+' .dr-oblig-text-full');
  if (ed) ed.focus();
};

window._drAddAction = function(oi, ck) {
  var list = document.getElementById('dr-alist-' + oi + '-' + ck); if (!list) return;
  var ai   = list.querySelectorAll('.dr-action-row').length;
  var div  = document.createElement('div'); div.className = 'dr-action-row';
  div.innerHTML = '<span class="dr-action-num">'+(ai+1)+'</span><span class="dr-action-txt dr-editable" contenteditable="true" style="outline:1.5px dashed #b2ddef;border-radius:3px;padding:1px 4px;">New action\u2026</span><button class="dr-row-del" onclick="this.closest(\'.dr-action-row\').remove()">&#x2715;</button>';
  list.appendChild(div);
  var ed = div.querySelector('[contenteditable]'); if (ed) ed.focus();
};

window._drAddTag = function(ck) {
  var input=document.getElementById('dr-tinput-'+ck), list=document.getElementById('dr-tlist-'+ck);
  if(!input||!list)return;
  var val=input.value.trim().replace(/,/g,''); if(!val)return;
  var span=document.createElement('span'); span.className='dr-ctag';
  span.innerHTML=val+'<button onclick="this.parentElement.remove()">&#xD7;</button>';
  list.appendChild(span); input.value='';
};

window.saveDraftReview  = function() { var circId=_drCurrentCircId(); if(!circId){showToast('Select a circular first.','warning');return;} window._draftStore[circId]={status:'draft',savedAt:new Date().toISOString()}; _drUpdateBadge(circId,'draft'); showToast('💾 Draft saved.','success'); };
window.publishToLibrary = function() { var circId=_drCurrentCircId(); if(!circId){showToast('Select a circular first.','warning');return;} window._draftStore[circId]={status:'library',savedAt:new Date().toISOString()}; _drUpdateBadge(circId,'library'); showToast('📚 Published to Central Library.','success'); };
function _drCurrentCircId() { var sel=document.querySelector('.dr-csel-item.selected'); return sel?sel.dataset.id:null; }
function _drUpdateBadge(circId,status) { var badge=document.getElementById('dr-status-badge'); if(!badge)return; badge.style.display='inline-flex'; badge.className='dr-status-badge dr-badge-'+(status==='library'?'lib':'draft'); badge.textContent=status==='library'?'✓ In Central Library':'💾 Draft Saved'; }
function _drNotSaved(label) { return '<div class="dr-not-saved"><div class="dr-ns-icon">📭</div><div class="dr-ns-title">'+label+' not saved yet</div><div class="dr-ns-sub">Complete this step in the AI Engine first.</div><button class="dr-btn dr-btn-sec" onclick="window.CMS&&window.CMS.navigateTo&&window.CMS.navigateTo(\'ai-engine\')">← AI Engine</button></div>'; }

/* ================================================================ CSS */
function injectDraftReviewCSS() {
  if (document.getElementById('dr-css')) return;
  var s = document.createElement('style');
  s.id = 'dr-css';
  s.textContent = `
:root {
  --dr-bg:#f4f6f9; --dr-card:#ffffff; --dr-nav:#f8f9fb; --dr-border:#e2e6ed; --dr-border-lt:#edf0f5;
  --dr-t1:#1e2433; --dr-t2:#5a6478; --dr-t3:#9aa3b5;
  --dr-blue:#0d7fa5; --dr-blue-lt:#e6f4f9; --dr-blue-mid:#b2ddef;
  --dr-purple:#5b5fcf; --dr-purple-lt:#ededfc;
  --dr-green:#0e9f6e; --dr-green-lt:#e8faf4;
  --dr-amber:#b45309; --dr-amber-lt:#fef3c7;
  --dr-red:#c92a2a; --dr-red-lt:#fdecea;
  --dr-r:8px; --dr-r-lg:12px;
  --dr-sh:0 1px 4px rgba(30,36,51,.07);
  --dr-font:'DM Sans',system-ui,sans-serif;
  --dr-mono:'DM Mono',monospace;
}
*{box-sizing:border-box;}
.dr-page{;margin:0 auto;padding-bottom:60px;font-family:var(--dr-font);color:var(--dr-t1);}
.dr-page-head{display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:12px;margin-bottom:20px;}
.dr-page-title{font-size:20px;font-weight:800;margin-bottom:3px;}
.dr-page-sub{font-size:12px;color:var(--dr-t3);}
.dr-head-actions{display:flex;gap:8px;}

/* BUTTONS */
.dr-btn{display:inline-flex;align-items:center;gap:6px;padding:8px 16px;border-radius:var(--dr-r);font-family:inherit;font-size:12px;font-weight:700;cursor:pointer;border:none;transition:all .14s;white-space:nowrap;}
.dr-btn-pri{background:var(--dr-t1);color:#fff;}.dr-btn-pri:hover{background:#2a3248;}
.dr-btn-sec{background:#f5f6f8;color:var(--dr-t2);border:1.5px solid var(--dr-border);}.dr-btn-sec:hover{background:#eef0f3;}
.dr-btn-ghost{background:none;color:var(--dr-t3);border:1px solid var(--dr-border);padding:5px 12px;font-size:11px;}.dr-btn-ghost:hover{color:var(--dr-t1);border-color:var(--dr-t1);}
.dr-btn-sm{padding:5px 12px;font-size:11px;}
.dr-btn-next{background:var(--dr-t1);color:#fff;padding:9px 20px;font-size:13px;}.dr-btn-next:hover{background:#2a3248;}

/* PICKER */
.dr-picker-card{display:flex;align-items:center;gap:16px;background:var(--dr-card);border:1px solid var(--dr-border);border-radius:var(--dr-r-lg);padding:16px 20px;margin-bottom:20px;box-shadow:var(--dr-sh);}
.dr-picker-icon{font-size:22px;flex-shrink:0;}
.dr-picker-inner{flex:1;min-width:0;}
.dr-picker-label{font-size:10px;font-weight:700;color:var(--dr-t3);text-transform:uppercase;letter-spacing:.06em;margin-bottom:5px;}
.dr-custom-select-wrap{position:relative;}
.dr-custom-select-btn{width:100%;display:flex;align-items:center;justify-content:space-between;gap:8px;padding:9px 12px;background:#f5f6f8;border:1.5px solid var(--dr-border);border-radius:var(--dr-r);font-family:inherit;font-size:13px;color:var(--dr-t1);cursor:pointer;transition:all .14s;}
.dr-custom-select-btn:hover{border-color:var(--dr-t3);background:#fff;}
.dr-csel-placeholder{color:var(--dr-t3);}.dr-csel-arrow{color:var(--dr-t3);flex-shrink:0;}
.dr-custom-dropdown{position:absolute;top:calc(100% + 5px);left:0;right:0;background:#fff;border:1.5px solid var(--dr-border);border-radius:10px;z-index:9999;box-shadow:0 8px 24px rgba(26,26,46,.12);overflow:hidden;}
.dr-csel-search-wrap{padding:10px 12px;border-bottom:1px solid var(--dr-border-lt);}
.dr-csel-search{width:100%;padding:7px 10px;background:#f5f6f8;border:1px solid var(--dr-border);border-radius:6px;font-family:inherit;font-size:12px;outline:none;box-sizing:border-box;}
.dr-csel-list{max-height:220px;overflow-y:auto;}
.dr-csel-item{padding:9px 14px;cursor:pointer;border-bottom:1px solid #f5f6f8;transition:background .1s;}
.dr-csel-item:last-child{border-bottom:none;}.dr-csel-item:hover,.dr-csel-item.selected{background:var(--dr-blue-lt);}
.dr-csel-item-top{display:flex;align-items:center;gap:7px;margin-bottom:3px;}
.dr-csel-item-id{font-family:var(--dr-mono);font-size:11px;font-weight:700;}
.dr-csel-risk{font-size:9px;font-weight:700;padding:1px 6px;border-radius:4px;}
.dr-csel-risk-high{background:var(--dr-red-lt);color:var(--dr-red);}.dr-csel-risk-medium{background:var(--dr-amber-lt);color:var(--dr-amber);}.dr-csel-risk-low{background:var(--dr-green-lt);color:var(--dr-green);}
.dr-csel-reg{font-size:11px;color:var(--dr-t3);margin-left:auto;}
.dr-csel-item-title{font-size:12px;color:var(--dr-t2);line-height:1.4;}
.dr-status-badge{font-size:11px;font-weight:700;padding:5px 14px;border-radius:20px;flex-shrink:0;}
.dr-badge-draft{background:var(--dr-amber-lt);color:var(--dr-amber);border:1px solid #fcd34d;}
.dr-badge-lib{background:var(--dr-green-lt);color:var(--dr-green);border:1px solid #6ee7b7;}

/* STEPPER */
.dr-stepper{display:flex;align-items:center;background:var(--dr-card);border:1px solid var(--dr-border);border-radius:var(--dr-r);padding:10px 16px;margin-bottom:16px;gap:0;}
.dr-step-btn{display:inline-flex;align-items:center;gap:7px;padding:7px 14px;background:none;border:none;cursor:pointer;border-radius:var(--dr-r);font-family:inherit;font-size:12px;font-weight:600;color:var(--dr-t3);transition:all .13s;white-space:nowrap;}
.dr-step-btn:hover{background:#f5f6f8;color:var(--dr-t1);}.dr-step-btn.active{background:var(--dr-t1);color:#fff;}
.dr-step-num{width:20px;height:20px;border-radius:50%;background:#eef0f3;color:var(--dr-t2);display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:800;flex-shrink:0;}
.dr-step-btn.active .dr-step-num{background:rgba(255,255,255,.2);color:#fff;}
.dr-step-line{flex:1;height:1px;background:#eef0f3;min-width:12px;}

/* PANEL SHELL */
.dr-panel{background:var(--dr-card);border:1px solid var(--dr-border);border-radius:var(--dr-r-lg);overflow:hidden;box-shadow:var(--dr-sh);}
.dr-panel-toolbar{display:flex;align-items:center;justify-content:space-between;padding:12px 18px;border-bottom:1px solid var(--dr-border-lt);background:var(--dr-nav);}
.dr-panel-title-wrap{display:flex;align-items:center;gap:8px;}
.dr-panel-icon{font-size:15px;}.dr-panel-title{font-size:13px;font-weight:700;}
.dr-cl-total-badge{font-size:10px;font-weight:600;padding:2px 9px;background:#e8ebf1;border-radius:20px;color:var(--dr-t2);}
.dr-toolbar-actions{display:flex;gap:6px;align-items:center;flex-wrap:wrap;}
.dr-tool-btn{display:inline-flex;align-items:center;gap:5px;padding:5px 12px;background:var(--dr-card);border:1.5px solid var(--dr-border);border-radius:6px;font-family:inherit;font-size:11px;font-weight:600;color:var(--dr-t2);cursor:pointer;transition:all .13s;white-space:nowrap;}
.dr-tool-btn:hover{border-color:var(--dr-t1);color:var(--dr-t1);}
.dr-tool-btn-pri{background:var(--dr-t1);color:#fff;border-color:var(--dr-t1);}.dr-tool-btn-pri:hover{background:#2a3248;}
.dr-edit-drawer{background:#f0f7ff;border-top:1px solid #c8e2f5;border-bottom:1px solid #c8e2f5;padding:16px 20px;}
.dr-edit-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
.dr-edit-field{display:flex;flex-direction:column;gap:4px;}.dr-edit-field-full{grid-column:1/-1;}
.dr-edit-label{font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;}
.dr-edit-input{padding:7px 10px;background:#fff;border:1px solid var(--dr-border);border-radius:6px;font-family:inherit;font-size:12px;outline:none;}
.dr-edit-input:focus{border-color:var(--dr-blue);}
.dr-edit-ta{min-height:72px;padding:8px 10px;background:#fff;border:1px solid var(--dr-border);border-radius:6px;font-family:inherit;font-size:12px;outline:none;resize:vertical;width:100%;}
.dr-edit-foot{display:flex;justify-content:flex-end;align-items:center;gap:8px;margin-top:12px;}
.dr-panel-foot{display:flex;align-items:center;justify-content:space-between;padding:12px 18px;border-top:1px solid var(--dr-border-lt);background:var(--dr-nav);}
.dr-block-pad{padding:14px 18px;}
.dr-info-block{background:#f8f9fc;border:1px solid var(--dr-border-lt);border-radius:var(--dr-r);padding:12px 14px;}
.dr-info-block-amber{background:#fffbeb;border-color:#fcd34d;}
.dr-ib-label{font-size:10px;font-weight:700;color:var(--dr-t3);text-transform:uppercase;letter-spacing:.05em;margin-bottom:5px;}
.dr-ib-text{font-size:12px;color:var(--dr-t2);line-height:1.7;}
.dr-section-label{font-size:10px;font-weight:700;color:var(--dr-t3);text-transform:uppercase;letter-spacing:.05em;margin-bottom:8px;}

/* OVERVIEW */
.dr-ov-hero{display:flex;align-items:flex-start;justify-content:space-between;gap:14px;padding:16px 18px;border-bottom:1px solid var(--dr-border-lt);flex-wrap:wrap;}
.dr-ov-hero-left{flex:1;min-width:0;}
.dr-ov-id-row{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:4px;}
.dr-ov-id{font-family:var(--dr-mono);font-size:10px;font-weight:700;color:var(--dr-t3);text-transform:uppercase;letter-spacing:.08em;}
.dr-ov-title{font-size:15px;font-weight:700;line-height:1.4;margin-bottom:8px;}
.dr-ov-chips{display:flex;gap:6px;flex-wrap:wrap;}
/* KEBAB MENU */
.dr-kebab-wrap{position:relative;}
.dr-view-circ-btn{font-size:12px;padding:7px 14px;display:inline-flex;align-items:center;gap:6px;background:#fff;color:var(--dr-t1,#1a1a2e);border:1.5px solid var(--dr-border,#e2e5ed);border-radius:6px;cursor:pointer;font-family:inherit;font-weight:600;transition:background .15s,border-color .15s,box-shadow .15s,transform .1s;}
.dr-view-circ-btn:hover{background:#f5f6f8;border-color:var(--dr-t1,#1a1a2e);box-shadow:0 2px 8px rgba(0,0,0,.1);transform:translateY(-1px);}
.dr-view-circ-btn:active{transform:translateY(0);box-shadow:none;}
.dr-kebab-btn{background:none;border:1px solid var(--dr-border);border-radius:6px;width:30px;height:30px;display:flex;align-items:center;justify-content:center;font-size:16px;color:var(--dr-t2);cursor:pointer;transition:all .12s;line-height:1;}
.dr-kebab-btn:hover{background:var(--dr-hover);border-color:var(--dr-t2);}
.dr-kebab-menu{display:none;position:absolute;right:0;top:calc(100% + 4px);background:#fff;border:1px solid var(--dr-border);border-radius:8px;box-shadow:0 4px 16px rgba(0,0,0,.12);min-width:160px;z-index:500;overflow:hidden;flex-direction:column;}
.dr-kebab-wrap.open .dr-kebab-menu{display:flex;}
.dr-kebab-item{display:flex;align-items:center;gap:8px;padding:9px 14px;background:none;border:none;width:100%;text-align:left;font-family:inherit;font-size:12px;font-weight:600;color:var(--dr-t2);cursor:pointer;transition:background .1s;}
.dr-kebab-item:hover{background:var(--dr-hover);color:var(--dr-t1);}
label.dr-kebab-item{cursor:pointer;}
.dr-deadline-box{padding:10px 16px;background:var(--dr-amber-lt);border:1.5px solid #fcd34d;border-radius:10px;text-align:center;flex-shrink:0;}
.dr-dl-label{font-size:9px;font-weight:700;color:var(--dr-amber);text-transform:uppercase;letter-spacing:.06em;margin-bottom:2px;}
.dr-dl-date{font-size:13px;font-weight:700;color:#92400e;}
.dr-chip{padding:3px 10px;background:#f0f1f4;border:1px solid var(--dr-border);border-radius:20px;font-size:11px;font-weight:700;color:var(--dr-t2);}
.dr-chip-sm{padding:2px 8px;font-size:10px;}
.dr-chip-blue{background:var(--dr-blue-lt);border-color:var(--dr-blue-mid);color:var(--dr-blue);}
.dr-chip-status{background:#f3f4f6;color:#52525b;}
.dr-chip-risk-high{background:var(--dr-red-lt);border-color:#f5b8b8;color:var(--dr-red);}
.dr-chip-risk-medium{background:var(--dr-amber-lt);border-color:#fcd34d;color:var(--dr-amber);}
.dr-chip-risk-low{background:var(--dr-green-lt);border-color:#6ee7b7;color:var(--dr-green);}
.dr-detail-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:var(--dr-border-lt);}
.dr-detail-grid-5{grid-template-columns:repeat(5,1fr);}
.dr-detail-cell{background:#fafbfc;padding:9px 14px;}
.dr-dc-label{font-size:9px;font-weight:700;color:var(--dr-t3);text-transform:uppercase;letter-spacing:.05em;margin-bottom:2px;}
.dr-dc-val{font-size:12px;font-weight:600;}
.dr-tags-row{display:flex;flex-wrap:wrap;gap:6px;padding:12px 18px;}
.dr-tag{padding:2px 10px;background:var(--dr-blue-lt);border:1px solid var(--dr-blue-mid);border-radius:20px;font-size:11px;font-weight:600;color:var(--dr-blue);}

/* APPLICABILITY */
.dr-verdict-banner{display:flex;align-items:center;gap:14px;margin:16px 18px;padding:14px 16px;border:1px solid;border-radius:10px;flex-wrap:wrap;}
.dr-verdict-badge{padding:5px 14px;border-radius:6px;font-size:13px;font-weight:800;flex-shrink:0;}
.dr-verdict-info{flex:1;}
.dr-verdict-entity{font-size:12px;color:var(--dr-t2);margin-bottom:2px;}
.dr-verdict-owner{font-size:11px;color:var(--dr-t3);}
.dr-verdict-deadline{text-align:center;flex-shrink:0;}
.dr-vd-label{font-size:9px;font-weight:700;color:var(--dr-t3);text-transform:uppercase;margin-bottom:2px;}
.dr-vd-date{font-size:14px;font-weight:700;}
.dr-table{width:100%;border-collapse:collapse;font-size:12px;}
.dr-table th{text-align:left;padding:7px 12px;background:#f5f6f8;border-bottom:1px solid var(--dr-border);font-size:10px;font-weight:700;color:var(--dr-t3);text-transform:uppercase;letter-spacing:.04em;}
.dr-table td{padding:8px 12px;border-bottom:1px solid #f5f6f8;color:var(--dr-t2);}
.dr-table tr:last-child td{border-bottom:none;}
.dr-app-pill{padding:2px 9px;border-radius:20px;font-size:11px;font-weight:700;}
.dr-app-yes{background:var(--dr-green-lt);color:var(--dr-green);}.dr-app-no{background:var(--dr-red-lt);color:var(--dr-red);}
.dr-tbl-add-btn{display:inline-flex;align-items:center;padding:3px 10px;background:var(--dr-blue-lt);border:1.5px solid var(--dr-blue-mid);border-radius:5px;font-family:inherit;font-size:10px;font-weight:700;color:var(--dr-blue);cursor:pointer;}
.dr-tbl-del-btn{padding:2px 7px;background:none;border:1px solid #f5b8b8;border-radius:4px;color:var(--dr-red);cursor:pointer;font-size:11px;font-weight:700;}
.dr-tbl-select{padding:3px 6px;background:#fff;border:1px solid var(--dr-border);border-radius:5px;font-family:inherit;font-size:10px;outline:none;margin-right:4px;}

/* EXECUTIVE SUMMARY ACCORDIONS */
.dr-sum-accordions{border-top:1px solid var(--dr-border-lt);}
.dr-acc-item{border-bottom:1px solid var(--dr-border-lt);}.dr-acc-item:last-child{border-bottom:none;}
.dr-acc-header{display:flex;align-items:center;background:var(--dr-nav);}
.dr-acc-header:hover{background:var(--dr-bg);}
.dr-acc-trigger{flex:1;display:flex;align-items:center;gap:10px;padding:13px 14px 13px 18px;background:none;border:none;cursor:pointer;font-family:inherit;font-size:12px;font-weight:700;text-align:left;min-width:0;}
.dr-acc-icon{font-size:14px;flex-shrink:0;}.dr-acc-label{font-size:12px;font-weight:700;}
.dr-acc-spacer{flex:1;}
.dr-acc-badge{font-size:10px;font-weight:600;padding:2px 8px;background:#e8ebf1;border:1px solid var(--dr-border);border-radius:10px;color:var(--dr-t3);flex-shrink:0;white-space:nowrap;}
.dr-acc-arrow{font-size:9px;color:var(--dr-t3);flex-shrink:0;transition:transform .2s;}
.dr-acc-add-btn{flex-shrink:0;margin:0 12px 0 6px;padding:5px 12px;background:#fff;border:1.5px solid var(--dr-border);border-radius:6px;font-family:inherit;font-size:10px;font-weight:700;color:var(--dr-t2);cursor:pointer;transition:all .12s;white-space:nowrap;}
.dr-acc-add-btn:hover{border-color:var(--dr-blue);color:var(--dr-blue);background:var(--dr-blue-lt);}
.dr-acc-body{display:none;border-top:1px solid var(--dr-border-lt);background:#fafbfc;}
.dr-acc-body.open{display:block;}
.dr-acc-rows{padding:10px 16px;display:flex;flex-direction:column;gap:5px;}
.dr-sum-row{display:flex;align-items:flex-start;gap:8px;padding:8px 10px;background:#fff;border:1px solid var(--dr-border-lt);border-radius:var(--dr-r);}
.dr-sum-num-icon{flex-shrink:0;width:20px;height:20px;background:var(--dr-purple-lt);color:var(--dr-purple);border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;margin-top:1px;}
.dr-sum-dot{flex-shrink:0;width:8px;height:8px;background:var(--dr-purple);border-radius:50%;margin-top:6px;}
.dr-sum-dot-tech{background:#8b5cf6;}
.dr-sum-item{flex:1;font-size:12px;color:var(--dr-t2);line-height:1.6;outline:none;}
.dr-sum-item:focus{outline:1.5px dashed var(--dr-blue-mid);border-radius:3px;padding:1px 4px;}
.dr-sum-item-plain{font-size:12px;color:var(--dr-t2);line-height:1.7;padding:6px 0;outline:none;}
.dr-risk-pill{flex-shrink:0;padding:2px 8px;border-radius:4px;font-size:10px;font-weight:700;}
.dr-risk-high{background:var(--dr-red-lt);color:var(--dr-red);}.dr-risk-medium{background:var(--dr-amber-lt);color:var(--dr-amber);}.dr-risk-low{background:var(--dr-green-lt);color:var(--dr-green);}
.dr-row-del{flex-shrink:0;padding:1px 6px;background:none;border:none;color:#c4c8d4;cursor:pointer;font-size:12px;transition:color .12s;}
.dr-row-del:hover{color:var(--dr-red);}
.dr-org-metrics{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:12px;}
.dr-org-metric{background:#fff;border:1px solid var(--dr-border-lt);border-radius:var(--dr-r);padding:10px;text-align:center;}
.dr-om-val{font-size:20px;font-weight:800;line-height:1;}
.dr-om-label{font-size:10px;color:var(--dr-t3);text-transform:uppercase;letter-spacing:.04em;margin-top:3px;}

.ml-dots-item {
  padding: 10px 16px;
  font-size: 13px;
  color: #374151;
  cursor: pointer;
  border-bottom: 1px solid #f3f4f6;
}
.ml-dots-item:hover { background: #f9fafb; }

/* ══════════════════════════════════════
   CLAUSE GEN — SPLIT PANE
   Left nav matches clause-panel-v2 exactly
══════════════════════════════════════ */
.dr-cl-split{display:grid;grid-template-columns:256px 1fr;min-height:560px;border-top:1px solid var(--dr-border-lt);}

/* LEFT NAV */
.dr-cl-nav{border-right:1px solid var(--dr-border-lt);display:flex;flex-direction:column;background:var(--dr-nav);}
.dr-cl-nav-head{display:flex;align-items:center;justify-content:space-between;padding:11px 14px;border-bottom:1px solid var(--dr-border-lt);}
.dr-cl-nav-title{font-size:10px;font-weight:700;color:var(--dr-t3);text-transform:uppercase;letter-spacing:.07em;}
.dr-cl-nav-count{font-size:10px;color:var(--dr-t3);background:#e8ebf1;padding:2px 8px;border-radius:10px;}
.dr-cl-nav-tree{flex:1;overflow-y:auto;padding:4px 0;}

/* Chapter row — "Chapter N" pill + title */
.dr-cl-nav-ch-row{display:flex;align-items:center;}
.dr-cl-nav-ch-btn{flex:1;display:flex;align-items:center;gap:7px;padding:9px 8px 9px 10px;background:none;border:none;cursor:pointer;font-family:inherit;text-align:left;transition:background .1s;min-width:0;}
.dr-cl-nav-ch-btn:hover{background:var(--dr-bg);}
.dr-cl-nav-ch-arrow{font-size:8px;color:var(--dr-t3);flex-shrink:0;width:10px;line-height:1;}
/* chapter info: stacked "Chapter N" + title */
.dr-cl-nav-ch-info{flex:1;min-width:0;display:flex;flex-direction:column;gap:1px;}
.dr-cl-nav-ch-num{font-size:9px;font-weight:800;color:var(--dr-blue);text-transform:uppercase;letter-spacing:.06em;line-height:1.2;}
.dr-cl-nav-ch-label{font-size:11px;font-weight:600;color:var(--dr-t1);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;line-height:1.3;}
.dr-cl-nav-ch-count{font-size:10px;color:var(--dr-t3);background:#e8ebf1;padding:1px 6px;border-radius:8px;flex-shrink:0;}
.dr-cl-ch-actions{display:flex;gap:2px;padding-right:8px;flex-shrink:0;}
.dr-cl-ch-action-btn{display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;background:none;border:1px solid var(--dr-border);border-radius:5px;font-size:12px;cursor:pointer;color:var(--dr-t2);transition:all .12s;}
.dr-cl-ch-action-btn:hover{background:var(--dr-blue-lt);border-color:var(--dr-blue-mid);color:var(--dr-blue);}
.dr-cl-nav-ch-body{display:none;padding-bottom:4px;}.dr-cl-nav-ch-body.open{display:block;}

/* Section button in left nav (no clauses shown here) */
.dr-cl-nav-sec-group{}
.dr-cl-nav-sec-btn{
  width:100%;display:flex;align-items:center;gap:6px;
  padding:7px 12px 7px 20px;
  background:none;border:none;border-left:3px solid transparent;
  cursor:pointer;font-family:inherit;font-size:11px;text-align:left;
  transition:background .1s;color:var(--dr-t2);
}
.dr-cl-nav-sec-btn:hover{background:var(--dr-bg);}
.dr-cl-nav-active{background:var(--dr-blue-lt)!important;border-left-color:var(--dr-blue)!important;color:var(--dr-blue)!important;}
.dr-cl-nav-sec-icon{font-size:10px;font-weight:700;color:var(--dr-blue);background:var(--dr-blue-lt);border:1px solid var(--dr-blue-mid);padding:1px 5px;border-radius:3px;flex-shrink:0;}
.dr-cl-nav-sec-label{flex:1;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.dr-cl-nav-sec-count{font-size:9px;color:var(--dr-t3);flex-shrink:0;}
.dr-cl-nav-sec-arrow{font-size:10px;color:var(--dr-t3);flex-shrink:0;}

/* Clause stack (right panel) */
.dr-stack-wrap{padding:20px 24px;}
.dr-stack-header{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:16px;padding-bottom:14px;border-bottom:1px solid var(--dr-border-lt);}
.dr-stack-breadcrumb{display:flex;flex-direction:column;gap:4px;}
.dr-stack-ch-row{display:flex;align-items:center;gap:8px;}
.dr-stack-ch-num{font-size:10px;font-weight:800;color:var(--dr-blue);text-transform:uppercase;letter-spacing:.08em;background:var(--dr-blue-lt);border:1px solid var(--dr-blue-mid);padding:2px 8px;border-radius:4px;}
.dr-stack-ch-title{font-size:13px;font-weight:700;color:var(--dr-t1);}
.dr-stack-sec-row{display:flex;align-items:center;gap:5px;}
.dr-stack-sec-icon{font-size:11px;color:var(--dr-t3);}
.dr-stack-sec-label{font-size:12px;color:var(--dr-t2);font-weight:500;}
.dr-stack-count{font-size:11px;color:var(--dr-t3);background:var(--dr-border-lt);border:1px solid var(--dr-border);padding:3px 10px;border-radius:10px;flex-shrink:0;white-space:nowrap;}
.dr-stack-list{display:flex;flex-direction:column;gap:8px;}
.dr-stack-empty{padding:24px;text-align:center;font-size:13px;color:var(--dr-t3);background:var(--dr-nav);border-radius:var(--dr-r);border:1px dashed var(--dr-border);}

/* Clause card in right panel stack */
.dr-cl-clause-card{
  width:100%;text-align:left;background:var(--dr-card);
  border:1.5px solid var(--dr-border);border-radius:var(--dr-r);
  padding:12px 14px;cursor:pointer;font-family:inherit;
  transition:all .14s;display:flex;flex-direction:column;gap:6px;
  box-shadow:var(--dr-sh);
}
.dr-cl-clause-card:hover{border-color:var(--dr-blue);background:var(--dr-blue-lt);box-shadow:0 2px 8px rgba(13,127,165,.12);}
.dr-clause-card-active{border-color:var(--dr-blue)!important;background:var(--dr-blue-lt)!important;}
.dr-cl-card-top{display:flex;align-items:center;justify-content:space-between;gap:8px;}
.dr-cl-card-badges{display:flex;align-items:center;gap:5px;}

/* Back button in workspace */
.dr-ws-back-btn{
  align-self:flex-start;padding:5px 12px;
  background:var(--dr-nav);border:1px solid var(--dr-border);
  border-radius:var(--dr-r);font-family:inherit;font-size:11px;
  font-weight:600;color:var(--dr-t2);cursor:pointer;transition:all .12s;
  display:inline-flex;
}
.dr-ws-back-btn:hover{background:var(--dr-bg);color:var(--dr-t1);}

/* Clause card button — stacked card style */
.dr-cl-nav-clause{
  width:100%;display:flex;flex-direction:column;align-items:flex-start;gap:4px;
  padding:10px 14px 10px 22px;
  background:var(--dr-card);
  border:none;border-left:3px solid transparent;
  border-bottom:1px solid var(--dr-border-lt);
  cursor:pointer;font-family:inherit;text-align:left;
  transition:all .13s;
}
.dr-cl-nav-clause:hover{background:var(--dr-blue-lt);border-left-color:var(--dr-blue-mid);}
.dr-cl-nav-clause.active{background:var(--dr-blue-lt);border-left-color:var(--dr-blue);}
.dr-cl-nav-cl-top{display:flex;align-items:center;gap:5px;width:100%;}
.dr-cl-nav-cl-id{font-family:var(--dr-mono);font-size:10px;font-weight:700;color:var(--dr-purple);background:var(--dr-purple-lt);border:1px solid #c5c8f5;padding:1px 6px;border-radius:3px;}
.dr-cl-nav-risk{font-size:9px;font-weight:700;padding:1px 6px;border-radius:10px;margin-left:auto;}
.dr-cl-risk-high{background:var(--dr-red-lt);color:var(--dr-red);}
.dr-cl-risk-medium{background:var(--dr-amber-lt);color:var(--dr-amber);}
.dr-cl-risk-low{background:var(--dr-green-lt);color:var(--dr-green);}
.dr-cl-nav-dept{font-size:9px;font-weight:700;color:var(--dr-blue);background:var(--dr-blue-lt);border:1px solid var(--dr-blue-mid);padding:1px 6px;border-radius:10px;}
.dr-cl-nav-cl-text{font-size:11px;color:var(--dr-t2);line-height:1.45;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:210px;}

/* RIGHT WORKSPACE */
.dr-cl-workspace{flex:1;overflow-y:auto;display:flex;flex-direction:column;}
.dr-cl-ws-placeholder{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:40px;gap:8px;}
.dr-ws-ph-icon{font-size:32px;opacity:.3;}.dr-ws-ph-title{font-size:14px;font-weight:700;color:var(--dr-t3);}
.dr-ws-ph-sub{font-size:12px;color:#c0c7d6;max-width:240px;line-height:1.6;}
.dr-cl-ws-inner{padding:22px 26px;display:flex;flex-direction:column;gap:14px;}

/* ── CLAUSE HEADER CARD (matches clause-panel-v2 .cl-ws-clause-card) */
.dr-ws-clause-card{background:var(--dr-card);border:1.5px solid var(--dr-border);border-radius:12px;overflow:hidden;box-shadow:var(--dr-sh);}
.dr-wc-header{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;padding:13px 16px 10px;background:var(--dr-nav);border-bottom:1px solid var(--dr-border-lt);}
.dr-wc-header-left{display:flex;flex-direction:column;gap:6px;}
.dr-wc-header-right{display:flex;align-items:center;gap:7px;flex-shrink:0;}
.dr-cl-ws-bc{display:flex;align-items:center;gap:6px;}
.dr-ws-bc-ch{font-size:11px;color:var(--dr-t3);}
.dr-ws-bc-sep{font-size:11px;color:var(--dr-border-lt);}
.dr-ws-bc-id{font-family:var(--dr-mono);font-size:11px;font-weight:700;color:var(--dr-blue);}
.dr-wc-badges{display:flex;align-items:center;gap:6px;flex-wrap:wrap;}
.dr-wc-badge{padding:3px 9px;border-radius:4px;font-size:10px;font-weight:700;border:1px solid;}
.dr-wc-risk-high{background:var(--dr-red-lt);border-color:#f5b8b8;color:var(--dr-red);}
.dr-wc-risk-medium{background:var(--dr-amber-lt);border-color:#fcd34d;color:var(--dr-amber);}
.dr-wc-risk-low{background:var(--dr-green-lt);border-color:#6ee7b7;color:var(--dr-green);}
.dr-wc-dept{background:#eef1fd;border-color:#c5cff8;color:var(--dr-purple);}
.dr-wc-status{background:var(--dr-nav);border-color:var(--dr-border);color:var(--dr-t2);}
.dr-wc-info-btn{width:27px;height:27px;border-radius:50%;background:var(--dr-nav);border:1px solid var(--dr-border);display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--dr-t3);transition:all .12s;flex-shrink:0;}
.dr-wc-info-btn:hover,.dr-wc-info-btn-active{background:var(--dr-blue-lt);border-color:var(--dr-blue);color:var(--dr-blue);}

/* clause text — 10-line clamp */
.dr-wc-text{font-size:13.5px;font-weight:500;color:var(--dr-t1);line-height:1.75;padding:13px 16px 4px;}
.dr-txt-clamped{display:-webkit-box;-webkit-line-clamp:10;-webkit-box-orient:vertical;overflow:hidden;}
.dr-view-more-btn{margin:0 16px 10px;background:none;border:none;padding:0;font-family:inherit;font-size:12px;font-weight:700;color:var(--dr-blue);cursor:pointer;display:block;}
.dr-view-more-btn:hover{text-decoration:underline;}

/* metadata table */
.dr-meta-table-wrap{margin:0 16px 12px;border:1px solid var(--dr-border-lt);border-radius:6px;overflow:hidden;animation:fadeInDR .15s ease;}
@keyframes fadeInDR{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:none}}
.dr-meta-table-inner{display:grid;grid-template-columns:1fr 1fr 1fr;}
.dr-meta-row{padding:8px 11px;border-right:1px solid var(--dr-border-lt);border-bottom:1px solid var(--dr-border-lt);display:flex;flex-direction:column;gap:2px;background:#fbfcfd;}
.dr-meta-row:nth-child(3n){border-right:none;}
.dr-meta-row:nth-last-child(-n+3){border-bottom:none;}
.dr-meta-label{font-size:9px;font-weight:700;color:var(--dr-t3);text-transform:uppercase;letter-spacing:.06em;}
.dr-meta-value{font-size:11.5px;font-weight:600;color:var(--dr-t1);}

/* mapped refs — always visible strip */
.dr-mapped-refs{display:flex;align-items:center;flex-wrap:wrap;gap:6px;padding:8px 14px;background:#fdf9ff;border:1px solid #ede9fe;border-radius:8px;min-height:34px;}
.dr-mapped-label{font-size:9px;font-weight:700;color:var(--dr-t3);text-transform:uppercase;letter-spacing:.05em;}
.dr-mapped-empty{font-size:11px;color:#c4c8d4;font-style:italic;}
.dr-mapped-chip{display:inline-flex;align-items:center;gap:4px;padding:2px 9px;background:var(--dr-purple-lt);border:1px solid #c4b5fd;border-radius:20px;font-size:10px;font-weight:600;color:var(--dr-purple);}
.dr-mapped-chip-sm{font-size:9px;padding:1px 7px;}

/* controls bar */
.dr-clause-controls{display:flex;align-items:flex-start;gap:12px;padding:9px 11px;background:#f5f6f8;border-radius:var(--dr-r);flex-wrap:wrap;}
.dr-ctrl-group{display:flex;align-items:center;gap:6px;}
.dr-ctrl-label{font-size:9px;font-weight:700;color:var(--dr-t3);text-transform:uppercase;letter-spacing:.05em;white-space:nowrap;}
.dr-ctrl-select{padding:4px 8px;background:#fff;border:1px solid var(--dr-border);border-radius:5px;font-family:inherit;font-size:11px;color:var(--dr-t1);outline:none;cursor:pointer;}
.dr-tags-ctrl{display:flex;align-items:center;flex-wrap:wrap;gap:5px;flex:1;}
.dr-tags-list{display:flex;flex-wrap:wrap;gap:4px;}
.dr-ctag{display:inline-flex;align-items:center;gap:3px;padding:2px 8px;background:var(--dr-blue-lt);border:1px solid var(--dr-blue-mid);border-radius:20px;font-size:10px;font-weight:600;color:var(--dr-blue);}
.dr-ctag button{background:none;border:none;color:var(--dr-t3);cursor:pointer;font-size:11px;padding:0;line-height:1;}
.dr-tag-input{padding:3px 7px;background:#fff;border:1px solid var(--dr-border);border-radius:5px;font-family:inherit;font-size:11px;outline:none;width:70px;}
.dr-tag-input:focus{border-color:var(--dr-blue);}
.dr-tag-add-btn{padding:3px 7px;background:#f5f6f8;border:1px solid var(--dr-border);border-radius:4px;font-size:11px;cursor:pointer;color:var(--dr-t2);font-weight:700;}

/* obligations */
.dr-ws-section{display:flex;flex-direction:column;gap:8px;}
.dr-ws-section-head{display:flex;align-items:center;justify-content:space-between;}
.dr-ws-section-label{font-size:10px;font-weight:800;color:var(--dr-t3);text-transform:uppercase;letter-spacing:.1em;}
.dr-ws-oblig-list{display:flex;flex-direction:column;gap:8px;}
.dr-oblig-item{border:1px solid var(--dr-border);border-radius:var(--dr-r);overflow:hidden;background:var(--dr-card);}
.dr-oblig-trigger{width:100%;display:flex;align-items:center;justify-content:space-between;padding:11px 14px;background:var(--dr-nav);border:none;cursor:pointer;font-family:inherit;gap:10px;text-align:left;transition:background .12s;}
.dr-oblig-trigger:hover{background:var(--dr-bg);}
.dr-oblig-trigger-left{display:flex;align-items:flex-start;gap:9px;flex:1;min-width:0;}
.dr-oblig-badge{flex-shrink:0;min-width:24px;height:24px;background:var(--dr-purple);color:#fff;border-radius:5px;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;margin-top:1px;}
.dr-oblig-preview{font-size:13px;font-weight:500;color:var(--dr-t1);line-height:1.5;}
.dr-oblig-arr{font-size:10px;color:var(--dr-t3);flex-shrink:0;}
.dr-oblig-body{display:none;border-top:1px solid var(--dr-border-lt);padding:12px 14px;flex-direction:column;gap:10px;}
.dr-oblig-body.open{display:flex;}
.dr-oblig-text-full{font-size:13px;color:var(--dr-t1);line-height:1.7;outline:none;}
.dr-oblig-text-full:focus{outline:1.5px dashed var(--dr-blue-mid);border-radius:4px;padding:2px 6px;}
.dr-oblig-controls{display:flex;flex-direction:column;gap:7px;padding:8px 10px;background:#f8f9fb;border:1px solid var(--dr-border-lt);border-radius:6px;}
.dr-oblig-tags-row{display:flex;align-items:center;flex-wrap:wrap;gap:6px;}
.dr-oblig-actions-row{display:flex;align-items:center;gap:8px;}
.dr-oblig-del{padding:4px 10px;font-size:11px;border:1px solid #f5b8b8;border-radius:5px;color:var(--dr-red);background:none;cursor:pointer;}
.dr-oblig-del:hover{background:var(--dr-red-lt);}
.dr-actions-wrap{display:flex;flex-direction:column;gap:6px;}
.dr-nb-label-row{display:flex;align-items:center;justify-content:space-between;margin-bottom:4px;}
.dr-nb-label{font-size:10px;font-weight:700;color:var(--dr-t3);text-transform:uppercase;letter-spacing:.06em;}
.dr-actions-count{display:inline-flex;align-items:center;justify-content:center;min-width:17px;height:17px;padding:0 3px;background:#e8ebf1;color:var(--dr-t2);border-radius:9px;font-size:9px;font-weight:700;margin-left:4px;}
.dr-actions-list{display:flex;flex-direction:column;gap:5px;}
.dr-action-row{display:flex;align-items:flex-start;gap:7px;padding:7px 9px;background:var(--dr-card);border:1px solid var(--dr-border-lt);border-radius:5px;}
.dr-action-num{flex-shrink:0;width:19px;height:19px;background:var(--dr-blue-lt);color:var(--dr-blue);border:1px solid var(--dr-blue-mid);border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:700;margin-top:1px;}
.dr-action-txt{flex:1;font-size:12px;color:var(--dr-t1);line-height:1.6;outline:none;}
.dr-action-txt:focus{outline:1.5px dashed var(--dr-blue-mid);border-radius:3px;padding:1px 4px;}
.dr-add-sub-btn{padding:3px 10px;background:#fff;border:1.5px solid var(--dr-border);border-radius:5px;font-family:inherit;font-size:10px;font-weight:700;color:var(--dr-t2);cursor:pointer;transition:all .12s;}
.dr-add-sub-btn:hover{border-color:var(--dr-purple);color:var(--dr-purple);}
.dr-empty-hint{font-size:11px;color:#c4c8d4;font-style:italic;padding:4px 0;}
.dr-editable:focus{outline:1.5px dashed var(--dr-blue-mid);border-radius:4px;padding:2px 5px;}

/* ══ FLAT CHAPTER BUTTON (new nav) ══ */
.dr-cl-nav-ch-flat-btn{flex:1;display:flex;align-items:center;gap:7px;padding:10px 8px 10px 14px;background:none;border:none;cursor:pointer;font-family:inherit;text-align:left;transition:background .1s;min-width:0;border-left:3px solid transparent;}
.dr-cl-nav-ch-flat-btn:hover{background:var(--dr-bg);}
.dr-cl-nav-ch-active{background:var(--dr-blue-lt)!important;border-left-color:var(--dr-blue)!important;}
.dr-cl-nav-ch-active .dr-cl-nav-ch-num{color:var(--dr-blue);}

/* ══ SECTION ACCORDION (right panel) ══ */
.dr-sec-accordion{border-bottom:1px solid var(--dr-border-lt);}
.dr-sec-acc-btn{width:100%;display:flex;align-items:center;gap:8px;padding:11px 18px;background:var(--dr-nav);border:none;cursor:pointer;font-family:inherit;text-align:left;transition:background .12s;}
.dr-sec-acc-btn:hover,.dr-sec-acc-active{background:var(--dr-blue-lt);}
.dr-sec-acc-icon{font-size:10px;font-weight:700;color:var(--dr-blue);background:var(--dr-blue-lt);border:1px solid var(--dr-blue-mid);padding:1px 5px;border-radius:3px;flex-shrink:0;}
.dr-sec-acc-active .dr-sec-acc-icon{background:var(--dr-blue);color:#fff;border-color:var(--dr-blue);}
.dr-sec-acc-label{flex:1;font-size:12px;font-weight:600;color:var(--dr-t1);}
.dr-sec-acc-count{font-size:10px;color:var(--dr-t3);background:#e8ebf1;padding:1px 7px;border-radius:9px;flex-shrink:0;}
.dr-sec-acc-arrow{flex-shrink:0;color:var(--dr-t3);transition:transform .2s;display:flex;align-items:center;}
.dr-sec-acc-active .dr-sec-acc-arrow{transform:rotate(180deg);}
.dr-sec-acc-body{display:none;background:#fff;}
.dr-sec-acc-body.open{display:block;}

/* ══ CLAUSE ACCORDION (right panel) ══ */
.dr-ch-content-wrap{display:flex;flex-direction:column;}
.dr-cl-accordion{border-bottom:1px solid var(--dr-border-lt);}
.dr-cl-acc-btn{width:100%;display:flex;align-items:center;gap:10px;padding:11px 18px;background:#fff;border:none;cursor:pointer;font-family:inherit;text-align:left;transition:background .12s;border-left:3px solid transparent;}
.dr-cl-acc-btn:hover{background:var(--dr-nav);}
.dr-cl-acc-active{background:var(--dr-blue-lt)!important;border-left-color:var(--dr-blue)!important;}
.dr-cl-acc-left{display:flex;align-items:center;gap:6px;flex-shrink:0;}
.dr-cl-acc-right{display:flex;align-items:center;gap:8px;flex:1;min-width:0;}
.dr-cl-acc-preview{flex:1;font-size:11.5px;color:var(--dr-t2);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.dr-cl-acc-arrow{flex-shrink:0;color:var(--dr-t3);transition:transform .2s;display:flex;align-items:center;}
.dr-cl-acc-active .dr-cl-acc-arrow{transform:rotate(180deg);}
.dr-cl-acc-body{display:none;border-top:1px solid var(--dr-border-lt);background:#fafbfc;}
.dr-cl-acc-body.open{display:block;}

/* ══ CLAUSE DETAIL CARD (inside accordion body) ══ */
.dr-cl-detail-card{background:#fff;border:1px solid var(--dr-border-lt);border-radius:var(--dr-r);margin:14px 16px;box-shadow:var(--dr-sh);}
.dr-subcl-detail-card{margin:0;border-radius:0;box-shadow:none;border:none;border-top:1px solid var(--dr-border-lt);background:#fafbfc;}
.dr-cl-detail-top{display:flex;align-items:center;justify-content:space-between;padding:11px 16px;border-bottom:1px solid var(--dr-border-lt);background:var(--dr-nav);}
.dr-cl-detail-id-row{display:flex;align-items:center;gap:7px;flex-wrap:wrap;}
.dr-cl-detail-actions{display:flex;align-items:center;gap:6px;flex-shrink:0;}

/* ══ SUB-CLAUSE TABLE ══ */
.dr-subcl-table-wrap{margin:0 16px 16px;border:1px solid var(--dr-border-lt);border-radius:var(--dr-r);overflow:hidden;}
.dr-subcl-table-title{font-size:9px;font-weight:800;color:var(--dr-t3);text-transform:uppercase;letter-spacing:.1em;padding:8px 14px;background:var(--dr-nav);border-bottom:1px solid var(--dr-border-lt);}
.dr-subcl-table{width:100%;border-collapse:collapse;font-size:12px;}
.dr-subcl-table th{text-align:left;padding:7px 12px;background:#f0f2f7;border-bottom:1px solid var(--dr-border-lt);font-size:10px;font-weight:700;color:var(--dr-t3);text-transform:uppercase;letter-spacing:.04em;}
.dr-subcl-row{cursor:pointer;transition:background .12s;}
.dr-subcl-row td{padding:9px 12px;border-bottom:1px solid var(--dr-border-lt);color:var(--dr-t2);font-size:12px;vertical-align:middle;}
.dr-subcl-row:hover td{background:var(--dr-blue-lt);}
.dr-subcl-row-active td{background:var(--dr-blue-lt);}
.dr-subcl-detail-row td{padding:0;}
.dr-subcl-badge{display:inline-flex;align-items:center;padding:2px 8px;border-radius:10px;font-size:10px;font-weight:700;}
.dr-subcl-badge-reviewed{background:var(--dr-green-lt);color:var(--dr-green);}
.dr-subcl-badge-assigned{background:var(--dr-blue-lt);color:var(--dr-blue);}
.dr-subcl-oblig{display:flex;align-items:flex-start;gap:8px;padding:5px 0;font-size:12px;color:var(--dr-t2);}

/* ══ MULTI-SELECT DEPT DROPDOWN ══ */
.dr-ms-wrap{position:relative;min-width:160px;}
.dr-ms-selected{display:flex;flex-wrap:wrap;align-items:center;gap:4px;padding:4px 8px;background:#fff;border:1px solid var(--dr-border);border-radius:5px;cursor:pointer;min-height:30px;transition:border-color .14s;}
.dr-ms-selected:hover{border-color:var(--dr-blue);}
.dr-ms-chip{display:inline-flex;align-items:center;gap:3px;padding:2px 7px;background:var(--dr-blue-lt);border:1px solid var(--dr-blue-mid);border-radius:20px;font-size:10px;font-weight:600;color:var(--dr-blue);}
.dr-ms-chip button{background:none;border:none;color:var(--dr-t3);cursor:pointer;font-size:11px;padding:0;line-height:1;}
.dr-ms-placeholder{font-size:11px;color:var(--dr-t3);font-style:italic;}
.dr-ms-dropdown{display:none;position:absolute;top:calc(100% + 3px);left:0;z-index:200;background:#fff;border:1px solid var(--dr-border);border-radius:7px;box-shadow:0 4px 16px rgba(0,0,0,.12);min-width:180px;padding:4px 0;max-height:200px;overflow-y:auto;}
.dr-ms-dropdown.open{display:block;}
.dr-ms-opt{display:flex;align-items:center;gap:8px;padding:7px 12px;font-size:12px;color:var(--dr-t1);cursor:pointer;transition:background .1s;}
.dr-ms-opt:hover{background:var(--dr-blue-lt);}
.dr-ms-opt input{accent-color:var(--dr-blue);}

/* ══ STATUS SELECT ══ */
.dr-status-sel option[value="Reviewed & Applicable"]{color:var(--dr-green);}
.dr-status-sel option[value="Assigned"]{color:var(--dr-blue);}

.dr-map-btn{padding:4px 11px;background:var(--dr-purple-lt);border:1.5px solid #c4b5fd;border-radius:5px;font-family:inherit;font-size:10px;font-weight:700;color:var(--dr-purple);cursor:pointer;transition:all .13s;}
.dr-map-btn:hover{background:#ede9fe;border-color:var(--dr-purple);}
.ml-tbl-toolbar{display:flex;align-items:center;justify-content:space-between;padding:10px 16px;border-bottom:1px solid var(--dr-border-lt);background:var(--dr-nav);}
.ml-tbl-count{font-size:12px;font-weight:600;color:var(--dr-t2);}
.ml-action-row:hover td{background:var(--dr-blue-lt);}
.ml-row-kebab-wrap{position:relative;}
.ml-row-kebab-btn{background:none;border:1px solid var(--dr-border);border-radius:5px;width:26px;height:26px;cursor:pointer;font-size:14px;color:var(--dr-t3);display:flex;align-items:center;justify-content:center;transition:all .12s;}
.ml-row-kebab-btn:hover{background:var(--dr-nav);color:var(--dr-t1);}
.ml-row-kebab-menu{position:absolute;right:0;top:calc(100% + 3px);background:#fff;border:1px solid var(--dr-border);border-radius:7px;box-shadow:0 4px 16px rgba(0,0,0,.12);min-width:160px;z-index:500;overflow:hidden;}
.ml-rkm-item{display:block;width:100%;padding:8px 14px;background:none;border:none;text-align:left;font-family:inherit;font-size:12px;font-weight:600;color:var(--dr-t2);cursor:pointer;transition:background .1s;}
.ml-rkm-item:hover{background:var(--dr-blue-lt);color:var(--dr-t1);}
.ml-reg-toggle-btn{background:none;border:none;font-family:inherit;font-size:12px;font-weight:700;color:var(--dr-blue);cursor:pointer;padding:10px 0;display:flex;align-items:center;gap:6px;}
.ml-reg-toggle-btn:hover{text-decoration:underline;}
.dr-not-saved{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;padding:56px 24px;background:#fff;border:2px dashed var(--dr-border);border-radius:var(--dr-r-lg);text-align:center;}
.dr-ns-icon{font-size:32px;opacity:.4;}.dr-ns-title{font-size:14px;font-weight:700;}
.dr-ns-sub{font-size:12px;color:var(--dr-t3);max-width:280px;line-height:1.5;}

/* MAP MODAL */
.dr-modal-overlay{position:fixed;inset:0;background:rgba(20,25,40,.45);z-index:9999;display:flex;align-items:flex-start;justify-content:center;padding:40px 16px;overflow-y:auto;backdrop-filter:blur(2px);}
.dr-modal{background:#fff;border-radius:var(--dr-r-lg);width:100%;max-width:740px;max-height:85vh;display:flex;flex-direction:column;overflow:hidden;box-shadow:0 24px 64px rgba(0,0,0,.2);font-family:inherit;}
.dr-modal-head{padding:16px 20px;border-bottom:1px solid var(--dr-border-lt);display:flex;align-items:flex-start;justify-content:space-between;flex-shrink:0;}
.dr-modal-head-left{flex:1;min-width:0;}
.dr-modal-eyebrow{font-size:10px;font-weight:700;color:var(--dr-purple);text-transform:uppercase;letter-spacing:.08em;margin-bottom:5px;}
.dr-modal-subject{font-size:13px;font-weight:700;line-height:1.5;}
.dr-modal-close{background:none;border:none;cursor:pointer;font-size:18px;color:var(--dr-t3);padding:2px 6px;flex-shrink:0;}
.dr-modal-close:hover{color:var(--dr-t1);}
.dr-modal-mapped-bar{display:flex;align-items:center;flex-wrap:wrap;gap:6px;padding:10px 20px;background:#fdf9ff;border-bottom:1px solid #ede9fe;}
.dr-modal-mapped-label{font-size:10px;font-weight:700;color:var(--dr-t3);text-transform:uppercase;letter-spacing:.05em;}
.dr-modal-search-bar{padding:10px 16px;border-bottom:1px solid var(--dr-border-lt);flex-shrink:0;}
.dr-modal-search{width:100%;padding:8px 12px;background:#f5f6f8;border:1.5px solid var(--dr-border);border-radius:7px;font-family:inherit;font-size:13px;outline:none;box-sizing:border-box;transition:border-color .14s;}
.dr-modal-search:focus{border-color:var(--dr-purple);background:#fff;}
.dr-modal-body{overflow-y:auto;flex:1;}
.dr-map-table{width:100%;border-collapse:collapse;font-size:12px;}
.dr-map-table th{text-align:left;padding:8px 14px;background:#f5f6f8;border-bottom:1px solid var(--dr-border);font-size:10px;font-weight:700;color:var(--dr-t3);text-transform:uppercase;letter-spacing:.04em;position:sticky;top:0;}
.dr-map-table td{padding:10px 14px;border-bottom:1px solid #f5f6f8;vertical-align:top;}
.dr-map-row:hover{background:#fdfcff;}.dr-map-row-mapped{background:#fdf9ff;}
.dr-map-cid{font-family:var(--dr-mono);font-size:11px;font-weight:700;color:var(--dr-purple);background:var(--dr-purple-lt);border:1px solid #e0e7ff;padding:2px 7px;border-radius:4px;}
.dr-map-circ-id{font-family:var(--dr-mono);font-size:10px;font-weight:700;margin-bottom:2px;}
.dr-map-circ-title{font-size:11px;color:var(--dr-t3);}
.dr-map-ch{font-size:11px;color:var(--dr-t3);}.dr-map-text{font-size:12px;color:var(--dr-t2);line-height:1.5;}
.dr-map-row-btn{padding:4px 12px;background:#fff;border:1.5px solid #c4b5fd;border-radius:5px;font-family:inherit;font-size:10px;font-weight:700;color:var(--dr-purple);cursor:pointer;transition:all .13s;white-space:nowrap;}
.dr-map-row-btn:hover{background:var(--dr-purple-lt);}.dr-map-row-btn.mapped{background:var(--dr-purple-lt);border-color:var(--dr-purple);color:#6d28d9;}
.dr-modal-foot{padding:12px 20px;border-top:1px solid var(--dr-border-lt);background:var(--dr-nav);display:flex;align-items:center;justify-content:space-between;gap:12px;flex-shrink:0;}
.dr-modal-foot-note{font-size:11px;color:var(--dr-t3);flex:1;}
.ml-obl-id{font-family:var(--dr-mono);font-size:10px;font-weight:700;color:var(--dr-purple);background:var(--dr-purple-lt);border:1px solid #c5c8f5;padding:2px 8px;border-radius:4px;display:inline-block;}
.ml-dept-chip-inline{font-size:11px;font-weight:600;color:var(--dr-blue);background:var(--dr-blue-lt);border:1px solid var(--dr-blue-mid);padding:2px 9px;border-radius:10px;}
.ml-icon-btn{width:28px;height:28px;border-radius:6px;border:1.5px solid var(--dr-border);background:#fff;cursor:pointer;font-size:13px;display:inline-flex;align-items:center;justify-content:center;transition:all .13s;color:var(--dr-t2);}
.ml-icon-btn:hover{border-color:var(--dr-blue);color:var(--dr-blue);background:var(--dr-blue-lt);}
.ml-edit-btn:hover{border-color:var(--dr-purple);color:var(--dr-purple);background:var(--dr-purple-lt);}
.ml-assignee-wrap{position:relative;}
.ml-assignee-btn{padding:4px 10px;background:#fff;border:1.5px solid var(--dr-border);border-radius:6px;font-family:inherit;font-size:11px;font-weight:600;color:var(--dr-t1);cursor:pointer;white-space:nowrap;transition:border-color .13s;}
.ml-assignee-btn:hover{border-color:var(--dr-blue);}
.ml-assignee-drop{position:absolute;top:calc(100% + 4px);left:0;z-index:300;background:#fff;border:1.5px solid var(--dr-border);border-radius:8px;box-shadow:0 6px 20px rgba(0,0,0,.12);min-width:180px;overflow:hidden;}
.ml-assignee-search{width:100%;padding:8px 10px;border:none;border-bottom:1px solid var(--dr-border-lt);font-family:inherit;font-size:12px;outline:none;background:#f8f9fb;box-sizing:border-box;}
.ml-assignee-list{max-height:160px;overflow-y:auto;}
.ml-assignee-opt{padding:8px 12px;font-size:12px;color:var(--dr-t1);cursor:pointer;transition:background .1s;}
.ml-assignee-opt:hover{background:var(--dr-blue-lt);}
.ml-assignee-active{background:var(--dr-blue-lt);color:var(--dr-blue);font-weight:700;}
.ml-status-assigned{background:var(--dr-green-lt);color:var(--dr-green);border:none;border-radius:5px;font-weight:700;}
.ml-status-review{background:var(--dr-amber-lt);color:var(--dr-amber);border:none;border-radius:5px;font-weight:700;}
.ml-status-na{background:#f3f4f6;color:#6b7280;border:none;border-radius:5px;font-weight:700;}
.ml-status-unassigned{background:var(--dr-red-lt);color:var(--dr-red);border:none;border-radius:5px;font-weight:700;}
 `;
  document.head.appendChild(s);
}