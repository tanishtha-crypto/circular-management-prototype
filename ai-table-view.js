/* ── Table view ── */
window._mlShowTableView = function () {
  window._mlActiveView = 'table';
  var area = document.getElementById('ml-view-area');
  if (!area) return;

  area.innerHTML =
    _mlBuildFilterBar() +
    '<div class="table-card ml-table-card">' +
      '<div class="ml-tbl-toolbar">' +
        '<span class="ml-tbl-count" id="ml-action-count"></span>' +
        '<div style="display:flex;gap:8px;align-items:center;">' +
                  '<div class="ml-row-kebab-wrap" id="ml-toolbar-kebab-wrap">' +
            '<button class="ml-row-kebab-btn" id="ml-toolbar-kebab-btn" style="width:32px;height:32px;font-size:18px;">&#x22EE;</button>' +
            '<div class="ml-row-kebab-menu" id="ml-toolbar-kebab-menu" style="display:none;right:0;top:calc(100% + 4px);">' +
             '<button class="ml-rkm-item" id="ml-toolbar-add-obl-btn">+ Add Obligation</button>' +
'<button class="ml-rkm-item" id="ml-toolbar-add-btn">+ Add Action</button>' +
'<button class="ml-rkm-item" id="ml-dl-template-btn">&#x1F4E5; Export / Download</button>' +

'<label class="ml-rkm-item" style="cursor:pointer;">&#x1F4E4; Import Excel<input type="file" accept=".xlsx,.xls,.csv" style="display:none;" id="ml-excel-upload"/></label>' +
'<button class="ml-rkm-item" id="ml-toolbar-addcols-btn">&#x2295; Add / Remove Columns</button>' +  // ← ADD THIS
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="table-wrapper">' +
        '<table>' +
          '<thead>' +
  // Group row
  '<tr>' +
    
  '</tr>' +
  // Column headers
  '<tr>' +
    '<th>Obl ID</th>' +
    '<th>Obligation</th>' +
    '<th>Action</th>' +
    '<th>Department(s)</th>' +
    '<th>Assigned To</th>' +
    '<th>Assignment Status</th>' +
   '<th>Due Date</th>' +
'<th style="color:#3730a3;text-align:center;min-width:140px;">Linked Reference</th>' +
  '</tr>' +
'</thead>'  +
          '<tbody id="ml-tbody"></tbody>' +
        '</table>' +
      '</div>' +
    '</div>';

  _mlRenderTable(_mlGetFilteredCircs());
  _mlBindFilterBar();

  /* toolbar kebab toggle */
  var tkBtn  = document.getElementById('ml-toolbar-kebab-btn');
  var tkMenu = document.getElementById('ml-toolbar-kebab-menu');
  if (tkBtn && tkMenu) {
    tkBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      tkMenu.style.display = tkMenu.style.display === 'none' ? 'block' : 'none';
    });
    document.addEventListener('click', function() { tkMenu.style.display = 'none'; });
  }

  var dlBtn = document.getElementById('ml-dl-template-btn');
  if (dlBtn) dlBtn.addEventListener('click', function() {
    tkMenu.style.display = 'none';
    _mlOpenExportPopup();
  });

  var addOblBtn = document.getElementById('ml-toolbar-add-obl-btn');
  if (addOblBtn) addOblBtn.addEventListener('click', function() {
    tkMenu.style.display = 'none';
    _mlOpenAddObligationPopup();
  });

  var addBtn = document.getElementById('ml-toolbar-add-btn');
  if (addBtn) addBtn.addEventListener('click', function() {
    tkMenu.style.display = 'none';
    _mlOpenAddActionPopup('', '');
  });

  var upBtn = document.getElementById('ml-excel-upload');
  if (upBtn) upBtn.addEventListener('change', function() {
    showToast('Excel uploaded. Processing action items...', 'success');
  });

  var crossBtn = document.getElementById('ml-toolbar-crosscirc-btn');
if (crossBtn) crossBtn.addEventListener('click', function() {
  tkMenu.style.display = 'none';
  _mlOpenCrossCircularView();
});
var addColsBtn = document.getElementById('ml-toolbar-addcols-btn');
if (addColsBtn) addColsBtn.addEventListener('click', function() {
  tkMenu.style.display = 'none';
  _mlOpenAddColumnsPopup();
});
}

window._mlOpenAddColumnsPopup = function() {
  var ex = document.getElementById('ml-addcols-modal'); if (ex) ex.remove();

  // Column definitions — which are active, which can be added
  var allColumns = [
    { id: 'obl_id',       label: 'Obl ID',            active: true,  removable: false },
    { id: 'obligation',   label: 'Obligation',         active: true,  removable: false },
    { id: 'action',       label: 'Action',             active: true,  removable: true  },
    { id: 'department',   label: 'Department(s)',       active: true,  removable: true  },
    { id: 'assigned_to',  label: 'Assigned To',         active: true,  removable: true  },
    { id: 'status',       label: 'Assignment Status',   active: true,  removable: true  },
    { id: 'due_date',     label: 'Due Date',            active: true,  removable: true  },
    { id: 'linked_ref',   label: 'Linked Reference',    active: true,  removable: true  },
    // Demo extra columns
    { id: 'board_meeting', label: 'Board Meeting Date', active: false, removable: true  },
    { id: 'risk_level',    label: 'Risk Level',         active: false, removable: true  },
    { id: 'frequency',     label: 'Frequency',          active: false, removable: true  },
    { id: 'circular_id',   label: 'Circular ID',        active: false, removable: true  },
    { id: 'evidence',      label: 'Evidence Required',  active: false, removable: true  },
    { id: 'effective_date',label: 'Effective Date',     active: false, removable: true  },
  ];

  // Store on window so changes persist within session
  if (!window._mlColumnConfig) {
    window._mlColumnConfig = {};
    allColumns.forEach(function(c) { window._mlColumnConfig[c.id] = c.active; });
  }

  var overlay = document.createElement('div');
  overlay.className = 'dr-modal-overlay';
  overlay.id = 'ml-addcols-modal';
  overlay.innerHTML =
    '<div class="dr-modal" style="max-width:520px;">' +
      '<div class="dr-modal-head">' +
        '<div class="dr-modal-head-left">' +
          '<div class="dr-modal-eyebrow">Customise Table</div>' +
          '<div class="dr-modal-subject">Add or Remove Columns</div>' +
        '</div>' +
        '<button class="dr-modal-close" onclick="document.getElementById(\'ml-addcols-modal\').remove()">&#x2715;</button>' +
      '</div>' +
      '<div class="dr-modal-body" style="padding:20px;display:flex;flex-direction:column;gap:8px;">' +

        '<div style="font-size:11px;color:#6b7280;margin-bottom:4px;">Toggle columns on or off. Greyed columns are required and cannot be removed.</div>' +

        // Active columns section
        '<div style="font-size:10px;font-weight:700;color:#374151;text-transform:uppercase;letter-spacing:.05em;margin-bottom:6px;margin-top:4px;">Active Columns</div>' +
        allColumns.filter(function(c){ return window._mlColumnConfig[c.id]; }).map(function(col) {
          return '<div style="display:flex;align-items:center;justify-content:space-between;padding:10px 14px;background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;">' +
            '<div style="display:flex;align-items:center;gap:10px;">' +
              '<span style="font-size:12px;color:#6b7280;cursor:grab;">⠿</span>' +
              '<span style="font-size:13px;font-weight:500;color:#1f2937;">' + col.label + '</span>' +
              (col.removable ? '' : '<span style="font-size:9px;background:#f3f4f6;border:1px solid #e5e7eb;color:#9ca3af;padding:1px 6px;border-radius:4px;">Required</span>') +
            '</div>' +
            (col.removable
              ? '<button onclick="_mlToggleColumn(\'' + col.id + '\', false)" style="padding:4px 10px;background:#fee2e2;border:1px solid #fca5a5;border-radius:6px;font-size:11px;font-weight:600;color:#dc2626;cursor:pointer;">Remove</button>'
              : '<span style="font-size:11px;color:#d1d5db;">—</span>') +
          '</div>';
        }).join('') +

        // Available to add section
        '<div style="font-size:10px;font-weight:700;color:#374151;text-transform:uppercase;letter-spacing:.05em;margin-bottom:6px;margin-top:12px;">Available to Add</div>' +
        allColumns.filter(function(c){ return !window._mlColumnConfig[c.id]; }).map(function(col) {
          return '<div style="display:flex;align-items:center;justify-content:space-between;padding:10px 14px;background:#fff;border:1px dashed #d1d5db;border-radius:8px;">' +
            '<span style="font-size:13px;font-weight:500;color:#6b7280;">' + col.label + '</span>' +
            '<button onclick="_mlToggleColumn(\'' + col.id + '\', true)" style="padding:4px 10px;background:#eff6ff;border:1px solid #bfdbfe;border-radius:6px;font-size:11px;font-weight:600;color:#2563eb;cursor:pointer;">+ Add</button>' +
          '</div>';
        }).join('') +

      '</div>' +
      '<div class="dr-modal-foot">' +
        '<button class="dr-btn dr-btn-ghost" onclick="document.getElementById(\'ml-addcols-modal\').remove()">Cancel</button>' +
        '<button class="dr-btn dr-btn-pri" onclick="_mlApplyColumnChanges()">Apply Changes</button>' +
      '</div>' +
    '</div>';

  document.body.appendChild(overlay);
  overlay.addEventListener('click', function(e){ if(e.target===overlay) overlay.remove(); });
};

window._mlToggleColumn = function(colId, active) {
  if (!window._mlColumnConfig) window._mlColumnConfig = {};
  window._mlColumnConfig[colId] = active;
  // Re-open to reflect changes
  document.getElementById('ml-addcols-modal').remove();
  _mlOpenAddColumnsPopup();
};

window._mlApplyColumnChanges = function() {
  document.getElementById('ml-addcols-modal').remove();
  showToast('Column changes applied.', 'success');
  // In a real impl this would re-render the table with new columns
  // For demo just show a toast confirming
};

window._mlExtractActionItems = function(circs) {
  if (!CMS_DATA || !CMS_DATA.circulars) return [];

  var items = [];

  circs.forEach(function(circ) {
    
    var sections = (circ.chapters || []).concat(circ.annexures || []);

    sections.forEach(function(ch) {
      (ch.clauses || []).forEach(function(cl) {
        if (!cl.id) return;

        // Normalize obligations
        var obligs = Array.isArray(cl.obligations) ? cl.obligations
          : Array.isArray(cl.obligation) ? cl.obligation
          : typeof cl.obligation === 'string' && cl.obligation ? [cl.obligation]
          : typeof cl.obligations === 'string' && cl.obligations ? [cl.obligations]
          : [];

        // Normalize actionables
        var acts = Array.isArray(cl.actionables) ? cl.actionables
          : Array.isArray(cl.actionable) ? cl.actionable
          : typeof cl.actionables === 'string' ? cl.actionables.split(';').map(function(a){ return a.trim(); }).filter(Boolean)
          : typeof cl.actionable === 'string' ? cl.actionable.split(';').map(function(a){ return a.trim(); }).filter(Boolean)
          : [];

        if (!obligs.length) return;

       obligs.forEach(function(ob, oi) {
  var oblText = typeof ob === 'string' ? ob : (ob.text || ob.name || '');
  var obId    = (typeof ob === 'object' && ob.id) ? ob.id : ('OBL-' + cl.id + '-' + (oi + 1));

  if (acts.length > 0) {
    acts.forEach(function(act, ai) {
      var actText = typeof act === 'string' ? act : (act.text || String(act));
      var computedId = circ.id + '-' + cl.id + '-OB' + (oi + 1) + '-A' + (ai + 1);

      // Match task by exact actionId first, then fall back to clauseRef
      var matchingTask = null;
      if (CMS_DATA.library_tasks) {
        matchingTask = CMS_DATA.library_tasks.find(function(t) {
          return t.id === computedId || (t.circularId === circ.id && t.clauseRef === cl.id);
        });
      }

     items.push({
  actionId:       computedId,
action: matchingTask && matchingTask.title ? matchingTask.title : actText,  department:     (matchingTask ? matchingTask.department : cl.department) || '',
  status:         (matchingTask ? matchingTask.status : cl.status) || 'Assigned',
  assignedTo:     (matchingTask && matchingTask.assignee) ? matchingTask.assignee : {},
  tags:           (matchingTask ? matchingTask.tags : []) || [],
  risk:           (matchingTask ? (matchingTask.risk || matchingTask.priority) : cl.risk) || 'Medium',
  obligationId:   obId,
  obligationName: oblText,
  clauseId:       cl.id,
  circId:         circ.id,
  circTitle:      circ.title || '',
  dueDate:        (matchingTask ? matchingTask.dueDate : cl.dueDate) || '',
  frequency:      (matchingTask ? matchingTask.frequency : '') || 'Monthly',
  chapterTitle:   ch.title || '',
  // ── ADD THESE ──
  changeType: (matchingTask && matchingTask.changeType) || 'Original',
  version:    (matchingTask && matchingTask.version)    || 'v1',
  lastCircId: (matchingTask && matchingTask.lastCircId) || circ.id,
  refSection: (matchingTask && matchingTask.refSection) || cl.id || '',
  history:    (matchingTask && matchingTask.history)    || [
    { version:'v1', circId:circ.id, section:cl.id||'—', changeType:'Original', summary:'Initial obligation extracted from circular.', date: circ.issuedDate||circ.issueDate||'' }
  ],
});
    });
  } else {
    var computedId = circ.id + '-' + cl.id + '-OB' + (oi + 1) + '-A1';
    var matchingTask = null;
    if (CMS_DATA.library_tasks) {
      matchingTask = CMS_DATA.library_tasks.find(function(t) {
        return t.id === computedId || (t.circularId === circ.id && t.clauseRef === cl.id);
      });
    }
    items.push({
      actionId:       computedId,
      action:         matchingTask && matchingTask.title ? matchingTask.title : '',
      department:     (matchingTask ? matchingTask.department : cl.department) || '',
      status:         (matchingTask ? matchingTask.status : cl.status) || 'Assigned',
      assignedTo:     (matchingTask && matchingTask.assignee) ? matchingTask.assignee : {},
      tags:           (matchingTask ? matchingTask.tags : []) || [],
      risk:           (matchingTask ? (matchingTask.risk || matchingTask.priority) : cl.risk) || 'Medium',
      obligationId:   obId,
      obligationName: oblText,
      clauseId:       cl.id,
      circId:         circ.id,
      circTitle:      circ.title || '',
      dueDate:        (matchingTask ? matchingTask.dueDate : cl.dueDate) || '',
      frequency:      (matchingTask ? matchingTask.frequency : '') || 'Monthly',
      chapterTitle:   ch.title || ''
    });
  }
});
      });
    });
  });

  return items;
};

window._mlOpenCrossCircularView = function(selectedItem) {
  var ex = document.getElementById('ml-crosscirc-modal'); if (ex) ex.remove();

  // ── Dummy data ──
  var dummyCirculars = [
    { id: 'SEBI/2025/111', date: '31 July 2025' },
    { id: 'SEBI/2025/142', date: '29 August 2025' },
    { id: 'SEBI/2025/198', date: '08 December 2025' },
  ];

  var allDummyObligations = [
    {
      sn: 1, id: 'OBL-111-001',
      title: 'REs shall submit a list of digital platforms provided by them for the investors',
      cells: {
        'SEBI/2025/111': { type: 'Original',  content: 'August 31, 2025',    contentType: 'date', dept: 'Digital',     status: 'Done' },
        'SEBI/2025/142': { type: 'Revised',   content: 'September 30, 2025', contentType: 'date', dept: 'Digital',     status: 'Done' },
        'SEBI/2025/198': { type: 'No Change', content: '',                   contentType: 'none', dept: '',            status: '' },
      },
      remarks: 'Done'
    },
    {
      sn: 2, id: 'OBL-111-002',
      title: 'REs shall submit a compliance / action taken report pertaining to the clauses of this circular',
      cells: {
        'SEBI/2025/111': { type: 'Original',  content: 'August 31, 2025',    contentType: 'date', dept: 'Compliance', status: 'Done' },
        'SEBI/2025/142': { type: 'Revised',   content: 'September 30, 2025', contentType: 'date', dept: 'Compliance', status: 'Done' },
        'SEBI/2025/198': { type: 'No Change', content: '',                   contentType: 'none', dept: '',           status: '' },
      },
      remarks: 'Done'
    },
    {
      sn: 3, id: 'OBL-111-003',
      title: 'Appointment of IAAP certified accessibility professionals as Auditor',
      cells: {
        'SEBI/2025/111': { type: 'Original',   content: 'September 14, 2025', contentType: 'date', dept: 'Legal', status: 'Assigned' },
        'SEBI/2025/142': { type: 'Revised',    content: 'December 14, 2025',  contentType: 'date', dept: 'Legal', status: 'In Progress' },
        'SEBI/2025/198': {
          type: 'Clarified',
          contentType: 'mixed',
          content: 'March 31, 2026',
          note: 'Instead of meeting the compliance requirement for appointment of accessibility auditor by December 14, 2025, REs shall submit a status of their readiness and compliance to the accessibility requirements for each of their digital platforms latest by March 31, 2026 to SEBI',
          dept: 'Legal', status: 'In Progress'
        },
      },
      remarks: 'Auditor Appointed already'
    },
    {
      sn: 4, id: 'OBL-111-004',
      title: 'Conduct of Accessibility Audit for the digital platforms.',
      cells: {
        'SEBI/2025/111': { type: 'Original',  content: 'October 31, 2025', contentType: 'date', dept: 'IT', status: 'Assigned' },
        'SEBI/2025/142': { type: 'Revised',   content: 'April 30, 2026',   contentType: 'date', dept: 'IT', status: 'Assigned' },
        'SEBI/2025/198': { type: 'No Change', content: 'No clear extension', contentType: 'text', dept: '', status: '' },
      },
      remarks: ''
    },
    {
      sn: 5, id: 'OBL-111-005',
      title: 'Remediation of findings from the audit and ensuring compliance with this circular.',
      cells: {
        'SEBI/2025/111': { type: 'Original',  content: 'January 31, 2026', contentType: 'date', dept: 'IT', status: 'Assigned' },
        'SEBI/2025/142': { type: 'Revised',   content: 'July 31, 2026',    contentType: 'date', dept: 'IT', status: 'Assigned' },
        'SEBI/2025/198': { type: 'No Change', content: 'No clear extension', contentType: 'text', dept: '', status: '' },
      },
      remarks: ''
    },
    {
      sn: 6, id: 'OBL-111-006',
      title: 'The compliance reporting for this circular shall be done on annual basis within 30 days from end of each financial year.',
      cells: {
        'SEBI/2025/111': { type: 'Original', content: 'April 30, 2026', contentType: 'date', dept: 'Compliance', status: 'Assigned' },
        'SEBI/2025/142': { type: 'Revised',  content: 'April 30, 2027', contentType: 'date', dept: 'Compliance', status: 'Assigned' },
        'SEBI/2025/198': { type: 'Revised',  content: 'April 30, 2027', contentType: 'date', note: 'Same, April 30, 2027 and to be continued annually', dept: 'Compliance', status: 'Assigned' },
      },
      remarks: ''
    },
  ];

  var circulars = dummyCirculars;

  // ── Filter: if a specific item clicked, show only that OBL ──
  var obligations = allDummyObligations;
  var isFiltered = false;
  if (selectedItem) {
    var matched = allDummyObligations.filter(function(o) {
      return o.id === selectedItem.obligationId || o.title.toLowerCase().includes((selectedItem.obligationName || '').substring(0,30).toLowerCase());
    });
    if (matched.length > 0) {
      obligations = matched;
      isFiltered = true;
    }
  }

  // ── Cell renderer ──
  var typeStyles = {
    'Original':   { badge: '#dcfce7', text: '#15803d', bg: '#fff' },
    'Revised':    { badge: '#fef3c7', text: '#b45309', bg: '#fffde7' },
    'Clarified':  { badge: '#fef9c3', text: '#854d0e', bg: '#fffde7' },
    'Superseded': { badge: '#fee2e2', text: '#991b1b', bg: '#fff9f9' },
    'No Change':  { badge: '#f3f4f6', text: '#6b7280', bg: '#fafafa' },
  };

  var renderCell = function(cell, ci, rowBg) {
    if (!cell) return '<td style="padding:12px 14px;border-right:1px solid #f0f0f0;vertical-align:top;text-align:center;background:' + rowBg + ';"><span style="color:#d1d5db;font-size:18px;">—</span></td>';

    var st = typeStyles[cell.type] || typeStyles['Original'];
    var tdBg = st.bg;

    // Content block based on contentType
    var contentHtml = '';
    if (cell.contentType === 'date') {
      contentHtml =
        '<div style="font-size:14px;font-weight:700;color:' + (ci === 0 ? '#1f2937' : '#b45309') + ';margin:6px 0;">' + cell.content + '</div>';
    } else if (cell.contentType === 'text') {
      contentHtml =
        '<div style="font-size:11px;color:#6b7280;font-style:italic;margin:6px 0;line-height:1.5;">' + cell.content + '</div>';
    } else if (cell.contentType === 'mixed') {
      contentHtml =
        '<div style="font-size:14px;font-weight:700;color:#b45309;margin:6px 0;">' + cell.content + '</div>';
    }

    // Note block — paragraph change, clarification etc
    var noteHtml = '';
    if (cell.note) {
      noteHtml =
        '<div style="margin-top:8px;padding:8px 10px;background:' + (cell.type === 'Clarified' ? '#fffbeb' : '#f9fafb') + ';border-left:3px solid ' + (cell.type === 'Clarified' ? '#f59e0b' : '#e5e7eb') + ';border-radius:0 4px 4px 0;font-size:11px;color:#374151;line-height:1.6;">' +
          cell.note +
        '</div>';
    }

    return '<td style="padding:12px 14px;border-right:1px solid #f0f0f0;vertical-align:top;background:' + tdBg + ';">' +
      // Badge
      '<span style="font-size:10px;font-weight:700;padding:2px 9px;border-radius:10px;background:' + st.badge + ';color:' + st.text + ';">' + cell.type + '</span>' +
      // Main content
      contentHtml +
      // Note / paragraph change
      noteHtml +
      // Meta
      (cell.dept ? '<div style="margin-top:6px;font-size:10px;color:#9ca3af;">Dept: <b style="color:#6b7280;">' + cell.dept + '</b></div>' : '') +
      (cell.status ? '<div style="margin-top:4px;"><span style="font-size:10px;padding:2px 7px;border-radius:4px;background:#ede9fe;color:#5b21b6;font-weight:600;">' + cell.status + '</span></div>' : '') +
    '</td>';
  };

  // ── Clean header ──
  var theadHtml =
    '<thead>' +
      // Main header row
      '<tr>' +
        '<th style="padding:12px 14px;background:#1e293b;color:#fff;font-size:11px;font-weight:700;border-right:1px solid #334155;width:40px;text-align:center;">S/N</th>' +
        '<th style="padding:12px 14px;background:#1e293b;color:#fff;font-size:11px;font-weight:700;border-right:1px solid #334155;min-width:280px;text-align:left;">Compliance Required</th>' +
        circulars.map(function(c, i) {
          return '<th style="padding:0;background:#1e293b;border-right:1px solid #334155;min-width:220px;">' +
            // Circular ID top
            '<div style="padding:8px 14px 4px;font-size:10px;color:#94a3b8;text-align:center;border-bottom:1px solid #334155;">' + c.id + '</div>' +
            // Date bottom
            '<div style="padding:4px 14px 8px;font-size:12px;font-weight:700;color:#fff;text-align:center;">' + c.date + '</div>' +
          '</th>';
        }).join('') +
        '<th style="padding:12px 14px;background:#1e293b;color:#fff;font-size:11px;font-weight:700;min-width:160px;text-align:left;">Compliance Remarks</th>' +
      '</tr>' +
      // Sub-label row: Original / Revised
      '<tr>' +
        '<th style="padding:6px 14px;background:#f1f5f9;border-right:1px solid #e2e8f0;border-bottom:2px solid #cbd5e1;"></th>' +
        '<th style="padding:6px 14px;background:#f1f5f9;border-right:1px solid #e2e8f0;border-bottom:2px solid #cbd5e1;"></th>' +
        circulars.map(function(c, i) {
          var label = i === 0 ? '&#x25CF; Original ' : '&#x25CF; Revised ';
          var color = i === 0 ? '#16a34a' : '#dc2626';
          return '<th style="padding:7px 14px;background:#f1f5f9;border-right:1px solid #e2e8f0;border-bottom:2px solid #cbd5e1;text-align:center;font-size:10px;font-weight:700;color:' + color + ';">' + label + '</th>';
        }).join('') +
        '<th style="padding:6px 14px;background:#f1f5f9;border-bottom:2px solid #cbd5e1;"></th>' +
      '</tr>' +
    '</thead>';

  // ── Body ──
  var tbodyHtml = '<tbody>' +
    obligations.map(function(obl, ri) {
      var rowBg = ri % 2 === 0 ? '#fff' : '#fafafa';
      return '<tr style="border-bottom:1px solid #f0f0f0;">' +
        '<td style="padding:12px 14px;text-align:center;font-size:12px;font-weight:700;color:#94a3b8;border-right:1px solid #f0f0f0;vertical-align:top;background:' + rowBg + ';">' + obl.sn + '</td>' +
        '<td style="padding:12px 14px;border-right:1px solid #f0f0f0;vertical-align:top;background:' + rowBg + ';">' +
          '<div style="font-size:9px;font-family:monospace;color:#7c3aed;font-weight:700;margin-bottom:4px;background:#f5f3ff;display:inline-block;padding:1px 6px;border-radius:3px;">' + obl.id + '</div>' +
          '<div style="font-size:12px;color:#1f2937;line-height:1.55;margin-top:4px;">' + obl.title + '</div>' +
        '</td>' +
        circulars.map(function(c, ci) {
          return renderCell(obl.cells[c.id], ci, rowBg);
        }).join('') +
        '<td style="padding:12px 14px;font-size:11px;color:#374151;vertical-align:top;background:' + rowBg + ';line-height:1.5;">' +
          (obl.remarks || '<span style="color:#d1d5db;">—</span>') +
        '</td>' +
      '</tr>';
    }).join('') +
  '</tbody>';

  // ── Modal ──
  var overlay = document.createElement('div');
  overlay.className = 'dr-modal-overlay';
  overlay.id = 'ml-crosscirc-modal';
  overlay.innerHTML =
    '<div class="dr-modal" style="max-width:96vw;width:96vw;">' +
      '<div class="dr-modal-head">' +
        '<div class="dr-modal-head-left">' +
          '<div class="dr-modal-eyebrow">Cross-Circular Comparison</div>' +
          '<div class="dr-modal-subject">' +
            (isFiltered
              ? 'Showing: ' + (selectedItem.obligationId || selectedItem.obligationName || 'Selected Obligation')
              : 'All Obligations across ' + circulars.length + ' Circulars') +
            (isFiltered ? ' &nbsp;<button onclick="window._mlOpenCrossCircularView()" style="font-size:10px;padding:2px 8px;background:#f3f4f6;border:1px solid #e5e7eb;border-radius:4px;cursor:pointer;color:#374151;">View All</button>' : '') +
          '</div>' +
        '</div>' +
        '<div style="display:flex;gap:8px;align-items:center;">' +
          '<button class="dr-btn dr-btn-sec" style="font-size:11px;" onclick="_mlExportCrossCircular()">&#x1F4CA; Export</button>' +
          '<button class="dr-modal-close" onclick="document.getElementById(\'ml-crosscirc-modal\').remove()">&#x2715;</button>' +
        '</div>' +
      '</div>' +

      '<div class="dr-modal-body" style="padding:0;max-height:80vh;overflow:auto;">' +
        '<table style="width:100%;border-collapse:collapse;font-size:12px;">' +
          theadHtml + tbodyHtml +
        '</table>' +
      '</div>' +

      '<div class="dr-modal-foot">' +
        '<div style="display:flex;gap:14px;align-items:center;flex-wrap:wrap;">' +
          '<span style="font-size:11px;color:#6b7280;font-weight:600;">Legend:</span>' +
          '<span style="font-size:11px;display:flex;align-items:center;gap:5px;"><span style="width:10px;height:10px;background:#dcfce7;border:1px solid #86efac;border-radius:2px;display:inline-block;"></span>Original</span>' +
          '<span style="font-size:11px;display:flex;align-items:center;gap:5px;"><span style="width:10px;height:10px;background:#fef3c7;border:1px solid #fcd34d;border-radius:2px;display:inline-block;"></span>Revised (date/timeline)</span>' +
          '<span style="font-size:11px;display:flex;align-items:center;gap:5px;"><span style="width:10px;height:10px;background:#fffde7;border:1px solid #fcd34d;border-radius:2px;display:inline-block;"></span>Clarified (paragraph/scope change)</span>' +
          '<span style="font-size:11px;display:flex;align-items:center;gap:5px;"><span style="width:10px;height:10px;background:#fee2e2;border:1px solid #fca5a5;border-radius:2px;display:inline-block;"></span>Superseded</span>' +
          '<span style="font-size:11px;display:flex;align-items:center;gap:5px;"><span style="width:10px;height:10px;background:#f3f4f6;border:1px solid #e5e7eb;border-radius:2px;display:inline-block;"></span>No Change</span>' +
        '</div>' +
        '<button class="dr-btn dr-btn-pri" onclick="document.getElementById(\'ml-crosscirc-modal\').remove()">Close</button>' +
      '</div>' +
    '</div>';

  document.body.appendChild(overlay);
  overlay.addEventListener('click', function(e){ if(e.target===overlay) overlay.remove(); });
};
// ── Export cross-circular data as CSV ──
window._mlExportCrossCircular = function() {
  var allTasks = CMS_DATA.library_tasks || [];
  var allCirculars = CMS_DATA.circulars || [];
  var circMap = {};
  allCirculars.forEach(function(c) { circMap[c.id] = c; });
  var circIds = [];
  allTasks.forEach(function(t) {
    if (t.circularId && circIds.indexOf(t.circularId) === -1) circIds.push(t.circularId);
  });
  var oblMap = {};
  allTasks.forEach(function(t) {
    var key = t.obligationId || t.id;
    if (!oblMap[key]) oblMap[key] = { title: t.title, rows: {} };
    oblMap[key].rows[t.circularId] = t;
  });
  var header = ['S/N', 'Obligation ID', 'Compliance Required'].concat(circIds).concat(['Remarks']);
  var rows = Object.keys(oblMap).map(function(key, i) {
    var obl = oblMap[key];
    var cells = circIds.map(function(cid) {
      var t = obl.rows[cid];
      return t ? (t.dueDate || t.status || '') : '—';
    });
    return [i+1, key, '"' + obl.title + '"'].concat(cells).concat(['']);
  });
  var csv = [header].concat(rows).map(function(r){ return r.join(','); }).join('\n');
  var blob = new Blob([csv], {type:'text/csv'});
  var a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'cross-circular-comparison.csv';
  a.click();
};


window._mlRenderTable= function(circs) {
  var tbody   = document.getElementById('ml-tbody');
  var countEl = document.getElementById('ml-action-count');
  if (!tbody) return;

  var items = _mlExtractActionItems(circs);
  if (countEl) countEl.textContent = items.length + ' action item' + (items.length !== 1 ? 's' : '');

  if (items.length === 0) {
    tbody.innerHTML = '<tr><td colspan="9" style="text-align:center;padding:32px 16px;color:var(--dr-t3);font-style:italic;">No action items match your filters</td></tr>';
    return;
  }


  var statusColors = { 
  'Open':'#fef3c7;color:#b45309', 
  'In Progress':'#e0f2fe;color:#0369a1', 
  'Complete':'#dcfce7;color:#15803d', 
  'Assigned':'#ede9fe;color:#5b5fcf',
  'Pending':'#fef3c7;color:#b45309',
  'Compliant':'#dcfce7;color:#15803d',
  'Unassigned':'#f3f4f6;color:#6b7280',
  'Overdue':'#fee2e2;color:#991b1b',
  'NA':'#f3f4f6;color:#6b7280'
};

  tbody.innerHTML = items.map(function(item, idx) {
    var sc = statusColors[item.status] || '#f3f4f6;color:#6b7280';
   
   var displayAction = (item.activities && item.activities.length > 0 && item.activities[0] && item.activities[0].name)
  ? item.activities[0].name
  : (item.action || item.title || '');
    return '<tr class="ml-action-row" data-idx="' + idx + '" style="cursor:pointer;">' +
  '<td style="position:relative;">' +
    '<span class="ml-obl-id ml-clickable-oblid" data-oblid="' + item.obligationId + '" style="cursor:pointer;font-family:monospace;font-size:11px;font-weight:700;color:#7c3aed;background:#f5f3ff;border:1px solid #e9d5ff;padding:2px 7px;border-radius:4px;" title="View obligation details">' + item.obligationId + '</span>' +
  '</td>' +
  '<td style="max-width:220px;padding:8px;">' +
    '<div style="font-size:11px;color:#374151;line-height:1.45;" title="' + item.obligationName.replace(/"/g,'&quot;') + '">' +
      item.obligationName.substring(0, 60) + (item.obligationName.length > 60 ? '..' : '') +
    '</div>' +
  '</td>' +
'<td style="max-width:280px;font-size:12px;color:var(--dr-t1);cursor:pointer;" class="ml-clickable-action" data-idx="' + idx + '">' + (item.activities && item.activities[0] ? item.activities[0].name || '' : item.action || '').substring(0,80) + ((item.activities && item.activities[0] ? item.activities[0].name || '' : item.action || '').length>80?'…':'') + '</td>' +
  '<td class="ml-inline-dept" data-idx="' + idx + '" style="cursor:pointer;padding:6px 8px;border-radius:4px;transition:background 0.2s;" title="Click to assign departments">' +
    (item.department
      ? item.department.split(',').map(function(d){ return '<span style="background:#e0f2fe;color:#0369a1;padding:2px 6px;border-radius:3px;font-size:11px;font-weight:600;display:inline-block;margin:1px;">' + d.trim() + '</span>'; }).join('')
      : '<span style="color:#9ca3af;font-style:italic;">Assign</span>') +
  '</td>' +
  '<td class="ml-inline-assignee" data-idx="' + idx + '" style="cursor:pointer;padding:6px 8px;border-radius:4px;transition:background 0.2s;" title="Click to assign">' +
    (function() {
      var a = item.assignedTo;
      var empty = !a ||
        (typeof a === 'string' && !a.trim()) ||
        (typeof a === 'object' && !Array.isArray(a) && Object.keys(a).length === 0);
      if (empty) return '<span style="color:#9ca3af;font-style:italic;font-size:12px;">Assign</span>';
      if (typeof a === 'string' && a.trim()) {
        return '<span style="background:#ede9fe;color:#5b21b6;border:1px solid #ddd6fe;padding:2px 8px;border-radius:20px;font-size:11px;font-weight:600;">' + a + '</span>';
      }
      return Object.entries(a).map(function(entry) {
        return '<div style="display:flex;align-items:center;gap:4px;margin:2px 0;">' +
          '<span style="font-size:9px;color:#6b7280;background:#f3f4f6;padding:1px 5px;border-radius:3px;min-width:52px;text-align:center;">' + entry[0] + '</span>' +
          '<span style="background:#ede9fe;color:#5b21b6;border:1px solid #ddd6fe;padding:2px 8px;border-radius:20px;font-size:11px;font-weight:600;">' + entry[1] + '</span>' +
        '</div>';
      }).join('');
    })() +
  '</td>' +
  '<td class="ml-inline-status" data-idx="' + idx + '" style="cursor:pointer;padding:4px 0;transition:opacity 0.2s;" title="Click to change status">' +
    '<span style="padding:4px 12px;border-radius:12px;font-size:11px;font-weight:700;background:' + sc + ';cursor:pointer;">' + item.status + '</span>' +
  '</td>' +
 '<td style="font-size:12px;color:#374151;">' + (item.dueDate || '—') + '</td>' +
'<td style="padding:0;vertical-align:middle;">' +
  '<div style="display:flex;align-items:stretch;height:100%;divide-x:1px solid #c7d2fe;">' +

    // Circ ID cell
    '<span class="ml-linked-ref-circid" data-idx="' + idx + '" data-circid="' + item.circId + '" ' +
      'style="flex:1;display:flex;align-items:center;justify-content:center;padding:8px 6px;font-family:monospace;font-size:10px;font-weight:700;color:#4f46e5;cursor:pointer;text-decoration:underline;white-space:nowrap;border-right:1px solid #c7d2fe;border-left:1px solid #c7d2fe;text-align:center;" ' +
      'title="Open circular document">' + item.circId + '</span>' +

    // Section cell
    '<span class="ml-linked-ref-section" data-idx="' + idx + '" data-circid="' + item.circId + '" ' +
      'style="flex:0 0 auto;display:flex;align-items:center;justify-content:center;padding:8px 8px;font-size:10px;font-weight:600;color:#0369a1;cursor:pointer;text-decoration:underline;white-space:nowrap;border-right:1px solid #c7d2fe;" ' +
      'title="Open this section">' + (item.refSection || item.clauseId || '§') + '</span>' +

    // More cell
    '<span class="ml-linked-ref-view" data-idx="' + idx + '" ' +
      'style="flex:0 0 auto;display:flex;align-items:center;justify-content:center;padding:8px 8px;font-size:10px;font-weight:600;color:#7c3aed;cursor:pointer;white-space:nowrap;" ' +
      'title="View all references">Others</span>' +

  '</div>' +
'</td>' +
'</tr>';
  }).join('');

  window._mlActionItems = items;

  tbody.querySelectorAll('.ml-clickable-oblid').forEach(function(el) {
    el.addEventListener('click', function(e) {
      e.stopPropagation();
      var idx = parseInt(el.closest('tr').dataset.idx);
      _mlOpenOblDetailPopup(window._mlActionItems[idx], idx);
    });
  });

  tbody.querySelectorAll('.ml-clickable-action').forEach(function(el) {
    el.addEventListener('click', function(e) {
      e.stopPropagation();
      var idx = parseInt(el.dataset.idx);
      _mlOpenDetailPopup(window._mlActionItems[idx], idx);
    });
  });


 // Department column click handler
  tbody.querySelectorAll('.ml-inline-dept').forEach(function(cell) {
    cell.addEventListener('click', function(e) {
      e.stopPropagation();
      var idx = parseInt(cell.dataset.idx);
      _mlOpenDepartmentSelector(idx);
    });
    cell.addEventListener('mouseenter', function() {
      this.style.background = '#f3f4f6';
    });
    cell.addEventListener('mouseleave', function() {
      this.style.background = 'transparent';
    });
  });

  // Assigned To column click handler
  tbody.querySelectorAll('.ml-inline-assignee').forEach(function(cell) {
    cell.addEventListener('click', function(e) {
      e.stopPropagation();
      var idx = parseInt(cell.dataset.idx);
      _mlOpenAssigneeSelector(idx);
    });
    cell.addEventListener('mouseenter', function() {
      this.style.background = '#f3f4f6';
    });
    cell.addEventListener('mouseleave', function() {
      this.style.background = 'transparent';
    });
  });

  // Stus column click handler
  tbody.querySelectorAll('.ml-inline-status').forEach(function(cell) {
    cell.addEventListener('click', function(e) {
      e.stopPropagation();
      var idx = parseInt(cell.dataset.idx);
      _mlOpenStatusDropdown(idx);
    });
  });

tbody.querySelectorAll('.ml-clickable-oblref').forEach(function(el) {
  el.addEventListener('click', function(e) {
    e.stopPropagation();
    var idx = parseInt(el.dataset.idx);
    _mlOpenOblRefPopup(window._mlActionItems[idx]);
  });
});

tbody.querySelectorAll('.ml-view-ref-btn').forEach(function(btn) {
  btn.addEventListener('click', function(e) {
    e.stopPropagation();
    var idx = parseInt(btn.dataset.idx);
    _mlOpenReferenceModal(window._mlActionItems[idx]);
  });
});


// Linked Ref — circular ID click → open circular PDF/page
tbody.querySelectorAll('.ml-linked-ref-circid').forEach(function(el) {
  el.addEventListener('click', function(e) {
    e.stopPropagation();
    var circId = el.dataset.circid;
    var circular = (CMS_DATA.circulars || []).find(function(c){ return c.id === circId; }) || {};
    // Try all common PDF/doc URL field names
    var pdfUrl = circular.pdfUrl 
      || circular.documentUrl 
      || circular.fileUrl 
      || circular.url 
      || circular.pdf
      || circular.document
      || null;
    if (pdfUrl) {
      window.open(pdfUrl, '_blank');
    } else {
      // Fallback — open a blank window with the circular ID as title
      var win = window.open('', '_blank');
      win.document.write(
        '<html><head><title>' + circId + '</title></head>' +
        '<body style="font-family:sans-serif;padding:40px;color:#374151;">' +
          '<h2 style="color:#4f46e5;font-size:16px;margin-bottom:8px;">📄 ' + circId + '</h2>' +
          '<p style="font-size:13px;color:#6b7280;">No PDF document is attached to this circular.</p>' +
          '<p style="font-size:12px;color:#9ca3af;">Check <code>circular.pdfUrl</code> or <code>circular.documentUrl</code> in your data.</p>' +
        '</body></html>'
      );
      win.document.close();
    }
  });
});

// Section click → open circular page at that section
tbody.querySelectorAll('.ml-linked-ref-section').forEach(function(el) {
  el.addEventListener('click', function(e) {
    e.stopPropagation();
    var circId = el.dataset.circid;
    var circular = (CMS_DATA.circulars || []).find(function(c){ return c.id === circId; }) || {};
    var pdfUrl = circular.pdfUrl || circular.documentUrl || circular.fileUrl || circular.url || null;
    var win = window.open('', '_blank');
    win.document.write(
      '<html><head><title>' + circId + '</title></head>' +
      '<body style="font-family:sans-serif;padding:40px;color:#374151;">' +
        '<h2 style="color:#4f46e5;font-size:16px;margin-bottom:8px;">📄 ' + circId + '</h2>' +
        '<p style="font-size:13px;color:#0369a1;font-weight:600;">Section: ' + (el.textContent.trim()) + '</p>' +
        (pdfUrl
          ? '<p><a href="' + pdfUrl + '" target="_blank" style="color:#4f46e5;">Open full document →</a></p>'
          : '<p style="font-size:12px;color:#9ca3af;">No PDF attached — attach <code>circular.pdfUrl</code> to navigate directly to this section.</p>') +
      '</body></html>'
    );
    win.document.close();
  });
});

// Linked Ref — View More click → open reference modal
tbody.querySelectorAll('.ml-linked-ref-view').forEach(function(el) {
  el.addEventListener('click', function(e) {
    e.stopPropagation();
    var idx = parseInt(el.dataset.idx);
    _mlOpenReferenceModal(window._mlActionItems[idx]);
  });
});


}


window._mlOpenReferenceModal = function(item) {
  var ex = document.getElementById('ml-ref-modal'); if (ex) ex.remove();

  // ── Dummy reference data ──
  var dummyRefs = [
    {
      circId: 'SEBI/2025/111',
      issueDate: '31 July 2025',
      oblId: 'OBL-111-001',
      section: '5(1)',
      oblName: 'REs shall submit a list of digital platforms provided by them for the investors',
      dueDate: 'August 31, 2025',
      docUrl: 'https://www.sebi.gov.in/sebi_data/attachdocs/aug-2025/1234567890.pdf'
    },
    {
      circId: 'SEBI/2025/142',
      issueDate: '29 August 2025',
      oblId: 'OBL-111-001',
      section: '3(2)',
      oblName: 'REs shall submit a list of digital platforms provided by them for the investors',
      dueDate: 'September 30, 2025',
      docUrl: 'https://www.sebi.gov.in/sebi_data/attachdocs/aug-2025/1234567890.pdf'
    },
    {
      circId: 'SEBI/2025/198',
      issueDate: '08 December 2025',
      oblId: 'OBL-111-001',
      section: '4(c)',
      oblName: 'REs shall submit a list of digital platforms provided by them for the investors',
      dueDate: 'March 31, 2026',
      docUrl: 'https://www.sebi.gov.in/sebi_data/attachdocs/aug-2025/1234567890.pdf'
    },
  ];

  var overlay = document.createElement('div');
  overlay.className = 'dr-modal-overlay';
  overlay.id = 'ml-ref-modal';
  overlay.innerHTML =
    '<div class="dr-modal" style="max-width:860px;">' +
      '<div class="dr-modal-head">' +
        '<div class="dr-modal-head-left">' +
          '<div class="dr-modal-eyebrow">Circular Reference</div>' +
          '<div class="dr-modal-subject">Obligation: ' + item.obligationId + '</div>' +
        '</div>' +
        '<button class="dr-modal-close" onclick="document.getElementById(\'ml-ref-modal\').remove()">&#x2715;</button>' +
      '</div>' +

      '<div class="dr-modal-body" style="padding:0;max-height:75vh;overflow-y:auto;">' +

        '<table style="width:100%;border-collapse:collapse;font-size:12px;">' +
          '<tbody>' +
  // Header row using td not th
  '<tr>' +
    '<td style="padding:11px 14px;font-size:11px;font-weight:700;color:#ffffff;background:#1e293b;white-space:nowrap;">Circular ID</td>' +
    '<td style="padding:11px 14px;font-size:11px;font-weight:700;color:#ffffff;background:#1e293b;white-space:nowrap;">Issue Date</td>' +
    
    '<td style="padding:11px 14px;font-size:11px;font-weight:700;color:#ffffff;background:#1e293b;white-space:nowrap;">Section</td>' +
    '<td style="padding:11px 14px;font-size:11px;font-weight:700;color:#ffffff;background:#1e293b;">Obligation Name</td>' +

    '<td style="padding:11px 14px;font-size:11px;font-weight:700;color:#ffffff;background:#1e293b;text-align:center;white-space:nowrap;">Document</td>' +
    // Add this as the LAST <td> in the header row
'<td style="padding:10px 14px;font-size:11px;font-weight:700;color:#ffffff;background:#1e293b;text-align:center;width:40px;">' +
  '<button id="ml-ref-edit-btn" title="Edit table" style="width:26px;height:26px;border-radius:6px;background:rgba(255,255,255,0.15);border:1px solid rgba(255,255,255,0.3);cursor:pointer;color:#fff;font-size:13px;display:inline-flex;align-items:center;justify-content:center;" onclick="_mlToggleRefTableEdit()">✎</button>' +
'</td>' +
  '</tr>' +

          '<tbody>' +
            dummyRefs.map(function(ref, ri) {
              var rowBg = ri % 2 === 0 ? '#fff' : '#fafafa';
              var isOriginal = ri === 0;
              return '<tr style="border-bottom:1px solid #f0f0f0;background:' + rowBg + ';">' +

                // Circular ID
                '<td style="padding:12px 14px;white-space:nowrap;vertical-align:top;">' +
                  '<span style="font-size:12px;font-weight:700;color:#4f46e5;">' + ref.circId + '</span>' +
                  (isOriginal ? '<div style="margin-top:4px;"><span style="font-size:9px;font-weight:700;padding:1px 7px;border-radius:10px;background:#dcfce7;color:#15803d;">Original</span></div>' : '<div style="margin-top:4px;"><span style="font-size:9px;font-weight:700;padding:1px 7px;border-radius:10px;background:#fef3c7;color:#b45309;">Amended</span></div>') +
                '</td>' +

                // Issue Date
                '<td style="padding:12px 14px;font-size:11px;color:#6b7280;white-space:nowrap;vertical-align:top;">' + ref.issueDate + '</td>' +

                // Obl ID — clickable → opens obl popup
                

                // Section — clickable → opens obl popup
                '<td style="padding:12px 14px;white-space:nowrap;vertical-align:top;">' +
                  '<span class="ml-ref-section-link" data-ref-idx="' + ri + '" ' +
                    'style="font-size:11px;font-weight:600;color:#0369a1;cursor:pointer;text-decoration:underline;">' +
                    ref.section +
                  '</span>' +
                '</td>' +

                // Obligation Name
                '<td style="padding:12px 14px;font-size:11px;color:#374151;line-height:1.55;max-width:260px;vertical-align:top;">' +
                  ref.oblName.substring(0, 80) + (ref.oblName.length > 80 ? '…' : '') +
                '</td>' +

                // Due Date
               

               // Document button
'<td style="padding:12px 14px;text-align:center;vertical-align:top;">' +
  '<button class="ml-ref-doc-btn" data-url="' + ref.docUrl + '" ' +
    'style="padding:5px 12px;background:#f3f4f6;border:1px solid #e5e7eb;border-radius:6px;font-size:11px;font-weight:600;color:#374151;cursor:pointer;white-space:nowrap;">&#x1F4C4; View Doc</button>' +
'</td>' +

// Add row button (shown in edit mode)
'<td style="padding:10px 14px;text-align:center;vertical-align:top;">' +
  '<button class="ml-ref-add-btn" onclick="_mlAddRefRow(this)" style="padding:3px 8px;background:#dcfce7;border:1px solid #86efac;border-radius:4px;color:#15803d;font-size:11px;font-weight:600;cursor:pointer;display:none;">➕</button>' +
'</td>' +

// Remove row button (shown in edit mode)
'<td style="padding:10px 14px;text-align:center;vertical-align:top;">' +
  '<button class="ml-ref-remove-btn" onclick="_mlRemoveRefRow(this)" style="padding:3px 8px;background:#fee2e2;border:1px solid #fca5a5;border-radius:4px;color:#dc2626;font-size:11px;font-weight:600;cursor:pointer;display:none;">✕</button>' +
'</td>'

              '</tr>';
            }).join('') +
          '</tbody>' +
        '</table>' +

      '</div>' +

      '<div class="dr-modal-foot">' +
        '<span class="dr-modal-foot-note">' + dummyRefs.length + ' circular reference' + (dummyRefs.length !== 1 ? 's' : '') + ' for this obligation</span>' +
        '<button class="dr-btn dr-btn-pri" onclick="document.getElementById(\'ml-ref-modal\').remove()">Close</button>' +
      '</div>' +
    '</div>';

  document.body.appendChild(overlay);
  overlay.addEventListener('click', function(e){ if(e.target===overlay) overlay.remove(); });

  // Obl ID click → open obl ref popup
  overlay.querySelectorAll('.ml-ref-obl-link, .ml-ref-section-link').forEach(function(el) {
    el.addEventListener('click', function(e) {
      e.stopPropagation();
      _mlOpenOblRefPopup(item);
    });
  });

  // View Doc click → open dummy PDF
  overlay.querySelectorAll('.ml-ref-doc-btn').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      var url = btn.dataset.url;
      if (url) {
        window.open(url, '_blank');
      } else {
        showToast('No document available.', 'error');
      }
    });
  });
};


window._mlToggleRefTableEdit = function() {
  var btn = document.getElementById('ml-ref-edit-btn');
  var isEditing = btn && btn.dataset.editing === 'true';

  if (!isEditing) {
    // Enter edit mode
    if (btn) { btn.dataset.editing = 'true'; btn.textContent = '✓'; btn.style.background = 'rgba(34,197,94,0.3)'; btn.title = 'Done editing'; }

    // Make text cells editable
    document.querySelectorAll('#ml-ref-modal tbody tr:not(:first-child) td').forEach(function(td) {
      if (!td.querySelector('button')) {
        td.contentEditable = 'true';
        td.style.outline = '1.5px dashed #bfdbfe';
        td.style.borderRadius = '3px';
        td.style.minWidth = '60px';
      }
    });

    // Show remove buttons
  // Show buttons in edit mode
document.querySelectorAll('#ml-ref-modal .ml-ref-remove-btn, #ml-ref-modal .ml-ref-add-btn').forEach(function(b) {
  b.style.display = 'inline-block';
});


    showToast('Edit mode on — click cells to edit, ✕ to remove a row.', 'info');
  } else {
    // Exit edit mode
    if (btn) { btn.dataset.editing = 'false'; btn.textContent = '✎'; btn.style.background = 'rgba(255,255,255,0.15)'; btn.title = 'Edit table'; }

    document.querySelectorAll('#ml-ref-modal tbody tr:not(:first-child) td').forEach(function(td) {
      td.contentEditable = 'false';
      td.style.outline = 'none';
    });

  document.querySelectorAll('#ml-ref-modal .ml-ref-remove-btn, #ml-ref-modal .ml-ref-add-btn').forEach(function(b) {
  b.style.display = 'none';
});

    showToast('Changes saved.', 'success');
  }
};

window._mlRemoveRefRow = function(btn) {
  var row = btn.closest('tr');
  if (row) {
    row.style.opacity = '0.3';
    row.style.pointerEvents = 'none';
    showToast('Row removed.', 'success');
  }
};


window._mlOpenOblRefPopup = function(item) {
  var ex = document.getElementById('ml-oblref-modal'); if (ex) ex.remove();

  var circular = (CMS_DATA.circulars || []).find(function(c){ return c.id === item.circId; }) || {};
  var task = (CMS_DATA.library_tasks || []).find(function(t){ return t.id === item.actionId; }) || {};

  var clauseText = task.clauseText || circular.clauseText ||
    'The entity shall ensure compliance with all reporting requirements as specified under the relevant circular, including timely submission of returns and maintenance of records as directed by the regulatory authority.';

  var overlay = document.createElement('div');
  overlay.className = 'dr-modal-overlay';
  overlay.id = 'ml-oblref-modal';
  overlay.innerHTML =
    '<div class="dr-modal" style="max-width:600px;">' +
      '<div class="dr-modal-head">' +
        '<div class="dr-modal-head-left">' +
          '<div class="dr-modal-eyebrow">Obligation Reference</div>' +
          '<div class="dr-modal-subject">' + item.obligationId + '</div>' +
        '</div>' +
        '<button class="dr-modal-close" onclick="document.getElementById(\'ml-oblref-modal\').remove()">&#x2715;</button>' +
      '</div>' +
      '<div class="dr-modal-body" style="padding:20px;display:flex;flex-direction:column;gap:14px;">' +

        // Obligation text banner
        '<div style="background:#f5f3ff;border:1px solid #e9d5ff;border-radius:6px;padding:12px 14px;">' +
          '<div style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;margin-bottom:6px;">Obligation</div>' +
          '<div style="font-size:13px;color:#1f2937;line-height:1.7;">' + item.obligationName + '</div>' +
        '</div>' +

        // Meta fields
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">' +
          '<div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:6px;padding:10px 12px;">' +
            '<div style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px;">Due Date</div>' +
            '<div style="font-size:13px;font-weight:700;color:#1f2937;">' + (item.dueDate || '—') + '</div>' +
          '</div>' +
          '<div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:6px;padding:10px 12px;">' +
            '<div style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px;">Frequency</div>' +
            '<div style="font-size:13px;font-weight:700;color:#1f2937;">' + (item.frequency || 'Monthly') + '</div>' +
          '</div>' +
          '<div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:6px;padding:10px 12px;">' +
            '<div style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px;">Effective Date</div>' +
            '<div style="font-size:13px;font-weight:700;color:#1f2937;">' + (circular.effectiveDate || '—') + '</div>' +
          '</div>' +
          '<div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:6px;padding:10px 12px;">' +
            '<div style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px;">Section</div>' +
            '<div style="font-size:13px;font-weight:700;color:#1f2937;">' + (circular.section || item.clauseId || '—') + '</div>' +
          '</div>' +
          '<div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:6px;padding:10px 12px;">' +
            '<div style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px;">Regulatory Body</div>' +
            '<div style="font-size:13px;font-weight:700;color:#1f2937;">' + (circular.regulator || 'Reserve Bank of India') + '</div>' +
          '</div>' +
          '<div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:6px;padding:10px 12px;">' +
            '<div style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px;">Circular ID</div>' +
            '<div style="font-size:12px;font-weight:700;color:#7c3aed;cursor:pointer;text-decoration:underline;" onclick="document.getElementById(\'ml-oblref-modal\').remove();renderAISuggestionPage(\'' + item.circId + '\')">' + item.circId + '</div>' +
          '</div>' +
        '</div>' +

        // Extracted clause
        '<div style="background:#f3f4f6;border:1px solid #e5e7eb;border-radius:6px;padding:14px;">' +
          '<div style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;margin-bottom:8px;">Extracted Clause Text</div>' +
          '<div style="font-size:12px;color:#374151;line-height:1.8;">' + clauseText + '</div>' +
        '</div>' +

      '</div>' +
      '<div class="dr-modal-foot">' +
        '<button class="dr-btn dr-btn-sec" onclick="document.getElementById(\'ml-oblref-modal\').remove();renderAISuggestionPage(\'' + item.circId + '\')">📄 View Full Circular Page</button>' +
        '<button class="dr-btn dr-btn-pri" onclick="document.getElementById(\'ml-oblref-modal\').remove()">Close</button>' +
      '</div>' +
    '</div>';

  document.body.appendChild(overlay);
  overlay.addEventListener('click', function(e){ if(e.target===overlay) overlay.remove(); });
};



window._mlOpenHistoryModal = function(item) {
  var ex = document.getElementById('ml-history-modal'); if (ex) ex.remove();

  var changeTypeColors = {
    'Original':   '#EAF3DE;color:#27500A',
    'Amended':    '#FAEEDA;color:#633806',
    'Clarified':  '#E6F1FB;color:#0C447C',
    'Superseded': '#FCEBEB;color:#791F1F',
    'No Change':  '#f3f4f6;color:#6b7280',
    'New':        '#EEEDFE;color:#3C3489'
  };

  var history = item.history && item.history.length ? item.history : [
    { version:'v1', circId: item.circId, section: item.clauseId || '—', changeType:'Original', summary:'Initial obligation extracted from circular.', date:'', changes:[] }
  ];

  // ── Timeline dots ──
  var timelineDots = history.map(function(h, i) {
    var isLast = i === history.length - 1;
    return '<div style="display:flex;flex-direction:column;align-items:center;gap:0;">' +
      '<div style="width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;' +
        (isLast ? 'background:#7c3aed;color:#fff;border:2px solid #5b21b6;' : 'background:#f3f4f6;color:#374151;border:2px solid #e5e7eb;') +
      '" title="' + h.circId + '">' + h.version + '</div>' +
      (isLast ? '<div style="font-size:9px;color:#7c3aed;font-weight:700;margin-top:2px;">current</div>' : '<div style="font-size:9px;color:#9ca3af;margin-top:2px;">&nbsp;</div>') +
    '</div>' +
    (i < history.length - 1 ? '<div style="flex:1;height:2px;background:#e5e7eb;margin:0 4px;align-self:center;min-width:24px;"></div>' : '');
  }).join('');

  // ── Version history table rows ──
  var tableRows = history.map(function(h, i) {
    var isLast = i === history.length - 1;
    var cc = changeTypeColors[h.changeType] || '#f3f4f6;color:#6b7280';

    var changesHtml = '';
    if (!h.changes || h.changes.length === 0) {
      changesHtml = h.changeType === 'Original'
        ? '<span style="font-size:11px;color:#9ca3af;font-style:italic;">Original version</span>'
        : '<span style="font-size:11px;color:#9ca3af;font-style:italic;">No changes to this OBL</span>';
    } else {
      changesHtml =
        '<table style="border-collapse:collapse;width:100%;">' +
          '<tr>' +
            '<td style="font-size:10px;font-weight:700;color:#6b7280;padding:2px 8px 4px 0;white-space:nowrap;">Field</td>' +
            '<td style="font-size:10px;font-weight:700;color:#6b7280;padding:2px 8px 4px 0;white-space:nowrap;">Before</td>' +
            '<td style="font-size:10px;font-weight:700;color:#6b7280;padding:2px 0 4px 0;white-space:nowrap;">After</td>' +
          '</tr>' +
          h.changes.map(function(ch) {
            return '<tr>' +
              '<td style="padding:3px 8px 3px 0;font-size:11px;font-weight:600;color:#374151;white-space:nowrap;">' + ch.field + '</td>' +
              '<td style="padding:3px 8px 3px 0;">' +
                '<span style="background:#fcebeb;color:#7f1d1d;padding:2px 8px;border-radius:4px;font-size:11px;font-family:monospace;white-space:nowrap;">' + ch.from + '</span>' +
              '</td>' +
              '<td style="padding:3px 0;">' +
                '<span style="background:#eaf3de;color:#14532d;padding:2px 8px;border-radius:4px;font-size:11px;font-family:monospace;white-space:nowrap;">' + ch.to + '</span>' +
              '</td>' +
            '</tr>';
          }).join('') +
        '</table>';
    }

    return '<tr style="border-bottom:1px solid #e5e7eb;background:' + (isLast ? '#faf5ff' : (h.changes && h.changes.length ? '#fff' : '#fafafa')) + ';">' +
      '<td style="padding:10px 12px;white-space:nowrap;vertical-align:top;">' +
        '<span style="font-family:monospace;font-size:11px;font-weight:700;color:#7c3aed;background:#f5f3ff;border:1px solid #e9d5ff;padding:2px 7px;border-radius:4px;">' + h.version + '</span>' +
        (isLast ? '<div style="font-size:9px;color:#7c3aed;font-weight:700;margin-top:4px;">★ current</div>' : '') +
      '</td>' +
      '<td style="padding:10px 12px;font-size:11px;font-weight:600;color:#374151;white-space:nowrap;vertical-align:top;">' + h.circId + '</td>' +
      '<td style="padding:10px 12px;font-size:11px;color:#6b7280;white-space:nowrap;vertical-align:top;">' + (h.section || '—') + '</td>' +
      '<td style="padding:10px 12px;font-size:11px;color:#6b7280;white-space:nowrap;vertical-align:top;">' + (h.date || '—') + '</td>' +
      '<td style="padding:10px 12px;vertical-align:top;">' +
        '<span style="padding:3px 10px;border-radius:12px;font-size:10px;font-weight:700;background:' + cc + ';white-space:nowrap;">' + h.changeType + '</span>' +
      '</td>' +
      '<td style="padding:10px 12px;font-size:11px;color:#374151;vertical-align:top;max-width:180px;line-height:1.5;">' + (h.summary || '') + '</td>' +
      '<td style="padding:10px 12px;vertical-align:top;min-width:240px;">' + changesHtml + '</td>' +
    '</tr>';
  }).join('');

  var overlay = document.createElement('div');
  overlay.className = 'dr-modal-overlay';
  overlay.id = 'ml-history-modal';

  overlay.innerHTML =
    '<div class="dr-modal" style="max-width:860px;">' +

      // ── HEAD ──
      '<div class="dr-modal-head">' +
        '<div class="dr-modal-head-left">' +
          '<div class="dr-modal-eyebrow">Amendment History</div>' +
          '<div class="dr-modal-subject">Obligation: ' + item.obligationId + '</div>' +
        '</div>' +
        '<button class="dr-modal-close" onclick="document.getElementById(\'ml-history-modal\').remove()">&#x2715;</button>' +
      '</div>' +

      // ── BODY ──
      '<div class="dr-modal-body" style="padding:20px;max-height:75vh;overflow-y:auto;">' +

        // Obligation name banner
        '<div style="background:#f5f3ff;border:1px solid #e9d5ff;border-radius:6px;padding:10px 14px;margin-bottom:20px;font-size:12px;color:#374151;line-height:1.5;">' +
          '<b style="font-size:10px;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;display:block;margin-bottom:4px;">Obligation</b>' +
          item.obligationName +
        '</div>' +

        // Timeline dots
        '<div style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;margin-bottom:10px;">Version Timeline</div>' +
        '<div style="display:flex;align-items:flex-start;margin-bottom:24px;padding:16px 20px;background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;">' +
          timelineDots +
        '</div>' +

        // Version history table
        '<div style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;margin-bottom:10px;">Version Details</div>' +
        '<div style="overflow-x:auto;">' +
        '<table style="width:100%;border-collapse:collapse;font-size:12px;">' +
          '<thead>' +
            '<tr style="background:#f3f4f6;border-bottom:2px solid #e5e7eb;">' +
              '<th style="padding:10px 12px;text-align:left;font-weight:700;color:#374151;white-space:nowrap;">Version</th>' +
              '<th style="padding:10px 12px;text-align:left;font-weight:700;color:#374151;white-space:nowrap;">Circular ID</th>' +
              '<th style="padding:10px 12px;text-align:left;font-weight:700;color:#374151;white-space:nowrap;">Section</th>' +
              '<th style="padding:10px 12px;text-align:left;font-weight:700;color:#374151;white-space:nowrap;">Date</th>' +
              '<th style="padding:10px 12px;text-align:left;font-weight:700;color:#374151;">Change Type</th>' +
              '<th style="padding:10px 12px;text-align:left;font-weight:700;color:#374151;">Summary</th>' +
              '<th style="padding:10px 12px;text-align:left;font-weight:700;color:#374151;">What Changed</th>' +
            '</tr>' +
          '</thead>' +
          '<tbody>' + tableRows + '</tbody>' +
        '</table>' +
        '</div>' +

      '</div>' +

      // ── FOOT ──
      '<div class="dr-modal-foot">' +
        '<span class="dr-modal-foot-note">Latest: ' + (history[history.length-1] ? history[history.length-1].circId : '—') + '</span>' +
        '<button class="dr-btn dr-btn-pri" onclick="document.getElementById(\'ml-history-modal\').remove()">Close</button>' +
      '</div>' +

    '</div>';

  document.body.appendChild(overlay);
  overlay.addEventListener('click', function(e){ if(e.target===overlay) overlay.remove(); });
};

window._mlOpenDetailPopup = function (item, idx) {
  var existing = document.getElementById('ml-detail-modal');
  if (existing) existing.remove();
var overlay = document.createElement('div');
  overlay.className = 'dr-modal-overlay'; overlay.id = 'ml-detail-modal';
  var circular = CMS_DATA.circulars.find(function(c) { return c.id === item.circId; }) || {};
  var obligation = (CMS_DATA.obligations || []).find(function(o){ return o.id === item.obligationId; }) || {};
  var task = CMS_DATA.library_tasks.find(function(t){ return t.id === item.actionId; }) || {};
  var clauseText = obligation.clauseText || task.clauseText || 'The entity shall ensure compliance with all reporting requirements as specified under the relevant circular, including timely submission of returns and maintenance of records as directed by the regulatory authority.';
  overlay.innerHTML =
    '<div class="dr-modal" style="max-width:680px;">' +
      '<div class="dr-modal-head">' +
        '<div class="dr-modal-head-left">' +
'<div class="dr-modal-subject">' + item.actionId + '</div>' +
'<div style="font-size:12px;color:#6b7280;margin-top:3px;font-weight:500;">' + (item.action||'') + '</div>' +        '</div>' +
        '<div style="display:flex;align-items:center;gap:8px;">' +
          '<div class="ml-row-kebab-wrap">' +
            '<button class="ml-row-kebab-btn" id="ml-detail-kebab">&#x22EE;</button>' +
            '<div class="ml-row-kebab-menu" id="ml-rkm-' + idx + '" style="display:none;">' +

      '<button class="ml-rkm-item" data-action="edit" data-idx="' + idx + '">&#x270E; Edit</button>' +
      '<button class="ml-rkm-item" data-action="mapped" data-idx="' + idx + '">&#x21C4; Mapped Actions</button>' +
      '<button class="ml-rkm-item" data-action="add" data-idx="' + idx + '">+ Add Action</button>' +
      '<button class="ml-rkm-item" id="ml-toolbar-crosscirc-btn">&#x1F4CB; Circular History</button>' +
    '</div>' +
          '</div>' +
          '<button class="dr-modal-close" onclick="document.getElementById(\'ml-detail-modal\').remove()">&#x2715;</button>' +
        '</div>' +
      '</div>' +
      '<div class="dr-modal-body" style="padding:0;">' +

        '<div style="padding:12px 20px;border-bottom:1px solid #e5e7eb;background:#fff;">' +
          '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">' +
            _mlDetailField('Internal Due Date', circular.issuedDate || circular.issueDate || '—') +
            _mlDetailField('External Due Date', item.dueDate || '—') +
            // _mlDetailField('Effective Date', circular.effectiveDate || '—') +
            _mlDetailField('Frequency', task.frequency || item.frequency || 'Monthly') +
            _mlDetailField('Status', '<span style="font-weight:600;font-size:11px;cursor:pointer;" onclick="_mlOpenStatusDropdown(' + idx + '); return false;">' + (item.status || 'Assigned') + '</span>') +
            _mlDetailField('Department', item.department || '—') +
            _mlDetailField('Assigned To', (function() {
  var a = item.assignedTo;
  if (!a || (typeof a === 'object' && !Object.keys(a).length)) return '—';
  if (typeof a === 'string') return a;
  return Object.entries(a).map(function(e) {
    return '<span style="display:inline-flex;align-items:center;gap:4px;margin:1px 2px;">' +
      '<span style="font-size:9px;color:#6b7280;background:#f3f4f6;padding:1px 5px;border-radius:3px;">' + e[0] + '</span>' +
      '<span style="background:#ede9fe;color:#5b21b6;padding:2px 7px;border-radius:12px;font-size:11px;font-weight:600;">' + e[1] + '</span>' +
    '</span>';
  }).join('');
})()) +
          '</div>' +
        '</div>' +

        '<div style="padding:0;border-bottom:1px solid #e5e7eb;">' +
          '<div style="padding:12px 20px;cursor:pointer;display:flex;justify-content:space-between;align-items:center;background:#f9fafb;border-bottom:1px solid #e5e7eb;" onclick="var el=document.getElementById(\'ml-evidence-details\');el.style.display=el.style.display===\'none\'?\'block\':\'none\';this.querySelector(\'.ml-acc-arrow\').textContent=el.style.display===\'none\'?\'▶\':\'▼\';">' +
            '<span style="font-weight:700;color:#374151;font-size:12px;display:flex;align-items:center;gap:8px;"><span class="ml-acc-arrow">▶</span> Evidence</span>' +
          '</div>' +
          '<div id="ml-evidence-details" style="padding:16px 20px;display:none;">' +
            '<ul style="margin:0;padding:0 0 0 16px;">' +
              (item.evidence && item.evidence.length ? item.evidence : ['1. Submit signed compliance certificate', '2. Upload board resolution copy', '3. Attach latest audit report']).map(function(e){ return '<li style="font-size:12px;color:#374151;margin-bottom:6px;">' + e + '</li>'; }).join('') +
            '</ul>' +
          '</div>' +
        '</div>' +

        '<div style="padding:0;border-bottom:1px solid #e5e7eb;">' +
          '<div style="padding:12px 20px;cursor:pointer;display:flex;justify-content:space-between;align-items:center;background:#f9fafb;border-bottom:1px solid #e5e7eb;" onclick="var el=document.getElementById(\'ml-basic-details\');el.style.display=el.style.display===\'none\'?\'block\':\'none\';this.querySelector(\'.ml-acc-arrow\').textContent=el.style.display===\'none\'?\'▶\':\'▼\';">' +
            '<span style="font-weight:700;color:#374151;font-size:12px;display:flex;align-items:center;gap:8px;"><span class="ml-acc-arrow">▶</span> Obligation Details</span>' +
          '</div>' +
          '<div id="ml-basic-details" style="padding:20px;display:none;">' +
            '<div style="display:grid;grid-template-columns:repeat(2, minmax(0, 1fr));gap:12px;">' +
              _mlDetailField('Obligation', '<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px;"><div style="flex:1;">' + (obligation.name || obligation.title || 'Ensure timely submission of it') + '</div><button class="dr-btn dr-btn-sec" style="font-size:11px;padding:4px 10px;white-space:nowrap;" onclick="renderAISuggestionPage(\'' + item.circId + '\')">📄 View Page</button></div>', true) +
              _mlDetailField('Tags', (item.tags && item.tags.length ? item.tags.join(', ') : 'Compliance, Reporting')) +
              _mlDetailField('Effective Date', circular.effectiveDate || '—') +
              _mlDetailField('Due Date', item.dueDate || '—') +
              _mlDetailField('Frequency', task.frequency || item.frequency || 'Monthly') +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div style="padding:0;border-bottom:1px solid #e5e7eb;">' +
          '<div style="padding:12px 20px;cursor:pointer;display:flex;justify-content:space-between;align-items:center;background:#f9fafb;border-bottom:1px solid #e5e7eb;" onclick="var el=document.getElementById(\'ml-clause-details\');el.style.display=el.style.display===\'none\'?\'block\':\'none\';this.querySelector(\'.ml-acc-arrow\').textContent=el.style.display===\'none\'?\'▶\':\'▼\';">' +
            '<span style="font-weight:700;color:#374151;font-size:12px;display:flex;align-items:center;gap:8px;"><span class="ml-acc-arrow">▶</span> Extracted Clause Description</span>' +
          '</div>' +
          '<div id="ml-clause-details" style="padding:16px 20px;display:none;">' +
            '<div style="background:#f3f4f6;border:1px solid #e5e7eb;border-radius:6px;padding:14px;">' +
              '<div style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;margin-bottom:8px;">Clause Text</div>' +
              '<div style="font-size:13px;color:#1f2937;line-height:1.7;">' + clauseText + '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div style="padding:0;border-bottom:1px solid #e5e7eb;">' +
          '<div style="padding:12px 20px;cursor:pointer;display:flex;justify-content:space-between;align-items:center;background:#f9fafb;border-bottom:1px solid #e5e7eb;" onclick="var el=document.getElementById(\'ml-reg-details\');el.style.display=el.style.display===\'none\'?\'block\':\'none\';this.querySelector(\'.ml-acc-arrow\').textContent=el.style.display===\'none\'?\'▶\':\'▼\';">' +
            '<span style="font-weight:700;color:#374151;font-size:12px;display:flex;align-items:center;gap:8px;"><span class="ml-acc-arrow">▼</span> Regulatory Details</span>' +
          '</div>' +
          '<div id="ml-reg-details" style="padding:16px 20px;display:block;">' +
            '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px;">' +
              _mlDetailField('Act Name', circular.actName || 'Banking Regulation Act, 1949') +
              _mlDetailField('Legislative Area', circular.legislativeArea || 'Financial Services') +
              _mlDetailField('Sub-Section', circular.subSection || 'Section 35A') +
              _mlDetailField('Regulatory Body', circular.regulator || 'Reserve Bank of India') +
            '</div>' +
            '<button class="dr-btn" style="font-size:11px;padding:6px 12px;background:#3b82f6;color:white;border:none;border-radius:4px;cursor:pointer;margin-top:8px;" onclick="alert(\'Viewing circular: ' + item.circId + '\');">&#x1F4C4; View Complete Circular</button>' +
          '</div>' +
        '</div>' +
        
      '</div>' +
      '<div class="dr-modal-foot">' +
        '<span class="dr-modal-foot-note">Circular: ' + ((circular.title||'').substring(0,50)) + '</span>' +
        '<button class="dr-btn dr-btn-pri" onclick="document.getElementById(\'ml-detail-modal\').remove()">Close</button>' +
      '</div>' +
    '</div>';
  document.body.appendChild(overlay);
  window._mlDetailItem = item;
  window._mlDetailIdx = idx;
  overlay.addEventListener('click', function(e){ if(e.target===overlay) overlay.remove(); });
  var kbtn = document.getElementById('ml-detail-kebab');
  var kmenu = document.getElementById('ml-rkm-' + idx);
  if (kbtn && kmenu) {
    kbtn.addEventListener('click', function(e){
      e.stopPropagation();
      kmenu.style.display = kmenu.style.display === 'none' ? 'block' : 'none';
    });
    // Wire up the menu item buttons
    kmenu.querySelectorAll('.ml-rkm-item').forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        kmenu.style.display = 'none';
        if (btn.dataset.action === 'edit') _mlOpenEditablePopup(window._mlDetailItem, window._mlDetailIdx);
        else if (btn.dataset.action === 'mapped') _mlOpenMappedActionsPopup(window._mlDetailItem);
        else if (btn.dataset.action === 'add') _mlOpenAddActionPopup(window._mlDetailItem.obligationId, window._mlDetailItem.actionId);
      });
    });
  }

  var crossBtn = document.getElementById('ml-toolbar-crosscirc-btn');
if (crossBtn) crossBtn.addEventListener('click', function() {
  tkMenu.style.display = 'none';
  _mlOpenCrossCircularView();
});
}

/* ── EXPORT POPUP ── */
window._mlOpenExportPopup = function() {
  var ex = document.getElementById('ml-export-modal'); if (ex) ex.remove();
  var overlay = document.createElement('div');
  overlay.className = 'dr-modal-overlay'; overlay.id = 'ml-export-modal';
  overlay.innerHTML =
    '<div class="dr-modal" style="max-width:420px;">' +
      '<div class="dr-modal-head"><div class="dr-modal-head-left"><div class="dr-modal-eyebrow">Export / Import</div><div class="dr-modal-subject">Action Items Data</div></div><button class="dr-modal-close" onclick="document.getElementById(\'ml-export-modal\').remove()">&#x2715;</button></div>' +
      '<div class="dr-modal-body" style="padding:20px;display:flex;flex-direction:column;gap:12px;">' +
        '<button class="dr-btn dr-btn-sec" style="width:100%;justify-content:flex-start;gap:10px;padding:12px 16px;" onclick="_mlDownloadTemplate()">&#x1F4E5; Download Template CSV</button>' +
        '<button class="dr-btn dr-btn-sec" style="width:100%;justify-content:flex-start;gap:10px;padding:12px 16px;" onclick="_mlExportCurrentData()">&#x1F4CA; Export Current Data</button>' +
        '<label class="dr-btn dr-btn-sec" style="width:100%;justify-content:flex-start;gap:10px;padding:12px 16px;cursor:pointer;">&#x1F4E4; Upload Excel<input type="file" accept=".xlsx,.xls,.csv" style="display:none;" onchange="showToast(\'Excel uploaded. Processing...\',\'success\');document.getElementById(\'ml-export-modal\').remove();"/></label>' +
      '</div>' +
    '</div>';
  document.body.appendChild(overlay);
  overlay.addEventListener('click', function(e){ if(e.target===overlay) overlay.remove(); });
};
window._mlDownloadTemplate = function() {
  var csv = 'Obl ID,Obligation Name,Action ID,Action,Department,Assigned To,Status,Due Date\n';
  csv += 'OBL-001,Sample obligation,ACT-001,Sample action,Compliance,John Doe,Assigned,2025-03-31\n';
  var blob = new Blob([csv],{type:'text/csv'});
  var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'action-items-template.csv'; a.click();
  document.getElementById('ml-export-modal').remove();
};
window._mlExportCurrentData = function() {
  var items = window._mlActionItems || [];
  var csv = 'Obl ID,Obligation Name,Action ID,Action,Department,Assigned To,Status,Due Date\n';
  items.forEach(function(i){ csv += [i.obligationId,'"'+i.obligationName+'"',i.actionId,'"'+i.action+'"',i.department,i.assignedTo,i.status,i.dueDate].join(',') + '\n'; });
  var blob = new Blob([csv],{type:'text/csv'});
  var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'action-items-export.csv'; a.click();
  document.getElementById('ml-export-modal').remove();
};

/* ── ADD OBLIGATION POPUP ── */
window._mlOpenAddObligationPopup = function() {
  var ex = document.getElementById('ml-add-obl-modal'); if (ex) ex.remove();
  var allDepts = ['Compliance','Risk','Legal','IT','Operations','HR','Finance','Credit'];
  var freqOptions = ['Monthly','Quarterly','Annually','Ad-hoc','As per Regulation'];
  var overlay = document.createElement('div');
  overlay.className = 'dr-modal-overlay'; overlay.id = 'ml-add-obl-modal';
  overlay.innerHTML =
    '<div class="dr-modal" style="max-width:560px;">' +
      '<div class="dr-modal-head"><div class="dr-modal-head-left"><div class="dr-modal-eyebrow">Add Obligation</div><div class="dr-modal-subject">New Obligation Entry</div></div><button class="dr-modal-close" onclick="document.getElementById(\'ml-add-obl-modal\').remove()">&#x2715;</button></div>' +
      '<div class="dr-modal-body" style="padding:20px;display:flex;flex-direction:column;gap:14px;">' +
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">' +
          '<div><label style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;display:block;margin-bottom:5px;">Obligation ID</label><input type="text" id="ml-new-obl-id" placeholder="OBL-XXX" style="width:100%;padding:9px 10px;border:1px solid #e5e7eb;border-radius:6px;font-size:13px;"/></div>' +
          '<div><label style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;display:block;margin-bottom:5px;">Circular</label><select id="ml-new-obl-circ" style="width:100%;padding:9px 10px;border:1px solid #e5e7eb;border-radius:6px;font-size:13px;background:white;">' + (CMS_DATA.circulars||[]).map(function(c){ return '<option value="'+c.id+'">'+c.id+'</option>'; }).join('') + '</select></div>' +
        '</div>' +
        '<div><label style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;display:block;margin-bottom:5px;">Obligation Name <span style="color:#ef4444;">*</span></label><textarea id="ml-new-obl-name" placeholder="Describe the obligation…" style="width:100%;padding:9px 10px;border:1px solid #e5e7eb;border-radius:6px;font-size:13px;min-height:70px;font-family:inherit;resize:vertical;"></textarea></div>' +
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">' +
          '<div><label style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;display:block;margin-bottom:5px;">Clause ID</label><input type="text" id="ml-new-obl-clauseid" placeholder="e.g. 1.1" style="width:100%;padding:9px 10px;border:1px solid #e5e7eb;border-radius:6px;font-size:13px;"/></div>' +
          '<div><label style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;display:block;margin-bottom:5px;">Department</label><select id="ml-new-obl-dept" style="width:100%;padding:9px 10px;border:1px solid #e5e7eb;border-radius:6px;font-size:13px;background:white;"><option value="">Select</option>' + allDepts.map(function(d){ return '<option>'+d+'</option>'; }).join('') + '</select></div>' +
          '<div><label style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;display:block;margin-bottom:5px;">Frequency</label><select id="ml-new-obl-freq" style="width:100%;padding:9px 10px;border:1px solid #e5e7eb;border-radius:6px;font-size:13px;background:white;">' + freqOptions.map(function(f){ return '<option>'+f+'</option>'; }).join('') + '</select></div>' +
          '<div><label style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;display:block;margin-bottom:5px;">Due Date</label><input type="date" id="ml-new-obl-due" style="width:100%;padding:9px 10px;border:1px solid #e5e7eb;border-radius:6px;font-size:13px;"/></div>' +
          '<div><label style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;display:block;margin-bottom:5px;">Section</label><input type="text" id="ml-new-obl-section" placeholder="e.g. Section 12" style="width:100%;padding:9px 10px;border:1px solid #e5e7eb;border-radius:6px;font-size:13px;"/></div>' +
          '<div><label style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;display:block;margin-bottom:5px;">Sub-Section</label><input type="text" id="ml-new-obl-subsec" placeholder="e.g. Clause (a)" style="width:100%;padding:9px 10px;border:1px solid #e5e7eb;border-radius:6px;font-size:13px;"/></div>' +
        '</div>' +
      '</div>' +
      '<div class="dr-modal-foot"><button class="dr-btn dr-btn-ghost" onclick="document.getElementById(\'ml-add-obl-modal\').remove()">Cancel</button><button class="dr-btn dr-btn-pri" onclick="_mlSaveNewObligation()">Save Obligation</button></div>' +
    '</div>';
  document.body.appendChild(overlay);
  overlay.addEventListener('click', function(e){ if(e.target===overlay) overlay.remove(); });
};
window._mlSaveNewObligation = function() {
  var name = document.getElementById('ml-new-obl-name').value.trim();
  if (!name) { showToast('Obligation name is required.','error'); return; }
  var id = document.getElementById('ml-new-obl-id').value.trim() || ('OBL-' + (Date.now()+'').slice(-4));
  showToast('Obligation ' + id + ' added.','success');
  document.getElementById('ml-add-obl-modal').remove();
};

/* ── OBLIGATION DETAIL POPUP ── */
window._mlOpenOblDetailPopup = function(item, idx) {
  var ex = document.getElementById('ml-obl-detail-modal'); if (ex) ex.remove();
  var overlay = document.createElement('div');
  overlay.className = 'dr-modal-overlay'; overlay.id = 'ml-obl-detail-modal';
  var circular = (CMS_DATA.circulars||[]).find(function(c){ return c.id === item.circId; }) || {};

  /* actions belonging to this obligation */
  var relatedActions = (window._mlActionItems||[]).filter(function(a){ return a.obligationId === item.obligationId; });

  var statusColors = {'Open':'#fef3c7;color:#b45309','In Progress':'#e0f2fe;color:#0369a1','Complete':'#dcfce7;color:#15803d','Assigned':'#ede9fe;color:#5b5fcf','Pending':'#fef3c7;color:#b45309','Compliant':'#dcfce7;color:#15803d','Unassigned':'#f3f4f6;color:#6b7280','Overdue':'#fee2e2;color:#991b1b','NA':'#f3f4f6;color:#6b7280'};

  overlay.innerHTML =
    '<div class="dr-modal" style="max-width:700px;">' +
      /* ── HEADER ── */
      '<div class="dr-modal-head">' +
        '<div class="dr-modal-head-left">' +
          '<div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">' +
            '<span style="font-family:monospace;font-size:12px;font-weight:800;color:#7c3aed;background:#f5f3ff;border:1px solid #e9d5ff;padding:3px 9px;border-radius:5px;">' + item.obligationId + '</span>' +
          '</div>' +
          '<div style="font-size:13px;font-weight:600;color:#1f2937;max-width:450px;line-height:1.4;">' + item.obligationName + '</div>' +
        '</div>' +
        '<div style="display:flex;align-items:center;gap:8px;">' +
          '<div class="ml-row-kebab-wrap">' +
            '<button class="ml-row-kebab-btn" id="ml-obl-kebab-btn">&#x22EE;</button>' +
            '<div class="ml-row-kebab-menu" id="ml-obl-kebab-menu" style="display:none;">' +
              '<button class="ml-rkm-item" onclick="document.getElementById(\'ml-obl-kebab-menu\').style.display=\'none\';_mlEnableOblEdit()">&#x270E; Edit</button>' +
              '<button class="ml-rkm-item" onclick="document.getElementById(\'ml-obl-kebab-menu\').style.display=\'none\';_mlOpenMappedClausesPopup(\'' + item.obligationId + '\')">&#x21C4; Mapped Obligations</button>' +
              '<button class="ml-rkm-item" onclick="document.getElementById(\'ml-obl-kebab-menu\').style.display=\'none\';document.getElementById(\'ml-obl-detail-modal\').remove();_mlOpenAddActionPopup(\'' + item.obligationId + '\',\'\')">+ Add Action</button>' +
            '</div>' +
          '</div>' +
          '<button class="dr-modal-close" onclick="document.getElementById(\'ml-obl-detail-modal\').remove()">&#x2715;</button>' +
        '</div>' +
      '</div>' +

      /* ── BODY ── */
      '<div class="dr-modal-body" style="padding:0;max-height:72vh;overflow-y:auto;">' +

        /* meta grid */
        '<div style="padding:14px 20px;border-bottom:1px solid #e5e7eb;background:#fff;">' +
          '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;" id="ml-obl-meta-grid">' +
            _mlOblField('Due Date',        item.dueDate || '—',                    'ml-obl-f-due') +
            _mlOblField('Effective Date',  circular.effectiveDate || '—',          'ml-obl-f-eff') +
            _mlOblField('Frequency',       item.frequency || 'Monthly',             'ml-obl-f-freq') +
            _mlOblField('Section',         circular.section || 'Section 12',        'ml-obl-f-sec') +
            _mlOblField('Sub-Section',     circular.subSection || 'Clause (a)',     'ml-obl-f-subsec') +
            _mlOblField('Department',      item.department || '—',                  'ml-obl-f-dept') +
            _mlOblField('Status',          item.status || '—',                      'ml-obl-f-status') +
            _mlOblField('Assigned To',     item.assignedTo || '—',                  'ml-obl-f-assignee') +
          '</div>' +
        '</div>' +

        /* ACTION ITEMS accordion */
        '<div style="border-bottom:1px solid #e5e7eb;">' +
          '<div style="padding:12px 20px;cursor:pointer;display:flex;justify-content:space-between;align-items:center;background:#f9fafb;" onclick="var el=document.getElementById(\'ml-obl-actions-body\');el.style.display=el.style.display===\'none\'?\'block\':\'none\';this.querySelector(\'.ml-acc-arrow\').textContent=el.style.display===\'none\'?\'▶\':\'▼\';">' +
            '<span style="font-weight:700;color:#374151;font-size:12px;display:flex;align-items:center;gap:8px;"><span class="ml-acc-arrow">▼</span> Action Items <span style="background:#e0f2fe;color:#0369a1;padding:1px 8px;border-radius:10px;font-size:10px;font-weight:700;">' + relatedActions.length + '</span></span>' +
          '</div>' +
          '<div id="ml-obl-actions-body" style="display:block;">' +
            (relatedActions.length ? (
              '<table style="width:100%;border-collapse:collapse;font-size:12px;">' +
                '<thead><tr style="background:#f3f4f6;border-bottom:2px solid #e5e7eb;">' +
                  '<th style="padding:9px 12px;text-align:left;font-weight:700;color:#374151;">Action ID</th>' +
                  '<th style="padding:9px 12px;text-align:left;font-weight:700;color:#374151;">Action</th>' +
                  '<th style="padding:9px 12px;text-align:left;font-weight:700;color:#374151;">Dept</th>' +
                  '<th style="padding:9px 12px;text-align:left;font-weight:700;color:#374151;">Status</th>' +
                '</tr></thead>' +
                '<tbody>' +
                relatedActions.map(function(a, ai) {
                  var sc = statusColors[a.status] || '#f3f4f6;color:#6b7280';
                  return '<tr style="border-bottom:1px solid #f3f4f6;">' +
                    '<td style="padding:9px 12px;"><span class="ml-obl-action-link" data-idx="' + window._mlActionItems.indexOf(a) + '" style="font-family:monospace;font-size:11px;font-weight:700;color:#3b82f6;cursor:pointer;text-decoration:underline;">' + a.actionId + '</span></td>' +
                    '<td style="padding:9px 12px;font-size:11px;color:#374151;max-width:220px;">' + (a.action||'').substring(0,60) + (a.action.length>60?'…':'') + '</td>' +
                    '<td style="padding:9px 12px;font-size:11px;color:#6b7280;">' + (a.department||'—') + '</td>' +
                    '<td style="padding:9px 12px;"><span style="padding:3px 9px;border-radius:10px;font-size:10px;font-weight:700;background:' + sc + ';">' + a.status + '</span></td>' +
                  '</tr>';
                }).join('') +
                '</tbody></table>'
            ) : '<div style="padding:16px 20px;font-size:12px;color:#9ca3af;font-style:italic;">No action items linked to this obligation.</div>') +
          '</div>' +
        '</div>' +

        /* EXTRACTED CLAUSE DESCRIPTION accordion */
        '<div style="border-bottom:1px solid #e5e7eb;">' +
          '<div style="padding:12px 20px;cursor:pointer;display:flex;justify-content:space-between;align-items:center;background:#f9fafb;" onclick="var el=document.getElementById(\'ml-obl-clause-body\');el.style.display=el.style.display===\'none\'?\'block\':\'none\';this.querySelector(\'.ml-acc-arrow\').textContent=el.style.display===\'none\'?\'▶\':\'▼\';">' +
            '<span style="font-weight:700;color:#374151;font-size:12px;display:flex;align-items:center;gap:8px;"><span class="ml-acc-arrow">▶</span> Extracted Clause Description</span>' +
          '</div>' +
          '<div id="ml-obl-clause-body" style="display:none;padding:16px 20px;">' +
            '<div style="background:#f3f4f6;border:1px solid #e5e7eb;border-radius:6px;padding:14px;">' +
              '<div style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;margin-bottom:8px;">Clause Text</div>' +
              '<div style="font-size:13px;color:#1f2937;line-height:1.7;">The entity shall ensure compliance with all reporting requirements as specified under the relevant circular, including timely submission of returns and maintenance of records as directed by the regulatory authority.</div>' +
            '</div>' +
          '</div>' +
        '</div>' +

        /* REGULATORY DETAILS accordion */
        '<div>' +
          '<div style="padding:12px 20px;cursor:pointer;display:flex;justify-content:space-between;align-items:center;background:#f9fafb;" onclick="var el=document.getElementById(\'ml-obl-reg-body\');el.style.display=el.style.display===\'none\'?\'block\':\'none\';this.querySelector(\'.ml-acc-arrow\').textContent=el.style.display===\'none\'?\'▶\':\'▼\';">' +
            '<span style="font-weight:700;color:#374151;font-size:12px;display:flex;align-items:center;gap:8px;"><span class="ml-acc-arrow">▼</span> Regulatory Details</span>' +
          '</div>' +
          '<div id="ml-obl-reg-body" style="display:block;padding:16px 20px;">' +
            '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">' +
              _mlOblField('Act Name',        circular.actName || 'Banking Regulation Act, 1949', '') +
              _mlOblField('Legislative Area', circular.legislativeArea || 'Financial Services', '') +
              _mlOblField('Sub-Section',     circular.subSection || 'Section 35A', '') +
              _mlOblField('Regulatory Body', circular.regulator || 'Reserve Bank of India', '') +
            '</div>' +
          '</div>' +
        '</div>' +

        // /* LINKED REFERENCE accordion */
'<div style="border-top:1px solid #e5e7eb;">' +
  '<div style="padding:12px 20px;cursor:pointer;display:flex;justify-content:space-between;align-items:center;background:#f9fafb;" onclick="var el=document.getElementById(\'ml-obl-linked-ref-body\');el.style.display=el.style.display===\'none\'?\'block\':\'none\';this.querySelector(\'.ml-acc-arrow\').textContent=el.style.display===\'none\'?\'▶\':\'▼\';">' +
    '<span style="font-weight:700;color:#374151;font-size:12px;display:flex;align-items:center;gap:8px;"><span class="ml-acc-arrow">▶</span> Linked Reference</span>' +
  '</div>' +
  '<div id="ml-obl-linked-ref-body" style="display:none;padding:0;">' +
    (function() {
      var dummyRefs = [
        { circId:'SEBI/2025/111', issueDate:'31 July 2025',     section:'5(1)', oblName:'REs shall submit a list of digital platforms provided by them for the investors', dueDate:'August 31, 2025',    docUrl:'https://www.sebi.gov.in/sebi_data/attachdocs/aug-2025/1234567890.pdf', isOriginal:true },
        { circId:'SEBI/2025/142', issueDate:'29 August 2025',   section:'3(2)', oblName:'REs shall submit a list of digital platforms provided by them for the investors', dueDate:'September 30, 2025', docUrl:'https://www.sebi.gov.in/sebi_data/attachdocs/aug-2025/1234567890.pdf', isOriginal:false },
        { circId:'SEBI/2025/198', issueDate:'08 December 2025', section:'4(c)', oblName:'REs shall submit a list of digital platforms provided by them for the investors', dueDate:'March 31, 2026',    docUrl:'https://www.sebi.gov.in/sebi_data/attachdocs/aug-2025/1234567890.pdf', isOriginal:false },
      ];
      return '<table style="width:100%;border-collapse:collapse;font-size:12px;">' +
        // Header row using td
        '<tbody>' +
        '<tr>' +
          '<td style="padding:10px 14px;font-size:11px;font-weight:700;color:#ffffff;background:#1e293b;white-space:nowrap;">Circular ID</td>' +
          '<td style="padding:10px 14px;font-size:11px;font-weight:700;color:#ffffff;background:#1e293b;white-space:nowrap;">Issue Date</td>' +
          '<td style="padding:10px 14px;font-size:11px;font-weight:700;color:#ffffff;background:#1e293b;white-space:nowrap;">Section</td>' +
          '<td style="padding:10px 14px;font-size:11px;font-weight:700;color:#ffffff;background:#1e293b;">Obligation Name</td>' +
          '<td style="padding:10px 14px;font-size:11px;font-weight:700;color:#ffffff;background:#1e293b;white-space:nowrap;">Due Date</td>' +
          '<td style="padding:10px 14px;font-size:11px;font-weight:700;color:#ffffff;background:#1e293b;text-align:center;white-space:nowrap;">Document</td>' +
        '</tr>' +
        dummyRefs.map(function(ref, ri) {
          var rowBg = ri % 2 === 0 ? '#fff' : '#fafafa';
          return '<tr style="border-bottom:1px solid #f0f0f0;background:' + rowBg + ';">' +
            '<td style="padding:10px 14px;white-space:nowrap;vertical-align:top;">' +
              '<span style="font-size:11px;font-weight:700;color:#4f46e5;">' + ref.circId + '</span>' +
              '<div style="margin-top:3px;">' +
                (ref.isOriginal
                  ? '<span style="font-size:9px;font-weight:700;padding:1px 7px;border-radius:10px;background:#dcfce7;color:#15803d;">Original</span>'
                  : '<span style="font-size:9px;font-weight:700;padding:1px 7px;border-radius:10px;background:#fef3c7;color:#b45309;">Amended</span>') +
              '</div>' +
            '</td>' +
            '<td style="padding:10px 14px;font-size:11px;color:#6b7280;white-space:nowrap;vertical-align:top;">' + ref.issueDate + '</td>' +
            '<td style="padding:10px 14px;white-space:nowrap;vertical-align:top;">' +
              '<span style="font-size:11px;font-weight:600;color:#0369a1;cursor:pointer;text-decoration:underline;" onclick="_mlOpenOblRefPopup(window._mlOblDetailItem)">' + ref.section + '</span>' +
            '</td>' +
            '<td style="padding:10px 14px;font-size:11px;color:#374151;line-height:1.5;max-width:220px;vertical-align:top;">' +
              ref.oblName.substring(0, 70) + (ref.oblName.length > 70 ? '…' : '') +
            '</td>' +
            '<td style="padding:10px 14px;font-size:12px;font-weight:600;color:' + (ref.isOriginal ? '#1f2937' : '#b45309') + ';white-space:nowrap;vertical-align:top;">' + ref.dueDate + '</td>' +
            '<td style="padding:10px 14px;text-align:center;vertical-align:top;">' +
              '<button onclick="window.open(\'' + ref.docUrl + '\',\'_blank\')" style="padding:4px 10px;background:#f3f4f6;border:1px solid #e5e7eb;border-radius:6px;font-size:11px;font-weight:600;color:#374151;cursor:pointer;white-space:nowrap;">&#x1F4C4; View Doc</button>' +
            '</td>' +
          '</tr>';
        }).join('') +
        '</tbody>' +
        '</table>';
    })() +
  '</div>' +
'</div>' +

      '</div>' +
      '<div class="dr-modal-foot"><span class="dr-modal-foot-note">Circular: ' + ((circular.title||'').substring(0,50)) + '</span><button class="dr-btn dr-btn-pri" onclick="document.getElementById(\'ml-obl-detail-modal\').remove()">Close</button></div>' +
    '</div>';
window._mlOblDetailItem = item;
  document.body.appendChild(overlay);
  overlay.addEventListener('click', function(e){ if(e.target===overlay) overlay.remove(); });

  /* kebab toggle */
  var kb = document.getElementById('ml-obl-kebab-btn');
  var km = document.getElementById('ml-obl-kebab-menu');
  if (kb && km) {
    kb.addEventListener('click', function(e){ e.stopPropagation(); km.style.display = km.style.display==='none'?'block':'none'; });
    document.addEventListener('click', function(){ km.style.display='none'; });
  }

  /* action ID links inside table → open action detail popup */
  overlay.querySelectorAll('.ml-obl-action-link').forEach(function(el){
    el.addEventListener('click', function(e){
      e.stopPropagation();
      var ai = parseInt(el.dataset.idx);
      if (!isNaN(ai)) _mlOpenDetailPopup(window._mlActionItems[ai], ai);
    });
  });
};

/* helper field for obl popup */
window._mlOblField = function(label, value, id) {
  return '<div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:6px;padding:10px 12px;"' + (id ? ' id="'+id+'"' : '') + '>' +
    '<div style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px;">' + label + '</div>' +
    '<div class="ml-obl-field-val" style="font-size:12px;font-weight:600;color:#1f2937;">' + value + '</div>' +
  '</div>';
};

/* enable edit mode for obl popup */
window._mlEnableOblEdit = function() {
  var grid = document.getElementById('ml-obl-meta-grid');
  if (!grid) return;
  grid.querySelectorAll('.ml-obl-field-val').forEach(function(el){
    el.contentEditable = 'true';
    el.style.outline = '1.5px dashed #bfdbfe';
    el.style.borderRadius = '3px';
    el.style.padding = '2px 4px';
    el.style.background = '#fff';
  });
  showToast('Fields are now editable. Click outside a field when done.','info');
};

/* mapped clauses popup (for obl detail kebab) */
window._mlOpenMappedClausesPopup = function(oblId) {
  var ex = document.getElementById('ml-mapped-clauses-modal'); if(ex) ex.remove();
  var mockClauses = [
    { clauseId:'1.1', clauseText:'The entity shall maintain a Board-approved compliance policy covering all aspects of this circular, reviewed annually.', dept:'Compliance', status:'Assigned' },
    { clauseId:'2.3', clauseText:'All LTV calculations must exclude stamp duty and registration charges from the property valuation.', dept:'Risk', status:'Pending' },
  ];
  var overlay = document.createElement('div');
  overlay.className = 'dr-modal-overlay'; overlay.id = 'ml-mapped-clauses-modal';
  overlay.innerHTML =
    '<div class="dr-modal" style="max-width:680px;">' +
      '<div class="dr-modal-head"><div class="dr-modal-head-left"><div class="dr-modal-eyebrow">Mapped Obligations</div><div class="dr-modal-subject">Obligation: ' + oblId + '</div></div><button class="dr-modal-close" onclick="document.getElementById(\'ml-mapped-clauses-modal\').remove()">&#x2715;</button></div>' +
      '<div class="dr-modal-body" style="padding:0;">' +
        '<table style="width:100%;border-collapse:collapse;font-size:12px;">' +
          '<thead><tr style="background:#f3f4f6;border-bottom:2px solid #e5e7eb;"><th style="padding:10px 14px;text-align:left;font-weight:700;color:#374151;">Clause ID</th><th style="padding:10px 14px;text-align:left;font-weight:700;color:#374151;">Clause Text</th><th style="padding:10px 14px;text-align:left;font-weight:700;color:#374151;">Dept</th><th style="padding:10px 14px;text-align:left;font-weight:700;color:#374151;">Status</th><th style="padding:10px 14px;"></th></tr></thead>' +
          '<tbody>' +
            mockClauses.map(function(c){
              // Change Type badge style="border-bottom:1px solid #f3f4f6;">' +
                '<td style="padding:10px 14px;font-family:monospace;font-size:11px;font-weight:700;color:#7c3aed;">' + c.clauseId + '</td>' +
                '<td style="padding:10px 14px;font-size:11px;color:#374151;max-width:260px;line-height:1.45;">' + c.clauseText.substring(0,80) + (c.clauseText.length>80?'…':'') + '</td>' +
                '<td style="padding:10px 14px;"><span style="background:#e0f2fe;color:#0369a1;padding:2px 8px;border-radius:4px;font-size:10px;font-weight:600;">' + c.dept + '</span></td>' +
                '<td style="padding:10px 14px;font-size:11px;color:#6b7280;">' + c.status + '</td>' +
                '<td style="padding:10px 14px;"><button onclick="this.closest(\'tr\').style.opacity=\'0.4\';showToast(\'Unmapped.\',\'success\')" style="padding:3px 9px;background:#fee2e2;border:1px solid #fca5a5;border-radius:4px;color:#dc2626;font-size:11px;font-weight:600;cursor:pointer;">Unmap</button></td>' +
              '</tr>';
            }).join('') +
          '</tbody>' +
        '</table>' +
      '</div>' +
      '<div class="dr-modal-foot"><button class="dr-btn dr-btn-pri" onclick="document.getElementById(\'ml-mapped-clauses-modal\').remove()">Close</button></div>' +
    '</div>';
  document.body.appendChild(overlay);
  overlay.addEventListener('click', function(e){ if(e.target===overlay) overlay.remove(); });
};

window._mlDetailField = function(label, value) {
  return '<div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:6px;padding:10px 12px;min-height:60px;">' +
    '<div style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px;">' + label + '</div>' +
    '<div style="font-size:12px;font-weight:600;color:#1f2937;word-break:break-word;">' + value + '</div>' +
  '</div>';
};

// DEPRECATED - Edit functionality moved to inline editing in detail modal
// Keeping for reference only - DO NOT USE
/*
window._mlOpenEditPopup = function (item, idx) { }
window._mlSaveEdit = function(idx) { }
*/

// DEPRECATED - Replaced by _mlOpenAddActionPopup
// This function is no longer used

window._mlOpenDepartmentSelector = function(idx) {
  var item = window._mlActionItems[idx];
  var allDepts = ['Compliance','Risk','Legal','IT','Operations','HR','Finance','Credit','Procurement','Finance'];
  var existing = document.getElementById('ml-dept-selector-modal');
  if (existing) existing.remove();
  var overlay = document.createElement('div');
  overlay.className = 'dr-modal-overlay'; overlay.id = 'ml-dept-selector-modal';
  overlay.innerHTML =
    '<div class="dr-modal" style="max-width:420px;">' +
      '<div class="dr-modal-head"><div class="dr-modal-head-left"><div class="dr-modal-eyebrow">Select Department</div><div class="dr-modal-subject">Action: ' + item.actionId + '</div></div><button class="dr-modal-close" onclick="document.getElementById(\'ml-dept-selector-modal\').remove()">&#x2715;</button></div>' +
      '<div class="dr-modal-body" style="padding:20px;">' +
        '<input type="text" id="ml-dept-search" placeholder="Search departments…" style="width:100%;padding:10px;border:1px solid #e5e7eb;border-radius:6px;margin-bottom:16px;font-size:13px;"/>' +
        '<div id="ml-dept-list" style="max-height:300px;overflow-y:auto;">' +
          allDepts.map(function(d, i) {
            return '<label style="display:flex;align-items:center;padding:10px 12px;border:1px solid #e5e7eb;border-radius:6px;margin-bottom:8px;cursor:pointer;background:#f9fafb;transition:all 0.2s;">' +
              '<input type="checkbox" value="' + d + '" id="ml-dept-' + i + '" ' + 
  (item.department && item.department.split(',').map(function(x){return x.trim();}).indexOf(d) > -1 ? 'checked' : '') + 
  ' style="width:18px;height:18px;cursor:pointer;accent-color:#3b82f6;"/>' +
              '<span style="margin-left:10px;font-weight:500;color:#374151;flex:1;">' + d + '</span>' +
            '</label>';
          }).join('') +
        '</div>' +
      '</div>' +
      '<div class="dr-modal-foot">' +
        '<button class="dr-btn dr-btn-ghost" onclick="document.getElementById(\'ml-dept-selector-modal\').remove()">Cancel</button>' +
        '<button class="dr-btn dr-btn-pri" onclick="_mlSaveDepartment(' + idx + ')">Save</button>' +
      '</div>' +
    '</div>';
  document.body.appendChild(overlay);
  overlay.addEventListener('click', function(e){ if(e.target===overlay) overlay.remove(); });
}

window._mlOpenAssigneeSelector = function(idx) {
  var item = window._mlActionItems[idx];
  var allAssignees = _mlGetUniqueAssignees();

  // Parse current depts
  var depts = item.department
    ? item.department.split(',').map(function(d){ return d.trim(); }).filter(Boolean)
    : ['General'];

  // Parse current assignees (store as object: { dept: assignee })
  var currentMap = {};
  if (typeof item.assignedTo === 'object' && !Array.isArray(item.assignedTo)) {
    currentMap = item.assignedTo;
  } else if (typeof item.assignedTo === 'string' && item.assignedTo.trim()) {
    // migrate legacy single string → assign to first dept
    currentMap[depts[0]] = item.assignedTo;
  }

  var existing = document.getElementById('ml-assignee-selector-modal');
  if (existing) existing.remove();

  var overlay = document.createElement('div');
  overlay.className = 'dr-modal-overlay';
  overlay.id = 'ml-assignee-selector-modal';

  overlay.innerHTML =
    '<div class="dr-modal" style="max-width:460px;">' +
      '<div class="dr-modal-head">' +
        '<div class="dr-modal-head-left">' +
          '<div class="dr-modal-eyebrow">Assign To</div>' +
          '<div class="dr-modal-subject">Action: ' + item.actionId + '</div>' +
        '</div>' +
        '<button class="dr-modal-close" onclick="document.getElementById(\'ml-assignee-selector-modal\').remove()">&#x2715;</button>' +
      '</div>' +
      '<div class="dr-modal-body" style="padding:20px;display:flex;flex-direction:column;gap:14px;">' +
        depts.map(function(dept) {
          var currentVal = currentMap[dept] || '';
          return '<div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:12px 14px;">' +
            '<div style="font-size:10px;font-weight:700;color:#0369a1;text-transform:uppercase;letter-spacing:.05em;margin-bottom:8px;">' +
              '<span style="background:#e0f2fe;padding:2px 8px;border-radius:4px;">' + dept + '</span>' +
            '</div>' +
            '<select class="ml-dept-assignee-select" data-dept="' + dept + '" ' +
              'style="width:100%;padding:9px 10px;border:1px solid #d1d5db;border-radius:6px;font-size:13px;background:white;">' +
              '<option value="">— Select assignee —</option>' +
              allAssignees.map(function(name) {
                return '<option value="' + name + '"' + (currentVal === name ? ' selected' : '') + '>' + name + '</option>';
              }).join('') +
            '</select>' +
            '<input type="text" class="ml-dept-assignee-input" data-dept="' + dept + '" placeholder="Or type a name…" value="' + currentVal + '" style="width:100%;margin-top:6px;padding:8px 10px;border:1px solid #d1d5db;border-radius:6px;font-size:13px;"/>' +
          '</div>';
        }).join('') +
      '</div>' +
      '<div class="dr-modal-foot">' +
        '<button class="dr-btn dr-btn-ghost" onclick="document.getElementById(\'ml-assignee-selector-modal\').remove()">Cancel</button>' +
        '<button class="dr-btn dr-btn-pri" onclick="_mlSaveAssignee(' + idx + ')">Save</button>' +
      '</div>' +
    '</div>';

  document.body.appendChild(overlay);
  overlay.addEventListener('click', function(e){ if(e.target===overlay) overlay.remove(); });
};

window._mlSaveAssignee = function(idx) {
  var selects = document.querySelectorAll('#ml-assignee-selector-modal .ml-dept-assignee-select');
  var assigneeMap = {};
  selects.forEach(function(sel) {
    var dept = sel.dataset.dept;
    var val = sel.value;
    if (!val) {
      // fall back to free-text input for this dept
      var inp = document.querySelector('#ml-assignee-selector-modal .ml-dept-assignee-input[data-dept="' + dept + '"]');
      if (inp && inp.value.trim()) val = inp.value.trim();
    }
    if (val) assigneeMap[dept] = val;
  });

  // Capture actionId before any re-render
  var actionId = window._mlActionItems[idx].actionId;

  window._mlActionItems[idx].assignedTo = assigneeMap;

  var task = CMS_DATA.library_tasks.find(function(t){ return t.id === actionId; });
  if (task) task.assignee = assigneeMap;

  document.getElementById('ml-assignee-selector-modal').remove();

  // Patch only the affected cell — no full re-render so object isn't lost
  var rows = document.querySelectorAll('#ml-tbody .ml-action-row');
  rows.forEach(function(row) {
    if (parseInt(row.dataset.idx) === idx) {
      var cell = row.querySelector('.ml-inline-assignee');
      if (!cell) return;
      var isEmpty = !assigneeMap || !Object.keys(assigneeMap).length;
      if (isEmpty) {
        cell.innerHTML = '<span style="color:#9ca3af;font-style:italic;font-size:12px;">Assign</span>';
      } else {
        cell.innerHTML = Object.entries(assigneeMap).map(function(entry) {
          return '<div style="display:flex;align-items:center;gap:4px;margin:2px 0;">' +
            '<span style="font-size:9px;color:#6b7280;background:#f3f4f6;padding:1px 5px;border-radius:3px;min-width:52px;text-align:center;">' + entry[0] + '</span>' +
            '<span style="background:#ede9fe;color:#5b21b6;border:1px solid #ddd6fe;padding:2px 8px;border-radius:20px;font-size:11px;font-weight:600;">' + entry[1] + '</span>' +
          '</div>';
        }).join('');
      }
    }
  });

  // Also sync department cell in case it changed
  var rows2 = document.querySelectorAll('#ml-tbody .ml-action-row');
  rows2.forEach(function(row) {
    if (parseInt(row.dataset.idx) === idx) {
      var deptCell = row.querySelector('.ml-inline-dept');
      var item = window._mlActionItems[idx];
      if (deptCell && item.department) {
        deptCell.innerHTML = item.department.split(',').map(function(d) {
          return '<span style="background:#e0f2fe;color:#0369a1;padding:2px 6px;border-radius:3px;font-size:11px;font-weight:600;display:inline-block;margin:1px;">' + d.trim() + '</span>';
        }).join('');
      }
    }
  });
  if (window._mlActiveView === 'chapter') _mlRenderChapterView(_mlGetFilteredCircs());
  showToast('Assignees updated.', 'success');
};

window._mlOpenStatusDropdown = function(idx) {
  var item = window._mlActionItems[idx];
  var statusOptions = ['Assigned', 'Unassigned', 'Not Applicable'];
  var existing = document.getElementById('ml-status-dropdown-modal');
  if (existing) existing.remove();
  var overlay = document.createElement('div');
  overlay.className = 'dr-modal-overlay'; overlay.id = 'ml-status-dropdown-modal';
  overlay.innerHTML =
    '<div class="dr-modal" style="max-width:380px;">' +
      '<div class="dr-modal-head"><div class="dr-modal-head-left"><div class="dr-modal-eyebrow">Change Status</div><div class="dr-modal-subject">Action: ' + item.actionId + '</div></div><button class="dr-modal-close" onclick="document.getElementById(\'ml-status-dropdown-modal\').remove()">&#x2715;</button></div>' +
      '<div class="dr-modal-body" style="padding:20px;">' +
        '<div style="display:flex;flex-direction:column;gap:8px;">' +
          statusOptions.map(function(status) {
            var isSelected = item.status === status;
            return '<button style="padding:12px 16px;text-align:left;border:2px solid ' + (isSelected ? '#3b82f6' : '#e5e7eb') + ';background:' + (isSelected ? '#eff6ff' : '#fff') + ';border-radius:6px;cursor:pointer;font-weight:' + (isSelected ? '600' : '500') + ';color:#1f2937;transition:all 0.2s;" onclick="_mlUpdateStatus(' + idx + ', \'' + status + '\'); document.getElementById(\'ml-status-dropdown-modal\').remove();">' +
              status +
            '</button>';
          }).join('') +
        '</div>' +
      '</div>' +
    '</div>';
  document.body.appendChild(overlay);
  overlay.addEventListener('click', function(e){ if(e.target===overlay) overlay.remove(); });
}

window._mlUpdateStatus = function(idx, newStatus) {
  window._mlActionItems[idx].status = newStatus;
  if (window._mlActiveView === 'chapter') _mlRenderChapterView(_mlGetFilteredCircs());
  else _mlRenderTable(CMS_DATA.circulars);
  showToast('Status updated to ' + newStatus + '.', 'success');
}

window._mlOpenMappedActionsPopup = function(item) {
  var existing = document.getElementById('ml-mapped-modal');
  if (existing) existing.remove();
  var overlay = document.createElement('div');
  overlay.className = 'dr-modal-overlay'; overlay.id = 'ml-mapped-modal';
  var dummyMapped = [
    { actionId: 'ACT-002', obligationId: 'OBL-2024-02', obligationName: 'Quarterly Regulatory Reporting — submission of financial and compliance returns to the designated regulatory authority on a periodic basis.', dept: 'Compliance', status: 'Assigned' },
    { actionId: 'ACT-007', obligationId: 'OBL-2024-05', obligationName: 'KYC Maintenance — periodic update and verification of Know Your Customer records across all active customer accounts as mandated.', dept: 'Operations', status: 'Assigned' },
    { actionId: 'ACT-011', obligationId: 'OBL-2024-03', obligationName: 'Risk Assessment Review — conduct structured internal risk assessment covering operational, credit and compliance risks on a scheduled frequency.', dept: 'Risk', status: 'Assigned' },
    { actionId: 'ACT-015', obligationId: 'OBL-2024-07', obligationName: 'Annual Compliance Certificate — preparation and filing of the annual compliance certificate with the relevant statutory and regulatory bodies.', dept: 'Legal', status: 'Unassigned' },
  ];
  var statusColors = {'Open':'#fef3c7;color:#b45309','In Progress':'#e0f2fe;color:#0369a1','Assigned':'#dcfce7;color:#15803d','Unassigned':'#fef3c7;color:#b45309'};
  overlay.innerHTML =
    '<div class="dr-modal" style="max-width:780px;">' +
      '<div class="dr-modal-head">' +
  '<div class="dr-modal-head-left">' +
    '<div class="dr-modal-eyebrow">Mapped Obligations</div>' +
    '<div class="dr-modal-subject">Action: ' + item.actionId + ' — ' + (item.action||'').substring(0,50) + '</div>' +
  '</div>' +
  '<div style="display:flex;align-items:center;gap:8px;">' +
    '<button class="dr-btn dr-btn-sec" style="font-size:11px;" onclick="_mlOpenBulkMapModal(\'' + item.actionId + '\')">+ Map More Obligations</button>' +
    '<button class="dr-modal-close" onclick="document.getElementById(\'ml-mapped-modal\').remove()">&#x2715;</button>' +
  '</div>' +
'</div>' +
      '<div class="dr-modal-body" style="padding:0;">' +
        '<div style="padding:12px 20px;background:#fffbeb;border-bottom:1px solid #fde68a;font-size:12px;color:#92400e;">&#x26A0; This action is mapped across multiple obligations. Completing it here may fulfil requirements in the following:</div>' +
        '<table style="width:100%;border-collapse:collapse;font-size:12px;">' +
            '<thead><tr style="background:#f3f4f6;border-bottom:2px solid #e5e7eb;">' +
            '<th style="padding:12px;width:32px;"><input type="checkbox" id="ml-mapped-select-all" onchange="_mlToggleAllMappedRows(this)" style="accent-color:#3b82f6;width:15px;height:15px;"/></th>' +
  '<th style="padding:12px;text-align:left;font-weight:700;color:#374151;white-space:nowrap;">Obligation ID</th>' +
  '<th style="padding:12px;text-align:left;font-weight:700;color:#374151;">Obligation Name</th>' +
  '<th style="padding:12px;text-align:left;font-weight:700;color:#374151;white-space:nowrap;">Department</th>' +
  '<th style="padding:12px;text-align:left;font-weight:700;color:#374151;white-space:nowrap;">Status</th>' +
  '<th style="padding:12px;text-align:left;font-weight:700;color:#374151;white-space:nowrap;">Action</th>' +
            '</tr></thead>' +
          '<tbody>' +
          dummyMapped.map(function(m) {
            var sc = statusColors[m.status] || '#f3f4f6;color:#6b7280';
           return '<tr style="border-bottom:1px solid #e5e7eb;background:#fafafa;" id="ml-mapped-row-' + m.obligationId + '">' +
  '<td style="padding:12px;"><input type="checkbox" class="ml-mapped-row-cb" data-oblid="' + m.obligationId + '" style="accent-color:#3b82f6;width:15px;height:15px;"/></td>' +
  '<td style="padding:12px;font-size:11px;font-weight:600;color:#374151;white-space:nowrap;">' + m.obligationId + '</td>' +
  '<td style="padding:12px;font-size:11px;color:#4b5563;line-height:1.5;">' + m.obligationName + '</td>' +
  '<td style="padding:12px;"><span style="background:#e0f2fe;color:#0369a1;padding:3px 8px;border-radius:4px;font-size:11px;font-weight:600;white-space:nowrap;">' + m.dept + '</span></td>' +
  '<td style="padding:12px;white-space:nowrap;"><span style="background:' + sc + ';padding:3px 10px;border-radius:4px;font-size:10px;font-weight:700;">' + m.status + '</span></td>' +
  '<td style="padding:12px;"><button onclick="_mlUnmapObligation(\'' + m.obligationId + '\')" style="padding:3px 10px;background:#fee2e2;border:1px solid #fca5a5;border-radius:4px;color:#dc2626;font-size:11px;font-weight:600;cursor:pointer;">Unmap</button></td>' +
'</tr>';
          }).join('') +
          '</tbody>' +
        '</table>' +
      '</div>' +
      '<div class="dr-modal-foot" style="justify-content:space-between;">' +
  '<div style="display:flex;gap:8px;align-items:center;">' +
    '<span class="dr-modal-foot-note" id="ml-mapped-sel-count">0 selected</span>' +
    '<button class="dr-btn dr-btn-ghost" style="font-size:11px;color:#dc2626;border-color:#fca5a5;" onclick="_mlUnmapSelected()">Unmap Selected</button>' +
  '</div>' +
  '<button class="dr-btn dr-btn-pri" onclick="document.getElementById(\'ml-mapped-modal\').remove()">Close</button>' +
'</div>' +
    '</div>';
  document.body.appendChild(overlay);
  overlay.addEventListener('click', function(e){ if(e.target===overlay) overlay.remove(); });
}


window._mlToggleAllMappedRows = function(masterCb) {
  document.querySelectorAll('.ml-mapped-row-cb').forEach(function(cb) {
    cb.checked = masterCb.checked;
  });
  _mlUpdateMappedSelCount();
};

window._mlUpdateMappedSelCount = function() {
  var count = document.querySelectorAll('.ml-mapped-row-cb:checked').length;
  var el = document.getElementById('ml-mapped-sel-count');
  if (el) el.textContent = count + ' selected';
};

window._mlUnmapObligation = function(oblId) {
  var row = document.getElementById('ml-mapped-row-' + oblId);
  if (row) { row.style.opacity = '0.4'; row.style.pointerEvents = 'none'; }
  showToast('Obligation ' + oblId + ' unmapped.', 'success');
};

window._mlUnmapSelected = function() {
  var checked = document.querySelectorAll('.ml-mapped-row-cb:checked');
  if (!checked.length) { showToast('No obligations selected.', 'error'); return; }
  checked.forEach(function(cb) { _mlUnmapObligation(cb.dataset.oblid); });
  showToast(checked.length + ' obligation(s) unmapped.', 'success');
};

window._mlOpenBulkMapModal = function(actionId) {
  /* 
    Show a searchable list of ALL obligations from CMS_DATA
    Each row has a checkbox + obligation ID + name + circular
    "Map Selected" button calls _mlSaveBulkMap(actionId, selectedOblIds)
    Already-mapped ones shown pre-checked
  */
  var existing = document.getElementById('ml-bulk-map-modal');
  if (existing) existing.remove();
  var allObligs = [];
  (CMS_DATA.circulars || []).forEach(function(c) {
    (c.chapters || []).forEach(function(ch) {
      (ch.clauses || []).forEach(function(cl) {
        (cl.obligations || (cl.obligation ? [cl.obligation] : [])).forEach(function(ob, oi) {
          allObligs.push({
            id: c.id + ':' + cl.id + ':OB' + (oi+1),
            name: typeof ob === 'string' ? ob : (ob.text || ob),
            circTitle: c.title || c.id,
            dept: cl.department || '—'
          });
        });
      });
    });
  });
  var overlay = document.createElement('div');
  overlay.className = 'dr-modal-overlay'; overlay.id = 'ml-bulk-map-modal';
  overlay.innerHTML =
    '<div class="dr-modal" style="max-width:700px;">' +
      '<div class="dr-modal-head">' +
        '<div class="dr-modal-head-left"><div class="dr-modal-eyebrow">Map Obligations</div><div class="dr-modal-subject">Action: ' + actionId + '</div></div>' +
        '<button class="dr-modal-close" onclick="document.getElementById(\'ml-bulk-map-modal\').remove()">&#x2715;</button>' +
      '</div>' +
      '<div style="padding:12px 16px;border-bottom:1px solid #e5e7eb;">' +
        '<input type="text" placeholder="Search obligations…" style="width:100%;padding:9px 10px;border:1px solid #e5e7eb;border-radius:6px;font-size:13px;" oninput="var q=this.value.toLowerCase();document.querySelectorAll(\'.ml-bulk-ob-row\').forEach(function(r){r.style.display=r.dataset.search.includes(q)?\'table-row\':\'none\';})" />' +
      '</div>' +
      '<div class="dr-modal-body" style="padding:0;max-height:50vh;overflow-y:auto;">' +
        '<table style="width:100%;border-collapse:collapse;font-size:12px;">' +
          '<thead><tr style="background:#f3f4f6;border-bottom:2px solid #e5e7eb;">' +
            '<th style="padding:10px;width:32px;"><input type="checkbox" onchange="this.closest(\'table\').querySelectorAll(\'.ml-bulk-ob-cb\').forEach(function(c){c.checked=this.checked;}.bind(this))" style="accent-color:#3b82f6;"/></th>' +
            '<th style="padding:10px;text-align:left;">Obligation ID</th>' +
            '<th style="padding:10px;text-align:left;">Obligation</th>' +
            '<th style="padding:10px;text-align:left;">Circular</th>' +
            '<th style="padding:10px;text-align:left;">Dept</th>' +
          '</tr></thead>' +
          '<tbody>' +
            allObligs.map(function(ob) {
              return '<tr class="ml-bulk-ob-row" data-search="' + (ob.id + ' ' + ob.name + ' ' + ob.circTitle).toLowerCase() + '" style="border-bottom:1px solid #f3f4f6;">' +
                '<td style="padding:10px;"><input type="checkbox" class="ml-bulk-ob-cb" value="' + ob.id + '" style="accent-color:#3b82f6;"/></td>' +
                '<td style="padding:10px;font-family:monospace;font-size:10px;font-weight:700;color:#7c3aed;white-space:nowrap;">' + ob.id + '</td>' +
                '<td style="padding:10px;font-size:11px;color:#374151;max-width:240px;">' + (ob.name||'').substring(0,80) + (ob.name.length>80?'…':'') + '</td>' +
                '<td style="padding:10px;font-size:11px;color:#6b7280;">' + ob.circTitle.substring(0,30) + '</td>' +
                '<td style="padding:10px;"><span style="background:#e0f2fe;color:#0369a1;padding:2px 6px;border-radius:3px;font-size:10px;font-weight:600;">' + ob.dept + '</span></td>' +
              '</tr>';
            }).join('') +
          '</tbody>' +
        '</table>' +
      '</div>' +
      '<div class="dr-modal-foot">' +
        '<button class="dr-btn dr-btn-ghost" onclick="document.getElementById(\'ml-bulk-map-modal\').remove()">Cancel</button>' +
        '<button class="dr-btn dr-btn-pri" onclick="_mlSaveBulkMap(\'' + actionId + '\')">Map Selected Obligations to Action</button>' +
      '</div>' +
    '</div>';
  document.body.appendChild(overlay);
  overlay.addEventListener('click', function(e){ if(e.target===overlay) overlay.remove(); });
};

window._mlSaveBulkMap = function(actionId) {
  var checked = document.querySelectorAll('#ml-bulk-map-modal .ml-bulk-ob-cb:checked');
  if (!checked.length) { showToast('Select at least one obligation.', 'error'); return; }
  showToast(checked.length + ' obligation(s) mapped to ' + actionId + '.', 'success');
  document.getElementById('ml-bulk-map-modal').remove();
};

window._mlOpenAddActionPopup = function(obligationId, parentActionId) {
  var existing = document.getElementById('ml-add-action-modal');
  if (existing) existing.remove();
  var allDepts = ['Compliance','Risk','Legal','IT','Operations','HR','Finance','Credit','Procurement'];
  var allAssignees = _mlGetUniqueAssignees();
  var overlay = document.createElement('div');
  overlay.className = 'dr-modal-overlay'; overlay.id = 'ml-add-action-modal';
  var lastId = CMS_DATA.library_tasks.length ? CMS_DATA.library_tasks[CMS_DATA.library_tasks.length-1].id : 'ACT-000';
  var nextNum = parseInt((lastId.split('-')[1] || '0')) + 1;
  var nextId = 'ACT-' + nextNum.toString().padStart(3, '0');
  var dummyDescs = [
    'Ensure all customer-facing compliance documents are reviewed, updated and filed with the appropriate regulatory authority within the stipulated timeframe as per circular.',
    'Conduct a comprehensive internal audit of operational processes to verify alignment with the latest regulatory guidelines and identify any gaps requiring immediate remediation.',
    'Prepare and submit the mandatory periodic return to the regulatory body, ensuring accuracy of data, completeness of disclosures and adherence to prescribed format and schedule.',
    'Review and update the internal policy framework to incorporate requirements from the latest circular, including staff communication and acknowledgement sign-off procedures.'
  ];
  var placeholderDesc = dummyDescs[Math.floor(Math.random() * dummyDescs.length)];
  overlay.innerHTML =
    '<div class="dr-modal" style="max-width:560px;">' +
      '<div class="dr-modal-head">' +
        '<div class="dr-modal-head-left">' +
          '<div class="dr-modal-eyebrow">Add New Action</div>' +
          '<div class="dr-modal-subject">Under Obligation: ' + (obligationId || 'General') + '</div>' +
        '</div>' +
        '<button class="dr-modal-close" onclick="document.getElementById(\'ml-add-action-modal\').remove()">&#x2715;</button>' +
      '</div>' +
      '<div class="dr-modal-body" style="padding:20px;">' +

        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px;">' +
          '<div>' +
            '<label style="display:block;font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;margin-bottom:5px;">Action ID</label>' +
            '<input type="text" value="' + nextId + '" disabled style="width:100%;padding:9px 10px;border:1px solid #e5e7eb;border-radius:6px;background:#f3f4f6;color:#6b7280;font-size:13px;font-weight:600;"/>' +
          '</div>' +
          '<div>' +
            '<label style="display:block;font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;margin-bottom:5px;">Due Date</label>' +
            '<input type="date" id="ml-new-action-duedate" style="width:100%;padding:9px 10px;border:1px solid #e5e7eb;border-radius:6px;font-size:13px;"/>' +
          '</div>' +
        '</div>' +

'<div style="margin-bottom:14px;">' +
  '<label style="display:block;font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;margin-bottom:5px;">Obligation</label>' +
  '<div style="position:relative;">' +
    '<input type="text" id="ml-new-action-obl-search" placeholder="Search obligation by ID or name…" autocomplete="off" ' +
      'style="width:100%;padding:9px 10px;border:1px solid #e5e7eb;border-radius:6px;font-size:12px;box-sizing:border-box;' + (obligationId ? 'background:#f3f4f6;color:#6b7280;' : '') + '" ' +
      (obligationId ? 'disabled ' : '') +
      'oninput="_mlFilterOblSearch()" onfocus="_mlShowOblDropdown()" />' +
    '<div id="ml-new-action-obl-drop" style="display:none;position:absolute;top:calc(100% + 3px);left:0;right:0;background:#fff;border:1.5px solid #e5e7eb;border-radius:8px;box-shadow:0 6px 20px rgba(0,0,0,.1);z-index:9999;max-height:200px;overflow-y:auto;">' +
      (function() {
        var mockObligs = [
          { id:'OBL-001', name:'Establish and maintain a Board-approved cybersecurity governance framework with designated oversight committee' },
          { id:'OBL-002', name:'Conduct annual independent cybersecurity risk assessment covering all IT assets, vendors and data flows' },
          { id:'OBL-003', name:'Update and enforce transaction monitoring thresholds as per revised AML/KYC regulatory requirements' },
          { id:'OBL-004', name:'Ensure all sensitive personal data of Indian citizens is stored on servers located within Indian territory' },
          { id:'OBL-005', name:'Measure and disclose Scope 1, 2, and 3 carbon emissions annually in the prescribed ESG reporting format' },
          { id:'OBL-006', name:'Conduct enhanced due diligence on all critical vendors prior to onboarding and on a periodic basis thereafter' },
          { id:'OBL-007', name:'Ensure all housing finance operations comply with consolidated RBI guidelines and maintain board-approved policy' },
          { id:'OBL-008', name:'Segregate and correctly classify land-only loans separate from housing loan portfolio in MIS and regulatory reporting' },
          { id:'OBL-009', name:'Enforce Loan-to-Value ratio limits at origination and monitor compliance at portfolio level on an ongoing basis' },
          { id:'OBL-010', name:'Classify eligible housing loans under Priority Sector Lending and report under PSL returns within stipulated timelines' },
          { id:'OBL-011', name:'Ensure all floating-rate housing loans are linked to Repo Rate or other approved external benchmark with quarterly reset' },
          { id:'OBL-012', name:'Cap repayment tenor at 30 years and ensure EMI does not exceed 50% of borrower net monthly income at sanction' },
          { id:'OBL-013', name:'Issue Key Fact Statement to every housing loan applicant prior to sanction disclosing all-in cost and charges' },
          { id:'OBL-014', name:'Submit NHB refinance utilisation certificates quarterly and annual compliance reports within 30 days of period end' },
          { id:'OBL-015', name:'Remove foreclosure charges and prepayment penalties for all floating-rate individual housing loan accounts' },
          { id:'OBL-016', name:'File half-yearly housing loan portfolio return with RBI within 21 days of close of each half-year period' },
        ];
        window._mlAllObligOptions = mockObligs;
        return mockObligs.map(function(ob) {
          return '<div class="ml-obl-drop-item" data-id="' + ob.id + '" data-name="' + ob.name.replace(/"/g,'&quot;') + '" ' +
            'onclick="_mlSelectObligation(this)" ' +
            'style="padding:9px 12px;cursor:pointer;border-bottom:1px solid #f3f4f6;transition:background .1s;">' +
            '<div style="font-family:monospace;font-size:9px;font-weight:700;color:#7c3aed;margin-bottom:2px;">' + ob.id + '</div>' +
            '<div style="font-size:11px;color:#374151;line-height:1.4;">' + ob.name.substring(0,80) + (ob.name.length>80?'…':'') + '</div>' +
          '</div>';
        }).join('');
      })() +
    '</div>' +
  '</div>' +
  '<input type="hidden" id="ml-new-action-obl-id" value="' + (obligationId||'') + '"/>' +
  /* show pre-selected if opened from a parent action */
  (obligationId
    ? '<div id="ml-obl-selected-pill" style="margin-top:6px;display:inline-flex;align-items:center;gap:6px;background:#f5f3ff;border:1px solid #e9d5ff;border-radius:6px;padding:5px 10px;">' +
        '<span style="font-family:monospace;font-size:10px;font-weight:700;color:#7c3aed;">' + obligationId + '</span>' +
        '<button type="button" onclick="_mlClearOblSelection()" style="background:none;border:none;color:#9ca3af;cursor:pointer;font-size:13px;line-height:1;">×</button>' +
      '</div>'
    : '<div id="ml-obl-selected-pill" style="display:none;margin-top:6px;"></div>'
  ) +
'</div>' +

'<div style="margin-bottom:14px;">' +
  '<label style="display:block;font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;margin-bottom:5px;">Action Description <span style="color:#ef4444;">*</span></label>' +
          '<textarea id="ml-new-action-desc" placeholder="' + placeholderDesc + '" style="width:100%;padding:9px 10px;border:1px solid #e5e7eb;border-radius:6px;font-size:13px;min-height:90px;font-family:inherit;resize:vertical;line-height:1.5;"></textarea>' +
          '<div style="font-size:10px;color:#9ca3af;margin-top:4px;">Aim for 30–40 words describing what needs to be done and why.</div>' +
        '</div>' +

        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px;">' +
          '<div>' +
            '<label style="display:block;font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;margin-bottom:5px;">Department</label>' +
            '<select id="ml-new-action-dept" style="width:100%;padding:9px 10px;border:1px solid #e5e7eb;border-radius:6px;font-size:13px;background:white;">' +
              '<option value="">Select Department</option>' +
              allDepts.map(function(d){ return '<option value="'+d+'">'+d+'</option>'; }).join('') +
            '</select>' +
          '</div>' +
          '<div>' +
            '<label style="display:block;font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;margin-bottom:5px;">Assigned To</label>' +
            '<input type="text" id="ml-new-action-assignee" placeholder="Enter name…" list="ml-new-assignee-list" style="width:100%;padding:9px 10px;border:1px solid #e5e7eb;border-radius:6px;font-size:13px;"/>' +
            '<datalist id="ml-new-assignee-list">' + allAssignees.map(function(a){ return '<option value="'+a+'">'; }).join('') + '</datalist>' +
          '</div>' +
        '</div>' +

        '<div>' +
          '<label style="display:block;font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;margin-bottom:5px;">Status</label>' +
          '<div style="display:flex;gap:8px;">' +
            ['Assigned','Unassigned','Not Applicable'].map(function(s){
              var isDefault = s === 'Assigned';
              return '<button type="button" class="ml-status-pill-btn" data-status="'+s+'" onclick="_mlSelectNewStatus(this)" style="padding:7px 14px;border:2px solid '+(isDefault?'#3b82f6':'#e5e7eb')+';background:'+(isDefault?'#eff6ff':'#fff')+';border-radius:20px;font-size:12px;font-weight:'+(isDefault?'700':'500')+';color:'+(isDefault?'#1d4ed8':'#374151')+';cursor:pointer;transition:all 0.15s;">'+s+'</button>';
            }).join('') +
          '</div>' +
          '<input type="hidden" id="ml-new-action-status" value="Assigned"/>' +
        '</div>' +

      '</div>' +
      '<div class="dr-modal-foot">' +
        '<button class="dr-btn dr-btn-ghost" onclick="document.getElementById(\'ml-add-action-modal\').remove()">Cancel</button>' +
        '<button class="dr-btn dr-btn-pri" onclick="_mlSaveNewAction(\'' + nextId + '\', \'' + obligationId + '\')">Save Action</button>' +
      '</div>' +
    '</div>';
  document.body.appendChild(overlay);
  setTimeout(function() {
  document.querySelectorAll('.ml-mapped-row-cb').forEach(function(cb) {
    cb.addEventListener('change', _mlUpdateMappedSelCount);
  });
}, 0);
}

window._mlFilterOblSearch = function() {
  var q = (document.getElementById('ml-new-action-obl-search').value || '').toLowerCase();
  var drop = document.getElementById('ml-new-action-obl-drop');
  if (!drop) return;
  drop.style.display = 'block';
  drop.querySelectorAll('.ml-obl-drop-item').forEach(function(item) {
    var match = (item.dataset.id + ' ' + item.dataset.name).toLowerCase().includes(q);
    item.style.display = match ? 'block' : 'none';
  });
};

window._mlShowOblDropdown = function() {
  var drop = document.getElementById('ml-new-action-obl-drop');
  if (drop) drop.style.display = 'block';
  /* close on outside click */
  setTimeout(function() {
    document.addEventListener('click', function _oblOutside(e) {
      var wrap = document.getElementById('ml-new-action-obl-search');
      var drop = document.getElementById('ml-new-action-obl-drop');
      if (drop && wrap && !wrap.contains(e.target) && !drop.contains(e.target)) {
        drop.style.display = 'none';
        document.removeEventListener('click', _oblOutside);
      }
    });
  }, 0);
};

window._mlSelectObligation = function(el) {
  var id   = el.dataset.id;
  var name = el.dataset.name;
  document.getElementById('ml-new-action-obl-id').value = id;
  document.getElementById('ml-new-action-obl-search').value = id + ' — ' + name.substring(0, 50) + (name.length > 50 ? '…' : '');
  document.getElementById('ml-new-action-obl-drop').style.display = 'none';
  var pill = document.getElementById('ml-obl-selected-pill');
  if (pill) {
    pill.style.display = 'inline-flex';
    pill.innerHTML =
      '<span style="font-family:monospace;font-size:10px;font-weight:700;color:#7c3aed;">' + id + '</span>' +
      '<span style="font-size:11px;color:#374151;margin-left:6px;">' + name.substring(0,50) + (name.length>50?'…':'') + '</span>' +
      '<button type="button" onclick="_mlClearOblSelection()" style="background:none;border:none;color:#9ca3af;cursor:pointer;font-size:13px;line-height:1;margin-left:4px;">×</button>';
  }
};

window._mlClearOblSelection = function() {
  document.getElementById('ml-new-action-obl-id').value = '';
  document.getElementById('ml-new-action-obl-search').value = '';
  var pill = document.getElementById('ml-obl-selected-pill');
  if (pill) { pill.style.display = 'none'; pill.innerHTML = ''; }
};

window._mlSelectNewStatus = function(btn) {
  document.querySelectorAll('.ml-status-pill-btn').forEach(function(b){
    b.style.border = '2px solid #e5e7eb';
    b.style.background = '#fff';
    b.style.fontWeight = '500';
    b.style.color = '#374151';
  });
  btn.style.border = '2px solid #3b82f6';
  btn.style.background = '#eff6ff';
  btn.style.fontWeight = '700';
  btn.style.color = '#1d4ed8';
  document.getElementById('ml-new-action-status').value = btn.dataset.status;
}

window._mlSaveNewAction = function(actionId, obligationId) {
  var desc = document.getElementById('ml-new-action-desc').value;
  var dept = document.getElementById('ml-new-action-dept').value;
  var assignee = document.getElementById('ml-new-action-assignee').value;
  var status = document.getElementById('ml-new-action-status').value;
  
  if (!desc.trim()) {
    showToast('Action description is required.', 'error');
    return;
  }
  
  var dueDate = document.getElementById('ml-new-action-duedate').value;
  var selectedOblId = document.getElementById('ml-new-action-obl-id')
  ? document.getElementById('ml-new-action-obl-id').value || obligationId
  : obligationId;
  
var assigneeVal = {};
if (dept && assignee) {
  assigneeVal[dept] = assignee;
} else if (assignee) {
  assigneeVal['General'] = assignee;
}

var newTask = {
    id: actionId,
    title: desc,
    obligationId: selectedOblId,
    department: dept || 'Unassigned',
    assignee: assigneeVal,
    priority: 'Medium',
    status: status,
    risk: 'Medium',
    tags: [],
    circularId: (CMS_DATA.circulars[0] && CMS_DATA.circulars[0].id) || '',
    dueDate: dueDate
  };
  
  CMS_DATA.library_tasks.push(newTask);
  document.getElementById('ml-add-action-modal').remove();
  _mlRenderTable(CMS_DATA.circulars);
  showToast('Action ' + actionId + ' added successfully.', 'success');
}

// ── DEMO SEED: give first task two depts + two assignees for visual demo ──
if (CMS_DATA && CMS_DATA.library_tasks && CMS_DATA.library_tasks.length > 0 && !CMS_DATA._demoSeeded) {
  CMS_DATA._demoSeeded = true;
  CMS_DATA.library_tasks[0].department = 'Compliance, Risk, Digital';
CMS_DATA.library_tasks[0].assignee = 'Ananya Sharma';
  if (CMS_DATA.library_tasks[1]) {
    CMS_DATA.library_tasks[1].department = 'Legal, IT';
    CMS_DATA.library_tasks[1].assignee = { 'Legal': 'Priya Nair', 'IT': 'Vikram Das' };
  }
}

// ── DEMO SEED: amendment history ──
if (CMS_DATA && CMS_DATA.library_tasks && CMS_DATA.library_tasks.length > 0) {
  CMS_DATA.library_tasks[0].changeType = 'Amended';
  CMS_DATA.library_tasks[0].version = 'v3';
  CMS_DATA.library_tasks[0].lastCircId = 'SEBI/2024/11';
  CMS_DATA.library_tasks[0].refSection = '4(c)';
  CMS_DATA.library_tasks[0].history = [
  {
    version: 'v1', circId: 'SEBI/2022/01', section: '4(b)',
    changeType: 'Original', date: '2022-04-01',
    summary: 'Initial obligation created.',
    changes: []
  },
  {
    version: 'v2', circId: 'SEBI/2023/05', section: '4(b)',
    changeType: 'Amended', date: '2023-07-15',
    summary: 'Timeline extended from 30 to 45 days.',
    changes: [
      { field: 'Due Date', from: '30 days', to: '45 days' }
    ]
  },
  {
    version: 'v3', circId: 'SEBI/2023/11', section: '4(b)',
    changeType: 'No Change', date: '2023-11-01',
    summary: 'Circular issued but this OBL was not affected.',
    changes: []
  },
  {
    version: 'v4', circId: 'SEBI/2024/11', section: '4(c)',
    changeType: 'Amended', date: '2024-02-01',
    summary: 'Timeline updated again, section renumbered.',
    changes: [
      { field: 'Due Date', from: '45 days', to: '60 days' },
      { field: 'Section', from: '4(b)', to: '4(c)' }
    ]
  }
];

  if (CMS_DATA.library_tasks[1]) {
    CMS_DATA.library_tasks[1].changeType = 'Superseded';
    CMS_DATA.library_tasks[1].version = 'v2';
    CMS_DATA.library_tasks[1].lastCircId = 'RBI/2023/22';
    CMS_DATA.library_tasks[1].history = [
      { version:'v1', circId:'RBI/2021/07', section:'3.1', changeType:'Original',   summary:'Original KYC threshold set at ₹50,000.', date:'2021-10-01' },
      { version:'v2', circId:'RBI/2023/22', section:'3.1', changeType:'Superseded', summary:'KYC threshold superseded — now governed by PMLA guidelines directly.', date:'2023-03-15' }
    ];
  }
}

window._mlGetUniqueAssignees = function() {
  var assignees = [];
  CMS_DATA.library_tasks.forEach(function(t) {
    var a = t.assignee;
    if (!a) return;
    if (typeof a === 'string' && a.trim()) {
      assignees.push(a.trim());
    } else if (typeof a === 'object') {
      Object.values(a).forEach(function(name) {
        if (name && name.trim()) assignees.push(name.trim());
      });
    }
  });
  var demo = ['Ananya Sharma', 'Rohan Mehta', 'Priya Nair', 'Vikram Das', 'Sneha Iyer'];
demo.forEach(function(n){ assignees.push(n); });
  return [...new Set(assignees)].sort();
};

window._mlDetailField = function(label, value, fullWidth) {
  return '<div style="' +
    'background:#f9fafb;border:1px solid #e5e7eb;border-radius:6px;padding:10px 12px;' +
    (fullWidth ? 'grid-column:span 2;' : '') +
  '">' +
    '<div style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px;">' + label + '</div>' +
    '<div style="font-size:12px;font-weight:600;color:#1f2937;word-break:break-word;">' + value + '</div>' +
  '</div>';
};

window._mlOpenEditablePopup = function(item, idx) {
  var existing = document.getElementById('ml-detail-modal');
  if (existing) existing.remove();
  var circular = CMS_DATA.circulars.find(function(c){ return c.id === item.circId; }) || {};
  var obligation = (CMS_DATA.obligations || []).find(function(o){ return o.id === item.obligationId; }) || {};
  var task = CMS_DATA.library_tasks.find(function(t){ return t.id === item.actionId; }) || {};
  var allDepts = ['Compliance','Risk','Legal','IT','Operations','HR','Finance','Credit','Procurement'];
  var allAssignees = _mlGetUniqueAssignees();
  var statusOptions = ['Not Applicable','Unassigned','Assigned'];
  var freqOptions = ['Monthly','Quarterly','Annually','Ad-hoc','As per Regulation'];
  var overlay = document.createElement('div');
  overlay.className = 'dr-modal-overlay'; overlay.id = 'ml-detail-modal';
  var curFreq = task.frequency || item.frequency || 'Monthly';
  overlay.innerHTML =
    '<div class="dr-modal" style="max-width:700px;">' +
      '<div class="dr-modal-head">' +
        '<div class="dr-modal-head-left">' +
          '<div class="dr-modal-eyebrow">Edit Action</div>' +
          '<div class="dr-modal-subject">' + item.actionId + ' — ' + (item.action||'').substring(0,50) + '</div>' +
        '</div>' +
        '<button class="dr-modal-close" onclick="document.getElementById(\'ml-detail-modal\').remove()">&#x2715;</button>' +
      '</div>' +
      '<div class="dr-modal-body" style="padding:0;max-height:70vh;overflow-y:auto;">' +

        '<div style="padding:16px 20px;border-bottom:1px solid #e5e7eb;">' +
          '<div style="margin-bottom:12px;">' +
            '<label style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;display:block;margin-bottom:5px;">Details of Action Item</label>' +
            '<textarea id="ml-edit-action" style="width:100%;padding:9px 10px;border:1px solid #d1d5db;border-radius:6px;font-size:13px;min-height:70px;font-family:inherit;resize:vertical;">' + (item.action||'').replace(/</g,'&lt;') + '</textarea>' +
          '</div>' +
          '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">' +
            '<div><label style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;display:block;margin-bottom:5px;">Internal Due Date</label><input type="date" id="ml-edit-issuedate" value="' + (circular.issuedDate || circular.issueDate || '') + '" style="width:100%;padding:9px 10px;border:1px solid #d1d5db;border-radius:6px;font-size:13px;"/></div>' +
            '<div><label style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;display:block;margin-bottom:5px;">External Due Date</label><input type="date" id="ml-edit-duedate" value="' + (item.dueDate||'') + '" style="width:100%;padding:9px 10px;border:1px solid #d1d5db;border-radius:6px;font-size:13px;"/></div>' +
            '<div><label style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;display:block;margin-bottom:5px;">Frequency</label><select id="ml-edit-freq" style="width:100%;padding:9px 10px;border:1px solid #d1d5db;border-radius:6px;font-size:13px;background:white;">' + freqOptions.map(function(f){ return '<option value="'+f+'"'+(curFreq===f?' selected':'')+'>'+f+'</option>'; }).join('') + '</select></div>' +
            '<div><label style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;display:block;margin-bottom:5px;">Assignment Status</label><select id="ml-edit-status" style="width:100%;padding:9px 10px;border:1px solid #d1d5db;border-radius:6px;font-size:13px;background:white;">' + statusOptions.map(function(s){ return '<option value="'+s+'"'+(item.status===s?' selected':'')+'>'+s+'</option>'; }).join('') + '</select></div>' +
            '<div><label style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;display:block;margin-bottom:5px;">Department</label><select id="ml-edit-dept" style="width:100%;padding:9px 10px;border:1px solid #d1d5db;border-radius:6px;font-size:13px;background:white;">' + allDepts.map(function(d){ return '<option value="'+d+'"'+(item.department===d?' selected':'')+'>'+d+'</option>'; }).join('') + '</select></div>' +
            '<div><label style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;display:block;margin-bottom:5px;">Assigned To</label><input type="text" id="ml-edit-assignee" value="' + (item.assignedTo||'') + '" list="ml-edit-assignee-list" style="width:100%;padding:9px 10px;border:1px solid #d1d5db;border-radius:6px;font-size:13px;"/><datalist id="ml-edit-assignee-list">' + allAssignees.map(function(a){ return '<option value="'+a+'">'; }).join('') + '</datalist></div>' +
          '</div>' +
        '</div>' +

        '<div style="padding:16px 20px;border-bottom:1px solid #e5e7eb;">' +
          '<div style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;margin-bottom:10px;">Evidence Required</div>' +
          '<div id="ml-edit-evidence-list" style="margin-bottom:10px;">' +
            (item.evidence && item.evidence.length ? item.evidence.map(function(e){ return '<div style="display:flex;align-items:center;gap:8px;padding:6px 10px;background:#f9fafb;border:1px solid #e5e7eb;border-radius:6px;margin-bottom:6px;font-size:12px;color:#374151;">' + e + '<button type="button" onclick="_mlRemoveEvidenceItem(this)" style="margin-left:auto;background:none;border:none;color:#9ca3af;cursor:pointer;font-size:14px;line-height:1;">×</button></div>'; }).join('') : '') +
          '</div>' +
          '<div style="display:flex;gap:8px;">' +
            '<input type="text" id="ml-edit-evidence-input" placeholder="Describe evidence required…" style="flex:1;padding:8px 10px;border:1px solid #e5e7eb;border-radius:6px;font-size:12px;"/>' +
            '<button type="button" onclick="_mlAddEvidenceItem()" style="padding:8px 14px;background:#3b82f6;color:white;border:none;border-radius:6px;font-size:12px;font-weight:600;cursor:pointer;">+ Add</button>' +
          '</div>' +
        '</div>' +

        '<div style="padding:16px 20px;border-bottom:1px solid #e5e7eb;">' +
          '<div style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;margin-bottom:12px;">Obligation Details</div>' +
          '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">' +
            '<div><label style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;display:block;margin-bottom:5px;">Obligation ID</label><input type="text" id="ml-edit-oblid" value="' + (item.obligationId||'') + '" style="width:100%;padding:9px 10px;border:1px solid #d1d5db;border-radius:6px;font-size:13px;background:#f9fafb;" readonly/></div>' +
            '<div><label style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;display:block;margin-bottom:5px;">Obligation Name</label><input type="text" id="ml-edit-oblname" value="' + (obligation.name || obligation.title || 'Ensure timely submission of regulatory returns and maintain accurate records as per applicable guidelines.').replace(/"/g,'&quot;') + '" style="width:100%;padding:9px 10px;border:1px solid #d1d5db;border-radius:6px;font-size:13px;"/></div>' +
            '<div><label style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;display:block;margin-bottom:5px;">Effective Date</label><input type="date" id="ml-edit-effdate" value="' + (circular.effectiveDate || '') + '" style="width:100%;padding:9px 10px;border:1px solid #d1d5db;border-radius:6px;font-size:13px;"/></div>' +
            
            '<div><label style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;display:block;margin-bottom:5px;">Tags</label><input type="text" id="ml-edit-tags" value="' + (item.tags && item.tags.length ? item.tags.join(', ') : 'Compliance, Reporting') + '" placeholder="Compliance, Reporting…" style="width:100%;padding:9px 10px;border:1px solid #d1d5db;border-radius:6px;font-size:13px;"/></div>' +
            '<div><label style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;display:block;margin-bottom:5px;"> Due Date</label><input type="date" id="ml-edit-duedate" value="' + (item.dueDate||'') + '" style="width:100%;padding:9px 10px;border:1px solid #d1d5db;border-radius:6px;font-size:13px;"/></div>' +
                       '<div><label style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;display:block;margin-bottom:5px;">Frequency</label><select id="ml-edit-freq" style="width:100%;padding:9px 10px;border:1px solid #d1d5db;border-radius:6px;font-size:13px;background:white;">' + freqOptions.map(function(f){ return '<option value="'+f+'"'+(curFreq===f?' selected':'')+'>'+f+'</option>'; }).join('') + '</select></div>' +
            '<div style="grid-column:span 2;">' +
              '<label style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;display:block;margin-bottom:5px;">Upload Obligation Page</label>' +
              '<div style="display:flex;align-items:center;gap:10px;">' +
                '<label style="display:inline-flex;align-items:center;gap:6px;padding:8px 14px;background:#f9fafb;border:1px solid #d1d5db;border-radius:6px;cursor:pointer;font-size:12px;color:#374151;font-weight:500;">&#x1F4CE; Choose File<input type="file" id="ml-edit-obl-file" accept=".pdf,.doc,.docx,.png,.jpg" style="display:none;" onchange="document.getElementById(\'ml-edit-obl-filename\').textContent=this.files[0]?this.files[0].name:\'No file chosen\'"/></label>' +
                '<span id="ml-edit-obl-filename" style="font-size:12px;color:#6b7280;font-style:italic;">No file chosen</span>' +
              '</div>' +
            '</div>' +
            '</div>' +
        '</div>' +

        '<div style="padding:16px 20px;">' +
          '<div style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;margin-bottom:12px;">Regulatory Details</div>' +
          '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">' +
            '<div><label style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;display:block;margin-bottom:5px;">Act Name</label><input type="text" id="ml-edit-actname" value="' + (circular.actName || 'Banking Regulation Act, 1949').replace(/"/g,'&quot;') + '" style="width:100%;padding:9px 10px;border:1px solid #d1d5db;border-radius:6px;font-size:13px;"/></div>' +
            '<div><label style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;display:block;margin-bottom:5px;">Legislative Area</label><input type="text" id="ml-edit-legarea" value="' + (circular.legislativeArea || 'Financial Services').replace(/"/g,'&quot;') + '" style="width:100%;padding:9px 10px;border:1px solid #d1d5db;border-radius:6px;font-size:13px;"/></div>' +
            '<div><label style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;display:block;margin-bottom:5px;">Sub-Section</label><input type="text" id="ml-edit-subsec" value="' + (circular.subSection || 'Section 35A').replace(/"/g,'&quot;') + '" style="width:100%;padding:9px 10px;border:1px solid #d1d5db;border-radius:6px;font-size:13px;"/></div>' +
            '<div><label style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;display:block;margin-bottom:5px;">Regulatory Body</label><input type="text" id="ml-edit-regbody" value="' + (circular.regulator || 'Reserve Bank of India').replace(/"/g,'&quot;') + '" style="width:100%;padding:9px 10px;border:1px solid #d1d5db;border-radius:6px;font-size:13px;"/></div>' +
          '</div>' +
        '</div>' +

      '</div>' +
      '<div class="dr-modal-foot">' +
        '<button class="dr-btn dr-btn-ghost" onclick="document.getElementById(\'ml-detail-modal\').remove()">Cancel</button>' +
        '<button class="dr-btn dr-btn-pri" onclick="_mlSaveInlineEdit(' + idx + ')">Save Changes</button>' +
      '</div>' +
    '</div>';
  document.body.appendChild(overlay);
  overlay.addEventListener('click', function(e){ if(e.target===overlay) overlay.remove(); });
}

window._mlRemoveEvidenceItem = function(btn) {
  btn.parentNode.remove();
};

window._mlAddEvidenceItem = function() {
  var inp = document.getElementById('ml-edit-evidence-input');
  if (!inp || !inp.value.trim()) return;
  var list = document.getElementById('ml-edit-evidence-list');
  if (!list) return;
  var d = document.createElement('div');
  d.style.cssText = 'display:flex;align-items:center;gap:8px;padding:6px 10px;background:#f9fafb;border:1px solid #e5e7eb;border-radius:6px;margin-bottom:6px;font-size:12px;color:#374151;';
  var text = document.createTextNode(inp.value.trim());
  var btn = document.createElement('button');
  btn.type = 'button';
  btn.textContent = '×';
  btn.style.cssText = 'margin-left:auto;background:none;border:none;color:#9ca3af;cursor:pointer;font-size:14px;line-height:1;';
  btn.onclick = function() { d.remove(); };
  d.appendChild(text);
  d.appendChild(btn);
  list.appendChild(d);
  inp.value = '';
};

window._mlSaveInlineEdit = function(idx) {
  var item = window._mlActionItems[idx];
  item.action     = document.getElementById('ml-edit-action').value;
  item.dueDate    = document.getElementById('ml-edit-duedate').value;
  item.department = document.getElementById('ml-edit-dept').value;
  item.assignedTo = document.getElementById('ml-edit-assignee').value;
  item.status     = document.getElementById('ml-edit-status').value;
  var tagsRaw     = document.getElementById('ml-edit-tags').value;
  item.tags       = tagsRaw.split(',').map(function(t){ return t.trim(); }).filter(Boolean);
  var task = CMS_DATA.library_tasks.find(function(t){ return t.id === item.actionId; });
  if (task) {
    task.title      = item.action;
    task.dueDate    = item.dueDate;
    task.department = item.department;
    task.assignee   = item.assignedTo;
    task.status     = item.status;
    task.tags       = item.tags;
    task.frequency  = document.getElementById('ml-edit-freq') ? document.getElementById('ml-edit-freq').value : task.frequency;
  }
  var circular = CMS_DATA.circulars.find(function(c){ return c.id === item.circId; });
  if (circular) {
    if (document.getElementById('ml-edit-actname'))  circular.actName        = document.getElementById('ml-edit-actname').value;
    if (document.getElementById('ml-edit-legarea'))  circular.legislativeArea = document.getElementById('ml-edit-legarea').value;
    if (document.getElementById('ml-edit-subsec'))   circular.subSection     = document.getElementById('ml-edit-subsec').value;
    if (document.getElementById('ml-edit-regbody'))  circular.regulator      = document.getElementById('ml-edit-regbody').value;
  }
  document.getElementById('ml-detail-modal').remove();
  _mlRenderTable(CMS_DATA.circulars);
  showToast('Action updated successfully.', 'success');
}

window._mlSaveDepartment = function(idx) {
  var checked = document.querySelectorAll('#ml-dept-selector-modal input[type="checkbox"]:checked');
  var depts = Array.from(checked).map(function(cb){ return cb.value; });

  document.getElementById('ml-dept-selector-modal').remove();

  if (!depts.length) {
    showToast('Please select at least one department.', 'error');
    return;
  }

  // Capture the actionId BEFORE re-render (which rebuilds _mlActionItems)
  var actionId = window._mlActionItems[idx].actionId;

  window._mlActionItems[idx].department = depts.join(', ');
  // Reset assignee map so stale per-dept assignments are cleared
  window._mlActionItems[idx].assignedTo = {};

  var task = CMS_DATA.library_tasks.find(function(t){ return t.id === actionId; });
  if (task) {
    task.department = depts.join(', ');
    task.assignee = {};
  }

  _mlRenderTable(_mlGetFilteredCircs ? _mlGetFilteredCircs() : CMS_DATA.circulars);
  if (window._mlActiveView === 'chapter') _mlRenderChapterView(_mlGetFilteredCircs());

  showToast('Department updated. Now assign people.', 'success');

  // Find new idx after re-render by matching actionId
  var newIdx = (window._mlActionItems || []).findIndex(function(a){ return a.actionId === actionId; });
  if (newIdx > -1) _mlOpenAssigneeSelector(newIdx);
};

window._mlUpdateStatusBadges = function() {
  var filtered   = _mlGetFilteredCircs();
  var total      = filtered.length;
  var assigned   = filtered.filter(function(c) { return (c.libraryStatus||'Reviewed & Applicable') === 'Assigned'; }).length;
  var spTotal = document.getElementById('ml-sp-total');
  var spUn    = document.getElementById('ml-sp-unassigned');
  var spAss   = document.getElementById('ml-sp-assigned');
  if (spTotal) spTotal.textContent = total + ' total';
  if (spUn)    spUn.textContent    = (total - assigned) + ' unassigned';
  if (spAss)   spAss.textContent   = assigned + ' assigned';
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
