import { Heart, Plane, Utensils, Music, Home, Star, Briefcase } from "lucide-react";

export const EVENT_TYPES = {
  date: { label: 'Rande', color: '#E27D60', icon: Heart },       // Oranžová
  trip: { label: 'Výlet', color: '#2A9D8F', icon: Plane },       // Tyrkysová
  food: { label: 'Jídlo', color: '#E9C46A', icon: Utensils },    // Žlutá
  culture: { label: 'Kultura', color: '#7C51C9', icon: Music },  // Fialová
  household: { label: 'Domácnost', color: '#A68A64', icon: Home }, // Hnědá
  work: { label: 'Práce', color: '#457B9D', icon: Briefcase },   // Modrá
  other: { label: 'Ostatní', color: '#9CA3AF', icon: Star },     // Šedá
} as const;

export type EventType = keyof typeof EVENT_TYPES;

export const getEventColor = (type: string | undefined) => {
  const eventType = (type && type in EVENT_TYPES) ? type as EventType : 'other';
  return EVENT_TYPES[eventType].color;
};

export const getEventLabel = (type: string | undefined) => {
    const eventType = (type && type in EVENT_TYPES) ? type as EventType : 'other';
    return EVENT_TYPES[eventType].label;
}
