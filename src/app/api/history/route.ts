import prisma from "@/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const userId = +searchParams.get('userId')!

  const addresses = await prisma.address.findMany({
    where: { userId },
  })

  return NextResponse.json(addresses)
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const id = +searchParams.get('id')!

  await prisma.address.delete({ where: { id } })

  return NextResponse.json({ message: 'Endereço excluído com sucesso' })
}
