'use client';

import {
	Button,
	Image,
	Select,
	SelectItem,
	Skeleton,
	Spacer,
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
	User as UserComponent
} from '@nextui-org/react';
import Nav from '../../_components/Nav';
import {
	RESTGetAPICurrentUserResult as UserResult,
	RESTGetAPICurrentUserGuildsResult as GuildsResult,
	RESTGetAPIChannelResult as ChannelResult,
	RESTGetCurrentUserGuildMemberResult as MemberResult,
	Snowflake,
	PermissionFlagsBits,
	RESTAPIPartialCurrentUserGuild as GuildResult,
	RESTGetAPIGuildMemberResult
} from 'discord-api-types/v10';
import { useEffect, useState } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import { ExtdSession } from '../api/auth/[...nextauth]/route';
import { getGuildScores, getGuilds, getUserData } from './functions';

export default function Dashboard() {
	const { data: sezzion } = useSession({
		required: true,
		onUnauthenticated() {
			signIn('discord', {
				callbackUrl: '/dashboard/'
			});
		}
	});
	const session = sezzion as ExtdSession | null;

	const [userData, setUserData] = useState<null | UserResult>(null),
		[guilds, setGuilds] = useState<GuildsResult>([]),
		[currentGuild, setCurrentGuild] = useState<null | Snowflake>(null),
		[isLoaded, setIsLoaded] = useState(false),
		[isGuildLoaded, setIsGuildLoaded] = useState(false),
		[guildScores, setGuildScores] = useState<[MemberResult, number][]>([]);

	useEffect(() => {
		if (!session?.accessToken || !session?.tokenType) return;
		Promise.all([
			getUserData(session.accessToken, session.tokenType),
			getGuilds(session.accessToken, session.tokenType)
		]).then(([userData, guilds]) => {
			setUserData(userData);
			setGuilds(
				typeof guilds[Symbol.iterator] === 'function'
					? guilds.sort((a, b) => a.name.localeCompare(b.name))
					: []
			);
			setIsLoaded(true);
		});
	}, [session?.accessToken, session?.tokenType]);

	useEffect(() => {
		if (!currentGuild || !session || !session.accessToken || !session.tokenType)
			return;
		setIsGuildLoaded(false);
		getGuildScores(session.accessToken, session.tokenType, currentGuild).then(
			scoresMap => {
				setGuildScores(scoresMap ?? []);
				setIsGuildLoaded(true);
			}
		);
	}, [currentGuild, session]);

	return (
		<>
			<Nav />
			<main className="w-screen min-h-screen flex flex-col justify-start items-stretch p-16 bg-not-quite-black">
				<div className="flex flex-row justify-stretch items-center">
					<div className="flex flex-row justify-stretch flex-grow">
						<Skeleton isLoaded={isLoaded} className="flex-grow">
							<Select
								size="lg"
								items={guilds}
								label="Server"
								labelPlacement="outside-left"
								placeholder="Select a server"
								variant="underlined"
								selectedKeys={currentGuild ? [currentGuild] : []}
								onSelectionChange={keys => {
									if (keys === 'all') return;
									setCurrentGuild(keys.values().next().value.toString());
								}}
								selectionMode="single"
								renderValue={items =>
									items.map(item => (
										<UserComponent
											key={item.data!.id}
											avatarProps={{
												src: getGuildIcon(item.data!),
												className: 'rounded-full w-8 h-8 border-2 border-white'
											}}
											name={item.data!.name}
											description={
												Number(item.data!.permissions) &
												Number(PermissionFlagsBits.ManageGuild)
													? 'Manager'
													: 'Member'
											}
											classNames={{
												description: 'text-neutral-400'
											}}
										/>
									))
								}
							>
								{g => (
									<SelectItem
										key={g.id}
										startContent={
											<Image
												src={getGuildIcon(g)}
												alt="guild icon"
												width={30}
												height={30}
												className="rounded-full"
											/>
										}
									>
										{g.name}
									</SelectItem>
								)}
							</Select>
						</Skeleton>
					</div>
					<div className="flex flex-row gap-4 justify-end items-center flex-grow">
						<Skeleton isLoaded={isLoaded}>
							<UserComponent
								name={userData?.global_name}
								description={`@${userData?.username}`}
								avatarProps={{
									src: userData ? getUserIcon(userData) : ''
								}}
							/>
						</Skeleton>
						<Button
							onPress={() => signOut({ callbackUrl: '/' })}
							color="danger"
						>
							Sign Out
						</Button>
					</div>
				</div>
				<Spacer y={12} />
				<div>
					<h2 className="text-3xl font-bold">Leaderboard</h2>
					<Skeleton isLoaded={isGuildLoaded}>
						<Table isStriped isHeaderSticky isCompact title="Leaderboard">
							<TableHeader>
								<TableColumn>Rank</TableColumn>
								<TableColumn>Nickname</TableColumn>
								<TableColumn>Username</TableColumn>
								<TableColumn>Score</TableColumn>
							</TableHeader>
							<TableBody
								emptyContent="No scores found."
								items={guildScores
									.toSorted(v => v[1])
									.toReversed()
									.map((v, i) => {
										return {
											score: v[1],
											index: i,
											member: v[0]
										};
									})}
							>
								{({ score, index, member }) => (
									<TableRow key={index}>
										<TableCell>{index + 1}</TableCell>
										<TableCell>
											{member.nick ?? member.user?.global_name ?? ''}
										</TableCell>
										<TableCell>{member.user?.username}</TableCell>
										<TableCell>{score}</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</Skeleton>
				</div>
			</main>
		</>
	);
}

function getGuildIcon(guild: GuildResult) {
	return guild.icon
		? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`
		: undefined;
}

function getUserIcon(user: UserResult) {
	return user.avatar
		? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
		: undefined;
}
