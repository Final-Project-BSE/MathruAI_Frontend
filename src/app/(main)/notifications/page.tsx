import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  Clock,
  CheckCircle,
  MoreHorizontal,
  Thermometer,
  Pill,
  Stethoscope,
  MessageSquare,
  Heart,
  FileText,
  Bell,
  Plus,
} from "lucide-react";

interface Reminder {
  id: string;
  type:
    | "temperature"
    | "supplement"
    | "appointment"
    | "prenatal"
    | "hydration"
    | "other";
  title: string;
  subtitle: string;
  time: string;
  isCompleted?: boolean;
  color: string;
  icon: React.ReactNode;
  status: "pending" | "completed" | "missed";
}

interface Notification {
  id: string;
  type: "alert" | "reminder" | "message" | "appointment";
  title: string;
  description: string;
  time: string;
  isRead: boolean;
  priority: "high" | "medium" | "low";
  icon: React.ReactNode;
}

interface ScheduleItem {
  id: string;
  time: string;
  title: string;
  subtitle: string;
  type: "preparation" | "test" | "appointment" | "checkup";
}

const activeReminders: Reminder[] = [
  {
    id: "1",
    type: "temperature",
    title: "Morning Temperature Check",
    subtitle: "Track your basal body temperature",
    time: "Daily at 7:00 AM",
    color: "bg-pink-100 text-pink-600",
    icon: <Thermometer className="w-4 h-4" />,
    status: "pending",
  },
  {
    id: "2",
    type: "supplement",
    title: "Folic Acid Supplement",
    subtitle: "Take during fertility window",
    time: "Daily at 8:00 AM",
    color: "bg-blue-100 text-blue-600",
    icon: <Pill className="w-4 h-4" />,
    status: "pending",
  },
  {
    id: "3",
    type: "appointment",
    title: "Gynecologist Appointment",
    subtitle: "Annual checkup with Dr. Smith",
    time: "Today at 2:30 PM",
    color: "bg-green-100 text-green-600",
    icon: <Stethoscope className="w-4 h-4" />,
    status: "pending",
  },
  {
    id: "4",
    type: "prenatal",
    title: "Prenatal Vitamin",
    subtitle: "Daily prenatal multivitamin",
    time: "Daily at 9:00 AM",
    color: "bg-blue-100 text-blue-600",
    icon: <Pill className="w-4 h-4" />,
    status: "pending",
  },
  {
    id: "5",
    type: "hydration",
    title: "Hydration Check",
    subtitle: "Drink a glass of water",
    time: "Every 2 hours",
    color: "bg-orange-100 text-orange-600",
    icon: <Heart className="w-4 h-4" />,
    status: "completed",
  },
];

const recentNotifications: Notification[] = [
  {
    id: "1",
    type: "alert",
    title: "Fertility Window Alert",
    description:
      "Your peak fertility starts tomorrow. Consider tracking cervical mucus.",
    time: "2h ago",
    isRead: false,
    priority: "high",
    icon: <Bell className="w-4 h-4" />,
  },
  {
    id: "2",
    type: "reminder",
    title: "AI Insights Available",
    description:
      "New personalized insights ready from this week's data. View personalized insights.",
    time: "4h ago",
    isRead: false,
    priority: "medium",
    icon: <FileText className="w-4 h-4" />,
  },
  {
    id: "3",
    type: "message",
    title: "Message from Dr. Garcia",
    description: "Lab results from last visit. Great numbers and overall health.",
    time: "1d ago",
    isRead: true,
    priority: "medium",
    icon: <MessageSquare className="w-4 h-4" />,
  },
  {
    id: "4",
    type: "reminder",
    title: "Medication Reminder",
    description: "Time to take prenatal daily supplements.",
    time: "2d ago",
    isRead: true,
    priority: "low",
    icon: <Pill className="w-4 h-4" />,
  },
  {
    id: "5",
    type: "appointment",
    title: "Weekly Report Ready",
    description: "Your cycle summary for this week is available to view.",
    time: "3d ago",
    isRead: true,
    priority: "low",
    icon: <FileText className="w-4 h-4" />,
  },
];

const todaySchedule: ScheduleItem[] = [
  {
    id: "1",
    time: "7:00 AM - Morning Preparation",
    title: "Morning Preparation",
    subtitle: "Record basal body temperature",
    type: "preparation",
  },
  {
    id: "2",
    time: "9:00 AM - Folic Acid",
    title: "Folic Acid",
    subtitle: "Take folic acid supplement",
    type: "test",
  },
  {
    id: "3",
    time: "2:00 PM - Doctor Appointment",
    title: "Doctor Appointment",
    subtitle: "Annual check up with Dr. Smith",
    type: "appointment",
  },
  {
    id: "4",
    time: "6:00 PM - Prenatal Vitamins",
    title: "Prenatal Vitamins",
    subtitle: "Daily multivitamin",
    type: "checkup",
  },
];

const getPriorityColor = (priority: string, isRead: boolean) => {
  if (isRead) return "text-gray-500";

  switch (priority) {
    case "high":
      return "text-red-600";
    case "medium":
      return "text-blue-600";
    default:
      return "text-gray-600";
  }
};

export default function RemindersNotifications() {
  const filterTabs = ["All", "Cycle", "Medication", "Appointments", "Custom"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-pink-200 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Reminders & Notifications
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="bg-white shadow-lg rounded-2xl">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-pink-500 rounded-lg flex items-center justify-center">
                      <Bell className="w-4 h-4 text-white" />
                    </div>
                    <CardTitle className="text-lg font-semibold text-gray-800">
                      Active Reminders
                    </CardTitle>
                  </div>

                  <Button
                    size="sm"
                    className="bg-pink-500 hover:bg-pink-600 text-white rounded-full px-4"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Reminder
                  </Button>
                </div>

                <div className="flex items-center gap-2 mt-4">
                  {filterTabs.map((tab, index) => (
                    <Button
                      key={tab}
                      variant={index === 0 ? "default" : "outline"}
                      size="sm"
                      className={`rounded-full px-4 py-2 text-xs ${
                        index === 0
                          ? "bg-pink-500 hover:bg-pink-600 text-white"
                          : "border-gray-200 hover:bg-gray-50 text-gray-600"
                      }`}
                    >
                      {tab}
                    </Button>
                  ))}
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                {activeReminders.map((reminder) => (
                  <div
                    key={reminder.id}
                    className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className={`p-3 rounded-full ${reminder.color}`}>
                      {reminder.icon}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm text-gray-900">
                        {reminder.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {reminder.subtitle}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {reminder.time}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {reminder.status === "completed" ? (
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full" />
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            className="h-8 w-8 p-0 bg-green-100 hover:bg-green-200 rounded-full"
                          >
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          </Button>

                          <Button
                            size="sm"
                            className="h-8 w-8 p-0 bg-orange-100 hover:bg-orange-200 rounded-full"
                          >
                            <Clock className="w-4 h-4 text-orange-600" />
                          </Button>

                          <Button
                            size="sm"
                            className="h-8 w-8 p-0 bg-blue-100 hover:bg-blue-200 rounded-full"
                          >
                            <MoreHorizontal className="w-4 h-4 text-blue-600" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="bg-white shadow-lg rounded-2xl">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold">
                    Recent Notifications
                  </CardTitle>

                  <div className="flex gap-2">
                    <Badge
                      variant="outline"
                      className="bg-red-50 text-red-600 border-red-200 text-xs px-2 py-1"
                    >
                      12 unread
                    </Badge>

                    <Badge
                      variant="outline"
                      className="bg-blue-50 text-blue-600 border-blue-200 text-xs px-2 py-1"
                    >
                      47 this week
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                {recentNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 rounded-lg border transition-colors ${
                      notification.isRead
                        ? "border-gray-100 bg-gray-50"
                        : "border-blue-100 bg-blue-50"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <div
                        className={`p-1 rounded-full ${
                          notification.isRead ? "bg-gray-200" : "bg-blue-100"
                        } ${getPriorityColor(
                          notification.priority,
                          notification.isRead
                        )}`}
                      >
                        {notification.icon}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4
                          className={`font-medium text-xs ${
                            notification.isRead
                              ? "text-gray-700"
                              : "text-gray-900"
                          }`}
                        >
                          {notification.title}
                        </h4>

                        <p
                          className={`text-xs mt-1 ${
                            notification.isRead
                              ? "text-gray-500"
                              : "text-gray-700"
                          }`}
                        >
                          {notification.description}
                        </p>

                        <p className="text-xs text-gray-400 mt-1">
                          {notification.time}
                        </p>
                      </div>

                      {!notification.isRead && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-1" />
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        <Card className="bg-white shadow-lg rounded-2xl">
          <CardContent className="p-0">
            <Tabs defaultValue="schedule" className="w-full">
              <div className="border-b px-6 pt-6">
                <TabsList className="grid w-full max-w-md grid-cols-3 bg-gray-100">
                  <TabsTrigger
                    value="schedule"
                    className="data-[state=active]:bg-white data-[state=active]:text-pink-600"
                  >
                    Reminder Schedule
                  </TabsTrigger>

                  <TabsTrigger
                    value="history"
                    className="data-[state=active]:bg-white data-[state=active]:text-pink-600"
                  >
                    Notification History
                  </TabsTrigger>

                  <TabsTrigger
                    value="settings"
                    className="data-[state=active]:bg-white data-[state=active]:text-pink-600"
                  >
                    Notification Settings
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="schedule" className="p-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    Today&apos;s Schedule
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {todaySchedule.map((item) => (
                      <Card
                        key={item.id}
                        className="border border-gray-200 hover:shadow-md transition-shadow"
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <span className="text-xs font-medium text-gray-900">
                              {item.time.split(" - ")[0]}
                            </span>
                          </div>

                          <h4 className="font-semibold text-sm text-gray-900 mb-1">
                            {item.title}
                          </h4>

                          <p className="text-xs text-gray-600">
                            {item.subtitle}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="history" className="p-6">
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Notification History
                  </h3>
                  <p className="text-sm text-gray-600 max-w-md mx-auto">
                    View your complete notification timeline and archive. Track
                    all past reminders and notifications.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="settings" className="p-6">
                <div className="text-center py-12">
                  <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Notification Preferences
                  </h3>
                  <p className="text-sm text-gray-600 max-w-md mx-auto">
                    Customize your reminder and notification settings. Control
                    when and how you receive alerts.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}