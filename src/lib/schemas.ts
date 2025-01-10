import * as z from "zod"

export const lastFmFormSchema = z.object({
  apiKey: z.string().min(1, "API Key is required"),
  username: z.string().min(1, "Username is required"),
  useOptimized: z.boolean().default(false),
})

export type LastFmFormValues = z.infer<typeof lastFmFormSchema>
