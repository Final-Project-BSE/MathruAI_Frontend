import type { Visit } from './types';
import { CalendarIcon } from './icons';
import { VisitCard } from './VisitCard';

type LastVisitsSidebarProps = {
  recentVisits: Visit[];
};

export function LastVisitsSidebar({ recentVisits }: LastVisitsSidebarProps) {
  return (
    <aside className="rounded-2xl border border-[#26262b] bg-[#0f0f10] p-5 shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 className="text-2xl font-semibold text-[#f5f5f5]">Last visits</h2>

        <button className="inline-flex items-center gap-2 rounded-xl bg-[#d04f51] px-4 py-2 text-sm font-medium text-white transition hover:brightness-110">
          <CalendarIcon />
          <span>Create New Visit</span>
        </button>
      </div>

      <div className="mb-4 flex items-center justify-between text-sm">
        <div className="text-[#8c8c95]">
          Sort By: <span className="font-medium text-[#fab0a7]">Date</span>
        </div>

        <button className="text-[#8c8c95] transition hover:text-[#fab0a7]">
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M4 7h16M7 12h10M10 17h4" />
          </svg>
        </button>
      </div>

      <div className="max-h-[720px] space-y-4 overflow-y-auto pr-1">
        {recentVisits.map((visit, index) => (
          <VisitCard key={`${visit.date}-${index}`} visit={visit} />
        ))}
      </div>
    </aside>
  );
}