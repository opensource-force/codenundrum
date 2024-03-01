import { faGithub } from '@fortawesome/free-brands-svg-icons/faGithub';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from '@nextui-org/react';

export default function Footer() {
	return (
		<footer className="w-full h-16 bg-not-quite-black border-t-2 border-t-blurple p-8 text-center">
			<Link>
				Source code on GitHub at{' '}
				<span className="">akpi816218/codenundrum</span>{' '}
				<FontAwesomeIcon icon={faGithub} />
			</Link>
			<br />
			<br />
			&copy; {new Date().getFullYear()} Akhil Pillai
			<br />
			Website and bot designed by{' '}
			<Link href="https://akpi.is-a.dev">Akhil Pillai</Link>.
		</footer>
	);
}
