window._drPanelApplicability = function (flow) {
  var a = flow.applicability;
  if (!a) return _drNotSaved('Applicability');
  var vc = a.applicable ? '#15803d' : '#b91c1c';
  var vb = a.applicable ? '#dcfce7' : '#fee2e2';

  var entityRows = (a.entities||[]).map(function(e, ei) {
  var name       = typeof e === 'string' ? e : e.name;
  var applicable = typeof e === 'string' ? false : !!e.applicable;  // ← key fix
  return '<tr id="dr-ent-row-' + ei + '">' +
    '<td><span class="dr-ent-name" id="dr-ent-name-' + ei + '" contenteditable="false" style="outline:none;display:inline-block;min-width:80px;font-weight:600;color:#1a1a2e;">' + name + '</span></td>' +
    '<td><span class="dr-app-pill ' + (applicable ? 'dr-app-yes' : 'dr-app-no') + '" id="dr-ent-app-' + ei + '">' + (applicable ? '&#x2713; Yes' : '&#x2717; No') + '</span></td>' +
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

