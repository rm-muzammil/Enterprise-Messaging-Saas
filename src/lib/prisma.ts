// import "dotenv/config";
// import { PrismaPg } from '@prisma/adapter-pg'
// import { PrismaClient } from '../generated/prisma/client'

// const connectionString = `${process.env.DATABASE_URL}`

// const adapter = new PrismaPg({ connectionString })
// const prisma = new PrismaClient({ adapter })

// export { prisma }

// import { PrismaClient } from "../generated/prisma";

// const globalForPrisma = global as unknown as {
//     prisma: PrismaClient | undefined;
// };

// export const prisma =
//     globalForPrisma.prisma ||
//     new PrismaClient({
//         log: ["query", "error"],
//     });

// if (process.env.NODE_ENV !== "production") {
//     globalForPrisma.prisma = prisma;
// }


// src/lib/prisma.ts
import { PrismaClient } from "../generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

export const prisma =
    globalThis.prisma ??
    new PrismaClient({
        adapter,
    });

if (process.env.NODE_ENV !== "production") {
    globalThis.prisma = prisma;
}
