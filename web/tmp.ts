import 'dotenv/config';

import { kv } from '@vercel/kv';
import { GuildEntry } from '../shared/schemas';

kv.set('913584348937207839', {
	challenges: [
		{
			description: 'A challenge to test the system',
			id: '1',
			isActive: true,
			maxScore: 100,
			name: 'Test Challenge',
			submissions: [
				{
					link: 'https://example.com',
					score: 100,
					userId: '817214551740776479'
				}
			]
		}
	],
	overallScores: [['817214551740776479', 100]]
} satisfies GuildEntry);
