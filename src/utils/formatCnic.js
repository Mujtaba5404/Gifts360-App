const formatCnic = (digits = "") => {
  digits = digits.replace(/\D/g, "");

  return digits.replace(/^(\d{0,5})(\d{0,7})(\d{0,1}).*/, (_, p1, p2, p3) => [p1, p2, p3].filter(Boolean).join("-"));
};

export default formatCnic;
