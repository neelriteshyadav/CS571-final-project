/** @format */

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { ComparativeMetric, metricsKeys } from '../../data/comparativeMetrics';

interface HeatmapProps {
	data: ComparativeMetric[];
	metrics: (keyof Omit<ComparativeMetric, 'id'>)[];
}

type SelectedCell = {
	id: string;
	metric: keyof Omit<ComparativeMetric, 'id'>;
} | null;

const Heatmap: React.FC<HeatmapProps> = ({ data, metrics }) => {
	const ref = useRef<SVGSVGElement>(null);
	const [tooltipContent, setTooltipContent] = useState<string | null>(null);
	const [tooltipPosition, setTooltipPosition] = useState<{
		x: number;
		y: number;
	} | null>(null);
	const [selectedCell, setSelectedCell] = useState<SelectedCell>(null);

	const margin = { top: 50, right: 50, bottom: 100, left: 100 }; // Adjusted margins for labels
	const width = 700 - margin.left - margin.right;
	const height = 500 - margin.top - margin.bottom;

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

		const ids = data.map((d) => d.id);

		// --- Scales ---
		const xScale = d3
			.scaleBand()
			.domain(metrics)
			.range([0, width])
			.padding(0.05);

		const yScale = d3.scaleBand().domain(ids).range([0, height]).padding(0.05);

		// --- Color Scale (one per metric for better comparison) ---
		const colorScales: {
			[key in (typeof metrics)[number]]: d3.ScaleLinear<string, string>;
		} = {} as any;
		metrics.forEach((metric) => {
			const values = data.map((d) => d[metric]);
			// Determine color scheme based on metric meaning (higher is better/worse?)
			// Example: Higher points/wins/poles are better (green), lower lap times are better (green)
			const isLowerBetter = metric === 'avgLapTime';
			const range = isLowerBetter
				? ['green', 'white', 'red']
				: ['red', 'white', 'green'];
			const domain = d3.extent(values) as [number, number];
			colorScales[metric] = d3
				.scaleLinear<string>()
				.domain([domain[0], (domain[0] + domain[1]) / 2, domain[1]]) // 3-point scale for more nuance
				.range(range)
				.interpolate(d3.interpolateRgb); // Smooth interpolation
		});

		// --- Axes ---
		const xAxis = d3.axisTop(xScale).tickSize(0);
		svg
			.append('g')
			.call(xAxis)
			.selectAll('text')
			.style('text-anchor', 'start')
			.attr('dx', '.8em')
			.attr('dy', '.15em')
			.attr('transform', 'rotate(-45)');
		svg.select('.domain').remove(); // Remove axis line

		const yAxis = d3.axisLeft(yScale).tickSize(0);
		svg.append('g').call(yAxis);
		svg.select('.domain').remove(); // Remove axis line

		// --- Cells ---
		svg
			.selectAll()
			.data(
				data.flatMap((item) =>
					metrics.map((metric) => ({
						id: item.id,
						metric,
						value: item[metric],
					})),
				),
			)
			.enter()
			.append('rect')
			.attr('x', (d) => xScale(d.metric) ?? 0)
			.attr('y', (d) => yScale(d.id) ?? 0)
			.attr('width', xScale.bandwidth())
			.attr('height', yScale.bandwidth())
			.style('fill', (d) => colorScales[d.metric](d.value))
			.style('stroke-width', 1)
			.style('stroke', 'black')
			.style('opacity', (d) =>
				selectedCell === null ||
				(selectedCell.id === d.id && selectedCell.metric === d.metric)
					? 1
					: 0.3,
			)
			.on('mouseover', (event, d) => {
				setTooltipPosition({ x: event.pageX, y: event.pageY });
				setTooltipContent(`${d.id} - ${d.metric}: ${d.value}`);
			})
			.on('mousemove', (event) => {
				setTooltipPosition({ x: event.pageX, y: event.pageY });
			})
			.on('mouseout', () => {
				setTooltipPosition(null);
				setTooltipContent(null);
			})
			.on('click', (event, d) => {
				setSelectedCell((prev) =>
					prev?.id === d.id && prev?.metric === d.metric
						? null
						: { id: d.id, metric: d.metric },
				);
			});
	}, [data, metrics, width, height, margin, selectedCell]);

	return (
		<div>
			<h3>Comparative Performance Matrix</h3>
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
						pointerEvents: 'none',
					}}>
					{tooltipContent}
				</div>
			)}
		</div>
	);
};

export default Heatmap;
