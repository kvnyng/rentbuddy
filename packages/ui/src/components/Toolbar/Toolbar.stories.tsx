import type { Story, StoryDefault } from "@ladle/react";
import { ArrowUpDown, Columns3, Filter, LayoutGrid, Plus, Search } from "lucide-react";
import { useState } from "react";
import { Button } from "../Button/Button";
import { Toolbar, ToolbarButton } from "./Toolbar";

export default { title: "Components / Toolbar" } satisfies StoryDefault;

/** The board header from PR 1. Tab once into the toolbar, then use the arrow keys. */
export const BoardHeader: Story = () => {
  const [searching, setSearching] = useState(false);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        padding: "8px 12px",
        background: "var(--rb-semantic-surface)",
        borderBottom: "1px solid var(--rb-semantic-divider)",
      }}
    >
      <Toolbar label="Board view">
        <ToolbarButton icon={<LayoutGrid />}>Board</ToolbarButton>
        <ToolbarButton icon={<Columns3 />}>7 stages</ToolbarButton>
        <ToolbarButton icon={<Filter />}>No filters</ToolbarButton>
        <ToolbarButton icon={<ArrowUpDown />}>Sort</ToolbarButton>
        <ToolbarButton icon={<Search />} aria-pressed={searching} onClick={() => {
            setSearching((s) => !s);
          }}>
          Search
        </ToolbarButton>
      </Toolbar>
      <Button size="sm" leadingIcon={<Plus />}>Track a listing</Button>
    </div>
  );
};
