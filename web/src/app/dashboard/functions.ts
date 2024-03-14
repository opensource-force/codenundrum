import {
	RESTGetAPICurrentUserGuildsResult,
	RESTGetAPICurrentUserResult,
	RESTGetAPIGuildMemberResult
} from 'discord-api-types/v10';
import { ChallengeData, OverallMemberScore } from '../../../../shared/schemas';

export async function getUserData(
	token: string,
	tokenType: string,
	userId?: string
) {
	return fetch(`https://discord.com/api/v10/users/${userId ?? '@me'}`, {
		headers: {
			Authorization: `${tokenType} ${token}`
		}
	}).then(res => res.json()) as Promise<RESTGetAPICurrentUserResult>;
}

// export async function getMemberData(
// 	token: string,
// 	tokenType: string,
// 	guildId: string,
// 	userId: string
// ) {
// 	return fetch(
// 		`https://discord.com/api/v10/guilds/${guildId}/members/${userId}`,
// 		{
// 			headers: {
// 				Authorization: `${tokenType} ${token}`
// 			}
// 		}
// 	).then(res => res.json()) as Promise<RESTGetAPIGuildMemberResult>;
// }

export async function getGuilds(token: string, tokenType: string) {
	return fetch(`https://discord.com/api/v10/users/@me/guilds`, {
		headers: {
			Authorization: `${tokenType} ${token}`
		}
	}).then(res => res.json()) as Promise<RESTGetAPICurrentUserGuildsResult>;
}

export async function getGuildScores(guildId: string, sorted?: true) {
	const data: OverallMemberScore[] | null = await fetch(
		`/api/scores/guild/${encodeURIComponent(guildId)}`
	).then(res => {
		return res.ok ? res.json() : null;
	});
	if (!data) return null;
	const results: [RESTGetAPIGuildMemberResult, number][] = [];
	for (const entry of data) {
		const memberData = (await fetch(
			`/api/discord/guild/${guildId}/member/${entry[0]}`
		).then(res => {
			return res.ok ? res.json() : null;
		})) as RESTGetAPIGuildMemberResult;
		results.push([memberData, entry[1]]);
	}
	return sorted ? results.sort((a, b) => b[1] - a[1]) : results;
}

export async function getGuildChallenges(
	guildId: string
): Promise<ChallengeData[] | null>;
export async function getGuildChallenges(
	guildId: string,
	sorted: true
): Promise<{ active: ChallengeData[]; inactive: ChallengeData[] } | null>;
export async function getGuildChallenges(guildId: string, sorted?: true) {
	const data = (await fetch(
		`/api/challenges/guild/${encodeURIComponent(guildId)}`
	).then(res => (res.ok ? res.json() : null))) as null | ChallengeData[];
	if (!data) return null;
	const active: any[] = [];
	const inactive: any[] = [];
	for (const entry of data) {
		if (entry.isActive) active.push(entry);
		else inactive.push(entry);
	}
	return sorted ? { active, inactive } : data;
}

export async function endChallenge(guildId: string, challengeId: string) {
	return fetch(
		`/api/challenges/delete/${encodeURIComponent(guildId)}/${encodeURIComponent(challengeId)}`,
		{
			method: 'PUT'
		}
	).then(res => (res.ok ? res.json() : null)) as Promise<boolean | null>;
}

export async function scoreChallenge(
	guildId: string,
	challengeId: string,
	userId: string,
	score: number
) {
	return fetch(
		`/api/challenges/score/${encodeURIComponent(guildId)}/${encodeURIComponent(challengeId)}/${encodeURIComponent(userId)}`,
		{
			method: 'PUT',
			body: JSON.stringify(score)
		}
	).then(res => (res.ok ? res.json() : null)) as Promise<boolean | null>;
}
