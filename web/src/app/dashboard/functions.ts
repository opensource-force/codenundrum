import {
	RESTGetAPICurrentUserGuildsResult,
	RESTGetAPICurrentUserResult,
	RESTGetAPIGuildMemberResult
} from 'discord-api-types/v10';
import { OverallMemberScore } from '../../../../shared/schemas';

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

export async function getGuilds(token: string, tokenType: string) {
	return fetch(`https://discord.com/api/v10/users/@me/guilds`, {
		headers: {
			Authorization: `${tokenType} ${token}`
		}
	}).then(res => res.json()) as Promise<RESTGetAPICurrentUserGuildsResult>;
}

export async function getGuildScores(
	token: string,
	tokenType: string,
	guildId: string
) {
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
	return results;
}
