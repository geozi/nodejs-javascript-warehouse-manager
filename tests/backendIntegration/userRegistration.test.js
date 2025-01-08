const bcrypt = require("bcryptjs");
const User = require("../../src/models/user.model");
const { create } = require("../../src/controllers/user.controller");
const responseMessages = require("../../src/resources/responseMessages");
const validationErrorMessages = require("../../src/resources/validationErrorMessages");

describe("User reg. integration tests", () => {
  let req, res, next;

  const input = {
    username: "newUser",
    email: "myEmail@example.com",
    password: "lj}6L6H$=0(UgI&",
    role: "customer",
  };

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
      let validInput = { ...input };
      req = { body: validInput };

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
      ["with undefined username", undefined],
      ["with null username", null],
    ];

    usernameRequiredCases.forEach(([testName, invalidInput]) => [
      test(testName, async () => {
        let validInput = { ...input };
        req = { body: validInput };
        req.body.username = invalidInput;

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
      ["with undefined email", undefined],
      ["with null email", null],
    ];

    emailRequiredCases.forEach(([testName, invalidInput]) => {
      test(testName, async () => {
        let validInput = { ...input };
        req = { body: validInput };
        req.body.email = invalidInput;

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
      ["with undefined password", undefined],
      ["with null password", null],
    ];

    passwordRequiredCases.forEach(([testName, invalidInput]) => {
      test(testName, async () => {
        let validInput = { ...input };
        req = { body: validInput };
        req.body.password = invalidInput;

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
      ["with undefined role", undefined],
      ["with null role", null],
    ];

    roleRequiredCases.forEach(([testName, invalidInput]) => {
      test(testName, async () => {
        let validInput = { ...input };
        req = { body: validInput };
        req.body.role = invalidInput;

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
      let validInput = { ...input };
      req = { body: validInput };
      req.body.username = undefined;
      req.body.email = undefined;

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
      let validInput = { ...input };
      req = { body: validInput };
      req.body.username = null;
      req.body.password = null;

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
      req = { body: {} };

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
