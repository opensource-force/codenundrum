import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonInteraction,
	ButtonStyle,
	EmbedBuilder,
	ModalBuilder,
	ModalSubmitInteraction,
	TextInputBuilder,
	TextInputStyle,
	inlineCode
} from 'discord.js';
import {
	addSubmission,
	createChallenge,
	disableChallenge,
	getGuildChallenges
} from '../../shared/functions';
import isURL from 'validator/lib/isURL';

export const InteractionHandlers = {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	async Button(interaction: ButtonInteraction): Promise<void> {
		if (interaction.customId.startsWith('challenge.submit.')) {
			const challengeId = interaction.customId.split('.')[2];
			const challenge = (
				(await getGuildChallenges(interaction.guildId!)) ?? []
			).find(v => v.id === challengeId);
			if (!challenge) {
				await interaction.reply({
					content: 'Whoops, sorry about that! Your challenge was not found. 👀',
					ephemeral: true
				});
				return;
			}
			if (!challenge.isActive) {
				await interaction.message.edit({
					components: [
						new ActionRowBuilder<ButtonBuilder>().setComponents(
							new ButtonBuilder()
								.setCustomId(`challenge.submit.${challengeId}`)
								.setLabel('Submit')
								.setStyle(ButtonStyle.Secondary)
								.setDisabled(true),
							new ButtonBuilder()
								.setCustomId(`challenge.end.${challengeId}`)
								.setLabel('End Challenge')
								.setStyle(ButtonStyle.Secondary)
								.setDisabled(true)
						)
					]
				});
				await interaction.reply({
					content: 'Sorry! This challenge is not active. 😑',
					ephemeral: true
				});
				return;
			}
			await interaction.showModal(
				new ModalBuilder()
					.setTitle('Challenge Submission')
					.setCustomId(interaction.customId)
					.setComponents(
						new ActionRowBuilder<TextInputBuilder>().setComponents(
							new TextInputBuilder()
								.setCustomId('challenge.submit.link')
								.setLabel('Link to Submission')
								.setStyle(TextInputStyle.Short)
								.setMinLength(1)
								.setRequired(true)
								.setPlaceholder('https://github.com/akpi816218/codenundrum')
						)
					)
			);
		} else if (interaction.customId.startsWith('challenge.end')) {
			await interaction.deferReply({ ephemeral: true });
			const challengeId = interaction.customId.split('.')[2];
			const challenge = (
				(await getGuildChallenges(interaction.guildId!)) ?? []
			).find(v => v.id === challengeId);
			if (!challenge) {
				await interaction.editReply(
					'Whoops, sorry about that! Your challenge was not found. 👀'
				);
				return;
			}
			if (!challenge.isActive) {
				await interaction.editReply('This challenge is already disabled. 😑');
				return;
			}
			challenge.isActive = false;
			await disableChallenge(interaction.guildId!, challengeId);
			await interaction.message.edit({
				components: [
					new ActionRowBuilder<ButtonBuilder>().setComponents(
						new ButtonBuilder()
							.setCustomId(`challenge.submit.${challengeId}`)
							.setLabel('Submit')
							.setStyle(ButtonStyle.Secondary)
							.setDisabled(true),
						new ButtonBuilder()
							.setCustomId(`challenge.end.${challengeId}`)
							.setLabel('End Challenge')
							.setStyle(ButtonStyle.Secondary)
							.setDisabled(true)
					)
				]
			});
			await interaction.editReply({
				content:
					'🎉 Nice! The challenge has been ended! 🎉\nNo more submissions will be accepted. You can view and score the submissions on the web dashboard.',
				components: [
					new ActionRowBuilder<ButtonBuilder>().setComponents(
						new ButtonBuilder()
							.setLabel('Dashboard')
							.setStyle(ButtonStyle.Link)
							.setURL(`https://codenundrum.vercel.app/dashboard/`)
					)
				]
			});
		}
	},
	async ModalSubmit(interaction: ModalSubmitInteraction): Promise<void> {
		if (interaction.customId === 'challenge.create') {
			const name = interaction.fields.getTextInputValue(
				'challenge.create.name'
			);
			const description = interaction.fields.getTextInputValue(
				'challenge.create.description'
			);
			const maxScore = parseInt(
				interaction.fields.getTextInputValue('challenge.create.maxScore')
			);
			if (!name || !description) {
				await interaction.reply({
					content: 'Empty name or description',
					ephemeral: true
				});
				return;
			} else if (isNaN(maxScore)) {
				await interaction.reply({
					content: 'Invalid max score',
					ephemeral: true
				});
			}
			await interaction.deferReply();
			const result = await createChallenge(
				interaction.guildId!,
				interaction.id,
				name,
				description,
				maxScore
			);
			if (result)
				await interaction.editReply({
					embeds: [
						new EmbedBuilder()
							.setTitle('Challenge Created')
							.setColor('Aqua')
							.setDescription(
								`**Name:** ${name}\n**Description:** ${description}\n**Max Score:** ${maxScore}`
							)
					],
					components: [
						new ActionRowBuilder<ButtonBuilder>().setComponents(
							new ButtonBuilder()
								.setCustomId(`challenge.submit.${interaction.id}`)
								.setLabel('Submit')
								.setStyle(ButtonStyle.Primary),
							new ButtonBuilder()
								.setCustomId(`challenge.end.${interaction.id}`)
								.setLabel('End Challenge')
								.setStyle(ButtonStyle.Secondary)
						)
					]
				});
			else await interaction.editReply('Failed to create challenge');
		} else if (interaction.customId.startsWith('challenge.submit.')) {
			await interaction.deferReply({ ephemeral: true });
			const link = interaction.fields.getTextInputValue(
				'challenge.submit.link'
			);
			if (
				!isURL(link, {
					require_protocol: true,
					require_host: true,
					require_valid_protocol: true,
					protocols: ['https'],
					allow_fragments: false,
					validate_length: true
				})
			) {
				await interaction.editReply(
					`You provided an invalid URL (${inlineCode(link)}). 🤨\nPlease make sure it starts with ${inlineCode('https://')}, includes a host, and is not longer than 2083 characters.`
				);
				return;
			}
			const challengeId = interaction.customId.split('.')[2];
			const result = await addSubmission(
				interaction.guildId!,
				challengeId,
				link,
				interaction.user.id
			);
			if (result)
				await interaction.editReply({
					content:
						'🎉 Your submission has been recorded! 🎉\nIf you previously had submitted, it has been overwritten, and your score has been unset. You can view your submission on the web dashboard.',
					components: [
						new ActionRowBuilder<ButtonBuilder>().setComponents(
							new ButtonBuilder()
								.setLabel('Dashboard')
								.setStyle(ButtonStyle.Link)
								.setURL(`https://codenundrum.vercel.app/dashboard/`)
						)
					]
				});
			else
				await interaction.editReply(
					'Oops, the submission failed. 🫥\nThe challenge was not found or is not active.'
				);
		}
	}
};
