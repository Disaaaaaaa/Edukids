import { prisma } from "@/lib/db";
import { AssessmentBuilder } from "@/components/AssessmentBuilder";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { auth } from "@/auth";

export const metadata = {
  title: "Тестті Өзгерту | Мұғалім Панелі",
};

export default async function EditAssessmentPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  const resolvedParams = await Promise.resolve(params);
  const id = resolvedParams.id;

  const session = await auth();
  if (!session?.user?.email) return notFound();

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return notFound();

  const assessment = await prisma.assessment.findUnique({
    where: { id },
    include: { tasks: { orderBy: { order_index: "asc" } } }
  });

  if (!assessment) return notFound();

  if (assessment.teacherId !== user.id && assessment.teacherId !== null) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <h2 className="text-2xl font-bold mb-2">Рұқсат етілмеген</h2>
        <p className="text-muted-foreground mb-6">Бұл тестті өзгертуге сіздің құқығыңыз жоқ. Ол басқа мұғалімге тиесілі.</p>
        <Link href="/teacher/assessments" className="text-primary hover:underline"> Артқа қайту</Link>
      </div>
    );
  }

  const criteriaList = await prisma.criteria.findMany({
    orderBy: { program_type: 'asc' }
  });

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div className="flex items-center gap-4">
        <Link href="/teacher/assessments" className="hover:bg-muted p-2 rounded-full transition-colors">
          <ChevronLeft className="size-5 text-muted-foreground" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Тестті Редакциялау</h1>
          <p className="text-muted-foreground mt-1">Оқушыларға арналған сұрақтар мен мәліметтерді өзгертіңіз.</p>
        </div>
      </div>

      <div className="bg-card border rounded-2xl shadow-sm overflow-hidden p-6 md:p-8">
        <AssessmentBuilder criteriaList={criteriaList} initialData={assessment} />
      </div>
    </div>
  );
}
