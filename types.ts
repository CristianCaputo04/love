export interface RelationshipData {
  myName: string;
  partnerName: string;
  startDate: string; // ISO string format
  backgroundImageUrl: string;
}

export interface DurationBreakdown {
  years: number;
  months: number;
  days: number;
  totalDays: number;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // ISO date string
  category: 'date' | 'activity' | 'important';
}

export interface Trip {
  id: string;
  destination: string;
  date: string;
  image?: string;
}

export type QuoteCategory = 'amore' | 'amicizia' | 'palestra' | 'università' | 'bellezza' | 'vita' | 'futuro' | 'sorella' | 'famiglia';

export interface AppData {
  relationship: RelationshipData;
  events: CalendarEvent[];
  trips: Trip[];
}
