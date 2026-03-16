const API_BASE = 'https://sparc-backend.onrender.com';

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

function normalizePatient(raw: Record<string, unknown>): PatientRecord {
  return {
    id: raw.id as number,
    age: raw.age as number,
    sex: raw.sex as string,
    cancer_type: raw.cancer_type as string,
    disease_stage: raw.disease_stage as string,
    performance_status: raw.performance_status as number,
    biomarkers: raw.biomarkers as string | Record<string, string>,
    prior_treatments: raw.prior_treatments as string | string[],
    comorbidities: raw.comorbidities as string | string[],
    preferences: raw.preferences as string | Record<string, number>,
    prioritized_goals: raw.prioritized_goals as string | string[],
    consent_given: raw.consent_given as boolean,
    created_at: raw.created_at as string,
    updated_at: raw.updated_at as string,
    suggestion_id: raw.suggestion_id as number | undefined,
    ai_model: raw.ai_model as string | undefined,
    confidence_score: raw.confidence_score as number | undefined,
    ai_recommendation: raw.ai_recommendation as string | Record<string, unknown> | undefined,
    guideline_sources: raw.guideline_sources as string | string[] | undefined,
    review_status: (raw.review_status ?? raw.doctor_review_status) as string | undefined,
    reviewed_at: raw.reviewed_at as string | undefined,
    suggestion_created_at: (raw.suggestion_created_at ?? raw.recommendation_date) as string | undefined,
  };
}

export async function fetchPatients(): Promise<PatientRecord[]> {
  const res = await fetch(`${API_BASE}/api/doctor/patients`, { headers });
  if (!res.ok) throw new Error('Failed to fetch patients');
  const data = await res.json();
  let list: Record<string, unknown>[] = [];
  if (Array.isArray(data)) list = data;
  else if (data && Array.isArray(data.patients)) list = data.patients;
  else if (data && Array.isArray(data.data)) list = data.data;
  else if (data && Array.isArray(data.items)) list = data.items;
  else if (data && Array.isArray(data.results)) list = data.results;
  else {
    console.error('Unexpected patients response structure:', data);
    return [];
  }
  return list.map(normalizePatient);
}

export interface PatientDetailResult {
  patient: PatientRecord;
  suggestions: Array<{
    id?: number;
    ai_recommendation?: string | Record<string, unknown>;
    confidence_score?: number;
    guideline_sources?: string | string[];
    review_status?: string;
    doctor_review_status?: string;
    created_at?: string;
  }>;
}

export async function fetchPatientDetail(id: number): Promise<PatientDetailResult> {
  const res = await fetch(`${API_BASE}/api/doctor/patients/${id}`, { headers });
  if (!res.ok) throw new Error('Failed to fetch patient details');
  const data = await res.json();
  const raw = data?.patient ?? data?.data ?? data;
  const patient = normalizePatient(raw);
  // Extract suggestions array from response
  const suggestions = data?.suggestions ?? data?.recommendations ?? [];
  return { patient, suggestions };
}

export async function fetchStats(): Promise<DoctorStats> {
  const res = await fetch(`${API_BASE}/api/doctor/stats`, { headers });
  if (!res.ok) throw new Error('Failed to fetch stats');
  const data = await res.json();
  const s = data?.stats ?? data;
  return {
    total_patients: Number(s.total_patients ?? 0),
    pending_reviews: Number(s.pending_reviews ?? 0),
    approved_recommendations: Number(s.approved_recommendations ?? s.approved_count ?? 0),
    average_confidence: Number(s.average_confidence ?? s.avg_confidence ?? 0),
  };
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
