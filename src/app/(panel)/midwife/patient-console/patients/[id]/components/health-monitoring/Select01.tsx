type Select01Props = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

export default function Select01({
  label,
  value,
  onChange,
}: Select01Props) {
  return (
    <label className="space-y-2">
      <span className="text-sm text-zinc-400">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-white outline-none focus:border-red-500"
      >
        <option value="0">No</option>
        <option value="1">Yes</option>
      </select>
    </label>
  );
}