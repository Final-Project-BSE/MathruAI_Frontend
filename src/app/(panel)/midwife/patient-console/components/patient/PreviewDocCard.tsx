type PreviewDocCardProps = {
  index: number;
};

export function PreviewDocCard({ index }: PreviewDocCardProps) {
  return (
    <div className="relative h-20 rounded-xl border border-[#2a2a30] bg-[#151518] p-2">
      <div className="h-full rounded-lg border border-[#303038] bg-[#101012] p-2">
        <div className="mb-2 h-1.5 w-10 rounded bg-[#d04f51]" />
        <div className="mb-1 h-1.5 w-full rounded bg-[#2d2d33]" />
        <div className="mb-1 h-1.5 w-4/5 rounded bg-[#2d2d33]" />
        <div className="mb-1 h-1.5 w-3/4 rounded bg-[#2d2d33]" />
        <div className="h-1.5 w-2/3 rounded bg-[#2d2d33]" />
      </div>
      <span className="absolute right-2 top-2 rounded-full bg-[#1d1d22] px-1.5 py-0.5 text-[10px] text-[#fab0a7]">
        {index + 1}
      </span>
    </div>
  );
}