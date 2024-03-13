import 'dotenv/config';
import {
	ActivityType,
	ButtonInteraction,
	ChatInputCommandInteraction,
	Events,
	GatewayIntentBits,
	ModalSubmitInteraction,
	OAuth2Scopes,
	PresenceUpdateStatus
} from 'discord.js';
import { CommandClient } from './lib/discord/Extend';
import { Methods, createServer } from './lib/server';
import { PORT, permissionsBits } from './config';
import { argv, stdout } from 'process';
import { Command } from './lib/discord/types';
import { InteractionHandlers } from './interactionHandlers';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { logger } from './lib/logger';
import { readdirSync } from 'fs';
import { SerializedCommandHelpEntry } from './lib/CommandHelpEntry';
import TypedJsoning from 'typed-jsoning';

argv.shift();
argv.shift();
if (argv.includes('-d')) {
	logger.level = 'debug';
	logger.debug('Debug mode enabled.');
}

logger.debug('Loaded database.');

const client = new CommandClient({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildMessageReactions
	],
	presence: {
		activities: [
			{
				name: '/about',
				type: ActivityType.Playing
			}
		],
		afk: false,
		status: PresenceUpdateStatus.Online
	}
});
logger.debug('Created client instance.');

const server = createServer(
	{
		handler: (_req, res) =>
			res.redirect(
				client.generateInvite({
					permissions: permissionsBits,
					scopes: [
						OAuth2Scopes.ApplicationsCommands,
						OAuth2Scopes.Bot,
						OAuth2Scopes.Email,
						OAuth2Scopes.Guilds,
						OAuth2Scopes.Identify
					]
				})
			),
		method: Methods.GET,
		route: '/invite'
	},
	{
		handler: (_req, res) => res.sendStatus(200),
		method: Methods.GET,
		route: '/'
	},
	{
		handler: (req, res) => {
			if (
				req.headers['content-type'] != 'application/json' &&
				req.headers['content-type'] != undefined
			)
				res.status(415).end();
			else if (client.isReady())
				res
					.status(200)
					.contentType('application/json')
					.send({
						clientPing: client.ws.ping,
						clientReady: client.isReady(),
						commandCount: client.application!.commands.cache.size,
						guildCount: client.application!.approximateGuildCount,
						lastReady: client.readyAt!.valueOf(),
						timestamp: Date.now(),
						uptime: client.uptime
					})
					.end();
			else res.status(503).end();
		},
		method: Methods.GET,
		route: '/api/bot'
	}
);
logger.debug('Created server instance.');

const commandsPath = join(dirname(fileURLToPath(import.meta.url)), 'commands');
const commandFiles = readdirSync(commandsPath).filter(file =>
	file.endsWith('.ts')
);
logger.debug('Loaded command files.');
const cmndb = new TypedJsoning<SerializedCommandHelpEntry>(
	'botfiles/cmnds.db.json'
);
for (const file of commandFiles) {
	const filePath = join(commandsPath, file);
	logger.debug(`Loading command ${filePath}`);
	const command: Command = await import(filePath);
	client.commands.set(command.data.name, command);
	if (command.help) await cmndb.set(command.data.name, command.help.toJSON());
}
client.commands.freeze();
logger.info('Loaded commands.');

client
	.on(Events.ClientReady, () => logger.info('Client#ready'))
	.on(Events.InteractionCreate, async interaction => {
		if (interaction.user.bot) return;
		try {
			if (interaction.isChatInputCommand()) {
				const command = client.commands.get(interaction.commandName);
				if (!command) {
					await interaction.reply('Internal error: Command not found');
					return;
				}
				await command.execute(interaction);
			} else if (interaction.isModalSubmit()) {
				await InteractionHandlers.ModalSubmit(interaction);
			} else if (interaction.isButton()) {
				await InteractionHandlers.Button(interaction);
			}
		} catch (e) {
			await respondError(
				interaction as
					| ChatInputCommandInteraction
					| ModalSubmitInteraction
					| ButtonInteraction
			);
			logger.error(e);
		}
	})
	.on(Events.Debug, m => logger.debug(m))
	.on(Events.Error, m => logger.error(m))
	.on(Events.Warn, m => logger.warn(m));
logger.debug('Set up client events.');

await client
	.login(process.env.DISCORD_TOKEN)
	.then(() => logger.info('Logged in.'));

process.on('SIGINT', () => {
	client.destroy();
	stdout.write('\n');
	logger.info('Destroyed Client.');
	process.exit(0);
});

server.listen(process.env.PORT ?? PORT);
logger.info(`Listening to HTTP server on port ${process.env.PORT ?? PORT}.`);

logger.info('Process setup complete.');

async function respondError(
	interaction:
		| ChatInputCommandInteraction
		| ModalSubmitInteraction
		| ButtonInteraction
) {
	if (interaction.replied || interaction.deferred) {
		await interaction.editReply(
			'There was an error while running this command.'
		);
	} else {
		await interaction.reply({
			content: 'There was an error while running this command.',
			ephemeral: true
		});
	}
}
