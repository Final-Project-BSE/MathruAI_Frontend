"use client";

import { useState, useEffect } from "react";
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

import healthRecordsApi, { getFileUrl, downloadSecureFile, updateRecord } from "@/app/api/health-records/api";
import { useSecureFile } from "@/hooks/useSecureFile";

function SecureImage({ fileUrl, alt, className }: { fileUrl: string, alt: string, className?: string }) {
    const { objectUrl, loading } = useSecureFile(fileUrl);
    if (loading) return <div className={`flex items-center justify-center bg-gray-100 animate-pulse ${className}`} />;
    if (!objectUrl) return <div className={`flex items-center justify-center bg-gray-100 text-gray-400 text-xs ${className}`}>Failed to load</div>;
    return <img src={objectUrl} alt={alt} className={className} />;
}

function formatDate(dateStr: string) {
    if (!dateStr) return "N/A";
    try {
        return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    } catch {
        return dateStr;
    }
}
function humanSize(bytes: number) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

const handleDownload = async (file: UploadedFile) => {
    try {
        const { getSession } = await import("@/lib/authentication");
        const session = await getSession();
        if (session?.user?.token) {
            await downloadSecureFile(session.user.token, file.data, file.name);
        }
    } catch (e) {
        console.error(e);
    }
};

export default function SingleRecordPage() {
    const params = useParams();
    const router = useRouter();
    const categoryId = params?.categoryId as string;
    const recordId = params?.recordId as string;

    const catMeta = CATEGORY_META[categoryId] ?? { name: "Records", icon: "📋" };

    const [record, setRecord] = useState<{
        id: string; categoryId: string; name: string;
        date: string; description?: string; files?: UploadedFile[];
    } | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [lightboxFile, setLightboxFile] = useState<UploadedFile | null>(null);

    useEffect(() => {
        const fetchRecordDetails = async () => {
            try {
                setLoading(true);
                const { getSession } = await import("@/lib/authentication");
                const session = await getSession();
                const token = session?.user?.token;

                if (!token) {
                    setError("Unauthorized. Please login.");
                    return;
                }

                const data = await healthRecordsApi.getRecordDetails(token, recordId);

                setRecord({
                    id: data.id,
                    categoryId: categoryId,
                    name: data.name,
                    date: data.date,
                    description: data.description,
                    files: data.files?.map(f => ({
                        id: f.id,
                        name: f.fileName,
                        type: f.fileType,
                        size: f.fileSize,
                        data: f.fileUrl
                    })) || []
                });
            } catch (err) {
                console.error("Failed to fetch record details:", err);
                setError("Failed to load record details.");
            } finally {
                setLoading(false);
            }
        };
        fetchRecordDetails();
    }, [recordId, categoryId]);

    if (loading) {
        return (
            <Container title="Loading...">
                <div className="bg-[#fed2cc] min-h-screen p-4 md:p-6 flex items-center justify-center">
                    <p className="text-pink-600 font-medium animate-pulse">Loading record details...</p>
                </div>
            </Container>
        );
    }

    if (error || !record) {
        return (
            <Container title="Error">
                <div className="bg-[#fed2cc] min-h-screen p-4 md:p-6 flex flex-col items-center justify-center gap-4">
                    <p className="text-red-600 font-medium bg-red-50 p-4 rounded-xl shadow-sm border border-red-100">{error || "Record not found"}</p>
                    <Button variant="outline" onClick={() => router.push(`/health-records/${categoryId}`)} className="rounded-xl">
                        <ChevronLeft className="h-4 w-4 mr-2" /> Back to Category
                    </Button>
                </div>
            </Container>
        );
    }

    const imageFiles = (record.files ?? []).filter((f) => f.type.startsWith("image/"));
    const docFiles = (record.files ?? []).filter((f) => !f.type.startsWith("image/"));

    const handleEdit = async (data: RecordFormData) => {
        try {
            const { getSession } = await import("@/lib/authentication");
            const session = await getSession();
            const token = session?.user?.token;
            if (!token || !record) return;

            const newFileObjects = data.files
                ?.map(f => f.file)
                .filter((f): f is File => f instanceof File) ?? [];

            await updateRecord(token, record.id, {
                name: data.name,
                date: data.date,
                description: data.description,
                files: newFileObjects
            });

            // Re-fetch the updated record from backend
            const updated = await healthRecordsApi.getRecordDetails(token, record.id);
            setRecord({
                id: updated.id,
                categoryId: categoryId,
                name: updated.name,
                date: updated.date,
                description: updated.description,
                files: updated.files?.map(f => ({
                    id: f.id,
                    name: f.fileName,
                    type: f.fileType,
                    size: f.fileSize,
                    data: f.fileUrl
                })) || []
            });
            setEditOpen(false);
        } catch (err) {
            console.error("Failed to update record:", err);
            alert("Failed to update record. Please try again.");
        }
    };
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
                    <span className="text-gray-700 font-medium truncate max-w-[160px]">{record?.name}</span>
                </div>

                <div className="max-w-3xl mx-auto space-y-4">
                    <Card className="bg-white/90 backdrop-blur rounded-2xl shadow-sm overflow-hidden">
                        <CardContent className="p-5 md:p-7 space-y-5">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <h1 className="text-xl md:text-2xl font-bold text-gray-900">{record?.name}</h1>
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
                                    <p className="text-sm font-semibold text-gray-800">{formatDate(record?.date || "")}</p>
                                </div>
                            </div>

                            {record?.description && (
                                <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-xl">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-100 mt-0.5 shrink-0">
                                        <AlignLeft className="h-5 w-5 text-purple-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium mb-1">Description</p>
                                        <p className="text-sm text-gray-700 leading-relaxed">{record?.description}</p>
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
                                            onClick={() => setLightboxFile(f)}>
                                            <SecureImage fileUrl={f.data} alt={f.name} className="absolute inset-0 w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                                                <button onClick={(e) => { e.stopPropagation(); handleDownload(f); }}
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
                                            <Button size="sm" onClick={() => handleDownload(f)}
                                                className="rounded-xl bg-red-500 hover:bg-red-600 text-white gap-1.5 text-xs shrink-0">
                                                <Download className="h-3.5 w-3.5" />Download
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {(record?.files ?? []).length === 0 && (
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

            {lightboxFile && (
                <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={() => setLightboxFile(null)}>
                    <div className="relative max-w-4xl w-full max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
                        <SecureImage fileUrl={lightboxFile.data} alt="Preview" className="w-full h-auto max-h-[85vh] object-contain rounded-2xl" />
                        <button onClick={() => {
                            handleDownload(lightboxFile);
                        }} className="absolute bottom-3 right-3 bg-pink-500 hover:bg-pink-600 text-white rounded-xl px-4 py-2 text-sm flex items-center gap-2 shadow">
                            <Download className="h-4 w-4" />Download
                        </button>
                    </div>
                </div>
            )}

            <RecordFormModal isOpen={editOpen} onClose={() => setEditOpen(false)} onSubmit={handleEdit} initialData={record} />
            <DeleteConfirmModal isOpen={deleteOpen} onClose={() => setDeleteOpen(false)} onConfirm={handleDelete} itemName={record?.name || ""} itemType="Record" />
        </Container>
    );
}
