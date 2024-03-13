import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonInteraction,
	ButtonStyle,
	EmbedBuilder,
	MessageContextMenuCommandInteraction,
	ModalBuilder,
	ModalSubmitInteraction,
	StringSelectMenuInteraction,
	TextInputBuilder,
	TextInputStyle,
	UserContextMenuCommandInteraction
} from 'discord.js';
import { ChallengeData } from '../../shared/schemas';

export const InteractionHandlers = {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	async Button(interaction: ButtonInteraction): Promise<void> {
		// if (interaction.customId.startsWith('challenge.submit.')) {
		// 	const challengeId = interaction.customId.split('.')[2];
		// 	const challenge = (
		// 		await db.get<ChallengeData>([
		// 			interaction.guildId!,
		// 			'challenge',
		// 			challengeId
		// 		])
		// 	).value;
		// 	if (!challenge) {
		// 		await interaction.reply({
		// 			content: 'Whoops, sorry about that! Your challenge was not found.',
		// 			ephemeral: true
		// 		});
		// 		return;
		// 	}
		// 	if (!challenge.isActive) {
		// 		await interaction.reply({
		// 			content: 'This challenge is no longer active.',
		// 			ephemeral: true
		// 		});
		// 		return;
		// 	}
		// 	await interaction.showModal(
		// 		new ModalBuilder()
		// 			.setTitle('Challenge Submission')
		// 			.setCustomId(interaction.customId)
		// 			.setComponents(
		// 				new ActionRowBuilder<TextInputBuilder>().setComponents(
		// 					new TextInputBuilder()
		// 						.setCustomId('challenge.submit.link')
		// 						.setLabel('Link to Submission')
		// 						.setStyle(TextInputStyle.Short)
		// 						.setMinLength(1)
		// 						.setRequired(true)
		// 						.setPlaceholder('https://github.com/akpi816218/codenundrum')
		// 				)
		// 			)
		// 	);
		// } else if (interaction.customId.startsWith('challenge.end')) {
		// 	await interaction.deferReply({ ephemeral: true });
		// 	const challengeId = interaction.customId.split('.')[2];
		// 	const db = await openKv(DENO_KV_URL);
		// 	const challenge = (
		// 		await db.get<ChallengeData>([
		// 			interaction.guildId!,
		// 			'challenge',
		// 			challengeId
		// 		])
		// 	).value;
		// 	if (!challenge) {
		// 		await interaction.editReply(
		// 			'Whoops, sorry about that! Your challenge was not found.'
		// 		);
		// 		return;
		// 	}
		// 	if (!challenge.isActive) {
		// 		await interaction.editReply('This challenge is already disabled.');
		// 		return;
		// 	}
		// 	challenge.isActive = false;
		// 	await db.set([interaction.guildId!, 'challenge', challengeId], challenge);
		// 	await interaction.message.edit({
		// 		components: [
		// 			new ActionRowBuilder<ButtonBuilder>().setComponents(
		// 				new ButtonBuilder()
		// 					.setCustomId(`challenge.submit.${challengeId}`)
		// 					.setLabel('Submit')
		// 					.setStyle(ButtonStyle.Secondary)
		// 					.setDisabled(true),
		// 				new ButtonBuilder()
		// 					.setCustomId(`challenge.end.${challengeId}`)
		// 					.setLabel('End Challenge')
		// 					.setStyle(ButtonStyle.Secondary)
		// 					.setDisabled(true)
		// 			)
		// 		]
		// 	});
		// 	await interaction.editReply(
		// 		'Nice! The challenge has been ended. No more submissions will be accepted.'
		// 	);
		// }
	},
	ContextMenu: {
		async Message(
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			interaction: MessageContextMenuCommandInteraction
		): Promise<void> {},
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		async User(interaction: UserContextMenuCommandInteraction): Promise<void> {}
	},
	async ModalSubmit(interaction: ModalSubmitInteraction): Promise<void> {
		// if (interaction.customId === 'challenge.create') {
		// 	const name = interaction.fields.getTextInputValue(
		// 		'challenge.create.name'
		// 	);
		// 	const description = interaction.fields.getTextInputValue(
		// 		'challenge.create.description'
		// 	);
		// 	const maxScore = parseInt(
		// 		interaction.fields.getTextInputValue('challenge.create.maxScore')
		// 	);
		// 	if (!name || !description) {
		// 		await interaction.reply({
		// 			content: 'Empty name or description',
		// 			ephemeral: true
		// 		});
		// 		return;
		// 	} else if (isNaN(maxScore)) {
		// 		await interaction.reply({
		// 			content: 'Invalid max score',
		// 			ephemeral: true
		// 		});
		// 	}
		// 	await interaction.deferReply();
		// 	const db = await openKv(DENO_KV_URL);
		// 	await db.set([interaction.guildId!, 'challenge', interaction.id], {
		// 		name,
		// 		description,
		// 		maxScore,
		// 		isActive: true,
		// 		submissions: [],
		// 		id: interaction.id
		// 	} satisfies ChallengeData);
		// 	await interaction.editReply({
		// 		embeds: [
		// 			new EmbedBuilder()
		// 				.setTitle('Challenge Created')
		// 				.setColor('Aqua')
		// 				.setDescription(
		// 					`**Name:** ${name}\n**Description:** ${description}\n**Max Score:** ${maxScore}`
		// 				)
		// 		],
		// 		components: [
		// 			new ActionRowBuilder<ButtonBuilder>().setComponents(
		// 				new ButtonBuilder()
		// 					.setCustomId(`challenge.submit.${interaction.id}`)
		// 					.setLabel('Submit')
		// 					.setStyle(ButtonStyle.Primary),
		// 				new ButtonBuilder()
		// 					.setCustomId(`challenge.end.${interaction.id}`)
		// 					.setLabel('End Challenge')
		// 					.setStyle(ButtonStyle.Secondary)
		// 			)
		// 		]
		// 	});
		// } else if (interaction.customId.startsWith('challenge.submit.')) {
		// 	await interaction.deferReply({ ephemeral: true });
		// 	const challengeId = interaction.customId.split('.')[2];
		// 	const link = interaction.fields.getTextInputValue(
		// 		'challenge.submit.link'
		// 	);
		// 	if (!link) {
		// 		await interaction.editReply('Bad link');
		// 		return;
		// 	}
		// 	const db = await openKv(DENO_KV_URL);
		// 	const challenge = (
		// 		await db.get<ChallengeData>([
		// 			interaction.guildId!,
		// 			'challenge',
		// 			challengeId
		// 		])
		// 	).value;
		// 	if (!challenge) {
		// 		await interaction.editReply(
		// 			'Whoops, sorry about that! Your challenge was not found.'
		// 		);
		// 		return;
		// 	}
		// 	challenge.submissions.push({
		// 		userId: interaction.user.id,
		// 		link,
		// 		score: undefined
		// 	});
		// 	await db.set([interaction.guildId!, 'challenge', challengeId], challenge);
		// 	await interaction.editReply('Your submission has been recorded!');
		// }
	},
	async StringSelectMenu(
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		interaction: StringSelectMenuInteraction
	): Promise<void> {}
};
