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
import { ImagePlus, X } from "lucide-react";
import Image from "next/image";

export interface CategoryFormData {
    name: string;
    imageData?: string; // base64 data URL
    imageName?: string;
}

interface CategoryFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: CategoryFormData) => void;
    initialData?: CategoryFormData | null;
}

export default function CategoryFormModal({
    isOpen,
    onClose,
    onSubmit,
    initialData,
}: CategoryFormModalProps) {
    const [name, setName] = useState("");
    const [imageData, setImageData] = useState<string | undefined>(undefined);
    const [imageName, setImageName] = useState<string | undefined>(undefined);
    const [error, setError] = useState("");
    const fileRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (initialData) {
            setName(initialData.name);
            setImageData(initialData.imageData);
            setImageName(initialData.imageName);
        } else {
            setName("");
            setImageData(undefined);
            setImageName(undefined);
        }
        setError("");
    }, [initialData, isOpen]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            setImageData(reader.result as string);
            setImageName(file.name);
        };
        reader.readAsDataURL(file);
    };

    const clearImage = () => {
        setImageData(undefined);
        setImageName(undefined);
        if (fileRef.current) fileRef.current.value = "";
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            setError("Category name is required.");
            return;
        }
        onSubmit({ name: name.trim(), imageData, imageName });
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[440px] rounded-2xl">
                <DialogHeader>
                    <DialogTitle className="text-pink-600 text-base font-semibold">
                        {initialData ? "Edit Category" : "Add New Category"}
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-2">
                    {/* Name */}
                    <div className="space-y-1.5">
                        <Label htmlFor="cat-name" className="text-sm font-medium text-gray-700">
                            Category Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="cat-name"
                            placeholder="e.g. Blood Tests"
                            value={name}
                            onChange={(e) => { setName(e.target.value); setError(""); }}
                            className="rounded-xl"
                        />
                        {error && <p className="text-xs text-red-500">{error}</p>}
                    </div>

                    {/* Image Upload */}
                    <div className="space-y-1.5">
                        <Label className="text-sm font-medium text-gray-700">
                            Category Image{" "}
                            <span className="text-gray-400 font-normal">(optional)</span>
                        </Label>

                        {imageData ? (
                            <div className="relative w-full h-36 rounded-xl overflow-hidden border border-pink-200">
                                <Image
                                    src={imageData}
                                    alt="Category preview"
                                    fill
                                    className="object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={clearImage}
                                    className="absolute top-2 right-2 bg-white/90 hover:bg-white rounded-full p-1 shadow transition"
                                >
                                    <X className="h-4 w-4 text-gray-600" />
                                </button>
                                {imageName && (
                                    <span className="absolute bottom-2 left-2 text-xs bg-black/50 text-white px-2 py-0.5 rounded-full">
                                        {imageName}
                                    </span>
                                )}
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={() => fileRef.current?.click()}
                                className="w-full h-28 border-2 border-dashed border-pink-200 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-pink-400 hover:bg-pink-50 transition text-gray-500"
                            >
                                <ImagePlus className="h-7 w-7 text-pink-400" />
                                <span className="text-sm">Click to upload an image</span>
                                <span className="text-xs text-gray-400">PNG, JPG, WEBP, GIF</span>
                            </button>
                        )}

                        <input
                            ref={fileRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                    </div>

                    <DialogFooter className="gap-2 pt-2">
                        <Button type="button" variant="outline" onClick={onClose} className="flex-1 rounded-xl">
                            Cancel
                        </Button>
                        <Button type="submit" className="flex-1 rounded-xl bg-pink-500 hover:bg-pink-600 text-white">
                            {initialData ? "Save Changes" : "Add Category"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
