'use client';

import {
	Accordion,
	AccordionItem,
	Button,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
	Image,
	Link,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
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
	User as UserComponent,
	useDisclosure
} from '@nextui-org/react';
import Nav from '../../_components/Nav';
import {
	RESTGetAPICurrentUserResult as UserResult,
	RESTGetAPICurrentUserGuildsResult as GuildsResult,
	RESTGetCurrentUserGuildMemberResult as MemberResult,
	Snowflake,
	PermissionFlagsBits,
	RESTAPIPartialCurrentUserGuild as GuildResult
} from 'discord-api-types/v10';
import { useEffect, useState } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import { ExtdSession } from '../../auth';
import {
	endChallenge,
	getGuildChallenges,
	getGuildScores,
	getGuilds,
	getUserData,
	scoreChallenge
} from './functions';
import Footer from '../../_components/Footer';
import { ChallengeData, SubmissionWithUser } from '../../../../shared/schemas';
import { DateTime } from 'luxon';

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
		[guildIsManageable, setGuildIsManageable] = useState(false),
		[isLoaded, setIsLoaded] = useState(false),
		[isGuildLoaded, setIsGuildLoaded] = useState(false),
		[guildScores, setGuildScores] = useState<[MemberResult, number][]>([]),
		[guildChallenges, setGuildChallenges] = useState<ChallengeData[]>([]),
		[selectedChallenge, setSelectedChallenge] =
			useState<null | ChallengeData<true>>(null),
		{
			isOpen: viewModalIsOpen,
			onOpen: viewModalOpen,
			onOpenChange: viewModalOpenChange
		} = useDisclosure({
			id: 'view-challenge-modal'
		});

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
		Promise.all([
			getGuildScores(currentGuild).then(s =>
				setGuildScores(s instanceof Array ? s : [])
			),
			getGuildChallenges(currentGuild).then(c => setGuildChallenges(c ?? []))
		]).then(() => setIsGuildLoaded(true));
	}, [currentGuild, session]);

	return (
		<>
			<Nav />
			<div className="w-screen min-h-screen flex flex-col justify-stretch items-stretch">
				<main className="flex-grow flex flex-col justify-normal items-stretch p-16 bg-not-quite-black">
					<div className="flex flex-row justify-stretch items-center">
						<div className="flex flex-row justify-stretch flex-grow">
							<Skeleton isLoaded={isLoaded} className="flex-grow rounded-lg">
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
										const key = keys.values().next().value.toString();
										setCurrentGuild(key);
										setGuildIsManageable(
											!!(
												Number(guilds.find(g => g.id === key)!.permissions) &
												Number(PermissionFlagsBits.ManageGuild)
											)
										);
									}}
									selectionMode="single"
									renderValue={items =>
										items.map(item => (
											<UserComponent
												key={item.data!.id}
												avatarProps={{
													src: getGuildIcon(item.data!),
													className:
														'rounded-full w-8 h-8 border-2 border-white'
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
							<Skeleton isLoaded={isLoaded} className="rounded-lg">
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
					<Skeleton isLoaded={isGuildLoaded} className="rounded-2xl">
						<Accordion>
							<AccordionItem title="Leaderboard" aria-label="Leaderboard">
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
											.sort(v => v[1])
											.reverse()
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
							</AccordionItem>
							<AccordionItem title="Challenges" aria-label="Challenges">
								<Table isStriped isHeaderSticky isCompact title="Challenges">
									<TableHeader>
										<TableColumn>Name</TableColumn>
										<TableColumn>Timestamp</TableColumn>
										<TableColumn>Max. Score</TableColumn>
										<TableColumn>Submission Count</TableColumn>
										<TableColumn>Active?</TableColumn>
										<TableColumn>Actions</TableColumn>
									</TableHeader>
									<TableBody
										emptyContent="No challenges found."
										items={guildChallenges.map(
											({
												name,
												description,
												id,
												isActive,
												maxScore,
												submissions,
												timestamp
											}) => {
												return {
													name,
													description,
													id,
													isActive,
													maxScore,
													submissionCount: submissions.length + 1,
													timestamp
												};
											}
										)}
									>
										{({
											name,
											id,
											isActive,
											maxScore,
											submissionCount,
											timestamp
										}) => (
											<TableRow key={id}>
												<TableCell>{name}</TableCell>
												<TableCell>
													{DateTime.fromISO(timestamp).toLocaleString(
														DateTime.DATE_SHORT
													)}
												</TableCell>
												<TableCell>{maxScore}</TableCell>
												<TableCell>{submissionCount}</TableCell>
												<TableCell>{isActive ? 'Yes' : 'No'}</TableCell>
												<TableCell>
													<Dropdown>
														<DropdownTrigger>
															<Button size="sm" className="text-xl">
																⋮
															</Button>
														</DropdownTrigger>
														<DropdownMenu
															aria-label="Challenge actions menu"
															disabledKeys={
																!guildIsManageable || !isActive ? ['end'] : []
															}
															onAction={async key => {
																switch (key.toString()) {
																	case 'view': {
																		setSelectedChallenge(
																			guildChallenges.find(c => c.id === id)!
																		);
																		viewModalOpen();
																		break;
																	}
																	case 'end': {
																		await endChallenge(currentGuild!, id);
																		setGuildChallenges(
																			(await getGuildChallenges(
																				currentGuild!
																			)) ?? []
																		);
																		break;
																	}
																}
															}}
														>
															<DropdownItem key="view">View</DropdownItem>
															<DropdownItem
																key="end"
																color="danger"
																className="text-danger"
															>
																End Challenge
															</DropdownItem>
														</DropdownMenu>
													</Dropdown>
												</TableCell>
											</TableRow>
										)}
									</TableBody>
								</Table>
							</AccordionItem>
						</Accordion>
					</Skeleton>
				</main>
				<Footer />
			</div>
			<Modal
				isDismissable
				backdrop="blur"
				isOpen={viewModalIsOpen}
				onOpenChange={viewModalOpenChange}
				size="4xl"
			>
				<ModalContent>
					{close => (
						<>
							<ModalHeader>Challenge Overview</ModalHeader>
							<ModalBody>
								<div className="text-lg flex flex-col justify-normal items-stretch gap-4">
									<p className="text-xl font-semibold pl-4 border-l-neutral-500">
										{selectedChallenge!.name}
									</p>
									<p className="pl-4 border-l-neutral-500">
										{selectedChallenge!.description}
									</p>
									<p>
										This challenge is {selectedChallenge!.isActive ? '' : 'in'}
										active.
										<br />
										Maximum score is {selectedChallenge!.maxScore}.
									</p>
									<p>
										{selectedChallenge!.isActive ? 'Created at' : 'Ended at'}{' '}
										{DateTime.fromISO(
											selectedChallenge!.timestamp
										).toLocaleString(DateTime.DATETIME_FULL)}
									</p>
									<Spacer y={4} />
									<p className="text-xl">
										{guildIsManageable ? 'Submissions' : 'Your Submission'}
									</p>
									<Spacer y={2} />
									{guildIsManageable ? (
										<>
											<Table
												isStriped
												isHeaderSticky
												isCompact
												title="Submissions"
											>
												<TableHeader>
													<TableColumn>Username</TableColumn>
													<TableColumn>Link</TableColumn>
													<TableColumn>Score</TableColumn>
													<TableColumn>Timestamp</TableColumn>
													<TableColumn>Actions</TableColumn>
												</TableHeader>
												<TableBody
													emptyContent="No submissions found."
													items={selectedChallenge!.submissions}
												>
													{({ link, score, timestamp, username, userId }) => (
														<TableRow key={userId}>
															<TableCell>{username}</TableCell>
															<TableCell>
																<Link
																	isExternal
																	target="_blank"
																	href={encodeURI(link)}
																>
																	{link}
																</Link>
															</TableCell>
															<TableCell>{score}</TableCell>
															<TableCell>
																{DateTime.fromISO(timestamp).toLocaleString(
																	DateTime.DATETIME_FULL
																)}
															</TableCell>
															<TableCell>
																<Dropdown>
																	<DropdownTrigger>
																		<Button size="sm" className="text-xl">
																			⋮
																		</Button>
																	</DropdownTrigger>
																	<DropdownMenu
																		onAction={async key => {
																			switch (key.toString()) {
																				case 'grade': {
																					const newScore = parseInt(
																						prompt(
																							'Enter the new score for this submission:'
																						) ?? ''
																					);
																					if (newScore) {
																						if (
																							newScore >
																							selectedChallenge!.maxScore
																						) {
																							alert(
																								`The maximum score is ${selectedChallenge!.maxScore}.`
																							);
																							break;
																						}
																						await scoreChallenge(
																							currentGuild!,
																							selectedChallenge!.id,
																							userId,
																							newScore
																						);
																						const newSubmissions =
																							selectedChallenge!.submissions;
																						newSubmissions[
																							newSubmissions.findIndex(
																								s => s.userId === userId
																							)
																						].score = Number(newScore);
																						setSelectedChallenge({
																							...selectedChallenge!,
																							submissions: newSubmissions
																						});
																					} else alert("That's not  a number.");
																					break;
																				}
																			}
																		}}
																	>
																		<DropdownItem key="grade">
																			Grade
																		</DropdownItem>
																	</DropdownMenu>
																</Dropdown>
															</TableCell>
														</TableRow>
													)}
												</TableBody>
											</Table>
											<Spacer y={4} />
											<p className="text-lg">
												Updated scores will be shown upon closing and opening
												this modal.
											</p>
										</>
									) : (
										<Table
											isStriped
											isHeaderSticky
											isCompact
											title="Submissions"
										>
											<TableHeader>
												<TableColumn>Username</TableColumn>
												<TableColumn>Score</TableColumn>
											</TableHeader>
											<TableBody
												emptyContent="No submissions found."
												items={selectedChallenge!.submissions.filter(
													s => s.userId === userData?.id
												)}
											>
												{({ username, userId, score }) => (
													<TableRow id={userId}>
														<TableCell>{username}</TableCell>
														<TableCell>{score}</TableCell>
													</TableRow>
												)}
											</TableBody>
										</Table>
									)}
								</div>
							</ModalBody>
							<ModalFooter>
								<Button color="warning" onClick={close}>
									Close
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
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
