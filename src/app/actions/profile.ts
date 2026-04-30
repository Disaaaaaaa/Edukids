"use server"

import { prisma } from "@/lib/db"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import bcrypt from "bcryptjs"

export async function updateProfileAction(prevState: any, formData: FormData): Promise<any> {
  const session = await auth()
  if (!session?.user?.email) return { error: "Авторизациядан өтіңіз" }

  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const teacherId = formData.get("teacherId") as string
  const password = formData.get("password") as string

  if (!name || !email) {
    return { error: "Аты-жөніңіз бен поштаңызды толтыру міндетті" }
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser && existingUser.email !== session.user.email) {
      return { error: "Бұл пошта жүйеде басқа адамда тіркелген" }
    }

    const dataToUpdate: any = { name, email }

    if (password) {
      dataToUpdate.password = await bcrypt.hash(password, 10)
    }

    if (teacherId && teacherId !== "null") {
       dataToUpdate.teacherId = teacherId
    }

    await prisma.user.update({
      where: { email: session.user.email },
      data: dataToUpdate
    })

    revalidatePath("/teacher/profile")
    revalidatePath("/student/profile")
    revalidatePath("/student/dashboard")
    revalidatePath("/teacher/dashboard")
    
    return { success: true, message: "Профиль сәтті жаңартылды!" }
  } catch (err: any) {
    return { error: err.message || "Деректер қорында қате пайда болды" }
  }
}
