import {Request, Response} from 'express'
import {BlogInputModel} from '../../../input-output-types/blogs-types'
import {blogsRepository} from '../blogs.repository'

export const putBlogController = (req: Request<{id: string}, any, BlogInputModel>, res: Response) => {

}