import Container from "@/components/shared/container"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function PregnancyPage() {
  return (
    <Container title="Pregnancy Stage Dashboard">
      <div className="bg-gradient-to-br from-pink-100 to-pink-200 min-h-screen -m-5 p-5">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-pink-300 to-pink-400 rounded-lg p-6 mb-6 text-white">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold mb-2">Pregnancy Stage Dashboard</h1>
              <div className="flex items-center gap-8">
                <div>
                  <div className="text-4xl font-bold">24</div>
                  <div className="text-sm">Weeks Pregnant</div>
                  <div className="text-xs opacity-90">Second Trimester - You&apos;re doing great!</div>
                </div>
                <div>
                  <div className="text-4xl font-bold">112</div>
                  <div className="text-sm">Days to go</div>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-semibold">Sarah Johnson</div>
              <div className="text-sm opacity-90">Patient ID: PG-2025-001</div>
              <Avatar className="w-10 h-10 mt-2 ml-auto">
                <AvatarFallback className="bg-pink-500 text-white">SJ</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Today's Recommendations */}
          <Card className="bg-white/90 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-pink-600 flex items-center gap-2">
                <span className="text-green-500">✓</span> Today&apos;s Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg space-y-3">
                <div className="flex items-start gap-3">
                  <Checkbox id="prenatal" defaultChecked className="mt-1" />
                  <div>
                    <label htmlFor="prenatal" className="font-medium text-sm">
                      Take prenatal vitamins with DHA
                    </label>
                    <p className="text-xs text-gray-600">Support baby&apos;s brain development</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Checkbox id="yoga" className="mt-1" />
                  <div>
                    <label htmlFor="yoga" className="font-medium text-sm">
                      30 minutes prenatal yoga
                    </label>
                    <p className="text-xs text-gray-600">Reduce back pain and prepare for labor</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Checkbox id="kicks" className="mt-1" />
                  <div>
                    <label htmlFor="kicks" className="font-medium text-sm">
                      Track baby kicks
                    </label>
                    <p className="text-xs text-gray-600">Monitor baby&apos;s movements regularly</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pregnancy Timeline & Milestones */}
          <Card className="bg-white/90 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-pink-600 flex items-center gap-2">
                <span className="text-blue-500">📅</span> Pregnancy Timeline & Milestones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-blue-100 p-3 rounded-lg text-center">
                    <div className="text-sm font-medium">1st</div>
                    <div className="text-sm font-medium">Trimester</div>
                    <div className="text-xs text-gray-600">Weeks 1-12</div>
                    <div className="text-xs text-green-600">✓ Complete</div>
                  </div>
                  <div className="bg-orange-100 p-3 rounded-lg text-center border-2 border-orange-300">
                    <div className="text-sm font-medium">2nd</div>
                    <div className="text-sm font-medium">Trimester</div>
                    <div className="text-xs text-gray-600">Weeks 13-26</div>
                    <div className="text-xs text-orange-600">Current</div>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-lg text-center">
                    <div className="text-sm font-medium">3rd</div>
                    <div className="text-sm font-medium">Trimester</div>
                    <div className="text-xs text-gray-600">Weeks 27-40</div>
                    <div className="text-xs text-gray-500">Upcoming</div>
                  </div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="font-medium text-sm">Current Milestone: Baby can hear</div>
                  <div className="text-xs text-gray-600">your voice! Start reading and singing to your little one.</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Fetal Development Tracker */}
          <Card className="bg-white/90 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-pink-600 flex items-center gap-2">
                <span className="text-purple-500">👶</span> Fetal Development Tracker
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-lg font-bold">Week 24</div>
                  <div className="text-sm text-gray-600">Development</div>
                  <div className="text-xs text-gray-500">🌟 Baby is fully developed</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="font-medium text-sm">Size of a Corn</div>
                  <div className="text-xs text-gray-600">12 inches, 1.3 lbs</div>
                  <div className="mt-2 space-y-1">
                    <div className="text-xs">• Hearing is fully developed</div>
                    <div className="text-xs">• Lungs are producing surfactant</div>
                    <div className="text-xs">• Taste buds are forming</div>
                    <div className="text-xs">• Responds to sound and touch</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Health Status Summary */}
          <Card className="bg-white/90 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-pink-600">Health Status Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="font-medium text-green-600">Good Health Status</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-blue-50 p-3 rounded">
                    <div className="text-lg font-bold text-blue-600">120/80</div>
                    <div className="text-xs text-gray-600">BLOOD PRESSURE</div>
                  </div>
                  <div className="bg-green-50 p-3 rounded">
                    <div className="text-lg font-bold text-green-600">65 bpm</div>
                    <div className="text-xs text-gray-600">HEART RATE</div>
                  </div>
                  <div className="bg-yellow-50 p-3 rounded">
                    <div className="text-lg font-bold text-yellow-600">25 lbs</div>
                    <div className="text-xs text-gray-600">WEIGHT GAIN</div>
                  </div>
                  <div className="bg-purple-50 p-3 rounded">
                    <div className="text-lg font-bold text-purple-600">12.8 g/dL</div>
                    <div className="text-xs text-gray-600">HEMOGLOBIN</div>
                  </div>
                </div>
                <div className="bg-yellow-50 p-3 rounded-lg border-l-4 border-yellow-400">
                  <div className="flex items-start gap-2">
                    <span className="text-yellow-600">⚠️</span>
                    <div>
                      <div className="text-sm font-medium">Moderate Alert: Weight Gain</div>
                      <div className="text-xs text-gray-600">
                        Reason: Weight gain is slightly above recommended range for your pregnancy stage (24 weeks).
                      </div>
                      <div className="text-xs font-medium mt-1">Recommended Solutions:</div>
                      <ul className="text-xs text-gray-600 mt-1 space-y-1">
                        <li>• Focus on nutrient-dense, low-calorie foods</li>
                        <li>• Increase gentle exercise like prenatal yoga or swimming</li>
                        <li>• Schedule a consultation with your nutritionist</li>
                        <li>• Track daily food intake and portion sizes</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Nutrition & Wellness */}
          <Card className="bg-white/90 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-pink-600 flex items-center gap-2">
                <span>🥗</span> Nutrition & Wellness
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl">💧</div>
                  <div className="font-medium">6/8 glasses</div>
                  <div className="text-xs text-gray-600">Water</div>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="text-sm font-medium">Status: Normal activity level</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Kick Counter */}
          <Card className="bg-white/90 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-pink-600 flex items-center gap-2">
                <span className="text-pink-500">👶</span> Kick Counter
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-center">
                <div className="text-6xl font-bold text-pink-500">8</div>
                <div className="text-sm font-medium">Kicks Today</div>
                <div className="text-xs text-gray-600">Healthy range: 6-10 kicks per hour</div>
                <div className="flex gap-2">
                  <Button size="sm" className="bg-pink-500 hover:bg-pink-600 text-white flex-1">
                    Count Kick
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                    Reset
                  </Button>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="text-sm font-medium">Status: Normal activity level</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Midwife Connectivity */}
          <Card className="bg-white/90 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-pink-600 flex items-center gap-2">
                <span>👩‍⚕️</span> Midwife Connectivity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-pink-500 text-white">SM</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">Sarah Mitchell, CNM</div>
                    <div className="text-xs text-gray-600">🟢 Online • Last seen 2 min ago</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" className="bg-pink-500 hover:bg-pink-600 text-white flex-1">
                    Important
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                    Ask Question
                  </Button>
                </div>
                <div className="bg-orange-50 p-3 rounded-lg">
                  <div className="text-sm font-medium">📊 Normal Clinic</div>
                  <div className="text-xs text-gray-600">
                    Auto-Alert: Health data automatically shared with care team
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Health Announcements */}
          <Card className="bg-white/90 backdrop-blur lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-pink-600 flex items-center gap-2">
                <span>📢</span> Health Announcements
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
          <Card className="bg-white/90 backdrop-blur lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-pink-600 flex items-center gap-2">
                <span>🔔</span> Upcoming Reminders
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                <div>
                  <div className="font-medium text-sm">July 22</div>
                  <div className="text-xs text-gray-600">Gynecologist Visit</div>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  Booked
                </Badge>
              </div>
              <div className="flex justify-between items-center p-2 bg-yellow-50 rounded">
                <div>
                  <div className="font-medium text-sm">July 25</div>
                  <div className="text-xs text-gray-600">Midwife Consultation</div>
                </div>
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
                  Pending
                </Badge>
              </div>
              <div className="flex justify-between items-center p-2 bg-red-50 rounded">
                <div>
                  <div className="font-medium text-sm">Aug 1</div>
                  <div className="text-xs text-gray-600">Blood Test</div>
                </div>
                <Badge variant="secondary" className="bg-red-100 text-red-700">
                  Urgent
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Container>
  )
}
