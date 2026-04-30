"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { registerAction } from "./actions"
import { useActionState, useState } from "react"

const initialState = {
  error: ""
}

export function RegisterForm({ teachers = [] }: { teachers?: any[] }) {
  const [state, formAction, isPending] = useActionState(registerAction, initialState)
  const [role, setRole] = useState("student")

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Аты-жөні</Label>
        <Input 
          id="name" 
          name="name" 
          type="text" 
          placeholder="Мысалы: Айбек Серіков" 
          required 
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Электронды пошта</Label>
        <Input 
          id="email" 
          name="email" 
          type="email" 
          placeholder="ocushy@mektep.kz" 
          required 
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Құпиясөз</Label>
        <Input 
          id="password" 
          name="password" 
          type="password" 
          required 
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="role">Рөлі</Label>
        <Select name="role" defaultValue="student" required onValueChange={(val) => setRole(val || "student")}>
          <SelectTrigger>
            <SelectValue placeholder="Таңдаңыз" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="student">Оқушы</SelectItem>
            <SelectItem value="teacher">Мұғалім</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {role === "student" && teachers && teachers.length > 0 && (
        <div className="space-y-2">
          <Label htmlFor="teacherId">Мұғаліміңізді таңдаңыз</Label>
          <Select name="teacherId" required>
            <SelectTrigger>
              <SelectValue placeholder="Мұғалімді таңдаңыз" />
            </SelectTrigger>
            <SelectContent>
              {teachers.map((t) => (
                <SelectItem key={t.id} value={t.id}>{t.name || "Белгісіз мұғалім"}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {state?.error && (
        <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
          {state.error}
        </div>
      )}

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Тіркелуде..." : "Тіркелу"}
      </Button>
    </form>
  )
}
