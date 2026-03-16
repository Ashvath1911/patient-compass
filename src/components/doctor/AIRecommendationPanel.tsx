import { parseJson } from '@/lib/doctorApi';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertTriangle, BookOpen, MessageSquare, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Suggestion {
  ai_recommendation?: string | Record<string, unknown>;
  confidence_score?: number;
  guideline_sources?: string | string[];
  doctor_review_status?: string;
  review_status?: string;
}

interface Props {
  suggestions?: Suggestion[];
}

function Section({ title, icon, children }: { title: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-semibold text-foreground flex items-center gap-2 uppercase tracking-wide">
        {icon}{title}
      </h4>
      {children}
    </div>
  );
}

function ConfidenceBadge({ level }: { level?: string }) {
  if (!level) return null;
  const map: Record<string, string> = {
    low: 'bg-destructive/10 text-destructive border-destructive/20',
    moderate: 'bg-warning/10 text-warning border-warning/20',
    high: 'bg-success/10 text-success border-success/20',
  };
  return <Badge variant="outline" className={cn('capitalize', map[level] ?? '')}>{level}</Badge>;
}

export function AIRecommendationPanel({ suggestions }: Props) {
  if (!suggestions || suggestions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
        <AlertTriangle className="w-8 h-8 mb-2" />
        <p className="text-sm">No AI recommendation generated yet</p>
      </div>
    );
  }

  const suggestion = suggestions[0];
  const rec = parseJson<Record<string, any>>(suggestion.ai_recommendation as any);
  const status = suggestion.review_status ?? suggestion.doctor_review_status;

  if (!rec || typeof rec !== 'object') {
    return <p className="text-sm text-muted-foreground">Unable to parse recommendation data.</p>;
  }

  const contextSummary = rec.context_summary;
  const options = rec.evidence_based_options ?? [];
  const prefConsiderations = rec.preference_aware_considerations ?? [];
  const uncertainties = rec.uncertainties_or_variation ?? [];
  const decisionPrompt = rec.shared_decision_prompt;
  const confidence = rec.confidence;
  const guidelineSources = parseJson<any[]>(suggestion.guideline_sources as any);

  return (
    <div className="space-y-6">
      {/* Status badge */}
      {status && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Review Status:</span>
          <Badge variant="outline" className="capitalize">{status.replace('_', ' ')}</Badge>
        </div>
      )}

      {/* Clinical Context */}
      {contextSummary && Array.isArray(contextSummary) && contextSummary.length > 0 && (
        <Section title="Clinical Context" icon={<BookOpen className="w-4 h-4" />}>
          <div className="bg-secondary/50 rounded-lg p-4 text-sm space-y-2">
            <p>{contextSummary[0]?.summary}</p>
            {contextSummary[0]?.evidence_sources && (
              <div className="flex flex-wrap gap-1 mt-2">
                {contextSummary[0].evidence_sources.map((src: any, i: number) => (
                  <Badge key={i} variant="secondary" className="text-xs">
                    {typeof src === 'string' ? src : src.source ?? JSON.stringify(src)}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </Section>
      )}

      {/* Treatment Options */}
      {options.length > 0 && (
        <Section title="Evidence-Based Treatment Options">
          <div className="space-y-4">
            {options.map((opt: any, idx: number) => (
              <div key={idx} className="border border-border rounded-lg p-4 space-y-3">
                <h5 className="font-semibold text-foreground">
                  {idx + 1}. {opt.title ?? opt.option_title ?? 'Treatment Option'}
                </h5>
                {opt.who_this_applies_to && (
                  <p className="text-xs text-muted-foreground italic">{opt.who_this_applies_to}</p>
                )}
                {(opt.clinical_summary ?? opt.clinicalSummary) && (
                  <p className="text-sm text-foreground">{opt.clinical_summary ?? opt.clinicalSummary}</p>
                )}

                {/* Pros */}
                {(opt.pros?.length > 0) && (
                  <div>
                    <span className="text-xs font-medium text-success">Pros</span>
                    <ul className="mt-1 space-y-1">
                      {opt.pros.map((p: any, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-success shrink-0 mt-0.5" />
                          <span>{typeof p === 'string' ? p : p.point ?? JSON.stringify(p)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Cons */}
                {(opt.cons?.length > 0) && (
                  <div>
                    <span className="text-xs font-medium text-destructive">Cons</span>
                    <ul className="mt-1 space-y-1">
                      {opt.cons.map((c: any, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <XCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                          <span>{typeof c === 'string' ? c : c.point ?? JSON.stringify(c)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {opt.quality_of_life_considerations && (
                  <p className="text-xs text-muted-foreground border-t border-border pt-2">
                    <strong>QoL:</strong> {opt.quality_of_life_considerations}
                  </p>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Patient Preferences */}
      {prefConsiderations.length > 0 && (
        <Section title="Patient Preferences" icon={<Star className="w-4 h-4" />}>
          <div className="space-y-2">
            {prefConsiderations.map((pc: any, i: number) => (
              <div key={i} className="bg-secondary/30 rounded-lg p-3 text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{pc.preference}</span>
                  {pc.preference_driven && (
                    <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">Preference-Driven</Badge>
                  )}
                </div>
                {pc.how_it_changes_tradeoffs && (
                  <p className="text-muted-foreground mt-1">{pc.how_it_changes_tradeoffs}</p>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Uncertainties */}
      {uncertainties.length > 0 && (
        <Section title="Uncertainties" icon={<AlertTriangle className="w-4 h-4" />}>
          <div className="space-y-2">
            {uncertainties.map((u: any, i: number) => (
              <div key={i} className="bg-warning/5 border border-warning/10 rounded-lg p-3 text-sm space-y-1">
                <p className="font-medium">{u.issue}</p>
                {u.why_uncertain && <p className="text-muted-foreground">{u.why_uncertain}</p>}
                {u.what_to_clarify && Array.isArray(u.what_to_clarify) && (
                  <ul className="list-disc list-inside text-muted-foreground">
                    {u.what_to_clarify.map((item: string, j: number) => <li key={j}>{item}</li>)}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Shared Decision Prompt */}
      {decisionPrompt && (
        <Section title="Shared Decision Prompt" icon={<MessageSquare className="w-4 h-4" />}>
          <div className="bg-primary/5 border border-primary/10 rounded-lg p-4">
            <p className="text-sm italic text-foreground">{decisionPrompt}</p>
          </div>
        </Section>
      )}

      {/* Confidence */}
      {confidence && (
        <Section title="Confidence Assessment">
          <div className="flex items-center gap-3">
            <ConfidenceBadge level={confidence.level} />
            {confidence.reason && <p className="text-sm text-muted-foreground">{confidence.reason}</p>}
          </div>
        </Section>
      )}

      {/* Guideline Sources */}
      {guidelineSources && Array.isArray(guidelineSources) && guidelineSources.length > 0 && (
        <Section title="Guideline Sources" icon={<BookOpen className="w-4 h-4" />}>
          <div className="flex flex-wrap gap-1">
            {guidelineSources.map((s: any, i: number) => (
              <Badge key={i} variant="secondary" className="text-xs">
                {typeof s === 'string' ? s : s.source ?? s.name ?? JSON.stringify(s)}
              </Badge>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}
