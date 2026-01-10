"use client"

import { Card } from "@/components/ui/card"
import { Leaf, Users, Shield, CheckCircle2, AlertCircle } from "lucide-react"

const esgMetrics = [
  { category: "Environmental", icon: Leaf, score: 87, status: "compliant", color: "oklch(0.70_0.25_145)" },
  { category: "Social", icon: Users, score: 92, status: "compliant", color: "oklch(0.55_0.20_220)" },
  { category: "Governance", icon: Shield, score: 78, status: "warning", color: "oklch(0.75_0.20_60)" },
]

export function ESGCompliance() {
  return (
    <Card className="p-6 bg-[oklch(0.15_0.03_250)] border-[oklch(0.25_0.04_250)]">
      <h3 className="text-xl font-semibold text-[oklch(0.95_0.01_250)] mb-4">ESG Compliance</h3>
      <div className="space-y-4">
        {esgMetrics.map((metric) => (
          <div
            key={metric.category}
            className="p-4 rounded-lg bg-[oklch(0.18_0.03_250)] border border-[oklch(0.25_0.04_250)] hover:glow-blue transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-[${metric.color}]/10`}>
                  <metric.icon className="h-5 w-5" style={{ color: metric.color }} />
                </div>
                <span className="text-sm font-medium text-[oklch(0.90_0.01_250)]">{metric.category}</span>
              </div>
              {metric.status === "compliant" ? (
                <CheckCircle2 className="h-5 w-5 text-[oklch(0.70_0.25_145)]" />
              ) : (
                <AlertCircle className="h-5 w-5 text-[oklch(0.75_0.20_60)]" />
              )}
            </div>
            <div className="flex items-center justify-between">
              <div className="flex-1 mr-4">
                <div className="h-2 bg-[oklch(0.22_0.03_250)] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${metric.score}%`,
                      backgroundColor: metric.color,
                      boxShadow: metric.status === "compliant" ? `0 0 10px ${metric.color}` : "none",
                    }}
                  />
                </div>
              </div>
              <span className="text-lg font-bold" style={{ color: metric.color }}>
                {metric.score}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
