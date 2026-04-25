"use client";

interface Props {
  item: any;
  onDelete?: (id: number) => void;
  onToggle?: (item: any) => void;
}

export default function ChecklistItem({ item, onDelete, onToggle }: Props) {
  return (
    <div className="flex justify-between p-3 border rounded mb-2">
      <div className="flex gap-3 items-center">
        <input
          type="checkbox"
          checked={item.checked}
          onChange={() => onToggle?.(item)}
        />

        <div>
          <p className={item.checked ? "line-through" : ""}>
            {item.name}
          </p>
          <p className="text-sm text-gray-500">
            Qty: {item.quantity} | {item.category}
          </p>
        </div>
      </div>
    </div>
  );
}