"use client";
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar,
  Droplets,
  Heart,
  Sun,
  TrendingUp,
  Target,
  Activity,
  Lightbulb
} from 'lucide-react';

interface CycleDay {
  date: number;
  isCurrentDay: boolean;
  isPeriod: boolean;
  isFertile: boolean;
  isOvulation: boolean;
  isToday: boolean;
  symptoms?: string[];
  mood?: string;
}

interface CycleStats {
  currentDay: number;
  cycleLength: number;
  nextPeriod: number;
  fertile: number;
}

interface Symptoms {
  periodFlow: 'Heavy' | 'Medium' | 'Light' | null;
  ovulation: 'Cramps' | 'Headache' | 'Spotting' | null;
  bleeding: 'Spotting' | 'Light' | 'Medium' | 'Heavy' | null;
  mood: 'Happy' | 'Anxious' | 'Unstable' | 'Sad' | null;
  cervicalMucus: 'Dry' | 'Sticky' | 'Creamy' | 'Egg White' | null;
}

const cycleStats: CycleStats = {
  currentDay: 14,
  cycleLength: 28,
  nextPeriod: 14,
  fertile: 3
};

const currentSymptoms: Symptoms = {
  periodFlow: 'Medium',
  ovulation: 'Cramps',
  bleeding: 'Spotting',
  mood: 'Happy',
  cervicalMucus: 'Egg White'
};

// Generate calendar days for August 2025
const generateCalendarDays = (): CycleDay[] => {
  const days: CycleDay[] = [];
  const today = 14; // Current day
  const periodDays = [1, 2, 3, 4, 5]; // Period days
  const fertileDays = [12, 13, 14, 15, 16]; // Fertile window
  const ovulationDay = 14; // Ovulation day
  
  for (let i = 1; i <= 31; i++) {
    days.push({
      date: i,
      isCurrentDay: i === today,
      isPeriod: periodDays.includes(i),
      isFertile: fertileDays.includes(i),
      isOvulation: i === ovulationDay,
      isToday: i === today,
    });
  }
  
  return days;
};

const calendarDays = generateCalendarDays();

const getDayClassName = (day: CycleDay) => {
  if (day.isOvulation) return 'bg-red-500 text-white font-bold';
  if (day.isPeriod) return 'bg-red-100 text-red-700';
  if (day.isFertile) return 'bg-pink-100 text-pink-700';
  if (day.isToday) return 'bg-gray-800 text-white';
  return 'bg-white text-gray-700 hover:bg-gray-100';
};

const getSymptomBadgeColor = (type: string, value: string | null) => {
  if (!value) return 'bg-gray-100 text-gray-500';
  
  switch (type) {
    case 'periodFlow':
      return value === 'Heavy' ? 'bg-red-100 text-red-700' : 
             value === 'Medium' ? 'bg-pink-100 text-pink-700' : 'bg-pink-50 text-pink-600';
    case 'ovulation':
      return 'bg-orange-100 text-orange-700';
    case 'bleeding':
      return 'bg-red-100 text-red-700';
    case 'mood':
      return value === 'Happy' ? 'bg-green-100 text-green-700' :
             value === 'Anxious' ? 'bg-yellow-100 text-yellow-700' :
             value === 'Unstable' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700';
    case 'cervicalMucus':
      return 'bg-blue-100 text-blue-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

export default function CycleTracker() {
  const [selectedMonth, setSelectedMonth] = useState('August 2025');
  const [quickLogDay, setQuickLogDay] = useState(14);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-pink-200 to-pink-300 p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Cycle Tracker</h1>
        <p className="text-pink-100">Track your cycle and symptoms. Sync calendar to see scheduled appointments</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="bg-white/90 backdrop-blur-sm">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-500 mb-1">{cycleStats.currentDay}</div>
            <div className="text-sm text-gray-600">Current Day</div>
            <div className="text-xs text-gray-500">Period of cycle</div>
          </CardContent>
        </Card>

        <Card className="bg-white/90 backdrop-blur-sm">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-500 mb-1">{cycleStats.cycleLength}</div>
            <div className="text-sm text-gray-600">Cycle Length</div>
            <div className="text-xs text-gray-500">Average</div>
          </CardContent>
        </Card>

        <Card className="bg-white/90 backdrop-blur-sm">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-500 mb-1">{cycleStats.nextPeriod}</div>
            <div className="text-sm text-gray-600">Next Period</div>
            <div className="text-xs text-gray-500">Days left</div>
          </CardContent>
        </Card>

        <Card className="bg-white/90 backdrop-blur-sm">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-500 mb-1">{cycleStats.fertile}</div>
            <div className="text-sm text-gray-600">Fertile Days</div>
            <div className="text-xs text-gray-500">Remaining</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <Card className="bg-white/90 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">{selectedMonth}</CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <span className="text-sm font-medium">August 2025</span>
                  <Button variant="ghost" size="sm">
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              {/* Calendar Headers */}
              <div className="grid grid-cols-7 gap-1 mt-4">
                {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((day) => (
                  <div key={day} className="text-center text-xs font-medium text-gray-500 p-2">
                    {day}
                  </div>
                ))}
              </div>
            </CardHeader>
            
            <CardContent>
              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {/* Empty cells for days before month starts */}
                {[...Array(3)].map((_, i) => (
                  <div key={`empty-${i}`} className="p-3"></div>
                ))}
                
                {/* Calendar days */}
                {calendarDays.map((day) => (
                  <button
                    key={day.date}
                    className={`
                      p-3 text-sm rounded-lg border transition-colors
                      ${getDayClassName(day)}
                    `}
                  >
                    {day.date}
                  </button>
                ))}
              </div>

              {/* Legend */}
              <div className="flex items-center justify-center gap-6 mt-6 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-100 rounded border"></div>
                  <span className="text-gray-600">Period</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-pink-100 rounded border"></div>
                  <span className="text-gray-600">Fertile Window</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded"></div>
                  <span className="text-gray-600">Ovulation</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-800 rounded"></div>
                  <span className="text-gray-600">Today</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Quick Log */}
          <Card className="bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Quick Log - Day {quickLogDay}</CardTitle>
              <p className="text-sm text-gray-600">Period Flow</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Period Flow */}
              <div>
                <div className="text-sm font-medium mb-2">Symptoms</div>
                <div className="flex flex-wrap gap-2">
                  <Tabs defaultValue="periodFlow">
                    <TabsList className="grid grid-cols-4 w-full">
                      <TabsTrigger value="none" className="text-xs">None</TabsTrigger>
                      <TabsTrigger value="light" className="text-xs">Light</TabsTrigger>
                      <TabsTrigger value="medium" className="text-xs bg-pink-100">Medium</TabsTrigger>
                      <TabsTrigger value="heavy" className="text-xs">Heavy</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </div>

              {/* Ovulation */}
              <div>
                <div className="flex flex-wrap gap-2">
                  <Badge className={getSymptomBadgeColor('ovulation', 'Cramps')}>
                    Cramps
                  </Badge>
                  <Badge className="bg-gray-100 text-gray-500">
                    Headache
                  </Badge>
                  <Badge className="bg-gray-100 text-gray-500">
                    Spotting
                  </Badge>
                </div>
              </div>

              {/* Bleeding */}
              <div>
                <div className="text-sm font-medium mb-2">Bleeding</div>
                <div className="flex flex-wrap gap-2">
                  <Badge className={getSymptomBadgeColor('bleeding', 'Spotting')}>
                    Spotting
                  </Badge>
                  <Badge className="bg-gray-100 text-gray-500">
                    Mild Cramping
                  </Badge>
                  <Badge className="bg-gray-100 text-gray-500">
                    Tender Breasts
                  </Badge>
                </div>
              </div>

              {/* Cervical Mucus */}
              <div>
                <div className="text-sm font-medium mb-2">Cervical Mucus</div>
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-gray-100 text-gray-500">
                    Dry
                  </Badge>
                  <Badge className="bg-gray-100 text-gray-500">
                    Sticky
                  </Badge>
                  <Badge className="bg-gray-100 text-gray-500">
                    Creamy
                  </Badge>
                  <Badge className={getSymptomBadgeColor('cervicalMucus', 'Egg White')}>
                    Egg White
                  </Badge>
                </div>
              </div>

              {/* Mood */}
              <div>
                <div className="text-sm font-medium mb-2">Mood</div>
                <div className="flex flex-wrap gap-2">
                  <Badge className={getSymptomBadgeColor('mood', 'Happy')}>
                    Happy
                  </Badge>
                  <Badge className="bg-gray-100 text-gray-500">
                    Anxious
                  </Badge>
                  <Badge className="bg-gray-100 text-gray-500">
                    Unstable
                  </Badge>
                  <Badge className="bg-gray-100 text-gray-500">
                    Sad
                  </Badge>
                </div>
              </div>

              {/* Energetic */}
              <div>
                <div className="text-sm font-medium mb-2">Energetic</div>
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-gray-100 text-gray-500">
                    Low
                  </Badge>
                  <Badge className="bg-gray-100 text-gray-500">
                    Moderate
                  </Badge>
                  <Badge className="bg-gray-100 text-gray-500">
                    High
                  </Badge>
                </div>
              </div>

              <Button className="w-full bg-red-500 hover:bg-red-600 text-white">
                Save Today's Data
              </Button>
            </CardContent>
          </Card>

          {/* Cycle Insights */}
          <Card className="bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Cycle Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 rounded-full mt-1">
                  <Target className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-sm">Ovulation Prediction</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Your fertile window started. Use your thermometer and 
                    cervical positions to track ovulation timing.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-green-100 rounded-full mt-1">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium text-sm">Cycle Pattern</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Your cycles have been consistent at 28 days 
                    over the past 3 months. Your predicted menstrual 
                    date is accurate.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-purple-100 rounded-full mt-1">
                  <Lightbulb className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-medium text-sm">Health Tip</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Consider tracking your basal body temperature for 
                    more accurate ovulation detection.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}