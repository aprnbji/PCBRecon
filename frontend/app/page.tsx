"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart3,
  CheckCircle2,
  ChevronRight,
  Github,
  Linkedin,
  ShieldAlert,
  Zap,
  Github as Github2,
  ExternalLink,
  ArrowRight,
} from "lucide-react"

export default function LandingPage() {
  const [isHovering, setIsHovering] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-background text-foreground dark">
      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-gradient-to-br from-accent-blue to-accent-green flex items-center justify-center">
                <ShieldAlert className="w-5 h-5 text-accent-foreground" />
              </div>
              <span className="text-xl font-bold">PCBRecon</span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm hover:text-primary transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="text-sm hover:text-primary transition-colors">
                How It Works
              </a>
              <a href="#" className="text-sm hover:text-primary transition-colors">
                Docs
              </a>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="outline" size="sm" className="border-primary/50 hover:border-primary bg-transparent">
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="bg-accent hover:bg-accent/80 text-accent-foreground">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent-blue/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-purple/10 rounded-full blur-3xl"></div>
        </div>

        <div className="mx-auto max-w-7xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 mb-6">
                <Zap className="w-4 h-4 text-accent" />
                <span className="text-sm text-muted-foreground">AI-Powered PCB Security Analysis</span>
              </div>

              <h1 className="text-5xl md:text-6xl font-bold text-balance mb-6 leading-tight">
                Analyze PCBs with{" "}
                <span className="bg-gradient-to-r from-accent-blue to-accent-green bg-clip-text text-transparent">
                  AI Intelligence
                </span>
              </h1>

              <p className="text-lg text-muted-foreground text-balance mb-8">
                Detect vulnerabilities, identify components, and audit hardware security with machine learning. PCBRecon
                turns complex circuit layouts into actionable security insights.
              </p>

              <div className="flex gap-4 flex-wrap">
                <Link href="/register">
                  <Button size="lg" className="bg-accent hover:bg-accent/80 text-accent-foreground">
                    Try Demo <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link href="#how-it-works">
                  <Button size="lg" variant="outline" className="border-primary/50 hover:border-primary bg-transparent">
                    Learn More
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-12 pt-8 border-t border-border/40">
                <div>
                  <div className="text-2xl font-bold text-accent">10K+</div>
                  <p className="text-sm text-muted-foreground">PCBs Analyzed</p>
                </div>
                <div>
                  <div className="text-2xl font-bold text-accent-green">99.8%</div>
                  <p className="text-sm text-muted-foreground">Detection Accuracy</p>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">24/7</div>
                  <p className="text-sm text-muted-foreground">API Availability</p>
                </div>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="relative h-96 md:h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl border border-primary/30 overflow-hidden">
                <svg viewBox="0 0 300 300" className="w-full h-full opacity-60" xmlns="http://www.w3.org/2000/svg">
                  {/* PCB Circuit visualization */}
                  <circle
                    cx="150"
                    cy="150"
                    r="120"
                    fill="none"
                    stroke="oklch(0.5 0.22 250)"
                    strokeWidth="1"
                    opacity="0.3"
                  />
                  <circle
                    cx="150"
                    cy="150"
                    r="90"
                    fill="none"
                    stroke="oklch(0.6 0.2 142.5)"
                    strokeWidth="1"
                    opacity="0.3"
                  />
                  {/* Nodes */}
                  {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
                    const rad = (angle * Math.PI) / 180
                    const x = 150 + 100 * Math.cos(rad)
                    const y = 150 + 100 * Math.sin(rad)
                    return (
                      <g key={angle}>
                        <circle cx={x} cy={y} r="4" fill="oklch(0.6 0.2 142.5)" opacity="0.8" />
                        <circle
                          cx={x}
                          cy={y}
                          r="4"
                          fill="none"
                          stroke="oklch(0.6 0.2 142.5)"
                          strokeWidth="1"
                          opacity="0.4"
                          r="8"
                        />
                      </g>
                    )
                  })}
                  <circle cx="150" cy="150" r="8" fill="oklch(0.5 0.22 250)" />
                  {/* Lines */}
                  <line
                    x1="150"
                    y1="150"
                    x2="250"
                    y2="150"
                    stroke="oklch(0.5 0.22 250)"
                    strokeWidth="1"
                    opacity="0.3"
                  />
                  <line
                    x1="150"
                    y1="150"
                    x2="106"
                    y2="106"
                    stroke="oklch(0.6 0.2 142.5)"
                    strokeWidth="1"
                    opacity="0.3"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-border/40 bg-card/20">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-lg text-muted-foreground">Everything you need to audit and analyze PCBs</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: ShieldAlert,
                title: "Vulnerability Detection",
                description: "Identify security risks and debug interfaces automatically using advanced AI models",
              },
              {
                icon: BarChart3,
                title: "Component Analysis",
                description: "Detect and catalog components with detailed specifications and sourcing information",
              },
              {
                icon: Zap,
                title: "AI Chat Interface",
                description: "Ask questions about your PCB design and get instant, context-aware responses",
              },
              {
                icon: CheckCircle2,
                title: "Full CRUD Management",
                description: "Organize projects, upload images, and manage analysis results with ease",
              },
              {
                icon: Github2,
                title: "API Integration",
                description: "Integrate PCBRecon into your CI/CD pipelines for automated security audits",
              },
              {
                icon: ExternalLink,
                title: "Export Reports",
                description: "Generate PDF, Markdown, and JSON reports for stakeholders and compliance",
              },
            ].map((feature, idx) => (
              <Card
                key={idx}
                className="border-border/50 bg-card/50 hover:bg-card/80 transition-all hover:border-primary/50 cursor-pointer"
              >
                <CardHeader>
                  <feature.icon className="w-8 h-8 text-accent mb-2" />
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground">Simple 4-step process to analyze your PCBs</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                step: "1",
                title: "Upload PCB Image",
                description: "Share high-resolution PCB layouts in PNG or JPG format",
              },
              {
                step: "2",
                title: "AI Analysis",
                description: "Our models detect components, interfaces, and potential vulnerabilities",
              },
              {
                step: "3",
                title: "Review Results",
                description: "Examine annotated images and AI-generated component lists",
              },
              {
                step: "4",
                title: "Export Report",
                description: "Download comprehensive security audit reports in your preferred format",
              },
            ].map((item, idx) => (
              <div key={idx} className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-accent-foreground font-bold mb-4">
                    {item.step}
                  </div>
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
                {idx < 3 && (
                  <div className="hidden md:block absolute top-6 -right-3 text-muted-foreground/30">
                    <ChevronRight className="w-6 h-6" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary/10 to-accent/10 border-t border-border/40">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Analyze Your PCBs?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join hardware security teams worldwide using PCBRecon to identify vulnerabilities and optimize designs.
          </p>
          <Link href="/register">
            <Button size="lg" className="bg-accent hover:bg-accent/80 text-accent-foreground">
              Start Free Trial <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-card/20 py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded bg-gradient-to-br from-accent-blue to-accent-green flex items-center justify-center">
                  <ShieldAlert className="w-4 h-4 text-accent-foreground" />
                </div>
                <span className="font-bold">PCBRecon</span>
              </div>
              <p className="text-sm text-muted-foreground">AI-powered PCB security audit platform</p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    API Docs
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Careers
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <div className="flex gap-4">
                <a href="#" className="text-muted-foreground hover:text-accent transition">
                  <Github className="w-5 h-5" />
                </a>
                <a href="#" className="text-muted-foreground hover:text-accent transition">
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-border/40 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>&copy; 2025 PCBRecon. All rights reserved.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-foreground transition">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-foreground transition">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
