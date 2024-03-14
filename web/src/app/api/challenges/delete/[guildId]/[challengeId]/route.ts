import { getServerSession } from 'next-auth/next';
import { disableChallenge } from '../../../../../../../../shared/functions';
import { authOptions } from '../../../../../../auth';

export async function PUT(
	req: Request,
	{ params }: { params: { guildId: string; challengeId: string } }
) {
	const session = await getServerSession(authOptions);
	if (!session)
		return Response.json(
			{
				error: 'Unauthorized'
			},
			{ status: 401 }
		);
	const result = await disableChallenge(
		{
			KV_TOKEN: process.env.KV_REST_API_TOKEN!,
			KV_URL: process.env.KV_REST_API_URL!
		},
		params.guildId,
		params.challengeId
	);
	if (!result)
		return Response.json(
			{
				error: `Failed to end challenge ${params.challengeId} in guild ${params.guildId}`
			},
			{ status: 404 }
		);
	return Response.json(result, {
		status: 200
	});
}
