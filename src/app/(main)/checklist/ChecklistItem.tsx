// "use client";

// import { CheckCircle2, Circle } from "lucide-react";
// import { ChecklistItemDto } from "@/app/api/checklist/api";

// interface Props {
//   item: ChecklistItemDto;
//   onToggle: (item: ChecklistItemDto) => void;
// }

// export default function ChecklistItem({ item, onToggle }: Props) {
//   return (
//     <button
//       onClick={() => onToggle(item)}
//       className={`flex w-full items-center gap-4 rounded-xl border p-4 text-left transition ${
//         item.checked
//           ? "border-green-300 bg-green-50"
//           : "border-gray-200 bg-white hover:bg-gray-50"
//       }`}
//     >
//       {item.checked ? (
//         <CheckCircle2 className="h-6 w-6 text-green-600" />
//       ) : (
//         <Circle className="h-6 w-6 text-gray-400" />
//       )}

//       <div>
//         <p
//           className={`font-medium ${
//             item.checked ? "text-gray-400 line-through" : "text-gray-800"
//           }`}
//         >
//           {item.name}
//         </p>

//         <p className="text-sm text-gray-500">
//           Qty: {item.quantity} | {item.category}
//         </p>
//       </div>
//     </button>
//   );
// }