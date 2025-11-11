"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Apple,
  Dumbbell,
  Brain,
  Activity,
  Calendar,
  Moon,
  Clock,
  CheckCircle,
  ArrowRight,
  Timer,
  TrendingUp,
  Heart,
  Zap,
  Target,
  Eye,
  PlusCircle,
  MoreHorizontal
} from 'lucide-react';

interface Recommendation {
  id: string;
  category: string;
  categoryColor: string;
  categoryIcon: React.ReactNode;
  title: string;
  description: string;
  tags: string[];
  priority: 'High' | 'Medium' | 'Low';
  status: 'pending' | 'in-progress' | 'completed';
  bgColor: string;
  iconBg: string;
  actions: {
    primary: string;
    secondary: string;
  };
}

const DailyRecommendations = () => {
  const [selectedFilter, setSelectedFilter] = useState('All');

  const todaysOverview = {
    recommendations: 6,
    completed: 4,
    progress: 85,
    dayNumber: 14,
    cycleDay: "OVULATION"
  };

  const recommendations: Recommendation[] = [
    {
      id: '1',
      category: 'DIET & HEALTH',
      categoryColor: 'text-orange-600',
      categoryIcon: <Apple className="w-4 h-4" />,
      title: 'Nutrition Focus',
      description: 'Eat fertility-friendly foods today. Focus on leafy greens, legumes, and folate-rich cereals. Consider omega-3 rich fish during your ovulation phase.',
      tags: ['Target Nutrition Tips', 'Priority: High'],
      priority: 'High',
      status: 'pending',
      bgColor: 'bg-orange-50',
      iconBg: 'bg-orange-100',
      actions: {
        primary: 'View Meal Plan',
        secondary: 'Mark Done'
      }
    },
    {
      id: '2',
      category: 'PHYSICAL ACTIVITY',
      categoryColor: 'text-teal-600',
      categoryIcon: <Dumbbell className="w-4 h-4" />,
      title: 'Gentle Exercise',
      description: 'Moderate exercise is recommended during ovulation. Try 20 minutes walk or gentle yoga to help circulation and reduce stress.',
      tags: ['Target 30 minutes', 'Priority: High'],
      priority: 'High',
      status: 'in-progress',
      bgColor: 'bg-teal-50',
      iconBg: 'bg-teal-100',
      actions: {
        primary: 'Start Workout',
        secondary: 'Completed'
      }
    },
    {
      id: '3',
      category: 'MENTAL WELLNESS',
      categoryColor: 'text-purple-600',
      categoryIcon: <Brain className="w-4 h-4" />,
      title: 'Stress Management',
      description: 'Practice relaxation techniques to manage ovulation-related mood changes. Try minutes of mindfulness can improve hormonal balance.',
      tags: ['Duration: 15 min', 'Priority: High'],
      priority: 'High',
      status: 'pending',
      bgColor: 'bg-purple-50',
      iconBg: 'bg-purple-100',
      actions: {
        primary: 'Start Session',
        secondary: 'Remind Later'
      }
    },
    {
      id: '4',
      category: 'HEALTH MONITORING',
      categoryColor: 'text-blue-600',
      categoryIcon: <Activity className="w-4 h-4" />,
      title: 'Symptom Tracking',
      description: 'Log ovulation symptoms today. Track cervical mucus, basal body temperature, and any physical sensations for accurate cycle monitoring.',
      tags: ['Time Tracking', 'Ovarian Org'],
      priority: 'Medium',
      status: 'pending',
      bgColor: 'bg-blue-50',
      iconBg: 'bg-blue-100',
      actions: {
        primary: 'Log Symptoms',
        secondary: 'View Trends'
      }
    },
    {
      id: '5',
      category: 'CYCLE INSIGHTS',
      categoryColor: 'text-pink-600',
      categoryIcon: <Calendar className="w-4 h-4" />,
      title: 'Fertility Window',
      description: 'Peak fertility window detected. If trying to conceive, this is an optimal time. Consider scheduling intimate time with your partner.',
      tags: ['Window: 3 Days', 'Probability: 75%'],
      priority: 'High',
      status: 'pending',
      bgColor: 'bg-pink-50',
      iconBg: 'bg-pink-100',
      actions: {
        primary: 'Set Reminder',
        secondary: 'Learn More'
      }
    },
    {
      id: '6',
      category: 'SLEEP & RECOVERY',
      categoryColor: 'text-indigo-600',
      categoryIcon: <Moon className="w-4 h-4" />,
      title: 'Sleep Optimization',
      description: 'Aim for 8 hours of quality sleep. Hormonal changes during ovulation may affect sleep patterns. Create a calming bedtime routine.',
      tags: ['Target: 8 Hours', 'Bedtime: 10 PM'],
      priority: 'Medium',
      status: 'pending',
      bgColor: 'bg-indigo-50',
      iconBg: 'bg-indigo-100',
      actions: {
        primary: 'Sleep Tips',
        secondary: 'Set Alarm'
      }
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'in-progress':
        return <Timer className="w-4 h-4 text-blue-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-pink-200 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-800">Daily Recommendations</h1>
          <p className="text-gray-600">Personalized health recommendations for your reproductive wellness journey</p>
        </div>

        {/* Today's Overview Card */}
        <Card className="bg-white shadow-lg rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">Today's Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-800 mb-1">{todaysOverview.recommendations}</div>
                <div className="text-sm text-gray-600 uppercase tracking-wide">RECOMMENDATIONS</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-800 mb-1">{todaysOverview.completed}</div>
                <div className="text-sm text-gray-600 uppercase tracking-wide">COMPLETED</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-800 mb-1">{todaysOverview.progress}%</div>
                <div className="text-sm text-gray-600 uppercase tracking-wide">PROGRESS</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-800 mb-1">Day {todaysOverview.dayNumber}</div>
                <div className="text-sm text-gray-600 uppercase tracking-wide">{todaysOverview.cycleDay}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Today's Recommendations Header with Filter */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">Today's Recommendations</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">08 / 03 / 2024</span>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
              <Calendar className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Recommendations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((rec) => (
            <Card key={rec.id} className={`${rec.bgColor} border-0 shadow-md hover:shadow-lg transition-shadow`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-full ${rec.iconBg}`}>
                      {rec.categoryIcon}
                    </div>
                    <Badge variant="outline" className={getPriorityColor(rec.priority)}>
                      {rec.priority}
                    </Badge>
                  </div>
                  {getStatusIcon(rec.status)}
                </div>
                <div className="space-y-1">
                  <p className={`text-xs font-medium uppercase tracking-wide ${rec.categoryColor}`}>
                    {rec.category}
                  </p>
                  <h3 className="font-semibold text-gray-900">{rec.title}</h3>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-700 leading-relaxed">
                  {rec.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {rec.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs bg-white/70 text-gray-600">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2 pt-2">
                  <Button 
                    size="sm" 
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-xs"
                  >
                    {rec.actions.primary}
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1 text-xs border-gray-300 hover:bg-white/50"
                  >
                    {rec.actions.secondary}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DailyRecommendations;