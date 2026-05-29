import { useState, useEffect, useMemo } from "react";
import { eventService, getEventStatus, isEventToday } from "./services/eventService";
import type { Event, EventStatus } from "./types/event";
import { Header } from "./components/Header";
import { FilterBar } from "./components/FilterBar";
import { EventList } from "./components/EventList";
import { Sparkles, RefreshCw, ArrowUp } from "lucide-react";

export default function App() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedVenue, setSelectedVenue] = useState<
    "all" | "others" | "109" | "Allianz Riviera" | "Palais Nikaïa"
  >("all");
  const [selectedStatus, setSelectedStatus] = useState<"all" | "today" | EventStatus>(
    "all",
  );

  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);

  // Monitor window scroll to show/hide scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Set the current time context (relative to system/user local time)
  const [now, setNow] = useState<Date>(new Date());

  // Periodically update the time context to keep badges responsive in real-time
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 30000); // Update every 30 seconds
    return () => clearInterval(timer);
  }, []);

  // Fetch events on mount
  const loadEvents = async () => {
    setLoading(true);
    try {
      const data = await eventService.getEvents();
      setEvents(data);
    } catch (error) {
      console.error("Failed to load events:", error);
    } finally {
      // Simulate slight network delay for premium skeleton layout feel
      setTimeout(() => {
        setLoading(false);
      }, 600);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  // Reset filters helper
  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedVenue("all");
    setSelectedStatus("all");
  };

  // Filter events dynamically
  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      // 1. Search Query filter
      const matchesSearch =
        searchTerm === "" ||
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (event.description &&
          event.description.toLowerCase().includes(searchTerm.toLowerCase()));

      // 2. Venue filter
      let matchesVenue = false;
      if (selectedVenue === "all") {
        matchesVenue = true;
      } else if (selectedVenue === "109") {
        matchesVenue = event.venue === "Le 109";
      } else if (selectedVenue === "others") {
        matchesVenue =
          event.venue !== "Allianz Riviera" &&
          event.venue !== "Palais Nikaïa" &&
          event.venue !== "Le 109";
      } else {
        matchesVenue = event.venue === selectedVenue;
      }

      // 3. Status/Date filter
      let matchesStatus = false;
      if (selectedStatus === "all") {
        matchesStatus = true;
      } else if (selectedStatus === "today") {
        matchesStatus = isEventToday(event, now);
      } else {
        const status = getEventStatus(event, now);
        matchesStatus = status === selectedStatus;
      }

      return matchesSearch && matchesVenue && matchesStatus;
    });
  }, [events, searchTerm, selectedVenue, selectedStatus, now]);

  // Format today's date for display
  const formattedToday = useMemo(() => {
    return now
      .toLocaleDateString("fr-FR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
      .replace(/^\w/, (c) => c.toUpperCase());
  }, [now]);

  // Calculate count of events taking place today
  const todayEventsCount = useMemo(() => {
    return events.filter((event) => isEventToday(event, now)).length;
  }, [events, now]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col antialiased selection:bg-cyan-500 selection:text-white">
      {/* Decorative ambient background glows */}
      <div className="fixed top-[-20%] left-[-20%] w-[80%] h-[80%] rounded-full bg-cyan-600/10 blur-[120px] pointer-events-none z-0" />
      <div className="fixed bottom-[-20%] right-[-20%] w-[80%] h-[80%] rounded-full bg-violet-600/10 blur-[120px] pointer-events-none z-0" />

      {/* Header component */}
      <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <main className="flex-grow z-10 flex flex-col">
        {/* Date / Status Widget */}
        <div className="w-full max-w-md mx-auto px-5 pt-4 pb-1 flex justify-between items-center bg-slate-950/20">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-cyan-400 tracking-wider uppercase flex items-center gap-1">
              <Sparkles size={10} />
              Aujourd'hui à Nice
            </span>
            <span className="text-xs font-bold text-slate-300 mt-0.5">
              {formattedToday}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {!loading && todayEventsCount > 0 && (
              <button
                onClick={() => setSelectedStatus(selectedStatus === "today" ? "all" : "today")}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border transition-all duration-300 text-[10px] font-extrabold active:scale-95 select-none ${
                  selectedStatus === "today"
                    ? "bg-cyan-500/25 border-cyan-500/50 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.2)] animate-pulse"
                    : "bg-white/5 border-white/10 hover:border-cyan-500/30 text-slate-300 hover:bg-white/10"
                }`}
                title={selectedStatus === "today" ? "Afficher tous les événements" : "Filtrer sur les événements d'aujourd'hui"}
              >
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-cyan-500"></span>
                </span>
                <span>
                  {todayEventsCount} {todayEventsCount > 1 ? "événements" : "événement"} aujourd'hui
                </span>
              </button>
            )}

            <button
              onClick={loadEvents}
              disabled={loading}
              className="p-2 rounded-xl bg-white/5 border border-white/5 text-slate-400 hover:text-slate-200 active:scale-95 disabled:opacity-50 transition-all hover:bg-white/10"
              title="Rafraîchir les données"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        {/* FilterBar component */}
        <FilterBar
          selectedVenue={selectedVenue}
          setSelectedVenue={setSelectedVenue}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
        />

        {/* Dynamic event content */}
        {loading ? (
          /* Sleek Skeleton Loading state */
          <div className="w-full max-w-md mx-auto px-4 py-4 flex flex-col gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-full h-[110px] rounded-2xl bg-white/5 animate-pulse border border-white/5 flex p-2.5 gap-2.5"
              >
                <div className="w-[110px] h-full bg-white/5 rounded-xl flex-shrink-0" />
                <div className="flex-grow flex flex-col justify-between py-1">
                  <div className="flex flex-col gap-2">
                    <div className="h-3 w-20 bg-white/10 rounded" />
                    <div className="h-4 w-3/4 bg-white/10 rounded" />
                  </div>
                  <div className="h-3 w-1/3 bg-white/10 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EventList
            events={filteredEvents}
            now={now}
            onResetFilters={handleResetFilters}
          />
        )}
      </main>

      {/* Floating navigation / details bar for nice mobile styling */}
      <footer className="w-full py-4 text-center border-t border-white/5 bg-slate-950/90 text-[10px] text-slate-500 font-semibold tracking-wider uppercase z-20">
        Nice Events &copy; 2026 - Conçu avec ❤️ par TORO Nicolas
      </footer>

      {/* Floating Scroll to Top button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 p-3 rounded-full bg-slate-900/80 border border-white/10 text-cyan-400 hover:text-cyan-300 shadow-xl shadow-cyan-500/10 hover:scale-105 active:scale-95 transition-all hover:bg-slate-800 z-50 animate-fade-in flex items-center justify-center cursor-pointer"
          title="Retour en haut"
        >
          <ArrowUp size={18} />
        </button>
      )}
    </div>
  );
}
