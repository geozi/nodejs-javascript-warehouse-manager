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
