"use client"

import { Sidebar } from "@/components/sidebar"
import { TopBar } from "@/components/top-bar"
import { Bell, AlertTriangle, CheckCircle, Info, Shield, TrendingUp } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AnimatedBackground } from "@/components/animated-background"

const notifications = [
  {
    id: 1,
    type: "critical",
    icon: AlertTriangle,
    title: "Covenant Breach Alert",
    message: "Loan #LN-2847 has breached debt-to-equity ratio threshold (4.2:1 vs 3.5:1 limit)",
    time: "2 minutes ago",
    read: false,
  },
  {
    id: 2,
    type: "warning",
    icon: TrendingUp,
    title: "Risk Score Increase",
    message: "Portfolio XYZ risk score increased by 12% in the last 24 hours",
    time: "1 hour ago",
    read: false,
  },
  {
    id: 3,
    type: "success",
    icon: CheckCircle,
    title: "ESG Compliance Achieved",
    message: "Loan #LN-3921 has met all environmental sustainability targets",
    time: "3 hours ago",
    read: true,
  },
  {
    id: 4,
    type: "info",
    icon: Shield,
    title: "Security Update",
    message: "New blockchain sync completed successfully. All audit logs verified.",
    time: "5 hours ago",
    read: true,
  },
  {
    id: 5,
    type: "warning",
    icon: AlertTriangle,
    title: "Digital Twin Synchronization",
    message: "3 digital twins require manual review and approval",
    time: "1 day ago",
    read: true,
  },
  {
    id: 6,
    type: "info",
    icon: Info,
    title: "System Maintenance",
    message: "Scheduled maintenance window: Saturday 2:00 AM - 4:00 AM EST",
    time: "2 days ago",
    read: true,
  },
]

export default function NotificationsPage() {
  return (
    <div className="flex min-h-screen overflow-hidden bg-gradient-to-br from-background via-background to-background dark:from-[oklch(0.12_0.02_250)] dark:via-[oklch(0.10_0.03_240)] dark:to-[oklch(0.12_0.02_250)] gradient-animate relative">
      <AnimatedBackground />
      <Sidebar />
      <div className="flex flex-1 flex-col min-w-0 w-full md:pl-64">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6">
          <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-1 sm:mb-2">Notifications</h1>
              <p className="text-sm sm:text-base text-muted-foreground">Stay updated on critical alerts and system events</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-border text-foreground bg-transparent"
            >
              Mark All as Read
            </Button>
          </div>

          <div className="space-y-3 max-w-4xl">
            {notifications.map((notification) => {
              const Icon = notification.icon
              let iconColor = "text-muted-foreground"
              let bgColor = "bg-card"
              let borderColor = "border-border"

              if (notification.type === "critical") {
                iconColor = "text-[oklch(0.55_0.20_25)]"
                bgColor = notification.read ? "bg-card" : "bg-[oklch(0.16_0.03_25)]/30 dark:bg-[oklch(0.16_0.03_25)]/30"
                borderColor = "border-[oklch(0.35_0.15_25)]"
              } else if (notification.type === "warning") {
                iconColor = "text-[oklch(0.75_0.18_65)]"
                bgColor = notification.read ? "bg-card" : "bg-[oklch(0.16_0.03_65)]/20 dark:bg-[oklch(0.16_0.03_65)]/20"
                borderColor = "border-[oklch(0.35_0.12_65)]"
              } else if (notification.type === "success") {
                iconColor = "text-[oklch(0.70_0.25_145)]"
                borderColor = "border-[oklch(0.30_0.15_145)]"
              }

              return (
                <Card
                  key={notification.id}
                  className={`${bgColor} border ${borderColor} p-5 transition-all hover:border-[oklch(0.35_0.08_250)] cursor-pointer`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-lg bg-muted`}>
                      <Icon className={`h-5 w-5 ${iconColor}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-card-foreground">{notification.title}</h3>
                        {!notification.read && (
                          <div className="h-2 w-2 rounded-full bg-[oklch(0.55_0.20_220)] animate-pulse" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                      <span className="text-xs text-muted-foreground font-mono">{notification.time}</span>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>

          {notifications.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16">
              <Bell className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No notifications</h3>
              <p className="text-sm text-muted-foreground">You're all caught up!</p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
