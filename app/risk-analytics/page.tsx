"use client"

import { Sidebar } from "@/components/sidebar"
import { TopBar } from "@/components/top-bar"
import { AnimatedBackground } from "@/components/animated-background"
import { Shield, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react"
import { Card } from "@/components/ui/card"

export default function RiskAnalyticsPage() {
  const riskMetrics = [
    { label: "Portfolio Risk Score", value: "68", trend: "+3", status: "warning" },
    { label: "Default Probability", value: "12.4%", trend: "+1.2%", status: "warning" },
    { label: "Concentration Risk", value: "Medium", trend: "Stable", status: "neutral" },
    { label: "Market Risk Exposure", value: "$4.2M", trend: "-$200K", status: "good" },
  ]

  const predictions = [
    {
      period: "30 Days",
      probability: "8.2%",
      confidence: "94%",
      trend: "up",
      affected: 3,
    },
    {
      period: "60 Days",
      probability: "15.7%",
      confidence: "87%",
      trend: "up",
      affected: 7,
    },
    {
      period: "90 Days",
      probability: "22.1%",
      confidence: "79%",
      trend: "up",
      affected: 11,
    },
  ]

  return (
    <div className="flex min-h-screen overflow-hidden bg-gradient-to-br from-[oklch(0.12_0.02_250)] via-[oklch(0.10_0.03_240)] to-[oklch(0.12_0.02_250)] gradient-animate relative">
      <AnimatedBackground />
      <Sidebar />
      <div className="flex flex-1 flex-col min-w-0 w-full md:pl-64">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6">
          <div className="mb-4 sm:mb-6">
            <h1 className="text-xl sm:text-2xl font-bold text-[oklch(0.95_0.01_250)] mb-1 sm:mb-2">Risk Analytics</h1>
            <p className="text-sm sm:text-base text-[oklch(0.60_0.02_250)]">AI-powered predictive risk assessment</p>
          </div>

          {/* Risk Metrics Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
            {riskMetrics.map((metric, idx) => (
              <Card key={idx} className="bg-[oklch(0.14_0.02_250)] border-[oklch(0.25_0.04_250)] p-3 sm:p-4">
                <div className="text-[10px] sm:text-xs text-[oklch(0.60_0.02_250)] mb-1 sm:mb-2">{metric.label}</div>
                <div className="text-xl sm:text-2xl font-bold text-[oklch(0.95_0.01_250)] mb-1">{metric.value}</div>
                <div
                  className={`text-xs sm:text-sm flex items-center gap-1 ${
                    metric.status === "good"
                      ? "text-[oklch(0.70_0.25_145)]"
                      : metric.status === "warning"
                        ? "text-[oklch(0.75_0.18_65)]"
                        : "text-[oklch(0.60_0.02_250)]"
                  }`}
                >
                  {metric.status === "good" && <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4" />}
                  {metric.status === "warning" && <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />}
                  {metric.trend}
                </div>
              </Card>
            ))}
          </div>

          {/* Predictive Analysis */}
          <Card className="bg-[oklch(0.14_0.02_250)] border-[oklch(0.25_0.04_250)] p-4 sm:p-6 mb-4 sm:mb-6">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="relative flex-shrink-0">
                <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-[oklch(0.60_0.18_280)] animate-shield-pulse" />
                <div className="absolute inset-0 blur-md bg-[oklch(0.60_0.18_280)] opacity-50" />
              </div>
              <div className="min-w-0">
                <h2 className="text-base sm:text-lg font-semibold text-[oklch(0.95_0.01_250)]">AI Breach Predictions</h2>
                <p className="text-xs sm:text-sm text-[oklch(0.60_0.02_250)]">ML-powered covenant breach forecasting</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              {predictions.map((pred, idx) => (
                <div
                  key={idx}
                  className="bg-[oklch(0.10_0.02_250)] rounded-lg p-3 sm:p-4 border border-[oklch(0.20_0.04_250)] hover:border-[oklch(0.35_0.08_250)] transition-all duration-300 hover:transform hover:scale-105 cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-2 sm:mb-3">
                    <div className="text-xs sm:text-sm font-semibold text-[oklch(0.80_0.02_250)]">{pred.period}</div>
                    <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-[oklch(0.75_0.18_65)] animate-pulse flex-shrink-0" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-[oklch(0.65_0.22_25)] mb-1">{pred.probability}</div>
                  <div className="text-[10px] sm:text-xs text-[oklch(0.60_0.02_250)] mb-2 sm:mb-3">Breach Probability</div>
                  <div className="flex items-center justify-between text-[10px] sm:text-xs">
                    <span className="text-[oklch(0.60_0.02_250)]">Confidence: {pred.confidence}</span>
                    <span className="text-[oklch(0.75_0.18_65)]">{pred.affected} loans</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Risk Factors */}
          <Card className="bg-[oklch(0.14_0.02_250)] border-[oklch(0.25_0.04_250)] p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold text-[oklch(0.95_0.01_250)] mb-3 sm:mb-4">Top Risk Factors</h2>
            <div className="space-y-3">
              {[
                { factor: "Market Volatility", impact: "High", score: 8.7 },
                { factor: "Industry Concentration", impact: "Medium", score: 6.3 },
                { factor: "Interest Rate Changes", impact: "Medium", score: 5.9 },
                { factor: "Regulatory Changes", impact: "Low", score: 3.2 },
              ].map((risk, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1 gap-2">
                      <span className="text-xs sm:text-sm font-medium text-[oklch(0.90_0.01_250)] truncate">{risk.factor}</span>
                      <span className="text-xs sm:text-sm font-mono text-[oklch(0.60_0.02_250)] flex-shrink-0">{risk.score}</span>
                    </div>
                    <div className="h-2 bg-[oklch(0.10_0.02_250)] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[oklch(0.75_0.18_65)] to-[oklch(0.65_0.22_25)] transition-all duration-1000"
                        style={{ width: `${risk.score * 10}%` }}
                      />
                    </div>
                  </div>
                  <span
                    className={`text-[10px] sm:text-xs px-2 py-1 rounded flex-shrink-0 ${
                      risk.impact === "High"
                        ? "bg-[oklch(0.65_0.22_25)] text-white"
                        : risk.impact === "Medium"
                          ? "bg-[oklch(0.75_0.18_65)] text-white"
                          : "bg-[oklch(0.70_0.25_145)] text-white"
                    }`}
                  >
                    {risk.impact}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </main>
      </div>
    </div>
  )
}
