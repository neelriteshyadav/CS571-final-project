/** @format */

import React, { useState } from 'react';
import BarChart from './components/charts/BarChart';
import LineChart from './components/charts/LineChart';
import Heatmap from './components/charts/Heatmap';
import RadialGraph from './components/charts/RadialGraph';
import F1Logo from './components/F1Logo';
import StatsCard from './components/StatsCard';
import RaceCalendar from './components/RaceCalendar';
import DarkModeToggle from './components/DarkModeToggle';
import {
	TrophyIcon,
	SpeedometerIcon,
	PodiumIcon,
	ChampionshipIcon,
} from './components/F1Icons';

import { driverMetricsData } from './data/driverMetrics';
import { teamMetricsData } from './data/teamMetrics';
import { comparativeMetricsData, metricsKeys } from './data/comparativeMetrics';
import {
	driverChampionshipsData,
	constructorChampionshipsData,
} from './data/historicalChampionships';
import { upcomingRaces, recentRaces } from './data/raceCalendar';

// Removed App.css import as Tailwind is handling styles via index.css

function App() {
	const [activeSection, setActiveSection] = useState('home');
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	const toggleMobileMenu = () => {
		setMobileMenuOpen(!mobileMenuOpen);
	};

	return (
		<div className='min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100'>
			{/* Navigation Bar */}
			<nav className='sticky top-0 z-50 bg-indigo-800 dark:bg-indigo-900 text-white shadow-md'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='flex items-center justify-between h-16'>
						<div className='flex items-center space-x-2'>
							<F1Logo className='h-8 w-auto' />
							<span className='text-xl font-bold'>STATS</span>
						</div>
						<div className='hidden md:flex items-center space-x-4'>
							<div className='flex items-baseline space-x-4'>
								{[
									'home',
									'drivers',
									'teams',
									'comparison',
									'championships',
								].map((section) => (
									<button
										key={section}
										className={`px-3 py-2 rounded-md text-sm font-medium capitalize ${
											activeSection === section
												? 'bg-indigo-600 text-white'
												: 'text-indigo-200 hover:bg-indigo-700'
										}`}
										onClick={() => setActiveSection(section)}>
										{section}
									</button>
								))}
							</div>
							<DarkModeToggle />
						</div>
						<div className='md:hidden flex items-center'>
							<DarkModeToggle />
							<button
								onClick={toggleMobileMenu}
								className='ml-2 p-2 rounded-md text-indigo-200 hover:text-white focus:outline-none'>
								<svg
									xmlns='http://www.w3.org/2000/svg'
									className='h-6 w-6'
									fill='none'
									viewBox='0 0 24 24'
									stroke='currentColor'>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M4 6h16M4 12h16M4 18h16'
									/>
								</svg>
							</button>
						</div>
					</div>
				</div>

				{/* Mobile Menu */}
				{mobileMenuOpen && (
					<div className='md:hidden'>
						<div className='px-2 pt-2 pb-3 space-y-1'>
							{['home', 'drivers', 'teams', 'comparison', 'championships'].map(
								(section) => (
									<button
										key={section}
										className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium capitalize ${
											activeSection === section
												? 'bg-indigo-600 text-white'
												: 'text-indigo-200 hover:bg-indigo-700'
										}`}
										onClick={() => {
											setActiveSection(section);
											setMobileMenuOpen(false);
										}}>
										{section}
									</button>
								),
							)}
						</div>
					</div>
				)}
			</nav>

			{/* Hero Section */}
			{activeSection === 'home' && (
				<section className='relative bg-indigo-900 text-white'>
					<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32'>
						<div className='text-center'>
							<h1 className='text-4xl md:text-6xl font-extrabold tracking-tight mb-6'>
								Formula 1 Statistics Dashboard
							</h1>
							<p className='text-xl md:text-2xl max-w-3xl mx-auto mb-10'>
								Explore comprehensive statistics, performance metrics, and
								historical data from the world of Formula 1 racing.
							</p>
							<div className='flex flex-col sm:flex-row justify-center gap-4'>
								<button
									onClick={() => setActiveSection('drivers')}
									className='bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-md font-medium text-lg transition-colors'>
									Driver Stats
								</button>
								<button
									onClick={() => setActiveSection('teams')}
									className='bg-white hover:bg-gray-100 text-indigo-600 px-8 py-3 rounded-md font-medium text-lg transition-colors'>
									Team Performance
								</button>
							</div>
						</div>
					</div>
					<div className='absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-100 dark:from-gray-900 to-transparent'></div>
				</section>
			)}

			<main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
				{/* Home Section with Featured Charts */}
				{activeSection === 'home' && (
					<div className='space-y-12'>
						{/* Stats Cards Section */}
						<section>
							<h2 className='text-2xl md:text-3xl font-bold mb-6 text-indigo-600 dark:text-indigo-400'>
								Current Season Highlights
							</h2>
							<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
								<StatsCard
									title='Race Wins'
									value='15'
									icon={<TrophyIcon className='w-8 h-8' />}
									change='3 more than last season'
									isPositive={true}
								/>
								<StatsCard
									title='Pole Positions'
									value='18'
									icon={<SpeedometerIcon className='w-8 h-8' />}
									change='2 more than last season'
									isPositive={true}
								/>
								<StatsCard
									title='Podiums'
									value='42'
									icon={<PodiumIcon className='w-8 h-8' />}
									change='Same as last season'
								/>
								<StatsCard
									title='Championships'
									value='8'
									icon={<ChampionshipIcon className='w-8 h-8' />}
									change='1 more than last season'
									isPositive={true}
								/>
							</div>
						</section>

						{/* Race Calendar Section */}
						<section>
							<h2 className='text-2xl md:text-3xl font-bold mb-6 text-indigo-600 dark:text-indigo-400'>
								Race Calendar
							</h2>
							<div className='bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 md:p-6'>
								<RaceCalendar
									upcomingRaces={upcomingRaces}
									recentRaces={recentRaces}
								/>
							</div>
						</section>

						<section>
							<h2 className='text-2xl md:text-3xl font-bold mb-6 text-indigo-600 dark:text-indigo-400'>
								Featured Statistics
							</h2>
							<div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
								<div className='bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 md:p-6 flex flex-col'>
									<h3 className='text-xl font-semibold mb-4'>
										Top Drivers by Points
									</h3>
									<p className='text-gray-600 dark:text-gray-400 mb-6'>
										Compare the performance of the leading F1 drivers based on
										championship points earned this season.
									</p>
									<div className='mt-auto'>
										<BarChart data={driverMetricsData} />
									</div>
								</div>
								<div className='bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 md:p-6 flex flex-col'>
									<h3 className='text-xl font-semibold mb-4'>
										Team Performance Trends
									</h3>
									<p className='text-gray-600 dark:text-gray-400 mb-6'>
										Track the evolution of team performance over the racing
										season with key metrics.
									</p>
									<div className='mt-auto'>
										<LineChart data={teamMetricsData} />
									</div>
								</div>
							</div>
						</section>

						<section>
							<h2 className='text-2xl md:text-3xl font-bold mb-6 text-indigo-600 dark:text-indigo-400'>
								Historical Championships
							</h2>
							<div className='bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 md:p-6'>
								<p className='text-gray-600 dark:text-gray-400 mb-6'>
									Discover the most successful drivers and constructors in
									Formula 1 history based on championship titles.
								</p>
								<div className='grid grid-cols-1 sm:grid-cols-2 gap-6 items-start'>
									<RadialGraph
										data={driverChampionshipsData}
										title='Driver Championships'
									/>
									<RadialGraph
										data={constructorChampionshipsData}
										title='Constructor Championships'
									/>
								</div>
							</div>
						</section>
					</div>
				)}

				{/* Drivers Section */}
				{activeSection === 'drivers' && (
					<div className='space-y-8'>
						<section>
							<h2 className='text-2xl md:text-3xl font-bold mb-6 text-indigo-600 dark:text-indigo-400'>
								Driver Performance Analysis
							</h2>
							<div className='bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 md:p-6'>
								<p className='text-gray-600 dark:text-gray-400 mb-6'>
									Comprehensive analysis of current F1 drivers' performance
									metrics including points, podiums, and wins.
								</p>
								<BarChart data={driverMetricsData} />
							</div>
						</section>

						<section>
							<h2 className='text-2xl md:text-3xl font-bold mb-6 text-indigo-600 dark:text-indigo-400'>
								Driver Championship History
							</h2>
							<div className='bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 md:p-6'>
								<p className='text-gray-600 dark:text-gray-400 mb-6'>
									Visualization of all-time driver championship titles in
									Formula 1 history.
								</p>
								<div className='max-w-2xl mx-auto'>
									<RadialGraph
										data={driverChampionshipsData}
										title='Driver Championships'
									/>
								</div>
							</div>
						</section>
					</div>
				)}

				{/* Teams Section */}
				{activeSection === 'teams' && (
					<div className='space-y-8'>
						<section>
							<h2 className='text-2xl md:text-3xl font-bold mb-6 text-indigo-600 dark:text-indigo-400'>
								Team Performance Trends
							</h2>
							<div className='bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 md:p-6'>
								<p className='text-gray-600 dark:text-gray-400 mb-6'>
									Track the performance evolution of Formula 1 teams across the
									current season.
								</p>
								<LineChart data={teamMetricsData} />
							</div>
						</section>

						<section>
							<h2 className='text-2xl md:text-3xl font-bold mb-6 text-indigo-600 dark:text-indigo-400'>
								Constructor Championship History
							</h2>
							<div className='bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 md:p-6'>
								<p className='text-gray-600 dark:text-gray-400 mb-6'>
									Historical overview of constructor championship victories in
									Formula 1.
								</p>
								<div className='max-w-2xl mx-auto'>
									<RadialGraph
										data={constructorChampionshipsData}
										title='Constructor Championships'
									/>
								</div>
							</div>
						</section>
					</div>
				)}

				{/* Comparison Section */}
				{activeSection === 'comparison' && (
					<div className='space-y-8'>
						<section>
							<h2 className='text-2xl md:text-3xl font-bold mb-6 text-indigo-600 dark:text-indigo-400'>
								Team & Driver Comparison
							</h2>
							<div className='bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 md:p-6'>
								<p className='text-gray-600 dark:text-gray-400 mb-6'>
									Comprehensive heatmap visualization comparing various
									performance metrics across teams and drivers.
								</p>
								<Heatmap
									data={comparativeMetricsData}
									metrics={metricsKeys}
								/>
							</div>
						</section>
					</div>
				)}

				{/* Championships Section */}
				{activeSection === 'championships' && (
					<div className='space-y-8'>
						<section>
							<h2 className='text-2xl md:text-3xl font-bold mb-6 text-indigo-600 dark:text-indigo-400'>
								Championship History
							</h2>
							<div className='bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 md:p-6'>
								<p className='text-gray-600 dark:text-gray-400 mb-6'>
									Explore the rich championship history of Formula 1, showcasing
									the most successful drivers and teams.
								</p>
								<div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
									<div>
										<h3 className='text-xl font-semibold mb-4 text-center'>
											Driver Championships
										</h3>
										<RadialGraph
											data={driverChampionshipsData}
											title='Driver Championships'
										/>
									</div>
									<div>
										<h3 className='text-xl font-semibold mb-4 text-center'>
											Constructor Championships
										</h3>
										<RadialGraph
											data={constructorChampionshipsData}
											title='Constructor Championships'
										/>
									</div>
								</div>
							</div>
						</section>
					</div>
				)}
			</main>

			{/* Footer */}
			<footer className='bg-indigo-800 dark:bg-indigo-900 text-white py-8'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
						<div>
							<h3 className='text-lg font-semibold mb-3'>F1 Stats Dashboard</h3>
							<p className='text-indigo-200'>
								Comprehensive Formula 1 statistics and visualizations for fans
								and analysts.
							</p>
						</div>
						<div>
							<h3 className='text-lg font-semibold mb-3'>Data Sources</h3>
							<p className='text-indigo-200'>
								All statistics are compiled from official Formula 1 data sources
								and updated regularly.
							</p>
						</div>
						<div>
							<h3 className='text-lg font-semibold mb-3'>Disclaimer</h3>
							<p className='text-indigo-200'>
								This is a fan-made statistics dashboard and is not affiliated
								with Formula 1 or FIA.
							</p>
						</div>
					</div>
					<div className='mt-8 border-t border-indigo-700 pt-6 text-center text-indigo-200'>
						<p>
							© {new Date().getFullYear()} F1 Stats Dashboard. All rights
							reserved.
						</p>
					</div>
				</div>
			</footer>
		</div>
	);
}

export default App;
