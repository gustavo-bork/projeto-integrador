import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/prisma'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  const { email, password } = await req.json()

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        email: true,
        name: true,
        password: true,
        id: true
      }
    })

    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...userWithoutPassword } = user
      return NextResponse.json(userWithoutPassword, { status: 200 })
    }
    //if (user) return NextResponse.json(user, { status: 200 })

    return NextResponse.json({ message: 'Usuário ou senha incorretos' }, { status: 404 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'Erro ao fazer login' }, { status: 500 })
  }
}
