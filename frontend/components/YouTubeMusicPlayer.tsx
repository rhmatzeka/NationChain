"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX, Play, Pause, X, ChevronLeft, ChevronRight } from "lucide-react";

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export function YouTubeMusicPlayer() {
  const playerRef = useRef<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);

  // Epic war music playlist
  const playlist = [
    { id: "rfC3wkZ43Jg", title: "Epic War Music" },
    { id: "pGbIOC83-So", title: "Two Steps From Hell - Heart of Courage" },
    { id: "ASj81daun5Q", title: "Immediate Music - Lacrimosa" },
    { id: "n08CSYRBEsM", title: "Epic Battle Music" }
  ];

  useEffect(() => {
    // Load YouTube IFrame API
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    // Initialize player when API is ready
    window.onYouTubeIframeAPIReady = () => {
      playerRef.current = new window.YT.Player("youtube-player", {
        height: "0",
        width: "0",
        videoId: playlist[currentTrack].id,
        playerVars: {
          autoplay: 1,
          controls: 0,
          disablekb: 1,
          fs: 0,
          modestbranding: 1,
          playsinline: 1
        },
        events: {
          onReady: (event: any) => {
            setIsReady(true);
            event.target.setVolume(40);
            event.target.playVideo();
            setIsPlaying(true);
          },
          onStateChange: (event: any) => {
            if (event.data === window.YT.PlayerState.PLAYING) {
              setIsPlaying(true);
            } else if (event.data === window.YT.PlayerState.PAUSED) {
              setIsPlaying(false);
            } else if (event.data === window.YT.PlayerState.ENDED) {
              // Auto-play next track
              const nextTrack = (currentTrack + 1) % playlist.length;
              setCurrentTrack(nextTrack);
              event.target.loadVideoById(playlist[nextTrack].id);
            }
          }
        }
      });
    };

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, []);

  // Change track when currentTrack changes
  useEffect(() => {
    if (playerRef.current && isReady) {
      playerRef.current.loadVideoById(playlist[currentTrack].id);
    }
  }, [currentTrack, isReady]);

  const togglePlay = () => {
    if (!playerRef.current) return;
    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  };

  const toggleMute = () => {
    if (!playerRef.current) return;
    if (isMuted) {
      playerRef.current.unMute();
      setIsMuted(false);
    } else {
      playerRef.current.mute();
      setIsMuted(true);
    }
  };

  const nextTrack = () => {
    const next = (currentTrack + 1) % playlist.length;
    setCurrentTrack(next);
  };

  const prevTrack = () => {
    const prev = (currentTrack - 1 + playlist.length) % playlist.length;
    setCurrentTrack(prev);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!playerRef.current) return;
    const volume = parseInt(e.target.value);
    playerRef.current.setVolume(volume);
    if (volume === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };

  if (!isReady) {
    return <div id="youtube-player" className="hidden"></div>;
  }

  return (
    <>
      <div id="youtube-player" className="hidden"></div>
      
      {!isMinimized && (
        <div className="fixed bottom-4 right-4 z-[2000] w-80 rounded-lg border border-radar/40 bg-obsidian/95 p-4 shadow-2xl backdrop-blur-md">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="text-sm font-bold text-white">🎵 {playlist[currentTrack].title}</div>
              <div className="text-xs text-slate-400">Track {currentTrack + 1} of {playlist.length}</div>
            </div>
            <button
              onClick={() => setIsMinimized(true)}
              className="rounded p-1 hover:bg-white/10"
            >
              <X className="h-4 w-4 text-slate-400" />
            </button>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <button
              onClick={prevTrack}
              className="rounded p-2 hover:bg-white/10 transition"
            >
              <ChevronLeft className="h-4 w-4 text-white" />
            </button>

            <button
              onClick={togglePlay}
              className="rounded-full bg-radar p-2 hover:bg-radar/90 transition"
            >
              {isPlaying ? (
                <Pause className="h-4 w-4 text-obsidian" />
              ) : (
                <Play className="h-4 w-4 text-obsidian" />
              )}
            </button>

            <button
              onClick={nextTrack}
              className="rounded p-2 hover:bg-white/10 transition"
            >
              <ChevronRight className="h-4 w-4 text-white" />
            </button>

            <button
              onClick={toggleMute}
              className="rounded p-2 hover:bg-white/10 transition ml-2"
            >
              {isMuted ? (
                <VolumeX className="h-4 w-4 text-slate-400" />
              ) : (
                <Volume2 className="h-4 w-4 text-radar" />
              )}
            </button>

            <input
              type="range"
              min="0"
              max="100"
              defaultValue="40"
              onChange={handleVolumeChange}
              className="flex-1 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-radar"
            />
          </div>

          <div className="text-xs text-slate-500 text-center">
            🎮 Epic war music for your conquest
          </div>
        </div>
      )}

      {isMinimized && (
        <button
          onClick={() => setIsMinimized(false)}
          className="fixed bottom-4 right-4 z-[2000] rounded-full border border-radar/40 bg-obsidian/95 p-3 shadow-xl backdrop-blur-md hover:bg-obsidian transition"
        >
          {isPlaying ? (
            <Volume2 className="h-5 w-5 text-radar animate-pulse" />
          ) : (
            <VolumeX className="h-5 w-5 text-slate-400" />
          )}
        </button>
      )}
    </>
  );
}
