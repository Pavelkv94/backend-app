import {Response, Request} from 'express'
import {BlogInputModel, BlogViewModel} from '../../../input-output-types/blogs-types'
import {blogsRepository} from '../blogsRepository'

export const createBlogController = (req: Request<any, any, BlogInputModel>, res: Response<BlogViewModel>) => {
    const newBlogId = blogsRepository.create(req.body)
    const newBlog = blogsRepository.findAndMap(newBlogId)

    res
        .status(201)
        .json(newBlog)
}