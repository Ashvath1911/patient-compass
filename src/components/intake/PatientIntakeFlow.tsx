import { useState } from 'react';
import { PatientIntakeData, defaultPatientIntakeData } from '@/types/patient';
import { StepIndicator } from './StepIndicator';
import { Step1BasicInfo } from './Step1BasicInfo';
import { Step2ClinicalInfo } from './Step2ClinicalInfo';
import { Step3Preferences } from './Step3Preferences';
import { Step4Prioritization } from './Step4Prioritization';
import { Step5Review } from './Step5Review';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Send, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const steps = [
  { number: 1, label: 'Basic Info' },
  { number: 2, label: 'Clinical' },
  { number: 3, label: 'Preferences' },
  { number: 4, label: 'Priorities' },
  { number: 5, label: 'Review' },
];

interface PatientIntakeFlowProps {
  onSubmit?: (data: PatientIntakeData) => Promise<void>;
}

export function PatientIntakeFlow({ onSubmit }: PatientIntakeFlowProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<PatientIntakeData>(defaultPatientIntakeData);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        const { age, sex, cancerType, diseaseStage, performanceStatus } = data.basicInfo;
        if (!age || !sex || !cancerType || !diseaseStage || performanceStatus === null) {
          toast({
            title: 'Required fields missing',
            description: 'Please fill in all required fields before continuing.',
            variant: 'destructive',
          });
          return false;
        }
        return true;
      case 2:
        return true; // Clinical info is optional
      case 3:
        return true; // Preferences have defaults
      case 4:
        return true; // Prioritization has defaults
      case 5:
        if (!data.consentGiven) {
          toast({
            title: 'Consent required',
            description: 'Please acknowledge the disclaimer to submit.',
            variant: 'destructive',
          });
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps([...completedSteps, currentStep]);
      }
      setCurrentStep((prev) => Math.min(prev + 1, 5));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(5)) return;

    setIsSubmitting(true);
    try {
      const submissionData: PatientIntakeData = {
        ...data,
        submittedAt: new Date().toISOString(),
        status: 'submitted',
      };

      if (onSubmit) {
        await onSubmit(submissionData);
      }

      toast({
        title: 'Submission successful',
        description: 'Your information has been submitted. Your care team will review it shortly.',
      });

      // Mark all steps as complete
      setCompletedSteps([1, 2, 3, 4, 5]);
      setData(submissionData);
    } catch (error) {
      toast({
        title: 'Submission failed',
        description: 'There was an error submitting your information. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1BasicInfo
            data={data.basicInfo}
            onChange={(basicInfo) => setData({ ...data, basicInfo })}
          />
        );
      case 2:
        return (
          <Step2ClinicalInfo
            data={data.clinicalInfo}
            cancerType={data.basicInfo.cancerType}
            onChange={(clinicalInfo) => setData({ ...data, clinicalInfo })}
          />
        );
      case 3:
        return (
          <Step3Preferences
            data={data.preferences}
            onChange={(preferences) => setData({ ...data, preferences })}
          />
        );
      case 4:
        return (
          <Step4Prioritization
            data={data.prioritization}
            onChange={(prioritization) => setData({ ...data, prioritization })}
          />
        );
      case 5:
        return (
          <Step5Review
            data={data}
            onConsentChange={(consentGiven) => setData({ ...data, consentGiven })}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Step Indicator */}
      <div className="mb-8">
        <StepIndicator
          steps={steps}
          currentStep={currentStep}
          completedSteps={completedSteps}
        />
      </div>

      {/* Step Content */}
      <div className="min-h-[500px]">
        {renderStep()}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center mt-8 pt-6 border-t border-border">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 1}
          className="gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </Button>

        <span className="text-sm text-muted-foreground">
          Step {currentStep} of 5
        </span>

        {currentStep < 5 ? (
          <Button onClick={handleNext} className="gap-2">
            Continue
            <ChevronRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={!data.consentGiven || isSubmitting}
            className="gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Submit
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
