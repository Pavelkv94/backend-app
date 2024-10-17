export const SETTINGS = {
  PATH: {
    BLOGS: "/blogs",
    POSTS: "/posts",
    TESTING: "/testing",
    USERS: "/users",
    AUTH: "/auth",
  },
  ADMIN: process.env.ADMIN || "admin:qwerty",
  JWT_SECRET_KEY: process.env.SECRET_JWT_KEY || "secret"
};
