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
    },
    {
      id: 'CIRC-2024-HF-001',
      title: 'Master Circular – Housing Finance',
      regulator: 'RBI',
      reference: 'RBI/2024-25/11',
      referenceNo: 'DOR.CRE.REC.No.07/08.12.001/2024-25',
      issuedDate: '2024-04-02',
      effectiveDate: '2024-04-02',
      dueDate: '2024-09-30',
      type: 'Master',
      status: 'Withdrawn',
      departments: ['Finance', 'Risk', 'Legal', 'Compliance', 'Operations'],
      risk: 'High',
      complianceScore: 45,
      summary: 'The Master Circular on Housing Finance consolidates all RBI guidelines on housing loans extended by commercial banks, covering eligible purposes, loan-to-value ratios, risk weights for capital adequacy, priority sector lending classification, interest rates, repayment norms, disclosure requirements, and reporting obligations. Issued April 2, 2024 and subsequently withdrawn.',
      chapters: [
        {
          num: 1, title: 'General Framework',
          clauses: [
            {
              id: 'HF-C1.1',
              text: 'This Master Circular consolidates all instructions issued by RBI on housing finance up to March 31, 2024.',
              obligation: 'Ensure all housing finance operations comply with consolidated RBI guidelines.',
              actionables: 'Review all existing housing loan policies against this Master Circular; identify gaps.',
              department: 'Compliance', risk: 'High', status: 'Open'
            }
          ]
        },
        {
          num: 2, title: 'Housing Loans – Purpose and Eligibility',
          clauses: [
            {
              id: 'HF-C2A.1',
              text: 'Banks may grant loans to individuals for purchase / construction of a new house or flat, purchase of an old house or flat, extension, repair, renovation and alteration of an existing house or flat.',
              obligation: 'Define and document eligible purposes for housing loans in loan policy.',
              actionables: 'Update loan origination policy to enumerate eligible purposes; circulate to credit teams.',
              department: 'Finance', risk: 'High', status: 'Open'
            },
            {
              id: 'HF-C2B.1',
              text: 'Loans extended to individuals for acquisition of land (site only) are not classified as housing loans and should not be included under the housing loan portfolio.',
              obligation: 'Segregate land-only loans from housing loan portfolio in MIS and reporting.',
              actionables: 'Audit existing portfolio; recategorise any land-only loans; update system classification.',
              department: 'Finance', risk: 'Medium', status: 'Open'
            },
            {
              id: 'HF-C2C.1',
              text: 'Loan-to-Value (LTV) ratio shall not exceed 90% for loans up to INR 30 lakhs, 80% for loans between INR 30–75 lakhs, and 75% for loans above INR 75 lakhs.',
              obligation: 'Enforce LTV ratio limits at origination and monitor at portfolio level.',
              actionables: 'Configure LTV validation in loan origination system; run portfolio-level LTV compliance report.',
              department: 'Risk', risk: 'High', status: 'Open'
            }
          ]
        },
        {
          num: 3, title: 'Prudential Norms – Risk Weights',
          clauses: [
            {
              id: 'HF-C3.1',
              text: 'Risk weights for capital adequacy purposes shall be applied based on LTV ratio slabs: ≤80% LTV → 35%; >80% and ≤90% LTV → 50% (loans up to INR 30 lakh only).',
              obligation: 'Apply correct risk weights in capital adequacy calculation for housing loan portfolio.',
              actionables: 'Update CBS/risk engine with revised risk weight slabs; validate CRAR computation.',
              department: 'Risk', risk: 'High', status: 'Open'
            }
          ]
        },
        {
          num: 4, title: 'Priority Sector Lending Classification',
          clauses: [
            {
              id: 'HF-C4.1',
              text: 'Housing loans to individuals up to INR 35 lakh in metropolitan centres and INR 25 lakh in other centres qualify as priority sector lending, subject to overall cost of dwelling not exceeding INR 45 lakh and INR 30 lakh respectively.',
              obligation: 'Classify eligible housing loans under Priority Sector and report under PSL returns.',
              actionables: 'Update PSL classification rules in CBS; verify eligibility thresholds; reconcile PSL reports.',
              department: 'Compliance', risk: 'High', status: 'Open'
            }
          ]
        },
        {
          num: 5, title: 'Interest Rates',
          clauses: [
            {
              id: 'HF-C5.1',
              text: 'Banks are free to decide interest rates on housing loans subject to the directive that rates shall be linked to an external benchmark rate (Repo Rate) with reset at least once every three months.',
              obligation: 'Ensure all floating-rate housing loans are linked to Repo Rate or other approved external benchmark.',
              actionables: 'Audit housing loan portfolio for legacy MCLR-linked loans; initiate migration plan; update product documentation.',
              department: 'Finance', risk: 'Medium', status: 'In Progress'
            }
          ]
        },
        {
          num: 6, title: 'Repayment Schedule',
          clauses: [
            {
              id: 'HF-C6.1',
              text: 'Repayment period for housing loans shall generally not exceed 30 years. EMI shall not exceed 50% of net monthly income of the borrower at sanction.',
              obligation: 'Cap repayment tenor at 30 years and EMI at 50% of borrower net income at sanction.',
              actionables: 'Configure tenor cap and income-based EMI ceiling in loan origination system; update underwriting standards.',
              department: 'Operations', risk: 'Medium', status: 'Open'
            }
          ]
        },
        {
          num: 7, title: 'Disclosure Requirements',
          clauses: [
            {
              id: 'HF-C7.1',
              text: 'Banks must provide a Key Fact Statement (KFS) to all housing loan borrowers before loan sanction, clearly disclosing annualised interest rate, fees, charges, and all-in cost.',
              obligation: 'Issue KFS to every housing loan applicant prior to sanction.',
              actionables: 'Design KFS template per RBI format; integrate into loan sanction workflow; train branch staff.',
              department: 'Compliance', risk: 'High', status: 'Open'
            }
          ]
        },
        {
          num: 8, title: 'NHB Refinance Reporting',
          clauses: [
            {
              id: 'HF-C8.1',
              text: 'Banks availing refinance from National Housing Bank must submit quarterly utilisation certificates and annual compliance reports within 30 days of end of each quarter/year.',
              obligation: 'Submit NHB refinance utilisation certificates quarterly and annual compliance reports.',
              actionables: 'Set up calendar reminders; assign report owner in Operations; draft template for utilisation certificate.',
              department: 'Operations', risk: 'Medium', status: 'Open'
            }
          ]
        },
        {
          num: 9, title: 'Foreclosure Charges and Prepayment Penalty',
          clauses: [
            {
              id: 'HF-C9.1',
              text: 'Banks shall not levy foreclosure charges or prepayment penalties on floating rate housing loans taken by individual borrowers.',
              obligation: 'Remove foreclosure charges / prepayment penalties for floating-rate individual housing loans.',
              actionables: 'Audit existing loan agreements for non-compliant clauses; update standard loan agreements; notify existing borrowers.',
              department: 'Legal', risk: 'High', status: 'Open'
            }
          ]
        },
        {
          num: 10, title: 'Board-Approved Housing Finance Policy',
          clauses: [
            {
              id: 'HF-C10.1',
              text: 'Banks must have in place a board-approved housing finance policy covering credit appraisal standards, LTV norms, valuation guidelines, and concentration risk limits for the housing loan portfolio.',
              obligation: 'Maintain a board-approved housing finance policy reviewed annually.',
              actionables: 'Review and update existing policy; table before Board for approval; document in policy register.',
              department: 'Risk', risk: 'High', status: 'Open'
            }
          ]
        },
        {
          num: 11, title: 'Reporting Requirements to RBI',
          clauses: [
            {
              id: 'HF-C11.1',
              text: 'Banks shall submit half-yearly returns on housing loan portfolio to RBI within 21 days of the close of the relevant half-year.',
              obligation: 'File half-yearly housing loan portfolio return with RBI within 21 days of close of half-year.',
              actionables: 'Assign report preparer in Compliance; schedule preparatory data collection 30 days prior; validate with Finance.',
              department: 'Compliance', risk: 'High', status: 'Open'
            }
          ]
        },
        {
          num: 12, title: 'Miscellaneous Guidelines',
          clauses: [
            {
              id: 'HF-C12.1',
              text: 'Banks shall ensure that housing loans are not extended for speculative purchases. Loans to builders for construction finance shall not be classified as housing loans for priority sector purposes.',
              obligation: 'Separate and correctly classify builder/construction finance from individual housing loans.',
              actionables: 'Review and update credit policy; identify any mis-classified builder loans in portfolio; correct MIS categorisation.',
              department: 'Legal', risk: 'Medium', status: 'Open'
            }
          ]
        }
      ],
      amendments: [
        { date: '2024-04-02', version: '1.0', description: 'Initial issuance consolidating all RBI housing finance guidelines up to March 31, 2024.' },
        { date: '2024-06-15', version: 'Withdrawn', description: 'Circular withdrawn by RBI. Superseded by updated Master Circular issued subsequently.' }
      ]
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
    },
    {
      id: 'ACT-013',
      obligationId: 'OB-013',
      title: 'Housing Finance Policy Gap Analysis',
      circularId: 'CIRC-2024-HF-001',
      clauseRef: 'HF-C1.1',
      department: 'Compliance',
      dueDate: '2024-05-15',
      priority: 'High',
      risk: 'High',
      status: 'Overdue',
      assignee: 'Meera Pillai'
    },
    {
      id: 'ACT-014',
      obligationId: 'OB-014',
      title: 'Update Loan Origination Policy – Eligible Purposes (Sec 2A)',
      circularId: 'CIRC-2024-HF-001',
      clauseRef: 'HF-C2A.1',
      department: 'Finance',
      dueDate: '2024-06-30',
      priority: 'High',
      risk: 'High',
      status: 'Open',
      assignee: 'Ravi Sharma'
    },
    {
      id: 'ACT-015',
      obligationId: 'OB-015',
      title: 'Portfolio Audit – Segregate Land-Only Loans (Sec 2B)',
      circularId: 'CIRC-2024-HF-001',
      clauseRef: 'HF-C2B.1',
      department: 'Finance',
      dueDate: '2024-07-15',
      priority: 'Medium',
      risk: 'Medium',
      status: 'Open',
      assignee: 'Anand Krishnan'
    },
    {
      id: 'ACT-016',
      obligationId: 'OB-016',
      title: 'LTV Ratio Validation – Loan Origination System (Sec 2C)',
      circularId: 'CIRC-2024-HF-001',
      clauseRef: 'HF-C2C.1',
      department: 'Risk',
      dueDate: '2024-06-15',
      priority: 'High',
      risk: 'High',
      status: 'In Progress',
      assignee: 'Vikram Singh'
    },
    {
      id: 'ACT-017',
      obligationId: 'OB-017',
      title: 'Update Risk Weights in CBS – Capital Adequacy (Sec 3)',
      circularId: 'CIRC-2024-HF-001',
      clauseRef: 'HF-C3.1',
      department: 'Risk',
      dueDate: '2024-06-30',
      priority: 'High',
      risk: 'High',
      status: 'Open',
      assignee: 'Anand Krishnan'
    },
    {
      id: 'ACT-018',
      obligationId: 'OB-018',
      title: 'PSL Classification Rules Update – Housing Loans (Sec 4)',
      circularId: 'CIRC-2024-HF-001',
      clauseRef: 'HF-C4.1',
      department: 'Compliance',
      dueDate: '2024-07-31',
      priority: 'High',
      risk: 'High',
      status: 'Open',
      assignee: 'Meera Pillai'
    },
    {
      id: 'ACT-019',
      obligationId: 'OB-019',
      title: 'Migrate MCLR-Linked Housing Loans to Repo Rate (Sec 5)',
      circularId: 'CIRC-2024-HF-001',
      clauseRef: 'HF-C5.1',
      department: 'Finance',
      dueDate: '2024-08-31',
      priority: 'High',
      risk: 'Medium',
      status: 'In Progress',
      assignee: 'Priya Nair'
    },
    {
      id: 'ACT-020',
      obligationId: 'OB-020',
      title: 'Configure EMI Cap and Tenor Limit in LOS (Sec 6)',
      circularId: 'CIRC-2024-HF-001',
      clauseRef: 'HF-C6.1',
      department: 'Operations',
      dueDate: '2024-07-15',
      priority: 'Medium',
      risk: 'Medium',
      status: 'Open',
      assignee: 'Sunita Bhatt'
    },
    {
      id: 'ACT-021',
      obligationId: 'OB-021',
      title: 'Design and Deploy Key Fact Statement – KFS (Sec 7)',
      circularId: 'CIRC-2024-HF-001',
      clauseRef: 'HF-C7.1',
      department: 'Compliance',
      dueDate: '2024-06-30',
      priority: 'High',
      risk: 'High',
      status: 'Open',
      assignee: 'Karthik Reddy'
    },
    {
      id: 'ACT-022',
      obligationId: 'OB-022',
      title: 'Set Up NHB Refinance Quarterly Reporting (Sec 8)',
      circularId: 'CIRC-2024-HF-001',
      clauseRef: 'HF-C8.1',
      department: 'Operations',
      dueDate: '2024-07-31',
      priority: 'Medium',
      risk: 'Medium',
      status: 'Open',
      assignee: 'Deepak Mehta'
    },
    {
      id: 'ACT-023',
      obligationId: 'OB-023',
      title: 'Remove Foreclosure Charges – Floating Rate Loans (Sec 9)',
      circularId: 'CIRC-2024-HF-001',
      clauseRef: 'HF-C9.1',
      department: 'Legal',
      dueDate: '2024-06-15',
      priority: 'High',
      risk: 'High',
      status: 'Overdue',
      assignee: 'Suresh Iyer'
    },
    {
      id: 'ACT-024',
      obligationId: 'OB-024',
      title: 'Board Approval – Housing Finance Policy (Sec 10)',
      circularId: 'CIRC-2024-HF-001',
      clauseRef: 'HF-C10.1',
      department: 'Risk',
      dueDate: '2024-08-15',
      priority: 'High',
      risk: 'High',
      status: 'Open',
      assignee: 'Pooja Agarwal'
    },
    {
      id: 'ACT-025',
      obligationId: 'OB-025',
      title: 'Half-Yearly RBI Housing Loan Portfolio Return (Sec 11)',
      circularId: 'CIRC-2024-HF-001',
      clauseRef: 'HF-C11.1',
      department: 'Compliance',
      dueDate: '2024-07-21',
      priority: 'High',
      risk: 'High',
      status: 'Open',
      assignee: 'Meera Pillai'
    },
    {
      id: 'ACT-026',
      obligationId: 'OB-026',
      title: 'Reclassify Builder Finance Loans – Credit Policy Update (Sec 12)',
      circularId: 'CIRC-2024-HF-001',
      clauseRef: 'HF-C12.1',
      department: 'Legal',
      dueDate: '2024-08-31',
      priority: 'Medium',
      risk: 'Medium',
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

/* ================================================================
   SPOC DASHBOARD DATA
   ================================================================ */
CMS_DATA.spocDashboard = {
  kpi: {
    pendingReview:        7,
    overdueObligations:   3,
    unassignedActivities: 11,
    complianceScore:      68
  },
  pipeline: [
    { stage: 'Received',           count: 14, color: '#6366f1' },
    { stage: 'Activities Mapped',  count: 11, color: '#3b82f6' },
    { stage: 'Assigned',           count: 8,  color: '#f59e0b' },
    { stage: 'Evidence Uploaded',  count: 5,  color: '#10b981' },
    { stage: 'Closed',             count: 2,  color: '#9ca3af' }
  ],
  recentCirculars: [
    {
      id: 'CIRC-2024-HF-001',
      title: 'Master Circular – Housing Finance',
      regulator: 'RBI',
      releaseDate: '2024-04-02',
      receivedDate: '2024-04-05',
      status: 'Withdrawn',
      needsAssignment: 8,
      requiresReview: 0,
      requiresEvidence: 0
    },
    {
      id: 'CIRC-2024-005',
      title: 'Outsourcing and Third-Party Risk Policy',
      regulator: 'RBI',
      releaseDate: '2024-04-18',
      receivedDate: '2024-05-01',
      needsAssignment: 10,
      requiresReview: 0,
      requiresEvidence: 0
    },
    {
      id: 'CIRC-2024-004',
      title: 'ESG Disclosure and Reporting Framework',
      regulator: 'SEBI',
      releaseDate: '2024-03-20',
      receivedDate: '2024-04-05',
      needsAssignment: 0,
      requiresReview: 5,
      requiresEvidence: 1
    },
    {
      id: 'CIRC-2024-002',
      title: 'KYC / AML Compliance Amendments 2024',
      regulator: 'SEBI',
      releaseDate: '2024-02-01',
      receivedDate: '2024-02-20',
      needsAssignment: 0,
      requiresReview: 3,
      requiresEvidence: 0
    },
    {
      id: 'CIRC-2024-001',
      title: 'Cybersecurity Risk Management Framework',
      regulator: 'RBI',
      releaseDate: '2024-01-05',
      receivedDate: '2024-01-15',
      needsAssignment: 0,
      requiresReview: 0,
      requiresEvidence: 2
    },
    {
      id: 'CIRC-2024-003',
      title: 'Data Localisation and Cloud Policy',
      regulator: 'MeitY',
      releaseDate: '2024-02-28',
      receivedDate: '2024-03-10',
      needsAssignment: 4,
      requiresReview: 2,
      requiresEvidence: 0
    },
    {
      id: 'CIRC-2023-015',
      title: 'Operational Risk Management \u2013 Updated Guidelines',
      regulator: 'RBI',
      releaseDate: '2023-08-15',
      receivedDate: '2023-09-01',
      needsAssignment: 0,
      requiresReview: 0,
      requiresEvidence: 0
    }
  ]
};

/* ================================================================
   FLAGGED EVIDENCE DATA
   ================================================================ */
CMS_DATA.flaggedEvidence = [
  {
    id: 'FE-001',
    activityName: 'Establish Board Cybersecurity Committee',
    circularId: 'CIRC-2024-001',
    assignedTo: 'Ravi Sharma',
    evidenceStatus: 'Missing',
    dateFlagged: '2024-05-10'
  },
  {
    id: 'FE-002',
    activityName: 'Appoint CISO – Credentials Verification',
    circularId: 'CIRC-2024-001',
    assignedTo: 'Priya Nair',
    evidenceStatus: 'Inaccurate',
    dateFlagged: '2024-05-12'
  },
  {
    id: 'FE-003',
    activityName: 'PEP Screening API Integration',
    circularId: 'CIRC-2024-002',
    assignedTo: 'Karthik Reddy',
    evidenceStatus: 'Missing',
    dateFlagged: '2024-05-14'
  },
  {
    id: 'FE-004',
    activityName: 'Update Transaction Monitoring Thresholds',
    circularId: 'CIRC-2024-002',
    assignedTo: 'Meera Pillai',
    evidenceStatus: 'Inaccurate',
    dateFlagged: '2024-05-15'
  },
  {
    id: 'FE-005',
    activityName: 'Cloud Data Migration – Sensitive PII',
    circularId: 'CIRC-2024-003',
    assignedTo: 'Sunita Bhatt',
    evidenceStatus: 'Missing',
    dateFlagged: '2024-05-18'
  },
  {
    id: 'FE-006',
    activityName: 'ESG Scope 1 & 2 Emissions Measurement',
    circularId: 'CIRC-2024-004',
    assignedTo: 'Deepak Mehta',
    evidenceStatus: 'Inaccurate',
    dateFlagged: '2024-05-20'
  },
  {
    id: 'FE-007',
    activityName: 'Vendor Classification Matrix Development',
    circularId: 'CIRC-2024-005',
    assignedTo: 'Pooja Agarwal',
    evidenceStatus: 'Missing',
    dateFlagged: '2024-05-22'
  },
  {
    id: 'FE-008',
    activityName: 'Legal Review – Updated Vendor Contracts',
    circularId: 'CIRC-2024-005',
    assignedTo: 'Suresh Iyer',
    evidenceStatus: 'Inaccurate',
    dateFlagged: '2024-05-25'
  }
];
