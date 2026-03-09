"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export interface Category {
    id: string;
    name: string;
    imageData?: string;  // base64 data URL
    imageName?: string;
    recordCount: number;
    icon: string;        // emoji fallback
    color: string;       // Tailwind bg class
}

interface CategoryCardProps {
    category: Category;
    onEdit: (category: Category) => void;
    onDelete: (category: Category) => void;
}

export default function CategoryCard({ category, onEdit, onDelete }: CategoryCardProps) {
    return (
        <Card className="bg-white/90 backdrop-blur rounded-2xl shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 group overflow-hidden">
            <CardContent className="p-0">
                {/* Clickable card body */}
                <Link href={`/health-records/${category.id}`} className="block p-5">
                    <div className="flex items-start gap-4">
                        {/* Icon / Image */}
                        <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl overflow-hidden ${!category.imageData ? category.color : ""} text-2xl`}>
                            {category.imageData ? (
                                <Image
                                    src={category.imageData}
                                    alt={category.name}
                                    width={56}
                                    height={56}
                                    className="w-14 h-14 object-cover"
                                />
                            ) : (
                                <span>{category.icon}</span>
                            )}
                        </div>

                        <div className="flex-1 min-w-0 pt-0.5">
                            <h3 className="font-semibold text-gray-900 text-sm md:text-base truncate group-hover:text-pink-600 transition-colors">
                                {category.name}
                            </h3>
                            <Badge className="mt-1.5 bg-pink-100 text-pink-700 hover:bg-pink-100 rounded-full text-xs font-medium">
                                {category.recordCount} record{category.recordCount !== 1 ? "s" : ""}
                            </Badge>
                        </div>
                    </div>
                </Link>

                {/* Action buttons */}
                <div className="px-5 pb-4 flex gap-2 border-t border-gray-100 pt-3">
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onEdit(category)}
                        className="flex-1 rounded-xl text-xs gap-1.5 hover:bg-pink-50 hover:text-pink-600 text-gray-600"
                    >
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                    </Button>
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onDelete(category)}
                        className="flex-1 rounded-xl text-xs gap-1.5 hover:bg-red-50 hover:text-red-600 text-gray-600"
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
