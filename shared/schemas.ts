import { Snowflake } from 'discord.js';

/**
 * @interface ChallengeData Represents a challenge
 */
export interface ChallengeData {
	/**
	 * @prop {Snowflake} id The ID of the challenge
	 */
	id: Snowflake;
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
	 * @prop {string} channelId The ID of the channel where the challenge is
	 */
	submissions: SubmissionData[];
	/**
	 * @prop {number} maxScore The maximum score of the challenge
	 */
	maxScore: number;
}

/**
 * @interface SubmissionData Represents a submission to a challenge
 */
export interface SubmissionData {
	/**
	 * @prop {Snowflake} userId The Discord ID of the user who submitted the challenge
	 */
	userId: Snowflake;
	/**
	 * @prop {string} link The link to the submission
	 */
	link: string;
	/**
	 * @prop {number | undefined} score The score of the submission, or undefined if it has not been scored
	 */
	score: number | undefined;
}
