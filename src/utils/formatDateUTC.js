import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

const formatDateUTC = (date) => {
  return date instanceof Date ? dayjs(date).utc(true).format() : null;
};

export default formatDateUTC;
