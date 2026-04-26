

// "use client";

// import { useState, useEffect } from "react";
// import type { TriposhaRecord } from "@/app/api/triposha/types";

// type Props = {
//   initialData?: TriposhaRecord;
//   onSubmit: (data: {
//     quantity: number;
//     status: "GIVEN" | "PENDING" | "MISSED";
//     notes?: string;
//   }) => void;
// };

// export default function TriposhaForm({ initialData, onSubmit }: Props) {
//   const [quantity, setQuantity] = useState(1);
//   const [status, setStatus] = useState<"GIVEN" | "PENDING" | "MISSED">("GIVEN");
//   const [notes, setNotes] = useState("");

//   useEffect(() => {
//     if (initialData) {
//       setQuantity(initialData.quantity);
//       setStatus(initialData.status as any);
//       setNotes(initialData.notes || "");
//     }
//   }, [initialData]);

//   return (
//     <div className="space-y-3 rounded-xl border border-white/10 p-4">
//       <input
//         type="number"
//         value={quantity}
//         onChange={(e) => setQuantity(Number(e.target.value))}
//         className="w-full rounded bg-zinc-900 p-2 text-sm"
//       />

//       <select
//         value={status}
//         onChange={(e) => setStatus(e.target.value as any)}
//         className="w-full rounded bg-zinc-900 p-2 text-sm"
//       >
//         <option value="GIVEN">Given</option>
//         <option value="PENDING">Pending</option>
//         <option value="MISSED">Missed</option>
//       </select>

//       <input
//         value={notes}
//         onChange={(e) => setNotes(e.target.value)}
//         className="w-full rounded bg-zinc-900 p-2 text-sm"
//         placeholder="Notes"
//       />

//       <button
//         onClick={() =>
//           onSubmit({ quantity, status, notes })
//         }
//         className="w-full rounded bg-white px-4 py-2 text-sm text-black"
//       >
//         {initialData ? "Update" : "Add"}
//       </button>
      
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import type { TriposhaRecord } from "@/app/api/triposha/types";

type Props = {
  initialData?: TriposhaRecord;
  onSubmit: (data: {
    quantity: number;
    status: "GIVEN" | "PENDING" | "MISSED";
    notes?: string;
  }) => void;
};

export default function TriposhaForm({ initialData, onSubmit }: Props) {
  const [quantity, setQuantity] = useState(1);
  const [status, setStatus] = useState<"GIVEN" | "PENDING" | "MISSED">("GIVEN");
  const [notes, setNotes] = useState("");

  // ✅ LOAD DATA WHEN EDIT MODE OPENS
  useEffect(() => {
    if (initialData) {
      setQuantity(initialData.quantity);
      setStatus(initialData.status as any);
      setNotes(initialData.notes || "");
    } else {
      // reset when switching from edit → add
      setQuantity(1);
      setStatus("GIVEN");
      setNotes("");
    }
  }, [initialData]);

  function handleSubmit() {
    onSubmit({
      quantity,
      status,
      notes: notes.trim() === "" ? undefined : notes,
    });
  }

  return (
    <div className="space-y-3 rounded-xl border border-white/10 p-4">
      {/* Quantity */}
      <input
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
        className="w-full rounded bg-zinc-900 p-2 text-sm"
        placeholder="Quantity"
      />

      {/* Status */}
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value as any)}
        className="w-full rounded bg-zinc-900 p-2 text-sm"
      >
        <option value="GIVEN">Given</option>
        <option value="PENDING">Pending</option>
        <option value="MISSED">Missed</option>
      </select>

      {/* Notes */}
      <input
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="w-full rounded bg-zinc-900 p-2 text-sm"
        placeholder="Notes"
      />

      {/* Submit */}
      <button
        onClick={handleSubmit}
        className="w-full rounded bg-white px-4 py-2 text-sm text-black"
      >
        {initialData ? "Update" : "Add"}
      </button>
    </div>
  );
}