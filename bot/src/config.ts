import { PermissionFlagsBits, PermissionsBitField } from 'discord.js';

export const clientId = '1212232248527425656';

export const permissionsBits = new PermissionsBitField().add(
	PermissionFlagsBits.EmbedLinks,
	PermissionFlagsBits.MentionEveryone,
	PermissionFlagsBits.ReadMessageHistory,
	PermissionFlagsBits.SendMessages,
	PermissionFlagsBits.SendMessagesInThreads,
	PermissionFlagsBits.ViewChannel
);

export const PORT = 8000;

export const DENO_KV_URL =
	'https://api.deno.com/databases/8c47e109-18c7-45d0-9b4e-ce5f44d64f94/connect';

export enum DatabaseKeys {
	GuildConfig = 'guildConfig'
}
