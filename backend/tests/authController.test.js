const authController = require("../controllers/authController");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

jest.mock("../models/User");
jest.mock("bcryptjs");

describe("authController.signup", () => {
  it("should create a user and return token", async () => {
    const req = { body: { name: "A", email: "a@a.com", password: "pass" } };

    User.findOne.mockResolvedValue(null);
    bcrypt.hash.mockResolvedValue("hashed");
    User.create.mockResolvedValue({ _id: "uid" });

    const json = jest.fn();
    const status = jest.fn(() => ({ json }));

    await authController.signup(req, { status });

    expect(User.findOne).toHaveBeenCalledWith({ email: "a@a.com" });
    expect(User.create).toHaveBeenCalled();
    expect(status).toHaveBeenCalledWith(201);
    expect(json).toHaveBeenCalled();
  });
});

describe("authController.login", () => {
  it("should return token on valid credentials", async () => {
    const req = { body: { email: "a@a.com", password: "pass" } };

    User.findOne.mockResolvedValue({ password: "hashed" });
    bcrypt.compare.mockResolvedValue(true);

    const json = jest.fn();
    const status = jest.fn(() => ({ json }));

    await authController.login(req, { status });

    expect(User.findOne).toHaveBeenCalledWith({ email: "a@a.com" });
    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalled();
  });
});
