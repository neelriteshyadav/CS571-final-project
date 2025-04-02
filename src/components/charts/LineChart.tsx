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
	const zoomRef = useRef<SVGGElement>(null);
	const [currentMetric, setCurrentMetric] = useState<MetricKey>('points');
	const [currentZoomState, setCurrentZoomState] = useState<d3.ZoomTransform>(
		d3.zoomIdentity,
	);

	const margin = { top: 20, right: 100, bottom: 50, left: 60 }; // Adjusted margins
	const width = 800 - margin.left - margin.right;
	const height = 400 - margin.top - margin.bottom;

	useEffect(() => {
		if (!ref.current || !zoomRef.current || data.length === 0) return;

		const svg = d3
			.select(ref.current)
			.attr('width', width + margin.left + margin.right)
			.attr('height', height + margin.top + margin.bottom);

		// Clear previous elements specific to metric/data change
		svg.selectAll('.chart-content').remove();
		svg.selectAll('.axis').remove();
		svg.selectAll('.legend').remove();

		const chartGroup = svg
			.append('g')
			.attr('class', 'chart-content')
			.attr('transform', `translate(${margin.left},${margin.top})`);

		// --- Data Preparation ---
		const allRaces = Array.from(
			new Set(data.flatMap((team) => team.data.map((d) => d.race))),
		).sort((a, b) => a - b);
		const allValues = data.flatMap((team) =>
			team.data.map((d) => d[currentMetric]),
		);

		// --- Scales ---
		const xScale = d3
			.scaleLinear()
			.domain(d3.extent(allRaces) as [number, number])
			.range([0, width]);

		const yScale = d3
			.scaleLinear()
			.domain([0, d3.max(allValues) ?? 0])
			.nice()
			.range([height, 0]);

		const colorScale = d3
			.scaleOrdinal(d3.schemeCategory10)
			.domain(data.map((d) => d.team));

		// Apply zoom state to scales
		const zoomedXScale = currentZoomState.rescaleX(xScale);
		const zoomedYScale = currentZoomState.rescaleY(yScale);

		// --- Axes ---
		const xAxis = d3
			.axisBottom(zoomedXScale)
			.ticks(width / 80)
			.tickSizeOuter(0);
		const yAxis = d3.axisLeft(zoomedYScale);

		const gx = svg
			.append('g')
			.attr('class', 'axis axis--x')
			.attr('transform', `translate(${margin.left},${height + margin.top})`)
			.call(xAxis);

		const gy = svg
			.append('g')
			.attr('class', 'axis axis--y')
			.attr('transform', `translate(${margin.left},${margin.top})`)
			.call(yAxis);

		// Add Axis Labels
		svg
			.append('text')
			.attr('class', 'axis-label')
			.attr(
				'transform',
				`translate(${margin.left + width / 2}, ${
					height + margin.top + margin.bottom - 5
				})`,
			)
			.style('text-anchor', 'middle')
			.style('font-size', '12px')
			.text('Race Number');

		svg
			.append('text')
			.attr('class', 'axis-label')
			.attr('transform', 'rotate(-90)')
			.attr('y', 0)
			.attr('x', 0 - height / 2 - margin.top)
			.attr('dy', '1em')
			.style('text-anchor', 'middle')
			.style('font-size', '12px')
			.text(currentMetric === 'points' ? 'Points' : 'Average Lap Time (s)');

		// --- Lines ---
		const lineGenerator = d3
			.line<TeamMetricPoint>()
			.x((d) => zoomedXScale(d.race))
			.y((d) => zoomedYScale(d[currentMetric]));

		const clipPath = chartGroup
			.append('defs')
			.append('clipPath')
			.attr('id', 'clip')
			.append('rect')
			.attr('width', width)
			.attr('height', height);

		const pathGroup = chartGroup
			.append('g')
			.attr('clip-path', 'url(#clip)')
			.attr('class', 'lines-group');

		pathGroup
			.selectAll('.line')
			.data(data)
			.enter()
			.append('path')
			.attr('class', 'line')
			.attr('d', (d) => lineGenerator(d.data))
			.attr('fill', 'none')
			.attr('stroke', (d) => colorScale(d.team))
			.attr('stroke-width', 1.5);

		// --- Legend ---
		const legend = svg
			.append('g')
			.attr('class', 'legend')
			.attr('font-family', 'sans-serif')
			.attr('font-size', 10)
			.attr('text-anchor', 'start') // Changed anchor to start
			.attr(
				'transform',
				`translate(${width + margin.left + 10}, ${margin.top})`,
			)
			.selectAll('g')
			.data(data)
			.enter()
			.append('g')
			.attr('transform', (d, i) => `translate(0,${i * 20})`);

		legend
			.append('rect')
			.attr('x', 0) // Adjusted x position
			.attr('width', 19)
			.attr('height', 19)
			.attr('fill', (d) => colorScale(d.team));

		legend
			.append('text')
			.attr('x', 24) // Adjusted x position
			.attr('y', 9.5)
			.attr('dy', '0.32em')
			.text((d) => d.team);

		// --- Zoom --- Re-attach zoom listener
		const zoomBehavior = d3
			.zoom<SVGSVGElement, unknown>()
			.scaleExtent([0.5, 20]) // Set zoom scale limits
			.translateExtent([
				[0, 0],
				[width, height],
			]) // Pan extent
			.extent([
				[0, 0],
				[width, height],
			])
			.on('zoom', (event) => {
				setCurrentZoomState(event.transform);
			});

		// Use a transparent rect overlay for capturing zoom events
		// Ensure it's appended to the main SVG but positioned over the chart area
		svg.select('.zoom-rect').remove(); // Remove old rect if exists
		svg
			.append('rect')
			.attr('class', 'zoom-rect')
			.attr('width', width)
			.attr('height', height)
			.attr('transform', `translate(${margin.left},${margin.top})`)
			.style('fill', 'none')
			.style('pointer-events', 'all')
			.call(zoomBehavior as any) // Type assertion needed sometimes
			.call(zoomBehavior.transform as any, currentZoomState); // Restore zoom state
	}, [data, width, height, margin, currentMetric, currentZoomState]); // Depend on zoom state

	return (
		<div>
			<h3>Team Metrics Over Season</h3>
			<div>
				<button
					onClick={() => setCurrentMetric('points')}
					disabled={currentMetric === 'points'}>
					Show Points
				</button>
				<button
					onClick={() => setCurrentMetric('avgLapTime')}
					disabled={currentMetric === 'avgLapTime'}>
					Show Avg Lap Time
				</button>
			</div>
			<svg ref={ref}>
				{/* Zoomable content group reference - might not be strictly needed with overlay */}
				<g ref={zoomRef}></g>
			</svg>
			{/* Add Tooltip display logic here if needed */}
		</div>
	);
};

export default LineChart;
