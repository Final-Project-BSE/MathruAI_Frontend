type PatientHeaderProps = {
  name: string;
};

export function PatientHeader({ name }: PatientHeaderProps) {
  return (
    <div className="rounded-2xl border border-[#26262b] bg-[#0f0f10] px-5 py-4 shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
      <div className="mb-1 text-xs text-[#8c8c95]">
        Patient Directory <span className="mx-1 text-[#d04f51]">›</span> Patient Card
      </div>
      <h1 className="text-[34px] font-semibold leading-tight tracking-[-0.02em] text-[#f5f5f5]">
        {name}
      </h1>
    </div>
  );
}