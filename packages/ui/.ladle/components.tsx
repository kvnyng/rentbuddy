import type { GlobalProvider } from "@ladle/react";
import "../src/fonts.css";
import "../src/base.css";

export const Provider: GlobalProvider = ({ children }) => (
  <div
    style={{
      minHeight: "100vh",
      padding: 24,
      background: "var(--rb-semantic-background)",
      color: "var(--rb-semantic-text)",
      fontFamily: "var(--rb-font-body)",
    }}
  >
    {children}
  </div>
);
