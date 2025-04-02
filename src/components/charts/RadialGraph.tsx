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
	const [tooltipContent, setTooltipContent] = useState<string | null>(null);
	const [tooltipPosition, setTooltipPosition] = useState<{
		x: number;
		y: number;
	} | null>(null);
	const [selectedSegment, setSelectedSegment] = useState<string | null>(null);

	const width = 450;
	const height = 450;
	const margin = 40;
	const radius = Math.min(width, height) / 2 - margin;
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
			.attr('transform', `translate(${width / 2}, ${height / 2})`);

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
			.attr('stroke', 'none')
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
				setTooltipPosition({ x: event.pageX, y: event.pageY });
				setTooltipContent(
					`${d.data.id}: ${d.data.championships} Championships`,
				);
			})
			.on('mousemove', (event) => {
				setTooltipPosition({ x: event.pageX, y: event.pageY });
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

		// --- Center Text (Optional - display total or title) ---
		/*
		const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
		svg.append('text')
			.attr('text-anchor', 'middle')
			.attr('dy', '0.35em')
			.style('font-size', '18px')
			.style('font-weight', 'bold')
			.attr('fill', isDarkMode ? '#e2e8f0' : '#374151') // slate-200 : gray-700
			.text(title.split(' ')[0]); // Display first word? Or total?
		*/
	}, [
		data,
		width,
		height,
		margin,
		radius,
		innerRadius,
		selectedSegment,
		title,
	]);

	return (
		<div className='relative flex flex-col items-center'>
			<h3 className='text-lg font-semibold mb-2 text-center text-gray-700 dark:text-gray-300'>
				{title}
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

export default RadialGraph;
