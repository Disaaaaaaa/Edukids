import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { notFound } from "next/navigation"
import { ShopClient } from "./ShopClient"

export const metadata = { title: "Виртуалды Дүкен | EduKids" }

export default async function StudentShopPage() {
  const session = await auth()
  if (!session?.user?.email) notFound()

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  })

  if (!user || user.role !== "student") notFound()

  return (
    <ShopClient 
      xp={user.xp}
      purchasedItems={user.purchasedItems}
      equippedAvatar={user.equippedAvatar}
      equippedBorder={user.equippedBorder}
      equippedTitle={user.equippedTitle}
    />
  )
}
