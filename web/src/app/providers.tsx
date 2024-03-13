'use client';

import { NextUIProvider } from '@nextui-org/react';
import { SessionProvider } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
	return (
		<SessionProvider>
			<NextUIProvider navigate={useRouter().push}>{children}</NextUIProvider>
		</SessionProvider>
	);
}
