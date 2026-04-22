"use client";

import { ChecklistItem } from "./types";

interface Props {
  items: ChecklistItem[];
  onDelete?: (id: number) => void;
}

export default function ChecklistList({ items, onDelete }: Props) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.id} className="border p-3 rounded text-white">
          <h2 className="font-bold">{item.title}</h2>
          <p className="text-sm text-gray-300">{item.description}</p>

          {onDelete && (
            <button
              onClick={() => onDelete(item.id)}
              className="text-red-400 mt-2"
            >
              Delete
            </button>
          )}
        </div>
      ))}
    </div>
  );
}