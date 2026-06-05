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
        "success": "var(--success)",
        "success-container": "var(--success-container)",
        "warning": "var(--warning)",
        "warning-container": "var(--warning-container)",
        "on-primary-fixed": "var(--on-primary-fixed)",
        "tertiary": "var(--tertiary)",
        "inverse-primary": "var(--inverse-primary)",
        "primary-fixed-dim": "var(--primary-fixed-dim)",
        "on-background": "var(--on-background)",
        "inverse-surface": "var(--inverse-surface)",
        "surface": "var(--surface)",
        "outline": "var(--outline)",
        "primary-container": "var(--primary-container)",
        "secondary": "var(--secondary)",
        "on-surface": "var(--on-surface)",
        "inverse-on-surface": "var(--inverse-on-surface)",
        "surface-bright": "var(--surface-bright)",
        "on-primary-fixed-variant": "var(--on-primary-fixed-variant)",
        "error": "var(--error)",
        "on-primary-container": "var(--on-primary-container)",
        "background": "var(--background)",
        "on-tertiary": "var(--on-tertiary)",
        "surface-container-lowest": "var(--surface-container-lowest)",
        "tertiary-fixed": "var(--tertiary-fixed)",
        "secondary-fixed-dim": "var(--secondary-fixed-dim)",
        "tertiary-container": "var(--tertiary-container)",
        "on-secondary": "var(--on-secondary)",
        "surface-dim": "var(--surface-dim)",
        "on-surface-variant": "var(--on-surface-variant)",
        "surface-variant": "var(--surface-variant)",
        "on-error": "var(--on-error)",
        "surface-container-highest": "var(--surface-container-highest)",
        "on-error-container": "var(--on-error-container)",
        "on-tertiary-fixed-variant": "var(--on-tertiary-fixed-variant)",
        "on-tertiary-container": "var(--on-tertiary-container)",
        "outline-variant": "var(--outline-variant)",
        "secondary-fixed": "var(--secondary-fixed)",
        "on-secondary-fixed": "var(--on-secondary-fixed)",
        "error-container": "var(--error-container)",
        "surface-container-low": "var(--surface-container-low)",
        "on-secondary-container": "var(--on-secondary-container)",
        "primary-fixed": "var(--primary-fixed)",
        "secondary-container": "var(--secondary-container)",
        "tertiary-fixed-dim": "var(--tertiary-fixed-dim)",
        "surface-container": "var(--surface-container)",
        "on-secondary-fixed-variant": "var(--on-secondary-fixed-variant)",
        "primary": "var(--primary)",
        "surface-tint": "var(--surface-tint)",
        "surface-container-high": "var(--surface-container-high)",
        "on-tertiary-fixed": "var(--on-tertiary-fixed)",
        "on-primary": "var(--on-primary)"
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
