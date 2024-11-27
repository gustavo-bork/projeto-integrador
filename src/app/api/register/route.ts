import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/prisma'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  const { email, password, name } = await req.json()
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  try {
    const { id } = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword
      }
    })

    return NextResponse.json({ id }, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'Erro ao cadastrar usuário' }, { status: 500 })
  }
}
