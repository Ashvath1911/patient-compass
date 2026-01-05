import { PatientClinicalInfo, biomarkersByCancer, priorTreatmentOptions, comorbidityOptions } from '@/types/patient';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FlaskConical, Pill, HeartPulse } from 'lucide-react';

interface Step2Props {
  data: PatientClinicalInfo;
  cancerType: string | null;
  onChange: (data: PatientClinicalInfo) => void;
}

export function Step2ClinicalInfo({ data, cancerType, onChange }: Step2Props) {
  const biomarkers = cancerType ? biomarkersByCancer[cancerType] || [] : [];

  const updateBiomarker = (key: string, value: string) => {
    onChange({
      ...data,
      biomarkers: { ...data.biomarkers, [key]: value },
    });
  };

  const toggleTreatment = (treatment: string) => {
    const treatments = data.priorTreatments.includes(treatment)
      ? data.priorTreatments.filter((t) => t !== treatment)
      : [...data.priorTreatments, treatment];
    onChange({ ...data, priorTreatments: treatments });
  };

  const toggleComorbidity = (comorbidity: string) => {
    const comorbidities = data.comorbidities.includes(comorbidity)
      ? data.comorbidities.filter((c) => c !== comorbidity)
      : [...data.comorbidities, comorbidity];
    onChange({ ...data, comorbidities: comorbidities });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
          <FlaskConical className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Clinical Information</h2>
        <p className="text-muted-foreground mt-2">
          Tell us about your biomarkers, prior treatments, and other health conditions.
        </p>
      </div>

      {/* Biomarkers Section */}
      {biomarkers.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">Biomarker Status</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Based on your cancer type, please provide the following biomarker information if available.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {biomarkers.map((biomarker) => (
              <div key={biomarker.key} className="space-y-2">
                <Label className="text-sm font-medium">{biomarker.label}</Label>
                <Select
                  value={data.biomarkers[biomarker.key] || ''}
                  onValueChange={(value) => updateBiomarker(biomarker.key, value)}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {biomarker.options.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Prior Treatments */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Pill className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Prior Treatments</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Select all treatments you have received previously.
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {priorTreatmentOptions.map((treatment) => (
            <div
              key={treatment}
              className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:border-primary/50 transition-colors cursor-pointer"
              onClick={() => toggleTreatment(treatment)}
            >
              <Checkbox
                id={`treatment-${treatment}`}
                checked={data.priorTreatments.includes(treatment)}
                onCheckedChange={() => toggleTreatment(treatment)}
              />
              <Label
                htmlFor={`treatment-${treatment}`}
                className="text-sm cursor-pointer flex-1"
              >
                {treatment}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Comorbidities */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <HeartPulse className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Other Health Conditions</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Select any other health conditions you currently have.
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {comorbidityOptions.map((comorbidity) => (
            <div
              key={comorbidity}
              className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:border-primary/50 transition-colors cursor-pointer"
              onClick={() => toggleComorbidity(comorbidity)}
            >
              <Checkbox
                id={`comorbidity-${comorbidity}`}
                checked={data.comorbidities.includes(comorbidity)}
                onCheckedChange={() => toggleComorbidity(comorbidity)}
              />
              <Label
                htmlFor={`comorbidity-${comorbidity}`}
                className="text-sm cursor-pointer flex-1"
              >
                {comorbidity}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
