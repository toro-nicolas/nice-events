export type VenueType = "Allianz Riviera" | "Palais Nikaïa" | string;

export type EventStatus = "ongoing" | "upcoming" | "past";

export interface Event {
  id: string;
  title: string;
  venue: VenueType;
  date: string; // Format: YYYY-MM-DD
  startTime: string; // Format: HH:MM
  endTime: string; // Format: HH:MM
  description?: string;
  category: string; // e.g., 'Concert', 'Sport', 'Spectacle', 'Humour', 'Festival'
  imageUrl?: string;
  price?: string; // e.g., 'À partir de 39€' or 'Gratuit'
  ticketUrl?: string;
}

export interface EventFilters {
  search: string;
  venue: "all" | "others" | "109" | "Allianz Riviera" | "Palais Nikaïa";
  status: "all" | "today" | EventStatus;
}

