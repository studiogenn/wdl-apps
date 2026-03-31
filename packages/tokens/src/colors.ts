export const colors = {
  detergent: {
    100: "#E7E9F8",
    200: "#CFD3F2",
    300: "#5967D1",
    400: "#1227BE",
    500: "#0E1F98",
    600: "#070F4C",
    700: "#050B39",
  },
  "fresh-lemon": {
    100: "#FAF1C3",
    200: "#F9EBAA",
    300: "#C7BC88",
  },
  seabreeze: {
    100: "#FEFEFC",
    200: "#F9F8ED",
    300: "#F7F5E6",
  },
  neutral: {
    100: "#FFFFFF",
    200: "#F2F2F2",
    300: "#D9DADA",
    400: "#B4B5B6",
    500: "#838585",
  },
  destructive: {
    100: "#E16A70",
    200: "#AF2C33",
    300: "#6B0C11",
  },
} as const;

export const semantic = {
  primary: "#1227BE",
  "primary-dark": "#0E1F98",
  background: "#F7F5E6",
  surface: "#FFFFFF",
  "surface-alt": "#E7E9F8",
  text: "#050B39",
  "text-muted": "#838585",
  accent: "#F9EBAA",
  border: "#D9DADA",
} as const;

export type ColorScale = typeof colors;
