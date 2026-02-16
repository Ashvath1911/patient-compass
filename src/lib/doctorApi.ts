const API_BASE = 'http://localhost:3001';

const headers: Record<string, string> = {
  'Content-Type': 'application/json',
};

export interface PatientRecord {
  id: number;
  age: number;
  sex: string;
  cancer_type: string;
  disease_stage: string;
  performance_status: number;
  biomarkers: string | Record<string, string>;
  prior_treatments: string | string[];
  comorbidities: string | string[];
  preferences: string | Record<string, number>;
  prioritized_goals: string | string[];
  consent_given: boolean;
  created_at: string;
  updated_at: string;
  // Joined from suggestions
  suggestion_id?: number;
  ai_model?: string;
  confidence_score?: number;
  ai_recommendation?: string | Record<string, unknown>;
  guideline_sources?: string | string[];
  review_status?: string;
  reviewed_at?: string;
  suggestion_created_at?: string;
}

export interface DoctorStats {
  total_patients: number;
  pending_reviews: number;
  approved_recommendations: number;
  average_confidence: number;
}

export async function fetchPatients(): Promise<PatientRecord[]> {
  const res = await fetch(`${API_BASE}/api/doctor/patients`, { headers });
  if (!res.ok) throw new Error('Failed to fetch patients');
  return res.json();
}

export async function fetchPatientDetail(id: number): Promise<PatientRecord> {
  const res = await fetch(`${API_BASE}/api/doctor/patients/${id}`, { headers });
  if (!res.ok) throw new Error('Failed to fetch patient details');
  return res.json();
}

export async function fetchStats(): Promise<DoctorStats> {
  const res = await fetch(`${API_BASE}/api/doctor/stats`, { headers });
  if (!res.ok) throw new Error('Failed to fetch stats');
  return res.json();
}

export async function updateReviewStatus(suggestionId: number, status: string): Promise<void> {
  const res = await fetch(`${API_BASE}/api/doctor/suggestions/${suggestionId}/status`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({ review_status: status }),
  });
  if (!res.ok) throw new Error('Failed to update review status');
}

export function parseJson<T>(value: string | T): T {
  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch {
      return value as unknown as T;
    }
  }
  return value;
}
