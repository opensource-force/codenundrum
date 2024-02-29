import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { CommandHelpEntry } from '../CommandHelpEntry';

export interface Command {
	data: SlashCommandBuilder;
	help?: CommandHelpEntry;
	execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}
