import { ReadStream } from 'fs'

export function validateFileFormat(filename: string, allowedFormats: string[]) {
	const fileParts = filename.split('.')
	const extension = fileParts[fileParts.length - 1].toLowerCase()
	return allowedFormats.includes(extension)
}
export async function validateFileSize(
	fileStream: ReadStream,
	maxSize: number
) {
	return new Promise((resolve, reject) => {
		let filesizeInBytes = 0
		fileStream
			.on('data', (data: Buffer) => {
				filesizeInBytes = data.byteLength
			})
			.on('end', () => {
				resolve(filesizeInBytes <= maxSize)
			})
			.on('error', (err) => {
				reject(err)
			})
	})
}
