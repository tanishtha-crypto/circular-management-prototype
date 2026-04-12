window._drPanelSummary = function (flow) {
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