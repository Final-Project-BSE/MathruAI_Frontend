"use client";

import { Loader2 } from "lucide-react";
import type {
  HealthCategoryResponseDto,
  HealthRecordResponseDto,
} from "@/app/api/midwife-patient/types";
import { formatDate } from "./lib/utils";

type HealthRecordsSectionProps = {
  categories: HealthCategoryResponseDto[];
  selectedCategoryId: string;
  setSelectedCategoryId: (value: string) => void;
  recordsLoading: boolean;
  records: HealthRecordResponseDto[];
};

export default function HealthRecordsSection({
  categories,
  selectedCategoryId,
  setSelectedCategoryId,
  recordsLoading,
  records,
}: HealthRecordsSectionProps) {
  return (
    <section className="rounded-2xl border border-white/10 bg-zinc-950 p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Health Records</h2>

        <select
          value={selectedCategoryId}
          onChange={(e) => setSelectedCategoryId(e.target.value)}
          className="rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 text-sm"
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name} ({category.recordCount})
            </option>
          ))}
        </select>
      </div>

      {recordsLoading ? (
        <div className="flex items-center gap-2 text-sm text-zinc-400">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading records...
        </div>
      ) : records.length === 0 ? (
        <div className="text-sm text-zinc-500">No records in this category.</div>
      ) : (
        <div className="space-y-3">
          {records.map((record) => (
            <div key={record.id} className="rounded-xl border border-white/10 bg-zinc-900 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="font-medium">{record.name}</div>
                  <div className="text-xs text-zinc-400">
                    {record.categoryName} • {formatDate(record.date)}
                  </div>
                </div>
              </div>

              {record.description ? (
                <p className="mt-3 text-sm text-zinc-300">{record.description}</p>
              ) : null}

              {record.files?.length ? (
                <div className="mt-3 space-y-2">
                  <div className="text-xs uppercase tracking-wide text-zinc-500">
                    Attached files
                  </div>
                  {record.files.map((file) => (
                    <a
                      key={file.id}
                      href={`${
                        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
                      }${file.fileUrl}`}
                      target="_blank"
                      rel="noreferrer"
                      className="block rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-zinc-300 hover:bg-black/50"
                    >
                      {file.fileName}
                    </a>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}