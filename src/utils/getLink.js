import dayjs from "dayjs";

const getLink = (resource, params = {}) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value == null || value === "" || (Array.isArray(value) && value.every((v) => v == null))) return;

    if (Array.isArray(value) && value.every((v) => v instanceof Date)) {
      searchParams.set(key, JSON.stringify(value.map((v) => dayjs(v).format("YYYY-MM-DD"))));
    } else {
      searchParams.set(key, value);
    }
  });

  const query = searchParams.toString();

  return `${resource}${query ? `?${query}` : ""}`;
};

export default getLink;
