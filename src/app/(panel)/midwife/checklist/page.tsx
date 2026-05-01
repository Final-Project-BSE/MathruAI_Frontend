"use client";

import { useEffect, useState } from "react";
import {
  ChecklistItemDto,
  getMasterChecklist,
  addChecklistItem,
  deleteChecklistItem,
} from "@/app/api/checklist/api";
import ChecklistItem from "./ChecklistItem";
import { ClipboardList, Plus, Loader2 } from "lucide-react";
import { getSession } from "@/lib/authentication";
import { getcuruser } from "@/app/api/user/api";

export default function MidwifeChecklistPage() {
  const [midwifeId, setMidwifeId] = useState<number | null>(null);
  const [items, setItems] = useState<ChecklistItemDto[]>([]);
  const [popup, setPopup] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    quantity: 1,
    category: "Mother",
  });

  const showPopup = (message: string) => {
    setPopup(message);
    setTimeout(() => setPopup(null), 2200);
  };

  const load = async (id: number) => {
    const data = await getMasterChecklist(id);
    setItems(data);
  };

  useEffect(() => {
    let active = true;

    async function init() {
      try {
        setLoading(true);

        const session = await getSession();
        const token = session?.user?.token;

        if (!token) {
          throw new Error("User is not authenticated");
        }

        const me = await getcuruser(token);

        if (!active) return;

        setMidwifeId(me.id);
        await load(me.id);
      } catch (error) {
        console.error("Failed to load midwife checklist:", error);
        showPopup("Failed to load checklist");
      } finally {
        if (active) setLoading(false);
      }
    }

    void init();

    return () => {
      active = false;
    };
  }, []);

  const handleAdd = async () => {
    if (!midwifeId) {
      showPopup("Midwife account not loaded");
      return;
    }

    if (!form.name.trim()) {
      showPopup("Item name cannot be empty");
      return;
    }

    if (form.quantity < 1) {
      showPopup("Quantity must be at least 1");
      return;
    }

    try {
      await addChecklistItem(midwifeId, {
        name: form.name.trim(),
        quantity: form.quantity,
        category: form.category,
      });

      setForm({ name: "", quantity: 1, category: "Mother" });
      showPopup("Checklist item added");
      await load(midwifeId);
    } catch (error) {
      console.error("Failed to add checklist item:", error);
      showPopup("Failed to add checklist item");
    }
  };

  const handleDelete = async (id: number) => {
    if (!midwifeId) {
      showPopup("Midwife account not loaded");
      return;
    }

    try {
      await deleteChecklistItem(midwifeId, id);
      showPopup("Checklist item deleted");
      await load(midwifeId);
    } catch (error) {
      console.error("Failed to delete checklist item:", error);
      showPopup("Failed to delete checklist item");
    }
  };

  const motherItems = items.filter(
    (i) => i.category?.trim().toLowerCase() === "mother"
  );

  const babyItems = items.filter(
    (i) => i.category?.trim().toLowerCase() === "baby"
  );

  return (
    <main className="min-h-screen bg-black p-6 text-white">
      <div className="mx-auto max-w-7xl space-y-6">
        {popup && (
          <div className="fixed right-5 top-5 z-50 rounded-xl border border-white/10 bg-zinc-950 px-5 py-3 text-sm text-white shadow-2xl">
            {popup}
          </div>
        )}

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="mt-2 flex items-center gap-3 text-md font-bold">
              <ClipboardList className="h-6 w-6" />
              Hospital Bag Checklist
            </h1>

            <p className="mt-1 text-xs text-zinc-400">
              Create and manage your own checklist for your assigned users only.
            </p>
          </div>
        </div>

        <section className="rounded-2xl border border-white/10 bg-zinc-950 p-5 shadow-xl">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold">
            <Plus className="h-4 w-4" />
            Add new checklist item
          </h2>

          <div className="grid gap-3 md:grid-cols-[1fr_120px_160px_120px]">
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Item name"
              className="w-full rounded-xl border border-white/10 bg-black px-3 py-2 text-sm text-white outline-none placeholder:text-zinc-600"
            />

            <input
              type="number"
              min={1}
              value={form.quantity}
              onChange={(e) =>
                setForm({ ...form, quantity: Number(e.target.value) })
              }
              className="w-full rounded-xl border border-white/10 bg-black px-3 py-2 text-sm text-white outline-none"
            />

            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-black px-3 py-2 text-sm text-white outline-none"
            >
              <option value="Mother">Mother</option>
              <option value="Baby">Baby</option>
            </select>

            <button
              type="button"
              onClick={handleAdd}
              disabled={loading || !midwifeId}
              className="flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Plus className="h-4 w-4" />
              Add
            </button>
          </div>
        </section>

        {loading ? (
          <div className="flex justify-center py-20 text-zinc-400">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Loading checklist...
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            <section className="rounded-2xl border border-white/10 bg-zinc-950 p-5 shadow-xl">
              <h2 className="mb-4 text-sm font-semibold">Mother Items</h2>

              <div className="space-y-3">
                {motherItems.length === 0 ? (
                  <p className="text-sm text-zinc-500">
                    No mother items added.
                  </p>
                ) : (
                  motherItems.map((item) => (
                    <ChecklistItem
                      key={item.id}
                      item={item}
                      onDelete={handleDelete}
                    />
                  ))
                )}
              </div>
            </section>

            <section className="rounded-2xl border border-white/10 bg-zinc-950 p-5 shadow-xl">
              <h2 className="mb-4 text-sm font-semibold">Baby Items</h2>

              <div className="space-y-3">
                {babyItems.length === 0 ? (
                  <p className="text-sm text-zinc-500">No baby items added.</p>
                ) : (
                  babyItems.map((item) => (
                    <ChecklistItem
                      key={item.id}
                      item={item}
                      onDelete={handleDelete}
                    />
                  ))
                )}
              </div>
            </section>
          </div>
        )}
      </div>
    </main>
  );
}