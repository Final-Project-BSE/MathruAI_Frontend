import type { DocumentItem } from './types';
import { DotMenuIcon, FileIcon } from './icons';
import { PreviewDocCard } from './PreviewDocCard';

type DocumentsCardProps = {
  documents: DocumentItem[];
};

export function DocumentsCard({ documents }: DocumentsCardProps) {
  return (
    <div className="rounded-2xl border border-[#26262b] bg-[#0f0f10] p-5 shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-semibold text-[#f5f5f5]">Files & Documents</h3>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[0, 1, 2].map((index) => (
          <PreviewDocCard key={index} index={index} />
        ))}
      </div>

      <div className="mt-4 divide-y divide-[#26262b]">
        {documents.map((doc) => (
          <div key={doc.title} className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#2d2d33] bg-[#151518] text-[#fab0a7]">
                <FileIcon />
              </div>
              <div>
                <div className="text-sm font-medium text-[#f5f5f5]">{doc.title}</div>
                <div className="text-xs text-[#8c8c95]">{doc.subtitle}</div>
              </div>
            </div>

            <button className="text-[#7a7a84] transition hover:text-[#fab0a7]">
              <DotMenuIcon />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-3 text-right">
        <button className="text-sm font-medium text-[#d04f51] transition hover:text-[#fab0a7]">
          View All
        </button>
      </div>
    </div>
  );
}