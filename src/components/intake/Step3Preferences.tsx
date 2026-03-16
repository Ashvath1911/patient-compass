import { PatientPreferences } from '@/types/patient';
import { Heart, Shield, DollarSign, Clock, Sparkles } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

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
  },
  {
    key: 'qualityOfLife' as const,
    label: 'Quality of Life',
    description: 'How important is maintaining your current quality of life during treatment?',
    icon: Sparkles,
  },
  {
    key: 'toxicityTolerance' as const,
    label: 'Toxicity Tolerance',
    description: 'How willing are you to accept treatment side effects?',
    icon: Shield,
  },
  {
    key: 'costSensitivity' as const,
    label: 'Cost Sensitivity',
    description: 'How much does treatment cost factor into your decision?',
    icon: DollarSign,
  },
  {
    key: 'conveniencePreference' as const,
    label: 'Convenience Preference',
    description: 'How important is treatment convenience (e.g., oral vs. infusion, frequency of visits)?',
    icon: Clock,
  },
];

const rankLabels: Record<number, string> = {
  1: '1 — Least Important',
  2: '2 — Slightly Important',
  3: '3 — Moderately Important',
  4: '4 — Very Important',
  5: '5 — Most Important',
};

export function Step3Preferences({ data, onChange }: Step3Props) {
  // Collect used values (excluding 0/unset)
  const usedValues = new Set(
    preferenceConfig
      .map((p) => data[p.key])
      .filter((v) => v >= 1 && v <= 5)
  );

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
          Rank each factor from 1 (least important) to 5 (most important). Each ranking can only be used once.
        </p>
      </div>

      <div className="space-y-4 stagger-children">
        {preferenceConfig.map((pref) => {
          const Icon = pref.icon;
          const currentValue = data[pref.key];

          return (
            <div key={pref.key} className="card-clinical p-6 space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground">{pref.label}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{pref.description}</p>
                </div>
                <div className="shrink-0 w-[220px]">
                  <Select
                    value={currentValue >= 1 && currentValue <= 5 ? String(currentValue) : ''}
                    onValueChange={(v) => updatePreference(pref.key, Number(v))}
                  >
                    <SelectTrigger className={cn(
                      'w-full',
                      currentValue >= 1 && currentValue <= 5 ? 'border-primary/40' : ''
                    )}>
                      <SelectValue placeholder="Select ranking" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map((n) => {
                        const isUsedElsewhere = usedValues.has(n) && currentValue !== n;
                        return (
                          <SelectItem key={n} value={String(n)} disabled={isUsedElsewhere}>
                            {rankLabels[n]}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-info/10 border border-info/20 rounded-lg p-4 mt-6">
        <p className="text-sm text-info">
          <strong>Note:</strong> Each ranking (1–5) can only be used once. 
          This ensures your preferences are clearly prioritized.
        </p>
      </div>
    </div>
  );
}
