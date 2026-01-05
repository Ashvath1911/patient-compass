import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

interface PreferenceSliderProps {
  label: string;
  description: string;
  value: number;
  onChange: (value: number) => void;
  lowLabel?: string;
  highLabel?: string;
}

export function PreferenceSlider({
  label,
  description,
  value,
  onChange,
  lowLabel = 'Not Important',
  highLabel = 'Very Important',
}: PreferenceSliderProps) {
  const getValueLabel = (val: number) => {
    switch (val) {
      case 1: return 'Not Important';
      case 2: return 'Slightly Important';
      case 3: return 'Moderately Important';
      case 4: return 'Very Important';
      case 5: return 'Extremely Important';
      default: return 'Moderately Important';
    }
  };

  const getValueColor = (val: number) => {
    if (val <= 2) return 'text-destructive';
    if (val === 3) return 'text-warning';
    return 'text-success';
  };

  return (
    <div className="card-clinical p-6 space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-foreground">{label}</h3>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>
        <div className="text-right">
          <span className={cn('text-2xl font-bold', getValueColor(value))}>{value}</span>
          <p className={cn('text-xs font-medium', getValueColor(value))}>{getValueLabel(value)}</p>
        </div>
      </div>

      <div className="pt-2">
        <Slider
          value={[value]}
          onValueChange={(vals) => onChange(vals[0])}
          min={1}
          max={5}
          step={1}
          className="preference-slider"
        />
        <div className="flex justify-between mt-2">
          <span className="text-xs text-muted-foreground">{lowLabel}</span>
          <span className="text-xs text-muted-foreground">{highLabel}</span>
        </div>
      </div>
    </div>
  );
}
