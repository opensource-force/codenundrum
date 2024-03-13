import { kv } from '@vercel/kv';
import { ChallengeData, GuildEntry } from './schemas';

export async function getGuildData(guildId: string) {
	return kv.get<GuildEntry>(guildId);
}

export async function getGuildChallenges(
	guildId: string
): Promise<ChallengeData[]>;
export async function getGuildChallenges(
	guildId: string,
	sort: true
): Promise<{ active: ChallengeData[]; inactive: ChallengeData[] }>;
export async function getGuildChallenges(guildId: string, sort?: true) {
	const data = await getGuildData(guildId);
	if (!data) return null;
	const { challenges } = data;
	return challenges
		? sort
			? {
					active: challenges.filter(c => c.isActive),
					inactive: challenges.filter(c => !c.isActive)
			  }
			: challenges
		: null;
}

export async function getGuildScores(guildId: string) {
	return (await getGuildData(guildId))?.overallScores ?? null;
}
