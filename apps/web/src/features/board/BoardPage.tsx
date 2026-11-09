import { UserButton } from "@clerk/react";
import type { Me } from "@rentbuddy/core";
import { STAGES } from "@rentbuddy/core";
import { Heading, KanbanColumn, Logo, Text } from "@rentbuddy/ui";
import { useQuery } from "@tanstack/react-query";
import { meQuery, type Api } from "../../lib/api";
import styles from "./BoardPage.module.css";

/** Tracked listings arrive in PR 2; until then every column is empty. */
const listings: readonly never[] = [];

export function BoardPage({ api }: { api: Api }) {
  const me = useQuery(meQuery(api));

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Logo size={36} />
        <div className={styles.account}>
          {me.status === "success" && <Text as="span" size="sm" tone="muted">{me.data.email ?? me.data.phone}</Text>}
          <UserButton />
        </div>
      </header>
      <main className={styles.main}>
        {(() => {
          switch (me.status) {
            case "pending":
              return <Text tone="subtle">Loading your board…</Text>;
            case "error":
              return (
                <div role="alert">
                  <Heading level={2}>We couldn’t load your board</Heading>
                  <Text tone="muted">Refresh the page to try again.</Text>
                </div>
              );
            case "success":
              return <Board me={me.data} />;
          }
        })()}
      </main>
    </div>
  );
}

function Board({ me }: { me: Me }) {
  return (
    <>
      <div className={styles.intro}>
        <Heading level={1}>Your board</Heading>
        {listings.length === 0 && (
          <Text tone="muted">
            Nothing here yet. Listings you track will show up in these columns, sorted by stage.
            {me.phone === null && " Add a phone number in your account so agents can reach you."}
          </Text>
        )}
      </div>
      <div className={styles.columns}>
        {STAGES.map((stage) => (
          <KanbanColumn key={stage} stage={stage} items={listings} getKey={() => ""} renderItem={() => null} />
        ))}
      </div>
    </>
  );
}
