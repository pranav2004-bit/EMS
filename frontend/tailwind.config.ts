import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./app/**/*.{ts,tsx}",
        "./components/**/*.{ts,tsx}",
        "./context/**/*.{ts,tsx}",
        "./hooks/**/*.{ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                navy: {
                    900: "#0f1923",
                    800: "#1a2332",
                    700: "#22304a",
                    600: "#2a3d5c",
                },
                charcoal: {
                    900: "#1a1f2e",
                    800: "#2d3748",
                    700: "#3d4a5c",
                    600: "#4a5568",
                },
                muted: {
                    blue: "#4a6fa5",
                    "blue-light": "#6b8cbe",
                    gray: "#6b7280",
                    "gray-light": "#9ca3af",
                },
                status: {
                    open: "#6b7280",
                    review: "#d97706",
                    resolved: "#16a34a",
                    critical: "#dc2626",
                },
            },
            fontFamily: {
                sans: ["Inter", "IBM Plex Sans", "system-ui", "sans-serif"],
            },
            spacing: {
                "2": "8px",
                "4": "16px",
                "6": "24px",
                "8": "32px",
            },
        },
    },
    plugins: [],
};

export default config;
