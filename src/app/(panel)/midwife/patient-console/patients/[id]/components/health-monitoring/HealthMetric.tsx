type HealthMetricProps = {
  label: string;
  value: string | number | undefined | null;
  suffix?: string;
};

export default function HealthMetric({
  label,
  value,
  suffix,
}: HealthMetricProps) {
  const display =
    value === undefined || value === null || value === "" ? "-" : value;

  return (
    <div className="rounded-xl border border-white/10 bg-zinc-900 pl-3 pr-3 pt-2 pb-2">
      <div className="text-xs uppercase tracking-wide text-zinc-500">{label}</div>
      <div className="mt-1 text-xs font-semibold text-white">
        {display}
        {display !== "-" && suffix ? (
          <span className="ml-1 text-xs text-zinc-400">{suffix}</span>
        ) : null}
      </div>
    </div>
  );
}