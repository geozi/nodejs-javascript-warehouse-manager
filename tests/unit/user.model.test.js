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
    const validInput = {
      username: "newUser",
      email: "random@mail.com",
      password: "W;Vj(+C8Sgqo'_4",
      role: "customer",
    };

    beforeAll(() => {
      mockingoose(User);
    });

    afterAll(() => {
      mockingoose.resetAll();
    });

    test("with valid fields", () => {
      const newUser = new User(validInput);
      const err = newUser.validateSync();

      expect(err).toBeUndefined();
    });

    test("with too short username", () => {
      const newUser = new User(validInput);
      newUser.username = "ab";
      const err = newUser.validateSync();

      expect(err.errors.username).toBeDefined();
      expect(err.errors.username.message).toBe(
        validationErrorMessages.USERNAME_MIN_LENGTH
      );
    });

    test("with too long username", () => {
      const newUser = new User(validInput);
      newUser.username = "thisIsAVeryLongUsername";
      const err = newUser.validateSync();

      expect(err.errors.username).toBeDefined();
      expect(err.errors.username.message).toBe(
        validationErrorMessages.USERNAME_MAX_LENGTH
      );
    });

    const emailInvalidCases = [
      ["with invalid email: no prefix", "@mail.com"],
      ["with invalid email: no @", "randommail.com"],
      ["with invalid email: no domain name", "random@.com"],
      ["with invalid email: no .", "random@mailcom"],
      ["with invalid email: no top level domain", "random@mail."],
    ];

    emailInvalidCases.forEach(([testName, invalidInput]) => {
      test(testName, () => {
        const newUser = new User(validInput);
        newUser.email = invalidInput;
        const err = newUser.validateSync();

        expect(err.errors.email).toBeDefined();
        expect(err.errors.email.message).toBe(
          validationErrorMessages.EMAIL_INVALID
        );
      });
    });

    test("with invalid role", () => {
      const newUser = new User(validInput);
      newUser.role = "consumer";
      const err = newUser.validateSync();

      expect(err.errors.role).toBeDefined();
      expect(err.errors.role.message).toBe(
        validationErrorMessages.ROLE_INVALID
      );
    });

    test("with mix undefined and invalid fields", () => {
      const newUser = new User(validInput);
      newUser.username = "ab";
      newUser.email = undefined;
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
