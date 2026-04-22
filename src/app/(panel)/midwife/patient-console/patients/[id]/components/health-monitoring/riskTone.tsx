import { AlertTriangle, HeartPulse, ShieldAlert } from "lucide-react";
import { ReactNode } from "react";

export type RiskTone = {
  badge: string;
  alert: string;
  icon: ReactNode;
  title: string;
};

export function riskTone(riskLevel?: string): RiskTone {
  const level = (riskLevel || "").toLowerCase();

  if (level.includes("high")) {
    return {
      badge: "border-red-500/30 bg-red-500/10 text-red-200",
      alert: "border-red-500/20 bg-red-500/10 text-red-100",
      icon: <ShieldAlert className="h-4 w-4" />,
      title: "High-risk condition detected",
    };
  }

  if (level.includes("mid") || level.includes("moderate")) {
    return {
      badge: "border-amber-500/30 bg-amber-500/10 text-amber-200",
      alert: "border-amber-500/20 bg-amber-500/10 text-amber-100",
      icon: <AlertTriangle className="h-4 w-4" />,
      title: "Patient needs closer observation",
    };
  }

  return {
    badge: "border-emerald-500/20 bg-emerald-500/10 text-emerald-200",
    alert: "border-emerald-500/20 bg-emerald-500/10 text-emerald-100",
    icon: <HeartPulse className="h-4 w-4" />,
    title: "Current condition looks stable",
  };
}