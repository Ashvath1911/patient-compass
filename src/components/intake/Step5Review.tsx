import { PatientIntakeData } from '@/types/patient';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ClipboardCheck, User, FlaskConical, Heart, ListOrdered, ShieldCheck, AlertTriangle } from 'lucide-react';

interface Step5Props {
  data: PatientIntakeData;
  onConsentChange: (consent: boolean) => void;
}

export function Step5Review({ data, onConsentChange }: Step5Props) {
  const getPreferenceLabel = (value: number) => {
    const labels = ['Not Important', 'Slightly', 'Moderate', 'Very', 'Extremely'];
    return labels[value - 1] || 'N/A';
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
          <ClipboardCheck className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Review & Confirm</h2>
        <p className="text-muted-foreground mt-2">
          Please review your information before submitting.
        </p>
      </div>

      {/* Basic Info Summary */}
      <div className="card-clinical p-6">
        <div className="flex items-center gap-2 mb-4">
          <User className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Basic Information</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Age:</span>
            <span className="ml-2 font-medium">{data.basicInfo.age || 'Not provided'}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Sex:</span>
            <span className="ml-2 font-medium capitalize">{data.basicInfo.sex || 'Not provided'}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Cancer Type:</span>
            <span className="ml-2 font-medium">{data.basicInfo.cancerType || 'Not provided'}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Disease Stage:</span>
            <span className="ml-2 font-medium">{data.basicInfo.diseaseStage || 'Not provided'}</span>
          </div>
          <div className="md:col-span-2">
            <span className="text-muted-foreground">Performance Status:</span>
            <span className="ml-2 font-medium">ECOG {data.basicInfo.performanceStatus ?? 'Not provided'}</span>
          </div>
        </div>
      </div>

      {/* Clinical Info Summary */}
      <div className="card-clinical p-6">
        <div className="flex items-center gap-2 mb-4">
          <FlaskConical className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Clinical Information</h3>
        </div>
        <div className="space-y-4 text-sm">
          {Object.keys(data.clinicalInfo.biomarkers).length > 0 && (
            <div>
              <span className="text-muted-foreground block mb-2">Biomarkers:</span>
              <div className="flex flex-wrap gap-2">
                {Object.entries(data.clinicalInfo.biomarkers).map(([key, value]) => (
                  <span key={key} className="clinical-badge bg-info/10 text-info">
                    {key.toUpperCase()}: {value}
                  </span>
                ))}
              </div>
            </div>
          )}
          <div>
            <span className="text-muted-foreground block mb-2">Prior Treatments:</span>
            <div className="flex flex-wrap gap-2">
              {data.clinicalInfo.priorTreatments.length > 0 ? (
                data.clinicalInfo.priorTreatments.map((treatment) => (
                  <span key={treatment} className="clinical-badge bg-muted text-muted-foreground">
                    {treatment}
                  </span>
                ))
              ) : (
                <span className="text-muted-foreground italic">None selected</span>
              )}
            </div>
          </div>
          <div>
            <span className="text-muted-foreground block mb-2">Comorbidities:</span>
            <div className="flex flex-wrap gap-2">
              {data.clinicalInfo.comorbidities.length > 0 ? (
                data.clinicalInfo.comorbidities.map((condition) => (
                  <span key={condition} className="clinical-badge bg-warning/10 text-warning">
                    {condition}
                  </span>
                ))
              ) : (
                <span className="text-muted-foreground italic">None selected</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Preferences Summary */}
      <div className="card-clinical p-6">
        <div className="flex items-center gap-2 mb-4">
          <Heart className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Your Preferences</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Survival Benefit:</span>
            <span className="font-medium">{data.preferences.survivalBenefit}/5 ({getPreferenceLabel(data.preferences.survivalBenefit)})</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Quality of Life:</span>
            <span className="font-medium">{data.preferences.qualityOfLife}/5 ({getPreferenceLabel(data.preferences.qualityOfLife)})</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Toxicity Tolerance:</span>
            <span className="font-medium">{data.preferences.toxicityTolerance}/5 ({getPreferenceLabel(data.preferences.toxicityTolerance)})</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Cost Sensitivity:</span>
            <span className="font-medium">{data.preferences.costSensitivity}/5 ({getPreferenceLabel(data.preferences.costSensitivity)})</span>
          </div>
          <div className="flex justify-between md:col-span-2">
            <span className="text-muted-foreground">Convenience Preference:</span>
            <span className="font-medium">{data.preferences.conveniencePreference}/5 ({getPreferenceLabel(data.preferences.conveniencePreference)})</span>
          </div>
        </div>
      </div>

      {/* Goals Summary */}
      <div className="card-clinical p-6">
        <div className="flex items-center gap-2 mb-4">
          <ListOrdered className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Goal Prioritization</h3>
        </div>
        <ol className="space-y-2 text-sm">
          {data.prioritization.rankedGoals.map((goal, index) => (
            <li key={goal.id} className="flex items-center gap-3">
              <span className="w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-bold">
                {index + 1}
              </span>
              <span>{goal.label}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Disclaimer */}
      <div className="disclaimer-banner flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-medium text-foreground mb-1">Important Notice</p>
          <p className="text-sm text-muted-foreground">
            This tool provides decision support only and does not replace professional medical advice. 
            All treatment decisions should be made in consultation with your healthcare provider.
          </p>
        </div>
      </div>

      {/* Consent */}
      <div className="card-clinical p-6 border-2 border-primary/20">
        <div className="flex items-start gap-4">
          <Checkbox
            id="consent"
            checked={data.consentGiven}
            onCheckedChange={(checked) => onConsentChange(checked as boolean)}
            className="mt-1"
          />
          <div>
            <Label htmlFor="consent" className="font-medium cursor-pointer">
              I understand and agree
            </Label>
            <p className="text-sm text-muted-foreground mt-1">
              I understand that this tool provides decision support only and does not replace 
              clinician judgment. All recommendations should be discussed with my healthcare team.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
