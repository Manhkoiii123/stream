'use server'

import { COOKIE_NAME, defaultLanguage, Language } from '@/libs/i18n/config'
import { cookies } from 'next/headers'

export async function getCurrentLanguage() {
	const cookieStore = await cookies()
	const language = cookieStore.get(COOKIE_NAME)?.value
	return language
}

export async function setLanguage(language: Language) {
	const cookieStore = await cookies()
	return cookieStore.set(COOKIE_NAME, language)
}
