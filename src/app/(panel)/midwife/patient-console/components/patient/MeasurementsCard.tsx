import type { Measurement } from './types';
import { MeasurementItem } from './MeasurementItem';

type MeasurementsCardProps = {
  measurements: Measurement[];
};

export function MeasurementsCard({ measurements }: MeasurementsCardProps) {
  return (
    <div className="rounded-2xl border border-[#26262b] bg-[#0f0f10] p-5 shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
      <h3 className="mb-4 text-xl font-semibold text-[#f5f5f5]">Last Measurements</h3>

      <div className="space-y-4">
        {measurements.map((item) => (
          <MeasurementItem key={item.label} item={item} />
        ))}
      </div>
    </div>
  );
}