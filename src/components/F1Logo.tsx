/** @format */

import React from 'react';

interface F1LogoProps {
	className?: string;
}

const F1Logo: React.FC<F1LogoProps> = ({ className = '' }) => {
	return (
		<svg
			className={className}
			width='60'
			height='24'
			viewBox='0 0 120 48'
			fill='none'
			xmlns='http://www.w3.org/2000/svg'>
			<rect
				x='0'
				y='0'
				width='120'
				height='48'
				rx='6'
				fill='#e10600'
			/>
			<path
				d='M20 12H44V36H36V20H28V36H20V12Z'
				fill='white'
			/>
			<path
				d='M52 12H90C94 12 98 16 98 20V28C98 32 94 36 90 36H52V12ZM60 20V28H82C84 28 86 26 86 24V20H60Z'
				fill='white'
			/>
		</svg>
	);
};

export default F1Logo;
