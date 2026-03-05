"use client"

import Container from "@/components/shared/container"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import Link from "next/link"
import { useState } from "react"
import { RoleGuard } from "@/components/auth/RoleGuard"
import { ROLES } from "@/lib/roleConfig"
import { useNavigation } from "react-day-picker"
import { useRouter } from "next/navigation"
import { UpdateDataPopup } from "@/components/update-data-popup"
import DashboardTopBar from "./components/DashboardTopBar"
import { useCycleStats } from "@/hooks/useCycleStats";
import HealthStatusSum from "./components/HealthStatusSum"


export default function ReproductivePage() {
  const [checkedItems, setCheckedItems] = useState<string[]>([])
  const [isPopupOpen, setIsPopupOpen] = useState(false)

  const { loading, error, stats } = useCycleStats();

  const router = useRouter();

  const handleCheckboxChange = (id: string, checked: boolean) => {
    if (checked) {
      setCheckedItems((prev) => [...prev, id])
    } else {
      setCheckedItems((prev) => prev.filter((item) => item !== id))
    }
  }

  return (
    <Container title="Reproductive Planning Dashboard">
      <div className="bg-gradient-to-br from-pink-100 to-pink-200 min-h-screen p-4 md:p-6">
        <DashboardTopBar
          info={{ title: "Reproductive Planning Dashboard", subtitle: "Current Cycle Day", ultsubtitle: "Your cycle is looking healthy!" }}
          stats={stats}
        />
        <div className="grid grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">

          <HealthStatusSum />
          {/* Fertility & Ovulation Tracker */}
          <Card className="bg-white/90 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-pink-600 flex items-center justify-between text-sm md:text-base">
                <span className="flex items-center gap-2">
                  Fertility & Ovulation Tracker
                </span>
                <Link href="/dashboard/reproductive/cycle-tracker">
                  <Button variant="ghost" size="sm" className="text-xs">
                    View Details
                  </Button>
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="bg-pink-100 p-2 md:p-3 rounded-lg text-center">
                    <div className="text-sm font-medium">Menstrual</div>
                    <div className="text-xs text-gray-600">Days 1-5</div>
                  </div>
                  <div className="bg-blue-100 p-2 md:p-3 rounded-lg text-center">
                    <div className="text-sm font-medium">Fertility</div>
                    <div className="text-xs text-gray-600">Days 10-16</div>
                  </div>
                  <div className="bg-purple-100 p-2 md:p-3 rounded-lg text-center">
                    <div className="text-sm font-medium">Luteal</div>
                    <div className="text-xs text-gray-600">Days 17-28</div>
                  </div>
                </div>
                <div className="bg-orange-100 p-3 md:p-4 rounded-lg">
                  <div className="font-medium text-sm">Next Ovulation</div>
                  <div className="text-xs text-gray-600">Day 14</div>
                  <div className="text-lg font-bold">July 28, 2025</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Health Announcements */}
          <Card className="bg-white/90 backdrop-blur md:col-span-2 lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-pink-600 flex items-center gap-2 text-sm md:text-base">
                Health Announcements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-l-4 border-pink-300 pl-4">
                <h4 className="font-medium text-sm">How Sleep Affects Your Fertility</h4>
                <p className="text-xs text-gray-600">Quality sleep plays a crucial role in reproductive health...</p>
              </div>
              <div className="border-l-4 border-pink-300 pl-4">
                <h4 className="font-medium text-sm">Nutrition Tips for Conception</h4>
                <p className="text-xs text-gray-600">Learn about fertility-boosting foods and supplements...</p>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Reminders */}
          <Card className="bg-white/90 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-pink-600 flex items-center gap-2 text-sm md:text-base">
                Upcoming Reminders
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                <div>
                  <div className="font-medium text-sm">July 22</div>
                  <div className="text-xs text-gray-600">Gynecologist Visit</div>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                  Booked
                </Badge>
              </div>
              <div className="flex justify-between items-center p-2 bg-yellow-50 rounded">
                <div>
                  <div className="font-medium text-sm">July 25</div>
                  <div className="text-xs text-gray-600">Midwife Consultation</div>
                </div>
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 text-xs">
                  Pending
                </Badge>
              </div>
              <div className="flex justify-between items-center p-2 bg-red-50 rounded">
                <div>
                  <div className="font-medium text-sm">Aug 1</div>
                  <div className="text-xs text-gray-600">Blood Test</div>
                </div>
                <Badge variant="secondary" className="bg-red-100 text-red-700 text-xs">
                  Urgent
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Midwife Connectivity */}
          <Card className="bg-white/90 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-pink-600 flex items-center gap-2 text-sm md:text-base">
                Midwife Connectivity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10 md:w-12 md:h-12">
                    <AvatarFallback className="bg-pink-500 text-white">SM</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-sm">Sarah Mitchell, CNM</div>
                    <div className="text-xs text-gray-600">Online • Last seen 2 min ago</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" className="bg-pink-500 hover:bg-pink-600 text-white flex-1 text-xs">
                    Send Data
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 bg-transparent text-xs">
                    Ask Question
                  </Button>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="text-xs font-medium">Auto-Alert: Health data automatically shared with care team</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <UpdateDataPopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
      />
    </Container>
  )
}
