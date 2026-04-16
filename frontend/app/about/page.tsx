"use client";

import { Header } from "@/components/Header";
import { useRealtime } from "@/hooks/useRealtime";
import { Github, Linkedin, Mail, Globe, Code, Gamepad2, Trophy, Users } from "lucide-react";

export default function AboutPage() {
  const realtime = useRealtime();

  return (
    <main className="min-h-screen pb-20">
      <Header onlinePlayers={realtime.onlinePlayers} />
      
      <div className="mx-auto max-w-4xl px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <Gamepad2 className="h-12 w-12 text-radar" />
            <h1 className="text-5xl font-black text-white">NationChain</h1>
          </div>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            A blockchain-powered geopolitical strategy game where you control nations, wage wars, and dominate the world economy.
          </p>
        </div>

        {/* Game Features */}
        <section className="mb-12 rounded-lg border border-white/10 bg-steel p-8">
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
            <Trophy className="h-8 w-8 text-amber-400" />
            Game Features
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <FeatureCard
              icon="🌍"
              title="180 Real Countries"
              description="Own and manage real-world nations as NFTs on Ethereum Sepolia testnet"
            />
            <FeatureCard
              icon="⚔️"
              title="Strategic Warfare"
              description="Declare wars, form alliances, and conquer territories to expand your empire"
            />
            <FeatureCard
              icon="💰"
              title="Dynamic Economy"
              description="Manage GDP, resources, and earn GOV tokens through daily production"
            />
            <FeatureCard
              icon="🏗️"
              title="Build Infrastructure"
              description="Construct factories, barracks, and oil derricks to boost your nation's power"
            />
            <FeatureCard
              icon="📰"
              title="Real-World Events"
              description="Game mechanics affected by actual news and commodity prices"
            />
            <FeatureCard
              icon="🤝"
              title="Diplomacy System"
              description="Form alliances, trade resources, and negotiate with other players"
            />
          </div>
        </section>

        {/* Tech Stack */}
        <section className="mb-12 rounded-lg border border-white/10 bg-steel p-8">
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
            <Code className="h-8 w-8 text-radar" />
            Technology Stack
          </h2>
          <div className="grid gap-3 md:grid-cols-3">
            <TechBadge name="Next.js 14" category="Frontend" />
            <TechBadge name="TypeScript" category="Language" />
            <TechBadge name="Tailwind CSS" category="Styling" />
            <TechBadge name="Solidity" category="Smart Contracts" />
            <TechBadge name="Hardhat" category="Blockchain Dev" />
            <TechBadge name="Wagmi + Viem" category="Web3 Integration" />
            <TechBadge name="Node.js + Express" category="Backend" />
            <TechBadge name="PostgreSQL" category="Database" />
            <TechBadge name="Prisma ORM" category="Database ORM" />
            <TechBadge name="Socket.io" category="Real-time" />
            <TechBadge name="Leaflet.js" category="Interactive Maps" />
            <TechBadge name="Ethereum Sepolia" category="Blockchain Network" />
          </div>
        </section>

        {/* Creator Section */}
        <section className="mb-12 rounded-lg border-2 border-radar/40 bg-gradient-to-br from-obsidian via-steel to-obsidian p-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-shrink-0">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-radar to-blue-500 flex items-center justify-center text-6xl">
                👨‍💻
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl font-bold text-white mb-2">Rahmat Eka Satria</h2>
              <p className="text-lg text-radar mb-4">Game Developer & Blockchain Engineer</p>
              <p className="text-slate-300 mb-6">
                Passionate about creating innovative blockchain games that combine strategy, economics, and real-world data. 
                NationChain is a full-stack Web3 game built from scratch, featuring smart contracts, NFTs, and dynamic gameplay mechanics.
              </p>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <SocialLink
                  icon={<Github className="h-5 w-5" />}
                  label="GitHub"
                  href="https://github.com/rahmatsatria"
                />
                <SocialLink
                  icon={<Linkedin className="h-5 w-5" />}
                  label="LinkedIn"
                  href="https://linkedin.com/in/rahmatsatria"
                />
                <SocialLink
                  icon={<Mail className="h-5 w-5" />}
                  label="Email"
                  href="mailto:rahmat@example.com"
                />
                <SocialLink
                  icon={<Globe className="h-5 w-5" />}
                  label="Portfolio"
                  href="https://rahmatsatria.dev"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="grid gap-4 md:grid-cols-4 mb-12">
          <StatCard icon={<Users className="h-6 w-6" />} value="180" label="Countries" />
          <StatCard icon={<Gamepad2 className="h-6 w-6" />} value={realtime.onlinePlayers.toString()} label="Online Players" />
          <StatCard icon={<Trophy className="h-6 w-6" />} value="∞" label="Possibilities" />
          <StatCard icon={<Code className="h-6 w-6" />} value="100%" label="Open Source" />
        </section>

        {/* Call to Action */}
        <div className="text-center rounded-lg border border-radar/40 bg-radar/10 p-8">
          <h3 className="text-2xl font-bold text-white mb-4">Ready to Dominate the World?</h3>
          <p className="text-slate-300 mb-6">
            Connect your wallet, mint a country NFT, and start building your empire today!
          </p>
          <div className="flex gap-4 justify-center">
            <a
              href="/marketplace"
              className="inline-flex items-center gap-2 rounded-lg bg-radar px-6 py-3 font-bold text-obsidian hover:bg-radar/90 transition"
            >
              <Gamepad2 className="h-5 w-5" />
              Start Playing
            </a>
            <a
              href="https://github.com/rahmatsatria/nationchain"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-6 py-3 font-bold text-white hover:bg-white/10 transition"
            >
              <Github className="h-5 w-5" />
              View Source
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-obsidian/50 p-4">
      <div className="text-3xl mb-2">{icon}</div>
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <p className="text-sm text-slate-400">{description}</p>
    </div>
  );
}

function TechBadge({ name, category }: { name: string; category: string }) {
  return (
    <div className="rounded border border-white/10 bg-obsidian/50 p-3">
      <div className="text-xs text-slate-400 mb-1">{category}</div>
      <div className="font-semibold text-radar">{name}</div>
    </div>
  );
}

function SocialLink({ icon, label, href }: { icon: React.ReactNode; label: string; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10 transition"
    >
      {icon}
      {label}
    </a>
  );
}

function StatCard({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-steel p-4 text-center">
      <div className="flex justify-center text-radar mb-2">{icon}</div>
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      <div className="text-xs text-slate-400">{label}</div>
    </div>
  );
}
