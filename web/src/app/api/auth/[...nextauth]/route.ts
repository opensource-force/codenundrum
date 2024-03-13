import {
	GetServerSidePropsContext,
	NextApiRequest,
	NextApiResponse
} from 'next';
import NextAuth, { AuthOptions, Session, getServerSession } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import Discord from 'next-auth/providers/discord';

export const authOptions: AuthOptions = {
	providers: [
		Discord({
			clientId: process.env.DISCORD_ID as string,
			clientSecret: process.env.DISCORD_SECRET as string,
			authorization: {
				params: {
					scope: 'identify guilds guilds.members.read'
				}
			},
			style: {
				bg: '#5865F2',
				bgDark: '#454FBF',
				logo: 'https://assets-global.website-files.com/6257adef93867e50d84d30e2/636e0a6ca814282eca7172c6_icon_clyde_white_RGB.svg',
				text: '#FFFFFF'
			}
		})
	],
	callbacks: {
		async jwt({ token, account }) {
			if (account) {
				token.accessToken = account.access_token;
				token.tokenType = account.token_type;
			}
			return token as ExtdJWT;
		},
		async session({
			session,
			token
		}: {
			session: ExtdSession;
			token: ExtdJWT;
		}) {
			if (token) {
				session.accessToken = token.accessToken;
				session.tokenType = token.tokenType;
			}
			return session as ExtdSession;
		}
	}
};

const handler = NextAuth(authOptions);

export interface ExtdJWT extends JWT {
	accessToken?: string;
	tokenType?: string;
}

export interface ExtdSession extends Session {
	accessToken?: string;
	tokenType?: string;
}

export { handler as GET, handler as POST };
