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

	const margin = { top: 20, right: 30, bottom: 60, left: 60 }; // Increased bottom margin for labels
	const width = 800 - margin.left - margin.right;
	const height = 400 - margin.top - margin.bottom;

	useEffect(() => {
		if (!ref.current || data.length === 0) return;

		const svg = d3
			.select(ref.current)
			.attr('width', width + margin.left + margin.right)
			.attr('height', height + margin.top + margin.bottom)
			.append('g')
			.attr('transform', `translate(${margin.left},${margin.top})`);

		// Clear previous render
		svg.selectAll('*').remove();

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

		const yScale = d3
			.scaleLinear()
			.domain([
				0,
				d3.max(data, (d) => Math.max(d.points, d.wins * 50, d.poles * 100)) ??
					0,
			]) // Adjusted scaling for visibility
			.nice()
			.range([height, 0]);

		const colorScale = d3
			.scaleOrdinal<string>()
			.domain(metrics)
			.range(d3.schemeCategory10);

		// --- Axes ---
		const xAxis = d3.axisBottom(xScale0);
		svg
			.append('g')
			.attr('transform', `translate(0,${height})`)
			.call(xAxis)
			.selectAll('text')
			.attr('transform', 'rotate(-45)')
			.style('text-anchor', 'end');

		const yAxis = d3.axisLeft(yScale);
		svg.append('g').call(yAxis);

		// Add Y axis label
		svg
			.append('text')
			.attr('transform', 'rotate(-90)')
			.attr('y', 0 - margin.left)
			.attr('x', 0 - height / 2)
			.attr('dy', '1em')
			.style('text-anchor', 'middle')
			.style('font-size', '12px')
			.text('Metric Value (Scaled)');

		// --- Bars ---
		const driverGroups = svg
			.selectAll('.driver-group')
			.data(data)
			.enter()
			.append('g')
			.attr('class', 'driver-group')
			.attr('transform', (d) => `translate(${xScale0(d.driver)},0)`);

		driverGroups
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
			.style('opacity', (d) =>
				selectedDriver === null || selectedDriver === d.driver ? 1 : 0.3,
			) // Dim if not selected
			.on('mouseover', (event, d) => {
				setTooltipPosition({ x: event.pageX, y: event.pageY });
				setTooltipContent(`${d.driver} - ${d.key}: ${d.value}`);
			})
			.on('mousemove', (event) => {
				setTooltipPosition({ x: event.pageX, y: event.pageY });
			})
			.on('mouseout', () => {
				setTooltipPosition(null);
				setTooltipContent(null);
			})
			.on('click', (event, d) => {
				setSelectedDriver((prev) => (prev === d.driver ? null : d.driver));
			});

		// --- Legend ---
		const legend = svg
			.append('g')
			.attr('font-family', 'sans-serif')
			.attr('font-size', 10)
			.attr('text-anchor', 'end')
			.attr('transform', `translate(${width}, 0)`) // Position legend top-right
			.selectAll('g')
			.data(metrics)
			.enter()
			.append('g')
			.attr('transform', (d, i) => `translate(0,${i * 20})`);

		legend
			.append('rect')
			.attr('x', -19)
			.attr('width', 19)
			.attr('height', 19)
			.attr('fill', colorScale);
		// Add legend click interaction if needed in future

		legend
			.append('text')
			.attr('x', -24)
			.attr('y', 9.5)
			.attr('dy', '0.32em')
			.text((d) => d);
	}, [
		data,
		height,
		margin.bottom,
		margin.left,
		margin.top,
		width,
		selectedDriver,
	]);

	return (
		<div>
			<h3>Driver Season Metrics</h3>
			<svg ref={ref}></svg>
			{tooltipContent && tooltipPosition && (
				<div
					style={{
						position: 'absolute',
						left: `${tooltipPosition.x + 10}px`,
						top: `${tooltipPosition.y + 10}px`,
						background: 'rgba(0, 0, 0, 0.7)',
						color: 'white',
						padding: '5px',
						borderRadius: '3px',
						fontSize: '12px',
						pointerEvents: 'none', // Prevent tooltip from blocking mouse events
					}}>
					{tooltipContent}
				</div>
			)}
		</div>
	);
};

export default BarChart;
