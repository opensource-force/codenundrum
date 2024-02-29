import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faYoutube } from '@fortawesome/free-brands-svg-icons';
import '@fortawesome/fontawesome-svg-core/styles.css';
import {
	Avatar,
	Link,
	Navbar,
	NavbarBrand,
	// NavbarContent,
	// NavbarItem,
	NavbarMenu
	// NavbarMenuItem,
	// NavbarMenuToggle
} from '@nextui-org/react';
// import { useState } from 'react';

export default function Nav() {
	// const [isMenuOpen, setIsMenuOpen] = useState(false);
	// const menuItems = [];

	return (
		<Navbar
			// onMenuOpenChange={setIsMenuOpen}
			isBordered
			isBlurred
		>
			{/* <NavbarMenuToggle
				aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
				className="sm:hidden"
			/> */}
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
			{/* <NavbarContent className="hidden sm:flex gap-4" justify="center">
				{...menuItems.map(item => (
					<NavbarItem isActive={window.location.pathname === item.href}>
						<Link
							isBlock
							color={
								window.location.pathname === item.href ? 'success' : 'primary'
							}
							href={window.location.pathname === item.href ? '#' : item.href}
						>
							{item.name}
						</Link>
					</NavbarItem>
				))}
			</NavbarContent> */}
			{/* <NavbarContent justify="end">
				<NavbarItem>
				</NavbarItem>
			</NavbarContent> */}
			<NavbarMenu className="bg-gradient-to-b from-neutral-800 to-[#26262684] p-8">
				{/* {...menuItems.map(item => (
					<NavbarMenuItem isActive={window.location.href === item.href}>
						<Link
							color={
								window.location.pathname === item.href ? 'success' : 'secondary'
							}
							href={window.location.pathname === item.href ? '#' : item.href}
							className="w-full text-xl rounded-2xl active:bg-neutral-600 active:text-blue-400 p-2"
							size="lg"
						>
							{item.name}
						</Link>
					</NavbarMenuItem>
				))} */}
			</NavbarMenu>
		</Navbar>
	);
}
