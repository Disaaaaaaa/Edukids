import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { ProfileForm } from "@/components/ProfileForm"
import { notFound } from "next/navigation"
import { Users } from "lucide-react"

export const metadata = { title: "Жеке профиль | Оқушы" }

export default async function StudentProfilePage() {
  const session = await auth()
  if (!session?.user?.email) notFound()

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  })

  const teachers = await prisma.user.findMany({
    where: { role: "teacher" },
    select: { id: true, name: true }
  })

  if (!user) notFound()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Users className="size-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Жеке профиль</h1>
          <p className="text-muted-foreground mt-2">Жеке деректеріңіз бен құпиясөзді басқару.</p>
        </div>
      </div>

      <ProfileForm user={user} teachers={teachers} />
    </div>
  )
}
