import { z } from "zod";

export const ConnectionSchema = z.object({
  connectionId: z.string(),
  roomId: z.string().optional(),
});
export type Connection = z.infer<typeof ConnectionSchema>;
