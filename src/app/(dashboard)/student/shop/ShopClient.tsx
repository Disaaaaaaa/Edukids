"use client"

import { useState } from "react"
import { SHOP_ITEMS, ShopItem, ShopItemType } from "@/lib/shop"
import { buyItemAction, equipItemAction } from "@/app/actions/shop"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function ShopClient({ 
  xp, 
  purchasedItems, 
  equippedAvatar, 
  equippedBorder, 
  equippedTitle 
}: { 
  xp: number, 
  purchasedItems: string[], 
  equippedAvatar?: string | null,
  equippedBorder?: string | null,
  equippedTitle?: string | null
}) {
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const handleBuy = async (item: ShopItem) => {
    setLoadingId(item.id)
    const res = await buyItemAction(item.id)
    setLoadingId(null)
    if (res.error) alert(res.error)
    else alert(res.message)
  }

  const handleEquip = async (item: ShopItem) => {
    setLoadingId(item.id)
    const res = await equipItemAction(item.id, item.type)
    setLoadingId(null)
    if (res.error) alert(res.error)
  }

  const renderItems = (type: ShopItemType) => {
    const items = SHOP_ITEMS.filter(i => i.type === type)
    if (items.length === 0) return <div className="p-8 text-center text-muted-foreground">Бұл бөлімде заттар жоқ</div>

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map(item => {
          const isOwned = purchasedItems.includes(item.id)
          const isEquipped = equippedAvatar === item.id || equippedBorder === item.id || equippedTitle === item.id

          return (
            <Card key={item.id} className={`overflow-hidden ${isOwned ? "border-primary/50" : ""}`}>
              <CardHeader className="text-center pb-2 bg-muted/50">
                <CardTitle className="text-lg">{item.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center p-6 min-h-[160px]">
                {type === "AVATAR" && item.src && (
                  <img src={item.src} alt={item.name} className="w-24 h-24 rounded-full bg-primary/10 p-2" />
                )}
                {type === "BORDER" && (
                  <div className={`w-24 h-24 rounded-full bg-muted flex items-center justify-center ${item.cssClass}`}>
                    <span className="text-4xl">😎</span>
                  </div>
                )}
                {type === "TITLE" && (
                  <div className="text-xl font-bold text-center text-primary">{item.text}</div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between items-center bg-muted/20">
                <div className="font-bold text-lg">
                  {isOwned ? <Badge variant="secondary">Тиесілі</Badge> : <span className="text-accent-foreground">{item.price} XP</span>}
                </div>
                <div>
                  {!isOwned ? (
                    <Button 
                      onClick={() => handleBuy(item)} 
                      disabled={loadingId === item.id || xp < item.price}
                    >
                      {loadingId === item.id ? "..." : "Сатып алу"}
                    </Button>
                  ) : (
                    <Button 
                      variant={isEquipped ? "outline" : "default"}
                      onClick={() => handleEquip(item)}
                      disabled={loadingId === item.id || isEquipped}
                    >
                      {loadingId === item.id ? "..." : isEquipped ? "Киіліп тұр" : "Кию"}
                    </Button>
                  )}
                </div>
              </CardFooter>
            </Card>
          )
        })}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-card p-6 rounded-3xl border shadow-sm">
        <div>
          <h1 className="text-3xl font-black text-primary">Дүкен 🛍️</h1>
          <p className="text-muted-foreground mt-2 font-medium">Жинаған ұпайларыңды (XP) жұмсап, профиліңді түрлендір!</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-muted-foreground font-medium">Сенің балансың</div>
          <div className="text-4xl font-black text-accent-foreground">{xp} XP</div>
        </div>
      </div>

      <Tabs defaultValue="AVATAR" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8 h-14 rounded-2xl bg-muted/50 p-1">
          <TabsTrigger value="AVATAR" className="text-base font-bold rounded-xl">Аватарлар</TabsTrigger>
          <TabsTrigger value="BORDER" className="text-base font-bold rounded-xl">Бұрыштар</TabsTrigger>
          <TabsTrigger value="TITLE" className="text-base font-bold rounded-xl">Атақтар</TabsTrigger>
        </TabsList>
        <TabsContent value="AVATAR">{renderItems("AVATAR")}</TabsContent>
        <TabsContent value="BORDER">{renderItems("BORDER")}</TabsContent>
        <TabsContent value="TITLE">{renderItems("TITLE")}</TabsContent>
      </Tabs>
    </div>
  )
}
