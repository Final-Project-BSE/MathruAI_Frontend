"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/components/common/useLanguage";
import { translateText } from "@/components/common/translateText";

export interface Category {
  id: string;
  name: string;
  imageData?: string;
  imageName?: string;
  recordCount: number;
  icon: string;
  color: string;
  slug?: string;
}

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  const { language, t } = useLanguage();
  const hr = t.healthRecords;

  const [displayName, setDisplayName] = useState(category.name);

  useEffect(() => {
    let active = true;

    const translateName = async () => {
      const translated = await translateText(category.name, language);
      if (active) setDisplayName(translated);
    };

    translateName();

    return () => {
      active = false;
    };
  }, [category.name, language]);

  return (
    <Card className="bg-white/90 backdrop-blur rounded-2xl shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 group overflow-hidden">
      <CardContent className="p-0">
        <Link href={`/health-records/${category.id}`} className="block p-5">
          <div className="flex items-start gap-4">
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl overflow-hidden ${
                !category.imageData ? "bg-[#d04f51]/10 text-[#d04f51]" : ""
              } text-md`}
            >
              {category.imageData ? (
                <Image
                  src={category.imageData}
                  alt={displayName}
                  width={56}
                  height={56}
                  className="w-9 h-9 object-cover"
                />
              ) : (
                <span>{category.icon}</span>
              )}
            </div>

            <div className="flex-1 min-w-0 pt-0.5">
              <h3 className="font-semibold text-gray-900 text-sm md:text-base truncate group-hover:text-[#d04f51] transition-colors">
                {displayName}
              </h3>

              <Badge className="mt-1.5 bg-[#d04f51]/10 text-[#d04f51] hover:bg-[#d04f51]/10 rounded-full text-xs font-medium">
                {category.recordCount}{" "}
                {category.recordCount === 1 ? hr.record : hr.recordsPlural}
              </Badge>
            </div>
          </div>
        </Link>
      </CardContent>
    </Card>
  );
}