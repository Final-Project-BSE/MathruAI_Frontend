"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Container from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { Plus, ChevronLeft, ClipboardList } from "lucide-react";
import TopBarFeatures from "@/components/common/TopBarFeatures";
import RecordCard, {
  HealthRecord,
} from "@/components/health-records/RecordCard";
import RecordFormModal, {
  RecordFormData,
} from "@/components/health-records/RecordFormModal";
import DeleteConfirmModal from "@/components/health-records/DeleteConfirmModal";

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

// Dummy records — no embedded files (user can upload real ones via Add/Edit)
const DUMMY_RECORDS: Record<string, HealthRecord[]> = {
  "blood-tests": [
    {
      id: "bt-1",
      categoryId: "blood-tests",
      name: "Annual Blood Panel",
      date: "2025-12-10",
      description:
        "Complete blood count, metabolic panel, lipid profile. All values within normal range.",
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
      description: "TSH: 2.1 mIU/L (normal), Free T4: 1.1 ng/dL.",
    },
    {
      id: "bt-4",
      categoryId: "blood-tests",
      name: "Glucose Tolerance Test",
      date: "2025-03-05",
      description:
        "Result 128 mg/dL — below the 140 mg/dL threshold. Negative for GDM.",
    },
  ],
  vaccinations: [
    {
      id: "vx-1",
      categoryId: "vaccinations",
      name: "Flu Vaccine 2025",
      date: "2025-10-01",
      description: "Annual influenza vaccine. Lot #FL25-0192.",
    },
    {
      id: "vx-2",
      categoryId: "vaccinations",
      name: "Tdap Booster",
      date: "2025-04-18",
      description: "Tetanus, diphtheria, pertussis booster.",
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
        "Daily folic acid 400mcg, iron 27mg, DHA 200mg, vitamin D3 1000IU.",
    },
    {
      id: "rx-2",
      categoryId: "prescriptions",
      name: "Metformin 500mg",
      date: "2025-08-12",
      description: "Twice daily with meals for blood sugar management.",
    },
    {
      id: "rx-3",
      categoryId: "prescriptions",
      name: "Levothyroxine 50mcg",
      date: "2025-05-20",
      description: "Thyroid hormone replacement therapy.",
    },
  ],
  imaging: [
    {
      id: "im-1",
      categoryId: "imaging",
      name: "12-Week Ultrasound",
      date: "2025-12-01",
      description:
        "First trimester dating scan. CRL: 58mm. NT: 1.4mm (normal).",
    },
    {
      id: "im-2",
      categoryId: "imaging",
      name: "Anatomy Scan (20 wks)",
      date: "2025-10-08",
      description:
        "Detailed fetal anatomy scan. All structural markers normal.",
    },
  ],
  dental: [
    {
      id: "dt-1",
      categoryId: "dental",
      name: "Dental Cleaning – Jan 2025",
      date: "2025-01-15",
      description: "Routine prophylaxis and fluoride treatment. No cavities.",
    },
    {
      id: "dt-2",
      categoryId: "dental",
      name: "Dental X-Rays",
      date: "2024-07-22",
      description: "4 periapical X-rays taken. No interproximal cavities.",
    },
  ],
  vision: [
    {
      id: "vs-1",
      categoryId: "vision",
      name: "Annual Eye Exam 2025",
      date: "2025-03-10",
      description: "Prescription updated: R -1.75 sph, L -2.00 sph.",
    },
  ],
  maternity: [
    {
      id: "mt-1",
      categoryId: "maternity",
      name: "First OB Visit",
      date: "2025-11-15",
      description: "Confirmed intrauterine pregnancy, EDD: 2026-07-22.",
    },
    {
      id: "mt-2",
      categoryId: "maternity",
      name: "NIPT Screening",
      date: "2025-11-28",
      description: "Low risk for trisomies 21, 18, 13.",
    },
    {
      id: "mt-3",
      categoryId: "maternity",
      name: "GBS Swab Result",
      date: "2025-09-05",
      description: "Group B Strep negative.",
    },
    {
      id: "mt-4",
      categoryId: "maternity",
      name: "Growth Scan (32 wks)",
      date: "2025-08-20",
      description: "Fetal growth 48th percentile. EFW: 1850g.",
    },
    {
      id: "mt-5",
      categoryId: "maternity",
      name: "Hospital Admission Record",
      date: "2025-07-14",
      description: "28-week monitoring. CTG normal. Discharged after 24h.",
    },
  ],
  allergies: [
    {
      id: "al-1",
      categoryId: "allergies",
      name: "Allergy Panel – Dust",
      date: "2025-02-18",
      description: "Dust mite sensitisation confirmed.",
    },
    {
      id: "al-2",
      categoryId: "allergies",
      name: "Penicillin Allergy Note",
      date: "2024-09-30",
      description: "Penicillin allergy documented. Alternative: Azithromycin.",
    },
  ],
};

let _uid = 200;
const uid = () => String(++_uid);

export default function RecordsPage() {
  const params = useParams();
  const router = useRouter();
  const categoryId = params?.categoryId as string;
  const meta = CATEGORY_META[categoryId] ?? { name: "Records", icon: "📋" };

  const [records, setRecords] = useState<HealthRecord[]>(
    DUMMY_RECORDS[categoryId] ?? [],
  );
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<HealthRecord | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<HealthRecord | null>(null);

  const handleAdd = () => {
    setEditTarget(null);
    setFormOpen(true);
  };
  const handleEdit = (rec: HealthRecord) => {
    setEditTarget(rec);
    setFormOpen(true);
  };

  const handleFormSubmit = (data: RecordFormData) => {
    if (editTarget) {
      setRecords((prev) =>
        prev.map((r) => (r.id === editTarget.id ? { ...r, ...data } : r)),
      );
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
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                {meta.name}
              </h1>
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
                ? [...records].sort((a, b) => b.date.localeCompare(a.date))[0]
                    .name
                : "—"}
            </p>
          </div>
        </div>

        {/* Grid */}
        {records.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <ClipboardList className="h-14 w-14 text-pink-300 mb-4" />
            <p className="text-gray-600 font-medium">No records yet</p>
            <p className="text-sm text-gray-400 mt-1">
              Click &quot;Add Record&#34; to add your first record.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {records.map((rec) => (
              <RecordCard
                key={rec.id}
                record={rec}
                onEdit={handleEdit}
                onDelete={setDeleteTarget}
              />
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
