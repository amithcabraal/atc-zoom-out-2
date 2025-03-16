export interface City {
  name: string;
  latitude: number;
  longitude: number;
}

export interface Guess {
  cityName: string;
  latitude: number;
  longitude: number;
  distance: number;
}