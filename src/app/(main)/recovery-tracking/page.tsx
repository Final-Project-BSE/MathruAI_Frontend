"use client";

import { useEffect, useMemo, useState } from "react";
import Container from "@/components/shared/container";
import TopBarFeatures from "@/components/common/TopBarFeatures";
import { LoadingState } from "@/components/common/LoadingState";
import {
  RECOVERY_DATA,
  TaskCategory,
  DayAdvice,
} from "../../../components/recovery-tracking/recovery-data";
import DayRail from "../../../components/recovery-tracking/DayRail";
import CategoryCard from "../../../components/recovery-tracking/CategoryCard";
import { CheckCircle2, Loader2 } from "lucide-react";
import recoveryTrackingApi from "@/app/api/recovery-tracking/api";
import { getcuruser } from "@/app/api/user/api";
import { getSession } from "@/lib/authentication";
import { useLanguage } from "@/components/common/useLanguage";
import { translateMany } from "@/components/common/translateText";

export default function RecoveryTrackingPage() {
  const { language, t } = useLanguage();
  const recoveryT = t.recoveryTracking;

  const [selectedDay, setSelectedDay] = useState(1);
  const [completedTaskIds, setCompletedTaskIds] = useState<Set<string>>(
    new Set()
  );
  const [dailyNotes, setDailyNotes] = useState<Record<number, string>>({});

  const [userId, setUserId] = useState<number | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [translatedCurrentData, setTranslatedCurrentData] =
    useState<DayAdvice | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);

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

        const records = await recoveryTrackingApi.getAllRecordsForPatient(
          tk,
          uId
        );

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
      const currentDayTasks = Array.from(completedTaskIds).filter((id) =>
        id.startsWith(`d${selectedDay}-`)
      );

      await recoveryTrackingApi.saveOrUpdateRecord(token, {
        patientId: userId,
        dayNumber: selectedDay,
        completedTaskIds: currentDayTasks,
        dailyNotes: dailyNotes[selectedDay] || "",
      });

      alert(recoveryT.saveSuccess);
    } catch (err) {
      console.error("Failed to save record:", err);
      alert(recoveryT.saveError);
    } finally {
      setIsSaving(false);
    }
  };

  const currentData = useMemo(() => {
    return RECOVERY_DATA.find((d) => d.day === selectedDay) || RECOVERY_DATA[0];
  }, [selectedDay]);

  useEffect(() => {
    let cancelled = false;

    const translateCurrentRecoveryData = async () => {
      if (language === "en") {
        setTranslatedCurrentData(currentData);
        return;
      }

      try {
        setIsTranslating(true);

        const sourceValues = [
          currentData.adviceText,
          ...currentData.tasks.map((task) => task.text),
        ];

        const translatedValues = await translateMany(sourceValues, language);

        if (cancelled) return;

        setTranslatedCurrentData({
          ...currentData,
          adviceText: translatedValues[0] || currentData.adviceText,
          tasks: currentData.tasks.map((task, index) => ({
            ...task,
            text: translatedValues[index + 1] || task.text,
          })),
        });
      } catch (error) {
        console.error("Failed to translate recovery data:", error);

        if (!cancelled) {
          setTranslatedCurrentData(currentData);
        }
      } finally {
        if (!cancelled) {
          setIsTranslating(false);
        }
      }
    };

    void translateCurrentRecoveryData();

    return () => {
      cancelled = true;
    };
  }, [currentData, language]);

  const displayData = translatedCurrentData || currentData;

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

  const tasksByCategory = useMemo(() => {
    const grouped = {} as Record<TaskCategory, typeof displayData.tasks>;
    const categories: TaskCategory[] = [
      "physical",
      "nutrition",
      "baby",
      "mental",
      "medical",
      "warning",
    ];

    categories.forEach((cat) => {
      grouped[cat] = displayData.tasks.filter((t) => t.category === cat);
    });

    return grouped;
  }, [displayData]);

  const regularTasks = displayData.tasks.filter(
    (t) => t.category !== "warning"
  );

  const completedRegular = regularTasks.filter((t) =>
    completedTaskIds.has(t.id)
  ).length;

  const dailyProgressPercent =
    regularTasks.length > 0
      ? Math.round((completedRegular / regularTasks.length) * 100)
      : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fcd4cd]">
        <LoadingState />
      </div>
    );
  }

  return (
    <Container title={recoveryT.title}>
      <div className="bg-[#fed2cc] min-h-screen pb-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none" />

        <div className="relative z-10 px-4 md:px-6 pt-4">
          <TopBarFeatures />

          <div className="bg-white/60 backdrop-blur-md rounded-3xl p-3 shadow-sm border border-white/50 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-lg font-medium text-gray-600">
                  {recoveryT.postpartumDay} {selectedDay}
                </p>

                {isTranslating && (
                  <p className="text-xs text-gray-400 font-medium mt-1">
                    {recoveryT.loadingTranslations}
                  </p>
                )}
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

            {displayData.adviceText && (
              <p className="mb-4 rounded-2xl bg-white/70 px-4 py-3 text-sm font-medium text-gray-600 shadow-inner">
                {displayData.adviceText}
              </p>
            )}

            <div className="w-full bg-white/80 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#fab0a7] to-[#d04f51] h-2.5 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${dailyProgressPercent}%` }}
              />
            </div>

            <div className="flex justify-between items-center mt-4">
              <p className="text-xs text-gray-500 font-medium">
                {recoveryT.dailyCompletion}: {completedRegular} {recoveryT.of}{" "}
                {regularTasks.length} {recoveryT.tasks}
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

                {isSaving ? recoveryT.saving : recoveryT.saveProgress}
              </button>
            </div>
          </div>

          <div className="mb-6 -mx-4 md:mx-0">
            <DayRail
              selectedDay={selectedDay}
              onSelectDay={setSelectedDay}
              dayLabel={recoveryT.day}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">
            <CategoryCard
              category="physical"
              label={recoveryT.categories.physical}
              tasks={tasksByCategory.physical}
              completedTaskIds={completedTaskIds}
              onToggleTask={handleToggleTask}
              completedText={recoveryT.completed}
              ofText={recoveryT.of}
              needHelpText={recoveryT.needHelp}
              contactMidwifeText={recoveryT.contactMidwife}
            />

            <CategoryCard
              category="nutrition"
              label={recoveryT.categories.nutrition}
              tasks={tasksByCategory.nutrition}
              completedTaskIds={completedTaskIds}
              onToggleTask={handleToggleTask}
              completedText={recoveryT.completed}
              ofText={recoveryT.of}
              needHelpText={recoveryT.needHelp}
              contactMidwifeText={recoveryT.contactMidwife}
            />

            {tasksByCategory.baby && tasksByCategory.baby.length > 0 && (
              <CategoryCard
                category="baby"
                label={recoveryT.categories.baby}
                tasks={tasksByCategory.baby}
                completedTaskIds={completedTaskIds}
                onToggleTask={handleToggleTask}
                completedText={recoveryT.completed}
                ofText={recoveryT.of}
                needHelpText={recoveryT.needHelp}
                contactMidwifeText={recoveryT.contactMidwife}
              />
            )}

            <CategoryCard
              category="mental"
              label={recoveryT.categories.mental}
              tasks={tasksByCategory.mental}
              completedTaskIds={completedTaskIds}
              onToggleTask={handleToggleTask}
              completedText={recoveryT.completed}
              ofText={recoveryT.of}
              needHelpText={recoveryT.needHelp}
              contactMidwifeText={recoveryT.contactMidwife}
            />

            {tasksByCategory.medical && tasksByCategory.medical.length > 0 && (
              <CategoryCard
                category="medical"
                label={recoveryT.categories.medical}
                tasks={tasksByCategory.medical}
                completedTaskIds={completedTaskIds}
                onToggleTask={handleToggleTask}
                completedText={recoveryT.completed}
                ofText={recoveryT.of}
                needHelpText={recoveryT.needHelp}
                contactMidwifeText={recoveryT.contactMidwife}
              />
            )}

            {tasksByCategory.warning && tasksByCategory.warning.length > 0 && (
              <CategoryCard
                category="warning"
                label={recoveryT.categories.warning}
                tasks={tasksByCategory.warning}
                completedTaskIds={completedTaskIds}
                onToggleTask={handleToggleTask}
                completedText={recoveryT.completed}
                ofText={recoveryT.of}
                needHelpText={recoveryT.needHelp}
                contactMidwifeText={recoveryT.contactMidwife}
              />
            )}
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 shadow-sm border border-white/50 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-lg font-bold text-gray-800">
                {recoveryT.dailyNotesTitle}
              </h2>
            </div>

            <textarea
              className="w-full bg-white/80 border border-gray-200 rounded-2xl p-4 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-300 transition-all resize-none shadow-inner"
              rows={4}
              placeholder={recoveryT.dailyNotesPlaceholder}
              value={dailyNotes[selectedDay] || ""}
              onChange={handleNoteChange}
            />
          </div>
        </div>
      </div>
    </Container>
  );
}