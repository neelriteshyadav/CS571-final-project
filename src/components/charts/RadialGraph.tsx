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
	const [selectedSegment, setSelectedSegment] = useState<string | null>(null); // Store ID of selected segment

	const width = 450;
	const height = 450;
	const margin = 40;
	const radius = Math.min(width, height) / 2 - margin;

	useEffect(() => {
		if (!ref.current || data.length === 0) return;

		const svg = d3
			.select(ref.current)
			.attr('width', width)
			.attr('height', height)
			.append('g')
			.attr('transform', `translate(${width / 2}, ${height / 2})`);

		// Clear previous render
		svg.selectAll('*').remove();

		// --- Color Scale ---
		const colorScale = d3
			.scaleOrdinal<string>()
			.domain(data.map((d) => d.id))
			.range(d3.schemePaired); // Using a paired scheme for potentially many categories

		// --- Pie Generator ---
		const pie = d3
			.pie<ChampionshipData>()
			.value((d) => d.championships)
			.sort(null); // Keep original order or sort as needed

		const data_ready = pie(data);

		// --- Arc Generator ---
		const arcGenerator = d3
			.arc<d3.PieArcDatum<ChampionshipData>>()
			.innerRadius(radius * 0.5) // Donut chart effect
			.outerRadius(radius);

		// --- Build the chart ---
		svg
			.selectAll('path')
			.data(data_ready)
			.enter()
			.append('path')
			.attr('d', arcGenerator)
			.attr('fill', (d) => colorScale(d.data.id))
			.attr('stroke', 'white')
			.style('stroke-width', '2px')
			.style('opacity', (d) =>
				selectedSegment === null || selectedSegment === d.data.id ? 1 : 0.5,
			)
			.on('mouseover', (event, d) => {
				setTooltipPosition({ x: event.pageX, y: event.pageY });
				setTooltipContent(
					`${d.data.id}: ${d.data.championships} Championships`,
				);
				// Optional: Add visual highlight on hover (e.g., increase stroke width or brightness)
				d3.select(event.currentTarget).style('opacity', 1);
			})
			.on('mousemove', (event) => {
				setTooltipPosition({ x: event.pageX, y: event.pageY });
			})
			.on('mouseout', (event, d) => {
				setTooltipPosition(null);
				setTooltipContent(null);
				// Reset opacity based on selection state
				d3.select(event.currentTarget).style(
					'opacity',
					selectedSegment === null || selectedSegment === d.data.id ? 1 : 0.5,
				);
			})
			.on('click', (event, d) => {
				const currentId = d.data.id;
				setSelectedSegment((prev) => (prev === currentId ? null : currentId));
				// Placeholder for drill-down action:
				// if (selectedSegment !== currentId) {
				//     console.log(`Drill down requested for: ${currentId}`);
				//     // Implement drill-down logic here (e.g., update state, fetch more data)
				// }
			});

		// --- Optional: Add labels ---
		// Labels can be tricky in pie/donut charts, especially with many slices.
		// Consider adding them only if space permits or using a legend.
		// Example: Centroid labels
		/*
    svg.selectAll('text')
        .data(data_ready)
        .enter()
        .append('text')
        .text(d => d.data.id) // Or d.data.championships
        .attr('transform', d => `translate(${arcGenerator.centroid(d)})`)
        .style('text-anchor', 'middle')
        .style('font-size', 10)
        .style('fill', 'black');
    */
	}, [data, width, height, margin, radius, selectedSegment]);

	return (
		<div>
			<h3>{title}</h3>
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

export default RadialGraph;
