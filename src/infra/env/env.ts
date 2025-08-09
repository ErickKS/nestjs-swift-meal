import { z } from 'zod'

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('production'),
  PORT: z.coerce.number().optional().default(3333),
  DATABASE_URL: z.string().url(),
  TRACE_SERVICE_NAME: z.string(),
  TRACE_EXPORTER_URL: z.string().url(),
  MERCADO_PAGO_ACCESS_TOKEN: z.string(),
  MERCADO_PAGO_WEBHOOK_URL: z.string().url(),
})

export type Env = z.infer<typeof envSchema>
