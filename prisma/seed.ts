import 'dotenv/config'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { MOCK_CRITERIA, MOCK_ASSESSMENTS } from '../src/lib/mockData'

const connectionString = process.env.DATABASE_URL
const pool = new Pool({ connectionString })
// @ts-expect-error Type mismatch
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

const MOCK_USERS = [
  { id: "1", name: "Оқушы (Айдын)", email: "student@test.com", role: "student", password: "password" },
  { id: "2", name: "Мұғалім (Гүлнар)", email: "teacher@test.com", role: "teacher", password: "password" },
  { id: "3", name: "Әкімші (Admin)", email: "admin@test.com", role: "admin", password: "password" },
]

async function main() {
  console.log('Seeding database with mock data...')

  // Insert Users
  for (const user of MOCK_USERS) {
    const hashedPassword = await bcrypt.hash(user.password, 10)
    await prisma.user.upsert({
      where: { email: user.email },
      update: { password: hashedPassword },
      create: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        password: hashedPassword
      }
    })
  }

  // Insert Criteria and Descriptors
  for (const criteria of MOCK_CRITERIA) {
    await prisma.criteria.upsert({
      where: { id: criteria.id },
      update: {},
      create: {
        id: criteria.id,
        title: criteria.title,
        description: criteria.description,
        program_type: criteria.program_type,
        descriptors: {
          create: criteria.descriptors.map(d => ({
            id: d.id,
            description: d.description,
            score_value: d.score_value
          }))
        }
      }
    })
  }

  // Insert Assessments and Tasks
  for (const assessment of MOCK_ASSESSMENTS) {
    await prisma.assessment.upsert({
      where: { id: assessment.id },
      update: {},
      create: {
        id: assessment.id,
        title: assessment.title,
        type: assessment.type,
        program_type: assessment.program_type,
        grade_level: assessment.grade_level,
        difficulty: assessment.difficulty,
        duration: assessment.duration,
        tasks: {
          create: assessment.tasks.map(task => ({
            id: task.id,
            title: task.title,
            content: task.content,
            question_type: task.question_type,
            options: task.options || [],
            correct_answer: task.correct_answer,
            explanation: task.explanation,
            max_score: task.max_score,
            criteria_id: task.criteria_id,
            order_index: task.order_index
          }))
        }
      }
    })
  }

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
