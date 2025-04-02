export interface ChampionshipData {
  id: string; // Driver or Constructor Name
  championships: number;
}

// Example data, needs to be comprehensive for actual use
export const driverChampionshipsData: ChampionshipData[] = [
  { id: 'Michael Schumacher', championships: 7 },
  { id: 'Lewis Hamilton', championships: 7 },
  { id: 'Juan Manuel Fangio', championships: 5 },
  { id: 'Alain Prost', championships: 4 },
  { id: 'Sebastian Vettel', championships: 4 },
  { id: 'Max Verstappen', championships: 3 }, // Current data might need updates
  // Add more drivers
];

export const constructorChampionshipsData: ChampionshipData[] = [
  { id: 'Ferrari', championships: 16 },
  { id: 'Williams', championships: 9 },
  { id: 'McLaren', championships: 8 },
  { id: 'Mercedes', championships: 8 },
  { id: 'Lotus', championships: 7 },
  { id: 'Red Bull', championships: 6 }, // Current data might need updates
  // Add more constructors
]; 