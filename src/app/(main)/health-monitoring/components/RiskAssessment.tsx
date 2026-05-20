"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Brain, CheckCircle2 } from "lucide-react";
import type { PredictionResult } from "../../../api/healthmonitor/types";
import { useLanguage } from "@/components/common/useLanguage";
import { translateText } from "@/components/common/translateText";

interface RiskAssessmentProps {
  predictionResult: PredictionResult | null;
  currentPredictionId: string | null;
}

type RiskTone = {
  badgeClass: string;
  barClass: string;
};

const RiskAssessmentComponent: React.FC<RiskAssessmentProps> = ({
  predictionResult,
}) => {
  const { language, t } = useLanguage();
  const text = t.healthMonitor.risk;

  const [translatedAdvice, setTranslatedAdvice] = useState("");

  const getRiskTone = (riskLevel?: string): RiskTone => {
    if (!riskLevel) {
      return {
        badgeClass: "bg-slate-100 text-slate-700 border-slate-200",
        barClass: "bg-slate-400",
      };
    }

    switch (riskLevel.toLowerCase()) {
      case "low risk":
      case "low":
        return {
          badgeClass: "bg-green-50 text-green-700 border-green-200",
          barClass: "bg-green-600",
        };

      case "mid risk":
      case "medium":
      case "moderate":
        return {
          badgeClass: "bg-amber-50 text-amber-700 border-amber-200",
          barClass: "bg-amber-500",
        };

      case "high risk":
      case "high":
        return {
          badgeClass: "bg-red-50 text-red-700 border-red-200",
          barClass: "bg-red-600",
        };

      default:
        return {
          badgeClass: "bg-slate-100 text-slate-700 border-slate-200",
          barClass: "bg-slate-400",
        };
    }
  };

  const translateRiskLevel = (riskLevel?: string): string => {
    if (!riskLevel) return "--";

    switch (riskLevel.toLowerCase()) {
      case "low risk":
        return text.lowRisk;
      case "mid risk":
        return text.midRisk;
      case "high risk":
        return text.highRisk;
      case "low":
        return text.low;
      case "medium":
        return text.medium;
      case "moderate":
        return text.moderate;
      case "high":
        return text.high;
      default:
        return riskLevel;
    }
  };

  const riskLevel = predictionResult?.risk_assessment?.risk_level;
  const confidence = predictionResult?.risk_assessment?.confidence ?? 0;
  const confidencePercent = Math.max(0, Math.min(100, confidence * 100));
  const tone = getRiskTone(riskLevel);

  const primaryAdvice = predictionResult?.health_guidance?.primary_advice ?? "";

  useEffect(() => {
    let cancelled = false;

    const translateAdvice = async () => {
      if (!primaryAdvice) {
        setTranslatedAdvice("");
        return;
      }

      if (language === "en") {
        setTranslatedAdvice(primaryAdvice);
        return;
      }

      const translated = await translateText(primaryAdvice, language);

      if (!cancelled) {
        setTranslatedAdvice(translated);
      }
    };

    void translateAdvice();

    return () => {
      cancelled = true;
    };
  }, [primaryAdvice, language]);

  return (
    <Card className="h-full border border-border bg-white shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
          <TrendingUp className="h-5 w-5 text-muted-foreground" />
          {text.title}
        </CardTitle>
      </CardHeader>

      <CardContent>
        {!predictionResult ? (
          <div className="flex min-h-[220px] flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/20 px-6 py-10 text-center">
            <Brain className="mb-3 h-10 w-10 text-muted-foreground" />
            <p className="text-sm font-medium text-foreground">
              {text.noAssessment}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {text.noAssessmentDescription}
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {predictionResult.risk_assessment && (
              <div className="rounded-lg border border-border bg-background p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      {text.riskLevel}
                    </h3>
                    <p className="mt-1 text-base font-semibold text-foreground">
                      {text.assessmentResult}
                    </p>
                  </div>

                  <Badge
                    variant="outline"
                    className={`${tone.badgeClass} px-3 py-1 text-sm font-medium`}
                  >
                    {translateRiskLevel(predictionResult.risk_assessment.risk_level)}
                  </Badge>
                </div>

                <div className="mt-5">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {text.confidence}
                    </span>
                    <span className="text-sm font-medium text-foreground">
                      {confidencePercent.toFixed(1)}%
                    </span>
                  </div>

                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${tone.barClass}`}
                      style={{ width: `${confidencePercent}%` }}
                    />
                  </div>
                </div>
              </div>
            )}

            {predictionResult.health_guidance && (
              <div className="rounded-lg border border-border bg-background p-5">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-muted-foreground" />
                  <div className="min-w-0">
                    <h3 className="text-sm font-medium text-muted-foreground">
                      {text.healthGuidance}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-foreground">
                      {translatedAdvice || primaryAdvice}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RiskAssessmentComponent;