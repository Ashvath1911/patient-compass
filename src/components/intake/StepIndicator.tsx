import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step {
  number: number;
  label: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
  completedSteps: number[];
}

export function StepIndicator({ steps, currentStep, completedSteps }: StepIndicatorProps) {
  return (
    <div className="w-full">
      {/* Progress bar */}
      <div className="progress-clinical mb-6">
        <div
          className="progress-clinical-fill"
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        />
      </div>

      {/* Step indicators */}
      <div className="flex justify-between">
        {steps.map((step) => {
          const isComplete = completedSteps.includes(step.number);
          const isActive = currentStep === step.number;
          const isPending = !isComplete && !isActive;

          return (
            <div key={step.number} className="flex flex-col items-center">
              <div
                className={cn(
                  'step-indicator',
                  isComplete && 'step-complete',
                  isActive && 'step-active',
                  isPending && 'step-pending'
                )}
              >
                {isComplete ? (
                  <Check className="w-5 h-5" />
                ) : (
                  step.number
                )}
              </div>
              <span
                className={cn(
                  'mt-2 text-xs font-medium text-center max-w-[80px]',
                  isActive ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
