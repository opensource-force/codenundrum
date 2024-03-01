'use server';

import {
	RESTGetAPICurrentUserGuildsResult,
	RESTGetAPICurrentUserResult
} from 'discord-api-types/v10';

export async function getUserData(token: string, tokenType: string) {
	'use server';
	return (await await fetch(`https://discord.com/api/v10/users/@me`, {
		headers: {
			Authorization: `${tokenType} ${token}`
		}
	}).then(res => res.json())) as RESTGetAPICurrentUserResult;
}

export async function getGuilds(token: string, tokenType: string) {
	'use server';
	return (await fetch(`https://discord.com/api/v10/users/@me/guilds`, {
		headers: {
			Authorization: `${tokenType} ${token}`
		}
	}).then(res => res.json())) as RESTGetAPICurrentUserGuildsResult;
}
