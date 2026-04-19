import type { Measurement } from './types';
import { ArrowDownIcon, HeartPulseIcon, WeightIcon } from './icons';

export function getMeasurementIcon(label: string, accent: Measurement['accent']) {
  if (label.toLowerCase().includes('heart')) {
    return <HeartPulseIcon />;
  }

  if (label.toLowerCase().includes('weight')) {
    return <WeightIcon />;
  }

  return (
    <div
      className={[
        'flex h-5 w-5 items-center justify-center rounded-full border text-[10px] font-bold',
        accent === 'red'
          ? 'border-[#6c3033] text-[#d04f51]'
          : accent === 'purple'
            ? 'border-[#5c4470] text-[#c9a4ff]'
            : 'border-[#3a3a40] text-[#fab0a7]',
      ].join(' ')}
    >
      {label.toLowerCase().includes('height') ? <ArrowDownIcon /> : '•'}
    </div>
  );
}

export function measurementTextColor(accent: Measurement['accent']) {
  switch (accent) {
    case 'green':
      return 'text-[#f5f5f5]';
    case 'red':
      return 'text-[#d04f51]';
    case 'purple':
      return 'text-[#d7b8ff]';
    default:
      return 'text-[#fab0a7]';
  }
}