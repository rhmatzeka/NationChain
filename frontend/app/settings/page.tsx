"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Music, Volume2, Bell, Globe } from "lucide-react";

export default function SettingsPage() {
  const [musicVolume, setMusicVolume] = useState(30);
  const [sfxVolume, setSfxVolume] = useState(50);
  const [autoPlay, setAutoPlay] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState("en");

  return (
    <main className="min-h-screen bg-gradient-to-b from-obsidian to-steel">
      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-radar hover:text-radar/80 transition mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold text-white">Settings</h1>
          <p className="text-slate-400 mt-2">Customize your NationChain experience</p>
        </div>

        <div className="space-y-6">
          {/* Audio Settings */}
          <section className="rounded-lg border border-white/10 bg-steel/50 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded bg-radar/20 border border-radar/40">
                <Music className="h-5 w-5 text-radar" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Audio Settings</h2>
                <p className="text-sm text-slate-400">Control music and sound effects</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Music Volume */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-semibold text-white">Background Music</label>
                  <span className="text-sm text-radar font-semibold">{musicVolume}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={musicVolume}
                  onChange={(e) => setMusicVolume(parseInt(e.target.value))}
                  className="w-full accent-radar"
                />
              </div>

              {/* SFX Volume */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-semibold text-white">Sound Effects</label>
                  <span className="text-sm text-radar font-semibold">{sfxVolume}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sfxVolume}
                  onChange={(e) => setSfxVolume(parseInt(e.target.value))}
                  className="w-full accent-radar"
                />
              </div>

              {/* Auto-play */}
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <div>
                  <label className="text-sm font-semibold text-white block">Auto-play Music</label>
                  <p className="text-xs text-slate-400 mt-1">Start music automatically when page loads</p>
                </div>
                <button
                  onClick={() => setAutoPlay(!autoPlay)}
                  className={`relative inline-flex h-7 w-12 items-center rounded-full transition ${
                    autoPlay ? "bg-radar" : "bg-slate-600"
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${
                      autoPlay ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </section>

          {/* Notifications */}
          <section className="rounded-lg border border-white/10 bg-steel/50 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded bg-amber-500/20 border border-amber-500/40">
                <Bell className="h-5 w-5 text-amber-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Notifications</h2>
                <p className="text-sm text-slate-400">Manage game alerts and updates</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-semibold text-white block">Enable Notifications</label>
                <p className="text-xs text-slate-400 mt-1">Get alerts for wars, trades, and news events</p>
              </div>
              <button
                onClick={() => setNotifications(!notifications)}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition ${
                  notifications ? "bg-radar" : "bg-slate-600"
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${
                    notifications ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </section>

          {/* Language */}
          <section className="rounded-lg border border-white/10 bg-steel/50 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded bg-blue-500/20 border border-blue-500/40">
                <Globe className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Language</h2>
                <p className="text-sm text-slate-400">Select your preferred language</p>
              </div>
            </div>

            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full rounded border border-white/20 bg-obsidian/50 px-4 py-3 text-white focus:border-radar focus:outline-none"
            >
              <option value="en">English</option>
              <option value="id">Bahasa Indonesia</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
              <option value="zh">中文</option>
              <option value="ja">日本語</option>
            </select>
          </section>

          {/* Save Button */}
          <div className="flex justify-end gap-3">
            <Link
              href="/dashboard"
              className="rounded border border-white/20 px-6 py-3 font-semibold text-white hover:bg-white/5 transition"
            >
              Cancel
            </Link>
            <button className="rounded bg-radar px-6 py-3 font-semibold text-obsidian hover:bg-radar/90 transition">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
