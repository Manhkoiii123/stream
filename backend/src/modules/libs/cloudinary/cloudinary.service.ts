import { BadRequestException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary'
import sharp from 'sharp'

@Injectable()
export class CloudinaryService {
	public constructor(private readonly configService: ConfigService) {
		cloudinary.config({
			cloud_name: this.configService.getOrThrow<string>(
				'CLOUDINARY_CLOUD_NAME'
			),
			api_key:
				this.configService.getOrThrow<string>('CLOUDINARY_API_KEY'),
			api_secret: this.configService.getOrThrow<string>(
				'CLOUDINARY_API_SECRET'
			)
		})
	}

	public async uploadImage(
		file: Express.Multer.File,
		folder: string
	): Promise<UploadApiResponse> {
		if (!file.mimetype.startsWith('image/')) {
			throw new BadRequestException('Only image files are allowed')
		}

		const optimized = await sharp(file.buffer)
			.resize(512, 512, { fit: 'cover' })
			.webp({ quality: 80 })
			.toBuffer()

		return new Promise((resolve, reject) => {
			cloudinary.uploader
				.upload_stream(
					{
						folder,
						resource_type: 'image',
						format: 'webp'
					},
					(error, result) => {
						if (error || !result) {
							return reject(
								new BadRequestException(
									error?.message ?? 'Upload failed'
								)
							)
						}
						resolve(result)
					}
				)
				.end(optimized)
		})
	}

	public async deleteImage(publicId: string): Promise<void> {
		await cloudinary.uploader.destroy(publicId)
	}
}
