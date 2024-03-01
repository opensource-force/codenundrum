import { nextui } from '@nextui-org/react';
import { type Config } from 'tailwindcss';

export default {
	content: [
		'src/*.tsx',
		'src/**/*.tsx',
		'src/**/**/*.tsx',
		'src/**/**/**/*.tsx',
		'./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}'
	],
	plugins: [
		nextui({
			defaultTheme: 'dark'
		})
	],
	theme: {
		extend: {
			colors: {
				blurple: '#5865F2',
				'dark-blurple': '#454FBF',
				'not-quite-black': '#23272A'
			}
		}
	},
	darkMode: 'class'
} satisfies Config;
