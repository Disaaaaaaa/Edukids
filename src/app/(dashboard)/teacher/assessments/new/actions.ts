"use server"

import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { auth } from "@/auth"

export type CreateAssessmentPayload = {
  title: string;
  description: string;
  program_type: string;
  duration: number;
  tasks: {
    prompt: string;
    type: string;
    options: string[];
    correctAnswer: string;
    criteriaId: string | null;
  }[];
}

export async function createAssessmentAction(data: CreateAssessmentPayload) {
  try {
    const session = await auth()
    if (!session?.user?.email) return { error: "Рұқсат етілмеген" }
    
    const user = await prisma.user.findUnique({ where: { email: session.user.email } })
    if (!user) return { error: "Тіркелгі табылмады" }

    if (!data.title || !data.program_type || !data.duration || data.tasks.length === 0) {
      return { error: "Барлық негізгі жолақтарды және кем дегенде бір сұрақ толтырылуы қажет." }
    }

    const assessment = await prisma.assessment.create({
      data: {
        title: data.title,
        program_type: data.program_type,
        type: "CUSTOM",
        grade_level: 4,
        difficulty: "MEDIUM",
        duration: data.duration,
        teacherId: user.id,
        isPublished: true,
        tasks: {
          create: data.tasks.map((t, idx) => ({
            title: `Сұрақ ${idx + 1}`,
            content: t.prompt,
            question_type: t.type,
            options: t.options.length > 0 ? t.options : [],
            correct_answer: t.correctAnswer,
            explanation: "",
            max_score: 1,
            criteria_id: t.criteriaId || "",
            order_index: idx
          }))
        }
      }
    })

    revalidatePath("/teacher/assessments")
    return { success: true, assessmentId: assessment.id }
  } catch (err) {
    console.error(err)
    return { error: `Сақтау барысында қате пайда болды: ${err instanceof Error ? err.message : String(err)}` }
  }
}

export async function updateAssessmentAction(id: string, data: CreateAssessmentPayload) {
  try {
    const session = await auth()
    if (!session?.user?.email) return { error: "Рұқсат жоқ" }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } })
    if (!user) return { error: "Қате" }

    const target = await prisma.assessment.findUnique({ where: { id } })
    if (!target) return { error: "Тест табылмады" }
    if (target.teacherId !== user.id && target.teacherId !== null) {
      return { error: "Бұл тестті өзгертуге құқығыңыз жоқ" }
    }

    if (!data.title || !data.program_type || !data.duration || data.tasks.length === 0) {
      return { error: "Дұрыс толтырылмаған" }
    }

    await prisma.$transaction(async (tx: any) => {
      // 1. Delete all old tasks
      await tx.task.deleteMany({ where: { assessment_id: id } })
      
      // 2. Update Assessment AND create new tasks via nested create
      await tx.assessment.update({
        where: { id },
        data: {
          title: data.title,
          program_type: data.program_type,
          duration: data.duration,
          tasks: {
            create: data.tasks.map((t, idx) => ({
              title: `Сұрақ ${idx + 1}`,
              content: t.prompt,
              question_type: t.type,
              options: t.options.length > 0 ? t.options : [],
              correct_answer: t.correctAnswer,
              explanation: "",
              max_score: 1,
              criteria_id: t.criteriaId || "",
              order_index: idx
            }))
          }
        }
      })
    })

    revalidatePath("/teacher/assessments")
    revalidatePath("/student/tests")
    return { success: true }
  } catch (err: any) {
    return { error: `Өзгерту барысында қате: ${err.message}` }
  }
}
