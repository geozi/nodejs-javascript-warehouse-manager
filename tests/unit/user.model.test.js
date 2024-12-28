/**
 * User model unit tests.
 *
 * Random passwords are generated at:
 * @link https://www.avast.com/random-password-generator#pc
 */

const User = require("../../src/models/user.model");
const mockingoose = require("mockingoose");
const validationErrorMessages = require("../../src/resources/validationErrorMessages");

describe("User model unit tests", () => {
  describe("new user test", () => {
    const validUsername = "newUser";
    const validEmail = "random@mail.com";
    const validPassword = "W;Vj(+C8Sgqo'_4";
    const validRole = "customer";

    beforeAll(() => {
      mockingoose.resetAll();
    });
    test("with valid fields", () => {
      const newUser = new User({
        username: validUsername,
        email: validEmail,
        password: validPassword,
        role: validRole,
      });

      const err = newUser.validateSync();

      expect(err).toBeUndefined();
    });

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

    usernameRequiredCases.forEach(([testName, input]) => {
      test(testName, () => {
        const newUser = new User(input);
        const err = newUser.validateSync();

        expect(err.errors.username).toBeDefined();
        expect(err.errors.username.message).toBe(
          validationErrorMessages.USERNAME_REQUIRED
        );
      });
    });

    test("with too short username", () => {
      const newUser = new User({
        username: "ab",
        email: validEmail,
        password: validPassword,
        role: validRole,
      });
      const err = newUser.validateSync();

      expect(err.errors.username).toBeDefined();
      expect(err.errors.username.message).toBe(
        validationErrorMessages.USERNAME_MIN_LENGTH
      );
    });

    test("with too long username", () => {
      const newUser = new User({
        username: "thisIsAVeryLongUsername",
        email: validEmail,
        password: validPassword,
        role: validRole,
      });

      const err = newUser.validateSync();

      expect(err.errors.username).toBeDefined();
      expect(err.errors.username.message).toBe(
        validationErrorMessages.USERNAME_MAX_LENGTH
      );
    });

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
      test(testName, () => {
        const newUser = new User(input);

        const err = newUser.validateSync();

        expect(err.errors.email).toBeDefined();
        expect(err.errors.email.message).toBe(
          validationErrorMessages.EMAIL_REQUIRED
        );
      });
    });

    const emailInvalidCases = [
      [
        "with invalid email: no prefix",
        {
          username: validUsername,
          email: "@mail.com",
          password: validPassword,
          role: validRole,
        },
      ],
      [
        "with invalid email: no @",
        {
          username: validUsername,
          email: "randommail.com",
          password: validPassword,
          role: validRole,
        },
      ],
      [
        "with invalid email: no domain name",
        {
          username: validUsername,
          email: "random@.com",
          password: validPassword,
          role: validRole,
        },
      ],
      [
        "with invalid email: no .",
        {
          username: validUsername,
          email: "random@mailcom",
          password: validPassword,
          role: validRole,
        },
      ],
      [
        "with invalid email: no top level domain",
        {
          username: validUsername,
          email: "random@mail.",
          password: validPassword,
          role: validRole,
        },
      ],
    ];

    emailInvalidCases.forEach(([testName, input]) => {
      test(testName, () => {
        const newUser = new User(input);
        const err = newUser.validateSync();

        expect(err.errors.email).toBeDefined();
        expect(err.errors.email.message).toBe(
          validationErrorMessages.EMAIL_INVALID
        );
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
      test(testName, () => {
        const newUser = new User(input);
        const err = newUser.validateSync();

        expect(err.errors.password).toBeDefined();
        expect(err.errors.password.message).toBe(
          validationErrorMessages.PASSWORD_REQUIRED
        );
      });
    });

    const roleRequiredCases = [
      [
        "with role undefined",
        {
          username: validUsername,
          email: validEmail,
          password: validPassword,
          role: undefined,
        },
      ],
      [
        "with role null",
        {
          username: validUsername,
          email: validEmail,
          password: validPassword,
          role: null,
        },
      ],
    ];

    roleRequiredCases.forEach(([testName, input]) => {
      test(testName, () => {
        const newUser = new User(input);
        const err = newUser.validateSync();

        expect(err.errors.role).toBeDefined();
        expect(err.errors.role.message).toBe(
          validationErrorMessages.ROLE_REQUIRED
        );
      });
    });

    test("with invalid role", () => {
      const newUser = new User({
        username: validUsername,
        email: validEmail,
        password: validPassword,
        role: "consumer",
      });

      const err = newUser.validateSync();

      expect(err.errors.role).toBeDefined();
      expect(err.errors.role.message).toBe(
        validationErrorMessages.ROLE_INVALID
      );
    });

    test("with no fields", () => {
      const newUser = new User();
      const err = newUser.validateSync();

      expect(Object.keys(err.errors)).toHaveLength(4);
      expect(Object.keys(err.errors).sort()).toStrictEqual([
        "email",
        "password",
        "role",
        "username",
      ]);
      expect(err.errors.username.message).toBe(
        validationErrorMessages.USERNAME_REQUIRED
      );
      expect(err.errors.email.message).toBe(
        validationErrorMessages.EMAIL_REQUIRED
      );
      expect(err.errors.password.message).toBe(
        validationErrorMessages.PASSWORD_REQUIRED
      );
      expect(err.errors.role.message).toBe(
        validationErrorMessages.ROLE_REQUIRED
      );
    });

    test("with 2 undefined fields", () => {
      const newUser = new User({
        username: undefined,
        email: undefined,
        password: validPassword,
        role: validRole,
      });

      const err = newUser.validateSync();

      expect(Object.keys(err.errors)).toHaveLength(2);
      expect(Object.keys(err.errors).sort()).toStrictEqual([
        "email",
        "username",
      ]);
      expect(err.errors.username.message).toBe(
        validationErrorMessages.USERNAME_REQUIRED
      );
      expect(err.errors.email.message).toBe(
        validationErrorMessages.EMAIL_REQUIRED
      );
    });

    test("with 2 null fields", () => {
      const newUser = new User({
        username: validUsername,
        email: null,
        password: validPassword,
        role: null,
      });

      const err = newUser.validateSync();

      expect(Object.keys(err.errors)).toHaveLength(2);
      expect(Object.keys(err.errors).sort()).toStrictEqual(["email", "role"]);
      expect(err.errors.email.message).toBe(
        validationErrorMessages.EMAIL_REQUIRED
      );
      expect(err.errors.role.message).toBe(
        validationErrorMessages.ROLE_REQUIRED
      );
    });

    test("with mix null and undefined fields", () => {
      const newUser = new User({
        username: undefined,
        email: null,
        password: validPassword,
        role: null,
      });

      const err = newUser.validateSync();

      expect(Object.keys(err.errors)).toHaveLength(3);
      expect(Object.keys(err.errors).sort()).toStrictEqual([
        "email",
        "role",
        "username",
      ]);
      expect(err.errors.email.message).toBe(
        validationErrorMessages.EMAIL_REQUIRED
      );
      expect(err.errors.role.message).toBe(
        validationErrorMessages.ROLE_REQUIRED
      );
      expect(err.errors.username.message).toBe(
        validationErrorMessages.USERNAME_REQUIRED
      );
    });

    test("with mix undefined and invalid fields", () => {
      const newUser = new User({
        username: "ab",
        email: undefined,
        password: validPassword,
        role: validRole,
      });

      const err = newUser.validateSync();

      expect(Object.keys(err.errors)).toHaveLength(2);
      expect(Object.keys(err.errors).sort()).toStrictEqual([
        "email",
        "username",
      ]);
      expect(err.errors.email.message).toBe(
        validationErrorMessages.EMAIL_REQUIRED
      );
      expect(err.errors.username.message).toBe(
        validationErrorMessages.USERNAME_MIN_LENGTH
      );
    });
  });
});
