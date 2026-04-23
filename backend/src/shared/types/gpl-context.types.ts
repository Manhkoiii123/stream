import { Request, Response } from 'express'

export interface GplContext {
	req: Request
	res: Response
}
