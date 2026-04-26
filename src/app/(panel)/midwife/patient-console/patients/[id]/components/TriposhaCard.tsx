


"use client";

import { useState } from "react";
import type { TriposhaRecord } from "@/app/api/triposha/types";
import { formatDate } from "./lib/utils";
import { Trash2, Pencil, X } from "lucide-react";
import TriposhaForm from "./TriposhaForm";

type Props = {
  records: TriposhaRecord[];
  onDelete?: (id: number) => void;
  onAdd?: (data: {
    quantity: number;
    status: "GIVEN" | "PENDING" | "MISSED";
    notes?: string;
  }) => void;
  onUpdate?: (id: number, data: {
    quantity: number;
    status: "GIVEN" | "PENDING" | "MISSED";
    notes?: string;
  }) => void;
};

export default function TriposhaCard({
  records,
  onDelete,
  onAdd,
  onUpdate,
}: Props) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<TriposhaRecord | null>(null);

  const isEdit = !!selected;

  function handleClose() {
    setOpen(false);
    setSelected(null);
  }

  return (
    <>
      {/* MAIN CARD */}
      <section className="rounded-2xl border border-white/10 bg-zinc-950 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Triposha Tracking</h2>

          {/* ADD BUTTON */}
          <button
            onClick={() => {
              setSelected(null);
              setOpen(true);
            }}
            className="rounded-lg border border-white/10 px-3 py-1 text-sm hover:bg-white/10"
          >
            + Add
          </button>
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
                className="flex items-center justify-between rounded-xl bg-zinc-900 p-3"
              >
                <div>
                  <div className="font-medium">
                    {formatDate(item.distributionDate)} — {item.quantity} packs
                  </div>

                  <div className="text-xs text-zinc-500">
                    Next: {formatDate(item.nextDueDate)} | {item.status}
                  </div>

                  {item.notes && (
                    <div className="text-xs text-zinc-400">
                      {item.notes}
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  {/* EDIT */}
                  <button
                    onClick={() => {
                      setSelected(item);
                      setOpen(true);
                    }}
                    className="text-blue-400 hover:text-blue-300"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>

                  {/* DELETE */}
                  {onDelete && (
                    <button
                      onClick={() => onDelete(item.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4">
          <div className="w-full max-w-xl rounded-2xl bg-zinc-950 border border-white/10 p-5 space-y-4">

            {/* HEADER */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                {isEdit ? "Edit Triposha" : "Add Triposha"}
              </h3>

              <button onClick={handleClose}>
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* FORM */}
            <TriposhaForm
              initialData={selected || undefined}
              onSubmit={(data) => {
                if (isEdit && selected && onUpdate) {
                  onUpdate(selected.id, data);
                } else if (onAdd) {
                  onAdd(data);
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