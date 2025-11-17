import Container from "@/components/shared/container"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, FileEdit, Activity, BarChart3 } from "lucide-react"

const ReportsAnalysisPage = () => {
  return (
    <Container title="Reporting & Analysis">
      <div className="space-y-6">
        {/* Page Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Reporting & Analysis</h1>
          <p className="text-muted-foreground">
            Comprehensive insights and analytics for better patient care management
          </p>
        </div>

        {/* Top Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-6 text-center">
              <div className="text-4xl font-bold text-pink-500">156</div>
              <div className="text-sm text-muted-foreground">Total Reports</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex flex-col items-center justify-center p-6 text-center">
              <div className="text-4xl font-bold text-pink-500">23</div>
              <div className="text-sm text-muted-foreground">Pending Reviews</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex flex-col items-center justify-center p-6 text-center">
              <div className="text-4xl font-bold text-pink-500">98.5%</div>
              <div className="text-sm text-muted-foreground">Accuracy Rate</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex flex-col items-center justify-center p-6 text-center">
              <div className="text-4xl font-bold text-pink-500">42</div>
              <div className="text-sm text-muted-foreground">Active Patients</div>
            </CardContent>
          </Card>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Reports to Review */}
          <Card>
            <CardContent className="p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500">
                <FileText className="h-6 w-6 text-white" />
              </div>

              <h3 className="mb-2 text-lg font-semibold">Reports to Review</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Review and analyze patient reports that require your attention. Stay updated with the latest health
                assessments and diagnostic results.
              </p>

              <div className="mb-4 flex items-end justify-between">
                <div className="space-y-1">
                  <div>
                    <span className="text-2xl font-bold text-pink-500">23</span>
                    <span className="ml-1 text-xs text-muted-foreground">PENDING</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div>
                    <span className="text-2xl font-bold">156</span>
                    <span className="ml-1 text-xs text-muted-foreground">TOTAL</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div>
                    <span className="text-2xl font-bold text-red-500">12</span>
                    <span className="ml-1 text-xs text-muted-foreground">URGENT</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button className="flex-1 bg-pink-500 hover:bg-pink-600 text-white">View Reports</Button>
                <Button variant="outline" className="flex-1 bg-transparent">
                  Filter
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Patient Analytics */}
          <Card>
            <CardContent className="p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-pink-500">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>

              <h3 className="mb-2 text-lg font-semibold">Patient Analytics</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Detailed analytics and trends for patient health data. Track progress, identify patterns, and make
                data-driven decisions.
              </p>

              <div className="mb-4 flex items-end justify-between">
                <div className="space-y-1">
                  <div>
                    <span className="text-2xl font-bold text-pink-500">42</span>
                    <span className="ml-1 text-xs text-muted-foreground">PATIENTS</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div>
                    <span className="text-2xl font-bold">89%</span>
                    <span className="ml-1 text-xs text-muted-foreground">POSITIVE</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div>
                    <span className="text-2xl font-bold text-orange-500">7</span>
                    <span className="ml-1 text-xs text-muted-foreground">HIGH RISK</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button className="flex-1 bg-pink-500 hover:bg-pink-600 text-white">View Analytics</Button>
                <Button variant="outline" className="flex-1 bg-transparent">
                  Export
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Clinical Notes */}
          <Card>
            <CardContent className="p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500">
                <FileEdit className="h-6 w-6 text-white" />
              </div>

              <h3 className="mb-2 text-lg font-semibold">Clinical Notes</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Access and manage clinical notes from patient visits. Review observations, treatment plans, and
                follow-up recommendations.
              </p>

              <div className="mb-4 flex items-end justify-between">
                <div className="space-y-1">
                  <div>
                    <span className="text-2xl font-bold text-pink-500">89</span>
                    <span className="ml-1 text-xs text-muted-foreground">NOTES</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div>
                    <span className="text-2xl font-bold">15</span>
                    <span className="ml-1 text-xs text-muted-foreground">TODAY</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div>
                    <span className="text-2xl font-bold text-gray-400">3</span>
                    <span className="ml-1 text-xs text-muted-foreground">DRAFTS</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button className="flex-1 bg-pink-500 hover:bg-pink-600 text-white">View Notes</Button>
                <Button variant="outline" className="flex-1 bg-transparent">
                  New Note
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <Card>
            <CardContent className="p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-teal-500">
                <Activity className="h-6 w-6 text-white" />
              </div>

              <h3 className="mb-2 text-lg font-semibold">Performance Metrics</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Monitor your performance metrics and quality indicators. Track appointment efficiency, patient
                satisfaction, and care outcomes.
              </p>

              <div className="mb-4 flex items-end justify-between">
                <div className="space-y-1">
                  <div>
                    <span className="text-2xl font-bold text-pink-500">94%</span>
                    <span className="ml-1 text-xs text-muted-foreground">EFFICIENCY</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div>
                    <span className="text-2xl font-bold">4.8</span>
                    <span className="ml-1 text-xs text-muted-foreground">RATING</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div>
                    <span className="text-2xl font-bold text-green-500">98</span>
                    <span className="ml-1 text-xs text-muted-foreground">SUCCESS</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button className="flex-1 bg-pink-500 hover:bg-pink-600 text-white">View Metrics</Button>
                <Button variant="outline" className="flex-1 bg-transparent">
                  Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Container>
  )
}

export default ReportsAnalysisPage
