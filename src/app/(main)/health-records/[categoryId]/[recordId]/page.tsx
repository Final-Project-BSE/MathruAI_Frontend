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
import RecordFormModal, {
  RecordFormData,
  UploadedFile,
} from "@/components/health-records/RecordFormModal";
import DeleteConfirmModal from "@/components/health-records/DeleteConfirmModal";

// ─── Shared look-up (dummy records — no file data; users upload their own) ────
const DUMMY_RECORDS: Record<
  string,
  {
    id: string;
    categoryId: string;
    name: string;
    date: string;
    description?: string;
    files?: UploadedFile[];
  }[]
> = {
  "blood-tests": [
    {
      id: "bt-1",
      categoryId: "blood-tests",
      name: "Annual Blood Panel",
      date: "2025-12-10",
      description:
        "Complete blood count, metabolic panel, and lipid profile. All values were within the normal reference ranges. Haemoglobin: 13.4 g/dL, Cholesterol: 178 mg/dL, Fasting Glucose: 92 mg/dL.",
    },
    {
      id: "bt-2",
      categoryId: "blood-tests",
      name: "Iron & Ferritin Check",
      date: "2025-09-15",
      description:
        "Iron deficiency screening. Serum ferritin low at 8 ng/mL. Supplementation recommended.",
    },
    {
      id: "bt-3",
      categoryId: "blood-tests",
      name: "Thyroid Function Test",
      date: "2025-06-20",
      description:
        "TSH: 2.1 mIU/L (normal), Free T4: 1.1 ng/dL (normal), Free T3: 3.2 pg/mL (normal).",
    },
    {
      id: "bt-4",
      categoryId: "blood-tests",
      name: "Glucose Tolerance Test",
      date: "2025-03-05",
      description:
        "1-hour screening — 128 mg/dL, below the 140 mg/dL threshold. Negative for GDM.",
    },
  ],
  vaccinations: [
    {
      id: "vx-1",
      categoryId: "vaccinations",
      name: "Flu Vaccine 2025",
      date: "2025-10-01",
      description:
        "Annual influenza vaccine administered at local clinic. Lot #FL25-0192.",
    },
    {
      id: "vx-2",
      categoryId: "vaccinations",
      name: "Tdap Booster",
      date: "2025-04-18",
      description:
        "Tetanus, diphtheria, and pertussis booster. Recommended during pregnancy (27–36 weeks).",
    },
    {
      id: "vx-3",
      categoryId: "vaccinations",
      name: "COVID-19 Booster",
      date: "2025-01-22",
      description: "Updated bivalent mRNA booster. No adverse reactions.",
    },
    {
      id: "vx-4",
      categoryId: "vaccinations",
      name: "HPV Vaccine (Dose 2)",
      date: "2024-11-10",
      description: "Second dose in the 3-dose Gardasil-9 series.",
    },
    {
      id: "vx-5",
      categoryId: "vaccinations",
      name: "Hepatitis B (Dose 3)",
      date: "2024-08-05",
      description: "Third and final dose of Hepatitis B vaccine.",
    },
    {
      id: "vx-6",
      categoryId: "vaccinations",
      name: "MMR Vaccine",
      date: "2024-03-14",
      description: "Measles, mumps, rubella combined vaccine.",
    },
  ],
  prescriptions: [
    {
      id: "rx-1",
      categoryId: "prescriptions",
      name: "Prenatal Vitamins",
      date: "2025-11-01",
      description:
        "Daily prenatal supplement — folic acid 400mcg, iron 27mg, DHA 200mg, vitamin D3 1000IU. Take with a meal.",
    },
    {
      id: "rx-2",
      categoryId: "prescriptions",
      name: "Metformin 500mg",
      date: "2025-08-12",
      description:
        "Twice daily with meals. For blood sugar management in PCOS. Monitor GI side effects.",
    },
    {
      id: "rx-3",
      categoryId: "prescriptions",
      name: "Levothyroxine 50mcg",
      date: "2025-05-20",
      description:
        "Empty stomach, 30 min before breakfast. Subclinical hypothyroidism.",
    },
  ],
  imaging: [
    {
      id: "im-1",
      categoryId: "imaging",
      name: "12-Week Ultrasound",
      date: "2025-12-01",
      description:
        "First trimester dating / NT scan. CRL: 58mm, GA: 12w 3d. NT: 1.4mm (normal). No anomalies.",
    },
    {
      id: "im-2",
      categoryId: "imaging",
      name: "Anatomy Scan (20 wks)",
      date: "2025-10-08",
      description:
        "Detailed fetal anatomy scan. All structural markers normal. Placenta anterior. AFI: 14cm.",
    },
  ],
  dental: [
    {
      id: "dt-1",
      categoryId: "dental",
      name: "Dental Cleaning – Jan 2025",
      date: "2025-01-15",
      description:
        "Routine prophylaxis and fluoride treatment. No cavities. Minor gum inflammation noted.",
    },
    {
      id: "dt-2",
      categoryId: "dental",
      name: "Dental X-Rays",
      date: "2024-07-22",
      description:
        "4 periapical X-rays. No interproximal cavities. Wisdom teeth stable.",
    },
  ],
  vision: [
    {
      id: "vs-1",
      categoryId: "vision",
      name: "Annual Eye Exam 2025",
      date: "2025-03-10",
      description:
        "Dilated eye exam. R: -1.75 sph, -0.50 cyl @ 180. L: -2.00 sph. Prescription updated.",
    },
  ],
  maternity: [
    {
      id: "mt-1",
      categoryId: "maternity",
      name: "First OB Visit",
      date: "2025-11-15",
      description: "Confirmed IUP. EDD: 2026-07-22. BP: 118/72. Weight: 61 kg.",
    },
    {
      id: "mt-2",
      categoryId: "maternity",
      name: "NIPT Screening",
      date: "2025-11-28",
      description: "Low risk for trisomies 21, 18, 13. Fetal sex reported.",
    },
    {
      id: "mt-3",
      categoryId: "maternity",
      name: "GBS Swab Result",
      date: "2025-09-05",
      description: "Group B Strep — Negative.",
    },
    {
      id: "mt-4",
      categoryId: "maternity",
      name: "Growth Scan (32 wks)",
      date: "2025-08-20",
      description:
        "Fetal growth 48th percentile. EFW: 1850g. Amniotic fluid normal.",
    },
    {
      id: "mt-5",
      categoryId: "maternity",
      name: "Hospital Admission Record",
      date: "2025-07-14",
      description:
        "Admitted at 28 weeks — reduced fetal movement. CTG normal. Discharged after 24h.",
    },
  ],
  allergies: [
    {
      id: "al-1",
      categoryId: "allergies",
      name: "Allergy Panel – Dust",
      date: "2025-02-18",
      description:
        "Skin-prick test positive for dust mite. HEPA filter and mattress covers advised.",
    },
    {
      id: "al-2",
      categoryId: "allergies",
      name: "Penicillin Allergy Note",
      date: "2024-09-30",
      description:
        "Penicillin allergy on file (rash 2018). Avoid amoxicillin. Alternative: Azithromycin.",
    },
  ],
};

const CATEGORY_META: Record<string, { name: string; icon: string }> = {
  "blood-tests": { name: "Blood Tests", icon: "🩸" },
  vaccinations: { name: "Vaccinations", icon: "💉" },
  prescriptions: { name: "Prescriptions", icon: "💊" },
  imaging: { name: "Imaging & Scans", icon: "🩻" },
  dental: { name: "Dental", icon: "🦷" },
  vision: { name: "Vision / Eye Care", icon: "👁️" },
  maternity: { name: "Maternity", icon: "🤰" },
  allergies: { name: "Allergies", icon: "🌿" },
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function humanSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

/** Trigger browser download for a base64 data URL */
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

  const initial = (DUMMY_RECORDS[categoryId] ?? []).find(
    (r) => r.id === recordId,
  ) ?? {
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

  const imageFiles = (record.files ?? []).filter((f) =>
    f.type.startsWith("image/"),
  );
  const docFiles = (record.files ?? []).filter(
    (f) => !f.type.startsWith("image/"),
  );

  const handleEdit = (data: RecordFormData) =>
    setRecord((prev) => ({ ...prev, ...data }));
  const handleDelete = () => router.push(`/health-records/${categoryId}`);

  return (
    <Container title={record.name}>
      <div className="bg-[#fed2cc] min-h-screen p-4 md:p-6">
        <TopBarFeatures />

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm mb-6 flex-wrap">
          <button
            onClick={() => router.push("/health-records")}
            className="text-pink-600 hover:text-pink-800 font-medium transition-colors flex items-center gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            Health Records
          </button>
          <span className="text-gray-400">/</span>
          <button
            onClick={() => router.push(`/health-records/${categoryId}`)}
            className="text-pink-600 hover:text-pink-800 font-medium transition-colors"
          >
            {catMeta.name}
          </button>
          <span className="text-gray-400">/</span>
          <span className="text-gray-700 font-medium truncate max-w-[160px]">
            {record.name}
          </span>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {/* ── Main card ─────────────────────────────────────────────────── */}
          <Card className="bg-white/90 backdrop-blur rounded-2xl shadow-sm overflow-hidden">
            <CardContent className="p-5 md:p-7 space-y-5">
              {/* Title & Actions */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                    {record.name}
                  </h1>
                  <Badge className="mt-1.5 bg-pink-100 text-pink-700 hover:bg-pink-100 rounded-full text-xs font-medium">
                    {catMeta.icon} {catMeta.name}
                  </Badge>
                </div>
                <div className="flex gap-2 mt-1 shrink-0">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setEditOpen(true)}
                    className="rounded-xl hover:bg-pink-50 hover:text-pink-600 text-gray-600 gap-1.5 text-xs"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setDeleteOpen(true)}
                    className="rounded-xl hover:bg-red-50 hover:text-red-600 text-gray-600 gap-1.5 text-xs"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </Button>
                </div>
              </div>

              {/* Date */}
              <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-xl">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-100">
                  <CalendarDays className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Date</p>
                  <p className="text-sm font-semibold text-gray-800">
                    {formatDate(record.date)}
                  </p>
                </div>
              </div>

              {/* Description */}
              {record.description && (
                <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-xl">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-100 mt-0.5 shrink-0">
                    <AlignLeft className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium mb-1">
                      Description
                    </p>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {record.description}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* ── Image gallery card ───────────────────────────────────────── */}
          {imageFiles.length > 0 && (
            <Card className="bg-white/90 backdrop-blur rounded-2xl shadow-sm overflow-hidden">
              <CardContent className="p-5 md:p-7">
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
                    <ImageIcon className="h-4 w-4 text-blue-600" />
                  </div>
                  <h2 className="text-sm font-semibold text-gray-800">
                    Images ({imageFiles.length})
                  </h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {imageFiles.map((f, i) => (
                    <div
                      key={i}
                      className="group relative rounded-xl overflow-hidden aspect-square bg-gray-100 cursor-pointer"
                      onClick={() => setLightboxImg(f.data)}
                    >
                      <Image
                        src={f.data}
                        alt={f.name}
                        fill
                        className="object-cover"
                      />
                      {/* Overlay on hover */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            downloadFile(f);
                          }}
                          className="bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 shadow transition"
                          title={`Download ${f.name}`}
                        >
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Per-image download list */}
                <div className="mt-3 space-y-1.5">
                  {imageFiles.map((f, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 text-xs text-gray-600"
                    >
                      <ImageIcon className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                      <span className="flex-1 truncate">{f.name}</span>
                      <span className="text-gray-400 shrink-0">
                        {humanSize(f.size)}
                      </span>
                      <button
                        onClick={() => downloadFile(f)}
                        className="ml-1 text-pink-500 hover:text-pink-700 transition shrink-0"
                        title="Download"
                      >
                        <Download className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* ── Documents card ───────────────────────────────────────────── */}
          {docFiles.length > 0 && (
            <Card className="bg-white/90 backdrop-blur rounded-2xl shadow-sm">
              <CardContent className="p-5 md:p-7">
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100">
                    <FileText className="h-4 w-4 text-red-600" />
                  </div>
                  <h2 className="text-sm font-semibold text-gray-800">
                    Documents ({docFiles.length})
                  </h2>
                </div>
                <div className="space-y-2">
                  {docFiles.map((f, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-3 bg-red-50 rounded-xl hover:bg-red-100 transition"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 shrink-0">
                        <FileText className="h-5 w-5 text-red-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">
                          {f.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          {humanSize(f.size)}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => downloadFile(f)}
                        className="rounded-xl bg-red-500 hover:bg-red-600 text-white gap-1.5 text-xs shrink-0"
                      >
                        <Download className="h-3.5 w-3.5" />
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* No files placeholder */}
          {(record.files ?? []).length === 0 && (
            <Card className="bg-white/90 backdrop-blur rounded-2xl shadow-sm">
              <CardContent className="p-6 flex flex-col items-center justify-center gap-2 text-center">
                <Paperclip className="h-8 w-8 text-pink-200" />
                <p className="text-sm text-gray-500 font-medium">
                  No files attached
                </p>
                <p className="text-xs text-gray-400">
                  Click <strong>Edit</strong> to upload images or PDF documents.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Back button */}
          <Button
            variant="outline"
            onClick={() => router.push(`/health-records/${categoryId}`)}
            className="w-full rounded-xl gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to {catMeta.name}
          </Button>
        </div>
      </div>

      {/* ── Lightbox ─────────────────────────────────────────────────────── */}
      {lightboxImg && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setLightboxImg(null)}
        >
          <div
            className="relative max-w-4xl w-full max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={lightboxImg}
              alt="Preview"
              className="w-full h-auto max-h-[85vh] object-contain rounded-2xl"
            />
            <button
              onClick={() => setLightboxImg(null)}
              className="absolute top-3 right-3 bg-white/90 hover:bg-white rounded-full p-2 shadow"
            >
              <Trash2 className="h-4 w-4 text-gray-600" />
            </button>
            <button
              onClick={() => {
                const file = imageFiles.find((f) => f.data === lightboxImg);
                if (file) downloadFile(file);
              }}
              className="absolute bottom-3 right-3 bg-pink-500 hover:bg-pink-600 text-white rounded-xl px-4 py-2 text-sm flex items-center gap-2 shadow"
            >
              <Download className="h-4 w-4" />
              Download
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      <RecordFormModal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        onSubmit={handleEdit}
        initialData={record}
      />
      <DeleteConfirmModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        itemName={record.name}
        itemType="Record"
      />
    </Container>
  );
}
