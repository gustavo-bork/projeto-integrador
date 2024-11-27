import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient({
  log: [
    { level: 'warn', emit: 'event' },
    { level: 'info', emit: 'event' },
    { level: 'error', emit: 'event' }
  ]
})

prisma.$on('error', console.error)

prisma.$on('info', console.info)

prisma.$on('warn', console.warn)

export default prisma
