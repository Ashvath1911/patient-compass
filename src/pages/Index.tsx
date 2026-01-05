import { PatientIntakeFlow } from '@/components/intake/PatientIntakeFlow';
import { PatientIntakeData } from '@/types/patient';
import { Stethoscope, Shield, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  const handleSubmit = async (data: PatientIntakeData) => {
    console.log('Patient data submitted:', data);
    
    const response = await fetch('http://localhost:3001/api/patients/intake', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to submit patient data');
    }

    return response.json();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-5xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-clinical">
                <Stethoscope className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground tracking-tight">SPARC</h1>
                <p className="text-sm text-muted-foreground">
                  Shared Preference AI for Recommendation & Care
                </p>
              </div>
            </div>
            <Link 
              to="/doctor" 
              className="text-sm text-primary hover:underline font-medium flex items-center gap-1"
            >
              <Lock className="w-4 h-4" />
              Doctor Console
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/5 to-background py-12">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Personalized Treatment Guidance
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Share your preferences and clinical information to receive personalized treatment 
            recommendations aligned with clinical guidelines and your individual goals.
          </p>
          
          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-6 mt-8">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="w-5 h-5 text-success" />
              <span>HIPAA Compliant</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="w-5 h-5 text-success" />
              <span>Guideline-Based</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="w-5 h-5 text-success" />
              <span>Clinician Reviewed</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content - Intake Flow */}
      <main className="max-w-5xl mx-auto px-6 py-12">
        <PatientIntakeFlow onSubmit={handleSubmit} />
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border mt-auto">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">
              <strong>Important:</strong> This tool provides clinical decision support only and does not 
              replace professional medical advice.
            </p>
            <p className="text-xs text-muted-foreground">
              All recommendations should be discussed with your healthcare provider. 
              SPARC is powered by guideline-aware AI.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
