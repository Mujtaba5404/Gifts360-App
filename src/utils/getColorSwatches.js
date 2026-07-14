import { DEFAULT_THEME } from "@mantine/core";

const getColorSwatches = (excludeColors = [], colorShade) => {
  return Object.entries(DEFAULT_THEME.colors)
    .filter(([color]) => !excludeColors.includes(color))
    .map(([color, swatches]) => (colorShade ? swatches[colorShade] : color));
};

export default getColorSwatches;
