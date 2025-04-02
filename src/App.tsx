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

import './App.css'; // Keep default styling or customize as needed

function App() {
	return (
		<div className='App'>
			<h1>F1 Data Visualization Dashboard</h1>

			<section className='chart-section'>
				<BarChart data={driverMetricsData} />
			</section>

			<section className='chart-section'>
				<LineChart data={teamMetricsData} />
			</section>

			<section className='chart-section'>
				{/* Pass both data and the keys for metrics to display */}
				<Heatmap
					data={comparativeMetricsData}
					metrics={metricsKeys}
				/>
			</section>

			<section className='chart-section chart-section-horizontal'>
				<RadialGraph
					data={driverChampionshipsData}
					title='Driver Championships'
				/>
				<RadialGraph
					data={constructorChampionshipsData}
					title='Constructor Championships'
				/>
			</section>
		</div>
	);
}

export default App;
