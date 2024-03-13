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
