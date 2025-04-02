export interface TeamMetricPoint {
  race: number; // Race number in the season
  points: number;
  avgLapTime: number; // Average lap time in seconds
}

export interface TeamSeasonMetrics {
  team: string;
  season: number;
  data: TeamMetricPoint[];
}

export const teamMetricsData: TeamSeasonMetrics[] = [
  {
    team: 'Red Bull',
    season: 2023,
    data: [
      { race: 1, points: 43, avgLapTime: 93.5 },
      { race: 2, points: 87, avgLapTime: 92.8 },
      { race: 3, points: 123, avgLapTime: 92.5 },
      // Add more data points for the season
      { race: 22, points: 860, avgLapTime: 91.2 },
    ],
  },
  {
    team: 'Mercedes',
    season: 2023,
    data: [
      { race: 1, points: 16, avgLapTime: 94.2 },
      { race: 2, points: 38, avgLapTime: 93.5 },
      { race: 3, points: 56, avgLapTime: 93.1 },
      // Add more data points for the season
      { race: 22, points: 409, avgLapTime: 92.0 },
    ],
  },
  // Add data for other teams and potentially other seasons
]; 