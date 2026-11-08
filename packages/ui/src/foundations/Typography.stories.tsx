import type { Story, StoryDefault } from "@ladle/react";
import { Heading, Subtitle, Text } from "../components/Typography/Typography";

export default { title: "Foundations / Typography" } satisfies StoryDefault;

const Label = ({ children }: { children: string }) => (
  <code style={{ fontSize: 12, color: "var(--rb-semantic-text-subtle)" }}>{children}</code>
);

export const Specimen: Story = () => (
  <div style={{ display: "grid", gap: 40, maxWidth: 760 }}>
    <section style={{ display: "grid", gap: 8 }}>
      <Label>Headers and titles · Sen</Label>
      <Heading level={1}>Find your next home, faster.</Heading>
      <Heading level={2}>Every listing in one place</Heading>
      <Heading level={3}>Viewing scheduled</Heading>
      <Heading level={4}>214 Bedford Ave #3F</Heading>
    </section>
    <section style={{ display: "grid", gap: 8 }}>
      <Label>Subtitles · Sanchez</Label>
      <Subtitle>Track Zillow and StreetEasy listings, agent emails and viewings without the spreadsheet.</Subtitle>
    </section>
    <section style={{ display: "grid", gap: 8 }}>
      <Label>Body · DM Sans</Label>
      <Text size="lg">
        Hi Jordan, I'm interested in 31-15 30th Ave #2R and would love to see it this week. I'm free Tuesday after 6 PM or
        Saturday morning.
      </Text>
      <Text>
        Click Track in RentBuddy on any listing and it lands on your board with photos, price and the agent's details.
      </Text>
      <Text size="sm" tone="muted">Last reply from Jordan Lee · 2 hours ago</Text>
      <Text size="sm" tone="subtle">Synced from StreetEasy</Text>
    </section>
  </div>
);

export const Pairing: Story = () => (
  <div
    style={{
      maxWidth: 560,
      padding: 32,
      background: "var(--rb-semantic-surface)",
      borderRadius: "var(--rb-radius-xl)",
      boxShadow: "var(--rb-shadow-md)",
      display: "grid",
      gap: 12,
    }}
  >
    <Heading level={2}>Viewing confirmed</Heading>
    <Subtitle>Tuesday, Nov 11 at 6:30 PM</Subtitle>
    <Text tone="muted">
      Jordan Lee from Douglas Elliman will meet you at 31-15 30th Ave. We've added it to your calendar and will remind you an
      hour before.
    </Text>
  </div>
);

export const Scale: Story = () => (
  <div style={{ display: "grid", gap: 12 }}>
    {(["4xl", "3xl", "2xl", "xl", "lg", "md", "sm", "xs"] as const).map((s) => (
      <div key={s} style={{ display: "flex", alignItems: "baseline", gap: 24 }}>
        <code style={{ width: 120, fontSize: 12, color: "var(--rb-semantic-text-subtle)" }}>--rb-size-{s}</code>
        <span style={{ fontFamily: "var(--rb-font-heading)", fontSize: `var(--rb-size-${s})`, fontWeight: 700 }}>RentBuddy</span>
      </div>
    ))}
  </div>
);
