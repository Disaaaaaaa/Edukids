"use server"

import { prisma } from "@/lib/db"
import bcrypt from "bcryptjs"
import { redirect } from "next/navigation"
import fs from "fs"

export async function registerAction(prevState: any, formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const role = formData.get("role") as string
  const teacherId = formData.get("teacherId") as string

  if (!name || !email || !password || !role) {
    return { error: "Барлық жолақтарды толтырыңыз" }
  }
  if (role === "student" && !teacherId) {
    return { error: "Өз мұғаліміңізді таңдаңыз" }
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return { error: "Бұл пошта жүйеде тіркелген" }
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        teacherId: role === "student" ? teacherId : null
      }
    })

  } catch (err) {
    console.error(err)
    if (err instanceof Error) {
      fs.writeFileSync("/tmp/error.log", err.message + "\n" + err.stack)
      return { error: `Бекэнд қатесі: ${err.message}` }
    }
    return { error: `Қате пайда болды: ${String(err)}` }
  }

  redirect("/login")
}
