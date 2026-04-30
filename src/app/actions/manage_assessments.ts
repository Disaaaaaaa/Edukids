"use server"

import { prisma } from "@/lib/db"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"

export async function deleteAssessmentAction(id: string) {
  try {
    const session = await auth()
    if (!session?.user?.email) return { error: "Рұқсат жоқ" }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } })
    if (!user) return { error: "Қате" }

    const target = await prisma.assessment.findUnique({ where: { id } })
    if (!target) return { error: "Тест табылмады" }
    
    if (target.teacherId !== user.id && target.teacherId !== null) {
      return { error: "Сіз тек өзіңіз жасаған тестті өшіре аласыз" }
    }

    await prisma.assessment.delete({ where: { id } })
    revalidatePath("/teacher/assessments")
    revalidatePath("/student/tests")
    return { success: true }
  } catch (err: any) {
    return { error: err.message }
  }
}

export async function togglePublishAction(id: string, isPublished: boolean) {
  try {
    const session = await auth()
    if (!session?.user?.email) return { error: "Рұқсат жоқ" }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } })
    if (!user) return { error: "Қате" }

    const target = await prisma.assessment.findUnique({ where: { id } })
    if (!target) return { error: "Табылмады" }
    
    if (target.teacherId !== user.id && target.teacherId !== null) {
      return { error: "Рұқсат етілмеген" }
    }

    await prisma.assessment.update({
      where: { id },
      data: { isPublished }
    })
    
    revalidatePath("/teacher/assessments")
    revalidatePath("/student/tests")
    return { success: true }
  } catch (err: any) {
    return { error: err.message }
  }
}
