"use client"

import { Sidebar } from "@/components/sidebar"
import { TopBar } from "@/components/top-bar"
import { AnimatedBackground } from "@/components/animated-background"
import { ErrorBoundary } from "@/components/error-boundary"
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
    <div className="flex min-h-screen overflow-hidden bg-gradient-to-br from-[oklch(0.12_0.02_250)] via-[oklch(0.10_0.03_240)] to-[oklch(0.12_0.02_250)] gradient-animate relative">
      <AnimatedBackground />
      <ErrorBoundary>
        <Sidebar />
        <div className="flex flex-1 flex-col min-w-0 w-full md:pl-64">
          <TopBar />
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-full" role="main">
            <div className="max-w-[1600px] mx-auto w-full">
              <ErrorBoundary>
                <header className="mb-4 md:mb-6">
                  <h1 className="text-2xl md:text-3xl font-bold text-[oklch(0.95_0.01_250)] mb-2">Settings</h1>
                  <p className="text-sm md:text-base text-[oklch(0.60_0.02_250)]">Configure your LoanLife Edge experience</p>
                </header>

                <div className="space-y-4 md:space-y-6 max-w-3xl">
            {/* Appearance */}
            <Card className="bg-[oklch(0.14_0.02_250)] border-[oklch(0.25_0.04_250)] p-4 md:p-6">
              <div className="flex items-center gap-3 mb-4">
                {theme === "dark" ? (
                  <Moon className="h-5 w-5 text-[oklch(0.55_0.20_220)] flex-shrink-0" aria-hidden="true" />
                ) : (
                  <Sun className="h-5 w-5 text-[oklch(0.75_0.18_65)] flex-shrink-0" aria-hidden="true" />
                )}
                <h2 className="text-lg font-semibold text-[oklch(0.95_0.01_250)]">Appearance</h2>
              </div>
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-[oklch(0.90_0.01_250)] mb-1">Theme</div>
                    <div className="text-sm text-[oklch(0.60_0.02_250)]">Choose your interface theme</div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Button
                      variant={theme === "dark" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setTheme("dark")}
                      className={
                        theme === "dark"
                          ? "bg-[oklch(0.55_0.20_220)] hover:bg-[oklch(0.60_0.22_220)]"
                          : "border-[oklch(0.30_0.04_250)]"
                      }
                      aria-label="Dark theme"
                      aria-pressed={theme === "dark"}
                    >
                      Dark
                    </Button>
                    <Button
                      variant={theme === "light" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setTheme("light")}
                      className="border-[oklch(0.30_0.04_250)]"
                      aria-label="Light theme"
                      aria-pressed={theme === "light"}
                    >
                      Light
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            {/* Notifications */}
            <Card className="bg-[oklch(0.14_0.02_250)] border-[oklch(0.25_0.04_250)] p-4 md:p-6">
              <div className="flex items-center gap-3 mb-4">
                <Bell className="h-5 w-5 text-[oklch(0.55_0.20_220)] flex-shrink-0" aria-hidden="true" />
                <h2 className="text-lg font-semibold text-[oklch(0.95_0.01_250)]">Notifications</h2>
              </div>
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-[oklch(0.90_0.01_250)] mb-1">Risk Alerts</div>
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
                    aria-label={`Risk alerts ${notifications ? "enabled" : "disabled"}`}
                    aria-pressed={notifications}
                  >
                    {notifications ? "Enabled" : "Disabled"}
                  </Button>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-[oklch(0.90_0.01_250)] mb-1">Sound Effects</div>
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
                    aria-label={`Sound effects ${soundEffects ? "on" : "off"}`}
                    aria-pressed={soundEffects}
                  >
                    {soundEffects ? "On" : "Off"}
                  </Button>
                </div>
              </div>
            </Card>

            {/* Security */}
            <Card className="bg-[oklch(0.14_0.02_250)] border-[oklch(0.25_0.04_250)] p-4 md:p-6">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="h-5 w-5 text-[oklch(0.55_0.20_220)] flex-shrink-0" aria-hidden="true" />
                <h2 className="text-lg font-semibold text-[oklch(0.95_0.01_250)]">Security</h2>
              </div>
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-[oklch(0.90_0.01_250)] mb-1">Two-Factor Authentication</div>
                    <div className="text-sm text-[oklch(0.60_0.02_250)]">Enhanced account security</div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-[oklch(0.30_0.04_250)] text-[oklch(0.90_0.01_250)] bg-transparent flex-shrink-0"
                    aria-label="Configure two-factor authentication"
                  >
                    Configure
                  </Button>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-[oklch(0.90_0.01_250)] mb-1">Change Password</div>
                    <div className="text-sm text-[oklch(0.60_0.02_250)]">Update your login credentials</div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-[oklch(0.30_0.04_250)] text-[oklch(0.90_0.01_250)] bg-transparent flex-shrink-0"
                    aria-label="Change password"
                  >
                    Update
                  </Button>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-[oklch(0.90_0.01_250)] mb-1">API Keys</div>
                    <div className="text-sm text-[oklch(0.60_0.02_250)]">Manage integration tokens</div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-[oklch(0.30_0.04_250)] text-[oklch(0.90_0.01_250)] bg-transparent flex-shrink-0"
                    aria-label="Manage API keys"
                  >
                    Manage
                  </Button>
                </div>
              </div>
            </Card>

            {/* Data & Sync */}
            <Card className="bg-[oklch(0.14_0.02_250)] border-[oklch(0.25_0.04_250)] p-4 md:p-6">
              <div className="flex items-center gap-3 mb-4">
                <Database className="h-5 w-5 text-[oklch(0.55_0.20_220)] flex-shrink-0" aria-hidden="true" />
                <h2 className="text-lg font-semibold text-[oklch(0.95_0.01_250)]">Data & Sync</h2>
              </div>
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-[oklch(0.90_0.01_250)] mb-1">Blockchain Sync</div>
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
                    aria-label={`Blockchain sync ${blockchainSync ? "active" : "paused"}`}
                    aria-pressed={blockchainSync}
                  >
                    {blockchainSync ? "Active" : "Paused"}
                  </Button>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-[oklch(0.90_0.01_250)] mb-1">Offline Mode</div>
                    <div className="text-sm text-[oklch(0.60_0.02_250)]">Work without internet connection</div>
                  </div>
                  <span className="text-sm text-[oklch(0.70_0.25_145)] flex-shrink-0" aria-label="Offline mode ready">Ready</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-[oklch(0.90_0.01_250)] mb-1">Auto-Refresh Data</div>
                    <div className="text-sm text-[oklch(0.60_0.02_250)]">Update dashboard every 60 seconds</div>
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
                    aria-label={`Auto-refresh ${autoRefresh ? "on" : "off"}`}
                    aria-pressed={autoRefresh}
                  >
                    {autoRefresh ? "On" : "Off"}
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="bg-[oklch(0.14_0.02_250)] border-[oklch(0.25_0.04_250)] p-4 md:p-6">
              <div className="flex items-center gap-3 mb-4">
                <Globe className="h-5 w-5 text-[oklch(0.55_0.20_220)] flex-shrink-0" aria-hidden="true" />
                <h2 className="text-lg font-semibold text-[oklch(0.95_0.01_250)]">Language & Region</h2>
              </div>
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                  <div className="flex-1 min-w-0">
                    <label className="font-medium text-[oklch(0.90_0.01_250)] mb-1 block">Display Language</label>
                    <div className="text-sm text-[oklch(0.60_0.02_250)]">Choose your preferred language</div>
                  </div>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="bg-[oklch(0.18_0.03_250)] border border-[oklch(0.30_0.04_250)] text-[oklch(0.90_0.01_250)] px-3 py-1.5 rounded-md text-sm flex-shrink-0 w-full sm:w-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[oklch(0.55_0.20_220)]"
                    aria-label="Display language"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                    <option value="zh">Chinese</option>
                  </select>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-[oklch(0.90_0.01_250)] mb-1">Time Zone</div>
                    <div className="text-sm text-[oklch(0.60_0.02_250)]">UTC-5 (Eastern Time)</div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-[oklch(0.30_0.04_250)] text-[oklch(0.90_0.01_250)] bg-transparent flex-shrink-0"
                    aria-label="Change time zone"
                  >
                    Change
                  </Button>
                </div>
              </div>
            </Card>

            {/* System Info */}
            <Card className="bg-[oklch(0.14_0.02_250)] border-[oklch(0.25_0.04_250)] p-4 md:p-6">
              <h2 className="text-lg font-semibold text-[oklch(0.95_0.01_250)] mb-4">System Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
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
              </ErrorBoundary>
            </div>
          </main>
        </div>
      </ErrorBoundary>
    </div>
  )
}
