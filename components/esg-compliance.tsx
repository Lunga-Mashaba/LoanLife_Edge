"use client"

import { Card } from "@/components/ui/card"
import { Leaf, Users, Shield, CheckCircle2, AlertCircle, Loader2 } from "lucide-react"
import { useLoans } from "@/hooks/use-loans"
import { useState, useEffect } from "react"
import { esgApi } from "@/lib/api/esg"

interface ESGMetric {
  category: "Environmental" | "Social" | "Governance"
  icon: typeof Leaf
  score: number
  status: "compliant" | "warning" | "at_risk"
  color: string
}

function getStatusFromScore(score: number): "compliant" | "warning" | "at_risk" {
  if (score >= 80) return "compliant"
  if (score >= 60) return "warning"
  return "at_risk"
}

export function ESGCompliance() {
  const { loans } = useLoans()
  const [aggregatedMetrics, setAggregatedMetrics] = useState<ESGMetric[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (loans.length === 0) {
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)

    async function fetchAggregatedESG() {
      const scores: { environmental: number[]; social: number[]; governance: number[] } = {
        environmental: [],
        social: [],
        governance: [],
      }

      // Fetch ESG scores for all loans
      for (const loan of loans) {
        try {
          const score = await esgApi.getScore(loan.id)
          scores.environmental.push(score.environmental_score)
          scores.social.push(score.social_score)
          scores.governance.push(score.governance_score)
        } catch (err) {
          console.error(`Failed to fetch ESG for loan ${loan.id}:`, err)
        }
      }

      if (cancelled) return

      // Calculate averages
      const avgEnvironmental = scores.environmental.length > 0
        ? scores.environmental.reduce((a, b) => a + b, 0) / scores.environmental.length
        : 0
      const avgSocial = scores.social.length > 0
        ? scores.social.reduce((a, b) => a + b, 0) / scores.social.length
        : 0
      const avgGovernance = scores.governance.length > 0
        ? scores.governance.reduce((a, b) => a + b, 0) / scores.governance.length
        : 0

      const metrics: ESGMetric[] = [
        {
          category: "Environmental",
          icon: Leaf,
          score: Math.round(avgEnvironmental),
          status: getStatusFromScore(avgEnvironmental),
          color: "oklch(0.70_0.25_145)",
        },
        {
          category: "Social",
          icon: Users,
          score: Math.round(avgSocial),
          status: getStatusFromScore(avgSocial),
          color: "oklch(0.55_0.20_220)",
        },
        {
          category: "Governance",
          icon: Shield,
          score: Math.round(avgGovernance),
          status: getStatusFromScore(avgGovernance),
          color: "oklch(0.75_0.20_60)",
        },
      ]

      setAggregatedMetrics(metrics)
      setLoading(false)
    }

    fetchAggregatedESG()

    return () => {
      cancelled = true
    }
  }, [loans])

  if (loading) {
    return (
      <Card className="p-6 bg-[oklch(0.15_0.03_250)] border-[oklch(0.25_0.04_250)]">
        <h3 className="text-xl font-semibold text-[oklch(0.95_0.01_250)] mb-4">ESG Compliance</h3>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-5 w-5 animate-spin text-[oklch(0.55_0.20_220)]" />
        </div>
      </Card>
    )
  }

  if (aggregatedMetrics.length === 0) {
    return (
      <Card className="p-6 bg-[oklch(0.15_0.03_250)] border-[oklch(0.25_0.04_250)]">
        <h3 className="text-xl font-semibold text-[oklch(0.95_0.01_250)] mb-4">ESG Compliance</h3>
        <div className="p-4 rounded-lg bg-[oklch(0.18_0.03_250)] border border-[oklch(0.25_0.04_250)]">
          <p className="text-sm text-[oklch(0.60_0.02_250)]">No ESG data available</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6 bg-[oklch(0.15_0.03_250)] border-[oklch(0.25_0.04_250)]">
      <h3 className="text-xl font-semibold text-[oklch(0.95_0.01_250)] mb-4">ESG Compliance</h3>
      <div className="space-y-4">
        {aggregatedMetrics.map((metric) => (
          <div
            key={metric.category}
            className="p-4 rounded-lg bg-[oklch(0.18_0.03_250)] border border-[oklch(0.25_0.04_250)] hover:border-[oklch(0.55_0.20_220)] transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg" style={{ backgroundColor: `${metric.color}20` }}>
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
