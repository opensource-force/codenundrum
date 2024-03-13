/**
 * @interface ChallengeData Represents a challenge
 */
export interface ChallengeData {
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
	 * @prop {string} userId The Discord UID of the user who submitted the challenge
	 */
	userId: string;
	/**
	 * @prop {string} link The link to the submission
	 */
	link: string;
	/**
	 * @prop {number | undefined} score The score of the submission, or undefined if it has not been scored
	 */
	score: number | undefined;
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
