"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  Thermometer, 
  Activity, 
  Weight,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3
} from 'lucide-react';

const HealthMonitoringDashboard = () => {
  const [selectedSymptom, setSelectedSymptom] = useState<string>('');
  
  // Health metrics data
  const healthMetrics = [
    {
      icon: <Thermometer className="h-8 w-8 text-orange-500" />,
      value: "98.0°F",
      label: "Temperature",
      status: "Normal",
      bgColor: "bg-orange-50"
    },
    {
      icon: <Heart className="h-8 w-8 text-red-500" />,
      value: "120/80",
      label: "Blood Pressure",
      status: "Normal",
      bgColor: "bg-red-50"
    },
    {
      icon: <Activity className="h-8 w-8 text-pink-500" />,
      value: "72 bpm",
      label: "Heart Rate",
      status: "Normal",
      bgColor: "bg-pink-50"
    },
    {
      icon: <Weight className="h-8 w-8 text-purple-500" />,
      value: "135 lbs",
      label: "Weight",
      status: "Stable",
      bgColor: "bg-purple-50"
    }
  ];

  // Symptoms data
  const symptoms = [
    { name: "Headache", severity: "mild", selected: false },
    { name: "Fatigue", severity: "moderate", selected: false },
    { name: "Hot Flashes", severity: "severe", selected: false },
    { name: "Nausea", severity: "mild", selected: false },
    { name: "Joint Stiffness", severity: "moderate", selected: false },
    { name: "Sleep Disorder", severity: "severe", selected: false },
    { name: "Appetite Changes", severity: "mild", selected: false },
    { name: "Anxiety", severity: "moderate", selected: false }
  ];

  // Health alerts data
  const healthAlerts = [
    {
      type: "warning",
      title: "Irregular Temperature",
      description: "Your body temperature has been fluctuating above normal range for the past 3 days.",
      time: "2h ago",
      icon: <AlertTriangle className="h-4 w-4" />
    },
    {
      type: "info",
      title: "Medication Reminder",
      description: "It's time to take your evening medication as prescribed by your doctor.",
      time: "30m ago",
      icon: <Clock className="h-4 w-4" />
    },
    {
      type: "success",
      title: "Health Goal Achieved",
      description: "Congratulations! You've maintained healthy BP readings for 7 consecutive days.",
      time: "1d ago",
      icon: <CheckCircle className="h-4 w-4" />
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-pink-200 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Health Monitoring</h1>
          <p className="text-gray-600">Track your vital signs and overall health metrics</p>
        </div>

        {/* Health Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {healthMetrics.map((metric, index) => (
            <Card key={index} className={`${metric.bgColor} border-0 shadow-md hover:shadow-lg transition-shadow`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  {metric.icon}
                  <Badge variant="secondary" className="text-xs">
                    {metric.status}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-gray-800">{metric.value}</p>
                  <p className="text-sm text-gray-600">{metric.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Health Trends Chart */}
          <Card className="lg:col-span-2 shadow-md bg-white">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">Health Trends</CardTitle>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">1W</Button>
                  <Button variant="default" size="sm" className="bg-red-500 hover:bg-red-600">1M</Button>
                  <Button variant="outline" size="sm">3M</Button>
                  <Button variant="outline" size="sm">1Y</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-200">
                <div className="text-center">
                  <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">Health Trends Chart</p>
                  <p className="text-sm text-gray-400 mt-2">Your vital signs trends will appear here</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Vital Entry */}
          <Card className="shadow-md bg-white">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Quick Vital Entry</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="temperature" className="text-sm font-medium text-gray-700">Temperature (°F)</Label>
                <Input id="temperature" placeholder="98.6" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="blood-pressure" className="text-sm font-medium text-gray-700">Blood Pressure</Label>
                <div className="flex space-x-2 mt-1">
                  <Input placeholder="120" />
                  <span className="self-center text-gray-500">/</span>
                  <Input placeholder="80" />
                </div>
              </div>
              <div>
                <Label htmlFor="heart-rate" className="text-sm font-medium text-gray-700">Heart Rate (bpm)</Label>
                <Input id="heart-rate" placeholder="72" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="weight" className="text-sm font-medium text-gray-700">Weight (lbs)</Label>
                <Input id="weight" placeholder="135" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="medication" className="text-sm font-medium text-gray-700">Medication Taken</Label>
                <Input id="medication" placeholder="Aspirin" className="mt-1" />
              </div>
              <Button className="w-full bg-red-500 hover:bg-red-600 text-white font-medium">
                Save Vitals
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Today's Symptoms */}
          <Card className="lg:col-span-2 shadow-md bg-white">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Today's Symptoms</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {symptoms.map((symptom, index) => (
                  <Button
                    key={index}
                    variant={selectedSymptom === symptom.name ? "default" : "outline"}
                    className={`h-auto p-4 flex flex-col items-center space-y-2 ${
                      selectedSymptom === symptom.name 
                        ? 'bg-pink-500 hover:bg-pink-600 text-white border-pink-500' 
                        : 'hover:bg-gray-50 border-gray-200'
                    }`}
                    onClick={() => setSelectedSymptom(selectedSymptom === symptom.name ? '' : symptom.name)}
                  >
                    <Activity className="h-5 w-5" />
                    <div className="text-center">
                      <p className="text-xs font-medium">{symptom.name}</p>
                      <p className="text-xs opacity-75 capitalize">{symptom.severity}</p>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Health Alerts */}
          <Card className="shadow-md bg-white">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Health Alerts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {healthAlerts.map((alert, index) => (
                <Alert key={index} className={`${
                  alert.type === 'warning' ? 'border-orange-200 bg-orange-50' :
                  alert.type === 'info' ? 'border-blue-200 bg-blue-50' :
                  'border-green-200 bg-green-50'
                }`}>
                  <div className="flex items-start space-x-3">
                    <div className={`${
                      alert.type === 'warning' ? 'text-orange-500' :
                      alert.type === 'info' ? 'text-blue-500' :
                      'text-green-500'
                    }`}>
                      {alert.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm font-medium text-gray-900">{alert.title}</h4>
                        <span className="text-xs text-gray-500">{alert.time}</span>
                      </div>
                      <AlertDescription className="text-xs text-gray-600">
                        {alert.description}
                      </AlertDescription>
                    </div>
                  </div>
                </Alert>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HealthMonitoringDashboard;