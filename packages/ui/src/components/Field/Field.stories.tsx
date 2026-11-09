import type { Story, StoryDefault } from "@ladle/react";
import { Button } from "../Button/Button";
import { TextInput } from "../TextInput/TextInput";
import { Heading, Text } from "../Typography/Typography";
import { Field } from "./Field";

export default { title: "Components / Field" } satisfies StoryDefault;

const narrow = { maxWidth: 320 } as const;

export const Default: Story = () => (
  <div style={narrow}>
    <Field label="Full name">{(c) => <TextInput {...c} placeholder="Alex Rivera" />}</Field>
  </div>
);

export const WithHint: Story = () => (
  <div style={narrow}>
    <Field label="Monthly budget" hint="We flag listings above this.">{(c) => <TextInput {...c} inputMode="numeric" defaultValue="3,500" />}</Field>
  </div>
);

export const WithError: Story = () => (
  <div style={narrow}>
    <Field label="Listing URL" status={{ kind: "error", message: "Paste a Zillow or StreetEasy link." }}>
      {(c) => <TextInput {...c} defaultValue="example.com/apt" />}
    </Field>
  </div>
);

export const Disabled: Story = () => (
  <div style={narrow}>
    <Field label="Email" hint="Managed by your sign-in.">{(c) => <TextInput {...c} disabled defaultValue="alex@example.com" />}</Field>
  </div>
);

/** The reference-1 feel, built from our components: grey panel, labels above inputs, text Cancel and a solid Save. */
export const FormPanel: Story = () => (
  <div style={{ maxWidth: 520, background: "var(--rb-semantic-surface)", border: "1px solid var(--rb-semantic-border)", borderRadius: "var(--rb-radius-md)", overflow: "hidden" }}>
    <div style={{ padding: 16, display: "grid", gap: 4 }}>
      <Heading level={4}>Track a listing</Heading>
      <Text size="sm" tone="subtle">Paste a link and we'll pull in the photos, price and agent.</Text>
    </div>
    <div style={{ padding: 16, background: "var(--rb-semantic-surface-panel)", borderBlock: "1px solid var(--rb-semantic-divider)", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
      <div style={{ gridColumn: "1 / -1" }}>
        <Field label="Listing URL">{(c) => <TextInput {...c} type="url" placeholder="https://streeteasy.com/…" />}</Field>
      </div>
      <Field label="Move-in date">{(c) => <TextInput {...c} type="date" />}</Field>
      <Field label="Budget" hint="Per month">{(c) => <TextInput {...c} inputMode="numeric" placeholder="$3,500" />}</Field>
      <Field label="Agent name">{(c) => <TextInput {...c} placeholder="Optional" />}</Field>
      <Field label="Agent email" status={{ kind: "error", message: "That doesn't look like an email." }}>
        {(c) => <TextInput {...c} type="email" defaultValue="jordan@" />}
      </Field>
    </div>
    <div style={{ padding: 12, display: "flex", justifyContent: "flex-end", gap: 8 }}>
      <Button variant="ghost">Cancel</Button>
      <Button>Save</Button>
    </div>
  </div>
);
