const { verifyToken } = require("../../src/auth/authController");
const authResponses = require("../../src/auth/authResponseMessages");

describe("JWT integration test(s)", () => {
  let req, res, next;

  const validUsername = "newUser";
  const validPassword = "W;Vj(+C8Sgqo'_4";
  const testToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im5ld1VzZXIiLCJpYXQiOjE1MTYyMzkwMjJ9.6X6NKeg86aa_8fjqOnI0iGsANvBUgBDBqV4Mc6Kiigg";

  describe("unauthorized (401):", () => {
    beforeEach(() => {
      res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      next = jest.fn();
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    const authHeaderRequiredCases = [
      [
        "undefined auth header",
        {
          body: {
            username: validUsername,
            password: validPassword,
          },
          headers: {
            authorization: undefined,
          },
        },
      ],
      [
        "null auth header",
        {
          body: {
            username: validUsername,
            password: validPassword,
          },
          headers: {
            authorization: null,
          },
        },
      ],
      [
        "empty auth header",
        {
          body: {
            username: validUsername,
            password: validPassword,
          },
          headers: {
            authorization: "",
          },
        },
      ],
    ];

    authHeaderRequiredCases.forEach(([testName, input]) => {
      test(testName, async () => {
        req = input;

        for (let middleware of verifyToken) {
          await middleware(req, res, next);
        }

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
          errors: [{ message: authResponses.AUTH_HEADER_REQUIRED }],
        });
      });
    });

    test("with invalid token", async () => {
      req = {
        body: {
          username: validUsername,
          password: validPassword,
        },
        headers: {
          authorization: `Bearer ${testToken}`,
        },
      };

      for (let middleware of verifyToken) {
        await middleware(req, res, next);
      }

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: authResponses.TOKEN_INVALID,
      });
    });
  });
});
