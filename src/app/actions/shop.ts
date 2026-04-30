"use server"

import { prisma } from "@/lib/db"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import { SHOP_ITEMS } from "@/lib/shop"

export async function buyItemAction(itemId: string) {
  const session = await auth()
  if (!session?.user?.email) return { error: "Алдымен жүйеге кіріңіз" }

  const item = SHOP_ITEMS.find(i => i.id === itemId)
  if (!item) return { error: "Зат табылмады" }

  try {
    const user = await prisma.user.findUnique({ where: { email: session.user.email } })
    if (!user) return { error: "Тіркелгі табылмады" }

    if (user.purchasedItems.includes(itemId)) {
      return { error: "Бұл затты сіз бұрын сатып алғансыз!" }
    }

    if (user.xp < item.price) {
      return { error: "Жеткілікті ұпайыңыз (XP) жоқ!" }
    }

    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: {
          xp: { decrement: item.price },
          purchasedItems: { push: itemId }
        }
      })
    ])

    revalidatePath("/student/shop")
    revalidatePath("/student/dashboard")
    return { success: true, message: `«${item.name}» сәтті сатып алынды!` }
  } catch (err: any) {
    return { error: err.message || "Мәліметтер базасында қате шықты" }
  }
}

export async function equipItemAction(itemId: string, type: string) {
  const session = await auth()
  if (!session?.user?.email) return { error: "Авторизация қажет" }

  try {
    const user = await prisma.user.findUnique({ where: { email: session.user.email } })
    if (!user) return { error: "Тіркелгі табылмады" }

    if (!user.purchasedItems.includes(itemId)) {
      return { error: "Бұл зат сізде жоқ!" }
    }

    const data: any = {}
    if (type === "AVATAR") data.equippedAvatar = itemId
    if (type === "BORDER") data.equippedBorder = itemId
    if (type === "TITLE") data.equippedTitle = itemId

    await prisma.user.update({
      where: { id: user.id },
      data
    })

    revalidatePath("/student/shop")
    revalidatePath("/student/dashboard")
    return { success: true, message: "Сәтті киілді!" }
  } catch (err: any) {
    return { error: err.message || "Қате орын алды" }
  }
}
