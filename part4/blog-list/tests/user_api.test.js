const { test, describe, beforeEach, afterAll } = require("node:test");
const assert = require("node:assert");

const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const User = require("../models/user");

describe("creating a new user", () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });
});

test("fails with proper statuscode and message if username is short", async () => {
  const newUser = {
    username: "ab",
    name: "Test User",
    password: "password123",
  };

  const result = await api
    .post("/api/users")
    .send(newUser)
    .expect(400)
    .expect("Content-Type", /application\/json/);

  assert(result.body.error).toContain(
    "username must be at least 3 characters long",
  );
});

test("fails if username is already taken", async () => {
  const newUser = {
    username: "rootuser",
    name: "Super User",
    password: "secretpassword",
  };
  await api.post("/api/users").send(newUser);

  const duplicateUser = {
    username: "rootuser",
    name: "Another User",
    password: "anotherpassword",
  };

  const result = await api
    .post("/api/users")
    .send(duplicateUser)
    .expect(400)
    .expect("Content-Type", /application\/json/);

  assert(result.body.error).toContain("username must be unique");
});

afterAll(async () => {
  await mongoose.connection.close();
});
