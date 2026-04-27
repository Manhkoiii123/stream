import { Controller } from '@nestjs/common'

import { LivekitService } from './livekit.service'

@Controller('livekit')
export class LivekitController {
	constructor(private readonly livekitService: LivekitService) {}
}
