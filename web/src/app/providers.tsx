'use client';

import { NextUIProvider } from '@nextui-org/react';
import { SessionProvider } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<SessionProvider>
			<NextUIProvider navigate={useRouter().push}>{children}</NextUIProvider>
		</SessionProvider>
	);
}