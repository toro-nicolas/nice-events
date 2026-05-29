import React from "react";
import type { EventStatus } from "../types/event";

interface FilterBarProps {
  selectedVenue: "all" | "others" | "109" | "Allianz Riviera" | "Palais Nikaïa";
  setSelectedVenue: (
    venue: "all" | "others" | "109" | "Allianz Riviera" | "Palais Nikaïa",
  ) => void;
  selectedStatus: "all" | "today" | EventStatus;
  setSelectedStatus: (status: "all" | "today" | EventStatus) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  selectedVenue,
  setSelectedVenue,
  selectedStatus,
  setSelectedStatus,
}) => {
  const venues: {
    label: string;
    value: "all" | "others" | "109" | "Allianz Riviera" | "Palais Nikaïa";
  }[] = [
    { label: "Tous les lieux", value: "all" },
    { label: "Allianz Riviera", value: "Allianz Riviera" },
    { label: "Palais Nikaïa", value: "Palais Nikaïa" },
    { label: "Le 109", value: "109" },
    { label: "Autres Lieux 📍", value: "others" },
  ];

  const statuses: { label: string; value: "all" | "today" | EventStatus }[] = [
    { label: "Tous", value: "all" },
    { label: "Aujourd'hui", value: "today" },
    { label: "En cours", value: "ongoing" },
    { label: "À venir", value: "upcoming" },
    { label: "Passés", value: "past" },
  ];

  return (
    <div className="w-full max-w-md mx-auto px-4 py-3 flex flex-col gap-3 bg-slate-950/40">
      {/* Venue Filter (Pills style) */}
      <div className="flex flex-col gap-1.5">
        <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase px-1">
          Lieux
        </span>
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {venues.map((venue) => {
            const isActive = selectedVenue === venue.value;
            return (
              <button
                key={venue.value}
                onClick={() => setSelectedVenue(venue.value)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-300 ${
                  isActive
                    ? "bg-gradient-to-r from-cyan-500 to-indigo-500 text-white shadow-md shadow-cyan-500/20"
                    : "bg-white/5 text-slate-300 border border-white/5 hover:bg-white/10"
                }`}
              >
                {venue.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Status Filter (Tabs/Underline style) */}
      <div className="flex flex-col gap-1.5">
        <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase px-1">
          Statuts
        </span>
        <div className="flex w-full bg-white/5 p-1 rounded-xl border border-white/5">
          {statuses.map((status) => {
            const isActive = selectedStatus === status.value;
            return (
              <button
                key={status.value}
                onClick={() => setSelectedStatus(status.value)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 text-center ${
                  isActive
                    ? "bg-gradient-to-tr from-cyan-500 to-indigo-500 text-white shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {status.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
