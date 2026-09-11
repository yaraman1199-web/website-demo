const Blog = require("../models/blog");

const initialBlogs = [
  {
    title: "Html is easy",
    author: "John Doe",
    url: "http://example.com/html",
    likes: 5,
  },
  {
    title: "Node.js and Express",
    author: "Jane Doe",
    url: "http://example.com/nodejs",
    likes: 12,
  },
];

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

module.exports = {
  initialBlogs,
  blogsInDb,
};
