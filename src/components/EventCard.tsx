import React, { useState } from "react";
import { Card, Chip } from "@heroui/react";
import { MapPin, Calendar, Clock, ArrowRight, X } from "lucide-react";
import type { Event } from "../types/event";
import { getEventStatus, isEventToday } from "../services/eventService";

interface EventCardProps {
  event: Event;
  now: Date;
}

export const EventCard: React.FC<EventCardProps> = ({ event, now }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const status = getEventStatus(event, now);
  const isToday = isEventToday(event, now);

  // Format date to: Ven. 29 Mai
  const formatDateFrench = (dateStr: string) => {
    try {
      const date = new Date(`${dateStr}T00:00:00`);
      const formatted = date.toLocaleDateString("fr-FR", {
        weekday: "short",
        day: "numeric",
        month: "short",
      });
      // Capitalize first letter of each part
      return formatted.replace(/(^\w|\s\w)/g, (m) => m.toUpperCase());
    } catch {
      return dateStr;
    }
  };

  // Render the appropriate status chip using Hero UI v3 compound anatomy
  const renderStatusChip = () => {
    switch (status) {
      case "ongoing":
        return (
          <Chip
            size="sm"
            color="danger"
            variant="secondary"
            className="border border-red-500/20 font-bold px-2 py-0.5 select-none"
          >
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
              </span>
              <Chip.Label>En Cours</Chip.Label>
            </div>
          </Chip>
        );
      case "upcoming":
        return (
          <Chip
            size="sm"
            color="success"
            variant="secondary"
            className="border border-green-500/10 font-bold px-2 py-0.5 select-none"
          >
            <Chip.Label>À Venir</Chip.Label>
          </Chip>
        );
      case "past":
        return (
          <Chip
            size="sm"
            color="default"
            variant="secondary"
            className="border border-white/5 text-slate-400 font-semibold px-2 py-0.5 select-none"
          >
            <Chip.Label>Passé</Chip.Label>
          </Chip>
        );
    }
  };

  return (
    <>
      <Card
        onClick={() => setIsModalOpen(true)}
        className={`w-full border transition-all duration-500 overflow-hidden cursor-pointer ${
          status === "ongoing"
            ? "bg-slate-900/90 border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.08)] ring-1 ring-red-500/20"
            : isToday
              ? "bg-slate-900/80 border-cyan-500/40 shadow-[0_0_20px_rgba(6,182,212,0.12)] ring-1 ring-cyan-500/25 hover:border-cyan-400/50 hover:scale-[1.01]"
              : status === "past"
                ? "bg-slate-950/40 border-white/5 opacity-55 grayscale-[30%] hover:opacity-80 hover:grayscale-0 scale-[0.98]"
                : "bg-slate-900/60 border-white/10 hover:border-cyan-500/30 shadow-lg shadow-black/20 hover:scale-[1.01]"
        }`}
      >
        <Card.Content className="p-0 flex flex-row min-h-[110px] h-full">
          {/* Left Side: Thumbnail Image */}
          <div className="relative w-[110px] flex-shrink-0 overflow-hidden">
            {event.imageUrl ? (
              <img
                src={event.imageUrl}
                alt={event.title}
                className="object-cover w-full h-full min-h-[110px] transition-transform duration-700 hover:scale-110"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full min-h-[110px] bg-gradient-to-tr from-cyan-900 to-indigo-900 flex items-center justify-center text-xs font-bold text-slate-400">
                {event.category}
              </div>
            )}
            {/* Category Badge overlay on image */}
            <div className="absolute top-2 left-2 z-10">
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-black/60 backdrop-blur-sm text-cyan-300 border border-cyan-500/20">
                {event.category}
              </span>
            </div>
          </div>

          {/* Right Side: Information Content */}
          <div className="flex-grow p-2.5 flex flex-col justify-between overflow-hidden">
            <div className="flex flex-col gap-1">
              {/* Row 1: Status Chips */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {isToday && status !== "ongoing" && (
                  <span className="text-[8px] font-extrabold px-1.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.2)] select-none animate-pulse">
                    AUJOURD'HUI
                  </span>
                )}
                {renderStatusChip()}
              </div>

              {/* Row 2: Location */}
              <div className="flex items-center gap-1 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                <MapPin size={10} className="text-cyan-400" />
                <span>{event.venue}</span>
              </div>

              {/* Row 3: Title (Wrapped on multiple lines if long) */}
              <h3 className="font-extrabold text-sm text-slate-100 group-hover:text-cyan-400 transition-colors tracking-tight leading-snug">
                {event.title}
              </h3>
            </div>

            {/* Row 4: Timing details */}
            <div className="flex flex-row justify-between items-center text-[10px] text-slate-300 border-t border-white/5 pt-1.5 mt-1">
              <div className="flex items-center gap-1 font-bold">
                <Calendar size={10.5} className={isToday ? "text-cyan-300 animate-pulse" : "text-cyan-400"} />
                <span className={isToday ? "text-cyan-300 font-extrabold" : ""}>
                  {isToday ? `Auj. (${formatDateFrench(event.date)})` : formatDateFrench(event.date)}
                </span>
              </div>
              <div className="flex items-center gap-1 text-slate-400 font-medium">
                <Clock size={10} />
                <span>
                  {event.startTime} - {event.endTime}
                </span>
              </div>
            </div>
          </div>
        </Card.Content>
      </Card>

      {/* Details Modal Pop-up */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          {/* Click outside to close */}
          <div className="absolute inset-0" onClick={() => setIsModalOpen(false)} />
          
          {/* Modal Container */}
          <div className="relative w-full max-w-sm bg-slate-900/95 border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-cyan-500/5 flex flex-col animate-scale-in z-10 max-h-[85vh]">
            
            {/* Top Banner Image */}
            <div className="relative w-full h-[180px] flex-shrink-0">
              {event.imageUrl ? (
                <img
                  src={event.imageUrl}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-tr from-cyan-900 to-indigo-900 flex items-center justify-center text-slate-400 font-bold">
                  {event.category}
                </div>
              )}
              
              {/* Floating Close Button */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-black/60 border border-white/10 text-slate-300 hover:text-white hover:bg-black/80 transition-all z-20 cursor-pointer"
              >
                <X size={16} />
              </button>

              {/* Category Badge overlay on image */}
              <div className="absolute bottom-3 left-3 z-10">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm text-cyan-300 border border-cyan-500/20">
                  {event.category}
                </span>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-grow p-4 overflow-y-auto no-scrollbar flex flex-col gap-4">
              {/* Status Tags Row */}
              <div className="flex items-center gap-1.5">
                {isToday && status !== "ongoing" && (
                  <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 animate-pulse">
                    AUJOURD'HUI
                  </span>
                )}
                {renderStatusChip()}
              </div>

              {/* Venue Location Row */}
              <div className="text-[11px] font-bold tracking-wider text-slate-400 uppercase flex items-center gap-1 -mt-1.5">
                <MapPin size={11} className="text-cyan-400" />
                <span>{event.venue}</span>
              </div>

              {/* Title */}
              <h2 className="text-base font-extrabold text-slate-100 leading-tight">
                {event.title}
              </h2>

              {/* Timing and Price Details */}
              <div className="grid grid-cols-2 gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                <div className="flex flex-col gap-0.5 text-slate-300">
                  <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">Date</span>
                  <div className="flex items-center gap-1 text-[11px] font-bold">
                    <Calendar size={11} className={isToday ? "text-cyan-300" : "text-cyan-400"} />
                    <span>{isToday ? "Aujourd'hui" : formatDateFrench(event.date)}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-0.5 text-slate-300">
                  <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">Horaire</span>
                  <div className="flex items-center gap-1 text-[11px] font-bold">
                    <Clock size={11} className="text-cyan-400" />
                    <span>{event.startTime} - {event.endTime}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-0.5 text-slate-300 col-span-2 border-t border-white/5 pt-2 mt-1">
                  <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">Tarif</span>
                  <span className="text-[11px] font-bold text-slate-200">
                    {event.price || "Voir billetterie"}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1">
                <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">À Propos</span>
                <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                  {event.description || "Aucune description disponible."}
                </p>
              </div>
            </div>

            {/* Footer / Actions */}
            <div className="p-4 border-t border-white/5 bg-slate-950/40 flex gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 py-2 px-3 rounded-xl border border-white/10 hover:bg-white/5 text-slate-300 hover:text-white text-xs font-bold transition-all cursor-pointer"
              >
                Fermer
              </button>
              {status !== "past" && event.ticketUrl && (
                <button
                  onClick={() => window.open(event.ticketUrl, "_blank")}
                  className="flex-[1.5] py-2 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-cyan-500/20 hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>Réserver Billets</span>
                  <ArrowRight size={13} />
                </button>
              )}
            </div>

          </div>
        </div>
      )}
    </>
  );
};
