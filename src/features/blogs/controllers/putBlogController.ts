import {Request, Response} from 'express'
import {BlogInputModel} from '../../../input-output-types/blogs-types'
import {blogsRepository} from '../blogsRepository'

export const putBlogController = (req: Request<{id: string}, any, BlogInputModel>, res: Response) => {

}