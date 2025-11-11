import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Search, 
  MessageSquare, 
  Calendar, 
  Star,
  Video,
  Phone,
  MapPin,
  Clock,
  Users,
  TrendingUp,
  Heart
} from 'lucide-react';

interface Midwife {
  id: string;
  name: string;
  title: string;
  experience: string;
  rating: number;
  specialization: string;
  availability: 'available' | 'busy' | 'offline';
  avatar?: string;
  location?: string;
}

interface Appointment {
  id: string;
  midwifeName: string;
  date: string;
  time: string;
  type: 'consultation' | 'checkup' | 'emergency';
  status: 'confirmed' | 'pending' | 'completed';
}

interface ConnectionStats {
  totalConsultations: number;
  thisMonth: number;
  thisWeek: number;
  averageRating: number;
}

interface Message {
  id: string;
  content: string;
  timeAgo: string;
  isRead: boolean;
}

const availableMidwives: Midwife[] = [
  {
    id: '1',
    name: 'Dr. Rachel Morgan',
    title: 'Certified Nurse Midwife',
    experience: '7+ years exp',
    rating: 4.9,
    specialization: 'Prenatal Care',
    availability: 'available',
    location: 'Downtown Clinic'
  },
  {
    id: '2',
    name: 'Mary Smith',
    title: 'Licensed Midwife',
    experience: '5+ years exp',
    rating: 4.7,
    specialization: 'Birth Support',
    availability: 'busy',
    location: 'Women\'s Health Center'
  },
  {
    id: '3',
    name: 'Dr. Jennifer Wilson',
    title: 'Certified Nurse Midwife',
    experience: '10+ years exp',
    rating: 4.8,
    specialization: 'High-Risk Pregnancies',
    availability: 'available',
    location: 'Regional Medical Center'
  },
  {
    id: '4',
    name: 'Lisa Brown',
    title: 'Licensed Midwife',
    experience: '6+ years exp',
    rating: 4.6,
    specialization: 'Home Birth',
    availability: 'offline',
    location: 'Private Practice'
  }
];

const upcomingAppointments: Appointment[] = [
  {
    id: '1',
    midwifeName: 'Dr. Rachel Morgan',
    date: 'Today, 3:00 PM',
    time: '3:00 PM',
    type: 'consultation',
    status: 'confirmed'
  },
  {
    id: '2',
    midwifeName: 'Mary Smith',
    date: 'Tomorrow, 10:30 AM',
    time: '10:30 AM',
    type: 'checkup',
    status: 'confirmed'
  },
  {
    id: '3',
    midwifeName: 'Dr. Jennifer Wilson',
    date: 'Wed, 2:15 PM',
    time: '2:15 PM',
    type: 'consultation',
    status: 'pending'
  }
];

const connectionStats: ConnectionStats = {
  totalConsultations: 24,
  thisMonth: 2,
  thisWeek: 3,
  averageRating: 4.8
};

const recentMessages: Message[] = [
  {
    id: '1',
    content: 'Your latest test results look great! Continue with your current supplement routine.',
    timeAgo: '2 hours ago',
    isRead: false
  },
  {
    id: '2',
    content: 'Don\'t forget to track your symptoms this week. Let me know if you have any concerns.',
    timeAgo: '1 day ago',
    isRead: true
  }
];

const getAvailabilityColor = (availability: string) => {
  switch (availability) {
    case 'available':
      return 'bg-green-100 text-green-700 border-green-200';
    case 'busy':
      return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    case 'offline':
      return 'bg-gray-100 text-gray-700 border-gray-200';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

const getAppointmentTypeColor = (type: string) => {
  switch (type) {
    case 'consultation':
      return 'bg-blue-100 text-blue-700';
    case 'checkup':
      return 'bg-green-100 text-green-700';
    case 'emergency':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

const getAppointmentStatusColor = (status: string) => {
  switch (status) {
    case 'confirmed':
      return 'bg-green-500';
    case 'pending':
      return 'bg-yellow-500';
    case 'completed':
      return 'bg-blue-500';
    default:
      return 'bg-gray-500';
  }
};

export default function MidwifeConnection() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-pink-200 w-full max-w-full space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">Midwife Connection</h1>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Available Midwives */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <div className="p-2 bg-pink-100 rounded-full">
                  <Users className="w-4 h-4 text-pink-600" />
                </div>
                Available Midwives
              </CardTitle>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input 
                placeholder="Search Midwives..." 
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {availableMidwives.map((midwife) => (
              <div key={midwife.id} className="flex items-center gap-4 p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={midwife.avatar} alt={midwife.name} />
                  <AvatarFallback className="bg-pink-100 text-pink-600 font-semibold">
                    {midwife.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900 text-sm">{midwife.name}</h3>
                    <span className="text-gray-500 text-xs">#{midwife.id.padStart(4, '000')}</span>
                  </div>
                  <p className="text-xs text-gray-600 mb-1">{midwife.title} • {midwife.experience}</p>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs text-gray-600">{midwife.rating}</span>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getAvailabilityColor(midwife.availability)}`}
                    >
                      {midwife.availability}
                    </Badge>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <div className={`w-3 h-3 rounded-full ${
                    midwife.availability === 'available' ? 'bg-green-500' : 
                    midwife.availability === 'busy' ? 'bg-yellow-500' : 'bg-gray-400'
                  }`} />
                </div>
              </div>
            ))}
            
            <Button className="w-full bg-pink-500 hover:bg-pink-600 text-white">
              Request Consultation
            </Button>
          </CardContent>
        </Card>

        {/* Upcoming Appointments */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <div className="p-2 bg-blue-100 rounded-full">
                <Calendar className="w-4 h-4 text-blue-600" />
              </div>
              Upcoming Appointments
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingAppointments.map((appointment) => (
              <div key={appointment.id} className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg">
                <div className={`w-3 h-3 rounded-full ${getAppointmentStatusColor(appointment.status)}`} />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-sm text-gray-900">{appointment.date}</h4>
                    <Badge 
                      className={`text-xs ${getAppointmentTypeColor(appointment.type)}`}
                      variant="secondary"
                    >
                      {appointment.type}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600">{appointment.midwifeName}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <Button size="sm" className="h-6 px-3 text-xs bg-green-500 hover:bg-green-600">
                      Join
                    </Button>
                    <Button size="sm" variant="outline" className="h-6 px-3 text-xs">
                      View
                    </Button>
                    <Button size="sm" variant="outline" className="h-6 px-3 text-xs">
                      Reschedule
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            
            <Button variant="outline" className="w-full text-pink-600 border-pink-200 hover:bg-pink-50">
              Schedule New Appointment
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Connection Statistics */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <div className="p-2 bg-green-100 rounded-full">
                <TrendingUp className="w-4 h-4 text-green-600" />
              </div>
              Connection Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-pink-600">{connectionStats.totalConsultations}</div>
                <div className="text-xs text-gray-600">Total Consultations</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">{connectionStats.thisMonth}</div>
                <div className="text-xs text-gray-600">This Month</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{connectionStats.thisWeek}</div>
                <div className="text-xs text-gray-600">This Week</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-600">{connectionStats.averageRating}</div>
                <div className="text-xs text-gray-600">Average Rating</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Messages */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <div className="p-2 bg-purple-100 rounded-full">
                <MessageSquare className="w-4 h-4 text-purple-600" />
              </div>
              Recent Messages
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentMessages.map((message) => (
              <div key={message.id} className={`p-3 rounded-lg border transition-colors ${
                message.isRead ? 'border-gray-100 bg-gray-50' : 'border-blue-100 bg-blue-50'
              }`}>
                <div className="flex items-start justify-between gap-2">
                  <p className={`text-sm leading-relaxed ${
                    message.isRead ? 'text-gray-700' : 'text-gray-900 font-medium'
                  }`}>
                    {message.content}
                  </p>
                  {!message.isRead && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                  )}
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-500">{message.timeAgo}</span>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" className="h-6 px-2 text-xs">
                      Reply
                    </Button>
                    <Button size="sm" variant="ghost" className="h-6 px-2 text-xs">
                      Archive
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            
            <Button variant="outline" className="w-full text-sm">
              <MessageSquare className="w-4 h-4 mr-2" />
              View All Messages
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}