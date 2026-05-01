"use client";

import { useState } from "react";
import type { TriposhaRecord } from "@/app/api/triposha/types";
import { formatDate } from "../../(panel)/midwife/patient-console/patients/[id]/components/lib/utils";
import { Trash2, Pencil, X } from "lucide-react";
import TriposhaForm from "../../(panel)/midwife/patient-console/patients/[id]/components/TriposhaForm";

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
      <section className="rounded-2xl border border-pink-100 bg-[#fed2cc] p-5 text-gray-800 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-md font-semibold text-gray-900">
            Triposha Tracking
          </h2>

          {canAdd && (
            <button
              type="button"
              onClick={() => {
                setSelected(null);
                setOpen(true);
              }}
              className="rounded-lg bg-[#d04f51] px-3 py-1.5 text-sm font-medium text-white transition hover:bg-[#b94345]"
            >
              + Add
            </button>
          )}
        </div>

        {records.length === 0 ? (
          <div className="rounded-xl border border-dashed border-pink-200 bg-pink-50 p-4 text-sm text-gray-500">
            No Triposha records available.
          </div>
        ) : (
          <div className="space-y-3 text-sm">
            {records.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-pink-100 bg-[#fed2cc] p-4 shadow-sm"
              >
                <div>
                  <div className="font-semibold text-gray-900">
                    {formatDate(item.distributionDate)} — {item.quantity} packs
                  </div>

                  <div className="mt-1 text-xs text-gray-500">
                    Next: {formatDate(item.nextDueDate)} | {item.status}
                  </div>

                  {item.notes && (
                    <div className="mt-2 rounded-lg bg-[#fed2cc] border border-pink-100 px-3 py-2 text-xs text-gray-600">
                      {item.notes}
                    </div>
                  )}
                </div>

                {(canEdit || canDelete) && (
                  <div className="flex gap-2">
                    {canEdit && (
                      <button
                        type="button"
                        onClick={() => {
                          setSelected(item);
                          setOpen(true);
                        }}
                        className="rounded-lg p-2 text-blue-600 transition hover:bg-blue-50"
                        aria-label="Edit Triposha record"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                    )}

                    {canDelete && (
                      <button
                        type="button"
                        onClick={() => onDelete?.(item.id)}
                        className="rounded-lg p-2 text-red-600 transition hover:bg-red-50"
                        aria-label="Delete Triposha record"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-xl space-y-4 rounded-2xl border border-pink-100 bg-white p-5 text-gray-800 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                {isEdit ? "Edit Triposha" : "Add Triposha"}
              </h3>

              <button
                onClick={handleClose}
                type="button"
                className="rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
                aria-label="Close Triposha form"
              >
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