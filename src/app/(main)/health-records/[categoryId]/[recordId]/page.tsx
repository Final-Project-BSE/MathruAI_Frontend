"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Container from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
    ChevronLeft,
    Pencil,
    Trash2,
    FileText,
    CalendarDays,
    AlignLeft,
    ImageIcon,
    Download,
    Paperclip,
} from "lucide-react";
import Image from "next/image";
import TopBarFeatures from "@/components/common/TopBarFeatures";
import RecordFormModal, { RecordFormData, UploadedFile } from "@/components/health-records/RecordFormModal";
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

// Dummy records for Single Record View
const ALL_RECORDS: Record<string, {
    id: string; categoryId: string; name: string;
    date: string; description?: string; files?: UploadedFile[];
}[]> = {
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

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

function humanSize(bytes: number) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function downloadFile(file: UploadedFile) {
    const a = document.createElement("a");
    a.href = file.data;
    a.download = file.name;
    a.click();
}

export default function SingleRecordPage() {
    const params = useParams();
    const router = useRouter();
    const categoryId = params?.categoryId as string;
    const recordId = params?.recordId as string;

    const catMeta = CATEGORY_META[categoryId] ?? { name: "Records", icon: "📋" };

    const initial = (ALL_RECORDS[categoryId] ?? []).find((r) => r.id === recordId) ?? {
        id: recordId,
        categoryId,
        name: "Unknown Record",
        date: new Date().toISOString().split("T")[0],
        description: "No details available.",
        files: [],
    };

    const [record, setRecord] = useState(initial);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [lightboxImg, setLightboxImg] = useState<string | null>(null);

    const imageFiles = (record.files ?? []).filter((f) => f.type.startsWith("image/"));
    const docFiles = (record.files ?? []).filter((f) => !f.type.startsWith("image/"));

    const handleEdit = (data: RecordFormData) => setRecord((prev) => ({ ...prev, ...data }));
    const handleDelete = () => router.push(`/health-records/${categoryId}`);

    return (
        <Container title={record.name}>
            <div className="bg-[#fed2cc] min-h-screen p-4 md:p-6">
                <TopBarFeatures />

                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm mb-6 flex-wrap">
                    <button onClick={() => router.push("/health-records")}
                        className="text-pink-600 hover:text-pink-800 font-medium transition-colors flex items-center gap-1">
                        <ChevronLeft className="h-4 w-4" />Health Records
                    </button>
                    <span className="text-gray-400">/</span>
                    <button onClick={() => router.push(`/health-records/${categoryId}`)}
                        className="text-pink-600 hover:text-pink-800 font-medium transition-colors">
                        {catMeta.name}
                    </button>
                    <span className="text-gray-400">/</span>
                    <span className="text-gray-700 font-medium truncate max-w-[160px]">{record.name}</span>
                </div>

                <div className="max-w-3xl mx-auto space-y-4">
                    <Card className="bg-white/90 backdrop-blur rounded-2xl shadow-sm overflow-hidden">
                        <CardContent className="p-5 md:p-7 space-y-5">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <h1 className="text-xl md:text-2xl font-bold text-gray-900">{record.name}</h1>
                                    <Badge className="mt-1.5 bg-pink-100 text-pink-700 hover:bg-pink-100 rounded-full text-xs font-medium">
                                        {catMeta.icon} {catMeta.name}
                                    </Badge>
                                </div>
                                <div className="flex gap-2 mt-1 shrink-0">
                                    <Button size="sm" variant="ghost" onClick={() => setEditOpen(true)}
                                        className="rounded-xl hover:bg-pink-50 hover:text-pink-600 text-gray-600 gap-1.5 text-xs">
                                        <Pencil className="h-3.5 w-3.5" />Edit
                                    </Button>
                                    <Button size="sm" variant="ghost" onClick={() => setDeleteOpen(true)}
                                        className="rounded-xl hover:bg-red-50 hover:text-red-600 text-gray-600 gap-1.5 text-xs">
                                        <Trash2 className="h-3.5 w-3.5" />Delete
                                    </Button>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-xl">
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-100">
                                    <CalendarDays className="h-5 w-5 text-orange-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-medium">Date</p>
                                    <p className="text-sm font-semibold text-gray-800">{formatDate(record.date)}</p>
                                </div>
                            </div>

                            {record.description && (
                                <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-xl">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-100 mt-0.5 shrink-0">
                                        <AlignLeft className="h-5 w-5 text-purple-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium mb-1">Description</p>
                                        <p className="text-sm text-gray-700 leading-relaxed">{record.description}</p>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {imageFiles.length > 0 && (
                        <Card className="bg-white/90 backdrop-blur rounded-2xl shadow-sm overflow-hidden">
                            <CardContent className="p-5 md:p-7">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
                                        <ImageIcon className="h-4 w-4 text-blue-600" />
                                    </div>
                                    <h2 className="text-sm font-semibold text-gray-800">Images ({imageFiles.length})</h2>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {imageFiles.map((f, i) => (
                                        <div key={i} className="group relative rounded-xl overflow-hidden aspect-square bg-gray-100 cursor-pointer"
                                            onClick={() => setLightboxImg(f.data)}>
                                            <Image src={f.data} alt={f.name} fill className="object-cover" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                                                <button onClick={(e) => { e.stopPropagation(); downloadFile(f); }}
                                                    className="bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 shadow transition">
                                                    <Download className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {docFiles.length > 0 && (
                        <Card className="bg-white/90 backdrop-blur rounded-2xl shadow-sm">
                            <CardContent className="p-5 md:p-7">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100">
                                        <FileText className="h-4 w-4 text-red-600" />
                                    </div>
                                    <h2 className="text-sm font-semibold text-gray-800">Documents ({docFiles.length})</h2>
                                </div>
                                <div className="space-y-2">
                                    {docFiles.map((f, i) => (
                                        <div key={i} className="flex items-center gap-3 p-3 bg-red-50 rounded-xl hover:bg-red-100 transition">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 shrink-0">
                                                <FileText className="h-5 w-5 text-red-500" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-800 truncate">{f.name}</p>
                                                <p className="text-xs text-gray-400">{humanSize(f.size)}</p>
                                            </div>
                                            <Button size="sm" onClick={() => downloadFile(f)}
                                                className="rounded-xl bg-red-500 hover:bg-red-600 text-white gap-1.5 text-xs shrink-0">
                                                <Download className="h-3.5 w-3.5" />Download
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {(record.files ?? []).length === 0 && (
                        <Card className="bg-white/90 backdrop-blur rounded-2xl shadow-sm">
                            <CardContent className="p-6 flex flex-col items-center justify-center gap-2 text-center">
                                <Paperclip className="h-8 w-8 text-pink-200" />
                                <p className="text-sm text-gray-500 font-medium">No files attached</p>
                            </CardContent>
                        </Card>
                    )}

                    <Button variant="outline" onClick={() => router.push(`/health-records/${categoryId}`)}
                        className="w-full rounded-xl gap-2">
                        <ChevronLeft className="h-4 w-4" />Back to {catMeta.name}
                    </Button>
                </div>
            </div>

            {lightboxImg && (
                <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={() => setLightboxImg(null)}>
                    <div className="relative max-w-4xl w-full max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
                        <img src={lightboxImg} alt="Preview" className="w-full h-auto max-h-[85vh] object-contain rounded-2xl" />
                        <button onClick={() => {
                            const file = imageFiles.find((f) => f.data === lightboxImg);
                            if (file) downloadFile(file);
                        }} className="absolute bottom-3 right-3 bg-pink-500 hover:bg-pink-600 text-white rounded-xl px-4 py-2 text-sm flex items-center gap-2 shadow">
                            <Download className="h-4 w-4" />Download
                        </button>
                    </div>
                </div>
            )}

            <RecordFormModal isOpen={editOpen} onClose={() => setEditOpen(false)} onSubmit={handleEdit} initialData={record} />
            <DeleteConfirmModal isOpen={deleteOpen} onClose={() => setDeleteOpen(false)} onConfirm={handleDelete} itemName={record.name} itemType="Record" />
        </Container>
    );
}
