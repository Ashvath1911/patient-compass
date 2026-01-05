import { PatientIntakeData } from '@/types/patient';
import { User, Activity, FlaskConical, Heart, ListOrdered } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PatientSummaryPanelProps {
  patient: PatientIntakeData;
  className?: string;
}

export function PatientSummaryPanel({ patient, className }: PatientSummaryPanelProps) {
  const getPreferenceColor = (value: number) => {
    if (value >= 4) return 'bg-success';
    if (value >= 3) return 'bg-warning';
    return 'bg-muted';
  };

  const preferences = [
    { label: 'Survival', value: patient.preferences.survivalBenefit },
    { label: 'QoL', value: patient.preferences.qualityOfLife },
    { label: 'Toxicity Tol.', value: patient.preferences.toxicityTolerance },
    { label: 'Cost Sens.', value: patient.preferences.costSensitivity },
    { label: 'Convenience', value: patient.preferences.conveniencePreference },
  ];

  return (
    <div className={cn('card-clinical p-6 space-y-6', className)}>
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">Patient Summary</h2>
            <p className="text-sm text-muted-foreground">
              {patient.basicInfo.age} years, {patient.basicInfo.sex}
            </p>
          </div>
        </div>
        <span className="clinical-badge bg-info/10 text-info">
          ECOG {patient.basicInfo.performanceStatus}
        </span>
      </div>

      {/* Diagnosis */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Activity className="w-4 h-4" />
          Diagnosis
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="clinical-badge bg-primary/10 text-primary border border-primary/20">
            {patient.basicInfo.cancerType}
          </span>
          <span className="clinical-badge bg-secondary text-secondary-foreground">
            {patient.basicInfo.diseaseStage}
          </span>
        </div>
      </div>

      {/* Biomarkers */}
      {Object.keys(patient.clinicalInfo.biomarkers).length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <FlaskConical className="w-4 h-4" />
            Biomarkers
          </div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(patient.clinicalInfo.biomarkers).map(([key, value]) => (
              <span key={key} className="clinical-badge bg-info/10 text-info text-xs">
                {key.toUpperCase()}: {value}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Prior Treatments */}
      {patient.clinicalInfo.priorTreatments.length > 0 && (
        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">Prior Treatments</div>
          <div className="flex flex-wrap gap-1">
            {patient.clinicalInfo.priorTreatments.map((treatment) => (
              <span key={treatment} className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                {treatment}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Preferences Visual */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Heart className="w-4 h-4" />
          Patient Preferences
        </div>
        <div className="space-y-2">
          {preferences.map((pref) => (
            <div key={pref.label} className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground w-24">{pref.label}</span>
              <div className="flex-1 flex gap-1">
                {[1, 2, 3, 4, 5].map((level) => (
                  <div
                    key={level}
                    className={cn(
                      'h-2 flex-1 rounded-full transition-colors',
                      level <= pref.value ? getPreferenceColor(pref.value) : 'bg-muted'
                    )}
                  />
                ))}
              </div>
              <span className="text-xs font-medium w-4">{pref.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Goal Priorities */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <ListOrdered className="w-4 h-4" />
          Goal Priorities
        </div>
        <ol className="space-y-1">
          {patient.prioritization.rankedGoals.slice(0, 3).map((goal, index) => (
            <li key={goal.id} className="flex items-center gap-2 text-sm">
              <span className="w-5 h-5 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-bold">
                {index + 1}
              </span>
              <span className="text-foreground">{goal.label}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
