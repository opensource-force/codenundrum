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

export async function disableChallenge(guildId: string, challengeId: string) {
	const data = await getGuildData(guildId);
	if (!data) return false;
	const { challenges } = data;
	if (challenges.length === 0) return false;
	const challenge = challenges.find(c => c.id === challengeId);
	if (!challenge) return false;
	if (!challenge.isActive) return false;
	challenge.isActive = false;
	data.challenges[data.challenges.indexOf(challenge)] = {
		...challenge,
		isActive: false
	};
	await kv.set(guildId, data);
	return true;
}

export async function createChallenge(
	guildId: string,
	id: string,
	name: string,
	description: string,
	maxScore: number
) {
	let data = await getGuildData(guildId);
	if (!data) {
		await initializeGuild(guildId);
		data = {
			challenges: [],
			overallScores: []
		};
	}
	const { challenges } = data;
	if (challenges.find(c => c.id === id)) return false;
	challenges.push({
		id,
		name,
		description,
		maxScore,
		isActive: true,
		submissions: []
	});
	await kv.set(guildId, {
		...data,
		challenges
	});
	return true;
}

export async function addSubmission(
	guildId: string,
	challengeId: string,
	link: string,
	userId: string
) {
	let data = await getGuildData(guildId);
	if (!data) {
		await initializeGuild(guildId);
		data = {
			challenges: [],
			overallScores: []
		};
	}
	const { challenges } = data;
	const challengeIndex = challenges.findIndex(c => c.id === challengeId);
	if (challengeIndex === -1) return false;
	if (!challenges[challengeIndex].isActive) return false;
	const currentIndex = challenges[challengeIndex].submissions.findIndex(
		v => v.userId === userId
	);
	if (currentIndex === -1)
		challenges[challengeIndex].submissions.push({
			userId,
			link,
			score: undefined
		});
	else
		challenges[challengeIndex].submissions[currentIndex] = {
			userId,
			link,
			score: undefined
		};
	await kv.set(guildId, {
		...data,
		challenges
	});
	return true;
}

export async function initializeGuild(guildId: string) {
	if (await getGuildData(guildId)) return false;
	await kv.set<GuildEntry>(guildId, {
		challenges: [],
		overallScores: []
	});
	return true;
}
