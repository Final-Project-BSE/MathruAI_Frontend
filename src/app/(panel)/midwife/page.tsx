import Container from "@/components/shared/container"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Bell,
  CalendarDays,
  ClipboardList,
  FileText,
  HeartPulse,
  Home,
  MessageSquare,
  PhoneCall,
  Plus,
  ShieldAlert,
  Stethoscope,
  TrendingUp,
  TriangleAlert,
  UserPlus,
  Users,
  Video,
} from "lucide-react"
import Navbar from "./components/Navbar"
import TopBar from "./dashboard/TopBar"
import WelcomeHeaderCard from "./dashboard/WelcomeHeaderCard"

const stats = [
  {
    title: "Patients Under Care",
    value: "1,184",
    subtitle: "Active ANC/PNC cases",
    icon: Users,
    color: "from-emerald-500/20 to-emerald-400/5",
    iconColor: "text-emerald-400",
    border: "border-emerald-500/20",
  },
  {
    title: "Today’s Appointments",
    value: "26",
    subtitle: "8 tele-consults, 18 visits",
    icon: CalendarDays,
    color: "from-cyan-500/20 to-cyan-400/5",
    iconColor: "text-cyan-400",
    border: "border-cyan-500/20",
  },
  {
    title: "High-Risk Mothers",
    value: "34",
    subtitle: "Require close monitoring",
    icon: ShieldAlert,
    color: "from-amber-500/20 to-amber-400/5",
    iconColor: "text-amber-400",
    border: "border-amber-500/20",
  },
  {
    title: "Alerts Requiring Action",
    value: "12",
    subtitle: "Missed visits, danger signs",
    icon: TriangleAlert,
    color: "from-rose-500/20 to-rose-400/5",
    iconColor: "text-rose-400",
    border: "border-rose-500/20",
  },
]

const quickStats = [
  { label: "New pregnancies registered", value: 18 },
  { label: "Home visits due", value: 9 },
  { label: "Missed visits", value: 7 },
  { label: "Mothers near delivery date", value: 14 },
  { label: "Postnatal visits due", value: 11 },
  { label: "Newborn follow-ups due", value: 16 },
]

const todaysAppointments = [
  {
    name: "Nadeesha Perera",
    time: "08:30 AM",
    type: "ANC Visit",
    mode: "In clinic",
    status: "Confirmed",
  },
  {
    name: "Fathima Niyas",
    time: "10:00 AM",
    type: "Video consultation",
    mode: "Remote",
    status: "Pending",
  },
  {
    name: "Shalini Fernando",
    time: "11:15 AM",
    type: "Postnatal follow-up",
    mode: "Home visit",
    status: "High-risk",
  },
  {
    name: "Amara Silva",
    time: "02:00 PM",
    type: "New pregnancy intake",
    mode: "In clinic",
    status: "Confirmed",
  },
]

const highRiskMothers = [
  {
    name: "S. Jayawardena",
    issue: "Elevated BP / possible preeclampsia",
    week: "32 weeks",
    action: "Review today",
    level: "Critical",
  },
  {
    name: "M. Kareem",
    issue: "Reduced fetal movement reported",
    week: "35 weeks",
    action: "Call immediately",
    level: "High",
  },
  {
    name: "R. Fernando",
    issue: "Gestational diabetes follow-up overdue",
    week: "29 weeks",
    action: "Schedule review",
    level: "Medium",
  },
  {
    name: "T. Peris",
    issue: "Previous C-section, near delivery",
    week: "37 weeks",
    action: "Referral review",
    level: "High",
  },
]

const alerts = [
  {
    title: "Missed ANC visit alert",
    desc: "7 mothers have missed scheduled ANC visits in the last 48 hours.",
    time: "12 min ago",
    tone: "rose",
  },
  {
    title: "Danger sign escalation",
    desc: "2 cases reported severe headache + swelling. Immediate follow-up needed.",
    time: "28 min ago",
    tone: "amber",
  },
  {
    title: "Referral pending confirmation",
    desc: "3 referrals to obstetric unit have not been acknowledged yet.",
    time: "1 hour ago",
    tone: "cyan",
  },
  {
    title: "Postnatal follow-up overdue",
    desc: "5 postnatal mothers crossed follow-up target date.",
    time: "2 hours ago",
    tone: "emerald",
  },
]

const homeVisits = [
  { area: "Kaduwela East", count: 4, distance: "12 km", priority: "High" },
  { area: "Malabe North", count: 3, distance: "8 km", priority: "Medium" },
  { area: "Battaramulla", count: 2, distance: "6 km", priority: "Low" },
]

const modules = [
  { icon: Users, label: "Patient profiles" },
  { icon: MessageSquare, label: "Secure messaging" },
  { icon: Video, label: "Video consultation" },
  { icon: PhoneCall, label: "Audio consultation" },
  { icon: CalendarDays, label: "Appointment scheduling" },
  { icon: Bell, label: "Follow-up reminders" },
  { icon: Home, label: "Home visit planning" },
  { icon: FileText, label: "Case notes & care updates" },
  { icon: Stethoscope, label: "Referral management" },
  { icon: TriangleAlert, label: "Emergency escalation" },
  { icon: ClipboardList, label: "ANC/PNC checklists" },
  { icon: TrendingUp, label: "Reporting & analytics" },
]

function StatusBadge({ status }) {
  const map = {
    Confirmed: "bg-emerald-500/15 text-emerald-300 border-emerald-500/20",
    Pending: "bg-amber-500/15 text-amber-300 border-amber-500/20",
    "High-risk": "bg-rose-500/15 text-rose-300 border-rose-500/20",
    Critical: "bg-rose-500/15 text-rose-300 border-rose-500/20",
    High: "bg-amber-500/15 text-amber-300 border-amber-500/20",
    Medium: "bg-cyan-500/15 text-cyan-300 border-cyan-500/20",
    Low: "bg-emerald-500/15 text-emerald-300 border-emerald-500/20",
  }

  return (
    <Badge
      className={`border px-2.5 py-1 text-[11px] font-medium ${map[status] || "bg-slate-500/15 text-slate-300 border-slate-500/20"}`}
    >
      {status}
    </Badge>
  )
}

function ToneDot({ tone = "emerald" }) {
  const map = {
    rose: "bg-rose-400",
    amber: "bg-amber-400",
    cyan: "bg-cyan-400",
    emerald: "bg-emerald-400",
  }

  return <span className={`mt-1.5 h-2.5 w-2.5 rounded-full ${map[tone]}`} />
}

export default function MidwifeDashboardPage() {
  return (
      <div className="min-h-screen bg-[#000000] text-white">
        <div className="">
          <Navbar />
          <WelcomeHeaderCard />
          <TopBar />
          {/* Top summary */}
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {stats.map((item) => {
              const Icon = item.icon
              return (
                <Card
                  key={item.title}
                  className={`overflow-hidden border ${item.border} bg-gradient-to-br ${item.color} bg-[#111827] shadow-[0_0_0_1px_rgba(255,255,255,0.02)]`}
                >
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-slate-400">{item.title}</p>
                        <h3 className="mt-2 text-3xl font-semibold tracking-tight">{item.value}</h3>
                        <p className="mt-1 text-xs text-slate-500">{item.subtitle}</p>
                      </div>
                      <div className="rounded-2xl border border-white/5 bg-black/20 p-3">
                        <Icon className={`h-5 w-5 ${item.iconColor}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Main grid */}
          <div className="grid gap-6 xl:grid-cols-12">
            {/* Left content */}
            <div className="space-y-6 xl:col-span-8">
              <Card className="border-white/10 bg-[#0f172a]">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div>
                    <CardTitle className="text-lg text-white">Population Health Snapshot</CardTitle>
                    <p className="mt-1 text-sm text-slate-400">
                      Quick view of the area assigned to this midwife
                    </p>
                  </div>
                  <Button className="bg-emerald-500 text-black hover:bg-emerald-400">
                    <TrendingUp className="mr-2 h-4 w-4" />
                    View Analytics
                  </Button>
                </CardHeader>

                <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {quickStats.map((stat, i) => (
                    <div
                      key={stat.label}
                      className="rounded-2xl border border-white/8 bg-white/[0.03] p-4"
                    >
                      <div className="flex items-center justify-between">
                        <p className="max-w-[80%] text-sm text-slate-400">{stat.label}</p>
                        <span className="text-[10px] text-slate-500">#{i + 1}</span>
                      </div>
                      <div className="mt-4 flex items-end justify-between gap-3">
                        <span className="text-2xl font-semibold text-white">{stat.value}</span>
                        <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-800">
                          <div
                            className="h-full rounded-full bg-emerald-400"
                            style={{ width: `${Math.min(stat.value * 5, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <div className="grid gap-6 lg:grid-cols-2">
                <Card className="border-white/10 bg-[#0f172a]">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div>
                      <CardTitle className="text-lg text-white">Today’s Appointments</CardTitle>
                      <p className="mt-1 text-sm text-slate-400">
                        Clinic, remote, and home visit schedule
                      </p>
                    </div>
                    <Button variant="outline" className="border-white/10 bg-white/5 text-white hover:bg-white/10">
                      <Plus className="mr-2 h-4 w-4" />
                      Add
                    </Button>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    {todaysAppointments.map((item) => (
                      <div
                        key={`${item.name}-${item.time}`}
                        className="rounded-2xl border border-white/8 bg-white/[0.03] p-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm text-emerald-400">{item.time}</p>
                            <h4 className="mt-1 font-medium text-white">{item.name}</h4>
                            <p className="text-sm text-slate-400">{item.type}</p>
                            <p className="mt-1 text-xs text-slate-500">{item.mode}</p>
                          </div>
                          <StatusBadge status={item.status} />
                        </div>
                      </div>
                    ))}

                    <div className="flex gap-3 pt-2">
                      <Button className="flex-1 bg-cyan-500 text-black hover:bg-cyan-400">
                        View Schedule
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 border-white/10 bg-white/5 text-white hover:bg-white/10"
                      >
                        Send Reminders
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-white/10 bg-[#0f172a]">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div>
                      <CardTitle className="text-lg text-white">Alerts Requiring Action</CardTitle>
                      <p className="mt-1 text-sm text-slate-400">
                        Danger signs, missed visits, and escalations
                      </p>
                    </div>
                    <Badge className="border border-rose-500/20 bg-rose-500/15 text-rose-300">
                      Urgent
                    </Badge>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {alerts.map((alert) => (
                      <div
                        key={alert.title}
                        className="flex gap-3 rounded-2xl border border-white/8 bg-white/[0.03] p-4"
                      >
                        <ToneDot tone={alert.tone} />
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <h4 className="font-medium text-white">{alert.title}</h4>
                            <span className="whitespace-nowrap text-xs text-slate-500">{alert.time}</span>
                          </div>
                          <p className="mt-1 text-sm leading-6 text-slate-400">{alert.desc}</p>
                        </div>
                      </div>
                    ))}

                    <Button className="w-full bg-rose-500 text-white hover:bg-rose-400">
                      Review Escalations
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <Card className="border-white/10 bg-[#0f172a]">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg text-white">High-Risk Mothers List</CardTitle>
                    <p className="mt-1 text-sm text-slate-400">
                      Priority cases for review, referral, or monitoring
                    </p>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    {highRiskMothers.map((mother) => (
                      <div
                        key={mother.name}
                        className="rounded-2xl border border-white/8 bg-white/[0.03] p-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h4 className="font-medium text-white">{mother.name}</h4>
                            <p className="mt-1 text-sm text-slate-400">{mother.issue}</p>
                            <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                              <span>{mother.week}</span>
                              <span>•</span>
                              <span>{mother.action}</span>
                            </div>
                          </div>
                          <StatusBadge status={mother.level} />
                        </div>
                      </div>
                    ))}

                    <div className="flex gap-3 pt-2">
                      <Button className="flex-1 bg-amber-400 text-black hover:bg-amber-300">
                        Open Registry
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 border-white/10 bg-white/5 text-white hover:bg-white/10"
                      >
                        Generate Referral List
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-white/10 bg-[#0f172a]">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg text-white">Home Visits Due</CardTitle>
                    <p className="mt-1 text-sm text-slate-400">
                      Area routing for field work and follow-ups
                    </p>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {homeVisits.map((visit) => (
                      <div key={visit.area} className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-white">{visit.area}</h4>
                            <p className="mt-1 text-sm text-slate-400">
                              {visit.count} visits due • {visit.distance} route
                            </p>
                          </div>
                          <StatusBadge status={visit.priority} />
                        </div>
                      </div>
                    ))}

                    <div className="rounded-2xl border border-cyan-500/15 bg-cyan-500/10 p-4">
                      <div className="flex items-start gap-3">
                        <Home className="mt-0.5 h-5 w-5 text-cyan-300" />
                        <div>
                          <p className="font-medium text-white">Route planner suggestion</p>
                          <p className="mt-1 text-sm text-slate-300">
                            Cluster Malabe North and Battaramulla first. Kaduwela East cases should be prioritized
                            before noon due to 2 pending follow-ups.
                          </p>
                        </div>
                      </div>
                    </div>

                    <Button className="w-full bg-emerald-500 text-black hover:bg-emerald-400">
                      Plan Today’s Visits
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Right sidebar */}
            <div className="space-y-6 xl:col-span-4">
              <Card className="border-white/10 bg-[#0f172a]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-white">Core Midwife Modules</CardTitle>
                  <p className="mt-1 text-sm text-slate-400">
                    Feature blocks for your full system
                  </p>
                </CardHeader>

                <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-1">
                  {modules.map((item) => {
                    const Icon = item.icon
                    return (
                      <div
                        key={item.label}
                        className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3"
                      >
                        <div className="rounded-xl bg-white/5 p-2">
                          <Icon className="h-4 w-4 text-emerald-400" />
                        </div>
                        <span className="text-sm text-slate-200">{item.label}</span>
                      </div>
                    )
                  })}
                </CardContent>
              </Card>

              <Card className="border-white/10 bg-[#0f172a]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-white">Clinical Workflow</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    "Pregnancy monitoring",
                    "Danger sign alerts",
                    "ANC/PNC visit checklists",
                    "Case notes and care updates",
                    "Clinical protocols and guidelines",
                    "Interoperability with health systems",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3"
                    >
                      <span className="text-sm text-slate-300">{item}</span>
                      <HeartPulse className="h-4 w-4 text-cyan-400" />
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="border-white/10 bg-[#0f172a]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-white">Quick Actions</CardTitle>
                </CardHeader>

                <CardContent className="space-y-3">
                  <Button className="w-full justify-start bg-emerald-500 text-black hover:bg-emerald-400">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Register New Pregnancy
                  </Button>
                  <Button className="w-full justify-start bg-cyan-500 text-black hover:bg-cyan-400">
                    <CalendarDays className="mr-2 h-4 w-4" />
                    Schedule Appointment
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start border-white/10 bg-white/5 text-white hover:bg-white/10"
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Secure Patient Message
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start border-white/10 bg-white/5 text-white hover:bg-white/10"
                  >
                    <Video className="mr-2 h-4 w-4" />
                    Start Consultation
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start border-white/10 bg-white/5 text-white hover:bg-white/10"
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Add Case Note
                  </Button>
                  <Button className="w-full justify-start bg-rose-500 text-white hover:bg-rose-400">
                    <TriangleAlert className="mr-2 h-4 w-4" />
                    Emergency Escalation
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
  )
}