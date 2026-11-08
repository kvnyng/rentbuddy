import type { Story, StoryDefault } from "@ladle/react";
import { NonNegativeInt, STAGES, type Stage } from "@rentbuddy/core";
import { ListingCard } from "./ListingCard";
import { astoria, noAgentStudio, sampleCards, williamsburg } from "./fixtures";

export default { title: "Components / Listing card" } satisfies StoryDefault;

type PlaygroundArgs = { stage: Stage; unread: number };
export const Playground: Story<PlaygroundArgs> = ({ stage, unread }) => (
  <ListingCard {...astoria} stage={stage} unreadCount={NonNegativeInt.parse(Math.max(0, Math.round(unread)))} />
);
Playground.args = { stage: "viewing-scheduled", unread: 1 };
Playground.argTypes = {
  stage: { options: [...STAGES], control: { type: "select" } },
  unread: { control: { type: "range", min: 0, max: 20, step: 1 } },
};

/** Static (no `onOpen`) next to clickable. Tab to the right card; Enter or Space opens it. */
export const StaticVsClickable: Story<{ onOpen: () => void }> = ({ onOpen }) => (
  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
    <figure style={{ margin: 0, display: "grid", gap: 8 }}>
      <figcaption>Static: not focusable</figcaption>
      <ListingCard {...williamsburg} />
    </figure>
    <figure style={{ margin: 0, display: "grid", gap: 8 }}>
      <figcaption>Clickable: Tab, then Enter or Space</figcaption>
      <ListingCard {...williamsburg} onOpen={onOpen} />
    </figure>
  </div>
);
StaticVsClickable.argTypes = { onOpen: { action: "opened" } };

export const EveryStage: Story = () => (
  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
    {sampleCards.map((c) => (
      <ListingCard key={c.listing.address.street} {...c} />
    ))}
  </div>
);

export const NoAgentOrSize: Story = () => <ListingCard {...noAgentStudio} />;
