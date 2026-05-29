import React, { useEffect, useRef } from "react";
import { CalendarOff } from "lucide-react";
import type { Event } from "../types/event";
import { EventCard } from "./EventCard";
import { getEventStatus } from "../services/eventService";

interface EventListProps {
  events: Event[];
  now: Date;
  onResetFilters: () => void;
}

export const EventList: React.FC<EventListProps> = ({
  events,
  now,
  onResetFilters,
}) => {
  const hasAutoScrolled = useRef(false);

  // Trigger smooth scroll on mount / when events load
  useEffect(() => {
    if (events.length === 0 || hasAutoScrolled.current) return;

    // Find the first event that is 'ongoing' or 'upcoming'
    const targetEvent = events.find((event) => {
      const status = getEventStatus(event, now);
      return status === "ongoing" || status === "upcoming";
    });

    if (targetEvent) {
      // Small timeout to allow the DOM to render and stabilize
      const timer = setTimeout(() => {
        const element = document.getElementById(`event-card-${targetEvent.id}`);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
          hasAutoScrolled.current = true; // Mark as done so we don't trigger it repeatedly
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [events, now]);

  // If no events match filters
  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-8 mt-10 max-w-xs mx-auto bg-slate-900/30 rounded-2xl border border-white/5 backdrop-blur-sm">
        <div className="p-3 rounded-full bg-slate-800 text-slate-400 mb-3">
          <CalendarOff size={24} />
        </div>
        <h3 className="text-slate-200 font-bold text-sm">
          Aucun événement trouvé
        </h3>
        <p className="text-xs text-slate-400 mt-1 mb-4 leading-relaxed">
          Essayez de modifier votre recherche ou réinitialisez les filtres.
        </p>
        <button
          onClick={onResetFilters}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 text-white font-semibold text-xs shadow-md shadow-cyan-500/10 hover:opacity-90 active:scale-95 transition-all"
        >
          Réinitialiser les filtres
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto px-4 py-2 flex flex-col gap-3.5 pb-20">
      {events.map((event) => (
        <div
          key={event.id}
          id={`event-card-${event.id}`}
          className="scroll-mt-24"
        >
          <EventCard event={event} now={now} />
        </div>
      ))}
    </div>
  );
};
