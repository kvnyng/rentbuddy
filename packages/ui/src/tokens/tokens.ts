import type { Stage } from "@rentbuddy/core";
import tokens from "./tokens.json";

export { tokens };

/*
 * Stage colors are keyed by the core Stage type. Both checks below are
 * compile-time: a stage without tokens, or tokens for a stage that doesn't
 * exist, fails the typecheck instead of rendering an uncolored card.
 */
type StageToken = { bg: string; fg: string; accent: string };
export const stageTokens: Record<Stage, StageToken> = tokens.stage;
type ExtraStageTokens = Exclude<keyof typeof tokens.stage, Stage>;
type Expect<T extends true> = T;
export type StageTokensHaveNoExtraKeys = Expect<[ExtraStageTokens] extends [never] ? true : false>;

/** Reference a token as a CSS variable, e.g. cssVar("semantic", "text"). */
export const cssVar = (...path: readonly string[]) => `var(--rb-${path.join("-")})`;
