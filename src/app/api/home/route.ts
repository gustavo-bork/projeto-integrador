import prisma from "@/prisma"
import type { Address } from "@prisma/client"
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const address = await request.json() as Address

  const { id } = await prisma.address.create({ data: address })

  return NextResponse.json({ id })
}
