"use client"

import { Sidebar } from "@/components/sidebar"
import { TopBar } from "@/components/top-bar"
import { Rocket, Shield, Database, Brain, Lock, TrendingUp, Sparkles, Zap, ArrowRight, Play } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useState } from "react"
import { AnimatedBackground } from "@/components/animated-background"
import Link from "next/link"

export default function LandingPage() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  return (
    <div className="flex min-h-screen overflow-hidden bg-gradient-to-br from-[oklch(0.12_0.02_250)] via-[oklch(0.10_0.03_240)] to-[oklch(0.12_0.02_250)] gradient-animate">
      <Sidebar />
      <div className="flex flex-1 flex-col min-w-0 w-full md:pl-64">
        <TopBar />
        <main className="flex-1 overflow-y-auto">
          <section className="relative min-h-[85vh] sm:min-h-[90vh] flex items-center justify-center overflow-hidden py-8 sm:py-12 md:py-16">
            {/* Video Background */}
            <div className="absolute inset-0 z-0">
              <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-30">
                <source src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/grok-video-d645b48b-4d52-44c8-bfa2-3caa54324d6f%20%283%29-e8IKmCS6ARThfbKzIkKWqJYTuX4nus.mp4" type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[oklch(0.10_0.03_240)]/50 to-[oklch(0.10_0.03_240)]" />
            </div>

            {/* Hero Content */}
            <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
              <div className="mb-6 sm:mb-8 inline-block">
                <div className="relative">
                  <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-4 sm:mb-6 leading-tight">
                    <span
                      className="inline-block bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent animate-pulse-glow"
                      style={{
                        textShadow: "0 0 40px rgba(34, 211, 238, 0.5), 0 0 60px rgba(168, 85, 247, 0.3)",
                      }}
                    >
                      LoanLife
                    </span>
                    <br />
                    <span
                      className="inline-block bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 bg-clip-text text-transparent"
                      style={{
                        textShadow: "0 0 40px rgba(236, 72, 153, 0.5), 0 0 60px rgba(34, 211, 238, 0.3)",
                      }}
                    >
                      EDGE
                    </span>
                  </h1>
                  <div className="absolute inset-0 blur-3xl bg-gradient-to-r from-cyan-500/30 via-purple-500/30 to-pink-500/30 -z-10 animate-pulse" />
                </div>
              </div>

              <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-cyan-300 mb-3 sm:mb-4 font-light tracking-wide px-2">
                AI-Powered Loan Risk Management
              </p>
              <p className="text-sm sm:text-base md:text-lg text-purple-300/80 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed px-4">
                Experience next-generation banking security with digital twin technology, blockchain audit trails, and
                real-time predictive analytics
              </p>

              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center mb-12 sm:mb-16 px-4">
                <Link href="/login" className="w-full sm:w-auto">
                  <Button className="w-full sm:w-auto bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-base sm:text-lg px-8 sm:px-12 py-4 sm:py-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-[0_0_30px_rgba(34,211,238,0.5)] hover:shadow-[0_0_50px_rgba(34,211,238,0.8)]">
                    <Rocket className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    Get Started
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="w-full sm:w-auto border-2 border-pink-500 text-pink-400 hover:bg-pink-500/10 text-base sm:text-lg px-8 sm:px-12 py-4 sm:py-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-[0_0_30px_rgba(236,72,153,0.3)] hover:shadow-[0_0_50px_rgba(236,72,153,0.6)] bg-transparent"
                >
                  <Play className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  Watch Demo
                </Button>
              </div>

              {/* Floating Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto px-4">
                {[
                  { value: "99.9%", label: "Uptime", color: "from-green-400 to-emerald-600" },
                  { value: "<0.1s", label: "Response Time", color: "from-cyan-400 to-blue-600" },
                  { value: "256-bit", label: "Encryption", color: "from-purple-400 to-pink-600" },
                ].map((stat, i) => (
                  <div
                    key={i}
                    className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-md border border-white/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 transform hover:scale-105 transition-all duration-300"
                    style={{
                      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.1)",
                    }}
                  >
                    <div
                      className={`text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-1 sm:mb-2`}
                    >
                      {stat.value}
                    </div>
                    <div className="text-xs sm:text-sm md:text-base text-gray-300 font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 relative">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-3 sm:mb-4 px-4">
                <span
                  className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent"
                  style={{ textShadow: "0 0 50px rgba(34, 211, 238, 0.3)" }}
                >
                  Powerful Features
                </span>
              </h2>
              <p className="text-center text-purple-300/70 text-base sm:text-lg md:text-xl mb-8 sm:mb-12 md:mb-16 px-4">
                Everything you need to manage loan portfolios with confidence
              </p>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12">
                {/* Feature Image Card 1 */}
                <Card
                  className="relative overflow-hidden border-2 border-transparent hover:border-cyan-500/50 bg-gradient-to-br from-cyan-950/30 to-blue-950/30 backdrop-blur-sm transition-all duration-500 transform hover:scale-105 cursor-pointer group"
                  onMouseEnter={() => setHoveredCard(0)}
                  onMouseLeave={() => setHoveredCard(null)}
                  style={{
                    boxShadow:
                      hoveredCard === 0 ? "0 0 60px rgba(34, 211, 238, 0.4)" : "0 0 20px rgba(34, 211, 238, 0.1)",
                  }}
                >
                  <div className="relative h-48 sm:h-64 md:h-80">
                    <Image
                      src="/images/copilot-20260110-133451.png"
                      alt="Portfolio Dashboard"
                      fill
                      className="object-cover opacity-70 group-hover:opacity-100 transition-opacity duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.10_0.03_240)] via-transparent to-transparent" />
                  </div>
                  <div className="p-4 sm:p-6 md:p-8 relative">
                    <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                      <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-cyan-500/20 border border-cyan-500/50 flex-shrink-0">
                        <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-cyan-400" />
                      </div>
                      <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-cyan-300">Portfolio Analytics</h3>
                    </div>
                    <p className="text-sm sm:text-base md:text-lg text-purple-200/80 leading-relaxed">
                      Real-time portfolio monitoring with AI-powered risk prediction and ESG compliance tracking.
                      Visualize trends and make data-driven decisions instantly.
                    </p>
                  </div>
                </Card>

                {/* Feature Image Card 2 */}
                <Card
                  className="relative overflow-hidden border-2 border-transparent hover:border-pink-500/50 bg-gradient-to-br from-pink-950/30 to-purple-950/30 backdrop-blur-sm transition-all duration-500 transform hover:scale-105 cursor-pointer group"
                  onMouseEnter={() => setHoveredCard(1)}
                  onMouseLeave={() => setHoveredCard(null)}
                  style={{
                    boxShadow:
                      hoveredCard === 1 ? "0 0 60px rgba(236, 72, 153, 0.4)" : "0 0 20px rgba(236, 72, 153, 0.1)",
                  }}
                >
                  <div className="relative h-48 sm:h-64 md:h-80">
                    <Image
                      src="/images/copilot-20260110-133458.png"
                      alt="Security Shield"
                      fill
                      className="object-cover opacity-70 group-hover:opacity-100 transition-opacity duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.10_0.03_240)] via-transparent to-transparent" />
                  </div>
                  <div className="p-4 sm:p-6 md:p-8 relative">
                    <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                      <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-pink-500/20 border border-pink-500/50 flex-shrink-0">
                        <Shield className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-pink-400" />
                      </div>
                      <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-pink-300">Military-Grade Security</h3>
                    </div>
                    <p className="text-sm sm:text-base md:text-lg text-purple-200/80 leading-relaxed">
                      Bank-level 256-bit encryption with blockchain-verified audit logs. Your data is protected with the
                      most advanced security protocols available.
                    </p>
                  </div>
                </Card>
              </div>

              {/* Feature Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {[
                  {
                    icon: Brain,
                    title: "AI Digital Twins",
                    description: "Predictive loan modeling with machine learning algorithms",
                    gradient: "from-purple-500 to-pink-600",
                    glow: "rgba(168, 85, 247, 0.4)",
                  },
                  {
                    icon: Lock,
                    title: "Blockchain Audit",
                    description: "Immutable transaction records and compliance trails",
                    gradient: "from-cyan-500 to-blue-600",
                    glow: "rgba(34, 211, 238, 0.4)",
                  },
                  {
                    icon: Zap,
                    title: "Real-Time Alerts",
                    description: "Instant covenant breach detection and notifications",
                    gradient: "from-yellow-500 to-orange-600",
                    glow: "rgba(234, 179, 8, 0.4)",
                  },
                  {
                    icon: Database,
                    title: "Portfolio Management",
                    description: "Centralized dashboard for all loan assets",
                    gradient: "from-green-500 to-emerald-600",
                    glow: "rgba(34, 197, 94, 0.4)",
                  },
                  {
                    icon: Sparkles,
                    title: "ESG Compliance",
                    description: "Track sustainability and ethical standards",
                    gradient: "from-indigo-500 to-purple-600",
                    glow: "rgba(99, 102, 241, 0.4)",
                  },
                  {
                    icon: TrendingUp,
                    title: "Risk Scoring",
                    description: "Advanced analytics for loan health assessment",
                    gradient: "from-pink-500 to-rose-600",
                    glow: "rgba(236, 72, 153, 0.4)",
                  },
                ].map((feature, index) => {
                  const Icon = feature.icon
                  return (
                    <Card
                      key={index}
                      className="relative overflow-hidden bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-md border-2 border-white/20 hover:border-white/40 p-4 sm:p-6 md:p-8 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 cursor-pointer group"
                      onMouseEnter={() => setHoveredCard(index + 10)}
                      onMouseLeave={() => setHoveredCard(null)}
                      style={{
                        boxShadow:
                          hoveredCard === index + 10 ? `0 20px 60px ${feature.glow}` : "0 8px 32px rgba(0, 0, 0, 0.3)",
                      }}
                    >
                      <div className="relative mb-4 sm:mb-6">
                        <div className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-r ${feature.gradient} inline-block`}>
                          <Icon className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-white" />
                        </div>
                        <div
                          className={`absolute inset-0 blur-2xl bg-gradient-to-r ${feature.gradient} opacity-30 group-hover:opacity-60 transition-opacity -z-10`}
                        />
                      </div>
                      <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-2 sm:mb-3">{feature.title}</h3>
                      <p className="text-sm sm:text-base text-gray-300 leading-relaxed">{feature.description}</p>
                      <ArrowRight className="absolute bottom-4 sm:bottom-6 md:bottom-8 right-4 sm:right-6 md:right-8 h-5 w-5 sm:h-6 sm:w-6 text-white/40 group-hover:text-white group-hover:translate-x-2 transition-all" />
                    </Card>
                  )
                })}
              </div>
            </div>
          </section>

          <section className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10" />
            <div className="absolute inset-0">
              <div className="absolute top-1/4 left-1/4 w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />
              <div
                className="absolute bottom-1/4 right-1/4 w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse"
                style={{ animationDelay: "1s" }}
              />
            </div>

            <div className="max-w-4xl mx-auto text-center relative z-10">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 px-4">
                <span
                  className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent"
                  style={{ textShadow: "0 0 80px rgba(34, 211, 238, 0.5)" }}
                >
                  Ready to Transform Your
                  <br />
                  Loan Portfolio?
                </span>
              </h2>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-purple-300/80 mb-8 sm:mb-12 leading-relaxed px-4">
                Join leading financial institutions using AI-powered risk management
              </p>
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center px-4">
                <Link href="/login" className="w-full sm:w-auto">
                  <Button
                    className="w-full sm:w-auto bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-base sm:text-lg md:text-xl px-12 sm:px-14 md:px-16 py-5 sm:py-6 md:py-8 rounded-xl sm:rounded-2xl font-bold transition-all duration-300 transform hover:scale-110"
                    style={{ boxShadow: "0 0 60px rgba(34, 211, 238, 0.6)" }}
                  >
                    <Rocket className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6" />
                    Start Free Trial
                  </Button>
                </Link>
                <Link href="/portfolio" className="w-full sm:w-auto">
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto border-2 border-pink-500 text-pink-400 hover:bg-pink-500/10 text-base sm:text-lg md:text-xl px-12 sm:px-14 md:px-16 py-5 sm:py-6 md:py-8 rounded-xl sm:rounded-2xl font-bold transition-all duration-300 transform hover:scale-110 bg-transparent"
                    style={{ boxShadow: "0 0 60px rgba(236, 72, 153, 0.4)" }}
                  >
                    Explore Platform
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        </main>
      </div>
      <AnimatedBackground />
    </div>
  )
}
