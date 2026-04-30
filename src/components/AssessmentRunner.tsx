"use client"

import { useState } from "react"
import { Assessment, Task, MOCK_CRITERIA } from "@/lib/mockData"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { buttonVariants } from "@/components/ui/button"
import { saveAssessmentResult } from "@/app/(dashboard)/student/tests/[id]/actions"

export function AssessmentRunner({ assessment, allCriteria, previousAttempts = 0 }: { assessment: any, allCriteria: any[], previousAttempts?: number }) {
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [isCompleted, setIsCompleted] = useState(false)

  const [isSaving, setIsSaving] = useState(false)

  const tasks = assessment.tasks
  const currentTask = tasks[currentIndex]
  const progressPercent = ((currentIndex) / tasks.length) * 100

  const handleNext = async () => {
    if (currentIndex < tasks.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      setIsSaving(true)
      const finalScore = tasks.reduce((acc: number, task: any) => {
        const isCorrect = answers[task.id] === task.correct_answer
        return acc + (isCorrect ? (Number(task.max_score) || 1) : 0)
      }, 0)
      const finalMaxScore = tasks.reduce((acc: number, task: any) => acc + (Number(task.max_score) || 1), 0)
      const percentage = Math.round((finalScore / Math.max(finalMaxScore, 1)) * 100) || 0
      
      const result = await saveAssessmentResult(assessment.id, answers, finalScore, finalMaxScore, percentage)
      if (!result.success) {
        alert("Қате (Error): " + result.error + "\nScore: " + finalScore)
        setIsSaving(false)
        return
      }

      router.refresh() // Invalidate the client-side router cache so the dashboard definitely requests the updated XP from DB
      setIsSaving(false)
      setIsCompleted(true)
    }
  }

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const handleOptionSelect = (val: string) => {
    setAnswers({ ...answers, [currentTask.id]: val })
  }

  if (isCompleted) {
    // Calculate simple result
    const score = tasks.reduce((acc: number, task: any) => {
      const isCorrect = answers[task.id] === task.correct_answer
      return acc + (isCorrect ? (Number(task.max_score) || 1) : 0)
    }, 0)
    const maxPossibleScore = tasks.reduce((acc: number, task: any) => acc + (Number(task.max_score) || 1), 0)
    const percentage = Math.round((score / Math.max(maxPossibleScore, 1)) * 100) || 0
    const baseGainedXp = score * 10;
    const gainedXp = previousAttempts > 0 ? Math.floor(baseGainedXp / 3) : baseGainedXp;

    return (
      <div className="max-w-2xl mx-auto mt-10 space-y-8">
        <Card className="shadow-lg border-primary/20">
          <CardHeader className="text-center space-y-4 pb-8">
            <div className="text-6xl mb-2">{percentage > 70 ? "🏆" : "💪"}</div>
            <CardTitle className="text-3xl font-bold">Тест аяқталды!</CardTitle>
            <p className="text-muted-foreground text-lg">Жалпы нәтижеңіз: {percentage}%</p>
            <div className="inline-flex flex-col items-center justify-center bg-yellow-400/20 text-yellow-600 px-6 py-4 rounded-xl mt-4 border border-yellow-400/50 shadow-sm mx-auto">
              <span className="font-bold text-xl">✨ +{gainedXp} XP жинадыңыз!</span>
              {previousAttempts > 0 && (
                <span className="text-sm font-medium mt-1 opacity-80">(Бұл қайта тапсырылғандықтан XP 3 есе азайтылды)</span>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <h3 className="font-bold text-xl border-b pb-2">Сұрақтарды талдау:</h3>
            <div className="space-y-4">
              {tasks.map((task: any, i: number) => {
                const isCorrect = answers[task.id] === task.correct_answer
                const criteria = allCriteria.find(c => c.id === task.criteria_id)
                return (
                  <div key={task.id} className={`p-4 rounded-xl border ${isCorrect ? "bg-secondary/10 border-secondary/30" : "bg-destructive/5 border-destructive/20"}`}>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="font-semibold">{i + 1}. {task.title}</div>
                        <div className="text-sm mt-1">Критерий: {criteria?.title}</div>
                        {!isCorrect && (
                          <div className="mt-3 text-sm p-3 bg-background rounded-lg border border-destructive/10">
                            <span className="font-semibold text-destructive">Қате:</span> Түсіндірме: {task.explanation}
                          </div>
                        )}
                        {isCorrect && (
                          <div className="mt-2 text-sm text-secondary-foreground font-medium">Тура табу! Жарайсың!</div>
                        )}
                      </div>
                      <div className="text-2xl flex-shrink-0">
                        {isCorrect ? "✅" : "❌"}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
          <CardFooter className="flex justify-center pt-6">
            <a href="/student/dashboard" className={buttonVariants({ size: "lg" })}>
              Басты бетке оралу
            </a>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto mt-6 space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between text-sm font-medium text-muted-foreground">
          <span>{assessment.title}</span>
          <span>{currentIndex + 1} / {tasks.length}</span>
        </div>
        <Progress value={progressPercent} className="h-2" />
      </div>

      <Card className="shadow-md">
        <CardHeader className="bg-muted/30 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">{currentTask.title}</h2>
            <span className="text-sm px-3 py-1 bg-primary/10 text-primary rounded-full font-semibold">
              Сұрақ {currentIndex + 1}
            </span>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-8">
          <p className="text-lg leading-relaxed whitespace-pre-line">{currentTask.content}</p>

          {(currentTask.question_type === "SINGLE_CHOICE" || currentTask.question_type === "MULTIPLE_CHOICE") && currentTask.options && currentTask.options.length > 0 && (
            <div className="space-y-4">
              <RadioGroup 
                value={answers[currentTask.id] || ""} 
                onValueChange={handleOptionSelect}
                className="space-y-3"
              >
                {currentTask.options.map((option: string, idx: number) => (
                  <div key={idx} className="flex items-center space-x-3 border rounded-xl p-4 hover:bg-muted transition-colors [&:has([data-state=checked])]:bg-primary/5 [&:has([data-state=checked])]:border-primary">
                    <RadioGroupItem value={option} id={`option-${idx}`} />
                    <Label htmlFor={`option-${idx}`} className="flex-1 text-base cursor-pointer font-medium leading-tight">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between border-t bg-muted/10 p-4">
          <Button variant="outline" onClick={handlePrev} disabled={currentIndex === 0 || isSaving}>
            Артқа
          </Button>
          <Button onClick={handleNext} disabled={!answers[currentTask.id] || isSaving}>
            {isSaving ? "Сақталуда..." : (currentIndex === tasks.length - 1 ? "Аяқтау" : "Келесі")}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
