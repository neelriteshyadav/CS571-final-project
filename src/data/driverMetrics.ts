export interface DriverMetric {
  driver: string;
  points: number;
  wins: number;
  poles: number; // Races qualified first
}

export const driverMetricsData: DriverMetric[] = [
  { driver: 'VER', points: 575, wins: 19, poles: 12 },
  { driver: 'PER', points: 285, wins: 2, poles: 2 },
  { driver: 'HAM', points: 234, wins: 0, poles: 1 },
  { driver: 'ALO', points: 206, wins: 0, poles: 0 },
  { driver: 'LEC', points: 206, wins: 0, poles: 5 },
  { driver: 'NOR', points: 205, wins: 0, poles: 0 },
  { driver: 'SAI', points: 200, wins: 1, poles: 2 },
  { driver: 'RUS', points: 175, wins: 0, poles: 0 },
  { driver: 'PIA', points: 97, wins: 0, poles: 0 }, // Example data
  { driver: 'STR', points: 74, wins: 0, poles: 0 },
]; 