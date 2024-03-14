import { getServerSession } from 'next-auth/next';
import { getGuildChallenges } from '../../../../../../../shared/functions';
import { authOptions } from '../../../../../auth';

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
	const data = await getGuildChallenges(
		{
			KV_TOKEN: process.env.KV_REST_API_TOKEN!,
			KV_URL: process.env.KV_REST_API_URL!
		},
		params.guildId.toString()
	);
	if (!data)
		return Response.json(
			{
				error: `No entry found for Discord guild with ID ${params.guildId}`
			},
			{ status: 404 }
		);
	return Response.json(data, {
		status: 200
	});
}
