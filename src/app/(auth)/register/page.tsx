import { RegisterForm } from "./RegisterForm"
import Link from "next/link"
import { prisma } from "@/lib/db"
import type { Metadata } from "next"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Тіркелу | EduAssessment-Kids",
  description: "Жаңа аккаунт жасау парақшасы",
}

export default async function RegisterPage() {
  const teachers = await prisma.user.findMany({
    where: { role: "teacher" },
    select: { id: true, name: true }
  });

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-4rem)] p-4">
      <div className="w-full max-w-md p-8 bg-card rounded-2xl shadow-sm border">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold tracking-tight">Жүйеге тіркелу</h1>
          <p className="text-muted-foreground text-sm mt-2">
            Жаңа аккаунт құру үшін төмендегі форманы толтырыңыз
          </p>
        </div>

        <RegisterForm teachers={teachers} />

        <div className="mt-6 text-center text-sm">
          Затияңыз бар ма?{" "}
          <Link href="/login" className="text-primary hover:underline font-medium">
            Кіру
          </Link>
        </div>
      </div>
    </div>
  )
}
