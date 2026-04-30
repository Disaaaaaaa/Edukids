import { prisma } from "@/lib/db";
import { AssessmentBuilder } from "@/components/AssessmentBuilder";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const metadata = {
  title: "Жаңа Тест Құру | Мұғалім Панелі",
};

export default async function NewAssessmentPage() {
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
          <h1 className="text-3xl font-bold tracking-tight">Жаңа тапсырма құрастыру</h1>
          <p className="text-muted-foreground mt-1">Оқушыларға арналған тест параметрлері мен сұрақтарын енгізіңіз.</p>
        </div>
      </div>

      <div className="bg-card border rounded-2xl shadow-sm overflow-hidden p-6 md:p-8">
        <AssessmentBuilder criteriaList={criteriaList} />
      </div>
    </div>
  );
}
