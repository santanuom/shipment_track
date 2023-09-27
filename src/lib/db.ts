// import { PrismaClient } from '@prisma/client'

// const globalForPrisma = globalThis as unknown as {
//     prisma: PrismaClient | undefined
//   }
//   const prisma = globalForPrisma.prisma ?? new PrismaClient()


// if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// export const db = prisma;

const { Pool } = require('pg');

const db = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password:  process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

});

export default db;