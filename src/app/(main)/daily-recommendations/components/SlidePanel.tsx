// 'use client';

// import React from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { CheckCircle2, Clock, X } from 'lucide-react';
// import type { HistoryItem } from '../../../api/dailyrecommendation/types';

// type PanelMode = 'checklist' | 'history';

// type ChecklistRow = {
//   id: string;
//   text: string;
//   completed: boolean;
// };

// interface SlidePanelProps {
//   open: boolean;
//   mode: PanelMode;
//   onClose: () => void;
//   onToggleMode: () => void;

//   // history
//   history: HistoryItem[];
//   historyLoading?: boolean;

//   // checklist
//   checklistTitle?: string; // e.g. "Saved for 2026-03-05"
//   checklist: ChecklistRow[];
// }

// export default function SlidePanel({
//   open,
//   mode,
//   onClose,
//   onToggleMode,
//   history,
//   historyLoading = false,
//   checklistTitle,
//   checklist,
// }: SlidePanelProps) {
//   return (
//     <div className="relative lg:col-span-1">
//       {/* Overlay on small screens */}
//       {open && (
//         <button
//           aria-label="Close panel overlay"
//           className="fixed inset-0 bg-black/20 z-40 lg:hidden"
//           onClick={onClose}
//         />
//       )}

//       <div
//         className={[
//           'fixed lg:static top-0 right-0 h-full lg:h-auto z-50 lg:z-auto',
//           'w-[90vw] sm:w-[420px] lg:w-auto',
//           'transition-transform duration-300 ease-out',
//           open ? 'translate-x-0' : 'translate-x-full lg:translate-x-0',
//         ].join(' ')}
//       >
//         <Card className="shadow-md bg-white h-full lg:h-auto">
//           <CardHeader className="flex flex-row items-center justify-between gap-2">
//             <CardTitle className="text-lg font-semibold flex items-center gap-2">
//               {mode === 'history' ? (
//                 <>
//                   <Clock className="h-5 w-5 text-purple-500" />
//                   Recent History
//                 </>
//               ) : (
//                 <>
//                   <CheckCircle2 className="h-5 w-5 text-green-600" />
//                   Checklist
//                 </>
//               )}
//             </CardTitle>

//             <div className="flex items-center gap-2">
//               <Button
//                 onClick={onToggleMode}
//                 variant="outline"
//                 size="sm"
//                 className="border-purple-300 hover:bg-purple-50"
//               >
//                 {mode === 'history' ? 'Show Checklist' : 'Show History'}
//               </Button>

//               <Button
//                 onClick={onClose}
//                 variant="outline"
//                 size="icon"
//                 className="lg:hidden"
//                 aria-label="Close panel"
//               >
//                 <X className="h-4 w-4" />
//               </Button>
//             </div>
//           </CardHeader>

//           <CardContent>
//             {/* Sliding inner views */}
//             <div className="relative overflow-hidden">
//               <div
//                 className={[
//                   'flex w-[200%] transition-transform duration-300 ease-out',
//                   mode === 'checklist' ? 'translate-x-0' : '-translate-x-1/2',
//                 ].join(' ')}
//               >
//                 {/* Checklist view */}
//                 <div className="w-1/2 pr-3">
//                   {checklistTitle && (
//                     <p className="text-xs text-gray-500 mb-3">{checklistTitle}</p>
//                   )}

//                   {checklist.length === 0 ? (
//                     <div className="text-center py-10 text-gray-500">
//                       <p>No checklist items yet.</p>
//                       <p className="text-xs mt-2">Refresh recommendation to generate tasks.</p>
//                     </div>
//                   ) : (
//                     <ul className="space-y-2 max-h-[70vh] lg:max-h-96 overflow-y-auto pr-1">
//                       {checklist.map((it) => (
//                         <li
//                           key={it.id}
//                           className={[
//                             'p-3 rounded-lg border flex items-start gap-3',
//                             it.completed
//                               ? 'bg-green-50 border-green-200'
//                               : 'bg-white border-gray-200',
//                           ].join(' ')}
//                         >
//                           <span
//                             className={[
//                               'mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full border',
//                               it.completed
//                                 ? 'border-green-500 text-green-700'
//                                 : 'border-gray-300 text-gray-400',
//                             ].join(' ')}
//                             title={it.completed ? 'Completed' : 'Not completed'}
//                           >
//                             {it.completed ? '✓' : '•'}
//                           </span>

//                           <span
//                             className={[
//                               'text-sm leading-relaxed',
//                               it.completed ? 'line-through opacity-70' : '',
//                             ].join(' ')}
//                           >
//                             {it.text}
//                           </span>
//                         </li>
//                       ))}
//                     </ul>
//                   )}
//                 </div>

//                 {/* History view */}
//                 <div className="w-1/2 pl-3">
//                   {historyLoading ? (
//                     <div className="text-center py-8 text-gray-500">
//                       <div className="animate-spin h-8 w-8 border-4 border-purple-200 border-t-purple-600 rounded-full mx-auto mb-3" />
//                       <p>Loading history...</p>
//                     </div>
//                   ) : history.length === 0 ? (
//                     <div className="text-center py-10 text-gray-500">
//                       <p>No recommendation history yet.</p>
//                     </div>
//                   ) : (
//                     <div className="space-y-3 max-h-[70vh] lg:max-h-96 overflow-y-auto pr-1">
//                       {history.map((item, idx) => (
//                         <div
//                           key={`${item.date}-${idx}`}
//                           className="p-4 bg-gradient-to-r from-gray-50 to-purple-50 rounded-xl border border-gray-200"
//                         >
//                           <div className="flex items-center justify-between mb-2">
//                             <span className="text-xs font-semibold text-purple-600 bg-white px-3 py-1 rounded-full">
//                               {new Date(item.date).toLocaleDateString('en-US', {
//                                 month: 'short',
//                                 day: 'numeric',
//                                 year: 'numeric',
//                               })}
//                             </span>
//                           </div>

//                           <p className="text-sm text-gray-700 leading-relaxed">
//                             {item.recommendation}
//                           </p>

//                           {/* Optional: show completion summary if backend includes checklist in history */}
//                           {item.checklist?.length ? (
//                             <p className="text-xs text-gray-500 mt-2">
//                               {item.checklist.filter((x) => x.completed).length}/
//                               {item.checklist.length} tasks completed
//                             </p>
//                           ) : null}
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }