"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { updateProfileAction } from "@/app/actions/profile"
import { useActionState } from "react"

type ActionState = {
  error?: string;
  success?: boolean;
  message?: string;
}

const initialState: ActionState = {}

export function ProfileForm({ user, teachers = [] }: { user: any, teachers?: any[] }) {
  const [state, formAction, isPending] = useActionState(updateProfileAction, initialState)

  return (
    <form action={formAction} className="space-y-6 max-w-xl bg-card p-6 md:p-8 rounded-2xl shadow-sm border">
      <div className="space-y-2">
        <Label htmlFor="name">Аты-жөні</Label>
        <Input id="name" name="name" type="text" defaultValue={user.name || ""} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Электронды пошта</Label>
        <Input id="email" name="email" type="email" defaultValue={user.email || ""} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Жаңа құпиясөз (Міндетті емес)</Label>
        <Input id="password" name="password" type="password" placeholder="Өзгертпеу үшін бос қалдырыңыз" />
      </div>

      {user.role === "student" && teachers.length > 0 && (
        <div className="space-y-2">
          <Label htmlFor="teacherId">Мұғаліміңіз</Label>
          <Select name="teacherId" defaultValue={user.teacherId || undefined}>
            <SelectTrigger>
              <SelectValue placeholder="Мұғалімді таңдаңыз" />
            </SelectTrigger>
            <SelectContent>
              {teachers.map((t: any) => (
                <SelectItem key={t.id} value={t.id}>{t.name || "Белгісіз"}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {state?.error && (
        <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md font-medium">
          {state.error}
        </div>
      )}

      {state?.success && (
        <div className="p-3 text-sm text-green-600 bg-green-500/10 rounded-md font-medium">
          {state.message}
        </div>
      )}

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Сақталуда..." : "Өзгерістерді сақтау"}
      </Button>
    </form>
  )
}
