
// /**
//  * draft-review-updated.js  — v3
//  *
//  * Changes:
//  *  1. Executive Summary — accordion trigger restructured: label+badge LEFT, addItem+arrow RIGHT
//  *     No more overflow. Arrow is its own element outside the trigger button.
//  *  2. Clause Generation — completely redesigned to match clause-panel.js quality:
//  *     - Clean split pane: left nav (chapters collapsed) + right workspace
//  *     - Upload Excel + Add Chapter clearly labeled in toolbar
//  *     - Obligation level: tag input + map-to-clause (not circular)
//  *     - All edit/add/delete functionality preserved
//  */

// window._savedFlow    = window._savedFlow    || {};
// window._draftStore   = window._draftStore   || {};
// window._mappedClauses= window._mappedClauses|| {};
// window._mappedObligs = window._mappedObligs || {};

// function _seedSavedFlow(circ) {
//   if (!circ || window._savedFlow[circ.id]) return;
//   var id = circ.id;
//   window._savedFlow[id] = {
//     circularId: id,
//     overview: { ...circ },
//     applicability: {
//       applicable: true, verdict: 'Applicable',
//       entityType: 'NBFC', scope: 'Full — All parameters',
//       deadline: circ.deadline || '2025-03-31',
//       owner: 'Chief Compliance Officer',
//       notes: 'Applies to all NBFCs with asset size above ₹500 Cr. Full compliance required across all departments.',
//       threshold: 'Asset size ≥ ₹500 Cr; Deposit-taking NBFCs; All licensed payment aggregators',
//       requirements: [
//         'Board-approved compliance policy within 30 days',
//         'Designated Compliance Officer with Board reporting',
//         'Monthly regulatory reporting by 7th of each month',
//         'Real-time transaction monitoring system',
//         'Annual third-party compliance audit',
//       ],
//       entities: [
//         { name:'Head Office',       type:'Primary',   applicable:true  },
//         { name:'Branch Operations', type:'Secondary', applicable:true  },
//         { name:'Treasury',          type:'Secondary', applicable:false },
//         { name:'IT Division',       type:'Support',   applicable:true  },
//       ],
//       requirementsApplicability: [
//         { requirement:'Board-approved Compliance Policy',       applicable:true,  threshold:'All regulated entities',         status:'In Progress' },
//         { requirement:'Designated Compliance Officer',          applicable:true,  threshold:'Asset size ≥ ₹500 Cr',          status:'Pending'     },
//         { requirement:'Monthly Regulatory Reporting',           applicable:true,  threshold:'All licensed NBFCs',             status:'Compliant'   },
//         { requirement:'Real-time Transaction Monitoring',       applicable:true,  threshold:'Turnover > ₹100 Cr',            status:'Pending'     },
//         { requirement:'Annual Third-party Compliance Audit',    applicable:true,  threshold:'All regulated entities',         status:'Compliant'   },
//         { requirement:'Customer Grievance Redressal Framework', applicable:false, threshold:'Deposit-taking entities only',   status:'Exempt'      },
//       ],
//     },
//     summary: {
//       audience:'Senior Management', depth:'Detailed',
//       purpose:'This circular issued by ' + (circ.regulator||'the Regulator') + ' mandates enhanced compliance requirements for regulated entities. The directive addresses critical governance gaps identified during supervisory reviews and introduces structured obligations across operational, technological, and reporting domains.',
//       keyUpdates:[
//         'Enhanced KYC/AML requirements with stricter verification timelines',
//         'Mandatory Board-level compliance committee with quarterly reporting',
//         'Real-time transaction monitoring system implementation required',
//         'New customer grievance redressal framework within 30 days',
//         'Annual third-party audit of compliance infrastructure mandated',
//       ],
//       risks:[
//         { level:'High',   text:'Penalty up to ₹10 Cr for non-submission of reports' },
//         { level:'High',   text:'License revocation risk for repeated non-compliance' },
//         { level:'Medium', text:'Reputational risk if customer-facing changes delayed' },
//         { level:'Low',    text:'Minor operational disruption during system migration' },
//       ],
//       immediateActions:[
//         'Appoint designated Compliance Officer within 15 days',
//         'Update all customer-facing policies and disclosures',
//         'Submit initial compliance status report to regulator',
//         'Conduct all-staff awareness training within 60 days',
//       ],
//       orgImpact:{
//         departments:4, headcount:120, systems:3, budget:'₹45L',
//         description:'Impacts Compliance, IT, Operations and Legal departments. Requires system upgrades, policy redrafts, and dedicated compliance headcount addition.',
//       },
//       technical:[
//         'Transaction monitoring system upgrade to real-time processing',
//         'API integration with regulatory reporting portal',
//         'Data encryption upgrade for customer PII fields',
//         'Audit trail logging enabled across all core banking modules',
//         'Access control matrix revamp for compliance-sensitive functions',
//       ],
//     },
//     clauses: circ.chapters && circ.chapters.length ? circ.chapters : _buildDemoClauses(),
//   };
// }

// function _buildDemoClauses() {
//   return [
//     { title:'Chapter 1 — Governance & Policy', clauses:[
//       { id:'1.1', text:'The entity shall maintain a Board-approved compliance policy covering all aspects of this circular, reviewed annually.', risk:'High',   department:'Compliance', status:'Pending',     obligation:'Maintain and review Board-approved compliance policy', actionable:'Draft policy;Present to Board;Distribute to departments;Schedule annual review' },
//       { id:'1.2', text:'A designated Compliance Officer shall be appointed with direct reporting to the Board Audit Committee.',               risk:'High',   department:'Legal',      status:'In Progress', obligation:'Appoint Compliance Officer with Board reporting line',    actionable:'Identify candidate;Issue appointment letter;Notify regulator;Define mandate' },
//       { id:'1.3', text:'Compliance Committee meetings shall be held at least quarterly with minutes submitted to the regulator.',              risk:'Medium', department:'Compliance', status:'Pending',     obligation:'Conduct quarterly Compliance Committee meetings',         actionable:'Schedule meetings;Prepare agenda;Record minutes;Submit to regulator' },
//     ]},
//     { title:'Chapter 2 — Operational Requirements', clauses:[
//       { id:'2.1', text:'All customer-facing processes must be updated to reflect new regulatory requirements within 30 days of the effective date.', risk:'High',   department:'Operations', status:'Pending',     obligation:'Update customer-facing processes within 30 days',      actionable:'Map all affected processes;Update SOPs;Train frontline staff;Test updated workflows' },
//       { id:'2.2', text:'Transaction monitoring systems shall be upgraded to detect and report suspicious activity in real-time.',                    risk:'High',   department:'IT',         status:'In Progress', obligation:'Upgrade transaction monitoring to real-time detection', actionable:'Assess current system gaps;Procure upgraded solution;UAT testing;Go-live sign-off' },
//     ]},
//     { title:'Chapter 3 — Reporting & Disclosure', clauses:[
//       { id:'3.1', text:'Monthly compliance status reports shall be submitted to the regulator in the prescribed format by the 7th of each month.', risk:'High',   department:'Compliance', status:'Pending',     obligation:'Submit monthly compliance reports by 7th of each month', actionable:'Build reporting template;Establish data pipeline;Implement maker-checker;Set deadline alerts' },
//       { id:'3.2', text:'Annual third-party audit of the compliance infrastructure must be completed and findings submitted to the Board.',          risk:'Medium', department:'Legal',      status:'Pending',     obligation:'Commission annual third-party compliance audit',          actionable:'Identify audit firm;Define audit scope;Facilitate audit process;Present findings to Board' },
//     ]},
//   ];
// }

// /* ================================================================ MAIN RENDER */
// function renderAISuggestionPage() {
//   var area = document.getElementById('content-area');
//   if (!area) return;
//   if (!CMS_DATA || !CMS_DATA.circulars || !CMS_DATA.circulars.length) {
//     area.innerHTML = '<div style="padding:40px;text-align:center;color:#9499aa;">No Circular Data Available</div>';
//     return;
//   }
//   injectDraftReviewCSS();

//   area.innerHTML =
//     '<div class="dr-page">' +
//     '<div class="dr-page-head">' +
//       '<div>' +
//         '<div class="dr-page-title">Compliance Draft Review</div>' +
//         '<div class="dr-page-sub">Review and edit saved AI Engine output &middot; Tag &middot; Map &middot; Assign &middot; Publish</div>' +
//       '</div>' +
//       '<div class="dr-head-actions">' +
//         '<button class="dr-btn dr-btn-sec" onclick="saveDraftReview()">&#x1F4BE; Save Draft</button>' +
//         '<button class="dr-btn dr-btn-pri" onclick="publishToLibrary()">&#x1F4DA; Add to Central Library</button>' +
//       '</div>' +
//     '</div>' +
//     '<div class="dr-picker-card">' +
//       '<div class="dr-picker-icon">&#x1F4CB;</div>' +
//       '<div class="dr-picker-inner">' +
//         '<div class="dr-picker-label">Select Circular to Review</div>' +
//         '<div class="dr-custom-select-wrap" id="dr-csel-wrap">' +
//           '<button class="dr-custom-select-btn" id="dr-csel-btn">' +
//             '<span id="dr-csel-text" class="dr-csel-placeholder">Choose a circular\u2026</span>' +
//             '<span class="dr-csel-arrow">&#9662;</span>' +
//           '</button>' +
//           '<div class="dr-custom-dropdown" id="dr-csel-dropdown" style="display:none;">' +
//             '<div class="dr-csel-search-wrap"><input class="dr-csel-search" id="dr-csel-search" placeholder="Search\u2026" autocomplete="off"/></div>' +
//             '<div class="dr-csel-list" id="dr-csel-list">' +
//               CMS_DATA.circulars.map(function(c) {
//                 var riskCls = c.risk ? ' dr-csel-risk-' + c.risk.toLowerCase() : '';
//                 return '<div class="dr-csel-item" data-id="' + c.id + '">' +
//                   '<div class="dr-csel-item-top">' +
//                     '<span class="dr-csel-item-id">' + c.id + '</span>' +
//                     (c.risk ? '<span class="dr-csel-risk' + riskCls + '">' + c.risk + '</span>' : '') +
//                     '<span class="dr-csel-reg">' + (c.regulator||'') + '</span>' +
//                   '</div>' +
//                   '<div class="dr-csel-item-title">' + c.title + '</div>' +
//                 '</div>';
//               }).join('') +
//             '</div>' +
//           '</div>' +
//         '</div>' +
//       '</div>' +
//       '<div id="dr-status-badge" class="dr-status-badge" style="display:none;"></div>' +
//     '</div>' +
//     '<div id="dr-body" style="display:none;">' +
//       '<div class="dr-stepper" id="dr-stepper">' +
//         ['Overview','Applicability','Executive Summary','Clause Generation'].map(function(s,i) {
//           return '<button class="dr-step-btn' + (i===0?' active':'') + '" data-step="' + i + '">' +
//             '<span class="dr-step-num">' + (i+1) + '</span>' +
//             '<span class="dr-step-label">' + s + '</span>' +
//           '</button>' + (i<3?'<div class="dr-step-line"></div>':'');
//         }).join('') +
//       '</div>' +
//       '<div id="dr-panel-area"></div>' +
//     '</div>' +
//     '</div>';

//   _initCustomSelect();
// }

// function _initCustomSelect() {
//   var btn      = document.getElementById('dr-csel-btn');
//   var dropdown = document.getElementById('dr-csel-dropdown');
//   var search   = document.getElementById('dr-csel-search');
//   var list     = document.getElementById('dr-csel-list');
//   var text     = document.getElementById('dr-csel-text');
//   var selected = null;

//   if (btn) btn.addEventListener('click', function(e) {
//     e.stopPropagation();
//     var open = dropdown.style.display !== 'none';
//     dropdown.style.display = open ? 'none' : 'block';
//     if (!open && search) search.focus();
//   });

//   document.addEventListener('click', function(e) {
//     var wrap = document.getElementById('dr-csel-wrap');
//     if (wrap && !wrap.contains(e.target) && dropdown) dropdown.style.display = 'none';
//   });

//   if (search) search.addEventListener('input', function() {
//     var q = search.value.toLowerCase();
//     if (list) list.querySelectorAll('.dr-csel-item').forEach(function(item) {
//       item.style.display = item.textContent.toLowerCase().includes(q) ? 'block' : 'none';
//     });
//   });

//   if (list) list.querySelectorAll('.dr-csel-item').forEach(function(item) {
//     item.addEventListener('click', function() {
//       selected = item.dataset.id;
//       var circ = CMS_DATA.circulars.find(function(c) { return c.id === selected; });
//       if (!circ) return;
//       text.textContent = circ.id + ' \u2014 ' + circ.title;
//       text.classList.remove('dr-csel-placeholder');
//       dropdown.style.display = 'none';
//       _seedSavedFlow(circ);
//       document.getElementById('dr-body').style.display = 'block';
//       _drRenderStep(0, circ.id);
//       _drUpdateBadge(circ.id);
//       list.querySelectorAll('.dr-csel-item').forEach(function(i) { i.classList.remove('selected'); });
//       item.classList.add('selected');
//     });
//   });

//   document.addEventListener('click', function(e) {
//     var stepBtn = e.target.closest('.dr-step-btn');
//     if (!stepBtn || !selected) return;
//     document.querySelectorAll('.dr-step-btn').forEach(function(b) { b.classList.remove('active'); });
//     stepBtn.classList.add('active');
//     _drRenderStep(parseInt(stepBtn.dataset.step), selected);
//   });
// }

// window._drGoNext = function(currentStep) {
//   var next = document.querySelector('[data-step="' + (currentStep+1) + '"]');
//   if (next) next.click();
//   var stepper = document.getElementById('dr-stepper');
//   if (stepper) stepper.scrollIntoView({ behavior:'smooth', block:'nearest' });
// };

// function _drRenderStep(step, circId) {
//   var flow  = window._savedFlow[circId];
//   var panel = document.getElementById('dr-panel-area');
//   if (!flow || !panel) return;
//   var fns = [_drPanelOverview, _drPanelApplicability, _drPanelSummary, _drPanelClauses];
//   panel.innerHTML = fns[step] ? fns[step](flow, circId) : '';
//   _drBindPanel(step, flow, circId);
// }

// /* ================================================================ PANEL 0 — OVERVIEW */
// function _drPanelOverview(flow) {
//   var c = flow.overview;
//   if (!c) return _drNotSaved('Overview');
//   var fields = [
//     ['Circular ID',c.id],['Regulator',c.regulator||'—'],
//     ['Issue Date',c.issueDate||c.date||'—'],['Effective Date',c.effectiveDate||'—'],
//     ['Risk Level',c.risk||'—'],['Status',c.status||'—'],
//     ['Department',c.department||'—'],['Deadline',c.deadline||'—'],
//   ];
//   var riskCls = c.risk ? ' dr-chip-risk-' + c.risk.toLowerCase() : '';
//   return (
//     '<div class="dr-panel">' +
//     '<div class="dr-panel-toolbar">' +
//       '<div class="dr-panel-title-wrap"><span class="dr-panel-icon">&#x1F4CB;</span><span class="dr-panel-title">Overview</span></div>' +
//       '<div class="dr-toolbar-actions">' +
//         '<label class="dr-tool-btn"><input type="file" style="display:none;" accept=".pdf,.docx"/>&#x1F4C1; Upload Circular</label>' +
//         '<button class="dr-tool-btn dr-tool-edit-toggle" data-target="dr-ov-edit" data-hide="dr-ov-details">&#x270E; Edit</button>' +
//       '</div>' +
//     '</div>' +
//     '<div class="dr-ov-hero">' +
//       '<div class="dr-ov-hero-left">' +
//         '<div class="dr-ov-id">' + c.id + '</div>' +
//         '<div class="dr-ov-title">' + c.title + '</div>' +
//         '<div class="dr-ov-chips">' +
//           '<span class="dr-chip">' + (c.regulator||'N/A') + '</span>' +
//           (c.risk ? '<span class="dr-chip' + riskCls + '">' + c.risk + ' Risk</span>' : '') +
//           (c.status ? '<span class="dr-chip dr-chip-status">' + c.status + '</span>' : '') +
//           (c.type ? '<span class="dr-chip dr-chip-blue">' + c.type + '</span>' : '') +
//         '</div>' +
//       '</div>' +
//       (c.deadline ? '<div class="dr-deadline-box"><div class="dr-dl-label">Compliance Deadline</div><div class="dr-dl-date">' + c.deadline + '</div></div>' : '') +
//     '</div>' +
//     '<div class="dr-edit-drawer" id="dr-ov-edit" style="display:none;">' +
//       '<div class="dr-edit-grid">' +
//         fields.map(function(f) { return '<div class="dr-edit-field"><label class="dr-edit-label">' + f[0] + '</label><input class="dr-edit-input" value="' + f[1] + '"/></div>'; }).join('') +
//         '<div class="dr-edit-field dr-edit-field-full"><label class="dr-edit-label">Summary</label><textarea class="dr-edit-ta">' + (c.summary||'') + '</textarea></div>' +
//         '<div class="dr-edit-field dr-edit-field-full"><label class="dr-edit-label">Tags (comma separated)</label><input class="dr-edit-input" value="' + (c.tags||[]).join(', ') + '"/></div>' +
//       '</div>' +
//       '<div class="dr-edit-foot">' +
//         '<button class="dr-btn dr-btn-ghost" data-close="dr-ov-edit" data-show="dr-ov-details">&#x2715; Cancel</button>' +
//         '<button class="dr-btn dr-btn-pri dr-btn-sm" onclick="showToast(\'Changes saved.\',\'success\');document.getElementById(\'dr-ov-edit\').style.display=\'none\';document.getElementById(\'dr-ov-details\').style.display=\'block\';">&#x2713; Save Changes</button>' +
//       '</div>' +
//     '</div>' +
//     '<div id="dr-ov-details">' +
//       '<div class="dr-detail-grid">' +
//         fields.map(function(f) { return '<div class="dr-detail-cell"><div class="dr-dc-label">' + f[0] + '</div><div class="dr-dc-val">' + f[1] + '</div></div>'; }).join('') +
//       '</div>' +
//       (c.summary ? '<div class="dr-block-pad"><div class="dr-info-block"><div class="dr-ib-label">Summary</div><div class="dr-ib-text">' + c.summary + '</div></div></div>' : '') +
//       ((c.tags||[]).length ? '<div class="dr-tags-row">' + c.tags.map(function(t){return '<span class="dr-tag">'+t+'</span>';}).join('') + '</div>' : '') +
//     '</div>' +
//     '<div class="dr-panel-foot"><span></span><button class="dr-btn dr-btn-next" onclick="_drGoNext(0)">Applicability Analysis &#x2192;</button></div>' +
//     '</div>'
//   );
// }

// /* ================================================================ PANEL 1 — APPLICABILITY */
// function _drPanelApplicability(flow) {
//   var a = flow.applicability;
//   if (!a) return _drNotSaved('Applicability');
//   var vc = a.applicable ? '#15803d' : '#b91c1c';
//   var vb = a.applicable ? '#dcfce7' : '#fee2e2';

//   var entityRows = (a.entities||[]).map(function(e, ei) {
//     return '<tr id="dr-ent-row-' + ei + '">' +
//       '<td><span class="dr-ent-name" id="dr-ent-name-' + ei + '" contenteditable="false" style="outline:none;display:inline-block;min-width:80px;font-weight:600;color:#1a1a2e;">' + e.name + '</span></td>' +
//       '<td><span class="dr-app-pill ' + (e.applicable?'dr-app-yes':'dr-app-no') + '" id="dr-ent-app-' + ei + '">' + (e.applicable?'&#x2713; Yes':'&#x2717; No') + '</span></td>' +
//       '<td class="dr-table-edit-cell" style="display:none;"><button class="dr-tbl-del-btn" onclick="_drDelEntityRow(' + ei + ')">&#x2715;</button></td>' +
//     '</tr>';
//   }).join('');

//   var reqRows = (a.requirementsApplicability||[]).map(function(r, ri) {
//     return '<tr id="dr-req-row-' + ri + '">' +
//       '<td><span id="dr-req-name-' + ri + '" contenteditable="false" style="outline:none;font-weight:600;color:#1a1a2e;display:inline-block;min-width:120px;">' + r.requirement + '</span></td>' +
//       '<td><span id="dr-req-thresh-' + ri + '" contenteditable="false" style="outline:none;font-size:11px;color:#4a5068;display:inline-block;min-width:80px;">' + r.threshold + '</span></td>' +
//       '<td><span class="dr-app-pill ' + (r.applicable?'dr-app-yes':'dr-app-no') + '" id="dr-req-app-' + ri + '">' + (r.applicable?'&#x2713; Yes':'&#x2717; No') + '</span></td>' +
//       '<td class="dr-table-edit-cell" style="display:none;">' +
//         '<select class="dr-tbl-select" onchange="_drReqStatusChange(' + ri + ',this.value)">' +
//           ['Compliant','In Progress','Pending','Exempt'].map(function(s){return '<option'+(s===r.status?' selected':'')+'>'+s+'</option>';}).join('') +
//         '</select>' +
//         '<button class="dr-tbl-del-btn" onclick="_drDelReqRow(' + ri + ')">&#x2715;</button>' +
//       '</td>' +
//     '</tr>';
//   }).join('');

//   return (
//     '<div class="dr-panel">' +
//     '<div class="dr-panel-toolbar">' +
//       '<div class="dr-panel-title-wrap"><span class="dr-panel-icon">&#x2736;</span><span class="dr-panel-title">Applicability Analysis</span></div>' +
//       '<div class="dr-toolbar-actions">' +
//         '<button class="dr-tool-btn" id="dr-app-tbl-edit-btn" onclick="_drToggleTableEdit()">&#x270E; Edit Tables</button>' +
//         '<button class="dr-tool-btn dr-tool-edit-toggle" data-target="dr-app-edit" data-hide="dr-app-details">&#x270E; Edit Fields</button>' +
//       '</div>' +
//     '</div>' +
//     '<div class="dr-verdict-banner" style="background:' + vb + ';border-color:' + vc + '30;">' +
//       '<div class="dr-verdict-badge" style="background:' + vc + ';color:#fff;">' + (a.applicable?'&#x2713; Applicable':'&#x2717; Not Applicable') + '</div>' +
//       '<div class="dr-verdict-info"><div class="dr-verdict-entity">' + a.entityType + ' &middot; ' + a.scope + '</div><div class="dr-verdict-owner">Owner: ' + a.owner + '</div></div>' +
//       '<div class="dr-verdict-deadline"><div class="dr-vd-label">Deadline</div><div class="dr-vd-date">' + a.deadline + '</div></div>' +
//     '</div>' +
//     '<div class="dr-edit-drawer" id="dr-app-edit" style="display:none;">' +
//       '<div class="dr-edit-grid">' +
//         [['Verdict',a.verdict],['Entity Type',a.entityType],['Scope',a.scope],['Deadline',a.deadline],['Owner',a.owner]].map(function(f){
//           return '<div class="dr-edit-field"><label class="dr-edit-label">'+f[0]+'</label><input class="dr-edit-input" value="'+f[1]+'"/></div>';
//         }).join('') +
//         '<div class="dr-edit-field dr-edit-field-full"><label class="dr-edit-label">Notes</label><textarea class="dr-edit-ta">'+a.notes+'</textarea></div>' +
//         '<div class="dr-edit-field dr-edit-field-full"><label class="dr-edit-label">Threshold / Criteria</label><textarea class="dr-edit-ta">'+a.threshold+'</textarea></div>' +
//       '</div>' +
//       '<div class="dr-edit-foot">' +
//         '<button class="dr-btn dr-btn-ghost" data-close="dr-app-edit" data-show="dr-app-details">&#x2715; Cancel</button>' +
//         '<button class="dr-btn dr-btn-pri dr-btn-sm" onclick="showToast(\'Saved.\',\'success\');document.getElementById(\'dr-app-edit\').style.display=\'none\';document.getElementById(\'dr-app-details\').style.display=\'block\';">&#x2713; Save</button>' +
//       '</div>' +
//     '</div>' +
//     '<div id="dr-app-details">' +
//       '<div class="dr-block-pad"><div class="dr-info-block dr-info-block-amber"><div class="dr-ib-label">Threshold &amp; Criteria</div><div class="dr-ib-text">' + a.threshold + '</div></div></div>' +
//       '<div class="dr-block-pad">' +
//         '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">' +
//           '<div class="dr-section-label" style="margin-bottom:0;">Applicable Entities</div>' +
//           '<button class="dr-tbl-add-btn" id="dr-add-ent-btn" style="display:none;" onclick="_drAddEntityRow()">+ Add Row</button>' +
//         '</div>' +
//         '<table class="dr-table" id="dr-ent-table"><thead><tr><th>Entity</th><th>Applicable</th><th class="dr-table-edit-cell" style="display:none;width:80px;">Actions</th></tr></thead><tbody id="dr-ent-tbody">' + entityRows + '</tbody></table>' +
//       '</div>' +
//       '<div class="dr-block-pad">' +
//         '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">' +
//           '<div class="dr-section-label" style="margin-bottom:0;">Requirements Applicability</div>' +
//           '<button class="dr-tbl-add-btn" id="dr-add-req-btn" style="display:none;" onclick="_drAddReqRow()">+ Add Row</button>' +
//         '</div>' +
//         '<table class="dr-table" id="dr-req-table"><thead><tr><th>Requirement</th><th>Applicable</th><th>Threshold</th><th class="dr-table-edit-cell" style="display:none;width:120px;">Actions</th></tr></thead><tbody id="dr-req-tbody">' + reqRows + '</tbody></table>' +
//       '</div>' +
//       '<div class="dr-block-pad"><div class="dr-info-block"><div class="dr-ib-label">Notes</div><div class="dr-ib-text">' + a.notes + '</div></div></div>' +
//     '</div>' +
//     '<div class="dr-panel-foot"><span></span><button class="dr-btn dr-btn-next" onclick="_drGoNext(1)">Executive Summary &#x2192;</button></div>' +
//     '</div>'
//   );
// }

// /* TABLE HELPERS (unchanged) */
// window._drTableEditMode = false;
// window._drToggleTableEdit = function() {
//   window._drTableEditMode = !window._drTableEditMode;
//   var on = window._drTableEditMode;
//   document.querySelectorAll('.dr-table-edit-cell').forEach(function(el) { el.style.display = on ? 'table-cell' : 'none'; });
//   var addEnt = document.getElementById('dr-add-ent-btn'); if (addEnt) addEnt.style.display = on ? 'inline-flex' : 'none';
//   var addReq = document.getElementById('dr-add-req-btn'); if (addReq) addReq.style.display = on ? 'inline-flex' : 'none';
//   document.querySelectorAll('[id^="dr-ent-name-"],[id^="dr-ent-type-"],[id^="dr-req-name-"],[id^="dr-req-thresh-"]').forEach(function(el) {
//     el.contentEditable = on ? 'true' : 'false';
//     el.style.outline = on ? '1.5px dashed #bfdbfe' : 'none';
//     el.style.borderRadius = on ? '3px' : '0';
//     el.style.padding = on ? '1px 4px' : '0';
//   });
//   document.querySelectorAll('[id^="dr-ent-app-"],[id^="dr-req-app-"]').forEach(function(pill) {
//     if (on) { pill.style.cursor='pointer'; pill.title='Click to toggle'; pill.onclick=function(){var isYes=pill.classList.contains('dr-app-yes');pill.classList.toggle('dr-app-yes',!isYes);pill.classList.toggle('dr-app-no',isYes);pill.innerHTML=isYes?'&#x2717; No':'&#x2713; Yes';};
//     } else { pill.style.cursor='default'; pill.title=''; pill.onclick=null; }
//   });
//   var btn = document.getElementById('dr-app-tbl-edit-btn');
//   if (btn) { btn.textContent = on ? '✓ Done Editing' : '✎ Edit Tables'; btn.style.background = on ? '#1a1a2e' : ''; btn.style.color = on ? '#fff' : ''; btn.style.borderColor = on ? '#1a1a2e' : ''; }
//   if (!on) showToast('Table changes saved.', 'success');
// };
// window._drDelEntityRow = function(ei) { var row = document.getElementById('dr-ent-row-' + ei); if (row) row.remove(); };
// window._drDelReqRow    = function(ri) { var row = document.getElementById('dr-req-row-' + ri); if (row) row.remove(); };
// window._drReqStatusChange = function(ri, val) { var span = document.getElementById('dr-req-status-' + ri); if (!span) return; var sc = val==='Compliant'?'background:#dcfce7;color:#15803d':val==='In Progress'?'background:#fef9c3;color:#b45309':val==='Exempt'?'background:#f3f4f6;color:#52525b':'background:#fee2e2;color:#b91c1c'; span.style.cssText='font-size:10px;font-weight:700;padding:2px 8px;border-radius:4px;'+sc; span.textContent=val; };
// window._drAddEntityRow = function() { var tbody=document.getElementById('dr-ent-tbody'); if(!tbody)return; var ei=tbody.querySelectorAll('tr').length; var tr=document.createElement('tr'); tr.id='dr-ent-row-'+ei; tr.innerHTML='<td><span id="dr-ent-name-'+ei+'" contenteditable="true" style="outline:1.5px dashed #bfdbfe;border-radius:3px;padding:1px 4px;display:inline-block;min-width:80px;font-weight:600;color:#1a1a2e;">New Entity</span></td><td><span class="dr-app-pill dr-app-yes" id="dr-ent-app-'+ei+'" style="cursor:pointer;" title="Click to toggle" onclick="var isYes=this.classList.contains(\'dr-app-yes\');this.classList.toggle(\'dr-app-yes\',!isYes);this.classList.toggle(\'dr-app-no\',isYes);this.innerHTML=isYes?\'&#x2717; No\':\'&#x2713; Yes\';">&#x2713; Yes</span></td><td class="dr-table-edit-cell"><button class="dr-tbl-del-btn" onclick="_drDelEntityRow('+ei+')">&#x2715;</button></td>'; tbody.appendChild(tr); var ed=tr.querySelector('[contenteditable]'); if(ed)ed.focus(); };
// window._drAddReqRow    = function() { var tbody=document.getElementById('dr-req-tbody'); if(!tbody)return; var ri=tbody.querySelectorAll('tr').length; var tr=document.createElement('tr'); tr.id='dr-req-row-'+ri; tr.innerHTML='<td><span id="dr-req-name-'+ri+'" contenteditable="true" style="outline:1.5px dashed #bfdbfe;border-radius:3px;padding:1px 4px;display:inline-block;min-width:120px;font-weight:600;color:#1a1a2e;">New Requirement</span></td><td><span class="dr-app-pill dr-app-yes" id="dr-req-app-'+ri+'" style="cursor:pointer;" title="Click to toggle" onclick="var isYes=this.classList.contains(\'dr-app-yes\');this.classList.toggle(\'dr-app-yes\',!isYes);this.classList.toggle(\'dr-app-no\',isYes);this.innerHTML=isYes?\'&#x2717; No\':\'&#x2713; Yes\';">&#x2713; Yes</span></td><td><span id="dr-req-thresh-'+ri+'" contenteditable="true" style="outline:1.5px dashed #bfdbfe;border-radius:3px;padding:1px 4px;font-size:11px;color:#4a5068;display:inline-block;min-width:80px;">All entities</span></td><td class="dr-table-edit-cell"><select class="dr-tbl-select" onchange="_drReqStatusChange('+ri+',this.value)">'+['Compliant','In Progress','Pending','Exempt'].map(function(s){return '<option>'+s+'</option>';}).join('')+'</select><button class="dr-tbl-del-btn" onclick="_drDelReqRow('+ri+')">&#x2715;</button></td>'; tbody.appendChild(tr); var ed=tr.querySelector('[contenteditable]'); if(ed)ed.focus(); };

// /* ================================================================
//    PANEL 2 — EXECUTIVE SUMMARY
//    FIX: Accordion trigger row restructured.
//    Layout: [icon][label][spacer] | [badge][+Add Item][▾]
//    The ▾ arrow is OUTSIDE the trigger button — it's a separate toggle chevron.
// ================================================================ */
// function _drPanelSummary(flow) {
//   var s = flow.summary;
//   if (!s) return _drNotSaved('Executive Summary');

//   /*
//    * Trigger row structure (NO nested buttons):
//    * <div class="dr-acc-header">
//    *   <button class="dr-acc-trigger" data-acc="id">  ← opens/closes body
//    *     <span icon> <span label> <span spacer>
//    *     <span badge>
//    *     <span arrow>
//    *   </button>
//    *   <button class="dr-acc-add-btn">+ Add Item</button>  ← outside trigger
//    * </div>
//    * Nested <button> inside <button> is invalid HTML and causes browser bugs.
//    */
//   function accSection(id, icon, label, badge, html) {
//     return (
//       '<div class="dr-acc-item" id="dr-acc-' + id + '">' +
//         '<div class="dr-acc-header">' +
//           '<button class="dr-acc-trigger" data-acc="' + id + '">' +
//             '<span class="dr-acc-icon">' + icon + '</span>' +
//             '<span class="dr-acc-label">' + label + '</span>' +
//             '<span class="dr-acc-spacer"></span>' +
//             (badge ? '<span class="dr-acc-badge">' + badge + '</span>' : '') +
//             '<span class="dr-acc-arrow">&#9660;</span>' +
//           '</button>' +
//           '<button class="dr-acc-add-btn" data-acc-id="' + id + '" title="Add item to ' + label + '">+ Add</button>' +
//         '</div>' +
//         '<div class="dr-acc-body" id="dr-acc-body-' + id + '">' +
//           '<div class="dr-acc-rows" id="dr-acc-rows-' + id + '">' + html + '</div>' +
//         '</div>' +
//       '</div>'
//     );
//   }

//   function numRow(text) {
//     return '<div class="dr-sum-row">' +
//       '<span class="dr-sum-num-icon"></span>' +
//       '<span class="dr-sum-item" contenteditable="true">' + text + '</span>' +
//       '<button class="dr-row-del" onclick="this.closest(\'.dr-sum-row\').remove()" title="Remove">&#x2715;</button>' +
//     '</div>';
//   }
//   function dotRow(text, cls) {
//     return '<div class="dr-sum-row">' +
//       '<span class="dr-sum-dot' + (cls?' '+cls:'') + '"></span>' +
//       '<span class="dr-sum-item" contenteditable="true">' + text + '</span>' +
//       '<button class="dr-row-del" onclick="this.closest(\'.dr-sum-row\').remove()" title="Remove">&#x2715;</button>' +
//     '</div>';
//   }
//   function riskRow(r) {
//     return '<div class="dr-sum-row">' +
//       '<span class="dr-risk-pill dr-risk-' + r.level.toLowerCase() + '">' + r.level + '</span>' +
//       '<span class="dr-sum-item" contenteditable="true">' + r.text + '</span>' +
//       '<button class="dr-row-del" onclick="this.closest(\'.dr-sum-row\').remove()" title="Remove">&#x2715;</button>' +
//     '</div>';
//   }

//   var orgHtml =
//     '<div class="dr-org-metrics">' +
//       [['Departments',s.orgImpact.departments],['Headcount',s.orgImpact.headcount],['Systems',s.orgImpact.systems],['Budget',s.orgImpact.budget]].map(function(m){
//         return '<div class="dr-org-metric"><div class="dr-om-val">'+m[1]+'</div><div class="dr-om-label">'+m[0]+'</div></div>';
//       }).join('') +
//     '</div>' +
//     '<div class="dr-sum-item dr-sum-item-plain" contenteditable="true">' + s.orgImpact.description + '</div>';

//   return (
//     '<div class="dr-panel">' +
//     '<div class="dr-panel-toolbar">' +
//       '<div class="dr-panel-title-wrap"><span class="dr-panel-icon">&#x1F4C4;</span><span class="dr-panel-title">Executive Summary</span></div>' +
//       '<div class="dr-toolbar-actions"><button class="dr-tool-btn dr-tool-edit-toggle" data-target="dr-sum-purpose-edit" data-hide="dr-sum-purpose-disp">&#x270E; Edit Purpose</button></div>' +
//     '</div>' +
//     '<div class="dr-block-pad" id="dr-sum-purpose-disp">' +
//       '<div class="dr-info-block"><div class="dr-ib-label">Purpose &amp; Background</div><div class="dr-ib-text">' + s.purpose + '</div></div>' +
//     '</div>' +
//     '<div class="dr-edit-drawer" id="dr-sum-purpose-edit" style="display:none;">' +
//       '<div class="dr-edit-grid">' +
//         '<div class="dr-edit-field dr-edit-field-full"><label class="dr-edit-label">Purpose &amp; Background</label>' +
//         '<textarea class="dr-edit-ta" style="min-height:100px;" id="dr-sum-pta">' + s.purpose + '</textarea></div>' +
//       '</div>' +
//       '<div class="dr-edit-foot">' +
//         '<button class="dr-btn dr-btn-ghost" data-close="dr-sum-purpose-edit" data-show="dr-sum-purpose-disp">&#x2715; Cancel</button>' +
//         '<button class="dr-btn dr-btn-pri dr-btn-sm" onclick="var t=document.getElementById(\'dr-sum-pta\').value;document.getElementById(\'dr-sum-purpose-disp\').querySelector(\'.dr-ib-text\').textContent=t;document.getElementById(\'dr-sum-purpose-edit\').style.display=\'none\';document.getElementById(\'dr-sum-purpose-disp\').style.display=\'block\';showToast(\'Saved.\',\'success\');">&#x2713; Save</button>' +
//       '</div>' +
//     '</div>' +
//     '<div class="dr-sum-accordions">' +
//       accSection('key-updates',  '&#x1F504;', 'Key Updates',          s.keyUpdates.length + ' updates',       s.keyUpdates.map(numRow).join('')) +
//       accSection('risks',        '&#x1F6A8;', 'Compliance Risks',     s.risks.length + ' risks',              s.risks.map(riskRow).join('')) +
//       accSection('imm-actions',  '&#x26A1;',  'Immediate Actions',    s.immediateActions.length + ' actions', s.immediateActions.map(dotRow).join('')) +
//       accSection('org-impact',   '&#x1F3E2;', 'Organisational Impact','',                                     orgHtml) +
//       accSection('technical',    '&#x2699;&#xFE0F;','Technical Changes', s.technical.length + ' items',       s.technical.map(function(t){return dotRow(t,'dr-sum-dot-tech');}).join('')) +
//     '</div>' +
//     '<div class="dr-panel-foot"><span></span><button class="dr-btn dr-btn-next" onclick="_drGoNext(2)">Clause Generation &#x2192;</button></div>' +
//     '</div>'
//   );
// }

// /* ================================================================
//    PANEL 3 — CLAUSE GENERATION
//    Redesigned to match clause-panel.js quality.
//    Left nav: chapters (collapsed) → clauses
//    Right workspace: clause text block, obligation accordion, actions
//    Toolbar: clearly labeled Upload Excel + Add Chapter
// ================================================================ */
// function _drPanelClauses(flow, circId) {
//   var chapters = flow.clauses || [];
//   if (!chapters.length) return _drNotSaved('Clause Generation');

//   var totalClauses = chapters.reduce(function(s,ch){return s+(ch.clauses||[]).length;},0);

//   return (
//     '<div class="dr-panel dr-panel-clauses">' +

//     /* ── TOOLBAR ── */
//     '<div class="dr-panel-toolbar">' +
//       '<div class="dr-panel-title-wrap">' +
//         '<span class="dr-panel-icon">&#x1F4CB;</span>' +
//         '<span class="dr-panel-title">Clause Generation</span>' +
//         '<span class="dr-cl-total-badge">' + totalClauses + ' clauses</span>' +
//       '</div>' +
//       '<div class="dr-toolbar-actions">' +
//         /* Excel upload for full set */
//         '<label class="dr-tool-btn" title="Upload Excel to bulk-import clauses">' +
//           '<input type="file" accept=".xlsx,.xls,.csv" style="display:none;" onchange="showToast(\'Excel imported successfully.\',\'success\')"/>' +
//           '&#x1F4CA; Import Excel' +
//         '</label>' +
//         /* Add chapter */
//         '<button class="dr-tool-btn dr-tool-btn-pri" id="dr-cl-add-ch-btn">+ Add Chapter</button>' +
//         '<button class="dr-btn dr-btn-sec dr-btn-sm" onclick="showToast(\'Clauses saved.\',\'success\')">&#x1F4BE; Save</button>' +
//       '</div>' +
//     '</div>' +

//     /* ── SPLIT PANE ── */
//     '<div class="dr-cl-split">' +

//       /* LEFT NAV */
//       '<div class="dr-cl-nav" id="dr-cl-nav">' +
//         '<div class="dr-cl-nav-head">' +
//           '<span class="dr-cl-nav-title">Chapters</span>' +
//           '<span class="dr-cl-nav-count" id="dr-cl-nav-count">' + totalClauses + ' clauses</span>' +
//         '</div>' +
//         '<div class="dr-cl-nav-tree" id="dr-cl-nav-tree">' +
//           chapters.map(function(ch, ci) { return _drBuildNavChapter(ch, ci, circId); }).join('') +
//         '</div>' +
//       '</div>' +

//       /* RIGHT WORKSPACE */
//       '<div class="dr-cl-workspace" id="dr-cl-workspace">' +
//         '<div class="dr-cl-ws-placeholder" id="dr-cl-ws-ph">' +
//           '<div class="dr-ws-ph-icon">&#x1F4CB;</div>' +
//           '<div class="dr-ws-ph-title">Select a clause</div>' +
//           '<div class="dr-ws-ph-sub">Click any clause in the left panel to view, edit and manage its obligations</div>' +
//         '</div>' +
//         '<div id="dr-cl-ws-content" style="display:none;"></div>' +
//       '</div>' +

//     '</div>' + /* end split */

//     '<div class="dr-panel-foot"><span></span><button class="dr-btn dr-btn-next" onclick="_drGoNext(3)">Evidence &#x2192;</button></div>' +
//     '</div>'
//   );
// }

// /* ── Build chapter in left nav ── */
// function _drBuildNavChapter(ch, ci, circId) {
//   var clauses = ch.clauses || [];
//   return (
//     '<div class="dr-cl-nav-chapter" id="dr-cl-nav-ch-' + ci + '">' +
//       /* Chapter header row */
//       '<div class="dr-cl-nav-ch-row">' +
//         '<button class="dr-cl-nav-ch-btn" data-ci="' + ci + '">' +
//           '<span class="dr-cl-nav-ch-arrow">&#x25B6;</span>' +
//           '<span class="dr-cl-nav-ch-label">' + (ch.title || 'Chapter ' + (ci+1)) + '</span>' +
//           '<span class="dr-cl-nav-ch-count">' + clauses.length + '</span>' +
//         '</button>' +
//         /* per-chapter actions — small icons with tooltips */
//         '<div class="dr-cl-ch-actions">' +
//           '<label class="dr-cl-ch-action-btn" title="Import Excel for this chapter">' +
//             '<input type="file" accept=".xlsx,.xls,.csv" style="display:none;" onchange="showToast(\'Excel mapped to ' + (ch.title||'Chapter '+(ci+1)) + '.\',\'success\')"/>' +
//             '&#x1F4CA;' +
//           '</label>' +
//           '<button class="dr-cl-ch-action-btn" title="Add clause to this chapter" onclick="_drAddClause(' + ci + ',\'' + (circId||'') + '\')">+</button>' +
//         '</div>' +
//       '</div>' +
//       /* Clause list — closed by default */
//       '<div class="dr-cl-nav-ch-body" id="dr-cl-nav-body-' + ci + '">' +
//         clauses.map(function(cl, cli) { return _drBuildNavClause(cl, ci, cli, circId); }).join('') +
//       '</div>' +
//     '</div>'
//   );
// }

// /* ── Build clause button in left nav ── */
// function _drBuildNavClause(cl, ci, cli, circId) {
//   var riskCls = cl.risk ? 'dr-cl-risk-' + cl.risk.toLowerCase() : '';
//   return (
//     '<button class="dr-cl-nav-clause" data-ck="' + ci + '-' + cli + '" data-ci="' + ci + '" data-cli="' + cli + '" data-circ="' + (circId||'') + '">' +
//       '<div class="dr-cl-nav-cl-row">' +
//         '<span class="dr-cl-nav-cl-id">' + cl.id + '</span>' +
//         (cl.risk ? '<span class="dr-cl-nav-risk ' + riskCls + '">' + cl.risk + '</span>' : '') +
//       '</div>' +
//       '<span class="dr-cl-nav-cl-text">' + (cl.text||'').substring(0,52) + ((cl.text||'').length>52?'\u2026':'') + '</span>' +
//     '</button>'
//   );
// }

// /* ── Show clause in right workspace ── */
// window._drShowClauseWorkspace = function(cl, ci, cli, circId) {
//   var ph      = document.getElementById('dr-cl-ws-ph');
//   var content = document.getElementById('dr-cl-ws-content');
//   if (ph) ph.style.display = 'none';
//   if (!content) return;
//   content.style.display = 'block';

//   var ck           = ci + '-' + cli;
//   var flow         = window._savedFlow[circId];
//   var chapter      = flow && flow.clauses && flow.clauses[ci];
//   var chapterTitle = chapter ? (chapter.title || 'Chapter ' + (ci+1)) : '';
//   var actions      = (cl.actionable||'').split(';').map(function(a){return a.trim();}).filter(Boolean);
//   var rCls = {High:'dr-chip-risk-high',Medium:'dr-chip-risk-medium',Low:'dr-chip-risk-low'}[cl.risk]||'';

//   /* mapped clauses refs */
//   var mapKey       = (circId||'') + ':' + cl.id;
//   var mappedClauses= window._mappedClauses[mapKey] || [];
//   var mappedHtml   = mappedClauses.length
//     ? '<div class="dr-mapped-refs" id="dr-mapped-refs-' + ck + '">' +
//         '<span class="dr-mapped-label">Mapped:</span>' +
//         mappedClauses.map(function(m){return '<span class="dr-mapped-chip">'+m.circId+' · '+m.clauseId+'</span>';}).join('') +
//       '</div>'
//     : '<div class="dr-mapped-refs" id="dr-mapped-refs-' + ck + '" style="display:none;"></div>';

//   var actRows = actions.map(function(a,ai){
//     return '<div class="dr-action-row">' +
//       '<span class="dr-action-num">'+(ai+1)+'</span>' +
//       '<span class="dr-action-txt dr-editable" contenteditable="true">'+a+'</span>' +
//       '<button class="dr-row-del" onclick="this.closest(\'.dr-action-row\').remove()">&#x2715;</button>' +
//     '</div>';
//   }).join('');

//   content.innerHTML =
//     '<div class="dr-cl-ws-inner">' +

//     /* ── HEADER ── */
//     '<div class="dr-cl-ws-head">' +
//       '<div>' +
//         '<div class="dr-cl-ws-bc">' +
//           '<span class="dr-ws-bc-ch">' + chapterTitle + '</span>' +
//           '<span class="dr-ws-bc-sep">›</span>' +
//           '<span class="dr-ws-bc-id">' + cl.id + '</span>' +
//         '</div>' +
//         '<div class="dr-ov-chips" style="margin-top:6px;">' +
//           (cl.risk       ? '<span class="dr-chip dr-chip-sm ' + rCls + '">' + cl.risk + ' Risk</span>' : '') +
//           (cl.status     ? '<span class="dr-chip dr-chip-sm dr-chip-status">' + cl.status + '</span>' : '') +
//           (cl.department ? '<span class="dr-chip dr-chip-sm dr-chip-blue">' + cl.department + '</span>' : '') +
//         '</div>' +
//       '</div>' +
//       '<div class="dr-toolbar-actions">' +
//         '<button class="dr-map-btn" onclick="_drOpenMapModal(\'' + (circId||'') + '\',\'' + cl.id + '\',\'' + ck + '\',\'clause\')" title="Map to other clauses">&#x21C4; Map Clause</button>' +
//         '<button class="dr-tool-btn dr-tool-edit-toggle" data-target="dr-cl-edit-' + ck + '" data-hide="dr-cl-view-' + ck + '">&#x270E; Edit</button>' +
//       '</div>' +
//     '</div>' +

//     mappedHtml +

//     /* ── CONTROLS BAR ── */
//     '<div class="dr-clause-controls">' +
//       '<div class="dr-ctrl-group"><span class="dr-ctrl-label">Dept</span>' +
//         '<select class="dr-ctrl-select">' +
//           ['Compliance','Risk','Legal','IT','Operations','HR','Finance'].map(function(d){return '<option'+(d===cl.department?' selected':'')+'>'+d+'</option>';}).join('') +
//         '</select>' +
//       '</div>' +
//       '<div class="dr-ctrl-group"><span class="dr-ctrl-label">Status</span>' +
//         '<select class="dr-ctrl-select">' +
//           ['Pending','In Progress','Compliant'].map(function(s){return '<option'+(s===cl.status?' selected':'')+'>'+s+'</option>';}).join('') +
//         '</select>' +
//       '</div>' +
//       '<div class="dr-tags-ctrl">' +
//         '<span class="dr-ctrl-label">Tags</span>' +
//         '<div class="dr-tags-list" id="dr-tlist-' + ck + '">' +
//           (cl.tags||[]).map(function(t){return '<span class="dr-ctag">'+t+'<button onclick="this.parentElement.remove()">&#xD7;</button></span>';}).join('') +
//         '</div>' +
//         '<input class="dr-tag-input" id="dr-tinput-' + ck + '" placeholder="+ tag" onkeydown="if(event.key===\'Enter\'||event.key===\',\'){_drAddTag(\'' + ck + '\');event.preventDefault();}"/>' +
//         '<button class="dr-tag-add-btn" onclick="_drAddTag(\'' + ck + '\')">+</button>' +
//       '</div>' +
//     '</div>' +

//     /* ── VIEW MODE ── */
//     '<div id="dr-cl-view-' + ck + '">' +

//       /* Clause text block — styled like clause-panel */
//       '<div class="dr-ws-clause-block">' +
//         '<div class="dr-ws-clause-label">Clause Text</div>' +
//         '<div class="dr-nb-content" id="dr-cl-text-' + ck + '">' + cl.text + '</div>' +
//       '</div>' +

//       /* Obligations section */
//       '<div class="dr-ws-section">' +
//         '<div class="dr-ws-section-head">' +
//           '<span class="dr-ws-section-label">Obligations</span>' +
//           '<button class="dr-add-sub-btn" onclick="_drAddObligation(\'' + ck + '\',\'' + (circId||'') + '\',\'' + cl.id + '\')">+ Add Obligation</button>' +
//         '</div>' +
//         '<div class="dr-ws-oblig-list" id="dr-oblig-wrap-' + ck + '">' +
//           (cl.obligation
//             ? _drBuildObligationItem(cl.obligation, actions, ck, circId, cl.id, 0, true)
//             : '<div class="dr-empty-hint" id="dr-no-oblig-' + ck + '">No obligation yet — click + Add Obligation above</div>'
//           ) +
//         '</div>' +
//       '</div>' +

//     '</div>' + /* end view */

//     /* ── EDIT DRAWER ── */
//     '<div class="dr-edit-drawer" id="dr-cl-edit-' + ck + '" style="display:none;">' +
//       '<div class="dr-edit-grid">' +
//         '<div class="dr-edit-field dr-edit-field-full"><label class="dr-edit-label">Clause Text</label><textarea class="dr-edit-ta" id="dr-cl-edit-text-' + ck + '">' + cl.text + '</textarea></div>' +
//         '<div class="dr-edit-field dr-edit-field-full"><label class="dr-edit-label">Obligation</label><textarea class="dr-edit-ta" id="dr-cl-edit-obl-' + ck + '">' + (cl.obligation||'') + '</textarea></div>' +
//       '</div>' +
//       '<div class="dr-edit-foot">' +
//         '<button class="dr-btn dr-btn-ghost" data-close="dr-cl-edit-' + ck + '" data-show="dr-cl-view-' + ck + '">&#x2715; Cancel</button>' +
//         '<button class="dr-btn dr-btn-pri dr-btn-sm" onclick="_drSaveClauseEdit(\'' + ck + '\')">&#x2713; Save</button>' +
//       '</div>' +
//     '</div>' +

//     '</div>'; /* end inner */

//   /* bind edit drawer toggle */
//   var editToggle = content.querySelector('.dr-tool-edit-toggle[data-target="dr-cl-edit-' + ck + '"]');
//   if (editToggle) editToggle.addEventListener('click', function() {
//     var drawer = document.getElementById('dr-cl-edit-' + ck);
//     var view   = document.getElementById('dr-cl-view-' + ck);
//     var opening = drawer.style.display === 'none';
//     drawer.style.display = opening ? 'block' : 'none';
//     view.style.display   = opening ? 'none'  : 'block';
//   });

//   /* bind obligation accordion toggles */
//   content.querySelectorAll('.dr-oblig-trigger').forEach(function(btn) {
//     btn.addEventListener('click', function() {
//       var oi   = btn.dataset.oi;
//       var body = document.getElementById('dr-oblig-body-' + oi + '-' + ck);
//       var arr  = btn.querySelector('.dr-oblig-arr');
//       if (!body) return;
//       var open = body.classList.contains('open');
//       body.classList.toggle('open', !open);
//       if (arr) arr.textContent = open ? '▶' : '▼';
//     });
//   });
// };

// /* ── Build a single obligation item (reusable) ── */
// function _drBuildObligationItem(obligText, actionsArr, ck, circId, clauseId, oi, actionsOpen) {
//   var actRows = (actionsArr||[]).map(function(a,ai){
//     return '<div class="dr-action-row">' +
//       '<span class="dr-action-num">'+(ai+1)+'</span>' +
//       '<span class="dr-action-txt dr-editable" contenteditable="true">'+a+'</span>' +
//       '<button class="dr-row-del" onclick="this.closest(\'.dr-action-row\').remove()">&#x2715;</button>' +
//     '</div>';
//   }).join('');

//   return (
//     '<div class="dr-oblig-item" id="dr-oblig-' + oi + '-' + ck + '">' +

//       /* Obligation trigger row */
//       '<button class="dr-oblig-trigger" data-oi="' + oi + '">' +
//         '<div class="dr-oblig-trigger-left">' +
//           '<span class="dr-oblig-badge">O' + (oi+1) + '</span>' +
//           '<span class="dr-oblig-preview">' + obligText + '</span>' +
//         '</div>' +
//         '<span class="dr-oblig-arr">▶</span>' +
//       '</button>' +

//       /* Obligation body — closed by default */
//       '<div class="dr-oblig-body" id="dr-oblig-body-' + oi + '-' + ck + '">' +

//         /* Obligation text (editable) */
//         '<div class="dr-oblig-text-full dr-editable" contenteditable="true">' + obligText + '</div>' +

//         /* Obligation-level controls: tags + map-to-clause + delete */
//         '<div class="dr-oblig-controls">' +
//           '<div class="dr-oblig-tags-row">' +
//             '<span class="dr-ctrl-label" style="white-space:nowrap;">Tags</span>' +
//             '<div class="dr-tags-list" id="dr-ob-tlist-' + oi + '-' + ck + '"></div>' +
//             '<input class="dr-tag-input" id="dr-ob-tinput-' + oi + '-' + ck + '" placeholder="+ tag" ' +
//               'onkeydown="if(event.key===\'Enter\'||event.key===\',\'){_drAddObligTag(\'' + oi + '\',\'' + ck + '\');event.preventDefault();}"/>' +
//             '<button class="dr-tag-add-btn" onclick="_drAddObligTag(\'' + oi + '\',\'' + ck + '\')">+</button>' +
//           '</div>' +
//           '<div class="dr-oblig-actions-row">' +
//             '<button class="dr-map-btn" onclick="_drOpenClauseMapModal(\'' + (circId||'') + '\',\'' + clauseId + '\',\'' + ck + '\',\'' + oi + '\')" title="Map this obligation to a clause">&#x21C4; Map to Clause</button>' +
//             '<button class="dr-row-del dr-oblig-del" onclick="this.closest(\'.dr-oblig-item\').remove()" title="Delete obligation">&#x2715; Remove</button>' +
//           '</div>' +
//         '</div>' +

//         /* Actions sub-list */
//         '<div class="dr-actions-wrap">' +
//           '<div class="dr-nb-label-row">' +
//             '<span class="dr-nb-label">Actions <span class="dr-actions-count">' + (actionsArr||[]).length + '</span></span>' +
//             '<button class="dr-add-sub-btn" onclick="_drAddAction(\'' + oi + '\',\'' + ck + '\')">+ Action</button>' +
//           '</div>' +
//           '<div class="dr-actions-list" id="dr-alist-' + oi + '-' + ck + '">' + actRows + '</div>' +
//         '</div>' +

//       '</div>' + /* end body */
//     '</div>'
//   );
// }

// window._drSaveClauseEdit = function(ck) {
//   var textEl = document.getElementById('dr-cl-edit-text-' + ck);
//   var oblEl  = document.getElementById('dr-cl-edit-obl-' + ck);
//   var viewEl = document.getElementById('dr-cl-view-' + ck);
//   if (textEl && viewEl) {
//     var clauseBlock = document.getElementById('dr-cl-text-' + ck);
//     if (clauseBlock) clauseBlock.textContent = textEl.value;
//   }
//   if (oblEl && viewEl) {
//     var oblBlock = viewEl.querySelector('.dr-oblig-preview');
//     if (oblBlock) oblBlock.textContent = oblEl.value;
//     var oblFull = viewEl.querySelector('.dr-oblig-text-full');
//     if (oblFull) oblFull.textContent = oblEl.value;
//   }
//   document.getElementById('dr-cl-edit-' + ck).style.display = 'none';
//   if (viewEl) viewEl.style.display = 'block';
//   showToast('Clause saved.', 'success');
// };

// /* ── Add obligation tag ── */
// window._drAddObligTag = function(oi, ck) {
//   var input = document.getElementById('dr-ob-tinput-' + oi + '-' + ck);
//   var list  = document.getElementById('dr-ob-tlist-'  + oi + '-' + ck);
//   if (!input || !list) return;
//   var val = input.value.trim().replace(/,/g,'');
//   if (!val) return;
//   var span = document.createElement('span');
//   span.className = 'dr-ctag';
//   span.innerHTML = val + '<button onclick="this.parentElement.remove()">&#xD7;</button>';
//   list.appendChild(span);
//   input.value = '';
// };

// /* ================================================================
//    MAP MODAL — Obligation → Clause
//    Maps an obligation to specific clauses (within same or other circulars)
// ================================================================ */
// window._drOpenClauseMapModal = function(circId, clauseId, ck, oi) {
//   var allRows = [];
//   (CMS_DATA && CMS_DATA.circulars || []).forEach(function(c) {
//     (c.chapters||[]).forEach(function(ch){
//       (ch.clauses||[]).forEach(function(cl){
//         allRows.push({ circId:c.id, circTitle:c.title, chTitle:ch.title||'', clauseId:cl.id, clauseText:cl.text||'' });
//       });
//     });
//   });
//   /* also include clauses from savedFlow */
//   Object.keys(window._savedFlow||{}).forEach(function(cid){
//     (window._savedFlow[cid].clauses||[]).forEach(function(ch){
//       (ch.clauses||[]).forEach(function(cl){
//         if (!allRows.find(function(r){return r.circId===cid&&r.clauseId===cl.id;})) {
//           allRows.push({ circId:cid, circTitle:'(Draft) '+cid, chTitle:ch.title||'', clauseId:cl.id, clauseText:cl.text||'' });
//         }
//       });
//     });
//   });

//   var mapKey  = circId + ':' + clauseId + ':ob:' + oi;
//   var existing = window._mappedObligs[mapKey] || [];

//   var overlay = document.createElement('div');
//   overlay.className = 'dr-modal-overlay';
//   overlay.id = 'dr-clause-map-modal';

//   var rowsHtml = allRows.map(function(r,i){
//     var already  = existing.some(function(e){return e.clauseId===r.clauseId&&e.circId===r.circId;});
//     var rowData  = JSON.stringify({circId:r.circId,clauseId:r.clauseId,clauseText:r.clauseText}).replace(/"/g,'&quot;');
//     return '<tr class="dr-map-row' + (already?' dr-map-row-mapped':'') + '" data-search="'+r.circId+' '+r.clauseId+' '+r.clauseText.substring(0,60)+' '+r.circTitle+'">' +
//       '<td><button class="dr-map-row-btn'+(already?' mapped':'')+'" data-row="'+rowData+'" data-mapkey="'+mapKey+'" data-ck="'+ck+'">' + (already?'&#x2713; Mapped':'Map') + '</button></td>' +
//       '<td><span class="dr-map-cid">'+r.clauseId+'</span></td>' +
//       '<td><div class="dr-map-circ-id">'+r.circId+'</div><div class="dr-map-circ-title">'+r.circTitle.substring(0,36)+(r.circTitle.length>36?'…':'')+'</div></td>' +
//       '<td class="dr-map-ch">'+r.chTitle.substring(0,28)+(r.chTitle.length>28?'…':'')+'</td>' +
//       '<td class="dr-map-text">'+r.clauseText.substring(0,80)+(r.clauseText.length>80?'…':'')+'</td>' +
//     '</tr>';
//   }).join('');

//   overlay.innerHTML =
//     '<div class="dr-modal">' +
//       '<div class="dr-modal-head">' +
//         '<div class="dr-modal-head-left">' +
//           '<div class="dr-modal-eyebrow">Map Obligation to Clause</div>' +
//           '<div class="dr-modal-subject">Obligation ' + (parseInt(oi)+1) + ' of Clause ' + clauseId + '</div>' +
//         '</div>' +
//         '<button class="dr-modal-close" onclick="document.getElementById(\'dr-clause-map-modal\').remove()">&#x2715;</button>' +
//       '</div>' +
//       (existing.length ? '<div class="dr-modal-mapped-bar"><span class="dr-modal-mapped-label">Currently mapped ('+existing.length+')</span>' + existing.map(function(m){return '<span class="dr-mapped-chip dr-mapped-chip-sm">'+m.circId+' · '+m.clauseId+'</span>';}).join('') + '</div>' : '') +
//       '<div class="dr-modal-search-bar"><input class="dr-modal-search" id="dr-cmap-search" placeholder="Search by clause ID, text, circular\u2026" autocomplete="off"/></div>' +
//       '<div class="dr-modal-body">' +
//         '<table class="dr-map-table"><thead><tr><th></th><th>Clause</th><th>Circular</th><th>Chapter</th><th>Text</th></tr></thead>' +
//         '<tbody id="dr-cmap-tbody">' + rowsHtml + '</tbody></table>' +
//       '</div>' +
//       '<div class="dr-modal-foot">' +
//         '<span class="dr-modal-foot-note">Map this obligation to related clauses across circulars</span>' +
//         '<button class="dr-btn dr-btn-pri" onclick="document.getElementById(\'dr-clause-map-modal\').remove();showToast(\'Obligation mapped.\',\'success\')">Done</button>' +
//       '</div>' +
//     '</div>';

//   document.body.appendChild(overlay);
//   overlay.addEventListener('click', function(e){ if(e.target===overlay) overlay.remove(); });

//   document.getElementById('dr-cmap-search').addEventListener('input', function(){
//     var q = this.value.toLowerCase();
//     overlay.querySelectorAll('.dr-map-row').forEach(function(row){
//       row.style.display = row.dataset.search.toLowerCase().includes(q) ? '' : 'none';
//     });
//   });

//   overlay.querySelectorAll('.dr-map-row-btn').forEach(function(btn){
//     btn.addEventListener('click', function(){
//       var mk  = btn.dataset.mapkey, bck = btn.dataset.ck;
//       window._mappedObligs[mk] = window._mappedObligs[mk] || [];
//       var rowData; try { rowData = JSON.parse(btn.dataset.row.replace(/&quot;/g,'"')); } catch(e){ return; }
//       var idx = window._mappedObligs[mk].findIndex(function(x){return x.clauseId===rowData.clauseId&&x.circId===rowData.circId;});
//       if (idx >= 0) { window._mappedObligs[mk].splice(idx,1); btn.innerHTML='Map'; btn.classList.remove('mapped'); btn.closest('tr').classList.remove('dr-map-row-mapped'); }
//       else { window._mappedObligs[mk].push(rowData); btn.innerHTML='&#x2713; Mapped'; btn.classList.add('mapped'); btn.closest('tr').classList.add('dr-map-row-mapped'); }
//     });
//   });
// };

// /* ================================================================ MAP MODAL — Clause → Clause (unchanged logic) */
// window._drOpenMapModal = function(circId, clauseId, ck, type, oi) {
//   var otherCircs = (CMS_DATA && CMS_DATA.circulars || []).filter(function(c){return c.id !== circId;});
//   var allRows = [];
//   otherCircs.forEach(function(c) {
//     (c.chapters||[]).forEach(function(ch){
//       (ch.clauses||[]).forEach(function(cl){
//         allRows.push({ circId:c.id, circTitle:c.title, regulator:c.regulator||'', chTitle:ch.title||'', clauseId:cl.id, clauseText:cl.text||'' });
//       });
//     });
//   });
//   var currentFlow   = window._savedFlow[circId];
//   var currentClause = null;
//   if (currentFlow) { (currentFlow.clauses||[]).forEach(function(ch){ (ch.clauses||[]).forEach(function(cl){ if(cl.id===clauseId) currentClause=cl; }); }); }
//   var mapKey   = circId + ':' + clauseId;
//   var existing = window._mappedClauses[mapKey] || [];
//   var overlay  = document.createElement('div');
//   overlay.className = 'dr-modal-overlay'; overlay.id = 'dr-map-modal';
//   var rowsHtml = allRows.map(function(r){
//     var already = existing.some(function(e){return e.clauseId===r.clauseId&&e.circId===r.circId;});
//     var rowData = JSON.stringify({circId:r.circId,clauseId:r.clauseId,clauseText:r.clauseText}).replace(/"/g,'&quot;');
//     return '<tr class="dr-map-row' + (already?' dr-map-row-mapped':'') + '" data-search="'+r.circId+' '+r.clauseId+' '+r.clauseText.substring(0,60)+' '+r.circTitle+'">' +
//       '<td><button class="dr-map-row-btn'+(already?' mapped':'')+'" data-row="'+rowData+'" data-mapkey="'+mapKey+'" data-ck="'+ck+'">'+(already?'&#x2713; Mapped':'Map')+'</button></td>' +
//       '<td><span class="dr-map-cid">'+r.clauseId+'</span></td>' +
//       '<td><div class="dr-map-circ-id">'+r.circId+'</div><div class="dr-map-circ-title">'+r.circTitle.substring(0,40)+(r.circTitle.length>40?'…':'')+'</div></td>' +
//       '<td class="dr-map-ch">'+r.chTitle.substring(0,28)+(r.chTitle.length>28?'…':'')+'</td>' +
//       '<td class="dr-map-text">'+r.clauseText.substring(0,80)+(r.clauseText.length>80?'…':'')+'</td>' +
//     '</tr>';
//   }).join('');
//   overlay.innerHTML = '<div class="dr-modal"><div class="dr-modal-head"><div class="dr-modal-head-left"><div class="dr-modal-eyebrow">Map Clause</div><div class="dr-modal-subject">' + clauseId + ' — ' + (currentClause?(currentClause.text||'').substring(0,80):'') + '</div></div><button class="dr-modal-close" onclick="document.getElementById(\'dr-map-modal\').remove()">&#x2715;</button></div>' + (existing.length?'<div class="dr-modal-mapped-bar"><span class="dr-modal-mapped-label">Mapped ('+existing.length+')</span>'+existing.map(function(m){return '<span class="dr-mapped-chip dr-mapped-chip-sm">'+m.circId+' · '+m.clauseId+'</span>';}).join('')+'</div>':'') + '<div class="dr-modal-search-bar"><input class="dr-modal-search" id="dr-map-search" placeholder="Search clauses…" autocomplete="off"/></div><div class="dr-modal-body"><table class="dr-map-table" id="dr-map-table"><thead><tr><th></th><th>Clause</th><th>Circular</th><th>Chapter</th><th>Text</th></tr></thead><tbody>'+rowsHtml+'</tbody></table></div><div class="dr-modal-foot"><span class="dr-modal-foot-note">Cross-reference related clauses across circulars.</span><button class="dr-btn dr-btn-pri" onclick="document.getElementById(\'dr-map-modal\').remove();showToast(\'Mappings saved.\',\'success\')">Done</button></div></div>';
//   document.body.appendChild(overlay);
//   overlay.addEventListener('click', function(e){ if(e.target===overlay) overlay.remove(); });
//   document.getElementById('dr-map-search').addEventListener('input', function(){ var q=this.value.toLowerCase(); document.querySelectorAll('#dr-map-modal .dr-map-row').forEach(function(row){ row.style.display=row.dataset.search.toLowerCase().includes(q)?'':'none'; }); });
//   overlay.querySelectorAll('.dr-map-row-btn').forEach(function(btn){
//     btn.addEventListener('click', function(){
//       var mk=btn.dataset.mapkey, bck=btn.dataset.ck;
//       window._mappedClauses[mk]=window._mappedClauses[mk]||[];
//       var rowData; try{rowData=JSON.parse(btn.dataset.row.replace(/&quot;/g,'"'));}catch(e){return;}
//       var idx=window._mappedClauses[mk].findIndex(function(x){return x.clauseId===rowData.clauseId&&x.circId===rowData.circId;});
//       if(idx>=0){window._mappedClauses[mk].splice(idx,1);btn.innerHTML='Map';btn.classList.remove('mapped');btn.closest('tr').classList.remove('dr-map-row-mapped');}
//       else{window._mappedClauses[mk].push(rowData);btn.innerHTML='&#x2713; Mapped';btn.classList.add('mapped');btn.closest('tr').classList.add('dr-map-row-mapped');}
//       _drRefreshMappedRefs(bck, mk, 'clause');
//     });
//   });
// };

// window._drRefreshMappedRefs = function(ck, mapKey, type) {
//   var el=document.getElementById('dr-mapped-refs-'+ck); if(!el)return;
//   var store=type==='clause'?window._mappedClauses:window._mappedObligs;
//   var items=store[mapKey]||[];
//   if(!items.length){el.style.display='none';el.innerHTML='';return;}
//   el.style.display='flex';
//   el.innerHTML='<span class="dr-mapped-label">Mapped:</span>'+items.map(function(m){return '<span class="dr-mapped-chip">'+m.circId+' · '+m.clauseId+'</span>';}).join('');
// };

// /* ================================================================ BIND PANEL */
// function _drBindPanel(step, flow, circId) {
//   /* edit toggles */
//   document.querySelectorAll('.dr-tool-edit-toggle').forEach(function(btn){
//     btn.addEventListener('click', function(){
//       var drawer=document.getElementById(btn.dataset.target), details=btn.dataset.hide?document.getElementById(btn.dataset.hide):null;
//       if(!drawer)return;
//       var opening=drawer.style.display==='none';
//       drawer.style.display=opening?'block':'none';
//       if(details)details.style.display=opening?'none':'block';
//     });
//   });

//   /* close/cancel */
//   document.querySelectorAll('[data-close]').forEach(function(btn){
//     btn.addEventListener('click', function(){
//       var drawer=document.getElementById(btn.dataset.close), show=btn.dataset.show?document.getElementById(btn.dataset.show):null;
//       if(drawer)drawer.style.display='none'; if(show)show.style.display='block';
//     });
//   });

//   /* ── EXECUTIVE SUMMARY accordions ── starts CLOSED ── */
//   document.querySelectorAll('.dr-acc-trigger').forEach(function(btn){
//     btn.addEventListener('click', function(){
//       var id   = btn.dataset.acc;
//       var body = document.getElementById('dr-acc-body-' + id);
//       var arr  = btn.querySelector('.dr-acc-arrow');
//       if (!body) return;
//       var open = body.classList.contains('open');
//       body.classList.toggle('open', !open);
//       if (arr) arr.style.transform = open ? '' : 'rotate(180deg)';
//     });
//   });

//   /* ── Accordion "+ Add" buttons — outside the trigger ── */
//   document.querySelectorAll('.dr-acc-add-btn').forEach(function(btn){
//     btn.addEventListener('click', function(e){
//       e.stopPropagation();
//       var accId = btn.dataset.accId;
//       /* auto-open if closed */
//       var body    = document.getElementById('dr-acc-body-' + accId);
//       var trigger = document.querySelector('.dr-acc-trigger[data-acc="' + accId + '"]');
//       var arr     = trigger ? trigger.querySelector('.dr-acc-arrow') : null;
//       if (body && !body.classList.contains('open')) {
//         body.classList.add('open');
//         if (arr) arr.style.transform = 'rotate(180deg)';
//       }
//       var rows = document.getElementById('dr-acc-rows-' + accId);
//       if (!rows) return;
//       var div = document.createElement('div');
//       div.className = 'dr-sum-row';
//       div.innerHTML = '<span class="dr-sum-dot"></span><span class="dr-sum-item" contenteditable="true" style="outline:1.5px dashed #b2ddef;border-radius:3px;padding:1px 5px;">New item\u2026</span><button class="dr-row-del" onclick="this.closest(\'.dr-sum-row\').remove()">&#x2715;</button>';
//       rows.appendChild(div);
//       var ed = div.querySelector('[contenteditable]');
//       if (ed) { ed.focus(); ed.addEventListener('keydown', function(ev){ if(ev.key==='Enter'){ev.preventDefault();ed.blur();} }); }
//     });
//   });

//   /* ── Clause panel: chapter nav toggles ── */
//   document.querySelectorAll('.dr-cl-nav-ch-btn').forEach(function(btn){
//     btn.addEventListener('click', function(){
//       var ci   = btn.dataset.ci;
//       var body = document.getElementById('dr-cl-nav-body-' + ci);
//       var arr  = btn.querySelector('.dr-cl-nav-ch-arrow');
//       if (!body) return;
//       var open = body.classList.contains('open');
//       body.classList.toggle('open', !open);
//       if (arr) arr.textContent = open ? '\u25B6' : '\u25BC';
//     });
//   });

//   /* ── Clause panel: clause click → workspace ── */
//   document.querySelectorAll('.dr-cl-nav-clause').forEach(function(btn){
//     btn.addEventListener('click', function(){
//       document.querySelectorAll('.dr-cl-nav-clause').forEach(function(b){b.classList.remove('active');});
//       btn.classList.add('active');
//       var ci  = parseInt(btn.dataset.ci);
//       var cli = parseInt(btn.dataset.cli);
//       var cId = btn.dataset.circ;
//       var fl  = window._savedFlow[cId];
//       var ch  = fl && fl.clauses && fl.clauses[ci];
//       var cl  = ch && ch.clauses && ch.clauses[cli];
//       if (cl) window._drShowClauseWorkspace(cl, ci, cli, cId);
//     });
//   });

//   /* ── Add Chapter button ── */
//   var addChBtn = document.getElementById('dr-cl-add-ch-btn');
//   if (addChBtn) addChBtn.addEventListener('click', function(){
//     var tree = document.getElementById('dr-cl-nav-tree'); if (!tree) return;
//     var ci   = tree.querySelectorAll('.dr-cl-nav-chapter').length;
//     var div  = document.createElement('div');
//     div.innerHTML = _drBuildNavChapter({title:'New Chapter '+(ci+1), clauses:[]}, ci, circId);
//     tree.appendChild(div.firstElementChild);
//     /* bind toggle on new chapter */
//     var newChBtn = tree.querySelector('[data-ci="'+ci+'"]');
//     if (newChBtn) newChBtn.addEventListener('click', function(){
//       var body = document.getElementById('dr-cl-nav-body-'+ci);
//       var arr  = newChBtn.querySelector('.dr-cl-nav-ch-arrow');
//       if (!body) return;
//       var open = body.classList.contains('open');
//       body.classList.toggle('open', !open);
//       if (arr) arr.textContent = open ? '\u25B6' : '\u25BC';
//     });
//     var cnt = document.getElementById('dr-cl-nav-count');
//     if (cnt) cnt.textContent = tree.querySelectorAll('.dr-cl-nav-clause').length + ' clauses';
//     showToast('Chapter added.','success');
//   });
// }

// /* ================================================================ HELPERS */
// window._drAddClause = function(ci, circId) {
//   var navBody = document.getElementById('dr-cl-nav-body-' + ci);
//   var tree    = document.getElementById('dr-cl-nav-tree');
//   if (!navBody) return;
//   var cli   = navBody.querySelectorAll('.dr-cl-nav-clause').length;
//   var newCl = { id:(ci+1)+'.'+(cli+1), text:'New clause\u2026', risk:'Low', department:'Compliance', status:'Pending', obligation:'', actionable:'' };
//   var div   = document.createElement('div');
//   div.innerHTML = _drBuildNavClause(newCl, ci, cli, circId||'');
//   navBody.appendChild(div.firstElementChild);
//   navBody.classList.add('open');
//   var chBtn = document.querySelector('[data-ci="'+ci+'"]');
//   if (chBtn) { var arr=chBtn.querySelector('.dr-cl-nav-ch-arrow'); if(arr)arr.textContent='\u25BC'; }
//   var newBtn = navBody.querySelector('[data-ck="'+ci+'-'+cli+'"]');
//   if (newBtn) newBtn.addEventListener('click', function(){
//     document.querySelectorAll('.dr-cl-nav-clause').forEach(function(b){b.classList.remove('active');});
//     newBtn.classList.add('active');
//     window._drShowClauseWorkspace(newCl, ci, cli, circId||'');
//   });
//   var cnt = document.getElementById('dr-cl-nav-count');
//   if (cnt) cnt.textContent = (tree?tree.querySelectorAll('.dr-cl-nav-clause').length:0) + ' clauses';
//   showToast('Clause added.','success');
// };

// window._drAddObligation = function(ck, circId, clauseId) {
//   var wrap  = document.getElementById('dr-oblig-wrap-' + ck);
//   var noOb  = document.getElementById('dr-no-oblig-' + ck);
//   if (noOb) noOb.remove();
//   if (!wrap) return;
//   var oi  = wrap.querySelectorAll('.dr-oblig-item').length;
//   var div = document.createElement('div');
//   div.innerHTML = _drBuildObligationItem('New obligation\u2026', [], ck, circId, clauseId, oi, false);
//   wrap.appendChild(div.firstElementChild);
//   /* bind its accordion toggle */
//   var trigger = wrap.querySelector('#dr-oblig-'+oi+'-'+ck+' .dr-oblig-trigger');
//   if (trigger) trigger.addEventListener('click', function(){
//     var body = document.getElementById('dr-oblig-body-'+oi+'-'+ck);
//     var arr  = trigger.querySelector('.dr-oblig-arr');
//     if (!body) return;
//     var open = body.classList.contains('open');
//     body.classList.toggle('open', !open);
//     if (arr) arr.textContent = open ? '▶' : '▼';
//   });
//   var ed = wrap.querySelector('#dr-oblig-'+oi+'-'+ck+' .dr-oblig-text-full');
//   if (ed) { ed.focus(); }
// };

// window._drAddAction = function(oi, ck) {
//   var list = document.getElementById('dr-alist-' + oi + '-' + ck); if (!list) return;
//   var ai   = list.querySelectorAll('.dr-action-row').length;
//   var div  = document.createElement('div'); div.className = 'dr-action-row';
//   div.innerHTML = '<span class="dr-action-num">'+(ai+1)+'</span><span class="dr-action-txt dr-editable" contenteditable="true" style="outline:1.5px dashed #b2ddef;border-radius:3px;padding:1px 4px;">New action\u2026</span><button class="dr-row-del" onclick="this.closest(\'.dr-action-row\').remove()">&#x2715;</button>';
//   list.appendChild(div);
//   var ed = div.querySelector('[contenteditable]'); if (ed) ed.focus();
// };

// window._drAddTag = function(ck) {
//   var input = document.getElementById('dr-tinput-'+ck), list = document.getElementById('dr-tlist-'+ck);
//   if (!input||!list) return;
//   var val = input.value.trim().replace(/,/g,''); if (!val) return;
//   var span = document.createElement('span'); span.className='dr-ctag';
//   span.innerHTML = val+'<button onclick="this.parentElement.remove()">&#xD7;</button>';
//   list.appendChild(span); input.value='';
// };

// window.saveDraftReview   = function() { var circId=_drCurrentCircId(); if(!circId){showToast('Select a circular first.','warning');return;} window._draftStore[circId]={status:'draft',savedAt:new Date().toISOString()}; _drUpdateBadge(circId,'draft'); showToast('💾 Draft saved.','success'); };
// window.publishToLibrary  = function() { var circId=_drCurrentCircId(); if(!circId){showToast('Select a circular first.','warning');return;} window._draftStore[circId]={status:'library',savedAt:new Date().toISOString()}; _drUpdateBadge(circId,'library'); showToast('📚 Published to Central Library.','success'); };
// function _drCurrentCircId() { var sel=document.querySelector('.dr-csel-item.selected'); return sel?sel.dataset.id:null; }
// function _drUpdateBadge(circId,status) { var badge=document.getElementById('dr-status-badge'); if(!badge)return; badge.style.display='inline-flex'; badge.className='dr-status-badge dr-badge-'+(status==='library'?'lib':'draft'); badge.textContent=status==='library'?'✓ In Central Library':'💾 Draft Saved'; }
// function _drNotSaved(label) { return '<div class="dr-not-saved"><div class="dr-ns-icon">📭</div><div class="dr-ns-title">'+label+' not saved yet</div><div class="dr-ns-sub">Complete this step in the AI Engine first.</div><button class="dr-btn dr-btn-sec" onclick="window.CMS&&window.CMS.navigateTo&&window.CMS.navigateTo(\'ai-engine\')">← AI Engine</button></div>'; }

// /* ================================================================ CSS */
// function injectDraftReviewCSS() {
//   if (document.getElementById('dr-css')) return;
//   var s = document.createElement('style');
//   s.id = 'dr-css';
//   s.textContent = `

// /* ── ROOT ── */
// :root {
//   --dr-bg:       #f4f6f9;
//   --dr-card:     #ffffff;
//   --dr-nav:      #f8f9fb;
//   --dr-border:   #e2e6ed;
//   --dr-border-lt:#edf0f5;
//   --dr-text-pri: #1e2433;
//   --dr-text-sec: #5a6478;
//   --dr-text-mut: #9aa3b5;
//   --dr-accent:   #0d7fa5;
//   --dr-accent-lt:#e6f4f9;
//   --dr-accent-md:#b2ddef;
//   --dr-purple:   #5b5fcf;
//   --dr-purple-lt:#ededfc;
//   --dr-green:    #0e9f6e;
//   --dr-green-lt: #e8faf4;
//   --dr-amber:    #b45309;
//   --dr-amber-lt: #fef3c7;
//   --dr-red:      #c92a2a;
//   --dr-red-lt:   #fdecea;
//   --dr-radius:   8px;
//   --dr-radius-lg:12px;
//   --dr-shadow:   0 1px 4px rgba(30,36,51,.07);
// }

// /* ── BASE ── */
// .dr-page { max-width:980px;margin:0 auto;padding-bottom:60px;font-family:'DM Sans',system-ui,sans-serif;color:var(--dr-text-pri); }
// .dr-page-head { display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:12px;margin-bottom:20px; }
// .dr-page-title { font-size:20px;font-weight:800;color:var(--dr-text-pri);margin-bottom:3px; }
// .dr-page-sub   { font-size:12px;color:var(--dr-text-mut); }
// .dr-head-actions { display:flex;gap:8px; }

// /* ── BUTTONS ── */
// .dr-btn { display:inline-flex;align-items:center;gap:6px;padding:8px 16px;border-radius:var(--dr-radius);font-family:inherit;font-size:12px;font-weight:700;cursor:pointer;border:none;transition:all .14s;white-space:nowrap; }
// .dr-btn-pri   { background:var(--dr-text-pri);color:#fff; } .dr-btn-pri:hover { background:#2a3248; }
// .dr-btn-sec   { background:#f5f6f8;color:var(--dr-text-sec);border:1.5px solid var(--dr-border); } .dr-btn-sec:hover { background:#eef0f3; }
// .dr-btn-ghost { background:none;color:var(--dr-text-mut);border:1px solid var(--dr-border);padding:5px 12px;font-size:11px; } .dr-btn-ghost:hover { color:var(--dr-text-pri);border-color:var(--dr-text-pri); }
// .dr-btn-sm    { padding:5px 12px;font-size:11px; }
// .dr-btn-next  { background:var(--dr-text-pri);color:#fff;padding:9px 20px;font-size:13px; } .dr-btn-next:hover { background:#2a3248; }

// /* ── PICKER ── */
// .dr-picker-card { display:flex;align-items:center;gap:16px;background:var(--dr-card);border:1px solid var(--dr-border);border-radius:var(--dr-radius-lg);padding:16px 20px;margin-bottom:20px;box-shadow:var(--dr-shadow); }
// .dr-picker-icon { font-size:22px;flex-shrink:0; }
// .dr-picker-inner { flex:1;min-width:0; }
// .dr-picker-label { font-size:10px;font-weight:700;color:var(--dr-text-mut);text-transform:uppercase;letter-spacing:.06em;margin-bottom:5px; }
// .dr-custom-select-wrap { position:relative; }
// .dr-custom-select-btn { width:100%;display:flex;align-items:center;justify-content:space-between;gap:8px;padding:9px 12px;background:#f5f6f8;border:1.5px solid var(--dr-border);border-radius:var(--dr-radius);font-family:inherit;font-size:13px;color:var(--dr-text-pri);cursor:pointer;transition:all .14s; }
// .dr-custom-select-btn:hover { border-color:var(--dr-text-mut);background:#fff; }
// .dr-csel-placeholder { color:var(--dr-text-mut); } .dr-csel-arrow { color:var(--dr-text-mut);flex-shrink:0; }
// .dr-custom-dropdown { position:absolute;top:calc(100% + 5px);left:0;right:0;background:#fff;border:1.5px solid var(--dr-border);border-radius:10px;z-index:9999;box-shadow:0 8px 24px rgba(26,26,46,.12);overflow:hidden; }
// .dr-csel-search-wrap { padding:10px 12px;border-bottom:1px solid var(--dr-border-lt); }
// .dr-csel-search { width:100%;padding:7px 10px;background:#f5f6f8;border:1px solid var(--dr-border);border-radius:6px;font-family:inherit;font-size:12px;color:var(--dr-text-pri);outline:none;box-sizing:border-box; }
// .dr-csel-list { max-height:220px;overflow-y:auto; }
// .dr-csel-item { padding:9px 14px;cursor:pointer;border-bottom:1px solid #f5f6f8;transition:background .1s; }
// .dr-csel-item:last-child { border-bottom:none; } .dr-csel-item:hover,.dr-csel-item.selected { background:var(--dr-accent-lt); }
// .dr-csel-item-top { display:flex;align-items:center;gap:7px;margin-bottom:3px; }
// .dr-csel-item-id { font-family:'DM Mono',monospace;font-size:11px;font-weight:700;color:var(--dr-text-pri); }
// .dr-csel-risk { font-size:9px;font-weight:700;padding:1px 6px;border-radius:4px; }
// .dr-csel-risk-high { background:var(--dr-red-lt);color:var(--dr-red); } .dr-csel-risk-medium { background:var(--dr-amber-lt);color:var(--dr-amber); } .dr-csel-risk-low { background:var(--dr-green-lt);color:var(--dr-green); }
// .dr-csel-reg { font-size:11px;color:var(--dr-text-mut);margin-left:auto; }
// .dr-csel-item-title { font-size:12px;color:var(--dr-text-sec);line-height:1.4; }
// .dr-status-badge { font-size:11px;font-weight:700;padding:5px 14px;border-radius:20px;flex-shrink:0; }
// .dr-badge-draft { background:var(--dr-amber-lt);color:var(--dr-amber);border:1px solid #fcd34d; }
// .dr-badge-lib   { background:var(--dr-green-lt);color:var(--dr-green);border:1px solid #6ee7b7; }

// /* ── STEPPER ── */
// .dr-stepper { display:flex;align-items:center;background:var(--dr-card);border:1px solid var(--dr-border);border-radius:var(--dr-radius);padding:10px 16px;margin-bottom:16px;gap:0; }
// .dr-step-btn { display:inline-flex;align-items:center;gap:7px;padding:7px 14px;background:none;border:none;cursor:pointer;border-radius:var(--dr-radius);font-family:inherit;font-size:12px;font-weight:600;color:var(--dr-text-mut);transition:all .13s;white-space:nowrap; }
// .dr-step-btn:hover { background:#f5f6f8;color:var(--dr-text-pri); } .dr-step-btn.active { background:var(--dr-text-pri);color:#fff; }
// .dr-step-num { width:20px;height:20px;border-radius:50%;background:#eef0f3;color:var(--dr-text-sec);display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:800;flex-shrink:0; }
// .dr-step-btn.active .dr-step-num { background:rgba(255,255,255,.2);color:#fff; }
// .dr-step-line { flex:1;height:1px;background:#eef0f3;min-width:12px; }

// /* ── PANEL SHELL ── */
// .dr-panel { background:var(--dr-card);border:1px solid var(--dr-border);border-radius:var(--dr-radius-lg);overflow:hidden;box-shadow:var(--dr-shadow); }
// .dr-panel-toolbar { display:flex;align-items:center;justify-content:space-between;padding:12px 18px;border-bottom:1px solid var(--dr-border-lt);background:var(--dr-nav); }
// .dr-panel-title-wrap { display:flex;align-items:center;gap:8px; }
// .dr-panel-icon  { font-size:15px; } .dr-panel-title { font-size:13px;font-weight:700;color:var(--dr-text-pri); }
// .dr-cl-total-badge { font-size:10px;font-weight:600;padding:2px 9px;background:#e8ebf1;border-radius:20px;color:var(--dr-text-sec); }
// .dr-toolbar-actions { display:flex;gap:6px;align-items:center;flex-wrap:wrap; }
// .dr-tool-btn { display:inline-flex;align-items:center;gap:5px;padding:5px 12px;background:var(--dr-card);border:1.5px solid var(--dr-border);border-radius:6px;font-family:inherit;font-size:11px;font-weight:600;color:var(--dr-text-sec);cursor:pointer;transition:all .13s;white-space:nowrap; }
// .dr-tool-btn:hover { border-color:var(--dr-text-pri);color:var(--dr-text-pri); }
// .dr-tool-btn-pri { background:var(--dr-text-pri);color:#fff;border-color:var(--dr-text-pri); } .dr-tool-btn-pri:hover { background:#2a3248; }
// .dr-edit-drawer { background:#f0f7ff;border-top:1px solid #c8e2f5;border-bottom:1px solid #c8e2f5;padding:16px 20px; }
// .dr-edit-grid   { display:grid;grid-template-columns:1fr 1fr;gap:10px; }
// .dr-edit-field  { display:flex;flex-direction:column;gap:4px; } .dr-edit-field-full { grid-column:1/-1; }
// .dr-edit-label  { font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.05em; }
// .dr-edit-input  { padding:7px 10px;background:#fff;border:1px solid var(--dr-border);border-radius:6px;font-family:inherit;font-size:12px;color:var(--dr-text-pri);outline:none; }
// .dr-edit-input:focus { border-color:var(--dr-accent); }
// .dr-edit-ta     { min-height:72px;padding:8px 10px;background:#fff;border:1px solid var(--dr-border);border-radius:6px;font-family:inherit;font-size:12px;color:var(--dr-text-pri);outline:none;resize:vertical;width:100%;box-sizing:border-box; }
// .dr-edit-foot   { display:flex;justify-content:flex-end;align-items:center;gap:8px;margin-top:12px; }
// .dr-panel-foot  { display:flex;align-items:center;justify-content:space-between;padding:12px 18px;border-top:1px solid var(--dr-border-lt);background:var(--dr-nav); }
// .dr-block-pad   { padding:14px 18px; }
// .dr-info-block  { background:#f8f9fc;border:1px solid var(--dr-border-lt);border-radius:var(--dr-radius);padding:12px 14px; }
// .dr-info-block-amber { background:#fffbeb;border-color:#fcd34d; }
// .dr-ib-label    { font-size:10px;font-weight:700;color:var(--dr-text-mut);text-transform:uppercase;letter-spacing:.05em;margin-bottom:5px; }
// .dr-ib-text     { font-size:12px;color:var(--dr-text-sec);line-height:1.7; }
// .dr-section-label { font-size:10px;font-weight:700;color:var(--dr-text-mut);text-transform:uppercase;letter-spacing:.05em;margin-bottom:8px; }

// /* ── OVERVIEW ── */
// .dr-ov-hero { display:flex;align-items:flex-start;justify-content:space-between;gap:14px;padding:16px 18px;border-bottom:1px solid var(--dr-border-lt);flex-wrap:wrap; }
// .dr-ov-hero-left { flex:1;min-width:0; }
// .dr-ov-id    { font-family:'DM Mono',monospace;font-size:10px;font-weight:700;color:var(--dr-text-mut);text-transform:uppercase;letter-spacing:.08em;margin-bottom:4px; }
// .dr-ov-title { font-size:15px;font-weight:700;color:var(--dr-text-pri);line-height:1.4;margin-bottom:8px; }
// .dr-ov-chips { display:flex;gap:6px;flex-wrap:wrap; }
// .dr-deadline-box { padding:10px 16px;background:var(--dr-amber-lt);border:1.5px solid #fcd34d;border-radius:10px;text-align:center;flex-shrink:0; }
// .dr-dl-label { font-size:9px;font-weight:700;color:var(--dr-amber);text-transform:uppercase;letter-spacing:.06em;margin-bottom:2px; }
// .dr-dl-date  { font-size:13px;font-weight:700;color:#92400e; }
// .dr-chip     { padding:3px 10px;background:#f0f1f4;border:1px solid var(--dr-border);border-radius:20px;font-size:11px;font-weight:700;color:var(--dr-text-sec); }
// .dr-chip-sm  { padding:2px 8px;font-size:10px; }
// .dr-chip-blue   { background:var(--dr-accent-lt);border-color:var(--dr-accent-md);color:var(--dr-accent); }
// .dr-chip-status { background:#f3f4f6;color:#52525b; }
// .dr-chip-risk-high   { background:var(--dr-red-lt);border-color:#f5b8b8;color:var(--dr-red); }
// .dr-chip-risk-medium { background:var(--dr-amber-lt);border-color:#fcd34d;color:var(--dr-amber); }
// .dr-chip-risk-low    { background:var(--dr-green-lt);border-color:#6ee7b7;color:var(--dr-green); }
// .dr-detail-grid { display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:var(--dr-border-lt); }
// .dr-detail-cell { background:#fafbfc;padding:9px 14px; }
// .dr-dc-label { font-size:9px;font-weight:700;color:var(--dr-text-mut);text-transform:uppercase;letter-spacing:.05em;margin-bottom:2px; }
// .dr-dc-val   { font-size:12px;font-weight:600;color:var(--dr-text-pri); }
// .dr-tags-row { display:flex;flex-wrap:wrap;gap:6px;padding:12px 18px; }
// .dr-tag      { padding:2px 10px;background:var(--dr-accent-lt);border:1px solid var(--dr-accent-md);border-radius:20px;font-size:11px;font-weight:600;color:var(--dr-accent); }

// /* ── APPLICABILITY ── */
// .dr-verdict-banner { display:flex;align-items:center;gap:14px;margin:16px 18px;padding:14px 16px;border:1px solid;border-radius:10px;flex-wrap:wrap; }
// .dr-verdict-badge  { padding:5px 14px;border-radius:6px;font-size:13px;font-weight:800;flex-shrink:0; }
// .dr-verdict-info   { flex:1; }
// .dr-verdict-entity { font-size:12px;color:var(--dr-text-sec);margin-bottom:2px; }
// .dr-verdict-owner  { font-size:11px;color:var(--dr-text-mut); }
// .dr-verdict-deadline { text-align:center;flex-shrink:0; }
// .dr-vd-label { font-size:9px;font-weight:700;color:var(--dr-text-mut);text-transform:uppercase;margin-bottom:2px; }
// .dr-vd-date  { font-size:14px;font-weight:700;color:var(--dr-text-pri); }
// .dr-table    { width:100%;border-collapse:collapse;font-size:12px; }
// .dr-table th { text-align:left;padding:7px 12px;background:#f5f6f8;border-bottom:1px solid var(--dr-border);font-size:10px;font-weight:700;color:var(--dr-text-mut);text-transform:uppercase;letter-spacing:.04em; }
// .dr-table td { padding:8px 12px;border-bottom:1px solid #f5f6f8;color:var(--dr-text-sec); }
// .dr-table tr:last-child td { border-bottom:none; }
// .dr-app-pill { padding:2px 9px;border-radius:20px;font-size:11px;font-weight:700; }
// .dr-app-yes  { background:var(--dr-green-lt);color:var(--dr-green); } .dr-app-no { background:var(--dr-red-lt);color:var(--dr-red); }
// .dr-tbl-add-btn { display:inline-flex;align-items:center;padding:3px 10px;background:var(--dr-accent-lt);border:1.5px solid var(--dr-accent-md);border-radius:5px;font-family:inherit;font-size:10px;font-weight:700;color:var(--dr-accent);cursor:pointer;transition:all .12s; }
// .dr-tbl-add-btn:hover { background:var(--dr-accent-md); }
// .dr-tbl-del-btn { padding:2px 7px;background:none;border:1px solid #f5b8b8;border-radius:4px;color:var(--dr-red);cursor:pointer;font-size:11px;font-weight:700;transition:all .12s; }
// .dr-tbl-del-btn:hover { background:var(--dr-red-lt); }
// .dr-tbl-select { padding:3px 6px;background:#fff;border:1px solid var(--dr-border);border-radius:5px;font-family:inherit;font-size:10px;color:var(--dr-text-pri);outline:none;margin-right:4px; }

// /* ══════════════════════════════════════════════════════════════
//    EXECUTIVE SUMMARY ACCORDIONS
//    Header = flex row: [trigger button flex-1] [+ Add button]
//    Trigger contains: icon | label | spacer | badge | arrow
//    + Add button is OUTSIDE the trigger (no nested buttons)
// ══════════════════════════════════════════════════════════════ */
// .dr-sum-accordions { border-top:1px solid var(--dr-border-lt); }
// .dr-acc-item   { border-bottom:1px solid var(--dr-border-lt); } .dr-acc-item:last-child { border-bottom:none; }

// /* Header row — flex, keeps add button neatly on the right */
// .dr-acc-header {
//   display:flex;
//   align-items:center;
//   background:var(--dr-nav);
//   border-bottom:1px solid transparent;
// }
// .dr-acc-header:hover { background:var(--dr-bg); }

// /* Trigger takes all remaining space */
// .dr-acc-trigger {
//   flex:1;
//   display:flex;
//   align-items:center;
//   gap:10px;
//   padding:13px 14px 13px 18px;
//   background:none;
//   border:none;
//   cursor:pointer;
//   font-family:inherit;
//   font-size:12px;
//   font-weight:700;
//   color:var(--dr-text-pri);
//   text-align:left;
//   min-width:0;
// }
// .dr-acc-icon   { font-size:14px;flex-shrink:0; }
// .dr-acc-label  { font-size:12px;font-weight:700;color:var(--dr-text-pri); }
// .dr-acc-spacer { flex:1; }   /* pushes badge + arrow to the right inside trigger */
// .dr-acc-badge  { font-size:10px;font-weight:600;padding:2px 8px;background:#e8ebf1;border:1px solid var(--dr-border);border-radius:10px;color:var(--dr-text-mut);flex-shrink:0;white-space:nowrap; }
// .dr-acc-arrow  { font-size:9px;color:var(--dr-text-mut);flex-shrink:0;transition:transform .2s; }

// /* + Add button — sits right of trigger, never inside it */
// .dr-acc-add-btn {
//   flex-shrink:0;
//   margin:0 12px 0 6px;
//   padding:5px 12px;
//   background:#fff;
//   border:1.5px solid var(--dr-border);
//   border-radius:6px;
//   font-family:inherit;
//   font-size:10px;
//   font-weight:700;
//   color:var(--dr-text-sec);
//   cursor:pointer;
//   transition:all .12s;
//   white-space:nowrap;
// }
// .dr-acc-add-btn:hover { border-color:var(--dr-accent);color:var(--dr-accent);background:var(--dr-accent-lt); }

// /* Body — starts CLOSED */
// .dr-acc-body  { display:none;border-top:1px solid var(--dr-border-lt);background:#fafbfc; }
// .dr-acc-body.open { display:block; }
// .dr-acc-rows  { padding:10px 16px;display:flex;flex-direction:column;gap:5px; }

// /* Summary rows */
// .dr-sum-row { display:flex;align-items:flex-start;gap:8px;padding:8px 10px;background:#fff;border:1px solid var(--dr-border-lt);border-radius:var(--dr-radius); }
// .dr-sum-num-icon { flex-shrink:0;width:20px;height:20px;background:var(--dr-purple-lt);color:var(--dr-purple);border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;margin-top:1px; }
// .dr-sum-dot { flex-shrink:0;width:8px;height:8px;background:var(--dr-purple);border-radius:50%;margin-top:6px; }
// .dr-sum-dot-tech { background:#8b5cf6; }
// .dr-sum-item { flex:1;font-size:12px;color:var(--dr-text-sec);line-height:1.6;outline:none; }
// .dr-sum-item:focus { outline:1.5px dashed var(--dr-accent-md);border-radius:3px;padding:1px 4px; }
// .dr-sum-item-plain { font-size:12px;color:var(--dr-text-sec);line-height:1.7;padding:6px 0;outline:none; }
// .dr-sum-item-plain:focus { outline:1.5px dashed var(--dr-accent-md);border-radius:4px;padding:6px 8px; }
// .dr-risk-pill { flex-shrink:0;padding:2px 8px;border-radius:4px;font-size:10px;font-weight:700; }
// .dr-risk-high { background:var(--dr-red-lt);color:var(--dr-red); } .dr-risk-medium { background:var(--dr-amber-lt);color:var(--dr-amber); } .dr-risk-low { background:var(--dr-green-lt);color:var(--dr-green); }
// .dr-row-del { flex-shrink:0;padding:1px 6px;background:none;border:none;color:#c4c8d4;cursor:pointer;font-size:12px;transition:color .12s; }
// .dr-row-del:hover { color:var(--dr-red); }
// .dr-org-metrics { display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:12px; }
// .dr-org-metric  { background:#fff;border:1px solid var(--dr-border-lt);border-radius:var(--dr-radius);padding:10px;text-align:center; }
// .dr-om-val   { font-size:20px;font-weight:800;color:var(--dr-text-pri);line-height:1; }
// .dr-om-label { font-size:10px;color:var(--dr-text-mut);text-transform:uppercase;letter-spacing:.04em;margin-top:3px; }

// /* ══════════════════════════════════════════════════════════════
//    CLAUSE GENERATION SPLIT PANE
//    Matches clause-panel.js aesthetic
// ══════════════════════════════════════════════════════════════ */
// .dr-cl-split { display:grid;grid-template-columns:248px 1fr;min-height:560px;border-top:1px solid var(--dr-border-lt); }

// /* LEFT NAV */
// .dr-cl-nav { border-right:1px solid var(--dr-border-lt);display:flex;flex-direction:column;background:var(--dr-nav); }
// .dr-cl-nav-head { display:flex;align-items:center;justify-content:space-between;padding:11px 14px;border-bottom:1px solid var(--dr-border-lt); }
// .dr-cl-nav-title { font-size:10px;font-weight:700;color:var(--dr-text-mut);text-transform:uppercase;letter-spacing:.07em; }
// .dr-cl-nav-count { font-size:10px;color:var(--dr-text-mut);background:#e8ebf1;padding:2px 8px;border-radius:10px; }
// .dr-cl-nav-tree  { flex:1;overflow-y:auto;padding:4px 0; }
// .dr-cl-nav-tree::-webkit-scrollbar { width:3px; } .dr-cl-nav-tree::-webkit-scrollbar-thumb { background:var(--dr-border);border-radius:3px; }

// /* Chapter row */
// .dr-cl-nav-ch-row { display:flex;align-items:center; }
// .dr-cl-nav-ch-btn { flex:1;display:flex;align-items:center;gap:7px;padding:9px 10px 9px 12px;background:none;border:none;cursor:pointer;font-family:inherit;font-size:11px;font-weight:700;color:var(--dr-text-pri);text-align:left;transition:background .1s;min-width:0; }
// .dr-cl-nav-ch-btn:hover { background:var(--dr-bg); }
// .dr-cl-nav-ch-arrow { font-size:8px;color:var(--dr-text-mut);flex-shrink:0;width:10px; }
// .dr-cl-nav-ch-label { flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap; }
// .dr-cl-nav-ch-count { font-size:10px;color:var(--dr-text-mut);background:#e8ebf1;padding:1px 6px;border-radius:8px;flex-shrink:0; }

// /* Chapter action icons (excel + add clause) */
// .dr-cl-ch-actions { display:flex;gap:2px;padding-right:8px;flex-shrink:0; }
// .dr-cl-ch-action-btn { display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;background:none;border:1px solid var(--dr-border);border-radius:5px;font-size:12px;cursor:pointer;color:var(--dr-text-sec);transition:all .12s; }
// .dr-cl-ch-action-btn:hover { background:var(--dr-accent-lt);border-color:var(--dr-accent-md);color:var(--dr-accent); }

// /* Chapter body — closed by default */
// .dr-cl-nav-ch-body { display:none;padding-bottom:4px; }
// .dr-cl-nav-ch-body.open { display:block; }

// /* Clause button */
// .dr-cl-nav-clause { width:100%;display:flex;flex-direction:column;align-items:flex-start;gap:3px;padding:8px 12px 8px 26px;background:none;border:none;border-left:3px solid transparent;cursor:pointer;font-family:inherit;text-align:left;transition:all .1s; }
// .dr-cl-nav-clause:hover  { background:var(--dr-bg); }
// .dr-cl-nav-clause.active { background:var(--dr-accent-lt);border-left-color:var(--dr-accent); }
// .dr-cl-nav-cl-row { display:flex;align-items:center;gap:6px;width:100%; }
// .dr-cl-nav-cl-id  { font-family:'DM Mono',monospace;font-size:10px;font-weight:700;color:var(--dr-purple); }
// .dr-cl-nav-cl-text{ font-size:11px;color:var(--dr-text-sec);line-height:1.4;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:178px; }
// .dr-cl-nav-risk   { font-size:9px;font-weight:700;padding:1px 6px;border-radius:4px;margin-left:auto; }
// .dr-cl-risk-high   { background:var(--dr-red-lt);color:var(--dr-red); }
// .dr-cl-risk-medium { background:var(--dr-amber-lt);color:var(--dr-amber); }
// .dr-cl-risk-low    { background:var(--dr-green-lt);color:var(--dr-green); }

// /* RIGHT WORKSPACE */
// .dr-cl-workspace { flex:1;overflow-y:auto;display:flex;flex-direction:column; }
// .dr-cl-ws-placeholder { flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:40px;gap:8px; }
// .dr-ws-ph-icon  { font-size:32px;opacity:.3; }
// .dr-ws-ph-title { font-size:14px;font-weight:700;color:var(--dr-text-mut); }
// .dr-ws-ph-sub   { font-size:12px;color:#c0c7d6;max-width:240px;line-height:1.6; }
// .dr-cl-ws-inner { padding:22px 26px;display:flex;flex-direction:column;gap:16px; }

// /* Workspace header */
// .dr-cl-ws-head { display:flex;align-items:flex-start;justify-content:space-between;gap:12px;flex-wrap:wrap; }
// .dr-cl-ws-bc   { display:flex;align-items:center;gap:6px;margin-bottom:5px; }
// .dr-ws-bc-ch   { font-size:11px;color:var(--dr-text-mut); }
// .dr-ws-bc-sep  { font-size:11px;color:var(--dr-border); }
// .dr-ws-bc-id   { font-family:'DM Mono',monospace;font-size:11px;font-weight:700;color:var(--dr-accent); }

// /* Clause text block — matches clause-panel.js */
// .dr-ws-clause-block { background:var(--dr-accent-lt);border:1px solid var(--dr-accent-md);border-left:4px solid var(--dr-accent);border-radius:var(--dr-radius);padding:14px 16px; }
// .dr-ws-clause-label { font-size:10px;font-weight:700;color:var(--dr-accent);text-transform:uppercase;letter-spacing:.08em;margin-bottom:7px; }

// /* Obligations section */
// .dr-ws-section { display:flex;flex-direction:column;gap:8px; }
// .dr-ws-section-head { display:flex;align-items:center;justify-content:space-between; }
// .dr-ws-section-label { font-size:10px;font-weight:700;color:var(--dr-text-mut);text-transform:uppercase;letter-spacing:.08em; }
// .dr-ws-oblig-list { display:flex;flex-direction:column;gap:8px; }

// /* Obligation item */
// .dr-oblig-item { border:1px solid var(--dr-border);border-radius:var(--dr-radius);overflow:hidden;background:var(--dr-card); }
// .dr-oblig-trigger { width:100%;display:flex;align-items:center;justify-content:space-between;padding:11px 14px;background:var(--dr-nav);border:none;cursor:pointer;font-family:inherit;gap:10px;text-align:left;transition:background .12s; }
// .dr-oblig-trigger:hover { background:var(--dr-bg); }
// .dr-oblig-trigger-left { display:flex;align-items:flex-start;gap:9px;flex:1;min-width:0; }
// .dr-oblig-badge  { flex-shrink:0;min-width:26px;height:26px;background:var(--dr-purple);color:#fff;border-radius:5px;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;margin-top:1px; }
// .dr-oblig-preview{ font-size:13px;font-weight:500;color:var(--dr-text-pri);line-height:1.5; }
// .dr-oblig-arr    { font-size:10px;color:var(--dr-text-mut);flex-shrink:0; }

// /* Obligation body — closed by default */
// .dr-oblig-body { display:none;border-top:1px solid var(--dr-border-lt);padding:12px 14px;display:none;flex-direction:column;gap:10px; }
// .dr-oblig-body.open { display:flex; }
// .dr-oblig-text-full { font-size:13px;color:var(--dr-text-pri);line-height:1.7;outline:none; }
// .dr-oblig-text-full:focus { outline:1.5px dashed var(--dr-accent-md);border-radius:4px;padding:2px 6px; }

// /* Obligation controls row */
// .dr-oblig-controls { display:flex;flex-direction:column;gap:7px;padding:8px 10px;background:#f8f9fb;border:1px solid var(--dr-border-lt);border-radius:6px; }
// .dr-oblig-tags-row  { display:flex;align-items:center;flex-wrap:wrap;gap:6px; }
// .dr-oblig-actions-row{ display:flex;align-items:center;gap:8px; }
// .dr-oblig-del { padding:4px 10px;font-size:11px;border:1px solid #f5b8b8;border-radius:5px;color:var(--dr-red);background:none;cursor:pointer; }
// .dr-oblig-del:hover { background:var(--dr-red-lt); }

// /* Actions sub-list */
// .dr-actions-wrap  { display:flex;flex-direction:column;gap:6px; }
// .dr-nb-label-row  { display:flex;align-items:center;justify-content:space-between;margin-bottom:4px; }
// .dr-nb-label      { font-size:10px;font-weight:700;color:var(--dr-text-mut);text-transform:uppercase;letter-spacing:.06em; }
// .dr-actions-count { display:inline-flex;align-items:center;justify-content:center;min-width:17px;height:17px;padding:0 3px;background:#e8ebf1;color:var(--dr-text-sec);border-radius:9px;font-size:9px;font-weight:700;margin-left:4px; }
// .dr-actions-list  { display:flex;flex-direction:column;gap:5px; }
// .dr-action-row    { display:flex;align-items:flex-start;gap:7px;padding:7px 9px;background:var(--dr-card);border:1px solid var(--dr-border-lt);border-radius:5px; }
// .dr-action-num    { flex-shrink:0;width:19px;height:19px;background:var(--dr-accent-lt);color:var(--dr-accent);border:1px solid var(--dr-accent-md);border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:700;margin-top:1px; }
// .dr-action-txt    { flex:1;font-size:12px;color:var(--dr-text-pri);line-height:1.6;outline:none; }
// .dr-action-txt:focus { outline:1.5px dashed var(--dr-accent-md);border-radius:3px;padding:1px 4px; }

// /* Controls bar (dept/status/tags) */
// .dr-clause-controls { display:flex;align-items:flex-start;gap:12px;padding:9px 11px;background:#f5f6f8;border-radius:var(--dr-radius);flex-wrap:wrap; }
// .dr-ctrl-group { display:flex;align-items:center;gap:6px; }
// .dr-ctrl-label { font-size:9px;font-weight:700;color:var(--dr-text-mut);text-transform:uppercase;letter-spacing:.05em;white-space:nowrap; }
// .dr-ctrl-select{ padding:4px 8px;background:#fff;border:1px solid var(--dr-border);border-radius:5px;font-family:inherit;font-size:11px;color:var(--dr-text-pri);outline:none;cursor:pointer; }
// .dr-tags-ctrl  { display:flex;align-items:center;flex-wrap:wrap;gap:5px;flex:1; }
// .dr-tags-list  { display:flex;flex-wrap:wrap;gap:4px; }
// .dr-ctag { display:inline-flex;align-items:center;gap:3px;padding:2px 8px;background:var(--dr-accent-lt);border:1px solid var(--dr-accent-md);border-radius:20px;font-size:10px;font-weight:600;color:var(--dr-accent); }
// .dr-ctag button { background:none;border:none;color:var(--dr-text-mut);cursor:pointer;font-size:11px;padding:0;line-height:1; }
// .dr-tag-input  { padding:3px 7px;background:#fff;border:1px solid var(--dr-border);border-radius:5px;font-family:inherit;font-size:11px;outline:none;width:70px; }
// .dr-tag-input:focus { border-color:var(--dr-accent); }
// .dr-tag-add-btn{ padding:3px 7px;background:#f5f6f8;border:1px solid var(--dr-border);border-radius:4px;font-size:11px;cursor:pointer;color:var(--dr-text-sec);font-weight:700; }
// .dr-tag-add-btn:hover { border-color:var(--dr-accent);color:var(--dr-accent); }

// /* Other shared */
// .dr-add-sub-btn { padding:3px 10px;background:#fff;border:1.5px solid var(--dr-border);border-radius:5px;font-family:inherit;font-size:10px;font-weight:700;color:var(--dr-text-sec);cursor:pointer;transition:all .12s; }
// .dr-add-sub-btn:hover { border-color:var(--dr-purple);color:var(--dr-purple); }
// .dr-empty-hint  { font-size:11px;color:#c4c8d4;font-style:italic;padding:4px 0; }
// .dr-nb-content  { font-size:12px;color:var(--dr-text-pri);line-height:1.7;outline:none; }
// .dr-editable:focus { outline:1.5px dashed var(--dr-accent-md);border-radius:4px;padding:2px 5px; }
// .dr-map-btn { padding:4px 11px;background:var(--dr-purple-lt);border:1.5px solid #c4b5fd;border-radius:5px;font-family:inherit;font-size:10px;font-weight:700;color:var(--dr-purple);cursor:pointer;transition:all .13s; }
// .dr-map-btn:hover { background:#ede9fe;border-color:var(--dr-purple); }
// .dr-mapped-refs { display:flex;align-items:center;flex-wrap:wrap;gap:5px; }
// .dr-mapped-label{ font-size:9px;font-weight:700;color:var(--dr-text-mut);text-transform:uppercase;letter-spacing:.05em; }
// .dr-mapped-chip { display:inline-flex;align-items:center;gap:4px;padding:2px 9px;background:var(--dr-purple-lt);border:1px solid #c4b5fd;border-radius:20px;font-size:10px;font-weight:600;color:var(--dr-purple); }
// .dr-not-saved   { display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;padding:56px 24px;background:#fff;border:2px dashed var(--dr-border);border-radius:var(--dr-radius-lg);text-align:center; }
// .dr-ns-icon { font-size:32px;opacity:.4; } .dr-ns-title { font-size:14px;font-weight:700;color:var(--dr-text-pri); }
// .dr-ns-sub  { font-size:12px;color:var(--dr-text-mut);max-width:280px;line-height:1.5; }

// /* MAP MODAL */
// .dr-modal-overlay { position:fixed;inset:0;background:rgba(20,25,40,.45);z-index:9999;display:flex;align-items:flex-start;justify-content:center;padding:40px 16px;overflow-y:auto;backdrop-filter:blur(2px); }
// .dr-modal { background:#fff;border-radius:var(--dr-radius-lg);width:100%;max-width:740px;max-height:85vh;display:flex;flex-direction:column;overflow:hidden;box-shadow:0 24px 64px rgba(0,0,0,.2);font-family:inherit; }
// .dr-modal-head { padding:16px 20px;border-bottom:1px solid var(--dr-border-lt);display:flex;align-items:flex-start;justify-content:space-between;flex-shrink:0; }
// .dr-modal-head-left { flex:1;min-width:0; }
// .dr-modal-eyebrow { font-size:10px;font-weight:700;color:var(--dr-purple);text-transform:uppercase;letter-spacing:.08em;margin-bottom:5px; }
// .dr-modal-subject { font-size:13px;font-weight:700;color:var(--dr-text-pri);line-height:1.5; }
// .dr-modal-close { background:none;border:none;cursor:pointer;font-size:18px;color:var(--dr-text-mut);padding:2px 6px;flex-shrink:0; }
// .dr-modal-close:hover { color:var(--dr-text-pri); }
// .dr-modal-mapped-bar { display:flex;align-items:center;flex-wrap:wrap;gap:6px;padding:10px 20px;background:#fdf9ff;border-bottom:1px solid #ede9fe; }
// .dr-modal-mapped-label { font-size:10px;font-weight:700;color:var(--dr-text-mut);text-transform:uppercase;letter-spacing:.05em; }
// .dr-modal-search-bar { padding:10px 16px;border-bottom:1px solid var(--dr-border-lt);flex-shrink:0; }
// .dr-modal-search { width:100%;padding:8px 12px;background:#f5f6f8;border:1.5px solid var(--dr-border);border-radius:7px;font-family:inherit;font-size:13px;color:var(--dr-text-pri);outline:none;box-sizing:border-box;transition:border-color .14s; }
// .dr-modal-search:focus { border-color:var(--dr-purple);background:#fff; }
// .dr-modal-body  { overflow-y:auto;flex:1; }
// .dr-map-table   { width:100%;border-collapse:collapse;font-size:12px; }
// .dr-map-table th{ text-align:left;padding:8px 14px;background:#f5f6f8;border-bottom:1px solid var(--dr-border);font-size:10px;font-weight:700;color:var(--dr-text-mut);text-transform:uppercase;letter-spacing:.04em;position:sticky;top:0; }
// .dr-map-table td{ padding:10px 14px;border-bottom:1px solid #f5f6f8;vertical-align:top; }
// .dr-map-row:hover { background:#fdfcff; } .dr-map-row-mapped { background:#fdf9ff; }
// .dr-map-cid { font-family:'DM Mono',monospace;font-size:11px;font-weight:700;color:var(--dr-purple);background:var(--dr-purple-lt);border:1px solid #e0e7ff;padding:2px 7px;border-radius:4px; }
// .dr-map-circ-id { font-family:'DM Mono',monospace;font-size:10px;font-weight:700;color:var(--dr-text-pri);margin-bottom:2px; }
// .dr-map-circ-title { font-size:11px;color:var(--dr-text-mut); }
// .dr-map-ch   { font-size:11px;color:var(--dr-text-mut); } .dr-map-text { font-size:12px;color:var(--dr-text-sec);line-height:1.5; }
// .dr-map-row-btn { padding:4px 12px;background:#fff;border:1.5px solid #c4b5fd;border-radius:5px;font-family:inherit;font-size:10px;font-weight:700;color:var(--dr-purple);cursor:pointer;transition:all .13s;white-space:nowrap; }
// .dr-map-row-btn:hover { background:var(--dr-purple-lt); } .dr-map-row-btn.mapped { background:var(--dr-purple-lt);border-color:var(--dr-purple);color:#6d28d9; }
// .dr-modal-foot { padding:12px 20px;border-top:1px solid var(--dr-border-lt);background:var(--dr-nav);display:flex;align-items:center;justify-content:space-between;gap:12px;flex-shrink:0; }
// .dr-modal-foot-note { font-size:11px;color:var(--dr-text-mut);flex:1; }
// .dr-mapped-chip-sm { font-size:9px;padding:1px 7px; }
// `;
//   document.head.appendChild(s);
// }


/**
 * draft-review-updated.js  — v4
 *
 * Changes from v3:
 *  1. Clause Generation left nav matches clause-panel-v2 exactly:
 *     - "Chapter N" num label (blue pill) + title on second line
 *     - Same chapter toggle, section-style indentation
 *     - Clause items as stacked cards (id + risk + dept + text preview)
 *  2. Right workspace: clause detail matches clause-panel style
 *     - cl-ws-clause-card header block (breadcrumb, badges, page chip)
 *     - ⓘ button for meta table toggle
 *     - Clause text with Show more/less
 *  3. Mapped ob refs always visible (never hidden)
 *  4. Evidence button removed
 *  5. CSS updated to match clause-panel nav exactly
 */

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
    ['Circular ID',c.id],['Regulator',c.regulator||'—'],
    ['Issue Date',c.issuedDate||c.date||'—'],['Effective Date',c.effectiveDate||'—'],
    ['Risk Level',c.risk||'—'],['Status',c.status||'—'],
    ['Department',c.departments||'—'],['Deadline',c.dueDate||'-'],
  ];
  var riskCls = c.risk ? ' dr-chip-risk-' + c.risk.toLowerCase() : '';
  return (
    '<div class="dr-panel">' +
    '<div class="dr-panel-toolbar">' +
      '<div class="dr-panel-title-wrap"><span class="dr-panel-icon">&#x1F4CB;</span><span class="dr-panel-title">Overview</span></div>' +
      '<div class="dr-toolbar-actions">' +
        '<label class="dr-tool-btn"><input type="file" style="display:none;" accept=".pdf,.docx"/>&#x1F4C1; Upload Circular</label>' +
        '<button class="dr-tool-btn dr-tool-edit-toggle" data-target="dr-ov-edit" data-hide="dr-ov-details">&#x270E; Edit</button>' +
        '<button class="dr-tool-btn" onclick="window._cmsShowHistoryModal(\'Overview History\', window._drGetHistory(\'Overview\'))">&#x1F551; History</button>' +
      '</div>' +
    '</div>' +
    '<div class="dr-ov-hero">' +
      '<div class="dr-ov-hero-left">' +
        '<div class="dr-ov-id">' + c.id + '</div>' +
        '<div class="dr-ov-title">' + c.title + '</div>' +
        '<div class="dr-ov-chips">' +
          '<span class="dr-chip">' + (c.regulator||'N/A') + '</span>' +
          (c.risk ? '<span class="dr-chip' + riskCls + '">' + c.risk + ' Risk</span>' : '') +
          (c.status ? '<span class="dr-chip dr-chip-status">' + c.status + '</span>' : '') +
          (c.type ? '<span class="dr-chip dr-chip-blue">' + c.type + '</span>' : '') +
        '</div>' +
      '</div>' +
      (c.deadline ? '<div class="dr-deadline-box"><div class="dr-dl-label">Compliance Deadline</div><div class="dr-dl-date">' + c.deadline + '</div></div>' : '') +
    '</div>' +
    '<div class="dr-edit-drawer" id="dr-ov-edit" style="display:none;">' +
      '<div class="dr-edit-grid">' +
        fields.map(function(f) { return '<div class="dr-edit-field"><label class="dr-edit-label">' + f[0] + '</label><input class="dr-edit-input" value="' + f[1] + '"/></div>'; }).join('') +
        '<div class="dr-edit-field dr-edit-field-full"><label class="dr-edit-label">Summary</label><textarea class="dr-edit-ta">' + (c.summary||'') + '</textarea></div>' +
        '<div class="dr-edit-field dr-edit-field-full"><label class="dr-edit-label">Tags (comma separated)</label><input class="dr-edit-input" value="' + (c.tags||[]).join(', ') + '"/></div>' +
      '</div>' +
      '<div class="dr-edit-foot">' +
        '<button class="dr-btn dr-btn-ghost" data-close="dr-ov-edit" data-show="dr-ov-details">&#x2715; Cancel</button>' +
        '<button class="dr-btn dr-btn-pri dr-btn-sm" onclick="_drRecordHistory(window._drCurrentCircId,\'Overview\',\'Fields Edited\',\'Overview fields updated\');showToast(\'Changes saved.\',\'success\');document.getElementById(\'dr-ov-edit\').style.display=\'none\';document.getElementById(\'dr-ov-details\').style.display=\'block\';">&#x2713; Save Changes</button>' +
      '</div>' +
    '</div>' +
    '<div id="dr-ov-details">' +
      '<div class="dr-detail-grid">' +
        fields.map(function(f) { return '<div class="dr-detail-cell"><div class="dr-dc-label">' + f[0] + '</div><div class="dr-dc-val">' + f[1] + '</div></div>'; }).join('') +
      '</div>' +
      (c.summary ? '<div class="dr-block-pad"><div class="dr-info-block"><div class="dr-ib-label">Summary</div><div class="dr-ib-text">' + c.summary + '</div></div></div>' : '') +
      ((c.tags||[]).length ? '<div class="dr-tags-row">' + c.tags.map(function(t){return '<span class="dr-tag">'+t+'</span>';}).join('') + '</div>' : '') +
    '</div>' +
    '<div class="dr-panel-foot"><span></span><button class="dr-btn dr-btn-next" onclick="_drGoNext(0)">Applicability Analysis &#x2192;</button></div>' +
    '</div>'
  );
}

/* ================================================================ PANEL 1 — APPLICABILITY */
function _drPanelApplicability(flow) {
  var a = flow.applicability;
  if (!a) return _drNotSaved('Applicability');
  var vc = a.applicable ? '#15803d' : '#b91c1c';
  var vb = a.applicable ? '#dcfce7' : '#fee2e2';

  var entityRows = (a.entities||[]).map(function(e, ei) {
    return '<tr id="dr-ent-row-' + ei + '">' +
      '<td><span class="dr-ent-name" id="dr-ent-name-' + ei + '" contenteditable="false" style="outline:none;display:inline-block;min-width:80px;font-weight:600;color:#1a1a2e;">' + e.name + '</span></td>' +
      '<td><span class="dr-app-pill ' + (e.applicable?'dr-app-yes':'dr-app-no') + '" id="dr-ent-app-' + ei + '">' + (e.applicable?'&#x2713; Yes':'&#x2717; No') + '</span></td>' +
      '<td class="dr-table-edit-cell" style="display:none;"><button class="dr-tbl-del-btn" onclick="_drDelEntityRow(' + ei + ')">&#x2715;</button></td>' +
    '</tr>';
  }).join('');

  var reqRows = (a.requirementsApplicability||[]).map(function(r, ri) {
    return '<tr id="dr-req-row-' + ri + '">' +
      '<td><span id="dr-req-name-' + ri + '" contenteditable="false" style="outline:none;font-weight:600;color:#1a1a2e;display:inline-block;min-width:120px;">' + r.requirement + '</span></td>' +
      '<td><span id="dr-req-thresh-' + ri + '" contenteditable="false" style="outline:none;font-size:11px;color:#4a5068;display:inline-block;min-width:80px;">' + r.threshold + '</span></td>' +
      '<td><span class="dr-app-pill ' + (r.applicable?'dr-app-yes':'dr-app-no') + '" id="dr-req-app-' + ri + '">' + (r.applicable?'&#x2713; Yes':'&#x2717; No') + '</span></td>' +
      '<td class="dr-table-edit-cell" style="display:none;">' +
        '<select class="dr-tbl-select" onchange="_drReqStatusChange(' + ri + ',this.value)">' +
          ['Compliant','In Progress','Pending','Exempt'].map(function(s){return '<option'+(s===r.status?' selected':'')+'>'+s+'</option>';}).join('') +
        '</select>' +
        '<button class="dr-tbl-del-btn" onclick="_drDelReqRow(' + ri + ')">&#x2715;</button>' +
      '</td>' +
    '</tr>';
  }).join('');

  return (
    '<div class="dr-panel">' +
    '<div class="dr-panel-toolbar">' +
      '<div class="dr-panel-title-wrap"><span class="dr-panel-icon">&#x2736;</span><span class="dr-panel-title">Applicability Analysis</span></div>' +
      '<div class="dr-toolbar-actions">' +
        '<button class="dr-tool-btn" id="dr-app-tbl-edit-btn" onclick="_drToggleTableEdit()">&#x270E; Edit Tables</button>' +
        '<button class="dr-tool-btn dr-tool-edit-toggle" data-target="dr-app-edit" data-hide="dr-app-details">&#x270E; Edit Fields</button>' +
        '<button class="dr-tool-btn" onclick="window._cmsShowHistoryModal(\'Applicability History\', window._drGetHistory(\'Applicability\'))">&#x1F551; History</button>' +
      '</div>' +
    '</div>' +
    '<div class="dr-verdict-banner" style="background:' + vb + ';border-color:' + vc + '30;">' +
      '<div class="dr-verdict-badge" style="background:' + vc + ';color:#fff;">' + (a.applicable?'&#x2713; Applicable':'&#x2717; Not Applicable') + '</div>' +
      '<div class="dr-verdict-info"><div class="dr-verdict-entity">' + a.entityType + ' &middot; ' + a.scope + '</div><div class="dr-verdict-owner">Owner: ' + a.owner + '</div></div>' +
      '<div class="dr-verdict-deadline"><div class="dr-vd-label">Deadline</div><div class="dr-vd-date">' + a.deadline + '</div></div>' +
    '</div>' +
    '<div class="dr-edit-drawer" id="dr-app-edit" style="display:none;">' +
      '<div class="dr-edit-grid">' +
        [['Verdict',a.verdict],['Entity Type',a.entityType],['Scope',a.scope],['Deadline',a.deadline],['Owner',a.owner]].map(function(f){
          return '<div class="dr-edit-field"><label class="dr-edit-label">'+f[0]+'</label><input class="dr-edit-input" value="'+f[1]+'"/></div>';
        }).join('') +
        '<div class="dr-edit-field dr-edit-field-full"><label class="dr-edit-label">Notes</label><textarea class="dr-edit-ta">'+a.notes+'</textarea></div>' +
        '<div class="dr-edit-field dr-edit-field-full"><label class="dr-edit-label">Threshold / Criteria</label><textarea class="dr-edit-ta">'+a.threshold+'</textarea></div>' +
      '</div>' +
      '<div class="dr-edit-foot">' +
        '<button class="dr-btn dr-btn-ghost" data-close="dr-app-edit" data-show="dr-app-details">&#x2715; Cancel</button>' +
        '<button class="dr-btn dr-btn-pri dr-btn-sm" onclick="_drRecordHistory(window._drCurrentCircId,\'Applicability\',\'Fields Edited\',\'Applicability fields updated\');showToast(\'Saved.\',\'success\');document.getElementById(\'dr-app-edit\').style.display=\'none\';document.getElementById(\'dr-app-details\').style.display=\'block\';">&#x2713; Save</button>' +
      '</div>' +
    '</div>' +
    '<div id="dr-app-details">' +
      '<div class="dr-block-pad"><div class="dr-info-block dr-info-block-amber"><div class="dr-ib-label">Threshold &amp; Criteria</div><div class="dr-ib-text">' + a.threshold + '</div></div></div>' +
      '<div class="dr-block-pad">' +
        '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">' +
          '<div class="dr-section-label" style="margin-bottom:0;">Applicable Entities</div>' +
          '<button class="dr-tbl-add-btn" id="dr-add-ent-btn" style="display:none;" onclick="_drAddEntityRow()">+ Add Row</button>' +
        '</div>' +
        '<table class="dr-table" id="dr-ent-table"><thead><tr><th>Entity</th><th>Applicable</th><th class="dr-table-edit-cell" style="display:none;width:80px;">Actions</th></tr></thead><tbody id="dr-ent-tbody">' + entityRows + '</tbody></table>' +
      '</div>' +
      '<div class="dr-block-pad">' +
        '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">' +
          '<div class="dr-section-label" style="margin-bottom:0;">Requirements Applicability</div>' +
          '<button class="dr-tbl-add-btn" id="dr-add-req-btn" style="display:none;" onclick="_drAddReqRow()">+ Add Row</button>' +
        '</div>' +
        '<table class="dr-table" id="dr-req-table"><thead><tr><th>Requirement</th><th>Applicable</th><th>Threshold</th><th class="dr-table-edit-cell" style="display:none;width:120px;">Actions</th></tr></thead><tbody id="dr-req-tbody">' + reqRows + '</tbody></table>' +
      '</div>' +
      '<div class="dr-block-pad"><div class="dr-info-block"><div class="dr-ib-label">Notes</div><div class="dr-ib-text">' + a.notes + '</div></div></div>' +
    '</div>' +
    '<div class="dr-panel-foot"><span></span><button class="dr-btn dr-btn-next" onclick="_drGoNext(1)">Executive Summary &#x2192;</button></div>' +
    '</div>'
  );
}

/* TABLE HELPERS */
window._drTableEditMode = false;
window._drToggleTableEdit = function() {
  window._drTableEditMode = !window._drTableEditMode;
  var on = window._drTableEditMode;
  document.querySelectorAll('.dr-table-edit-cell').forEach(function(el) { el.style.display = on ? 'table-cell' : 'none'; });
  var addEnt = document.getElementById('dr-add-ent-btn'); if (addEnt) addEnt.style.display = on ? 'inline-flex' : 'none';
  var addReq = document.getElementById('dr-add-req-btn'); if (addReq) addReq.style.display = on ? 'inline-flex' : 'none';
  document.querySelectorAll('[id^="dr-ent-name-"],[id^="dr-ent-type-"],[id^="dr-req-name-"],[id^="dr-req-thresh-"]').forEach(function(el) {
    el.contentEditable = on ? 'true' : 'false';
    el.style.outline = on ? '1.5px dashed #bfdbfe' : 'none';
    el.style.borderRadius = on ? '3px' : '0';
    el.style.padding = on ? '1px 4px' : '0';
  });
  document.querySelectorAll('[id^="dr-ent-app-"],[id^="dr-req-app-"]').forEach(function(pill) {
    if (on) { pill.style.cursor='pointer'; pill.title='Click to toggle'; pill.onclick=function(){var isYes=pill.classList.contains('dr-app-yes');pill.classList.toggle('dr-app-yes',!isYes);pill.classList.toggle('dr-app-no',isYes);pill.innerHTML=isYes?'&#x2717; No':'&#x2713; Yes';};
    } else { pill.style.cursor='default'; pill.title=''; pill.onclick=null; }
  });
  var btn = document.getElementById('dr-app-tbl-edit-btn');
  if (btn) { btn.textContent = on ? '✓ Done Editing' : '✎ Edit Tables'; btn.style.background = on ? '#1a1a2e' : ''; btn.style.color = on ? '#fff' : ''; btn.style.borderColor = on ? '#1a1a2e' : ''; }
  if (!on) showToast('Table changes saved.', 'success');
};
window._drDelEntityRow = function(ei) { var row = document.getElementById('dr-ent-row-' + ei); if (row) row.remove(); };
window._drDelReqRow    = function(ri) { var row = document.getElementById('dr-req-row-' + ri); if (row) row.remove(); };
window._drReqStatusChange = function(ri, val) { showToast('Status updated to '+val+'.','success'); };
window._drAddEntityRow = function() { var tbody=document.getElementById('dr-ent-tbody'); if(!tbody)return; var ei=tbody.querySelectorAll('tr').length; var tr=document.createElement('tr'); tr.id='dr-ent-row-'+ei; tr.innerHTML='<td><span id="dr-ent-name-'+ei+'" contenteditable="true" style="outline:1.5px dashed #bfdbfe;border-radius:3px;padding:1px 4px;display:inline-block;min-width:80px;font-weight:600;color:#1a1a2e;">New Entity</span></td><td><span class="dr-app-pill dr-app-yes" id="dr-ent-app-'+ei+'" style="cursor:pointer;" title="Click to toggle" onclick="var isYes=this.classList.contains(\'dr-app-yes\');this.classList.toggle(\'dr-app-yes\',!isYes);this.classList.toggle(\'dr-app-no\',isYes);this.innerHTML=isYes?\'&#x2717; No\':\'&#x2713; Yes\';">&#x2713; Yes</span></td><td class="dr-table-edit-cell"><button class="dr-tbl-del-btn" onclick="_drDelEntityRow('+ei+')">&#x2715;</button></td>'; tbody.appendChild(tr); var ed=tr.querySelector('[contenteditable]'); if(ed)ed.focus(); };
window._drAddReqRow    = function() { var tbody=document.getElementById('dr-req-tbody'); if(!tbody)return; var ri=tbody.querySelectorAll('tr').length; var tr=document.createElement('tr'); tr.id='dr-req-row-'+ri; tr.innerHTML='<td><span id="dr-req-name-'+ri+'" contenteditable="true" style="outline:1.5px dashed #bfdbfe;border-radius:3px;padding:1px 4px;display:inline-block;min-width:120px;font-weight:600;color:#1a1a2e;">New Requirement</span></td><td><span class="dr-app-pill dr-app-yes" id="dr-req-app-'+ri+'" style="cursor:pointer;" title="Click to toggle" onclick="var isYes=this.classList.contains(\'dr-app-yes\');this.classList.toggle(\'dr-app-yes\',!isYes);this.classList.toggle(\'dr-app-no\',isYes);this.innerHTML=isYes?\'&#x2717; No\':\'&#x2713; Yes\';">&#x2713; Yes</span></td><td><span id="dr-req-thresh-'+ri+'" contenteditable="true" style="outline:1.5px dashed #bfdbfe;border-radius:3px;padding:1px 4px;font-size:11px;color:#4a5068;display:inline-block;min-width:80px;">All entities</span></td><td class="dr-table-edit-cell"><select class="dr-tbl-select" onchange="_drReqStatusChange('+ri+',this.value)">'+['Compliant','In Progress','Pending','Exempt'].map(function(s){return '<option>'+s+'</option>';}).join('')+'</select><button class="dr-tbl-del-btn" onclick="_drDelReqRow('+ri+')">&#x2715;</button></td>'; tbody.appendChild(tr); var ed=tr.querySelector('[contenteditable]'); if(ed)ed.focus(); };

/* ================================================================ PANEL 2 — EXECUTIVE SUMMARY */
function _drPanelSummary(flow) {
  var s = flow.summary;
  if (!s) return _drNotSaved('Executive Summary');

  function accSection(id, icon, label, badge, html) {
    return (
      '<div class="dr-acc-item" id="dr-acc-' + id + '">' +
        '<div class="dr-acc-header">' +
          '<button class="dr-acc-trigger" data-acc="' + id + '">' +
            '<span class="dr-acc-icon">' + icon + '</span>' +
            '<span class="dr-acc-label">' + label + '</span>' +
            '<span class="dr-acc-spacer"></span>' +
            (badge ? '<span class="dr-acc-badge">' + badge + '</span>' : '') +
            '<span class="dr-acc-arrow">&#9660;</span>' +
          '</button>' +
          '<button class="dr-acc-add-btn" data-acc-id="' + id + '" title="Add item">+ Add</button>' +
        '</div>' +
        '<div class="dr-acc-body" id="dr-acc-body-' + id + '">' +
          '<div class="dr-acc-rows" id="dr-acc-rows-' + id + '">' + html + '</div>' +
        '</div>' +
      '</div>'
    );
  }

  function numRow(text) {
    return '<div class="dr-sum-row">' +
      '<span class="dr-sum-num-icon"></span>' +
      '<span class="dr-sum-item" contenteditable="true">' + text + '</span>' +
      '<button class="dr-row-del" onclick="this.closest(\'.dr-sum-row\').remove()">&#x2715;</button>' +
    '</div>';
  }
  function dotRow(text, cls) {
    return '<div class="dr-sum-row">' +
      '<span class="dr-sum-dot' + (cls?' '+cls:'') + '"></span>' +
      '<span class="dr-sum-item" contenteditable="true">' + text + '</span>' +
      '<button class="dr-row-del" onclick="this.closest(\'.dr-sum-row\').remove()">&#x2715;</button>' +
    '</div>';
  }
  function riskRow(r) {
    return '<div class="dr-sum-row">' +
      '<span class="dr-risk-pill dr-risk-' + r.level.toLowerCase() + '">' + r.level + '</span>' +
      '<span class="dr-sum-item" contenteditable="true">' + r.text + '</span>' +
      '<button class="dr-row-del" onclick="this.closest(\'.dr-sum-row\').remove()">&#x2715;</button>' +
    '</div>';
  }

  var orgHtml =
    '<div class="dr-org-metrics">' +
      [['Departments',s.orgImpact.departments],['Headcount',s.orgImpact.headcount],['Systems',s.orgImpact.systems],['Budget',s.orgImpact.budget]].map(function(m){
        return '<div class="dr-org-metric"><div class="dr-om-val">'+m[1]+'</div><div class="dr-om-label">'+m[0]+'</div></div>';
      }).join('') +
    '</div>' +
    '<div class="dr-sum-item dr-sum-item-plain" contenteditable="true">' + s.orgImpact.description + '</div>';

  return (
    '<div class="dr-panel">' +
    '<div class="dr-panel-toolbar">' +
      '<div class="dr-panel-title-wrap"><span class="dr-panel-icon">&#x1F4C4;</span><span class="dr-panel-title">Executive Summary</span></div>' +
      '<div class="dr-toolbar-actions"><button class="dr-tool-btn dr-tool-edit-toggle" data-target="dr-sum-purpose-edit" data-hide="dr-sum-purpose-disp">&#x270E; Edit Purpose</button><button class="dr-tool-btn" onclick="window._cmsShowHistoryModal(\'Summary History\', window._drGetHistory(\'Executive Summary\'))">&#x1F551; History</button></div>' +
    '</div>' +
    '<div class="dr-block-pad" id="dr-sum-purpose-disp">' +
      '<div class="dr-info-block"><div class="dr-ib-label">Purpose &amp; Background</div><div class="dr-ib-text">' + s.purpose + '</div></div>' +
    '</div>' +
    '<div class="dr-edit-drawer" id="dr-sum-purpose-edit" style="display:none;">' +
      '<div class="dr-edit-grid">' +
        '<div class="dr-edit-field dr-edit-field-full"><label class="dr-edit-label">Purpose &amp; Background</label>' +
        '<textarea class="dr-edit-ta" style="min-height:100px;" id="dr-sum-pta">' + s.purpose + '</textarea></div>' +
      '</div>' +
      '<div class="dr-edit-foot">' +
        '<button class="dr-btn dr-btn-ghost" data-close="dr-sum-purpose-edit" data-show="dr-sum-purpose-disp">&#x2715; Cancel</button>' +
        '<button class="dr-btn dr-btn-pri dr-btn-sm" onclick="_drRecordHistory(window._drCurrentCircId,\'Executive Summary\',\'Purpose Edited\',\'Purpose & Background updated\');var t=document.getElementById(\'dr-sum-pta\').value;document.getElementById(\'dr-sum-purpose-disp\').querySelector(\'.dr-ib-text\').textContent=t;document.getElementById(\'dr-sum-purpose-edit\').style.display=\'none\';document.getElementById(\'dr-sum-purpose-disp\').style.display=\'block\';showToast(\'Saved.\',\'success\');">&#x2713; Save</button>' +
      '</div>' +
    '</div>' +
    '<div class="dr-sum-accordions">' +
      accSection('key-updates',  '&#x1F504;', 'Key Updates',          s.keyUpdates.length + ' updates',       s.keyUpdates.map(numRow).join('')) +
      accSection('risks',        '&#x1F6A8;', 'Compliance Risks',     s.risks.length + ' risks',              s.risks.map(riskRow).join('')) +
      accSection('imm-actions',  '&#x26A1;',  'Immediate Actions',    s.immediateActions.length + ' actions', s.immediateActions.map(dotRow).join('')) +
      accSection('org-impact',   '&#x1F3E2;', 'Organisational Impact','',                                     orgHtml) +
      accSection('technical',    '&#x2699;&#xFE0F;','Technical Changes', s.technical.length + ' items',       s.technical.map(function(t){return dotRow(t,'dr-sum-dot-tech');}).join('')) +
    '</div>' +
    '<div class="dr-panel-foot"><span></span><button class="dr-btn dr-btn-next" onclick="_drGoNext(2)">Clause Generation &#x2192;</button></div>' +
    '</div>'
  );
}

/* ================================================================
   PANEL 3 — CLAUSE GENERATION
   Left nav: matches clause-panel-v2 exactly
     - "Chapter N" blue pill + title on second line
     - Clause items as stacked card buttons (id + risk + dept + text preview)
   Right workspace: clause-panel style card header + obligations
   Mapped refs: always visible
   Evidence button: removed
================================================================ */
function _drPanelClauses(flow, circId) {
  var chapters = flow.clauses || [];
  if (!chapters.length) return _drNotSaved('Clause Generation');
  var totalClauses = chapters.reduce(function(s,ch){return s+(ch.clauses||[]).length;},0);

  return (
    '<div class="dr-panel dr-panel-clauses">' +

    /* ── TOOLBAR ── */
    '<div class="dr-panel-toolbar">' +
      '<div class="dr-panel-title-wrap">' +
        '<span class="dr-panel-icon">&#x1F4CB;</span>' +
        '<span class="dr-panel-title">Clause Generation</span>' +
        '<span class="dr-cl-total-badge">' + totalClauses + ' clauses</span>' +
      '</div>' +
      '<div class="dr-toolbar-actions">' +
        '<label class="dr-tool-btn" title="Upload Excel to bulk-import clauses">' +
          '<input type="file" accept=".xlsx,.xls,.csv" style="display:none;" onchange="_drRecordHistory(window._drCurrentCircId,\'Clause Generation\',\'Excel Imported\',\'Bulk clause import via Excel\');showToast(\'Excel imported successfully.\',\'success\')"/>' +
          '&#x1F4CA; Import Excel' +
        '</label>' +
        '<button class="dr-tool-btn dr-tool-btn-pri" id="dr-cl-add-ch-btn">+ Add Chapter</button>' +
        '<button class="dr-btn dr-btn-sec dr-btn-sm" onclick="_drRecordHistory(window._drCurrentCircId,\'Clause Generation\',\'Clauses Saved\',\'Clause data saved\');showToast(\'Clauses saved.\',\'success\')">&#x1F4BE; Save</button>' +
        '<button class="dr-tool-btn" onclick="window._cmsShowHistoryModal(\'Clause Generation History\', window._drGetHistory(\'Clause Generation\'))">&#x1F551; History</button>' +
      '</div>' +
    '</div>' +

    /* ── SPLIT PANE ── */
    '<div class="dr-cl-split">' +

      /* LEFT NAV — clause-panel-v2 style */
      '<div class="dr-cl-nav" id="dr-cl-nav">' +
        '<div class="dr-cl-nav-head">' +
          '<span class="dr-cl-nav-title">Structure</span>' +
          '<span class="dr-cl-nav-count" id="dr-cl-nav-count">' + totalClauses + ' clauses</span>' +
        '</div>' +
        '<div class="dr-cl-nav-tree" id="dr-cl-nav-tree">' +
          chapters.map(function(ch, ci) { return _drBuildNavChapter(ch, ci, circId); }).join('') +
        '</div>' +
      '</div>' +

      /* RIGHT WORKSPACE */
      '<div class="dr-cl-workspace" id="dr-cl-workspace">' +
        '<div class="dr-cl-ws-placeholder" id="dr-cl-ws-ph">' +
          '<div class="dr-ws-ph-icon">&#x1F4CB;</div>' +
          '<div class="dr-ws-ph-title">Select a section</div>' +
          '<div class="dr-ws-ph-sub">Click any section in the left panel to see its clauses, then select a clause to view full details</div>' +
        '</div>' +
        '<div id="dr-cl-ws-stack" style="display:none;"></div>' +
        '<div id="dr-cl-ws-content" style="display:none;"></div>' +
      '</div>' +

    '</div>' +
    '<div class="dr-panel-foot"><span></span><button class="dr-btn dr-btn-next" onclick="_drGoNext(3)">Evidence &#x2192;</button></div>' +
    '</div>'
  );
}

/* ────────────────────────────────────────────
   LEFT NAV — clause-panel-v2 structure
   Chapter → Section only (NO clauses in left nav)
   Clicking a section → shows clause stack on RIGHT panel
   Data model has no sections, so we auto-create one
   "Section" per chapter containing all its clauses
──────────────────────────────────────────── */
function _drBuildNavChapter(ch, ci, circId) {
  var clauses = ch.clauses || [];
  var chNum   = 'Chapter ' + (ci + 1);
  var chTitle = ch.title || '';

  /* Auto-build sections from clauses if none exist.
     If chapter has sections use them, else make one default section. */
  var sections = ch.sections && ch.sections.length ? ch.sections : [
    { text: chTitle || 'All Clauses', id: '', clauses: clauses.map(function(c){return c.id;}) }
  ];

  var sectionsHtml = sections.map(function(sec, si) {
    var secKey    = ci + '-' + si;
    var secLabel  = (sec.id ? sec.id + ' \u2013 ' : '') + (sec.text || 'Section ' + (si+1));
    var secShort  = secLabel.substring(0,34) + (secLabel.length>34?'\u2026':'');
    /* get actual clause objects for this section */
    var secClauses = sec.clauses
      ? sec.clauses.map(function(id){ return clauses.find(function(c){return c.id===id;}); }).filter(Boolean)
      : clauses;
    var cnt = secClauses.length;
    /* encode clause data safely as a data attribute (JSON stringified, base64) */
    var encoded = btoa(unescape(encodeURIComponent(JSON.stringify(secClauses))));
    return (
      '<div class="dr-cl-nav-sec-group">' +
        '<button class="dr-cl-nav-sec-btn" data-sec="' + secKey + '" data-ci="' + ci + '"' +
          ' data-clauses="' + encoded + '"' +
          ' data-chnum="' + chNum + '" data-chtitle="' + chTitle.replace(/"/g,'') + '"' +
          ' data-seclabel="' + secShort.replace(/"/g,'') + '">' +
          '<span class="dr-cl-nav-sec-icon">\u00a7</span>' +
          '<span class="dr-cl-nav-sec-label">' + secShort + '</span>' +
          '<span class="dr-cl-nav-sec-count">' + cnt + '</span>' +
          '<span class="dr-cl-nav-sec-arrow">\u25b8</span>' +
        '</button>' +
      '</div>'
    );
  }).join('');

  return (
    '<div class="dr-cl-nav-chapter" id="dr-cl-nav-ch-' + ci + '">' +
      '<div class="dr-cl-nav-ch-row">' +
        '<button class="dr-cl-nav-ch-btn" data-ci="' + ci + '">' +
          '<span class="dr-cl-nav-ch-arrow">&#x25B6;</span>' +
          '<div class="dr-cl-nav-ch-info">' +
            '<span class="dr-cl-nav-ch-num">' + chNum + '</span>' +
            (chTitle ? '<span class="dr-cl-nav-ch-label">' + chTitle + '</span>' : '') +
          '</div>' +
          '<span class="dr-cl-nav-ch-count">' + clauses.length + '</span>' +
        '</button>' +
        '<div class="dr-cl-ch-actions">' +
          '<label class="dr-cl-ch-action-btn" title="Import Excel for this chapter">' +
            '<input type="file" accept=".xlsx,.xls,.csv" style="display:none;" onchange="showToast(\'Excel mapped to ' + chNum + '.\',\'success\')"/>' +
            '&#x1F4CA;' +
          '</label>' +
          '<button class="dr-cl-ch-action-btn" title="Add clause" onclick="_drAddClause(' + ci + ',\'' + (circId||'') + '\')">+</button>' +
        '</div>' +
      '</div>' +
      /* Section list (hidden until chapter expanded) */
      '<div class="dr-cl-nav-ch-body" id="dr-cl-nav-body-' + ci + '">' +
        sectionsHtml +
      '</div>' +
    '</div>'
  );
}

/* Clause card for the RIGHT panel stack — used by _drShowClauseStack */
function _drBuildClauseCard(cl, ci, cli, circId) {
  var riskCls = cl.risk ? 'dr-cl-risk-' + cl.risk.toLowerCase() : '';
  return (
    '<button class="dr-cl-clause-card" id="dr-card-' + cl.id + '"' +
      ' data-ck="' + ci + '-' + cli + '" data-ci="' + ci + '" data-cli="' + cli + '" data-circ="' + (circId||'') + '">' +
      '<div class="dr-cl-card-top">' +
        '<span class="dr-cl-nav-cl-id">' + cl.id + '</span>' +
        '<div class="dr-cl-card-badges">' +
          (cl.risk ? '<span class="dr-cl-nav-risk ' + riskCls + '">' + cl.risk + '</span>' : '') +
          (cl.department ? '<span class="dr-cl-nav-dept">' + cl.department + '</span>' : '') +
        '</div>' +
      '</div>' +
      '<span class="dr-cl-nav-cl-text">' + (cl.text||'').substring(0,96) + ((cl.text||'').length>96?'\u2026':'') + '</span>' +
    '</button>'
  );
}

/* ────────────────────────────────────────────
   RIGHT PANEL — CLAUSE STACK
   Shows when a section is clicked in left nav
   Displays chapter + section header, then stacked clause cards
──────────────────────────────────────────── */
window._drShowClauseStack = function(ci, circId, clauses, chNum, chTitle, secLabel) {
  var ph      = document.getElementById('dr-cl-ws-ph');
  var stack   = document.getElementById('dr-cl-ws-stack');
  var content = document.getElementById('dr-cl-ws-content');
  if (ph) ph.style.display = 'none';
  if (content) { content.style.display = 'none'; content.innerHTML = ''; }
  if (!stack) return;

  /* store for filter re-render */
  window._drActiveSection = { ci: ci, circId: circId, clauses: clauses, chNum: chNum, chTitle: chTitle, secLabel: secLabel };

  stack.style.display = 'block';
  stack.innerHTML =
    '<div class="dr-stack-wrap">' +
      '<div class="dr-stack-header">' +
        '<div class="dr-stack-breadcrumb">' +
          '<div class="dr-stack-ch-row">' +
            '<span class="dr-stack-ch-num">' + chNum + '</span>' +
            (chTitle ? '<span class="dr-stack-ch-title">' + chTitle + '</span>' : '') +
          '</div>' +
          (secLabel ? '<div class="dr-stack-sec-row"><span class="dr-stack-sec-icon">\u00a7</span><span class="dr-stack-sec-label">' + secLabel + '</span></div>' : '') +
        '</div>' +
        '<span class="dr-stack-count">' + clauses.length + ' clause' + (clauses.length!==1?'s':'') + '</span>' +
      '</div>' +
      '<div class="dr-stack-list">' +
        (clauses.length
          ? clauses.map(function(cl, cli) { return _drBuildClauseCard(cl, ci, cli, circId); }).join('')
          : '<div class="dr-stack-empty">No clauses in this section.</div>'
        ) +
      '</div>' +
    '</div>';

  /* bind clause card clicks */
  stack.querySelectorAll('.dr-cl-clause-card').forEach(function(btn) {
    btn.addEventListener('click', function() {
      stack.querySelectorAll('.dr-cl-clause-card').forEach(function(b){b.classList.remove('dr-clause-card-active');});
      btn.classList.add('dr-clause-card-active');
      var cii  = parseInt(btn.dataset.ci);
      var clii = parseInt(btn.dataset.cli);
      var cId  = btn.dataset.circ;
      var fl   = window._savedFlow[cId];
      var ch   = fl && fl.clauses && fl.clauses[cii];
      var cl   = ch && ch.clauses && ch.clauses[clii];
      if (cl) {
        stack.style.display = 'none';
        window._drShowClauseWorkspace(cl, cii, clii, cId);
      }
    });
  });
};

/* ────────────────────────────────────────────
   RIGHT WORKSPACE — clause-panel-v2 style card
──────────────────────────────────────────── */
window._drShowClauseWorkspace = function(cl, ci, cli, circId) {
  var ph      = document.getElementById('dr-cl-ws-ph');
  var content = document.getElementById('dr-cl-ws-content');
  if (ph) ph.style.display = 'none';
  if (!content) return;
  content.style.display = 'block';

  var ck           = ci + '-' + cli;
  var flow         = window._savedFlow[circId];
  var chapter      = flow && flow.clauses && flow.clauses[ci];
  var chapterTitle = chapter ? (chapter.title || 'Chapter ' + (ci+1)) : '';
  var chNum        = 'Chapter ' + (ci + 1);
  var actions      = (cl.actionable||'').split(';').map(function(a){return a.trim();}).filter(Boolean);
  var rCls         = {High:'dr-chip-risk-high',Medium:'dr-chip-risk-medium',Low:'dr-chip-risk-low'}[cl.risk]||'';
  var mapKey       = (circId||'') + ':' + cl.id;
  var mappedClauses= window._mappedClauses[mapKey] || [];

  /* Mapped refs — always rendered (visible if any, placeholder if none) */
  var mappedHtml =
    '<div class="dr-mapped-refs" id="dr-mapped-refs-' + ck + '">' +
      (mappedClauses.length
        ? '<span class="dr-mapped-label">Mapped:</span>' +
          mappedClauses.map(function(m){return '<span class="dr-mapped-chip">'+m.circId+' · '+m.clauseId+'</span>';}).join('')
        : '<span class="dr-mapped-empty">No cross-references mapped yet</span>'
      ) +
    '</div>';

  var clauseText = cl.text || '';
  var metaId     = 'dr-meta-' + ck;

  content.innerHTML =
    '<div class="dr-cl-ws-inner">' +

    '<button class="dr-ws-back-btn" onclick="_drBackToStack()">← Back to clauses</button>' +

    /* ── CLAUSE HEADER CARD (clause-panel style) ── */
    '<div class="dr-ws-clause-card">' +

      /* Card header row */
      '<div class="dr-wc-header">' +
        '<div class="dr-wc-header-left">' +
          /* Breadcrumb */
          '<div class="dr-cl-ws-bc">' +
            '<span class="dr-ws-bc-ch">' + chNum + (chapterTitle ? ' · ' + chapterTitle : '') + '</span>' +
            '<span class="dr-ws-bc-sep">›</span>' +
            '<span class="dr-ws-bc-id">' + cl.id + '</span>' +
          '</div>' +
          /* Badges row */
          '<div class="dr-wc-badges">' +
            (cl.risk       ? '<span class="dr-wc-badge dr-wc-risk-' + (cl.risk||'').toLowerCase() + '">' + cl.risk + ' Risk</span>' : '') +
            (cl.department ? '<span class="dr-wc-badge dr-wc-dept">' + cl.department + '</span>' : '') +
            (cl.status     ? '<span class="dr-wc-badge dr-wc-status">' + cl.status + '</span>' : '') +
          '</div>' +
        '</div>' +
        '<div class="dr-wc-header-right">' +
          /* ⓘ toggles metadata table */
          '<button class="dr-wc-info-btn" id="dr-info-btn-' + ck + '" onclick="_drToggleMeta(\'' + metaId + '\',\'dr-info-btn-' + ck + '\')" title="Show regulatory details">' +
            '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>' +
          '</button>' +
          '<button class="dr-map-btn" onclick="_drOpenMapModal(\'' + (circId||'') + '\',\'' + cl.id + '\',\'' + ck + '\',\'clause\')" title="Map to other clauses">&#x21C4; Map Clause</button>' +
          '<button class="dr-tool-btn dr-tool-edit-toggle" data-target="dr-cl-edit-' + ck + '" data-hide="dr-cl-view-' + ck + '">&#x270E; Edit</button>' +
        '</div>' +
      '</div>' +

      /* Clause text — 10-line clamp + show more */
      '<div class="dr-wc-text dr-txt-clamped" id="dr-cl-txt-' + ck + '">' + clauseText + '</div>' +
      (clauseText.length > 200 ?
        '<button class="dr-view-more-btn" id="dr-vmore-' + ck + '" onclick="_drToggleTxt(\'' + ck + '\')">' +
          'Show more &#x25BE;' +
        '</button>' : '') +

      /* Metadata table — hidden until ⓘ clicked */
      '<div class="dr-meta-table-wrap" id="' + metaId + '" style="display:none;">' +
        '<div class="dr-meta-table-inner">' +
          [
            {label:'Regulatory Body', value:'RBI'},
            {label:'Legislative Area', value:'Banking Regulation'},
            {label:'Sub-Legislative Area', value:'Prudential Norms'},
            {label:'Act', value:'Banking Regulation Act 1949'},
            {label:'Section', value:'Section 12'},
            {label:'Sub-section', value:'Clause (a)'},
            {label:'Category', value:'Mandatory Compliance'},
            {label:'Frequency', value:'Monthly'},
            {label:'Due Date', value:'15th of following month'},
          ].map(function(f) {
            return '<div class="dr-meta-row"><span class="dr-meta-label">' + f.label + '</span><span class="dr-meta-value">' + f.value + '</span></div>';
          }).join('') +
        '</div>' +
      '</div>' +

    '</div>' + /* end clause card */

    /* Mapped refs — always visible */
    mappedHtml +

    /* Controls bar (dept / status / tags) */
    '<div class="dr-clause-controls">' +
      '<div class="dr-ctrl-group"><span class="dr-ctrl-label">Dept</span>' +
        '<select class="dr-ctrl-select">' +
          ['Compliance','Risk','Legal','IT','Operations','HR','Finance'].map(function(d){return '<option'+(d===cl.department?' selected':'')+'>'+d+'</option>';}).join('') +
        '</select>' +
      '</div>' +
      '<div class="dr-ctrl-group"><span class="dr-ctrl-label">Status</span>' +
        '<select class="dr-ctrl-select">' +
          ['Pending','In Progress','Compliant'].map(function(s){return '<option'+(s===cl.status?' selected':'')+'>'+s+'</option>';}).join('') +
        '</select>' +
      '</div>' +
      '<div class="dr-tags-ctrl">' +
        '<span class="dr-ctrl-label">Tags</span>' +
        '<div class="dr-tags-list" id="dr-tlist-' + ck + '">' +
          (cl.tags||[]).map(function(t){return '<span class="dr-ctag">'+t+'<button onclick="this.parentElement.remove()">&#xD7;</button></span>';}).join('') +
        '</div>' +
        '<input class="dr-tag-input" id="dr-tinput-' + ck + '" placeholder="+ tag" onkeydown="if(event.key===\'Enter\'||event.key===\',\'){_drAddTag(\'' + ck + '\');event.preventDefault();}"/>' +
        '<button class="dr-tag-add-btn" onclick="_drAddTag(\'' + ck + '\')">+</button>' +
      '</div>' +
    '</div>' +

    /* VIEW MODE */
    '<div id="dr-cl-view-' + ck + '">' +

      /* Obligations */
      '<div class="dr-ws-section">' +
        '<div class="dr-ws-section-head">' +
          '<span class="dr-ws-section-label">Obligations</span>' +
          '<button class="dr-add-sub-btn" onclick="_drAddObligation(\'' + ck + '\',\'' + (circId||'') + '\',\'' + cl.id + '\')">+ Add Obligation</button>' +
        '</div>' +
        '<div class="dr-ws-oblig-list" id="dr-oblig-wrap-' + ck + '">' +
          (cl.obligation
            ? _drBuildObligationItem(cl.obligation, actions, ck, circId, cl.id, 0, true)
            : '<div class="dr-empty-hint" id="dr-no-oblig-' + ck + '">No obligation yet — click + Add Obligation above</div>'
          ) +
        '</div>' +
      '</div>' +

    '</div>' + /* end view */

    /* EDIT DRAWER */
    '<div class="dr-edit-drawer" id="dr-cl-edit-' + ck + '" style="display:none;">' +
      '<div class="dr-edit-grid">' +
        '<div class="dr-edit-field dr-edit-field-full"><label class="dr-edit-label">Clause Text</label><textarea class="dr-edit-ta" id="dr-cl-edit-text-' + ck + '">' + cl.text + '</textarea></div>' +
        '<div class="dr-edit-field dr-edit-field-full"><label class="dr-edit-label">Obligation</label><textarea class="dr-edit-ta" id="dr-cl-edit-obl-' + ck + '">' + (cl.obligation||'') + '</textarea></div>' +
      '</div>' +
      '<div class="dr-edit-foot">' +
        '<button class="dr-btn dr-btn-ghost" data-close="dr-cl-edit-' + ck + '" data-show="dr-cl-view-' + ck + '">&#x2715; Cancel</button>' +
        '<button class="dr-btn dr-btn-pri dr-btn-sm" onclick="_drSaveClauseEdit(\'' + ck + '\')">&#x2713; Save</button>' +
      '</div>' +
    '</div>' +

    '</div>'; /* end ws-inner */

  /* view more/less toggle */
  window._drToggleTxt = function(ck2) {
    var el  = document.getElementById('dr-cl-txt-' + ck2);
    var btn = document.getElementById('dr-vmore-' + ck2);
    if (!el || !btn) return;
    var c = el.classList.toggle('dr-txt-clamped');
    btn.innerHTML = c ? 'Show more &#x25BE;' : 'Show less &#x25B4;';
  };

  /* meta table toggle */
  window._drToggleMeta = function(mid, btnId) {
    var el = document.getElementById(mid), btn = document.getElementById(btnId);
    if (!el) return;
    var visible = el.style.display !== 'none';
    el.style.display = visible ? 'none' : 'block';
    if (btn) btn.classList.toggle('dr-wc-info-btn-active', !visible);
  };

  /* edit drawer toggle */
  var editToggle = content.querySelector('.dr-tool-edit-toggle[data-target="dr-cl-edit-' + ck + '"]');
  if (editToggle) editToggle.addEventListener('click', function() {
    var drawer = document.getElementById('dr-cl-edit-' + ck);
    var view   = document.getElementById('dr-cl-view-' + ck);
    var opening = drawer.style.display === 'none';
    drawer.style.display = opening ? 'block' : 'none';
    view.style.display   = opening ? 'none'  : 'block';
  });

  /* obligation accordion toggles */
  content.querySelectorAll('.dr-oblig-trigger').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var oi   = btn.dataset.oi;
      var body = document.getElementById('dr-oblig-body-' + oi + '-' + ck);
      var arr  = btn.querySelector('.dr-oblig-arr');
      if (!body) return;
      var open = body.classList.contains('open');
      body.classList.toggle('open', !open);
      if (arr) arr.textContent = open ? '▶' : '▼';
    });
  });
};

/* ── Build obligation item (NO evidence button) ── */
function _drBuildObligationItem(obligText, actionsArr, ck, circId, clauseId, oi, actionsOpen) {
  var actRows = (actionsArr||[]).map(function(a,ai){
    return '<div class="dr-action-row">' +
      '<span class="dr-action-num">'+(ai+1)+'</span>' +
      '<span class="dr-action-txt dr-editable" contenteditable="true">'+a+'</span>' +
      '<button class="dr-row-del" onclick="this.closest(\'.dr-action-row\').remove()">&#x2715;</button>' +
    '</div>';
  }).join('');

  return (
    '<div class="dr-oblig-item" id="dr-oblig-' + oi + '-' + ck + '">' +
      '<button class="dr-oblig-trigger" data-oi="' + oi + '">' +
        '<div class="dr-oblig-trigger-left">' +
          '<span class="dr-oblig-badge">O' + (oi+1) + '</span>' +
          '<span class="dr-oblig-preview">' + obligText + '</span>' +
        '</div>' +
        '<span class="dr-oblig-arr">▶</span>' +
      '</button>' +
      '<div class="dr-oblig-body" id="dr-oblig-body-' + oi + '-' + ck + '">' +
        '<div class="dr-oblig-text-full dr-editable" contenteditable="true">' + obligText + '</div>' +
        '<div class="dr-oblig-controls">' +
          '<div class="dr-oblig-tags-row">' +
            '<span class="dr-ctrl-label" style="white-space:nowrap;">Tags</span>' +
            '<div class="dr-tags-list" id="dr-ob-tlist-' + oi + '-' + ck + '"></div>' +
            '<input class="dr-tag-input" id="dr-ob-tinput-' + oi + '-' + ck + '" placeholder="+ tag" ' +
              'onkeydown="if(event.key===\'Enter\'||event.key===\',\'){_drAddObligTag(\'' + oi + '\',\'' + ck + '\');event.preventDefault();}"/>' +
            '<button class="dr-tag-add-btn" onclick="_drAddObligTag(\'' + oi + '\',\'' + ck + '\')">+</button>' +
          '</div>' +
          '<div class="dr-oblig-actions-row">' +
            '<button class="dr-map-btn" onclick="_drOpenClauseMapModal(\'' + (circId||'') + '\',\'' + clauseId + '\',\'' + ck + '\',\'' + oi + '\')">&#x21C4; Map to Clause</button>' +
            '<button class="dr-row-del dr-oblig-del" onclick="this.closest(\'.dr-oblig-item\').remove()">&#x2715; Remove</button>' +
          '</div>' +
        '</div>' +
        '<div class="dr-actions-wrap">' +
          '<div class="dr-nb-label-row">' +
            '<span class="dr-nb-label">Actions <span class="dr-actions-count">' + (actionsArr||[]).length + '</span></span>' +
            '<button class="dr-add-sub-btn" onclick="_drAddAction(\'' + oi + '\',\'' + ck + '\')">+ Action</button>' +
          '</div>' +
          '<div class="dr-actions-list" id="dr-alist-' + oi + '-' + ck + '">' + actRows + '</div>' +
        '</div>' +
      '</div>' +
    '</div>'
  );
}

window._drSaveClauseEdit = function(ck) {
  var textEl = document.getElementById('dr-cl-edit-text-' + ck);
  var oblEl  = document.getElementById('dr-cl-edit-obl-' + ck);
  var viewEl = document.getElementById('dr-cl-view-' + ck);
  if (textEl) {
    var clauseTxt = document.getElementById('dr-cl-txt-' + ck);
    if (clauseTxt) clauseTxt.textContent = textEl.value;
  }
  if (oblEl && viewEl) {
    var oblPrev = viewEl.querySelector('.dr-oblig-preview');
    if (oblPrev) oblPrev.textContent = oblEl.value;
    var oblFull = viewEl.querySelector('.dr-oblig-text-full');
    if (oblFull) oblFull.textContent = oblEl.value;
  }
  document.getElementById('dr-cl-edit-' + ck).style.display = 'none';
  if (viewEl) viewEl.style.display = 'block';
  showToast('Clause saved.', 'success');
};

window._drBackToStack = function() {
  var content = document.getElementById('dr-cl-ws-content');
  var stack   = document.getElementById('dr-cl-ws-stack');
  if (content) { content.style.display = 'none'; content.innerHTML = ''; }
  if (stack) stack.style.display = 'block';
};

window._drAddObligTag = function(oi, ck) {
  var input = document.getElementById('dr-ob-tinput-' + oi + '-' + ck);
  var list  = document.getElementById('dr-ob-tlist-'  + oi + '-' + ck);
  if (!input || !list) return;
  var val = input.value.trim().replace(/,/g,'');
  if (!val) return;
  var span = document.createElement('span');
  span.className = 'dr-ctag';
  span.innerHTML = val + '<button onclick="this.parentElement.remove()">&#xD7;</button>';
  list.appendChild(span);
  input.value = '';
};

/* ================================================================ MAP MODALS */
window._drOpenClauseMapModal = function(circId, clauseId, ck, oi) {
  var allRows = [];
  (CMS_DATA && CMS_DATA.circulars || []).forEach(function(c) {
    (c.chapters||[]).forEach(function(ch){
      (ch.clauses||[]).forEach(function(cl){
        allRows.push({ circId:c.id, circTitle:c.title, chTitle:ch.title||'', clauseId:cl.id, clauseText:cl.text||'' });
      });
    });
  });
  Object.keys(window._savedFlow||{}).forEach(function(cid){
    (window._savedFlow[cid].clauses||[]).forEach(function(ch){
      (ch.clauses||[]).forEach(function(cl){
        if (!allRows.find(function(r){return r.circId===cid&&r.clauseId===cl.id;})) {
          allRows.push({ circId:cid, circTitle:'(Draft) '+cid, chTitle:ch.title||'', clauseId:cl.id, clauseText:cl.text||'' });
        }
      });
    });
  });
  var mapKey  = circId + ':' + clauseId + ':ob:' + oi;
  var existing = window._mappedObligs[mapKey] || [];
  var overlay = document.createElement('div');
  overlay.className = 'dr-modal-overlay'; overlay.id = 'dr-clause-map-modal';
  var rowsHtml = allRows.map(function(r,i){
    var already  = existing.some(function(e){return e.clauseId===r.clauseId&&e.circId===r.circId;});
    var rowData  = JSON.stringify({circId:r.circId,clauseId:r.clauseId,clauseText:r.clauseText}).replace(/"/g,'&quot;');
    return '<tr class="dr-map-row' + (already?' dr-map-row-mapped':'') + '" data-search="'+r.circId+' '+r.clauseId+' '+r.clauseText.substring(0,60)+' '+r.circTitle+'">' +
      '<td><button class="dr-map-row-btn'+(already?' mapped':'')+'" data-row="'+rowData+'" data-mapkey="'+mapKey+'" data-ck="'+ck+'">' + (already?'&#x2713; Mapped':'Map') + '</button></td>' +
      '<td><span class="dr-map-cid">'+r.clauseId+'</span></td>' +
      '<td><div class="dr-map-circ-id">'+r.circId+'</div><div class="dr-map-circ-title">'+r.circTitle.substring(0,36)+(r.circTitle.length>36?'…':'')+'</div></td>' +
      '<td class="dr-map-ch">'+r.chTitle.substring(0,28)+(r.chTitle.length>28?'…':'')+'</td>' +
      '<td class="dr-map-text">'+r.clauseText.substring(0,80)+(r.clauseText.length>80?'…':'')+'</td>' +
    '</tr>';
  }).join('');
  overlay.innerHTML =
    '<div class="dr-modal">' +
      '<div class="dr-modal-head"><div class="dr-modal-head-left"><div class="dr-modal-eyebrow">Map Obligation to Clause</div><div class="dr-modal-subject">Obligation ' + (parseInt(oi)+1) + ' of Clause ' + clauseId + '</div></div><button class="dr-modal-close" onclick="document.getElementById(\'dr-clause-map-modal\').remove()">&#x2715;</button></div>' +
      (existing.length ? '<div class="dr-modal-mapped-bar"><span class="dr-modal-mapped-label">Currently mapped ('+existing.length+')</span>' + existing.map(function(m){return '<span class="dr-mapped-chip dr-mapped-chip-sm">'+m.circId+' · '+m.clauseId+'</span>';}).join('') + '</div>' : '') +
      '<div class="dr-modal-search-bar"><input class="dr-modal-search" id="dr-cmap-search" placeholder="Search by clause ID, text, circular\u2026" autocomplete="off"/></div>' +
      '<div class="dr-modal-body"><table class="dr-map-table"><thead><tr><th></th><th>Clause</th><th>Circular</th><th>Chapter</th><th>Text</th></tr></thead><tbody id="dr-cmap-tbody">' + rowsHtml + '</tbody></table></div>' +
      '<div class="dr-modal-foot"><span class="dr-modal-foot-note">Map this obligation to related clauses across circulars</span><button class="dr-btn dr-btn-pri" onclick="document.getElementById(\'dr-clause-map-modal\').remove();showToast(\'Obligation mapped.\',\'success\')">Done</button></div>' +
    '</div>';
  document.body.appendChild(overlay);
  overlay.addEventListener('click', function(e){ if(e.target===overlay) overlay.remove(); });
  document.getElementById('dr-cmap-search').addEventListener('input', function(){
    var q = this.value.toLowerCase();
    overlay.querySelectorAll('.dr-map-row').forEach(function(row){ row.style.display = row.dataset.search.toLowerCase().includes(q) ? '' : 'none'; });
  });
  overlay.querySelectorAll('.dr-map-row-btn').forEach(function(btn){
    btn.addEventListener('click', function(){
      var mk=btn.dataset.mapkey, bck=btn.dataset.ck;
      window._mappedObligs[mk]=window._mappedObligs[mk]||[];
      var rowData; try{rowData=JSON.parse(btn.dataset.row.replace(/&quot;/g,'"'));}catch(e){return;}
      var idx=window._mappedObligs[mk].findIndex(function(x){return x.clauseId===rowData.clauseId&&x.circId===rowData.circId;});
      if(idx>=0){window._mappedObligs[mk].splice(idx,1);btn.innerHTML='Map';btn.classList.remove('mapped');btn.closest('tr').classList.remove('dr-map-row-mapped');}
      else{window._mappedObligs[mk].push(rowData);btn.innerHTML='&#x2713; Mapped';btn.classList.add('mapped');btn.closest('tr').classList.add('dr-map-row-mapped');}
    });
  });
};

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
.dr-page{max-width:980px;margin:0 auto;padding-bottom:60px;font-family:var(--dr-font);color:var(--dr-t1);}
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
.dr-ov-id{font-family:var(--dr-mono);font-size:10px;font-weight:700;color:var(--dr-t3);text-transform:uppercase;letter-spacing:.08em;margin-bottom:4px;}
.dr-ov-title{font-size:15px;font-weight:700;line-height:1.4;margin-bottom:8px;}
.dr-ov-chips{display:flex;gap:6px;flex-wrap:wrap;}
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
.dr-map-btn{padding:4px 11px;background:var(--dr-purple-lt);border:1.5px solid #c4b5fd;border-radius:5px;font-family:inherit;font-size:10px;font-weight:700;color:var(--dr-purple);cursor:pointer;transition:all .13s;}
.dr-map-btn:hover{background:#ede9fe;border-color:var(--dr-purple);}
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
  `;
  document.head.appendChild(s);
}