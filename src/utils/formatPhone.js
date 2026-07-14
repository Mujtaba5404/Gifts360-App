import { parsePhoneNumberFromString } from "libphonenumber-js";

const formatPhone = (phone = "", format = "national") => {
  if (!phone) return "";

  const parsed = parsePhoneNumberFromString(phone);

  if (!parsed?.isValid()) {
    return phone;
  }

  switch (format) {
    case "international":
      return parsed.formatInternational();

    case "e164":
      return parsed.number;

    case "national":
    default:
      return parsed.formatNational();
  }
};

export default formatPhone;
