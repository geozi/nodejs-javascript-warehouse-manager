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

    beforeAll(() => {
      mockingoose.resetAll();
    });
    test("with valid fields", () => {
      const newUser = new User({
        username: validUsername,
        email: validEmail,
        password: validPassword,
      });

      const err = newUser.validateSync();

      expect(err).toBeUndefined();
    });

    const usernameRequiredCases = [
      [
        "with undefined username",
        {
          email: validEmail,
          password: validPassword,
        },
      ],
      [
        "with null username",
        {
          username: null,
          email: validEmail,
          password: validPassword,
        },
      ],
    ];

    usernameRequiredCases.forEach(([testName, input]) => {
      test(testName, () => {
        const newUser = new User(input);
        const err = newUser.validateSync();

        expect(err).toBeDefined();
        expect(err.errors).toBeDefined();
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
      });
      const err = newUser.validateSync();
      expect(err).toBeDefined();
      expect(err.errors).toBeDefined();
      expect(err.errors.username.message).toBe(
        validationErrorMessages.USERNAME_MIN_LENGTH
      );
    });

    test("with too long username", () => {
      const newUser = new User({
        username: "thisIsAVeryLongUsername",
        email: validEmail,
        password: validPassword,
      });

      const err = newUser.validateSync();
      expect(err).toBeDefined();
      expect(err.errors).toBeDefined();
      expect(err.errors.username.message).toBe(
        validationErrorMessages.USERNAME_MAX_LENGTH
      );
    });

    const emailRequiredCases = [
      [
        "with undefined email",
        {
          username: validUsername,
          password: validPassword,
        },
      ],
      [
        "with null email",
        {
          username: validUsername,
          email: null,
          password: validPassword,
        },
      ],
    ];

    emailRequiredCases.forEach(([testName, input]) => {
      test(testName, () => {
        const newUser = new User(input);

        const err = newUser.validateSync();
        expect(err).toBeDefined();
        expect(err.errors).toBeDefined();
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
        },
      ],
      [
        "with invalid email: no @",
        {
          username: validUsername,
          email: "randommail.com",
          password: validPassword,
        },
      ],
      [
        "with invalid email: no domain name",
        {
          username: validUsername,
          email: "random@.com",
          password: validPassword,
        },
      ],
      [
        "with invalid email: no .",
        {
          username: validUsername,
          email: "random@mailcom",
          password: validPassword,
        },
      ],
      [
        "with invalid email: no top level domain",
        {
          username: validUsername,
          email: "random@mail.",
          password: validPassword,
        },
      ],
    ];

    emailInvalidCases.forEach(([testName, input]) => {
      test(testName, () => {
        const newUser = new User(input);
        console.log(newUser);
        const err = newUser.validateSync();

        expect(err).toBeDefined();
        expect(err.errors).toBeDefined();
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
        },
      ],
      [
        "with null password",
        {
          username: validUsername,
          email: validEmail,
          password: null,
        },
      ],
    ];

    passwordRequiredCases.forEach(([testName, input]) => {
      test(testName, () => {
        const newUser = new User(input);
        const err = newUser.validateSync();

        expect(err).toBeDefined();
        expect(err.errors).toBeDefined();
        expect(err.errors.password.message).toBe(
          validationErrorMessages.PASSWORD_REQUIRED
        );
      });
    });

    const passwordMustHaveCases = [
      [
        "with invalid password: no lowercase characters",
        {
          username: validUsername,
          email: validEmail,
          password: "3(HV$@8,;'@$BOA",
        },
      ],
      [
        "with invalid password: no uppercase characters",
        {
          username: validUsername,
          email: validEmail,
          password: "-[0lm+(=a;,fvg3",
        },
      ],
      [
        "with invalid password: no numbers",
        {
          username: validUsername,
          email: validEmail,
          password: "&.vhLDK[yyIn;[}",
        },
      ],
      [
        "with invalid password: no special symbols",
        {
          username: validUsername,
          email: validEmail,
          password: "YWNH752LnudO2CU",
        },
      ],
    ];

    passwordMustHaveCases.forEach(([testName, input]) => {
      test(testName, () => {
        const newUser = new User(input);
        const err = newUser.validateSync();

        expect(err).toBeDefined();
        expect(err.errors).toBeDefined();
        expect(err.errors.password.message).toBe(
          validationErrorMessages.PASSWORD_MUST_HAVE_CHARACTERS
        );
      });
    });

    test("with too short password", () => {
      const newUser = new User({
        username: validUsername,
        email: validEmail,
        password: "2t*wY&",
      });

      const err = newUser.validateSync();

      expect(err).toBeDefined();
      expect(err.errors).toBeDefined();
      expect(err.errors.password.message).toBe(
        validationErrorMessages.PASSWORD_MIN_LENGTH
      );
    });

    test("with no fields", () => {
      const newUser = new User();
      const err = newUser.validateSync();

      console.log(err.errors);

      expect(err).toBeDefined();
      expect(err.errors.username).toBeDefined();
      expect(err.errors.username.message).toBe(
        validationErrorMessages.USERNAME_REQUIRED
      );
      expect(err.errors.email).toBeDefined();
      expect(err.errors.email.message).toBe(
        validationErrorMessages.EMAIL_REQUIRED
      );
      expect(err.errors.password).toBeDefined();
      expect(err.errors.password.message).toBe(
        validationErrorMessages.PASSWORD_REQUIRED
      );
    });
  });
});
