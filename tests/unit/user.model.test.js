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
        role: validRole,
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
        role: validRole,
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
          role: validRole,
        },
      ],
      [
        "with invalid password: no uppercase characters",
        {
          username: validUsername,
          email: validEmail,
          password: "-[0lm+(=a;,fvg3",
          role: validRole,
        },
      ],
      [
        "with invalid password: no numbers",
        {
          username: validUsername,
          email: validEmail,
          password: "&.vhLDK[yyIn;[}",
          role: validRole,
        },
      ],
      [
        "with invalid password: no special symbols",
        {
          username: validUsername,
          email: validEmail,
          password: "YWNH752LnudO2CU",
          role: validRole,
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
        role: validRole,
      });

      const err = newUser.validateSync();

      expect(err).toBeDefined();
      expect(err.errors).toBeDefined();
      expect(err.errors.password.message).toBe(
        validationErrorMessages.PASSWORD_MIN_LENGTH
      );
    });

    const roleRequiredCases = [
      [
        "with role undefined",
        {
          username: validUsername,
          email: validEmail,
          password: validPassword,
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
        expect(err).toBeDefined();
        expect(err.errors).toBeDefined();
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
      expect(err).toBeDefined();
      expect(err.errors).toBeDefined();
      expect(err.errors.role.message).toBe(
        validationErrorMessages.ROLE_INVALID
      );
    });

    test("with no fields", () => {
      const newUser = new User();
      const err = newUser.validateSync();

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
      expect(err.errors.role).toBeDefined();
      expect(err.errors.role.message).toBe(
        validationErrorMessages.ROLE_REQUIRED
      );
    });
  });
});
