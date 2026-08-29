import { NextResponse } from "next/server";

type SerpNewsResult = {
  title?: string;
  link?: string;
  snippet?: string;
  source?: string;
  date?: string;
};

const triggerTerms = ["grand opening", "new location", "tournament announced", "registration opened", "festival announced", "acquisition", "rebrand", "funding", "expansion"];

function inferTrigger(text: string): string {
  const lower = text.toLowerCase();
  return triggerTerms.find((term) => lower.includes(term)) ?? "fresh signal";
}

function inferCity(text: string): string {
  const cities = ["Los Angeles", "Long Beach", "Irvine", "Anaheim", "Costa Mesa", "Huntington Beach", "Riverside", "San Bernardino", "San Diego", "Oceanside", "Carlsbad", "Temecula"];
  return cities.find((city) => text.toLowerCase().includes(city.toLowerCase())) ?? "Southern California";
}

export async function GET() {
  const apiKey = process.env.SERPAPI_KEY;
  if (!apiKey) return NextResponse.json({ error: "Search is not configured yet." }, { status: 503 });

  const query = [
    '("grand opening" OR "new location" OR "tournament announced" OR "registration opened" OR "festival announced" OR acquisition OR rebrand OR funding OR expansion)',
    '("Los Angeles" OR "Orange County" OR Riverside OR "San Bernardino" OR "San Diego")',
    "(company OR business OR team OR tournament OR festival OR school OR restaurant OR gym)",
  ].join(" ");
  const params = new URLSearchParams({ engine: "google", tbm: "nws", q: query, location: "Los Angeles, California, United States", gl: "us", hl: "en", num: "10", api_key: apiKey });

  try {
    const response = await fetch(`https://serpapi.com/search.json?${params}`, { headers: { Accept: "application/json" }, cache: "no-store" });
    const data = await response.json() as { error?: string; news_results?: SerpNewsResult[] };
    if (!response.ok || data.error) {
      return NextResponse.json({ error: data.error ?? "The search provider could not complete this scan." }, { status: response.status || 502 });
    }

    const leads = (data.news_results ?? []).slice(0, 10).map((result, index) => {
      const text = `${result.title ?? ""} ${result.snippet ?? ""}`;
      return {
        id: Date.now() + index,
        name: result.title ?? "Untitled opportunity",
        city: inferCity(text),
        category: "News signal",
        trigger: inferTrigger(text).replace(/\b\w/g, (letter) => letter.toUpperCase()),
        why: result.snippet ?? "A recent local signal may indicate upcoming apparel demand.",
        score: Math.max(72, 96 - index * 3),
        when: result.date ?? "Recently",
        est: "Needs review",
        source: result.source ?? "Google News",
        sourceUrl: result.link ?? "",
        status: "New" as const,
      };
    });
    return NextResponse.json({ leads });
  } catch {
    return NextResponse.json({ error: "The live search is temporarily unavailable." }, { status: 502 });
  }
}
