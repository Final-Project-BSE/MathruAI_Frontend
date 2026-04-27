// "use client";

// import Link from "next/link";
// import {
//     CalendarDays,
//     NotebookPen,
//     PhoneCall,
//     Siren,
//     BarChart3,
// } from "lucide-react";

// type FeatureItem = {
//     label: string;
//     icon: React.ElementType;
//     href: string;
//     danger?: boolean;
// };

// const featureItems: FeatureItem[] = [
//     { label: "Appointment", icon: CalendarDays, href: "/appointments" },
//     { label: "Emergency Numbers", icon: PhoneCall, href: "/emergency-numbers" },
//     { label: "Notes", icon: NotebookPen, href: "/notes" },
//     { label: "Analytics", icon: BarChart3, href: "/analytics" },
//     {
//         label: "Emergency Contact",
//         icon: Siren,
//         href: "/emergency-contact",
//         danger: true,
//     },
// ];

// export default function DashboardFeatures() {
//     return (
//         <div className="w-full mb-6 mt-6">
//             <div
//                 className="
//           flex w-full flex-col gap-3 rounded-2xl border border-neutral-200 bg-white p-3 shadow-sm
//           sm:p-4
//           lg:rounded-3xl
//         "
//             >
//                 <div
//                     className="
//             grid grid-cols-1 gap-3
//             sm:grid-cols-2
//             lg:grid-cols-3
//             xl:grid-cols-5
//           "
//                 >
//                     {featureItems.map((item) => {
//                         const Icon = item.icon;

//                         return (
//                             <Link
//                                 key={item.label}
//                                 href={item.href}
//                                 className={`
//                   group flex min-w-0 items-start gap-3 rounded-2xl border p-4 transition
//                   hover:-translate-y-0.5 hover:shadow-md
//                   ${item.danger
//                                         ? "border-red-200 bg-red-50 hover:bg-red-100"
//                                         : "border-neutral-200 bg-neutral-50 hover:bg-white"}
//                 `}
//                             >
//                                 <div
//                                     className={`
//                     flex h-11 w-11 shrink-0 items-center justify-center rounded-xl
//                     ${item.danger
//                                             ? "bg-red-500 text-white"
//                                             : "bg-orange-100 text-orange-600"}
//                   `}
//                                 >
//                                     <Icon className="h-5 w-5" />
//                                 </div>

//                                 <div className="min-w-0">
//                                     <h3
//                                         className={`truncate text-sm font-semibold ${item.danger ? "text-red-700" : "text-neutral-900"
//                                             }`}
//                                     >
//                                         {item.label}
//                                     </h3>

//                                     <p className="mt-1 text-xs text-neutral-500">
//                                         Open {item.label.toLowerCase()}
//                                     </p>
//                                 </div>
//                             </Link>
//                         );
//                     })}
//                 </div>
//             </div>
//         </div>
//     );
// }