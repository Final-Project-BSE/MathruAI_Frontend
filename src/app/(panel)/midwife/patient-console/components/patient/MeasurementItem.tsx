import type { Measurement } from './types';
import { getMeasurementIcon, measurementTextColor } from './utils';

type MeasurementItemProps = {
  item: Measurement;
};

export function MeasurementItem({ item }: MeasurementItemProps) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={[
          'flex h-10 w-10 items-center justify-center rounded-xl border',
          item.accent === 'green'
            ? 'border-[#294233] bg-[#132019] text-[#7ee787]'
            : item.accent === 'red'
              ? 'border-[#5b2628] bg-[#211214] text-[#d04f51]'
              : item.accent === 'purple'
                ? 'border-[#4a355c] bg-[#18131f] text-[#c9a4ff]'
                : 'border-[#2b2b31] bg-[#151518] text-[#fab0a7]',
        ].join(' ')}
      >
        {getMeasurementIcon(item.label, item.accent)}
      </div>

      <div>
        <div className={`text-[15px] font-semibold ${measurementTextColor(item.accent)}`}>
          {item.value}
        </div>
        <div className="text-xs text-[#8c8c95]">{item.label}</div>
      </div>
    </div>
  );
}