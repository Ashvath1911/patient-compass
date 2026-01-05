import { TreatmentOption } from '@/types/patient';
import { useState } from 'react';
import { ChevronDown, ChevronUp, Check, AlertTriangle, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TreatmentOptionCardProps {
  option: TreatmentOption;
}

export function TreatmentOptionCard({ option }: TreatmentOptionCardProps) {
  const [isExpanded, setIsExpanded] = useState(option.rank === 1);

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1: return 'rank-1';
      case 2: return 'rank-2';
      case 3: return 'rank-3';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getRankLabel = (rank: number) => {
    switch (rank) {
      case 1: return 'Primary Option';
      case 2: return 'Alternative Option';
      case 3: return 'Third Option';
      default: return `Option ${rank}`;
    }
  };

  return (
    <div className="treatment-card">
      {/* Header - Always Visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-6 flex items-start gap-4 text-left hover:bg-muted/30 transition-colors"
      >
        <div className={cn('treatment-card-rank flex-shrink-0', getRankStyle(option.rank))}>
          {option.rank}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {getRankLabel(option.rank)}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-foreground">
            {option.title}
          </h3>
          {!isExpanded && (
            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
              {option.clinicalSummary}
            </p>
          )}
        </div>

        <div className="flex-shrink-0 p-2">
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          )}
        </div>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-6 pb-6 space-y-6 animate-fade-in">
          {/* Clinical Summary */}
          <div className="pl-12">
            <p className="text-foreground leading-relaxed">
              {option.clinicalSummary}
            </p>
          </div>

          {/* Pros */}
          <div className="pl-12">
            <h4 className="flex items-center gap-2 font-medium text-success mb-3">
              <Check className="w-4 h-4" />
              Potential Benefits
            </h4>
            <ul className="space-y-2">
              {option.pros.map((pro, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-foreground">
                  <span className="w-1.5 h-1.5 rounded-full bg-success mt-2 flex-shrink-0" />
                  {pro}
                </li>
              ))}
            </ul>
          </div>

          {/* Cons */}
          <div className="pl-12">
            <h4 className="flex items-center gap-2 font-medium text-warning mb-3">
              <AlertTriangle className="w-4 h-4" />
              Potential Risks / Considerations
            </h4>
            <ul className="space-y-2">
              {option.cons.map((con, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-foreground">
                  <span className="w-1.5 h-1.5 rounded-full bg-warning mt-2 flex-shrink-0" />
                  {con}
                </li>
              ))}
            </ul>
          </div>

          {/* Guideline Sources */}
          <div className="pl-12 pt-4 border-t border-border">
            <h4 className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
              <BookOpen className="w-4 h-4" />
              Guideline Sources
            </h4>
            <div className="flex flex-wrap gap-2">
              {option.guidelineSources.map((source, index) => (
                <span
                  key={index}
                  className="clinical-badge bg-info/10 text-info border border-info/20"
                >
                  {source}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
