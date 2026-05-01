"use client";

import { useEffect, useRef, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UploadCloud, X, FileText } from "lucide-react";

export interface UploadedFile {
    name: string;
    type: string;   // MIME type e.g. "image/jpeg" or "application/pdf"
    data: string;   // base64 data URL for preview
    size: number;   // bytes
    file?: File;    // Original file object for uploading
}

export interface RecordFormData {
    name: string;
    date: string;
    description?: string;
    files?: UploadedFile[];
}

interface RecordFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: RecordFormData) => void;
    initialData?: RecordFormData | null;
}

function humanSize(bytes: number) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export default function RecordFormModal({
    isOpen,
    onClose,
    onSubmit,
    initialData,
}: RecordFormModalProps) {
    const [name, setName] = useState("");
    const [date, setDate] = useState("");
    const [description, setDescription] = useState("");
    const [files, setFiles] = useState<UploadedFile[]>([]);
    const [errors, setErrors] = useState<{ name?: string; date?: string }>({});
    const [isDragging, setIsDragging] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (initialData) {
            setName(initialData.name);
            setDate(initialData.date);
            setDescription(initialData.description ?? "");
            setFiles(initialData.files ?? []);
        } else {
            setName("");
            setDate("");
            setDescription("");
            setFiles([]);
        }
        setErrors({});
    }, [initialData, isOpen]);

    const readFiles = (fileList: FileList) => {
        Array.from(fileList).forEach((file) => {
            const reader = new FileReader();
            reader.onload = () => {
                setFiles((prev) => [
                    ...prev,
                    {
                        name: file.name,
                        type: file.type,
                        data: reader.result as string,
                        size: file.size,
                        file: file // Store the original file object
                    },
                ]);
            };
            reader.readAsDataURL(file);
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) readFiles(e.target.files);
        e.target.value = "";
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files) readFiles(e.dataTransfer.files);
    };

    const removeFile = (index: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: { name?: string; date?: string } = {};
        if (!name.trim()) newErrors.name = "Record name is required.";
        if (!date) newErrors.date = "Date is required.";
        if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
        onSubmit({ name: name.trim(), date, description: description.trim() || undefined, files });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[520px] rounded-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-[#d04f51] text-base font-semibold">
                        {initialData ? "Edit Record" : "Add New Record"}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 mt-2">
                    {/* Name */}
                    <div className="space-y-1.5">
                        <Label htmlFor="rec-name" className="text-sm font-medium text-gray-700">
                            Record Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="rec-name"
                            placeholder="e.g. Annual Blood Panel"
                            value={name}
                            onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: undefined })); }}
                            className="rounded-xl"
                        />
                        {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                    </div>

                    {/* Date */}
                    <div className="space-y-1.5">
                        <Label htmlFor="rec-date" className="text-sm font-medium text-gray-700">
                            Date <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="rec-date"
                            type="date"
                            value={date}
                            onChange={(e) => { setDate(e.target.value); setErrors((p) => ({ ...p, date: undefined })); }}
                            className="rounded-xl"
                        />
                        {errors.date && <p className="text-xs text-red-500">{errors.date}</p>}
                    </div>

                    {/* Description */}
                    <div className="space-y-1.5">
                        <Label htmlFor="rec-desc" className="text-sm font-medium text-gray-700">
                            Description <span className="text-gray-400 font-normal">(optional)</span>
                        </Label>
                        <Textarea
                            id="rec-desc"
                            placeholder="Add notes or details about this record..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            className="rounded-xl resize-none"
                        />
                    </div>

                    {/* File upload drop zone */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">
                            Attach Files <span className="text-gray-400 font-normal">(images, PDFs — multiple allowed)</span>
                        </Label>

                        <div
                            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                            onDragLeave={() => setIsDragging(false)}
                            onDrop={handleDrop}
                            onClick={() => fileRef.current?.click()}
                            className={`w-full border-2 border-dashed rounded-xl p-5 flex flex-col items-center justify-center gap-2 cursor-pointer transition
                ${isDragging ? "border-pink-500 bg-pink-50" : "border-pink-200 hover:border-pink-400 hover:bg-pink-50"}`}
                        >
                            <UploadCloud className="h-8 w-8 text-[#d04f51]" />
                            <p className="text-sm text-gray-600 font-medium">Click or drag & drop files here</p>
                            <p className="text-xs text-gray-400">Supports: JPG, PNG, WEBP, GIF, PDF</p>
                        </div>

                        <input
                            ref={fileRef}
                            type="file"
                            accept="image/*,application/pdf"
                            multiple
                            className="hidden"
                            onChange={handleFileChange}
                        />

                        {/* File list */}
                        {files.length > 0 && (
                            <ul className="space-y-2 mt-2">
                                {files.map((f, i) => {
                                    const isImg = f.type.startsWith("image/");
                                    return (
                                        <li key={i} className="flex items-center gap-3 bg-gray-50 rounded-xl px-3 py-2">
                                            {isImg ? (
                                                <div className="relative h-10 w-10 rounded-lg overflow-hidden shrink-0">
                                                    <img src={f.data} alt={f.name} className="absolute inset-0 w-full h-full object-cover" />
                                                </div>
                                            ) : (
                                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 shrink-0">
                                                    <FileText className="h-5 w-5 text-red-500" />
                                                </div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-medium text-gray-800 truncate">{f.name}</p>
                                                <p className="text-xs text-gray-400">{humanSize(f.size)}</p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                                                className="text-gray-400 hover:text-red-500 transition"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>

                    <DialogFooter className="gap-2 pt-2">
                        <Button type="button" variant="outline" onClick={onClose} className="flex-1 rounded-xl">
                            Cancel
                        </Button>
                        <Button type="submit" className="flex-1 rounded-xl bg-[#d04f51] text-white">
                            {initialData ? "Save Changes" : "Add Record"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
