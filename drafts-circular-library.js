// // /**
// //  * circular-library.js — CMS Circular Management System
// //  * REBUILT:
// //  *  - Card grid view (not table) as primary view
// //  *  - Click card → in-page detail screen with all sections
// //  *  - AI Engine results shown inline (Applicability, Executive Summary, Clauses)
// //  *  - Regenerate buttons on each AI section (redirect to AI Engine — no nav yet, just buttons)
// //  *  - Toolbar with search + filters + bulk upload
// //  */

// // /* ── Dummy data (fallback) ─────────────────────────────────────── */
// // const LIB_DATA = (typeof CMS_DATA !== 'undefined' && CMS_DATA.circulars)
// //   ? CMS_DATA.circulars
// //   : [
// //   {
// //     id: 'CIRC-001', title: 'Cybersecurity & IT Governance Framework',
// //     regulator: 'RBI', type: 'Master', risk: 'High', status: 'Active',
// //     issuedDate: '2024-01-10', effectiveDate: '2024-02-01', dueDate: '2025-03-09',
// //     departments: ['IT', 'Risk', 'Compliance'],
// //     complianceScore: 72, tasksTotal: 8, tasksComplete: 4,
// //     description: 'Comprehensive framework mandating appointment of CISO, implementation of SIEM systems, quarterly risk assessments, and board-level cybersecurity oversight for all regulated entities.',
// //     refNumber: 'RBI/CISO/2024/001',
// //     ai: {
// //       applicability: {
// //         applicable: true,
// //         reason: 'Your organisation is a scheduled commercial bank with IT assets exceeding ₹500 Cr. All clauses under Section 3 and Section 5 are directly applicable. The CISO appointment mandate (Clause 1.2) and SIEM implementation (Clause 3.1) are mandatory within 6 months of the circular\'s effective date.',
// //         score: 94,
// //         lastRun: '2025-03-01'
// //       },
// //       summary: {
// //         text: 'This master circular consolidates RBI\'s cybersecurity directives for scheduled commercial banks. Key obligations include: mandatory CISO appointment at board level, deployment of SIEM with 24×7 SOC, quarterly penetration testing, and annual board-level cybersecurity review. Non-compliance attracts monetary penalty under Section 47A of the Banking Regulation Act.',
// //         obligations: ['Appoint a board-level CISO within 6 months', 'Deploy SIEM & 24×7 SOC monitoring', 'Conduct quarterly penetration testing', 'Submit annual cybersecurity posture report to RBI', 'Implement Zero Trust Architecture by Q4 2025'],
// //         lastRun: '2025-03-02'
// //       },
// //       clauses: [
// //         { id: 'C1.1', title: 'CISO Appointment', obligation: 'Appoint a full-time CISO reporting directly to the Board.', status: 'Compliant', dept: 'HR' },
// //         { id: 'C1.2', title: 'Board Oversight', obligation: 'Quarterly cybersecurity briefing to the Board of Directors.', status: 'In Progress', dept: 'Compliance' },
// //         { id: 'C3.1', title: 'SIEM Implementation', obligation: 'Deploy a Security Information & Event Management system with 24×7 monitoring.', status: 'Overdue', dept: 'IT' },
// //         { id: 'C3.2', title: 'Penetration Testing', obligation: 'Conduct quarterly penetration testing and submit results to CISO.', status: 'Open', dept: 'IT' },
// //         { id: 'C5.1', title: 'Incident Reporting', obligation: 'Report cybersecurity incidents to RBI within 6 hours of detection.', status: 'Compliant', dept: 'Compliance' },
// //       ],
// //       lastRun: '2025-03-02'
// //     }
// //   },
// //   {
// //     id: 'CIRC-002', title: 'Enhanced Due Diligence (EDD) Guidelines',
// //     regulator: 'RBI', type: 'Regular', risk: 'High', status: 'Active',
// //     issuedDate: '2024-02-15', effectiveDate: '2024-03-01', dueDate: '2025-03-09',
// //     departments: ['Compliance', 'Operations'],
// //     complianceScore: 55, tasksTotal: 5, tasksComplete: 2,
// //     description: 'Guidelines on enhanced due diligence for high-risk customers including PEPs, NRIs, and cross-border transactions above prescribed thresholds.',
// //     refNumber: 'RBI/AML/2024/012',
// //     ai: {
// //       applicability: {
// //         applicable: true,
// //         reason: 'Applicable as your entity handles cross-border remittances and has PEP customers on record. Sections 2, 4, and 6 are mandatory. EDD procedures must be updated within 3 months.',
// //         score: 88,
// //         lastRun: '2025-02-20'
// //       },
// //       summary: {
// //         text: 'This circular strengthens AML/KYC requirements for regulated entities dealing with high-risk customer profiles. It mandates enhanced scrutiny for Politically Exposed Persons (PEPs), non-resident accounts, and transactions above ₹10 lakh. Entities must update their EDD SOPs and train compliance staff within 90 days.',
// //         obligations: ['Update EDD SOP for PEP customers', 'Implement transaction monitoring for cross-border payments', 'Train compliance staff on new EDD procedures', 'File Suspicious Transaction Reports within 48 hours', 'Conduct annual EDD review for existing high-risk customers'],
// //         lastRun: '2025-02-22'
// //       },
// //       clauses: [
// //         { id: 'C2.1', title: 'PEP Identification', obligation: 'Maintain an updated PEP register and conduct EDD for all PEP customers.', status: 'In Progress', dept: 'Compliance' },
// //         { id: 'C4.1', title: 'Transaction Monitoring', obligation: 'Flag and review all cross-border transactions above ₹10 lakh within 24 hours.', status: 'Overdue', dept: 'Operations' },
// //         { id: 'C6.1', title: 'Staff Training', obligation: 'Mandatory EDD training for all front-line and compliance staff.', status: 'Open', dept: 'HR' },
// //       ],
// //       lastRun: '2025-02-22'
// //     }
// //   },
// //   {
// //     id: 'CIRC-003', title: 'Data Localisation & Privacy Standards',
// //     regulator: 'MeitY', type: 'Regular', risk: 'Medium', status: 'Active',
// //     issuedDate: '2024-03-20', effectiveDate: '2025-03-09', dueDate: '2025-04-10',
// //     departments: ['IT', 'Legal'],
// //     complianceScore: 88, tasksTotal: 4, tasksComplete: 3,
// //     description: 'Standards for storage and processing of Indian customer data within domestic borders, aligned with the Digital Personal Data Protection Act 2023.',
// //     refNumber: 'MEITY/DPDP/2024/007',
// //     ai: {
// //       applicability: { applicable: true, reason: 'Your organisation processes personal data of Indian residents at scale (>1 million records). Sections 3 and 5 on data residency and breach notification are directly applicable.', score: 79, lastRun: '2025-02-15' },
// //       summary: { text: 'Implements the data localisation mandate under DPDP Act 2023. All personal data of Indian residents must be stored on servers physically located in India. Cross-border transfer is permitted only to notified countries with adequate data protection laws. Breach notification to CERT-In within 72 hours is mandatory.', obligations: ['Store all Indian customer data on India-based servers', 'Implement cross-border transfer controls', 'Appoint a Data Protection Officer (DPO)', 'Notify CERT-In of breaches within 72 hours'], lastRun: '2025-02-16' },
// //       clauses: [
// //         { id: 'C3.1', title: 'Data Residency', obligation: 'All personal data of Indian residents must reside on India-domiciled servers.', status: 'Compliant', dept: 'IT' },
// //         { id: 'C5.1', title: 'Breach Notification', obligation: 'Report data breaches to CERT-In within 72 hours.', status: 'Compliant', dept: 'IT' },
// //         { id: 'C7.1', title: 'DPO Appointment', obligation: 'Appoint a Data Protection Officer and register with the Data Protection Board.', status: 'Open', dept: 'Legal' },
// //       ],
// //       lastRun: '2025-02-16'
// //     }
// //   },
// //   {
// //     id: 'CIRC-004', title: 'ESG Disclosure Framework',
// //     regulator: 'SEBI', type: 'Regular', risk: 'Medium', status: 'Active',
// //     issuedDate: '2024-05-01', effectiveDate: '2024-06-01', dueDate: '2025-03-31',
// //     departments: ['Finance', 'Compliance'],
// //     complianceScore: 91, tasksTotal: 3, tasksComplete: 2,
// //     description: 'Business Responsibility & Sustainability Reporting (BRSR) Core framework for listed entities. Mandates disclosure of ESG parameters in annual reports.',
// //     refNumber: 'SEBI/HO/CFD/2024/088',
// //     ai: {
// //       applicability: { applicable: true, reason: 'Applicable to all listed entities with market capitalisation above ₹1,000 Cr. Your entity\'s market cap qualifies. BRSR Core disclosures are mandatory from FY 2024-25.', score: 96, lastRun: '2025-01-10' },
// //       summary: { text: 'SEBI mandates BRSR Core ESG disclosures for top-1000 listed companies. Covers environmental metrics (Scope 1, 2, 3 emissions), social parameters (workforce diversity, safety), and governance (board composition, related-party transactions). Third-party assurance is required for BRSR Core parameters from FY 2024-25.', obligations: ['Disclose Scope 1, 2 & 3 emissions in annual report', 'Obtain third-party assurance on BRSR Core metrics', 'Report workforce diversity and safety statistics', 'Publish water and waste management data'], lastRun: '2025-01-12' },
// //       clauses: [
// //         { id: 'C1.1', title: 'Emissions Disclosure', obligation: 'Report Scope 1, 2 and 3 GHG emissions with third-party assurance.', status: 'In Progress', dept: 'Finance' },
// //         { id: 'C2.1', title: 'Social Parameters', obligation: 'Disclose workforce diversity, gender pay parity, and safety incident data.', status: 'Compliant', dept: 'HR' },
// //       ],
// //       lastRun: '2025-01-12'
// //     }
// //   },
// //   {
// //     id: 'CIRC-005', title: 'Outsourcing & Third-Party Risk Policy',
// //     regulator: 'RBI', type: 'Master', risk: 'High', status: 'Active',
// //     issuedDate: '2024-07-15', effectiveDate: '2024-08-01', dueDate: '2025-02-28',
// //     departments: ['Operations', 'Legal', 'IT'],
// //     complianceScore: 43, tasksTotal: 6, tasksComplete: 1,
// //     description: 'Master directions on managing risks arising from outsourcing of financial and IT services to third-party vendors, including cloud service providers.',
// //     refNumber: 'RBI/RISK/2024/034',
// //     ai: {
// //       applicability: { applicable: true, reason: 'Your organisation outsources core banking operations and uses multiple cloud service providers. All sections of this circular are applicable. Immediate attention required — due date passed.', score: 91, lastRun: '2025-02-01' },
// //       summary: { text: 'Comprehensive framework for managing outsourcing risks. Mandates vendor risk classification, due diligence, contractual safeguards, and exit strategies for all material outsourcing arrangements. Cloud service providers must be onboarded through a defined approval process. Non-compliance can result in suspension of outsourcing arrangements.', obligations: ['Classify all vendors by risk tier', 'Conduct annual vendor due diligence', 'Maintain exit strategies for material arrangements', 'Register cloud providers with RBI IT Registry', 'Conduct quarterly vendor performance reviews'], lastRun: '2025-02-03' },
// //       clauses: [
// //         { id: 'C2.1', title: 'Vendor Classification', obligation: 'Classify all outsourcing arrangements as Critical, Important, or Standard.', status: 'Overdue', dept: 'Operations' },
// //         { id: 'C3.1', title: 'Due Diligence', obligation: 'Conduct annual due diligence on all critical and important vendors.', status: 'Overdue', dept: 'Risk' },
// //         { id: 'C5.1', title: 'Exit Strategy', obligation: 'Document and test exit strategies for all critical outsourcing arrangements.', status: 'Open', dept: 'Operations' },
// //       ],
// //       lastRun: '2025-02-03'
// //     }
// //   },
// //   {
// //     id: 'CIRC-006', title: 'Capital Adequacy & CRAR Reporting',
// //     regulator: 'RBI', type: 'Regular', risk: 'Low', status: 'Closed',
// //     issuedDate: '2023-10-01', effectiveDate: '2024-03-01', dueDate: '2024-12-31',
// //     departments: ['Finance'],
// //     complianceScore: 95, tasksTotal: 3, tasksComplete: 3,
// //     description: 'Reporting framework for Capital to Risk-weighted Assets Ratio (CRAR) under Basel III norms.',
// //     refNumber: 'RBI/CRAR/2023/099',
// //     ai: {
// //       applicability: { applicable: true, reason: 'Applicable as a scheduled commercial bank required to maintain minimum CRAR of 11.5% under Basel III.', score: 99, lastRun: '2024-11-15' },
// //       summary: { text: 'Specifies reporting format and timelines for CRAR disclosures to RBI. Quarterly submission via XBRL format is mandatory. Minimum CRAR of 11.5% (including capital conservation buffer) must be maintained at all times.', obligations: ['Submit CRAR returns quarterly via XBRL', 'Maintain minimum CRAR of 11.5%', 'Disclose capital adequacy in annual report'], lastRun: '2024-11-16' },
// //       clauses: [
// //         { id: 'C1.1', title: 'CRAR Maintenance', obligation: 'Maintain minimum CRAR of 11.5% inclusive of capital conservation buffer.', status: 'Compliant', dept: 'Finance' },
// //         { id: 'C2.1', title: 'Quarterly Reporting', obligation: 'Submit CRAR returns in prescribed XBRL format within 21 days of quarter end.', status: 'Compliant', dept: 'Finance' },
// //       ],
// //       lastRun: '2024-11-16'
// //     }
// //   },
// //   {
// //     id: 'CIRC-007', title: 'AML / KYC Policy Update',
// //     regulator: 'FIU', type: 'Master', risk: 'High', status: 'Active',
// //     issuedDate: '2024-08-20', effectiveDate: '2024-09-01', dueDate: '2025-05-15',
// //     departments: ['Compliance', 'IT'],
// //     complianceScore: 60, tasksTotal: 5, tasksComplete: 2,
// //     description: 'Updated Anti-Money Laundering and Know Your Customer policy directives from the Financial Intelligence Unit — India.',
// //     refNumber: 'FIU-IND/AML/2024/011',
// //     ai: {
// //       applicability: { applicable: true, reason: 'All reporting entities under PMLA 2002 must comply. Your entity is a reporting entity. Sections 3 (KYC), 5 (STR), and 7 (record-keeping) are directly applicable.', score: 97, lastRun: '2025-02-10' },
// //       summary: { text: 'Consolidated AML/KYC directives aligning with FATF recommendations. Mandates risk-based KYC, digital KYC for new customers, and real-time STR filing through FINnet 2.0. Video-based customer identification (V-CIP) is now an accepted mode of KYC.', obligations: ['Implement risk-based KYC for all customers', 'Enable V-CIP for digital onboarding', 'File STRs through FINnet 2.0 within 48 hours', 'Maintain KYC records for 5 years post-relationship', 'Conduct AML training for all customer-facing staff'], lastRun: '2025-02-12' },
// //       clauses: [
// //         { id: 'C3.1', title: 'Risk-Based KYC', obligation: 'Apply enhanced, standard, or simplified KYC based on customer risk rating.', status: 'In Progress', dept: 'Compliance' },
// //         { id: 'C5.1', title: 'STR Filing', obligation: 'File Suspicious Transaction Reports through FINnet 2.0 within 48 hours.', status: 'Open', dept: 'Compliance' },
// //         { id: 'C7.1', title: 'Record Keeping', obligation: 'Maintain KYC and transaction records for minimum 5 years.', status: 'Compliant', dept: 'IT' },
// //       ],
// //       lastRun: '2025-02-12'
// //     }
// //   },
// //   {
// //     id: 'CIRC-008', title: 'BRSR Core Sustainability Reporting',
// //     regulator: 'SEBI', type: 'Regular', risk: 'Medium', status: 'Active',
// //     issuedDate: '2024-12-01', effectiveDate: '2025-01-01', dueDate: '2025-06-30',
// //     departments: ['Finance', 'ESG'],
// //     complianceScore: 77, tasksTotal: 4, tasksComplete: 1,
// //     description: 'Enhanced BRSR Core framework with assurance requirements for ESG metrics applicable to top-150 listed entities from FY 2024-25.',
// //     refNumber: 'SEBI/CFD/BRSR/2024/112',
// //     ai: {
// //       applicability: { applicable: false, reason: 'Your entity is currently ranked #214 by market cap. BRSR Core assurance mandate applies to top-150 entities only. However, voluntary disclosure is recommended. Standard BRSR continues to apply.', score: 42, lastRun: '2025-01-20' },
// //       summary: { text: 'Extends mandatory third-party assurance to BRSR Core parameters for top-150 listed entities. Introduces new metrics on supply chain sustainability and Scope 3 emissions from value chain. ESG rating agencies must be SEBI-registered.', obligations: ['Obtain third-party assurance for BRSR Core (if top-150)', 'Disclose Scope 3 value chain emissions', 'Use only SEBI-registered ESG rating agencies'], lastRun: '2025-01-21' },
// //       clauses: [
// //         { id: 'C1.1', title: 'Assurance Requirement', obligation: 'Obtain reasonable assurance on BRSR Core parameters from a registered assurance provider.', status: 'Open', dept: 'Finance' },
// //         { id: 'C3.1', title: 'Supply Chain Sustainability', obligation: 'Disclose sustainability practices across top-10 suppliers by spend.', status: 'Open', dept: 'ESG' },
// //       ],
// //       lastRun: '2025-01-21'
// //     }
// //   }
// // ];

// // /* ─────────────────────────────────────────────────────────────────
// //    STATE
// //    ───────────────────────────────────────────────────────────────── */
// // let libView = 'grid'; // 'grid' | 'detail'
// // let libSelectedId = null;
// // let libFilters = { search:'', regulator:'', type:'', risk:'', status:'', dept:'' };

// // /* ─────────────────────────────────────────────────────────────────
// //    ENTRY POINT
// //    ───────────────────────────────────────────────────────────────── */
// // function renderMyDraftsPage(preselectedId) {
// //   const area = document.getElementById('content-area');
// //   if (!area) return;

// //   if (preselectedId) {
// //     libSelectedId = preselectedId;
// //     libView = 'detail';
// //   } else {
// //     libView = 'grid';
// //     libSelectedId = null;
// //   }

// //   area.innerHTML = buildLibShell();
// //   initLibToolbar();
// //   renderLibContent();
// //   injectLibStyles();
// // }

// // /* ─────────────────────────────────────────────────────────────────
// //    SHELL (toolbar always visible)
// //    ───────────────────────────────────────────────────────────────── */
// // function buildLibShell() {
// //   return `
// //   <div class="fade-in" id="lib-root">

// //     <!-- ── TOOLBAR ───────────────────────────────────────── -->
// //     <div class="lib-toolbar">

// //       <!-- Back button (only in detail view) -->
// //       <div id="lib-back-row" style="display:none;margin-bottom:14px">
// //         <button class="lib-back-btn" onclick="libGoGrid()">
// //           ← Back to Library
// //         </button>
// //       </div>

// //       <!-- Row 1: Search + actions -->
// //       <div class="lib-tb-row1">
// //         <div class="lib-search-wrap">
// //           <span class="lib-search-icon">⌕</span>
// //           <input type="text" id="lib-search"
// //                  placeholder="Search by title, ID, regulator, reference number..."/>
// //           <button class="lib-search-clear" id="lib-search-clear"
// //                   onclick="document.getElementById('lib-search').value='';applyLibFilters()">✕</button>
// //         </div>

// //         <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
// //           <!-- Bulk Upload -->
// //           <label class="lib-btn-upload">
// //             ⬆&nbsp; Bulk Upload
// //             <input type="file" id="lib-bulk-upload" accept=".pdf,.xlsx,.csv,.zip"
// //                    multiple style="display:none" onchange="handleBulkUpload(this)"/>
// //           </label>
// //           <!-- Export -->
// //           <button class="lib-btn-ghost" onclick="alert('Export coming soon')">
// //             ⬇&nbsp; Export
// //           </button>
// //         </div>

// //         <div style="margin-left:auto;display:flex;align-items:center;gap:10px">
// //           <span id="lib-count" class="lib-count-label"></span>
// //           <button class="lib-btn-clear" id="lib-clear-filters">✕ Clear All</button>
// //         </div>
// //       </div>

// //       <!-- Row 2: Filters -->
// //       <div class="lib-tb-row2">
// //         <span class="lib-filter-label">Filter by</span>

// //         <select class="lib-select" id="lib-filter-regulator" onchange="applyLibFilters()">
// //           <option value="">All Regulators</option>
// //           <option>RBI</option><option>SEBI</option><option>MeitY</option>
// //           <option>IRDAI</option><option>FIU</option><option>PFRDA</option>
// //         </select>

// //         <select class="lib-select" id="lib-filter-type" onchange="applyLibFilters()">
// //           <option value="">All Types</option>
// //           <option>Master</option><option>Regular</option>
// //           <option>Amendment</option><option>Notification</option>
// //         </select>

// //         <select class="lib-select" id="lib-filter-risk" onchange="applyLibFilters()">
// //           <option value="">All Risk Levels</option>
// //           <option>High</option><option>Medium</option><option>Low</option>
// //         </select>

// //         <select class="lib-select" id="lib-filter-status" onchange="applyLibFilters()">
// //           <option value="">All Statuses</option>
// //           <option>Active</option><option>Closed</option>
// //         </select>

// //         <select class="lib-select" id="lib-filter-dept" onchange="applyLibFilters()">
// //           <option value="">All Departments</option>
// //           <option>IT</option><option>HR</option><option>Finance</option>
// //           <option>Legal</option><option>Compliance</option>
// //           <option>Risk</option><option>Operations</option><option>ESG</option>
// //         </select>

// //         <!-- Active chips -->
// //         <div id="lib-active-chips"></div>
// //       </div>

// //       <!-- Upload progress (hidden) -->
// //       <div id="lib-upload-progress" style="display:none;padding-top:10px;border-top:1px solid var(--border)">
// //         <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:5px">
// //           <span id="lib-upload-label" style="font-weight:600">Uploading...</span>
// //           <span id="lib-upload-pct" style="color:#6366f1;font-weight:700">0%</span>
// //         </div>
// //         <div style="background:#e2e8f0;border-radius:99px;height:5px;overflow:hidden">
// //           <div id="lib-upload-bar"
// //                style="height:100%;width:0%;background:#6366f1;border-radius:99px;transition:width .25s"></div>
// //         </div>
// //         <div id="lib-upload-files" style="margin-top:8px;display:flex;flex-wrap:wrap;gap:6px"></div>
// //       </div>
// //     </div><!-- /lib-toolbar -->

// //     <!-- ── CONTENT AREA ───────────────────────────────────── -->
// //     <div id="lib-content"></div>

// //   </div>`;
// // }

// // /* ─────────────────────────────────────────────────────────────────
// //    ROUTE: grid vs detail
// //    ───────────────────────────────────────────────────────────────── */
// // function renderLibContent() {
// //   const backRow = document.getElementById('lib-back-row');
// //   if (libView === 'detail' && libSelectedId) {
// //     if (backRow) backRow.style.display = 'block';
// //     const circ = LIB_DATA.find(c => c.id === libSelectedId);
// //     if (circ) renderLibDetail(circ);
// //   } else {
// //     if (backRow) backRow.style.display = 'none';
// //     renderLibGrid();
// //   }
// // }

// // function libGoGrid() {
// //   libView = 'grid';
// //   libSelectedId = null;
// //   document.getElementById('lib-back-row').style.display = 'none';
// //   renderLibGrid();
// // }

// // function libOpenDetail(id) {
// //   libView = 'detail';
// //   libSelectedId = id;
// //   document.getElementById('lib-back-row').style.display = 'block';
// //   const circ = LIB_DATA.find(c => c.id === id);
// //   if (circ) renderLibDetail(circ);
// //   document.getElementById('lib-content').scrollIntoView({ behavior: 'smooth' });
// // }

// // /* ─────────────────────────────────────────────────────────────────
// //    GRID VIEW — card layout
// //    ───────────────────────────────────────────────────────────────── */
// // function renderLibGrid() {
// //   const area    = document.getElementById('lib-content');
// //   const data    = getFilteredLib();
// //   const countEl = document.getElementById('lib-count');
// //   if (countEl) countEl.textContent = `${data.length} circular${data.length !== 1 ? 's' : ''}`;

// //   if (!data.length) {
// //     area.innerHTML = `
// //       <div style="text-align:center;padding:64px 24px;color:var(--text-muted)">
// //         <div style="font-size:40px;margin-bottom:12px">◫</div>
// //         <div style="font-size:15px;font-weight:600">No circulars match your filters</div>
// //         <div style="font-size:13px;margin-top:4px">Try adjusting or clearing filters</div>
// //       </div>`;
// //     return;
// //   }

// //   const riskColor = { High:'#ef4444', Medium:'#f59e0b', Low:'#10b981' };
// //   const statusColor = { Active:'#10b981', Closed:'#94a3b8', Draft:'#6366f1', 'Under Review':'#f59e0b' };

// //   area.innerHTML = `<div class="lib-card-grid">${data.map(c => {
// //     const dl       = getDaysLeftLib(c.dueDate);
// //     const overdue  = dl < 0;
// //     const soonDue  = dl >= 0 && dl <= 14;
// //     const dueCls   = overdue ? 'lib-due-overdue' : soonDue ? 'lib-due-soon' : 'lib-due-ok';
// //     const dueLabel = overdue ? `${Math.abs(dl)}d overdue` : dl === 0 ? 'Due today' : `${dl}d left`;
// //     const prog     = Math.round((c.tasksComplete / (c.tasksTotal || 1)) * 100);
// //     const progColor= prog >= 80 ? '#10b981' : prog >= 50 ? '#f59e0b' : '#ef4444';
// //     const appBadge = c.ai?.applicability?.applicable === false
// //       ? `<span class="lib-na-badge">Not Applicable</span>` : '';

// //     return `
// //       <div class="lib-card" onclick="libOpenDetail('${c.id}')">
// //         <!-- Card top accent bar -->
// //         <div class="lib-card-accent" style="background:${riskColor[c.risk] || '#94a3b8'}"></div>

// //         <!-- Header -->
// //         <div class="lib-card-head">
// //           <div style="display:flex;align-items:flex-start;gap:10px">
// //             <div>
// //               <div class="lib-card-id">${c.id}</div>
// //               <div class="lib-card-ref">${c.refNumber || ''}</div>
// //             </div>
// //             <div style="margin-left:auto;display:flex;flex-direction:column;align-items:flex-end;gap:4px">
// //               <span class="lib-status-badge" style="background:${statusColor[c.status]}22;color:${statusColor[c.status]};border:1px solid ${statusColor[c.status]}44">${c.status}</span>
// //               ${appBadge}
// //             </div>
// //           </div>
// //           <div class="lib-card-title">${c.title}</div>
// //         </div>

// //         <!-- Meta row -->
// //         <div class="lib-card-meta">
// //           <span class="lib-meta-chip lib-chip-reg">${c.regulator}</span>
// //           <span class="lib-meta-chip lib-chip-type">${c.type}</span>
// //           <span class="lib-meta-chip lib-chip-risk" style="background:${riskColor[c.risk]}18;color:${riskColor[c.risk]};border:1px solid ${riskColor[c.risk]}33">${c.risk} Risk</span>
// //         </div>

// //         <!-- Description -->
// //         <div class="lib-card-desc">${c.description}</div>

// //         <!-- Departments -->
// //         <div class="lib-card-depts">
// //           ${c.departments.map(d => `<span class="lib-dept-tag">${d}</span>`).join('')}
// //         </div>

// //         <!-- Progress + Due -->
// //         <div class="lib-card-footer">
// //           <div class="lib-card-progress-wrap">
// //             <div style="display:flex;justify-content:space-between;margin-bottom:4px">
// //               <span style="font-size:11px;color:var(--text-muted)">Compliance</span>
// //               <span style="font-size:11px;font-weight:700;color:${progColor}">${c.complianceScore}%</span>
// //             </div>
// //             <div class="lib-progress-bg">
// //               <div class="lib-progress-fill" style="width:${c.complianceScore}%;background:${progColor}"></div>
// //             </div>
// //             <div style="font-size:10px;color:var(--text-muted);margin-top:3px">
// //               ${c.tasksComplete}/${c.tasksTotal} tasks done
// //             </div>
// //           </div>
// //           <div class="lib-card-due ${dueCls}">
// //             <span class="lib-due-icon">${overdue ? '⚠' : soonDue ? '⏰' : '📅'}</span>
// //             <div>
// //               <div style="font-size:10px;opacity:.75">Due date</div>
// //               <div style="font-size:12px;font-weight:700">${formatDateLib(c.dueDate)}</div>
// //               <div style="font-size:10px;margin-top:1px">${dueLabel}</div>
// //             </div>
// //           </div>
// //         </div>

// //         <!-- AI status strip -->
// //         <div class="lib-card-ai-strip">
// //           <span class="lib-ai-dot ${c.ai?.lastRun ? 'lib-ai-ready' : 'lib-ai-none'}"></span>
// //           <span style="font-size:11px;color:var(--text-muted)">
// //             ${c.ai?.lastRun ? `AI analysis · ${c.ai.lastRun}` : 'No AI analysis yet'}
// //           </span>
// //           <span class="lib-card-view-btn" style="margin-left:auto">View details →</span>
// //         </div>
// //       </div>`;
// //   }).join('')}</div>`;
// // }

// // /* ─────────────────────────────────────────────────────────────────
// //    DETAIL VIEW
// //    ───────────────────────────────────────────────────────────────── */
// // function renderLibDetail(c) {
// //   const area = document.getElementById('lib-content');
// //   const riskColor   = { High:'#ef4444', Medium:'#f59e0b', Low:'#10b981' };
// //   const statusColor = { Active:'#10b981', Closed:'#94a3b8', Draft:'#6366f1' };
// //   const dl          = getDaysLeftLib(c.dueDate);
// //   const overdue     = dl < 0;
// //   const prog        = Math.round((c.tasksComplete / (c.tasksTotal || 1)) * 100);
// //   const progColor   = prog >= 80 ? '#10b981' : prog >= 50 ? '#f59e0b' : '#ef4444';

// //   /* clause status → style */
// //   const clauseStyle = {
// //     'Compliant':   { bg:'#dcfce7', color:'#166534', dot:'#10b981' },
// //     'In Progress': { bg:'#e0f2fe', color:'#0369a1', dot:'#0ea5e9' },
// //     'Open':        { bg:'#fef3c7', color:'#92400e', dot:'#f59e0b' },
// //     'Overdue':     { bg:'#fee2e2', color:'#991b1b', dot:'#ef4444' },
// //   };

// //   area.innerHTML = `
// //   <div class="lib-detail fade-in">

// //     <!-- ══ HERO HEADER ══════════════════════════════════════════ -->
// //     <div class="lib-detail-hero" style="border-left:4px solid ${riskColor[c.risk] || '#6366f1'}">
// //       <div class="lib-detail-hero-left">
// //         <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:8px">
// //           <span class="lib-detail-id">${c.id}</span>
// //           <span class="lib-status-badge" style="background:${statusColor[c.status]}22;color:${statusColor[c.status]};border:1px solid ${statusColor[c.status]}44;font-size:12px">${c.status}</span>
// //           <span class="lib-meta-chip lib-chip-reg">${c.regulator}</span>
// //           <span class="lib-meta-chip lib-chip-type">${c.type}</span>
// //           <span class="lib-meta-chip lib-chip-risk" style="background:${riskColor[c.risk]}18;color:${riskColor[c.risk]};border:1px solid ${riskColor[c.risk]}33">${c.risk} Risk</span>
// //         </div>
// //         <h2 class="lib-detail-title">${c.title}</h2>
// //         <p class="lib-detail-desc">${c.description}</p>
// //         <div class="lib-detail-ref">
// //           <span>Ref: <strong>${c.refNumber}</strong></span>
// //           <span>·</span>
// //           <span>Issued: <strong>${formatDateLib(c.issuedDate)}</strong></span>
// //           <span>·</span>
// //           <span>Effective: <strong>${formatDateLib(c.effectiveDate)}</strong></span>
// //         </div>
// //         <div style="margin-top:10px;display:flex;flex-wrap:wrap;gap:6px">
// //           ${c.departments.map(d => `<span class="lib-dept-tag">${d}</span>`).join('')}
// //         </div>
// //       </div>

// //       <!-- Stats column -->
// //       <div class="lib-detail-hero-stats">
// //         <!-- Due date -->
// //         <div class="lib-stat-box ${overdue ? 'lib-stat-danger' : dl <= 14 ? 'lib-stat-warn' : 'lib-stat-ok'}">
// //           <div class="lib-stat-icon">${overdue ? '⚠' : '📅'}</div>
// //           <div class="lib-stat-val">${formatDateLib(c.dueDate)}</div>
// //           <div class="lib-stat-label">Due Date · ${overdue ? `${Math.abs(dl)}d overdue` : dl === 0 ? 'Today' : `${dl} days left`}</div>
// //         </div>
// //         <!-- Compliance -->
// //         <div class="lib-stat-box">
// //           <div class="lib-stat-icon">◎</div>
// //           <div class="lib-stat-val" style="color:${progColor}">${c.complianceScore}%</div>
// //           <div class="lib-stat-label">Compliance Score</div>
// //           <div class="lib-progress-bg" style="margin-top:6px">
// //             <div class="lib-progress-fill" style="width:${c.complianceScore}%;background:${progColor}"></div>
// //           </div>
// //         </div>
// //         <!-- Tasks -->
// //         <div class="lib-stat-box">
// //           <div class="lib-stat-icon">◉</div>
// //           <div class="lib-stat-val">${c.tasksComplete}<span style="font-size:14px;font-weight:400;color:var(--text-muted)">/${c.tasksTotal}</span></div>
// //           <div class="lib-stat-label">Tasks Completed</div>
// //         </div>
// //       </div>
// //     </div><!-- /hero -->

// //     <!-- ══ AI ENGINE SECTIONS ════════════════════════════════════ -->
// //     <div class="lib-ai-sections">

// //       <!-- ── 1. APPLICABILITY ──────────────────────────────────── -->
// //       <div class="lib-ai-card">
// //         <div class="lib-ai-card-header">
// //           <div class="lib-ai-card-title-row">
// //             <span class="lib-ai-icon">◈</span>
// //             <div>
// //               <div class="lib-ai-card-title">Applicability Analysis</div>
// //               <div class="lib-ai-card-sub">AI-assessed relevance to your organisation</div>
// //             </div>
// //           </div>
// //           <div style="display:flex;align-items:center;gap:8px">
// //             ${c.ai?.applicability?.lastRun
// //               ? `<span class="lib-ai-run-label">Last run: ${c.ai.applicability.lastRun}</span>` : ''}
// //             <button class="lib-ai-regen-btn"
// //                     onclick="libRegenApplicability('${c.id}')"
// //                     title="Re-run applicability analysis in AI Engine">
// //               ↺ Regenerate
// //             </button>
// //           </div>
// //         </div>

// //         ${c.ai?.applicability ? `
// //         <div class="lib-app-result">
// //           <div class="lib-app-verdict ${c.ai.applicability.applicable ? 'lib-app-yes' : 'lib-app-no'}">
// //             <span class="lib-app-verdict-icon">${c.ai.applicability.applicable ? '✓' : '✗'}</span>
// //             <div>
// //               <div class="lib-app-verdict-text">
// //                 ${c.ai.applicability.applicable ? 'Applicable to your organisation' : 'Not directly applicable'}
// //               </div>
// //               <div class="lib-app-verdict-score">
// //                 AI Confidence: <strong>${c.ai.applicability.score}%</strong>
// //               </div>
// //             </div>
// //           </div>
// //           <div class="lib-app-reason">
// //             <div class="lib-app-reason-label">AI Reasoning</div>
// //             <div class="lib-app-reason-text">${c.ai.applicability.reason}</div>
// //           </div>
// //         </div>
// //         ` : `
// //         <div class="lib-ai-empty">
// //           <div>No applicability analysis run yet.</div>
// //           <button class="lib-ai-regen-btn" onclick="libRegenApplicability('${c.id}')">
// //             ↺ Run Analysis
// //           </button>
// //         </div>`}
// //       </div>

// //       <!-- ── 2. EXECUTIVE SUMMARY ──────────────────────────────── -->
// //       <div class="lib-ai-card">
// //         <div class="lib-ai-card-header">
// //           <div class="lib-ai-card-title-row">
// //             <span class="lib-ai-icon">◧</span>
// //             <div>
// //               <div class="lib-ai-card-title">Executive Summary</div>
// //               <div class="lib-ai-card-sub">AI-generated overview of key requirements</div>
// //             </div>
// //           </div>
// //           <div style="display:flex;align-items:center;gap:8px">
// //             ${c.ai?.summary?.lastRun
// //               ? `<span class="lib-ai-run-label">Last run: ${c.ai.summary.lastRun}</span>` : ''}
// //             <button class="lib-ai-regen-btn"
// //                     onclick="libRegenSummary('${c.id}')"
// //                     title="Regenerate executive summary in AI Engine">
// //               ↺ Regenerate
// //             </button>
// //           </div>
// //         </div>

// //         ${c.ai?.summary ? `
// //         <div class="lib-summary-body">
// //           <p class="lib-summary-text">${c.ai.summary.text}</p>

// //           <div class="lib-obligations-section">
// //             <div class="lib-obligations-label">
// //               <span>📋</span> Key Obligations
// //               <span class="lib-oblig-count">${c.ai.summary.obligations.length}</span>
// //             </div>
// //             <div class="lib-obligations-list">
// //               ${c.ai.summary.obligations.map((o, i) => `
// //                 <div class="lib-obligation-item">
// //                   <span class="lib-oblig-num">${i + 1}</span>
// //                   <span class="lib-oblig-text">${o}</span>
// //                 </div>`).join('')}
// //             </div>
// //           </div>
// //         </div>
// //         ` : `
// //         <div class="lib-ai-empty">
// //           <div>No executive summary generated yet.</div>
// //           <button class="lib-ai-regen-btn" onclick="libRegenSummary('${c.id}')">
// //             ↺ Generate Summary
// //           </button>
// //         </div>`}
// //       </div>

// //       <!-- ── 3. CLAUSES & OBLIGATIONS ──────────────────────────── -->
// //       <div class="lib-ai-card">
// //         <div class="lib-ai-card-header">
// //           <div class="lib-ai-card-title-row">
// //             <span class="lib-ai-icon">⊡</span>
// //             <div>
// //               <div class="lib-ai-card-title">Clauses & Obligation Mapping</div>
// //               <div class="lib-ai-card-sub">AI-extracted clauses mapped to departments and tasks</div>
// //             </div>
// //           </div>
// //           <div style="display:flex;align-items:center;gap:8px">
// //             ${c.ai?.lastRun
// //               ? `<span class="lib-ai-run-label">Last run: ${c.ai.lastRun}</span>` : ''}
// //             <button class="lib-ai-regen-btn"
// //                     onclick="libRegenClauses('${c.id}')"
// //                     title="Regenerate clause extraction in AI Engine">
// //               ↺ Regenerate
// //             </button>
// //           </div>
// //         </div>

// //         ${c.ai?.clauses?.length ? `
// //         <div class="lib-clauses-list">
// //           ${c.ai.clauses.map(cl => {
// //             const cs = clauseStyle[cl.status] || { bg:'#f3f4f6', color:'#374151', dot:'#94a3b8' };
// //             return `
// //             <div class="lib-clause-row">
// //               <div class="lib-clause-id">${cl.id}</div>
// //               <div class="lib-clause-body">
// //                 <div class="lib-clause-title">${cl.title}</div>
// //                 <div class="lib-clause-text">${cl.obligation}</div>
// //               </div>
// //               <div class="lib-clause-right">
// //                 <span class="lib-clause-dept">${cl.dept}</span>
// //                 <span class="lib-clause-status"
// //                       style="background:${cs.bg};color:${cs.color}">
// //                   <span style="display:inline-block;width:6px;height:6px;border-radius:50%;
// //                                background:${cs.dot};margin-right:4px;vertical-align:middle"></span>
// //                   ${cl.status}
// //                 </span>
// //               </div>
// //             </div>`;
// //           }).join('')}
// //         </div>
// //         ` : `
// //         <div class="lib-ai-empty">
// //           <div>No clause mapping generated yet.</div>
// //           <button class="lib-ai-regen-btn" onclick="libRegenClauses('${c.id}')">
// //             ↺ Generate Clauses
// //           </button>
// //         </div>`}
// //       </div>

// //     </div><!-- /lib-ai-sections -->
// //   </div>`;
// // }

// // /* ─────────────────────────────────────────────────────────────────
// //    REGENERATE HANDLERS  (navigate to AI Engine — wire up later)
// //    ───────────────────────────────────────────────────────────────── */
// // function libRegenApplicability(id) {
// //   showLibToast(`Opening AI Engine → Applicability Analysis for ${id}…`);
// //   /* TODO: window.CMS.navigateTo('ai-applicability', id) */
// // }
// // function libRegenSummary(id) {
// //   showLibToast(`Opening AI Engine → Executive Summary for ${id}…`);
// //   /* TODO: window.CMS.navigateTo('ai-summary', id) */
// // }
// // function libRegenClauses(id) {
// //   showLibToast(`Opening AI Engine → Clause Generation for ${id}…`);
// //   /* TODO: window.CMS.navigateTo('ai-clause', id) */
// // }

// // function showLibToast(msg) {
// //   let t = document.getElementById('lib-toast');
// //   if (!t) {
// //     t = document.createElement('div');
// //     t.id = 'lib-toast';
// //     document.body.appendChild(t);
// //   }
// //   t.textContent = msg;
// //   t.className = 'lib-toast lib-toast-show';
// //   clearTimeout(t._to);
// //   t._to = setTimeout(() => t.classList.remove('lib-toast-show'), 3000);
// // }

// // /* ─────────────────────────────────────────────────────────────────
// //    TOOLBAR: filter, chips, upload, clear
// //    ───────────────────────────────────────────────────────────────── */
// // function initLibToolbar() {
// //   document.getElementById('lib-search')
// //     ?.addEventListener('input', applyLibFilters);

// //   document.getElementById('lib-clear-filters')
// //     ?.addEventListener('click', () => {
// //       ['lib-search','lib-filter-regulator','lib-filter-type',
// //        'lib-filter-risk','lib-filter-status','lib-filter-dept']
// //         .forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
// //       applyLibFilters();
// //     });
// // }

// // function applyLibFilters() {
// //   if (libView === 'detail') return; /* don't re-render detail on filter change */
// //   renderLibGrid();
// //   renderLibChips();
// // }

// // function getFilteredLib() {
// //   const s   = (document.getElementById('lib-search')?.value || '').toLowerCase();
// //   const reg = document.getElementById('lib-filter-regulator')?.value || '';
// //   const typ = document.getElementById('lib-filter-type')?.value || '';
// //   const rsk = document.getElementById('lib-filter-risk')?.value || '';
// //   const sts = document.getElementById('lib-filter-status')?.value || '';
// //   const dpt = document.getElementById('lib-filter-dept')?.value || '';

// //   return LIB_DATA.filter(c => {
// //     if (s && !`${c.id} ${c.title} ${c.regulator} ${c.refNumber}`.toLowerCase().includes(s)) return false;
// //     if (reg && c.regulator !== reg) return false;
// //     if (typ && c.type !== typ) return false;
// //     if (rsk && c.risk !== rsk) return false;
// //     if (sts && c.status !== sts) return false;
// //     if (dpt && !c.departments.includes(dpt)) return false;
// //     return true;
// //   });
// // }

// // function renderLibChips() {
// //   const defs = [
// //     { id:'lib-filter-regulator', label:'Regulator' },
// //     { id:'lib-filter-type',      label:'Type'      },
// //     { id:'lib-filter-risk',      label:'Risk'      },
// //     { id:'lib-filter-status',    label:'Status'    },
// //     { id:'lib-filter-dept',      label:'Dept'      },
// //   ];
// //   const wrap = document.getElementById('lib-active-chips');
// //   if (!wrap) return;
// //   wrap.innerHTML = defs
// //     .filter(d => document.getElementById(d.id)?.value)
// //     .map(d => {
// //       const val = document.getElementById(d.id).value;
// //       return `<span class="lib-active-chip">
// //         ${d.label}: ${val}
// //         <button onclick="document.getElementById('${d.id}').value='';applyLibFilters()"
// //                 style="background:none;border:none;cursor:pointer;color:#6366f1;
// //                        font-size:11px;padding:0 0 0 3px;line-height:1">✕</button>
// //       </span>`;
// //     }).join('');
// // }

// // /* ─────────────────────────────────────────────────────────────────
// //    BULK UPLOAD
// //    ───────────────────────────────────────────────────────────────── */
// // function handleBulkUpload(input) {
// //   const files = [...input.files];
// //   if (!files.length) return;
// //   const prog  = document.getElementById('lib-upload-progress');
// //   const bar   = document.getElementById('lib-upload-bar');
// //   const pct   = document.getElementById('lib-upload-pct');
// //   const label = document.getElementById('lib-upload-label');
// //   const flist = document.getElementById('lib-upload-files');
// //   bar.style.width = '0%'; bar.style.background = '#6366f1';
// //   pct.style.color = '#6366f1'; label.style.color = '';
// //   prog.style.display = 'block';
// //   label.textContent = `Uploading ${files.length} file${files.length > 1 ? 's' : ''}…`;
// //   flist.innerHTML = files.map(f => `
// //     <span style="display:inline-flex;align-items:center;gap:5px;padding:3px 9px;
// //                  background:#f1f5f9;border-radius:99px;font-size:11px;font-weight:500">
// //       📄 ${f.name} <span style="color:#94a3b8">${(f.size/1024).toFixed(0)}KB</span>
// //     </span>`).join('');
// //   let val = 0;
// //   const iv = setInterval(() => {
// //     val += Math.random() * 16;
// //     if (val >= 100) {
// //       val = 100; clearInterval(iv);
// //       label.textContent = `✓ ${files.length} file${files.length > 1 ? 's' : ''} uploaded successfully`;
// //       label.style.color = '#10b981'; pct.style.color = '#10b981'; bar.style.background = '#10b981';
// //       setTimeout(() => { prog.style.display = 'none'; input.value = ''; }, 3500);
// //     }
// //     bar.style.width = val + '%'; pct.textContent = Math.round(val) + '%';
// //   }, 100);
// // }

// // /* ─────────────────────────────────────────────────────────────────
// //    HELPERS
// //    ───────────────────────────────────────────────────────────────── */
// // function formatDateLib(ds) {
// //   if (!ds) return '—';
// //   return new Date(ds).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' });
// // }
// // function getDaysLeftLib(ds) {
// //   if (!ds) return 999;
// //   return Math.ceil((new Date(ds) - new Date()) / 86400000);
// // }

// // /* ─────────────────────────────────────────────────────────────────
// //    STYLES  (injected once)
// //    ───────────────────────────────────────────────────────────────── */
// // function injectLibStyles() {
// //   if (document.getElementById('_lib-styles')) return;
// //   const s = document.createElement('style');
// //   s.id = '_lib-styles';
// //   s.textContent = `

// //   /* ── TOOLBAR ───────────────────────────────────────────────── */
// //   .lib-toolbar {
// //     display: flex; flex-direction: column; gap: 12px;
// //     background: #fff;
// //     border: 1px solid var(--border, #e2e8f0);
// //     border-radius: 12px;
// //     padding: 16px 18px;
// //     margin-bottom: 20px;
// //     box-shadow: 0 1px 4px rgba(0,0,0,.05);
// //   }
// //   .lib-tb-row1 {
// //     display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
// //   }
// //   .lib-tb-row2 {
// //     display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
// //     padding-top: 10px; border-top: 1px solid var(--border, #e2e8f0);
// //   }
// //   .lib-filter-label {
// //     font-size: 11px; font-weight: 700; color: #94a3b8;
// //     text-transform: uppercase; letter-spacing: .06em; white-space: nowrap;
// //   }
// //   .lib-search-wrap {
// //     position: relative; flex: 1; min-width: 220px; max-width: 400px;
// //   }
// //   .lib-search-wrap input {
// //     width: 100%; padding: 8px 32px 8px 32px;
// //     border: 1px solid var(--border, #e2e8f0); border-radius: 8px;
// //     font-family: inherit; font-size: 13px; outline: none;
// //     background: var(--light-bg, #f8fafc);
// //     transition: border-color .2s, box-shadow .2s;
// //   }
// //   .lib-search-wrap input:focus {
// //     border-color: #6366f1; background: #fff;
// //     box-shadow: 0 0 0 3px rgba(99,102,241,.1);
// //   }
// //   .lib-search-icon {
// //     position: absolute; left: 10px; top: 50%; transform: translateY(-50%);
// //     color: #94a3b8; font-size: 16px; pointer-events: none;
// //   }
// //   .lib-search-clear {
// //     position: absolute; right: 9px; top: 50%; transform: translateY(-50%);
// //     background: none; border: none; color: #94a3b8; cursor: pointer; font-size: 13px;
// //   }
// //   .lib-select {
// //     padding: 6px 26px 6px 10px; border: 1px solid var(--border, #e2e8f0);
// //     border-radius: 7px; font-family: inherit; font-size: 12.5px;
// //     color: var(--text-primary, #0f172a); background: var(--light-bg, #f8fafc)
// //       url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='9' height='5'%3E%3Cpath d='M0 0l4.5 5L9 0z' fill='%2394a3b8'/%3E%3C/svg%3E")
// //       no-repeat right 8px center;
// //     -webkit-appearance: none; appearance: none; cursor: pointer; outline: none;
// //     transition: border-color .2s;
// //   }
// //   .lib-select:focus { border-color: #6366f1; }
// //   .lib-btn-upload {
// //     display: inline-flex; align-items: center; gap: 6px;
// //     padding: 8px 15px; background: #6366f1; color: #fff;
// //     border-radius: 8px; font-size: 13px; font-weight: 600;
// //     cursor: pointer; font-family: inherit; white-space: nowrap;
// //     transition: background .2s, box-shadow .2s; border: none;
// //   }
// //   .lib-btn-upload:hover { background: #4f46e5; box-shadow: 0 4px 12px rgba(99,102,241,.3); }
// //   .lib-btn-ghost {
// //     display: inline-flex; align-items: center; gap: 6px;
// //     padding: 8px 13px; background: none;
// //     border: 1px solid var(--border, #e2e8f0); border-radius: 8px;
// //     font-size: 13px; font-weight: 500; cursor: pointer; font-family: inherit;
// //     color: var(--text-primary, #0f172a); white-space: nowrap;
// //     transition: all .2s;
// //   }
// //   .lib-btn-ghost:hover { background: var(--light-bg, #f8fafc); }
// //   .lib-btn-clear {
// //     padding: 6px 12px; background: none; border: 1px solid #fca5a5;
// //     border-radius: 7px; font-size: 12px; font-weight: 600; color: #ef4444;
// //     cursor: pointer; white-space: nowrap; transition: all .2s;
// //   }
// //   .lib-btn-clear:hover { background: #fee2e2; }
// //   .lib-count-label { font-size: 12px; color: var(--text-muted, #64748b); font-weight: 500; }
// //   .lib-active-chip {
// //     display: inline-flex; align-items: center; gap: 3px;
// //     padding: 3px 10px; background: #eef2ff; color: #4338ca;
// //     border-radius: 99px; font-size: 11px; font-weight: 600;
// //   }
// //   .lib-back-btn {
// //     display: inline-flex; align-items: center; gap: 6px;
// //     padding: 7px 14px; background: none;
// //     border: 1px solid var(--border, #e2e8f0); border-radius: 8px;
// //     font-size: 13px; font-weight: 600; color: var(--text-primary, #0f172a);
// //     cursor: pointer; transition: all .2s;
// //   }
// //   .lib-back-btn:hover { background: #f1f5f9; border-color: #94a3b8; }

// //   /* ── CARD GRID ─────────────────────────────────────────────── */
// //   .lib-card-grid {
// //     display: grid;
// //     grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
// //     gap: 18px;
// //   }
// //   .lib-card {
// //     background: #fff;
// //     border: 1px solid var(--border, #e2e8f0);
// //     border-radius: 14px;
// //     overflow: hidden;
// //     cursor: pointer;
// //     transition: box-shadow .2s, transform .2s;
// //     display: flex; flex-direction: column;
// //     position: relative;
// //   }
// //   .lib-card:hover {
// //     box-shadow: 0 8px 28px rgba(0,0,0,.1);
// //     transform: translateY(-2px);
// //   }
// //   .lib-card-accent {
// //     height: 4px; width: 100%;
// //   }
// //   .lib-card-head {
// //     padding: 16px 16px 10px;
// //   }
// //   .lib-card-id {
// //     font-size: 11px; font-weight: 800; font-family: monospace;
// //     color: #6366f1; letter-spacing: .03em;
// //   }
// //   .lib-card-ref {
// //     font-size: 10px; color: var(--text-muted, #64748b); margin-top: 1px;
// //   }
// //   .lib-card-title {
// //     font-size: 14px; font-weight: 700; color: var(--text-primary, #0f172a);
// //     line-height: 1.4; margin-top: 8px;
// //   }
// //   .lib-card-meta {
// //     padding: 0 16px 8px;
// //     display: flex; gap: 6px; flex-wrap: wrap;
// //   }
// //   .lib-meta-chip {
// //     display: inline-block; font-size: 10px; font-weight: 700;
// //     padding: 2px 8px; border-radius: 99px;
// //   }
// //   .lib-chip-reg  { background: #ede9fe; color: #5b21b6; }
// //   .lib-chip-type { background: #e0f2fe; color: #0369a1; }
// //   .lib-chip-risk { /* set inline */ }
// //   .lib-card-desc {
// //     padding: 0 16px 10px;
// //     font-size: 12px; color: var(--text-muted, #64748b); line-height: 1.5;
// //     display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
// //     overflow: hidden;
// //   }
// //   .lib-card-depts {
// //     padding: 0 16px 12px; display: flex; gap: 5px; flex-wrap: wrap;
// //   }
// //   .lib-dept-tag {
// //     font-size: 10px; font-weight: 600; padding: 2px 8px;
// //     background: #f1f5f9; color: #475569; border-radius: 5px;
// //   }
// //   .lib-card-footer {
// //     padding: 12px 16px; margin-top: auto;
// //     border-top: 1px solid var(--border, #e2e8f0);
// //     display: flex; gap: 12px; align-items: flex-end;
// //   }
// //   .lib-card-progress-wrap { flex: 1; }
// //   .lib-progress-bg {
// //     height: 5px; background: #e2e8f0; border-radius: 99px; overflow: hidden;
// //   }
// //   .lib-progress-fill {
// //     height: 100%; border-radius: 99px; transition: width .4s;
// //   }
// //   .lib-card-due {
// //     display: flex; align-items: center; gap: 8px;
// //     padding: 8px 10px; border-radius: 8px; white-space: nowrap;
// //   }
// //   .lib-due-icon { font-size: 16px; }
// //   .lib-due-overdue { background: #fee2e2; color: #991b1b; }
// //   .lib-due-soon    { background: #fef9c3; color: #854d0e; }
// //   .lib-due-ok      { background: #f1f5f9; color: #475569; }
// //   .lib-card-ai-strip {
// //     padding: 8px 16px;
// //     background: #fafbff;
// //     border-top: 1px solid var(--border, #e2e8f0);
// //     display: flex; align-items: center; gap: 7px;
// //   }
// //   .lib-ai-dot {
// //     display: inline-block; width: 7px; height: 7px; border-radius: 50%;
// //   }
// //   .lib-ai-ready { background: #10b981; }
// //   .lib-ai-none  { background: #d1d5db; }
// //   .lib-card-view-btn {
// //     font-size: 11px; font-weight: 700; color: #6366f1;
// //   }
// //   .lib-status-badge {
// //     display: inline-block; font-size: 11px; font-weight: 700;
// //     padding: 2px 9px; border-radius: 99px;
// //   }
// //   .lib-na-badge {
// //     display: inline-block; font-size: 10px; font-weight: 700;
// //     padding: 2px 8px; border-radius: 99px;
// //     background: #f3f4f6; color: #6b7280; border: 1px solid #e5e7eb;
// //   }

// //   /* ── DETAIL VIEW ───────────────────────────────────────────── */
// //   .lib-detail { display: flex; flex-direction: column; gap: 20px; }
// //   .lib-detail-hero {
// //     background: #fff; border: 1px solid var(--border, #e2e8f0);
// //     border-radius: 14px; padding: 24px;
// //     display: flex; gap: 24px; align-items: flex-start;
// //     box-shadow: 0 1px 6px rgba(0,0,0,.05);
// //   }
// //   .lib-detail-hero-left { flex: 1; min-width: 0; }
// //   .lib-detail-id {
// //     font-size: 12px; font-weight: 800; font-family: monospace;
// //     color: #6366f1; letter-spacing: .04em;
// //   }
// //   .lib-detail-title {
// //     font-size: 20px; font-weight: 800; color: var(--text-primary, #0f172a);
// //     line-height: 1.3; margin: 8px 0 10px;
// //   }
// //   .lib-detail-desc {
// //     font-size: 13px; color: var(--text-muted, #64748b); line-height: 1.6;
// //     margin: 0 0 10px;
// //   }
// //   .lib-detail-ref {
// //     display: flex; gap: 10px; flex-wrap: wrap;
// //     font-size: 12px; color: var(--text-muted, #64748b);
// //   }
// //   .lib-detail-hero-stats {
// //     display: flex; flex-direction: column; gap: 10px;
// //     min-width: 180px;
// //   }
// //   .lib-stat-box {
// //     background: var(--light-bg, #f8fafc);
// //     border: 1px solid var(--border, #e2e8f0);
// //     border-radius: 10px; padding: 12px 14px;
// //   }
// //   .lib-stat-danger { background: #fee2e2; border-color: #fca5a5; }
// //   .lib-stat-warn   { background: #fef9c3; border-color: #fde68a; }
// //   .lib-stat-ok     { background: #f0fdf4; border-color: #bbf7d0; }
// //   .lib-stat-icon { font-size: 15px; margin-bottom: 4px; }
// //   .lib-stat-val  { font-size: 18px; font-weight: 800; color: var(--text-primary, #0f172a); }
// //   .lib-stat-label{ font-size: 11px; color: var(--text-muted, #64748b); margin-top: 2px; }

// //   /* ── AI SECTIONS ───────────────────────────────────────────── */
// //   .lib-ai-sections { display: flex; flex-direction: column; gap: 16px; }
// //   .lib-ai-card {
// //     background: #fff; border: 1px solid var(--border, #e2e8f0);
// //     border-radius: 14px; overflow: hidden;
// //     box-shadow: 0 1px 4px rgba(0,0,0,.04);
// //   }
// //   .lib-ai-card-header {
// //     display: flex; align-items: center; justify-content: space-between;
// //     padding: 16px 20px; border-bottom: 1px solid var(--border, #e2e8f0);
// //     background: #fafbff; flex-wrap: wrap; gap: 10px;
// //   }
// //   .lib-ai-card-title-row {
// //     display: flex; align-items: center; gap: 12px;
// //   }
// //   .lib-ai-icon {
// //     font-size: 20px; color: #6366f1; line-height: 1;
// //   }
// //   .lib-ai-card-title {
// //     font-size: 14px; font-weight: 700; color: var(--text-primary, #0f172a);
// //   }
// //   .lib-ai-card-sub {
// //     font-size: 11px; color: var(--text-muted, #64748b); margin-top: 1px;
// //   }
// //   .lib-ai-run-label {
// //     font-size: 11px; color: var(--text-muted, #64748b);
// //     background: #f1f5f9; padding: 3px 9px; border-radius: 99px;
// //   }
// //   .lib-ai-regen-btn {
// //     display: inline-flex; align-items: center; gap: 5px;
// //     padding: 7px 14px; background: #eef2ff; color: #4338ca;
// //     border: 1px solid #c7d2fe; border-radius: 8px;
// //     font-size: 12px; font-weight: 700; cursor: pointer; font-family: inherit;
// //     transition: all .2s; white-space: nowrap;
// //   }
// //   .lib-ai-regen-btn:hover {
// //     background: #6366f1; color: #fff; border-color: #6366f1;
// //     box-shadow: 0 3px 10px rgba(99,102,241,.3);
// //   }
// //   .lib-ai-empty {
// //     padding: 32px; text-align: center;
// //     color: var(--text-muted, #64748b); font-size: 13px;
// //     display: flex; flex-direction: column; align-items: center; gap: 12px;
// //   }

// //   /* Applicability */
// //   .lib-app-result { padding: 20px; display: flex; flex-direction: column; gap: 14px; }
// //   .lib-app-verdict {
// //     display: flex; align-items: flex-start; gap: 14px;
// //     padding: 14px 18px; border-radius: 10px;
// //   }
// //   .lib-app-yes { background: #f0fdf4; border: 1px solid #bbf7d0; }
// //   .lib-app-no  { background: #fafafa; border: 1px solid #e5e7eb; }
// //   .lib-app-verdict-icon {
// //     width: 30px; height: 30px; border-radius: 50%;
// //     display: flex; align-items: center; justify-content: center;
// //     font-size: 14px; font-weight: 800; flex-shrink: 0;
// //   }
// //   .lib-app-yes .lib-app-verdict-icon { background: #10b981; color: #fff; }
// //   .lib-app-no  .lib-app-verdict-icon { background: #9ca3af; color: #fff; }
// //   .lib-app-verdict-text  { font-size: 14px; font-weight: 700; }
// //   .lib-app-verdict-score { font-size: 12px; color: var(--text-muted, #64748b); margin-top: 2px; }
// //   .lib-app-reason { background: var(--light-bg, #f8fafc); border-radius: 8px; padding: 14px; }
// //   .lib-app-reason-label {
// //     font-size: 10px; font-weight: 800; text-transform: uppercase;
// //     letter-spacing: .06em; color: #94a3b8; margin-bottom: 6px;
// //   }
// //   .lib-app-reason-text { font-size: 13px; color: var(--text-primary, #0f172a); line-height: 1.6; }

// //   /* Summary */
// //   .lib-summary-body { padding: 20px; }
// //   .lib-summary-text {
// //     font-size: 13px; color: var(--text-primary, #0f172a); line-height: 1.7;
// //     margin: 0 0 16px; padding-bottom: 16px;
// //     border-bottom: 1px solid var(--border, #e2e8f0);
// //   }
// //   .lib-obligations-section {}
// //   .lib-obligations-label {
// //     display: flex; align-items: center; gap: 8px;
// //     font-size: 12px; font-weight: 700; color: var(--text-primary, #0f172a);
// //     margin-bottom: 10px;
// //   }
// //   .lib-oblig-count {
// //     display: inline-flex; align-items: center; justify-content: center;
// //     width: 20px; height: 20px; border-radius: 50%;
// //     background: #6366f1; color: #fff; font-size: 11px; font-weight: 800;
// //   }
// //   .lib-obligations-list { display: flex; flex-direction: column; gap: 6px; }
// //   .lib-obligation-item {
// //     display: flex; align-items: flex-start; gap: 10px;
// //     padding: 10px 12px; background: var(--light-bg, #f8fafc);
// //     border-radius: 8px; border: 1px solid var(--border, #e2e8f0);
// //   }
// //   .lib-oblig-num {
// //     min-width: 22px; height: 22px; border-radius: 50%;
// //     background: #eef2ff; color: #4338ca;
// //     font-size: 11px; font-weight: 800;
// //     display: flex; align-items: center; justify-content: center;
// //     flex-shrink: 0;
// //   }
// //   .lib-oblig-text { font-size: 13px; color: var(--text-primary, #0f172a); line-height: 1.5; }

// //   /* Clauses */
// //   .lib-clauses-list { padding: 12px 16px; display: flex; flex-direction: column; gap: 8px; }
// //   .lib-clause-row {
// //     display: flex; align-items: flex-start; gap: 12px;
// //     padding: 12px 14px; background: var(--light-bg, #f8fafc);
// //     border-radius: 9px; border: 1px solid var(--border, #e2e8f0);
// //     transition: border-color .2s;
// //   }
// //   .lib-clause-row:hover { border-color: #a5b4fc; }
// //   .lib-clause-id {
// //     font-size: 11px; font-weight: 800; font-family: monospace;
// //     color: #6366f1; background: #eef2ff; padding: 3px 8px;
// //     border-radius: 5px; white-space: nowrap; flex-shrink: 0; margin-top: 1px;
// //   }
// //   .lib-clause-body { flex: 1; min-width: 0; }
// //   .lib-clause-title { font-size: 13px; font-weight: 700; margin-bottom: 3px; }
// //   .lib-clause-text  { font-size: 12px; color: var(--text-muted, #64748b); line-height: 1.5; }
// //   .lib-clause-right {
// //     display: flex; flex-direction: column; align-items: flex-end; gap: 5px; flex-shrink: 0;
// //   }
// //   .lib-clause-dept {
// //     font-size: 10px; font-weight: 600; padding: 2px 8px;
// //     background: #f1f5f9; color: #475569; border-radius: 5px;
// //   }
// //   .lib-clause-status {
// //     font-size: 10px; font-weight: 700; padding: 3px 9px; border-radius: 99px;
// //     display: flex; align-items: center;
// //   }

// //   /* Toast */
// //   .lib-toast {
// //     position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%) translateY(80px);
// //     background: #1e293b; color: #fff;
// //     padding: 10px 20px; border-radius: 99px;
// //     font-size: 13px; font-weight: 500;
// //     box-shadow: 0 8px 24px rgba(0,0,0,.25);
// //     transition: transform .3s ease; z-index: 9999; white-space: nowrap;
// //   }
// //   .lib-toast-show { transform: translateX(-50%) translateY(0); }

// //   /* Responsive */
// //   @media (max-width: 768px) {
// //     .lib-card-grid { grid-template-columns: 1fr; }
// //     .lib-detail-hero { flex-direction: column; }
// //     .lib-detail-hero-stats { flex-direction: row; flex-wrap: wrap; min-width: 0; }
// //     .lib-stat-box { flex: 1; min-width: 130px; }
// //   }
// //   `;
// //   document.head.appendChild(s);
// // }

// /**
//  * draft-review.js — Compliance Draft Review (full rewrite)
//  * Stepper: Overview → Applicability → Executive Summary → Clause Generation → Evidence
//  */

// window._savedFlow    = window._savedFlow    || {};
// window._draftStore   = window._draftStore   || {};
// window._mappedClauses= window._mappedClauses|| {};
// window._mappedObligs = window._mappedObligs || {};

// function _seedSavedFlow(circ) {
//   if (!circ || window._savedFlow[circ.id]) return;
//   const id = circ.id;
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
//     },
//     summary: {
//       audience:'Senior Management', depth:'Detailed',
//       purpose:`This circular issued by ${circ.regulator||'the Regulator'} mandates enhanced compliance requirements for regulated entities. The directive addresses critical governance gaps identified during supervisory reviews and introduces structured obligations across operational, technological, and reporting domains.`,
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
//     evidence:[
//       { id:'EV-001', clauseId:'1.1', name:'Board Approval Resolution',       type:'Board Record',      status:'Pending',     source:'Company Secretary',   desc:'Formal board resolution approving compliance policy updates' },
//       { id:'EV-002', clauseId:'1.1', name:'Compliance Policy Document',      type:'Policy',            status:'In Progress', source:'Compliance Team',     desc:'Updated compliance policy incorporating circular requirements' },
//       { id:'EV-003', clauseId:'1.2', name:'Staff Training Records',          type:'Training Record',   status:'Pending',     source:'HR System',           desc:'Completion records for mandatory compliance training' },
//       { id:'EV-004', clauseId:'1.2', name:'Internal Audit Report',           type:'Audit Record',      status:'Completed',   source:'Internal Audit Dept', desc:'Audit findings confirming controls are operating effectively' },
//       { id:'EV-005', clauseId:'2.1', name:'Regulatory Submission Receipt',   type:'Regulatory Filing', status:'Completed',   source:'Compliance Team',     desc:'Regulator acknowledgement of timely report submission' },
//       { id:'EV-006', clauseId:'2.1', name:'System Audit Trail / Access Log', type:'System Log',        status:'In Progress', source:'IT Department',       desc:'System-generated logs demonstrating automated controls' },
//     ],
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
//   const area = document.getElementById('content-area');
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
//         '<button class="dr-btn dr-btn-pri" onclick="publishToLibrary()">&#x1F4DA; Publish to Library</button>' +
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
//         ['Overview','Applicability','Executive Summary','Clause Generation','Evidence'].map(function(s,i) {
//           return '<button class="dr-step-btn' + (i===0?' active':'') + '" data-step="' + i + '">' +
//             '<span class="dr-step-num">' + (i+1) + '</span>' +
//             '<span class="dr-step-label">' + s + '</span>' +
//             '</button>' + (i<4?'<div class="dr-step-line"></div>':'');
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
//   var fns = [_drPanelOverview, _drPanelApplicability, _drPanelSummary, _drPanelClauses, _drPanelEvidence];
//   panel.innerHTML = fns[step] ? fns[step](flow, circId) : '';
//   _drBindPanel(step, flow, circId);
// }

// /* ================================================================ PANEL 0 — OVERVIEW */
// function _drPanelOverview(flow) {
//   var c = flow.overview;
//   if (!c) return _drNotSaved('Overview');
//   var fields = [
//     ['Circular ID',c.id],['Regulator',c.regulator||'\u2014'],
//     ['Issue Date',c.issueDate||c.date||'\u2014'],['Effective Date',c.effectiveDate||'\u2014'],
//     ['Risk Level',c.risk||'\u2014'],['Status',c.status||'\u2014'],
//     ['Department',c.department||'\u2014'],['Deadline',c.deadline||'\u2014'],
//   ];
//   var riskCls = c.risk ? ' dr-chip-risk-' + c.risk.toLowerCase() : '';
//   return (
//     '<div class="dr-panel">' +
//     '<div class="dr-panel-toolbar">' +
//       '<div class="dr-panel-title-wrap"><span class="dr-panel-icon">&#x1F3E2;</span><span class="dr-panel-title">Circular Overview</span></div>' +
//       '<div class="dr-toolbar-actions">' +
//         '<label class="dr-tool-btn"><input type="file" style="display:none;" accept=".pdf,.docx"/>&#x1F4C1; Upload Doc</label>' +
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
//   return (
//     '<div class="dr-panel">' +
//     '<div class="dr-panel-toolbar">' +
//       '<div class="dr-panel-title-wrap"><span class="dr-panel-icon">&#x2736;</span><span class="dr-panel-title">Applicability Analysis</span></div>' +
//       '<div class="dr-toolbar-actions"><button class="dr-tool-btn dr-tool-edit-toggle" data-target="dr-app-edit" data-hide="dr-app-details">&#x270E; Edit</button></div>' +
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
//         '<div class="dr-edit-field dr-edit-field-full"><label class="dr-edit-label">Applicability Notes</label><textarea class="dr-edit-ta">'+a.notes+'</textarea></div>' +
//         '<div class="dr-edit-field dr-edit-field-full"><label class="dr-edit-label">Threshold / Criteria</label><textarea class="dr-edit-ta">'+a.threshold+'</textarea></div>' +
//       '</div>' +
//       '<div class="dr-edit-foot">' +
//         '<button class="dr-btn dr-btn-ghost" data-close="dr-app-edit" data-show="dr-app-details">&#x2715; Cancel</button>' +
//         '<button class="dr-btn dr-btn-pri dr-btn-sm" onclick="showToast(\'Saved.\',\'success\');document.getElementById(\'dr-app-edit\').style.display=\'none\';document.getElementById(\'dr-app-details\').style.display=\'block\';">&#x2713; Save</button>' +
//       '</div>' +
//     '</div>' +
//     '<div id="dr-app-details">' +
//       '<div class="dr-block-pad"><div class="dr-info-block dr-info-block-amber"><div class="dr-ib-label">Applicability Threshold &amp; Criteria</div><div class="dr-ib-text">' + a.threshold + '</div></div></div>' +
//       '<div class="dr-block-pad">' +
//         '<div class="dr-section-label">Key Requirements</div>' +
//         '<div class="dr-req-list">' +
//           (a.requirements||[]).map(function(r,i){return '<div class="dr-req-item"><span class="dr-req-num">'+(i+1)+'</span><span class="dr-req-text">'+r+'</span></div>';}).join('') +
//         '</div>' +
//       '</div>' +
//       '<div class="dr-block-pad">' +
//         '<div class="dr-section-label">Applicable Entities</div>' +
//         '<table class="dr-table"><thead><tr><th>Entity</th><th>Type</th><th>Applicable</th></tr></thead><tbody>' +
//           (a.entities||[]).map(function(e){return '<tr><td>'+e.name+'</td><td><span class="dr-chip dr-chip-sm">'+e.type+'</span></td><td><span class="dr-app-pill '+(e.applicable?'dr-app-yes':'dr-app-no')+'">'+(e.applicable?'&#x2713; Yes':'&#x2717; No')+'</span></td></tr>';}).join('') +
//         '</tbody></table>' +
//       '</div>' +
//       '<div class="dr-block-pad"><div class="dr-info-block"><div class="dr-ib-label">Notes</div><div class="dr-ib-text">' + a.notes + '</div></div></div>' +
//     '</div>' +
//     '<div class="dr-panel-foot"><span></span><button class="dr-btn dr-btn-next" onclick="_drGoNext(1)">Executive Summary &#x2192;</button></div>' +
//     '</div>'
//   );
// }

// /* ================================================================ PANEL 2 — EXECUTIVE SUMMARY */
// function _drPanelSummary(flow) {
//   var s = flow.summary;
//   if (!s) return _drNotSaved('Executive Summary');

//   function accSection(id, icon, label, badge, html) {
//     return (
//       '<div class="dr-acc-item" id="dr-acc-' + id + '">' +
//         '<button class="dr-acc-trigger" data-acc="' + id + '">' +
//           '<span class="dr-acc-icon">' + icon + '</span>' +
//           '<span class="dr-acc-label">' + label + '</span>' +
//           (badge ? '<span class="dr-acc-badge">' + badge + '</span>' : '') +
//           '<span class="dr-acc-arrow">&#9660;</span>' +
//         '</button>' +
//         '<div class="dr-acc-body" id="dr-acc-body-' + id + '" style="display:none;">' +
//           '<div class="dr-acc-rows" id="dr-acc-rows-' + id + '">' + html + '</div>' +
//           '<div class="dr-acc-foot"><button class="dr-add-row-btn" data-acc-id="' + id + '">+ Add Item</button></div>' +
//         '</div>' +
//       '</div>'
//     );
//   }

//   function numRow(text) { return '<div class="dr-sum-row"><span class="dr-sum-num-icon"></span><span class="dr-sum-item" contenteditable="true">' + text + '</span><button class="dr-row-del" onclick="this.closest(\'.dr-sum-row\').remove()">&#x2715;</button></div>'; }
//   function dotRow(text, cls) { return '<div class="dr-sum-row"><span class="dr-sum-dot' + (cls?' '+cls:'') + '"></span><span class="dr-sum-item" contenteditable="true">' + text + '</span><button class="dr-row-del" onclick="this.closest(\'.dr-sum-row\').remove()">&#x2715;</button></div>'; }
//   function riskRow(r) { return '<div class="dr-sum-row"><span class="dr-risk-pill dr-risk-' + r.level.toLowerCase() + '">' + r.level + '</span><span class="dr-sum-item" contenteditable="true">' + r.text + '</span><button class="dr-row-del" onclick="this.closest(\'.dr-sum-row\').remove()">&#x2715;</button></div>'; }

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
//       accSection('key-updates','&#x1F504;','Key Updates', s.keyUpdates.length + ' updates', s.keyUpdates.map(numRow).join('')) +
//       accSection('risks','&#x1F6A8;','Compliance Risks', s.risks.length + ' risks', s.risks.map(riskRow).join('')) +
//       accSection('immediate-actions','&#x26A1;','Immediate Actions', s.immediateActions.length + ' actions', s.immediateActions.map(dotRow).join('')) +
//       accSection('org-impact','&#x1F3E2;','Organisational Impact', '', orgHtml) +
//       accSection('technical','&#x2699;&#xFE0F;','Technical Changes', s.technical.length + ' items', s.technical.map(function(t){return dotRow(t,'dr-sum-dot-tech');}).join('')) +
//     '</div>' +
//     '<div class="dr-panel-foot"><span></span><button class="dr-btn dr-btn-next" onclick="_drGoNext(2)">Clause Generation &#x2192;</button></div>' +
//     '</div>'
//   );
// }

// /* ================================================================ PANEL 3 — CLAUSES */
// function _drPanelClauses(flow, circId) {
//   var chapters = flow.clauses || [];
//   if (!chapters.length) return _drNotSaved('Clause Generation');
//   return (
//     '<div class="dr-panel dr-panel-clauses">' +
//     '<div class="dr-panel-toolbar">' +
//       '<div class="dr-panel-title-wrap"><span class="dr-panel-icon">&#x1F4CB;</span><span class="dr-panel-title">Clause Generation</span></div>' +
//       '<div class="dr-toolbar-actions"><button class="dr-tool-btn dr-tool-btn-pri" id="dr-cl-add-ch-btn">+ Add Chapter</button></div>' +
//     '</div>' +
//     '<div class="dr-chapters-wrap" id="dr-chapters-wrap">' +
//       chapters.map(function(ch,ci){return _drBuildChapter(ch,ci,circId);}).join('') +
//     '</div>' +
//     '<div class="dr-panel-foot">' +
//       '<button class="dr-btn dr-btn-sec" onclick="showToast(\'Clauses saved to draft.\',\'success\')">&#x1F4BE; Save Clauses</button>' +
//       '<button class="dr-btn dr-btn-next" onclick="_drGoNext(3)">Evidence &#x2192;</button>' +
//     '</div>' +
//     '</div>'
//   );
// }

// function _drBuildChapter(ch, ci, circId) {
//   var clauses = ch.clauses || [];
//   return (
//     '<div class="dr-chapter" id="dr-chapter-' + ci + '">' +
//     '<div class="dr-chapter-head">' +
//       '<button class="dr-chapter-toggle" data-ci="' + ci + '">' +
//         '<span class="dr-ch-arrow">&#x25B6;</span>' +
//         '<span class="dr-ch-title">' + (ch.title||'Chapter '+(ci+1)) + '</span>' +
//         '<span class="dr-ch-count">' + clauses.length + ' clause' + (clauses.length!==1?'s':'') + '</span>' +
//       '</button>' +
//       '<div class="dr-chapter-actions">' +
//         '<label class="dr-tool-btn dr-tool-btn-sm" title="Upload Excel">' +
//           '<input type="file" accept=".xlsx,.xls,.csv" style="display:none;" onchange="showToast(\'Excel mapped to Chapter ' + (ci+1) + '.\',\'success\')"/>' +
//           '&#x1F4CA; Excel' +
//         '</label>' +
//         '<button class="dr-tool-btn dr-tool-btn-sm" onclick="_drAddClause(' + ci + ',\'' + (circId||'') + '\')">+ Clause</button>' +
//       '</div>' +
//     '</div>' +
//     '<div class="dr-chapter-body" id="dr-chapter-body-' + ci + '" style="display:none;">' +
//       '<div class="dr-clauses-list" id="dr-clauses-list-' + ci + '">' +
//         clauses.map(function(cl,cli){return _drBuildClause(cl,ci,cli,circId);}).join('') +
//       '</div>' +
//     '</div>' +
//     '</div>'
//   );
// }

// function _drBuildClause(cl, ci, cli, circId) {
//   var actions = (cl.actionable||'').split(';').map(function(a){return a.trim();}).filter(Boolean);
//   var rCls = {High:'dr-chip-risk-high',Medium:'dr-chip-risk-medium',Low:'dr-chip-risk-low'}[cl.risk]||'';
//   var ck   = ci + '-' + cli;
//   var mapKey = (circId||'') + ':' + cl.id;
//   var mappedClauses = window._mappedClauses[mapKey] || [];
//   var mappedRefsHtml = mappedClauses.length
//     ? '<div class="dr-mapped-refs" id="dr-mapped-refs-' + ck + '">' +
//         '<span class="dr-mapped-label">Mapped to:</span>' +
//         mappedClauses.map(function(m){return '<span class="dr-mapped-chip" title="'+m.clauseText+'">'+m.circId+' &middot; '+m.clauseId+'</span>';}).join('') +
//       '</div>'
//     : '<div class="dr-mapped-refs" id="dr-mapped-refs-' + ck + '" style="display:none;"></div>';

//   var actRows = actions.map(function(a,ai){
//     return '<div class="dr-action-row">' +
//       '<span class="dr-action-num">'+(ai+1)+'</span>' +
//       '<span class="dr-action-txt dr-editable" contenteditable="true">'+a+'</span>' +
//       '<button class="dr-row-del" onclick="this.closest(\'.dr-action-row\').remove()">&#x2715;</button>' +
//     '</div>';
//   }).join('');

//   return (
//     '<div class="dr-clause-item" id="dr-clause-' + ck + '">' +
//     '<div class="dr-clause-head">' +
//       '<span class="dr-clause-id">' + cl.id + '</span>' +
//       '<span class="dr-clause-preview">' + cl.text + '</span>' +
//       '<div class="dr-clause-head-right">' +
//         (cl.risk ? '<span class="dr-chip dr-chip-sm ' + rCls + '">' + cl.risk + '</span>' : '') +
//         '<button class="dr-map-btn" onclick="_drOpenMapModal(\'' + (circId||'') + '\',\'' + cl.id + '\',\'' + ck + '\',\'clause\')" title="Map to other circulars">&#x21C4; Map</button>' +
//         '<button class="dr-clause-toggle-btn" data-ck="' + ck + '">&#x25B6;</button>' +
//       '</div>' +
//     '</div>' +
//     mappedRefsHtml +
//     '<div class="dr-clause-body" id="dr-clause-body-' + ck + '" style="display:none;">' +
//       '<div class="dr-clause-controls">' +
//         '<div class="dr-ctrl-group"><span class="dr-ctrl-label">Dept</span>' +
//           '<select class="dr-ctrl-select">' +
//             ['Compliance','Risk','Legal','IT','Operations','HR','Finance'].map(function(d){return '<option'+(d===cl.department?' selected':'')+'>'+d+'</option>';}).join('') +
//           '</select>' +
//         '</div>' +
//         '<div class="dr-ctrl-group"><span class="dr-ctrl-label">Status</span>' +
//           '<select class="dr-ctrl-select">' +
//             ['Pending','In Progress','Compliant'].map(function(s){return '<option'+(s===cl.status?' selected':'')+'>'+s+'</option>';}).join('') +
//           '</select>' +
//         '</div>' +
//         '<div class="dr-tags-ctrl">' +
//           '<span class="dr-ctrl-label">Tags</span>' +
//           '<div class="dr-tags-list" id="dr-tlist-' + ck + '">' +
//             (cl.tags||[]).map(function(t){return '<span class="dr-ctag">'+t+'<button onclick="this.parentElement.remove()">&#xD7;</button></span>';}).join('') +
//           '</div>' +
//           '<input class="dr-tag-input" id="dr-tinput-' + ck + '" placeholder="Tag\u2026" onkeydown="if(event.key===\'Enter\'||event.key===\',\'){_drAddTag(\'' + ck + '\');event.preventDefault();}"/>' +
//           '<button class="dr-tag-add-btn" onclick="_drAddTag(\'' + ck + '\')">+</button>' +
//         '</div>' +
//       '</div>' +
//       '<div class="dr-nested-block"><div class="dr-nb-label">Clause Text</div><div class="dr-nb-content dr-editable" contenteditable="true">' + cl.text + '</div></div>' +
//       '<div class="dr-nested-block" id="dr-oblig-wrap-' + ck + '">' +
//         '<div class="dr-nb-label-row">' +
//           '<span class="dr-nb-label">Obligation</span>' +
//           '<button class="dr-add-sub-btn" onclick="_drAddObligation(\'' + ck + '\',\'' + (circId||'') + '\',\'' + cl.id + '\')">+ Add Obligation</button>' +
//         '</div>' +
//         (cl.obligation
//           ? '<div class="dr-oblig-item" id="dr-oblig-0-' + ck + '">' +
//               '<div class="dr-oblig-head">' +
//                 '<span class="dr-oblig-badge">O1</span>' +
//                 '<div class="dr-nb-content dr-editable" contenteditable="true" style="flex:1;">' + cl.obligation + '</div>' +
//                 '<button class="dr-map-btn" onclick="_drOpenMapModal(\'' + (circId||'') + '\',\'' + cl.id + '\',\'' + ck + '\',\'obligation\',0)">&#x21C4; Map</button>' +
//                 '<button class="dr-row-del" onclick="this.closest(\'.dr-oblig-item\').remove()">&#x2715;</button>' +
//               '</div>' +
//               '<div class="dr-actions-wrap" id="dr-actions-wrap-0-' + ck + '">' +
//                 '<div class="dr-nb-label-row" style="margin-top:10px;">' +
//                   '<span class="dr-nb-label" style="font-size:9px;">Actions</span>' +
//                   '<button class="dr-add-sub-btn" style="font-size:9px;" onclick="_drAddAction(\'0\',\'' + ck + '\')">+ Action</button>' +
//                 '</div>' +
//                 '<div class="dr-actions-list" id="dr-alist-0-' + ck + '">' + actRows + '</div>' +
//               '</div>' +
//             '</div>'
//           : '<div class="dr-empty-hint" id="dr-no-oblig-' + ck + '">No obligation \u2014 click + Add Obligation</div>'
//         ) +
//       '</div>' +
//     '</div>' +
//     '</div>'
//   );
// }

// /* ================================================================ PANEL 4 — EVIDENCE */
// function _drPanelEvidence(flow) {
//   var evs = flow.evidence || [];
//   if (!evs.length) return _drNotSaved('Evidence');
//   var sc = {Pending:'#b45309','In Progress':'#2563eb',Completed:'#15803d'};
//   return (
//     '<div class="dr-panel">' +
//     '<div class="dr-panel-toolbar">' +
//       '<div class="dr-panel-title-wrap"><span class="dr-panel-icon">&#x1F50D;</span><span class="dr-panel-title">Evidence Evaluation</span></div>' +
//       '<div class="dr-toolbar-actions"><button class="dr-tool-btn dr-tool-btn-pri" onclick="_drAddEvidence()">+ Add Evidence</button></div>' +
//     '</div>' +
//     '<div class="dr-ev-list" id="dr-ev-list">' +
//       evs.map(function(ev,i){
//         var col = sc[ev.status]||'#4a5068';
//         return (
//           '<div class="dr-ev-item" id="dr-ev-' + i + '">' +
//           '<div class="dr-ev-head">' +
//             '<span class="dr-ev-id">' + ev.id + '</span>' +
//             '<div class="dr-ev-center">' +
//               '<span class="dr-ev-name">' + ev.name + '</span>' +
//               '<span class="dr-ev-meta"><span class="dr-chip dr-chip-sm dr-chip-blue">' + ev.type + '</span> &middot; ' + ev.source + '</span>' +
//             '</div>' +
//             '<span class="dr-ev-status-dot" style="color:' + col + ';">&#x25CF; ' + ev.status + '</span>' +
//             '<div class="dr-ev-actions">' +
//               '<label class="dr-tool-btn dr-tool-btn-sm"><input type="file" style="display:none;"/>&#x1F4C1;</label>' +
//               '<button class="dr-tool-btn dr-tool-btn-sm" onclick="_drToggleEvEdit(' + i + ')">&#x270E;</button>' +
//               '<button class="dr-row-del" style="padding:4px 8px;" onclick="document.getElementById(\'dr-ev-' + i + '\').remove()">&#x2715;</button>' +
//             '</div>' +
//           '</div>' +
//           '<div class="dr-ev-desc-row">' +
//             '<span class="dr-ev-clause-chip">Clause ' + ev.clauseId + '</span>' +
//             '<span class="dr-ev-desc">' + ev.desc + '</span>' +
//           '</div>' +
//           '<div class="dr-edit-drawer" id="dr-ev-edit-' + i + '" style="display:none;">' +
//             '<div class="dr-edit-grid">' +
//               [['Name',ev.name],['Type',ev.type],['Source',ev.source],['Clause Ref',ev.clauseId]].map(function(f){
//                 return '<div class="dr-edit-field"><label class="dr-edit-label">'+f[0]+'</label><input class="dr-edit-input" value="'+f[1]+'"/></div>';
//               }).join('') +
//               '<div class="dr-edit-field"><label class="dr-edit-label">Status</label>' +
//               '<select class="dr-edit-input">' + ['Pending','In Progress','Completed'].map(function(s){return '<option'+(s===ev.status?' selected':'')+'>'+s+'</option>';}).join('') + '</select></div>' +
//               '<div class="dr-edit-field dr-edit-field-full"><label class="dr-edit-label">Description</label><textarea class="dr-edit-ta">' + ev.desc + '</textarea></div>' +
//             '</div>' +
//             '<div class="dr-edit-foot">' +
//               '<button class="dr-btn dr-btn-ghost" onclick="document.getElementById(\'dr-ev-edit-' + i + '\').style.display=\'none\'">&#x2715;</button>' +
//               '<button class="dr-btn dr-btn-pri dr-btn-sm" onclick="document.getElementById(\'dr-ev-edit-' + i + '\').style.display=\'none\';showToast(\'Saved.\',\'success\')">&#x2713; Save</button>' +
//             '</div>' +
//           '</div>' +
//           '</div>'
//         );
//       }).join('') +
//     '</div>' +
//     '<div class="dr-panel-foot"><span></span><button class="dr-btn dr-btn-pri" onclick="publishToLibrary()">&#x1F4DA; Submit &amp; Publish to Library</button></div>' +
//     '</div>'
//   );
// }

// /* ================================================================ MAP MODAL */
// window._drOpenMapModal = function(circId, clauseId, ck, type, oi) {
//   var otherCircs = (CMS_DATA && CMS_DATA.circulars || []).filter(function(c){return c.id !== circId;});
//   var allRows = [];
//   otherCircs.forEach(function(c) {
//     (c.chapters||[]).forEach(function(ch){
//       (ch.clauses||[]).forEach(function(cl){
//         allRows.push({ circId:c.id, circTitle:c.title, regulator:c.regulator||'', chTitle:ch.title||'', clauseId:cl.id, clauseText:cl.text||'', obligation:cl.obligation||'' });
//       });
//     });
//   });

//   var currentFlow = window._savedFlow[circId];
//   var currentClause = null;
//   if (currentFlow) {
//     (currentFlow.clauses||[]).forEach(function(ch){
//       (ch.clauses||[]).forEach(function(cl){ if(cl.id===clauseId) currentClause=cl; });
//     });
//   }

//   var mapKey   = type === 'clause' ? circId+':'+clauseId : circId+':'+clauseId+':'+oi;
//   var existing = type === 'clause' ? (window._mappedClauses[mapKey]||[]) : (window._mappedObligs[mapKey]||[]);

//   var overlay = document.createElement('div');
//   overlay.className = 'dr-modal-overlay';
//   overlay.id        = 'dr-map-modal';

//   var rowsHtml = allRows.map(function(r,i){
//     var already = existing.some(function(e){return e.clauseId===r.clauseId&&e.circId===r.circId;});
//     var rowData = JSON.stringify({circId:r.circId,circTitle:r.circTitle,clauseId:r.clauseId,clauseText:r.clauseText}).replace(/"/g,'&quot;');
//     var displayText = (type==='obligation'?r.obligation:r.clauseText);
//     return (
//       '<tr class="dr-map-row' + (already?' dr-map-row-mapped':'') + '" data-search="' + r.circId + ' ' + r.clauseId + ' ' + r.clauseText.substring(0,60) + ' ' + r.circTitle + '">' +
//         '<td><button class="dr-map-row-btn' + (already?' mapped':'') + '" data-row="' + rowData + '" data-mapkey="' + mapKey + '" data-ck="' + ck + '" data-type="' + type + '">' + (already?'&#x2713; Mapped':'Map') + '</button></td>' +
//         '<td><span class="dr-map-cid">' + r.clauseId + '</span></td>' +
//         '<td><div class="dr-map-circ-id">' + r.circId + '</div><div class="dr-map-circ-title">' + r.circTitle.substring(0,40) + (r.circTitle.length>40?'\u2026':'') + '</div></td>' +
//         '<td class="dr-map-ch">' + r.chTitle.substring(0,28) + (r.chTitle.length>28?'\u2026':'') + '</td>' +
//         '<td class="dr-map-text">' + displayText.substring(0,80) + (displayText.length>80?'\u2026':'') + '</td>' +
//       '</tr>'
//     );
//   }).join('');

//   overlay.innerHTML = (
//     '<div class="dr-modal">' +
//     '<div class="dr-modal-head">' +
//       '<div class="dr-modal-head-left">' +
//         '<div class="dr-modal-eyebrow">' + (type==='clause'?'Map Clause':'Map Obligation') + '</div>' +
//         '<div class="dr-modal-subject">' + clauseId + ' \u2014 ' + (currentClause?(currentClause.text||'').substring(0,80)+(currentClause.text&&currentClause.text.length>80?'\u2026':''):'') + '</div>' +
//         (type==='obligation'&&currentClause&&currentClause.obligation?'<div class="dr-modal-oblig-ref">Obligation: '+currentClause.obligation.substring(0,80)+'\u2026</div>':'') +
//       '</div>' +
//       '<button class="dr-modal-close" onclick="document.getElementById(\'dr-map-modal\').remove()">&#x2715;</button>' +
//     '</div>' +
//     (existing.length?'<div class="dr-modal-mapped-bar"><span class="dr-modal-mapped-label">Currently mapped ('+existing.length+')</span>'+existing.map(function(m){return '<span class="dr-mapped-chip dr-mapped-chip-sm">'+m.circId+' &middot; '+m.clauseId+'</span>';}).join('')+'</div>':'') +
//     '<div class="dr-modal-search-bar"><input class="dr-modal-search" id="dr-map-search" placeholder="Search clauses by ID, text, circular\u2026" autocomplete="off"/></div>' +
//     '<div class="dr-modal-body">' +
//       '<table class="dr-map-table" id="dr-map-table">' +
//         '<thead><tr><th></th><th>Clause</th><th>Circular</th><th>Chapter</th><th>' + (type==='obligation'?'Obligation':'Text') + '</th></tr></thead>' +
//         '<tbody>' + rowsHtml + '</tbody>' +
//       '</table>' +
//     '</div>' +
//     '<div class="dr-modal-foot">' +
//       '<span class="dr-modal-foot-note">Mapped clauses show as cross-references. Completing one can mark the other complete.</span>' +
//       '<button class="dr-btn dr-btn-pri" onclick="document.getElementById(\'dr-map-modal\').remove();showToast(\'Mappings saved.\',\'success\')">Done</button>' +
//     '</div>' +
//     '</div>'
//   );

//   document.body.appendChild(overlay);

//   overlay.addEventListener('click', function(e){ if(e.target===overlay) overlay.remove(); });

//   document.getElementById('dr-map-search').addEventListener('input', function(){
//     var q = this.value.toLowerCase();
//     document.querySelectorAll('.dr-map-row').forEach(function(row){
//       row.style.display = row.dataset.search.toLowerCase().includes(q) ? '' : 'none';
//     });
//   });

//   overlay.querySelectorAll('.dr-map-row-btn').forEach(function(btn){
//     btn.addEventListener('click', function(){
//       var mk   = btn.dataset.mapkey;
//       var bck  = btn.dataset.ck;
//       var btype= btn.dataset.type;
//       var store= btype==='clause' ? window._mappedClauses : window._mappedObligs;
//       store[mk] = store[mk]||[];
//       var rowData;
//       try { rowData = JSON.parse(btn.dataset.row.replace(/&quot;/g,'"')); } catch(e){ return; }
//       var idx = store[mk].findIndex(function(x){return x.clauseId===rowData.clauseId&&x.circId===rowData.circId;});
//       if (idx>=0) {
//         store[mk].splice(idx,1);
//         btn.innerHTML = 'Map';
//         btn.classList.remove('mapped');
//         btn.closest('tr').classList.remove('dr-map-row-mapped');
//       } else {
//         store[mk].push(rowData);
//         btn.innerHTML = '&#x2713; Mapped';
//         btn.classList.add('mapped');
//         btn.closest('tr').classList.add('dr-map-row-mapped');
//       }
//       _drRefreshMappedRefs(bck, mk, btype);
//     });
//   });
// };

// window._drRefreshMappedRefs = function(ck, mapKey, type) {
//   var el    = document.getElementById('dr-mapped-refs-' + ck);
//   if (!el) return;
//   var store = type==='clause' ? window._mappedClauses : window._mappedObligs;
//   var items = store[mapKey]||[];
//   if (!items.length) { el.style.display='none'; el.innerHTML=''; return; }
//   el.style.display='flex';
//   el.innerHTML = '<span class="dr-mapped-label">Mapped to:</span>' +
//     items.map(function(m){return '<span class="dr-mapped-chip" title="'+m.clauseText+'">'+m.circId+' &middot; '+m.clauseId+'</span>';}).join('');
// };

// /* ================================================================ BIND PANEL */
// function _drBindPanel(step, flow, circId) {
//   /* edit toggles */
//   document.querySelectorAll('.dr-tool-edit-toggle').forEach(function(btn){
//     btn.addEventListener('click', function(){
//       var drawer  = document.getElementById(btn.dataset.target);
//       var details = btn.dataset.hide ? document.getElementById(btn.dataset.hide) : null;
//       if (!drawer) return;
//       var opening = drawer.style.display==='none';
//       drawer.style.display = opening ? 'block' : 'none';
//       if (details) details.style.display = opening ? 'none' : 'block';
//     });
//   });

//   /* close/cancel buttons */
//   document.querySelectorAll('[data-close]').forEach(function(btn){
//     btn.addEventListener('click', function(){
//       var drawer = document.getElementById(btn.dataset.close);
//       var show   = btn.dataset.show ? document.getElementById(btn.dataset.show) : null;
//       if (drawer) drawer.style.display='none';
//       if (show)   show.style.display='block';
//     });
//   });

//   /* accordion triggers */
//   document.querySelectorAll('.dr-acc-trigger').forEach(function(btn){
//     btn.addEventListener('click', function(){
//       var id   = btn.dataset.acc;
//       var body = document.getElementById('dr-acc-body-'+id);
//       var arr  = btn.querySelector('.dr-acc-arrow');
//       if (!body) return;
//       var open = body.style.display !== 'none';
//       body.style.display = open ? 'none' : 'block';
//       if (arr) arr.style.transform = open ? '' : 'rotate(180deg)';
//     });
//   });

//   /* add row buttons */
//   document.querySelectorAll('.dr-add-row-btn').forEach(function(btn){
//     btn.addEventListener('click', function(){
//       var rows = document.getElementById('dr-acc-rows-'+btn.dataset.accId);
//       if (!rows) return;
//       var div = document.createElement('div');
//       div.className = 'dr-sum-row';
//       div.innerHTML = '<span class="dr-sum-dot"></span><span class="dr-sum-item dr-editable" contenteditable="true" style="outline:1.5px dashed #bfdbfe;border-radius:3px;padding:1px 5px;">New item\u2026</span><button class="dr-row-del" onclick="this.closest(\'.dr-sum-row\').remove()">&#x2715;</button>';
//       rows.appendChild(div);
//       var ed = div.querySelector('[contenteditable]');
//       if (ed) ed.focus();
//     });
//   });

//   /* chapter toggles */
//   document.querySelectorAll('.dr-chapter-toggle').forEach(function(btn){
//     btn.addEventListener('click', function(){
//       var ci   = btn.dataset.ci;
//       var body = document.getElementById('dr-chapter-body-'+ci);
//       var arr  = btn.querySelector('.dr-ch-arrow');
//       if (!body) return;
//       var open = body.style.display!=='none';
//       body.style.display = open ? 'none' : 'block';
//       if (arr) arr.textContent = open ? '\u25B6' : '\u25BC';
//     });
//   });

//   /* clause toggles */
//   document.querySelectorAll('.dr-clause-toggle-btn').forEach(function(btn){
//     btn.addEventListener('click', function(){
//       var ck   = btn.dataset.ck;
//       var body = document.getElementById('dr-clause-body-'+ck);
//       if (!body) return;
//       var open = body.style.display!=='none';
//       body.style.display = open ? 'none' : 'block';
//       btn.textContent = open ? '\u25B6' : '\u25BC';
//     });
//   });

//   /* add chapter */
//   var addChBtn = document.getElementById('dr-cl-add-ch-btn');
//   if (addChBtn) addChBtn.addEventListener('click', function(){
//     var wrap = document.getElementById('dr-chapters-wrap');
//     if (!wrap) return;
//     var ci = wrap.querySelectorAll('.dr-chapter').length;
//     var div = document.createElement('div');
//     div.innerHTML = _drBuildChapter({title:'New Chapter '+(ci+1),clauses:[]}, ci, circId);
//     wrap.appendChild(div.firstElementChild);
//     var newBtn = wrap.querySelector('[data-ci="'+ci+'"]');
//     if (newBtn) newBtn.addEventListener('click', function(){
//       var body = document.getElementById('dr-chapter-body-'+ci);
//       var arr  = newBtn.querySelector('.dr-ch-arrow');
//       if (!body) return;
//       var open = body.style.display!=='none';
//       body.style.display = open ? 'none' : 'block';
//       if (arr) arr.textContent = open ? '\u25B6' : '\u25BC';
//     });
//     showToast('Chapter added.','success');
//   });
// }

// /* ================================================================ HELPERS */
// window._drAddClause = function(ci, circId) {
//   var list = document.getElementById('dr-clauses-list-'+ci);
//   if (!list) return;
//   var cli = list.querySelectorAll('.dr-clause-item').length;
//   var div = document.createElement('div');
//   div.innerHTML = _drBuildClause({id:(ci+1)+'.'+(cli+1),text:'New clause\u2026',risk:'Low',department:'Compliance',status:'Pending',obligation:'',actionable:''},ci,cli,circId||'');
//   list.appendChild(div.firstElementChild);
//   var ck = ci+'-'+cli;
//   var toggle = list.querySelector('[data-ck="'+ck+'"]');
//   if (toggle) toggle.addEventListener('click', function(){
//     var body = document.getElementById('dr-clause-body-'+ck);
//     if (!body) return;
//     var open = body.style.display!=='none';
//     body.style.display = open ? 'none' : 'block';
//     toggle.textContent = open ? '\u25B6' : '\u25BC';
//   });
//   showToast('Clause added.','success');
// };

// window._drAddObligation = function(ck, circId, clauseId) {
//   var wrap = document.getElementById('dr-oblig-wrap-'+ck);
//   var noOb = document.getElementById('dr-no-oblig-'+ck);
//   if (noOb) noOb.remove();
//   if (!wrap) return;
//   var oi  = wrap.querySelectorAll('.dr-oblig-item').length;
//   var div = document.createElement('div');
//   div.className = 'dr-oblig-item';
//   div.id        = 'dr-oblig-'+oi+'-'+ck;
//   div.innerHTML =
//     '<div class="dr-oblig-head">' +
//       '<span class="dr-oblig-badge">O'+(oi+1)+'</span>' +
//       '<div class="dr-nb-content dr-editable" contenteditable="true" style="flex:1;outline:1.5px dashed #bfdbfe;border-radius:4px;padding:2px 6px;">New obligation\u2026</div>' +
//       '<button class="dr-map-btn" onclick="_drOpenMapModal(\''+(circId||'')+'\',\''+(clauseId||'')+'\',\''+ck+'\',\'obligation\','+oi+')">&#x21C4; Map</button>' +
//       '<button class="dr-row-del" onclick="this.closest(\'.dr-oblig-item\').remove()">&#x2715;</button>' +
//     '</div>' +
//     '<div class="dr-actions-wrap" id="dr-actions-wrap-'+oi+'-'+ck+'">' +
//       '<div class="dr-nb-label-row" style="margin-top:10px;">' +
//         '<span class="dr-nb-label" style="font-size:9px;">Actions</span>' +
//         '<button class="dr-add-sub-btn" style="font-size:9px;" onclick="_drAddAction(\''+oi+'\',\''+ck+'\')">+ Action</button>' +
//       '</div>' +
//       '<div class="dr-actions-list" id="dr-alist-'+oi+'-'+ck+'"></div>' +
//     '</div>';
//   wrap.appendChild(div);
//   var ed = div.querySelector('[contenteditable]');
//   if (ed) ed.focus();
// };

// window._drAddAction = function(oi, ck) {
//   var list = document.getElementById('dr-alist-'+oi+'-'+ck);
//   if (!list) return;
//   var ai  = list.querySelectorAll('.dr-action-row').length;
//   var div = document.createElement('div');
//   div.className = 'dr-action-row';
//   div.innerHTML = '<span class="dr-action-num">'+(ai+1)+'</span><span class="dr-action-txt dr-editable" contenteditable="true" style="outline:1.5px dashed #bfdbfe;border-radius:3px;padding:1px 4px;">New action\u2026</span><button class="dr-row-del" onclick="this.closest(\'.dr-action-row\').remove()">&#x2715;</button>';
//   list.appendChild(div);
//   var ed = div.querySelector('[contenteditable]');
//   if (ed) ed.focus();
// };

// window._drAddTag = function(ck) {
//   var input = document.getElementById('dr-tinput-'+ck);
//   var list  = document.getElementById('dr-tlist-'+ck);
//   if (!input||!list) return;
//   var val = input.value.trim().replace(/,/g,'');
//   if (!val) return;
//   var span = document.createElement('span');
//   span.className = 'dr-ctag';
//   span.innerHTML = val+'<button onclick="this.parentElement.remove()">&#xD7;</button>';
//   list.appendChild(span);
//   input.value='';
// };

// window._drAddEvidence = function() {
//   var list = document.getElementById('dr-ev-list');
//   if (!list) return;
//   var i   = list.querySelectorAll('.dr-ev-item').length;
//   var div = document.createElement('div');
//   div.className = 'dr-ev-item';
//   div.id = 'dr-ev-'+i;
//   div.innerHTML = '<div class="dr-ev-head"><span class="dr-ev-id">EV-NEW</span><div class="dr-ev-center"><span class="dr-ev-name dr-editable" contenteditable="true">New Evidence Item</span></div><span class="dr-ev-status-dot" style="color:#b45309;">&#x25CF; Pending</span><div class="dr-ev-actions"><button class="dr-row-del" style="padding:4px 8px;" onclick="this.closest(\'.dr-ev-item\').remove()">&#x2715;</button></div></div>';
//   list.appendChild(div);
// };

// window._drToggleEvEdit = function(i) {
//   var d = document.getElementById('dr-ev-edit-'+i);
//   if (d) d.style.display = d.style.display==='none' ? 'block' : 'none';
// };

// window.saveDraftReview = function() {
//   var circId = _drCurrentCircId();
//   if (!circId) { showToast('Select a circular first.','warning'); return; }
//   window._draftStore[circId] = { status:'draft', savedAt:new Date().toISOString() };
//   _drUpdateBadge(circId,'draft');
//   showToast('\uD83D\uDCBE Draft saved.','success');
// };

// window.publishToLibrary = function() {
//   var circId = _drCurrentCircId();
//   if (!circId) { showToast('Select a circular first.','warning'); return; }
//   window._draftStore[circId] = { status:'library', savedAt:new Date().toISOString() };
//   _drUpdateBadge(circId,'library');
//   showToast('\uD83D\uDCDA Published to Central Library.','success');
// };

// function _drCurrentCircId() {
//   var sel = document.querySelector('.dr-csel-item.selected');
//   return sel ? sel.dataset.id : null;
// }

// function _drUpdateBadge(circId, status) {
//   var badge = document.getElementById('dr-status-badge');
//   if (!badge) return;
//   badge.style.display='inline-flex';
//   badge.className = 'dr-status-badge dr-badge-'+(status==='library'?'lib':'draft');
//   badge.textContent = status==='library' ? '\u2713 In Central Library' : '\uD83D\uDCBE Draft Saved';
// }

// function _drNotSaved(label) {
//   return '<div class="dr-not-saved"><div class="dr-ns-icon">&#x1F4ED;</div><div class="dr-ns-title">' + label + ' not saved yet</div><div class="dr-ns-sub">Complete this step in the AI Engine first.</div><button class="dr-btn dr-btn-sec" onclick="window.CMS && window.CMS.navigateTo && window.CMS.navigateTo(\'ai-engine\')">&#x2190; AI Engine</button></div>';
// }

// /* ================================================================ CSS */
// function injectDraftReviewCSS() {
//   if (document.getElementById('dr-css')) return;
//   var s = document.createElement('style');
//   s.id = 'dr-css';
//   s.textContent = `
//   .dr-page{max-width:980px;margin:0 auto;padding-bottom:60px;font-family:'DM Sans',sans-serif;}
//   .dr-page-head{display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:12px;margin-bottom:20px;}
//   .dr-page-title{font-size:20px;font-weight:800;color:#1a1a2e;margin-bottom:3px;}
//   .dr-page-sub{font-size:12px;color:#9499aa;}
//   .dr-head-actions{display:flex;gap:8px;}
//   .dr-btn{display:inline-flex;align-items:center;gap:6px;padding:8px 16px;border-radius:7px;font-family:'DM Sans',sans-serif;font-size:12px;font-weight:700;cursor:pointer;border:none;transition:all .14s;white-space:nowrap;}
//   .dr-btn-pri{background:#1a1a2e;color:#fff;}.dr-btn-pri:hover{background:#2d2d4e;}
//   .dr-btn-sec{background:#f5f6f8;color:#4a5068;border:1.5px solid #dde0e6;}.dr-btn-sec:hover{background:#eef0f3;}
//   .dr-btn-ghost{background:none;color:#9499aa;border:1px solid #dde0e6;padding:5px 12px;font-size:11px;}.dr-btn-ghost:hover{color:#1a1a2e;border-color:#1a1a2e;}
//   .dr-btn-sm{padding:5px 12px;font-size:11px;}
//   .dr-btn-next{background:#1a1a2e;color:#fff;padding:9px 20px;font-size:13px;}.dr-btn-next:hover{background:#2d2d4e;}
//   .dr-picker-card{display:flex;align-items:center;gap:16px;background:#fff;border:1px solid #dde0e6;border-radius:12px;padding:16px 20px;margin-bottom:20px;box-shadow:0 1px 4px rgba(0,0,0,.05);}
//   .dr-picker-icon{font-size:22px;flex-shrink:0;}
//   .dr-picker-inner{flex:1;min-width:0;}
//   .dr-picker-label{font-size:10px;font-weight:700;color:#9499aa;text-transform:uppercase;letter-spacing:.06em;margin-bottom:5px;}
//   .dr-custom-select-wrap{position:relative;}
//   .dr-custom-select-btn{width:100%;display:flex;align-items:center;justify-content:space-between;gap:8px;padding:9px 12px;background:#f5f6f8;border:1.5px solid #dde0e6;border-radius:8px;font-family:'DM Sans',sans-serif;font-size:13px;color:#1a1a2e;cursor:pointer;transition:all .14s;}
//   .dr-custom-select-btn:hover{border-color:#9499aa;background:#fff;}
//   .dr-csel-placeholder{color:#9499aa;}.dr-csel-arrow{color:#9499aa;flex-shrink:0;}
//   .dr-custom-dropdown{position:absolute;top:calc(100% + 5px);left:0;right:0;background:#fff;border:1.5px solid #dde0e6;border-radius:10px;z-index:9999;box-shadow:0 8px 24px rgba(26,26,46,.12);overflow:hidden;}
//   .dr-csel-search-wrap{padding:10px 12px;border-bottom:1px solid #f0f1f4;}
//   .dr-csel-search{width:100%;padding:7px 10px;background:#f5f6f8;border:1px solid #dde0e6;border-radius:6px;font-family:'DM Sans',sans-serif;font-size:12px;color:#1a1a2e;outline:none;box-sizing:border-box;}
//   .dr-csel-list{max-height:220px;overflow-y:auto;}
//   .dr-csel-item{padding:9px 14px;cursor:pointer;border-bottom:1px solid #f5f6f8;transition:background .1s;}
//   .dr-csel-item:last-child{border-bottom:none;}
//   .dr-csel-item:hover,.dr-csel-item.selected{background:#f0f6ff;}
//   .dr-csel-item-top{display:flex;align-items:center;gap:7px;margin-bottom:3px;}
//   .dr-csel-item-id{font-family:'DM Mono',monospace;font-size:11px;font-weight:700;color:#1a1a2e;}
//   .dr-csel-risk{font-size:9px;font-weight:700;padding:1px 6px;border-radius:4px;}
//   .dr-csel-risk-high{background:#fee2e2;color:#b91c1c;}.dr-csel-risk-medium{background:#fef9c3;color:#b45309;}.dr-csel-risk-low{background:#dcfce7;color:#15803d;}
//   .dr-csel-reg{font-size:11px;color:#9499aa;margin-left:auto;}
//   .dr-csel-item-title{font-size:12px;color:#4a5068;line-height:1.4;}
//   .dr-status-badge{font-size:11px;font-weight:700;padding:5px 14px;border-radius:20px;flex-shrink:0;}
//   .dr-badge-draft{background:#fef9c3;color:#b45309;border:1px solid #fcd34d;}
//   .dr-badge-lib{background:#dcfce7;color:#15803d;border:1px solid #86efac;}
//   .dr-stepper{display:flex;align-items:center;background:#fff;border:1px solid #dde0e6;border-radius:10px;padding:10px 16px;margin-bottom:16px;gap:0;}
//   .dr-step-btn{display:inline-flex;align-items:center;gap:7px;padding:7px 14px;background:none;border:none;cursor:pointer;border-radius:7px;font-family:'DM Sans',sans-serif;font-size:12px;font-weight:600;color:#9499aa;transition:all .13s;white-space:nowrap;}
//   .dr-step-btn:hover{background:#f5f6f8;color:#1a1a2e;}.dr-step-btn.active{background:#1a1a2e;color:#fff;}
//   .dr-step-num{width:20px;height:20px;border-radius:50%;background:#eef0f3;color:#4a5068;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:800;flex-shrink:0;}
//   .dr-step-btn.active .dr-step-num{background:rgba(255,255,255,.2);color:#fff;}
//   .dr-step-line{flex:1;height:1px;background:#eef0f3;min-width:12px;}
//   .dr-panel{background:#fff;border:1px solid #dde0e6;border-radius:12px;overflow:hidden;}
//   .dr-panel-toolbar{display:flex;align-items:center;justify-content:space-between;padding:13px 18px;border-bottom:1px solid #eef0f3;background:#fafbfc;}
//   .dr-panel-title-wrap{display:flex;align-items:center;gap:9px;}
//   .dr-panel-icon{font-size:16px;}.dr-panel-title{font-size:13px;font-weight:700;color:#1a1a2e;}
//   .dr-toolbar-actions{display:flex;gap:6px;align-items:center;}
//   .dr-tool-btn{display:inline-flex;align-items:center;gap:5px;padding:5px 12px;background:#fff;border:1.5px solid #dde0e6;border-radius:6px;font-family:'DM Sans',sans-serif;font-size:11px;font-weight:600;color:#4a5068;cursor:pointer;transition:all .13s;white-space:nowrap;}
//   .dr-tool-btn:hover{border-color:#1a1a2e;color:#1a1a2e;}
//   .dr-tool-btn-sm{padding:3px 9px;font-size:10px;}
//   .dr-tool-btn-pri{background:#1a1a2e;color:#fff;border-color:#1a1a2e;}.dr-tool-btn-pri:hover{background:#2d2d4e;}
//   .dr-edit-drawer{background:#f0f6ff;border-top:1px solid #dbeafe;border-bottom:1px solid #dbeafe;padding:16px 20px;}
//   .dr-edit-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
//   .dr-edit-field{display:flex;flex-direction:column;gap:4px;}.dr-edit-field-full{grid-column:1/-1;}
//   .dr-edit-label{font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;}
//   .dr-edit-input{padding:7px 10px;background:#fff;border:1px solid #dde0e6;border-radius:6px;font-family:'DM Sans',sans-serif;font-size:12px;color:#1a1a2e;outline:none;}
//   .dr-edit-input:focus{border-color:#2563eb;}
//   .dr-edit-ta{min-height:72px;padding:8px 10px;background:#fff;border:1px solid #dde0e6;border-radius:6px;font-family:'DM Sans',sans-serif;font-size:12px;color:#1a1a2e;outline:none;resize:vertical;width:100%;box-sizing:border-box;}
//   .dr-edit-foot{display:flex;justify-content:flex-end;align-items:center;gap:8px;margin-top:12px;}
//   .dr-panel-foot{display:flex;align-items:center;justify-content:space-between;padding:12px 18px;border-top:1px solid #eef0f3;background:#fafbfc;}
//   .dr-block-pad{padding:14px 18px;}
//   .dr-info-block{background:#f8f9fc;border:1px solid #eef0f3;border-radius:8px;padding:12px 14px;}
//   .dr-info-block-amber{background:#fffbeb;border-color:#fcd34d;}
//   .dr-ib-label{font-size:10px;font-weight:700;color:#9499aa;text-transform:uppercase;letter-spacing:.05em;margin-bottom:5px;}
//   .dr-ib-text{font-size:12px;color:#4a5068;line-height:1.7;}
//   .dr-section-label{font-size:10px;font-weight:700;color:#9499aa;text-transform:uppercase;letter-spacing:.05em;margin-bottom:8px;}
//   .dr-req-list{display:flex;flex-direction:column;gap:6px;}
//   .dr-req-item{display:flex;align-items:flex-start;gap:9px;padding:8px 12px;background:#f8f9fc;border:1px solid #eef0f3;border-radius:7px;}
//   .dr-req-num{flex-shrink:0;width:20px;height:20px;background:#1a1a2e;color:#fff;border-radius:5px;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;margin-top:1px;}
//   .dr-req-text{font-size:12px;color:#1a1a2e;line-height:1.6;}
//   .dr-ov-hero{display:flex;align-items:flex-start;justify-content:space-between;gap:14px;padding:16px 18px;border-bottom:1px solid #eef0f3;flex-wrap:wrap;}
//   .dr-ov-hero-left{flex:1;min-width:0;}
//   .dr-ov-id{font-family:'DM Mono',monospace;font-size:10px;font-weight:700;color:#9499aa;text-transform:uppercase;letter-spacing:.08em;margin-bottom:4px;}
//   .dr-ov-title{font-size:15px;font-weight:700;color:#1a1a2e;line-height:1.4;margin-bottom:8px;}
//   .dr-ov-chips{display:flex;gap:6px;flex-wrap:wrap;}
//   .dr-deadline-box{padding:10px 16px;background:#fef3c7;border:1.5px solid #fcd34d;border-radius:10px;text-align:center;flex-shrink:0;}
//   .dr-dl-label{font-size:9px;font-weight:700;color:#b45309;text-transform:uppercase;letter-spacing:.06em;margin-bottom:2px;}
//   .dr-dl-date{font-size:13px;font-weight:700;color:#92400e;}
//   .dr-chip{padding:2px 9px;background:#f0f1f4;border:1px solid #dde0e6;border-radius:20px;font-size:11px;font-weight:700;color:#4a5068;}
//   .dr-chip-sm{padding:1px 7px;font-size:10px;}
//   .dr-chip-blue{background:#eff6ff;border-color:#bfdbfe;color:#2563eb;}
//   .dr-chip-status{background:#f3f4f6;color:#52525b;}
//   .dr-chip-risk-high{background:#fee2e2;border-color:#fca5a5;color:#b91c1c;}
//   .dr-chip-risk-medium{background:#fef9c3;border-color:#fcd34d;color:#b45309;}
//   .dr-chip-risk-low{background:#dcfce7;border-color:#86efac;color:#15803d;}
//   .dr-detail-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:#eef0f3;}
//   .dr-detail-cell{background:#fafbfc;padding:9px 14px;}
//   .dr-dc-label{font-size:9px;font-weight:700;color:#9499aa;text-transform:uppercase;letter-spacing:.05em;margin-bottom:2px;}
//   .dr-dc-val{font-size:12px;font-weight:600;color:#1a1a2e;}
//   .dr-tags-row{display:flex;flex-wrap:wrap;gap:6px;padding:12px 18px;}
//   .dr-tag{padding:2px 10px;background:#eff6ff;border:1px solid #bfdbfe;border-radius:20px;font-size:11px;font-weight:600;color:#2563eb;}
//   .dr-verdict-banner{display:flex;align-items:center;gap:14px;margin:16px 18px;padding:14px 16px;border:1px solid;border-radius:10px;flex-wrap:wrap;}
//   .dr-verdict-badge{padding:5px 14px;border-radius:6px;font-size:13px;font-weight:800;flex-shrink:0;}
//   .dr-verdict-info{flex:1;}
//   .dr-verdict-entity{font-size:12px;color:#4a5068;margin-bottom:2px;}
//   .dr-verdict-owner{font-size:11px;color:#9499aa;}
//   .dr-verdict-deadline{text-align:center;flex-shrink:0;}
//   .dr-vd-label{font-size:9px;font-weight:700;color:#9499aa;text-transform:uppercase;margin-bottom:2px;}
//   .dr-vd-date{font-size:14px;font-weight:700;color:#1a1a2e;}
//   .dr-table{width:100%;border-collapse:collapse;font-size:12px;}
//   .dr-table th{text-align:left;padding:7px 12px;background:#f5f6f8;border-bottom:1px solid #dde0e6;font-size:10px;font-weight:700;color:#9499aa;text-transform:uppercase;letter-spacing:.04em;}
//   .dr-table td{padding:8px 12px;border-bottom:1px solid #f5f6f8;color:#4a5068;}
//   .dr-table tr:last-child td{border-bottom:none;}
//   .dr-app-pill{padding:2px 9px;border-radius:20px;font-size:11px;font-weight:700;}
//   .dr-app-yes{background:#dcfce7;color:#15803d;}.dr-app-no{background:#fee2e2;color:#b91c1c;}
//   .dr-sum-accordions{border-top:1px solid #eef0f3;}
//   .dr-acc-item{border-bottom:1px solid #eef0f3;}.dr-acc-item:last-child{border-bottom:none;}
//   .dr-acc-trigger{width:100%;display:flex;align-items:center;gap:10px;padding:13px 18px;background:none;border:none;cursor:pointer;font-family:'DM Sans',sans-serif;font-size:12px;font-weight:700;color:#1a1a2e;text-align:left;transition:background .12s;}
//   .dr-acc-trigger:hover{background:#fafbfc;}
//   .dr-acc-icon{font-size:14px;flex-shrink:0;}.dr-acc-label{flex:1;}
//   .dr-acc-badge{font-size:10px;font-weight:600;padding:2px 8px;background:#f0f1f4;border:1px solid #dde0e6;border-radius:10px;color:#9499aa;}
//   .dr-acc-arrow{font-size:9px;color:#9499aa;flex-shrink:0;transition:transform .2s;}
//   .dr-acc-body{border-top:1px solid #f5f6f8;background:#fafbfc;}
//   .dr-acc-rows{padding:10px 16px;display:flex;flex-direction:column;gap:6px;}
//   .dr-acc-foot{padding:8px 16px;border-top:1px solid #f0f1f4;}
//   .dr-sum-row{display:flex;align-items:flex-start;gap:8px;padding:7px 10px;background:#fff;border:1px solid #f0f1f4;border-radius:7px;}
//   .dr-sum-num-icon{flex-shrink:0;width:20px;height:20px;background:#f0f0ff;color:#6366f1;border-radius:5px;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;margin-top:1px;}
//   .dr-sum-dot{flex-shrink:0;width:8px;height:8px;background:#6366f1;border-radius:50%;margin-top:5px;}
//   .dr-sum-dot-tech{background:#8b5cf6;}
//   .dr-sum-item{flex:1;font-size:12px;color:#4a5068;line-height:1.6;outline:none;}
//   .dr-sum-item:focus{outline:1.5px dashed #bfdbfe;border-radius:3px;padding:1px 4px;}
//   .dr-sum-item-plain{font-size:12px;color:#4a5068;line-height:1.7;padding:6px 0;outline:none;}
//   .dr-sum-item-plain:focus{outline:1.5px dashed #bfdbfe;border-radius:4px;padding:6px 8px;}
//   .dr-risk-pill{flex-shrink:0;padding:2px 8px;border-radius:4px;font-size:10px;font-weight:700;}
//   .dr-risk-high{background:#fee2e2;color:#b91c1c;}.dr-risk-medium{background:#fef9c3;color:#b45309;}.dr-risk-low{background:#dcfce7;color:#15803d;}
//   .dr-row-del{flex-shrink:0;padding:1px 6px;background:none;border:none;color:#c4c8d4;cursor:pointer;font-size:12px;transition:color .12s;}
//   .dr-row-del:hover{color:#b91c1c;}
//   .dr-add-row-btn{padding:4px 12px;background:#fff;border:1.5px solid #dde0e6;border-radius:5px;font-family:'DM Sans',sans-serif;font-size:10px;font-weight:700;color:#4a5068;cursor:pointer;transition:all .12s;}
//   .dr-add-row-btn:hover{border-color:#6366f1;color:#6366f1;}
//   .dr-org-metrics{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:12px;}
//   .dr-org-metric{background:#fff;border:1px solid #eef0f3;border-radius:7px;padding:10px;text-align:center;}
//   .dr-om-val{font-size:20px;font-weight:800;color:#1a1a2e;line-height:1;}
//   .dr-om-label{font-size:10px;color:#9499aa;text-transform:uppercase;letter-spacing:.04em;margin-top:3px;}
//   .dr-chapters-wrap{padding:14px 16px;display:flex;flex-direction:column;gap:10px;}
//   .dr-chapter{border:1px solid #dde0e6;border-radius:9px;overflow:hidden;}
//   .dr-chapter-head{display:flex;align-items:center;justify-content:space-between;padding:11px 14px;background:#fafbfc;}
//   .dr-chapter-toggle{display:flex;align-items:center;gap:8px;background:none;border:none;cursor:pointer;font-family:'DM Sans',sans-serif;font-size:12px;font-weight:700;color:#1a1a2e;flex:1;text-align:left;padding:0;}
//   .dr-ch-arrow{font-size:9px;color:#9499aa;width:10px;}.dr-ch-title{flex:1;}
//   .dr-ch-count{font-size:10px;color:#9499aa;background:#eef0f3;padding:1px 7px;border-radius:8px;}
//   .dr-chapter-actions{display:flex;gap:5px;}
//   .dr-chapter-body{padding:10px 12px;background:#fff;}
//   .dr-clauses-list{display:flex;flex-direction:column;gap:7px;}
//   .dr-clause-item{border:1px solid #eef0f3;border-radius:8px;overflow:hidden;background:#fff;}
//   .dr-clause-head{display:flex;align-items:center;gap:8px;padding:10px 13px;flex-wrap:wrap;}
//   .dr-clause-id{font-family:'DM Mono',monospace;font-size:10px;font-weight:700;color:#6366f1;background:#f0f0ff;border:1px solid #e0e7ff;padding:2px 8px;border-radius:4px;flex-shrink:0;}
//   .dr-clause-preview{flex:1;font-size:12px;color:#4a5068;line-height:1.5;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;}
//   .dr-clause-head-right{display:flex;align-items:center;gap:5px;flex-shrink:0;}
//   .dr-clause-toggle-btn{padding:3px 8px;background:#f5f6f8;border:1px solid #dde0e6;border-radius:5px;font-size:10px;cursor:pointer;color:#9499aa;transition:all .12s;}
//   .dr-clause-toggle-btn:hover{border-color:#1a1a2e;color:#1a1a2e;}
//   .dr-map-btn{padding:3px 10px;background:#f5f3ff;border:1.5px solid #c4b5fd;border-radius:5px;font-family:'DM Sans',sans-serif;font-size:10px;font-weight:700;color:#7c3aed;cursor:pointer;transition:all .13s;}
//   .dr-map-btn:hover{background:#ede9fe;border-color:#7c3aed;}
//   .dr-mapped-refs{display:flex;align-items:center;flex-wrap:wrap;gap:5px;padding:4px 13px 8px;background:#fdfcff;}
//   .dr-mapped-label{font-size:9px;font-weight:700;color:#9499aa;text-transform:uppercase;letter-spacing:.05em;}
//   .dr-mapped-chip{display:inline-flex;align-items:center;gap:4px;padding:2px 9px;background:#f5f3ff;border:1px solid #c4b5fd;border-radius:20px;font-size:10px;font-weight:600;color:#7c3aed;}
//   .dr-mapped-chip button{background:none;border:none;color:#c4b5fd;cursor:pointer;font-size:10px;padding:0;line-height:1;}
//   .dr-mapped-chip button:hover{color:#7c3aed;}
//   .dr-clause-body{padding:12px 14px;background:#fafbfc;border-top:1px solid #f0f1f4;}
//   .dr-clause-controls{display:flex;align-items:flex-start;gap:12px;margin-bottom:12px;flex-wrap:wrap;padding:8px 10px;background:#f5f6f8;border-radius:7px;}
//   .dr-ctrl-group{display:flex;align-items:center;gap:6px;}
//   .dr-ctrl-label{font-size:9px;font-weight:700;color:#9499aa;text-transform:uppercase;letter-spacing:.05em;white-space:nowrap;}
//   .dr-ctrl-select{padding:4px 8px;background:#fff;border:1px solid #dde0e6;border-radius:5px;font-family:'DM Sans',sans-serif;font-size:11px;color:#1a1a2e;outline:none;cursor:pointer;}
//   .dr-tags-ctrl{display:flex;align-items:center;flex-wrap:wrap;gap:5px;flex:1;}
//   .dr-tags-list{display:flex;flex-wrap:wrap;gap:4px;}
//   .dr-ctag{display:inline-flex;align-items:center;gap:3px;padding:2px 8px;background:#eff6ff;border:1px solid #bfdbfe;border-radius:20px;font-size:10px;font-weight:600;color:#2563eb;}
//   .dr-ctag button{background:none;border:none;color:#9499aa;cursor:pointer;font-size:11px;padding:0;line-height:1;}
//   .dr-tag-input{padding:3px 7px;background:#fff;border:1px solid #dde0e6;border-radius:5px;font-family:'DM Sans',sans-serif;font-size:11px;outline:none;width:80px;}
//   .dr-tag-input:focus{border-color:#2563eb;}
//   .dr-tag-add-btn{padding:3px 7px;background:#f5f6f8;border:1px solid #dde0e6;border-radius:4px;font-size:11px;cursor:pointer;color:#4a5068;font-weight:700;}
//   .dr-tag-add-btn:hover{border-color:#6366f1;color:#6366f1;}
//   .dr-nested-block{background:#fff;border:1px solid #eef0f3;border-radius:7px;padding:10px 12px;margin-bottom:9px;}
//   .dr-nb-label{font-size:9px;font-weight:700;color:#9499aa;text-transform:uppercase;letter-spacing:.05em;margin-bottom:6px;}
//   .dr-nb-label-row{display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;}
//   .dr-nb-content{font-size:12px;color:#1a1a2e;line-height:1.7;outline:none;}
//   .dr-editable:focus{outline:1.5px dashed #bfdbfe;border-radius:4px;padding:2px 5px;}
//   .dr-add-sub-btn{padding:2px 9px;background:#fff;border:1.5px solid #dde0e6;border-radius:5px;font-family:'DM Sans',sans-serif;font-size:10px;font-weight:700;color:#4a5068;cursor:pointer;transition:all .12s;}
//   .dr-add-sub-btn:hover{border-color:#6366f1;color:#6366f1;}
//   .dr-empty-hint{font-size:11px;color:#c4c8d4;font-style:italic;padding:4px 0;}
//   .dr-oblig-item{background:#f8f9fc;border:1px solid #eef0f3;border-radius:7px;padding:10px 12px;margin-bottom:8px;}
//   .dr-oblig-head{display:flex;align-items:flex-start;gap:8px;}
//   .dr-oblig-badge{flex-shrink:0;width:22px;height:22px;background:#6366f1;color:#fff;border-radius:5px;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;margin-top:1px;}
//   .dr-actions-list{display:flex;flex-direction:column;gap:5px;}
//   .dr-action-row{display:flex;align-items:flex-start;gap:7px;padding:6px 9px;background:#fff;border:1px solid #f0f1f4;border-radius:5px;}
//   .dr-action-num{flex-shrink:0;width:18px;height:18px;background:#f0f0ff;color:#6366f1;border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:700;margin-top:1px;}
//   .dr-action-txt{flex:1;font-size:12px;color:#4a5068;line-height:1.6;outline:none;}
//   .dr-action-txt:focus{outline:1.5px dashed #bfdbfe;border-radius:3px;padding:1px 4px;}
//   .dr-ev-list{padding:14px 16px;display:flex;flex-direction:column;gap:9px;}
//   .dr-ev-item{border:1px solid #eef0f3;border-radius:9px;overflow:hidden;background:#fff;}
//   .dr-ev-head{display:flex;align-items:center;gap:10px;padding:11px 14px;flex-wrap:wrap;}
//   .dr-ev-id{font-family:'DM Mono',monospace;font-size:10px;font-weight:700;color:#6366f1;background:#f0f0ff;border:1px solid #e0e7ff;padding:2px 7px;border-radius:4px;flex-shrink:0;}
//   .dr-ev-center{flex:1;min-width:0;}
//   .dr-ev-name{font-size:12px;font-weight:700;color:#1a1a2e;display:block;margin-bottom:2px;}
//   .dr-ev-meta{font-size:11px;color:#9499aa;display:flex;align-items:center;gap:5px;}
//   .dr-ev-status-dot{font-size:11px;font-weight:700;flex-shrink:0;}
//   .dr-ev-actions{display:flex;gap:5px;flex-shrink:0;}
//   .dr-ev-desc-row{padding:6px 14px 10px;display:flex;align-items:flex-start;gap:8px;flex-wrap:wrap;}
//   .dr-ev-clause-chip{padding:1px 8px;background:#eff6ff;border:1px solid #bfdbfe;border-radius:4px;font-size:10px;font-weight:700;color:#2563eb;flex-shrink:0;}
//   .dr-ev-desc{font-size:11px;color:#9499aa;flex:1;}
//   .dr-not-saved{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;padding:56px 24px;background:#fff;border:1.5px dashed #dde0e6;border-radius:12px;text-align:center;}
//   .dr-ns-icon{font-size:32px;opacity:.4;}.dr-ns-title{font-size:14px;font-weight:700;color:#1a1a2e;}
//   .dr-ns-sub{font-size:12px;color:#9499aa;max-width:280px;line-height:1.5;}
//   .dr-modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:9999;display:flex;align-items:flex-start;justify-content:center;padding:40px 16px;overflow-y:auto;}
//   .dr-modal{background:#fff;border-radius:14px;width:100%;max-width:740px;max-height:85vh;display:flex;flex-direction:column;overflow:hidden;box-shadow:0 24px 64px rgba(0,0,0,.22);font-family:'DM Sans',sans-serif;}
//   .dr-modal-head{padding:16px 20px;border-bottom:1px solid #eef0f3;display:flex;align-items:flex-start;justify-content:space-between;flex-shrink:0;}
//   .dr-modal-head-left{flex:1;min-width:0;}
//   .dr-modal-eyebrow{font-size:10px;font-weight:700;color:#7c3aed;text-transform:uppercase;letter-spacing:.08em;margin-bottom:5px;}
//   .dr-modal-subject{font-size:13px;font-weight:700;color:#1a1a2e;line-height:1.5;margin-bottom:3px;}
//   .dr-modal-oblig-ref{font-size:11px;color:#9499aa;}
//   .dr-modal-close{background:none;border:none;cursor:pointer;font-size:18px;color:#9499aa;padding:2px 6px;flex-shrink:0;}
//   .dr-modal-close:hover{color:#1a1a2e;}
//   .dr-modal-mapped-bar{display:flex;align-items:center;flex-wrap:wrap;gap:6px;padding:10px 20px;background:#fdf9ff;border-bottom:1px solid #ede9fe;}
//   .dr-modal-mapped-label{font-size:10px;font-weight:700;color:#9499aa;text-transform:uppercase;letter-spacing:.05em;}
//   .dr-modal-search-bar{padding:10px 16px;border-bottom:1px solid #eef0f3;flex-shrink:0;}
//   .dr-modal-search{width:100%;padding:8px 12px;background:#f5f6f8;border:1.5px solid #dde0e6;border-radius:7px;font-family:'DM Sans',sans-serif;font-size:13px;color:#1a1a2e;outline:none;box-sizing:border-box;transition:border-color .14s;}
//   .dr-modal-search:focus{border-color:#7c3aed;background:#fff;}
//   .dr-modal-body{overflow-y:auto;flex:1;}
//   .dr-map-table{width:100%;border-collapse:collapse;font-size:12px;}
//   .dr-map-table th{text-align:left;padding:8px 14px;background:#f5f6f8;border-bottom:1px solid #dde0e6;font-size:10px;font-weight:700;color:#9499aa;text-transform:uppercase;letter-spacing:.04em;position:sticky;top:0;}
//   .dr-map-table td{padding:10px 14px;border-bottom:1px solid #f5f6f8;vertical-align:top;}
//   .dr-map-row:hover{background:#fdfcff;}.dr-map-row-mapped{background:#fdf9ff;}
//   .dr-map-cid{font-family:'DM Mono',monospace;font-size:11px;font-weight:700;color:#6366f1;background:#f0f0ff;border:1px solid #e0e7ff;padding:2px 7px;border-radius:4px;}
//   .dr-map-circ-id{font-family:'DM Mono',monospace;font-size:10px;font-weight:700;color:#1a1a2e;margin-bottom:2px;}
//   .dr-map-circ-title{font-size:11px;color:#9499aa;}
//   .dr-map-ch{font-size:11px;color:#9499aa;}.dr-map-text{font-size:12px;color:#4a5068;line-height:1.5;}
//   .dr-map-row-btn{padding:4px 12px;background:#fff;border:1.5px solid #c4b5fd;border-radius:5px;font-family:'DM Sans',sans-serif;font-size:10px;font-weight:700;color:#7c3aed;cursor:pointer;transition:all .13s;white-space:nowrap;}
//   .dr-map-row-btn:hover{background:#f5f3ff;}
//   .dr-map-row-btn.mapped{background:#f5f3ff;border-color:#7c3aed;color:#6d28d9;}
//   .dr-modal-foot{padding:12px 20px;border-top:1px solid #eef0f3;background:#f8f9fc;display:flex;align-items:center;justify-content:space-between;gap:12px;flex-shrink:0;}
//   .dr-modal-foot-note{font-size:11px;color:#9499aa;flex:1;}
//   `;
//   document.head.appendChild(s);
// }