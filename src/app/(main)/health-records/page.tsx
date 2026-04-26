"use client";

import { useEffect, useState } from "react";
import Container from "@/components/shared/container";
import { FolderHeart, Loader2 } from "lucide-react";
import TopBarFeatures from "@/components/common/TopBarFeatures";
import CategoryCard, { Category } from "@/components/health-records/CategoryCard";
import { getCategories } from "@/app/api/health-records/api";
import { HealthCategoryResponseDto } from "@/app/api/health-records/types";

export default function HealthRecordsCategoriesPage() {
    const [categories, setCategories] = useState<HealthCategoryResponseDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetch = async () => {
            try {
                setLoading(true);
                const { getSession } = await import("@/lib/authentication");
                const session = await getSession();
                console.log("Health Records Session:", session ? "Found" : "Not Found");
                const token = session?.user?.token;

                if (!token) {
                    setError("Unauthorized. Please login.");
                    return;
                }

                const data = await getCategories(token);
                setCategories(data);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (err: any) {
                console.error("Failed to fetch categories:", err);
                const errorMsg = err.response?.data?.message || err.message || "Failed to load health record categories.";
                setError(`${errorMsg} (Status: ${err.response?.status || 'Unknown'})`);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, []);

    // Map backend categories to Category UI interface if needed, 
    // but better to update CategoryCard to accept HealthCategoryResponseDto
    // or map it here for simplicity of component reuse.
    const mappedCategories: Category[] = categories.map(cat => ({
        id: cat.id,
        name: cat.name,
        recordCount: cat.recordCount,
        icon: cat.icon,
        color: cat.colorClass, // This maps "bg-blue-100" etc
        slug: cat.slug
    }));

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

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24">
                        <Loader2 className="h-10 w-10 text-pink-500 animate-spin mb-4" />
                        <p className="text-gray-600 font-medium">Loading categories...</p>
                    </div>
                ) : error ? (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
                        {error}
                    </div>
                ) : (
                    <>
                        {/* Stats */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                            <div className="bg-white/90 backdrop-blur rounded-2xl p-4 shadow-sm">
                                <p className="text-xs text-gray-500 mb-0.5">Total Categories</p>
                                <p className="text-2xl font-bold text-pink-600">{mappedCategories.length}</p>
                            </div>
                            <div className="bg-white/90 backdrop-blur rounded-2xl p-4 shadow-sm">
                                <p className="text-xs text-gray-500 mb-0.5">Total Records</p>
                                <p className="text-2xl font-bold text-pink-600">
                                    {mappedCategories.reduce((s, c) => s + c.recordCount, 0)}
                                </p>
                            </div>
                            <div className="bg-white/90 backdrop-blur rounded-2xl p-4 shadow-sm col-span-2 sm:col-span-1">
                                <p className="text-xs text-gray-500 mb-0.5">Last Updated</p>
                                <p className="text-base font-semibold text-gray-700">Today</p>
                            </div>
                        </div>

                        {/* Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {mappedCategories.map((cat) => (
                                <CategoryCard key={cat.id} category={cat} />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </Container>
    );
}
