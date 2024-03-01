'use client';

import {
	Button,
	Image,
	Select,
	SelectItem,
	Skeleton,
	Spacer,
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
	RESTAPIPartialCurrentUserGuild as GuildResult
} from 'discord-api-types/v10';
import { useEffect, useState } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import { ExtdSession } from '../api/auth/[...nextauth]/route';
import { getGuilds, getUserData } from './functions';

export default function Dashboard() {
	const { data: sezzion, status } = useSession({
		required: true,
		onUnauthenticated() {
			signIn('discord', {
				callbackUrl: '/dashboard/'
			});
		}
	});
	const session = sezzion as ExtdSession;

	const [userData, setUserData] = useState<null | UserResult>(null),
		[guilds, setGuilds] = useState<GuildsResult>([]),
		[currentGuild, setCurrentGuild] = useState<null | Snowflake>(null),
		[isLoaded, setIsLoaded] = useState(false),
		[isGuildLoaded, setIsGuildLoaded] = useState(false);

	useEffect(() => {
		if (!session) return;
		Promise.all([
			getUserData(session.accessToken!, session.tokenType!),
			getGuilds(session.accessToken!, session.tokenType!)
		]).then(([userData, guilds]) => {
			setUserData(userData);
			setGuilds(guilds);
			setIsLoaded(true);
		});
	});

	return (
		<>
			<Nav />
			<main className="w-screen min-h-screen flex flex-col justify-start items-stretch p-8 bg-not-quite-black">
				<div className="flex flex-row justify-stretch items-center">
					<div className="flex flex-row justify-start items-center">
						<Skeleton isLoaded={isLoaded}>
							<Select
								items={guilds}
								label="Server"
								placeholder="Select a server"
								variant="bordered"
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
												src: getGuildIcon(item.data!)
											}}
											name={item.data!.name}
											description={
												Number(item.data!.permissions) &
												Number(PermissionFlagsBits.ManageGuild)
													? 'Manageable'
													: 'Member'
											}
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
					<Spacer className="flex-grow" />
					<div className="flex flex-row gap-4 justify-end items-center">
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
			</main>
		</>
	);
}

function getGuildIcon(guild: GuildResult) {
	return `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`;
}

function getUserIcon(user: UserResult) {
	return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`;
}
