"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Pencil,
  Trash2,
  FileText,
  Files,
  Eye
} from "lucide-react";
import Link from "next/link";
import { UploadedFile } from "@/components/health-records/RecordFormModal";
import { getFileUrl } from "@/app/api/health-records/api";

export interface HealthRecord {
  id: string;
  categoryId: string;
  name: string;
  date: string;
  description?: string;
  files?: UploadedFile[];
}

interface RecordCardProps {
  record: HealthRecord;
  onEdit: (record: HealthRecord) => void;
  onDelete: (record: HealthRecord) => void;
}

function formatDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch (e) {
    return dateStr;
  }
}

export default function RecordCard({
  record,
  onEdit,
  onDelete,
}: RecordCardProps) {
  const firstImage = record.files?.find((f) => f.type.startsWith("image/"));
  const pdfCount =
    record.files?.filter((f) => f.type === "application/pdf").length ?? 0;
  const totalFiles = record.files?.length ?? 0;

  return (
    <Card className="bg-white/90 backdrop-blur rounded-2xl shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 group overflow-hidden">
      <CardContent className="p-0">
        {/* Preview area */}
        <div className="w-full h-24 bg-gradient-to-br from-pink-50 to-rose-100 flex flex-col items-center justify-center border-b border-pink-100 gap-1.5">
          {totalFiles > 0 ? (
            <>
              <Files className="h-8 w-8 text-[#d04f51]" />
              <span className="text-xs text-[#d04f51]font-medium">
                {totalFiles} file{totalFiles > 1 ? "s" : ""} attached
              </span>
            </>
          ) : (
            <>
              <FileText className="h-8 w-8 text-pink-200" />
              <span className="text-xs text-pink-400 font-medium">No files</span>
            </>
          )}
        </div>

        {/* Info */}
        <Link
          href={`/health-records/${record.categoryId}/${record.id}`}
          className="block p-4"
        >
          <h3 className="font-semibold text-gray-900 text-sm truncate group-hover:text-pink-600 transition-colors">
            {record.name}
          </h3>
          {record.description && (
            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
              {record.description}
            </p>
          )}
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 rounded-full text-xs font-medium">
              {formatDate(record.date)}
            </Badge>
            {totalFiles > 0 && (
              <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 rounded-full text-xs font-medium">
                {totalFiles} file{totalFiles > 1 ? "s" : ""}
              </Badge>
            )}
          </div>
        </Link>

        {/* Action buttons */}
        <div className="px-2 pb-4 flex border-t border-gray-100 pt-3">
          {totalFiles > 0 && (
            <Button
              size="sm"
              variant="ghost"
              onClick={async () => {
                try {
                  const { getSession } = await import("@/lib/authentication");
                  const session = await getSession();
                  const token = session?.user?.token;
                  if (token && record.files?.[0]) {
                    const { downloadSecureFile } = await import("@/app/api/health-records/api");
                    await downloadSecureFile(token, record.files[0].data, record.files[0].name || "record_file");
                  }
                } catch (err) {
                  console.error("Failed to download file:", err);
                }
              }}
              className="flex-1 rounded-xl text-xs gap-1.5 hover:bg-blue-50 hover:text-blue-600 text-gray-600"
            >
              <Eye className="h-3.5 w-3.5" />
              Download
            </Button>
          )}
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onEdit(record)}
            className="flex-1 rounded-xl text-xs gap-1.5 hover:bg-pink-50 hover:text-pink-600 text-gray-600"
          >
            <Pencil className="h-3.5 w-3.5" />
            Edit
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDelete(record)}
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
