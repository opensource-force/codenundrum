import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	ChatInputCommandInteraction,
	ModalBuilder,
	PermissionFlagsBits,
	SlashCommandBuilder,
	TextInputBuilder,
	TextInputStyle
} from 'discord.js';
import { CommandHelpEntry } from '../lib/CommandHelpEntry';

export const data = new SlashCommandBuilder()
	.setName('challenge')
	.setDescription('Manage challenges')
	.setDMPermission(false)
	.setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
	.addSubcommand(s =>
		s.setName('create').setDescription('Create a new challenge')
	)
	.addSubcommand(s => s.setName('ls').setDescription('List all challenges'));

export const help = new CommandHelpEntry(
	'challenge',
	'Manage challenges',
	'create',
	'ls'
);

export async function execute(interaction: ChatInputCommandInteraction) {
	const subcommand = interaction.options.getSubcommand();
	if (subcommand === 'create')
		await interaction.showModal(
			new ModalBuilder()
				.setCustomId('challenge.create')
				.setTitle('Create Challenge')
				.setComponents(
					new ActionRowBuilder<TextInputBuilder>().setComponents(
						new TextInputBuilder()
							.setCustomId('challenge.create.name')
							.setLabel('Name')
							.setRequired(true)
							.setMinLength(1)
							.setMaxLength(100)
							.setStyle(TextInputStyle.Short)
					),
					new ActionRowBuilder<TextInputBuilder>().setComponents(
						new TextInputBuilder()
							.setCustomId('challenge.create.description')
							.setLabel('Description')
							.setRequired(true)
							.setMinLength(1)
							.setMaxLength(1000)
							.setStyle(TextInputStyle.Paragraph)
					),
					new ActionRowBuilder<TextInputBuilder>().setComponents(
						new TextInputBuilder()
							.setCustomId('challenge.create.maxScore')
							.setLabel('Max Score')
							.setValue('100')
							.setRequired(true)
							.setMinLength(1)
							.setMaxLength(4)
							.setStyle(TextInputStyle.Short)
					)
				)
		);
	else if (subcommand === 'ls')
		await interaction.reply({
			components: [
				new ActionRowBuilder<ButtonBuilder>().setComponents(
					new ButtonBuilder()
						.setStyle(ButtonStyle.Link)
						.setLabel('Open Dashboard')
						.setURL('https://codenundrum.vercel.app/dashboard/')
				)
			],
			content: 'Open the dashboard to view challenges!',
			ephemeral: true
		});
}
