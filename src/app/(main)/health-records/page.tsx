"use client";

import { useState } from "react";
import Container from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { Plus, FolderHeart } from "lucide-react";
import TopBarFeatures from "@/components/common/TopBarFeatures";
import CategoryCard, {
  Category,
} from "@/components/health-records/CategoryCard";
import CategoryFormModal, {
  CategoryFormData,
} from "@/components/health-records/CategoryFormModal";
import DeleteConfirmModal from "@/components/health-records/DeleteConfirmModal";

// ─── Dummy Data (no image — users can upload their own) ───────────────────────
const DUMMY_CATEGORIES: Category[] = [
  {
    id: "blood-tests",
    name: "Blood Tests",
    icon: "🩸",
    color: "bg-red-100",
    recordCount: 4,
  },
  {
    id: "vaccinations",
    name: "Vaccinations",
    icon: "💉",
    color: "bg-blue-100",
    recordCount: 6,
  },
  {
    id: "prescriptions",
    name: "Prescriptions",
    icon: "💊",
    color: "bg-purple-100",
    recordCount: 3,
  },
  {
    id: "imaging",
    name: "Imaging & Scans",
    icon: "🩻",
    color: "bg-sky-100",
    recordCount: 2,
  },
  {
    id: "dental",
    name: "Dental",
    icon: "🦷",
    color: "bg-teal-100",
    recordCount: 2,
  },
  {
    id: "vision",
    name: "Vision / Eye Care",
    icon: "👁️",
    color: "bg-amber-100",
    recordCount: 1,
  },
  {
    id: "maternity",
    name: "Maternity",
    icon: "🤰",
    color: "bg-pink-100",
    recordCount: 5,
  },
  {
    id: "allergies",
    name: "Allergies",
    icon: "🌿",
    color: "bg-green-100",
    recordCount: 2,
  },
];

const COLORS = [
  "bg-red-100",
  "bg-blue-100",
  "bg-purple-100",
  "bg-sky-100",
  "bg-teal-100",
  "bg-amber-100",
  "bg-pink-100",
  "bg-green-100",
  "bg-orange-100",
  "bg-indigo-100",
];
const ICONS = ["📋", "🗂️", "📂", "📁", "🗃️"];
let _uid = 100;
const uid = () => String(++_uid);

export default function HealthRecordsCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(DUMMY_CATEGORIES);
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Category | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);

  const handleAdd = () => {
    setEditTarget(null);
    setFormOpen(true);
  };
  const handleEdit = (cat: Category) => {
    setEditTarget(cat);
    setFormOpen(true);
  };

  const handleFormSubmit = (data: CategoryFormData) => {
    if (editTarget) {
      setCategories((prev) =>
        prev.map((c) =>
          c.id === editTarget.id
            ? {
                ...c,
                name: data.name,
                imageData: data.imageData,
                imageName: data.imageName,
              }
            : c,
        ),
      );
    } else {
      const newCat: Category = {
        id: uid(),
        name: data.name,
        imageData: data.imageData,
        imageName: data.imageName,
        icon: ICONS[Math.floor(Math.random() * ICONS.length)],
        color: COLORS[categories.length % COLORS.length],
        recordCount: 0,
      };
      setCategories((prev) => [...prev, newCat]);
    }
  };

  const handleDelete = (cat: Category) => setDeleteTarget(cat);
  const confirmDelete = () => {
    if (!deleteTarget) return;
    setCategories((prev) => prev.filter((c) => c.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  return (
    <Container title="Health Records">
      <div className="bg-[#fed2cc] min-h-screen p-4 md:p-6">
        <TopBarFeatures />

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-pink-500 text-white">
              <FolderHeart className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                Health Records
              </h1>
              <p className="text-sm text-gray-500">
                Manage all your medical categories
              </p>
            </div>
          </div>
          <Button
            onClick={handleAdd}
            className="rounded-xl bg-pink-500 hover:bg-pink-600 text-white gap-2 shadow-sm"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Category</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          <div className="bg-white/90 backdrop-blur rounded-2xl p-4 shadow-sm">
            <p className="text-xs text-gray-500 mb-0.5">Total Categories</p>
            <p className="text-2xl font-bold text-pink-600">
              {categories.length}
            </p>
          </div>
          <div className="bg-white/90 backdrop-blur rounded-2xl p-4 shadow-sm">
            <p className="text-xs text-gray-500 mb-0.5">Total Records</p>
            <p className="text-2xl font-bold text-pink-600">
              {categories.reduce((s, c) => s + c.recordCount, 0)}
            </p>
          </div>
          <div className="bg-white/90 backdrop-blur rounded-2xl p-4 shadow-sm col-span-2 sm:col-span-1">
            <p className="text-xs text-gray-500 mb-0.5">Last Updated</p>
            <p className="text-base font-semibold text-gray-700">Today</p>
          </div>
        </div>

        {/* Grid */}
        {categories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <FolderHeart className="h-14 w-14 text-pink-300 mb-4" />
            <p className="text-gray-600 font-medium">No categories yet</p>
            <p className="text-sm text-gray-400 mt-1">
              Click &quot;Add Category&quot; to get started.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <CategoryCard
                key={cat.id}
                category={cat}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      <CategoryFormModal
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
        itemType="Category"
      />
    </Container>
  );
}
