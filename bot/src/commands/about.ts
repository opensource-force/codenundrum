import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	ChatInputCommandInteraction,
	EmbedBuilder,
	SlashCommandBuilder
} from 'discord.js';
import { CommandHelpEntry } from '../lib/CommandHelpEntry';

export const data = new SlashCommandBuilder()
	.setName('about')
	.setDescription('About Codenundrum');

export const help = new CommandHelpEntry('about', 'Shows info about the bot');

export const execute = async (interaction: ChatInputCommandInteraction) => {
	await interaction.reply({
		components: [
			new ActionRowBuilder<ButtonBuilder>().setComponents(
				new ButtonBuilder()
					.setStyle(ButtonStyle.Link)
					.setURL('https://github.com/akpi816218/codenundrum/')
					.setLabel('Source Code')
			)
		],
		embeds: [
			new EmbedBuilder()
				.setColor(0x00ff00)
				.setThumbnail(interaction.client.user.displayAvatarURL())
				.setAuthor({
					iconURL: interaction.client.user.displayAvatarURL(),
					name: 'Codenundrum'
				})
				.setTimestamp()
				.setFooter({
					iconURL: interaction.client.user.displayAvatarURL(),
					text: 'About Codenundrum'
				})
				.setTitle('About Codenundrum')
				.setDescription(
					`Codenundrum is a Discord bot that is designed to challenge you programming problems!`
				)
		]
	});
};
