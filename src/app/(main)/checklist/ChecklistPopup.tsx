"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle2,
  Circle,
  ClipboardList,
  Loader2,
  X,
} from "lucide-react";
import { getSession } from "@/lib/authentication";
import { getcuruser } from "@/app/api/user/api";
import {
  ChecklistItemDto,
  getUserChecklist,
  toggleUserChecklistItem,
} from "@/app/api/checklist/api";

type ChecklistPopupProps = {
  open: boolean;
  onClose: () => void;
};

export default function ChecklistPopup({ open, onClose }: ChecklistPopupProps) {
  const [userId, setUserId] = useState<number | null>(null);
  const [midwifeId, setMidwifeId] = useState<number | null>(null);
  const [items, setItems] = useState<ChecklistItemDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;

    let active = true;

    async function loadChecklist() {
      try {
        setLoading(true);
        setError("");

        const session = await getSession();
        const token = session?.user?.token;

        if (!token) {
          throw new Error("User is not authenticated");
        }

        const me = await getcuruser(token);

        if (!me.assignedMidwifeId) {
          throw new Error("No assigned midwife found for this user");
        }

        const data = await getUserChecklist(me.id, me.assignedMidwifeId);

        if (!active) return;

        setUserId(me.id);
        setMidwifeId(me.assignedMidwifeId);
        setItems(data);
      } catch (error) {
        console.error("Failed to load checklist:", error);

        if (active) {
          setItems([]);
          setError(
            error instanceof Error ? error.message : "Failed to load checklist"
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadChecklist();

    return () => {
      active = false;
    };
  }, [open]);

  const handleToggle = async (item: ChecklistItemDto) => {
    if (!userId || !midwifeId) return;

    try {
      setUpdatingId(item.id);

      const updatedItem = await toggleUserChecklistItem(
        userId,
        midwifeId,
        item.id
      );

      setItems((prev) =>
        prev.map((i) => (i.id === updatedItem.id ? updatedItem : i))
      );
    } catch (error) {
      console.error("Failed to toggle checklist item:", error);
    } finally {
      setUpdatingId(null);
    }
  };

  if (!open) return null;

  const motherItems = items.filter(
    (item) => item.category?.trim().toLowerCase() === "mother"
  );

  const babyItems = items.filter(
    (item) => item.category?.trim().toLowerCase() === "baby"
  );

  const completed = items.filter((item) => item.checked).length;
  const total = items.length;
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b bg-gradient-to-r from-[#fab0a7] to-[#d04f51] p-5 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/20">
              <ClipboardList className="h-6 w-6" />
            </div>

            <div>
              <h2 className="text-lg font-bold">My Hospital Bag Checklist</h2>
              <p className="text-sm text-white/90">
                Track what you have packed for you and your baby
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-white transition hover:bg-white/20"
            aria-label="Close checklist popup"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[calc(90vh-96px)] overflow-y-auto bg-gray-100 p-4 md:p-6">
          {error ? (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
              {error}
            </div>
          ) : null}

          <div className="mb-5 rounded-2xl bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Packing Progress
                </h3>
                <p className="text-sm text-gray-500">
                  {completed} of {total} items packed
                </p>
              </div>

              <span className="rounded-full bg-[#fed2cc] px-4 py-2 text-sm font-semibold text-[#d04f51]">
                {progress}%
              </span>
            </div>

            <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full rounded-full bg-[#d04f51] transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-16 text-gray-500">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Loading checklist...
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2">
              <ChecklistSection
                title="Mother Items"
                items={motherItems}
                updatingId={updatingId}
                onToggle={handleToggle}
              />

              <ChecklistSection
                title="Baby Items"
                items={babyItems}
                updatingId={updatingId}
                onToggle={handleToggle}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ChecklistSection({
  title,
  items,
  updatingId,
  onToggle,
}: {
  title: string;
  items: ChecklistItemDto[];
  updatingId: number | null;
  onToggle: (item: ChecklistItemDto) => void;
}) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-gray-800">{title}</h3>

      {items.length === 0 ? (
        <p className="rounded-xl border border-dashed p-4 text-sm text-gray-400">
          No checklist items available.
        </p>
      ) : (
        <div className="space-y-3">
          {items.map((item) => {
            const isUpdating = updatingId === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onToggle(item)}
                disabled={isUpdating}
                className={`flex w-full items-center justify-between rounded-xl border p-4 text-left transition disabled:cursor-not-allowed disabled:opacity-70 ${
                  item.checked
                    ? "border-green-200 bg-green-50"
                    : "border-gray-200 bg-white hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  {isUpdating ? (
                    <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                  ) : item.checked ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  ) : (
                    <Circle className="h-5 w-5 text-gray-400" />
                  )}

                  <div>
                    <p
                      className={`font-medium ${
                        item.checked
                          ? "text-gray-400 line-through"
                          : "text-gray-800"
                      }`}
                    >
                      {item.name}
                    </p>

                    <p className="text-sm text-gray-500">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}