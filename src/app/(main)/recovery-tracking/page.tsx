"use client";

import { useState, useMemo, useEffect } from "react";
import Container from "@/components/shared/container";
import TopBarFeatures from "@/components/common/TopBarFeatures";
import { RECOVERY_DATA, TaskCategory } from "../../../components/recovery-tracking/recovery-data";
import DayRail from "../../../components/recovery-tracking/DayRail";
import CategoryCard from "../../../components/recovery-tracking/CategoryCard";
import {CheckCircle2, Loader2 } from "lucide-react";
import recoveryTrackingApi from "@/app/api/recovery-tracking/api";
import { getcuruser } from "@/app/api/user/api";
import { getSession } from "@/lib/authentication";

export default function RecoveryTrackingPage() {
  const [selectedDay, setSelectedDay] = useState(1);
  const [completedTaskIds, setCompletedTaskIds] = useState<Set<string>>(new Set());
  const [dailyNotes, setDailyNotes] = useState<Record<number, string>>({});
  
  const [userId, setUserId] = useState<number | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isLoading, setIsLoading] = useState(true);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const session = await getSession();
        const tk = session?.user?.token;
        if (!tk) return;
        setToken(tk);

        const me = await getcuruser(tk);
        const uId = me.id;
        if (!uId) return;
        setUserId(uId);

        const records = await recoveryTrackingApi.getAllRecordsForPatient(tk, uId);
        console.log("Fetched records:", records);
        
        const initialTasks = new Set<string>();
        const initialNotes: Record<number, string> = {};

        if (Array.isArray(records)) {
          records.forEach((record) => {
            if (record.completedTaskIds) {
              record.completedTaskIds.forEach((id) => initialTasks.add(id));
            }
            if (record.dailyNotes) {
              initialNotes[record.dayNumber] = record.dailyNotes;
            }
          });
        }

        setCompletedTaskIds(initialTasks);
        setDailyNotes(initialNotes);
      } catch (err) {
        console.error("Failed to fetch recovery records:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSaveProgress = async () => {
    if (!token || !userId) return;
    
    setIsSaving(true);
    try {
      const currentDayTasks = Array.from(completedTaskIds).filter(id => id.startsWith(`d${selectedDay}-`));
      
      await recoveryTrackingApi.saveOrUpdateRecord(token, {
        patientId: userId,
        dayNumber: selectedDay,
        completedTaskIds: currentDayTasks,
        dailyNotes: dailyNotes[selectedDay] || "",
      });
      alert("Progress saved successfully!");
    } catch (err) {
      console.error("Failed to save record:", err);
      alert("Failed to save progress. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const currentData = useMemo(() => {
    return RECOVERY_DATA.find((d) => d.day === selectedDay) || RECOVERY_DATA[0];
  }, [selectedDay]);

  const handleToggleTask = (taskId: string) => {
    setCompletedTaskIds((prev) => {
      const next = new Set(prev);
      if (next.has(taskId)) {
        next.delete(taskId);
      } else {
        next.add(taskId);
      }
      return next;
    });
  };

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDailyNotes((prev) => ({
      ...prev,
      [selectedDay]: e.target.value,
    }));
  };

  // Group tasks by category
  const tasksByCategory = useMemo(() => {
    const grouped = {} as Record<TaskCategory, typeof currentData.tasks>;
    const categories: TaskCategory[] = ["physical", "nutrition", "baby", "mental", "medical", "warning"];
    categories.forEach((cat) => {
      grouped[cat] = currentData.tasks.filter((t) => t.category === cat);
    });
    return grouped;
  }, [currentData]);

  // Calculate daily progress (excluding warnings)
  const regularTasks = currentData.tasks.filter((t) => t.category !== "warning");
  const completedRegular = regularTasks.filter((t) => completedTaskIds.has(t.id)).length;
  const dailyProgressPercent = regularTasks.length > 0 
    ? Math.round((completedRegular / regularTasks.length) * 100) 
    : 0;

  return (
    <Container title="Recovery Tracking">
      <div className="bg-[#fed2cc] min-h-screen pb-12 relative overflow-hidden">
        {/* Subtle background image or pattern could go here */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          {/* <Image src="/images/auth-bg.png" alt="" fill className="object-cover" /> */}
        </div>

        <div className="relative z-10 px-4 md:px-6 pt-4">
          <TopBarFeatures />

          {/* Clean, calm header */}
          <div className="bg-white/60 backdrop-blur-md rounded-3xl p-3 shadow-sm border border-white/50 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
               
                <p className="text-lg font-medium text-gray-600">
                  Postpartum Day {selectedDay}
                </p>
              </div>
              <div className="w-16 h-16 rounded-full border-4 border-white shadow-sm flex items-center justify-center bg-pink-50 relative overflow-hidden">
                <div 
                  className="absolute bottom-0 left-0 right-0 bg-[#d04f51] transition-all duration-500"
                  style={{ height: `${dailyProgressPercent}%` }}
                />
                <span className="relative z-10 font-bold text-pink-700 text-sm">
                  {dailyProgressPercent}%
                </span>
              </div>
            </div>

            {/* Overall Daily Progress Bar */}
            <div className="w-full bg-white/80 rounded-full h-2.5 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-[#fab0a7] to-[#d04f51] h-2.5 rounded-full transition-all duration-700 ease-out" 
                style={{ width: `${dailyProgressPercent}%` }}
              ></div>
            </div>
            
            <div className="flex justify-between items-center mt-4">
              <p className="text-xs text-gray-500 font-medium">
                Daily completion: {completedRegular} of {regularTasks.length} tasks
              </p>
              <button 
                onClick={handleSaveProgress}
                disabled={isSaving || !userId}
                className="flex items-center cursor-pointer gap-2 bg-[#d04f51] hover:bg-[#d43d40] disabled:bg-pink-300 text-white px-5 py-2 rounded-full text-sm font-bold shadow-md transition-all"
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-4 h-4" />
                )}
                {isSaving ? "Saving..." : "Save Progress"}
              </button>
            </div>
          </div>

          {/* Day Selector */}
          <div className="mb-6 -mx-4 md:mx-0">
            <DayRail selectedDay={selectedDay} onSelectDay={setSelectedDay} />
          </div>

         

          {/* Categories Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">
            <CategoryCard 
              category="physical" 
              tasks={tasksByCategory.physical} 
              completedTaskIds={completedTaskIds} 
              onToggleTask={handleToggleTask} 
            />
            <CategoryCard 
              category="nutrition" 
              tasks={tasksByCategory.nutrition} 
              completedTaskIds={completedTaskIds} 
              onToggleTask={handleToggleTask} 
            />
            {tasksByCategory.baby && tasksByCategory.baby.length > 0 && (
              <CategoryCard 
                category="baby" 
                tasks={tasksByCategory.baby} 
                completedTaskIds={completedTaskIds} 
                onToggleTask={handleToggleTask} 
              />
            )}
            <CategoryCard 
              category="mental" 
              tasks={tasksByCategory.mental} 
              completedTaskIds={completedTaskIds} 
              onToggleTask={handleToggleTask} 
            />
            {tasksByCategory.medical && tasksByCategory.medical.length > 0 && (
              <CategoryCard 
                category="medical" 
                tasks={tasksByCategory.medical} 
                completedTaskIds={completedTaskIds} 
                onToggleTask={handleToggleTask} 
              />
            )}
            {tasksByCategory.warning && tasksByCategory.warning.length > 0 && (
              <CategoryCard 
                category="warning" 
                tasks={tasksByCategory.warning} 
                completedTaskIds={completedTaskIds} 
                onToggleTask={handleToggleTask} 
              />
            )}
          </div>

          {/* Summary / Notes Section */}
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 shadow-sm border border-white/50 mb-8">
            <div className="flex items-center gap-2 mb-4">
            
              <h2 className="text-lg font-bold text-gray-800">Daily Notes & Symptoms</h2>
            </div>
            <textarea
              className="w-full bg-white/80 border border-gray-200 rounded-2xl p-4 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-300 transition-all resize-none shadow-inner"
              rows={4}
              placeholder="How are you feeling today? Any specific symptoms or thoughts?"
              value={dailyNotes[selectedDay] || ""}
              onChange={handleNoteChange}
            ></textarea>
          </div>

        </div>
      </div>
    </Container>
  );
}
