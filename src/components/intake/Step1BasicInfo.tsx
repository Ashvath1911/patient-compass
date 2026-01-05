import { PatientBasicInfo, cancerTypes, diseaseStages, performanceStatuses } from '@/types/patient';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { User, Activity, Stethoscope } from 'lucide-react';

interface Step1Props {
  data: PatientBasicInfo;
  onChange: (data: PatientBasicInfo) => void;
}

export function Step1BasicInfo({ data, onChange }: Step1Props) {
  const updateField = <K extends keyof PatientBasicInfo>(field: K, value: PatientBasicInfo[K]) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
          <User className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Basic Information</h2>
        <p className="text-muted-foreground mt-2">
          Let's start with some basic information about you and your diagnosis.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Age */}
        <div className="space-y-2">
          <Label htmlFor="age" className="text-sm font-medium">
            Age <span className="text-destructive">*</span>
          </Label>
          <Input
            id="age"
            type="number"
            min={18}
            max={120}
            placeholder="Enter your age"
            value={data.age || ''}
            onChange={(e) => updateField('age', e.target.value ? parseInt(e.target.value) : null)}
            className="h-12"
          />
        </div>

        {/* Sex */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            Sex <span className="text-destructive">*</span>
          </Label>
          <RadioGroup
            value={data.sex || ''}
            onValueChange={(value) => updateField('sex', value as PatientBasicInfo['sex'])}
            className="flex gap-4 pt-2"
          >
            {['male', 'female', 'other'].map((sex) => (
              <div key={sex} className="flex items-center space-x-2">
                <RadioGroupItem value={sex} id={sex} />
                <Label htmlFor={sex} className="capitalize cursor-pointer">
                  {sex}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </div>

      {/* Cancer Type */}
      <div className="space-y-2">
        <Label className="text-sm font-medium flex items-center gap-2">
          <Stethoscope className="w-4 h-4" />
          Cancer Type <span className="text-destructive">*</span>
        </Label>
        <Select
          value={data.cancerType || ''}
          onValueChange={(value) => updateField('cancerType', value)}
        >
          <SelectTrigger className="h-12">
            <SelectValue placeholder="Select cancer type" />
          </SelectTrigger>
          <SelectContent>
            {cancerTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Disease Stage */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">
          Disease Stage <span className="text-destructive">*</span>
        </Label>
        <Select
          value={data.diseaseStage || ''}
          onValueChange={(value) => updateField('diseaseStage', value)}
        >
          <SelectTrigger className="h-12">
            <SelectValue placeholder="Select disease stage" />
          </SelectTrigger>
          <SelectContent>
            {diseaseStages.map((stage) => (
              <SelectItem key={stage} value={stage}>
                {stage}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Performance Status */}
      <div className="space-y-3">
        <Label className="text-sm font-medium flex items-center gap-2">
          <Activity className="w-4 h-4" />
          Performance Status (ECOG) <span className="text-destructive">*</span>
        </Label>
        <p className="text-sm text-muted-foreground">
          Your general level of functioning and ability to carry out daily activities.
        </p>
        <RadioGroup
          value={data.performanceStatus?.toString() || ''}
          onValueChange={(value) => updateField('performanceStatus', parseInt(value))}
          className="space-y-3"
        >
          {performanceStatuses.map((status) => (
            <div
              key={status.value}
              className="flex items-start space-x-3 p-4 rounded-lg border border-border hover:border-primary/50 transition-colors cursor-pointer"
            >
              <RadioGroupItem value={status.value.toString()} id={`ecog-${status.value}`} className="mt-1" />
              <div className="flex-1">
                <Label htmlFor={`ecog-${status.value}`} className="font-medium cursor-pointer">
                  {status.label}
                </Label>
                <p className="text-sm text-muted-foreground mt-1">{status.description}</p>
              </div>
            </div>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
}
