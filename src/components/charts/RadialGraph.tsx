/** @format */

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { ChampionshipData } from '../../data/historicalChampionships';

interface RadialGraphProps {
	data: ChampionshipData[];
	title: string;
}

const RadialGraph: React.FC<RadialGraphProps> = ({ data, title }) => {
	const ref = useRef<SVGSVGElement>(null);
	const chartContainerRef = useRef<HTMLDivElement>(null);
	const [tooltipContent, setTooltipContent] = useState<string | null>(null);
	const [tooltipPosition, setTooltipPosition] = useState<{
		x: number;
		y: number;
	} | null>(null);
	const [selectedSegment, setSelectedSegment] = useState<string | null>(null);
	const [isMouseOverChart, setIsMouseOverChart] = useState<boolean>(false);

	// Increase width significantly to make sure we have room for labels
	const width = 700; // Much wider to accommodate labels
	const height = 450;
	const margin = 40;
	const radius = Math.min(width / 2, height) / 2 - margin;
	const innerRadius = radius * 0.5; // For donut chart

	useEffect(() => {
		if (!ref.current || data.length === 0) return;

		const svgRoot = d3.select(ref.current);
		svgRoot.selectAll('*').remove(); // Clear previous render

		const svg = svgRoot
			.attr('width', '100%') // Responsive width
			.attr('height', height)
			.attr('viewBox', `0 0 ${width} ${height}`)
			.append('g')
			.attr('transform', `translate(${width / 3}, ${height / 2})`); // Move chart to the left third

		// --- Color Scale (using a vibrant scheme) ---
		const colorScale = d3
			.scaleOrdinal<string>()
			.domain(data.map((d) => d.id))
			.range(d3.schemeTableau10); // Or d3.schemeSpectral[data.length] for more colors

		// --- Pie Generator ---
		const pie = d3
			.pie<ChampionshipData>()
			.value((d) => d.championships)
			.sort(null);

		const data_ready = pie(data);

		// Calculate total championships for percentage calculations
		const totalChampionships = data.reduce(
			(sum, d) => sum + d.championships,
			0,
		);

		// --- Arc Generators ---
		const arcGenerator = d3
			.arc<d3.PieArcDatum<ChampionshipData>>()
			.innerRadius(innerRadius)
			.outerRadius(radius)
			.padAngle(0.01)
			.cornerRadius(3);

		const hoverArcGenerator = d3
			.arc<d3.PieArcDatum<ChampionshipData>>()
			.innerRadius(innerRadius)
			.outerRadius(radius * 1.05)
			.padAngle(0.01)
			.cornerRadius(3);

		// --- Build the chart ---
		svg
			.selectAll('path')
			.data(data_ready)
			.enter()
			.append('path')
			.attr('d', arcGenerator)
			.attr('fill', (d) => colorScale(d.data.id))
			.attr('stroke', 'white')
			.attr('stroke-width', 1)
			.style('cursor', 'pointer')
			.style('opacity', (d) =>
				selectedSegment === null || selectedSegment === d.data.id ? 1 : 0.5,
			)
			.on('mouseover', function (event, d) {
				d3.select(this)
					.transition()
					.duration(150)
					// Use function form for attrTween or just attr with the generator called
					.attr(
						'd',
						hoverArcGenerator(d as d3.PieArcDatum<ChampionshipData>) as string,
					)
					.style('opacity', 1);

				const percentage = (d.data.championships / totalChampionships) * 100;
				setTooltipPosition({ x: event.pageX, y: event.pageY });
				setTooltipContent(
					`${d.data.id}: ${
						d.data.championships
					} Championships (${percentage.toFixed(1)}%)`,
				);
			})
			.on('mousemove', (event) => {
				if (isMouseOverChart) {
					setTooltipPosition({ x: event.pageX, y: event.pageY });
				}
			})
			.on('mouseout', function (event, d) {
				d3.select(this)
					.transition()
					.duration(150)
					// Use function form for attrTween or just attr with the generator called
					.attr(
						'd',
						arcGenerator(d as d3.PieArcDatum<ChampionshipData>) as string,
					)
					.style(
						'opacity',
						selectedSegment === null || selectedSegment === d.data.id ? 1 : 0.5,
					);
				setTooltipPosition(null);
				setTooltipContent(null);
			})
			.on('click', (event, d) => {
				const currentId = d.data.id;
				setSelectedSegment((prev) => (prev === currentId ? null : currentId));
			});

		// --- Add labels for values ---
		// Create a different arc generator for positioning labels
		const labelArc = d3
			.arc<d3.PieArcDatum<ChampionshipData>>()
			.innerRadius(radius * 0.8)
			.outerRadius(radius * 0.8);

		// Add value labels to each segment for those with enough space
		const valueLabels = svg
			.selectAll('.value-label')
			.data(data_ready.filter((d) => d.endAngle - d.startAngle > 0.3)) // Only add labels where there's enough space
			.enter()
			.append('text')
			.attr('class', 'value-label')
			.attr('transform', (d) => `translate(${labelArc.centroid(d)})`)
			.attr('dy', '0.35em')
			.attr('text-anchor', 'middle')
			.attr('font-size', '12px')
			.attr('font-weight', 'bold')
			.attr('fill', 'white')
			.text((d) => d.data.championships);

		// --- Center Text showing total ---
		const isDarkMode =
			window.matchMedia &&
			window.matchMedia('(prefers-color-scheme: dark)').matches;
		const centerTextColor = isDarkMode ? '#e2e8f0' : '#374151'; // slate-200 : gray-700

		// Total value in center
		svg
			.append('text')
			.attr('text-anchor', 'middle')
			.attr('dy', '-0.2em')
			.style('font-size', '22px')
			.style('font-weight', 'bold')
			.attr('fill', centerTextColor)
			.text(totalChampionships);

		// "Total" text below the number
		svg
			.append('text')
			.attr('text-anchor', 'middle')
			.attr('dy', '1.2em')
			.style('font-size', '14px')
			.attr('fill', centerTextColor)
			.text('Total');

		// --- Add Legend ---
		// Place the legend on the right side of the chart
		const legendX = radius + 50; // Position to the right of the chart
		const legendY = -radius + 10; // Start near the top

		// Create a container for the legend that will have plenty of space
		const legend = svg
			.append('g')
			.attr('class', 'legend-container')
			.attr('transform', `translate(${legendX}, ${legendY})`);

		// Legend title at the top
		legend
			.append('text')
			.attr('x', 0)
			.attr('y', -20)
			.attr('font-size', '14px')
			.attr('font-weight', 'bold')
			.attr('fill', centerTextColor)
			.text('Championship Distribution');

		// Add legend entries with enough vertical spacing
		const entrySpacing = 28; // More space between entries

		data.forEach((d, i) => {
			const entryG = legend
				.append('g')
				.attr('transform', `translate(0, ${i * entrySpacing})`);

			// Colored square
			entryG
				.append('rect')
				.attr('width', 14)
				.attr('height', 14)
				.attr('rx', 2)
				.style('fill', colorScale(d.id))
				.style('stroke', colorScale(d.id));

			// Label text (with percentage)
			const percentage = (d.championships / totalChampionships) * 100;
			entryG
				.append('text')
				.attr('x', 20) // Offset from colored square
				.attr('y', 11) // Vertical alignment with square
				.attr('font-size', '12px')
				.attr('fill', isDarkMode ? '#e2e8f0' : '#374151')
				.text(`${d.id}: ${d.championships} (${percentage.toFixed(1)}%)`);
		});
	}, [
		data,
		width,
		height,
		margin,
		radius,
		innerRadius,
		selectedSegment,
		title,
		isMouseOverChart,
	]);

	// Set up mouse enter/leave event handlers for the chart container
	useEffect(() => {
		const container = chartContainerRef.current;
		if (!container) return;

		const handleMouseEnter = () => setIsMouseOverChart(true);
		const handleMouseLeave = () => {
			setIsMouseOverChart(false);
			setTooltipPosition(null);
			setTooltipContent(null);
		};

		container.addEventListener('mouseenter', handleMouseEnter);
		container.addEventListener('mouseleave', handleMouseLeave);

		return () => {
			container.removeEventListener('mouseenter', handleMouseEnter);
			container.removeEventListener('mouseleave', handleMouseLeave);
		};
	}, []);

	return (
		<div className='relative flex flex-col items-center'>
			<h3 className='text-lg font-semibold mb-2 text-center text-gray-700 dark:text-gray-300'>
				{title}
			</h3>
			<div className='text-center text-sm text-gray-500 dark:text-gray-400 mb-2'>
				Click on a segment to highlight. Hover for details.
			</div>
			<div
				ref={chartContainerRef}
				className='relative w-full'>
				<svg
					ref={ref}
					className='w-full'></svg>
				{tooltipContent && tooltipPosition && isMouseOverChart && (
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
		</div>
	);
};

export default RadialGraph;
