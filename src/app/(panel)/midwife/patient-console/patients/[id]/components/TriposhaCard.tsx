"use client";

import { useState } from "react";
import type { TriposhaRecord } from "@/app/api/triposha/types";
import { formatDate } from "./lib/utils";
import { Trash2, Pencil, X } from "lucide-react";
import TriposhaForm from "./TriposhaForm";

type TriposhaFormData = {
  quantity: number;
  status: "GIVEN" | "PENDING" | "MISSED";
  notes?: string;
};

type Props = {
  records: TriposhaRecord[];
  readOnly?: boolean;
  onDelete?: (id: number) => void;
  onAdd?: (data: TriposhaFormData) => void;
  onUpdate?: (id: number, data: TriposhaFormData) => void;
};

export default function TriposhaCard({
  records,
  readOnly = false,
  onDelete,
  onAdd,
  onUpdate,
}: Props) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<TriposhaRecord | null>(null);

  const isEdit = Boolean(selected);
  const canAdd = !readOnly && Boolean(onAdd);
  const canEdit = !readOnly && Boolean(onUpdate);
  const canDelete = !readOnly && Boolean(onDelete);

  function handleClose() {
    setOpen(false);
    setSelected(null);
  }

  return (
    <>
      <section className="rounded-2xl border border-white/10 bg-zinc-950 p-5 text-white">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Triposha Tracking</h2>

          {canAdd && (
            <button
              onClick={() => {
                setSelected(null);
                setOpen(true);
              }}
              className="rounded-lg border border-white/10 px-3 py-1 text-sm hover:bg-white/10"
            >
              + Add
            </button>
          )}
        </div>

        {records.length === 0 ? (
          <div className="text-sm text-zinc-500">
            No Triposha records available.
          </div>
        ) : (
          <div className="space-y-3 text-sm">
            {records.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3 rounded-xl bg-zinc-900 p-3"
              >
                <div>
                  <div className="font-medium">
                    {formatDate(item.distributionDate)} — {item.quantity} packs
                  </div>

                  <div className="text-xs text-zinc-500">
                    Next: {formatDate(item.nextDueDate)} | {item.status}
                  </div>

                  {item.notes && (
                    <div className="mt-1 text-xs text-zinc-400">
                      {item.notes}
                    </div>
                  )}
                </div>

                {(canEdit || canDelete) && (
                  <div className="flex gap-2">
                    {canEdit && (
                      <button
                        onClick={() => {
                          setSelected(item);
                          setOpen(true);
                        }}
                        className="text-blue-400 hover:text-blue-300"
                        type="button"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                    )}

                    {canDelete && (
                      <button
                        onClick={() => onDelete?.(item.id)}
                        className="text-red-400 hover:text-red-300"
                        type="button"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {open && !readOnly && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4">
          <div className="w-full max-w-xl space-y-4 rounded-2xl border border-white/10 bg-zinc-950 p-5 text-white">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                {isEdit ? "Edit Triposha" : "Add Triposha"}
              </h3>

              <button onClick={handleClose} type="button">
                <X className="h-4 w-4" />
              </button>
            </div>

            <TriposhaForm
              initialData={selected || undefined}
              onSubmit={(data) => {
                if (isEdit && selected) {
                  onUpdate?.(selected.id, data);
                } else {
                  onAdd?.(data);
                }

                handleClose();
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}