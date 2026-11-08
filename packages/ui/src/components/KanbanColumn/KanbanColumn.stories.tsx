import type { Story, StoryDefault } from "@ladle/react";
import { STAGES } from "../../tokens/tokens";
import { ListingCard } from "../ListingCard/ListingCard";
import { sampleListings } from "../ListingCard/fixtures";
import { Logo } from "../Logo/Logo";
import { Button } from "../Button/Button";
import { KanbanColumn } from "./KanbanColumn";

export default { title: "Components / Kanban" } satisfies StoryDefault;

export const Column: Story = () => (
  <KanbanColumn stage="contacted" count={1}>
    <ListingCard {...sampleListings[1]!} />
  </KanbanColumn>
);

export const EmptyColumn: Story = () => <KanbanColumn stage="applied" count={0} />;

export const Board: Story = () => (
  <div style={{ display: "grid", gap: 24 }}>
    <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <Logo size={44} />
      <Button>+ Track a listing</Button>
    </header>
    <div style={{ display: "flex", gap: 16, overflowX: "auto", paddingBottom: 8 }}>
      {STAGES.map((stage) => {
        const items = sampleListings.filter((l) => l.stage === stage);
        return (
          <KanbanColumn key={stage} stage={stage} count={items.length}>
            {items.length ? items.map((l) => <ListingCard key={l.address} {...l} onClick={() => {}} />) : undefined}
          </KanbanColumn>
        );
      })}
    </div>
  </div>
);
