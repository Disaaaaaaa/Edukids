"use server"

import { prisma } from "@/lib/db"
import bcrypt from "bcryptjs"
import { redirect } from "next/navigation"

export async function registerAction(_prevState: unknown, formData: FormData) {
  const name = (formData.get("name") as string | null)?.trim() ?? ""
  const email = (formData.get("email") as string | null)?.trim().toLowerCase() ?? ""
  const password = (formData.get("password") as string | null) ?? ""
  const role = (formData.get("role") as string | null) ?? ""
  const teacherId = (formData.get("teacherId") as string | null) ?? ""

  if (!name || !email || !password || !role) {
    return { error: "Барлық жолақтарды толтырыңыз" }
  }
  if (password.length < 6) {
    return { error: "Құпиясөз кемінде 6 таңбадан тұруы керек" }
  }
  if (role === "student" && !teacherId) {
    return { error: "Өз мұғаліміңізді таңдаңыз" }
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } })
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
        teacherId: role === "student" ? teacherId : null,
      },
    })
  } catch (err) {
    console.error("[registerAction] failed:", err)
    return { error: "Тіркелу сәтсіз аяқталды. Кейінірек қайталап көріңіз." }
  }

  redirect("/login")
}
