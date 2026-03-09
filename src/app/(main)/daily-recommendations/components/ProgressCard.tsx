import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ProgressCardProps {
  pregnancyWeek: number;
}

const ProgressCard: React.FC<ProgressCardProps> = ({ pregnancyWeek }) => {
  const safeWeek = Math.max(0, Math.min(pregnancyWeek, 40));
  const progress = Math.min((safeWeek / 40) * 100, 100);
  const trimester = safeWeek <= 12 ? 1 : safeWeek <= 28 ? 2 : 3;
  const weeksRemaining = Math.max(40 - safeWeek, 0);
  const daysRemaining = weeksRemaining * 7;

  return (
    <Card className="border border-[#d04f51]/15 bg-white shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#d04f51]/10">
              <Activity className="h-5 w-5 text-[#d04f51]" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900">
                Pregnancy Progress
              </h3>
              <p className="text-xs font-normal text-gray-500">
                Track your current journey and remaining time
              </p>
            </div>
          </div>

          <Badge className="border-[#d04f51]/20 bg-[#d04f51]/10 text-[#d04f51] hover:bg-[#d04f51]/10">
            Trimester {trimester}
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="rounded-2xl border border-[#d04f51]/10 bg-[#d04f51]/5 p-4">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Week {safeWeek} of 40
              </p>
              <p className="text-xs text-gray-500">
                Pregnancy completion progress
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-[#d04f51]">
                {Math.round(progress)}%
              </p>
            </div>
          </div>

          <div className="h-3 w-full overflow-hidden rounded-full bg-white">
            <div
              className="h-full rounded-full bg-[#d04f51] transition-all duration-700 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-[#d04f51]/15 bg-white p-4 text-center shadow-sm">
            <p className="text-3xl font-bold text-[#d04f51]">{safeWeek}</p>
            <p className="mt-2 text-xs font-medium uppercase tracking-wide text-gray-500">
              Current Week
            </p>
          </div>

          <div className="rounded-2xl border border-[#d04f51]/15 bg-white p-4 text-center shadow-sm">
            <p className="text-3xl font-bold text-[#d04f51]">{weeksRemaining}</p>
            <p className="mt-2 text-xs font-medium uppercase tracking-wide text-gray-500">
              Weeks to Go
            </p>
          </div>

          <div className="rounded-2xl border border-[#d04f51]/15 bg-white p-4 text-center shadow-sm">
            <p className="text-3xl font-bold text-[#d04f51]">{daysRemaining}</p>
            <p className="mt-2 text-xs font-medium uppercase tracking-wide text-gray-500">
              Days Left
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressCard;