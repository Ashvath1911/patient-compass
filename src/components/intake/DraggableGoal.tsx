import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { PatientGoal } from '@/types/patient';
import { cn } from '@/lib/utils';

interface DraggableGoalProps {
  goal: PatientGoal;
  index: number;
}

export function DraggableGoal({ goal, index }: DraggableGoalProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: goal.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getRankBadgeStyle = (rank: number) => {
    switch (rank) {
      case 0: return 'bg-success/10 text-success border-success/20';
      case 1: return 'bg-info/10 text-info border-info/20';
      case 2: return 'bg-warning/10 text-warning border-warning/20';
      case 3: return 'bg-muted text-muted-foreground border-muted';
      default: return 'bg-muted text-muted-foreground border-muted';
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'draggable-item flex items-center gap-4',
        isDragging && 'dragging z-50'
      )}
    >
      <button
        {...attributes}
        {...listeners}
        className="touch-none p-1 rounded hover:bg-muted transition-colors"
        aria-label="Drag to reorder"
      >
        <GripVertical className="w-5 h-5 text-muted-foreground" />
      </button>

      <div className={cn(
        'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border',
        getRankBadgeStyle(index)
      )}>
        {index + 1}
      </div>

      <div className="flex-1">
        <h4 className="font-medium text-foreground">{goal.label}</h4>
        <p className="text-sm text-muted-foreground">{goal.description}</p>
      </div>
    </div>
  );
}
