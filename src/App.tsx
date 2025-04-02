/** @format */

import React from 'react';
import BarChart from './components/charts/BarChart';
import LineChart from './components/charts/LineChart';
import Heatmap from './components/charts/Heatmap';
import RadialGraph from './components/charts/RadialGraph';

import { driverMetricsData } from './data/driverMetrics';
import { teamMetricsData } from './data/teamMetrics';
import { comparativeMetricsData, metricsKeys } from './data/comparativeMetrics';
import {
	driverChampionshipsData,
	constructorChampionshipsData,
} from './data/historicalChampionships';

// Removed App.css import as Tailwind is handling styles via index.css

function App() {
	return (
		<div className='min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 md:p-8'>
			<h1 className='text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12 text-indigo-600 dark:text-indigo-400'>
				F1 Data Visualization Dashboard
			</h1>

			<div className='grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto'>
				{/* Chart Section: Bar Chart */}
				<section className='bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 md:p-6'>
					<BarChart data={driverMetricsData} />
				</section>

				{/* Chart Section: Line Chart */}
				<section className='bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 md:p-6'>
					<LineChart data={teamMetricsData} />
				</section>

				{/* Chart Section: Heatmap */}
				<section className='bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 md:p-6 lg:col-span-2'>
					<Heatmap
						data={comparativeMetricsData}
						metrics={metricsKeys}
					/>
				</section>

				{/* Chart Section: Radial Graphs (Horizontal Layout) */}
				<section className='bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 md:p-6 lg:col-span-2'>
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
				</section>
			</div>
		</div>
	);
}

export default App;
