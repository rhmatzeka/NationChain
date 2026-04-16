"use client";

import { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX, Music, SkipForward, Settings } from "lucide-react";
import { useRouter } from "next/navigation";

// Working epic war/strategy music tracks
const tracks = [
  {
    name: "Epic Cinematic",
    url: "https://assets.mixkit.co/music/preview/mixkit-epic-orchestra-transition-2290.mp3"
  },
  {
    name: "War Drums",
    url: "https://assets.mixkit.co/music/preview/mixkit-powerful-beat-2737.mp3"
  },
  {
    name: "Battle Theme",
    url: "https://assets.mixkit.co/music/preview/mixkit-games-worldbeat-466.mp3"
  },
  {
    name: "Strategic Command",
    url: "https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3"
  }
];

export function MusicPlayer() {
  const router = useRouter();
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasAttemptedAutoPlay = useRef(false);

  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.loop = true;
    audioRef.current.volume = volume;
    audioRef.current.src = tracks[currentTrack].url;
    
    // Auto-play on mount
    if (!hasAttemptedAutoPlay.current) {
      hasAttemptedAutoPlay.current = true;
      setTimeout(() => {
        audioRef.current?.play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch(err => {
            console.warn("Auto-play blocked. Click Play to start music.");
          });
      }, 1000);
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = tracks[currentTrack].url;
      if (isPlaying) {
        audioRef.current.play().catch(err => console.warn("Audio play failed:", err));
      }
    }
  }, [currentTrack]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(err => {
        console.warn("Audio play failed:", err);
      });
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const nextTrack = () => {
    setCurrentTrack((prev) => (prev + 1) % tracks.length);
  };

  const openSettings = () => {
    router.push('/settings');
  };

  return (
    <div className="fixed bottom-20 right-4 z-[700] rounded-lg border border-white/20 bg-obsidian/90 backdrop-blur-md shadow-2xl">
      <div className="flex items-center gap-2 px-3 py-2">
        <Music className="h-4 w-4 text-radar flex-shrink-0" />
        
        <button
          onClick={togglePlay}
          className="rounded bg-radar/20 px-2.5 py-1 text-xs font-semibold text-radar hover:bg-radar/30 transition"
        >
          {isPlaying ? "Pause" : "Play"}
        </button>

        <button
          onClick={nextTrack}
          className="rounded p-1 hover:bg-white/10 transition"
          title="Next track"
        >
          <SkipForward className="h-3.5 w-3.5 text-white" />
        </button>

        <button
          onClick={toggleMute}
          className="rounded p-1 hover:bg-white/10 transition"
        >
          {isMuted ? (
            <VolumeX className="h-3.5 w-3.5 text-slate-400" />
          ) : (
            <Volume2 className="h-3.5 w-3.5 text-white" />
          )}
        </button>

        <button
          onClick={openSettings}
          className="rounded p-1 hover:bg-white/10 transition"
          title="Settings"
        >
          <Settings className="h-3.5 w-3.5 text-white" />
        </button>
      </div>
      
      <div className="px-3 pb-2 text-xs text-slate-500 truncate max-w-xs">
        {tracks[currentTrack].name}
      </div>
    </div>
  );
}
