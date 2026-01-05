import { PatientPreferences } from '@/types/patient';
import { PreferenceSlider } from './PreferenceSlider';
import { Heart, Shield, DollarSign, Clock, Sparkles } from 'lucide-react';

interface Step3Props {
  data: PatientPreferences;
  onChange: (data: PatientPreferences) => void;
}

const preferenceConfig = [
  {
    key: 'survivalBenefit' as const,
    label: 'Survival Benefit',
    description: 'How important is maximizing your length of survival?',
    icon: Heart,
    lowLabel: 'Less Important',
    highLabel: 'Top Priority',
  },
  {
    key: 'qualityOfLife' as const,
    label: 'Quality of Life',
    description: 'How important is maintaining your current quality of life during treatment?',
    icon: Sparkles,
    lowLabel: 'Can Compromise',
    highLabel: 'Essential',
  },
  {
    key: 'toxicityTolerance' as const,
    label: 'Toxicity Tolerance',
    description: 'How willing are you to accept treatment side effects?',
    icon: Shield,
    lowLabel: 'Avoid Side Effects',
    highLabel: 'Accept if Needed',
  },
  {
    key: 'costSensitivity' as const,
    label: 'Cost Sensitivity',
    description: 'How much does treatment cost factor into your decision?',
    icon: DollarSign,
    lowLabel: 'Not a Factor',
    highLabel: 'Major Factor',
  },
  {
    key: 'conveniencePreference' as const,
    label: 'Convenience Preference',
    description: 'How important is treatment convenience (e.g., oral vs. infusion, frequency of visits)?',
    icon: Clock,
    lowLabel: 'Not Important',
    highLabel: 'Very Important',
  },
];

export function Step3Preferences({ data, onChange }: Step3Props) {
  const updatePreference = (key: keyof PatientPreferences, value: number) => {
    onChange({ ...data, [key]: value });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
          <Heart className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Your Preferences</h2>
        <p className="text-muted-foreground mt-2">
          Rate each factor from 1 (not important) to 5 (extremely important) to help us understand your priorities.
        </p>
      </div>

      <div className="space-y-4 stagger-children">
        {preferenceConfig.map((pref) => (
          <PreferenceSlider
            key={pref.key}
            label={pref.label}
            description={pref.description}
            value={data[pref.key]}
            onChange={(value) => updatePreference(pref.key, value)}
            lowLabel={pref.lowLabel}
            highLabel={pref.highLabel}
          />
        ))}
      </div>

      <div className="bg-info/10 border border-info/20 rounded-lg p-4 mt-6">
        <p className="text-sm text-info">
          <strong>Note:</strong> These preferences help personalize treatment recommendations. 
          There are no right or wrong answers – only what matters most to you.
        </p>
      </div>
    </div>
  );
}
