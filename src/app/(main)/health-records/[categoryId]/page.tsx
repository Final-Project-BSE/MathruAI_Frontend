"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Container from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { Plus, ChevronLeft, ClipboardList, Loader2 } from "lucide-react";
import TopBarFeatures from "@/components/common/TopBarFeatures";
import RecordCard, { HealthRecord } from "@/components/health-records/RecordCard";
import RecordFormModal, { RecordFormData } from "@/components/health-records/RecordFormModal";
import DeleteConfirmModal from "@/components/health-records/DeleteConfirmModal";
import healthRecordsApi, { updateRecord } from "@/app/api/health-records/api";


const CATEGORY_META: Record<string, { name: string; icon: string }> = {
    "medical-checkups": { name: "Medical Checkups", icon: "🩺" },
    "lab-test-results": { name: "Lab Test Results", icon: "🔬" },
    "ultrasound-scans": { name: "Ultrasound & Scans", icon: "🩻" },
    "medications-supplements": { name: "Medications & Supplements", icon: "💊" },
    "vaccinations": { name: "Vaccinations", icon: "💉" },
    "personal-health-notes": { name: "Personal Health Notes", icon: "📝" },
    "others": { name: "Others", icon: "📋" },
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
    const [categoryInfo, setCategoryInfo] = useState({ name: "Records", icon: "📋" });

    const fetchRecords = useCallback(async () => {
        try {
            setLoading(true);
            const { getSession } = await import("@/lib/authentication");
            const session = await getSession();
            const token = session?.user?.token;

            if (!token) {
                setError("Unauthorized. Please login.");
                return;
            }

            const data = await healthRecordsApi.getRecordsByCategory(token, categoryId);

            // Map backend DTO to Frontend UI interface
            const mapped: HealthRecord[] = data.map(r => ({
                id: r.id,
                categoryId: r.categoryId,
                name: r.name,
                date: r.date,
                description: r.description,
                files: r.files.map(f => ({
                    id: f.id,
                    name: f.fileName,
                    type: f.fileType,
                    size: f.fileSize,
                    data: f.fileUrl // In the UI, 'data' is used for the URL/base64
                }))
            }));

            setRecords(mapped);

            if (data.length > 0) {
                setCategoryInfo({
                    name: data[0].categoryName,
                    icon: CATEGORY_META[categoryId]?.icon ?? "📋"
                });
            } else {
                // Fallback to meta if empty
                setCategoryInfo(CATEGORY_META[categoryId] ?? { name: "Records", icon: "📋" });
            }
        } catch (err) {
            console.error("Failed to fetch records:", err);
            setError("Failed to load health records.");
            setCategoryInfo(CATEGORY_META[categoryId] ?? { name: "Records", icon: "📋" });
        } finally {
            setLoading(false);
        }
    }, [categoryId]);

    useEffect(() => {
        fetchRecords();
    }, [fetchRecords]);

    const handleAdd = () => { setEditTarget(null); setFormOpen(true); };
    const handleEdit = (rec: HealthRecord) => { setEditTarget(rec); setFormOpen(true); };

    const handleFormSubmit = async (data: RecordFormData) => {
        try {
            const { getSession } = await import("@/lib/authentication");
            const session = await getSession();
            const token = session?.user?.token;

            if (!token) return;

            // Only send newly selected File objects (existing server files are preserved)
            const newFileObjects = data.files
                ?.map(f => f.file)
                .filter((f): f is File => f instanceof File) ?? [];

            if (editTarget) {
                await updateRecord(token, editTarget.id, {
                    name: data.name,
                    date: data.date,
                    description: data.description,
                    files: newFileObjects
                });
            } else {
                await healthRecordsApi.createRecord(token, categoryId, {
                    name: data.name,
                    date: data.date,
                    description: data.description,
                    files: newFileObjects
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
            setRecords((prev) => prev.filter((r) => r.id !== deleteTarget.id));
            setDeleteTarget(null);
        } catch (err) {
            console.error("Failed to delete record:", err);
            alert("Failed to delete record.");
        }
    };

    return (
        <Container title={categoryInfo.name}>
            <div className="bg-[#fed2cc] min-h-screen p-4 md:p-6">
                <TopBarFeatures />

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => router.push("/health-records")}
                            className="flex items-center gap-1 text-pink-600 hover:text-pink-800 text-sm font-medium transition-colors"
                        >
                            <ChevronLeft className="h-4 w-4" />
                            Categories
                        </button>
                        <span className="text-gray-400">/</span>
                        <div className="flex items-center gap-2">
                            <span className="text-xl">{categoryInfo.icon}</span>
                            <h1 className="text-xl md:text-2xl font-bold text-gray-900">{categoryInfo.name}</h1>
                        </div>
                    </div>
                    <Button
                        onClick={handleAdd}
                        className="rounded-xl bg-pink-500 hover:bg-pink-600 text-white gap-2 shadow-sm"
                    >
                        <Plus className="h-4 w-4" />
                        <span className="hidden sm:inline">Add Record</span>
                        <span className="sm:hidden">Add</span>
                    </Button>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24">
                        <Loader2 className="h-10 w-10 text-pink-500 animate-spin mb-4" />
                        <p className="text-gray-600 font-medium">Loading records...</p>
                    </div>
                ) : error ? (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
                        {error}
                    </div>
                ) : (
                    <>
                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-3 mb-6">
                            <div className="bg-white/90 backdrop-blur rounded-2xl p-4 shadow-sm">
                                <p className="text-xs text-gray-500 mb-0.5">Total Records</p>
                                <p className="text-2xl font-bold text-pink-600">{records.length}</p>
                            </div>
                            <div className="bg-white/90 backdrop-blur rounded-2xl p-4 shadow-sm">
                                <p className="text-xs text-gray-500 mb-0.5">Latest</p>
                                <p className="text-base font-semibold text-gray-700 truncate">
                                    {records.length > 0
                                        ? [...records].sort((a, b) => b.date.localeCompare(a.date))[0].name
                                        : "—"}
                                </p>
                            </div>
                        </div>

                        {/* Grid */}
                        {records.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-24 text-center">
                                <ClipboardList className="h-14 w-14 text-pink-300 mb-4" />
                                <p className="text-gray-600 font-medium">No records yet</p>
                                <p className="text-sm text-gray-400 mt-1">Click &quot;Add Record&quot; to add your first record.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {records.map((rec) => (
                                    <RecordCard key={rec.id} record={rec} onEdit={handleEdit} onDelete={setDeleteTarget} />
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
