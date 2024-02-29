import {
	Inter as inter,
	Poppins as poppins,
	Roboto as roboto,
	Roboto_Mono as robotoMono
} from 'next/font/google';

export const Inter = inter({
	subsets: ['latin'],
	display: 'swap'
});

export const Poppins = poppins({
	subsets: ['latin'],
	display: 'swap',
	style: ['normal', 'italic'],
	weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900']
});

export const Roboto = roboto({
	subsets: ['latin'],
	display: 'swap',
	style: ['normal', 'italic'],
	weight: ['100', '300', '400', '500', '700', '900']
});

export const RobotoMono = robotoMono({
	subsets: ['latin'],
	display: 'swap',
	style: ['normal', 'italic'],
	weight: ['100', '300', '400', '500', '600', '700']
});
