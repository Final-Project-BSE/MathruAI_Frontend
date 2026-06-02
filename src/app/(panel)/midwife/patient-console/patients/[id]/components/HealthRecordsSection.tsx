"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import {
  CalendarDays,
  Download,
  Eye,
  FileText,
  ImageIcon,
  Loader2,
  Plus,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import type {
  HealthCategoryResponseDto,
  HealthRecordResponseDto,
  RecordFileResponseDto,
} from "@/app/api/midwife-patient/types";
import { formatDate } from "./lib/utils";
import healthRecordsApi from "@/app/api/health-records/api";

type HealthRecordRequest = {
  name: string;
  date: string;
  description?: string;
  files: File[];
};

type HealthRecordsSectionProps = {
  categories: HealthCategoryResponseDto[];
  selectedCategoryId: string;
  setSelectedCategoryId: (value: string) => void;
  recordsLoading: boolean;
  records: HealthRecordResponseDto[];
  token: string;
  midwifeId: number | null;
  patientId: number;
  onRecordsChanged: () => Promise<void>;
};

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:8080"
).replace(/\/$/, "");

function isImageFile(file: RecordFileResponseDto) {
  return (
    file.fileType?.startsWith("image/") ||
    /\.(png|jpg|jpeg|webp|gif)$/i.test(file.fileName)
  );
}

function isPdfFile(file: RecordFileResponseDto) {
  return file.fileType === "application/pdf" || /\.pdf$/i.test(file.fileName);
}

function formatFileSize(size?: number) {
  if (!size) return "";
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

export default function HealthRecordsSection({
  categories,
  selectedCategoryId,
  setSelectedCategoryId,
  recordsLoading,
  records,
  token,
  midwifeId,
  patientId,
  onRecordsChanged,
}: HealthRecordsSectionProps) {
  const [selectedRecord, setSelectedRecord] =
    useState<HealthRecordResponseDto | null>(null);
  const [previewFile, setPreviewFile] = useState<RecordFileResponseDto | null>(
    null
  );
  const [previewUrl, setPreviewUrl] = useState("");
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState("");

  const [downloadingFileId, setDownloadingFileId] = useState<string | null>(
    null
  );
  const [downloadError, setDownloadError] = useState("");

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [savingRecord, setSavingRecord] = useState(false);
  const [deletingRecordId, setDeletingRecordId] = useState<string | null>(null);
  const [formError, setFormError] = useState("");

  const [form, setForm] = useState<HealthRecordRequest>({
    name: "",
    date: new Date().toISOString().slice(0, 10),
    description: "",
    files: [],
  });

  const selectedCategory = useMemo(() => {
    return categories.find((category) => category.id === selectedCategoryId);
  }, [categories, selectedCategoryId]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        window.URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  async function createProtectedBlobUrl(file: RecordFileResponseDto) {
    if (!token) {
      throw new Error("You are not authenticated. Please sign in again.");
    }

    const res = await fetch(`${API_BASE_URL}${file.fileUrl}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to load file preview.");
    }

    const blob = await res.blob();
    return window.URL.createObjectURL(blob);
  }

  async function openRecordPreview(record: HealthRecordResponseDto) {
    setSelectedRecord(record);
    setPreviewError("");
    setDownloadError("");

    if (previewUrl) {
      window.URL.revokeObjectURL(previewUrl);
      setPreviewUrl("");
    }

    const file =
      record.files?.find((item) => isImageFile(item) || isPdfFile(item)) ||
      record.files?.[0] ||
      null;

    setPreviewFile(file);

    if (!file) return;

    if (!isImageFile(file) && !isPdfFile(file)) {
      setPreviewError("Preview is not available for this file type.");
      return;
    }

    try {
      setPreviewLoading(true);
      const blobUrl = await createProtectedBlobUrl(file);
      setPreviewUrl(blobUrl);
    } catch (err) {
      setPreviewUrl("");
      setPreviewError(
        err instanceof Error ? err.message : "Failed to load file preview."
      );
    } finally {
      setPreviewLoading(false);
    }
  }

  async function switchPreviewFile(file: RecordFileResponseDto) {
    if (previewUrl) {
      window.URL.revokeObjectURL(previewUrl);
    }

    setPreviewFile(file);
    setPreviewUrl("");
    setPreviewError("");

    if (!isImageFile(file) && !isPdfFile(file)) {
      setPreviewError("Preview is not available for this file type.");
      return;
    }

    try {
      setPreviewLoading(true);
      const blobUrl = await createProtectedBlobUrl(file);
      setPreviewUrl(blobUrl);
    } catch (err) {
      setPreviewError(
        err instanceof Error ? err.message : "Failed to load file preview."
      );
    } finally {
      setPreviewLoading(false);
    }
  }

  function closePreview() {
    if (previewUrl) {
      window.URL.revokeObjectURL(previewUrl);
    }

    setSelectedRecord(null);
    setPreviewFile(null);
    setPreviewUrl("");
    setPreviewError("");
    setDownloadError("");
    setPreviewLoading(false);
  }

  async function downloadFile(file: RecordFileResponseDto) {
    if (!token) {
      setDownloadError("You are not authenticated. Please sign in again.");
      return;
    }

    try {
      setDownloadError("");
      setDownloadingFileId(file.id);

      const res = await fetch(`${API_BASE_URL}${file.fileUrl}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Failed to download file.");
      }

      const blob = await res.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = file.fileName || "health-record-file";
      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      setDownloadError(
        err instanceof Error ? err.message : "Failed to download file."
      );
    } finally {
      setDownloadingFileId(null);
    }
  }

  async function handleCreateRecord(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!token || !midwifeId || !patientId || !selectedCategoryId) {
      setFormError("Missing midwife, patient, category, or authentication data.");
      return;
    }

    if (!form.name.trim()) {
      setFormError("Record name is required.");
      return;
    }

    if (!form.date) {
      setFormError("Record date is required.");
      return;
    }

    try {
      setSavingRecord(true);
      setFormError("");

      await healthRecordsApi.createRecordForAssignedPatient(
        token,
        midwifeId,
        patientId,
        selectedCategoryId,
        form
      );

      setForm({
        name: "",
        date: new Date().toISOString().slice(0, 10),
        description: "",
        files: [],
      });

      setShowCreateForm(false);
      await onRecordsChanged();
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Failed to create health record."
      );
    } finally {
      setSavingRecord(false);
    }
  }

  async function handleDeleteRecord(record: HealthRecordResponseDto) {
    if (!token || !midwifeId || !patientId) {
      setDownloadError("Missing midwife, patient, or authentication data.");
      return;
    }

    const confirmed = window.confirm(
      `Delete "${record.name}"? This will also delete attached files.`
    );

    if (!confirmed) return;

    try {
      setDeletingRecordId(record.id);
      setDownloadError("");

      await healthRecordsApi.deleteRecordForAssignedPatient(
        token,
        midwifeId,
        patientId,
        record.id
      );

      if (selectedRecord?.id === record.id) {
        closePreview();
      }

      await onRecordsChanged();
    } catch (err) {
      setDownloadError(
        err instanceof Error ? err.message : "Failed to delete health record."
      );
    } finally {
      setDeletingRecordId(null);
    }
  }

  return (
    <>
      <section className="rounded-2xl border border-white/10 bg-zinc-950 p-5">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-md font-semibold text-white">Health Records</h2>
            <p className="text-xs text-zinc-500">
              Add, preview, download or delete records for this patient.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <select
              value={selectedCategoryId}
              onChange={(e) => setSelectedCategoryId(e.target.value)}
              className="rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-xs text-white outline-none"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name} ({category.recordCount})
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => {
                setShowCreateForm((value) => !value);
                setFormError("");
              }}
              disabled={!selectedCategoryId}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-2 text-xs font-semibold text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Plus className="h-4 w-4" />
              Add Record
            </button>
          </div>
        </div>

        {showCreateForm ? (
          <form
            onSubmit={handleCreateRecord}
            className="mb-5 rounded-lg border border-white/10 bg-zinc-900 p-4"
          >
            <div className="mb-2 flex items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-white">
                  New Health Record
                </h3>
                <p className="mt-1 text-xs text-zinc-500">
                  Category: {selectedCategory?.name || "Selected category"}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="rounded-xl border border-white/10 p-2 text-zinc-400 hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {formError ? (
              <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-xs text-red-300">
                {formError}
              </div>
            ) : null}

            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-xs font-medium text-zinc-300">
                  Record Name
                </span>
                <input
                  value={form.name}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-xs text-white outline-none"
                  placeholder="Blood report, scan report..."
                />
              </label>

              <label className="space-y-2">
                <span className="text-xs font-medium text-zinc-300">Date</span>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, date: e.target.value }))
                  }
                  className="w-full rounded-xl border border-white/10 bg-black px-3 py-2 text-xs text-white outline-none"
                />
              </label>
            </div>

            <label className="mt-2 block space-y-2">
              <span className="text-xs font-medium text-zinc-300">
                Description
              </span>
              <textarea
                value={form.description || ""}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                rows={3}
                className="w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-xs text-white outline-none"
                placeholder="Optional notes..."
              />
            </label>

            <label className="mt-2 flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-white/10 bg-black px-4 py-4 text-center hover:bg-white/5">
              <Upload className="mb-2 h-5 w-5 text-zinc-400" />
              <span className="text-xs font-medium text-zinc-300">
                Upload files
              </span>
              <span className="mt-1 text-xs text-zinc-500">
                Images, PDFs, or documents
              </span>
              <input
                type="file"
                multiple
                className="hidden"
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  setForm((prev) => ({ ...prev, files }));
                }}
              />
            </label>

            {form.files.length ? (
              <div className="mt-3 text-sm text-zinc-400">
                {form.files.length} file{form.files.length === 1 ? "" : "s"}{" "}
                selected
              </div>
            ) : null}

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="rounded-xl border border-white/10 px-4 py-2 text-xs text-zinc-300 hover:bg-white/10"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={savingRecord}
                className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-xs font-semibold text-black hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {savingRecord ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : null}
                Save Record
              </button>
            </div>
          </form>
        ) : null}

        {downloadError ? (
          <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {downloadError}
          </div>
        ) : null}

        {recordsLoading ? (
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading records...
          </div>
        ) : records.length === 0 ? (
          <div className="text-xs text-zinc-500">
            No records in this category.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {records.map((record) => {
              const fileCount = record.files?.length || 0;
              const coverFile =
                record.files?.find((file) => isImageFile(file)) ||
                record.files?.[0] ||
                null;

              const isDeleting = deletingRecordId === record.id;

              return (
                <div
                  key={record.id}
                  className="group overflow-hidden rounded-xl border border-white/10 bg-zinc-900 transition hover:border-white/25 hover:bg-zinc-800"
                >
                  <button
                    type="button"
                    onClick={() => openRecordPreview(record)}
                    className="w-full text-left"
                  >
                    <div className="flex aspect-[5/3] items-center justify-center bg-black/30">
                      {coverFile && isImageFile(coverFile) ? (
                        <ImageIcon className="h-10 w-10 text-zinc-500 transition group-hover:text-zinc-300" />
                      ) : (
                        <FileText className="h-10 w-10 text-zinc-500 transition group-hover:text-zinc-300" />
                      )}
                    </div>

                    <div className="pb-1 pl-3 pr-3 pt-1">
                      <div className="line-clamp-2 text-sm font-semibold text-white">
                        {record.name}
                      </div>

                      <div className="mt-1 flex items-center gap-1 text-xs text-zinc-500">
                        <CalendarDays className="h-3.5 w-3.5" />
                        {formatDate(record.date)}
                      </div>

                      <div className="mt-1 flex items-center justify-between gap-2">
                        <span className="truncate text-xs text-zinc-500">
                          {record.categoryName}
                        </span>

                        <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] font-medium text-zinc-400">
                          {fileCount} file{fileCount === 1 ? "" : "s"}
                        </span>
                      </div>

                      <div className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-zinc-300">
                        <Eye className="h-3.5 w-3.5" />
                        Preview
                      </div>
                    </div>
                  </button>

                  <div className="border-t border-white/10 p-3">
                    <button
                      type="button"
                      onClick={() => handleDeleteRecord(record)}
                      disabled={isDeleting}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-1 text-xs text-red-300 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isDeleting ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Trash2 className="h-3 w-3" />
                      )}
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {selectedRecord ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="flex max-h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-white/10 p-4">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  {selectedRecord.name}
                </h3>
                <p className="mt-1 text-sm text-zinc-500">
                  {formatDate(selectedRecord.date)} ·{" "}
                  {selectedRecord.categoryName || "Health record"}
                </p>
                {selectedRecord.description ? (
                  <p className="mt-2 text-sm text-zinc-400">
                    {selectedRecord.description}
                  </p>
                ) : null}
              </div>

              <button
                type="button"
                onClick={closePreview}
                className="rounded-xl border border-white/10 p-2 text-zinc-400 hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)]">
              <aside className="border-b border-white/10 p-4 lg:border-b-0 lg:border-r">
                <div className="mb-3 text-sm font-semibold text-white">
                  Files
                </div>

                {selectedRecord.files?.length ? (
                  <div className="space-y-2">
                    {selectedRecord.files.map((file) => {
                      const selected = previewFile?.id === file.id;

                      return (
                        <button
                          key={file.id}
                          type="button"
                          onClick={() => switchPreviewFile(file)}
                          className={`w-full rounded-xl border px-3 py-2 text-left text-sm transition ${
                            selected
                              ? "border-white/30 bg-white/10 text-white"
                              : "border-white/10 bg-black text-zinc-400 hover:bg-white/5 hover:text-white"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {isImageFile(file) ? (
                              <ImageIcon className="h-4 w-4 shrink-0" />
                            ) : (
                              <FileText className="h-4 w-4 shrink-0" />
                            )}
                            <span className="truncate">{file.fileName}</span>
                          </div>

                          <div className="mt-1 text-xs text-zinc-500">
                            {file.fileType || "Unknown type"}{" "}
                            {formatFileSize(file.fileSize)
                              ? `· ${formatFileSize(file.fileSize)}`
                              : ""}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="rounded-xl border border-white/10 bg-black p-3 text-sm text-zinc-500">
                    No files attached.
                  </div>
                )}
              </aside>

              <main className="min-h-[420px] overflow-auto bg-black p-4">
                {previewLoading ? (
                  <div className="flex h-full min-h-[420px] items-center justify-center gap-2 text-sm text-zinc-400">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Loading preview...
                  </div>
                ) : previewError ? (
                  <div className="flex h-full min-h-[420px] items-center justify-center">
                    <div className="max-w-md rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-center text-sm text-red-300">
                      {previewError}
                    </div>
                  </div>
                ) : previewFile && previewUrl && isImageFile(previewFile) ? (
                  <div className="flex min-h-[420px] items-center justify-center">
                    <Image
                      src={previewUrl}
                      alt={previewFile.fileName}
                      width={900}
                      height={700}
                      unoptimized
                      className="max-h-[70vh] max-w-full rounded-xl object-contain"
                    />
                  </div>
                ) : previewFile && previewUrl && isPdfFile(previewFile) ? (
                  <iframe
                    src={previewUrl}
                    title={previewFile.fileName}
                    className="h-[70vh] w-full rounded-xl border border-white/10 bg-white"
                  />
                ) : (
                  <div className="flex h-full min-h-[420px] items-center justify-center text-sm text-zinc-500">
                    Select a previewable image or PDF file.
                  </div>
                )}
              </main>
            </div>

            <div className="flex justify-end gap-2 border-t border-white/10 p-4">
              {previewFile ? (
                <button
                  type="button"
                  onClick={() => downloadFile(previewFile)}
                  disabled={downloadingFileId === previewFile.id}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm text-zinc-300 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {downloadingFileId === previewFile.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                  Download
                </button>
              ) : null}

              <button
                type="button"
                onClick={closePreview}
                className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-zinc-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}