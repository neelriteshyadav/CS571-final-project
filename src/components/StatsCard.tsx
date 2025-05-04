/** @format */

import React from 'react';

interface StatsCardProps {
	title: string;
	value: string | number;
	icon?: React.ReactNode;
	change?: string;
	isPositive?: boolean;
	className?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
	title,
	value,
	icon,
	change,
	isPositive = true,
	className = '',
}) => {
	return (
		<div
			className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-5 ${className}`}>
			<div className='flex justify-between items-start'>
				<div>
					<p className='text-sm font-medium text-gray-500 dark:text-gray-400 mb-1'>
						{title}
					</p>
					<p className='text-2xl font-bold'>{value}</p>

					{change && (
						<div className='flex items-center mt-2'>
							<span
								className={`text-sm font-medium ${
									isPositive ? 'text-green-500' : 'text-red-500'
								}`}>
								{isPositive ? '↑' : '↓'} {change}
							</span>
						</div>
					)}
				</div>

				{icon && (
					<div className='text-indigo-500 dark:text-indigo-400'>{icon}</div>
				)}
			</div>
		</div>
	);
};

export default StatsCard;
