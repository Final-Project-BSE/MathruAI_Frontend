import React from "react";
import { RecoveryTask, CATEGORY_ICONS, CATEGORY_LABELS, CATEGORY_COLORS, TaskCategory } from "./recovery-data";
import { CheckCircle2, Circle, AlertTriangle } from "lucide-react";

interface CategoryCardProps {
  category: TaskCategory;
  tasks: RecoveryTask[];
  completedTaskIds: Set<string>;
  onToggleTask: (taskId: string) => void;
}

export default function CategoryCard({
  category,
  tasks,
  completedTaskIds,
  onToggleTask,
}: CategoryCardProps) {
  if (tasks.length === 0) return null;

  const color = CATEGORY_COLORS[category];
  const icon = CATEGORY_ICONS[category];
  const label = CATEGORY_LABELS[category];
  const isWarning = category === "warning";

  const completedCount = tasks.filter(t => completedTaskIds.has(t.id)).length;
  const progress = Math.round((completedCount / tasks.length) * 100);

  return (
    <div className={`rounded-3xl overflow-hidden shadow-sm border ${isWarning ? 'border-red-300' : 'border-white/50'}`}>
      <div 
        className="px-5 py-4"
        style={{ 
          background: isWarning ? '#fee2e2' : 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(8px)'
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div 
              className={`flex items-center justify-center w-10 h-10 rounded-full text-xl ${isWarning ? 'bg-red-100' : 'bg-white shadow-sm'}`}
            >
              {icon}
            </div>
            <div>
              <h2 className={`font-bold text-lg ${isWarning ? 'text-red-700' : 'text-gray-800'}`}>
                {label}
              </h2>
              {!isWarning && (
                <p className="text-xs text-gray-500 font-medium">
                  {completedCount} of {tasks.length} completed
                </p>
              )}
            </div>
          </div>
          
          {!isWarning && (
            <div className="text-right">
              <span className="text-sm font-bold" style={{ color }}>{progress}%</span>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        {!isWarning && (
          <div className="w-full h-1.5 bg-gray-200 rounded-full mb-5 overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%`, backgroundColor: color }}
            />
          </div>
        )}

        {/* Tasks List */}
        <div className="space-y-2">
          {tasks.map((task) => {
            const isCompleted = completedTaskIds.has(task.id);
            return (
              <label 
                key={task.id}
                className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                  isWarning 
                    ? 'bg-red-50 hover:bg-red-100 border border-red-200' 
                    : isCompleted
                      ? 'bg-gray-50/50 opacity-60'
                      : 'bg-white hover:bg-gray-50 border border-gray-100 shadow-sm'
                }`}
              >
                <div className="mt-0.5 relative flex items-center justify-center shrink-0">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={isCompleted}
                    onChange={() => onToggleTask(task.id)}
                  />
                  {isWarning ? (
                     <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${isCompleted ? 'bg-red-500 border-red-500' : 'border-red-400'}`}>
                       {isCompleted && <CheckCircle2 className="w-4 h-4 text-white" />}
                     </div>
                  ) : (
                    isCompleted ? (
                      <CheckCircle2 className="w-6 h-6" style={{ color }} />
                    ) : (
                      <Circle className="w-6 h-6 text-gray-300" />
                    )
                  )}
                </div>
                <span className={`text-sm flex-1 pt-0.5 ${
                  isCompleted && !isWarning ? 'line-through text-gray-400' : isWarning ? 'text-red-900 font-medium' : 'text-gray-700 font-medium'
                }`}>
                  {task.text}
                </span>
                
                {isWarning && (
                  <AlertTriangle className="w-4 h-4 text-red-500 mt-1 opacity-70" />
                )}
              </label>
            );
          })}
        </div>

        {isWarning && (
           <div className="mt-4 p-3 bg-red-100 rounded-xl flex items-center justify-between border border-red-200">
             <span className="text-sm font-bold text-red-800">Need help?</span>
             <button className="px-4 py-1.5 bg-red-600 text-white text-xs font-bold rounded-full shadow-sm hover:bg-red-700 transition-colors">
               Contact Midwife
             </button>
           </div>
        )}
      </div>
    </div>
  );
}
