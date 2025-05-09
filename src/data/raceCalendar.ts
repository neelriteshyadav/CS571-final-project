/** @format */

export interface Race {
	id: number;
	name: string;
	location: string;
	date: string;
	circuitName: string;
	completed: boolean;
	winner?: string;
}

export const recentRaces: Race[] = [
	{
		id: 1,
		name: 'Saudi Arabian Grand Prix',
		location: 'Jeddah, Saudi Arabia',
		date: '2025-04-20',
		circuitName: 'Jeddah Corniche Circuit',
		completed: true,
		winner: 'Oscar Piastri',
	},
	{
		id: 2,
		name: 'Bahrain Grand Prix',
		location: 'Sakhir, Bahrain',
		date: '2025-04-13',
		circuitName: 'Bahrain International Circuit',
		completed: true,
		winner: 'Oscar Piastri',
	},
	{
		id: 3,
		name: 'Japanese Grand Prix',
		location: 'Suzuka, Japan',
		date: '2025-04-06',
		circuitName: 'Suzuka International Racing Course',
		completed: true,
		winner: 'Max Verstappen',
	},
	{
		id: 4,
		name: 'Chinese Grand Prix',
		location: 'Shanghai, China',
		date: '2025-03-23',
		circuitName: 'Shanghai International Circuit',
		completed: true,
		winner: 'Max Verstappen',
	},
];

export const upcomingRaces: Race[] = [
	{
		id: 5,
		name: 'Emilia Romagna Grand Prix',
		location: 'Imola, Italy',
		date: '2025-05-18',
		circuitName: 'Autodromo Enzo e Dino Ferrari',
		completed: false,
	},
	{
		id: 6,
		name: 'Monaco Grand Prix',
		location: 'Monte Carlo, Monaco',
		date: '2025-05-25',
		circuitName: 'Circuit de Monaco',
		completed: false,
	},
	{
		id: 7,
		name: 'Spanish Grand Prix',
		location: 'Barcelona, Spain',
		date: '2025-06-01',
		circuitName: 'Circuit de Barcelona-Catalunya',
		completed: false,
	},
	{
		id: 8,
		name: 'Canadian Grand Prix',
		location: 'Montreal, Canada',
		date: '2025-06-15',
		circuitName: 'Circuit Gilles Villeneuve',
		completed: false,
	},
];
