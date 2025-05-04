/** @format */

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { TeamSeasonMetrics, TeamMetricPoint } from '../../data/teamMetrics';

interface LineChartProps {
	data: TeamSeasonMetrics[];
}

type MetricKey = 'points' | 'avgLapTime';

const LineChart: React.FC<LineChartProps> = ({ data }) => {
	const ref = useRef<SVGSVGElement>(null);
	// zoomRef might not be strictly needed anymore with the overlay approach
	// const zoomRef = useRef<SVGGElement>(null);
	const [currentMetric, setCurrentMetric] = useState<MetricKey>('points');
	const [currentZoomState, setCurrentZoomState] = useState<d3.ZoomTransform>(
		d3.zoomIdentity,
	);

	// Increase left margin to prevent y-axis overlap
	const margin = { top: 30, right: 120, bottom: 50, left: 90 };
	const width = 800 - margin.left - margin.right;
	const height = 400 - margin.top - margin.bottom;

	useEffect(() => {
		// Initial check
		if (!ref.current || data.length === 0) return;

		// Use current theme for text colors
		const isDarkMode =
			window.matchMedia &&
			window.matchMedia('(prefers-color-scheme: dark)').matches;
		const axisTextColor = isDarkMode ? '#cbd5e1' : '#4b5563'; // slate-300 : gray-600
		const gridColor = isDarkMode ? '#374151' : '#e5e7eb'; // gray-700 : gray-200
		const zoomRectFill = isDarkMode
			? 'rgba(255, 255, 255, 0.01)'
			: 'rgba(0, 0, 0, 0.01)'; // Near transparent for zoom

		const svg = d3
			.select(ref.current)
			.attr('width', '100%') // Responsive width
			.attr('height', height + margin.top + margin.bottom)
			.attr(
				'viewBox',
				`0 0 ${width + margin.left + margin.right} ${
					height + margin.top + margin.bottom
				}`,
			);

		// Clear previous elements before re-rendering based on metric/zoom
		svg
			.selectAll(
				'.chart-content, .axis, .legend, .zoom-layer, .axis-label, .chart-title',
			)
			.remove();

		// --- Data Preparation ---
		const allRaces = Array.from(
			new Set(data.flatMap((team) => team.data.map((d) => d.race))),
		).sort((a, b) => a - b);
		const allValues = data.flatMap((team) =>
			team.data.map((d) => d[currentMetric]),
		);

		// --- Scales (Original) ---
		const xScale = d3
			.scaleLinear()
			.domain(d3.extent(allRaces) as [number, number])
			.range([0, width]);

		// Adjust y-scale domain based on metric
		const yScale = d3
			.scaleLinear()
			.domain(
				currentMetric === 'points'
					? [0, (d3.max(allValues) ?? 0) * 1.1] // Add padding to top
					: [
							d3.min(allValues) ? (d3.min(allValues) as number) * 0.95 : 0, // 5% padding below min
							d3.max(allValues) ? (d3.max(allValues) as number) * 1.05 : 100,
					  ],
			) // 5% padding above max
			.nice()
			.range([height, 0]);

		const colorScale = d3
			.scaleOrdinal(d3.schemeCategory10)
			.domain(data.map((d) => d.team));

		// --- Apply Zoom --- Need to calculate zoomed scales for axes and lines
		const zoomedXScale = currentZoomState.rescaleX(xScale);
		const zoomedYScale = currentZoomState.rescaleY(yScale);

		// --- Clipping Path ---
		svg
			.append('defs')
			.append('clipPath')
			.attr('id', 'clip-line')
			.append('rect')
			.attr('width', width)
			.attr('height', height)
			.attr('x', 0)
			.attr('y', 0);

		// --- Chart Content Group (clipped) ---
		const chartGroup = svg
			.append('g')
			.attr('class', 'chart-content')
			.attr('transform', `translate(${margin.left},${margin.top})`)
			.attr('clip-path', 'url(#clip-line)');

		// --- Axes (using zoomed scales) ---
		const xAxis = d3
			.axisBottom(zoomedXScale)
			.ticks(width / 80)
			.tickSizeOuter(0);
		const yAxis = d3.axisLeft(zoomedYScale).ticks(5).tickSize(-width);

		const gx = svg
			.append('g')
			.attr('class', 'axis axis--x')
			.attr('transform', `translate(${margin.left},${height + margin.top})`)
			.call(xAxis)
			.call((g) => g.select('.domain').remove())
			.selectAll('text')
			.attr('fill', axisTextColor)
			.attr('font-size', '10px');

		const gy = svg
			.append('g')
			.attr('class', 'axis axis--y')
			.attr('transform', `translate(${margin.left},${margin.top})`)
			.call(yAxis)
			.call((g) => g.select('.domain').remove())
			.call((g) =>
				g
					.selectAll('.tick line')
					.attr('stroke', gridColor)
					.attr('stroke-opacity', 0.7)
					.attr('stroke-dasharray', '2,2'),
			)
			.call((g) =>
				g
					.selectAll('.tick text')
					.attr('fill', axisTextColor)
					.attr('x', -8)
					.attr('font-size', '10px'),
			);

		// --- Chart Title ---
		svg
			.append('text')
			.attr('class', 'chart-title')
			.attr(
				'transform',
				`translate(${margin.left + width / 2}, ${margin.top / 2})`,
			)
			.style('text-anchor', 'middle')
			.style('font-size', '14px')
			.style('font-weight', 'bold')
			.attr('fill', axisTextColor)
			.text(
				currentMetric === 'points'
					? 'Team Points per Race'
					: 'Team Average Lap Times',
			);

		// Add Axis Labels
		svg
			.append('text')
			.attr('class', 'axis-label')
			.attr(
				'transform',
				`translate(${margin.left + width / 2}, ${
					height + margin.top + margin.bottom - 10
				})`,
			)
			.style('text-anchor', 'middle')
			.style('font-size', '12px')
			.attr('fill', axisTextColor)
			.text('Race Number');

		// Add Y axis label
		svg
			.append('text')
			.attr('class', 'axis-label')
			.attr('transform', 'rotate(-90)')
			.attr('y', -margin.left + 20) // Adjusted position to prevent overlap
			.attr('x', 0 - height / 2 - margin.top)
			.attr('dy', '1em')
			.style('text-anchor', 'middle')
			.style('font-size', '12px')
			.attr('fill', axisTextColor)
			.text(
				currentMetric === 'points' ? 'Points' : 'Average Lap Time (seconds)',
			);

		// --- Lines (using zoomed scales, appended to chartGroup) ---
		const lineGenerator = d3
			.line<TeamMetricPoint>()
			.x((d) => zoomedXScale(d.race))
			.y((d) => zoomedYScale(d[currentMetric]))
			.curve(d3.curveMonotoneX); // Smoother lines

		chartGroup
			.selectAll('.line')
			.data(data)
			.enter()
			.append('path')
			.attr('class', 'line')
			.attr('d', (d) => lineGenerator(d.data))
			.attr('fill', 'none')
			.attr('stroke', (d) => colorScale(d.team))
			.attr('stroke-width', 2); // Slightly thicker lines

		// --- Annotations for important data points ---
		// For each team, annotate their best performance
		data.forEach((team) => {
			let bestDataPoint: TeamMetricPoint | null = null;

			if (currentMetric === 'points') {
				// For points, find the max point value
				bestDataPoint = team.data.reduce(
					(best, current) =>
						current.points > (best?.points || 0) ? current : best,
					null as TeamMetricPoint | null,
				);
			} else {
				// For lap time, find the min lap time (faster is better)
				bestDataPoint = team.data.reduce(
					(best, current) =>
						best === null || current.avgLapTime < best.avgLapTime
							? current
							: best,
					null as TeamMetricPoint | null,
				);
			}

			if (bestDataPoint) {
				// Add a circle at the best point
				chartGroup
					.append('circle')
					.attr('cx', zoomedXScale(bestDataPoint.race))
					.attr('cy', zoomedYScale(bestDataPoint[currentMetric]))
					.attr('r', 4)
					.attr('fill', colorScale(team.team))
					.attr('stroke', '#ffffff')
					.attr('stroke-width', 1);

				// Optional: add text label for the value
				chartGroup
					.append('text')
					.attr('x', zoomedXScale(bestDataPoint.race) + 5)
					.attr('y', zoomedYScale(bestDataPoint[currentMetric]) - 5)
					.attr('font-size', '9px')
					.attr('fill', colorScale(team.team))
					.text(
						bestDataPoint[currentMetric].toFixed(
							currentMetric === 'avgLapTime' ? 1 : 0,
						),
					);
			}
		});

		// --- Legend ---
		const legend = svg
			.append('g')
			.attr('class', 'legend')
			.attr('font-family', 'sans-serif')
			.attr('font-size', 10)
			.attr('text-anchor', 'start')
			.attr(
				'transform',
				`translate(${width + margin.left + 15}, ${margin.top})`,
			)
			.selectAll('g')
			.data(data)
			.enter()
			.append('g')
			.attr('transform', (d, i) => `translate(0,${i * 20})`);

		legend
			.append('rect')
			.attr('x', 0)
			.attr('width', 12)
			.attr('height', 12)
			.attr('fill', (d) => colorScale(d.team))
			.attr('rx', 2);

		legend
			.append('text')
			.attr('x', 18)
			.attr('y', 6)
			.attr('dy', '0.32em')
			.attr('fill', axisTextColor)
			.text((d) => d.team);

		// --- Zoom Layer (Overlay) ---
		const zoomBehavior = d3
			.zoom<SVGRectElement, unknown>() // Attach to the rect element
			.scaleExtent([0.5, 20])
			.translateExtent([
				[0, 0],
				[width, height],
			])
			.extent([
				[0, 0],
				[width, height],
			])
			.on('zoom', (event) => {
				if (event.sourceEvent && event.sourceEvent.type !== 'wheel') {
					event.sourceEvent.preventDefault(); // Prevent text selection on drag
				}
				setCurrentZoomState(event.transform);
			});

		svg
			.append('rect')
			.attr('class', 'zoom-layer')
			.attr('width', width)
			.attr('height', height)
			.attr('transform', `translate(${margin.left},${margin.top})`)
			.style('fill', zoomRectFill) // Use near transparent fill
			.style('cursor', 'move')
			.style('pointer-events', 'all')
			.call(zoomBehavior)
			.call(zoomBehavior.transform, currentZoomState); // Restore zoom state

		// Add instruction text
		svg
			.append('text')
			.attr('class', 'instruction-text')
			.attr(
				'transform',
				`translate(${margin.left + width / 2}, ${height + margin.top + 25})`,
			)
			.style('text-anchor', 'middle')
			.style('font-size', '11px')
			.style('font-weight', 'bold')
			.style('font-style', 'italic')
			.attr('fill', axisTextColor)
			.text('Drag to pan, scroll to zoom');
	}, [data, width, height, margin, currentMetric, currentZoomState]);

	// Helper function for button classes
	const getButtonClasses = (metric: MetricKey): string => {
		const baseClasses =
			'px-4 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800';
		const activeClasses =
			'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500';
		const inactiveClasses =
			'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 focus:ring-gray-500';
		const disabledClasses = 'opacity-50 cursor-not-allowed';

		return `${baseClasses} ${
			currentMetric === metric ? activeClasses : inactiveClasses
		} ${currentMetric === metric ? disabledClasses : ''}`;
	};

	return (
		<div>
			<h3 className='text-lg font-semibold mb-2 text-center text-gray-700 dark:text-gray-300'>
				Team Metrics Over Season
			</h3>
			<div className='flex justify-center space-x-4 mb-4'>
				<button
					className={getButtonClasses('points')}
					onClick={() => setCurrentMetric('points')}
					disabled={currentMetric === 'points'}>
					Show Points
				</button>
				<button
					className={getButtonClasses('avgLapTime')}
					onClick={() => setCurrentMetric('avgLapTime')}
					disabled={currentMetric === 'avgLapTime'}>
					Show Avg Lap Time
				</button>
			</div>
			<div className='text-center text-sm text-gray-500 dark:text-gray-400 mb-2'>
				{currentMetric === 'points'
					? 'Track team points accumulation across races'
					: 'Compare team average lap times (lower is better)'}
			</div>
			<svg ref={ref}>
				{/* Content is now drawn directly into the main SVG */}
			</svg>
		</div>
	);
};

export default LineChart;
