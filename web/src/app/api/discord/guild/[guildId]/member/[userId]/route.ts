import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../../../../../auth';
import { REST } from '@discordjs/rest';
import { RESTGetAPIGuildMemberResult, Routes } from 'discord-api-types/v10';

export async function GET(
	req: Request,
	{ params }: { params: { guildId: string; userId: string } }
) {
	const session = await getServerSession(authOptions);
	if (!session)
		return Response.json(
			{
				error: 'Unauthorized'
			},
			{ status: 401 }
		);
	const Rest = new REST().setToken(process.env.DISCORD_TOKEN!);
	return Response.json(
		(await Rest.get(
			Routes.guildMember(params.guildId, params.userId)
		)) as RESTGetAPIGuildMemberResult
	);
}
