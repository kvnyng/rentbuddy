/** Joins the class names that are set, skipping `undefined` (an omitted prop or a missing CSS-module key). */
export const classNames = (...names: readonly (string | undefined)[]) =>
  names.filter((n): n is string => n !== undefined && n !== "").join(" ");
