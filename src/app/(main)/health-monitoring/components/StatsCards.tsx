import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Activity, Heart, Droplet, Zap } from 'lucide-react';

interface VitalsState {
  Age: string;
  SystolicBP: string;
  DiastolicBP: string;
  BS: string;
  BodyTemp: string;
  BMI: string;
  HeartRate: string;
  PreviousComplications: number;
  PreexistingDiabetes: number;
  GestationalDiabetes: number;
  MentalHealth: number;
}

interface StatsCardsProps {
  vitals: VitalsState;
}

const StatsCards: React.FC<StatsCardsProps> = ({ vitals }) => {
  const getBMIStatus = (bmi: string): { status: string; color: string } => {
    const bmiValue = parseFloat(bmi);
    if (!bmiValue) return { status: 'No data', color: 'text-gray-500' };
    if (bmiValue < 18.5) return { status: 'Underweight', color: 'text-blue-600' };
    if (bmiValue < 25) return { status: 'Normal', color: 'text-green-600' };
    if (bmiValue < 30) return { status: 'Overweight', color: 'text-yellow-600' };
    return { status: 'Obese', color: 'text-red-600' };
  };

  const getBPStatus = (systolic: string, diastolic: string): { status: string; color: string } => {
    const sys = parseFloat(systolic);
    const dia = parseFloat(diastolic);
    if (!sys || !dia) return { status: 'No data', color: 'text-gray-500' };
    if (sys < 120 && dia < 80) return { status: 'Normal', color: 'text-green-600' };
    if (sys < 130 && dia < 80) return { status: 'Elevated', color: 'text-yellow-600' };
    if (sys < 140 || dia < 90) return { status: 'High Stage 1', color: 'text-orange-600' };
    return { status: 'High Stage 2', color: 'text-red-600' };
  };

  const getBSStatus = (bs: string): { status: string; color: string } => {
    const bsValue = parseFloat(bs);
    if (!bsValue) return { status: 'No data', color: 'text-gray-500' };
    if (bsValue < 70) return { status: 'Low', color: 'text-blue-600' };
    if (bsValue < 100) return { status: 'Normal', color: 'text-green-600' };
    if (bsValue < 126) return { status: 'Prediabetic', color: 'text-yellow-600' };
    return { status: 'Diabetic', color: 'text-red-600' };
  };

  const getHRStatus = (hr: string): { status: string; color: string } => {
    const hrValue = parseFloat(hr);
    if (!hrValue) return { status: 'No data', color: 'text-gray-500' };
    if (hrValue < 60) return { status: 'Low', color: 'text-blue-600' };
    if (hrValue <= 100) return { status: 'Normal', color: 'text-green-600' };
    if (hrValue <= 120) return { status: 'Elevated', color: 'text-yellow-600' };
    return { status: 'High', color: 'text-red-600' };
  };

  const bmiStatus = getBMIStatus(vitals.BMI);
  const bpStatus = getBPStatus(vitals.SystolicBP, vitals.DiastolicBP);
  const bsStatus = getBSStatus(vitals.BS);
  const hrStatus = getHRStatus(vitals.HeartRate);

  const stats = [
    {
      title: 'BMI',
      value: vitals.BMI ? parseFloat(vitals.BMI).toFixed(1) : '-',
      unit: 'kg/m²',
      status: bmiStatus.status,
      statusColor: bmiStatus.color,
      icon: Activity,
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      borderColor: 'border-purple-200'
    },
    {
      title: 'Blood Pressure',
      value: vitals.SystolicBP && vitals.DiastolicBP 
        ? `${vitals.SystolicBP}/${vitals.DiastolicBP}` 
        : '-',
      unit: 'mmHg',
      status: bpStatus.status,
      statusColor: bpStatus.color,
      icon: Heart,
      bgColor: 'bg-red-50',
      iconColor: 'text-red-600',
      borderColor: 'border-red-200'
    },
    {
      title: 'Blood Sugar',
      value: vitals.BS ? parseFloat(vitals.BS).toFixed(0) : '-',
      unit: 'mg/dL',
      status: bsStatus.status,
      statusColor: bsStatus.color,
      icon: Droplet,
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      borderColor: 'border-blue-200'
    },
    {
      title: 'Heart Rate',
      value: vitals.HeartRate ? parseFloat(vitals.HeartRate).toFixed(0) : '-',
      unit: 'bpm',
      status: hrStatus.status,
      statusColor: hrStatus.color,
      icon: Zap,
      bgColor: 'bg-pink-50',
      iconColor: 'text-pink-600',
      borderColor: 'border-pink-200'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <Card 
          key={index} 
          className={`${stat.bgColor} border-2 ${stat.borderColor} shadow-md hover:shadow-lg transition-shadow`}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg bg-white ${stat.borderColor} border`}>
                <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
              </div>
              <span className={`text-xs font-semibold ${stat.statusColor} uppercase tracking-wide`}>
                {stat.status}
              </span>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-600">{stat.title}</p>
              <div className="flex items-baseline space-x-2">
                <p className="text-3xl font-bold text-gray-800">
                  {stat.value}
                </p>
                <p className="text-sm text-gray-500">{stat.unit}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatsCards;