import { describe, test, expect, beforeAll, afterAll } from "@jest/globals";
import request from "supertest";
import app from "../app.js";
import { sequelize } from "../db/sequelize.js";
import User from "../models/User.js";

describe("Test login controller", () => {
  const testUser = {
    email: "test_jest@example.com",
    password: "password123",
  };

  beforeAll(async () => {
    await sequelize.authenticate();
    await User.destroy({ where: { email: testUser.email } });
    await User.create(testUser);
  });

  afterAll(async () => {
    await User.destroy({ where: { email: testUser.email } });
    await sequelize.close();
  });

  test("Login should return 200, token and user object", async () => {
    const response = await request(app).post("/api/auth/login").send(testUser);

    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
    expect(typeof response.body.token).toBe("string");
    expect(response.body.user).toBeDefined();
    expect(response.body.user.email).toBe(testUser.email);
    expect(typeof response.body.user.email).toBe("string");
    expect(typeof response.body.user.subscription).toBe("string");
  });
});
