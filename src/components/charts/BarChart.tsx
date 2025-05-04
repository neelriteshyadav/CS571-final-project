/** @format */

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { DriverMetric } from '../../data/driverMetrics';

interface BarChartProps {
	data: DriverMetric[];
}

const BarChart: React.FC<BarChartProps> = ({ data }) => {
	const ref = useRef<SVGSVGElement>(null);
	const [tooltipContent, setTooltipContent] = useState<string | null>(null);
	const [tooltipPosition, setTooltipPosition] = useState<{
		x: number;
		y: number;
	} | null>(null);
	const [selectedDriver, setSelectedDriver] = useState<string | null>(null);

	const margin = { top: 40, right: 120, bottom: 80, left: 60 }; // Adjusted for labels/title
	const width = 800 - margin.left - margin.right;
	const height = 400 - margin.top - margin.bottom;

	useEffect(() => {
		if (!ref.current || data.length === 0) return;

		// Use current theme for text colors
		const isDarkMode =
			window.matchMedia &&
			window.matchMedia('(prefers-color-scheme: dark)').matches;
		const axisTextColor = isDarkMode ? '#cbd5e1' : '#4b5563'; // slate-300 : gray-600
		const gridColor = isDarkMode ? '#374151' : '#e5e7eb'; // gray-700 : gray-200

		const svgRoot = d3.select(ref.current);
		svgRoot.selectAll('*').remove(); // Clear previous render

		const svg = svgRoot
			.attr('width', '100%') // Responsive width
			.attr('height', height + margin.top + margin.bottom)
			.attr(
				'viewBox',
				`0 0 ${width + margin.left + margin.right} ${
					height + margin.top + margin.bottom
				}`,
			)
			.append('g')
			.attr('transform', `translate(${margin.left},${margin.top})`);

		const drivers = data.map((d) => d.driver);
		const metrics: (keyof Omit<DriverMetric, 'driver'>)[] = [
			'points',
			'wins',
			'poles',
		];

		// --- Scales ---
		const xScale0 = d3
			.scaleBand()
			.domain(drivers)
			.range([0, width])
			.padding(0.2);

		const xScale1 = d3
			.scaleBand()
			.domain(metrics)
			.range([0, xScale0.bandwidth()])
			.padding(0.05);

		// Adjusted scaling for visibility - might need fine-tuning based on real data
		const maxValue =
			d3.max(data, (d) => Math.max(d.points, d.wins * 50, d.poles * 100)) ?? 0;
		const yScale = d3
			.scaleLinear()
			.domain([0, maxValue * 1.1]) // Add padding to top
			.nice()
			.range([height, 0]);

		const colorScale = d3
			.scaleOrdinal<string>()
			.domain(metrics)
			.range(['#6366f1', '#ec4899', '#f59e0b']); // Indigo, Pink, Amber

		// --- Chart Title ---
		svg
			.append('text')
			.attr('class', 'chart-title')
			.attr('x', width / 2)
			.attr('y', -20)
			.attr('text-anchor', 'middle')
			.attr('font-size', '16px')
			.attr('font-weight', 'bold')
			.attr('fill', axisTextColor)
			.text('Driver Performance Comparison');

		// --- Axes ---
		const xAxis = d3.axisBottom(xScale0).tickSizeOuter(0);
		svg
			.append('g')
			.attr('class', 'x-axis')
			.attr('transform', `translate(0,${height})`)
			.call(xAxis)
			.call((g) => g.select('.domain').remove()) // Remove axis line
			.selectAll('text')
			.attr('transform', 'translate(-10,5) rotate(-45)')
			.style('text-anchor', 'end')
			.attr('fill', axisTextColor)
			.attr('font-size', '10px');

		const yAxis = d3.axisLeft(yScale).ticks(5).tickSize(-width); // Add grid lines
		svg
			.append('g')
			.attr('class', 'y-axis')
			.call(yAxis)
			.call((g) => g.select('.domain').remove()) // Remove axis line
			.call((g) =>
				g
					.selectAll('.tick line') // Style grid lines
					.attr('stroke', gridColor)
					.attr('stroke-opacity', 0.7)
					.attr('stroke-dasharray', '2,2'),
			)
			.call((g) =>
				g
					.selectAll('.tick text') // Style axis text
					.attr('fill', axisTextColor)
					.attr('x', -8)
					.attr('font-size', '10px'),
			);

		// Add X axis label
		svg
			.append('text')
			.attr('x', width / 2)
			.attr('y', height + margin.bottom - 30)
			.style('text-anchor', 'middle')
			.style('font-size', '12px')
			.attr('fill', axisTextColor)
			.text('Driver');

		// Add Y axis label
		svg
			.append('text')
			.attr('transform', 'rotate(-90)')
			.attr('y', 0 - margin.left + 15) // Adjusted position
			.attr('x', 0 - height / 2)
			.attr('dy', '1em')
			.style('text-anchor', 'middle')
			.style('font-size', '12px')
			.attr('fill', axisTextColor)
			.text('Metric Value (Scaled)');

		// Add scale note
		svg
			.append('text')
			.attr('class', 'scale-note')
			.attr('x', width / 2)
			.attr('y', height + margin.bottom - 10)
			.style('text-anchor', 'middle')
			.style('font-size', '10px')
			.style('font-style', 'italic')
			.attr('fill', axisTextColor)
			.text(
				'Note: Wins and poles are scaled for comparison (Wins ×50, Poles ×100)',
			);

		// --- Bars ---
		const driverGroups = svg
			.selectAll('.driver-group')
			.data(data)
			.enter()
			.append('g')
			.attr('class', 'driver-group')
			.attr('transform', (d) => `translate(${xScale0(d.driver) ?? 0},0)`);

		const bars = driverGroups
			.selectAll('rect')
			.data((d) =>
				metrics.map((key) => ({ key, value: d[key], driver: d.driver })),
			)
			.enter()
			.append('rect')
			.attr('x', (d) => xScale1(d.key) ?? 0)
			.attr('y', (d) => yScale(d.value))
			.attr('width', xScale1.bandwidth())
			.attr('height', (d) => height - yScale(d.value))
			.attr('fill', (d) => colorScale(d.key))
			.attr('rx', 2) // Slightly rounded corners
			.style('opacity', (d) =>
				selectedDriver === null || selectedDriver === d.driver ? 1 : 0.3,
			)
			.style('cursor', 'pointer')
			.on('mouseover', function (event, d) {
				d3.select(this).style('filter', 'brightness(1.2)');

				// Display appropriate scale factor in tooltip
				let displayValue = d.value;
				let displayText = `${d.driver} - ${d.key}: ${displayValue}`;

				if (d.key === 'wins') {
					displayText += ' (×50 in chart)';
				} else if (d.key === 'poles') {
					displayText += ' (×100 in chart)';
				}

				setTooltipPosition({ x: event.pageX, y: event.pageY });
				setTooltipContent(displayText);
			})
			.on('mousemove', (event) => {
				setTooltipPosition({ x: event.pageX, y: event.pageY });
			})
			.on('mouseout', function (event, d) {
				d3.select(this).style('filter', 'brightness(1)');
				setTooltipPosition(null);
				setTooltipContent(null);
			})
			.on('click', (event, d) => {
				setSelectedDriver((prev) => (prev === d.driver ? null : d.driver));
			});

		// --- Add values above bars ---
		driverGroups
			.selectAll('.bar-value')
			.data((d) =>
				metrics.map((key) => ({ key, value: d[key], driver: d.driver })),
			)
			.enter()
			.append('text')
			.attr('class', 'bar-value')
			.attr('x', (d) => (xScale1(d.key) ?? 0) + xScale1.bandwidth() / 2)
			.attr('y', (d) => yScale(d.value) - 5)
			.attr('text-anchor', 'middle')
			.attr('font-size', '9px')
			.attr('font-weight', 'bold')
			.attr('fill', (d) => {
				// Use a darker shade of the bar color for better contrast
				const color = d3.color(colorScale(d.key));
				return color ? d3.rgb(color).darker(0.8).toString() : '#000';
			})
			.text((d) => d.value)
			.style('opacity', (d) =>
				selectedDriver === null || selectedDriver === d.driver ? 1 : 0.3,
			);

		// --- Legend ---
		const metricDescriptions = {
			points: 'Total championship points',
			wins: 'Race victories (×50 in chart)',
			poles: 'Pole positions (×100 in chart)',
		};

		const legend = svg
			.append('g')
			.attr('font-family', 'sans-serif')
			.attr('font-size', 10)
			.attr('text-anchor', 'start')
			.attr('transform', `translate(${width + 20}, 0)`)
			.selectAll('g')
			.data(metrics)
			.enter()
			.append('g')
			.attr('transform', (d, i) => `translate(0, ${i * 40})`);

		// Colored rectangle
		legend
			.append('rect')
			.attr('x', 0)
			.attr('width', 12)
			.attr('height', 12)
			.attr('fill', colorScale)
			.attr('rx', 2);

		// Metric name
		legend
			.append('text')
			.attr('x', 18)
			.attr('y', 6)
			.attr('dy', '0.32em')
			.attr('fill', axisTextColor)
			.attr('font-weight', 'bold')
			.style('text-transform', 'capitalize')
			.text((d) => d);

		// Metric description
		legend
			.append('text')
			.attr('x', 18)
			.attr('y', 18)
			.attr('fill', axisTextColor)
			.attr('font-size', '8px')
			.style('font-style', 'italic')
			.text((d) => metricDescriptions[d]);
	}, [
		data,
		height,
		margin.bottom,
		margin.left,
		margin.top,
		margin.right,
		width,
		selectedDriver,
	]);

	return (
		<div className='relative'>
			<h3 className='text-lg font-semibold mb-4 text-center text-gray-700 dark:text-gray-300'>
				Driver Season Metrics
			</h3>
			<div className='text-center text-sm text-gray-500 dark:text-gray-400 mb-2'>
				Click on a bar to highlight specific driver. Hover for detailed values.
			</div>
			<svg ref={ref}></svg>
			{tooltipContent && tooltipPosition && (
				<div
					className='absolute z-10 px-3 py-1.5 text-xs font-medium text-white bg-gray-900 rounded-md shadow-sm dark:bg-gray-700 pointer-events-none'
					style={{
						left: `${tooltipPosition.x + 10}px`,
						top: `${tooltipPosition.y + 10}px`,
					}}>
					{tooltipContent}
				</div>
			)}
		</div>
	);
};

export default BarChart;
