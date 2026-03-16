import Container from "@/components/shared/container"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Settings, Bell, Shield } from "lucide-react"

const SettingsPage = () => {
  return (
    <Container title="Settings">
      <div className="space-y-6">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Settings</h1>
        </div>

        {/* Settings Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Preferences Card */}
          <Card>
            <CardContent className="p-6">
              <div className="mb-6 flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500">
                  <Settings className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold">Preferences</h2>
                  <p className="text-sm text-muted-foreground">Customize your application experience</p>
                </div>
              </div>

              {/* User Profile Section */}
              <div className="mb-6 flex items-center gap-4 rounded-lg bg-muted/50 p-4">
                <Avatar className="h-12 w-12 bg-pink-500">
                  <AvatarFallback className="bg-pink-500 text-lg font-semibold text-white">DR</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold">Dr. Rachel Thompson</div>
                  <div className="text-sm text-muted-foreground">Certified Midwife • ID: MW-2024-001</div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Dark Mode</div>
                    <div className="text-sm text-muted-foreground">Switch to dark theme for better visibility</div>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Language</div>
                    <div className="text-sm text-muted-foreground">Choose your preferred language</div>
                  </div>
                  <Button variant="outline" size="sm">
                    English
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Auto-save Frequency</div>
                    <div className="text-sm text-muted-foreground">How often to automatically save your work</div>
                  </div>
                  <Button variant="outline" size="sm">
                    Every minute
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Show Patient Photos</div>
                    <div className="text-sm text-muted-foreground">Display patient photos in lists and profiles</div>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Enable Sound Effects</div>
                    <div className="text-sm text-muted-foreground">Play sounds for notifications and alerts</div>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>

              <Button className="mt-6 w-full bg-pink-500 hover:bg-pink-600 text-white">Save Preferences</Button>
            </CardContent>
          </Card>

          {/* Notifications Card */}
          <Card>
            <CardContent className="p-6">
              <div className="mb-6 flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-pink-500">
                  <Bell className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold">Notifications</h2>
                  <p className="text-sm text-muted-foreground">Manage your notification preferences</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-pink-100">
                      <Bell className="h-4 w-4 text-pink-600" />
                    </div>
                    <div>
                      <div className="font-medium">Appointment Reminders</div>
                      <div className="text-sm text-muted-foreground">Get notified about upcoming appointments</div>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-100">
                      <Bell className="h-4 w-4 text-orange-600" />
                    </div>
                    <div>
                      <div className="font-medium">Health Alerts</div>
                      <div className="text-sm text-muted-foreground">Critical patient health notifications</div>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-100">
                      <Bell className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <div className="font-medium">Patient Messages</div>
                      <div className="text-sm text-muted-foreground">New messages from patients</div>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100">
                      <Bell className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium">System Updates</div>
                      <div className="text-sm text-muted-foreground">Application updates and maintenance</div>
                    </div>
                  </div>
                  <Switch />
                </div>

                <div className="space-y-3 border-t pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Email Notifications</div>
                      <div className="text-sm text-muted-foreground">Receive notifications via email</div>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">SMS Notifications</div>
                      <div className="text-sm text-muted-foreground">Receive urgent alerts via SMS</div>
                    </div>
                    <Switch />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Quiet Hours</div>
                      <div className="text-sm text-muted-foreground">No notifications during specified hours</div>
                    </div>
                    <Button variant="outline" size="sm">
                      Disabled
                    </Button>
                  </div>
                </div>
              </div>

              <Button className="mt-6 w-full bg-blue-500 hover:bg-blue-600 text-white">Update Notifications</Button>
            </CardContent>
          </Card>

          {/* Account & Security Card */}
          <Card>
            <CardContent className="p-6">
              <div className="mb-6 flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-pink-400">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold">Account & Security</h2>
                  <p className="text-sm text-muted-foreground">Manage your account security and logout</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border-l-4 border-pink-500 bg-muted/50 p-4">
                  <div>
                    <div className="font-medium">Change Password</div>
                    <div className="text-sm text-muted-foreground">Update your account password</div>
                  </div>
                  <Button size="sm" className="bg-blue-500 hover:bg-blue-600">
                    Change
                  </Button>
                </div>

                <div className="flex items-center justify-between rounded-lg border-l-4 border-pink-500 bg-muted/50 p-4">
                  <div>
                    <div className="font-medium">Two-Factor Authentication</div>
                    <div className="text-sm text-muted-foreground">Add extra security to your account</div>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between rounded-lg border-l-4 border-pink-500 bg-muted/50 p-4">
                  <div>
                    <div className="font-medium">Session Timeout</div>
                    <div className="text-sm text-muted-foreground">Auto-logout after inactivity</div>
                  </div>
                  <Button variant="outline" size="sm">
                    1 hour
                  </Button>
                </div>

                <div className="flex items-center justify-between rounded-lg border-l-4 border-pink-500 bg-muted/50 p-4">
                  <div>
                    <div className="font-medium">Login History</div>
                    <div className="text-sm text-muted-foreground">View recent login activity</div>
                  </div>
                  <Button size="sm" className="bg-blue-500 hover:bg-blue-600">
                    View
                  </Button>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <div className="text-center text-sm text-muted-foreground">Ready to log out of your session?</div>
                <Button className="w-full bg-red-500 hover:bg-red-600 text-white">Logout Securely</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Container>
  )
}

export default SettingsPage