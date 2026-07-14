const getAbbreviation = (string = "") => {
  return string.split(" ").map((v, i, a) => (i === 0 || i === a.length - 1) && v.slice(0, 1).toUpperCase());
};

export default getAbbreviation;
