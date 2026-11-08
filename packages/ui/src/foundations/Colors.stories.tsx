import type { Story, StoryDefault } from "@ladle/react";
import { STAGES, STAGE_LABELS } from "@rentbuddy/core";
import { tokens } from "../tokens/tokens";
import { Heading, Subtitle, Text } from "../components/Typography/Typography";

export default { title: "Foundations / Colors" } satisfies StoryDefault;

type Scale = keyof typeof tokens.color & ("cyan" | "green" | "yellow" | "coral" | "ink");
const ROLE: Record<Scale, string> = {
  cyan: "Primary brand · Contacted",
  green: "Success · Applied / Signed",
  yellow: "Attention · Viewing scheduled",
  coral: "Passed · urgent · errors (sparingly)",
  ink: "Neutral text and UI",
};

const SWATCH_HEIGHT = { large: 96, small: 56 } as const;

const Swatch = ({ name, hex, cssVar, size = "small" }: { name: string; hex: string; cssVar: string; size?: keyof typeof SWATCH_HEIGHT }) => (
  <div style={{ display: "grid", gap: 6 }}>
    <div
      style={{
        height: SWATCH_HEIGHT[size],
        borderRadius: "var(--rb-radius-md)",
        background: `var(${cssVar})`,
        border: "1px solid rgba(14,26,43,0.08)",
      }}
    />
    <div style={{ fontSize: 13, fontWeight: 700 }}>{name}</div>
    <code style={{ fontSize: 12, color: "var(--rb-semantic-text-subtle)" }}>{hex}</code>
    <code style={{ fontSize: 11, color: "var(--rb-semantic-text-subtle)" }}>{cssVar}</code>
  </div>
);

export const Brand: Story = () => (
  <div style={{ display: "grid", gap: 24 }}>
    <div>
      <Heading level={2}>Brand colors</Heading>
      <Subtitle>Four bright accents on a calm, neutral base.</Subtitle>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16 }}>
      {(["cyan", "green", "yellow", "coral"] as const).map((c) => (
        <div key={c}>
          <Swatch size="large" name={c.charAt(0).toUpperCase() + c.slice(1)} hex={tokens.color[c]["500"]} cssVar={`--rb-color-${c}-500`} />
          <Text size="sm" tone="muted">{ROLE[c]}</Text>
        </div>
      ))}
    </div>
    <Text size="sm" tone="muted">
      Use dark ink text on brand fills. White text fails WCAG contrast on all four. For colored text on light
      backgrounds, use the 700 shade (≥ 4.5:1 on paper).
    </Text>
  </div>
);

export const Scales: Story = () => (
  <div style={{ display: "grid", gap: 28 }}>
    {(["cyan", "green", "yellow", "coral", "ink"] as const).map((c) => (
      <div key={c}>
        <Heading level={4}>{c}</Heading>
        <Text size="sm" tone="subtle">{ROLE[c]}</Text>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, minmax(100px, 1fr))", gap: 12, marginTop: 12 }}>
          {Object.entries(tokens.color[c]).map(([step, hex]) => (
            <Swatch key={step} name={step} hex={hex} cssVar={`--rb-color-${c}-${step}`} />
          ))}
        </div>
      </div>
    ))}
  </div>
);

export const Semantic: Story = () => (
  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 16 }}>
    {Object.entries(tokens.semantic).map(([name, ref]) => (
      <Swatch key={name} name={name} hex={ref} cssVar={`--rb-semantic-${name}`} />
    ))}
  </div>
);

export const Stages: Story = () => (
  <div style={{ display: "grid", gap: 8, maxWidth: 520 }}>
    {STAGES.map((s) => (
      <div
        key={s}
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "12px 16px",
          borderRadius: "var(--rb-radius-md)",
          borderLeft: `6px solid var(--rb-stage-${s}-accent)`,
          background: `var(--rb-stage-${s}-bg)`,
          color: `var(--rb-stage-${s}-fg)`,
          fontWeight: 700,
        }}
      >
        <span>{STAGE_LABELS[s]}</span>
        <code style={{ fontWeight: 400 }}>--rb-stage-{s}-*</code>
      </div>
    ))}
  </div>
);
