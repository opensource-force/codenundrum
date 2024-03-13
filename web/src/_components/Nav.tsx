'use client';

import '@fortawesome/fontawesome-svg-core/styles.css';
import {
	Avatar,
	Button,
	Link,
	Navbar,
	NavbarBrand,
	NavbarContent,
	NavbarItem
} from '@nextui-org/react';
import { useSession } from 'next-auth/react';

export default function Nav() {
	const { data: session } = useSession();

	return (
		<Navbar isBordered isBlurred>
			<NavbarBrand className="font-black text-xl">
				<Link
					href="/"
					className="flex flex-row items-center py-4"
					color="foreground"
				>
					<Avatar
						size="md"
						src="/logo.png"
						className="!aspect-square rounded-xl mr-4"
					/>
					Codenundrum
				</Link>
			</NavbarBrand>
			<NavbarContent justify="end">
				<NavbarItem>
					<Button
						color="secondary"
						size="sm"
						variant="shadow"
						onPress={() => window.location.assign('/dashboard/')}
					>
						{session ? 'Continue to Dashboard' : 'Login to Dashboard'}
					</Button>
				</NavbarItem>
			</NavbarContent>
		</Navbar>
	);
}
