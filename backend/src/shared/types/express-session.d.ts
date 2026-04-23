import 'express-session'

import type { SessionMetadata } from './session-metadata.interface'

declare module 'express-session' {
	export interface SessionData {
		userId?: string
		createdAt?: Date | string
		metadata?: SessionMetadata
	}
}
