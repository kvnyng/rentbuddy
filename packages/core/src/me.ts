import { z } from "zod";
import { EmailAddress, PhoneNumber, UserId } from "./primitives";

/**
 * The signed-in renter, as `GET /api/me` returns it. Email and phone are both
 * required at sign-up, but Clerk lets a user remove one later, so absence is explicit.
 */
export const Me = z.object({
  userId: UserId,
  email: EmailAddress.nullable(),
  phone: PhoneNumber.nullable(),
});
export type Me = z.infer<typeof Me>;
