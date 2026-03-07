import Container from "@/components/shared/container"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Users, Calendar, AlertTriangle, FileText, Bell, Activity } from "lucide-react"

const MidwifeDashboardPage = () => {
  return (
    <Container title="Midwife Dashboard">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold">24</div>
                <div className="text-sm text-muted-foreground">Active Patients</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold">8</div>
                <div className="text-sm text-muted-foreground">Today&apos;s Appointments</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-pink-400">
                <AlertTriangle className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold">3</div>
                <div className="text-sm text-muted-foreground">Health Alerts</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-400">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold">15</div>
                <div className="text-sm text-muted-foreground">Recent Updates</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Today's Appointments */}
          <Card>
            <CardContent className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-lg font-semibold">
                  <Calendar className="h-5 w-5 text-pink-500" />
                  Today&apos;s Appointments
                </h2>
                <Button size="sm" className="bg-pink-500 hover:bg-pink-600 text-white">
                  View All
                </Button>
              </div>

              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <span className="text-sm font-semibold text-pink-500">9:00 AM</span>
                    <div>
                      <div className="font-semibold">Sarah Johnson</div>
                      <div className="text-sm text-muted-foreground">2-week checkup</div>
                    </div>
                  </div>
                  <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">SCHEDULED</Badge>
                </div>

                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <span className="text-sm font-semibold text-pink-500">10:30 AM</span>
                    <div>
                      <div className="font-semibold">Maria Garcia</div>
                      <div className="text-sm text-muted-foreground">First prenatal visit</div>
                    </div>
                  </div>
                  <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">IN PROGRESS</Badge>
                </div>

                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <span className="text-sm font-semibold text-pink-500">1:00 PM</span>
                    <div>
                      <div className="font-semibold">Lisa Chen</div>
                      <div className="text-sm text-muted-foreground">6-week checkup</div>
                    </div>
                  </div>
                  <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">SCHEDULED</Badge>
                </div>

                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <span className="text-sm font-semibold text-pink-500">2:30 PM</span>
                    <div>
                      <div className="font-semibold">Emma Wilson</div>
                      <div className="text-sm text-muted-foreground">Postpartum follow-up</div>
                    </div>
                  </div>
                  <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">SCHEDULED</Badge>
                </div>
              </div>

              <div className="mt-6 flex gap-2">
                <Button className="flex-1 bg-pink-500 hover:bg-pink-600 text-white">Add New Appointment</Button>
                <Button variant="outline" className="flex-1 bg-transparent">
                  View All Appointment
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* AI Health Alerts */}
          <Card>
            <CardContent className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-lg font-semibold">
                  <Bell className="h-5 w-5 text-pink-500" />
                  AI Health Alerts
                </h2>
                <Button size="sm" className="bg-pink-500 hover:bg-pink-600 text-white">
                  View All
                </Button>
              </div>

              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-500">
                    <AlertTriangle className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-red-600">Sarah Johnson</div>
                    <div className="text-sm text-muted-foreground">
                      Blood pressure reading showing consistent elevation (145/90). Monitor for preeclampsia signs.
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">2 hours ago</div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-500">
                    <Activity className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-red-600">Lisa Chen</div>
                    <div className="text-sm text-muted-foreground">
                      Decreased fetal movement reported. Recommend kick count monitoring and immediate assessment.
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">4 hours ago</div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-500">
                    <Activity className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-red-600">Maria Garcia</div>
                    <div className="text-sm text-muted-foreground">
                      Vital statistics improved. Delivered. Monitor for post-delivery complications.
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">6 hours ago</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-2">
                <Button className="flex-1 bg-pink-500 hover:bg-pink-600 text-white">Review Alerts</Button>
                <Button variant="outline" className="flex-1 bg-transparent">
                  Set Alert Rules
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Patient Profiles */}
          <Card>
            <CardContent className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-lg font-semibold">
                  <Users className="h-5 w-5 text-indigo-500" />
                  Recent Patient Profiles
                </h2>
                <Button size="sm" className="bg-pink-500 hover:bg-pink-600 text-white">
                  View All
                </Button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 bg-indigo-500">
                      <AvatarFallback className="bg-indigo-500 text-white">SJ</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold">Sarah Johnson</div>
                      <div className="text-sm text-muted-foreground">Age: 28 • G1P0 • Blood Type: O+</div>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">Last: 2 weeks ago</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 bg-cyan-500">
                      <AvatarFallback className="bg-cyan-500 text-white">MG</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold">Maria Garcia</div>
                      <div className="text-sm text-muted-foreground">Age: 32 • G2P1 • Blood Type: A+</div>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">Last: 1 week ago</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 bg-pink-400">
                      <AvatarFallback className="bg-pink-400 text-white">LC</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold">Lisa Chen</div>
                      <div className="text-sm text-muted-foreground">Age: 25 • G1P0 • Blood Type: B+</div>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">Last: 3 days ago</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 bg-teal-400">
                      <AvatarFallback className="bg-teal-400 text-white">EW</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold">Emma Wilson</div>
                      <div className="text-sm text-muted-foreground">Age: 30 • G3P2 • Blood Type: AB+</div>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">Last: 1 day ago</span>
                </div>
              </div>

              <div className="mt-6 flex gap-2">
                <Button className="flex-1 bg-pink-500 hover:bg-pink-600 text-white">Add New Patient</Button>
                <Button variant="outline" className="flex-1 bg-transparent">
                  View All Profiles
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardContent className="p-6">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                <Activity className="h-5 w-5" />
                Quick Actions
              </h2>

              <div className="space-y-3">
                <Button className="w-full justify-start bg-pink-500 hover:bg-pink-600 text-white">
                  <FileText className="mr-2 h-4 w-4" />
                  Add Clinical Note
                </Button>

                <Button variant="outline" className="w-full justify-start border-gray-200 bg-transparent">
                  <FileText className="mr-2 h-4 w-4" />
                  Generate Report
                </Button>

                <Button variant="outline" className="w-full justify-start border-gray-200 bg-transparent">
                  <Bell className="mr-2 h-4 w-4" />
                  Send Message
                </Button>

                <Button variant="outline" className="w-full justify-start border-gray-200 bg-transparent">
                  <Calendar className="mr-2 h-4 w-4" />
                  Set Reminder
                </Button>

                <Button className="w-full justify-start bg-pink-500 hover:bg-pink-600 text-white">
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Emergency Protocol
                </Button>

                <Button variant="outline" className="w-full justify-start border-gray-200 bg-transparent">
                  <FileText className="mr-2 h-4 w-4" />
                  Help & Support
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Container>
  )
}

export default MidwifeDashboardPage
