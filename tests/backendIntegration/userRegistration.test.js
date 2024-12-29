const bcrypt = require("bcryptjs");
const User = require("../../src/models/user.model");
const { create } = require("../../src/controllers/user.controller");
const responseMessages = require("../../src/resources/responseMessages");
const validationErrorMessages = require("../../src/resources/validationErrorMessages");

describe("User reg. integration tests", () => {
  let req, res, next;
  const validUsername = "newUser";
  const validEmail = "myEmail@example.com";
  const validPassword = "lj}6L6H$=0(UgI&";
  const validRole = "customer";

  beforeEach(() => {
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
    User.prototype.save = jest.fn().mockResolvedValue({});
    bcrypt.hash = jest.fn().mockResolvedValue("hashedPassword");
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("created (201)", () => {
    test("with valid fields", async () => {
      req = {
        body: {
          username: validUsername,
          email: validEmail,
          password: validPassword,
          role: validRole,
        },
      };
      for (let middleware of create) {
        await middleware(req, res, next);
      }
      expect(bcrypt.hash).toHaveBeenCalledWith("lj}6L6H$=0(UgI&", 10);
      expect(User.prototype.save.mock.calls).toHaveLength(1);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: responseMessages.USER_REGISTERED,
      });
    });
  });

  describe("bad request (400)", () => {
    const usernameRequiredCases = [
      [
        "with undefined username",
        {
          username: undefined,
          email: validEmail,
          password: validPassword,
          role: validRole,
        },
      ],
      [
        "with null username",
        {
          username: null,
          email: validEmail,
          password: validPassword,
          role: validRole,
        },
      ],
    ];

    usernameRequiredCases.forEach(([testName, input]) => [
      test(testName, async () => {
        req = { body: input };

        for (let middleware of create) {
          await middleware(req, res, next);
        }

        expect(User.prototype.save).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          errors: [{ message: validationErrorMessages.USERNAME_REQUIRED }],
        });
      }),
    ]);

    const emailRequiredCases = [
      [
        "with undefined email",
        {
          username: validUsername,
          email: undefined,
          password: validPassword,
          role: validRole,
        },
      ],
      [
        "with null email",
        {
          username: validUsername,
          email: null,
          password: validPassword,
          role: validRole,
        },
      ],
    ];

    emailRequiredCases.forEach(([testName, input]) => {
      test(testName, async () => {
        req = { body: input };

        for (let middleware of create) {
          await middleware(req, res, next);
        }

        expect(User.prototype.save).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          errors: [{ message: validationErrorMessages.EMAIL_REQUIRED }],
        });
      });
    });

    const passwordRequiredCases = [
      [
        "with undefined password",
        {
          username: validUsername,
          email: validEmail,
          password: undefined,
          role: validRole,
        },
      ],
      [
        "with null password",
        {
          username: validUsername,
          email: validEmail,
          password: null,
          role: validRole,
        },
      ],
    ];

    passwordRequiredCases.forEach(([testName, input]) => {
      test(testName, async () => {
        req = { body: input };

        for (let middleware of create) {
          await middleware(req, res, next);
        }

        expect(User.prototype.save).not.toHaveBeenCalled();
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

    const roleRequiredCases = [
      [
        "with undefined role",
        {
          username: validUsername,
          email: validEmail,
          password: validPassword,
          role: undefined,
        },
      ],
      [
        "with null role",
        {
          username: validUsername,
          email: validEmail,
          password: validPassword,
          role: null,
        },
      ],
    ];

    roleRequiredCases.forEach(([testName, input]) => {
      test(testName, async () => {
        req = { body: input };

        for (let middleware of create) {
          await middleware(req, res, next);
        }

        expect(User.prototype.save).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          errors: [{ message: validationErrorMessages.ROLE_REQUIRED }],
        });
      });
    });

    test("with 2 undefined fields", async () => {
      req = {
        body: {
          username: undefined,
          email: undefined,
          password: validPassword,
          role: validRole,
        },
      };

      for (let middleware of create) {
        await middleware(req, res, next);
      }

      expect(User.prototype.save).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenLastCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        errors: [
          { message: validationErrorMessages.USERNAME_REQUIRED },
          { message: validationErrorMessages.EMAIL_REQUIRED },
        ],
      });
    });

    test("with 2 null fields", async () => {
      req = {
        body: {
          username: null,
          email: validEmail,
          password: null,
          role: validRole,
        },
      };

      for (let middleware of create) {
        await middleware(req, res, next);
      }

      expect(User.prototype.save).not.toHaveBeenCalled();
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

    test("with empty request", async () => {
      req = {
        body: {},
      };

      for (let middleware of create) {
        await middleware(req, res, next);
      }

      expect(User.prototype.save).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        errors: [
          { message: validationErrorMessages.USERNAME_REQUIRED },
          { message: validationErrorMessages.EMAIL_REQUIRED },
          { message: validationErrorMessages.PASSWORD_REQUIRED },
          { message: validationErrorMessages.PASSWORD_MIN_LENGTH },
          { message: validationErrorMessages.PASSWORD_MUST_HAVE_CHARACTERS },
          { message: validationErrorMessages.ROLE_REQUIRED },
        ],
      });
    });
  });
});
