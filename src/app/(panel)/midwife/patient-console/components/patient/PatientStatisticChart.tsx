type PatientStatisticChartProps = {
  analysis: number;
  visits: number;
};

export function PatientStatisticChart({
  analysis,
  visits,
}: PatientStatisticChartProps) {
  const total = analysis + visits || 1;
  const strokeWidth = 18;
  const radius = 62;
  const circumference = 2 * Math.PI * radius;
  const analysisLength = (analysis / total) * circumference;
  const visitsLength = (visits / total) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative h-44 w-44">
        <svg viewBox="0 0 180 180" className="h-full w-full -rotate-90">
          <circle
            cx="90"
            cy="90"
            r={radius}
            fill="none"
            stroke="#26262b"
            strokeWidth={strokeWidth}
          />
          <circle
            cx="90"
            cy="90"
            r={radius}
            fill="none"
            stroke="#d04f51"
            strokeWidth={strokeWidth}
            strokeLinecap="butt"
            strokeDasharray={`${analysisLength} ${circumference - analysisLength}`}
          />
          <circle
            cx="90"
            cy="90"
            r={radius}
            fill="none"
            stroke="#fab0a7"
            strokeWidth={strokeWidth}
            strokeLinecap="butt"
            strokeDasharray={`${visitsLength} ${circumference - visitsLength}`}
            strokeDashoffset={-analysisLength}
          />
        </svg>

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-24 w-24 rounded-full bg-[#0f0f10]" />
        </div>
      </div>

      <div className="mt-2 flex items-center gap-8 text-sm">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-sm bg-[#d04f51]" />
          <div>
            <div className="font-semibold text-[#f5f5f5]">{analysis}</div>
            <div className="text-xs text-[#8c8c95]">Analysis</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-sm bg-[#fab0a7]" />
          <div>
            <div className="font-semibold text-[#f5f5f5]">{visits}</div>
            <div className="text-xs text-[#8c8c95]">Visits</div>
          </div>
        </div>
      </div>

      <p className="mt-4 text-xs font-medium text-[#cfcfd5]">Total Visits {total}</p>
    </div>
  );
}