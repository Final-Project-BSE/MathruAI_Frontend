"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  CircleAlert,
  CircleCheckBig,
  TriangleAlert,
  Activity,
} from "lucide-react";
import type { VitalsState } from "../../../api/healthmonitor/types";
import { useLanguage } from "@/components/common/useLanguage";

interface StatsCardsProps {
  vitals: VitalsState;
}

type Severity = "none" | "normal" | "low" | "medium" | "high";

type StatusMeta = {
  label: string;
  severity: Severity;
};

type CardItem = {
  title: string;
  value: string;
  subtitle: string;
  severity: Severity;
  cardClassName: string;
};

const StatsCards: React.FC<StatsCardsProps> = ({ vitals }) => {
  const { t } = useLanguage();
  const text = t.healthMonitor.stats;

  const getBMIStatus = (bmi: string): StatusMeta => {
    const value = parseFloat(bmi);
    if (!value) return { label: text.noData, severity: "none" };
    if (value < 18.5) return { label: text.underweight, severity: "medium" };
    if (value < 25) return { label: text.normal, severity: "normal" };
    if (value < 30) return { label: text.overweight, severity: "medium" };
    return { label: text.obese, severity: "high" };
  };

  const getBPStatus = (systolic: string, diastolic: string): StatusMeta => {
    const sys = parseFloat(systolic);
    const dia = parseFloat(diastolic);

    if (!sys || !dia) return { label: text.noData, severity: "none" };
    if (sys < 120 && dia < 80) return { label: text.normal, severity: "normal" };
    if (sys >= 120 && sys < 130 && dia < 80) {
      return { label: text.elevated, severity: "medium" };
    }
    if ((sys >= 130 && sys < 140) || (dia >= 80 && dia < 90)) {
      return { label: text.highStage1, severity: "medium" };
    }
    return { label: text.highStage2, severity: "high" };
  };

  const getBSStatus = (bs: string): StatusMeta => {
    const value = parseFloat(bs);
    if (!value) return { label: text.noData, severity: "none" };
    if (value < 70) return { label: text.low, severity: "medium" };
    if (value < 100) return { label: text.normal, severity: "normal" };
    if (value < 126) return { label: text.prediabetic, severity: "medium" };
    return { label: text.diabetic, severity: "high" };
  };

  const getHRStatus = (hr: string): StatusMeta => {
    const value = parseFloat(hr);
    if (!value) return { label: text.noData, severity: "none" };
    if (value < 60) return { label: text.low, severity: "medium" };
    if (value <= 100) return { label: text.normal, severity: "normal" };
    if (value <= 120) return { label: text.elevated, severity: "medium" };
    return { label: text.high, severity: "high" };
  };

  const getSeverityStyles = (severity: Severity) => {
    switch (severity) {
      case "normal":
        return {
          icon: CircleCheckBig,
          iconColor: "text-green-600",
          valueColor: "text-green-700",
          subtitleColor: "text-green-600",
        };
      case "low":
        return {
          icon: Activity,
          iconColor: "text-red-600",
          valueColor: "text-red-700",
          subtitleColor: "text-red-600",
        };
      case "medium":
        return {
          icon: TriangleAlert,
          iconColor: "text-amber-600",
          valueColor: "text-amber-700",
          subtitleColor: "text-amber-600",
        };
      case "high":
        return {
          icon: CircleAlert,
          iconColor: "text-red-600",
          valueColor: "text-red-700",
          subtitleColor: "text-red-600",
        };
      case "none":
      default:
        return {
          icon: Activity,
          iconColor: "text-slate-400",
          valueColor: "text-slate-500",
          subtitleColor: "text-slate-400",
        };
    }
  };

  const bmi = getBMIStatus(vitals.BMI);
  const bp = getBPStatus(vitals.SystolicBP, vitals.DiastolicBP);
  const bs = getBSStatus(vitals.BS);
  const hr = getHRStatus(vitals.HeartRate);

  const cards: CardItem[] = [
    {
      title: text.bmi,
      value: vitals.BMI ? parseFloat(vitals.BMI).toFixed(1) : "--",
      subtitle: bmi.label,
      severity: bmi.severity,
      cardClassName: "bg-[#ffffff] border-[#ebe7de]",
    },
    {
      title: text.bloodPressure,
      value:
        vitals.SystolicBP && vitals.DiastolicBP
          ? `${vitals.SystolicBP}/${vitals.DiastolicBP}`
          : "--",
      subtitle: bp.label,
      severity: bp.severity,
      cardClassName: "bg-[#ffffff] border-[#f0e3d2]",
    },
    {
      title: text.bloodSugar,
      value: vitals.BS ? parseFloat(vitals.BS).toFixed(0) : "--",
      subtitle: bs.label,
      severity: bs.severity,
      cardClassName: "bg-[#ffffff] border-[#f1dddd]",
    },
    {
      title: text.heartRate,
      value: vitals.HeartRate ? parseFloat(vitals.HeartRate).toFixed(0) : "--",
      subtitle: hr.label,
      severity: hr.severity,
      cardClassName: "bg-[#ffffff] border-[#eedee7]",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4 mb-6">
      {cards.map((card) => {
        const styles = getSeverityStyles(card.severity);
        const Icon = styles.icon;

        return (
          <Card
            key={card.title}
            className={`rounded-md border shadow-none ${card.cardClassName}`}
          >
            <CardContent className="flex min-h-[84px] items-center gap-3 px-4 py-1">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/70">
                <Icon className={`h-4 w-4 ${styles.iconColor}`} strokeWidth={2} />
              </div>

              <div className="min-w-0">
                <div className={`text-[26px] leading-none font-semibold ${styles.valueColor}`}>
                  {card.value}
                </div>
                <div className="mt-1 text-[11px] font-medium text-slate-700">
                  {card.title}
                </div>
                <div className={`mt-0.5 text-[10px] ${styles.subtitleColor}`}>
                  {card.subtitle}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default StatsCards;