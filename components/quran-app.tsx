'use client';

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Search, Play, Pause, Bookmark, BookmarkCheck, Moon, Sun, SkipBack, SkipForward,
  Headphones, Settings2, Heart, Shield, Navigation, BookOpen, Bot, Globe, MapPinned,
  Clock3, AudioLines, Sparkles, History, Brain, Languages, WifiOff
} from "lucide-react";
import { Button, Card, CardContent, Input } from "@/components/ui";
import { cn } from "@/lib/utils";

type Surah = {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
};

type User = {
  id: string;
  email: string;
  name: string | null;
};

type Verse = {
  numberInSurah: number;
  text: string;
  juz?: number;
};

const reciters = [
  { name: "Mishary Alafasy", base: "https://server8.mp3quran.net/afs" },
  { name: "Abdurrahman As-Sudais", base: "https://server12.mp3quran.net/sds" },
  { name: "Saad Al-Ghamdi", base: "https://server7.mp3quran.net/gmd" },
  { name: "Maher Al-Muaiqly", base: "https://server12.mp3quran.net/maher" },
];

const getAudioUrl = (base: string, surahNumber: number) => `${base}/${String(surahNumber).padStart(3, "0")}.mp3`;

export function QuranApp() {
  const [dark, setDark] = useState(true);
  const [search, setSearch] = useState("");
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [selectedSurah, setSelectedSurah] = useState(1);
  const [selectedJuz, setSelectedJuz] = useState(1);
  const [mode, setMode] = useState<"surah" | "juz">("surah");
  const [chapter, setChapter] = useState<any>(null);
  const [juzData, setJuzData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [reciter, setReciter] = useState(reciters[0]);
  const [fontSize, setFontSize] = useState(22);
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [qibla, setQibla] = useState<any>(null);
  const [prayerTimes, setPrayerTimes] = useState<any>(null);
  const [tafsir, setTafsir] = useState<any>(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string>("");
  const [offline, setOffline] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  useEffect(() => {
    setOffline(!navigator.onLine);
    const onOnline = () => setOffline(false);
    const onOffline = () => setOffline(true);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  useEffect(() => {
    fetch("/api/auth/me").then((r) => r.json()).then((d) => setUser(d.user || null));
  }, []);

  useEffect(() => {
    fetch("/api/chapters").then((r) => r.json()).then((d) => setSurahs(d.data || []));
  }, []);

  useEffect(() => {
    setLoading(true);
    const endpoint = mode === "surah" ? `/api/surah/${selectedSurah}` : `/api/juz/${selectedJuz}`;
    fetch(endpoint)
      .then((r) => r.json())
      .then((d) => {
        if (mode === "surah") setChapter(d.data);
        else setJuzData(d.data);
      })
      .finally(() => setLoading(false));
  }, [mode, selectedSurah, selectedJuz]);

  useEffect(() => {
    fetch("/api/bookmarks").then((r) => r.json()).then((d) => Array.isArray(d) && setBookmarks(d)).catch(() => setBookmarks([]));
    fetch("/api/history").then((r) => r.json()).then((d) => Array.isArray(d) && setHistory(d)).catch(() => setHistory([]));
  }, [user]);

  useEffect(() => {
    fetch("/api/prayer-times?city=Jakarta&country=Indonesia").then((r) => r.json()).then((d) => setPrayerTimes(d.data || d)).catch(() => {});
    navigator.geolocation?.getCurrentPosition((pos) => {
      fetch(`/api/qibla?lat=${pos.coords.latitude}&lng=${pos.coords.longitude}`).then((r) => r.json()).then((d) => setQibla(d.data || d)).catch(() => {});
    });
  }, []);

  const filteredSurahs = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return surahs;
    return surahs.filter((s) => [s.number, s.englishName, s.name, s.englishNameTranslation].join(" ").toLowerCase().includes(q));
  }, [search, surahs]);

  const verses: Verse[] = mode === "surah" ? chapter?.[0]?.ayahs || [] : juzData?.[0]?.ayahs || [];
  const indoVerses: Verse[] = mode === "surah" ? chapter?.[1]?.ayahs || [] : juzData?.[1]?.ayahs || [];

  const currentBookmarkKey = mode === "surah" ? `surah-${selectedSurah}` : `juz-${selectedJuz}`;

  const persistHistory = async (type: string, refId: string, title: string) => {
    await fetch("/api/history", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type, refId, title }) }).catch(() => {});
    const refreshed = await fetch("/api/history").then((r) => r.json()).catch(() => []);
    setHistory(Array.isArray(refreshed) ? refreshed : []);
  };

  const toggleBookmark = async () => {
    const existing = bookmarks.find((b) => b.refId === currentBookmarkKey);
    if (existing) {
      await fetch("/api/bookmarks", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ refId: currentBookmarkKey }) });
    } else {
      await fetch("/api/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: mode,
          refId: currentBookmarkKey,
          title: mode === "surah" ? `Surah ${selectedSurah}` : `Juz ${selectedJuz}`,
        }),
      });
    }
    const refreshed = await fetch("/api/bookmarks").then((r) => r.json()).catch(() => []);
    setBookmarks(Array.isArray(refreshed) ? refreshed : []);
  };

  const handlePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
      return;
    }
    audio.src = getAudioUrl(reciter.base, selectedSurah);
    try {
      await audio.play();
      setPlaying(true);
      await persistHistory(mode, currentBookmarkKey, mode === "surah" ? `Surah ${selectedSurah}` : `Juz ${selectedJuz}`);
    } catch {
      setPlaying(false);
    }
  };

  const askAI = async () => {
    if (!question.trim()) return;
    const res = await fetch("/api/ask-quran", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });
    const data = await res.json();
    setAnswer(data.answer || "Tidak ada jawaban.");
  };

  const loadTafsir = async (surahId: number, ayahNumber: number) => {
    const res = await fetch(`/api/tafsir/${surahId}/${ayahNumber}`);
    const data = await res.json();
    setTafsir(data);
  };

  const handleLogin = async () => {
    const email = prompt("Email:");
    const password = prompt("Password:");
    if (!email || !password) return;
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (res.ok) {
      const me = await fetch("/api/auth/me").then((r) => r.json());
      setUser(me.user || null);
    } else {
      alert("Login gagal");
    }
  };

  const handleRegister = async () => {
    const email = prompt("Email:");
    const name = prompt("Nama:");
    const password = prompt("Password:");
    if (!email || !password) return;
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, name, password }),
    });
    if (res.ok) {
      const me = await fetch("/api/auth/me").then((r) => r.json());
      setUser(me.user || null);
    } else {
      alert("Register gagal");
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#07111f] dark:text-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-4 md:px-6 lg:px-8">
        <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
          <aside className="space-y-4">
            <Card className="overflow-hidden">
              <CardContent>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-emerald-500">
                      <Sparkles className="h-4 w-4" /> DiTz Qur'an Premium
                    </div>
                    <h1 className="mt-1 text-2xl font-bold">Full Stack Qur'an</h1>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      30 juz, audio, tafsir, sholat, kiblat, AI, login, bookmark cloud.
                    </p>
                  </div>
                  <Button variant="outline" onClick={() => setDark((v) => !v)}>
                    {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                  </Button>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <Button onClick={() => setMode("surah")} className={cn(mode === "surah" ? "" : "opacity-70")}>
                    <BookOpen className="mr-2 h-4 w-4" /> Surah
                  </Button>
                  <Button variant="secondary" onClick={() => setMode("juz")} className={cn(mode === "juz" ? "" : "opacity-70")}>
                    <AudioLines className="mr-2 h-4 w-4" /> Juz
                  </Button>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari surah" className="pl-9" />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" onClick={handleLogin}>Login</Button>
                    <Button variant="outline" onClick={handleRegister}>Register</Button>
                    <Button variant="outline" onClick={handleLogout}>Logout</Button>
                  </div>
                  <div className="text-xs text-slate-500">{user ? `Masuk sebagai ${user.email}` : "Belum login"}</div>
                  {offline ? <div className="flex items-center gap-2 rounded-2xl border border-amber-300 bg-amber-500/10 px-3 py-2 text-sm text-amber-700 dark:text-amber-300"><WifiOff className="h-4 w-4" /> Offline mode aktif</div> : null}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <div className="mb-3 flex items-center gap-2 font-semibold"><Settings2 className="h-4 w-4" /> Pengaturan</div>
                <div className="space-y-3 text-sm">
                  <label className="block">
                    <span className="mb-1 block text-slate-500">Ukuran teks: {fontSize}px</span>
                    <input type="range" min="16" max="32" value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} className="w-full" />
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {reciters.map((r) => (
                      <button key={r.name} onClick={() => setReciter(r)} className={cn("rounded-2xl border px-3 py-2 text-left", reciter.name === r.name ? "border-emerald-500 bg-emerald-500/10" : "border-slate-200 bg-white/50 dark:border-slate-800 dark:bg-slate-950/40")}>
                        {r.name}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <div className="mb-3 flex items-center gap-2 font-semibold"><History className="h-4 w-4" /> Riwayat</div>
                <div className="space-y-2">
                  {history.length ? history.slice(0, 10).map((h) => <div key={h.id} className="rounded-2xl border border-slate-200 bg-white/50 px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-950/40">{h.title}</div>) : <div className="text-sm text-slate-500">Belum ada riwayat.</div>}
                </div>
              </CardContent>
            </Card>
          </aside>

          <main className="space-y-4">
            <Card>
              <CardContent>
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
                      <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-emerald-600 dark:text-emerald-400">{mode === "surah" ? "Surah Explorer" : "Juz Explorer"}</span>
                      <span>{user ? `Akun aktif: ${user.email}` : "Guest mode"}</span>
                    </div>
                    <h2 className="mt-2 text-3xl font-bold tracking-tight">
                      {mode === "surah" ? (surahs.find((s) => s.number === selectedSurah)?.name || "Memuat...") : `Juz ${selectedJuz}`}
                    </h2>
                    <p className="mt-2 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
                      Full-stack premium: login, bookmark cloud, riwayat, tafsir, jadwal sholat, kiblat, dan AI tanya Qur'an.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" onClick={() => setSelectedSurah((s) => Math.max(1, s - 1))}><SkipBack className="mr-2 h-4 w-4" /> Prev</Button>
                    <Button onClick={handlePlay}>{playing ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />} {playing ? "Pause" : "Play"}</Button>
                    <Button variant="outline" onClick={() => setSelectedSurah((s) => Math.min(114, s + 1))}><SkipForward className="mr-2 h-4 w-4" /> Next</Button>
                    <Button variant="outline" onClick={toggleBookmark}>{bookmarks.find((b) => b.refId === currentBookmarkKey) ? <BookmarkCheck className="mr-2 h-4 w-4" /> : <Bookmark className="mr-2 h-4 w-4" />} Save</Button>
                  </div>
                </div>
                <audio ref={audioRef} preload="none" />
              </CardContent>
            </Card>

            <div className="grid gap-4 xl:grid-cols-[1fr_340px]">
              <Card>
                <CardContent className="p-4 md:p-6">
                  {loading ? <div className="py-12 text-center text-slate-500">Loading...</div> : (
                    <div className="space-y-4">
                      {(verses.length ? verses : []).map((v, idx) => (
                        <motion.div key={`${mode}-${v.numberInSurah}-${idx}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border border-slate-200 bg-white/60 p-4 dark:border-slate-800 dark:bg-slate-950/30">
                          <div className="mb-3 flex items-center justify-between text-sm text-slate-500">
                            <span>Ayat {v.numberInSurah}</span>
                            <div className="flex items-center gap-2">
                              <button onClick={() => loadTafsir(selectedSurah, v.numberInSurah)} className="rounded-full border border-slate-200 px-3 py-1 text-xs dark:border-slate-700">
                                Tafsir
                              </button>
                              <button onClick={toggleBookmark}>
                                {bookmarks.find((b) => b.refId === `${mode === "surah" ? "surah" : "juz"}-${mode === "surah" ? selectedSurah : selectedJuz}`) ? <BookmarkCheck className="h-4 w-4 text-emerald-500" /> : <Bookmark className="h-4 w-4" />}
                              </button>
                            </div>
                          </div>
                          <p dir="rtl" style={{ fontSize }} className="text-right leading-[2.2]">{v.text}</p>
                          <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{indoVerses[idx]?.text || ""}</p>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="space-y-4">
                <Card>
                  <CardContent>
                    <div className="mb-3 flex items-center gap-2 font-semibold"><Headphones className="h-4 w-4" /> Audio & Tilawah</div>
                    <div className="text-sm text-slate-500">
                      Qari: <span className="font-medium text-slate-700 dark:text-slate-200">{reciter.name}</span>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <Button variant="outline" onClick={handlePlay}>Play Audio</Button>
                      <Button variant="outline" onClick={() => setSelectedSurah(1)}>Surah 1</Button>
                    </div>
                    <div className="mt-3 text-xs text-slate-500">
                      Stream audio per surah aktif. Bisa kamu upgrade lagi ke ayat-per-ayat kalau mau.
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent>
                    <div className="mb-3 flex items-center gap-2 font-semibold"><Navigation className="h-4 w-4" /> Kiblat</div>
                    <div className="text-sm text-slate-500">
                      {qibla ? JSON.stringify(qibla) : "Sedang ambil data kiblat dari lokasi kamu."}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent>
                    <div className="mb-3 flex items-center gap-2 font-semibold"><Clock3 className="h-4 w-4" /> Jadwal Sholat</div>
                    <div className="text-sm text-slate-500">
                      {prayerTimes ? JSON.stringify(prayerTimes.timings || prayerTimes) : "Sedang ambil jadwal sholat Jakarta."}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent>
                    <div className="mb-3 flex items-center gap-2 font-semibold"><Bot className="h-4 w-4" /> AI Tanya Qur'an</div>
                    <textarea value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Tanya tentang ayat, tema, atau makna..." className="min-h-28 w-full rounded-2xl border border-slate-200 bg-transparent p-3 outline-none dark:border-slate-800" />
                    <div className="mt-2">
                      <Button onClick={askAI}>Tanya</Button>
                    </div>
                    <div className="mt-3 text-sm text-slate-500">{answer || "Jawaban akan tampil di sini."}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent>
                    <div className="mb-3 flex items-center gap-2 font-semibold"><Languages className="h-4 w-4" /> Tafsir</div>
                    <div className="text-sm text-slate-500">
                      {tafsir ? JSON.stringify(tafsir) : "Klik tombol Tafsir di ayat untuk memuat penjelasan."}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent>
                    <div className="mb-3 flex items-center gap-2 font-semibold"><Shield className="h-4 w-4" /> Status Premium</div>
                    <div className="space-y-2 text-sm text-slate-500">
                      <div>• Login / register siap.</div>
                      <div>• Bookmark cloud per user.</div>
                      <div>• Riwayat tersimpan di database.</div>
                      <div>• API siap untuk fitur tambahan.</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
