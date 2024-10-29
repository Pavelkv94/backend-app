export const SETTINGS = {
  PATH: {
    BLOGS: "/blogs",
    POSTS: "/posts",
    TESTING: "/testing",
    USERS: "/users",
    AUTH: "/auth",
    COMMENTS: "/comments",
  },
  ADMIN: process.env.ADMIN || "admin:qwerty",
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || "access secret",
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || "refresh secret",
};
