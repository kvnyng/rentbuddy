import type { Story, StoryDefault } from "@ladle/react";
import { Plus, Send, Trash2 } from "lucide-react";
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
        <Button size={size}>Track listing</Button>
        <Button size={size} variant="secondary">View thread</Button>
        <Button size={size} variant="ghost">Cancel</Button>
        <Button size={size} variant="danger">Pass</Button>
      </div>
    ))}
  </div>
);

export const Disabled: Story = () => (
  <div style={{ display: "flex", gap: 12 }}>
    <Button disabled>Track listing</Button>
    <Button variant="secondary" disabled>View thread</Button>
    <Button variant="ghost" disabled>Cancel</Button>
    <Button variant="danger" disabled>Pass</Button>
  </div>
);

export const WithIcon: Story = () => (
  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
    <Button leadingIcon={<Plus />}>Track a listing</Button>
    <Button variant="secondary" leadingIcon={<Send />}>Send draft</Button>
    <Button variant="ghost" leadingIcon={<Trash2 />}>Remove</Button>
  </div>
);
