"use client";

import { useMemo, useState, useEffect } from "react";
import { Newspaper, Swords, Landmark, HelpCircle, Settings } from "lucide-react";
import { useAccount } from "wagmi";
import { useActiveWars, useCommodities, useCountries } from "@/hooks/useGameData";
import { useRealtime } from "@/hooks/useRealtime";
import { Header } from "@/components/Header";
import { MapShell } from "@/components/MapShell";
import { CountryDashboard } from "@/components/CountryDashboard";
import { GlobalTicker } from "@/components/GlobalTicker";
import { NewsBanner } from "@/components/NewsBanner";
import { NewsFeedPanel } from "@/components/NewsFeedPanel";
import { WarRoomModal } from "@/components/WarRoomModal";
import { Toast } from "@/components/Toast";
import { TutorialModal } from "@/components/TutorialModal";
import { WelcomeGuide } from "@/components/WelcomeGuide";
import { YouTubeMusicPlayer } from "@/components/YouTubeMusicPlayer";
import { CountryLeaderPopup } from "@/components/CountryLeaderPopup";
import type { Country } from "@/types/game";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const { address } = useAccount();
  const countries = useCountries();
  const wars = useActiveWars();
  const commodities = useCommodities();
  const realtime = useRealtime(address);
  const [selected, setSelected] = useState<Country | undefined>();
  const [newsOpen, setNewsOpen] = useState(false);
  const [warOpen, setWarOpen] = useState(false);
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const [tutorialOpen, setTutorialOpen] = useState(false);
  const [leaderPopupOpen, setLeaderPopupOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const owned = useMemo(() => (countries.data || []).find((country) => country.ownerWallet?.toLowerCase() === address?.toLowerCase()), [countries.data, address]);
  const activeCountry = selected || owned || countries.data?.[0];
  const playerCountries = useMemo(() => (countries.data || []).filter((c) => c.ownerWallet?.toLowerCase() === address?.toLowerCase()).length, [countries.data, address]);

  // Show tutorial on first visit
  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem("nationchain_tutorial_seen");
    if (!hasSeenTutorial) {
      setTutorialOpen(true);
      localStorage.setItem("nationchain_tutorial_seen", "true");
    }
  }, []);

  // Listen for tutorial open event
  useEffect(() => {
    const handleOpenTutorial = () => setTutorialOpen(true);
    window.addEventListener("openTutorial", handleOpenTutorial);
    return () => window.removeEventListener("openTutorial", handleOpenTutorial);
  }, []);

  const handleWarAction = (type: "boost" | "alliance", message: string) => {
    setToast({ message, type: "success" });
  };

  return (
    <main className="relative h-screen overflow-hidden">
      {/* Full Screen Map - Behind Everything */}
      <div className="absolute inset-0">
        <MapShell 
          countries={countries.data || []} 
          wars={wars.data || []} 
          ownedCountryId={owned?.id}
          onSelect={(country) => {
            setSelected(country);
            setLeaderPopupOpen(true);
          }} 
        />
      </div>

      {/* Transparent Header Overlay */}
      <div className="absolute top-0 left-0 right-0 z-[1000]">
        <Header onlinePlayers={realtime.onlinePlayers} />
      </div>
      
      <NewsBanner event={realtime.latestNews} />

      {/* Welcome Guide for New Players */}
      {address && <WelcomeGuide playerCountries={playerCountries} />}

      {/* Floating Controls - Top Right */}
      <div className="absolute right-4 top-20 z-[600] flex flex-wrap gap-2 max-w-md justify-end">
        <button onClick={() => setTutorialOpen(true)} className="inline-flex items-center gap-1.5 rounded border border-blue-400/40 bg-obsidian/90 px-3 py-2 text-sm text-blue-400 backdrop-blur transition hover:bg-obsidian">
          <HelpCircle className="h-4 w-4" />
        </button>
        <button onClick={() => router.push('/settings')} className="inline-flex items-center gap-1.5 rounded border border-white/40 bg-obsidian/90 px-3 py-2 text-sm text-white backdrop-blur transition hover:bg-obsidian">
          <Settings className="h-4 w-4" />
        </button>
        <button onClick={() => setDashboardOpen(!dashboardOpen)} className="inline-flex items-center gap-1.5 rounded border border-radar/40 bg-obsidian/90 px-3 py-2 text-sm text-radar backdrop-blur transition hover:bg-obsidian">
          <Landmark className="h-4 w-4" /> Dashboard
        </button>
        <button onClick={() => setNewsOpen(true)} className="inline-flex items-center gap-1.5 rounded border border-radar/40 bg-obsidian/90 px-3 py-2 text-sm text-radar backdrop-blur transition hover:bg-obsidian">
          <Newspaper className="h-4 w-4" /> News
        </button>
        <button onClick={() => setWarOpen(true)} className="inline-flex items-center gap-1.5 rounded border border-alert/40 bg-obsidian/90 px-3 py-2 text-sm text-alert backdrop-blur transition hover:bg-obsidian">
          <Swords className="h-4 w-4" /> War
        </button>
      </div>

      {/* Floating Country Dashboard - Bottom (Only show when dashboardOpen) */}
      {dashboardOpen && (
        <div className="absolute bottom-4 left-4 right-4 z-[600] max-w-6xl mx-auto">
          <CountryDashboard 
            country={activeCountry} 
            commodities={commodities.data} 
            wars={wars.data || []} 
            allCountries={countries.data || []}
          />
        </div>
      )}

      <NewsFeedPanel open={newsOpen} onClose={() => setNewsOpen(false)} />
      <WarRoomModal 
        open={warOpen} 
        onClose={() => setWarOpen(false)} 
        battleFeed={realtime.battleFeed}
        onAction={handleWarAction}
      />
      <GlobalTicker items={realtime.ticker} />
      
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
      
      <TutorialModal open={tutorialOpen} onClose={() => setTutorialOpen(false)} />
      <YouTubeMusicPlayer />
      
      {/* Leader Popup */}
      {leaderPopupOpen && selected && (
        <CountryLeaderPopup
          country={selected}
          onClose={() => setLeaderPopupOpen(false)}
          onViewDashboard={() => {
            setLeaderPopupOpen(false);
            setDashboardOpen(true);
          }}
        />
      )}
    </main>
  );
}
