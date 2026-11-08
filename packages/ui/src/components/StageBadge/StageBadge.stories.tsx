import type { Story, StoryDefault } from "@ladle/react";
import { STAGES, type Stage } from "@rentbuddy/core";
import { StageBadge } from "./StageBadge";

export default { title: "Components / Stage badge" } satisfies StoryDefault;

export const AllStages: Story = () => (
  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
    {STAGES.map((s) => (
      <StageBadge key={s} stage={s} />
    ))}
  </div>
);

export const Playground: Story<{ stage: Stage }> = ({ stage }) => <StageBadge stage={stage} />;
Playground.args = { stage: "viewing-scheduled" };
Playground.argTypes = { stage: { options: [...STAGES], control: { type: "select" } } };
