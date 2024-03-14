import { faGithub } from '@fortawesome/free-brands-svg-icons/faGithub';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from '@nextui-org/react';

export default function Footer() {
	return (
		<footer className="w-full bg-dark-blurple border-t-2 border-t-blurple p-8 text-center">
			<p>
				<Link
					color="foreground"
					isBlock
					href="https://github.com/akpi816218/codenundrum"
					underline="always"
				>
					Source code on GitHub at akpi816218/codenundrum{' '}
					<FontAwesomeIcon icon={faGithub} />
				</Link>
				<br />
				<br />
				&copy; {new Date().getFullYear()} Akhil Pillai
				<br />
				Website and bot designed by{' '}
				<Link
					href="https://akpi.is-a.dev"
					color="foreground"
					underline="always"
				>
					Akhil Pillai
				</Link>
				.
			</p>
		</footer>
	);
}
