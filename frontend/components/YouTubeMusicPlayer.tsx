"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX, Play, Pause, X } from "lucide-react";

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
        videoId: "rfC3wkZ43Jg", // Epic War Music
        playerVars: {
          autoplay: 1,
          loop: 1,
          playlist: "rfC3wkZ43Jg", // Loop the same video
          controls: 0,
          disablekb: 1,
          fs: 0,
          modestbranding: 1,
          playsinline: 1
        },
        events: {
          onReady: (event: any) => {
            setIsReady(true);
            event.target.setVolume(50);
            event.target.playVideo();
            setIsPlaying(true);
          },
          onStateChange: (event: any) => {
            if (event.data === window.YT.PlayerState.PLAYING) {
              setIsPlaying(true);
            } else if (event.data === window.YT.PlayerState.PAUSED) {
              setIsPlaying(false);
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
        <div className="fixed bottom-4 right-4 z-[2000] w-72 rounded-lg border border-radar/40 bg-obsidian/95 p-4 shadow-2xl backdrop-blur-md">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="text-sm font-bold text-white">Epic War Music</div>
              <div className="text-xs text-slate-400">Background Music</div>
            </div>
            <button
              onClick={() => setIsMinimized(true)}
              className="rounded p-1 hover:bg-white/10"
            >
              <X className="h-4 w-4 text-slate-400" />
            </button>
          </div>

          <div className="flex items-center gap-3">
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
              onClick={toggleMute}
              className="rounded p-2 hover:bg-white/10 transition"
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
              defaultValue="50"
              onChange={handleVolumeChange}
              className="flex-1 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-radar"
            />
          </div>

          <div className="mt-3 text-xs text-slate-500 text-center">
            🎵 Auto-playing in background
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
