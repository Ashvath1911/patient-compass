import { AIRecommendation, PatientIntakeData, defaultPatientIntakeData } from '@/types/patient';
import { PatientSummaryPanel } from './PatientSummaryPanel';
import { TreatmentOptionCard } from './TreatmentOptionCard';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  MessageSquare,
  Stethoscope,
  FileText
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

// Mock data for demonstration
const mockPatient: PatientIntakeData = {
  ...defaultPatientIntakeData,
  basicInfo: {
    age: 58,
    sex: 'female',
    cancerType: 'Breast Cancer',
    diseaseStage: 'Stage III',
    performanceStatus: 1,
  },
  clinicalInfo: {
    biomarkers: {
      er: 'Positive',
      pr: 'Positive',
      her2: 'Negative',
      ki67: 'High (>30%)',
    },
    priorTreatments: ['Surgery', 'Chemotherapy'],
    comorbidities: ['Hypertension', 'Diabetes Type 2'],
  },
  preferences: {
    survivalBenefit: 5,
    qualityOfLife: 4,
    toxicityTolerance: 3,
    costSensitivity: 2,
    conveniencePreference: 4,
  },
  prioritization: {
    rankedGoals: [
      { id: 'survival', label: 'Maximize survival', description: '' },
      { id: 'functioning', label: 'Preserve daily functioning', description: '' },
      { id: 'side-effects', label: 'Minimize side effects', description: '' },
      { id: 'financial', label: 'Reduce financial burden', description: '' },
    ],
  },
  status: 'complete',
  consentGiven: true,
  submittedAt: new Date().toISOString(),
};

const mockRecommendation: AIRecommendation = {
  patientId: '1',
  contextSummary: 'Post-menopausal woman with ER+/PR+/HER2- Stage III breast cancer, previously treated with surgery and adjuvant chemotherapy. High Ki-67 indicates aggressive biology. ECOG 1 with controlled comorbidities. Patient prioritizes survival while maintaining quality of life.',
  options: [
    {
      rank: 1,
      title: 'Extended Adjuvant Endocrine Therapy + CDK4/6 Inhibitor',
      clinicalSummary: 'Combination of aromatase inhibitor (e.g., letrozole) with a CDK4/6 inhibitor (e.g., abemaciclib) for 2 years, followed by continued endocrine therapy. This approach addresses the high-risk features while aligning with the patient\'s preference for oral, convenient therapy.',
      pros: [
        'Significant improvement in invasive disease-free survival in high-risk HR+ breast cancer',
        'Oral administration aligns with convenience preferences',
        'Manageable toxicity profile with monitoring',
        'Strong guideline support from NCCN and ESMO for high-risk patients',
      ],
      cons: [
        'Potential for fatigue, diarrhea, and hematologic toxicities',
        'Requires regular blood count monitoring',
        'Higher cost compared to endocrine therapy alone',
        'May impact quality of life due to side effects',
      ],
      guidelineSources: ['NCCN Breast Cancer v2.2024', 'ESMO Clinical Practice Guidelines 2023', 'monarchE Trial Data'],
    },
    {
      rank: 2,
      title: 'Adjuvant Endocrine Therapy Alone (Extended Duration)',
      clinicalSummary: 'Extended aromatase inhibitor therapy for 7-10 years. A well-established approach with lower toxicity burden, though potentially less effective for high-risk disease given the aggressive tumor biology.',
      pros: [
        'Well-established efficacy and safety profile',
        'Lower toxicity compared to combination therapy',
        'Oral medication with good convenience',
        'Lower cost burden',
      ],
      cons: [
        'May not adequately address high-risk features',
        'Long-term side effects including bone loss, joint pain',
        'Higher recurrence risk in aggressive disease',
        'Requires bone density monitoring',
      ],
      guidelineSources: ['NCCN Breast Cancer v2.2024', 'ATLAS/aTTom Trial Data'],
    },
    {
      rank: 3,
      title: 'Clinical Trial Enrollment',
      clinicalSummary: 'Consider enrollment in clinical trials evaluating novel adjuvant therapies for high-risk HR+ breast cancer. Multiple trials are investigating immunotherapy combinations and novel targeted agents.',
      pros: [
        'Access to potentially superior novel therapies',
        'Close monitoring and comprehensive care',
        'Contributes to advancing cancer treatment',
        'May receive cutting-edge treatment options',
      ],
      cons: [
        'Uncertainty regarding treatment efficacy',
        'Potential for randomization to control arm',
        'May require more frequent clinic visits',
        'Unknown long-term side effect profile',
      ],
      guidelineSources: ['NCCN Breast Cancer v2.2024', 'ClinicalTrials.gov'],
    },
  ],
  uncertainties: 'The optimal duration of CDK4/6 inhibitor therapy remains under investigation. Long-term survival data for combination therapy continues to mature. Individual response may vary based on tumor heterogeneity.',
  sharedDecisionPrompt: 'Discuss with the patient the trade-offs between maximizing disease control with combination therapy versus the quality-of-life impact of additional medication and monitoring requirements.',
  generatedAt: new Date().toISOString(),
  reviewStatus: 'pending',
  reviewedAt: null,
};

export function DoctorConsole() {
  const [recommendation, setRecommendation] = useState<AIRecommendation>(mockRecommendation);
  const [patient] = useState<PatientIntakeData>(mockPatient);

  const handleReviewStatus = (status: AIRecommendation['reviewStatus']) => {
    setRecommendation({
      ...recommendation,
      reviewStatus: status,
      reviewedAt: new Date().toISOString(),
    });
  };

  const getStatusBadge = (status: AIRecommendation['reviewStatus']) => {
    switch (status) {
      case 'pending':
        return (
          <span className="clinical-badge bg-warning/10 text-warning border border-warning/20">
            <Clock className="w-3 h-3 mr-1" />
            Pending Review
          </span>
        );
      case 'reviewed':
        return (
          <span className="clinical-badge bg-info/10 text-info border border-info/20">
            <CheckCircle className="w-3 h-3 mr-1" />
            Reviewed
          </span>
        );
      case 'approved':
        return (
          <span className="clinical-badge bg-success/10 text-success border border-success/20">
            <CheckCircle className="w-3 h-3 mr-1" />
            Approved
          </span>
        );
      case 'modified':
        return (
          <span className="clinical-badge bg-primary/10 text-primary border border-primary/20">
            <FileText className="w-3 h-3 mr-1" />
            Modified
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">SPARC</h1>
                <p className="text-sm text-muted-foreground">Doctor Console</p>
              </div>
            </div>
            {getStatusBadge(recommendation.reviewStatus)}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Patient Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <PatientSummaryPanel patient={patient} />
            </div>
          </div>

          {/* Right Column - AI Recommendations */}
          <div className="lg:col-span-2 space-y-6">
            {/* Context Summary */}
            <div className="card-clinical p-6">
              <h2 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                Clinical Context
              </h2>
              <p className="text-foreground leading-relaxed">
                {recommendation.contextSummary}
              </p>
            </div>

            {/* Treatment Options */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground">
                Treatment Options
              </h2>
              <div className="space-y-4">
                {recommendation.options.map((option) => (
                  <TreatmentOptionCard key={option.rank} option={option} />
                ))}
              </div>
            </div>

            {/* Uncertainties */}
            <div className="card-clinical p-6 border-l-4 border-l-warning">
              <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-warning" />
                Key Uncertainties
              </h3>
              <p className="text-muted-foreground text-sm">
                {recommendation.uncertainties}
              </p>
            </div>

            {/* Shared Decision Prompt */}
            <div className="card-clinical p-6 bg-primary/5 border-primary/20">
              <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                Shared Decision-Making Prompt
              </h3>
              <p className="text-foreground text-sm">
                {recommendation.sharedDecisionPrompt}
              </p>
            </div>

            {/* Disclaimer */}
            <div className="disclaimer-banner">
              <p className="text-sm">
                <strong>Clinical Decision Support:</strong> This output is for clinical decision 
                support only and does not replace clinician judgment. All treatment recommendations 
                should be validated and discussed with the patient.
              </p>
            </div>

            {/* Review Actions */}
            <div className="sticky bottom-0 bg-background pt-4 pb-6 border-t border-border -mx-6 px-6 lg:mx-0 lg:px-0 lg:border-0 lg:relative">
              <div className="flex flex-wrap gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={() => handleReviewStatus('reviewed')}
                  className={cn(
                    recommendation.reviewStatus === 'reviewed' && 'border-info text-info'
                  )}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark as Reviewed
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleReviewStatus('modified')}
                  className={cn(
                    recommendation.reviewStatus === 'modified' && 'border-primary text-primary'
                  )}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Modified
                </Button>
                <Button
                  onClick={() => handleReviewStatus('approved')}
                  className={cn(
                    recommendation.reviewStatus === 'approved' && 'bg-success hover:bg-success/90'
                  )}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
