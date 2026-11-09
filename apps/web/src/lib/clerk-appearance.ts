import { cssVar } from "@rentbuddy/ui";

/** Clerk's sign-in/up and user menu, themed with the design-system tokens. */
export const clerkAppearance = {
  variables: {
    colorPrimary: cssVar("semantic", "primary"),
    colorPrimaryForeground: cssVar("semantic", "on-primary"),
    colorForeground: cssVar("semantic", "text"),
    colorMutedForeground: cssVar("semantic", "text-subtle"),
    colorBackground: cssVar("semantic", "surface"),
    colorInput: cssVar("semantic", "surface"),
    colorInputForeground: cssVar("semantic", "text"),
    colorBorder: cssVar("semantic", "border"),
    colorRing: cssVar("semantic", "focus-ring"),
    colorDanger: cssVar("semantic", "danger"),
    fontFamily: cssVar("font", "body"),
    fontFamilyButtons: cssVar("font", "body"),
    borderRadius: cssVar("radius", "md"),
  },
} as const;
