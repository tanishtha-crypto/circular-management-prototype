/**
 * orgProfile.js  (v3 — enhanced UI)
 *
 * DEPENDENCIES (must exist on window before this script runs):
 *   - OP               : org profile state object
 *   - ORG_BASIC        : simple org summary object
 *   - toast(msg, type) : toast utility
 *   - closeModal(id)   : modal close utility
 */

(function (global) {
  "use strict";

  // ─────────────────────────────────────────────
  // COMPLETION
  // ─────────────────────────────────────────────

  function calcCompletion() {
    const checks = [
      OP.legalName || OP.regName,
      OP.orgType,
      OP.industry,
      OP.regulator,
      OP.businessScale,
      OP.locations && OP.locations.length > 0,
      OP.panNo || OP.cin,
      OP.registeredAddress,
    ];
    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  }

  // ─────────────────────────────────────────────
  // ENTITY DETAIL COMPLETION
  // ─────────────────────────────────────────────

  const ENTITY_DETAIL_FIELDS = [
    { key: "cin",          label: "CIN" },
    { key: "pan",          label: "PAN" },
    { key: "gstin",        label: "GSTIN" },
    { key: "address",      label: "Address" },
    { key: "employeeSize", label: "Employee Size" },
    { key: "licenseNo",    label: "License No." },
  ];

  function entityCompletion(e) {
    const filled = ENTITY_DETAIL_FIELDS.filter(f => e[f.key] && String(e[f.key]).trim()).length;
    return { filled, total: ENTITY_DETAIL_FIELDS.length };
  }

  function entityStatusBadge(e) {
    const { filled, total } = entityCompletion(e);
    const pct = filled / total;
    if (pct >= 0.8) return { dot: "✓", label: "Complete",    cls: "ent-badge-green", color: "#16a34a" };
    if (pct >= 0.4) return { dot: "◐", label: "In Progress", cls: "ent-badge-amber", color: "#d97706" };
    return              { dot: "○", label: "Incomplete",   cls: "ent-badge-red",   color: "#dc2626" };
  }

  // ─────────────────────────────────────────────
  // SIDEBAR
  // ─────────────────────────────────────────────

  function refreshSidebarSteps() {
    const pct  = calcCompletion();
    const mini = document.getElementById("sb-op-mini");
    if (mini) {
      mini.style.display = "block";
      document.getElementById("sb-op-mini-pct").textContent  = pct + "%";
      document.getElementById("sb-op-mini-fill").style.width = pct + "%";
      document.getElementById("sb-op-mini-label").textContent =
        pct >= 80 ? "Profile complete ✓" : "Profile incomplete";
    }
  }

  // ─────────────────────────────────────────────
  // MAIN RENDER
  // ─────────────────────────────────────────────

  function renderOrgProfile() {
    const root = document.getElementById("op-view-mode");
    if (!root) return;
    root.style.display = "block";

    const pct = calcCompletion();

    root.innerHTML = `
      <div class="op3-wrap">

        <!-- ── IDENTITY SECTION ── -->
        <div class="op3-section-row">
          <div class="op3-section-label">
            <span class="op3-sec-dot"></span>
            Organization Identity
          </div>
          <button class="op3-edit-btn" onclick="openIdentityEdit()">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            Edit Details
          </button>
        </div>

        <div class="op3-identity-card" id="op2-identity-card">
          ${renderIdentityCard(pct)}
        </div>

        <!-- ── ENTITIES SECTION ── -->
        <div class="op3-section-row" style="margin-top:36px">
          <div class="op3-section-label">
            <span class="op3-sec-dot"></span>
            Legal Entities
            ${OP.legalEntities.length > 0 ? `<span class="op3-count-pill">${OP.legalEntities.length}</span>` : ""}
          </div>
          <button class="op3-add-btn" onclick="openAddEntityModal()">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add Entity
          </button>
        </div>

        ${renderEntityList()}

      </div>

      <!-- ── IDENTITY EDIT PANEL (hidden) ── -->
      <div id="op2-identity-edit" class="op3-edit-panel" style="display:none">
        ${renderIdentityEditForm()}
      </div>
    `;

    refreshSidebarSteps();
  }

  // ─────────────────────────────────────────────
  // IDENTITY CARD — New Design
  // ─────────────────────────────────────────────

  function renderIdentityCard(pct) {
    const name    = OP.legalName || OP.regName || "—";
    const initial = (name !== "—" ? name[0] : "O").toUpperCase();
    const hq      = (OP.locations || []).find(l => l.type && l.type.includes("HQ")) || OP.locations?.[0] || null;
    const isNew   = !OP.legalName && !OP.regName;

    const leftFields = [
      { icon: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`,  label: "Legal Name",       value: OP.legalName || null },
      { icon: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`, label: "Industry",         value: OP.industry || null },
      { icon: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`,                                                             label: "Business Scale",   value: OP.businessScale || null },
      { icon: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,           label: "Registered Address", value: OP.registeredAddress || (hq ? [hq.address, hq.city, hq.state].filter(Boolean).join(", ") : null) },
    ];

    const rightFields = [
      { icon: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`, label: "Org Type",         value: OP.orgType || null },
      { icon: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,                                                                        label: "Primary Regulator", value: OP.regulator || null },
      { icon: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`, label: "PAN / CIN",         value: [OP.panNo, OP.cin].filter(Boolean).join(" · ") || null },
      { icon: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`,                                     label: "State / Location",  value: hq?.state || (OP.locations?.length ? OP.locations.map(l=>l.state||l.city).filter(Boolean).slice(0,2).join(", ") : null) },
    ];

    const bizLines = (OP.businessLines || []).slice(0, 8);

    if (isNew) {
      return `
        <div class="icard3-empty">
          <div class="icard3-empty-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
          </div>
          <div class="icard3-empty-title">No identity details yet</div>
          <div class="icard3-empty-sub">Click <strong>Edit Details</strong> to fill in your organization's basic information.</div>
        </div>
      `;
    }

    return `
      <div class="icard3">
        <!-- Hero row -->
        <div class="icard3-hero">
          <div class="icard3-avatar-wrap">
            <div class="icard3-avatar">${initial}</div>
            <div class="icard3-avatar-ring"></div>
          </div>
          <div class="icard3-hero-info">
            <div class="icard3-name">${name}</div>
            <div class="icard3-subtitle">
              ${[OP.orgType, OP.industry].filter(Boolean).map(t => `<span class="icard3-sub-chip">${t}</span>`).join("")}
              ${OP.regulator ? `<span class="icard3-reg-chip">⚖ ${OP.regulator}</span>` : ""}
            </div>
          </div>
          <div class="icard3-completion-wrap">
            <svg class="icard3-ring-svg" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e2e8f0" stroke-width="2.5"/>
              <circle cx="18" cy="18" r="15.9" fill="none"
                stroke="${pct >= 80 ? "#16a34a" : pct >= 40 ? "#d97706" : "#dc2626"}"
                stroke-width="2.5"
                stroke-dasharray="${pct}, 100"
                stroke-dashoffset="25"
                stroke-linecap="round"/>
            </svg>
            <div class="icard3-ring-label">
              <span class="icard3-ring-pct" style="color:${pct >= 80 ? "#16a34a" : pct >= 40 ? "#d97706" : "#dc2626"}">${pct}%</span>
            </div>
          </div>
        </div>

        <!-- Divider -->
        <div class="icard3-divider"></div>

        <!-- Fields grid -->
        <div class="icard3-fields">
          <div class="icard3-col">
            ${leftFields.map(f => renderField3(f)).join("")}
          </div>
          <div class="icard3-col-sep"></div>
          <div class="icard3-col">
            ${rightFields.map(f => renderField3(f)).join("")}
          </div>
        </div>

        ${bizLines.length ? `
        <!-- Business lines -->
        <div class="icard3-divider"></div>
        <div class="icard3-biz-row">
          <span class="icard3-biz-label">Business Lines</span>
          <div class="icard3-biz-tags">
            ${bizLines.map(b => `<span class="icard3-biz-tag">${b}</span>`).join("")}
            ${(OP.businessLines||[]).length > 8 ? `<span class="icard3-biz-tag icard3-biz-more">+${OP.businessLines.length - 8}</span>` : ""}
          </div>
        </div>
        ` : ""}
      </div>
    `;
  }

  function renderField3(f) {
    const hasVal = f.value && String(f.value).trim() && f.value !== "—";
    return `
      <div class="icard3-field">
        <div class="icard3-field-lbl">
          ${f.icon}
          <span>${f.label}</span>
        </div>
        <div class="icard3-field-val ${hasVal ? "" : "icard3-empty"}">${hasVal ? f.value : "Not set"}</div>
      </div>
    `;
  }

  // ─────────────────────────────────────────────
  // IDENTITY EDIT FORM
  // ─────────────────────────────────────────────

  const BIZ_LINES = ["Retail Banking","Corporate Banking","Treasury","Digital Banking","Lending","Cards","Wealth Management","Insurance Distribution","Mutual Fund Dist.","Payment Services","Forex Services","NRI Services","Priority Sector","Correspondent Banking","MSME Banking"];

  function renderIdentityEditForm() {
    return `
      <div class="op3-section-row">
        <div class="op3-section-label">
          <span class="op3-sec-dot"></span>
          Edit Organization Identity
        </div>
        <div style="display:flex;gap:10px">
          <button class="op3-cancel-btn" onclick="cancelIdentityEdit()">Cancel</button>
          <button class="op3-save-btn" onclick="saveIdentityEdit()">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            Save Changes
          </button>
        </div>
      </div>

      <div class="op3-form-card">
        <div class="op3-form-section-title">Basic Information</div>
        <div class="ief-grid-3">
          <div class="ief-fg"><label class="ief-lbl">Legal Name <span class="req">*</span></label>
            <input class="ief-input" id="ief-legal-name" value="${OP.legalName || ""}" placeholder="As per regulatory records"></div>
          <div class="ief-fg"><label class="ief-lbl">Registered Name (MCA)</label>
            <input class="ief-input" id="ief-reg-name" value="${OP.regName || ""}" placeholder="As per incorporation"></div>
          <div class="ief-fg"><label class="ief-lbl">Brand / Trade Name</label>
            <input class="ief-input" id="ief-brand" value="${OP.brandName || ""}" placeholder="e.g. HDFC Bank"></div>
        </div>

        <div class="op3-form-section-title" style="margin-top:18px">Classification</div>
        <div class="ief-grid-3">
          <div class="ief-fg"><label class="ief-lbl">Organization Type <span class="req">*</span></label>
            <select class="ief-input" id="ief-org-type">
              ${["","Bank","NBFC","FinTech","Insurance Company","Mutual Fund / AMC","Stock Broker","Depository Participant","Payment Aggregator","Corporate","Government / PSU","Other"]
                .map(t => `<option value="${t}" ${OP.orgType===t?"selected":""}>${t||"Select type"}</option>`).join("")}
            </select></div>
          <div class="ief-fg"><label class="ief-lbl">Industry <span class="req">*</span></label>
            <select class="ief-input" id="ief-industry">
              ${["","Banking & Financial Services","Insurance","Capital Markets","Payments & Fintech","Asset Management","Microfinance","Housing Finance","Other"]
                .map(t => `<option value="${t}" ${OP.industry===t?"selected":""}>${t||"Select industry"}</option>`).join("")}
            </select></div>
          <div class="ief-fg"><label class="ief-lbl">Business Scale</label>
            <select class="ief-input" id="ief-biz-scale">
              ${["","Micro (< 10 Cr AUM)","Small (10–100 Cr)","Mid (100 Cr – 1,000 Cr)","Large (1,000–10,000 Cr)","Enterprise (> 10,000 Cr)"]
                .map(t => `<option value="${t}" ${OP.businessScale===t?"selected":""}>${t||"Select scale"}</option>`).join("")}
            </select></div>
        </div>

        <div class="op3-form-section-title" style="margin-top:18px">Regulatory & Tax IDs</div>
        <div class="ief-grid-3">
          <div class="ief-fg"><label class="ief-lbl">Primary Regulator</label>
            <select class="ief-input" id="ief-regulator">
              ${["","RBI","SEBI","IRDAI","MCA","PFRDA","IFSCA","NHB","NABARD","Other"]
                .map(t => `<option value="${t}" ${OP.regulator===t?"selected":""}>${t||"Select regulator"}</option>`).join("")}
            </select></div>
          <div class="ief-fg"><label class="ief-lbl">PAN Number</label>
            <input class="ief-input" id="ief-pan" value="${OP.panNo || ""}" placeholder="e.g. AAACH2702H"></div>
          <div class="ief-fg"><label class="ief-lbl">CIN / Registration ID</label>
            <input class="ief-input" id="ief-cin" value="${OP.cin || ""}" placeholder="e.g. L65920MH1994PLC080618"></div>
        </div>
        <div class="ief-grid-3">
          <div class="ief-fg"><label class="ief-lbl">GST Number</label>
            <input class="ief-input" id="ief-gst" value="${OP.gst || ""}" placeholder="e.g. 27AAACH2702H1Z5"></div>
          <div class="ief-fg"><label class="ief-lbl">LEI Number</label>
            <input class="ief-input" id="ief-lei" value="${OP.lei || ""}" placeholder="20-character LEI code"></div>
          <div class="ief-fg"><label class="ief-lbl">Operational Since</label>
            <input class="ief-input" type="date" id="ief-op-since" value="${OP.operationalSince || ""}"></div>
        </div>

        <div class="op3-form-section-title" style="margin-top:18px">Address</div>
        <div class="ief-fg"><label class="ief-lbl">Registered Address</label>
          <textarea class="ief-input" id="ief-reg-addr" rows="2" placeholder="As per MCA / regulator records">${OP.registeredAddress || ""}</textarea></div>

        <div class="op3-form-section-title" style="margin-top:18px">Business Lines</div>
        <div class="ief-chips" id="ief-biz-lines">
          ${BIZ_LINES.map(b => `<div class="ief-chip ${(OP.businessLines||[]).includes(b)?"sel":""}" onclick="this.classList.toggle('sel')">${b}</div>`).join("")}
        </div>
      </div>
    `;
  }

  function openIdentityEdit() {
    document.getElementById("op2-identity-card").style.display    = "none";
    document.querySelector(".op3-section-row").style.display      = "none";
    const panel = document.getElementById("op2-identity-edit");
    panel.innerHTML = renderIdentityEditForm();
    panel.style.display = "block";
  }
  global.openIdentityEdit = openIdentityEdit;

  function cancelIdentityEdit() {
    document.getElementById("op2-identity-edit").style.display   = "none";
    document.getElementById("op2-identity-card").style.display   = "block";
    document.querySelector(".op3-section-row").style.display      = "flex";
  }
  global.cancelIdentityEdit = cancelIdentityEdit;

  function saveIdentityEdit() {
    OP.legalName         = document.getElementById("ief-legal-name").value.trim();
    OP.regName           = document.getElementById("ief-reg-name").value.trim();
    OP.brandName         = document.getElementById("ief-brand").value.trim();
    OP.orgType           = document.getElementById("ief-org-type").value;
    OP.industry          = document.getElementById("ief-industry").value;
    OP.businessScale     = document.getElementById("ief-biz-scale").value;
    OP.regulator         = document.getElementById("ief-regulator").value;
    OP.panNo             = document.getElementById("ief-pan").value.trim();
    OP.cin               = document.getElementById("ief-cin").value.trim();
    OP.gst               = document.getElementById("ief-gst").value.trim();
    OP.lei               = document.getElementById("ief-lei").value.trim();
    OP.operationalSince  = document.getElementById("ief-op-since").value;
    OP.registeredAddress = document.getElementById("ief-reg-addr").value.trim();
    OP.businessLines     = [...document.querySelectorAll("#ief-biz-lines .ief-chip.sel")].map(c => c.textContent);

    OP._profileStarted = true;
    if (typeof toast === "function") toast("Identity details saved ✓");
    renderOrgProfile();
    refreshSidebarSteps();
  }
  global.saveIdentityEdit = saveIdentityEdit;

  // ─────────────────────────────────────────────
  // ENTITY LIST — New Design
  // ─────────────────────────────────────────────

  function renderEntityList() {
    if (!OP.legalEntities || OP.legalEntities.length === 0) {
      return `
        <div class="ent3-empty">
          <div class="ent3-empty-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          </div>
          <div class="ent3-empty-title">No legal entities added yet</div>
          <div class="ent3-empty-sub">Add subsidiaries, JVs, associates or divisions to map your group structure.</div>
          <button class="op3-add-btn" onclick="openAddEntityModal()">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add First Entity
          </button>
        </div>
      `;
    }

    return `
      <div class="ent3-grid">
        ${OP.legalEntities.map((e, i) => renderEntityCard(e, i)).join("")}
      </div>
    `;
  }

  function renderEntityCard(e, i) {
    const { filled, total } = entityCompletion(e);
    const pct   = Math.round(filled / total * 100);
    const badge = entityStatusBadge(e);
    const typeColors = {
      "Wholly Owned Subsidiary": { bg: "#f0f9ff", border: "#bae6fd", text: "#0369a1", dot: "#38bdf8" },
      "Joint Venture (JV)":      { bg: "#fff7ed", border: "#fed7aa", text: "#c2410c", dot: "#fb923c" },
      "Associate Company":       { bg: "#f0fdf4", border: "#bbf7d0", text: "#15803d", dot: "#4ade80" },
      "Division":                { bg: "#faf5ff", border: "#e9d5ff", text: "#7e22ce", dot: "#c084fc" },
      "Branch":                  { bg: "#eff6ff", border: "#bfdbfe", text: "#1d4ed8", dot: "#60a5fa" },
      "SPV":                     { bg: "#fdf4ff", border: "#f5d0fe", text: "#86198f", dot: "#e879f9" },
    };
    const tc = typeColors[e.type] || { bg: "#f8fafc", border: "#e2e8f0", text: "#475569", dot: "#94a3b8" };

    const segColors = [
      "#3b82f6","#8b5cf6","#ec4899","#f59e0b","#10b981","#ef4444","#6366f1","#14b8a6"
    ];
    const segColor = segColors[i % segColors.length];

    return `
      <div class="ent3-card" id="ent-card-${i}" style="--ent-accent:${segColor}">
        <div class="ent3-card-accent-bar"></div>

        <div class="ent3-card-head">
          <div class="ent3-avatar" style="background:${segColor}15;color:${segColor}">
            ${(e.name?.[0] || "E").toUpperCase()}
          </div>
          <div class="ent3-head-info">
            <div class="ent3-name">${e.name}</div>
            <div class="ent3-chips">
              ${e.type ? `<span class="ent3-type-chip" style="background:${tc.bg};border-color:${tc.border};color:${tc.text}">
                <span style="width:5px;height:5px;border-radius:50%;background:${tc.dot};display:inline-block;margin-right:4px"></span>
                ${e.type}
              </span>` : ""}
              ${e.regulator ? `<span class="ent3-reg-chip">${e.regulator}</span>` : ""}
            </div>
          </div>
          <button class="ent3-remove" onclick="removeEntity(${i})" title="Remove entity">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="ent3-card-body">
          ${e.state || e.city ? `
          <div class="ent3-info-row">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            <span>${[e.state, e.city].filter(Boolean).join(", ")}</span>
          </div>` : ""}
          ${e.businessActivities && e.businessActivities.length ? `
          <div class="ent3-activities">
            ${e.businessActivities.slice(0,3).map(a=>`<span class="ent3-act-tag">${a}</span>`).join("")}
            ${e.businessActivities.length>3?`<span class="ent3-act-tag ent3-act-more">+${e.businessActivities.length-3}</span>`:""}
          </div>` : ""}
        </div>

        <div class="ent3-card-foot">
          <div class="ent3-progress">
            <div class="ent3-progress-track">
              <div class="ent3-progress-fill" style="width:${pct}%;background:${segColor}"></div>
            </div>
            <span class="ent3-progress-txt" style="color:${badge.color}">${badge.dot} ${filled}/${total} fields</span>
          </div>
          <button class="ent3-cta" onclick="openEntityDetail(${i})" style="--cta-color:${segColor}">
            Fill Details
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </button>
        </div>
      </div>
    `;
  }

  // ─────────────────────────────────────────────
  // ADD ENTITY MODAL
  // ─────────────────────────────────────────────

  const ENTITY_ACTIVITIES = ["Retail Banking","Corporate Banking","Lending","Insurance","Investment Advisory","Payment Services","Forex / FX","Trade Finance","Wealth Management","Asset Management","Microfinance","Fintech / Digital","Custodial Services","Other"];

  function openAddEntityModal() {
    let modal = document.getElementById("op2-add-entity-modal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "op2-add-entity-modal";
      modal.className = "op3-modal-overlay";
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="op3-modal">
        <div class="op3-modal-head">
          <div>
            <div class="op3-modal-title">Add Legal Entity</div>
            <div class="op3-modal-sub">Register a subsidiary, JV, associate or division</div>
          </div>
          <button class="op3-modal-close" onclick="document.getElementById('op2-add-entity-modal').style.display='none'">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div class="op3-modal-body">
          <div class="ief-grid-2">
            <div class="ief-fg"><label class="ief-lbl">Entity Name <span class="req">*</span></label>
              <input class="ief-input" id="aem-name" placeholder="e.g. HDFC Securities Ltd"></div>
            <div class="ief-fg"><label class="ief-lbl">Entity Type <span class="req">*</span></label>
              <select class="ief-input" id="aem-type">
                <option value="">Select type</option>
                ${["Wholly Owned Subsidiary","Joint Venture (JV)","Associate Company","Division","Branch","SPV","Partnership Firm","Trust","Other"]
                  .map(t => `<option value="${t}">${t}</option>`).join("")}
              </select></div>
          </div>
          <div class="ief-grid-3">
            <div class="ief-fg"><label class="ief-lbl">State</label>
              <select class="ief-input" id="aem-state">
                <option value="">Select state</option>
                ${["Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal","Delhi","Chandigarh","Puducherry","Other"]
                  .map(s => `<option value="${s}">${s}</option>`).join("")}
              </select></div>
            <div class="ief-fg"><label class="ief-lbl">City</label>
              <input class="ief-input" id="aem-city" placeholder="e.g. Mumbai"></div>
            <div class="ief-fg"><label class="ief-lbl">Regulator</label>
              <select class="ief-input" id="aem-regulator">
                <option value="">Select regulator</option>
                ${["RBI","SEBI","IRDAI","MCA","PFRDA","IFSCA","NHB","NABARD","FIU-IND","None / Not Applicable"]
                  .map(r => `<option value="${r}">${r}</option>`).join("")}
              </select></div>
          </div>
          <div class="ief-fg"><label class="ief-lbl">Business Activities</label>
            <div class="ief-chips" id="aem-activities">
              ${ENTITY_ACTIVITIES.map(a => `<div class="ief-chip" onclick="this.classList.toggle('sel')">${a}</div>`).join("")}
            </div>
          </div>
        </div>
        <div class="op3-modal-foot">
          <button class="op3-cancel-btn" onclick="document.getElementById('op2-add-entity-modal').style.display='none'">Cancel</button>
          <button class="op3-save-btn" onclick="saveEntity()">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add Entity
          </button>
        </div>
      </div>
    `;

    modal.style.display = "flex";
  }
  global.openAddEntityModal = openAddEntityModal;

  function saveEntity() {
    const name = document.getElementById("aem-name").value.trim();
    const type = document.getElementById("aem-type").value;
    if (!name || !type) { if (typeof toast==="function") toast("Please enter entity name and type", "warn"); return; }

    const activities = [...document.querySelectorAll("#aem-activities .ief-chip.sel")].map(c => c.textContent);

    OP.legalEntities.push({
      name, type,
      state:              document.getElementById("aem-state").value,
      city:               document.getElementById("aem-city").value.trim(),
      regulator:          document.getElementById("aem-regulator").value,
      businessActivities: activities,
      cin: "", pan: "", gstin: "", address: "", pin: "",
      employeeSize: "", licenseNo: "", departments: [], customerTypes: [], products: [],
    });

    document.getElementById("op2-add-entity-modal").style.display = "none";
    if (typeof toast==="function") toast(`${name} added ✓`);
    renderOrgProfile();
  }
  global.saveEntity = saveEntity;

  function removeEntity(i) {
    const name = OP.legalEntities[i]?.name || "Entity";
    OP.legalEntities.splice(i, 1);
    if (typeof toast==="function") toast(`${name} removed`);
    renderOrgProfile();
  }
  global.removeEntity = removeEntity;

  // ─────────────────────────────────────────────
  // ENTITY DETAIL MODAL
  // ─────────────────────────────────────────────

  const DEPT_OPTIONS    = ["Compliance","Legal","Risk","Finance","Operations","HR","Audit","Treasury","Technology","Customer Service","IT","Marketing"];
  const CUSTOMER_TYPES  = ["Retail Individuals","HNI / Ultra HNI","MSME","Corporates","Government","NRI / Foreign","Institutional","Other"];
  const PRODUCT_OPTIONS = ["Savings Account","Current Account","Fixed Deposit","Home Loan","Auto Loan","Personal Loan","Business Loan","Credit Card","Debit Card","UPI / Mobile Pay","Insurance Policy","Mutual Fund","Demat Account","Trade Finance (LC/BG)","PMS","Other"];

  function openEntityDetail(i) {
    const e = OP.legalEntities[i];
    if (!e) return;

    let modal = document.getElementById("op2-detail-modal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "op2-detail-modal";
      modal.className = "op3-modal-overlay";
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="op3-modal op3-modal-wide">
        <div class="op3-modal-head">
          <div>
            <div class="op3-modal-title">${e.name}</div>
            <div class="op3-modal-sub">${e.type || ""}${e.regulator ? " · " + e.regulator : ""}</div>
          </div>
          <div style="display:flex;align-items:center;gap:12px">
            <div id="edm-comp-pill" class="edm3-comp-pill">${renderDetailCompletionPill(e)}</div>
            <button class="op3-modal-close" onclick="document.getElementById('op2-detail-modal').style.display='none'">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        </div>
        <div class="op3-modal-body">

          <div class="edm3-section">Registration & Identification</div>
          <div class="ief-grid-3">
            <div class="ief-fg"><label class="ief-lbl">CIN</label>
              <input class="ief-input" data-field="cin" data-idx="${i}" value="${e.cin||""}" placeholder="e.g. U65910MH2000PLC125580" oninput="liveUpdateEntity(this,${i})"></div>
            <div class="ief-fg"><label class="ief-lbl">PAN</label>
              <input class="ief-input" data-field="pan" data-idx="${i}" value="${e.pan||""}" placeholder="e.g. AAACH2702H" oninput="liveUpdateEntity(this,${i})"></div>
            <div class="ief-fg"><label class="ief-lbl">GSTIN</label>
              <input class="ief-input" data-field="gstin" data-idx="${i}" value="${e.gstin||""}" placeholder="e.g. 27AAACH2702H1Z5" oninput="liveUpdateEntity(this,${i})"></div>
          </div>

          <div class="edm3-section">Address Details</div>
          <div class="ief-grid-2">
            <div class="ief-fg"><label class="ief-lbl">Full Address</label>
              <textarea class="ief-input" data-field="address" data-idx="${i}" rows="2" placeholder="Street, area, landmark" oninput="liveUpdateEntity(this,${i})">${e.address||""}</textarea></div>
            <div class="ief-fg"><label class="ief-lbl">PIN Code</label>
              <input class="ief-input" data-field="pin" data-idx="${i}" value="${e.pin||""}" placeholder="6-digit PIN" oninput="liveUpdateEntity(this,${i})"></div>
          </div>

          <div class="edm3-section">Size & Licensing</div>
          <div class="ief-grid-2">
            <div class="ief-fg"><label class="ief-lbl">Employee Size</label>
              <select class="ief-input" data-field="employeeSize" data-idx="${i}" onchange="liveUpdateEntity(this,${i})">
                ${["","< 50","50–200","200–500","500–1000","1000–5000","5000+"]
                  .map(s => `<option value="${s}" ${e.employeeSize===s?"selected":""}>${s||"Select size"}</option>`).join("")}
              </select></div>
            <div class="ief-fg"><label class="ief-lbl">License Number</label>
              <input class="ief-input" data-field="licenseNo" data-idx="${i}" value="${e.licenseNo||""}" placeholder="Regulatory license no." oninput="liveUpdateEntity(this,${i})"></div>
          </div>

          <div class="edm3-section">Departments</div>
          <div class="ief-chips">
            ${DEPT_OPTIONS.map(d => `<div class="ief-chip ${(e.departments||[]).includes(d)?"sel":""}" onclick="toggleEntityArr(this,${i},'departments','${d}')">${d}</div>`).join("")}
          </div>

          <div class="edm3-section">Customer Types</div>
          <div class="ief-chips">
            ${CUSTOMER_TYPES.map(ct => `<div class="ief-chip ${(e.customerTypes||[]).includes(ct)?"sel":""}" onclick="toggleEntityArr(this,${i},'customerTypes','${ct}')">${ct}</div>`).join("")}
          </div>

          <div class="edm3-section">Products & Services</div>
          <div class="ief-chips">
            ${PRODUCT_OPTIONS.map(p => `<div class="ief-chip ${(e.products||[]).includes(p)?"sel":""}" onclick="toggleEntityArr(this,${i},'products','${p}')">${p}</div>`).join("")}
          </div>

        </div>
        <div class="op3-modal-foot">
          <div style="font-size:12px;color:var(--text3)">Changes save automatically as you type.</div>
          <button class="op3-save-btn" onclick="saveEntityDetail(${i})">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            Save & Close
          </button>
        </div>
      </div>
    `;

    modal.style.display = "flex";
  }
  global.openEntityDetail = openEntityDetail;

  function renderDetailCompletionPill(e) {
    const { filled, total } = entityCompletion(e);
    const badge = entityStatusBadge(e);
    return `<span style="color:${badge.color}">${badge.dot}</span> ${filled}/${total} details complete`;
  }

  function liveUpdateEntity(el, i) {
    const e = OP.legalEntities[i];
    if (!e) return;
    e[el.dataset.field] = el.value;
    const pill = document.getElementById("edm-comp-pill");
    if (pill) pill.innerHTML = renderDetailCompletionPill(e);
    refreshEntityCard(i);
  }
  global.liveUpdateEntity = liveUpdateEntity;

  function toggleEntityArr(el, i, field, val) {
    const e = OP.legalEntities[i];
    if (!e) return;
    if (!e[field]) e[field] = [];
    const idx = e[field].indexOf(val);
    if (idx > -1) e[field].splice(idx, 1); else e[field].push(val);
    el.classList.toggle("sel");
    const pill = document.getElementById("edm-comp-pill");
    if (pill) pill.innerHTML = renderDetailCompletionPill(e);
    refreshEntityCard(i);
  }
  global.toggleEntityArr = toggleEntityArr;

  function refreshEntityCard(i) {
    const card = document.getElementById("ent-card-" + i);
    if (card && OP.legalEntities[i]) {
      card.outerHTML = renderEntityCard(OP.legalEntities[i], i);
    }
  }

  function saveEntityDetail(i) {
    document.getElementById("op2-detail-modal").style.display = "none";
    if (typeof toast==="function") toast("Entity details saved ✓");
    renderOrgProfile();
  }
  global.saveEntityDetail = saveEntityDetail;

  // ─────────────────────────────────────────────
  // LEGACY HELPERS
  // ─────────────────────────────────────────────

  function opYN(el, key, val) {
    OP[key] = val;
    el.closest(".yn-pair").querySelectorAll(".yn-btn").forEach(b => b.className = "yn-btn");
    el.classList.add(val === "Yes" ? "sel-yes" : "sel-no");
  }

  function opToggleArr(el, key, val) {
    if (!OP[key]) OP[key] = [];
    const idx = OP[key].indexOf(val);
    if (idx > -1) OP[key].splice(idx, 1); else OP[key].push(val);
    el.classList.toggle("sel");
  }

  function opSelChipSingle(el, key, val) {
    OP[key] = val;
    el.closest(".opt-grid").querySelectorAll(".opt-chip").forEach(c => c.classList.remove("sel"));
    el.classList.add("sel");
  }

  // ─────────────────────────────────────────────
  // STYLES
  // ─────────────────────────────────────────────

  function injectStyles() {
    if (document.getElementById("op3-styles")) return;
    const style = document.createElement("style");
    style.id = "op3-styles";
    style.textContent = `
      /* ── Wrap ── */
      .op3-wrap { max-width: 960px; }

      /* ── Section header row ── */
      .op3-section-row {
        display: flex; align-items: center; justify-content: space-between;
        margin-bottom: 16px;
      }
      .op3-section-label {
        display: flex; align-items: center; gap: 8px;
        font-size: 11px; font-weight: 800; text-transform: uppercase;
        letter-spacing: .08em; color: var(--text3, #94a3b8);
      }
      .op3-sec-dot {
        width: 6px; height: 6px; border-radius: 50%;
        background: var(--primary, #0f5a7d);
        display: inline-block;
      }
      .op3-count-pill {
        background: var(--primary, #0f5a7d); color: #fff;
        border-radius: 99px; padding: 1px 7px;
        font-size: 10px; font-weight: 800;
      }

      /* ── Buttons ── */
      .op3-edit-btn, .op3-add-btn, .op3-cancel-btn, .op3-save-btn {
        display: inline-flex; align-items: center; gap: 6px;
        border: none; border-radius: 8px; cursor: pointer;
        font-size: 12.5px; font-weight: 700; padding: 7px 14px;
        transition: all .15s; font-family: inherit;
      }
      .op3-edit-btn   { background: #f1f5f9; color: var(--text, #1a1a1a); border: 1px solid #e2e8f0; }
      .op3-add-btn    { background: var(--primary, #0f5a7d); color: #fff; }
      .op3-cancel-btn { background: #f1f5f9; color: var(--text, #1a1a1a); border: 1px solid #e2e8f0; }
      .op3-save-btn   { background: var(--primary, #0f5a7d); color: #fff; }
      .op3-edit-btn:hover, .op3-cancel-btn:hover { background: #e8edf3; }
      .op3-add-btn:hover, .op3-save-btn:hover { opacity: .88; }

      .op3-edit-panel { max-width: 960px; }
      .op3-form-card {
        background: #fff; border: 1px solid var(--border, #e2e8f0);
        border-radius: 14px; padding: 22px 24px;
        box-shadow: 0 1px 4px rgba(0,0,0,.04);
      }
      .op3-form-section-title {
        font-size: 10.5px; font-weight: 800; text-transform: uppercase;
        letter-spacing: .07em; color: var(--text3, #94a3b8);
        margin-bottom: 12px; padding-bottom: 8px;
        border-bottom: 1px solid #f1f5f9;
      }

      /* ── Identity Card ── */
      .icard3 {
        background: #fff; border: 1px solid var(--border, #e2e8f0);
        border-radius: 16px; overflow: hidden;
        box-shadow: 0 1px 8px rgba(0,0,0,.05);
      }
      .icard3-hero {
        display: flex; align-items: center; gap: 18px;
        padding: 22px 24px;
        background: linear-gradient(135deg, #f8fafc 0%, #fff 60%);
      }
      .icard3-avatar-wrap { position: relative; flex-shrink: 0; }
      .icard3-avatar {
        width: 52px; height: 52px; border-radius: 14px;
        background: var(--primary, #0f5a7d); color: #fff;
        display: flex; align-items: center; justify-content: center;
        font-size: 24px; font-weight: 900; position: relative; z-index: 1;
      }
      .icard3-avatar-ring {
        position: absolute; inset: -3px;
        border-radius: 16px;
        border: 1.5px dashed rgba(15,90,125,.2);
        animation: spin-slow 12s linear infinite;
      }
      @keyframes spin-slow { to { transform: rotate(360deg); } }

      .icard3-hero-info { flex: 1; min-width: 0; }
      .icard3-name {
        font-size: 19px; font-weight: 800; color: var(--text, #1a1a1a);
        margin-bottom: 8px; line-height: 1.2;
        white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
      }
      .icard3-subtitle { display: flex; flex-wrap: wrap; gap: 6px; }
      .icard3-sub-chip {
        font-size: 11px; font-weight: 700;
        background: #f1f5f9; color: var(--text, #1a1a1a);
        border-radius: 6px; padding: 3px 9px;
      }
      .icard3-reg-chip {
        font-size: 11px; font-weight: 700;
        background: #e8f4f9; color: var(--primary, #0f5a7d);
        border-radius: 6px; padding: 3px 9px;
        border: 1px solid rgba(15,90,125,.15);
      }

      /* Ring progress */
      .icard3-completion-wrap {
        flex-shrink: 0; position: relative; width: 60px; height: 60px;
      }
      .icard3-ring-svg {
        width: 60px; height: 60px;
        transform: rotate(-90deg);
      }
      .icard3-ring-svg circle { transition: stroke-dasharray .6s ease; }
      .icard3-ring-label {
        position: absolute; inset: 0;
        display: flex; align-items: center; justify-content: center;
      }
      .icard3-ring-pct {
        font-size: 13px; font-weight: 900; line-height: 1;
      }

      .icard3-divider { height: 1px; background: #f1f5f9; margin: 0 24px; }

      /* Fields */
      .icard3-fields {
        display: grid; grid-template-columns: 1fr 1px 1fr;
        gap: 0; padding: 20px 24px;
      }
      .icard3-col { display: flex; flex-direction: column; gap: 2px; }
      .icard3-col-sep { background: #f1f5f9; margin: 0 20px; }

      .icard3-field {
        padding: 10px 0;
        border-bottom: 1px solid #f8fafc;
      }
      .icard3-field:last-child { border-bottom: none; }
      .icard3-field-lbl {
        display: flex; align-items: center; gap: 5px;
        font-size: 10px; font-weight: 700;
        text-transform: uppercase; letter-spacing: .05em;
        color: var(--text3, #94a3b8); margin-bottom: 4px;
      }
      .icard3-field-lbl svg { opacity: .6; flex-shrink: 0; }
      .icard3-field-val {
        font-size: 13px; font-weight: 600; color: var(--text, #1a1a1a);
        padding-left: 17px;
      }
      .icard3-empty {
        color: #cbd5e1 !important; font-weight: 500 !important;
        font-style: italic;
      }

      /* Biz lines */
      .icard3-biz-row {
        display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
        padding: 16px 24px;
        background: #fafbff;
      }
      .icard3-biz-label {
        font-size: 10px; font-weight: 800; text-transform: uppercase;
        letter-spacing: .06em; color: var(--text3); flex-shrink: 0;
      }
      .icard3-biz-tags { display: flex; flex-wrap: wrap; gap: 6px; }
      .icard3-biz-tag {
        font-size: 11px; font-weight: 600; padding: 3px 10px;
        border-radius: 99px; background: #f1f5f9; color: var(--text);
        border: 1px solid #e8edf3;
      }
      .icard3-biz-more {
        background: #e8f4f9; color: var(--primary); border-color: rgba(15,90,125,.2);
      }

      /* Empty state */
      .icard3-empty {
        text-align: center; padding: 48px 24px;
        border: 1px solid var(--border, #e2e8f0); border-radius: 16px;
        background: #fafbff;
      }
      .icard3-empty-icon {
        width: 56px; height: 56px; border-radius: 16px;
        background: #f1f5f9; color: var(--text3);
        display: inline-flex; align-items: center; justify-content: center;
        margin-bottom: 14px;
      }
      .icard3-empty-title {
        font-size: 15px; font-weight: 800; color: var(--text); margin-bottom: 6px;
      }
      .icard3-empty-sub {
        font-size: 13px; color: var(--text3); line-height: 1.6; max-width: 320px; margin: 0 auto;
      }

      /* ── Entity Grid ── */
      .ent3-empty {
        border: 2px dashed #e2e8f0; border-radius: 16px;
        padding: 48px 24px; text-align: center;
        background: #fafbff;
      }
      .ent3-empty-icon {
        width: 56px; height: 56px; border-radius: 16px;
        background: #f1f5f9; color: var(--text3);
        display: inline-flex; align-items: center; justify-content: center;
        margin-bottom: 14px;
      }
      .ent3-empty-title { font-size: 15px; font-weight: 800; color: var(--text); margin-bottom: 6px; }
      .ent3-empty-sub   { font-size: 13px; color: var(--text3); line-height: 1.6; margin-bottom: 20px; }

      .ent3-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
        gap: 16px;
      }

      .ent3-card {
        background: #fff;
        border: 1px solid #e8edf3;
        border-radius: 16px;
        overflow: hidden;
        display: flex; flex-direction: column;
        transition: box-shadow .2s, transform .2s;
        position: relative;
      }
      .ent3-card:hover {
        box-shadow: 0 8px 24px rgba(0,0,0,.09);
        transform: translateY(-2px);
      }
      .ent3-card-accent-bar {
        height: 3px;
        background: var(--ent-accent, #3b82f6);
        border-radius: 0;
      }

      .ent3-card-head {
        display: flex; align-items: flex-start; gap: 12px;
        padding: 16px 16px 12px;
      }
      .ent3-avatar {
        width: 40px; height: 40px; border-radius: 11px;
        display: flex; align-items: center; justify-content: center;
        font-size: 18px; font-weight: 900; flex-shrink: 0;
      }
      .ent3-head-info { flex: 1; min-width: 0; }
      .ent3-name {
        font-size: 14px; font-weight: 800; color: var(--text);
        margin-bottom: 6px;
        white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
      }
      .ent3-chips { display: flex; flex-wrap: wrap; gap: 5px; }
      .ent3-type-chip {
        font-size: 10.5px; font-weight: 700;
        border-radius: 99px; padding: 2px 9px;
        border: 1px solid transparent;
        display: inline-flex; align-items: center;
      }
      .ent3-reg-chip {
        font-size: 10.5px; font-weight: 700;
        background: #f0f9ff; color: #0369a1;
        border-radius: 99px; padding: 2px 9px;
        border: 1px solid #bae6fd;
      }

      .ent3-remove {
        border: none; background: none; cursor: pointer;
        color: var(--text3); padding: 4px;
        border-radius: 6px; flex-shrink: 0;
        opacity: .45; transition: all .15s;
        display: flex; align-items: center; justify-content: center;
      }
      .ent3-remove:hover { opacity: 1; color: #ef4444; background: #fff5f5; }

      .ent3-card-body {
        padding: 0 16px 12px;
        display: flex; flex-direction: column; gap: 8px;
        flex: 1;
      }
      .ent3-info-row {
        display: flex; align-items: center; gap: 5px;
        font-size: 12px; font-weight: 500; color: var(--text3);
      }
      .ent3-info-row svg { flex-shrink: 0; }
      .ent3-activities { display: flex; flex-wrap: wrap; gap: 4px; }
      .ent3-act-tag {
        font-size: 10.5px; font-weight: 600;
        background: #f8fafc; border: 1px solid #e8edf3;
        border-radius: 5px; padding: 2px 7px; color: var(--text3);
      }
      .ent3-act-more {
        background: #f0f9ff; border-color: #bae6fd; color: #0369a1;
      }

      .ent3-card-foot {
        padding: 12px 16px;
        border-top: 1px solid #f4f7fb;
        display: flex; align-items: center; justify-content: space-between; gap: 10px;
        background: #fafbff;
      }
      .ent3-progress { flex: 1; }
      .ent3-progress-track {
        height: 3px; background: #e8edf3; border-radius: 99px;
        margin-bottom: 4px; overflow: hidden;
      }
      .ent3-progress-fill {
        height: 100%; border-radius: 99px; transition: width .4s;
      }
      .ent3-progress-txt {
        font-size: 10px; font-weight: 700;
      }

      .ent3-cta {
        display: inline-flex; align-items: center; gap: 5px;
        border: 1.5px solid var(--ent-accent, #3b82f6);
        background: transparent; color: var(--ent-accent, #3b82f6);
        border-radius: 8px; padding: 5px 11px;
        font-size: 11.5px; font-weight: 700; cursor: pointer;
        transition: all .15s; white-space: nowrap; flex-shrink: 0;
        font-family: inherit;
      }
      .ent3-cta:hover {
        background: var(--ent-accent, #3b82f6); color: #fff;
      }

      /* ── Form elements ── */
      .ief-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px; }
      .ief-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px; margin-bottom: 14px; }
      .ief-fg     { display: flex; flex-direction: column; gap: 5px; }
      .ief-lbl    { font-size: 11px; font-weight: 700; color: var(--text3); text-transform: uppercase; letter-spacing: .04em; }
      .req        { color: #ef4444; }
      .ief-input  {
        border: 1.5px solid var(--border, #e2e8f0); border-radius: 8px;
        padding: 8px 11px; font-size: 13px; color: var(--text);
        background: #fff; width: 100%; box-sizing: border-box;
        transition: border-color .15s; font-family: inherit;
      }
      .ief-input:focus { outline: none; border-color: var(--primary, #0f5a7d); box-shadow: 0 0 0 3px rgba(15,90,125,.07); }
      .ief-chips  { display: flex; flex-wrap: wrap; gap: 7px; margin-top: 4px; }
      .ief-chip   {
        border: 1.5px solid #e2e8f0; border-radius: 99px;
        padding: 4px 12px; font-size: 12px; font-weight: 600; cursor: pointer;
        color: var(--text3); background: #fff; transition: all .13s;
        user-select: none;
      }
      .ief-chip.sel {
        background: var(--primary, #0f5a7d); color: #fff;
        border-color: var(--primary, #0f5a7d);
      }
      .ief-chip:hover:not(.sel) { border-color: var(--primary, #0f5a7d); color: var(--primary); }

      /* ── Modals ── */
      .op3-modal-overlay {
        position: fixed; inset: 0;
        background: rgba(15,20,40,.5);
        display: flex; align-items: center; justify-content: center;
        z-index: 9999; padding: 20px;
        backdrop-filter: blur(4px);
      }
      .op3-modal {
        background: #fff; border-radius: 18px;
        width: 100%; max-width: 600px; max-height: 88vh;
        display: flex; flex-direction: column;
        box-shadow: 0 24px 64px rgba(0,0,0,.18);
        animation: op3-modal-in .22s cubic-bezier(.22,.68,0,1.2);
      }
      .op3-modal-wide { max-width: 740px; }
      @keyframes op3-modal-in {
        from { transform: scale(.94) translateY(10px); opacity: 0; }
        to   { transform: none; opacity: 1; }
      }
      .op3-modal-head {
        display: flex; align-items: flex-start; justify-content: space-between;
        padding: 22px 24px 18px; border-bottom: 1px solid #f1f5f9; flex-shrink: 0;
      }
      .op3-modal-title { font-size: 17px; font-weight: 800; color: var(--text); }
      .op3-modal-sub   { font-size: 12.5px; color: var(--text3); margin-top: 3px; }
      .op3-modal-close {
        border: 1px solid #e8edf3; background: #f8fafc; border-radius: 8px;
        width: 30px; height: 30px; cursor: pointer; flex-shrink: 0;
        display: flex; align-items: center; justify-content: center;
        color: var(--text3); transition: all .15s;
      }
      .op3-modal-close:hover { background: #fee2e2; color: #ef4444; border-color: #fca5a5; }
      .op3-modal-body { overflow-y: auto; padding: 22px 24px; flex: 1; }
      .op3-modal-foot {
        display: flex; align-items: center; justify-content: space-between;
        padding: 16px 24px; border-top: 1px solid #f1f5f9; flex-shrink: 0;
        background: #fafbff; border-radius: 0 0 18px 18px;
      }

      /* Detail modal section titles */
      .edm3-section {
        font-size: 10.5px; font-weight: 800; text-transform: uppercase;
        letter-spacing: .07em; color: var(--text3);
        margin: 18px 0 10px; padding-bottom: 7px;
        border-bottom: 1px solid #f1f5f9;
      }
      .edm3-section:first-child { margin-top: 0; }
      .edm3-comp-pill {
        font-size: 12px; font-weight: 700; color: var(--text3);
        background: #f4f7fb; border-radius: 99px; padding: 5px 13px;
        border: 1px solid #e8edf3;
      }
    `;
    document.head.appendChild(style);
  }

  // ─────────────────────────────────────────────
  // EXPORTS
  // ─────────────────────────────────────────────

  global.calcCompletion      = calcCompletion;
  global.refreshSidebarSteps = refreshSidebarSteps;
  global.renderOrgProfile    = renderOrgProfile;
  global.opYN                = opYN;
  global.opToggleArr         = opToggleArr;
  global.opSelChipSingle     = opSelChipSingle;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", injectStyles);
  } else {
    injectStyles();
  }

})(window);