const User = require("../../src/models/user.model");
const bcrypt = require("bcryptjs");
const { login } = require("../../src/auth/authController");
const authResponses = require("../../src/auth/authResponseMessages");
const validationErrorMessages = require("../../src/resources/validationErrorMessages");

describe("Failed login integration test(s)", () => {
  let req, res, next;

  const validUsername = "newUser";
  const validPassword = "W;Vj(+C8Sgqo'_4";

  describe("bad request (400):", () => {
    beforeEach(() => {
      (res = { status: jest.fn().mockReturnThis(), json: jest.fn() }),
        (next = jest.fn());
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    const userNameRequiredCases = [
      [
        "username is undefined",
        {
          username: undefined,
          password: validPassword,
        },
      ],
      [
        "username is null",
        {
          username: null,
          password: validPassword,
        },
      ],
    ];

    userNameRequiredCases.forEach(([testName, input]) => {
      test(testName, async () => {
        req = { body: input };

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
      [
        "password is undefined",
        {
          username: validUsername,
          password: undefined,
        },
      ],
      [
        "password is null",
        {
          username: validUsername,
          password: null,
        },
      ],
    ];

    passwordRequiredCases.forEach(([testName, input]) => {
      test(testName, async () => {
        req = { body: input };

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
      [
        "password has no uppercase letters",
        {
          username: validUsername,
          password: "!]i&u^^.57h3.,%",
        },
      ],
      [
        "password has no lowercase letters",
        {
          username: validUsername,
          password: "+[Q]D~~A,9CGYZ~",
        },
      ],
      [
        "password has no numbers",
        {
          username: validUsername,
          password: "Q}_MC}mdguOs!Gr",
        },
      ],
      [
        "password has no special symbols",
        {
          username: validUsername,
          password: "EyB0McqoXAOYA1Y",
        },
      ],
    ];

    passwordInvalidCases.forEach(([testName, input]) => {
      test(testName, async () => {
        req = { body: input };

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
      req = {
        body: {
          username: validUsername,
          password: "$b4'1A",
        },
      };

      for (let middleware of login) {
        await middleware(req, res, next);
      }

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        errors: [{ message: validationErrorMessages.PASSWORD_MIN_LENGTH }],
      });
    });

    test("with mix of undefined and null fields", async () => {
      req = {
        body: {
          username: undefined,
          password: null,
        },
      };

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

      req = {
        body: {
          username: validUsername,
          password: validPassword,
        },
      };

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
        body: {
          username: validUsername,
          password: validPassword,
        },
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
