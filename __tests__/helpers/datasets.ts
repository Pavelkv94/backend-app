// готовые данные для переиспользования в тестах

import { BlogDbType } from "../../src/db/blog-db-type";
import { DBType } from "../../src/db/db";
import { Resolutions, VideoDBType } from "../../src/db/video-db-type";
import {fromUTF8ToBase64} from '../../src/global-middlewares/admin-middleware'
import { SETTINGS } from "../../src/settings";

// готовые данные для переиспользования в тестах

export const codedAuth = fromUTF8ToBase64(SETTINGS.ADMIN)

export const createString = (length: number) => {
    let s = ''
    for (let x = 1; x <= length; x++) {
        s += x % 10
    }
    return s
}

export const video1: VideoDBType = {
  id: Date.now() + Math.random(),
  title: "t" + Date.now() + Math.random(),
  author: "a" + Date.now() + Math.random(),
  canBeDownloaded: true,
  minAgeRestriction: null,
  createdAt: new Date().toISOString(),
  publicationDate: new Date().toISOString(),
  availableResolutions: [Resolutions.P240],
} as const;

export const blog1 /*: BlogDbType*/ = {
  id: new Date().toISOString() + Math.random(),
  name: "n1",
  description: "d1",
  websiteUrl: "http://some.com",
} as const; // dataset нельзя изменять

export const post1 /*: PostDbType*/ = {
  id: new Date().toISOString() + Math.random(),
  title: "t1",
  content: "c1",
  shortDescription: "s1",
  blogId: blog1.id,
  blogName: "n1",
} as const; // dataset нельзя изменять

export const blog7: BlogDbType = {
  id: new Date().toISOString() + Math.random(),
  name: "n7",
  description: "d7",
  websiteUrl: "http://some7.com",
} as const; // dataset нельзя изменять

export const dataset1: DBType = {
  videos: [video1],
  blogs: [blog1],
  posts: [],
} as const; // dataset нельзя изменять

export const dataset2 /*: DBType*/ = {
  videos: [video1],
  blogs: [blog1, blog7],
  posts: [post1],
} as const; // dataset нельзя изменять


// dataset2.blogs = [] // error!!!
// dataset2.blogs.push(blog1) // runtime error!!!
// dataset2.blogs[0].name = 'n3' // error!!!

// ...
