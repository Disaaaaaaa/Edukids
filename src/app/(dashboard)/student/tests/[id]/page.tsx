import { prisma } from "@/lib/db";
import { AssessmentRunner } from "@/components/AssessmentRunner";
import { notFound } from "next/navigation";
import { auth } from "@/auth";

export default async function TestPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  
  const assessment = await prisma.assessment.findUnique({
    where: { id },
    include: { tasks: { orderBy: { order_index: 'asc' } } }
  });

  if (!assessment) {
    notFound();
  }

  let previousAttemptsCount = 0;
  if (session?.user?.email) {
    const user = await prisma.user.findUnique({ where: { email: session.user.email }});
    if (user) {
      previousAttemptsCount = await prisma.studentResult.count({
        where: {
          userId: user.id,
          assessmentId: id
        }
      });
    }
  }

  const allCriteria = await prisma.criteria.findMany();

  return (
    <div className="pb-20">
      <AssessmentRunner assessment={assessment} allCriteria={allCriteria} previousAttempts={previousAttemptsCount} />
    </div>
  );
}
