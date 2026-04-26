import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { RedisStore } from 'connect-redis'
import * as cookieParser from 'cookie-parser'
import * as session from 'express-session'
import * as graphqlUpload from 'graphql-upload/graphqlUploadExpress.js'

import { CoreModule } from './core/core.module'
import { RedisService } from './core/redis/redis.service'
import { ms, StringValue } from './shared/utils/ms.utils'
import { parseBoolean } from './shared/utils/parse-boolean.utils'

async function bootstrap() {
	const app = await NestFactory.create(CoreModule)
	const config = app.get(ConfigService)
	const redis = app.get(RedisService)

	app.use(cookieParser(config.getOrThrow<string>('COOKIES_SECRET')))
	app.useGlobalPipes(
		new ValidationPipe({
			transform: true
		})
	)
	app.use(
		session({
			secret: config.getOrThrow<string>('SESSION_SECRET'),
			name: config.getOrThrow<string>('SESSION_NAME'),
			resave: false,
			saveUninitialized: false,
			cookie: {
				domain: config.getOrThrow<string>('SESSION_DOMAIN'),
				maxAge: ms(config.getOrThrow<StringValue>('SESSION_MAX_AGE')),
				httpOnly: parseBoolean(
					config.getOrThrow<string>('SESSION_HTTP_ONLY')
				),
				secure: parseBoolean(
					config.getOrThrow<string>('SESSION_SECURE')
				),
				sameSite: 'lax'
			},
			store: new RedisStore({
				client: {
					get: (key: string) => redis.get(key),
					set: (
						key: string,
						value: string,
						opts?: { EX?: number; PX?: number }
					) => {
						if (opts?.EX)
							return redis.set(key, value, 'EX', opts.EX)
						if (opts?.PX)
							return redis.set(key, value, 'PX', opts.PX)
						return redis.set(key, value)
					},
					expire: (key: string, ttl: number) =>
						redis.expire(key, ttl),
					del: (key: string) => redis.del(key),
					mget: (...keys: string[]) => redis.mget(...keys)
				} as any,
				prefix: config.getOrThrow<string>('SESSION_FOLDER')
			})
		})
	)
	app.use(config.getOrThrow<string>('GRAPHQL_PREFIX'), graphqlUpload())
	app.enableCors({
		origin: config.getOrThrow<string>('ALLOWED_ORIGIN'),
		credentials: true,
		exposedHeaders: ['Set-Cookie']
	})
	await app.listen(config.get<number>('APPLICATION_PORT') ?? 3000)
}
bootstrap()
