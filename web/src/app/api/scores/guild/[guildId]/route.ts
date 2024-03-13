import { getServerSession } from 'next-auth/next';
import { getGuildScores } from '../../../../../../../shared/functions';
import { authOptions } from '../../../auth/[...nextauth]/route';

export async function GET(
	req: Request,
	{ params }: { params: { guildId: string } }
) {
	const session = await getServerSession(authOptions);
	if (!session)
		return Response.json(
			{
				error: 'Unauthorized'
			},
			{ status: 401 }
		);
	const data = await getGuildScores(params.guildId.toString());
	if (!data)
		return Response.json(
			{
				error: 'No entry found for Discord guild with ID ' + params.guildId
			},
			{ status: 404 }
		);
	return Response.json(data, {
		status: 200
	});
}
