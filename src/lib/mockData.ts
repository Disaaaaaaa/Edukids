export type ProgramType = "PISA" | "TIMSS" | "PIRLS" | "DIAGNOSTIC";
export type QuestionType = "SINGLE_CHOICE" | "MULTIPLE_CHOICE" | "SHORT_ANSWER" | "OPEN_ENDED";

export interface Descriptor {
  id: string;
  criteria_id: string;
  description: string;
  score_value: number;
}

export interface Criteria {
  id: string;
  title: string;
  description: string;
  program_type: ProgramType;
  descriptors: Descriptor[];
}

export interface Task {
  id: string;
  assessment_id: string;
  title: string;
  content: string;
  question_type: QuestionType;
  options?: string[]; // strictly for single/multiple choice
  correct_answer: string;
  explanation: string;
  max_score: number;
  criteria_id: string;
  order_index: number;
}

export interface Assessment {
  id: string;
  title: string;
  type: "diagnostic" | "formative" | "summative";
  program_type: ProgramType;
  grade_level: number;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  duration: number; // in minutes
  tasks: Task[];
}

// ========================
// MOCK DATA
// ========================

export const MOCK_CRITERIA: Criteria[] = [
  {
    id: "c-pirls-1",
    title: "Мәтін мазмұнын түсіну",
    description: "Мәтіндегі негізгі ойды және нақты фактілерді таба алады.",
    program_type: "PIRLS",
    descriptors: [
      { id: "d-pirls-1-1", criteria_id: "c-pirls-1", description: "Нақты жауапты мәтіннен табады", score_value: 1 },
      { id: "d-pirls-1-2", criteria_id: "c-pirls-1", description: "Жанама тұспалдарды түсінеді", score_value: 1 },
    ],
  },
  {
    id: "c-timss-1",
    title: "Математикалық логика",
    description: "Есептің шартын дұрыс талдап, шешім табады.",
    program_type: "TIMSS",
    descriptors: [
      { id: "d-timss-1-1", criteria_id: "c-timss-1", description: "Дұрыс амалды таңдайды", score_value: 1 },
      { id: "d-timss-1-2", criteria_id: "c-timss-1", description: "Есептеуді қатесіз орындайды", score_value: 1 },
    ],
  },
  {
    id: "c-pisa-1",
    title: "Өмірлік жағдайларды талдау",
    description: "График/кесте мәліметтерін өмірлік мәселелерді шешуде қолданады.",
    program_type: "PISA",
    descriptors: [
      { id: "d-pisa-1-1", criteria_id: "c-pisa-1", description: "Графикті дұрыс оқиды", score_value: 1 },
      { id: "d-pisa-1-2", criteria_id: "c-pisa-1", description: "Дұрыс қорытынды жасайды", score_value: 2 },
    ],
  }
];

export const MOCK_ASSESSMENTS: Assessment[] = [
  {
    id: "a-diag-1",
    title: "Бастапқы диагностикалық тест",
    type: "diagnostic",
    program_type: "DIAGNOSTIC",
    grade_level: 4,
    difficulty: "EASY",
    duration: 15,
    tasks: [
      {
        id: "t-1",
        assessment_id: "a-diag-1",
        title: "PIRLS - Оқу сауаттылығы",
        content: "Асхат күнде таңертең өзен жағасына барып, құстарға жем шашатын. Бірде ол жағалауда жалғыз өзі мұңайып тұрған кішкентай құлынды көрді. Асхат оған жақындап, қолындағы нан сынығын ұсынды. Мәтінге қарап, Асхатты қандай бала деп сипаттауға болады?",
        question_type: "SINGLE_CHOICE",
        options: ["Қатыгез", "Жалқау", "Мейірімді", "Қорқақ"],
        correct_answer: "Мейірімді",
        explanation: "Ол құстарға жем шашып, құлынға нан бергендіктен, мейірімді деп сипатталады.",
        max_score: 1,
        criteria_id: "c-pirls-1",
        order_index: 1,
      },
      {
        id: "t-2",
        assessment_id: "a-diag-1",
        title: "TIMSS - Логика",
        content: "Аружан 800 теңгеге кітап және 200 теңгеге дәптер сатып алды. Ол сатушыға 2000 теңге берді. Сатушы Аружанға қанша қайтарым беруі керек?",
        question_type: "SINGLE_CHOICE",
        options: ["1000 теңге", "800 теңге", "1200 теңге", "900 теңге"],
        correct_answer: "1000 теңге",
        explanation: "Сатып алынған заттардың жалпы құны: 800 + 200 = 1000 теңге. Қайтарым: 2000 - 1000 = 1000 теңге.",
        max_score: 2,
        criteria_id: "c-timss-1",
        order_index: 2,
      },
      {
        id: "t-3",
        assessment_id: "a-diag-1",
        title: "PISA - Өмірлік жағдаят",
        content: "Кестеде 3 дүкеннің алма бағасы берілген. А дүкені - 1кг 500тг. Б дүкені - 2кг 900тг. В дүкені - 3кг 1200тг. Қай дүкеннің алмасы ең арзан?",
        question_type: "SINGLE_CHOICE",
        options: ["А дүкені", "Б дүкені", "В дүкені", "Бәрі бірдей"],
        correct_answer: "В дүкені",
        explanation: "А: 500тг/кг. Б: 900/2=450тг/кг. В: 1200/3=400тг/кг. В дүкені ең арзан.",
        max_score: 3,
        criteria_id: "c-pisa-1",
        order_index: 3,
      }
    ]
  }
];
