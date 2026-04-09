import Container from "@/components/shared/container"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import TopBarFeatures from "@/components/common/TopBarFeatures"

export default function PostpartumPage() {
  return (
    <Container title="Postpartum Care Dashboard">
      <div className="bg-gradient-to-br from-pink-100 to-pink-200 min-h-screen -m-5 p-5">
        <TopBarFeatures />
        {/* Header Section */}
        <div className="bg-gradient-to-r from-pink-300 to-pink-400 rounded-lg p-6 mb-6 text-white">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold mb-2">Postpartum Care Dashboard</h1>
              <div className="flex items-center gap-8">
                <div>
                  <div className="text-4xl font-bold">14</div>
                  <div className="text-sm">Days Postpartum</div>
                  <div className="text-xs opacity-90">Your recovery is progressing well</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">⭐</span>
                  <div>
                    <div className="text-lg font-bold">2 weeks old</div>
                    <div className="text-sm">Baby Emma</div>
                    <div className="text-xs opacity-90">Born July 6, 2025</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-semibold">Sarah Johnson</div>
              <div className="text-sm opacity-90">New Mother • ID: PP-2025-001</div>
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
                  <Checkbox id="rest" defaultChecked className="mt-1" />
                  <div>
                    <label htmlFor="rest" className="font-medium text-sm">
                      Rest when baby sleeps
                    </label>
                    <p className="text-xs text-gray-600">Your body needs time to heal and recover</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Checkbox id="postnatal" className="mt-1" />
                  <div>
                    <label htmlFor="postnatal" className="font-medium text-sm">
                      Take postnatal vitamins
                    </label>
                    <p className="text-xs text-gray-600">Continue vitamin D, iron, and calcium supplements</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Checkbox id="pelvic" className="mt-1" />
                  <div>
                    <label htmlFor="pelvic" className="font-medium text-sm">
                      Gentle pelvic floor exercises
                    </label>
                    <p className="text-xs text-gray-600">Start with 5-10 kegel exercises, 3 times today</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Checkbox id="hydration" className="mt-1" />
                  <div>
                    <label htmlFor="hydration" className="font-medium text-sm">
                      Stay hydrated (3L water)
                    </label>
                    <p className="text-xs text-gray-600">Essential for breastfeeding and recovery</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preparation for postpartum */}
          <Card className="bg-white/90 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-pink-600 flex items-center gap-2">
                <span className="text-blue-500">📋</span> Preparation for postpartum
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center text-gray-500">
                  <div className="text-sm">Recovery planning and preparation</div>
                  <div className="text-xs">Information and resources for your postpartum journey</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Mother's Health Status */}
          <Card className="bg-white/90 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-pink-600 flex items-center gap-2">
                <span className="text-purple-500">❤️</span> Mother&lsquo;s Health Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-green-100 p-3 rounded-lg text-center">
                    <div className="text-xs font-medium">✓</div>
                    <div className="text-xs font-medium">HEALING</div>
                  </div>
                  <div className="bg-yellow-100 p-3 rounded-lg text-center">
                    <div className="text-xs font-medium">⚠️</div>
                    <div className="text-xs font-medium">ENERGY</div>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-lg text-center">
                    <div className="text-xs font-medium">😴</div>
                    <div className="text-xs font-medium">SLEEP</div>
                  </div>
                  <div className="bg-green-100 p-3 rounded-lg text-center">
                    <div className="text-xs font-medium">🤱</div>
                    <div className="text-xs font-medium">BLEEDING</div>
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm font-medium">Overall Recovery Progress</div>
                  <Progress value={75} className="mt-2" />
                  <div className="text-xs text-gray-600 mt-1">75% - Good progress</div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" className="bg-pink-500 hover:bg-pink-600 text-white flex-1">
                    Log Symptoms
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                    Call Midwife
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recovery Checklist */}
          <Card className="bg-white/90 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-pink-600 flex items-center gap-2">
                <span className="text-green-500">✅</span> Recovery Checklist
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Checkbox id="checkup" defaultChecked className="mt-1" />
                  <div>
                    <label htmlFor="checkup" className="font-medium text-sm">
                      6-week postpartum checkup scheduled
                    </label>
                    <p className="text-xs text-gray-600">Appointment with Dr. Smith on July 29, 2025</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Checkbox id="exercises" className="mt-1" />
                  <div>
                    <label htmlFor="exercises" className="font-medium text-sm">
                      Pelvic floor exercises started
                    </label>
                    <p className="text-xs text-gray-600">Begin gentle kegel exercises when comfortable</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Checkbox id="certificate" defaultChecked className="mt-1" />
                  <div>
                    <label htmlFor="certificate" className="font-medium text-sm">
                      Birth certificate application
                    </label>
                    <p className="text-xs text-gray-600">Submitted to vital records office</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Checkbox id="pediatrician" className="mt-1" />
                  <div>
                    <label htmlFor="pediatrician" className="font-medium text-sm">
                      Baby&apos;s first pediatrician visit
                    </label>
                    <p className="text-xs text-gray-600">Schedule within first week</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Nutrition Plan */}
          <Card className="bg-white/90 backdrop-blur lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-pink-600 flex items-center gap-2">
                <span>🥗</span> Nutrition Plan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-blue-100 p-4 rounded-lg text-center">
                  <div className="text-2xl">💧</div>
                  <div className="text-lg font-bold">2.1L</div>
                  <div className="text-xs text-gray-600">Water</div>
                </div>
                <div className="bg-green-100 p-4 rounded-lg text-center">
                  <div className="text-2xl">🥛</div>
                  <div className="text-lg font-bold">3</div>
                  <div className="text-xs text-gray-600">Calcium</div>
                </div>
                <div className="bg-orange-100 p-4 rounded-lg text-center">
                  <div className="text-2xl">🍖</div>
                  <div className="text-lg font-bold">5</div>
                  <div className="text-xs text-gray-600">Iron Rich</div>
                </div>
                <div className="bg-purple-100 p-4 rounded-lg text-center">
                  <div className="text-2xl">🥜</div>
                  <div className="text-lg font-bold">2</div>
                  <div className="text-xs text-gray-600">Protein</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Container>
  )
}
