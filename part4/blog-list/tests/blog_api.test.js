const { test, after, beforeEach, describe } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const Blog = require("../models/blog");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const helper = require("./test_helper");

let token;

beforeEach(async () => {
  await Blog.deleteMany({});
  await User.deleteMany({});

  // 1. Create a test user for authentication
  const passwordHash = await bcrypt.hash("sekret", 10);
  const user = new User({
    username: "testuser",
    name: "Test User",
    passwordHash,
  });
  const savedUser = await user.save();

  // 2. Generate a token for the test user
  const userForToken = { username: savedUser.username, id: savedUser._id };
  token = jwt.sign(userForToken, process.env.SECRET);

  // 3. Seed initial blogs linked to this user
  let blogObjects = new Blog({
    ...helper.initialBlogs[0],
    user: savedUser._id,
  });
  await blogObjects.save();

  blogObjects = new Blog({
    ...helper.initialBlogs[1],
    user: savedUser._id,
  });
  await blogObjects.save();
});

test("blogs are returned as json and correct amount", async () => {
  const response = await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);

  assert.strictEqual(response.body.length, helper.initialBlogs.length);
});

describe("addition of a blog", () => {
  test("a valid blog can be added with a token", async () => {
    const newBlog = {
      title: "Async/await simplifies async code",
      author: "Full Stack Open",
      url: "https://fullstackopen.com/",
      likes: 10,
    };

    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`) // Attach token here
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const response = await api.get("/api/blogs");
    const titles = response.body.map((r) => r.title);

    assert.strictEqual(response.body.length, helper.initialBlogs.length + 1);
    assert.strictEqual(
      titles.includes("Async/await simplifies async code"),
      true,
    );
  });

  test("adding a blog fails with status 401 Unauthorized if token is not provided", async () => {
    const newBlog = {
      title: "Unauthorized blog post",
      author: "Hacker",
      url: "https://example.com/unauthorized",
      likes: 0,
    };

    await api
      .post("/api/blogs")
      // No token provided
      .send(newBlog)
      .expect(401);

    const response = await api.get("/api/blogs");
    assert.strictEqual(response.body.length, helper.initialBlogs.length);
  });

  test("blog without likes defaults to zero likes", async () => {
    const newBlog = {
      title: "Blog without likes count",
      author: "Test Author",
      url: "https://example.com/nolikes",
    };

    const response = await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    assert.strictEqual(response.body.likes, 0);
  });

  test("blog without title or url is not added", async () => {
    const newBlog = {
      author: "Missing Title and URL",
      likes: 3,
    };

    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(newBlog)
      .expect(400);

    const response = await api.get("/api/blogs");
    assert.strictEqual(response.body.length, helper.initialBlogs.length);
  });
});

describe("deletion of a blog", () => {
  test("succeeds with status code 204 if id is valid and user is creator", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[0];

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(204);

    const blogsAtEnd = await helper.blogsInDb();

    const ids = blogsAtEnd.map((b) => b.id);
    assert(!ids.includes(blogToDelete.id));

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1);
  });
});

describe("updating of a blog", () => {
  test("succeeds with status code 200 and updates likes", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToUpdate = blogsAtStart[0];

    const updatedBlogData = {
      ...blogToUpdate,
      likes: blogToUpdate.likes + 5,
    };

    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlogData)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    assert.strictEqual(response.body.likes, blogToUpdate.likes + 5);
  });
});

after(async () => {
  await mongoose.connection.close();
});
