"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Calendar, User, Shield, Smartphone } from 'lucide-react'

const SettingsComponent = () => {
  const [profileData, setProfileData] = useState({
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+1 (555) 123-4567',
    dob: '01/15/1992'
  })

  const [notifications, setNotifications] = useState({
    cycleReminders: true,
    medicationReminders: true,
    appointmentReminders: true,
    emailUpdates: false,
    pushNotifications: true
  })

  const [privacy, setPrivacy] = useState({
    dataEncryption: true,
    anonymousAnalytics: true,
    twoFactorAuth: false
  })

  const [preferences, setPreferences] = useState({
    language: 'English',
    timeZone: 'EST (UTC-5)',
    darkMode: false,
    cycleLength: '28',
    periodLength: '5'
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 to-pink-200 p-8 w-full max-w-full space-y-6 p-6">
      <div className="max-w-7xl mx-auto">
      {/* Settings Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Settings</h1>
      </div>
        
      
      
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Settings */}
        <Card className="bg-white shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-pink-500 rounded-lg flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <CardTitle className="text-lg font-semibold">Profile Settings</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-4">
              <Avatar className="w-16 h-16">
                <AvatarFallback className="bg-pink-500 text-white text-xl font-semibold">
                  SJ
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-lg">{profileData.name}</h3>
                <p className="text-sm text-gray-600">Member since January 2021</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-sm font-medium">Name</Label>
                <Input
                  id="name"
                  value={profileData.name}
                  onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="phone" className="text-sm font-medium">Phone</Label>
                <Input
                  id="phone"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="dob" className="text-sm font-medium">Date of Birth</Label>
                <div className="relative mt-1">
                  <Input
                    id="dob"
                    value={profileData.dob}
                    onChange={(e) => setProfileData({...profileData, dob: e.target.value})}
                    className="pr-10"
                  />
                  <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3 pt-2">
              <Button className="bg-pink-500 hover:bg-pink-600 text-white">
                Update Profile
              </Button>
              <Button variant="outline">
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="bg-white shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">N</span>
              </div>
              <CardTitle className="text-lg font-semibold">Notification Settings</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Cycle Reminders</Label>
                  <p className="text-xs text-gray-600">Get notified about your cycle phases</p>
                </div>
                <Switch
                  checked={notifications.cycleReminders}
                  onCheckedChange={(checked) => 
                    setNotifications({...notifications, cycleReminders: checked})
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Medication Reminders</Label>
                  <p className="text-xs text-gray-600">Daily reminders for medication alerts</p>
                </div>
                <Switch
                  checked={notifications.medicationReminders}
                  onCheckedChange={(checked) => 
                    setNotifications({...notifications, medicationReminders: checked})
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Appointment Reminders</Label>
                  <p className="text-xs text-gray-600">Reminders for upcoming medical appointments</p>
                </div>
                <Switch
                  checked={notifications.appointmentReminders}
                  onCheckedChange={(checked) => 
                    setNotifications({...notifications, appointmentReminders: checked})
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Email Updates</Label>
                  <p className="text-xs text-gray-600">Weekly health insights and tips</p>
                </div>
                <Switch
                  checked={notifications.emailUpdates}
                  onCheckedChange={(checked) => 
                    setNotifications({...notifications, emailUpdates: checked})
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Push Notifications</Label>
                  <p className="text-xs text-gray-600">Real-time mobile notifications</p>
                </div>
                <Switch
                  checked={notifications.pushNotifications}
                  onCheckedChange={(checked) => 
                    setNotifications({...notifications, pushNotifications: checked})
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy & Security */}
        <Card className="bg-white shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-pink-500 rounded-lg flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <CardTitle className="text-lg font-semibold">Privacy & Security</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Data Encryption</Label>
                  <p className="text-xs text-gray-600">Encrypt all personal health data</p>
                </div>
                <Switch
                  checked={privacy.dataEncryption}
                  onCheckedChange={(checked) => 
                    setPrivacy({...privacy, dataEncryption: checked})
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Anonymous Analytics</Label>
                  <p className="text-xs text-gray-600">Help us improve by sharing anonymous data</p>
                </div>
                <Switch
                  checked={privacy.anonymousAnalytics}
                  onCheckedChange={(checked) => 
                    setPrivacy({...privacy, anonymousAnalytics: checked})
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Two-Factor Authentication</Label>
                  <p className="text-xs text-gray-600">Add extra security to your account</p>
                </div>
                <Switch
                  checked={privacy.twoFactorAuth}
                  onCheckedChange={(checked) => 
                    setPrivacy({...privacy, twoFactorAuth: checked})
                  }
                />
              </div>
            </div>
            
            <div className="space-y-4 pt-2">
              <div>
                <Label htmlFor="currentPassword" className="text-sm font-medium">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  placeholder="Enter current password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="newPassword" className="text-sm font-medium">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Enter new password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm new password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                  className="mt-1"
                />
              </div>
              

            </div>
            
            <Button className="bg-pink-500 hover:bg-pink-600 text-white w-full">
              Update Password
            </Button>
          </CardContent>
        </Card>

        {/* App Preferences */}
        <Card className="bg-white shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-pink-500 rounded-lg flex items-center justify-center">
                <Smartphone className="w-4 h-4 text-white" />
              </div>
              <CardTitle className="text-lg font-semibold">App Preferences</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Language</Label>
                <p className="text-xs text-gray-600 mb-2">Choose your preferred language</p>
                <Select value={preferences.language} onValueChange={(value) => 
                  setPreferences({...preferences, language: value})
                }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Spanish">Spanish</SelectItem>
                    <SelectItem value="French">French</SelectItem>
                    <SelectItem value="German">German</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Time Zone</Label>
                <p className="text-xs text-gray-600 mb-2">Select your local time zone</p>
                <Select value={preferences.timeZone} onValueChange={(value) => 
                  setPreferences({...preferences, timeZone: value})
                }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EST (UTC-5)">EST (UTC-5)</SelectItem>
                    <SelectItem value="CST (UTC-6)">CST (UTC-6)</SelectItem>
                    <SelectItem value="MST (UTC-7)">MST (UTC-7)</SelectItem>
                    <SelectItem value="PST (UTC-8)">PST (UTC-8)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Dark Mode</Label>
                  <p className="text-xs text-gray-600">Switch to dark color theme</p>
                </div>
                <Switch
                  checked={preferences.darkMode}
                  onCheckedChange={(checked) => 
                    setPreferences({...preferences, darkMode: checked})
                  }
                />
              </div>
              
              <div>
                <Label className="text-sm font-medium">Cycle Length (days)</Label>
                <p className="text-xs text-gray-600 mb-2">Your average cycle duration</p>
                <Input
                  type="number"
                  value={preferences.cycleLength}
                  onChange={(e) => setPreferences({...preferences, cycleLength: e.target.value})}
                  className="w-full"
                />
              </div>
              
              <div>
                <Label className="text-sm font-medium">Period Length (days)</Label>
                <p className="text-xs text-gray-600 mb-2">Your average period duration</p>
                <Input
                  type="number"
                  value={preferences.periodLength}
                  onChange={(e) => setPreferences({...preferences, periodLength: e.target.value})}
                  className="w-full"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </div>
    </div>
  )
}

export default SettingsComponent