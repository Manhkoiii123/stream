/* eslint-disable @typescript-eslint/no-unused-vars */
import {
	ArgumentMetadata,
	BadRequestException,
	Injectable,
	PipeTransform
} from '@nestjs/common'
import { ReadStream } from 'fs'

import {
	validateFileFormat,
	validateFileSize
} from '@/src/shared/utils/file.utils'

@Injectable()
export class FileValidationPipe implements PipeTransform {
	public async transform(value: any, metadata: ArgumentMetadata) {
		if (!value.filename) {
			throw new BadRequestException('No file provided')
		}

		const { filename, createReadStream } = value

		const fileStream = createReadStream() as ReadStream

		const allowedFormats = ['jpg', 'jpeg', 'png', 'webp', 'gif']
		const isFileFormatValid = validateFileFormat(filename, allowedFormats)

		if (!isFileFormatValid) {
			throw new BadRequestException(
				`Invalid file format. Allowed formats: ${allowedFormats.join(', ')}`
			)
		}
		const isFileSizeValid = await validateFileSize(
			fileStream,
			10 * 1024 * 1024
		)
		if (!isFileSizeValid) {
			throw new BadRequestException(
				'File size exceeds the maximum limit of 10MB'
			)
		}
		return value
	}
}
