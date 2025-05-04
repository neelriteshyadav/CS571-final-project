/** @format */

import React, { useEffect, useState } from 'react';

const DarkModeToggle: React.FC = () => {
	const [isDarkMode, setIsDarkMode] = useState(false);

	useEffect(() => {
		// Check if user has a preference stored in localStorage
		const darkModePreference = localStorage.getItem('darkMode');
		const prefersDarkMode = window.matchMedia(
			'(prefers-color-scheme: dark)',
		).matches;

		// Initialize dark mode based on saved preference or system preference
		const initialDarkMode = darkModePreference
			? darkModePreference === 'true'
			: prefersDarkMode;

		setIsDarkMode(initialDarkMode);

		// Apply the initial theme
		if (initialDarkMode) {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
	}, []);

	const toggleDarkMode = () => {
		const newDarkMode = !isDarkMode;
		setIsDarkMode(newDarkMode);

		// Update localStorage
		localStorage.setItem('darkMode', String(newDarkMode));

		// Update DOM
		if (newDarkMode) {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
	};

	return (
		<button
			onClick={toggleDarkMode}
			className='p-2 rounded-md text-gray-400 hover:text-white focus:outline-none'
			aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}>
			{isDarkMode ? (
				<svg
					xmlns='http://www.w3.org/2000/svg'
					className='h-5 w-5'
					viewBox='0 0 20 20'
					fill='currentColor'>
					{/* Sun icon */}
					<path
						fillRule='evenodd'
						d='M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z'
						clipRule='evenodd'
					/>
				</svg>
			) : (
				<svg
					xmlns='http://www.w3.org/2000/svg'
					className='h-5 w-5'
					viewBox='0 0 20 20'
					fill='currentColor'>
					{/* Moon icon */}
					<path d='M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z' />
				</svg>
			)}
		</button>
	);
};

export default DarkModeToggle;
