import { RESTGetAPIGuildMemberResult } from 'discord-api-types/v10';

/**
 * @interface ChallengeData Represents a challenge
 */
export interface ChallengeData<SubmissionsWithUsers extends boolean = false> {
	/**
	 * @prop {string} id The ID of the challenge
	 */
	id: string;
	/**
	 * @prop {string} name The name of the challenge
	 */
	name: string;
	/**
	 * @prop {string} description The description of the challenge
	 */
	description: string;
	/**
	 * @prop {boolean} isActive Whether the challenge is active
	 */
	isActive: boolean;
	/**
	 * @prop {SubmissionData} submission The submission data of the challenge
	 */
	submissions: SubmissionData[];
	/**
	 * @prop {number} maxScore The maximum score of the challenge
	 */
	maxScore: number;
	/**
	 * @prop {string} timestamp The ISO 8601 timestamp of challenge's creation or end
	 */
	timestamp: string;
}

/**
 * @interface SubmissionData Represents a submission to a challenge
 */
export interface SubmissionData {
	/**
	 * @prop {string} userId The Discord UID of the user who submitted the challenge
	 */
	userId: string;
	/**
	 * @prop {string} username The username of the user who submitted the challenge
	 */
	username: string;
	/**
	 * @prop {string} link The link to the submission
	 */
	link: string;
	/**
	 * @prop {number | undefined} score The score of the submission, or undefined if it has not been scored
	 */
	score: number | undefined;
	/**
	 * @prop {string} timestamp The ISO 8601 timestamp of the submission
	 */
	timestamp: string;
}

/**
 * @interface SubmissionWithUser Represents a submission to a challenge with the user's data
 */
export interface SubmissionWithUser extends SubmissionData {
	/**
	 * @prop {RESTGetAPIUserResult} user The user's data
	 */
	user: RESTGetAPIGuildMemberResult;
}

/**
 * @interface GuildEntry Represents the data entry for a guild
 */
export interface GuildEntry {
	/**
	 * @prop {ChallengeData[]} challenges The stored challenges for the guild
	 */
	challenges: ChallengeData[];
	/**
	 * @prop {[string, number][]} overallScores A map of Discord UIDs to their overall scores
	 */
	overallScores: OverallMemberScore[];
}

/**
 * @typedef {[string, number]} OverallMemberScore A map of Discord UIDs to their overall scores
 */
export type OverallMemberScore = [string, number];

/**
 * @typedef If A conditional type that returns a type based on a boolean
 */
export type If<
	Bool extends boolean,
	TrueResult,
	FalseResult = null
> = Bool extends true
	? TrueResult
	: Bool extends false
	? FalseResult
	: TrueResult | FalseResult;
