import z from 'zod'

const envSchema = z.object({
    DATABASE_URL: z.string(),
    POSTGRESQL_USERNAME: z.string(),
    POSTGRESQL_PASSWORD: z.string(),
    POSTGRESQL_DATABASE: z.string(),
})

export const env = envSchema.parse(process.env)