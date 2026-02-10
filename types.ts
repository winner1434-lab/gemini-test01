
export enum UserRole {
  ADMIN = 'ADMIN',
  AM = 'AM'
}

export interface User {
  id: string;
  username: string;
  role: UserRole;
  managedPropertyIds: string[]; // For Property Level Isolation
}

export enum RateSource {
  ORIGINAL = 'ORIGINAL',
  MANUAL = 'MANUAL',
  EVENT_STOP_SELL = 'EVENT_STOP_SELL'
}

export interface Property {
  id: string;
  name: string;
  district: string;
  lat: number;
  lng: number;
  rooms: RoomType[];
}

export interface RoomType {
  id: string;
  name: string;
  basePrice: number;
}

export interface RateData {
  date: string;
  price: number;
  status: 'OPEN' | 'CLOSED';
  source: RateSource;
  inventory: number;
  originalPrice: number;
}

export interface ExternalEvent {
  id: string;
  name: string;
  date: string;
  venue: string;
  lat: number;
  lng: number;
  scale: 'HIGH' | 'MEDIUM' | 'LOW';
  source: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'INFO' | 'ALERT' | 'SUCCESS';
}
