"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Lead = {
  id: number;
  name: string;
  city: string;
  category: string;
  trigger: string;
  why: string;
  score: number;
  when: string;
  est: string;
  source: string;
  sourceUrl?: string;
  status: "New" | "Saved" | "Contacted";
};

const initialLeads: Lead[] = [
  { id: 1, name: "MVP Promotions × PFL", city: "Los Angeles", category: "Combat sports", trigger: "Acquisition", why: "New ownership creates an immediate need for event crew, media and VIP apparel.", score: 98, when: "2h ago", est: "$18–45k", source: "Trade press", status: "New" },
  { id: 2, name: "OC Riptide Baseball", city: "Irvine", category: "Sports club", trigger: "2026 season", why: "Seasonal players, coaches, game-day staff, volunteers and sponsor activations.", score: 94, when: "5h ago", est: "$8–22k", source: "League calendar", status: "New" },
  { id: 3, name: "Pacific Pickleball Open", city: "Huntington Beach", category: "Tournament", trigger: "Registration opened", why: "Multi-day tournament with officials, volunteers, vendors and participant merch.", score: 91, when: "Yesterday", est: "$12–30k", source: "Event listing", status: "Saved" },
  { id: 4, name: "Solstice Hospitality Group", city: "Costa Mesa", category: "Hospitality", trigger: "New location", why: "Opening two concepts with front-of-house, kitchen and launch-event apparel needs.", score: 87, when: "Yesterday", est: "$6–16k", source: "Local news", status: "New" },
  { id: 5, name: "West Coast Youth Lacrosse", city: "San Diego", category: "Youth sports", trigger: "Tournament announced", why: "42-team weekend plus coaches, officials, volunteers and tournament store.", score: 84, when: "2d ago", est: "$9–24k", source: "Instagram", status: "Contacted" },
  { id: 6, name: "AeroGrid Systems", city: "Long Beach", category: "Aerospace", trigger: "Series A funding", why: "Fast-growing local team likely hiring and attending industry events.", score: 78, when: "3d ago", est: "$4–12k", source: "Funding news", status: "New" },
];

const niches = [
  ["Acquisitions & rebrands", "New ownership, refreshed identity, combined teams", "High intent"],
  ["Pro & semi-pro sports", "Fights, baseball, soccer, surf and motorsports", "Large orders"],
  ["Youth tournament operators", "Weekend events, clubs, camps and showcases", "Repeatable"],
  ["Grand openings", "Restaurants, gyms, retail and hospitality groups", "Fast close"],
  ["Funded & fast-growing teams", "New hires, trade shows and company culture", "Growing"],
  ["Festivals & civic events", "Crews, volunteers, sponsors and vendors", "Seasonal"],
  ["Construction & field services", "Crews, safety apparel and ongoing replenishment", "Recurring"],
  ["Schools & booster programs", "Staff, teams, spiritwear and fundraisers", "Community"],
];

export default function Home() {
  const [leads, setLeads] = useState(initialLeads);
  const [savedLeads, setSavedLeads] = useState<Lead[]>([]);
  const [filter, setFilter] = useState("All leads");
  const [query, setQuery] = useState("");
  const [scanning, setScanning] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [toast, setToast] = useState("");
  const leadsPanelRef = useRef<HTMLElement>(null);
  const queueRef = useRef<HTMLElement>(null);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem("signalmerch-saved-leads");
      if (stored) setSavedLeads(JSON.parse(stored) as Lead[]);
    } catch {
      // Keep the app usable if browser storage is unavailable or malformed.
    }
  }, []);

  function persistSaved(next: Lead[]) {
    setSavedLeads(next);
    try {
      window.localStorage.setItem("signalmerch-saved-leads", JSON.stringify(next));
    } catch {
      // Saving for this session still works when browser storage is unavailable.
    }
  }

  const visible = useMemo(() => (filter === "Saved" ? savedLeads : leads).filter((lead) => {
    const matchesFilter = filter === "All leads" || filter === "Saved" || lead.status === filter;
    const haystack = `${lead.name} ${lead.city} ${lead.category} ${lead.trigger}`.toLowerCase();
    return matchesFilter && haystack.includes(query.toLowerCase());
  }), [leads, savedLeads, filter, query]);

  function updateStatus(id: number, status: Lead["status"]) {
    setLeads((current) => current.map((lead) => lead.id === id ? { ...lead, status } : lead));
    if (status === "Saved") {
      const lead = leads.find((item) => item.id === id) ?? savedLeads.find((item) => item.id === id);
      if (lead && !savedLeads.some((item) => item.id === id)) persistSaved([{ ...lead, status }, ...savedLeads]);
    } else {
      persistSaved(savedLeads.map((lead) => lead.id === id ? { ...lead, status } : lead));
    }
    setToast(status === "Contacted" ? "Marked as contacted" : "Lead saved to your queue");
    window.setTimeout(() => setToast(""), 1800);
  }

  function showLeadView(nextFilter: string) {
    setFilter(nextFilter);
    leadsPanelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function contactSearchUrl(lead: Lead) {
    const queryText = `${lead.name} ${lead.city} official website contact`;
    return `https://www.google.com/search?q=${encodeURIComponent(queryText)}`;
  }

  async function runScan() {
    setScanning(true);
    try {
      const response = await fetch("/api/search", { cache: "no-store" });
      const data = await response.json() as { leads?: Lead[]; error?: string };
      if (!response.ok) throw new Error(data.error ?? "Search failed");
      setLeads(data.leads ?? []);
      setToast(`Scan complete · ${data.leads?.length ?? 0} live signals found`);
    } catch (error) {
      setToast(error instanceof Error ? error.message : "Search failed");
    } finally {
      setScanning(false);
      window.setTimeout(() => setToast(""), 3200);
    }
  }

  return (
    <main>
      <aside className="sidebar">
        <div className="brand"><span className="brandmark">S</span><span>SignalMerch</span></div>
        <nav aria-label="Primary navigation">
          <button className={`nav ${filter === "All leads" ? "active" : ""}`} onClick={() => showLeadView("All leads")}><span>◈</span> Discovery</button>
          <button className={`nav ${filter === "Saved" ? "active" : ""}`} onClick={() => showLeadView("Saved")}><span>◎</span> Saved leads <b>{savedLeads.length}</b></button>
          <button className={`nav ${filter === "Contacted" ? "active" : ""}`} onClick={() => showLeadView("Contacted")}><span>↗</span> Outreach</button>
          <button className="nav" onClick={() => queueRef.current?.scrollIntoView({ behavior: "smooth" })}><span>⌁</span> Search queue</button>
        </nav>
        <div className="sidebar-bottom">
          <div className="usage"><div><span>Monthly scans</span><strong>64%</strong></div><i><em /></i><small>1,280 of 2,000 searches</small></div>
          <button className="nav" onClick={() => setShowSettings(true)}><span>⚙</span> API & settings</button>
          <div className="profile"><div>MP</div><p><strong>Mike&apos;s Promotions</strong><span>Southern California</span></p><span>•••</span></div>
        </div>
      </aside>

      <section className="workspace">
        <header>
          <div><p className="eyebrow">LIVE OPPORTUNITY FEED</p><h1>Find the moment before the merch order.</h1><p className="subhead">We monitor business changes and SoCal events that create immediate apparel demand.</p></div>
          <button className="scan" onClick={runScan} disabled={scanning}>{scanning ? <><span className="spinner" /> Scanning sources…</> : <>⌁ Run discovery scan</>}</button>
        </header>

        <div className="metrics">
          <div><span>Qualified this week</span><strong>38</strong><small className="up">↗ 21% vs last week</small></div>
          <div><span>New since yesterday</span><strong>6</strong><small>3 high-intent</small></div>
          <div><span>Pipeline potential</span><strong>$186k</strong><small>Estimated merch value</small></div>
          <div><span>Sources monitored</span><strong>42</strong><small className="live">● All systems live</small></div>
        </div>

        <section className="panel leads-panel" ref={leadsPanelRef}>
          <div className="panel-head">
            <div><h2>{filter === "Saved" ? "Saved leads" : filter === "Contacted" ? "Outreach" : "Fresh opportunities"}</h2><p>{filter === "Saved" ? "Your shortlist, saved on this device." : filter === "Contacted" ? "Leads you have marked as contacted." : "Ranked by timing, headcount and likelihood to buy."}</p></div>
            <div className="search"><span>⌕</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search leads" aria-label="Search leads" /></div>
          </div>
          <div className="filters">
            {["All leads", "New", "Saved", "Contacted"].map((item) => <button key={item} className={filter === item ? "selected" : ""} onClick={() => setFilter(item)}>{item}{item === "All leads" && <span>{leads.length}</span>}</button>)}
            <button className="filter-button">☷ Filters</button>
          </div>
          <div className="lead-list">
            {visible.map((lead) => (
              <article className="lead" key={lead.id}>
                <div className={`score ${lead.score > 90 ? "hot" : ""}`}><strong>{lead.score}</strong><span>FIT</span></div>
                <div className="lead-main">
                  <div className="lead-title"><h3>{lead.name}</h3><span className="trigger">{lead.trigger}</span></div>
                  <p className="meta">{lead.category} <i>·</i> {lead.city} <i>·</i> {lead.when}</p>
                  <p className="why">{lead.why}</p>
                  <p className="source"><span>↗</span> {lead.sourceUrl ? <a href={lead.sourceUrl} target="_blank" rel="noreferrer">{lead.source}</a> : lead.source}</p>
                </div>
                <div className="lead-action"><span>EST. VALUE</span><strong>{lead.est}</strong><div className="action-row">{lead.sourceUrl && <a className="lead-link secondary" href={lead.sourceUrl} target="_blank" rel="noreferrer">View source</a>}<a className="lead-link" href={contactSearchUrl(lead)} target="_blank" rel="noreferrer" onClick={() => updateStatus(lead.id, "Contacted")}>Find contact</a></div><button className="ghost save-button" onClick={() => updateStatus(lead.id, "Saved")}>{savedLeads.some((item) => item.id === lead.id) ? "✓ Saved" : "＋ Save lead"}</button></div>
              </article>
            ))}
            {visible.length === 0 && <div className="empty">No leads match that search.</div>}
          </div>
        </section>

        <section className="queue-section" ref={queueRef}>
          <div className="queue-heading"><div><p className="eyebrow">SEARCH STRATEGY</p><h2>Your SoCal opportunity queue</h2><p>Eight niches chosen for urgency, staff count and repeat order potential.</p></div><button>Manage queue →</button></div>
          <div className="niche-grid">{niches.map(([name, detail, tag], index) => <article key={name}><div className={`niche-icon c${index}`}>{["↻", "◒", "P", "✦", "↗", "♫", "⌂", "A"][index]}</div><div><h3>{name}</h3><p>{detail}</p><span>{tag}</span></div><label><input type="checkbox" defaultChecked /><i /></label></article>)}</div>
        </section>
      </section>

      {showSettings && <div className="modal-backdrop" onMouseDown={() => setShowSettings(false)}><section className="modal" onMouseDown={(e) => e.stopPropagation()}><button className="close" onClick={() => setShowSettings(false)}>×</button><p className="eyebrow">CONNECTION</p><h2>Search API connected</h2><p>SignalMerch uses SerpApi to discover fresh Southern California news signals.</p><label>Provider<input value="SerpApi" readOnly /></label><label>Search region<input value="Orange, Los Angeles, Riverside, San Bernardino & San Diego counties" readOnly /></label><button className="scan" onClick={() => setShowSettings(false)}>Done</button><small>Your API key is stored privately on the server and is never sent to the browser.</small></section></div>}
      {toast && <div className="toast">✓ {toast}</div>}
    </main>
  );
}
