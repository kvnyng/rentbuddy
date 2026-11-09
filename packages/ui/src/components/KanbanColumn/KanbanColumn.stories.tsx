import type { Story, StoryDefault } from "@ladle/react";
import { Plus } from "lucide-react";
import { STAGES } from "@rentbuddy/core";
import { ListingCard, type ListingCardProps } from "../ListingCard/ListingCard";
import { lowerEastSide, sampleCards } from "../ListingCard/fixtures";
import { Logo } from "../Logo/Logo";
import { Button } from "../Button/Button";
import { KanbanColumn } from "./KanbanColumn";

export default { title: "Components / Kanban" } satisfies StoryDefault;

const keyOf = (c: ListingCardProps) => c.listing.address.street;

export const Column: Story = () => (
  <KanbanColumn stage="contacted" items={[lowerEastSide]} getKey={keyOf} renderItem={(c) => <ListingCard {...c} />} />
);

export const EmptyColumn: Story = () => (
  <KanbanColumn stage="applied" items={[]} getKey={keyOf} renderItem={(c) => <ListingCard {...c} />} />
);

export const Board: Story = () => (
  <div style={{ display: "grid", gap: 16 }}>
    <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <Logo size={36} />
      <Button leadingIcon={<Plus />}>Track a listing</Button>
    </header>
    <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 8 }}>
      {STAGES.map((stage) => (
        <KanbanColumn
          key={stage}
          stage={stage}
          items={sampleCards.filter((c) => c.stage === stage)}
          getKey={keyOf}
          renderItem={(c) => <ListingCard {...c} onOpen={() => {}} />}
        />
      ))}
    </div>
  </div>
);
