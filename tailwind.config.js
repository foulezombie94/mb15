import forms from '@tailwindcss/forms';
import containerQueries from '@tailwindcss/container-queries';

export default {
  darkMode: "class",
  content: [
    "./public/**/*.{html,js}",
  ],
  theme: {
    extend: {
      "colors": {
        "on-primary-fixed": "#002022",
        "tertiary": "#f4f6ff",
        "inverse-primary": "#006970",
        "primary-fixed-dim": "#00dbe9",
        "on-background": "#dfe2f1",
        "inverse-surface": "#dfe2f1",
        "surface": "#0f131d",
        "outline": "#849495",
        "primary-container": "#00f0ff",
        "secondary": "#adc6ff",
        "on-surface": "#dfe2f1",
        "inverse-on-surface": "#2c303b",
        "surface-bright": "#353944",
        "on-primary-fixed-variant": "#004f54",
        "error": "#ffb4ab",
        "on-primary-container": "#006970",
        "background": "#0f131d",
        "on-tertiary": "#263143",
        "surface-container-lowest": "#0a0e18",
        "tertiary-fixed": "#d8e3fb",
        "secondary-fixed-dim": "#adc6ff",
        "tertiary-container": "#cfdaf2",
        "on-secondary": "#002e6a",
        "surface-dim": "#0f131d",
        "on-surface-variant": "#b9cacb",
        "surface-variant": "#313540",
        "on-error": "#690005",
        "surface-container-highest": "#313540",
        "on-error-container": "#ffdad6",
        "on-tertiary-fixed-variant": "#3c475a",
        "on-tertiary-container": "#545f73",
        "outline-variant": "#3b494b",
        "secondary-fixed": "#d8e2ff",
        "on-secondary-fixed": "#001a42",
        "error-container": "#93000a",
        "surface-container-low": "#171b26",
        "on-secondary-container": "#e6ecff",
        "primary-fixed": "#7df4ff",
        "secondary-container": "#0566d9",
        "tertiary-fixed-dim": "#bcc7de",
        "surface-container": "#1c1f2a",
        "on-secondary-fixed-variant": "#004395",
        "primary": "#dbfcff",
        "surface-tint": "#00dbe9",
        "surface-container-high": "#262a35",
        "on-tertiary-fixed": "#111c2d",
        "on-primary": "#00363a"
      },
      "spacing": {
        "sm": "8px",
        "xl": "32px",
        "base": "4px",
        "md": "16px",
        "lg": "24px",
        "margin": "24px",
        "gutter": "20px",
        "xs": "4px"
      },
      "fontFamily": {
        "headline-lg-mobile": ["Inter"],
        "label-mono": ["JetBrains Mono"],
        "headline-md": ["Inter"],
        "display-lg": ["Inter"],
        "body-lg": ["Inter"],
        "headline-sm": ["Inter"],
        "body-md": ["Inter"]
      },
      "fontSize": {
        "headline-lg-mobile": ["28px", { "lineHeight": "36px", "fontWeight": "700" }],
        "label-mono": ["12px", { "lineHeight": "16px", "letterSpacing": "0.05em", "fontWeight": "500" }],
        "headline-md": ["24px", { "lineHeight": "32px", "fontWeight": "600" }],
        "display-lg": ["36px", { "lineHeight": "44px", "letterSpacing": "-0.02em", "fontWeight": "700" }],
        "body-lg": ["16px", { "lineHeight": "24px", "fontWeight": "400" }],
        "headline-sm": ["20px", { "lineHeight": "28px", "fontWeight": "600" }],
        "body-md": ["14px", { "lineHeight": "20px", "fontWeight": "400" }]
      }
    }
  },
  plugins: [forms, containerQueries]
}
