"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Container from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { Plus, ChevronLeft, ClipboardList } from "lucide-react";
import TopBarFeatures from "@/components/common/TopBarFeatures";
import RecordCard, { HealthRecord } from "@/components/health-records/RecordCard";
import RecordFormModal, {
  RecordFormData,
} from "@/components/health-records/RecordFormModal";
import DeleteConfirmModal from "@/components/health-records/DeleteConfirmModal";
import healthRecordsApi, {
  updateRecord,
} from "@/app/api/health-records/api";
import { LoadingState } from "@/components/common/LoadingState";

const CATEGORY_META: Record<string, { name: string }> = {
  "medical-checkups": { name: "Medical Checkups" },
  "lab-test-results": { name: "Lab Test Results" },
  "ultrasound-scans": { name: "Ultrasound & Scans" },
  "medications-supplements": { name: "Medications & Supplements" },
  vaccinations: { name: "Vaccinations" },
  "personal-health-notes": { name: "Personal Health Notes" },
  others: { name: "Others" },
};

export default function RecordsPage() {
  const params = useParams();
  const router = useRouter();
  const categoryId = params?.categoryId as string;

  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<HealthRecord | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<HealthRecord | null>(null);
  const [categoryInfo, setCategoryInfo] = useState({ name: "Records" });

  const fetchRecords = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { getSession } = await import("@/lib/authentication");
      const session = await getSession();
      const token = session?.user?.token;

      if (!token) {
        setError("Unauthorized. Please login.");
        return;
      }

      const data = await healthRecordsApi.getRecordsByCategory(token, categoryId);

      const mapped: HealthRecord[] = data.map((record) => ({
        id: record.id,
        categoryId: record.categoryId,
        name: record.name,
        date: record.date,
        description: record.description,
        files: record.files.map((file) => ({
          id: file.id,
          name: file.fileName,
          type: file.fileType,
          size: file.fileSize,
          data: file.fileUrl,
        })),
      }));

      setRecords(mapped);

      if (data.length > 0) {
        setCategoryInfo({
          name: data[0].categoryName,
        });
      } else {
        setCategoryInfo(CATEGORY_META[categoryId] ?? { name: "Records" });
      }
    } catch (err) {
      console.error("Failed to fetch records:", err);
      setError("Failed to load health records.");
      setCategoryInfo(CATEGORY_META[categoryId] ?? { name: "Records" });
    } finally {
      setLoading(false);
    }
  }, [categoryId]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

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
      const { getSession } = await import("@/lib/authentication");
      const session = await getSession();
      const token = session?.user?.token;

      if (!token) return;

      const newFileObjects =
        data.files
          ?.map((file) => file.file)
          .filter((file): file is File => file instanceof File) ?? [];

      if (editTarget) {
        await updateRecord(token, editTarget.id, {
          name: data.name,
          date: data.date,
          description: data.description,
          files: newFileObjects,
        });
      } else {
        await healthRecordsApi.createRecord(token, categoryId, {
          name: data.name,
          date: data.date,
          description: data.description,
          files: newFileObjects,
        });
      }

      await fetchRecords();
      setFormOpen(false);
    } catch (err) {
      console.error("Failed to save record:", err);
      alert("Failed to save record. Please try again.");
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      const { getSession } = await import("@/lib/authentication");
      const session = await getSession();
      const token = session?.user?.token;

      if (!token) return;

      await healthRecordsApi.deleteRecord(token, deleteTarget.id);
      setRecords((prev) => prev.filter((record) => record.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      console.error("Failed to delete record:", err);
      alert("Failed to delete record.");
    }
  };

  if (loading) {
    return <LoadingState />;
  }

  return (
    <Container title={categoryInfo.name}>
      <div className="bg-[#fed2cc] min-h-screen p-4 md:p-6">
        <TopBarFeatures />

        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={handleAdd}
            className="rounded-xl bg-[#d04f51] hover:bg-[#b84345] text-white gap-2 shadow-sm"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Record</span>
            <span className="sm:hidden">Add</span>
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
                <p className="text-xs text-gray-500 mb-0.5">Total Records</p>
                <p className="text-2xl font-bold text-[#d04f51]">
                  {records.length}
                </p>
              </div>

              <div className="bg-white/90 backdrop-blur rounded-2xl p-4 shadow-sm">
                <p className="text-xs text-gray-500 mb-0.5">Latest</p>
                <p className="text-base font-semibold text-gray-700 truncate">
                  {records.length > 0
                    ? [...records].sort((a, b) => b.date.localeCompare(a.date))[0]
                        .name
                    : "—"}
                </p>
              </div>
            </div>

            {records.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <ClipboardList className="h-14 w-14 text-[#d04f51]/40 mb-4" />
                <p className="text-gray-600 font-medium">No records yet</p>
                <p className="text-sm text-gray-400 mt-1">
                  Click &quot;Add Record&quot; to add your first record.
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
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editTarget}
      />

      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        itemName={deleteTarget?.name ?? ""}
        itemType="Record"
      />
    </Container>
  );
}