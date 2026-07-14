const formatNumber = (number = 0, notation = "compact") => {
  const formatter = Intl.NumberFormat("en-US", {
    notation,
    maximumFractionDigits: 1,
  });

  return formatter.format(number);
};

export default formatNumber;
