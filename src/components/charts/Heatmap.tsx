/** @format */

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { ComparativeMetric } from '../../data/comparativeMetrics';

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

	const margin = { top: 60, right: 50, bottom: 50, left: 120 }; // Adjusted margins for labels/title
	const width = 700 - margin.left - margin.right;
	const height = 500 - margin.top - margin.bottom;

	useEffect(() => {
		if (!ref.current || data.length === 0) return;

		// Use current theme for text colors
		const isDarkMode =
			window.matchMedia &&
			window.matchMedia('(prefers-color-scheme: dark)').matches;
		const axisTextColor = isDarkMode ? '#cbd5e1' : '#4b5563'; // slate-300 : gray-600
		const cellStrokeColor = isDarkMode ? '#4b5563' : '#d1d5db'; // gray-600 : gray-300
		const selectedStrokeColor = isDarkMode ? '#f1f5f9' : '#1f2937'; // slate-100 : gray-800

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

		const ids = data.map((d) => d.id);

		// --- Scales ---
		const xScale = d3
			.scaleBand<string>() // Explicitly type domain
			.domain(metrics)
			.range([0, width])
			.padding(0.05);

		const yScale = d3
			.scaleBand<string>() // Explicitly type domain
			.domain(ids)
			.range([0, height])
			.padding(0.05);

		// --- Color Scale (using Tailwind-like colors) ---
		const colorScales: {
			[key in (typeof metrics)[number]]: d3.ScaleLinear<string, string>;
		} = {} as any;

		// Define Tailwind color ranges (adjust as needed)
		const redGreenRange = ['#ef4444', '#fef2f2', '#22c55e']; // Red-500, Red-50, Green-500
		const greenRedRange = ['#22c55e', '#f0fdf4', '#ef4444']; // Green-500, Green-50, Red-500

		metrics.forEach((metric) => {
			const values = data.map((d) => d[metric]);
			const domain = d3.extent(values) as [number, number];
			const midPoint = (domain[0] + domain[1]) / 2;

			const isLowerBetter = metric === 'avgLapTime';
			const range = isLowerBetter ? greenRedRange : redGreenRange;

			// Handle cases where all values might be the same
			if (domain[0] === domain[1]) {
				colorScales[metric] = d3
					.scaleLinear<string>()
					.domain(domain)
					.range([range[1], range[1]]); // Use midpoint color
			} else {
				colorScales[metric] = d3
					.scaleLinear<string>()
					.domain([domain[0], midPoint, domain[1]])
					.range(range)
					.interpolate(d3.interpolateRgb);
			}
		});

		// --- Axes ---
		const xAxis = d3.axisTop(xScale).tickSize(0).tickPadding(10);
		svg
			.append('g')
			.attr('class', 'x-axis')
			.call(xAxis)
			.call((g) => g.select('.domain').remove())
			.selectAll('text')
			.style('text-anchor', 'start')
			.attr('dx', '.8em')
			.attr('dy', '.15em')
			.attr('transform', 'rotate(-45)')
			.attr('fill', axisTextColor)
			.style('font-size', '10px')
			.style('text-transform', 'capitalize');

		const yAxis = d3.axisLeft(yScale).tickSize(0).tickPadding(10);
		svg
			.append('g')
			.attr('class', 'y-axis')
			.call(yAxis)
			.call((g) => g.select('.domain').remove())
			.selectAll('text')
			.attr('fill', axisTextColor)
			.style('font-size', '10px');

		// --- Cells ---
		svg
			.selectAll('.heatmap-cell')
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
			.attr('class', 'heatmap-cell')
			.attr('x', (d) => xScale(d.metric) ?? 0)
			.attr('y', (d) => yScale(d.id) ?? 0)
			.attr('width', xScale.bandwidth())
			.attr('height', yScale.bandwidth())
			.style('fill', (d) => colorScales[d.metric](d.value))
			.style('stroke-width', (d) =>
				selectedCell?.id === d.id && selectedCell?.metric === d.metric ? 2 : 1,
			)
			.style('stroke', (d) =>
				selectedCell?.id === d.id && selectedCell?.metric === d.metric
					? selectedStrokeColor
					: cellStrokeColor,
			)
			.style('cursor', 'pointer')
			.style(
				'opacity',
				(d) =>
					selectedCell === null ||
					(selectedCell.id === d.id && selectedCell.metric === d.metric)
						? 1
						: 0.6, // Dim non-selected cells slightly
			)
			.on('mouseover', function (event, d) {
				if (!(selectedCell?.id === d.id && selectedCell?.metric === d.metric)) {
					d3.select(this)
						.style('stroke-width', 2)
						.style('stroke', selectedStrokeColor);
				}
				setTooltipPosition({ x: event.pageX, y: event.pageY });
				setTooltipContent(`${d.id} - ${d.metric}: ${d.value.toFixed(2)}`); // Format value
			})
			.on('mousemove', (event) => {
				setTooltipPosition({ x: event.pageX, y: event.pageY });
			})
			.on('mouseout', function (event, d) {
				if (!(selectedCell?.id === d.id && selectedCell?.metric === d.metric)) {
					d3.select(this)
						.style('stroke-width', 1)
						.style('stroke', cellStrokeColor);
				}
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
		<div className='relative'>
			<h3 className='text-lg font-semibold mb-4 text-center text-gray-700 dark:text-gray-300'>
				Comparative Performance Matrix
			</h3>
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

export default Heatmap;
