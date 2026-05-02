import { getCurrentLanguage } from '@/libs/i18n/language'
import { getRequestConfig } from 'next-intl/server'

export default getRequestConfig(async () => {
	const languge = await getCurrentLanguage()
	return {
		locale: languge || 'vi',
		messages: await import(
			`../../../public/languages/${languge || 'vi'}.json`
		).then(mod => mod.default)
	}
})
