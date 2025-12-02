"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Lock, BarChart3, AlertTriangle } from "lucide-react"

export default function ProfilePage() {
  const [formData, setFormData] = useState({
    name: "John Doe",
    email: "john@example.com",
    bio: "Hardware security researcher",
  })
  const [newPassword, setNewPassword] = useState({
    current: "",
    new: "",
    confirm: "",
  })
  const [isSaving, setIsSaving] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(false)

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      alert("Profile updated successfully!")
    }, 500)
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword.new !== newPassword.confirm) {
      alert("Passwords do not match")
      return
    }
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      setNewPassword({ current: "", new: "", confirm: "" })
      alert("Password changed successfully!")
    }, 500)
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Profile Settings</h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </div>

      <Tabs defaultValue="profile" className="max-w-4xl space-y-6">
        <TabsList className="bg-card/50 border border-border/40">
          <TabsTrigger value="profile">
            <User className="w-4 h-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="security">
            <Lock className="w-4 h-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger value="usage">
            <BarChart3 className="w-4 h-4 mr-2" />
            Usage
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <div className="space-y-6">
            <Card className="border-border/50 bg-card/50">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal information</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSaveProfile} className="space-y-6">
                  <div className="flex items-center gap-6 pb-6 border-b border-border/40">
                    <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-2xl font-bold text-primary-foreground">
                      JD
                    </div>
                    <Button type="button" variant="outline" className="border-primary/50 bg-transparent">
                      Change Avatar
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="bg-input/50 border-input"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="bg-input/50 border-input"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      placeholder="Tell us about yourself..."
                      className="w-full px-3 py-2 rounded-lg bg-input/50 border border-input focus:border-primary focus:outline-none transition min-h-[100px]"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSaving}
                    className="bg-accent hover:bg-accent/80 text-accent-foreground"
                  >
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <div className="space-y-6">
            <Card className="border-border/50 bg-card/50">
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>Update your password to keep your account secure</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleChangePassword} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input
                      id="current-password"
                      type="password"
                      placeholder="••••••••"
                      value={newPassword.current}
                      onChange={(e) =>
                        setNewPassword({
                          ...newPassword,
                          current: e.target.value,
                        })
                      }
                      className="bg-input/50 border-input"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input
                        id="new-password"
                        type="password"
                        placeholder="••••••••"
                        value={newPassword.new}
                        onChange={(e) =>
                          setNewPassword({
                            ...newPassword,
                            new: e.target.value,
                          })
                        }
                        className="bg-input/50 border-input"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm Password</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        placeholder="••••••••"
                        value={newPassword.confirm}
                        onChange={(e) =>
                          setNewPassword({
                            ...newPassword,
                            confirm: e.target.value,
                          })
                        }
                        className="bg-input/50 border-input"
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSaving}
                    className="bg-accent hover:bg-accent/80 text-accent-foreground"
                  >
                    {isSaving ? "Updating..." : "Update Password"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50">
              <CardHeader>
                <CardTitle>Two-Factor Authentication</CardTitle>
                <CardDescription>Add an extra layer of security to your account</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">Status</p>
                    <p className="text-sm text-muted-foreground">Not enabled</p>
                  </div>
                  <Button variant="outline" className="border-primary/50 hover:border-primary bg-transparent">
                    Enable 2FA
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50">
              <CardHeader>
                <CardTitle className="text-destructive">Danger Zone</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 rounded-lg bg-destructive/10 border border-destructive/30">
                  <div>
                    <p className="font-medium text-sm">Delete Account</p>
                    <p className="text-sm text-muted-foreground">
                      Permanently delete your account and all associated data
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setDeleteConfirm(true)}
                    className="border-destructive/50 text-destructive hover:text-destructive"
                  >
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Usage Tab */}
        <TabsContent value="usage">
          <div className="space-y-6">
            <Card className="border-border/50 bg-card/50">
              <CardHeader>
                <CardTitle>API Usage Statistics</CardTitle>
                <CardDescription>Your current API usage and limits</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    {
                      label: "PCBs Analyzed",
                      usage: 48,
                      limit: 1000,
                      percentage: 4.8,
                    },
                    {
                      label: "Images Processed",
                      usage: 156,
                      limit: 5000,
                      percentage: 3.1,
                    },
                    {
                      label: "API Calls",
                      usage: 2341,
                      limit: 50000,
                      percentage: 4.7,
                    },
                    {
                      label: "Storage Used",
                      usage: 2.3,
                      limit: 100,
                      percentage: 2.3,
                      unit: "GB",
                    },
                  ].map((stat, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">{stat.label}</p>
                        <p className="text-sm text-muted-foreground">
                          {stat.usage} / {stat.limit} {stat.unit || ""}
                        </p>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-accent-green to-accent-blue h-full transition-all"
                          style={{ width: `${stat.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50">
              <CardHeader>
                <CardTitle>Plan Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-card/50 border border-border/40">
                    <div>
                      <p className="font-medium">Current Plan</p>
                      <p className="text-sm text-muted-foreground">Professional Plan</p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-semibold">
                      Active
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-card/50 border border-border/40">
                    <div>
                      <p className="font-medium">Renews on</p>
                      <p className="text-sm text-muted-foreground">February 15, 2025</p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full border-primary/50 hover:border-primary bg-transparent">
                    Manage Billing
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Delete Account Confirmation Dialog */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md border-border/50">
            <CardHeader>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-lg bg-destructive/20 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-destructive" />
                </div>
                <div>
                  <CardTitle>Delete Account?</CardTitle>
                  <CardDescription>This action cannot be undone</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-sm text-muted-foreground">
                Deleting your account will permanently remove all your projects, images, and analysis results.
              </p>
              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={() => setDeleteConfirm(false)} className="border-primary/50">
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    setDeleteConfirm(false)
                    alert("Account deleted")
                  }}
                  className="bg-destructive hover:bg-destructive/80 text-destructive-foreground"
                >
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
