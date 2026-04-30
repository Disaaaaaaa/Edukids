"use server"

import { prisma } from "@/lib/db"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"

export async function saveAssessmentResult(assessmentId: string, answers: Record<string, string>, score: number, maxScore: number, percentage: number) {
  try {
    const session = await auth()
    if (!session?.user?.email) return { success: false, error: "Not authenticated" }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } })
    if (!user) return { success: false, error: "User not found in DB" }

    const previousAttempts = await prisma.studentResult.count({
      where: {
        userId: user.id,
        assessmentId: assessmentId
      }
    });

    const baseGainedXp = score * 10;
    const gainedXp = previousAttempts > 0 ? Math.floor(baseGainedXp / 3) : baseGainedXp;

    // Calculate Streak
    const now = new Date();
    let newStreak = user.streakCount || 0;
    
    if (user.lastActiveAt) {
      const lastActiveDate = new Date(user.lastActiveAt);
      const todayTemp = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const lastActiveTemp = new Date(lastActiveDate.getFullYear(), lastActiveDate.getMonth(), lastActiveDate.getDate());
      
      const diffTime = todayTemp.getTime() - lastActiveTemp.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        newStreak += 1;
      } else if (diffDays > 1) {
        newStreak = 1;
      }
    } else {
      newStreak = 1;
    }

    // Save the result and increment XP synchronously using a database transaction
    await prisma.$transaction([
      prisma.studentResult.create({
        data: {
          userId: user.id,
          assessmentId,
          score,
          maxScore,
          percentage,
          answersJson: JSON.stringify(answers),
        }
      }),
      prisma.user.update({
        where: { id: user.id },
        data: { 
          xp: { increment: gainedXp },
          streakCount: Math.max(newStreak, 1),
          lastActiveAt: now
        }
      })
    ]);

    revalidatePath("/student/dashboard");
    revalidatePath("/student/results");
    revalidatePath("/teacher/results");

    return { success: true }
  } catch (error: any) {
    console.error("Failed to save result:", error)
    return { success: false, error: error?.message || "Database error" }
  }
}
