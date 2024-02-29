import NextAuth, { Session } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import Discord from 'next-auth/providers/discord';

const handler = NextAuth({
	providers: [
		Discord({
			clientId: process.env.DISCORD_ID as string,
			clientSecret: process.env.DISCORD_SECRET as string,
			authorization: {
				params: {
					scope: 'bot identify email guilds guilds.members.read'
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
			return {
				token,
				accessToken: account?.accessToken,
				tokenType: account?.tokenType
			} as ExtdJWT;
		},
		async session({ session, token }: { session: Session; token: ExtdJWT }) {
			return {
				...session,
				accessToken: token.accessToken,
				tokenType: token.tokenType
			} as ExtdSession;
		}
	}
});

export interface ExtdJWT extends JWT {
	accessToken?: string;
	tokenType?: string;
}

export interface ExtdSession extends Session {
	accessToken?: string;
	tokenType?: string;
}

export { handler as GET, handler as POST };
