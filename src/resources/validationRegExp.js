/**
 * Contains regular expressions used in validation
 * processes.
 */

const PASSWORD_REGEX = new RegExp(
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/
);
const EMAIL_REGEX = new RegExp(
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
);

const NAME_REGEX = new RegExp(/^[A-Za-z]+$/);

// Regular expression for Greek zip codes
const ZIP_CODE_REGEX = new RegExp(/^\d{5}$/);

/*eslint-disable no-useless-escape*/
const CITY_REGEX = new RegExp(/^[A-Za-z\s\-]+$/);
/*eslint-enable no-useless-escape*/

const PHONE_REGEX = new RegExp(/^\d+(-\d+)*$/);

const ID_REGEX = new RegExp(/^[0-9a-f]{1,}$/);

module.exports = {
  PASSWORD_REGEX,
  EMAIL_REGEX,
  NAME_REGEX,
  CITY_REGEX,
  ZIP_CODE_REGEX,
  PHONE_REGEX,
  ID_REGEX,
};
