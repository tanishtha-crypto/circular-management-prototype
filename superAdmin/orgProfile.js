/**
 * orgProfile.js
 * Self-contained Org Profile module for CMS.
 *
 * DEPENDENCIES (must exist on window before this script runs):
 *   - OP               : org profile state object          (from mod-data)
 *   - ORG_BASIC        : simple org summary object         (from mod-data)
 *   - WZ_STEPS         : wizard step definitions array     (defined below, exported)
 *   - toast(msg, type) : toast utility                     (from mod-utils)
 *   - closeModal(id)   : modal close utility               (from mod-utils)
 *
 * EXPOSES on window:
 *   WZ_IDX, WZ_STEPS
 *   openProfileWizard(startStep), closeProfileWizard()
 *   wzNext(), wzPrev(), wzGoto(i)
 *   calcCompletion(), COMPLETION_STEPS
 *   renderOrgProfile()
 *   refreshSidebarSteps()
 *   openAddLocationModal(), saveLocation(), removeLocation(i)
 *   openAddEntityModal(),   saveLegalEntity(), removeLegalEntity(i)
 *   addDepartment(), quickAddDept(el, name), removeDept(i)
 *   addDivision(), removeDivision(i)
 *   opSel, opSelChipSingle, opSelChipDeep
 *   opToggleArr, opToggleDeepArr
 *   opYN, opYNDeep
 */

(function (global) {
  "use strict";

  // ─────────────────────────────────────────────
  // STEP DEFINITIONS
  // ─────────────────────────────────────────────

  const WZ_STEPS = [
    { id: "identity",   label: "Basic Information",   icon: "🏦" },
    { id: "entities",   label: "Entities",   icon: "🏢" },
    { id: "locations",  label: "Locations",  icon: "📍" },
    { id: "regulatory", label: "Regulatory", icon: "🏛" },
    { id: "activities", label: "Activities", icon: "⚡" },
    { id: "products",   label: "Products",   icon: "📦" },
    { id: "deepdive",   label: "Deep Dive",  icon: "🔍" },
    { id: "risk",       label: "Risk",       icon: "⚠" },
    { id: "context",    label: "Context",    icon: "📝" },
  ];

  const WZ_IDX = {
    identity: 0, entities: 1, locations: 2 , regulatory: 3,
    activities: 4, products: 5, deepdive: 6, risk: 7, context: 8,
  };

  // ─────────────────────────────────────────────
  // COMPLETION
  // ─────────────────────────────────────────────

  const COMPLETION_STEPS = [
    { label: "Identity",   check: () => !!(OP.legalName || OP.regName) },
    { label: "Regulatory", check: () => !!OP.regulator },
    { label: "Activities", check: () => OP.businessLines && OP.businessLines.length > 0 },
    { label: "Products",   check: () => OP.products && OP.products.length > 0 },
    { label: "Deep Dive",  check: () => Object.values(OP.deepDive).some(v => v && (Array.isArray(v) ? v.length > 0 : v !== "")) },
    { label: "Locations",  check: () => OP.locations && OP.locations.length > 0 },
    { label: "Entities",   check: () => true }, // optional
    { label: "Risk",       check: () => !!OP.riskAppetite },
    { label: "Context",    check: () => !!OP.bizModelDesc },
  ];

  function calcCompletion() {
    const checks = [
      OP.legalName || OP.regName,
      OP.regulator,
      OP.businessLines && OP.businessLines.length > 0,
      OP.products && OP.products.length > 0,
      Object.values(OP.deepDive).some(v => v && v.length > 0),
      OP.locations && OP.locations.length > 0,
      OP.riskAppetite,
      OP.bizModelDesc,
    ];
    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  }

  // ─────────────────────────────────────────────
  // SIDEBAR STEP DOTS
  // ─────────────────────────────────────────────

  function refreshSidebarSteps() {
    const checks = {
      identity:   () => !!(OP.legalName || OP.regName),
      locations:  () => OP.locations?.length > 0,
      entities:   () => OP.legalEntities?.length > 0,
      regulatory: () => !!OP.regulator,
      activities: () => OP.businessLines?.length > 0,
      products:   () => OP.products?.length > 0,
      deepdive:   () => Object.values(OP.deepDive).some(v => v && (Array.isArray(v) ? v.length > 0 : v !== "")),
      risk:       () => !!OP.riskAppetite,
      context:    () => !!OP.bizModelDesc,
    };

    Object.entries(checks).forEach(([step, check], i) => {
      const dot = document.getElementById("dot-" + step);
      if (!dot) return;
      const done = OP._profileStarted && check();
      dot.className = "step-dot " + (done ? "done" : "todo");
      dot.textContent = done ? "✓" : (i + 1);
    });

    const pct  = calcCompletion();
    const mini = document.getElementById("sb-op-mini");
    if (mini) {
      mini.style.display = OP._profileStarted ? "block" : "none";
      document.getElementById("sb-op-mini-pct").textContent  = pct + "%";
      document.getElementById("sb-op-mini-fill").style.width = pct + "%";
      document.getElementById("sb-op-mini-label").textContent =
        pct >= 80 ? "Profile complete ✓" : "Profile incomplete";
    }
  }

  // ─────────────────────────────────────────────
  // ORG PROFILE VIEW RENDER
  // ─────────────────────────────────────────────

  function opRow(l, v) {
    return `<div style="display:flex;justify-content:space-between;font-size:12.5px;padding:3px 0;border-bottom:1px solid #f8fafc">
      <span style="color:var(--text3);font-weight:600">${l}</span>
      <span style="font-weight:600">${v}</span>
    </div>`;
  }

  function renderOrgProfile() {
    const pct   = calcCompletion();
    const banner = document.getElementById("op-incomplete-banner");
    const nudge  = document.getElementById("dash-profile-nudge");

    document.getElementById("op-view-mode").style.display = "block";

    // Banner
    if (pct < 80) {
      banner.style.display = "flex";
      if (nudge) nudge.style.display = "flex";

      if (!OP._profileStarted) {
        document.getElementById("pib-title").textContent = "Set Up Your Organization Profile";
        document.getElementById("pib-sub").textContent   =
          "A complete profile powers the AI applicability engine — filtering circulars by your locations, business lines, legal entities and risk profile. Takes about 10–15 minutes.";
        document.getElementById("pib-cta").textContent   = "🚀 Start Setup";
      } else {
        document.getElementById("pib-title").textContent = "Complete Your Organization Profile";
        document.getElementById("pib-sub").textContent   =
          "Your profile is partially complete. Finish the remaining sections to enable precise AI-powered applicability analysis.";
        document.getElementById("pib-cta").textContent   = "Continue Setup →";
      }

      document.getElementById("pib-pct-label").textContent = pct + "%";
      document.getElementById("pib-bar-fill").style.width   = pct + "%";
      document.getElementById("pib-steps").innerHTML = COMPLETION_STEPS.map(s =>
        `<span class="pib-step ${s.check() ? "done" : "todo"}">${s.check() ? "✓" : "✗"} ${s.label}</span>`
      ).join("");
    } else {
      banner.style.display = "none";
      if (nudge) nudge.style.display = "none";
    }

    // Completion badge
    document.getElementById("op-pct").textContent = pct + "%";
    const badge = document.getElementById("op-completion-badge");
    if (pct >= 80) {
      badge.style.cssText = "display:flex;align-items:center;gap:6px;background:#f0fdf4;border:1px solid #86efac;border-radius:8px;padding:6px 12px;font-size:12px;font-weight:700;color:#166534";
      badge.innerHTML = "✓ Profile " + pct + "% complete";
    } else {
      badge.style.cssText = "display:flex;align-items:center;gap:6px;background:#fffbeb;border:1px solid #fde68a;border-radius:8px;padding:6px 12px;font-size:12px;font-weight:700;color:#854d0e;cursor:pointer";
      badge.innerHTML = "⚠ Profile " + pct + "% — Update now";
    }

    // Status chip
    const statusChip = document.getElementById("op-status-chip");
    const updLabel   = document.getElementById("op-updated-label");
    if (pct >= 80) {
      statusChip.className = "chip ch-active"; statusChip.textContent = "Active";
      updLabel.textContent = "Profile updated today";
    } else if (OP._profileStarted) {
      statusChip.className = "chip ch-pending"; statusChip.textContent = "In Progress";
      updLabel.textContent = "Setup in progress";
    } else {
      statusChip.className = "chip ch-inactive"; statusChip.textContent = "Not Set Up";
      updLabel.textContent = "Not yet configured";
    }

    // Header
    const name = OP.legalName || OP.regName || "—";
    const hq   = (OP.locations || []).find(l => l.type && l.type.includes("HQ")) || OP.locations[0] || null;

    document.getElementById("op-name").textContent = name;
    document.getElementById("op-industry").textContent = OP._profileStarted
      ? [OP.industry, OP.regulator ? OP.regulator + " Regulated" : "", hq?.city].filter(Boolean).join(" · ") || "—"
      : "Complete your profile to populate this section";
    document.getElementById("op-tags").innerHTML = OP._profileStarted
      ? [OP.orgType, OP.regulator, OP.listed === "Yes" ? "Listed" : OP.listed === "No" ? "Unlisted" : ""]
          .filter(Boolean).map(t => `<span class="chip ch-co" style="font-size:10px">${t}</span>`).join("")
      : "";

    // Basic grid
    const fields = [
      ["Industry",       OP.industry || "Banking"],
      ["Org Type",       OP.orgType  || "HDFC"],
      ["PAN / CIN",      OP.panNo || OP.cin || "GFG78643NN"],
      ["Regulator",      OP.regulator || "RBI"],
      ["HQ Address",     hq ? `${hq.address || ""} ${hq.city || ""}`.trim() || "Mumbai" : "—"],
      ["State",          hq?.state || "—"],
      ["Locations",      OP.locations.length ? OP.locations.length + " location(s)" : "Mumbai"],
      ["Legal Entities", OP.legalEntities.length ? OP.legalEntities.length + " entit" + (OP.legalEntities.length === 1 ? "y" : "ies") : "3"],
    ];
    document.getElementById("org-profile-grid").innerHTML = fields.map(([l, v]) =>
      `<div class="op-item"><span class="op-lbl">${l}</span><span class="op-val">${v}</span></div>`
    ).join("");

    // Section cards
    document.getElementById("op-section-cards").innerHTML = `
      <div class="op-sec-card">
        <div class="op-sec-hd">
          <div class="op-sec-title">📊 Business Lines</div>
          <button class="op-sec-edit" onclick="openProfileWizard(WZ_IDX.activities)">Edit →</button>
        </div>
        <div>${(OP.businessLines || []).map(b => `<span class="op-tag">${b}</span>`).join("")
          || '<span style="color:var(--text3);font-size:12px">Not set — click Edit to add</span>'}</div>
      </div>

      <div class="op-sec-card">
        <div class="op-sec-hd">
          <div class="op-sec-title">📍 Locations (${OP.locations.length})</div>
          <button class="op-sec-edit" onclick="openProfileWizard(WZ_IDX.locations)">Edit →</button>
        </div>
        ${OP.locations.length
          ? OP.locations.slice(0, 3).map(l => `
            <div style="display:flex;justify-content:space-between;align-items:center;font-size:12.5px;padding:5px 0;border-bottom:1px solid #f8fafc">
              <div>
                <span style="font-weight:700">${l.name}</span>
                <span style="font-size:10px;font-weight:700;padding:1px 7px;border-radius:99px;background:#f1f5f9;color:#64748b;margin-left:5px">${l.type}</span>
              </div>
              <span style="color:var(--text3);font-size:11px">${l.city || ""}${l.state ? ", " + l.state : ""}</span>
            </div>`).join("") +
            (OP.locations.length > 3 ? `<div style="font-size:11px;color:var(--text3);margin-top:6px">+${OP.locations.length - 3} more</div>` : "")
          : '<span style="color:var(--text3);font-size:12px">No locations added — click Edit to add</span>'}
      </div>

      <div class="op-sec-card">
        <div class="op-sec-hd">
          <div class="op-sec-title">🏢 Legal Entities (${OP.legalEntities.length})</div>
          <button class="op-sec-edit" onclick="openProfileWizard(WZ_IDX.entities)">Edit →</button>
        </div>
        ${OP.legalEntities.length
          ? OP.legalEntities.slice(0, 3).map(e => `
            <div style="display:flex;justify-content:space-between;align-items:center;font-size:12.5px;padding:5px 0;border-bottom:1px solid #f8fafc">
              <span style="font-weight:700">${e.name}</span>
              <span style="color:var(--text3);font-size:11px">${e.type}${e.stake ? " · " + e.stake + "%" : ""}</span>
            </div>`).join("") +
            (OP.legalEntities.length > 3 ? `<div style="font-size:11px;color:var(--text3);margin-top:6px">+${OP.legalEntities.length - 3} more</div>` : "")
          : '<span style="color:var(--text3);font-size:12px">No entities added — click Edit to add</span>'}
      </div>

      <div class="op-sec-card">
        <div class="op-sec-hd">
          <div class="op-sec-title">⚠ Risk Profile</div>
          <button class="op-sec-edit" onclick="openProfileWizard(WZ_IDX.risk)">Edit →</button>
        </div>
        <div style="display:flex;flex-direction:column;gap:5px">
          ${opRow("Risk Appetite",   OP.riskAppetite  || "—")}
          ${opRow("Last Audit",      OP.lastAudit     || "—")}
          ${opRow("KYC Level",       OP.kycLevel      || "—")}
          ${opRow("Board Committee", OP.boardCommittee || "—")}
        </div>
      </div>`;

    // Topbar subtitle
    if (name !== "—") {
      const sub = document.getElementById("topbar-org-sub");
      if (sub) sub.textContent = `${name} · ${OP.regulator || "—"} Regulated · ${hq?.city || "India"}`;
    }
  }

  // ─────────────────────────────────────────────
  // WIZARD STEP RENDERERS
  // ─────────────────────────────────────────────

  function wzStepIdentity() {
    return `
    <div class="wz-card">
      <div class="wz-card-title">🏦 Legal & Registered Name</div>
      <div class="wz-card-sub">Exact names as per regulatory filings and MCA records.</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">
        <div class="fg" style="margin:0"><label class="fg-lbl">Legal Name of Organization</label>
          <input class="fg-input" id="op-legal-name" value="${OP.legalName}" placeholder="As per regulator records"></div>
        <div class="fg" style="margin:0"><label class="fg-lbl">Registered Company Name (MCA)</label>
          <input class="fg-input" id="op-reg-name" value="${OP.regName}" placeholder="As per incorporation"></div>
      </div>
    </div>

    <div class="wz-card">
      <div class="wz-card-title">🏷 Organization Type & Industry</div>
      <div class="wz-card-sub">Determines the base set of applicable regulatory circulars.</div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px">
        <div class="fg" style="margin:0"><label class="fg-lbl">Organization Type</label>
          <select class="fg-input" onchange="OP.orgType=this.value">
            ${["","Bank","NBFC","FinTech","Insurance Company","Mutual Fund / AMC","Stock Broker","Depository Participant","Payment Aggregator","Corporate","Government / PSU","Other"]
              .map(t => `<option value="${t}" ${OP.orgType === t ? "selected" : ""}>${t || "Select type"}</option>`).join("")}
          </select></div>
        <div class="fg" style="margin:0"><label class="fg-lbl">Industry</label>
          <select class="fg-input" onchange="OP.industry=this.value">
            ${["","Banking & Financial Services","Insurance","Capital Markets","Payments & Fintech","Asset Management","Microfinance","Housing Finance","Other"]
              .map(t => `<option value="${t}" ${OP.industry === t ? "selected" : ""}>${t || "Select industry"}</option>`).join("")}
          </select></div>
        <div class="fg" style="margin:0"><label class="fg-lbl">Sub-sector</label>
          <select class="fg-input" onchange="OP.subSector=this.value">
            ${["","Scheduled Commercial Bank","Non-Scheduled Bank","Private Sector Bank","Public Sector Bank","Small Finance Bank","Payment Bank","NBFC-MFI","NBFC-ICC","NBFC-HFC","Life Insurer","General Insurer","Other"]
              .map(t => `<option value="${t}" ${OP.subSector === t ? "selected" : ""}>${t || "Select sub-sector"}</option>`).join("")}
          </select></div>
      </div>
    </div>

    <div class="wz-card">
  <div class="wz-card-title">📞 Contact & Address</div>
  <div class="wz-card-sub">Primary contact details and registered addresses of the organization.</div>
  <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px">
    <div class="fg" style="margin:0"><label class="fg-lbl">Brand / Trade Name</label>
      <input class="fg-input" value="${OP.brandName}" onchange="OP.brandName=this.value" placeholder="e.g. HDFC Bank"></div>
    <div class="fg" style="margin:0"><label class="fg-lbl">Official Email</label>
      <input class="fg-input" type="email" value="${OP.officialEmail}" onchange="OP.officialEmail=this.value" placeholder="e.g. contact@hdfc.com"></div>
    <div class="fg" style="margin:0"><label class="fg-lbl">Official Phone</label>
      <input class="fg-input" type="tel" value="${OP.officialPhone}" onchange="OP.officialPhone=this.value" placeholder="e.g. +91 9999999999"></div>
  </div>
  <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px;margin-top:14px">
    <div class="fg" style="margin:0"><label class="fg-lbl">Organization Website</label>
      <input class="fg-input" type="url" value="${OP.website}" onchange="OP.website=this.value" placeholder="e.g. https://www.hdfc.com"></div>
    <div class="fg" style="margin:0"><label class="fg-lbl">Registered Address</label>
      <textarea class="fg-input" rows="2" onchange="OP.registeredAddress=this.value" placeholder="As per MCA / regulator records">${OP.registeredAddress}</textarea></div>
    <div class="fg" style="margin:0"><label class="fg-lbl">Corporate / Operational Address</label>
      <textarea class="fg-input" rows="2" onchange="OP.corporateAddress=this.value" placeholder="If different from registered">${OP.corporateAddress}</textarea></div>
  </div>
</div>


<div class="wz-card">
  <div class="wz-card-title">🪪 Additional Identity & Compliance Numbers</div>
  <div class="wz-card-sub">Required for regulatory verification and circular applicability matching.</div>
  <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px">
    <div class="fg" style="margin:0"><label class="fg-lbl">Legal Entity Type</label>
      <select class="fg-input" onchange="OP.legalEntityType=this.value">
        ${["","Public Limited","Private Limited","LLP","Co-operative Society","Trust","Partnership","Sole Proprietorship","Other"]
          .map(t => `<option value="${t}" ${OP.legalEntityType === t ? "selected" : ""}>${t || "Select type"}</option>`).join("")}
      </select></div>
    <div class="fg" style="margin:0"><label class="fg-lbl">Date of Incorporation</label>
      <input class="fg-input" type="date" value="${OP.incorporationDate}" onchange="OP.incorporationDate=this.value"></div>
    <div class="fg" style="margin:0"><label class="fg-lbl">Operational Since</label>
      <input class="fg-input" type="date" value="${OP.operationalSince}" onchange="OP.operationalSince=this.value" placeholder="When operations actually started"></div>
  </div>
  <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px;margin-top:14px">
    <div class="fg" style="margin:0"><label class="fg-lbl">LEI Number</label>
      <input class="fg-input" value="${OP.lei}" onchange="OP.lei=this.value" placeholder="20-character LEI code"></div>
    <div class="fg" style="margin:0"><label class="fg-lbl">GST Number</label>
      <input class="fg-input" value="${OP.gst}" onchange="OP.gst=this.value" placeholder="e.g. 27AAACH2702H1Z5"></div>
    <div class="fg" style="margin:0"><label class="fg-lbl">TAN Number</label>
      <input class="fg-input" value="${OP.tan}" onchange="OP.tan=this.value" placeholder="e.g. MUMH12345A"></div>
  </div>
</div>


    <div class="wz-card">
      <div class="wz-card-title">📋 Incorporation & Identity Numbers</div>
      <div class="wz-card-sub">Used for license validation and regulatory circular lookup.</div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px">
        <div class="fg" style="margin:0"><label class="fg-lbl">CIN / Registration ID</label>
          <input class="fg-input" id="op-cin" value="${OP.cin}" placeholder="e.g. L65920MH1994PLC080618"></div>
        <div class="fg" style="margin:0"><label class="fg-lbl">Year of Incorporation</label>
          <input class="fg-input" type="number" min="1800" max="2025" value="${OP.incorporated}" onchange="OP.incorporated=this.value" placeholder="e.g. 1994"></div>
        <div class="fg" style="margin:0"><label class="fg-lbl">PAN Number</label>
          <input class="fg-input" id="op-pan-wz" value="${OP.panNo}" placeholder="e.g. AAACH2702H"></div>
      </div>
    </div>

${OP.listed === "Yes" ? `
<div class="wz-card">
  <div class="wz-card-title">📈 Listed Company Details</div>
  <div class="wz-card-sub">Stock exchange details for listed organizations.</div>
  <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px">
    <div class="fg" style="margin:0"><label class="fg-lbl">Stock Exchange</label>
      <select class="fg-input" onchange="OP.stockExchange=this.value">
        ${["","NSE","BSE","NSE & BSE","Other"]
          .map(t => `<option value="${t}" ${OP.stockExchange === t ? "selected" : ""}>${t || "Select exchange"}</option>`).join("")}
      </select></div>
    <div class="fg" style="margin:0"><label class="fg-lbl">ISIN</label>
      <input class="fg-input" value="${OP.isin}" onchange="OP.isin=this.value" placeholder="e.g. INE040A01034"></div>
    <div class="fg" style="margin:0"><label class="fg-lbl">Ticker / Scrip Code</label>
      <input class="fg-input" value="${OP.ticker}" onchange="OP.ticker=this.value" placeholder="e.g. HDFCBANK"></div>
  </div>
</div>` : ""}

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">
      <div class="wz-card" style="margin:0">
        <div class="wz-card-title">📊 Is the company publicly listed?</div>
        <div class="yn-pair" style="margin-top:10px">
          <button class="yn-btn ${OP.listed === "Yes" ? "sel-yes" : ""}" onclick="opYN(this,'listed','Yes')">✓ Yes — Listed</button>
          <button class="yn-btn ${OP.listed === "No" ? "sel-no" : ""}" onclick="opYN(this,'listed','No')">✗ No — Unlisted</button>
        </div>
      </div>
      <div class="wz-card" style="margin:0">
        <div class="wz-card-title">🏢 Part of a Parent Group?</div>
        <div class="yn-pair" style="margin-top:10px">
          <button class="yn-btn ${OP.hasParent === "Yes" ? "sel-yes" : ""}" onclick="opYN(this,'hasParent','Yes')">✓ Yes</button>
          <button class="yn-btn ${OP.hasParent === "No" ? "sel-no" : ""}" onclick="opYN(this,'hasParent','No')">✗ No — Standalone</button>
        </div>
        ${OP.hasParent === "Yes"
          ? `<input class="fg-input" style="margin-top:10px" placeholder="Parent organization name" value="${OP.parentName}" onchange="OP.parentName=this.value">`
          : ""}
      </div>
    </div>`;
  }

  function wzStepRegulatory() {
    const regulators = ["RBI","SEBI","IRDAI","MCA","PFRDA","GST Council","TRAI","IFSCA","NHB","NABARD","FIU-IND","CCI","NCLT","ED / FEMA"];
    const sros       = ["BSE","NSE","AMFI","IAMAI","NASSCOM","IBA","FIDC","MFIN","Sa-Dhan"];
    const entityClasses = ["Scheduled Commercial Bank","Non-Scheduled Bank","NBFC – Deposit Taking","NBFC – Non-Deposit Taking","Systemically Important NBFC","Payment System Operator","Insurance Company (Life)","Insurance Company (Non-Life)","Registered Investment Adviser","Stock Broker","Depository Participant","Other"];
    return `
    <div class="wz-card">
      <div class="wz-card-title">🏛 Regulatory Authorities</div>
      <div class="wz-card-sub">Select all regulators that govern your organization.</div>
      <div class="opt-grid">${regulators.map(r =>
        `<div class="opt-chip ${(OP.regulators || []).includes(r) ? "sel" : ""}" onclick="opToggleArr(this,'regulators','${r}')">${r}</div>`
      ).join("")}</div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">
      <div class="wz-card" style="margin:0">
        <div class="wz-card-title">⭐ Primary Regulator</div>
        <select class="fg-input" style="margin-top:8px" onchange="OP.regulator=this.value">
          ${["", ...regulators].map(r => `<option ${OP.regulator === r ? "selected" : ""}>${r || "Select primary regulator"}</option>`).join("")}
        </select>
      </div>
      <div class="wz-card" style="margin:0">
        <div class="wz-card-title">📋 Regulated Entity Classification</div>
        <select class="fg-input" style="margin-top:8px" onchange="OP.entityClass=this.value">
          ${["", ...entityClasses].map(c => `<option ${OP.entityClass === c ? "selected" : ""}>${c || "Select classification"}</option>`).join("")}
        </select>
      </div>
    </div>
    <div class="wz-card">
      <div class="wz-card-title">🤝 Self-Regulatory Organizations (SROs)</div>
      <div class="opt-grid">${sros.map(s =>
        `<div class="opt-chip ${(OP.sros || []).includes(s) ? "sel" : ""}" onclick="opToggleArr(this,'sros','${s}')">${s}</div>`
      ).join("")}</div>
    </div>
    <div class="wz-card">
      <div class="wz-card-title">🔑 Regulatory License Numbers</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">
        ${[["RBI License / Registration No.","rbilicense"],["SEBI Registration No.","sebilicense"],["IRDAI License No.","irdalicense"],["Other License","otherlicense"]]
          .map(([l, k]) => `
          <div class="fg" style="margin:0"><label class="fg-lbl">${l}</label>
            <input class="fg-input" value="${OP[k] || ""}" onchange="OP['${k}']=this.value" placeholder="License number"></div>`
          ).join("")}
      </div>
    </div>
    
    <div class="wz-card">
  <div class="wz-card-title">📅 License Details</div>
  <div class="wz-card-sub">License validity and regulatory category for accurate circular matching.</div>
  <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px">
    <div class="fg" style="margin:0"><label class="fg-lbl">License Issue Date</label>
      <input class="fg-input" type="date" value="${OP.licenseIssueDate || ''}" onchange="OP.licenseIssueDate=this.value"></div>
    <div class="fg" style="margin:0"><label class="fg-lbl">License Expiry Date</label>
      <input class="fg-input" type="date" value="${OP.licenseExpiryDate || ''}" onchange="OP.licenseExpiryDate=this.value"></div>
    <div class="fg" style="margin:0"><label class="fg-lbl">License Status</label>
      <select class="fg-input" onchange="OP.licenseStatus=this.value">
        ${["","Active","Suspended","Under Renewal","Expired","Cancelled"]
          .map(s => `<option value="${s}" ${OP.licenseStatus === s ? "selected" : ""}>${s || "Select status"}</option>`).join("")}
      </select></div>
  </div>
  <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px;margin-top:14px">
    <div class="fg" style="margin:0"><label class="fg-lbl">Regulatory Category</label>
      <select class="fg-input" onchange="OP.regulatoryCategory=this.value">
        ${["","NBFC-MFI","NBFC-HFC","NBFC-ICC","NBFC-P2P","NBFC-AA","NBFC-Factor","Core Investment Company","Infrastructure Finance Company","Micro Finance Institution","Small Finance Bank","Payment Bank","Prepaid Payment Instrument","Other"]
          .map(c => `<option value="${c}" ${OP.regulatoryCategory === c ? "selected" : ""}>${c || "Select category"}</option>`).join("")}
      </select></div>
    <div class="fg" style="margin:0"><label class="fg-lbl">Date of First Regulation</label>
      <input class="fg-input" type="date" value="${OP.firstRegulationDate || ''}" onchange="OP.firstRegulationDate=this.value"></div>
    <div class="fg" style="margin:0"><label class="fg-lbl">Regulatory Zone / Region</label>
      <select class="fg-input" onchange="OP.regulatoryZone=this.value">
        ${["","North","South","East","West","Central","North-East","Pan India"]
          .map(z => `<option value="${z}" ${OP.regulatoryZone === z ? "selected" : ""}>${z || "Select zone"}</option>`).join("")}
      </select></div>
  </div>
</div>

<div class="wz-card">
  <div class="wz-card-title">🚦 Regulatory Status Flags</div>
  <div class="wz-card-sub">Special regulatory designations that determine applicability of specific circulars.</div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">
    <div class="fg" style="margin:0"><label class="fg-lbl">Basel Category</label>
      <select class="fg-input" onchange="OP.baselCategory=this.value">
        ${["","Basel II","Basel III","Not Applicable"]
          .map(b => `<option value="${b}" ${OP.baselCategory === b ? "selected" : ""}>${b || "Select category"}</option>`).join("")}
      </select></div>
    <div class="fg" style="margin:0"><label class="fg-lbl">CRAR / Capital Adequacy Ratio (%)</label>
      <input class="fg-input" type="number" min="0" max="100" step="0.01" value="${OP.crar || ''}" onchange="OP.crar=this.value" placeholder="e.g. 15.5"></div>
  </div>
  <div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:14px;margin-top:14px">
    <div>
      <div class="fg-lbl" style="margin-bottom:6px">Systemically Important (SI)</div>
      <div class="yn-pair">
        <button class="yn-btn ${OP.isSI === 'Yes' ? 'sel-yes' : ''}" onclick="opYN(this,'isSI','Yes')">✓ Yes</button>
        <button class="yn-btn ${OP.isSI === 'No' ? 'sel-no' : ''}" onclick="opYN(this,'isSI','No')">✗ No</button>
      </div>
    </div>
    <div>
      <div class="fg-lbl" style="margin-bottom:6px">D-SIB Status</div>
      <div class="yn-pair">
        <button class="yn-btn ${OP.isDSIB === 'Yes' ? 'sel-yes' : ''}" onclick="opYN(this,'isDSIB','Yes')">✓ Yes</button>
        <button class="yn-btn ${OP.isDSIB === 'No' ? 'sel-no' : ''}" onclick="opYN(this,'isDSIB','No')">✗ No</button>
      </div>
    </div>
    <div>
      <div class="fg-lbl" style="margin-bottom:6px">Under PCA</div>
      <div class="yn-pair">
        <button class="yn-btn ${OP.underPCA === 'Yes' ? 'sel-yes' : ''}" onclick="opYN(this,'underPCA','Yes')">✓ Yes</button>
        <button class="yn-btn ${OP.underPCA === 'No' ? 'sel-no' : ''}" onclick="opYN(this,'underPCA','No')">✗ No</button>
      </div>
    </div>
    <div>
      <div class="fg-lbl" style="margin-bottom:6px">Multi-Regulator</div>
      <div class="yn-pair">
        <button class="yn-btn ${(OP.regulators||[]).length > 1 ? 'sel-yes' : ''}" onclick="opYN(this,'multiRegulator','Yes')">✓ Yes</button>
        <button class="yn-btn ${OP.multiRegulator === 'No' ? 'sel-no' : ''}" onclick="opYN(this,'multiRegulator','No')">✗ No</button>
      </div>
    </div>
  </div>
</div>


    `;
  }

  function wzStepActivities() {
    const coreActivities = ["Deposit Taking","Lending / Credit","Investment Advisory","Portfolio Management","Payment Processing","Insurance Underwriting","Mutual Fund Distribution","Forex / Cross-border","Trade Finance","Wealth Management","Asset Reconstruction","Factoring / Invoice Discounting","Micro-lending / Microfinance","Other"];
    const serviceChecks  = [
      ["Provide financial services overall?","financialServices"],
      ["Provide lending / credit services?","lendingServices"],
      ["Provide investment advisory services?","investmentAdvisory"],
      ["Provide payment services?","paymentServices"],
      ["Provide insurance services?","insuranceServices"],
      ["Provide fintech / digital platform services?","fintechServices"],
      ["Operate marketplace / intermediary platforms?","marketplaceOps"],
      ["Provide custodial or trust services?","custodialServices"],
      ["Provide foreign exchange services?","fxServices"],
      ["Provide trade finance services?","tradeFinanceServices"],
    ];
    const bizLines = ["Retail Banking","Corporate Banking","Treasury","Digital Banking","Lending","Cards","Wealth Management","Insurance Distribution","Mutual Fund Dist.","Payment Services","Forex Services","NRI Services","Priority Sector","Correspondent Banking"];
    return `
    <div class="wz-card">
      <div class="wz-card-title">⚡ Core Business Activities</div>
      <div class="wz-card-sub">Select all primary activities — most critical input for circular matching.</div>
      <div class="opt-grid">${coreActivities.map(a =>
        `<div class="opt-chip ${(OP.coreActivities || []).includes(a) ? "sel" : ""}" onclick="opToggleArr(this,'coreActivities','${a}')">${a}</div>`
      ).join("")}</div>
    </div>
    <div class="wz-card">
      <div class="wz-card-title">💰 Financial Services Checklist</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        ${serviceChecks.map(([l, k]) => `
          <div style="background:#f8fafc;border-radius:8px;padding:10px 12px">
            <div style="font-size:12.5px;font-weight:600;margin-bottom:7px">${l}</div>
            <div class="yn-pair">
              <button class="yn-btn ${OP[k] === "Yes" ? "sel-yes" : ""}" onclick="opYN(this,'${k}','Yes')">Yes</button>
              <button class="yn-btn ${OP[k] === "No" ? "sel-no" : ""}" onclick="opYN(this,'${k}','No')">No</button>
            </div>
          </div>`).join("")}
      </div>
    </div>
    <div class="wz-card">
      <div class="wz-card-title">📊 Business Lines</div>
      <div class="opt-grid">${bizLines.map(b =>
        `<div class="opt-chip ${(OP.businessLines || []).includes(b) ? "sel" : ""}" onclick="opToggleArr(this,'businessLines','${b}')">${b}</div>`
      ).join("")}</div>
    </div>`;
  }

  function wzStepProducts() {
    const products = ["Savings Account","Current Account","Fixed Deposit","Recurring Deposit","Home Loan","Auto Loan","Personal Loan","Business Loan","Credit Card","Debit Card","Prepaid Card","Forex Card","MSME Loan","Gold Loan","Education Loan","NRI Account (NRE/NRO/FCNR)","Mutual Fund","Insurance Policy","Demat Account","Portfolio Management (PMS)","UPI / Mobile Payment","Internet Banking","Mobile Banking App","API Banking","Trade Finance (LC/BG)","Custodial Services","Escrow Services"];
    const charChecks = [
      ["Regulated financial products?","hasRegulatedProducts"],
      ["Digital products / mobile apps?","hasDigitalProducts"],
      ["Cross-border / international services?","hasCrossBorder"],
      ["Institutional / corporate clients?","hasInstitutional"],
      ["Retail / individual customers?","hasRetail"],
      ["White-label or co-branded products?","hasCoBranded"],
      ["Embedded finance / BNPL products?","hasBNPL"],
      ["Third-party distribution channels?","hasThirdPartyDist"],
    ];
    return `
    <div class="wz-card">
      <div class="wz-card-title">📦 Products & Services Offered</div>
      <div class="opt-grid">${products.map(p =>
        `<div class="opt-chip ${(OP.products || []).includes(p) ? "sel" : ""}" onclick="opToggleArr(this,'products','${p}')">${p}</div>`
      ).join("")}
      </div>
      <div style="margin-top:10px;font-size:12px;color:var(--text3)"><strong id="prod-count">${(OP.products || []).length}</strong> products selected</div>
    </div>
    <div class="wz-card">
      <div class="wz-card-title">🌐 Service Characteristics</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        ${charChecks.map(([l, k]) => `
          <div style="background:#f8fafc;border-radius:8px;padding:10px 12px">
            <div style="font-size:12.5px;font-weight:600;margin-bottom:7px">${l}</div>
            <div class="yn-pair">
              <button class="yn-btn ${OP[k] === "Yes" ? "sel-yes" : ""}" onclick="opYN(this,'${k}','Yes')">Yes</button>
              <button class="yn-btn ${OP[k] === "No" ? "sel-no" : ""}" onclick="opYN(this,'${k}','No')">No</button>
            </div>
          </div>`).join("")}
      </div>
    </div>`;
  }

  function wzStepDeepDive() {
   const hasDigi  = true;
const hasLend  = true;
const hasCards = true;
const hasForex = true;
const hasPay   = true;
    if (!hasDigi && !hasLend && !hasCards && !hasForex && !hasPay) return `
      <div class="wz-card"><div style="text-align:center;padding:32px;color:var(--text3)">
        <div style="font-size:32px;margin-bottom:12px">📊</div>
        <div style="font-size:14px;font-weight:700;margin-bottom:6px">No deep dive required for your business lines</div>
        <div style="font-size:13px">Proceed to the next step.</div>
        <button class="btn btn-ghost btn-sm" style="margin-top:14px" onclick="wzGoto(WZ_IDX.activities)">← Review Business Lines</button>
      </div></div>`;

    return `
    ${hasDigi ? `<div class="wz-card">
      <div class="wz-card-title">💻 Digital Banking — Technology Setup</div>
      <div class="wz-card-sub">Matches IT governance, cybersecurity and DPDP circulars.</div>
      <div style="display:flex;flex-direction:column;gap:14px">
        <div class="fg" style="margin:0"><label class="fg-lbl">Core Banking System (CBS)</label>
          <select class="fg-input" onchange="OP.deepDive.cbs=this.value">
            ${["","Finacle","Temenos T24","TCS BaNCS","Oracle FLEXCUBE","Finastra","FIS Profile","In-house","Other"]
              .map(c => `<option ${OP.deepDive.cbs === c ? "selected" : ""}>${c || "Select CBS"}</option>`).join("")}
          </select></div>
        <div><label class="fg-lbl">Cloud Infrastructure</label>
          <div class="opt-grid" style="margin-top:6px">${["No Cloud","Public Cloud","Private Cloud","Hybrid Cloud","Multi-Cloud"]
            .map(c => `<div class="opt-chip ${OP.deepDive.cloudUsage === c ? "sel" : ""}" onclick="opSelChipDeep(this,'cloudUsage','${c}')">${c}</div>`).join("")}</div></div>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px">
          ${[["Internet Banking","internetBanking"],["Mobile Banking","mobileBanking"],["API Banking","apiBanking"],["Third-party Outsourcing","outsourcing"],["Overseas Data Center","dataCenter"]]
            .map(([l, k]) => `
            <div><div style="font-size:12px;font-weight:700;margin-bottom:6px">${l}</div>
            <div class="yn-pair">
              <button class="yn-btn ${OP.deepDive[k] === "Yes" ? "sel-yes" : ""}" onclick="opYNDeep(this,'${k}','Yes')">Yes</button>
              <button class="yn-btn ${OP.deepDive[k] === "No" ? "sel-no" : ""}" onclick="opYNDeep(this,'${k}','No')">No</button>
            </div></div>`).join("")}
        </div>
      </div>
    </div>` : ""}
    ${hasLend ? `<div class="wz-card">
      <div class="wz-card-title">🏠 Lending — Loan Portfolio</div>
      <div class="opt-grid" style="margin-bottom:14px">${["Home Loan","Auto Loan","Personal Loan","MSME Loan","Agricultural Loan","Education Loan","Gold Loan","Microfinance","Loan Against Property"]
        .map(l => `<div class="opt-chip ${(OP.deepDive.loanTypes || []).includes(l) ? "sel" : ""}" onclick="opToggleDeepArr(this,'loanTypes','${l}')">${l}</div>`).join("")}</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        ${[["Co-lending Arrangements","coLending"],["Priority Sector Lending","prioritySector"],["NBFC Partnership","nbfcPartner"],["Securitisation / ABS","securitisation"]]
          .map(([l, k]) => `
          <div><div style="font-size:12px;font-weight:700;margin-bottom:6px">${l}</div>
          <div class="yn-pair">
            <button class="yn-btn ${OP.deepDive[k] === "Yes" ? "sel-yes" : ""}" onclick="opYNDeep(this,'${k}','Yes')">Yes</button>
            <button class="yn-btn ${OP.deepDive[k] === "No" ? "sel-no" : ""}" onclick="opYNDeep(this,'${k}','No')">No</button>
          </div></div>`).join("")}
      </div>
    </div>` : ""}
    ${hasCards ? `<div class="wz-card">
      <div class="wz-card-title">💳 Cards — Product Details</div>
      <div class="opt-grid">${["Credit Card","Debit Card","Prepaid Card","Co-branded Card","Corporate Card","Forex Card"]
        .map(c => `<div class="opt-chip ${(OP.deepDive.cardTypes || []).includes(c) ? "sel" : ""}" onclick="opToggleDeepArr(this,'cardTypes','${c}')">${c}</div>`).join("")}</div>
    </div>` : ""}
    ${hasPay ? `<div class="wz-card">
      <div class="wz-card-title">⚡ Payment Services — Infrastructure</div>
      <div class="opt-grid">${["UPI","NACH","BBPS","IMPS","RTGS","NEFT","SWIFT","FASTag","Aadhaar Pay","Payment Gateway"]
        .map(p => `<div class="opt-chip ${(OP.deepDive.paymentSystems || []).includes(p) ? "sel" : ""}" onclick="opToggleDeepArr(this,'paymentSystems','${p}')">${p}</div>`).join("")}</div>
    </div>` : ""}
    ${hasForex ? `<div class="wz-card">
      <div class="wz-card-title">🌐 Forex & NRI Services</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        ${[["NRI / FCNR Deposits","nriDeposits"],["Outward Remittances","forex"],["Correspondent Banking","correspondent"],["Trade Finance (LC/BG)","tradefinance"]]
          .map(([l, k]) => `
          <div><div style="font-size:12px;font-weight:700;margin-bottom:6px">${l}</div>
          <div class="yn-pair">
            <button class="yn-btn ${OP.deepDive[k] === "Yes" ? "sel-yes" : ""}" onclick="opYNDeep(this,'${k}','Yes')">Yes</button>
            <button class="yn-btn ${OP.deepDive[k] === "No" ? "sel-no" : ""}" onclick="opYNDeep(this,'${k}','No')">No</button>
          </div></div>`).join("")}
      </div>
    </div>` : ""}`;
  }

  function wzStepLocations() {
    const locList = OP.locations.length
      ? OP.locations.map((loc, i) => {
          const typeBadge = loc.type.includes("HQ") ? "loc-hq" : loc.type.includes("Branch") ? "loc-branch" : "loc-unit";
          return `<div class="loc-card">
            <button class="loc-remove" onclick="removeLocation(${i})">✕</button>
            <div class="loc-card-hd">
              <span style="font-size:18px">📍</span>
              <span style="font-size:15px;font-weight:800;color:var(--text)">${loc.name}</span>
              <span class="loc-type-badge ${typeBadge}">${loc.type}</span>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;font-size:12.5px">
              <div><div style="color:var(--text3);font-weight:600;font-size:11px;margin-bottom:2px">ADDRESS</div>${loc.address || "—"}</div>
              <div><div style="color:var(--text3);font-weight:600;font-size:11px;margin-bottom:2px">CITY / STATE</div>${loc.city}, ${loc.state} ${loc.pin ? "— " + loc.pin : ""}</div>
              <div><div style="color:var(--text3);font-weight:600;font-size:11px;margin-bottom:2px">HEADCOUNT</div>${loc.headcount || "—"}</div>
            </div>
            ${loc.departments && loc.departments.length ? `<div style="margin-top:10px"><div style="font-size:11px;font-weight:700;color:var(--text3);margin-bottom:5px">DEPARTMENTS</div><div>${loc.departments.map(d => `<span class="op-tag">${d}</span>`).join("")}</div></div>` : ""}
            ${loc.entityId ? `<div style="margin-top:8px;font-size:11px;color:var(--text3)">🏢 Entity: <strong>${loc.entityId}</strong></div>` : ""}
          </div>`;
        }).join("")
      : `<div style="border:2px dashed var(--border);border-radius:12px;padding:28px;text-align:center;color:var(--text3);margin-bottom:14px">
          <div style="font-size:28px;margin-bottom:8px">📍</div>
          <div style="font-size:13px;font-weight:600;margin-bottom:4px">No locations added yet</div>
          <div style="font-size:12px">Add your HQ, branches and business units below</div>
        </div>`;

    const deptList = OP.departments.length
      ? OP.departments.map((d, i) => `
        <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 12px;background:#f8fafc;border-radius:8px;margin-bottom:6px">
          <div>
            <div style="font-size:13px;font-weight:700">${d.name}</div>
            ${d.head ? `<div style="font-size:11px;color:var(--text3)">Head: ${d.head}</div>` : ""}
            ${d.functions && d.functions.length ? `<div style="margin-top:4px">${d.functions.map(f => `<span class="op-tag">${f}</span>`).join("")}</div>` : ""}
          </div>
          <button class="btn btn-danger btn-sm" onclick="removeDept(${i})">✕</button>
        </div>`).join("")
      : "";

    return `
    <div class="wz-card">
      <div class="wz-card-title">📍 Physical Locations</div>
      <div class="wz-card-sub">Add all physical locations — HQ, branches, regional offices, and business units.</div>
      ${locList}
      <button class="btn btn-ghost" onclick="openAddLocationModal()" style="width:100%;justify-content:center;border-style:dashed">
        + Add Location / Branch / Unit
      </button>
    </div>
    <div class="wz-card">
      <div class="wz-card-title">🏗 Departments</div>
      <div class="wz-card-sub">Define the departments in your organization.</div>
      ${deptList || `<div style="font-size:13px;color:var(--text3);margin-bottom:10px">No departments added yet</div>`}
      <div style="display:grid;grid-template-columns:1fr 1fr auto;gap:10px;align-items:end;margin-top:8px">
        <div class="fg" style="margin:0"><label class="fg-lbl">Department Name</label>
          <input id="new-dept-name" class="fg-input" placeholder="e.g. IT Compliance, Legal, Risk"></div>
        <div class="fg" style="margin:0"><label class="fg-lbl">Department Head (optional)</label>
          <input id="new-dept-head" class="fg-input" placeholder="Name of head"></div>
        <button class="btn btn-primary" onclick="addDepartment()">+ Add</button>
      </div>
      <div style="margin-top:8px">
        <label class="fg-lbl" style="display:block;margin-bottom:6px">Quick Add Common Departments</label>
        <div class="opt-grid">
          ${["IT Compliance","Legal","Risk","Finance","Operations","HR","Audit","Treasury","Technology","Customer Service","Marketing"].map(d =>
            `<div class="opt-chip ${(OP.departments || []).find(x => x.name === d) ? "sel" : ""}" onclick="quickAddDept(this,'${d}')">${d}</div>`
          ).join("")}
        </div>
      </div>
    </div>
    <div class="wz-card">
      <div class="wz-card-title">🗂 Divisions</div>
      <div class="wz-card-sub">If your organization has distinct business divisions, add them here.</div>
      ${OP.divisions.length
        ? OP.divisions.map((d, i) => `
          <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 12px;background:#f8fafc;border-radius:8px;margin-bottom:6px">
            <div><div style="font-size:13px;font-weight:700">${d.name}</div>
              ${d.description ? `<div style="font-size:12px;color:var(--text3)">${d.description}</div>` : ""}</div>
            <button class="btn btn-danger btn-sm" onclick="removeDivision(${i})">✕</button>
          </div>`).join("")
        : `<div style="font-size:13px;color:var(--text3);margin-bottom:10px">No divisions added yet</div>`}
      <div style="display:grid;grid-template-columns:1fr 1fr auto;gap:10px;align-items:end;margin-top:8px">
        <div class="fg" style="margin:0"><label class="fg-lbl">Division Name</label>
          <input id="new-div-name" class="fg-input" placeholder="e.g. Retail Division"></div>
        <div class="fg" style="margin:0"><label class="fg-lbl">Description (optional)</label>
          <input id="new-div-desc" class="fg-input" placeholder="Brief description"></div>
        <button class="btn btn-primary" onclick="addDivision()">+ Add</button>
      </div>
    </div>`;
  }

  function wzStepEntities() {
    const typeMap = {
      "Wholly Owned Subsidiary": "le-subsidiary",
      "Joint Venture (JV)": "le-jv",
      "Associate Company": "le-associate",
      "Division": "le-division",
    };
    const entityList = OP.legalEntities.length
      ? OP.legalEntities.map((e, i) => {
          const badgeCls = typeMap[e.type] || "le-subsidiary";
          return `<div class="le-card">
            <button class="loc-remove" onclick="removeLegalEntity(${i})">✕</button>
            <div class="loc-card-hd" style="margin-bottom:12px">
              <span style="font-size:18px">🏢</span>
              <span style="font-size:15px;font-weight:800;color:var(--text)">${e.name}</span>
              <span class="le-type-badge ${badgeCls}">${e.type}</span>
              ${e.stake ? `<span style="font-size:11px;font-weight:700;color:var(--text3);margin-left:4px">${e.stake}% stake</span>` : ""}
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:10px;font-size:12.5px;margin-bottom:10px">
              <div><div style="color:var(--text3);font-weight:600;font-size:10px;margin-bottom:2px;text-transform:uppercase">CIN</div>${e.cin || "—"}</div>
              <div><div style="color:var(--text3);font-weight:600;font-size:10px;margin-bottom:2px;text-transform:uppercase">PAN</div>${e.pan || "—"}</div>
              <div><div style="color:var(--text3);font-weight:600;font-size:10px;margin-bottom:2px;text-transform:uppercase">Regulator</div>${e.regulator || "—"}</div>
              <div><div style="color:var(--text3);font-weight:600;font-size:10px;margin-bottom:2px;text-transform:uppercase">License No.</div>${e.license || "—"}</div>
            </div>
            ${e.bizLines && e.bizLines.length ? `<div style="margin-bottom:8px"><div style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;margin-bottom:5px">Business Lines</div><div>${e.bizLines.map(b => `<span class="op-tag">${b}</span>`).join("")}</div></div>` : ""}
            ${e.locations && e.locations.length ? `<div style="margin-bottom:6px"><div style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;margin-bottom:5px">Locations (${e.locations.length})</div><div>${e.locations.map(l => `<span class="op-tag">📍 ${l}</span>`).join("")}</div></div>` : ""}
            ${e.state ? `<div style="font-size:11px;color:var(--text3);margin-top:4px">📌 Registered in ${e.state}</div>` : ""}
          </div>`;
        }).join("")
      : `<div style="border:2px dashed var(--border);border-radius:12px;padding:28px;text-align:center;color:var(--text3);margin-bottom:14px">
          <div style="font-size:28px;margin-bottom:8px">🏢</div>
          <div style="font-size:13px;font-weight:600;margin-bottom:4px">No legal entities added yet</div>
          <div style="font-size:12px;line-height:1.6">Add subsidiaries, JVs, associates or divisions under your parent organization.</div>
        </div>`;

    return `
    <div style="background:#eef2ff;border:1px solid #c7d2fe;border-radius:10px;padding:14px 18px;margin-bottom:16px;font-size:13px;color:#3730a3;line-height:1.6">
      💡 <strong>Why capture legal entities?</strong> Different entities may be regulated differently, operate in different states, and have different regulatory obligations.
    </div>
    <div class="wz-card">
      <div class="wz-card-title">🏢 Legal Entities / Group Structure</div>
      <div class="wz-card-sub">Add all subsidiaries, JVs, associates, divisions and SPVs.</div>
      ${entityList}
      <button class="btn btn-ghost" onclick="openAddEntityModal()" style="width:100%;justify-content:center;border-style:dashed">
        + Add Legal Entity / Subsidiary / Division
      </button>
    </div>
    <div class="wz-card">
      <div class="wz-card-title">📊 Group Structure Summary</div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;text-align:center;margin-top:4px">
        <div style="background:#f8fafc;border-radius:10px;padding:16px">
          <div style="font-size:28px;font-weight:800;color:var(--primary)">${OP.legalEntities.filter(e => e.type === "Wholly Owned Subsidiary").length}</div>
          <div style="font-size:11px;font-weight:700;color:var(--text3);margin-top:4px">SUBSIDIARIES</div>
        </div>
        <div style="background:#f8fafc;border-radius:10px;padding:16px">
          <div style="font-size:28px;font-weight:800;color:var(--primary)">${OP.legalEntities.filter(e => e.type === "Joint Venture (JV)").length}</div>
          <div style="font-size:11px;font-weight:700;color:var(--text3);margin-top:4px">JOINT VENTURES</div>
        </div>
        <div style="background:#f8fafc;border-radius:10px;padding:16px">
          <div style="font-size:28px;font-weight:800;color:var(--primary)">${OP.legalEntities.filter(e => !["Wholly Owned Subsidiary","Joint Venture (JV)"].includes(e.type)).length}</div>
          <div style="font-size:11px;font-weight:700;color:var(--text3);margin-top:4px">OTHER ENTITIES</div>
        </div>
      </div>
    </div>`;
  }

  function wzStepRisk() {
    return `
    <div class="wz-card">
      <div class="wz-card-title">⚠ Risk Appetite</div>
      <div class="radio-grid" style="grid-template-columns:repeat(3,1fr)">
        ${[{v:"Low",ic:"🟢",d:"Conservative"},{v:"Medium",ic:"🟡",d:"Balanced"},{v:"High",ic:"🔴",d:"Aggressive"}].map(r =>
          `<div class="radio-card ${OP.riskAppetite === r.v ? "sel" : ""}" onclick="opSel(this,'riskAppetite','${r.v}')">
            <div class="radio-card-ic">${r.ic}</div>
            <div class="radio-card-lbl">${r.v}</div>
            <div class="radio-card-sub">${r.d}</div>
          </div>`).join("")}
      </div>
    </div>
    <div class="wz-card">
      <div class="wz-card-title">📋 Last Regulatory Audit Outcome</div>
      <div class="opt-grid">${["Clean","Minor Observations","Major Findings","Penalty Imposed","Under Review"].map(a =>
        `<div class="opt-chip ${OP.lastAudit === a ? "sel" : ""}" onclick="opSelChipSingle(this,'lastAudit','${a}')">${a}</div>`
      ).join("")}</div>
    </div>
    <div class="wz-card">
      <div class="wz-card-title">🔒 KYC / AML Compliance Level</div>
      <div class="opt-grid">${["Basic KYC","Standard KYC","Enhanced Due Diligence","Risk-Based KYC","Full AML Programme"].map(k =>
        `<div class="opt-chip ${OP.kycLevel === k ? "sel" : ""}" onclick="opSelChipSingle(this,'kycLevel','${k}')">${k}</div>`
      ).join("")}</div>
    </div>
    <div class="wz-card">
      <div class="wz-card-title">🛡 Cybersecurity Frameworks</div>
      <div class="opt-grid">${["ISO 27001","RBI Cyber Security Framework","NIST","PCI-DSS","SOC 2","DPDP Act Compliance","None"].map(f =>
        `<div class="opt-chip ${(OP.cyberFramework || []).includes(f) ? "sel" : ""}" onclick="opToggleArr(this,'cyberFramework','${f}')">${f}</div>`
      ).join("")}</div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">
      <div class="wz-card" style="margin:0">
        <div class="wz-card-title">👥 Compliance Team Size</div>
        <div class="opt-grid" style="margin-top:8px">${["1-5","6-10","11-25","26-50","50+"].map(s =>
          `<div class="opt-chip ${OP.complianceTeamSize === s ? "sel" : ""}" onclick="opSelChipSingle(this,'complianceTeamSize','${s}')">${s}</div>`
        ).join("")}</div>
      </div>
      <div class="wz-card" style="margin:0">
        <div class="wz-card-title">📅 Reporting Frequency</div>
        <div class="opt-grid" style="margin-top:8px">${["Monthly","Quarterly","Half-yearly","Annual","Ad-hoc"].map(f =>
          `<div class="opt-chip ${OP.reportingFreq === f ? "sel" : ""}" onclick="opSelChipSingle(this,'reportingFreq','${f}')">${f}</div>`
        ).join("")}</div>
      </div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">
      <div class="wz-card" style="margin:0">
        <div class="wz-card-title">🏛 Board-Level Compliance Committee?</div>
        <div class="yn-pair" style="margin-top:10px">
          <button class="yn-btn ${OP.boardCommittee === "Yes" ? "sel-yes" : ""}" onclick="opYN(this,'boardCommittee','Yes')">✓ Yes</button>
          <button class="yn-btn ${OP.boardCommittee === "No" ? "sel-no" : ""}" onclick="opYN(this,'boardCommittee','No')">✗ Not yet</button>
        </div>
      </div>
      <div class="wz-card" style="margin:0">
        <div class="wz-card-title">⚖ Regulatory Penalties (last 3 yrs)?</div>
        <div class="yn-pair" style="margin-top:10px">
          <button class="yn-btn ${OP.penalties === "Yes" ? "sel-yes" : ""}" onclick="opYN(this,'penalties','Yes')">✓ Yes</button>
          <button class="yn-btn ${OP.penalties === "No" ? "sel-no" : ""}" onclick="opYN(this,'penalties','No')">✗ No</button>
        </div>
      </div>
    </div>
    <div class="wz-card">
      <div class="wz-card-title">🌍 Customer Risk Profile</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        ${[["High-Risk Geography Customers","highRiskGeo"],["PEP (Politically Exposed Persons)","pepCustomers"],["Cross-border Remittances","remittances"],["Sanctions Screening Active","sanctions"]]
          .map(([l, k]) => `
          <div style="background:#f8fafc;border-radius:8px;padding:10px 12px">
            <div style="font-size:12.5px;font-weight:600;margin-bottom:7px">${l}</div>
            <div class="yn-pair">
              <button class="yn-btn ${OP[k] === "Yes" ? "sel-yes" : ""}" onclick="opYN(this,'${k}','Yes')">Yes</button>
              <button class="yn-btn ${OP[k] === "No" ? "sel-no" : ""}" onclick="opYN(this,'${k}','No')">No</button>
            </div>
          </div>`).join("")}
      </div>
    </div>`;
  }

  function wzStepContext() {
    const fields = [
      { key: "bizModelDesc",    title: "Business Model Description",    hint: "How you operate, revenue streams, customer segments, distribution channels.",                   placeholder: "e.g. Universal bank providing retail, corporate and digital banking…" },
      { key: "regObligDesc",    title: "Regulatory Obligations Overview", hint: "Primary regulatory obligations, reporting requirements and key mandates.",                    placeholder: "e.g. Monthly RBI XBRL returns, quarterly Basel III disclosures…" },
      { key: "productsDesc",    title: "Products & Services Detail",    hint: "Unique or niche offerings not covered in structured questions.",                                placeholder: "e.g. Co-branded credit card with IndiGo, specialized NRI investment product…" },
      { key: "complianceRisks", title: "Major Compliance Risks",        hint: "Top compliance risks — helps AI prioritize critical circulars.",                               placeholder: "e.g. Cyber fraud in digital channels, FEMA violations in forex…" },
    ];
    return `
    <div style="background:#eef2ff;border:1px solid #c7d2fe;border-radius:10px;padding:14px 18px;margin-bottom:16px;font-size:13px;color:#3730a3;line-height:1.6">
      🤖 <strong>AI Context Layer</strong> — These descriptions are fed into the AI engine to handle edge cases not captured by structured questions.
    </div>
    ${fields.map(f => `
      <div class="wz-card">
        <div class="wz-card-title">📝 ${f.title}</div>
        <div class="wz-card-sub">${f.hint}</div>
        <textarea class="fg-input" rows="4" style="resize:vertical;font-size:13px;line-height:1.6" placeholder="${f.placeholder}" onchange="OP['${f.key}']=this.value">${OP[f.key] || ""}</textarea>
      </div>`).join("")}
    <div class="wz-card" style="background:linear-gradient(135deg,#f0fdf4,#ecfdf5);border-color:#86efac">
      <div style="display:flex;align-items:center;gap:14px">
        <div style="font-size:36px">🤖</div>
        <div>
          <div style="font-size:15px;font-weight:800;color:#166634;margin-bottom:4px">Ready to generate AI applicability profile</div>
          <div style="font-size:12.5px;color:#166534;line-height:1.6">Once saved, the AI engine will map every applicable circular, obligation and action to your specific profile.</div>
        </div>
      </div>
    </div>`;
  }


  function wzStepDigitalPayments() {
  const paymentSystems = ["UPI","RTGS","NEFT","IMPS","NACH","BBPS","SWIFT","Fastag","NETC"];
  const digitalServices = ["Internet Banking","Mobile Banking","Digital Lending","Video KYC","Account Aggregator (AA)","ONDC Participant","DigiLocker Integration"];
  const ppiTypes = ["Closed PPI","Semi-Closed PPI","Open PPI"];
  return `
  <div class="wz-card">
    <div class="wz-card-title">💳 Payment System Participation</div>
    <div class="wz-card-sub">Select all payment systems your organization participates in.</div>
    <div class="opt-grid">${paymentSystems.map(p =>
      `<div class="opt-chip ${(OP.paymentSystems||[]).includes(p) ? "sel" : ""}" onclick="opToggleArr(this,'paymentSystems','${p}')">${p}</div>`
    ).join("")}</div>
  </div>
  <div class="wz-card">
    <div class="wz-card-title">📱 Digital Services Offered</div>
    <div class="wz-card-sub">Select all digital services your organization offers.</div>
    <div class="opt-grid">${digitalServices.map(d =>
      `<div class="opt-chip ${(OP.digitalServices||[]).includes(d) ? "sel" : ""}" onclick="opToggleArr(this,'digitalServices','${d}')">${d}</div>`
    ).join("")}</div>
  </div>
  <div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:14px">
    <div>
      <div class="fg-lbl" style="margin-bottom:6px">Payment Aggregator</div>
      <div class="yn-pair">
        <button class="yn-btn ${OP.isPA === 'Yes' ? 'sel-yes' : ''}" onclick="opYN(this,'isPA','Yes')">✓ Yes</button>
        <button class="yn-btn ${OP.isPA === 'No' ? 'sel-no' : ''}" onclick="opYN(this,'isPA','No')">✗ No</button>
      </div>
    </div>
    <div>
      <div class="fg-lbl" style="margin-bottom:6px">Payment Gateway</div>
      <div class="yn-pair">
        <button class="yn-btn ${OP.isPG === 'Yes' ? 'sel-yes' : ''}" onclick="opYN(this,'isPG','Yes')">✓ Yes</button>
        <button class="yn-btn ${OP.isPG === 'No' ? 'sel-no' : ''}" onclick="opYN(this,'isPG','No')">✗ No</button>
      </div>
    </div>
    <div>
      <div class="fg-lbl" style="margin-bottom:6px">PPI Issuer</div>
      <div class="yn-pair">
        <button class="yn-btn ${OP.isPPI === 'Yes' ? 'sel-yes' : ''}" onclick="opYN(this,'isPPI','Yes')">✓ Yes</button>
        <button class="yn-btn ${OP.isPPI === 'No' ? 'sel-no' : ''}" onclick="opYN(this,'isPPI','No')">✗ No</button>
      </div>
      ${OP.isPPI === 'Yes' ? `
      <select class="fg-input" style="margin-top:10px" onchange="OP.ppiType=this.value">
        ${["", ...ppiTypes].map(p => `<option value="${p}" ${OP.ppiType === p ? "selected" : ""}>${p || "Select PPI type"}</option>`).join("")}
      </select>` : ""}
    </div>
    <div>
      <div class="fg-lbl" style="margin-bottom:6px">Cross Border Payments</div>
      <div class="yn-pair">
        <button class="yn-btn ${OP.crossBorder === 'Yes' ? 'sel-yes' : ''}" onclick="opYN(this,'crossBorder','Yes')">✓ Yes</button>
        <button class="yn-btn ${OP.crossBorder === 'No' ? 'sel-no' : ''}" onclick="opYN(this,'crossBorder','No')">✗ No</button>
      </div>
    </div>
  </div>`;
}


function wzStepTechnology() {
  const cbsList = ["Finacle","Flexcube","BaNCS","FinnOne","Temenos T24","Intellect","Mifos","Custom Built","Other"];
  const cloudProviders = ["AWS","Azure","GCP","Private Cloud","Hybrid Cloud"];
  const cyberFrameworks = ["ISO 27001","NIST","RBI Cybersecurity Framework","SEBI Cybersecurity Framework","PCI-DSS","SOC 2"];
  return `
  <div class="wz-card">
    <div class="wz-card-title">🏗 Core Banking & Systems</div>
    <div class="wz-card-sub">Primary technology systems powering your operations.</div>
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px">
      <div class="fg" style="margin:0"><label class="fg-lbl">Core Banking System (CBS)</label>
        <select class="fg-input" onchange="OP.cbs=this.value">
          ${["", ...cbsList].map(c => `<option value="${c}" ${OP.cbs === c ? "selected" : ""}>${c || "Select CBS"}</option>`).join("")}
        </select></div>
      <div class="fg" style="margin:0"><label class="fg-lbl">CBS Vendor Name</label>
        <input class="fg-input" value="${OP.cbsVendor || ''}" onchange="OP.cbsVendor=this.value" placeholder="e.g. Infosys Finacle"></div>
      <div class="fg" style="margin:0"><label class="fg-lbl">CBS Version</label>
        <input class="fg-input" value="${OP.cbsVersion || ''}" onchange="OP.cbsVersion=this.value" placeholder="e.g. v11.0"></div>
    </div>
  </div>
  <div class="wz-card">
    <div class="wz-card-title">☁️ Cloud & Infrastructure</div>
    <div class="wz-card-sub">Cloud adoption and data hosting details.</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">
      <div>
        <div class="fg-lbl" style="margin-bottom:6px">Cloud Adopted</div>
        <div class="yn-pair">
          <button class="yn-btn ${OP.cloudAdopted === 'Yes' ? 'sel-yes' : ''}" onclick="opYN(this,'cloudAdopted','Yes')">✓ Yes</button>
          <button class="yn-btn ${OP.cloudAdopted === 'No' ? 'sel-no' : ''}" onclick="opYN(this,'cloudAdopted','No')">✗ No</button>
        </div>
        ${OP.cloudAdopted === 'Yes' ? `
        <div class="opt-grid" style="margin-top:10px">${cloudProviders.map(c =>
          `<div class="opt-chip ${(OP.cloudProviders||[]).includes(c) ? "sel" : ""}" onclick="opToggleArr(this,'cloudProviders','${c}')">${c}</div>`
        ).join("")}</div>` : ""}
      </div>
      <div>
        <div class="fg-lbl" style="margin-bottom:6px">Data Localization Compliant</div>
        <div class="yn-pair">
          <button class="yn-btn ${OP.dataLocalization === 'Yes' ? 'sel-yes' : ''}" onclick="opYN(this,'dataLocalization','Yes')">✓ Yes</button>
          <button class="yn-btn ${OP.dataLocalization === 'No' ? 'sel-no' : ''}" onclick="opYN(this,'dataLocalization','No')">✗ No</button>
        </div>
      </div>
    </div>
  </div>
  <div class="wz-card">
    <div class="wz-card-title">🔒 Cybersecurity & Compliance</div>
    <div class="wz-card-sub">Security frameworks and audit status.</div>
    <div class="opt-grid">${cyberFrameworks.map(f =>
      `<div class="opt-chip ${(OP.cyberFrameworks||[]).includes(f) ? "sel" : ""}" onclick="opToggleArr(this,'cyberFrameworks','${f}')">${f}</div>`
    ).join("")}</div>
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px;margin-top:14px">
      <div>
        <div class="fg-lbl" style="margin-bottom:6px">VAPT Conducted</div>
        <div class="yn-pair">
          <button class="yn-btn ${OP.vapt === 'Yes' ? 'sel-yes' : ''}" onclick="opYN(this,'vapt','Yes')">✓ Yes</button>
          <button class="yn-btn ${OP.vapt === 'No' ? 'sel-no' : ''}" onclick="opYN(this,'vapt','No')">✗ No</button>
        </div>
        ${OP.vapt === 'Yes' ? `<input class="fg-input" type="date" style="margin-top:10px" value="${OP.vaptDate || ''}" onchange="OP.vaptDate=this.value">` : ""}
      </div>
      <div>
        <div class="fg-lbl" style="margin-bottom:6px">SOC Operations</div>
        <div class="yn-pair">
          <button class="yn-btn ${OP.soc === 'Yes' ? 'sel-yes' : ''}" onclick="opYN(this,'soc','Yes')">✓ Yes</button>
          <button class="yn-btn ${OP.soc === 'No' ? 'sel-no' : ''}" onclick="opYN(this,'soc','No')">✗ No</button>
        </div>
      </div>
      <div>
        <div class="fg-lbl" style="margin-bottom:6px">IT Outsourcing</div>
        <div class="yn-pair">
          <button class="yn-btn ${OP.itOutsourcing === 'Yes' ? 'sel-yes' : ''}" onclick="opYN(this,'itOutsourcing','Yes')">✓ Yes</button>
          <button class="yn-btn ${OP.itOutsourcing === 'No' ? 'sel-no' : ''}" onclick="opYN(this,'itOutsourcing','No')">✗ No</button>
        </div>
        ${OP.itOutsourcing === 'Yes' ? `<input class="fg-input" style="margin-top:10px" value="${OP.itVendor || ''}" onchange="OP.itVendor=this.value" placeholder="Vendor name">` : ""}
      </div>
    </div>
  </div>`;
}


function wzStepGovernance() {
  const roles = [
    ["MD / CEO", "ceo"],
    ["Chief Compliance Officer", "cco"],
    ["Chief Risk Officer", "cro"],
    ["Company Secretary", "cs"],
    ["Nodal Officer", "nodal"],
    ["Grievance Redressal Officer", "gro"],
    ["Chief Information Security Officer", "ciso"],
    ["Chief Financial Officer", "cfo"]
  ];
  return `
  <div class="wz-card">
    <div class="wz-card-title">🏛 Board Composition</div>
    <div class="wz-card-sub">Board structure as per regulatory requirements.</div>
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:14px">
      <div class="fg" style="margin:0"><label class="fg-lbl">Total Board Size</label>
        <input class="fg-input" type="number" min="1" value="${OP.boardSize || ''}" onchange="OP.boardSize=this.value" placeholder="e.g. 12"></div>
      <div class="fg" style="margin:0"><label class="fg-lbl">Independent Directors</label>
        <input class="fg-input" type="number" min="0" value="${OP.independentDirectors || ''}" onchange="OP.independentDirectors=this.value" placeholder="e.g. 5"></div>
      <div class="fg" style="margin:0"><label class="fg-lbl">Women Directors</label>
        <input class="fg-input" type="number" min="0" value="${OP.womenDirectors || ''}" onchange="OP.womenDirectors=this.value" placeholder="e.g. 2"></div>
      <div class="fg" style="margin:0"><label class="fg-lbl">Executive Directors</label>
        <input class="fg-input" type="number" min="0" value="${OP.executiveDirectors || ''}" onchange="OP.executiveDirectors=this.value" placeholder="e.g. 3"></div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px;margin-top:14px">
      <div>
        <div class="fg-lbl" style="margin-bottom:6px">Audit Committee</div>
        <div class="yn-pair">
          <button class="yn-btn ${OP.auditCommittee === 'Yes' ? 'sel-yes' : ''}" onclick="opYN(this,'auditCommittee','Yes')">✓ Yes</button>
          <button class="yn-btn ${OP.auditCommittee === 'No' ? 'sel-no' : ''}" onclick="opYN(this,'auditCommittee','No')">✗ No</button>
        </div>
      </div>
      <div>
        <div class="fg-lbl" style="margin-bottom:6px">Risk Management Committee</div>
        <div class="yn-pair">
          <button class="yn-btn ${OP.riskCommittee === 'Yes' ? 'sel-yes' : ''}" onclick="opYN(this,'riskCommittee','Yes')">✓ Yes</button>
          <button class="yn-btn ${OP.riskCommittee === 'No' ? 'sel-no' : ''}" onclick="opYN(this,'riskCommittee','No')">✗ No</button>
        </div>
      </div>
      <div>
        <div class="fg-lbl" style="margin-bottom:6px">Whistleblower Policy</div>
        <div class="yn-pair">
          <button class="yn-btn ${OP.whistleblower === 'Yes' ? 'sel-yes' : ''}" onclick="opYN(this,'whistleblower','Yes')">✓ Yes</button>
          <button class="yn-btn ${OP.whistleblower === 'No' ? 'sel-no' : ''}" onclick="opYN(this,'whistleblower','No')">✗ No</button>
        </div>
      </div>
    </div>
  </div>
  <div class="wz-card">
    <div class="wz-card-title">👤 Key Contacts</div>
    <div class="wz-card-sub">Primary point of contacts for regulatory and compliance matters.</div>
    ${roles.map(([label, key]) => `
    <div style="display:grid;grid-template-columns:180px 1fr 1fr 1fr;gap:14px;margin-bottom:10px;align-items:center">
      <div class="fg-lbl" style="margin:0">${label}</div>
      <div class="fg" style="margin:0">
        <input class="fg-input" value="${OP[key+'Name'] || ''}" onchange="OP['${key}Name']=this.value" placeholder="Full name"></div>
      <div class="fg" style="margin:0">
        <input class="fg-input" type="email" value="${OP[key+'Email'] || ''}" onchange="OP['${key}Email']=this.value" placeholder="Email"></div>
      <div class="fg" style="margin:0">
        <input class="fg-input" type="tel" value="${OP[key+'Phone'] || ''}" onchange="OP['${key}Phone']=this.value" placeholder="Phone"></div>
    </div>`).join("")}
  </div>`;
}


function wzStepDocuments() {
  const docs = [
    ["Certificate of Incorporation", "docCOI", "Issued by MCA / ROC"],
    ["Regulatory License Copy", "docLicense", "RBI / SEBI / IRDAI license"],
    ["Latest Audited Balance Sheet", "docBalanceSheet", "Last financial year"],
    ["Board Resolution", "docBoardRes", "For authorized signatories"],
    ["MoA / AoA", "docMoaAoa", "Memorandum & Articles of Association"],
    ["PAN Card Copy", "docPAN", "Organization PAN"],
    ["GST Certificate", "docGST", "GST registration certificate"],
    ["ISO / Other Certifications", "docISO", "Any compliance certifications"],
  ];
  return `
  <div class="wz-card">
    <div class="wz-card-title">📂 Document Uploads</div>
    <div class="wz-card-sub">Upload all regulatory and compliance documents. Accepted formats: PDF, JPG, PNG. Max 10MB per file.</div>
    ${docs.map(([label, key, hint]) => `
    <div style="display:grid;grid-template-columns:1fr 2fr 160px;gap:14px;align-items:center;padding:10px 0;border-bottom:0.5px solid var(--color-border-tertiary)">
      <div>
        <div style="font-size:13px;font-weight:500;color:var(--color-text-primary)">${label}</div>
        <div style="font-size:11px;color:var(--color-text-secondary);margin-top:2px">${hint}</div>
      </div>
      <div style="font-size:12px;color:var(--color-text-secondary)">
        ${OP[key] ? `<span style="color:var(--color-text-success)">✓ ${OP[key]}</span>` : `<span>No file uploaded</span>`}
      </div>
      <label style="cursor:pointer">
        <input type="file" accept=".pdf,.jpg,.jpeg,.png" style="display:none" onchange="OP['${key}']=this.files[0]?.name; this.closest('.wz-card').querySelector('[data-key=${key}]').textContent='✓ '+this.files[0]?.name">
        <div class="yn-btn" style="text-align:center;padding:6px 12px;font-size:12px">
          ${OP[key] ? '↺ Replace' : '↑ Upload'}
        </div>
      </label>
    </div>`).join("")}
  </div>
  <div class="wz-card">
    <div class="wz-card-title">✅ Profile Completion</div>
    <div class="wz-card-sub">Summary of mandatory documents status.</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:8px">
      ${docs.map(([label, key]) => `
      <div style="display:flex;align-items:center;gap:8px;font-size:13px">
        <span style="color:${OP[key] ? 'var(--color-text-success)' : 'var(--color-text-danger)'}">
          ${OP[key] ? '✓' : '○'}
        </span>
        <span style="color:var(--color-text-${OP[key] ? 'primary' : 'secondary'})">${label}</span>
      </div>`).join("")}
    </div>
  </div>`;
}
  // ─────────────────────────────────────────────
  // WIZARD CONTROLLER
  // ─────────────────────────────────────────────

  let _wzStep = 0;

  const _stepRenderers = [
    wzStepIdentity, wzStepLocations, wzStepEntities,
    wzStepRegulatory, wzStepActivities, wzStepProducts,
    wzStepDeepDive, wzStepRisk, wzStepContext,
  ];

  function wzSaveCurrentInputs() {
    const legalName = document.getElementById("op-legal-name"); if (legalName) OP.legalName = legalName.value;
    const regName   = document.getElementById("op-reg-name");   if (regName)   OP.regName   = regName.value;
    const cin       = document.getElementById("op-cin");         if (cin)       OP.cin        = cin.value;
    const pan       = document.getElementById("op-pan-wz");      if (pan)       OP.panNo      = pan.value;
  }

  function wzRender() {
    const total = WZ_STEPS.length;
    document.getElementById("wz-step-lbl").textContent     = `Step ${_wzStep + 1} of ${total}`;
    document.getElementById("wz-progress-bar").style.width = ((_wzStep + 1) / total * 100) + "%";
    document.getElementById("wz-title").textContent        = `Step ${_wzStep + 1}: ${WZ_STEPS[_wzStep].label}`;
    document.getElementById("wz-back-btn").style.visibility = _wzStep === 0 ? "hidden" : "visible";
    document.getElementById("wz-next-btn").textContent      = _wzStep === total - 1 ? "Save Profile ✓" : "Next Step →";

    document.getElementById("wz-tabs").innerHTML = WZ_STEPS.map((s, i) =>
      `<button class="wz-tab ${i === _wzStep ? "active" : i < _wzStep ? "done" : ""}" onclick="wzGoto(${i})">
        ${i < _wzStep ? "✓ " : ""}${s.icon} ${s.label}
      </button>`
    ).join("");

    document.getElementById("wz-content").innerHTML = _stepRenderers[_wzStep]();
    wzSaveCurrentInputs();
  }

  function wzNext() {
    wzSaveCurrentInputs();
    OP._profileStarted = true;
    if (_wzStep < WZ_STEPS.length - 1) {
      _wzStep++;
      wzRender();
    } else {
      OP._profileSaved = true;
      // Sync ORG_BASIC
      ORG_BASIC.name      = OP.legalName || OP.regName || "Organization";
      ORG_BASIC.industry  = OP.industry  || OP.subSector || "—";
      ORG_BASIC.pan       = OP.panNo     || OP.cin      || "—";
      ORG_BASIC.regulator = OP.regulator || "—";
      if (OP.locations.length) {
        const hq = OP.locations.find(l => l.type && l.type.includes("HQ")) || OP.locations[0];
        ORG_BASIC.address = hq.address || "—";
        ORG_BASIC.city    = hq.city    || "—";
        ORG_BASIC.state   = hq.state   || "—";
      }
      closeProfileWizard();
      toast("Organization profile saved ✓");
      refreshSidebarSteps();
      const sub = document.getElementById("topbar-org-sub");
      if (sub) sub.textContent = `${ORG_BASIC.name} · ${ORG_BASIC.regulator} Regulated · ${ORG_BASIC.city || "India"}`;
    }
    document.querySelector("#op-page-body").scrollTop = 0;
  }

  function wzPrev()   { wzSaveCurrentInputs(); if (_wzStep > 0) { _wzStep--; wzRender(); } }
  function wzGoto(i)  { wzSaveCurrentInputs(); if (i <= _wzStep) { _wzStep = i; wzRender(); } }

  function openProfileWizard(startStep) {
    _wzStep = (startStep !== undefined) ? startStep : 0;
    document.getElementById("op-view-mode").style.display   = "none";
    document.getElementById("op-wizard-mode").style.display = "block";
    wzRender();
  }

  function closeProfileWizard() {
    document.getElementById("op-wizard-mode").style.display = "none";
    document.getElementById("op-view-mode").style.display   = "block";
    renderOrgProfile();
    refreshSidebarSteps();
  }

  // ─────────────────────────────────────────────
  // LOCATION & ENTITY HELPERS
  // ─────────────────────────────────────────────

  function openAddLocationModal() {
    ["loc-name","loc-addr","loc-city","loc-pin"].forEach(id => { const el = document.getElementById(id); if (el) el.value = ""; });
    document.getElementById("loc-type").value      = "";
    document.getElementById("loc-state").value     = "";
    document.getElementById("loc-headcount").value = "";
    document.querySelectorAll("#loc-depts-grid .opt-chip").forEach(c => c.classList.remove("sel"));
    const sel = document.getElementById("loc-entity");
    sel.innerHTML = '<option value="">— Parent Organization —</option>' +
      OP.legalEntities.map(e => `<option value="${e.name}">${e.name}</option>`).join("");
    document.getElementById("addLocationModal").classList.add("show");
  }

  function saveLocation() {
    const name = document.getElementById("loc-name").value.trim();
    const type = document.getElementById("loc-type").value;
    if (!name || !type) { toast("Please enter location name and type", "warn"); return; }
    const depts = [...document.querySelectorAll("#loc-depts-grid .opt-chip.sel")]
      .map(c => c.textContent.replace(/^✓ /, ""));
    OP.locations.push({
      name, type,
      address:    document.getElementById("loc-addr").value.trim(),
      city:       document.getElementById("loc-city").value.trim(),
      state:      document.getElementById("loc-state").value,
      pin:        document.getElementById("loc-pin").value.trim(),
      headcount:  document.getElementById("loc-headcount").value,
      departments: depts,
      entityId:   document.getElementById("loc-entity").value || null,
    });
    closeModal("addLocationModal");
    toast(`${name} added ✓`);
    document.getElementById("wz-content").innerHTML = wzStepLocations();
  }

  function removeLocation(i) {
    OP.locations.splice(i, 1);
    document.getElementById("wz-content").innerHTML = wzStepLocations();
    toast("Location removed");
  }

  function openAddEntityModal() {
    ["le-name","le-cin","le-pan","le-stake","le-license"].forEach(id => { const el = document.getElementById(id); if (el) el.value = ""; });
    document.getElementById("le-type").value  = "";
    document.getElementById("le-reg").value   = "";
    document.getElementById("le-state").value = "";
    document.querySelectorAll("#le-biz-grid .opt-chip").forEach(c => c.classList.remove("sel"));
    const locGrid = document.getElementById("le-locations-grid");
    locGrid.innerHTML = OP.locations.length
      ? OP.locations.map(l =>
          `<div class="opt-chip" onclick="this.classList.toggle('sel')" data-loc="${l.name}">
            📍 ${l.name} <span style="font-size:10px;opacity:.7">${l.city}</span>
          </div>`).join("")
      : '<div style="font-size:12px;color:var(--text3);font-style:italic">Add locations in Step 2 first — they\'ll appear here for assignment.</div>';
    document.getElementById("addEntityModal").classList.add("show");
  }

  function saveLegalEntity() {
    const name = document.getElementById("le-name").value.trim();
    const type = document.getElementById("le-type").value;
    if (!name || !type) { toast("Please enter entity name and type", "warn"); return; }
    const bizLines    = [...document.querySelectorAll("#le-biz-grid .opt-chip.sel")].map(c => c.textContent.replace(/^✓ /, "").trim());
    const assignedLocs = [...document.querySelectorAll("#le-locations-grid .opt-chip.sel")].map(c => c.getAttribute("data-loc"));
    OP.legalEntities.push({
      name, type,
      cin:      document.getElementById("le-cin").value.trim(),
      pan:      document.getElementById("le-pan").value.trim(),
      regulator: document.getElementById("le-reg").value,
      license:  document.getElementById("le-license").value.trim(),
      stake:    document.getElementById("le-stake").value,
      bizLines,
      locations: assignedLocs,
      state:    document.getElementById("le-state").value,
    });
    assignedLocs.forEach(locName => {
      const loc = OP.locations.find(l => l.name === locName);
      if (loc) loc.entityId = name;
    });
    closeModal("addEntityModal");
    toast(`${name} added ✓`);
    document.getElementById("wz-content").innerHTML = wzStepEntities();
  }

  function removeLegalEntity(i) {
    OP.legalEntities.splice(i, 1);
    document.getElementById("wz-content").innerHTML = wzStepEntities();
    toast("Entity removed");
  }

  function addDepartment() {
    const name = document.getElementById("new-dept-name").value.trim();
    if (!name) return;
    if (!OP.departments.find(d => d.name === name)) {
      OP.departments.push({ name, head: document.getElementById("new-dept-head").value.trim(), functions: [] });
    }
    document.getElementById("new-dept-name").value = "";
    document.getElementById("new-dept-head").value = "";
    document.getElementById("wz-content").innerHTML = wzStepLocations();
    toast(`Department "${name}" added ✓`);
  }

  function quickAddDept(el, name) {
    const idx = OP.departments.findIndex(d => d.name === name);
    if (idx === -1) {
      OP.departments.push({ name, head: "", functions: [] });
      el.classList.add("sel");
      toast(`${name} added ✓`);
    } else {
      OP.departments.splice(idx, 1);
      el.classList.remove("sel");
      toast(`${name} removed`);
    }
    document.getElementById("wz-content").innerHTML = wzStepLocations();
  }

  function removeDept(i) {
    OP.departments.splice(i, 1);
    document.getElementById("wz-content").innerHTML = wzStepLocations();
  }

  function addDivision() {
    const name = document.getElementById("new-div-name").value.trim();
    if (!name) return;
    OP.divisions.push({ name, description: document.getElementById("new-div-desc").value.trim() });
    document.getElementById("new-div-name").value = "";
    document.getElementById("new-div-desc").value = "";
    document.getElementById("wz-content").innerHTML = wzStepLocations();
    toast(`Division "${name}" added ✓`);
  }

  function removeDivision(i) {
    OP.divisions.splice(i, 1);
    document.getElementById("wz-content").innerHTML = wzStepLocations();
  }

  // ─────────────────────────────────────────────
  // INPUT HELPERS
  // ─────────────────────────────────────────────

  function opSel(el, key, val) {
    OP[key] = val;
    el.closest(".radio-grid").querySelectorAll(".radio-card").forEach(c => c.classList.remove("sel"));
    el.classList.add("sel");
  }

  function opSelChipSingle(el, key, val) {
    OP[key] = val;
    el.closest(".opt-grid").querySelectorAll(".opt-chip").forEach(c => c.classList.remove("sel"));
    el.classList.add("sel");
  }

  function opSelChipDeep(el, key, val) {
    OP.deepDive[key] = val;
    el.closest(".opt-grid").querySelectorAll(".opt-chip").forEach(c => c.classList.remove("sel"));
    el.classList.add("sel");
  }

  function opToggleArr(el, key, val) {
    if (!OP[key]) OP[key] = [];
    const i = OP[key].indexOf(val);
    if (i > -1) OP[key].splice(i, 1); else OP[key].push(val);
    el.classList.toggle("sel");
  }

  function opToggleDeepArr(el, key, val) {
    if (!OP.deepDive[key]) OP.deepDive[key] = [];
    const i = OP.deepDive[key].indexOf(val);
    if (i > -1) OP.deepDive[key].splice(i, 1); else OP.deepDive[key].push(val);
    el.classList.toggle("sel");
  }

  function opYN(el, key, val) {
    OP[key] = val;
    el.closest(".yn-pair").querySelectorAll(".yn-btn").forEach(b => b.className = "yn-btn");
    el.classList.add(val === "Yes" ? "sel-yes" : "sel-no");
  }

  function opYNDeep(el, key, val) {
    OP.deepDive[key] = val;
    el.closest(".yn-pair").querySelectorAll(".yn-btn").forEach(b => b.className = "yn-btn");
    el.classList.add(val === "Yes" ? "sel-yes" : "sel-no");
  }

  // ─────────────────────────────────────────────
  // EXPORTS
  // ─────────────────────────────────────────────

  global.WZ_STEPS         = WZ_STEPS;
  global.WZ_IDX           = WZ_IDX;
  global.COMPLETION_STEPS = COMPLETION_STEPS;
  global.calcCompletion   = calcCompletion;

  global.openProfileWizard  = openProfileWizard;
  global.closeProfileWizard = closeProfileWizard;
  global.wzNext             = wzNext;
  global.wzPrev             = wzPrev;
  global.wzGoto             = wzGoto;
  global.renderOrgProfile   = renderOrgProfile;
  global.refreshSidebarSteps = refreshSidebarSteps;

  global.openAddLocationModal = openAddLocationModal;
  global.saveLocation         = saveLocation;
  global.removeLocation       = removeLocation;
  global.openAddEntityModal   = openAddEntityModal;
  global.saveLegalEntity      = saveLegalEntity;
  global.removeLegalEntity    = removeLegalEntity;
  global.addDepartment        = addDepartment;
  global.quickAddDept         = quickAddDept;
  global.removeDept           = removeDept;
  global.addDivision          = addDivision;
  global.removeDivision       = removeDivision;

  global.opSel            = opSel;
  global.opSelChipSingle  = opSelChipSingle;
  global.opSelChipDeep    = opSelChipDeep;
  global.opToggleArr      = opToggleArr;
  global.opToggleDeepArr  = opToggleDeepArr;
  global.opYN             = opYN;
  global.opYNDeep         = opYNDeep;

})(window);