import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Baby } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ProgressCardProps {
  pregnancyWeek: number;
}

const ProgressCard: React.FC<ProgressCardProps> = ({ pregnancyWeek }) => {
  const progress = Math.min((pregnancyWeek / 40) * 100, 100);
  const trimester = pregnancyWeek <= 12 ? 1 : pregnancyWeek <= 28 ? 2 : 3;
  const weeksRemaining = Math.max(40 - pregnancyWeek, 0);
  const daysRemaining = weeksRemaining * 7;

  return (
    <Card className="shadow-md bg-white">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center justify-between">
          <div className="flex items-center">
            <Activity className="h-5 w-5 mr-2 text-purple-500" />
            Pregnancy Progress
          </div>
          <Badge variant="outline" className="text-purple-600 border-purple-300">
            Trimester {trimester}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-3">
            <span className="font-medium">Week {pregnancyWeek} of 40</span>
            <span className="font-semibold text-purple-600">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="relative w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
            <p className="text-3xl font-bold text-purple-600">{pregnancyWeek}</p>
            <p className="text-xs text-gray-600 mt-2 font-medium">Current Week</p>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl border border-pink-200">
            <p className="text-3xl font-bold text-pink-600">{weeksRemaining}</p>
            <p className="text-xs text-gray-600 mt-2 font-medium">Weeks to Go</p>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
            <p className="text-3xl font-bold text-blue-600">{daysRemaining}</p>
            <p className="text-xs text-gray-600 mt-2 font-medium">Days Left</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressCard;
