import parsePhoneNumberFromString from "libphonenumber-js";

const toE164 = (phone, country) => {
  const parsed = parsePhoneNumberFromString(phone, country);

  return parsed?.isValid() ? parsed.number : phone;
};

export default toE164;
