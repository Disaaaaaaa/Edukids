"use client"

import { useActionState } from "react"
import { loginAction } from "@/app/(auth)/login/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export function LoginForm() {
  const [errorMessage, dispatch, isPending] = useActionState(loginAction, undefined)

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardHeader className="space-y-2 text-center">
        <div className="flex justify-center mb-4 text-primary text-4xl">🎯</div>
        <CardTitle className="text-3xl font-bold">Кіру</CardTitle>
        <CardDescription>
          EduKids платформасына қош келдіңіз! (Тест үшін: student@test.com / password)
        </CardDescription>
      </CardHeader>
      <form action={dispatch}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email адресі</Label>
            <Input id="email" name="email" type="email" placeholder="Сенің email-ың" required disabled={isPending} />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Құпиясөз</Label>
              <a href="#" className="text-sm font-medium text-primary hover:underline">Құпиясөзді ұмыттыңыз ба?</a>
            </div>
            <Input id="password" name="password" type="password" required disabled={isPending} />
          </div>
          
          {errorMessage && (
            <div className="text-sm font-medium text-destructive mt-2" aria-live="polite">
              {errorMessage}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" size="lg" disabled={isPending}>
            {isPending ? "Жүктелуде..." : "Жүйеге кіру"}
          </Button>
          <div className="text-sm text-center text-muted-foreground w-full">
            Аккаунтыңыз жоқ па?{" "}
            <a href="/register" className="font-semibold text-primary hover:underline">Тіркелу</a>
          </div>
        </CardFooter>
      </form>
    </Card>
  )
}
