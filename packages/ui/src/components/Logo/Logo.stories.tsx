import type { Story, StoryDefault } from "@ladle/react";
import { Logo, type LogoProps } from "./Logo";

export default { title: "Brand / Logo" } satisfies StoryDefault;

export const Playground: Story<LogoProps> = (args) => <Logo {...args} />;
Playground.args = { variant: "full", size: 64 };
Playground.argTypes = {
  variant: { options: ["full", "mark", "wordmark"], control: { type: "radio" } },
  size: { control: { type: "range", min: 24, max: 200, step: 4 } },
};

export const Variants: Story = () => (
  <div style={{ display: "grid", gap: 32, justifyItems: "start" }}>
    <Logo variant="full" size={96} />
    <Logo variant="full" size={48} />
    <Logo variant="mark" size={160} />
    <Logo variant="wordmark" size={64} />
  </div>
);

export const OnBrandColors: Story = () => (
  <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
    {["paper", "cyan-50", "yellow-50", "green-50"].map((c) => (
      <div
        key={c}
        style={{
          background: c === "paper" ? "var(--rb-color-paper)" : `var(--rb-color-${c})`,
          padding: 32,
          borderRadius: "var(--rb-radius-lg)",
        }}
      >
        <Logo size={56} />
      </div>
    ))}
  </div>
);
