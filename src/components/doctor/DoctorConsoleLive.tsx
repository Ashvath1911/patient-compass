import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  fetchPatients,
  fetchPatientDetail,
  fetchStats,
  updateReviewStatus,
  parseJson,
  type PatientRecord,
  type DoctorStats,
} from '@/lib/doctorApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import {
  Stethoscope,
  Users,
  Clock,
  CheckCircle,
  BarChart3,
  RefreshCw,
  Eye,
  ArrowLeft,
  Star,
  Loader2,
  Inbox,
} from 'lucide-react';
import { cn } from '@/lib/utils';

function StatusBadge({ status }: { status?: string }) {
  if (!status) return <Badge variant="outline">No Review</Badge>;
  const map: Record<string, { class: string; label: string }> = {
    pending: { class: 'bg-warning/10 text-warning border-warning/20', label: 'Pending' },
    approved: { class: 'bg-success/10 text-success border-success/20', label: 'Approved' },
    rejected: { class: 'bg-destructive/10 text-destructive border-destructive/20', label: 'Rejected' },
    needs_revision: { class: 'bg-info/10 text-info border-info/20', label: 'Needs Revision' },
  };
  const s = map[status] ?? { class: '', label: status };
  return <Badge variant="outline" className={s.class}>{s.label}</Badge>;
}

function ConfidenceStars({ score }: { score?: number }) {
  if (!score) return <span className="text-muted-foreground text-sm">N/A</span>;
  const color = score >= 3 ? 'text-success' : score === 2 ? 'text-warning' : 'text-destructive';
  return (
    <span className={cn('flex items-center gap-0.5', color)}>
      {Array.from({ length: 3 }, (_, i) => (
        <Star key={i} className="w-4 h-4" fill={i < score ? 'currentColor' : 'none'} />
      ))}
    </span>
  );
}

function formatDate(d?: string) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function renderJsonList(value: unknown): string[] {
  const parsed = parseJson(value);
  if (Array.isArray(parsed)) return parsed.map(String);
  if (typeof parsed === 'object' && parsed !== null) {
    return Object.entries(parsed).map(([k, v]) => `${k}: ${v}`);
  }
  return [String(parsed)];
}

export function DoctorConsoleLive() {
  const { toast } = useToast();
  const [patients, setPatients] = useState<PatientRecord[]>([]);
  const [stats, setStats] = useState<DoctorStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedPatient, setSelectedPatient] = useState<PatientRecord | null>(null);
  const [selectedSuggestions, setSelectedSuggestions] = useState<any[]>([]);
  const [detailLoading, setDetailLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [reviewStatus, setReviewStatus] = useState('');
  const [saving, setSaving] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [p, s] = await Promise.all([fetchPatients(), fetchStats()]);
      setPatients(p);
      setStats(s);
    } catch (e) {
      toast({ title: 'Error loading data', description: (e as Error).message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => { loadData(); }, [loadData]);

  const openDetail = async (patient: PatientRecord) => {
    setModalOpen(true);
    setDetailLoading(true);
    try {
      const detail = await fetchPatientDetail(patient.id);
      setSelectedPatient(detail);
      setReviewStatus(detail.review_status || 'pending');
    } catch {
      setSelectedPatient(patient);
      setReviewStatus(patient.review_status || 'pending');
    } finally {
      setDetailLoading(false);
    }
  };

  const handleSaveStatus = async () => {
    if (!selectedPatient?.suggestion_id) return;
    setSaving(true);
    try {
      await updateReviewStatus(selectedPatient.suggestion_id, reviewStatus);
      toast({ title: 'Status updated', description: `Review status set to "${reviewStatus}"` });
      setSelectedPatient({ ...selectedPatient, review_status: reviewStatus });
      loadData();
    } catch (e) {
      toast({ title: 'Update failed', description: (e as Error).message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const filtered = (patients ?? []).filter((p) => {
    const matchSearch = search === '' || [p.cancer_type, p.sex, String(p.age), p.disease_stage, String(p.id)]
      .some((f) => f?.toLowerCase().includes(search.toLowerCase()));
    const matchStatus = statusFilter === 'all' || (p.review_status || '') === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <>
      <Helmet>
        <title>Doctor Console | SPARC</title>
        <meta name="description" content="Review AI-generated treatment recommendations for oncology patients" />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="bg-card border-b border-border sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <Stethoscope className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">Doctor Console — SPARC AI Recommendations</h1>
                  <p className="text-sm text-muted-foreground">Review AI-generated treatment recommendations</p>
                </div>
              </div>
              <Link to="/">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-1" /> Home
                </Button>
              </Link>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Patients</CardTitle>
                <Users className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.total_patients ?? '—'}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Pending Reviews</CardTitle>
                <Clock className="w-4 h-4 text-warning" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.pending_reviews ?? '—'}</div>
                {stats && stats.pending_reviews > 0 && (
                  <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20 mt-1">
                    {stats.pending_reviews} awaiting
                  </Badge>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Approved</CardTitle>
                <CheckCircle className="w-4 h-4 text-success" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.approved_recommendations ?? '—'}</div>
                {stats && stats.approved_recommendations > 0 && (
                  <Badge variant="outline" className="bg-success/10 text-success border-success/20 mt-1">
                    {stats.approved_recommendations} approved
                  </Badge>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Avg Confidence</CardTitle>
                <BarChart3 className="w-4 h-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats?.average_confidence != null ? `${((stats.average_confidence / 3) * 100).toFixed(0)}%` : '—'}
                </div>
                {stats?.average_confidence != null && (
                  <Progress value={(stats.average_confidence / 3) * 100} className="mt-2 h-2" />
                )}
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              placeholder="Search by patient info..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="sm:max-w-xs"
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="needs_revision">Needs Revision</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={loadData} disabled={loading}>
              <RefreshCw className={cn('w-4 h-4 mr-1', loading && 'animate-spin')} />
              Refresh
            </Button>
          </div>

          {/* Patient Table */}
          <Card>
            <CardContent className="p-0">
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-6 h-6 animate-spin text-primary mr-2" />
                  <span className="text-muted-foreground">Loading patients...</span>
                </div>
              ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                  <Inbox className="w-10 h-10 mb-2" />
                  <p>No patients found</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Age</TableHead>
                      <TableHead>Sex</TableHead>
                      <TableHead>Cancer Type</TableHead>
                      <TableHead>Stage</TableHead>
                      <TableHead>AI Status</TableHead>
                      <TableHead>Review</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell className="font-mono text-xs">#{p.id}</TableCell>
                        <TableCell>{p.age}</TableCell>
                        <TableCell className="capitalize">{p.sex}</TableCell>
                        <TableCell>{p.cancer_type}</TableCell>
                        <TableCell>{p.disease_stage}</TableCell>
                        <TableCell>
                          {p.suggestion_id ? (
                            <Badge className="bg-success/10 text-success border-success/20" variant="outline">Yes</Badge>
                          ) : (
                            <Badge variant="outline">No</Badge>
                          )}
                        </TableCell>
                        <TableCell><StatusBadge status={p.review_status} /></TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" variant="outline" onClick={() => openDetail(p)}>
                            <Eye className="w-4 h-4 mr-1" /> View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </main>

        {/* Detail Modal */}
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Patient #{selectedPatient?.id} — Detail View</DialogTitle>
            </DialogHeader>

            {detailLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : selectedPatient && (
              <div className="grid md:grid-cols-2 gap-6 mt-4">
                {/* Left: Patient Data */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground border-b border-border pb-2">Patient Data</h3>
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between"><dt className="text-muted-foreground">Age</dt><dd className="font-medium">{selectedPatient.age}</dd></div>
                    <div className="flex justify-between"><dt className="text-muted-foreground">Sex</dt><dd className="font-medium capitalize">{selectedPatient.sex}</dd></div>
                    <div className="flex justify-between"><dt className="text-muted-foreground">Cancer Type</dt><dd className="font-medium">{selectedPatient.cancer_type}</dd></div>
                    <div className="flex justify-between"><dt className="text-muted-foreground">Disease Stage</dt><dd className="font-medium">{selectedPatient.disease_stage}</dd></div>
                    <div className="flex justify-between"><dt className="text-muted-foreground">Performance Status</dt><dd className="font-medium">ECOG {selectedPatient.performance_status}</dd></div>
                    <div className="flex justify-between"><dt className="text-muted-foreground">Submitted</dt><dd className="font-medium">{formatDate(selectedPatient.created_at)}</dd></div>
                  </dl>

                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Biomarkers</h4>
                    <div className="flex flex-wrap gap-1">
                      {renderJsonList(selectedPatient.biomarkers).map((b, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">{b}</Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Prior Treatments</h4>
                    <div className="flex flex-wrap gap-1">
                      {renderJsonList(selectedPatient.prior_treatments).map((t, i) => (
                        <Badge key={i} variant="outline" className="text-xs">{t}</Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Comorbidities</h4>
                    <div className="flex flex-wrap gap-1">
                      {renderJsonList(selectedPatient.comorbidities).map((c, i) => (
                        <Badge key={i} variant="outline" className="text-xs">{c}</Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right: AI Recommendation */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground border-b border-border pb-2">AI Recommendation</h3>

                  {selectedPatient.suggestion_id ? (
                    <>
                      <dl className="space-y-2 text-sm">
                        <div className="flex justify-between"><dt className="text-muted-foreground">AI Model</dt><dd className="font-medium">{selectedPatient.ai_model || '—'}</dd></div>
                        <div className="flex justify-between items-center">
                          <dt className="text-muted-foreground">Confidence</dt>
                          <dd><ConfidenceStars score={selectedPatient.confidence_score} /></dd>
                        </div>
                        <div className="flex justify-between"><dt className="text-muted-foreground">Generated</dt><dd className="font-medium">{formatDate(selectedPatient.suggestion_created_at)}</dd></div>
                      </dl>

                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Recommendation</h4>
                        <div className="bg-secondary/50 rounded-lg p-3 text-sm space-y-1 max-h-48 overflow-y-auto">
                          {renderJsonList(selectedPatient.ai_recommendation).map((line, i) => (
                            <p key={i}>{line}</p>
                          ))}
                        </div>
                      </div>

                      {selectedPatient.guideline_sources && (
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground mb-1">Guideline Sources</h4>
                          <div className="flex flex-wrap gap-1">
                            {renderJsonList(selectedPatient.guideline_sources).map((s, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">{s}</Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="border-t border-border pt-4 space-y-3">
                        <h4 className="text-sm font-medium">Review Status</h4>
                        <div className="flex items-center gap-2">
                          <Select value={reviewStatus} onValueChange={setReviewStatus}>
                            <SelectTrigger className="w-[180px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="approved">Approved</SelectItem>
                              <SelectItem value="rejected">Rejected</SelectItem>
                              <SelectItem value="needs_revision">Needs Revision</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button onClick={handleSaveStatus} disabled={saving} size="sm">
                            {saving ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <CheckCircle className="w-4 h-4 mr-1" />}
                            Save
                          </Button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                      <Inbox className="w-8 h-8 mb-2" />
                      <p className="text-sm">No AI recommendation generated yet</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
