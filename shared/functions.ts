import { createClient } from '@vercel/kv';
import { ChallengeData, GuildEntry } from './schemas';

export async function getGuildData(
	{ KV_TOKEN, KV_URL }: { KV_TOKEN: string; KV_URL: string },
	guildId: string
) {
	const kv = createClient({
		token: KV_TOKEN,
		url: KV_URL
	});
	return kv.get<GuildEntry>(guildId);
}

export async function getGuildChallenges(
	{ KV_TOKEN, KV_URL }: { KV_TOKEN: string; KV_URL: string },
	guildId: string
): Promise<ChallengeData[]>;
export async function getGuildChallenges(
	{ KV_TOKEN, KV_URL }: { KV_TOKEN: string; KV_URL: string },
	guildId: string,
	sort: true
): Promise<{ active: ChallengeData[]; inactive: ChallengeData[] }>;
export async function getGuildChallenges(
	{ KV_TOKEN, KV_URL }: { KV_TOKEN: string; KV_URL: string },
	guildId: string,
	sort?: true
) {
	const kv = createClient({
		token: KV_TOKEN,
		url: KV_URL
	});

	const data = await getGuildData({ KV_TOKEN, KV_URL }, guildId);
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

export async function getGuildScores(
	{ KV_TOKEN, KV_URL }: { KV_TOKEN: string; KV_URL: string },
	guildId: string
) {
	const kv = createClient({
		token: KV_TOKEN,
		url: KV_URL
	});
	return (
		(await getGuildData({ KV_TOKEN, KV_URL }, guildId))?.overallScores ?? null
	);
}

export async function disableChallenge(
	{ KV_TOKEN, KV_URL }: { KV_TOKEN: string; KV_URL: string },
	guildId: string,
	challengeId: string
) {
	const kv = createClient({
		token: KV_TOKEN,
		url: KV_URL
	});
	const data = await getGuildData({ KV_TOKEN, KV_URL }, guildId);
	if (!data) return false;
	const { challenges } = data;
	if (challenges.length === 0) return false;
	const challenge = challenges.find(c => c.id === challengeId);
	if (!challenge) return false;
	if (!challenge.isActive) return false;
	challenge.isActive = false;
	challenges[data.challenges.indexOf(challenge)] = {
		...challenge,
		isActive: false,
		timestamp: new Date().toISOString()
	};
	await kv.set(guildId, {
		...data,
		challenges: data.challenges.sort(
			(a, b) =>
				new Date(b.timestamp).getMilliseconds() -
				new Date(a.timestamp).getMilliseconds()
		)
	});
	return true;
}

export async function createChallenge(
	{ KV_TOKEN, KV_URL }: { KV_TOKEN: string; KV_URL: string },
	guildId: string,
	id: string,
	name: string,
	description: string,
	maxScore: number
) {
	const kv = createClient({
		token: KV_TOKEN,
		url: KV_URL
	});
	let data = await getGuildData({ KV_TOKEN, KV_URL }, guildId);
	if (!data) {
		await initializeGuild({ KV_TOKEN, KV_URL }, guildId);
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
		submissions: [],
		timestamp: new Date().toISOString()
	});
	await kv.set(guildId, {
		...data,
		challenges: challenges.sort(
			(a, b) =>
				new Date(b.timestamp).getMilliseconds() -
				new Date(a.timestamp).getMilliseconds()
		)
	});
	return true;
}

export async function addSubmission(
	{ KV_TOKEN, KV_URL }: { KV_TOKEN: string; KV_URL: string },
	guildId: string,
	challengeId: string,
	link: string,
	userId: string,
	username: string
) {
	const kv = createClient({
		token: KV_TOKEN,
		url: KV_URL
	});
	let data = await getGuildData({ KV_TOKEN, KV_URL }, guildId);
	if (!data) {
		await initializeGuild({ KV_TOKEN, KV_URL }, guildId);
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
			username,
			link,
			score: undefined,
			timestamp: new Date().toISOString()
		});
	else
		challenges[challengeIndex].submissions[currentIndex] = {
			userId,
			username,
			link,
			score: undefined,
			timestamp: new Date().toISOString()
		};
	await kv.set(guildId, {
		...data,
		challenges
	});
	return true;
}

export async function initializeGuild(
	{ KV_TOKEN, KV_URL }: { KV_TOKEN: string; KV_URL: string },
	guildId: string
) {
	const kv = createClient({
		token: KV_TOKEN,
		url: KV_URL
	});
	if (await getGuildData({ KV_TOKEN, KV_URL }, guildId)) return false;
	await kv.set<GuildEntry>(guildId, {
		challenges: [],
		overallScores: []
	});
	return true;
}

export async function scoreChallenge(
	{ KV_TOKEN, KV_URL }: { KV_TOKEN: string; KV_URL: string },
	guildId: string,
	challengeId: string,
	userId: string,
	score: number
) {
	const kv = createClient({
		token: KV_TOKEN,
		url: KV_URL
	});
	let data = await getGuildData({ KV_TOKEN, KV_URL }, guildId);
	if (!data) {
		await initializeGuild({ KV_TOKEN, KV_URL }, guildId);
		data = {
			challenges: [],
			overallScores: []
		};
	}
	const { challenges } = data;
	const challengeIndex = challenges.findIndex(c => c.id === challengeId);
	if (challengeIndex === -1) return false;
	const submissionIndex = challenges[challengeIndex].submissions.findIndex(
		v => v.userId === userId
	);
	if (submissionIndex === -1) return false;
	challenges[challengeIndex].submissions[submissionIndex] = {
		...challenges[challengeIndex].submissions[submissionIndex],
		score,
		timestamp: new Date().toISOString()
	};
	await kv.set(guildId, {
		...data,
		challenges
	});
	return true;
}
