export type AssetCardItem = {
  name: string;
  label: string;
  rate: string;
  change: string;
  changeType: "up" | "down";
  coinBg: string;
  lineColor: string;
  amountLabel: string;
  graph: string;
};

export const assets: AssetCardItem[] = [
  {
    name: "Today’s Appointments",
    label: "Scheduled for today",
    rate: "24",
    change: "+ 3 from yesterday",
    changeType: "up",
    coinBg: "bg-slate-700/80",
    lineColor: "#8b7bff",
    amountLabel: "24 Total",
    graph:
      "M0 80 C25 70, 40 95, 60 88 C85 80, 105 48, 135 58 C165 70, 190 38, 220 18",
  },
  {
    name: "High-Risk Mothers",
    label: "Need close monitoring",
    rate: "12",
    change: "+ 2 new cases",
    changeType: "up",
    coinBg: "bg-yellow-500/90",
    lineColor: "#8b7bff",
    amountLabel: "12 Total",
    graph:
      "M0 78 C20 82, 36 98, 58 92 C80 86, 104 66, 132 70 C155 74, 180 52, 220 30",
  },
  {
    name: "Missed Visits",
    label: "Visits not completed",
    rate: "5",
    change: "- 1 from yesterday",
    changeType: "down",
    coinBg: "bg-purple-600/90",
    lineColor: "#ff5c6c",
    amountLabel: "5 Total",
    graph:
      "M0 64 C22 54, 44 32, 72 36 C95 40, 114 58, 136 54 C162 50, 186 58, 220 70",
  },
//   {
//     name: "Pending Requests",
//     label: "Awaiting action",
//     rate: "8",
//     change: "+ 2 today",
//     changeType: "up",
//     coinBg: "bg-emerald-600/90",
//     lineColor: "#8b7bff",
//     amountLabel: "8 Pending",
//     graph:
//       "M0 76 C22 72, 45 82, 70 74 C95 66, 118 46, 145 52 C175 58, 198 34, 220 20",
//   },
  {
    name: "Mothers Near Delivery Date",
    label: "Mothers approaching EDD",
    rate: "6",
    change: "+ 1 this week",
    changeType: "up",
    coinBg: "bg-rose-500/90",
    lineColor: "#8b7bff",
    amountLabel: "6 Mothers",
    graph:
      "M0 82 C20 76, 42 84, 66 72 C92 58, 116 54, 142 48 C168 42, 190 28, 220 16",
  },
];