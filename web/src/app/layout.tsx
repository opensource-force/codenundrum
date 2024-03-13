import '@fortawesome/fontawesome-svg-core/styles.css';
import '../_styles/out.css';
import type { Metadata } from 'next';
import { ReactNode } from 'react';
import { Providers } from './providers';
import { Inter } from '../fonts';
import { Analytics } from '@vercel/analytics/react';

export const metadata: Metadata = {
	title: {
		default: 'Codenundrum',
		template: '%s | Codenundrum'
	},
	authors: { name: 'Akhil Pillai', url: 'https://akpi.is-a.dev/' },
	keywords: [],
	creator: 'Akhil Pillai',
	generator: 'Next.js',
	icons: ['/logo.png'],
	metadataBase: new URL('/', 'https://codenundrum.vercel.app/'),
	description: 'A Discord bot to manage coding challenges',
	twitter: {
		card: 'summary_large_image',
		images: 'https://codenundrum.vercel.app/banner.png',
		description: 'A Discord bot to manage coding challenges'
	},
	openGraph: {
		title: 'Codenundrum',
		description: 'A Discord bot to manage coding challenges',
		url: 'https://codenundrum.vercel.app',
		siteName: 'Codenundrum',
		countryName: 'United States',
		locale: 'en-US',
		type: 'website',
		images: [
			{
				url: 'https://codenundrum.vercel.app/logo.png',
				type: 'image/png'
			},
			{
				url: 'https://codenundrum.vercel.app/banner.png',
				type: 'image/png'
			}
		]
	}
};

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="en-US">
			<body className={`dark ${Inter.className}`}>
				<Providers>{children}</Providers>
				<Analytics />
			</body>
		</html>
	);
}
