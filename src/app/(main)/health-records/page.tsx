"use client";

import { useState } from "react";
import Container from "@/components/shared/container";
import { FolderHeart } from "lucide-react";
import TopBarFeatures from "@/components/common/TopBarFeatures";
import CategoryCard, { Category } from "@/components/health-records/CategoryCard";

// ─── Fixed Categories ────────────────────────────────────────────────────────
const FIXED_CATEGORIES: Category[] = [
    { id: "medical-checkups", name: "Medical Checkups", icon: "🩺", color: "bg-blue-100", recordCount: 3 },
    { id: "lab-test-results", name: "Lab Test Results", icon: "🔬", color: "bg-red-100", recordCount: 5 },
    { id: "ultrasound-scans", name: "Ultrasound & Scans", icon: "🩻", color: "bg-sky-100", recordCount: 2 },
    { id: "medications-supplements", name: "Medications & Supplements", icon: "💊", color: "bg-purple-100", recordCount: 4 },
    { id: "vaccinations", name: "Vaccinations", icon: "💉", color: "bg-green-100", recordCount: 6 },
    { id: "personal-health-notes", name: "Personal Health Notes", icon: "📝", color: "bg-amber-100", recordCount: 3 },
    { id: "others", name: "Others", icon: "📋", color: "bg-gray-100", recordCount: 1 },
];

export default function HealthRecordsCategoriesPage() {
    const [categories] = useState<Category[]>(FIXED_CATEGORIES);

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
                            <h1 className="text-xl md:text-2xl font-bold text-gray-900">Health Records</h1>
                            <p className="text-sm text-gray-500">View and manage your health records by category</p>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                    <div className="bg-white/90 backdrop-blur rounded-2xl p-4 shadow-sm">
                        <p className="text-xs text-gray-500 mb-0.5">Total Categories</p>
                        <p className="text-2xl font-bold text-pink-600">{categories.length}</p>
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {categories.map((cat) => (
                        <CategoryCard key={cat.id} category={cat} />
                    ))}
                </div>
            </div>
        </Container>
    );
}
