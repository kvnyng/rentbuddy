import type { Story, StoryDefault } from "@ladle/react";
import { STAGES } from "../../tokens/tokens";
import { ListingCard, type ListingCardProps } from "./ListingCard";
import { sampleListings } from "./fixtures";

export default { title: "Components / Listing card" } satisfies StoryDefault;

export const Playground: Story<ListingCardProps> = (args) => <ListingCard {...args} />;
Playground.args = { ...sampleListings[2]!, unreadCount: 1 };
Playground.argTypes = {
  stage: { options: [...STAGES], control: { type: "select" } },
  source: { options: ["zillow", "streeteasy"], control: { type: "radio" } },
};

export const EveryStage: Story = () => (
  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
    {sampleListings.map((l) => <ListingCard key={l.address} {...l} />)}
  </div>
);

export const Minimal: Story = () => (
  <ListingCard address="10 Main St #1" price={2400} beds={0} baths={1} source="zillow" stage="tracked" />
);
