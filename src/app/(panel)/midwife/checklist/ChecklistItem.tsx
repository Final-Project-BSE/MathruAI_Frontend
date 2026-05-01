"use client";

import { Trash2 } from "lucide-react";
import { ChecklistItemDto } from "@/app/api/checklist/api";

interface Props {
  item: ChecklistItemDto;
  onDelete: (id: number) => void;
}

export default function ChecklistItem({ item, onDelete }: Props) {
  return (
    <div className="rounded-xl border border-white/10 bg-black p-4 shadow-xl">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-white">{item.name}</h3>

          <p className="mt-1 text-xs text-zinc-500">
            Quantity: {item.quantity} • {item.category}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onDelete(item.id)}
          className="rounded-lg border border-red-500/30 p-2 text-red-300 hover:bg-red-500/10"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}