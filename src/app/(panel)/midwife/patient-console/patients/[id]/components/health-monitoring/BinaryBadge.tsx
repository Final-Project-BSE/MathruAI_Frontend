type BinaryBadgeProps = {
  label: string;
  value?: number;
};

export default function BinaryBadge({ label, value }: BinaryBadgeProps) {
  const active = value === 1;

  return (
    <div
      className={`rounded-lg border px-3 py-2 text-xs ${
        active
          ? "border-red-500/30 bg-red-500/10 text-red-200"
          : "border-emerald-500/20 bg-emerald-500/10 text-emerald-200"
      }`}
    >
      <span className="font-medium">{label}:</span> {active ? "Yes" : "No"}
    </div>
  );
}