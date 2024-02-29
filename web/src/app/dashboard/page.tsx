'use client';

import {
	Image,
	Select,
	SelectItem,
	User as UserComponent
} from '@nextui-org/react';
import Nav from '../../_components/Nav';
import {
	RESTGetAPICurrentUserResult as UserResult,
	RESTGetAPICurrentUserGuildsResult as GuildsResult,
	RESTGetAPIChannelResult as ChannelResult,
	RESTGetCurrentUserGuildMemberResult as MemberResult,
	Snowflake,
	Routes,
	PermissionFlagsBits,
	RESTAPIPartialCurrentUserGuild
} from 'discord-api-types/v10';
import { useEffect, useState } from 'react';
import { redirect } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { ExtdSession } from '../api/auth/[...nextauth]/route';
import { REST } from '@discordjs/rest';

export default function Dashboard() {
	const { data: sezzion, status } = useSession({
		required: true,
		onUnauthenticated() {
			redirect('/api/auth/signin');
		}
	});
	const session = sezzion as ExtdSession;

	const [userData, setUserData] = useState<null | UserResult>(null),
		[guilds, setGuilds] = useState<GuildsResult>([]),
		[currentGuild, setCurrentGuild] = useState<null | Snowflake>(null),
		[memberData, setMemberData] = useState<Map<Snowflake, MemberResult>>(
			new Map<Snowflake, MemberResult>()
		),
		[isLoaded, setIsLoaded] = useState(false),
		[isGuildLoaded, setIsGuildLoaded] = useState(false);

	const Rest = new REST({ version: '10' }).setToken(session.accessToken!);

	useEffect(() => {
		if (!session) return;
		Promise.all([
			fetch(`https://discord.com/api/v10/users/@me`, {
				headers: {
					Authorization: `${session.tokenType} ${session.accessToken}`
				}
			}).then(res => res.json()),
			fetch(`https://discord.com/api/v10/users/@me/guilds`, {
				headers: {
					Authorization: `${session.tokenType} ${session.accessToken}`
				}
			}).then(res => res.json())
		]).then(([userData, guildData]: [UserResult, GuildsResult]) => {
			setUserData(userData);
			setGuilds(
				guildData.filter(
					guild =>
						Number(guild.permissions) & Number(PermissionFlagsBits.ManageGuild)
				)
			);
			setIsLoaded(true);
		});
	}, [session]);

	useEffect(() => {
		if (!currentGuild) return;
		// @ts-expect-error TODO fetch data
	}, [currentGuild, Rest]);

	return (
		<>
			<Nav />
			<main className="w-screen min-h-screen flex flex-col justify-start items-stretch">
				<div className="flex flex-row gap-4 justify-stretch items-center">
					<Select
						items={guilds}
						label="Server"
						placeholder="Select a server"
						variant="bordered"
						selectedKeys={currentGuild ? [currentGuild] : []}
						onSelectionChange={async keys => {
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
									description={item.data!.id}
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
				</div>
			</main>
		</>
	);
}

function getGuildIcon(guild: RESTAPIPartialCurrentUserGuild) {
	return `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`;
}
