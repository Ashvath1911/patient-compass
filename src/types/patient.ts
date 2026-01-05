// Patient intake data types

export interface PatientBasicInfo {
  age: number | null;
  sex: 'male' | 'female' | 'other' | null;
  cancerType: string | null;
  diseaseStage: string | null;
  performanceStatus: number | null;
}

export interface PatientClinicalInfo {
  biomarkers: Record<string, string>;
  priorTreatments: string[];
  comorbidities: string[];
}

export interface PatientPreferences {
  survivalBenefit: number;
  qualityOfLife: number;
  toxicityTolerance: number;
  costSensitivity: number;
  conveniencePreference: number;
}

export interface PatientGoal {
  id: string;
  label: string;
  description: string;
}

export interface PatientPrioritization {
  rankedGoals: PatientGoal[];
}

export interface PatientIntakeData {
  basicInfo: PatientBasicInfo;
  clinicalInfo: PatientClinicalInfo;
  preferences: PatientPreferences;
  prioritization: PatientPrioritization;
  consentGiven: boolean;
  submittedAt: string | null;
  status: 'draft' | 'submitted' | 'processing' | 'complete';
}

export const defaultPatientIntakeData: PatientIntakeData = {
  basicInfo: {
    age: null,
    sex: null,
    cancerType: null,
    diseaseStage: null,
    performanceStatus: null,
  },
  clinicalInfo: {
    biomarkers: {},
    priorTreatments: [],
    comorbidities: [],
  },
  preferences: {
    survivalBenefit: 3,
    qualityOfLife: 3,
    toxicityTolerance: 3,
    costSensitivity: 3,
    conveniencePreference: 3,
  },
  prioritization: {
    rankedGoals: [
      { id: 'survival', label: 'Maximize survival', description: 'Focus on treatments that extend life as long as possible' },
      { id: 'side-effects', label: 'Minimize side effects', description: 'Prioritize treatments with fewer adverse effects' },
      { id: 'functioning', label: 'Preserve daily functioning', description: 'Maintain ability to perform daily activities' },
      { id: 'financial', label: 'Reduce financial burden', description: 'Consider cost-effectiveness of treatment options' },
    ],
  },
  consentGiven: false,
  submittedAt: null,
  status: 'draft',
};

// Cancer type options
export const cancerTypes = [
  'Breast Cancer',
  'Lung Cancer (NSCLC)',
  'Lung Cancer (SCLC)',
  'Colorectal Cancer',
  'Prostate Cancer',
  'Pancreatic Cancer',
  'Melanoma',
  'Ovarian Cancer',
  'Head & Neck Cancer',
  'Bladder Cancer',
  'Kidney Cancer',
  'Gastric Cancer',
  'Esophageal Cancer',
  'Liver Cancer',
  'Other',
];

// Disease stage options
export const diseaseStages = [
  'Stage I',
  'Stage II',
  'Stage III',
  'Stage IV',
  'Locally Advanced',
  'Metastatic',
  'Recurrent',
];

// ECOG Performance Status
export const performanceStatuses = [
  { value: 0, label: '0 - Fully active', description: 'Able to carry on all pre-disease activities without restriction' },
  { value: 1, label: '1 - Restricted in strenuous activity', description: 'Ambulatory and able to carry out light work' },
  { value: 2, label: '2 - Ambulatory, capable of self-care', description: 'Up and about more than 50% of waking hours' },
  { value: 3, label: '3 - Limited self-care', description: 'Confined to bed or chair more than 50% of waking hours' },
  { value: 4, label: '4 - Completely disabled', description: 'Cannot carry on any self-care; totally confined to bed or chair' },
];

// Biomarker options by cancer type
export const biomarkersByCancer: Record<string, { key: string; label: string; options: string[] }[]> = {
  'Breast Cancer': [
    { key: 'er', label: 'ER Status', options: ['Positive', 'Negative', 'Unknown'] },
    { key: 'pr', label: 'PR Status', options: ['Positive', 'Negative', 'Unknown'] },
    { key: 'her2', label: 'HER2 Status', options: ['Positive', 'Negative', 'Equivocal', 'Unknown'] },
    { key: 'ki67', label: 'Ki-67', options: ['Low (<14%)', 'Intermediate (14-30%)', 'High (>30%)', 'Unknown'] },
  ],
  'Lung Cancer (NSCLC)': [
    { key: 'egfr', label: 'EGFR Mutation', options: ['Positive', 'Negative', 'Unknown'] },
    { key: 'alk', label: 'ALK Rearrangement', options: ['Positive', 'Negative', 'Unknown'] },
    { key: 'pdl1', label: 'PD-L1 Expression', options: ['High (≥50%)', 'Low (1-49%)', 'Negative (<1%)', 'Unknown'] },
    { key: 'ros1', label: 'ROS1 Fusion', options: ['Positive', 'Negative', 'Unknown'] },
    { key: 'kras', label: 'KRAS G12C', options: ['Positive', 'Negative', 'Unknown'] },
  ],
  'Colorectal Cancer': [
    { key: 'kras', label: 'KRAS Status', options: ['Wild-type', 'Mutated', 'Unknown'] },
    { key: 'nras', label: 'NRAS Status', options: ['Wild-type', 'Mutated', 'Unknown'] },
    { key: 'braf', label: 'BRAF V600E', options: ['Positive', 'Negative', 'Unknown'] },
    { key: 'msi', label: 'MSI Status', options: ['MSI-High', 'MSI-Low', 'MSS', 'Unknown'] },
  ],
  'Melanoma': [
    { key: 'braf', label: 'BRAF V600', options: ['Positive', 'Negative', 'Unknown'] },
    { key: 'pdl1', label: 'PD-L1 Expression', options: ['Positive', 'Negative', 'Unknown'] },
  ],
};

// Prior treatment options
export const priorTreatmentOptions = [
  'Surgery',
  'Chemotherapy',
  'Radiation Therapy',
  'Immunotherapy',
  'Targeted Therapy',
  'Hormone Therapy',
  'Bone Marrow Transplant',
  'Clinical Trial',
  'No Prior Treatment',
];

// Comorbidity options
export const comorbidityOptions = [
  'Hypertension',
  'Diabetes Type 2',
  'Coronary Artery Disease',
  'Heart Failure',
  'COPD',
  'Chronic Kidney Disease',
  'Liver Disease',
  'Previous Malignancy',
  'Autoimmune Disorder',
  'Neuropathy',
  'Thromboembolic Disease',
  'None',
];

// AI Recommendation types
export interface TreatmentOption {
  rank: number;
  title: string;
  clinicalSummary: string;
  pros: string[];
  cons: string[];
  guidelineSources: string[];
}

export interface AIRecommendation {
  patientId: string;
  contextSummary: string;
  options: TreatmentOption[];
  uncertainties: string;
  sharedDecisionPrompt: string;
  generatedAt: string;
  reviewStatus: 'pending' | 'reviewed' | 'approved' | 'modified';
  reviewedAt: string | null;
}
