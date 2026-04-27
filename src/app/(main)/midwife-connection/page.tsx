"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LoadingState } from "@/components/common/LoadingState";
import {
  Search,
  MessageSquare,
  Calendar,
  Star,
  Users,
  TrendingUp,
} from "lucide-react";

interface Midwife {
  id: string;
  name: string;
  title: string;
  experience: string;
  rating: number;
  specialization: string;
  availability: "available" | "busy" | "offline";
  avatar?: string;
  location?: string;
}

interface Appointment {
  id: string;
  midwifeName: string;
  date: string;
  time: string;
  type: "consultation" | "checkup" | "emergency";
  status: "confirmed" | "pending" | "completed";
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
    id: "1",
    name: "Dr. Rachel Morgan",
    title: "Certified Nurse Midwife",
    experience: "7+ years exp",
    rating: 4.9,
    specialization: "Prenatal Care",
    availability: "available",
    location: "Downtown Clinic",
  },
  {
    id: "2",
    name: "Mary Smith",
    title: "Licensed Midwife",
    experience: "5+ years exp",
    rating: 4.7,
    specialization: "Birth Support",
    availability: "busy",
    location: "Women's Health Center",
  },
  {
    id: "3",
    name: "Dr. Jennifer Wilson",
    title: "Certified Nurse Midwife",
    experience: "10+ years exp",
    rating: 4.8,
    specialization: "High-Risk Pregnancies",
    availability: "available",
    location: "Regional Medical Center",
  },
  {
    id: "4",
    name: "Lisa Brown",
    title: "Licensed Midwife",
    experience: "6+ years exp",
    rating: 4.6,
    specialization: "Home Birth",
    availability: "offline",
    location: "Private Practice",
  },
];

const upcomingAppointments: Appointment[] = [
  {
    id: "1",
    midwifeName: "Dr. Rachel Morgan",
    date: "Today, 3:00 PM",
    time: "3:00 PM",
    type: "consultation",
    status: "confirmed",
  },
  {
    id: "2",
    midwifeName: "Mary Smith",
    date: "Tomorrow, 10:30 AM",
    time: "10:30 AM",
    type: "checkup",
    status: "confirmed",
  },
  {
    id: "3",
    midwifeName: "Dr. Jennifer Wilson",
    date: "Wed, 2:15 PM",
    time: "2:15 PM",
    type: "consultation",
    status: "pending",
  },
];

const connectionStats: ConnectionStats = {
  totalConsultations: 24,
  thisMonth: 2,
  thisWeek: 3,
  averageRating: 4.8,
};

const recentMessages: Message[] = [
  {
    id: "1",
    content:
      "Your latest test results look great! Continue with your current supplement routine.",
    timeAgo: "2 hours ago",
    isRead: false,
  },
  {
    id: "2",
    content:
      "Don't forget to track your symptoms this week. Let me know if you have any concerns.",
    timeAgo: "1 day ago",
    isRead: true,
  },
];

const getAvailabilityColor = (availability: string) => {
  switch (availability) {
    case "available":
      return "bg-green-100 text-green-700 border-green-200";
    case "busy":
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    case "offline":
      return "bg-gray-100 text-gray-700 border-gray-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
};

const getAppointmentTypeColor = (type: string) => {
  switch (type) {
    case "consultation":
      return "bg-blue-100 text-blue-700";
    case "checkup":
      return "bg-green-100 text-green-700";
    case "emergency":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const getAppointmentStatusColor = (status: string) => {
  switch (status) {
    case "confirmed":
      return "bg-green-500";
    case "pending":
      return "bg-yellow-500";
    case "completed":
      return "bg-blue-500";
    default:
      return "bg-gray-500";
  }
};

export default function MidwifeConnection() {
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setLoadingData(false);
    }, 1200);

    return () => window.clearTimeout(timer);
  }, []);

  if (loadingData) {
    return (
      <div className="min-h-screen bg-[#fcd4cd]">
        <LoadingState />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcd4cd] px-4 py-6 md:px-6 md:py-8 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-[32px] bg-white/40 p-4 shadow-[0_20px_70px_rgba(0,0,0,0.06)] backdrop-blur-sm md:p-6 lg:p-8">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-800">
              Midwife Connection
            </h1>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                    <div className="rounded-full bg-pink-100 p-2">
                      <Users className="h-4 w-4 text-pink-600" />
                    </div>
                    Available Midwives
                  </CardTitle>
                </div>

                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input placeholder="Search Midwives..." className="pl-10" />
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {availableMidwives.map((midwife) => (
                  <div
                    key={midwife.id}
                    className="flex items-center gap-4 rounded-lg border border-gray-100 p-4 transition-colors hover:bg-gray-50"
                  >
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={midwife.avatar} alt={midwife.name} />
                      <AvatarFallback className="bg-pink-100 font-semibold text-pink-600">
                        {midwife.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-gray-900">
                          {midwife.name}
                        </h3>
                        <span className="text-xs text-gray-500">
                          #{midwife.id.padStart(4, "000")}
                        </span>
                      </div>

                      <p className="mb-1 text-xs text-gray-600">
                        {midwife.title} • {midwife.experience}
                      </p>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs text-gray-600">
                            {midwife.rating}
                          </span>
                        </div>

                        <Badge
                          variant="outline"
                          className={`text-xs ${getAvailabilityColor(
                            midwife.availability
                          )}`}
                        >
                          {midwife.availability}
                        </Badge>
                      </div>
                    </div>

                    <div
                      className={`h-3 w-3 rounded-full ${
                        midwife.availability === "available"
                          ? "bg-green-500"
                          : midwife.availability === "busy"
                          ? "bg-yellow-500"
                          : "bg-gray-400"
                      }`}
                    />
                  </div>
                ))}

                <Button className="w-full bg-pink-500 text-white hover:bg-pink-600">
                  Request Consultation
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <div className="rounded-full bg-blue-100 p-2">
                    <Calendar className="h-4 w-4 text-blue-600" />
                  </div>
                  Upcoming Appointments
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                {upcomingAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex items-center gap-3 rounded-lg border border-gray-100 p-3"
                  >
                    <div
                      className={`h-3 w-3 rounded-full ${getAppointmentStatusColor(
                        appointment.status
                      )}`}
                    />

                    <div className="flex-1">
                      <div className="mb-1 flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-gray-900">
                          {appointment.date}
                        </h4>

                        <Badge
                          className={`text-xs ${getAppointmentTypeColor(
                            appointment.type
                          )}`}
                          variant="secondary"
                        >
                          {appointment.type}
                        </Badge>
                      </div>

                      <p className="text-xs text-gray-600">
                        {appointment.midwifeName}
                      </p>

                      <div className="mt-2 flex items-center gap-4">
                        <Button
                          size="sm"
                          className="h-6 bg-green-500 px-3 text-xs hover:bg-green-600"
                        >
                          Join
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-6 px-3 text-xs"
                        >
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-6 px-3 text-xs"
                        >
                          Reschedule
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}

                <Button
                  variant="outline"
                  className="w-full border-pink-200 text-pink-600 hover:bg-pink-50"
                >
                  Schedule New Appointment
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <div className="rounded-full bg-green-100 p-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  </div>
                  Connection Statistics
                </CardTitle>
              </CardHeader>

              <CardContent>
                <div className="grid grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-pink-600">
                      {connectionStats.totalConsultations}
                    </div>
                    <div className="text-xs text-gray-600">
                      Total Consultations
                    </div>
                  </div>

                  <div>
                    <div className="text-2xl font-bold text-blue-600">
                      {connectionStats.thisMonth}
                    </div>
                    <div className="text-xs text-gray-600">This Month</div>
                  </div>

                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      {connectionStats.thisWeek}
                    </div>
                    <div className="text-xs text-gray-600">This Week</div>
                  </div>

                  <div>
                    <div className="text-2xl font-bold text-yellow-600">
                      {connectionStats.averageRating}
                    </div>
                    <div className="text-xs text-gray-600">Average Rating</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <div className="rounded-full bg-purple-100 p-2">
                    <MessageSquare className="h-4 w-4 text-purple-600" />
                  </div>
                  Recent Messages
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                {recentMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`rounded-lg border p-3 transition-colors ${
                      message.isRead
                        ? "border-gray-100 bg-gray-50"
                        : "border-blue-100 bg-blue-50"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p
                        className={`text-sm leading-relaxed ${
                          message.isRead
                            ? "text-gray-700"
                            : "font-medium text-gray-900"
                        }`}
                      >
                        {message.content}
                      </p>

                      {!message.isRead && (
                        <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-blue-500" />
                      )}
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {message.timeAgo}
                      </span>

                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 px-2 text-xs"
                        >
                          Reply
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 px-2 text-xs"
                        >
                          Archive
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}

                <Button variant="outline" className="w-full text-sm">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  View All Messages
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}