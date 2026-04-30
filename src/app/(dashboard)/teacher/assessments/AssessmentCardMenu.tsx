"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { MoreVertical, Edit, EyeOff, Eye, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { deleteAssessmentAction, togglePublishAction } from "@/app/actions/manage_assessments"

export function AssessmentCardMenu({ id, isPublished, canEdit }: { id: string, isPublished: boolean, canEdit: boolean }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  if (!canEdit) return null

  const handleTogglePublish = () => {
    startTransition(async () => {
      await togglePublishAction(id, !isPublished)
    })
  }

  const handleDelete = () => {
    if (!confirm("Тестті өшіруге сенімдісіз бе? Бұл әрекетті қайтара алмайсыз.")) return
    startTransition(async () => {
      await deleteAssessmentAction(id)
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 w-8 -mr-2 text-muted-foreground" disabled={isPending}>
        <MoreVertical className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => router.push(`/teacher/assessments/${id}/edit`)} className="cursor-pointer">
          <Edit className="mr-2 h-4 w-4" /> Редакциялау
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleTogglePublish} className="cursor-pointer">
          {isPublished ? (
            <><EyeOff className="mr-2 h-4 w-4 text-orange-500" /> Жасыру (Тағайындамау)</>
          ) : (
            <><Eye className="mr-2 h-4 w-4 text-green-500" /> Жариялау (Тағайындау)</>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDelete} className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer">
          <Trash2 className="mr-2 h-4 w-4" /> Өшіру
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
