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
   
    ///HDFC Document 1
//     {
//   "id": "SEBI-MF-2023-117 (HDFC)",
//   "title": "Roles and Responsibilities of Trustees and Board of Directors of AMCs of Mutual Funds",
//   "regulator": "SEBI",
//   "issuedDate": "2023-07-07",
//   "effectiveDate": "2024-01-01",
//   "type": "Circular",
//   "status": "Active",
//   "libraryStatus": "Assigned",
//   "docUrl": "./2023-07-07 - Role & Resp of Trustees and AMC directors of a Mutual Fund.pdf",
//   "departments": ["Compliance", "Risk", "Legal"],
//   "risk": "High",
//   "complianceScore": 0,
//   "summary": "Defines core responsibilities of Trustees and operational mechanisms through UHPC to protect unitholders.",
  
//   "chapters": [
//     {
//       "num": 4,
//       "title": "Core Responsibilities of Trustees",
//       "clauses": [
//         {
//           "id": "4.1.1(a)",
//           "text": "Trustees shall ensure fairness of fees and expenses charged by AMCs.",
//           "obligations": [
//             "Ensure fairness of AMC fees and expenses"
//           ],
//           "actionables": [
//             "Review fee structure periodically",
//             "Benchmark fees with peers"
//           ],
//           "department": "Compliance",
//           "risk": "High",
//           "status": "Assigned",
//           "pageNo": 2
//         },
//         {
//           "id": "4.1.2",
//           "text": "Trustees shall ensure system-level checks to prevent fraud including front running.",
//           "obligations": [
//             "Ensure systems prevent fraudulent transactions"
//           ],
//           "actionables": [
//             "Implement fraud detection systems",
//             "Review alerts periodically"
//           ],
//           "department": "Risk",
//           "risk": "High",
//           "status": "Assigned",
//           "pageNo": 2
//         }
//       ]
//     }
//   ],

//   "annexures": [
//     {
//       "id": "Annexure 1",
//       "title": "Unit Holder Protection Committee",
//       "clauses": [
//         {
//           "id": "1(a)",
//           "text": "Chairperson of the Committee shall be an independent director.",
//           "obligations": [
//             "Ensure UHPC Chairperson is independent"
//           ],
//           "actionables": [
//             "Verify independence criteria",
//             "Document board approval"
//           ],
//           "department": "Compliance",
//           "risk": "Medium",
//           "status": "Assigned",
//           "pageNo": 6
//         },
//         {
//           "id": "2(a)",
//           "text": "At least four meetings shall be held in a financial year.",
//           "obligations": [
//             "Ensure minimum four UHPC meetings annually"
//           ],
//           "actionables": [
//             "Schedule quarterly meetings",
//             "Track meeting completion"
//           ],
//           "department": "Compliance",
//           "risk": "Medium",
//           "status": "Assigned",
//           "pageNo": 6
//         },
//         {
//           "id": "4.1(a)",
//           "text": "Review of unit holder complaints and grievances periodically.",
//           "obligations": [
//             "Ensure periodic review of complaints"
//           ],
//           "actionables": [
//             "Track complaint ageing",
//             "Perform root cause analysis"
//           ],
//           "department": "Compliance",
//           "risk": "High",
//           "status": "Assigned",
//           "pageNo": 6
//         },
//         {
//           "id": "4.3(a)",
//           "text": "Ensure compliance with applicable laws for complaints and disclosures.",
//           "obligations": [
//             "Ensure regulatory compliance in grievance handling"
//           ],
//           "actionables": [
//             "Implement compliance checks",
//             "Audit complaint processes"
//           ],
//           "department": "Compliance",
//           "risk": "High",
//           "status": "Assigned",
//           "pageNo": 7
//         }
//       ]
//     }
//   ],

//   "amendments": []
// },'='=


{
  "id": "SEBI-ITD-2025-111",
  "title": "Rights of Persons with Disabilities Act, 2016 and rules made thereunder - mandatory compliance by all Regulated Entities",
  "regulator": "SEBI",
  "issuedDate": "2025-07-31",
  "effectiveDate": "2025-07-31",
  "type": "Circular",
  "status": "Active",
  "libraryStatus": "Assigned",
  "docUrl": "./2025-07-31-SEBI Circular on Rights of Persons with Disabilities Act, 2016.pdf",
  "departments": [
    "Compliance",
    "IT",
  
    "Customer Service",
  ],
  "risk": "High",
  "complianceScore": 0,
  "summary": "Mandates all SEBI regulated entities to ensure accessibility of digital platforms for persons with disabilities in line with the RPwD Act, 2016, accessibility standards, annual reporting, accessibility audits and grievance redressal mechanisms.",
 "applicableEntities": [
  { "name": "All Recognised Stock Exchanges", "applicable": true },
  { "name": "All Recognised Clearing Corporations", "applicable": true },
  { "name": "All Registered Depositories", "applicable": false },
  { "name": "All Registered Intermediaries", "applicable": false },
  { "name": "Association of Mutual Funds in India (AMFI)", "applicable": true },
  { "name": "Association of Portfolio Managers in India (APMI)", "applicable": false },
  { "name": "BSE Administration & Supervision Limited (BASL)", "applicable": false }
],
  "chapters": [
    {
  "num": 1,
  "title": "Purpose and Applicability",
  "clauses": [
    {
      "id": "1",
      "text": "To protect the rights and dignity of persons with disabilities and ensure their full and effective participation in securities market, it is necessary to provide for their access to Digital Platforms of SEBI Regulated Entities.",
      "obligations": [],
      "actionables": [],
      "department": "Compliance",
      "risk": "High",
      "status": "Assigned",
      "pageNo": 1,
      "internalNotes": ""
    },
    {
      "id": "2",
      "text": "For the purpose of this Circular, the term “Regulated Entity or RE” shall refer to SEBI registered/ recognised intermediaries (for example stockbrokers, mutual funds, KYC Registration Agencies, QRTAs, etc.) and Market Infrastructure Institutions (Stock Exchanges, Depositories and Clearing Corporations) regulated by SEBI.",
      "obligations": [],
      "actionables": [],
      "department": "Compliance",
      "risk": "Medium",
      "status": "Assigned",
      "pageNo": 1,
      "internalNotes": ""
    }
  ]
},
    {
      "num": 2,
      "title": "Accessibility Compliance Requirements",
      "clauses": [
        {
          "id": "3(a)",
          "text": "All Digital Platforms of REs shall be compliant with Section 40 of RPwD Act, 2016 relating to Accessibility.",
          "obligations": [
            "Ensure all digital platforms comply with accessibility standards under RPwD Act"
          ],
          "actionables": [
            "Identify all digital platforms such as website, mobile app, investor portal and WhatsApp-based servicing",
            "Review whether distributor platforms such as Groww, PhonePe and Upstox are covered",
            "Map all digital channels against Section 40 accessibility requirements"
          ],
          "department": "Digital",
          "risk": "High",
          "status": "Assigned",
          "pageNo": 2,
          "assignee":"Meera Phillai",
          "internalNotes": "AMC should identify all investor-facing digital channels including websites, mobile apps, WhatsApp servicing and distributor journeys."
        },
        {
          "id": "3(b)",
          "text": "All Digital Platforms of REs shall be compliant with Section 42 of RPwD Act, 2016 relating to access to information and communication technology.",
          "obligations": [
            "Provide accessible information and communication technology to persons with disabilities"
          ],
          "actionables": [
            "Ensure content is available in accessible formats",
            "Provide sign language interpretation, audio description and closed captioning",
            "Review all website and mobile content for hearing and visual accessibility"
          ],
          "department": "IT",
          "risk": "High",
          "status": "Assigned",
          "pageNo": 2,
          "internalNotes": "All AMC content should be made accessible for hearing impairment, visual impairment and other disabilities."
        },
        {
          "id": "3(d)",
          "text": "All Digital Platforms of REs shall be compliant with Rule 15(1)(c) of the Rights of Persons with Disabilities Rules, 2017.",
          "obligations": [
            "Ensure websites and uploaded documents comply with accessibility standards"
          ],
          "actionables": [
            "Ensure website follows Government website accessibility guidelines",
            "Publish documents in OCR-based PDF or ePUB format",
            "Review all uploaded documents for accessibility before publishing"
          ],
          "department": "Legal",
          "risk": "High",
          "status": "Assigned",
          "pageNo": 2,
          "internalNotes": "All uploaded documents should be in OCR PDF or ePUB format and comply with Government website accessibility standards."
        }
      ]
    },
    {
      "num": 3,
      "title": "Implementation Timelines and Reporting",
      "clauses": [
        {
          "id": "5(1)",
          "text": "Within 1 month of the issuance of circular, REs shall submit a list of digital platforms provided by them for the investors and submit a compliance/action taken report.",
          "obligations": [
            "Submit digital platform inventory",
            "Submit compliance report within one month"
          ],
          "actionables": [
            "Prepare list of all digital platforms provided to investors",
            "Submit compliance report for each clause of the circular",
            "Complete filing by August 31, 2025"
          ],
          "department": "Compliance",
          "risk": "High",
          "status": "Assigned",
          "pageNo": 2,
          "dueDate": "2025-08-31"
        },
        {
          "id": "5(2)",
          "text": "Within 45 days of the issuance of circular, REs shall appoint IAAP certified accessibility professionals as Auditor.",
          "obligations": [
            "Appoint IAAP certified accessibility auditor"
          ],
          "actionables": [
            "Identify IAAP certified auditor",
            "Complete appointment by September 14, 2025",
            "Track readiness and compliance status for each digital platform"
          ],
          "department": "Compliance",
          "risk": "High",
          "status": "Assigned",
          "pageNo": 2,
          "dueDate": "2025-09-14"
        },
        {
          "id": "5(3)",
          "text": "Within 3 month of issuance of the circular, REs shall conduct Accessibility Audit for the digital platforms.",
          "obligations": [
            "Conduct accessibility audit for all digital platforms"
          ],
          "actionables": [
            "Audit websites, mobile apps and portals",
            "Include usability testing by persons with disabilities",
            "Complete accessibility audit by October 31, 2025"
          ],
          "department": "IT",
          "risk": "High",
          "status": "Assigned",
          "pageNo": 2,
          "dueDate": "2025-10-31"
        },
        {
          "id": "5(4)",
          "text": "Within 6 months of issuance of circular, REs shall remediate findings from the audit and ensure compliance with this circular.",
          "obligations": [
            "Remediate audit findings and achieve compliance"
          ],
          "actionables": [
            "Prepare remediation plan",
            "Close all audit findings",
            "Complete remediation by January 31, 2026"
          ],
          "department": "IT",
          "risk": "High",
          "status": "Assigned",
          "pageNo": 2,
          "dueDate": "2026-01-31"
        }
      ]
    }
  ],
  "annexures":[
    {
  "id": "Annexure I",
  "title": "Directions on Digital Accessibility for Persons with Disabilities",
  "clauses": [
    {

    },
    {
      "id": "B.1",
      "text": "All REs shall ensure that their Digital Platforms and content published on the digital platform shall strictly adhere to the accessibility standards and guidelines, including WCAG 2.1 or latest version.",
      "obligations": [
        "Ensure compliance with WCAG accessibility standards across all digital platforms"
      ],
      "actionables": [
        "Review websites, portals and mobile applications against WCAG 2.1",
        "Document gaps and remediation requirements",
        "Ensure future releases are compliant with latest WCAG standards"
      ],
      "department": "Digital",
      "risk": "High",
      "status": "Assigned",
      "pageNo": 4,
      "internalNotes": "Digital Team should identify all requirements under WCAG 2.1 and ensure compliance."
    },
    {
      "id": "B.2",
      "text": "All REs shall ensure that their Digital Platforms and content published on the digital platform shall strictly adhere to accessibility guidelines as described in the latest version of Guidelines for Indian Government Websites (GIGW).",
      "obligations": [
        "Ensure websites comply with GIGW accessibility standards"
      ],
      "actionables": [
        "Map current website design against GIGW requirements",
        "Implement changes for non-compliant website features"
      ],
      "department": "Digital",
      "risk": "High",
      "status": "Assigned",
      "pageNo": 4,
      "internalNotes": "AMC website should comply with Indian Government website accessibility standards."
    },
    {
      "id": "B.3",
      "text": "All REs shall ensure that their Digital Platforms and content published on the digital platform shall strictly adhere to IS 17802: Indian Standards on Accessibility Requirements for ICT Products and Services.",
      "obligations": [
        "Ensure ICT systems comply with IS 17802 accessibility requirements"
      ],
      "actionables": [
        "Review technology stack for IS 17802 compliance",
        "Validate accessibility of ICT products and services"
      ],
      "department": "IT",
      "risk": "Medium",
      "status": "Assigned",
      "pageNo": 4,
      "internalNotes": "Technology team should review all ICT products against IS 17802 requirements."
    },
    {
      "id": "1.2",
      "text": "The major roles and responsibilities of the Nodal Officer shall be to ensure digital accessibility for every investor by ensuring that activities, including but not limited to conducting accessibility audits, mitigation of accessibility audit findings, implementation of accessibility guidelines, and timely redressal of grievance.",
      "obligations": [
        "Ensure Nodal Officer drives digital accessibility compliance"
      ],
      "actionables": [
        "Define responsibilities of Nodal Officer",
        "Assign reporting and grievance monitoring responsibilities",
        "Ensure Nodal Officer acts as contact point for SEBI"
      ],
      "department": "Compliance",
      "risk": "High",
      "status": "Assigned",
      "pageNo": 5,
      "internalNotes": "Harish to act as Nodal Officer and coordinate audit, remediation and SEBI reporting."
    },
    {
      "id": "1.3",
      "text": "A grievance redressal mechanism specific to accessibility issues shall be institutionalized within the REs.",
      "obligations": [
        "Implement grievance redressal process for accessibility-related complaints"
      ],
      "actionables": [
        "Provide dedicated email, helpline and web form for PwD grievances",
        "Implement escalation matrix to senior officers",
        "Track and close accessibility complaints"
      ],
      "department": "Customer Service",
      "risk": "High",
      "status": "Assigned",
      "pageNo": 5,
      "internalNotes": "Existing investor support channels should be enhanced to support PwD accessibility grievances."
    },
    {
      "id": "2.2",
      "text": "All circulars, notices, and investor documents published on the Digital Platforms of the REs in PDF or other formats must follow accessible document standards.",
      "obligations": [
        "Ensure all investor documents follow accessibility standards"
      ],
      "actionables": [
        "Publish tagged PDFs with logical reading order",
        "Ensure proper headings and alt text",
        "Review all uploaded investor documents for accessibility before publication"
      ],
      "department": "Legal",
      "risk": "High",
      "status": "Assigned",
      "pageNo": 5,
      "internalNotes": "All PDF, Word and Excel documents uploaded on AMC website should comply with accessible document standards."
    },
    {
      "id": "3.1",
      "text": "Training modules that give detailed understanding on digital accessibility shall be part of all internal training programs for staff and third-party service providers.",
      "obligations": [
        "Conduct digital accessibility awareness and training programs"
      ],
      "actionables": [
        "Train internal teams on accessible document creation",
        "Provide awareness sessions to third-party service providers",
        "Include behavioural training and assistive tools in learning modules"
      ],
      "department": "HR",
      "risk": "Medium",
      "status": "Assigned",
      "pageNo": 6,
      "internalNotes": "Sandip should conduct training sessions for departments responsible for website uploads and digital content."
    },
    {
      "id": "4.2",
      "text": "KYC and client registration forms shall include a mandatory field to indicate disability status and options to select specific provisions such as helpdesk call back for assistance.",
      "obligations": [
        "Capture disability status and assistance requirements in registration journeys"
      ],
      "actionables": [
        "Update KYC forms to include disability-related fields",
        "Add callback assistance options",
        "Ensure manual review of PwD application rejections"
      ],
      "department": "Operations",
      "risk": "High",
      "status": "Assigned",
      "pageNo": 6,
      "internalNotes": "PwD-related application rejections should be manually reviewed by a designated officer."
    },
    {
      "id": "5.4",
      "text": "All REs shall conduct annual accessibility audits of their digital platforms including websites, mobile apps, portals through IAAP certified accessibility professionals.",
      "obligations": [
        "Conduct annual accessibility audits"
      ],
      "actionables": [
        "Schedule yearly audits by IAAP certified professionals",
        "Submit annual audit reports to reporting authority",
        "Track remediation of recurring findings"
      ],
      "department": "IT",
      "risk": "High",
      "status": "Assigned",
      "pageNo": 7,
      "internalNotes": "Annual accessibility audits should be built into recurring compliance calendar."
    },
    {
      "id": "6.2",
      "text": "Accessibility requirements shall be part of all Request for Proposals (RFPs) and procurement contracts of the REs and evaluation criteria of the REs shall assign due weightage to accessibility readiness.",
      "obligations": [
        "Include accessibility clauses in procurement and vendor contracts"
      ],
      "actionables": [
        "Update RFP templates",
        "Insert accessibility clauses in legal agreements",
        "Evaluate vendors for accessibility readiness"
      ],
      "department": "Procurement",
      "risk": "Medium",
      "status": "Assigned",
      "pageNo": 7,
      "internalNotes": "Procurement and Legal teams should update all vendor agreements and RFP templates."
    }
  ]
}
  ]
},

{
  "id": "SEBI-MF-2023-117",
  "title": "Roles and Responsibilities of Trustees and Board of Directors of AMCs of Mutual Funds",
  "regulator": "SEBI",
  "issuedDate": "2023-07-07",
  "effectiveDate": "2024-01-01",
  "type": "Circular",
  "status": "Active",
  "libraryStatus": "Assigned",
  "docUrl": "./2023-07-07 - Role & Resp of Trustees and AMC directors of a Mutual Fund.pdf",
  "departments": ["Compliance", "Risk", "Legal"],
  "risk": "High",
  "complianceScore": 0,
  "sebiEntities": [
  "Mutual Funds",
  "Asset Management Companies",
  "Trustee Companies / Board of Trustees of Mutual Funds",
  "Association of Mutual Funds in India"
],
  "summary": "Defines core responsibilities of Trustees, Board of Directors of AMCs and operational mechanisms through UHPC to protect unitholders.",
  "chapters": [
    {
      "num": 4,
      "title": "Core Responsibilities of Trustees",
      "clauses": [
        {
          "id": "4.1.1(a)",
          "text": "The Trustees shall ensure the fairness of the fees and expenses charged by the AMCs.",
          "obligations": [
            "Ensure fairness of AMC fees and expenses"
          ],
          "actionables": [
            "Review fee structure periodically",
            "Benchmark fees and expenses with peers",
            "Document rationale for fee approvals"
          ],
          "department": "Compliance",
          "risk": "High",
          "status": "Assigned",
          "pageNo": 2
        },
        {
          "id": "4.1.1(b)",
          "text": "The Trustees shall review the performance of AMC in its schemes vis-a-vis performance of peers or the appropriate benchmarks.",
          "obligations": [
            "Review AMC scheme performance against peers and benchmarks"
          ],
          "actionables": [
            "Perform periodic benchmarking of schemes",
            "Review underperforming schemes",
            "Escalate persistent underperformance to the board"
          ],
          "department": "Risk",
          "risk": "Medium",
          "status": "Assigned",
          "pageNo": 2
        },
        {
          "id": "4.1.1(c)",
          "text": "The Trustees shall ensure that the AMCs have put in place adequate systems to prevent mis-selling to increase assets under their management and valuation of the AMCs.",
          "obligations": [
            "Ensure systems exist to prevent mis-selling practices"
          ],
          "actionables": [
            "Implement mis-selling detection controls",
            "Review distributor sales practices",
            "Monitor investor complaints related to mis-selling"
          ],
          "department": "Compliance",
          "risk": "High",
          "status": "Assigned",
          "pageNo": 2
        },
        {
          "id": "4.1.1(d)",
          "text": "The Trustees shall ensure that operations of AMCs are not unduly influenced by the AMCs Sponsor, its associates and other stakeholders of AMCs.",
          "obligations": [
            "Ensure AMC operations remain independent from sponsor influence"
          ],
          "actionables": [
            "Review governance arrangements",
            "Identify sponsor influence risks",
            "Document conflict management measures"
          ],
          "department": "Legal",
          "risk": "High",
          "status": "Assigned",
          "pageNo": 2
        },
        {
          "id": "4.1.1(e)",
          "text": "The Trustees shall ensure that undue or unfair advantage is not given by AMCs to any of their associates/group entities.",
          "obligations": [
            "Ensure no undue benefit is provided to group entities or associates"
          ],
          "actionables": [
            "Review related party transactions",
            "Monitor preferential treatment to associates",
            "Maintain audit trail of approvals"
          ],
          "department": "Compliance",
          "risk": "High",
          "status": "Assigned",
          "pageNo": 2
        },
        {
          "id": "4.1.1(f)",
          "text": "The Trustees shall be responsible to address conflicts of interest, if any, between the shareholders/stakeholders/associates of the AMCs and unitholders.",
          "obligations": [
            "Address conflicts of interest between AMC stakeholders and unitholders"
          ],
          "actionables": [
            "Establish conflict of interest policy",
            "Review conflict disclosures periodically",
            "Escalate material conflicts to Trustees"
          ],
          "department": "Legal",
          "risk": "High",
          "status": "Assigned",
          "pageNo": 2
        },
        {
          "id": "4.1.1(g)",
          "text": "The Trustees shall ensure that the AMC has put in place adequate systems to prevent misconduct including market abuse/misuse of information by the employees, AMC and connected entities of the AMCs.",
          "obligations": [
            "Ensure systems prevent market abuse and misuse of information"
          ],
          "actionables": [
            "Implement insider trading controls",
            "Monitor employee dealing activities",
            "Conduct periodic compliance surveillance"
          ],
          "department": "Risk",
          "risk": "High",
          "status": "Assigned",
          "pageNo": 2
        },
        {
          "id": "4.1.2",
          "text": "The Trustees shall take steps to ensure that there are system level checks in place at AMCs’ end to prevent fraudulent transactions including front running by employees, form splitting/ mis-selling by distributors etc. The Trustees shall review such checks periodically.",
          "obligations": [
            "Ensure systems prevent fraudulent transactions including front running",
            "Ensure periodic review of fraud prevention controls"
          ],
          "actionables": [
            "Implement fraud detection systems",
            "Review surveillance alerts periodically",
            "Monitor front running and form splitting incidents"
          ],
          "department": "Risk",
          "risk": "High",
          "status": "Assigned",
          "pageNo": 2
        },
        {
          "id": "4.1.3",
          "text": "The Trustees and their resource persons shall independently evaluate the extent of compliance by AMCs vis-à-vis the identified key areas and not merely rely on AMCs’ submissions /external assurances.",
          "obligations": [
            "Conduct independent evaluation of AMC compliance"
          ],
          "actionables": [
            "Perform independent compliance testing",
            "Review evidence beyond AMC submissions",
            "Document independent observations"
          ],
          "department": "Compliance",
          "risk": "High",
          "status": "Assigned",
          "pageNo": 2
        },
        {
          "id": "4.1.8",
          "text": "The Trustees shall periodically review the steps taken by AMCs for folios which do not contain all the Know Your Client (KYC) attributes / updated KYC attributes and ensure that the AMCs take remedial steps necessary for updating the KYC attributes especially pertaining to bank details, PAN, mobile phone number.",
          "obligations": [
            "Ensure folios contain complete and updated KYC attributes"
          ],
          "actionables": [
            "Review incomplete KYC cases periodically",
            "Track remediation of missing KYC attributes",
            "Prioritise updates for PAN, bank details and mobile number"
          ],
          "department": "Compliance",
          "risk": "Medium",
          "status": "Assigned",
          "pageNo": 3
        }
      ]
    },
    {
      "num": 4.2,
      "title": "Third Party Assurances",
      "clauses": [
        {
          "id": "4.2.1(a)",
          "text": "Overseeing that AMCs manage the operations of Mutual Fund schemes independently from other activities.",
          "obligations": [
            "Ensure AMC scheme operations remain independent from other business activities"
          ],
          "actionables": [
            "Review segregation of scheme operations",
            "Assess conflicts with non-mutual fund activities",
            "Obtain assurance from third party fiduciaries"
          ],
          "department": "Compliance",
          "risk": "Medium",
          "status": "Assigned",
          "pageNo": 3
        },
        {
          "id": "4.2.1(c)",
          "text": "Reviewing the networth of the AMC on a periodic basis to ensure compliance with prescribed threshold.",
          "obligations": [
            "Ensure AMC net worth complies with prescribed threshold"
          ],
          "actionables": [
            "Review AMC financial statements periodically",
            "Track net worth levels against regulatory threshold",
            "Escalate shortfalls immediately"
          ],
          "department": "Risk",
          "risk": "High",
          "status": "Assigned",
          "pageNo": 3
        }
      ]
    },
    {
      "num": 4.3,
      "title": "Unit Holder Protection Committee",
      "clauses": [
        {
          "id": "4.3.2(a)",
          "text": "Protection of interest of unit holders of Mutual Fund schemes vis-a-vis all products and services provided by the AMC.",
          "obligations": [
            "Ensure protection of unit holder interests across AMC products and services"
          ],
          "actionables": [
            "Review investor impact of products and services",
            "Escalate issues affecting unitholders",
            "Monitor investor complaints and feedback"
          ],
          "department": "Compliance",
          "risk": "High",
          "status": "Assigned",
          "pageNo": 4
        },
        {
          "id": "4.3.2(b)",
          "text": "Ensuring adoption of sound and healthy market practices in terms of investments, sales, marketing, advertisement, management of conflict of interests, redressal of unit holder’s grievances, investor awareness.",
          "obligations": [
            "Ensure adoption of fair market and investor protection practices"
          ],
          "actionables": [
            "Review sales and marketing practices",
            "Assess grievance redressal processes",
            "Monitor conflict of interest controls"
          ],
          "department": "Compliance",
          "risk": "High",
          "status": "Assigned",
          "pageNo": 4
        },
        {
          "id": "4.3.2(c)",
          "text": "Compliance with laws and regulations and other related processes with specific reference to operation of the Mutual Fund business.",
          "obligations": [
            "Ensure compliance with laws and regulations applicable to mutual fund business"
          ],
          "actionables": [
            "Perform regulatory compliance reviews",
            "Track non-compliance incidents",
            "Implement corrective actions for breaches"
          ],
          "department": "Compliance",
          "risk": "High",
          "status": "Assigned",
          "pageNo": 4
        }
      ]
    },
    {
      "num": 5,
      "title": "Meetings between the Trustee Company and the AMC",
      "clauses": [
        {
          "id": "4.5.2",
          "text": "The board of directors of the AMCs and the board of directors of the Trustee Company shall meet at least once a year to discuss the issues concerning the Mutual Fund, if any, and future course of action, wherever required.",
          "obligations": [
            "Ensure annual meeting between AMC board and Trustee Company board"
          ],
          "actionables": [
            "Schedule annual joint board meeting",
            "Document issues discussed and actions agreed",
            "Track follow-up items from meeting"
          ],
          "department": "Compliance",
          "risk": "Medium",
          "status": "Assigned",
          "pageNo": 5
        }
      ]
    }
  ],
  "annexures": [
    {
      "id": "Annexure 1",
      "title": "Unit Holder Protection Committee",
      "clauses": [
        {
          "id": "1(a)",
          "text": "The Chairperson of the Committee shall be an independent director.",
          "obligations": [
            "Ensure UHPC Chairperson is an independent director"
          ],
          "actionables": [
            "Verify independence criteria",
            "Document board approval",
            "Review composition periodically"
          ],
          "department": "Compliance",
          "risk": "Medium",
          "status": "Assigned",
          "pageNo": 6
        },
        {
          "id": "1(b)",
          "text": "The UHPC of AMC shall have minimum three directors as members.",
          "obligations": [
            "Ensure UHPC has minimum three directors"
          ],
          "actionables": [
            "Verify committee composition",
            "Maintain updated membership records",
            "Escalate vacancies promptly"
          ],
          "department": "Compliance",
          "risk": "Medium",
          "status": "Assigned",
          "pageNo": 6
        },
        {
          "id": "2(a)",
          "text": "The Chairperson of the UHPC shall call the meeting as and when required. However, at least four meetings shall be held in a financial year.",
          "obligations": [
            "Ensure minimum four UHPC meetings annually"
          ],
          "actionables": [
            "Schedule quarterly meetings",
            "Track meeting completion",
            "Maintain meeting calendar"
          ],
          "department": "Compliance",
          "risk": "Medium",
          "status": "Assigned",
          "pageNo": 6
        },
        {
          "id": "4.1(a)",
          "text": "Review of unit holder complaints and grievances with ageing of outstanding complaints on a periodical basis.",
          "obligations": [
            "Ensure periodic review of complaints and ageing"
          ],
          "actionables": [
            "Track complaint ageing",
            "Review pending complaints periodically",
            "Escalate long outstanding grievances"
          ],
          "department": "Compliance",
          "risk": "High",
          "status": "Assigned",
          "pageNo": 6
        },
        {
          "id": "4.1(b)",
          "text": "Review of complaints / grievances handling mechanism including reported instances of mis-selling and frauds, if any. Analyse the root cause of investor complaints, identify market conduct issues and advise the management appropriately about rectifying systemic issues, if any.",
          "obligations": [
            "Ensure effective grievance handling and root cause analysis"
          ],
          "actionables": [
            "Review complaint handling mechanism",
            "Analyse root causes of complaints",
            "Recommend rectification of systemic issues"
          ],
          "department": "Compliance",
          "risk": "High",
          "status": "Assigned",
          "pageNo": 6
        },
        {
          "id": "4.3(a)",
          "text": "Ensure that the AMC adopts a standard operating procedure for its processes including timeframe for processing and confirmation of financial and non-financial transactions, treats unit holders fairly and equally and there is no preferential treatment given to different classes of investors.",
          "obligations": [
            "Ensure fair treatment of all unit holders",
            "Ensure standard operating procedures are established"
          ],
          "actionables": [
            "Implement SOPs for investor servicing",
            "Review turnaround times for transactions",
            "Monitor preferential treatment risks"
          ],
          "department": "Compliance",
          "risk": "High",
          "status": "Assigned",
          "pageNo": 7
        },
        {
          "id": "4.3(b)",
          "text": "Ensure compliances with applicable laws with respect to resolving, reporting and disclosures of complaints and grievances.",
          "obligations": [
            "Ensure regulatory compliance in complaint resolution and disclosures"
          ],
          "actionables": [
            "Implement compliance checks",
            "Audit complaint reporting processes",
            "Monitor grievance disclosure timelines"
          ],
          "department": "Compliance",
          "risk": "High",
          "status": "Assigned",
          "pageNo": 7
        },
        {
          "id": "4.3(j)",
          "text": "Ensure that all conflicts are adequately managed and/or disclosed as per the conflict-of-interest policy.",
          "obligations": [
            "Ensure conflicts are managed and disclosed appropriately"
          ],
          "actionables": [
            "Review conflict disclosures periodically",
            "Monitor compliance with conflict-of-interest policy",
            "Escalate material conflict breaches"
          ],
          "department": "Legal",
          "risk": "High",
          "status": "Assigned",
          "pageNo": 7
        },
        {
          "id": "4.4(a)",
          "text": "Ensure that the AMC has approved internal policy for measurement of various parameters through appropriate UP metrics.",
          "obligations": [
            "Ensure AMC has approved policy for UP metrics"
          ],
          "actionables": [
            "Define UP metrics and benchmarks",
            "Obtain committee approval for metrics",
            "Review investor impact indicators periodically"
          ],
          "department": "Risk",
          "risk": "Medium",
          "status": "Assigned",
          "pageNo": 8
        },
        {
          "id": "4.4(c)",
          "text": "Review the reports generated with respect to the UP metrics at least once in a half year.",
          "obligations": [
            "Ensure half-yearly review of UP metrics reports"
          ],
          "actionables": [
            "Schedule half-yearly UP metric review meetings",
            "Analyse trends in investor protection indicators",
            "Document corrective actions for adverse trends"
          ],
          "department": "Risk",
          "risk": "Medium",
          "status": "Assigned",
          "pageNo": 8
        }
      ]
    }
  ],
  "amendments": []
},
//HDFC Doc 2
{
  "id": "SEBI-MF-2023-160",
  "title": "Nomination for Mutual Fund Unit Holders – Extension of Timelines",
  "regulator": "SEBI",
  "issuedDate": "2023-09-27",
  "effectiveDate": "2024-01-01",
  "type": "Circular",
  "status": "Active",
  "libraryStatus": "Assigned",
  "sebiEntities": [
  "Mutual Funds",
  "Asset Management Companies",
  "Trustee Companies / Boards of Trustees of Mutual Funds",
  "Registrars to an Issue and Share Transfer Agents",
  "Association of Mutual Funds in India"
],
  "docUrl": "./Nomination for Mutual Fund Unit Holders – Extension of Timelines.pdf",
  "departments": ["Compliance", "Operations", "Investor Services"],
  "risk": "Medium",
  "complianceScore": 0,
  "summary": "Extends the deadline for nomination or opting out of nomination for mutual fund folios and prescribes periodic communication to investors for compliance.",
  "chapters": [
    {
      "num": 1,
      "title": "Requirement for Nomination / Opting Out",
      "clauses": [
        {
          "id": "1",
          "text": "The requirement for nomination/ opting out of nomination for all the existing individual unit holder(s) holding mutual fund units either solely or jointly, failing which the folios shall be frozen for debits.",
          "obligations": [
            "Ensure all existing individual unit holders provide nomination or opt out of nomination",
            "Ensure non-compliant folios are identified for debit freeze"
          ],
          "actionables": [
            "Track folios without nomination details",
            "Identify investors who have not opted out formally",
            "Prepare system controls for freezing non-compliant folios"
          ],
          "department": "Compliance",
          "risk": "High",
          "status": "Assigned",
          "pageNo": 1
        },
        {
          "id": "2",
          "text": "The provision with regard to freezing of folios, shall come into force with effect from January 01, 2024 instead of September 30, 2023.",
          "obligations": [
            "Ensure revised effective date for folio freezing is implemented",
            "Ensure systems reflect January 01, 2024 deadline"
          ],
          "actionables": [
            "Update compliance tracker with revised deadline",
            "Modify system configuration for folio freeze date",
            "Communicate revised implementation timeline internally"
          ],
          "department": "Operations",
          "risk": "Medium",
          "status": "Assigned",
          "pageNo": 1
        }
      ]
    },
    {
      "num": 2,
      "title": "Investor Communication Requirements",
      "clauses": [
        {
          "id": "3(a)",
          "text": "AMCs and RTAs shall encourage the unit holder(s) to fulfil the requirement for nomination/ opting out of nomination by sending a communication on fortnightly basis by way of emails and SMS to all such unit holder(s) who are not in compliance with the requirement of nomination.",
          "obligations": [
            "Ensure periodic communication is sent to non-compliant unit holders",
            "Ensure both email and SMS channels are used for communication"
          ],
          "actionables": [
            "Prepare fortnightly communication schedule",
            "Identify non-compliant investors periodically",
            "Send reminder emails and SMS alerts"
          ],
          "department": "Investor Services",
          "risk": "Medium",
          "status": "Assigned",
          "pageNo": 1
        },
        {
          "id": "3(b)",
          "text": "The communication shall provide guidance by which the unit holder(s) can provide nomination or opt out of nomination.",
          "obligations": [
            "Ensure investor communication includes clear guidance for nomination compliance"
          ],
          "actionables": [
            "Include nomination process instructions in communication",
            "Provide opt-out declaration guidance",
            "Share digital and physical submission methods"
          ],
          "department": "Investor Services",
          "risk": "Low",
          "status": "Assigned",
          "pageNo": 1
        }
      ]
    },
    {
      "num": 3,
      "title": "Continuity of Existing Requirements",
      "clauses": [
        {
          "id": "4",
          "text": "All other provisions of Circular dated June 15, 2022 and July 29, 2022 shall remain unchanged.",
          "obligations": [
            "Ensure compliance with previously issued nomination circulars continues unchanged"
          ],
          "actionables": [
            "Review existing nomination compliance framework",
            "Continue adherence to previous circular requirements",
            "Map unchanged provisions into current compliance checklist"
          ],
          "department": "Compliance",
          "risk": "Medium",
          "status": "Assigned",
          "pageNo": 1
        }
      ]
    }
  ],
  "amendments": []
}, 
// HDFC MAster Circular 
{
  "id": "SEBI-MF-2023-074",
  "title": "Master Circular for Mutual Funds",
  "regulator": "SEBI",
  "issuedDate": "2023-05-19",
  "effectiveDate": "2023-05-19",
  "type": "Master Circular",
  "status": "Active",
  "libraryStatus": "Assigned",
  "sebiEntities": [
  "Mutual Funds",
  "Asset Management Companies",
  "Trustee Companies / Boards of Trustees of Mutual Funds",
  "Registrars to an Issue and Share Transfer Agents",
  "Association of Mutual Funds in India",
  "Recognized Stock Exchanges & Clearing Corporations",
  "Stock Brokers",
  "Depositories",
  "Custodians"
],
  "docUrl": "./SEBI Master Circular for Mutual Funds.pdf",
  "departments": ["Compliance", "Risk", "Operations", "Legal"],
  "risk": "High",
  "complianceScore": 0,
  "summary": "Consolidated SEBI requirements for mutual funds covering offer documents, governance, risk management, disclosures, expenses and investor protection.",
  "chapters": [
    {
      "num": 1,
      "title": "Offer Document for Schemes",
      "clauses": [
        {
          "id": "1.1.1",
          "text": "The Offer Document shall have two parts i.e. Scheme Information Document (SID) and Statement of Additional Information (SAI).",
          "obligations": [
            "Ensure offer documents contain both SID and SAI"
          ],
          "actionables": [
            "Prepare SID for scheme-specific details",
            "Prepare SAI for statutory mutual fund information",
            "Review document completeness before filing"
          ],
          "department": "Compliance",
          "risk": "Medium",
          "status": "Assigned",
          "pageNo": 7
        },
        {
          "id": "1.1.3.1(a)",
          "text": "Draft SID of schemes of Mutual Funds filed with the Board shall also be available on SEBI's website for 21 working days from the date of filing.",
          "obligations": [
            "Ensure draft SID is available for public review"
          ],
          "actionables": [
            "File draft SID with SEBI",
            "Track 21 working day review timeline",
            "Address SEBI observations promptly"
          ],
          "department": "Compliance",
          "risk": "Medium",
          "status": "Assigned",
          "pageNo": 7
        }
      ]
    },
    {
      "num": 4,
      "title": "Risk Management Framework",
      "clauses": [
        {
          "id": "4.1",
          "text": "AMCs should have in place sound internal liquidity management tools for schemes.",
          "obligations": [
            "Ensure robust liquidity management framework exists"
          ],
          "actionables": [
            "Implement liquidity monitoring tools",
            "Conduct stress testing periodically",
            "Review liquidity risks across schemes"
          ],
          "department": "Risk",
          "risk": "High",
          "status": "Assigned",
          "pageNo": 18
        },
        {
          "id": "4.2",
          "text": "Restriction on redemption cannot be used as an ordinary tool in order to manage the liquidity of a scheme.",
          "obligations": [
            "Ensure redemption restrictions are used only in exceptional cases"
          ],
          "actionables": [
            "Define exceptional circumstances for redemption restrictions",
            "Obtain board approval before imposing restrictions",
            "Disclose restrictions to investors"
          ],
          "department": "Risk",
          "risk": "High",
          "status": "Assigned",
          "pageNo": 18
        }
      ]
    },
    {
      "num": 5,
      "title": "Disclosures & Reporting Norms",
      "clauses": [
        {
          "id": "5.1",
          "text": "SAI shall be updated within 3 months from end of financial year and filed with SEBI.",
          "obligations": [
            "Ensure periodic updation of SAI"
          ],
          "actionables": [
            "Review SAI annually",
            "Update material changes on ongoing basis",
            "File revised SAI with SEBI"
          ],
          "department": "Compliance",
          "risk": "Medium",
          "status": "Assigned",
          "pageNo": 8
        },
        {
          "id": "5.2",
          "text": "A copy of all changes made to the scheme shall be filed with SEBI within 7 days of the change.",
          "obligations": [
            "Ensure timely reporting of scheme changes to SEBI"
          ],
          "actionables": [
            "Track scheme modifications",
            "File changes within 7 days",
            "Maintain audit trail of submissions"
          ],
          "department": "Compliance",
          "risk": "High",
          "status": "Assigned",
          "pageNo": 11
        }
      ]
    },
    {
      "num": 6,
      "title": "Governance Norms",
      "clauses": [
        {
          "id": "6.1",
          "text": "The Board of the AMC and the Trustees shall exercise necessary due diligence ensuring that the SID/SAI are in conformity with the Mutual Funds Regulations.",
          "obligations": [
            "Ensure due diligence over SID and SAI"
          ],
          "actionables": [
            "Review SID and SAI before approval",
            "Verify compliance with SEBI regulations",
            "Document trustee approval"
          ],
          "department": "Legal",
          "risk": "High",
          "status": "Assigned",
          "pageNo": 7
        },
        {
          "id": "6.2",
          "text": "Any change at a later date in the benchmark index shall be recorded and reasonably justified.",
          "obligations": [
            "Ensure benchmark changes are documented and justified"
          ],
          "actionables": [
            "Review benchmark appropriateness periodically",
            "Document reasons for benchmark changes",
            "Obtain trustee approval for benchmark revisions"
          ],
          "department": "Risk",
          "risk": "Medium",
          "status": "Assigned",
          "pageNo": 13
        }
      ]
    },
    {
      "num": 10,
      "title": "Loads, Fees, Charges and Expenses",
      "clauses": [
        {
          "id": "10.1",
          "text": "Aggregate fees and expenses charged to the scheme form part of the fundamental attributes.",
          "obligations": [
            "Ensure fees and expenses are transparently disclosed"
          ],
          "actionables": [
            "Review scheme expense structure",
            "Disclose fees in SID and KIM",
            "Monitor changes in load structure"
          ],
          "department": "Finance",
          "risk": "High",
          "status": "Assigned",
          "pageNo": 20
        }
      ]
    },
    {
      "num": 14,
      "title": "Investor Rights & Obligations",
      "clauses": [
        {
          "id": "14.1",
          "text": "No redemption requests up to INR 2 lakh shall be subject to such restriction.",
          "obligations": [
            "Ensure investor redemption rights are protected"
          ],
          "actionables": [
            "Configure systems to exempt first INR 2 lakh",
            "Disclose restriction policy to investors",
            "Monitor compliance during liquidity events"
          ],
          "department": "Operations",
          "risk": "High",
          "status": "Assigned",
          "pageNo": 19
        }
      ]
    }
  ],
  "amendments": []
},
// HDFC Master Circykar 
{
  "id": "SEBI-2023-193",
  "title": "Extension of timelines for providing choice of nomination in eligible demat accounts and mutual fund folios",
  "regulator": "SEBI",
  "issuedDate": "2023-12-27",
  "effectiveDate": "2023-12-27",
  "type": "Circular",
  "status": "Active",
  "libraryStatus": "Assigned",
  "docUrl": "./2023-12-27 Extension of timelines for providing choice of nomination in eligible demat accounts and mutual fund folios.pdf",
  "departments": ["Compliance", "Operations", "Legal"],
  "risk": "High",
  "complianceScore": 0,
  "summary": "SEBI extended the deadline for submission of nomination for demat accounts and mutual fund folios and prescribed implementation, communication and compliance monitoring requirements.",
  
  "chapters": [
    {
      "num": 1,
      "title": "Nomination Timeline Extension and Compliance Requirements",
      "clauses": [
        {
          "id": "Para 2",
          "text": "Deadline for submission of choice of nomination extended to June 30, 2024.",
          "obligations": [
            "Ensure compliance with revised nomination deadline",
            "Align systems with extended timeline"
          ],
          "actionables": [
            "Update system deadline to June 30, 2024",
            "Communicate revised deadline internally",
            "Ensure no enforcement before revised date"
          ],
          "department": "Operations",
          "risk": "High",
          "status": "Assigned",
          "pageNo": 1
        },
        {
          "id": "Para 3",
          "text": "Entities shall encourage account holders to complete nomination by sending fortnightly email and SMS communication.",
          "obligations": [
            "Ensure periodic communication to non-compliant holders",
            "Provide guidance for nomination or opting out"
          ],
          "actionables": [
            "Identify non-compliant account holders",
            "Send fortnightly emails and SMS",
            "Include guidance for nomination process",
            "Track communication effectiveness"
          ],
          "department": "Compliance",
          "risk": "High",
          "status": "Assigned",
          "pageNo": 1
        },
        {
          "id": "Para 4(a)",
          "text": "Entities shall take necessary steps to implement provisions including amendments to bye-laws, rules and operational instructions.",
          "obligations": [
            "Ensure implementation of circular provisions",
            "Amend internal rules and operational frameworks"
          ],
          "actionables": [
            "Review existing rules and policies",
            "Amend bye-laws and operational instructions",
            "Document changes"
          ],
          "department": "Legal",
          "risk": "High",
          "status": "Assigned",
          "pageNo": 2
        },
        {
          "id": "Para 4(b)",
          "text": "Entities shall bring provisions of this circular to the notice of their constituents and disseminate it on their websites.",
          "obligations": [
            "Ensure communication of circular to stakeholders"
          ],
          "actionables": [
            "Publish circular on website",
            "Notify stakeholders and clients",
            "Maintain communication records"
          ],
          "department": "Compliance",
          "risk": "Medium",
          "status": "Assigned",
          "pageNo": 2
        },
        {
          "id": "Para 4(c)",
          "text": "Entities shall communicate to SEBI the status of implementation.",
          "obligations": [
            "Report implementation status to SEBI"
          ],
          "actionables": [
            "Prepare implementation status report",
            "Submit report to SEBI within timeline"
          ],
          "department": "Compliance",
          "risk": "High",
          "status": "Assigned",
          "pageNo": 2
        },
        {
          "id": "Para 4(d)",
          "text": "Entities shall monitor compliance of this circular.",
          "obligations": [
            "Ensure ongoing monitoring of compliance"
          ],
          "actionables": [
            "Set up compliance monitoring mechanism",
            "Track adherence periodically",
            "Escalate non-compliance"
          ],
          "department": "Risk",
          "risk": "High",
          "status": "Assigned",
          "pageNo": 2
        },
        {
          "id": "Para 5",
          "text": "All other provisions of earlier SEBI master circulars shall remain unchanged.",
          "obligations": [
            "Ensure continued compliance with existing master circular provisions"
          ],
          "actionables": [
            "Refer relevant SEBI master circulars",
            "Validate current processes against existing requirements"
          ],
          "department": "Compliance",
          "risk": "Medium",
          "status": "Assigned",
          "pageNo": 2
        }
      ]
    }
  ],

  "annexures": [],

  "amendments": [
    {
      "date": "2023-09-26",
      "version": "1.0",
      "description": "Initial extension of nomination deadline to December 31, 2023."
    },
    {
      "date": "2023-09-27",
      "version": "1.1",
      "description": "Extension of nomination timeline for mutual fund folios."
    }
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
              department: 'IT', risk: 'High', status: 'Assigned'
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
              department: 'Operations', risk: 'Medium', status: 'Assigned'
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
              department: 'Operations', risk: 'Medium', status: 'Assigned'
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
              department: 'Procurement', risk: 'High', status: 'Assigned'
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
              department: 'Compliance', risk: 'High', status: 'Assigned'
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
              department: 'Finance', risk: 'High', status: 'Assigned'
            },
            {
              id: 'HF-C2B.1',
              text: 'Loans extended to individuals for acquisition of land (site only) are not classified as housing loans and should not be included under the housing loan portfolio.',
              obligation: 'Segregate land-only loans from housing loan portfolio in MIS and reporting.',
              actionables: 'Audit existing portfolio; recategorise any land-only loans; update system classification.',
              department: 'Finance', risk: 'Medium', status: 'Assigned'
            },
            {
              id: 'HF-C2C.1',
              text: 'Loan-to-Value (LTV) ratio shall not exceed 90% for loans up to INR 30 lakhs, 80% for loans between INR 30–75 lakhs, and 75% for loans above INR 75 lakhs.',
              obligation: 'Enforce LTV ratio limits at origination and monitor at portfolio level.',
              actionables: 'Configure LTV validation in loan origination system; run portfolio-level LTV compliance report.',
              department: 'Risk', risk: 'High', status: 'Assigned'
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
              department: 'Risk', risk: 'High', status: 'Assigned'
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
              department: 'Compliance', risk: 'High', status: 'Assigned'
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
              department: 'Finance', risk: 'Medium', status: 'Assigned'
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
              department: 'Operations', risk: 'Medium', status: 'Assigned'
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
              department: 'Compliance', risk: 'High', status: 'Assigned'
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
              department: 'Operations', risk: 'Medium', status: 'Assigned'
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
              department: 'Legal', risk: 'High', status: 'Assigned'
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
              department: 'Risk', risk: 'High', status: 'Assigned'
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
              department: 'Compliance', risk: 'High', status: 'Assigned'
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
              department: 'Legal', risk: 'Medium', status: 'Assigned'
            }
          ]
        }
      ],
      amendments: [
        { date: '2024-04-02', version: '1.0', description: 'Initial issuance consolidating all RBI housing finance guidelines up to March 31, 2024.' },
        { date: '2024-06-15', version: 'Withdrawn', description: 'Circular withdrawn by RBI. Superseded by updated Master Circular issued subsequently.' }
      ]
    },
     {
      "id": "RBI-HF-2024-001",
      "title": "Master Circular on Housing Finance",
      "regulator": "RBI",
      "issuedDate": "2024-04-02",
      "effectiveDate": "2024-04-02",
      "dueDate": "2024-12-31",
      "type": "Master",
      "status": "Active",
      "libraryStatus": "Reviewed & Applicable",
      "docUrl": "./RBI Master Circular.pdf",
      "departments": ["Credit", "Risk", "Operations"],
      "risk": "High",
      "complianceScore": 70,
      "summary": "The Master Circular on Housing Finance consolidates RBI guidelines for banks on housing loans.",
      "chapters": [
        {
          "num": 2,
          "title": "Housing Loan Regulations",
          "clauses": [
            {
              "id": "C2.1",
              "text": "Banks may grant loans for purchase, construction, repair, and improvement of housing units.",
              "obligations": [
                "Ensure loans are sanctioned only for eligible housing purposes.",
                "Ensure internal policy clearly defines permissible loan categories.",
                "Ensure end-use of funds aligns with approved housing purpose."
              ],
              "actionables": [
                "Define eligible housing loan categories in credit policy.",
                "Implement purpose validation in loan origination system (LOS).",
                "Conduct post-disbursement end-use verification."
              ],
              "department": "Credit",
              "risk": "High",
              "status": "Assigned",
              "pageNo": 4
            },
            {
              "id": "C2.2",
              "text": "Loans shall not be granted for speculative real estate activities or unauthorized constructions.",
              "obligations": [
                "Restrict financing to authorized and legally compliant properties.",
                "Ensure no exposure to speculative real estate activities.",
                "Ensure property approvals and legal clearances are verified."
              ],
              "actionables": [
                "Perform legal due diligence including title verification.",
                "Verify sanctioned building plans and approvals.",
                "Implement negative list for speculative projects."
              ],
              "department": "Risk",
              "risk": "High",
              "status": "Assigned"
            },
            {
              "id": "C2.3",
              "text": "Banks must ensure borrower compliance with sanctioned plans and obtain necessary certificates.",
              "obligations": [
                "Ensure sanctioned building plan is obtained before loan approval.",
                "Obtain borrower undertaking for adherence to sanctioned plan.",
                "Ensure architect certification during construction stages.",
                "Ensure completion certificate is obtained post construction."
              ],
              "actionables": [
                "Include sanctioned plan in documentation checklist.",
                "Collect borrower affidavit for compliance.",
                "Empanel architects for stage-wise certification.",
                "Track and obtain completion certificate within defined timeline."
              ],
              "department": "Operations",
              "risk": "Medium",
              "status": "Unassigned"
            }
          ],
          "sections": [
            {
              "id": "Section 1",
              "text": "Eligible Housing Finance Activities",
              "clauses": ["C2.1"]
            },
            {
              "id": "Section 2",
              "text": "Restrictions and Compliance",
              "clauses": ["C2.2", "C2.3"]
            }
          ]
        },
        {
          "num": 3,
          "title": "Loan Exposure and Risk Management",
          "clauses": [
            {
              "id": "C3.1",
              "text": "Banks must adhere to prescribed Loan-to-Value (LTV) ratios and risk weights.",
              "obligations": [
                "Ensure LTV ratios are within RBI prescribed limits.",
                "Ensure risk weights are applied as per regulatory norms.",
                "Ensure property valuation excludes ineligible components."
              ],
              "actionables": [
                "Configure LOS to auto-calculate LTV.",
                "Implement system validation to restrict breaches.",
                "Update valuation policy excluding stamp duty where applicable."
              ],
              "department": "Risk",
              "risk": "High",
              "status": "Unassigned"
            },
            {
              "id": "C3.2",
              "text": "Banks must frame board-approved policies on real estate exposure limits.",
              "obligations": [
                "Establish board-approved exposure limits for housing sector.",
                "Ensure periodic review of exposure policies.",
                "Ensure compliance with prudential norms."
              ],
              "actionables": [
                "Draft exposure policy and present to Board.",
                "Set exposure thresholds in risk systems.",
                "Conduct periodic policy review and update."
              ],
              "department": "Risk",
              "risk": "High",
              "status": "Unassigned"
            }
          ]
        },
        {
          "num": 4,
          "title": "Disbursement and Product Guidelines",
          "clauses": [
            {
              "id": "C4.1",
              "text": "Loan disbursement must be linked to stages of construction.",
              "obligations": [
                "Ensure disbursement is linked to construction progress.",
                "Avoid upfront disbursement in under-construction projects.",
                "Ensure inspection before each disbursement."
              ],
              "actionables": [
                "Define stage-wise disbursement matrix.",
                "Link disbursement to inspection approval.",
                "Restrict bulk disbursement in LOS."
              ],
              "department": "Operations",
              "risk": "High",
              "status": "Assigned"
            },
            {
              "id": "C4.2",
              "text": "Banks must ensure customers are informed of risks in innovative loan products.",
              "obligations": [
                "Ensure transparency in loan product features.",
                "Ensure customers are informed of associated risks.",
                "Ensure suitability of loan products for borrowers."
              ],
              "actionables": [
                "Update product disclosure documents.",
                "Implement customer acknowledgment process.",
                "Train staff on product suitability assessment."
              ],
              "department": "Compliance",
              "risk": "Medium",
              "status": "Assigned"
            }
          ]
        },
        {
          "num": 5,
          "title": "Regulatory Compliance and Fair Practices",
          "clauses": [
            {
              "id": "C5.1",
              "text": "Banks must comply with RBI directions on interest rates and EMI reset.",
              "obligations": [
                "Ensure compliance with RBI interest rate guidelines.",
                "Ensure proper implementation of EMI reset norms.",
                "Ensure transparency in interest rate changes."
              ],
              "actionables": [
                "Align loan systems with RBI rate guidelines.",
                "Automate EMI reset calculations.",
                "Notify customers of rate changes."
              ],
              "department": "Finance",
              "risk": "Medium",
              "status": "Assigned"
            },
            {
              "id": "C5.2",
              "text": "Disclosure of mortgage details by builders must be ensured.",
              "obligations": [
                "Ensure builder discloses mortgage details to buyers.",
                "Ensure disclosure in project marketing materials.",
                "Restrict funding where disclosure is absent."
              ],
              "actionables": [
                "Include disclosure clause in agreements.",
                "Verify builder disclosures before disbursement.",
                "Maintain disclosure records."
              ],
              "department": "Legal",
              "risk": "Medium",
              "status": "Assigned"
            },
            {
              "id": "C5.3",
              "text": "Banks must follow fair lending practices including penal charges and document release.",
              "obligations": [
                "Ensure compliance with RBI fair lending guidelines.",
                "Ensure transparency in penal charges.",
                "Ensure timely release of property documents.",
                "Ensure customer protection standards are followed."
              ],
              "actionables": [
                "Update fair lending policy.",
                "Disclose penal charges clearly.",
                "Define document release timelines.",
                "Monitor customer complaints and grievances."
              ],
              "department": "Compliance",
              "risk": "High",
              "status": "Assigned"
            }
          ]
        }
      ],
      "amendments": [
        {
          "date": "2023-08-18",
          "version": "1.1",
          "description": "Guidelines on penal charges and EMI reset incorporated."
        },
        {
          "date": "2023-09-13",
          "version": "1.2",
          "description": "Responsible lending conduct guidelines added."
        }
      ]
    },
  ],

  /* =============================================================
     TASKS
     ============================================================= */
  // tasks: [
  //   {
  //     id: 'ACT-001',
  //     obligationId: 'OB-001',
  //     title: 'Establish Board Cybersecurity Committee',
  //     circularId: 'CIRC-2024-001',
  //     clauseRef: 'C1.1',
  //     department: 'IT',
  //     dueDate: '2024-06-15',
  //     priority: 'High',
  //     risk: 'High',
  //     status: 'Complete',
  //     assignee: 'Ravi Sharma'
  //   },
  //   {
  //     id: 'ACT-002',
  //     obligationId: 'OB-002',
  //     title: 'Appoint CISO – Credentials Verification',
  //     circularId: 'CIRC-2024-001',
  //     clauseRef: 'C1.2',
  //     department: 'HR',
  //     dueDate: '2024-05-30',
  //     priority: 'High',
  //     risk: 'High',
  //     status: 'Complete',
  //     assignee: 'Priya Nair'
  //   },
  //   {
  //     id: 'ACT-003',
  //     obligationId: 'OB-003',
  //     title: 'Annual Cybersecurity Risk Assessment – Q2',
  //     circularId: 'CIRC-2024-001',
  //     clauseRef: 'C2.1',
  //     department: 'Risk',
  //     dueDate: '2024-06-30',
  //     priority: 'High',
  //     risk: 'High',
  //     status: 'Open',
  //     assignee: 'Anand Krishnan'
  //   },
  //   {
  //     id: 'ACT-004',
  //     obligationId: 'OB-004',
  //     title: 'Implement SIEM for Cyber Incident Detection',
  //     circularId: 'CIRC-2024-001',
  //     clauseRef: 'C3.1',
  //     department: 'IT',
  //     dueDate: '2024-05-15',
  //     priority: 'Critical',
  //     risk: 'High',
  //     status: 'Open',
  //     assignee: 'Vikram Singh'
  //   },
  //   {
  //     id: 'ACT-005',
  //     obligationId: 'OB-005',
  //     title: 'Update Transaction Monitoring Thresholds',
  //     circularId: 'CIRC-2024-002',
  //     clauseRef: 'C1.1',
  //     department: 'Compliance',
  //     dueDate: '2024-07-15',
  //     priority: 'High',
  //     risk: 'High',
  //     status: 'Open',
  //     assignee: 'Meera Pillai'
  //   },
  //   {
  //     id: 'ACT-006',
  //     obligationId: 'OB-006',
  //     title: 'PEP Screening API Integration',
  //     circularId: 'CIRC-2024-002',
  //     clauseRef: 'C2.1',
  //     department: 'IT',
  //     dueDate: '2024-08-01',
  //     priority: 'High',
  //     risk: 'High',
  //     status: 'Closed',
  //     assignee: 'Karthik Reddy'
  //   },
  //   {
  //     id: 'ACT-007',
  //     obligationId: 'OB-007',
  //     title: 'Cloud Data Migration – Sensitive PII',
  //     circularId: 'CIRC-2024-003',
  //     clauseRef: 'C1.1',
  //     department: 'IT',
  //     dueDate: '2024-09-30',
  //     priority: 'Medium',
  //     risk: 'Medium',
  //     status: 'Closed',
  //     assignee: 'Sunita Bhatt'
  //   },
  //   {
  //     id: 'ACT-008',
  //     obligationId: 'OB-008',
  //     title: 'ESG Scope 1 & 2 Emissions Measurement',
  //     circularId: 'CIRC-2024-004',
  //     clauseRef: 'C1.1',
  //     department: 'Operations',
  //     dueDate: '2024-10-31',
  //     priority: 'Medium',
  //     risk: 'Medium',
  //     status: 'Open',
  //     assignee: 'Deepak Mehta'
  //   },
  //   {
  //     id: 'ACT-009',
  //     obligationId: 'OB-009',
  //     title: 'Vendor Classification Matrix Development',
  //     circularId: 'CIRC-2024-005',
  //     clauseRef: 'C1.1',
  //     department: 'Procurement',
  //     dueDate: '2024-07-31',
  //     priority: 'High',
  //     risk: 'High',
  //     status: 'Complete',
  //     assignee: 'Pooja Agarwal'
  //   },
  //   {
  //     id: 'ACT-010',
  //     obligationId: 'OB-0010',
  //     title: 'Quarterly Risk Register Review – Q2',
  //     circularId: 'CIRC-2024-001',
  //     clauseRef: 'C2.2',
  //     department: 'Risk',
  //     dueDate: '2024-06-30',
  //     priority: 'Medium',
  //     risk: 'Medium',
  //     status: 'Assigned',
  //     assignee: 'Anand Krishnan'
  //   },
  //   {
  //     id: 'ACT-011',
  //     obligationId: 'OB-011',
  //     title: 'EDD Training for Compliance Officers',
  //     circularId: 'CIRC-2024-002',
  //     clauseRef: 'C1.1',
  //     department: 'Compliance',
  //     dueDate: '2024-05-20',
  //     priority: 'Medium',
  //     risk: 'Medium',
  //     status: 'Assigned',
  //     assignee: 'Meera Pillai'
  //   },
  //   {
  //     id: 'ACT-012',
  //     obligationId: 'OB-0012',
  //     title: 'Legal Review – Updated Vendor Contracts',
  //     circularId: 'CIRC-2024-005',
  //     clauseRef: 'C1.1',
  //     department: 'Legal',
  //     dueDate: '2024-09-15',
  //     priority: 'Low',
  //     risk: 'Low',
  //     status: 'Assigned',
  //     assignee: 'Suresh Iyer'
  //   },
  //   {
  //     id: 'ACT-013',
  //     obligationId: 'OB-013',
  //     title: 'Housing Finance Policy Gap Analysis',
  //     circularId: 'CIRC-2024-HF-001',
  //     clauseRef: 'HF-C1.1',
  //     department: 'Compliance',
  //     dueDate: '2024-05-15',
  //     priority: 'High',
  //     risk: 'High',
  //     status: 'Assigned',
  //     assignee: 'Meera Pillai'
  //   },
  //   {
  //     id: 'ACT-014',
  //     obligationId: 'OB-014',
  //     title: 'Update Loan Origination Policy – Eligible Purposes (Sec 2A)',
  //     circularId: 'CIRC-2024-HF-001',
  //     clauseRef: 'HF-C2A.1',
  //     department: 'Finance',
  //     dueDate: '2024-06-30',
  //     priority: 'High',
  //     risk: 'High',
  //     status: 'Assigned',
  //     assignee: 'Ravi Sharma'
  //   },
  //   {
  //     id: 'ACT-015',
  //     obligationId: 'OB-015',
  //     title: 'Portfolio Audit – Segregate Land-Only Loans (Sec 2B)',
  //     circularId: 'CIRC-2024-HF-001',
  //     clauseRef: 'HF-C2B.1',
  //     department: 'Finance',
  //     dueDate: '2024-07-15',
  //     priority: 'Medium',
  //     risk: 'Medium',
  //     status: 'Assigned',
  //     assignee: 'Anand Krishnan'
  //   },
  //   {
  //     id: 'ACT-016',
  //     obligationId: 'OB-016',
  //     title: 'LTV Ratio Validation – Loan Origination System (Sec 2C)',
  //     circularId: 'CIRC-2024-HF-001',
  //     clauseRef: 'HF-C2C.1',
  //     department: 'Risk',
  //     dueDate: '2024-06-15',
  //     priority: 'High',
  //     risk: 'High',
  //     status: 'Assigned',
  //     assignee: 'Vikram Singh'
  //   },
  //   {
  //     id: 'ACT-017',
  //     obligationId: 'OB-017',
  //     title: 'Update Risk Weights in CBS – Capital Adequacy (Sec 3)',
  //     circularId: 'CIRC-2024-HF-001',
  //     clauseRef: 'HF-C3.1',
  //     department: 'Risk',
  //     dueDate: '2024-06-30',
  //     priority: 'High',
  //     risk: 'High',
  //     status: 'Assigned',
  //     assignee: 'Anand Krishnan'
  //   },
  //   {
  //     id: 'ACT-018',
  //     obligationId: 'OB-018',
  //     title: 'PSL Classification Rules Update – Housing Loans (Sec 4)',
  //     circularId: 'CIRC-2024-HF-001',
  //     clauseRef: 'HF-C4.1',
  //     department: 'Compliance',
  //     dueDate: '2024-07-31',
  //     priority: 'High',
  //     risk: 'High',
  //     status: 'Assigned',
  //     assignee: 'Meera Pillai'
  //   },
  //   {
  //     id: 'ACT-019',
  //     obligationId: 'OB-019',
  //     title: 'Migrate MCLR-Linked Housing Loans to Repo Rate (Sec 5)',
  //     circularId: 'CIRC-2024-HF-001',
  //     clauseRef: 'HF-C5.1',
  //     department: 'Finance',
  //     dueDate: '2024-08-31',
  //     priority: 'High',
  //     risk: 'Medium',
  //     status: 'Assigned',
  //     assignee: 'Priya Nair'
  //   },
  //   {
  //     id: 'ACT-020',
  //     obligationId: 'OB-020',
  //     title: 'Configure EMI Cap and Tenor Limit in LOS (Sec 6)',
  //     circularId: 'CIRC-2024-HF-001',
  //     clauseRef: 'HF-C6.1',
  //     department: 'Operations',
  //     dueDate: '2024-07-15',
  //     priority: 'Medium',
  //     risk: 'Medium',
  //     status: 'Assigned',
  //     assignee: 'Sunita Bhatt'
  //   },
  //   {
  //     id: 'ACT-021',
  //     obligationId: 'OB-021',
  //     title: 'Design and Deploy Key Fact Statement – KFS (Sec 7)',
  //     circularId: 'CIRC-2024-HF-001',
  //     clauseRef: 'HF-C7.1',
  //     department: 'Compliance',
  //     dueDate: '2024-06-30',
  //     priority: 'High',
  //     risk: 'High',
  //     status: 'Assigned',
  //     assignee: 'Karthik Reddy'
  //   },
  //   {
  //     id: 'ACT-022',
  //     obligationId: 'OB-022',
  //     title: 'Set Up NHB Refinance Quarterly Reporting (Sec 8)',
  //     circularId: 'CIRC-2024-HF-001',
  //     clauseRef: 'HF-C8.1',
  //     department: 'Operations',
  //     dueDate: '2024-07-31',
  //     priority: 'Medium',
  //     risk: 'Medium',
  //     status: 'Assigned',
  //     assignee: 'Deepak Mehta'
  //   },
  //   {
  //     id: 'ACT-023',
  //     obligationId: 'OB-023',
  //     title: 'Remove Foreclosure Charges – Floating Rate Loans (Sec 9)',
  //     circularId: 'CIRC-2024-HF-001',
  //     clauseRef: 'HF-C9.1',
  //     department: 'Legal',
  //     dueDate: '2024-06-15',
  //     priority: 'High',
  //     risk: 'High',
  //     status: 'Unassigned',
  //     assignee: 'Suresh Iyer'
  //   },
  //   {
  //     id: 'ACT-024',
  //     obligationId: 'OB-024',
  //     title: 'Board Approval – Housing Finance Policy (Sec 10)',
  //     circularId: 'CIRC-2024-HF-001',
  //     clauseRef: 'HF-C10.1',
  //     department: 'Risk',
  //     dueDate: '2024-08-15',
  //     priority: 'High',
  //     risk: 'High',
  //     status: 'Assigned',
  //     assignee: 'Pooja Agarwal'
  //   },
  //   {
  //     id: 'ACT-025',
  //     obligationId: 'OB-025',
  //     title: 'Half-Yearly RBI Housing Loan Portfolio Return (Sec 11)',
  //     circularId: 'CIRC-2024-HF-001',
  //     clauseRef: 'HF-C11.1',
  //     department: 'Compliance',
  //     dueDate: '2024-07-21',
  //     priority: 'High',
  //     risk: 'High',
  //     status: 'Assigned',
  //     assignee: 'Meera Pillai'
  //   },
  //   {
  //     id: 'ACT-026',
  //     obligationId: 'OB-026',
  //     title: 'Reclassify Builder Finance Loans – Credit Policy Update (Sec 12)',
  //     circularId: 'CIRC-2024-HF-001',
  //     clauseRef: 'HF-C12.1',
  //     department: 'Legal',
  //     dueDate: '2024-08-31',
  //     priority: 'Medium',
  //     risk: 'Medium',
  //     status: 'Unassigned',
  //     assignee: 'Suresh Iyer'
  //   }
  // ],
  tasks: [
  {
  id: 'ACT-111-001',
  obligationId: 'OB-111-001',
  title: 'Ensure all digital platforms comply with accessibility standards under RPwD Act',
  circularId: 'SEBI-ITD-2025-111',
  clauseRef: '5(1)',
  department: 'Digital',
  dueDate: '2025-08-31',
  priority: 'High',
  risk: 'High',
  status: 'Assigned',
  assignee: 'Harish',
  assigneeStatus:"Open",
  activities: [
    {
      id: 'SUB-111-001',
      name: 'Identify all investor-facing web platforms',
      dueDate: '2025-08-20',
      status: 'Assigned',
      assigneeStatus:"Open"
    },
    {
      id: 'SUB-111-002',
      name: 'Prepare platform inventory sheet',
      dueDate: '2025-08-25',
      status: 'Assigned',
      assigneeStatus:"Open"
    },
    {
      id: 'SUB-111-003',
      name: 'Validate inventory with Digital team',
      dueDate: '2025-08-28',
      status: 'Assigned',
      assigneeStatus:"Open"
    }
  ]
},
  {
  id: 'ACT-111-002',
  obligationId: 'OB-111-002',
  title: 'Provide accessible information and communication technology to persons with disabilities',
  circularId: 'SEBI-ITD-2025-111',
  clauseRef: '5(1)',
  department: 'Compliance',
  dueDate: '2025-08-31',
  priority: 'High',
  risk: 'High',
  status: 'Assigned',
  assignee: 'Meera Pillai',
  assigneeStatus:"Open",
  activities: [
    {
      id: 'SUB-111-004',
      name: 'Ensure content is available in accessible formats',
      dueDate: '2025-08-20',
      status: 'Assigned',
      assigneeStatus:"Closed"

    },
    {
      id: 'SUB-111-005',
      name: 'Draft action taken report',
      dueDate: '2025-08-25',
      status: 'Assigned',
      assigneeStatus:"Closed"
    },
    {
      id: 'SUB-111-006',
      name: 'Submit report to SEBI',
      dueDate: '2025-08-30',
      status: 'Assigned',
      assigneeStatus:"Closed"
    }
  ]
},
{
  id: 'ACT-111-003',
  obligationId: 'OB-111-003',
  title: 'Ensure website follows Government website accessibility guidelines',
  circularId: 'SEBI-ITD-2025-111',
  clauseRef: '5(2)',
  department: 'Compliance',
  dueDate: '2025-09-14',
  priority: 'High',
  risk: 'High',
  status: 'Assigned',
  assignee: 'Harish',
  assigneeStatus:"Open",
  activities: [
    {
      id: 'SUB-111-007',
      name: 'Ensure timely submission of it',
      dueDate: '2025-08-30',
      status: 'Assigned',
      assigneeStatus:"Open"
    },
    {
      id: 'SUB-111-008',
      name: 'Evaluate auditor credentials',
      dueDate: '2025-09-05',
      status: 'Assigned',
      assigneeStatus:"Open"
    },
    {
      id: 'SUB-111-009',
      name: 'Finalize and onboard auditor',
      dueDate: '2025-09-10',
      status: 'Assigned',
      assigneeStatus:"Open"
    }
  ]
},
{
  id: 'ACT-111-004',
  obligationId: 'OB-111-004',
  title: 'Submit compliance report within one month',
  circularId: 'SEBI-ITD-2025-111',
  clauseRef: '5(3)',
  department: 'IT',
  dueDate: '2025-10-31',
  priority: 'Critical',
  risk: 'High',
  status: 'Assigned',
  assignee: 'Sandip',
  assigneeStatus:"Open",
  activities: [
    {
      id: 'SUB-111-010',
      name: 'Schedule audit sessions',
      dueDate: '2025-10-05',
      status: 'Assigned',
      assigneeStatus:"Open"
    },
    {
      id: 'SUB-111-011',
      name: 'Audit website and mobile app',
      dueDate: '2025-10-15',
      status: 'Assigned',
      assigneeStatus:"Open"
    },
    {
      id: 'SUB-111-012',
      name: 'Prepare audit findings report',
      dueDate: '2025-10-25',
      status: 'Assigned',
      assigneeStatus:"Open"
    }
  ]
},
{
  id: 'ACT-111-005',
  obligationId: 'OB-111-005',
  title: 'Ensure ICT systems comply with IS 17802 accessibility requirement',
  circularId: 'SEBI-ITD-2025-111',
  clauseRef: '5(4)',
  department: 'IT',
  dueDate: '2026-01-31',
  priority: 'Critical',
  risk: 'High',
  status: 'Assigned',
  assignee: 'Sandip',
  activities: [
    {
      id: 'SUB-111-013',
      name: 'Categorize audit findings by severity',
      dueDate: '2025-11-10',
      status: 'Assigned'
    },
    {
      id: 'SUB-111-014',
      name: 'Implement accessibility fixes',
      dueDate: '2025-12-20',
      status: 'Assigned'
    },
    {
      id: 'SUB-111-015',
      name: 'Retest remediated platforms',
      dueDate: '2026-01-20',
      status: 'Assigned'
    }
  ]
},
{
  id: 'ACT-111-006',
  obligationId: 'OB-111-006',
  title: 'Nominate Nodal Officer for Digital Accessibility Compliance',
  circularId: 'SEBI-ITD-2025-111',
  clauseRef: '1.1',
  department: 'Compliance',
  dueDate: '2025-08-15',
  priority: 'High',
  risk: 'Medium',
  status: 'Assigned',
  assignee: 'Harish',
  activities: [
    {
      id: 'SUB-111-016',
      name: 'Identify nodal officer candidates',
      dueDate: '2025-08-05',
      status: 'Assigned'
    },
    {
      id: 'SUB-111-017',
      name: 'Obtain leadership approval',
      dueDate: '2025-08-10',
      status: 'Assigned'
    },
    {
      id: 'SUB-111-018',
      name: 'Issue nomination communication',
      dueDate: '2025-08-13',
      status: 'Assigned'
    }
  ]
},
  // {
  //   id: 'ACT-111-007',
  //   obligationId: 'OB-111-007',
  //   title: 'Obtain MD Approval for Accessibility Compliance Framework',
  //   circularId: 'SEBI-ITD-2025-111',
  //   clauseRef: '1.1',
  //   department: 'Compliance',
  //   dueDate: '2025-08-20',
  //   priority: 'High',
  //   risk: 'High',
  //   status: 'Assigned',
  //   assignee: 'MD Office'
  // },
  // {
  //   id: 'ACT-111-008',
  //   obligationId: 'OB-111-008',
  //   title: 'Implement Accessibility Grievance Redressal Mechanism',
  //   circularId: 'SEBI-ITD-2025-111',
  //   clauseRef: '1.3',
  //   department: 'Customer Service',
  //   dueDate: '2025-09-30',
  //   priority: 'High',
  //   risk: 'High',
  //   status: 'Assigned',
  //   assignee: 'Priya Nair'
  // },
  // {
  //   id: 'ACT-111-009',
  //   obligationId: 'OB-111-009',
  //   title: 'Update Website and Mobile App with ISL Videos, Captions and Alt Text',
  //   circularId: 'SEBI-ITD-2025-111',
  //   clauseRef: '2.1',
  //   department: 'Digital',
  //   dueDate: '2025-11-15',
  //   priority: 'High',
  //   risk: 'High',
  //   status: 'Assigned',
  //   assignee: 'Sandip'
  // },
  // {
  //   id: 'ACT-111-010',
  //   obligationId: 'OB-111-010',
  //   title: 'Convert Investor Documents to Tagged PDF and OCR-Based Accessible Format',
  //   circularId: 'SEBI-ITD-2025-111',
  //   clauseRef: '2.2',
  //   department: 'Legal',
  //   dueDate: '2025-11-30',
  //   priority: 'High',
  //   risk: 'High',
  //   status: 'Assigned',
  //   assignee: 'Suresh Iyer'
  // },
  // {
  //   id: 'ACT-111-011',
  //   obligationId: 'OB-111-011',
  //   title: 'Conduct Internal Training on Accessible Document Uploads',
  //   circularId: 'SEBI-ITD-2025-111',
  //   clauseRef: '3.1',
  //   department: 'HR',
  //   dueDate: '2025-10-15',
  //   priority: 'Medium',
  //   risk: 'Medium',
  //   status: 'Assigned',
  //   assignee: 'Sandip'
  // },
  // {
  //   id: 'ACT-111-012',
  //   obligationId: 'OB-111-012',
  //   title: 'Update Digital KYC Journey for PwD Users',
  //   circularId: 'SEBI-ITD-2025-111',
  //   clauseRef: '4.1',
  //   department: 'Operations',
  //   dueDate: '2025-11-15',
  //   priority: 'High',
  //   risk: 'High',
  //   status: 'Assigned',
  //   assignee: 'Karthik Reddy'
  // },
  // {
  //   id: 'ACT-111-013',
  //   obligationId: 'OB-111-013',
  //   title: 'Modify Client Registration Forms to Capture Disability Status',
  //   circularId: 'SEBI-ITD-2025-111',
  //   clauseRef: '4.2',
  //   department: 'Operations',
  //   dueDate: '2025-11-30',
  //   priority: 'High',
  //   risk: 'Medium',
  //   status: 'Assigned',
  //   assignee: 'Sunita Bhatt'
  // },
  {
  id: 'ACT-111-014',
  obligationId: 'OB-111-014',
  title: 'Submit Annual Accessibility Compliance Report to SEBI',
  circularId: 'SEBI-ITD-2025-111',
  clauseRef: '6',
  department: 'Compliance',
  dueDate: '2026-04-30',
  priority: 'High',
  risk: 'High',
  status: 'Assigned',
  assignee: 'Meera Pillai',
  activities: [
    {
      id: 'SUB-111-043',
      name: 'Collect annual accessibility metrics',
      dueDate: '2026-04-10',
      status: 'Assigned'
    },
    {
      id: 'SUB-111-044',
      name: 'Prepare annual compliance report',
      dueDate: '2026-04-20',
      status: 'Assigned'
    },
    {
      id: 'SUB-111-045',
      name: 'Submit final report to SEBI',
      dueDate: '2026-04-28',
      status: 'Assigned'
    }
  ]
},
  {
  id: 'ACT-111-015',
  obligationId: 'OB-111-015',
  title: 'Submit Annual Accessibility Compliance Report to SEBI',
  circularId: 'SEBI-ITD-2025-111',
  clauseRef: '6',
  department: 'Compliance',
  dueDate: '2026-04-30',
  priority: 'High',
  risk: 'High',
  status: 'Assigned',
  assignee: 'Meera Pillai',
  activities: [
    {
      id: 'SUB-111-043',
      name: 'Collect annual accessibility metrics',
      dueDate: '2026-04-10',
      status: 'Assigned'
    },
    {
      id: 'SUB-111-044',
      name: 'Prepare annual compliance report',
      dueDate: '2026-04-20',
      status: 'Assigned'
    },
    {
      id: 'SUB-111-045',
      name: 'Submit final report to SEBI',
      dueDate: '2026-04-28',
      status: 'Assigned'
    }
  ]
}
],



  /* =============================================================
     NOTIFICATIONS
     ============================================================= */
  notifications: [
    {
      id: 'N1',
      title: 'Task Assigned: SIEM Implementation',
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
      status: 'Assigned',
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
spocProfiles: [
  {
    id: 'spoc-001',
    name: 'Priya Sharma',
    initials: 'PS',
    email: 'priya@cms.co.in',
    /* single branch */
    branch: 'Bangalore',
    branchCode: 'BLR',
    /* multi-branch support — add branches array */
    branches: ['Bangalore'],
    departments: ['IT', 'Risk', 'Compliance'],
    color: '#eef2ff',
    textColor: '#4338ca'
  },
  {
    id: 'spoc-002',
    name: 'Arjun Shah',
    initials: 'AS',
    email: 'arjun@cms.co.in',
    branch: 'Mumbai',
    branchCode: 'MUM',
    /* example: Arjun covers both Mumbai and Pune */
    branches: ['Mumbai', 'Pune'],
    departments: ['Legal', 'Finance', 'Operations'],
    color: '#f5f3ff',
    textColor: '#6d28d9'
  },
],

spocObligations: [
  /* Bangalore branch — IT, Risk, Compliance */
  { id:'OB-3(a)', title:'Ensure all digital platforms comply with accessibility standards under RPwD Act',action:"Identify all digital platforms such as website, mobile app, investor portal and WhatsApp-based servicing", department:'IT', assignee:'Raj Iyer', approver:'Vikram Nair', status:'In Progress', dueDate:'2025-06-30', risk:'High', circular:'CIRC-001', branch:'Bangalore', _workflowState:'' },
  { id:'OB-3(a)', title:'Ensure all digital platforms comply with accessibility standards under RPwD Act',action:'Review whether distributor platforms such as Groww, PhonePe and Upstox are covered', department:'IT', assignee:'Raj Iyer', approver:'Vikram Nair', status:'In Progress', dueDate:'2025-06-30', risk:'High', circular:'CIRC-001', branch:'Bangalore', _workflowState:'' },
  { id:'OB-3(a)', title:'Ensure all digital platforms comply with accessibility standards under RPwD Act',action:'Map all digital channels against Section 40 accessibility requirements',action:"Identify all digital platforms such as website, mobile app, investor portal and WhatsApp-based servicing", department:'IT', assignee:'Raj Iyer', approver:'Vikram Nair', status:'In Progress', dueDate:'2025-06-30', risk:'High', circular:'CIRC-001', branch:'Bangalore', _workflowState:'' },
  { id:'OB-3(b)', title:'Provide accessible information and communication technology to persons with disabilities', action:"Ensure content is available in accessible formats",department:'IT', assignee:'Anand Kumar', approver:'Vikram Nair', status:'In Progress', dueDate:'2025-05-15', risk:'High', circular:'CIRC-001', branch:'Bangalore', _workflowState:'' },
  { id:'OB-3(b)', title:'Provide accessible information and communication technology to persons with disabilities', action:"Provide sign language interpretation, audio description and closed captioning",department:'IT', assignee:'Anand Kumar', approver:'Vikram Nair', status:'In Progress', dueDate:'2025-05-15', risk:'High', circular:'CIRC-001', branch:'Bangalore', _workflowState:'' },
  { id:'OB-3(b)', title:'Provide accessible information and communication technology to persons with disabilities', action:"Review all website and mobile content for hearing and visual accessibility",department:'IT', assignee:'Anand Kumar', approver:'Vikram Nair', status:'In Progress', dueDate:'2025-05-15', risk:'High', circular:'CIRC-001', branch:'Bangalore', _workflowState:'' },
  { id:'OB-3(d)', title:'Ensure websites and uploaded documents comply with accessibility standards',action:"Ensure website follows Government website accessibility guidelines", department:'IT', assignee:'Sneha Mehta', approver:'Vikram Nair', status:'Overdue', dueDate:'2025-04-01', risk:'Medium', circular:'CIRC-002', branch:'Bangalore', _workflowState:'' },
  { id:'OB-3(d)', title:'Ensure websites and uploaded documents comply with accessibility standards',department:'IT', assignee:'Sneha Mehta', action:"Publish documents in OCR-based PDF or ePUB format",approver:'Vikram Nair', status:'Overdue', dueDate:'2025-04-01', risk:'Medium', circular:'CIRC-002', branch:'Bangalore', _workflowState:'' },
  { id:'OB-3(d)', title:'Ensure websites and uploaded documents comply with accessibility standards',department:'IT', assignee:'Sneha Mehta', action:"Review all uploaded documents for accessibility before publishing",approver:'Vikram Nair', status:'Overdue', dueDate:'2025-04-01', risk:'Medium', circular:'CIRC-002', branch:'Bangalore', _workflowState:'' },
  { id:'OB-OB-004', title:'Ensure ICT systems comply with IS 17802 accessibility requirements',action:"Review all uploaded documents for accessibility before publishing", department:'IT', assignee:'Rahul Verma', approver:'Anita Singh', status:'In Progress', dueDate:'2025-07-15', risk:'High', circular:'CIRC-003', branch:'Bangalore', _workflowState:'' },
  { id:'OB-OB-005', title:'Validate accessibility of ICT products and services', department:'IT',action:"Review all uploaded documents for accessibility before publishing", assignee:'Deepak Joshi', approver:'Anita Singh', status:'In Progress', dueDate:'2025-06-01', risk:'High', circular:'CIRC-003', branch:'Bangalore', _workflowState:'' },
  { id:'OB-OB-006', title:'Conduct annual accessibility audits', department:'IT', assignee:'Priya Nair',action:"Review all uploaded documents for accessibility before publishing", approver:'Suresh Pillai', status:'In Progress', dueDate:'2025-08-01', risk:'High', circular:'CIRC-002', branch:'Bangalore', _workflowState:'' },
  { id:'OB-OB-007', title:'Schedule yearly audits by IAAP certified professionals', department:'CoITmpliance',action:"Review all uploaded documents for accessibility before publishing", assignee:'Meera Rao', approver:'Suresh Pillai', status:'Overdue', dueDate:'2025-03-31', risk:'High', circular:'CIRC-002', branch:'Bangalore', _workflowState:'' },

  /* Mumbai branch — Legal, Finance, Operations */
  { id:'OB-OB-008', title:'Regulatory Filing Q1 2025', department:'Legal', assignee:'Kavitha Menon', approver:'Arjun Shah', status:'Open', dueDate:'2025-06-30', risk:'High', circular:'CIRC-004', branch:'Mumbai', _workflowState:'' },
  { id:'OB-OB-009', title:'Contract Review — Vendor Agreements', department:'Legal', assignee:'Deepak Iyer', approver:'Arjun Shah', status:'In Progress', dueDate:'2025-05-20', risk:'Medium', circular:'CIRC-004', branch:'Mumbai', _workflowState:'' },
  { id:'OB-OB-010', title:'Litigation Risk Disclosure', department:'Legal', assignee:'Nisha Gupta', approver:'Arjun Shah', status:'Overdue', dueDate:'2025-03-15', risk:'High', circular:'CIRC-004', branch:'Mumbai', _workflowState:'' },
  { id:'SPOC-OB-011', title:'Budget Variance Reporting', department:'Finance', assignee:'Neha Patel', approver:'Ravi Krishnan', status:'Open', dueDate:'2025-07-01', risk:'Medium', circular:'CIRC-005', branch:'Mumbai', _workflowState:'' },
  { id:'SPOC-OB-012', title:'Tax Compliance Filing', department:'Finance', assignee:'Ravi Krishnan', approver:'Neha Patel', status:'In Progress', dueDate:'2025-05-31', risk:'High', circular:'CIRC-005', branch:'Mumbai', _workflowState:'' },
  { id:'SPOC-OB-013', title:'Vendor Risk Register Update', department:'Operations', assignee:'Suresh Kumar', approver:'Divya Iyer', status:'Open', dueDate:'2025-08-15', risk:'Medium', circular:'CIRC-005', branch:'Mumbai', _workflowState:'' },
  { id:'SPOC-OB-014', title:'Business Continuity Plan Test', department:'Operations', assignee:'Divya Iyer', approver:'Suresh Kumar', status:'Overdue', dueDate:'2025-04-10', risk:'High', circular:'CIRC-005', branch:'Mumbai', _workflowState:'' },
],

spocActivities: [
  { id:'SPOC-ACT-001', title:'Submit MFA implementation report', obligation:'SPOC-OB-001', assignee:'Raj Iyer', department:'IT', status:'Open', dueDate:'2025-06-25', branch:'Bangalore' },
  { id:'SPOC-ACT-002', title:'Upload vulnerability scan results', obligation:'SPOC-OB-002', assignee:'Anand Kumar', department:'IT', status:'In Progress', dueDate:'2025-05-10', branch:'Bangalore' },
  { id:'SPOC-ACT-003', title:'Draft encryption policy document', obligation:'SPOC-OB-003', assignee:'Sneha Mehta', department:'IT', status:'Overdue', dueDate:'2025-03-28', branch:'Bangalore' },
  { id:'SPOC-ACT-004', title:'Update risk register entries', obligation:'SPOC-OB-004', assignee:'Rahul Verma', department:'Risk', status:'Open', dueDate:'2025-07-10', branch:'Bangalore' },
  { id:'SPOC-ACT-005', title:'Prepare AML training materials', obligation:'SPOC-OB-006', assignee:'Priya Nair', department:'Compliance', status:'Open', dueDate:'2025-07-25', branch:'Bangalore' },
  { id:'SPOC-ACT-006', title:'File Q1 regulatory return', obligation:'SPOC-OB-008', assignee:'Kavitha Menon', department:'Legal', status:'Open', dueDate:'2025-06-25', branch:'Mumbai' },
  { id:'SPOC-ACT-007', title:'Review vendor contract clauses', obligation:'SPOC-OB-009', assignee:'Deepak Iyer', department:'Legal', status:'In Progress', dueDate:'2025-05-15', branch:'Mumbai' },
  { id:'SPOC-ACT-008', title:'Prepare budget variance report', obligation:'SPOC-OB-011', assignee:'Neha Patel', department:'Finance', status:'Open', dueDate:'2025-06-28', branch:'Mumbai' },
  { id:'SPOC-ACT-009', title:'Complete tax computation sheet', obligation:'SPOC-OB-012', assignee:'Ravi Krishnan', department:'Finance', status:'In Progress', dueDate:'2025-05-28', branch:'Mumbai' },
  { id:'SPOC-ACT-010', title:'Test BCP scenarios', obligation:'SPOC-OB-014', assignee:'Divya Iyer', department:'Operations', status:'Overdue', dueDate:'2025-04-05', branch:'Mumbai' },
],

  kpi: {
    pendingReview: 7,
    overdueObligations: 3,
    unassignedActivities: 11,
    complianceScore: 68
  },
  pipeline: [
    { stage: 'Received', count: 14, color: '#6366f1' },
    { stage: 'Activities Mapped', count: 11, color: '#3b82f6' },
    { stage: 'Assigned', count: 8, color: '#f59e0b' },
    { stage: 'Evidence Uploaded', count: 5, color: '#10b981' },
    { stage: 'Closed', count: 2, color: '#9ca3af' }
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


// Transform circular JSON into flat tasks array
function flattenCircularToTasks(circularData) {
  const tasks = [];
  
  // Process chapters
  const allSections = [
    ...(circularData.chapters || []),
    ...(circularData.annexures || [])
  ];

  allSections.forEach(section => {
    (section.clauses || []).forEach(clause => {
      if (!clause.id) return; // skip empty clauses
      
      const actionables = clause.actionables || [];
      
      if (actionables.length === 0) {
        // No actionables → still show the obligation as 1 row
        tasks.push({
          id:           `${circularData.id}-${clause.id}`,
          obligationId: clause.id,
          title:        clause.obligations?.[0] || clause.text.slice(0, 80),
          actionable:   '—',
          circularId:   circularData.id,
          clauseRef:    clause.id,
          department:   clause.department || 'Compliance',
          dueDate:      clause.dueDate || null,
          assignee:     clause.assignee || 'Unassigned',
          risk:         clause.risk || 'Medium',
          status:       clause.status || 'Open',
          priority:     clause.risk || 'Medium',
          _workflowState: null,
        });
      } else {
        // One row per actionable
        actionables.forEach((actionable, idx) => {
          tasks.push({
            id:           `${circularData.id}-${clause.id}-A${idx + 1}`,
            obligationId: clause.id,           // same for all rows of this clause
            title:        clause.obligations?.[0] || clause.text.slice(0, 80), // same
            actionable:   actionable,           // unique per row
            circularId:   circularData.id,
            clauseRef:    clause.id,
            department:   clause.department || 'Compliance',
            dueDate:      clause.dueDate || null,
            assignee:     clause.assignee || 'Unassigned',
            risk:         clause.risk || 'Medium',
            status:       clause.status || 'Open',
            priority:     clause.risk || 'Medium',
            _workflowState: null,
          });
        });
      }
    });
  });

  return tasks;
}

// Then initialize:
CMS_DATA.library_tasks = flattenCircularToTasks(CMS_DATA.circulars);