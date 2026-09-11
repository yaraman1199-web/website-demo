const { test, describe } = require("node:test");
const assert = require("node:assert");
const listHelper = require("../utils/list_helper");

describe("most blogs", () => {
  const blogs = [
    { author: "Robert C. Martin", title: "Test 1", likes: 2 },
    { author: "Robert C. Martin", title: "Test 2", likes: 5 },
    { author: "Edsger W. Dijkstra", title: "Test 3", likes: 12 },
    { author: "Robert C. Martin", title: "Test 4", likes: 3 },
  ];

  test("returns the author with the most blogs", () => {
    const result = listHelper.mostBlogs(blogs);
    assert.deepStrictEqual(result, {
      author: "Robert C. Martin",
      blogs: 3,
    });
  });
});

describe("most likes", () => {
  const blogs = [
    {
      author: "Edsger W. Dijkstra",
      title: "Canonical string reduction",
      likes: 12,
    },
    {
      author: "Edsger W. Dijkstra",
      title: "Go To Statement Considered Harmful",
      likes: 5,
    },
    { author: "Robert C. Martin", title: "Clean Code", likes: 2 },
  ];

  test("returns the author with the most total likes", () => {
    const result = listHelper.mostLikes(blogs);
    assert.deepStrictEqual(result, {
      author: "Edsger W. Dijkstra",
      likes: 17,
    });
  });
});
