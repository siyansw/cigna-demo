// GLP-1 Agonist Drug Data for P&T Committee Demo

export const drugData = {
  semaglutide: {
    id: 'semaglutide',
    name: 'Semaglutide',
    brandNames: ['Ozempic', 'Wegovy', 'Rybelsus'],
    manufacturer: 'Novo Nordisk',
    drugClass: 'GLP-1 Receptor Agonist',
    fdaApproval: 'December 2017',
    approvalYear: 2017,
    dosing: 'Weekly',

    efficacy: {
      hba1cReduction: -1.5,
      hba1cRange: [-1.2, -1.8],
      weightLoss: -4.5,
      weightLossRange: [-3.5, -6.5],
      fastingGlucose: -30,
      cvBenefit: 26,
      cvBenefitText: '↓ 26% MACE',
      nnt: 43,
      guidelineRec: 'Class I, Level A'
    },

    pivotalTrials: [
      {
        name: 'SUSTAIN-6',
        type: 'CVOT',
        design: 'Randomized, double-blind, placebo-controlled',
        population: '3,297 patients with T2DM and high CV risk',
        duration: '104 weeks',
        primaryEndpoint: '3-point MACE (CV death, non-fatal MI, non-fatal stroke)',
        results: {
          mace: { treatment: 6.6, placebo: 8.9, hr: 0.74, ci: [0.58, 0.95], pValue: 0.02 },
          hba1c: { treatment: -1.0, placebo: 0.3 },
          weight: { treatment: -3.5, placebo: -0.7 }
        },
        nnt: 43,
        source: 'https://www.nejm.org/doi/full/10.1056/NEJMoa1607141',
        nctId: 'NCT01720446'
      },
      {
        name: 'SUSTAIN-7',
        type: 'Head-to-head',
        design: 'Randomized, open-label, active-controlled',
        population: '1,201 patients with T2DM inadequately controlled on metformin',
        duration: '40 weeks',
        primaryEndpoint: 'Change in HbA1c',
        comparator: 'Dulaglutide',
        results: {
          hba1c: { semaglutide05: -1.5, semaglutide1: -1.8, dulaglutide075: -1.1, dulaglutide15: -1.4 },
          weight: { semaglutide05: -4.6, semaglutide1: -6.5, dulaglutide075: -2.3, dulaglutide15: -3.0 }
        },
        source: 'https://www.thelancet.com/journals/landia/article/PIIS2213-8587(18)30024-X/fulltext',
        nctId: 'NCT02648204'
      }
    ],

    safety: {
      discontinuationRate: 5.3,
      commonAEs: [
        { event: 'Nausea', rate: 20, placeboRate: 6 },
        { event: 'Diarrhea', rate: 9, placeboRate: 5 },
        { event: 'Vomiting', rate: 9, placeboRate: 3 },
        { event: 'Constipation', rate: 5, placeboRate: 2 }
      ],
      seriousAEs: [
        { event: 'Pancreatitis', rate: 0.3, note: 'Similar to other GLP-1s' },
        { event: 'Diabetic retinopathy', rate: 3.0, comparator: 1.8, hr: 1.76, note: 'In SUSTAIN-6' },
        { event: 'Hypoglycemia (with insulin)', rate: 16.7, comparator: 17.5 }
      ],
      blackBoxWarning: 'Risk of thyroid C-cell tumors (based on rodent studies). Contraindicated in patients with personal/family history of medullary thyroid carcinoma or MEN 2.',
      warnings: [
        'Pancreatitis risk',
        'Diabetic retinopathy complications',
        'Acute kidney injury',
        'Hypersensitivity reactions'
      ]
    },

    evidenceQuality: {
      totalTrials: 10,
      trialNames: 'SUSTAIN-1 through SUSTAIN-10',
      totalPatients: 8417,
      durationRange: '30 weeks to 104 weeks',
      comparators: ['Placebo', 'Sitagliptin', 'Exenatide ER', 'Dulaglutide', 'Insulin glargine'],
      studyDesign: {
        rct: 10,
        doubleBlind: 8,
        activeComparator: 6,
        cvot: true
      },
      population: {
        meanAge: 55,
        ageRange: '18-85',
        female: 48,
        raceWhite: 76,
        raceBlack: 8,
        raceAsian: 6,
        baselineHba1c: 8.1,
        diabetesDuration: 9.2,
        renalImpairment: true
      }
    },

    guidelines: [
      {
        organization: 'American Diabetes Association',
        year: 2024,
        recommendation: 'GLP-1 receptor agonists with proven CV benefit recommended for patients with T2DM and ASCVD, heart failure, or CKD',
        class: 'I',
        evidenceLevel: 'A',
        position: 'Preferred agent alongside metformin for patients with ASCVD',
        quote: 'Among patients with ASCVD, heart failure, or CKD, use of a GLP-1 receptor agonist with proven cardiovascular benefit is recommended to reduce major adverse cardiovascular events, heart failure events, CKD progression, or all of these.',
        source: 'https://diabetesjournals.org/care/issue/47/Supplement_1'
      },
      {
        organization: 'ACC/AHA',
        year: 2023,
        recommendation: 'GLP-1 agonists with CV benefit for diabetes + ASCVD',
        class: 'I',
        evidenceLevel: 'A',
        quote: 'Semaglutide demonstrated superiority over placebo for 3-point MACE in the SUSTAIN-6 trial.',
        source: 'https://www.jacc.org/guidelines/cardiovascular-prevention'
      },
      {
        organization: 'AACE',
        year: 2024,
        recommendation: 'Preferred for patients requiring significant weight loss or with ASCVD',
        tier: 'First-line (with metformin) or monotherapy if metformin contraindicated',
        source: 'https://pro.aace.com/disease-state-resources/diabetes'
      },
      {
        organization: 'ESC',
        year: 2023,
        recommendation: 'Class I for CV risk reduction',
        class: 'I',
        evidenceLevel: 'A',
        source: 'https://www.escardio.org/Guidelines/Clinical-Practice-Guidelines'
      }
    ],

    peerFormularies: {
      medicarePartD: {
        coveringPlans: 487,
        totalPlans: 573,
        coveragePercent: 85,
        tierPlacement: {
          tier3: 45,
          tier4: 40,
          tier5: 15
        },
        utilizationManagement: {
          priorAuth: 73,
          stepTherapy: 58,
          quantityLimits: 92
        }
      },
      majorPBMs: [
        { name: 'Express Scripts', status: 'Preferred', tier: 3 },
        { name: 'CVS Caremark', status: 'Non-Preferred', tier: 4, note: 'Dulaglutide preferred' },
        { name: 'OptumRx', status: 'Under Review', tier: null }
      ],
      vaFormulary: {
        status: 'Formulary with criteria',
        criteria: 'Reserved for patients with ASCVD or heart failure, or inadequate response to dulaglutide'
      },
      stateMedicaid: [
        { state: 'California', status: 'Preferred with PA' },
        { state: 'Texas', status: 'Non-preferred', note: 'Dulaglutide preferred' },
        { state: 'Florida', status: 'Preferred with step therapy' },
        { state: 'New York', status: 'Preferred with PA' }
      ]
    },

    updates: {
      newIndications: [
        { indication: 'Chronic weight management (Wegovy brand)', date: 'June 2021' },
        { indication: 'Cardiovascular risk reduction', date: 'January 2020' }
      ],
      labelUpdates: [
        'CV benefit language strengthened based on SUSTAIN-6 results',
        'Diabetic retinopathy warning added based on SUSTAIN-6 safety signal'
      ],
      guidelineChanges: [
        { change: 'ADA upgraded to Class I recommendation', date: 'January 2024', previous: 'Class IIa' },
        { change: 'ACC/AHA included in preferred agents for diabetes + ASCVD', date: '2023' }
      ],
      newTrialData: [
        { trial: 'FLOW trial results (kidney outcomes in CKD)', date: 'March 2024' },
        { trial: 'SELECT trial (CV outcomes in obesity without diabetes)', date: 'August 2023' }
      ],
      activeSafetyAlerts: [],
      regulatoryActions: [
        'FDA approved higher dose (2.4 mg) for weight management',
        'EMA approved for CV risk reduction indication'
      ],
      competitorActivity: [
        'Tirzepatide (Mounjaro) approved May 2022 - shows superior efficacy in head-to-head trials',
        'Oral semaglutide (Rybelsus) available but different PK profile'
      ]
    }
  },

  tirzepatide: {
    id: 'tirzepatide',
    name: 'Tirzepatide',
    brandNames: ['Mounjaro', 'Zepbound'],
    manufacturer: 'Eli Lilly',
    drugClass: 'Dual GIP/GLP-1 Receptor Agonist',
    fdaApproval: 'May 2022',
    approvalYear: 2022,
    dosing: 'Weekly',

    efficacy: {
      hba1cReduction: -2.1,
      hba1cRange: [-1.8, -2.4],
      weightLoss: -7.6,
      weightLossRange: [-5.5, -12.0],
      fastingGlucose: -40,
      cvBenefit: null,
      cvBenefitText: 'CVOT ongoing',
      nnt: null,
      guidelineRec: 'Class I, Level A'
    },

    pivotalTrials: [
      {
        name: 'SURPASS-2',
        type: 'Head-to-head',
        design: 'Randomized, open-label, active-controlled',
        population: '1,879 patients with T2DM inadequately controlled on metformin',
        duration: '40 weeks',
        primaryEndpoint: 'Change in HbA1c',
        comparator: 'Semaglutide 1mg',
        results: {
          hba1c: { tirzepatide5: -2.0, tirzepatide10: -2.2, tirzepatide15: -2.3, semaglutide: -1.9 },
          weight: { tirzepatide5: -7.6, tirzepatide10: -9.3, tirzepatide15: -11.2, semaglutide: -5.7 }
        },
        source: 'https://www.nejm.org/doi/full/10.1056/NEJMoa2107519',
        nctId: 'NCT03987919'
      }
    ],

    safety: {
      discontinuationRate: 6.1,
      commonAEs: [
        { event: 'Nausea', rate: 23, placeboRate: 6 },
        { event: 'Diarrhea', rate: 15, placeboRate: 8 },
        { event: 'Vomiting', rate: 10, placeboRate: 3 },
        { event: 'Constipation', rate: 6, placeboRate: 3 }
      ],
      seriousAEs: [
        { event: 'Pancreatitis', rate: 0.2, note: 'Similar to GLP-1s' }
      ],
      blackBoxWarning: 'Risk of thyroid C-cell tumors (based on rodent studies). Contraindicated in patients with personal/family history of medullary thyroid carcinoma or MEN 2.',
      warnings: [
        'Pancreatitis risk',
        'Hypoglycemia when used with insulin/sulfonylurea',
        'Acute kidney injury',
        'Hypersensitivity reactions'
      ]
    },

    evidenceQuality: {
      totalTrials: 5,
      trialNames: 'SURPASS-1 through SURPASS-5',
      totalPatients: 6263,
      durationRange: '40 weeks to 52 weeks',
      comparators: ['Placebo', 'Semaglutide', 'Insulin degludec', 'Insulin glargine'],
      studyDesign: {
        rct: 5,
        doubleBlind: 3,
        activeComparator: 4,
        cvot: false
      },
      population: {
        meanAge: 54,
        ageRange: '18-80',
        female: 47,
        raceWhite: 68,
        raceBlack: 6,
        raceAsian: 18,
        baselineHba1c: 8.3,
        diabetesDuration: 8.5,
        renalImpairment: true
      }
    },

    guidelines: [
      {
        organization: 'American Diabetes Association',
        year: 2024,
        recommendation: 'May be considered for superior glycemic efficacy and weight loss',
        class: 'I',
        evidenceLevel: 'A',
        position: 'Alternative when maximal weight loss desired',
        source: 'https://diabetesjournals.org/care/issue/47/Supplement_1'
      }
    ],

    peerFormularies: {
      medicarePartD: {
        coveringPlans: 412,
        totalPlans: 573,
        coveragePercent: 72,
        tierPlacement: {
          tier3: 25,
          tier4: 50,
          tier5: 25
        }
      },
      majorPBMs: [
        { name: 'Express Scripts', status: 'Non-Preferred', tier: 4 },
        { name: 'CVS Caremark', status: 'Preferred', tier: 3 },
        { name: 'OptumRx', status: 'Under Review', tier: null }
      ]
    },

    updates: {
      newIndications: [
        { indication: 'Chronic weight management (Zepbound)', date: 'November 2023' }
      ],
      activeSafetyAlerts: [],
      competitorActivity: [
        'SURPASS-CVOT ongoing - results expected 2024'
      ]
    }
  },

  dulaglutide: {
    id: 'dulaglutide',
    name: 'Dulaglutide',
    brandNames: ['Trulicity'],
    manufacturer: 'Eli Lilly',
    drugClass: 'GLP-1 Receptor Agonist',
    fdaApproval: 'September 2014',
    approvalYear: 2014,
    dosing: 'Weekly',

    efficacy: {
      hba1cReduction: -1.4,
      hba1cRange: [-1.1, -1.6],
      weightLoss: -3.0,
      weightLossRange: [-2.3, -4.0],
      fastingGlucose: -25,
      cvBenefit: 12,
      cvBenefitText: '↓ 12% MACE',
      nnt: 67,
      guidelineRec: 'Class I, Level A'
    },

    pivotalTrials: [
      {
        name: 'REWIND',
        type: 'CVOT',
        design: 'Randomized, double-blind, placebo-controlled',
        population: '9,901 patients with T2DM and CV risk factors',
        duration: '5.4 years (median)',
        primaryEndpoint: '3-point MACE',
        results: {
          mace: { treatment: 12.0, placebo: 13.4, hr: 0.88, ci: [0.79, 0.99], pValue: 0.026 },
          hba1c: { treatment: -0.6, placebo: 0.0 },
          weight: { treatment: -1.5, placebo: 0.0 }
        },
        source: 'https://www.thelancet.com/journals/lancet/article/PIIS0140-6736(19)31149-3/fulltext',
        nctId: 'NCT01394952'
      }
    ],

    safety: {
      discontinuationRate: 4.2,
      commonAEs: [
        { event: 'Nausea', rate: 18, placeboRate: 6 },
        { event: 'Diarrhea', rate: 11, placeboRate: 6 },
        { event: 'Vomiting', rate: 8, placeboRate: 3 },
        { event: 'Constipation', rate: 4, placeboRate: 2 }
      ],
      seriousAEs: [
        { event: 'Pancreatitis', rate: 0.3, note: 'Similar to other GLP-1s' }
      ],
      blackBoxWarning: 'Risk of thyroid C-cell tumors (based on rodent studies). Contraindicated in patients with personal/family history of medullary thyroid carcinoma or MEN 2.',
      warnings: [
        'Pancreatitis risk',
        'Acute kidney injury',
        'Hypersensitivity reactions'
      ]
    },

    evidenceQuality: {
      totalTrials: 9,
      trialNames: 'AWARD-1 through AWARD-9 + REWIND',
      totalPatients: 16800,
      durationRange: '26 weeks to 5.4 years',
      studyDesign: {
        rct: 9,
        doubleBlind: 7,
        activeComparator: 6,
        cvot: true
      }
    },

    guidelines: [
      {
        organization: 'American Diabetes Association',
        year: 2024,
        recommendation: 'GLP-1 receptor agonist with proven CV benefit',
        class: 'I',
        evidenceLevel: 'A',
        source: 'https://diabetesjournals.org/care/issue/47/Supplement_1'
      }
    ],

    peerFormularies: {
      medicarePartD: {
        coveringPlans: 521,
        totalPlans: 573,
        coveragePercent: 91,
        tierPlacement: {
          tier3: 60,
          tier4: 30,
          tier5: 10
        }
      },
      majorPBMs: [
        { name: 'Express Scripts', status: 'Preferred', tier: 3 },
        { name: 'CVS Caremark', status: 'Preferred', tier: 3 },
        { name: 'OptumRx', status: 'Preferred', tier: 2 }
      ]
    },

    updates: {
      activeSafetyAlerts: [],
      competitorActivity: []
    }
  },

  liraglutide: {
    id: 'liraglutide',
    name: 'Liraglutide',
    brandNames: ['Victoza', 'Saxenda'],
    manufacturer: 'Novo Nordisk',
    drugClass: 'GLP-1 Receptor Agonist',
    fdaApproval: 'January 2010',
    approvalYear: 2010,
    dosing: 'Daily',

    efficacy: {
      hba1cReduction: -1.2,
      hba1cRange: [-0.9, -1.5],
      weightLoss: -2.8,
      weightLossRange: [-2.0, -4.0],
      fastingGlucose: -22,
      cvBenefit: 13,
      cvBenefitText: '↓ 13% MACE',
      nnt: 52,
      guidelineRec: 'Class IIa, Level A'
    },

    pivotalTrials: [
      {
        name: 'LEADER',
        type: 'CVOT',
        design: 'Randomized, double-blind, placebo-controlled',
        population: '9,340 patients with T2DM and high CV risk',
        duration: '3.8 years (median)',
        primaryEndpoint: '3-point MACE',
        results: {
          mace: { treatment: 13.0, placebo: 14.9, hr: 0.87, ci: [0.78, 0.97], pValue: 0.01 },
          hba1c: { treatment: -0.4, placebo: 0.0 },
          weight: { treatment: -2.3, placebo: 0.0 }
        },
        source: 'https://www.nejm.org/doi/full/10.1056/NEJMoa1603827',
        nctId: 'NCT01179048'
      }
    ],

    safety: {
      discontinuationRate: 4.5,
      commonAEs: [
        { event: 'Nausea', rate: 18, placeboRate: 7 },
        { event: 'Diarrhea', rate: 10, placeboRate: 6 },
        { event: 'Vomiting', rate: 8, placeboRate: 4 },
        { event: 'Constipation', rate: 5, placeboRate: 3 }
      ],
      blackBoxWarning: 'Risk of thyroid C-cell tumors. Contraindicated in patients with personal/family history of MTC or MEN 2.',
      warnings: ['Pancreatitis risk', 'Acute kidney injury', 'Hypersensitivity reactions']
    },

    evidenceQuality: {
      totalTrials: 7,
      trialNames: 'LEAD-1 through LEAD-6 + LEADER',
      totalPatients: 12340,
      studyDesign: { rct: 7, doubleBlind: 6, cvot: true }
    },

    guidelines: [
      {
        organization: 'American Diabetes Association',
        year: 2024,
        recommendation: 'GLP-1 receptor agonist with proven CV benefit',
        class: 'IIa',
        evidenceLevel: 'A',
        source: 'https://diabetesjournals.org/care/issue/47/Supplement_1'
      }
    ],

    peerFormularies: {
      medicarePartD: {
        coveringPlans: 465,
        totalPlans: 573,
        coveragePercent: 81,
        tierPlacement: { tier3: 35, tier4: 45, tier5: 20 }
      },
      majorPBMs: [
        { name: 'Express Scripts', status: 'Non-Preferred', tier: 4 },
        { name: 'CVS Caremark', status: 'Non-Preferred', tier: 4 },
        { name: 'OptumRx', status: 'Non-Preferred', tier: 3 }
      ]
    },

    updates: { activeSafetyAlerts: [] }
  },

  exenatideER: {
    id: 'exenatideER',
    name: 'Exenatide ER',
    brandNames: ['Bydureon', 'Bydureon BCise'],
    manufacturer: 'AstraZeneca',
    drugClass: 'GLP-1 Receptor Agonist',
    fdaApproval: 'January 2012',
    approvalYear: 2012,
    dosing: 'Weekly',

    efficacy: {
      hba1cReduction: -1.3,
      hba1cRange: [-1.0, -1.5],
      weightLoss: -2.0,
      weightLossRange: [-1.5, -3.0],
      fastingGlucose: -20,
      cvBenefit: 0,
      cvBenefitText: 'No benefit',
      nnt: null,
      guidelineRec: 'Class IIb, Level B'
    },

    pivotalTrials: [
      {
        name: 'EXSCEL',
        type: 'CVOT',
        design: 'Randomized, double-blind, placebo-controlled',
        population: '14,752 patients with T2DM',
        duration: '3.2 years (median)',
        primaryEndpoint: '3-point MACE',
        results: {
          mace: { treatment: 11.4, placebo: 12.2, hr: 0.91, ci: [0.83, 1.00], pValue: 0.06 },
          hba1c: { treatment: -0.5, placebo: 0.0 }
        },
        source: 'https://www.nejm.org/doi/full/10.1056/NEJMoa1612917',
        nctId: 'NCT01144338'
      }
    ],

    safety: {
      discontinuationRate: 5.1,
      commonAEs: [
        { event: 'Nausea', rate: 14, placeboRate: 5 },
        { event: 'Diarrhea', rate: 9, placeboRate: 5 },
        { event: 'Injection site nodule', rate: 6, placeboRate: 0 }
      ],
      blackBoxWarning: 'Risk of thyroid C-cell tumors.',
      warnings: ['Pancreatitis risk', 'Acute kidney injury']
    },

    evidenceQuality: {
      totalTrials: 5,
      trialNames: 'DURATION-1 through DURATION-5 + EXSCEL',
      totalPatients: 18500,
      studyDesign: { rct: 5, doubleBlind: 4, cvot: true }
    },

    guidelines: [
      {
        organization: 'American Diabetes Association',
        year: 2024,
        recommendation: 'GLP-1 agonist without proven CV benefit',
        class: 'IIb',
        evidenceLevel: 'B',
        source: 'https://diabetesjournals.org/care/issue/47/Supplement_1'
      }
    ],

    peerFormularies: {
      medicarePartD: {
        coveringPlans: 398,
        totalPlans: 573,
        coveragePercent: 69,
        tierPlacement: { tier3: 30, tier4: 50, tier5: 20 }
      },
      majorPBMs: [
        { name: 'Express Scripts', status: 'Non-Preferred', tier: 4 },
        { name: 'CVS Caremark', status: 'Non-Preferred', tier: 4 },
        { name: 'OptumRx', status: 'Non-Preferred', tier: 4 }
      ]
    },

    updates: { activeSafetyAlerts: [] }
  },

  lixisenatide: {
    id: 'lixisenatide',
    name: 'Lixisenatide',
    brandNames: ['Adlyxin'],
    manufacturer: 'Sanofi',
    drugClass: 'GLP-1 Receptor Agonist',
    fdaApproval: 'July 2016',
    approvalYear: 2016,
    dosing: 'Daily',

    efficacy: {
      hba1cReduction: -0.9,
      hba1cRange: [-0.7, -1.1],
      weightLoss: -1.5,
      weightLossRange: [-1.0, -2.0],
      fastingGlucose: -15,
      cvBenefit: 0,
      cvBenefitText: 'Neutral',
      nnt: null,
      guidelineRec: 'Class IIb, Level B'
    },

    pivotalTrials: [
      {
        name: 'ELIXA',
        type: 'CVOT',
        design: 'Randomized, double-blind, placebo-controlled',
        population: '6,068 patients with T2DM and recent ACS',
        duration: '25 months (median)',
        primaryEndpoint: '4-point MACE',
        results: {
          mace: { treatment: 13.4, placebo: 13.2, hr: 1.02, ci: [0.89, 1.17] }
        },
        source: 'https://www.nejm.org/doi/full/10.1056/NEJMoa1509225',
        nctId: 'NCT01147250'
      }
    ],

    safety: {
      discontinuationRate: 6.0,
      commonAEs: [
        { event: 'Nausea', rate: 25, placeboRate: 7 },
        { event: 'Vomiting', rate: 10, placeboRate: 3 },
        { event: 'Diarrhea', rate: 8, placeboRate: 5 }
      ],
      blackBoxWarning: 'Risk of thyroid C-cell tumors.',
      warnings: ['Pancreatitis risk', 'Acute kidney injury']
    },

    evidenceQuality: {
      totalTrials: 4,
      trialNames: 'GetGoal trials + ELIXA',
      totalPatients: 9000,
      studyDesign: { rct: 4, doubleBlind: 3, cvot: true }
    },

    guidelines: [
      {
        organization: 'American Diabetes Association',
        year: 2024,
        recommendation: 'GLP-1 agonist without proven CV benefit',
        class: 'IIb',
        evidenceLevel: 'B',
        source: 'https://diabetesjournals.org/care/issue/47/Supplement_1'
      }
    ],

    peerFormularies: {
      medicarePartD: {
        coveringPlans: 287,
        totalPlans: 573,
        coveragePercent: 50,
        tierPlacement: { tier3: 20, tier4: 50, tier5: 30 }
      },
      majorPBMs: [
        { name: 'Express Scripts', status: 'Non-Preferred', tier: 5 },
        { name: 'CVS Caremark', status: 'Not Covered', tier: null },
        { name: 'OptumRx', status: 'Non-Preferred', tier: 5 }
      ]
    },

    updates: { activeSafetyAlerts: [] }
  }
};

// Drug list for comparison table
export const drugList = [
  'semaglutide',
  'tirzepatide',
  'dulaglutide',
  'liraglutide',
  'exenatideER',
  'lixisenatide'
];

// Therapeutic class info
export const therapeuticClass = {
  name: 'GLP-1 Receptor Agonists',
  indication: 'Type 2 Diabetes',
  totalDrugs: 6,
  dataSources: 47,
  lastUpdated: new Date().toISOString()
};
