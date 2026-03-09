"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Container from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { Plus, ChevronLeft, ClipboardList } from "lucide-react";
import TopBarFeatures from "@/components/common/TopBarFeatures";
import RecordCard, { HealthRecord } from "@/components/health-records/RecordCard";
import RecordFormModal, { RecordFormData } from "@/components/health-records/RecordFormModal";
import DeleteConfirmModal from "@/components/health-records/DeleteConfirmModal";

const CATEGORY_META: Record<string, { name: string; icon: string }> = {
    "medical-checkups": { name: "Medical Checkups", icon: "🩺" },
    "lab-test-results": { name: "Lab Test Results", icon: "🔬" },
    "ultrasound-scans": { name: "Ultrasound & Scans", icon: "🩻" },
    "medications-supplements": { name: "Medications & Supplements", icon: "💊" },
    "vaccinations": { name: "Vaccinations", icon: "💉" },
    "personal-health-notes": { name: "Personal Health Notes", icon: "📝" },
    "others": { name: "Others", icon: "📋" },
};

// Dummy records updated for Records Page
const DUMMY_RECORDS: Record<string, HealthRecord[]> = {
    "medical-checkups": [
        { id: "mc-1", categoryId: "medical-checkups", name: "Routine Prenatal Checkup", date: "2025-12-05", description: "Blood pressure and weight check. Fetal heart rate normal." },
        { id: "mc-2", categoryId: "medical-checkups", name: "Physical Exam", date: "2025-08-10", description: "General health assessment. No major concerns." },
        { id: "mc-3", categoryId: "medical-checkups", name: "Dental Checkup", date: "2025-05-15", description: "Routine cleaning. No cavities." },
    ],
    "lab-test-results": [
        { id: "lab-1", categoryId: "lab-test-results", name: "Complete Blood Count", date: "2025-12-10", description: "All values within normal range." },
        { id: "lab-2", categoryId: "lab-test-results", name: "Glucose Tolerance Test", date: "2025-09-15", description: "Negative for gestational diabetes." },
        { id: "lab-3", categoryId: "lab-test-results", name: "Iron & Ferritin Check", date: "2025-06-20", description: "Iron levels healthy." },
        { id: "lab-4", categoryId: "lab-test-results", name: "Thyroid Function Test", date: "2025-03-05", description: "TSH levels stable." },
        { id: "lab-5", categoryId: "lab-test-results", name: "Urinalysis", date: "2025-01-10", description: "Clear, no signs of infection." },
    ],
    "ultrasound-scans": [
        { id: "us-1", categoryId: "ultrasound-scans", name: "12-Week Ultrasound", date: "2025-12-01", description: "Healthy growth. Heartbeat strong." },
        { id: "us-2", categoryId: "ultrasound-scans", name: "Anatomy Scan (20 wks)", date: "2025-10-08", description: "Fetal anatomy normal." },
    ],
    "medications-supplements": [
        { id: "ms-1", categoryId: "medications-supplements", name: "Prenatal Vitamins", date: "2025-11-01", description: "Daily multivitamin with folic acid." },
        { id: "ms-2", categoryId: "medications-supplements", name: "Iron Supplement", date: "2025-08-12", description: "Prescribed due to mild deficiency." },
        { id: "ms-3", categoryId: "medications-supplements", name: "Vitamin D Drops", date: "2025-05-20", description: "Daily 1000 IU." },
        { id: "ms-4", categoryId: "medications-supplements", name: "Calcium Tablet", date: "2025-02-15", description: "Daily 500 mg." },
    ],
    "vaccinations": [
        { id: "v-1", categoryId: "vaccinations", name: "Flu Vaccine 2025", date: "2025-10-01", description: "Annual vaccination completed." },
        { id: "v-2", categoryId: "vaccinations", name: "Tdap Booster", date: "2025-04-18", description: "Boost immunity during pregnancy." },
        { id: "v-3", categoryId: "vaccinations", name: "COVID-19 Booster", date: "2025-01-22", description: "Updated booster received." },
        { id: "v-4", categoryId: "vaccinations", name: "Hepatitis B (Dose 3)", date: "2024-08-05", description: "Final dose in the series." },
        { id: "v-5", categoryId: "vaccinations", name: "MMR Vaccine", date: "2024-03-14", description: "Pre-conception immunity check." },
        { id: "v-6", categoryId: "vaccinations", name: "HPV Vaccine (Dose 2)", date: "2023-11-10", description: "Completing HPV series." },
    ],
    "personal-health-notes": [
        { id: "pn-1", categoryId: "personal-health-notes", name: "Dietary Changes", date: "2025-11-15", description: "Increased protein and fibre intake." },
        { id: "pn-2", categoryId: "personal-health-notes", name: "Morning Sickness Log", date: "2025-09-30", description: "Symptoms easing by week 14." },
        { id: "pn-3", categoryId: "personal-health-notes", name: "Activity Tracker", date: "2025-07-20", description: "Daily walking targets met." },
    ],
    "others": [
        { id: "o-1", categoryId: "others", name: "Hospital Tour Notes", date: "2025-08-25", description: "Location of triage and maternity ward noted." },
    ],
};

let _uid = 400;
const uid = () => String(++_uid);

export default function RecordsPage() {
    const params = useParams();
    const router = useRouter();
    const categoryId = params?.categoryId as string;
    const meta = CATEGORY_META[categoryId] ?? { name: "Records", icon: "📋" };

    const [records, setRecords] = useState<HealthRecord[]>(DUMMY_RECORDS[categoryId] ?? []);
    const [formOpen, setFormOpen] = useState(false);
    const [editTarget, setEditTarget] = useState<HealthRecord | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<HealthRecord | null>(null);

    const handleAdd = () => { setEditTarget(null); setFormOpen(true); };
    const handleEdit = (rec: HealthRecord) => { setEditTarget(rec); setFormOpen(true); };

    const handleFormSubmit = (data: RecordFormData) => {
        if (editTarget) {
            setRecords((prev) => prev.map((r) => r.id === editTarget.id ? { ...r, ...data } : r));
        } else {
            setRecords((prev) => [...prev, { id: uid(), categoryId, ...data }]);
        }
    };

    const confirmDelete = () => {
        if (!deleteTarget) return;
        setRecords((prev) => prev.filter((r) => r.id !== deleteTarget.id));
        setDeleteTarget(null);
    };

    return (
        <Container title={meta.name}>
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
                            <span className="text-xl">{meta.icon}</span>
                            <h1 className="text-xl md:text-2xl font-bold text-gray-900">{meta.name}</h1>
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
