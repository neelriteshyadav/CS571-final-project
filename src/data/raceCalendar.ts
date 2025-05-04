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

export const upcomingRaces: Race[] = [
	{
		id: 15,
		name: 'Singapore Grand Prix',
		location: 'Singapore',
		date: '2023-09-17',
		circuitName: 'Marina Bay Street Circuit',
		completed: false,
	},
	{
		id: 16,
		name: 'Japanese Grand Prix',
		location: 'Suzuka, Japan',
		date: '2023-09-24',
		circuitName: 'Suzuka International Racing Course',
		completed: false,
	},
	{
		id: 17,
		name: 'Qatar Grand Prix',
		location: 'Lusail, Qatar',
		date: '2023-10-08',
		circuitName: 'Lusail International Circuit',
		completed: false,
	},
	{
		id: 18,
		name: 'United States Grand Prix',
		location: 'Austin, Texas',
		date: '2023-10-22',
		circuitName: 'Circuit of the Americas',
		completed: false,
	},
];

export const recentRaces: Race[] = [
	{
		id: 14,
		name: 'Italian Grand Prix',
		location: 'Monza, Italy',
		date: '2023-09-03',
		circuitName: 'Autodromo Nazionale Monza',
		completed: true,
		winner: 'Max Verstappen',
	},
	{
		id: 13,
		name: 'Dutch Grand Prix',
		location: 'Zandvoort, Netherlands',
		date: '2023-08-27',
		circuitName: 'Circuit Zandvoort',
		completed: true,
		winner: 'Max Verstappen',
	},
	{
		id: 12,
		name: 'Belgian Grand Prix',
		location: 'Spa-Francorchamps, Belgium',
		date: '2023-07-30',
		circuitName: 'Circuit de Spa-Francorchamps',
		completed: true,
		winner: 'Max Verstappen',
	},
];
