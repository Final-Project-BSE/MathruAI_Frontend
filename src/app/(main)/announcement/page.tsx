import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, AlertTriangle, BookOpen, Settings, Users } from 'lucide-react';

interface Announcement {
  id: string;
  title: string;
  description: string;
  priority: 'HIGH PRIORITY' | 'INFO' | 'WARNING' | 'COMPLETED';
  timeAgo: string;
  icon: React.ReactNode;
}

const announcements: Announcement[] = [
  {
    id: '1',
    title: 'Urgent: Contraceptive Stock Update',
    description: 'Critical stock shortage identified for Desomt implant. Inventory will affect patient care and treatment protocols. Please coordinate through your partner clinics.',
    priority: 'HIGH PRIORITY',
    timeAgo: '17 hours ago',
    icon: <AlertTriangle className="w-5 h-5" />
  },
  {
    id: '2',
    title: 'New Fertility Tracking Protocol Released',
    description: 'Updated guidelines for fertility monitoring and patient counseling are now available in our resource library. Schedule staff at locations tracking features.',
    priority: 'INFO',
    timeAgo: '1 day ago',
    icon: <BookOpen className="w-5 h-5" />
  },
  {
    id: '3',
    title: 'Mandatory Training: Sexual Health Education',
    description: 'Required training session scheduled for next Thursday at 2:00 PM. Please confirm your attendance by Friday to secure your spot.',
    priority: 'WARNING',
    timeAgo: '2 days ago',
    icon: <Users className="w-5 h-5" />
  },
  {
    id: '4',
    title: 'System Maintenance Completed Successfully',
    description: 'Planned server maintenance has been completed. All features including cycle tracking and AI recommendations are fully operational.',
    priority: 'COMPLETED',
    timeAgo: '3 days ago',
    icon: <Settings className="w-5 h-5" />
  },
  {
    id: '5',
    title: 'Q3 Patient Satisfaction Survey Results',
    description: 'Quarterly patient satisfaction survey results are now available for review in your dashboard analytics section. Overall satisfaction: 94.2%',
    priority: 'INFO',
    timeAgo: '1 week ago',
    icon: <Clock className="w-5 h-5" />
  }
];

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'HIGH PRIORITY':
      return 'bg-red-100 text-red-700 border-red-200';
    case 'WARNING':
      return 'bg-orange-100 text-orange-700 border-orange-200';
    case 'INFO':
      return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'COMPLETED':
      return 'bg-green-100 text-green-700 border-green-200';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

const getIconColor = (priority: string) => {
  switch (priority) {
    case 'HIGH PRIORITY':
      return 'text-red-500';
    case 'WARNING':
      return 'text-orange-500';
    case 'INFO':
      return 'text-blue-500';
    case 'COMPLETED':
      return 'text-green-500';
    default:
      return 'text-gray-500';
  }
};

export default function Announcements() {
  return (
    <div className="w-full max-w-full">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-gray-800">
            Announcements
          </CardTitle>
          <p className="text-sm text-gray-600">
            Stay informed with the latest updates and announcements
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {announcements.map((announcement) => (
            <Card key={announcement.id} className="border border-gray-200 hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-full ${getIconColor(announcement.priority)}`}>
                    {announcement.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900 text-sm">
                        {announcement.title}
                      </h3>
                      <Badge 
                        variant="outline" 
                        className={`text-xs font-medium whitespace-nowrap ${getPriorityColor(announcement.priority)}`}
                      >
                        {announcement.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                      {announcement.description}
                    </p>
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock className="w-3 h-3 mr-1" />
                      {announcement.timeAgo}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}