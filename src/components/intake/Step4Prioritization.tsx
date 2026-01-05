import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { PatientPrioritization, PatientGoal } from '@/types/patient';
import { DraggableGoal } from './DraggableGoal';
import { ListOrdered, Info } from 'lucide-react';

interface Step4Props {
  data: PatientPrioritization;
  onChange: (data: PatientPrioritization) => void;
}

export function Step4Prioritization({ data, onChange }: Step4Props) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = data.rankedGoals.findIndex((goal) => goal.id === active.id);
      const newIndex = data.rankedGoals.findIndex((goal) => goal.id === over.id);

      const newRankedGoals = arrayMove(data.rankedGoals, oldIndex, newIndex);
      onChange({ rankedGoals: newRankedGoals });
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
          <ListOrdered className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Prioritize Your Goals</h2>
        <p className="text-muted-foreground mt-2">
          Drag and drop to rank these treatment goals in order of importance to you.
        </p>
      </div>

      <div className="bg-muted/50 border border-border rounded-lg p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
        <div className="text-sm text-muted-foreground">
          <strong className="text-foreground">How to rank:</strong> Drag items up or down to reorder. 
          The goal at the top (#1) is your highest priority.
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={data.rankedGoals.map((g) => g.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3">
            {data.rankedGoals.map((goal, index) => (
              <DraggableGoal key={goal.id} goal={goal} index={index} />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <div className="mt-8 p-6 card-clinical">
        <h3 className="font-semibold text-foreground mb-4">Your Current Ranking</h3>
        <ol className="space-y-2">
          {data.rankedGoals.map((goal, index) => (
            <li key={goal.id} className="flex items-center gap-3 text-sm">
              <span className="w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-bold">
                {index + 1}
              </span>
              <span className="text-foreground">{goal.label}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
