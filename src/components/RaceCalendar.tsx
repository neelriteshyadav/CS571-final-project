/** @format */

import React from 'react';
import { Race } from '../data/raceCalendar';

interface RaceCalendarProps {
	upcomingRaces: Race[];
	recentRaces: Race[];
}

const RaceCalendar: React.FC<RaceCalendarProps> = ({
	upcomingRaces,
	recentRaces,
}) => {
	// Format date to a more readable format
	const formatDate = (dateString: string): string => {
		const options: Intl.DateTimeFormatOptions = {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
		};
		return new Date(dateString).toLocaleDateString(undefined, options);
	};

	return (
		<div className='space-y-8'>
			<div>
				<h3 className='text-xl font-semibold mb-4'>Upcoming Races</h3>
				<div className='overflow-hidden bg-white dark:bg-gray-800 shadow-md rounded-lg'>
					<ul className='divide-y divide-gray-200 dark:divide-gray-700'>
						{upcomingRaces.map((race) => (
							<li
								key={race.id}
								className='hover:bg-gray-50 dark:hover:bg-gray-700'>
								<div className='px-4 py-4 sm:px-6'>
									<div className='flex items-center justify-between'>
										<div className='flex flex-col'>
											<p className='text-sm font-medium text-indigo-600 dark:text-indigo-400 truncate'>
												{race.name}
											</p>
											<p className='mt-1 text-xs text-gray-500 dark:text-gray-400'>
												{race.circuitName}
											</p>
										</div>
										<div className='ml-2 flex-shrink-0 flex'>
											<p className='px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200'>
												{formatDate(race.date)}
											</p>
										</div>
									</div>
									<div className='mt-2 sm:flex sm:justify-between'>
										<div className='sm:flex'>
											<p className='flex items-center text-sm text-gray-500 dark:text-gray-400'>
												{race.location}
											</p>
										</div>
									</div>
								</div>
							</li>
						))}
					</ul>
				</div>
			</div>

			<div>
				<h3 className='text-xl font-semibold mb-4'>Recent Results</h3>
				<div className='overflow-hidden bg-white dark:bg-gray-800 shadow-md rounded-lg'>
					<ul className='divide-y divide-gray-200 dark:divide-gray-700'>
						{recentRaces.map((race) => (
							<li
								key={race.id}
								className='hover:bg-gray-50 dark:hover:bg-gray-700'>
								<div className='px-4 py-4 sm:px-6'>
									<div className='flex items-center justify-between'>
										<div className='flex flex-col'>
											<p className='text-sm font-medium text-indigo-600 dark:text-indigo-400 truncate'>
												{race.name}
											</p>
											<p className='mt-1 text-xs text-gray-500 dark:text-gray-400'>
												{race.circuitName}
											</p>
										</div>
										<div className='ml-2 flex-shrink-0 flex'>
											<p className='px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'>
												{formatDate(race.date)}
											</p>
										</div>
									</div>
									<div className='mt-2 sm:flex sm:justify-between'>
										<div className='sm:flex'>
											<p className='flex items-center text-sm text-gray-500 dark:text-gray-400'>
												{race.location}
											</p>
										</div>
										<div className='mt-2 flex items-center text-sm text-gray-500 sm:mt-0'>
											<p>
												Winner:{' '}
												<span className='font-medium text-gray-900 dark:text-white'>
													{race.winner}
												</span>
											</p>
										</div>
									</div>
								</div>
							</li>
						))}
					</ul>
				</div>
			</div>
		</div>
	);
};

export default RaceCalendar;
