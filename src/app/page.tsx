'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Search, Target, Zap, Building2, BarChart3, Database } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background selection:bg-blue-500/30">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl border-b border-white/5 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">VC</span>
            </div>
            <span className="font-semibold text-lg tracking-tight">Scout</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground">Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-white text-black hover:bg-gray-200">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="pt-32 pb-16 overflow-hidden relative">
        {/* Background Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Hero Section */}
        <section className="relative max-w-7xl mx-auto px-6 pt-20 pb-32 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm font-medium mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
            Next-Generation AI Sourcing
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150 text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-white/40">
            Stop hunting.<br />Start discovering.
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300">
            Turn your fund's investment thesis into an always-on discovery engine.
            Live AI enrichment, automatic scoring, and unified CRM for modern venture teams.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-500">
            <Link href="/signup">
              <Button size="lg" className="h-14 px-8 text-base bg-blue-600 hover:bg-blue-700 text-white group shadow-[0_0_40px_-10px_rgba(37,99,235,0.5)]">
                Start Scouting Free
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="h-14 px-8 text-base border-white/10 hover:bg-white/5">
                View Demo
              </Button>
            </Link>
          </div>

          {/* App Preview Mockup */}
          <div className="mt-24 relative mx-auto w-full max-w-5xl animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-700">
            <div className="relative rounded-xl border border-white/10 bg-black/50 p-2 backdrop-blur-sm shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent z-10 pointer-events-none rounded-xl" />
              <div className="rounded-lg overflow-hidden border border-white/5 bg-background">
                <div className="h-8 bg-muted/30 border-b border-white/5 flex items-center px-4 gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/50" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                  <div className="w-3 h-3 rounded-full bg-green-500/50" />
                </div>
                <div className="p-6 grid grid-cols-4 gap-6 opacity-80">
                  <div className="col-span-1 space-y-4">
                    <div className="h-6 w-32 bg-white/5 rounded" />
                    <div className="h-4 w-24 bg-white/5 rounded" />
                    <div className="h-4 w-28 bg-white/5 rounded" />
                    <div className="h-4 w-20 bg-white/5 rounded" />
                  </div>
                  <div className="col-span-3 space-y-4">
                    <div className="flex gap-4">
                      <div className="h-12 w-full bg-white/5 rounded" />
                      <div className="h-12 w-32 bg-white/5 rounded" />
                    </div>
                    <div className="h-32 w-full bg-white/5 rounded" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="max-w-7xl mx-auto px-6 py-32 border-t border-white/5">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Precision intelligence at scale</h2>
            <p className="text-muted-foreground text-lg">Leave manual data entry in the past. Focus on high-conviction decisions.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6 border border-blue-500/20">
                <Search className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Live Web Enrichment</h3>
              <p className="text-muted-foreground leading-relaxed">
                Instantly scrape and summarize any company's website using LLMs. Go from a URL to a 2-page diligence brief in seconds.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center mb-6 border border-green-500/20">
                <Target className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Thesis-driven Scoring</h3>
              <p className="text-muted-foreground leading-relaxed">
                Define your fund's exact investment mandate. Get instant "Fit / Pass" decisions backed by concrete reasoning and red flags.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-6 border border-purple-500/20">
                <Database className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Unified Smart CRM</h3>
              <p className="text-muted-foreground leading-relaxed">
                Save searches, build custom lists, track statuses, and leave notes. Everything persists securely in the cloud.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-[10px]">VC</span>
            </div>
            <span className="font-medium text-sm text-muted-foreground">© 2026 VC Scout. All rights reserved.</span>
          </div>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link href="/login" className="hover:text-foreground">Log in</Link>
            <Link href="/signup" className="hover:text-foreground">Sign up</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
