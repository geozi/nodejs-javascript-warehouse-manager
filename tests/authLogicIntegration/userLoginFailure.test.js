const User = require("../../src/models/user.model");
const bcrypt = require("bcryptjs");
const { login } = require("../../src/auth/authController");
const authResponses = require("../../src/auth/authResponseMessages");
const validationErrorMessages = require("../../src/resources/validationErrorMessages");

describe("Failed login integration test(s)", () => {
  let req, res, next;

  const input = {
    username: "newUser",
    password: "W;Vj(+C8Sgqo'_4",
  };

  describe("bad request (400):", () => {
    beforeEach(() => {
      (res = { status: jest.fn().mockReturnThis(), json: jest.fn() }),
        (next = jest.fn());
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    const userNameRequiredCases = [
      ["username is undefined", undefined],
      ["username is null", null],
    ];

    userNameRequiredCases.forEach(([testName, invalidInput]) => {
      test(testName, async () => {
        let validInput = { ...input };
        req = { body: validInput };
        req.body.username = invalidInput;

        for (let middleware of login) {
          await middleware(req, res, next);
        }

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          errors: [{ message: validationErrorMessages.USERNAME_REQUIRED }],
        });
      });
    });

    const passwordRequiredCases = [
      ["password is undefined", undefined],
      ["password is null", null],
    ];

    passwordRequiredCases.forEach(([testName, invalidInput]) => {
      test(testName, async () => {
        let validInput = { ...input };
        req = { body: validInput };
        req.body.password = invalidInput;

        for (let middleware of login) {
          await middleware(req, res, next);
        }

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          errors: [
            { message: validationErrorMessages.PASSWORD_REQUIRED },
            { message: validationErrorMessages.PASSWORD_MIN_LENGTH },
            { message: validationErrorMessages.PASSWORD_MUST_HAVE_CHARACTERS },
          ],
        });
      });
    });

    const passwordInvalidCases = [
      ["password has no uppercase letters", "!]i&u^^.57h3.,%"],
      ["password has no lowercase letters", "+[Q]D~~A,9CGYZ~"],
      ["password has no numbers", "Q}_MC}mdguOs!Gr"],
      ["password has no special symbols", "EyB0McqoXAOYA1Y"],
    ];

    passwordInvalidCases.forEach(([testName, invalidInput]) => {
      test(testName, async () => {
        let validInput = { ...input };
        req = { body: validInput };
        req.body.password = invalidInput;

        for (let middleware of login) {
          await middleware(req, res, next);
        }

        expect(res.status).toHaveBeenCalledWith(400),
          expect(res.json).toHaveBeenCalledWith({
            errors: [
              {
                message: validationErrorMessages.PASSWORD_MUST_HAVE_CHARACTERS,
              },
            ],
          });
      });
    });

    test("password is too short", async () => {
      let validInput = { ...input };
      req = { body: validInput };
      req.body.password = "$b4'1A";

      for (let middleware of login) {
        await middleware(req, res, next);
      }

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        errors: [{ message: validationErrorMessages.PASSWORD_MIN_LENGTH }],
      });
    });

    test("with mix of undefined and null fields", async () => {
      let validInput = { ...input };
      req = { body: validInput };
      req.body.username = undefined;
      req.body.password = null;

      for (let middleware of login) {
        await middleware(req, res, next);
      }

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        errors: [
          { message: validationErrorMessages.USERNAME_REQUIRED },
          { message: validationErrorMessages.PASSWORD_REQUIRED },
          { message: validationErrorMessages.PASSWORD_MIN_LENGTH },
          { message: validationErrorMessages.PASSWORD_MUST_HAVE_CHARACTERS },
        ],
      });
    });

    test("with empty request body", async () => {
      req = { body: {} };
      for (let middleware of login) {
        await middleware(req, res, next);
      }

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        errors: [
          { message: validationErrorMessages.USERNAME_REQUIRED },
          { message: validationErrorMessages.PASSWORD_REQUIRED },
          { message: validationErrorMessages.PASSWORD_MIN_LENGTH },
          { message: validationErrorMessages.PASSWORD_MUST_HAVE_CHARACTERS },
        ],
      });
    });
  });

  describe("unauthorized (401)", () => {
    beforeEach(() => {
      res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      next = jest.fn();
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    test("user was not found", async () => {
      User.findOne = jest.fn().mockReturnValue(undefined);

      req = { body: input };

      for (let middleware of login) {
        await middleware(req, res, next);
      }

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: authResponses.AUTH_FAILED,
      });
    });

    test("password does not match", async () => {
      bcrypt.compare = jest.fn().mockReturnValue(false);

      req = {
        body: input,
      };

      for (let middleware of login) {
        await middleware(req, res, next);
      }

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: authResponses.AUTH_FAILED,
      });
    });
  });
});
