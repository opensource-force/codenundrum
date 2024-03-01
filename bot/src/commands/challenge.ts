import {
	ActionRowBuilder,
	ChatInputCommandInteraction,
	Colors,
	EmbedBuilder,
	ModalBuilder,
	PermissionFlagsBits,
	SlashCommandBuilder,
	TextInputBuilder,
	TextInputStyle
} from 'discord.js';
import { CommandHelpEntry } from '../lib/CommandHelpEntry';
import { openKv } from '@deno/kv';
import { DENO_KV_URL } from '../config';
import { ChallengeData } from '../../../shared/schemas';

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
	else if (subcommand === 'ls') {
		const db = await openKv(DENO_KV_URL);
		const cs = db!.list<ChallengeData>({
			prefix: [interaction.guildId!, 'challenge']
		});
		const challenges: ChallengeData[] = [];
		for await (const c of cs) {
			challenges.push(c.value);
		}
		const active = challenges.filter(c => c.isActive),
			inactive = challenges.filter(c => !c.isActive);
		await interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setTitle('Active Challenges')
					.setColor(Colors.Green)
					.setDescription(
						active.length > 0
							? active
									.map(
										(v, i) =>
											`**${i + 1} - ${v.name}**\n${v.description.replaceAll(/\n\n+/g, '\n')}\n**${v.maxScore}** pts`
									)
									.join('\n')
							: 'No active challenges found.'
					),
				new EmbedBuilder()
					.setTitle('Inactive Challenges')
					.setColor(Colors.DarkNavy)
					.setDescription(
						inactive.length > 0
							? inactive
									.map(
										(v, i) =>
											`**${i + 1} - ${v.name}**\n${v.description.replaceAll(/\n\n+/g, '\n')}\n**${v.maxScore}** pts`
									)
									.join('\n')
							: 'No inactive challenges found.'
					)
			]
		});
	}
}
