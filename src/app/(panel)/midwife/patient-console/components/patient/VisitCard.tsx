import type { Visit } from './types';
import { ActionMailIcon, DotMenuIcon, PrintIcon } from './icons';

type VisitCardProps = {
  visit: Visit;
};

export function VisitCard({ visit }: VisitCardProps) {
  return (
    <div className="rounded-2xl border border-[#26262b] bg-[#151518] p-4 shadow-[0_1px_2px_rgba(0,0,0,0.35)]">
      <div className="grid grid-cols-[1fr_auto] gap-4">
        <div className="space-y-3 text-sm">
          <div className="grid grid-cols-[56px_1fr] gap-x-3 gap-y-2">
            <div className="text-[#8c8c95]">Doctor</div>
            <div className="font-medium text-[#f5f5f5]">
              {visit.doctor}, {visit.specialty}
            </div>

            <div className="text-[#8c8c95]">Time</div>
            <div className="text-[#d6d6db]">
              {visit.time} ({visit.duration})
            </div>

            <div className="text-[#8c8c95]">Patient</div>
            <div className="text-[#d6d6db]">{visit.patient}</div>
          </div>
        </div>

        <div className="text-right text-sm">
          <div className="font-medium text-[#fab0a7]">{visit.date}</div>
          <div className="text-[#8c8c95]">{visit.weekday}</div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-[#26262b] pt-3">
        <div className="flex items-center gap-4 text-sm text-[#b8b8bf]">
          <button className="inline-flex items-center gap-2 transition hover:text-[#fab0a7]">
            <ActionMailIcon />
            <span>Send Details</span>
          </button>

          <button className="inline-flex items-center gap-2 transition hover:text-[#fab0a7]">
            <PrintIcon />
            <span>Print Price</span>
          </button>
        </div>

        <button className="text-[#7a7a84] transition hover:text-[#fab0a7]">
          <DotMenuIcon />
        </button>
      </div>
    </div>
  );
}