import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { ProfileForm } from "@/components/ProfileForm"
import { notFound } from "next/navigation"
import { UserCircle } from "lucide-react"

export const metadata = { title: "Жеке профиль | Мұғалім" }

export default async function TeacherProfilePage() {
  const session = await auth()
  if (!session?.user?.email) notFound()

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  })

  if (!user) notFound()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <UserCircle className="size-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Мәліметтер бөлмесі</h1>
          <p className="text-muted-foreground mt-2">Мұғалімнің жеке аккаунт мәліметтері мен қауіпсіздік параметрлері.</p>
        </div>
      </div>

      <ProfileForm user={user} />
    </div>
  )
}
