export type PostDbType = {
    id: string
    title: string // max 30
    shortDescription: string // max 100
    content: string // max 1000
    blogId: string // valid
    blogName: string
}