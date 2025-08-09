import { execSync } from 'node:child_process'
import { randomUUID } from 'node:crypto'
import { existsSync } from 'node:fs'
import { loadEnvFile } from 'node:process'
import { PrismaClient } from '@prisma/client'

if (existsSync('.env.test')) loadEnvFile('.env.test') // override with test env vars (if file exists)

function generateUniqueDatabaseURL(schemaId: string) {
  if (!process.env.DATABASE_URL) throw new Error('Please provider a DATABASE_URL environment variable')
  const url = new URL(process.env.DATABASE_URL)
  url.searchParams.set('schema', schemaId)
  return url.toString()
}

const prisma = new PrismaClient()
const schemaId = randomUUID()

beforeAll(async () => {
  const databaseURL = generateUniqueDatabaseURL(schemaId)
  process.env.DATABASE_URL = databaseURL
  execSync('npx prisma migrate deploy')
})

afterAll(async () => {
  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`)
  await prisma.$disconnect()
})
