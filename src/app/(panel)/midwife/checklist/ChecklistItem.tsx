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
        

        <div>
          <p className={item.checked ? "line-through" : ""}>
            {item.name}
          </p>
          <p className="text-sm text-gray-500">
            Qty: {item.quantity} | {item.category}
          </p>
        </div>
      </div>

      <button
        onClick={() => onDelete?.(item.id)}
        className="text-red-500"
      >
        Delete
      </button>
    </div>
  );
}