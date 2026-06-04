export const QURAN_API = "https://api.alquran.cloud/v1";
export const QURAN_TAFSIR_API = "https://api.quran.com/api/v4";
export const PRAYER_API = "https://api.aladhan.com/v1";

export async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, { cache: "no-store", ...init });
  if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
  return res.json() as Promise<T>;
}

export async function getChapters() {
  return fetchJson(`${QURAN_API}/surah`);
}

export async function getSurah(id: string | number) {
  return fetchJson(`${QURAN_API}/surah/${id}/editions/quran-uthmani,id.indonesian`);
}

export async function getJuz(id: string | number) {
  return fetchJson(`${QURAN_API}/juz/${id}/editions/quran-uthmani,id.indonesian`);
}

export async function getPrayerTimes(city: string = "Jakarta", country: string = "Indonesia") {
  return fetchJson(`${PRAYER_API}/timingsByCity?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=2`);
}

export async function getQibla(lat: number, lng: number) {
  return fetchJson(`${PRAYER_API}/qibla/${lat}/${lng}`);
}

export async function getTafsir(surahId: number, ayahNumber: number) {
  return fetchJson(`${QURAN_TAFSIR_API}/quran/tafsirs/169/verses/${surahId}:${ayahNumber}`);
}

export async function askQuran(question: string) {
  // Placeholder AI-friendly endpoint. Wire this to OpenAI or your own model if needed.
  const response = {
    answer: `Pertanyaan: ${question}. Endpoint ini disiapkan sebagai stub untuk integrasi AI tanya Qur'an.`,
    sources: ["al-quran.cloud", "quran.com", "aladhan.com"],
  };
  return response;
}
