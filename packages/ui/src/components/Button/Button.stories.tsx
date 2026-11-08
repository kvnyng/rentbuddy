import type { Story, StoryDefault } from "@ladle/react";
import { Button, type ButtonProps } from "./Button";

export default { title: "Components / Button" } satisfies StoryDefault;

export const Playground: Story<ButtonProps> = (args) => <Button {...args} />;
Playground.args = { children: "Request viewing", variant: "primary", size: "md", disabled: false };
Playground.argTypes = {
  variant: { options: ["primary", "secondary", "ghost", "danger"], control: { type: "radio" } },
  size: { options: ["sm", "md", "lg"], control: { type: "radio" } },
};

export const AllVariants: Story = () => (
  <div style={{ display: "grid", gap: 16 }}>
    {(["sm", "md", "lg"] as const).map((size) => (
      <div key={size} style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <Button size={size}>Track in RentBuddy</Button>
        <Button size={size} variant="secondary">View thread</Button>
        <Button size={size} variant="ghost">Edit draft</Button>
        <Button size={size} variant="danger">Pass</Button>
        <Button size={size} disabled>Disabled</Button>
      </div>
    ))}
  </div>
);
