"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useParams } from "next/navigation";
import Container from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { Plus, ClipboardList } from "lucide-react";
import TopBarFeatures from "@/components/common/TopBarFeatures";
import RecordCard, { HealthRecord } from "@/components/health-records/RecordCard";
import RecordFormModal, {
  RecordFormData,
} from "@/components/health-records/RecordFormModal";
import DeleteConfirmModal from "@/components/health-records/DeleteConfirmModal";
import { LoadingState } from "@/components/common/LoadingState";
import { useLanguage } from "@/components/common/useLanguage";
import { translateText } from "@/components/common/translateText";

type ApiFile = {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  fileUrl: string;
};

type ApiRecord = {
  id: string;
  categoryId: string;
  categoryName?: string;
  name: string;
  date: string;
  description?: string;
  files?: ApiFile[];
};

export default function RecordsPage() {
  const params = useParams();
  const categoryId = params?.categoryId as string;

  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<HealthRecord | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<HealthRecord | null>(null);
  const [categoryInfo, setCategoryInfo] = useState({ name: "" });
  const [translatedLatestName, setTranslatedLatestName] = useState("—");
  const [translatedCategoryName, setTranslatedCategoryName] = useState("");

  const { language, t } = useLanguage();
  const hr = t.healthRecords;

  const getCategoryName = useCallback(
    (slugOrId: string, fallback?: string) => {
      return hr.categories[slugOrId] ?? fallback ?? hr.records;
    },
    [hr.categories, hr.records]
  );

  const latestRecord = useMemo(() => {
    if (records.length === 0) return null;
    return [...records].sort((a, b) => b.date.localeCompare(a.date))[0];
  }, [records]);

  const fetchRecords = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `/api/health-records/categories/${categoryId}/records`,
        {
          method: "GET",
          cache: "no-store",
        }
      );

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.message || hr.loadRecordsError);
      }

      const data = await response.json();

      const apiRecords: ApiRecord[] = Array.isArray(data)
        ? data
        : data.records ?? [];

      const mapped: HealthRecord[] = apiRecords.map((record) => ({
        id: record.id,
        categoryId: record.categoryId,
        name: record.name,
        date: record.date,
        description: record.description,
        files:
          record.files?.map((file) => ({
            id: file.id,
            name: file.fileName,
            type: file.fileType,
            size: file.fileSize,
            data: file.fileUrl,
          })) ?? [],
      }));

      setRecords(mapped);

      setCategoryInfo({
        name: getCategoryName(
          categoryId,
          data.categoryName || apiRecords[0]?.categoryName || hr.records
        ),
      });
    } catch (err) {
      console.error("Failed to fetch records:", err);
      setError(err instanceof Error ? err.message : hr.loadRecordsError);

      setCategoryInfo({
        name: getCategoryName(categoryId, hr.records),
      });
    } finally {
      setLoading(false);
    }
  }, [categoryId, getCategoryName, hr.loadRecordsError, hr.records]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  useEffect(() => {
    let active = true;

    async function translateLatest() {
      if (!latestRecord) {
        setTranslatedLatestName("—");
        return;
      }

      const translated = await translateText(latestRecord.name, language);

      if (active) {
        setTranslatedLatestName(translated);
      }
    }

    translateLatest();

    return () => {
      active = false;
    };
  }, [latestRecord, latestRecord?.name, language]);

  useEffect(() => {
    let active = true;

    async function translateCategory() {
      const baseName = categoryInfo.name || getCategoryName(categoryId, hr.records);
      const translated = await translateText(baseName, language);

      if (active) {
        setTranslatedCategoryName(translated);
      }
    }

    translateCategory();

    return () => {
      active = false;
    };
  }, [categoryInfo.name, categoryId, getCategoryName, hr.records, language]);

  const handleAdd = () => {
    setEditTarget(null);
    setFormOpen(true);
  };

  const handleEdit = (record: HealthRecord) => {
    setEditTarget(record);
    setFormOpen(true);
  };

  const handleFormSubmit = async (data: RecordFormData) => {
    try {
      setSaving(true);

      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("date", data.date);

      if (data.description) {
        formData.append("description", data.description);
      }

      const newFileObjects =
        data.files
          ?.map((file) => file.file)
          .filter((file): file is File => file instanceof File) ?? [];

      newFileObjects.forEach((file) => {
        formData.append("files", file);
      });

      const url = editTarget
        ? `/api/health-records/records/${editTarget.id}`
        : `/api/health-records/categories/${categoryId}/records`;

      const method = editTarget ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        body: formData,
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.message || hr.saveRecordError);
      }

      await fetchRecords();
      setFormOpen(false);
      setEditTarget(null);
    } catch (err) {
      console.error("Failed to save record:", err);
      alert(err instanceof Error ? err.message : hr.saveRecordError);
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      const response = await fetch(
        `/api/health-records/records/${deleteTarget.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.message || hr.deleteRecordError);
      }

      setRecords((prev) =>
        prev.filter((record) => record.id !== deleteTarget.id)
      );

      setDeleteTarget(null);
    } catch (err) {
      console.error("Failed to delete record:", err);
      alert(err instanceof Error ? err.message : hr.deleteRecordError);
    }
  };

  if (loading) {
    return <LoadingState />;
  }

  return (
    <Container title={translatedCategoryName || categoryInfo.name || hr.records}>
      <div className="bg-[#fed2cc] min-h-screen p-4 md:p-6">
        <TopBarFeatures />

        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={handleAdd}
            disabled={saving}
            className="rounded-xl bg-[#d04f51] hover:bg-[#b84345] text-white gap-2 shadow-sm"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">{hr.addRecord}</span>
            <span className="sm:hidden">{hr.add}</span>
          </Button>
        </div>

        {error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-white/90 backdrop-blur rounded-2xl p-4 shadow-sm">
                <p className="text-xs text-gray-500 mb-0.5">
                  {hr.totalRecords}
                </p>
                <p className="text-2xl font-bold text-[#d04f51]">
                  {records.length}
                </p>
              </div>

              <div className="bg-white/90 backdrop-blur rounded-2xl p-4 shadow-sm">
                <p className="text-xs text-gray-500 mb-0.5">{hr.latest}</p>
                <p className="text-base font-semibold text-gray-700 truncate">
                  {translatedLatestName}
                </p>
              </div>
            </div>

            {records.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <ClipboardList className="h-14 w-14 text-[#d04f51]/40 mb-4" />
                <p className="text-gray-600 font-medium">{hr.noRecordsYet}</p>
                <p className="text-sm text-gray-400 mt-1">
                  {hr.noRecordsHelp}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {records.map((record) => (
                  <RecordCard
                    key={record.id}
                    record={record}
                    onEdit={handleEdit}
                    onDelete={setDeleteTarget}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <RecordFormModal
        isOpen={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditTarget(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={editTarget}
      />

      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        itemName={deleteTarget?.name ?? ""}
        itemType={hr.record}
      />
    </Container>
  );
}