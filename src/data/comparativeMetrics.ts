export interface ComparativeMetric {
  id: string; // Can be driver or team name
  points: number;
  wins: number;
  poles: number;
  avgLapTime: number; // Average lap time in seconds for the season
}

export const comparativeMetricsData: ComparativeMetric[] = [
  { id: 'VER', points: 575, wins: 19, poles: 12, avgLapTime: 91.5 },
  { id: 'PER', points: 285, wins: 2, poles: 2, avgLapTime: 92.0 },
  { id: 'HAM', points: 234, wins: 0, poles: 1, avgLapTime: 92.2 },
  { id: 'ALO', points: 206, wins: 0, poles: 0, avgLapTime: 92.8 },
  { id: 'LEC', points: 206, wins: 0, poles: 5, avgLapTime: 92.1 },
  { id: 'Red Bull', points: 860, wins: 21, poles: 14, avgLapTime: 91.2 }, // Team data example
  { id: 'Mercedes', points: 409, wins: 0, poles: 1, avgLapTime: 92.0 },
  // Add more drivers or teams
];

export const metricsKeys: (keyof Omit<ComparativeMetric, 'id'>)[] = [
  'points',
  'wins',
  'poles',
  'avgLapTime',
]; 