"use client"

import { Sidebar } from "@/components/sidebar"
import { TopBar } from "@/components/top-bar"
import { AnimatedBackground } from "@/components/animated-background"
import { Bell, Shield, Database, Moon, Sun, Globe } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export default function SettingsPage() {
  const [theme, setTheme] = useState<"dark" | "light">("dark")
  const [notifications, setNotifications] = useState(true)
  const [blockchainSync, setBlockchainSync] = useState(true)
  const [soundEffects, setSoundEffects] = useState(true)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [language, setLanguage] = useState("en")

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-[oklch(0.12_0.02_250)] via-[oklch(0.10_0.03_240)] to-[oklch(0.12_0.02_250)] gradient-animate relative">
      <AnimatedBackground />
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-[oklch(0.95_0.01_250)] mb-2">Settings</h1>
            <p className="text-[oklch(0.60_0.02_250)]">Configure your LoanLife Edge experience</p>
          </div>

          <div className="space-y-6 max-w-3xl">
            {/* Appearance */}
            <Card className="bg-[oklch(0.14_0.02_250)] border-[oklch(0.25_0.04_250)] p-6">
              <div className="flex items-center gap-3 mb-4">
                {theme === "dark" ? (
                  <Moon className="h-5 w-5 text-[oklch(0.55_0.20_220)]" />
                ) : (
                  <Sun className="h-5 w-5 text-[oklch(0.75_0.18_65)]" />
                )}
                <h2 className="text-lg font-semibold text-[oklch(0.95_0.01_250)]">Appearance</h2>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-[oklch(0.90_0.01_250)]">Theme</div>
                    <div className="text-sm text-[oklch(0.60_0.02_250)]">Choose your interface theme</div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant={theme === "dark" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setTheme("dark")}
                      className={
                        theme === "dark"
                          ? "bg-[oklch(0.55_0.20_220)] hover:bg-[oklch(0.60_0.22_220)]"
                          : "border-[oklch(0.30_0.04_250)]"
                      }
                    >
                      Dark
                    </Button>
                    <Button
                      variant={theme === "light" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setTheme("light")}
                      className="border-[oklch(0.30_0.04_250)]"
                    >
                      Light
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            {/* Notifications */}
            <Card className="bg-[oklch(0.14_0.02_250)] border-[oklch(0.25_0.04_250)] p-6">
              <div className="flex items-center gap-3 mb-4">
                <Bell className="h-5 w-5 text-[oklch(0.55_0.20_220)]" />
                <h2 className="text-lg font-semibold text-[oklch(0.95_0.01_250)]">Notifications</h2>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-[oklch(0.90_0.01_250)]">Risk Alerts</div>
                    <div className="text-sm text-[oklch(0.60_0.02_250)]">Get notified of covenant breaches</div>
                  </div>
                  <Button
                    variant={notifications ? "default" : "outline"}
                    size="sm"
                    onClick={() => setNotifications(!notifications)}
                    className={
                      notifications
                        ? "bg-[oklch(0.70_0.25_145)] hover:bg-[oklch(0.75_0.27_145)]"
                        : "border-[oklch(0.30_0.04_250)]"
                    }
                  >
                    {notifications ? "Enabled" : "Disabled"}
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-[oklch(0.90_0.01_250)]">Sound Effects</div>
                    <div className="text-sm text-[oklch(0.60_0.02_250)]">Play audio for critical alerts</div>
                  </div>
                  <Button
                    variant={soundEffects ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSoundEffects(!soundEffects)}
                    className={
                      soundEffects
                        ? "bg-[oklch(0.70_0.25_145)] hover:bg-[oklch(0.75_0.27_145)]"
                        : "border-[oklch(0.30_0.04_250)]"
                    }
                  >
                    {soundEffects ? "On" : "Off"}
                  </Button>
                </div>
              </div>
            </Card>

            {/* Security */}
            <Card className="bg-[oklch(0.14_0.02_250)] border-[oklch(0.25_0.04_250)] p-6">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="h-5 w-5 text-[oklch(0.55_0.20_220)]" />
                <h2 className="text-lg font-semibold text-[oklch(0.95_0.01_250)]">Security</h2>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-[oklch(0.90_0.01_250)]">Two-Factor Authentication</div>
                    <div className="text-sm text-[oklch(0.60_0.02_250)]">Enhanced account security</div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-[oklch(0.30_0.04_250)] text-[oklch(0.90_0.01_250)] bg-transparent"
                  >
                    Configure
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-[oklch(0.90_0.01_250)]">Change Password</div>
                    <div className="text-sm text-[oklch(0.60_0.02_250)]">Update your login credentials</div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-[oklch(0.30_0.04_250)] text-[oklch(0.90_0.01_250)] bg-transparent"
                  >
                    Update
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-[oklch(0.90_0.01_250)]">API Keys</div>
                    <div className="text-sm text-[oklch(0.60_0.02_250)]">Manage integration tokens</div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-[oklch(0.30_0.04_250)] text-[oklch(0.90_0.01_250)] bg-transparent"
                  >
                    Manage
                  </Button>
                </div>
              </div>
            </Card>

            {/* Data & Sync */}
            <Card className="bg-[oklch(0.14_0.02_250)] border-[oklch(0.25_0.04_250)] p-6">
              <div className="flex items-center gap-3 mb-4">
                <Database className="h-5 w-5 text-[oklch(0.55_0.20_220)]" />
                <h2 className="text-lg font-semibold text-[oklch(0.95_0.01_250)]">Data & Sync</h2>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-[oklch(0.90_0.01_250)]">Blockchain Sync</div>
                    <div className="text-sm text-[oklch(0.60_0.02_250)]">Real-time audit log synchronization</div>
                  </div>
                  <Button
                    variant={blockchainSync ? "default" : "outline"}
                    size="sm"
                    onClick={() => setBlockchainSync(!blockchainSync)}
                    className={
                      blockchainSync
                        ? "bg-[oklch(0.70_0.25_145)] hover:bg-[oklch(0.75_0.27_145)]"
                        : "border-[oklch(0.30_0.04_250)]"
                    }
                  >
                    {blockchainSync ? "Active" : "Paused"}
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-[oklch(0.90_0.01_250)]">Offline Mode</div>
                    <div className="text-sm text-[oklch(0.60_0.02_250)]">Work without internet connection</div>
                  </div>
                  <span className="text-sm text-[oklch(0.70_0.25_145)]">Ready</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-[oklch(0.90_0.01_250)]">Auto-Refresh Data</div>
                    <div className="text-sm text-[oklch(0.60_0.02_250)]">Update dashboard every 30 seconds</div>
                  </div>
                  <Button
                    variant={autoRefresh ? "default" : "outline"}
                    size="sm"
                    onClick={() => setAutoRefresh(!autoRefresh)}
                    className={
                      autoRefresh
                        ? "bg-[oklch(0.70_0.25_145)] hover:bg-[oklch(0.75_0.27_145)]"
                        : "border-[oklch(0.30_0.04_250)]"
                    }
                  >
                    {autoRefresh ? "On" : "Off"}
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="bg-[oklch(0.14_0.02_250)] border-[oklch(0.25_0.04_250)] p-6">
              <div className="flex items-center gap-3 mb-4">
                <Globe className="h-5 w-5 text-[oklch(0.55_0.20_220)]" />
                <h2 className="text-lg font-semibold text-[oklch(0.95_0.01_250)]">Language & Region</h2>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-[oklch(0.90_0.01_250)]">Display Language</div>
                    <div className="text-sm text-[oklch(0.60_0.02_250)]">Choose your preferred language</div>
                  </div>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="bg-[oklch(0.18_0.03_250)] border border-[oklch(0.30_0.04_250)] text-[oklch(0.90_0.01_250)] px-3 py-1.5 rounded-md text-sm"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                    <option value="zh">Chinese</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-[oklch(0.90_0.01_250)]">Time Zone</div>
                    <div className="text-sm text-[oklch(0.60_0.02_250)]">UTC-5 (Eastern Time)</div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-[oklch(0.30_0.04_250)] text-[oklch(0.90_0.01_250)] bg-transparent"
                  >
                    Change
                  </Button>
                </div>
              </div>
            </Card>

            {/* System Info */}
            <Card className="bg-[oklch(0.14_0.02_250)] border-[oklch(0.25_0.04_250)] p-6">
              <h2 className="text-lg font-semibold text-[oklch(0.95_0.01_250)] mb-4">System Information</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-[oklch(0.60_0.02_250)] mb-1">Version</div>
                  <div className="font-mono text-[oklch(0.90_0.01_250)]">v1.0.0</div>
                </div>
                <div>
                  <div className="text-[oklch(0.60_0.02_250)] mb-1">Build</div>
                  <div className="font-mono text-[oklch(0.90_0.01_250)]">2025.12.15</div>
                </div>
                <div>
                  <div className="text-[oklch(0.60_0.02_250)] mb-1">Platform</div>
                  <div className="font-mono text-[oklch(0.90_0.01_250)]">Electron + React</div>
                </div>
                <div>
                  <div className="text-[oklch(0.60_0.02_250)] mb-1">Database</div>
                  <div className="font-mono text-[oklch(0.90_0.01_250)]">Offline-First</div>
                </div>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
