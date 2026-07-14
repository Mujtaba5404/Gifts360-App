const formatAmount = (amount = 0, options = {}) => {
  const defaultOptions = {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: options.notation === "compact" ? 2 : Number.isInteger(amount) ? 0 : 2,
  };

  const formatter = new Intl.NumberFormat("en-PK", { ...defaultOptions, ...options });

  return formatter.format(amount);
};

export default formatAmount;
