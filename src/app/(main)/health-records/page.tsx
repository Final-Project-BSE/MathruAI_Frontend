"use client";

import { useEffect, useMemo, useState } from "react";
import Container from "@/components/shared/container";
import TopBarFeatures from "@/components/common/TopBarFeatures";
import CategoryCard, {
  Category,
} from "@/components/health-records/CategoryCard";
import { HealthCategoryResponseDto } from "@/app/api/health-records/types";
import { LoadingState } from "@/components/common/LoadingState";
import { useLanguage } from "@/components/common/useLanguage";

type CategoryWithImage = HealthCategoryResponseDto & {
  imageData?: string;
  imageName?: string;
};

export default function HealthRecordsCategoriesPage() {
  const [categories, setCategories] = useState<HealthCategoryResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { t } = useLanguage();
  const hr = t.healthRecords;

  useEffect(() => {
    const controller = new AbortController();

    async function fetchCategories() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/health-records/categories", {
          method: "GET",
          signal: controller.signal,
          cache: "no-store",
        });

        if (!response.ok) {
          const body = await response.json().catch(() => null);
          throw new Error(body?.message || hr.loadCategoriesError);
        }

        const data = await response.json();

        setCategories(Array.isArray(data) ? data : data.data ?? []);
      } catch (err) {
        if (controller.signal.aborted) return;

        console.error("Failed to fetch categories:", err);

        setError(err instanceof Error ? err.message : hr.loadCategoriesError);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchCategories();

    return () => {
      controller.abort();
    };
  }, [hr.loadCategoriesError]);

  const mappedCategories: Category[] = useMemo(() => {
    return categories.map((cat) => {
      const item = cat as CategoryWithImage;

      return {
        id: cat.id,
        name: hr.categories[cat.slug] ?? cat.name,
        recordCount: cat.recordCount,
        icon: cat.icon,
        color: cat.colorClass,
        slug: cat.slug,
        imageData: item.imageData,
        imageName: item.imageName,
      };
    });
  }, [categories, hr.categories]);

  const totalRecords = useMemo(() => {
    return mappedCategories.reduce((sum, cat) => sum + cat.recordCount, 0);
  }, [mappedCategories]);

  if (loading) {
    return <LoadingState />;
  }

  return (
    <Container title={hr.title}>
      <div className="bg-[#fed2cc] min-h-screen p-4 md:p-6">
        <TopBarFeatures />

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">
              {hr.title}
            </h1>
            <p className="text-sm text-gray-500">{hr.subtitle}</p>
          </div>
        </div>

        {error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
              <div className="bg-white/90 backdrop-blur rounded-2xl p-4 shadow-sm">
                <p className="text-xs text-gray-500 mb-0.5">
                  {hr.totalCategories}
                </p>
                <p className="text-2xl font-bold text-[#d04f51]">
                  {mappedCategories.length}
                </p>
              </div>

              <div className="bg-white/90 backdrop-blur rounded-2xl p-4 shadow-sm">
                <p className="text-xs text-gray-500 mb-0.5">
                  {hr.totalRecords}
                </p>
                <p className="text-2xl font-bold text-[#d04f51]">
                  {totalRecords}
                </p>
              </div>

              <div className="bg-white/90 backdrop-blur rounded-2xl p-4 shadow-sm col-span-2 sm:col-span-1">
                <p className="text-xs text-gray-500 mb-0.5">
                  {hr.lastUpdated}
                </p>
                <p className="text-base font-semibold text-gray-700">
                  {hr.today}
                </p>
              </div>
            </div>

            {mappedCategories.length === 0 ? (
              <div className="rounded-2xl bg-white/90 p-6 text-sm text-gray-500 shadow-sm">
                No health record categories found.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {mappedCategories.map((cat) => (
                  <CategoryCard key={cat.id} category={cat} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </Container>
  );
}