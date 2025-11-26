export interface Waypoint {
  id: number;
  name: string;
  lat: number;
  lng: number;
}

export interface AppSettings {
  ch1Center: number; // 1.0 - 2.0 ms
  ch2Center: number; // 1.0 - 2.0 ms
  angleRange: number; // Degrees
  averageTime: number; // Seconds
}

export enum Screen {
  HOME = 'HOME',
  MAP = 'MAP',
  WAYPOINTS = 'WAYPOINTS',
  SETTINGS = 'SETTINGS',
  NAV = 'NAV',
}

export interface BoatStatus {
  speedKnots: number;
  heading: number;
  lat: number;
  lng: number;
  isNavigating: boolean;
  trackHistory: Array<[number, number]>; // [lat, lng]
}
