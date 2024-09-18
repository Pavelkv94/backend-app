// ...
 
export const postRepository = {
    async create(input: CreatePostType): Promise<{error?: string, id?: number}> {
        const newPost: PostDBType = {
            ...input,
            id: Date.now() + Math.random(),
            // ...
        }
 
        try {
            db.posts = [...db.posts, newPost]
        } catch (e) {
            // log
            return {error: e.message}
        }
 
        return {id: newPost.id}
    },
    async find(id: number): Promise<PostDBType> {
        return db.posts.find(p => p.id === id)
    },
    async findForOutput(id: number): Promise<null | PostOutputType> {
        const post = await this.find(id)
        if (!post) { return null }
        return this.mapToOutput(post)
 
    },
    mapToOutput(post: PostDBType): PostOutputType {
        return {
            id: post.id,
            title: post.title,
        }
    }
}