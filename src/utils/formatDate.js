import dayjs from "dayjs";

const formatDate = (date, format = "MMM DD, YYYY") => {
  return dayjs(date).startOf("day").format(format);
};

export default formatDate;
