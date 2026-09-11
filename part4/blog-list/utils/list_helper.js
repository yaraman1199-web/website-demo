const _ = require("lodash");

// Returns 1 as a placeholder to verify that the testing environment works properly
const dummy = () => {
  return 1;
};

// Calculates the total sum of likes across all blog posts in the array
const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0);
};

// Finds and returns the blog post with the highest number of likes
const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null;

  return blogs.reduce((prev, current) =>
    prev.likes > current.likes ? prev : current,
  );
};

// Returns the author with the largest amount of blogs and their blog count
const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null;

  const authorCounts = _.countBy(blogs, "author");
  let topAuthor = null;
  let maxBlogs = 0;

  for (const [author, count] of Object.entries(authorCounts)) {
    if (count > maxBlogs) {
      maxBlogs = count;
      topAuthor = author;
    }
  }

  return {
    author: topAuthor,
    blogs: maxBlogs,
  };
};

// Returns the author whose blog posts have the highest total number of likes
const mostLikes = (blogs) => {
  if (blogs.length === 0) return null;

  const groupedByAuthor = _.groupBy(blogs, "author");
  let topAuthor = null;
  let maxLikes = -1;

  for (const [author, authorBlogs] of Object.entries(groupedByAuthor)) {
    const totalAuthorLikes = authorBlogs.reduce(
      (sum, blog) => sum + blog.likes,
      0,
    );

    if (totalAuthorLikes > maxLikes) {
      maxLikes = totalAuthorLikes;
      topAuthor = author;
    }
  }

  return {
    author: topAuthor,
    likes: maxLikes,
  };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
