/**
 * data.js — CMS Circular Management System
 * All dummy JSON data for the application.
 * Acts as the in-memory data store.
 */

/* =============================================================
   CIRCULARS
   ============================================================= */
const CMS_DATA = {

  circulars: [
    {
      id: 'CIRC-2024-001',
      title: 'Cybersecurity Risk Management Framework',
      regulator: 'RBI',
      issuedDate: '2024-01-15',
      effectiveDate: '2024-03-01',
      dueDate: '2024-06-30',
      type: 'Master',
      status: 'Active',
      departments: ['IT', 'Risk', 'Operations'],
      risk: 'High',
      complianceScore: 72,
      summary: 'The Master Circular on Housing Finance by the Reserve Bank of India consolidates regulatory guidelines governing housing loans provided by banks, covering aspects such as eligible purposes (purchase, construction, repair), prudential limits like loan-to-value ratios, risk weights for capital adequacy, and classification under priority sector lending.',
      chapters: [
        {
          num: 1, title: 'Governance and Accountability',
          clauses: [
            {
              id: 'C1.1', text: 'The Board of Directors shall establish a dedicated Cybersecurity Committee.',
              obligation: 'Establish a Board-level Cybersecurity Committee with defined mandate and meeting cadence.',
              actionables: 'Draft and circulate Board resolution to form Cybersecurity Committee; appoint CISO.',
              department: 'IT', risk: 'High', status: 'In Progress'
            },
            {
              id: 'C1.2', text: 'A Chief Information Security Officer (CISO) shall be appointed at Senior Management level.',
              obligation: 'Appoint a qualified CISO with minimum 8 years experience in information security.',
              actionables: 'Initiate CISO recruitment / designation process within 30 days.',
              department: 'HR', risk: 'High', status: 'Complete'
            }
          ],
          sections: [
            {
              id: 'Section 1',
              text: 'Board-Level Cybersecurity Governance',
              clauses: ['C1.1', 'C1.2']   // clause ids that belong here
            },
            {
              id: 'Section 2',
              text: 'Incident Response & Reporting',
              clauses: ['C2.1', 'C2.2']
            }
          ],
        
        },
        {
          num: 2, title: 'Risk Assessment and Management',
          clauses: [
          {
            id: 'C2.1', text: 'Annual cybersecurity risk assessment shall be conducted by an independent party.',
            obligations: 'Conduct risk assessment covering all IT assets, vendor systems, and data flows.',
            actionables: 'Engage certified third-party auditor; scope assessment; schedule assessment Q1 each year.',
            department: 'Risk', risk: 'High', status: 'Open'
          },
          {
            id: 'C2.2', text: 'Risk register shall be maintained and reviewed quarterly.',
            obligations: 'Maintain a live risk register updated at minimum quarterly.',
            actionables: 'Create risk register template; assign risk owners; schedule quarterly reviews.',
            department: 'Risk', risk: 'Medium', status: 'In Progress'
          }
          ],
             sections: [
            {
              id: 'Section 1',
              text: 'Board-Level Cybersecurity Governance',
              clauses: ['Section 1', 'C1.2']   // clause ids that belong here
            },
            {
              id: 'Section 2',
              text: 'Incident Response & Reporting',
              clauses: ['C2.1', 'C2.2']
            }
          ]
          ,

        },
        {
          num: 3, title: 'Incident Response',
          clauses: [
            {
              id: 'C3.1', text: 'All cyber incidents must be reported to RBI within 6 hours of detection.',
              obligations: 'Establish incident detection and reporting mechanism with 6-hour SLA.',
              actionables: 'Implement SIEM; define escalation matrix; train SOC team on reporting procedure.',
              department: 'IT', risk: 'High', status: 'Open'
            }
          ]
        }
      ],
      amendments: [
        { date: '2024-02-10', version: '1.1', description: 'Clarification on CISO qualification criteria.' },
        { date: '2024-04-05', version: '1.2', description: 'Extended deadline for risk assessment to Q2.' }
      ]
    },
    {
      id: 'CIRC-2024-002',
      title: 'KYC / AML Compliance Amendments 2024',
      regulator: 'SEBI',
      issuedDate: '2024-02-20',
      effectiveDate: '2024-04-01',
      dueDate: '2024-08-31',
      type: 'Regular',
      status: 'Active',
      departments: ['Compliance', 'Finance', 'Legal'],
      risk: 'High',
      complianceScore: 55,
      summary: 'Amendments to existing KYC/AML norms requiring enhanced due diligence for high-value transactions, updated PEP screening requirements, and mandatory transaction monitoring systems.',
      chapters: [
        {
          num: 1, title: 'Enhanced Due Diligence',
          clauses: [
            {
              id: 'C1.1', text: 'EDD mandatory for transactions exceeding INR 10 lakhs.',
              obligations: 'Apply Enhanced Due Diligence for all transactions above INR 10 lakhs.',
              actionables: 'Update transaction monitoring thresholds; train compliance officers on EDD procedures.',
              department: 'Compliance', risk: 'High', status: 'In Progress'
            }
          ]
        },
        {
          num: 2, title: 'PEP Screening',
          clauses: [
            {
              id: 'C2.1', text: 'All customers shall be screened against updated PEP lists on a daily basis.',
              obligations: 'Implement daily automated PEP screening for entire customer base.',
              actionables: 'Integrate PEP screening API; configure daily batch jobs; set up alert workflows.',
              department: 'IT', risk: 'High', status: 'Open'
            }
          ]
        }
      ],
      amendments: [
        { date: '2024-03-15', version: '1.1', description: 'PEP screening frequency changed from weekly to daily.' }
      ]
    },
    {
      id: 'CIRC-2024-003',
      title: 'Data Localisation and Cloud Policy',
      regulator: 'MeitY',
      issuedDate: '2024-03-10',
      effectiveDate: '2024-06-01',
      dueDate: '2024-12-31',
      type: 'Master',
      status: 'Active',
      departments: ['IT', 'Legal', 'Operations'],
      risk: 'Medium',
      complianceScore: 85,
      summary: 'Policy mandating data localisation for sensitive personal data, requirements for cloud service providers, data residency controls, and cross-border data transfer restrictions.',
      chapters: [
        {
          num: 1, title: 'Data Residency Requirements',
          clauses: [
            {
              id: 'C1.1', text: 'Sensitive personal data of Indian citizens must be stored in India.',
              obligations: 'Ensure all sensitive personal data is stored on servers located within Indian territory.',
              actionables: 'Audit existing cloud storage; migrate non-compliant data; update vendor contracts.',
              department: 'IT', risk: 'High', status: 'Complete'
            }
          ]
        }
      ],
      amendments: []
    },
    {
      id: 'CIRC-2024-004',
      title: 'ESG Disclosure and Reporting Framework',
      regulator: 'SEBI',
      issuedDate: '2024-04-05',
      effectiveDate: '2024-07-01',
      dueDate: '2025-03-31',
      type: 'Regular',
      status: 'Active',
      departments: ['Finance', 'Legal', 'Operations'],
      risk: 'Medium',
      complianceScore: 40,
      summary: 'Framework for mandatory ESG disclosures in annual reports, covering environmental metrics, social impact indicators, and governance structure disclosures for listed entities.',
      chapters: [
        {
          num: 1, title: 'Environmental Disclosures',
          clauses: [
            {
              id: 'C1.1', text: 'Carbon emissions (Scope 1, 2, and 3) must be disclosed annually.',
              obligations: 'Measure and disclose Scope 1, 2, and 3 carbon emissions in annual report.',
              actionables: 'Engage sustainability consultant; implement GHG accounting; train ESG team.',
              department: 'Operations', risk: 'Medium', status: 'Open'
            }
          ]
        }
      ],
      amendments: []
    },
    {
      id: 'CIRC-2023-015',
      title: 'Operational Risk Management – Updated Guidelines',
      regulator: 'RBI',
      issuedDate: '2023-09-01',
      effectiveDate: '2023-10-01',
      dueDate: '2024-03-31',
      type: 'Master',
      status: 'Closed',
      departments: ['Risk', 'Operations'],
      risk: 'Low',
      complianceScore: 100,
      summary: 'Updated guidelines on operational risk management framework including business continuity planning, third-party risk, and operational resilience requirements.',
      chapters: [
        {
          num: 1, title: 'Business Continuity',
          clauses: [
            {
              id: 'C1.1', text: 'BCP must be tested bi-annually with documented results.',
              obligations: 'Conduct and document BCP tests every 6 months.',
              actionables: 'Schedule BCP drills; prepare test reports; submit to Risk Committee.',
              department: 'Operations', risk: 'Medium', status: 'Complete'
            }
          ]
        }
      ],
      amendments: [
        { date: '2023-11-20', version: '1.1', description: 'BCP testing frequency updated from annual to bi-annual.' }
      ]
    },
    {
      id: 'CIRC-2024-005',
      title: 'Outsourcing and Third-Party Risk Policy',
      regulator: 'RBI',
      issuedDate: '2024-05-01',
      effectiveDate: '2024-08-01',
      dueDate: '2024-11-30',
      type: 'Regular',
      status: 'Active',
      departments: ['Procurement', 'Risk', 'Legal'],
      risk: 'High',
      complianceScore: 30,
      summary: 'Comprehensive framework for managing outsourcing arrangements and third-party risks, including due diligence, contract requirements, and ongoing monitoring of critical service providers.',
      chapters: [
        {
          num: 1, title: 'Vendor Due Diligence',
          clauses: [
            {
              id: 'C1.1', text: 'All critical vendors must be subject to enhanced due diligence prior to onboarding.',
              obligations: 'Conduct EDD including financial, reputational, and compliance checks for critical vendors.',
              actionabless: 'Create vendor classification matrix; develop EDD checklist; assign procurement owners.',
              department: 'Procurement', risk: 'High', status: 'Open'
            }
          ]
        }
      ],
      amendments: []
    }
  ],

  /* =============================================================
     TASKS
     ============================================================= */
  tasks: [
    {
      id: 'ACT-001',
      obligationId:'OB-001',
      title: 'Establish Board Cybersecurity Committee',
      circularId: 'CIRC-2024-001',
      clauseRef: 'C1.1',
      department: 'IT',
      dueDate: '2024-06-15',
      priority: 'High',
      risk: 'High',
      status: 'In Progress',
      assignee: 'Ravi Sharma'
    },
    {
      id: 'ACT-002',
      obligationId:'OB-002',
      title: 'Appoint CISO – Credentials Verification',
      circularId: 'CIRC-2024-001',
      clauseRef: 'C1.2',
      department: 'HR',
      dueDate: '2024-05-30',
      priority: 'High',
      risk: 'High',
      status: 'Complete',
      assignee: 'Priya Nair'
    },
    {
      id: 'ACT-003',
      obligationId:'OB-003',
      title: 'Annual Cybersecurity Risk Assessment – Q2',
      circularId: 'CIRC-2024-001',
      clauseRef: 'C2.1',
      department: 'Risk',
      dueDate: '2024-06-30',
      priority: 'High',
      risk: 'High',
      status: 'Open',
      assignee: 'Anand Krishnan'
    },
    {
      id: 'ACT-004',
       obligationId:'OB-004',
      title: 'Implement SIEM for Cyber Incident Detection',
      circularId: 'CIRC-2024-001',
      clauseRef: 'C3.1',
      department: 'IT',
      dueDate: '2024-05-15',
      priority: 'Critical',
      risk: 'High',
      status: 'Overdue',
      assignee: 'Vikram Singh'
    },
    {
      id: 'ACT-005',
       obligationId:'OB-005',
      title: 'Update Transaction Monitoring Thresholds',
      circularId: 'CIRC-2024-002',
      clauseRef: 'C1.1',
      department: 'Compliance',
      dueDate: '2024-07-15',
      priority: 'High',
      risk: 'High',
      status: 'In Progress',
      assignee: 'Meera Pillai'
    },
    {
      id: 'ACT-006',
       obligationId:'OB-006',
      title: 'PEP Screening API Integration',
      circularId: 'CIRC-2024-002',
      clauseRef: 'C2.1',
      department: 'IT',
      dueDate: '2024-08-01',
      priority: 'High',
      risk: 'High',
      status: 'Open',
      assignee: 'Karthik Reddy'
    },
    {
      id: 'ACT-007',
      obligationId:'OB-007',
      title: 'Cloud Data Migration – Sensitive PII',
      circularId: 'CIRC-2024-003',
      clauseRef: 'C1.1',
      department: 'IT',
      dueDate: '2024-09-30',
      priority: 'Medium',
      risk: 'Medium',
      status: 'Complete',
      assignee: 'Sunita Bhatt'
    },
    {
      id: 'ACT-008',
      obligationId:'OB-008',
      title: 'ESG Scope 1 & 2 Emissions Measurement',
      circularId: 'CIRC-2024-004',
      clauseRef: 'C1.1',
      department: 'Operations',
      dueDate: '2024-10-31',
      priority: 'Medium',
      risk: 'Medium',
      status: 'Open',
      assignee: 'Deepak Mehta'
    },
    {
      id: 'ACT-009',
      obligationId:'OB-009',
      title: 'Vendor Classification Matrix Development',
      circularId: 'CIRC-2024-005',
      clauseRef: 'C1.1',
      department: 'Procurement',
      dueDate: '2024-07-31',
      priority: 'High',
      risk: 'High',
      status: 'Open',
      assignee: 'Pooja Agarwal'
    },
    {
      id: 'ACT-010',
      obligationId:'OB-0010',
      title: 'Quarterly Risk Register Review – Q2',
      circularId: 'CIRC-2024-001',
      clauseRef: 'C2.2',
      department: 'Risk',
      dueDate: '2024-06-30',
      priority: 'Medium',
      risk: 'Medium',
      status: 'In Progress',
      assignee: 'Anand Krishnan'
    },
    {
      id: 'ACT-011',
      obligationId:'OB-011',
      title: 'EDD Training for Compliance Officers',
      circularId: 'CIRC-2024-002',
      clauseRef: 'C1.1',
      department: 'Compliance',
      dueDate: '2024-05-20',
      priority: 'Medium',
      risk: 'Medium',
      status: 'Overdue',
      assignee: 'Meera Pillai'
    },
    {
      id: 'ACT-012',
      obligationId:'OB-0012',
      title: 'Legal Review – Updated Vendor Contracts',
      circularId: 'CIRC-2024-005',
      clauseRef: 'C1.1',
      department: 'Legal',
      dueDate: '2024-09-15',
      priority: 'Low',
      risk: 'Low',
      status: 'Open',
      assignee: 'Suresh Iyer'
    }
  ],

  /* =============================================================
     NOTIFICATIONS
     ============================================================= */
  notifications: [
    {
      id: 'N1',
      title: 'Task Overdue: SIEM Implementation',
      desc: 'ACT-004 is overdue by 15 days. Immediate action required.',
      time: '2 hours ago',
      type: 'danger'
    },
    {
      id: 'N2',
      title: 'New Circular Issued',
      desc: 'SEBI issued CIRC-2024-006: Algo Trading Framework.',
      time: '1 day ago',
      type: 'info'
    },
    {
      id: 'N3',
      title: 'Evidence Uploaded',
      desc: 'Sunita Bhatt uploaded evidence for ACT-007.',
      time: '2 days ago',
      type: 'success'
    }
  ],

  /* =============================================================
     AI SEARCH RESPONSES (mock knowledge base)
     ============================================================= */
  aiSearchResponses: {
    cybersecurity: {
      query_match: ['cyber', 'security', 'ciso', 'siem', 'incident', 'cybersecurity'],
      results: [
        {
          circularId: 'CIRC-2024-001',
          title: 'Cybersecurity Risk Management Framework',
          clauseRef: 'C1.1, C2.1, C3.1',
          explanation: 'This is the primary cybersecurity circular mandating board-level governance, annual risk assessments, and 6-hour incident reporting to RBI.',
          confidence: 97
        },
        {
          circularId: 'CIRC-2024-003',
          title: 'Data Localisation and Cloud Policy',
          clauseRef: 'C1.1',
          explanation: 'Contains data protection and cloud security requirements applicable to IT and cybersecurity teams.',
          confidence: 74
        }
      ]
    },
    finance: {
      query_match: ['finance', 'financial', 'aml', 'kyc', 'transaction', 'pep'],
      results: [
        {
          circularId: 'CIRC-2024-002',
          title: 'KYC / AML Compliance Amendments 2024',
          clauseRef: 'C1.1, C2.1',
          explanation: 'Directly applicable to Finance and Compliance departments. Mandates EDD for transactions above INR 10 lakhs and daily PEP screening.',
          confidence: 95
        }
      ]
    },
    risk: {
      query_match: ['risk', 'overdue', 'high risk', 'critical'],
      results: [
        {
          circularId: 'CIRC-2024-001',
          title: 'Cybersecurity Risk Management Framework',
          clauseRef: 'C2.1, C3.1',
          explanation: 'High-risk clauses related to annual risk assessment and incident reporting have open overdue tasks.',
          confidence: 91
        },
        {
          circularId: 'CIRC-2024-005',
          title: 'Outsourcing and Third-Party Risk Policy',
          clauseRef: 'C1.1',
          explanation: 'Vendor due diligence tasks are currently open with High risk classification.',
          confidence: 86
        }
      ]
    },
    master: {
      query_match: ['master', 'master circular'],
      results: [
        {
          circularId: 'CIRC-2024-001',
          title: 'Cybersecurity Risk Management Framework',
          clauseRef: 'All chapters',
          explanation: 'Master circular covering the complete cybersecurity governance and risk management mandate.',
          confidence: 99
        },
        {
          circularId: 'CIRC-2024-003',
          title: 'Data Localisation and Cloud Policy',
          clauseRef: 'All chapters',
          explanation: 'Master circular for data localisation and cloud hosting requirements.',
          confidence: 99
        },
        {
          circularId: 'CIRC-2023-015',
          title: 'Operational Risk Management – Updated Guidelines',
          clauseRef: 'All chapters',
          explanation: 'Closed master circular on operational risk management. Fully compliant.',
          confidence: 99
        }
      ]
    },
    default: {
      results: [
        {
          circularId: 'CIRC-2024-001',
          title: 'Cybersecurity Risk Management Framework',
          clauseRef: 'C1.1',
          explanation: 'Relevant based on keyword analysis. This circular has the most open actionablesss.',
          confidence: 60
        },
        {
          circularId: 'CIRC-2024-002',
          title: 'KYC / AML Compliance Amendments 2024',
          clauseRef: 'C2.1',
          explanation: 'Potentially applicable based on your query context.',
          confidence: 52
        }
      ]
    }
  },

  /* =============================================================
     AI ENGINE — MOCK OUTPUTS
     ============================================================= */
  aiApplicabilityResults: {
    'Banking': {
      applicable: ['CIRC-2024-001', 'CIRC-2024-002', 'CIRC-2023-015'],
      notApplicable: ['CIRC-2024-004'],
      rationale: 'Banking entities are regulated by RBI. Cybersecurity and KYC/AML circulars are directly applicable. ESG disclosure applies only to listed entities above a certain threshold.'
    },
    'NBFC': {
      applicable: ['CIRC-2024-001', 'CIRC-2024-005'],
      notApplicable: ['CIRC-2024-002'],
      rationale: 'NBFCs must comply with RBI cybersecurity guidelines. KYC/AML SEBI circular may not apply depending on NBFC category.'
    },
    'default': {
      applicable: ['CIRC-2024-001', 'CIRC-2024-003'],
      notApplicable: ['CIRC-2023-015'],
      rationale: 'Based on the provided context, data localisation and cybersecurity frameworks appear most applicable. Operational risk guidelines are historic and closed.'
    }
  },

  aiSummaryResults: {
    'CIRC-2024-001': {
      summary: 'The RBI Cybersecurity Risk Management Framework (Jan 2024) mandates regulated entities to implement board-level cybersecurity governance, conduct annual independent risk assessments, maintain a live risk register, and report incidents within 6 hours.',
      keyPoints: [
        'Establish Board Cybersecurity Committee and appoint a CISO.',
        'Annual independent cybersecurity risk assessment mandatory.',
        '6-hour incident reporting window to RBI.',
        'Quarterly risk register review required.'
      ],
      regulatoryImplication: 'Non-compliance may result in regulatory action, monetary penalty, and reputational risk.',
      suggestedAction: 'Prioritise SIEM implementation and complete CISO appointment immediately.'
    },
    'CIRC-2024-002': {
      summary: 'SEBI KYC/AML amendments effective April 2024 introduce enhanced due diligence requirements for high-value transactions and mandate daily automated PEP screening for all customers.',
      keyPoints: [
        'EDD mandatory for transactions above INR 10 lakhs.',
        'Daily automated PEP screening required.',
        'Transaction monitoring systems must be upgraded.'
      ],
      regulatoryImplication: 'Non-compliance risks SEBI enforcement action and potential suspension of operations.',
      suggestedAction: 'Fast-track PEP screening API integration and complete compliance officer training.'
    },
    'default': {
      summary: 'This circular establishes a comprehensive compliance framework requiring immediate attention from multiple departments. Key obligations include governance enhancements, operational controls, and periodic reporting.',
      keyPoints: [
        'Review applicability across all business units.',
        'Assign dedicated task owners for each clause obligation.',
        'Track progress in the compliance management dashboard.'
      ],
      regulatoryImplication: 'Regulatory scrutiny is increasing. Proactive compliance is recommended.',
      suggestedAction: 'Use the Clause → Obligation → actionables module to break down requirements systematically.'
    }
  },

  aiEvidenceResults: [
    {
      fileName: 'Cybersecurity_Policy_v2.pdf',
      score: 87,
      status: 'Partial',
      reasoning: 'The submitted policy document covers governance structure (Clause 1.1, 1.2) adequately. However, evidence of a board resolution formalising the Cybersecurity Committee is missing. Incident response procedures in Section 3 lack specificity on the 6-hour reporting SLA. Recommend supplementing with a formal board resolution and an updated IR playbook.'
    },
    {
      fileName: 'Risk_Assessment_Report_Q1.pdf',
      score: 94,
      status: 'Complete',
      reasoning: 'The risk assessment report demonstrates comprehensive coverage of IT assets, vendor systems, and data flows. The assessment was conducted by an independent certified party as required. Minor gap: Scope 3 assets not explicitly enumerated but contextually covered. High confidence of compliance.'
    },
    {
      fileName: 'AML_Procedures_Manual.pdf',
      score: 43,
      status: 'Gap',
      reasoning: 'The AML Procedures Manual does not reflect the 2024 amendment requirements. EDD threshold of INR 10 lakhs is not updated (document references INR 25 lakhs). PEP screening frequency is stated as weekly, whereas the circular requires daily automated screening. Significant remediation needed before submission.'
    }
  ],

  /* =============================================================
     COMPLIANCE TREND (for line chart)
     ============================================================= */
  complianceTrend: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    data: [45, 52, 58, 63, 70, 74]
  },

  /* =============================================================
     DEPARTMENT TASKS (for bar chart)
     ============================================================= */
  departmentTasks: {
    labels: ['IT', 'Risk', 'Compliance', 'Legal', 'Finance', 'Operations', 'HR', 'Procurement'],
    data: [4, 2, 2, 2, 1, 1, 1, 2]
  }
};

// Allow task status updates to be reflected globally
CMS_DATA.getTasks = function () { return this.tasks; };
CMS_DATA.updateTaskStatus = function (taskId, newStatus) {
  const task = this.tasks.find(t => t.id === taskId);
  if (task) task.status = newStatus;
};
