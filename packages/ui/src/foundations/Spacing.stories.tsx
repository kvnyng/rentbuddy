import type { Story, StoryDefault } from "@ladle/react";
import { tokens } from "../tokens/tokens";

export default { title: "Foundations / Spacing, radius & shadow" } satisfies StoryDefault;

const label = { fontSize: 12, color: "var(--rb-semantic-text-subtle)" } as const;

export const Spacing: Story = () => (
  <div style={{ display: "grid", gap: 10 }}>
    {Object.entries(tokens.space).map(([k, v]) => (
      <div key={k} style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <code style={{ ...label, width: 140 }}>--rb-space-{k} · {v}</code>
        <div style={{ height: 16, width: `var(--rb-space-${k})`, background: "var(--rb-color-cyan-500)", borderRadius: 4 }} />
      </div>
    ))}
  </div>
);

export const Radius: Story = () => (
  <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
    {Object.keys(tokens.radius).map((k) => (
      <div key={k} style={{ display: "grid", gap: 8, justifyItems: "center" }}>
        <div style={{ width: 96, height: 96, background: "var(--rb-color-yellow-200)", borderRadius: `var(--rb-radius-${k})` }} />
        <code style={label}>--rb-radius-{k}</code>
      </div>
    ))}
  </div>
);

export const Shadow: Story = () => (
  <div style={{ display: "flex", gap: 32, flexWrap: "wrap", padding: 16 }}>
    {Object.keys(tokens.shadow).map((k) => (
      <div key={k} style={{ display: "grid", gap: 12, justifyItems: "center" }}>
        <div style={{ width: 140, height: 96, background: "var(--rb-semantic-surface)", borderRadius: "var(--rb-radius-lg)", boxShadow: `var(--rb-shadow-${k})` }} />
        <code style={label}>--rb-shadow-{k}</code>
      </div>
    ))}
  </div>
);
