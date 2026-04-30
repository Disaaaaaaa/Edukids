"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Trash2, Save, GripVertical, Sparkles } from "lucide-react";
import { createAssessmentAction, updateAssessmentAction, CreateAssessmentPayload } from "@/app/(dashboard)/teacher/assessments/new/actions";
import { generateQuestionWithAI } from "@/app/(dashboard)/teacher/assessments/new/ai-action";
import { useRouter } from "next/navigation";

// Tүрлері
type Criteria = { id: string, title: string, program_type: string };

type TaskDraft = {
  id: string; // уақытша ID
  prompt: string;
  type: string;
  options: string[];
  correctAnswerIndex: number; // 0, 1, 2, 3...
  criteriaId: string | null;
}

export function AssessmentBuilder({ criteriaList, initialData }: { criteriaList: Criteria[], initialData?: any }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Негізгі ақпарат
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [programType, setProgramType] = useState(initialData?.program_type || "PISA");
  const [duration, setDuration] = useState(initialData?.duration?.toString() || "45");

  // AI генерациясы үшін
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAiPrompt, setShowAiPrompt] = useState(false);
  const [aiTopic, setAiTopic] = useState("");
  const [targetCriteriaId, setTargetCriteriaId] = useState<string>("");
  const [aiCount, setAiCount] = useState<number>(10);
  const [pisaDomain, setPisaDomain] = useState<string>("Барлық бағыттар (Толық Мок Тест)");
  const [timssDomain, setTimssDomain] = useState<string>("Барлық өлшемдер (Толық Мок Тест)");
  const [pirlsDomain, setPirlsDomain] = useState<string>("Барлық процестер (Толық Мок Тест)");

  // Тапсырмалар тізімі
  const [tasks, setTasks] = useState<TaskDraft[]>(
    initialData && initialData.tasks && initialData.tasks.length > 0
      ? initialData.tasks.map((t: any) => ({
          id: t.id,
          prompt: t.content,
          type: t.question_type,
          options: t.options,
          correctAnswerIndex: Math.max(0, t.options.indexOf(t.correct_answer)),
          criteriaId: t.criteria_id
        }))
      : [{
          id: "task-1",
          prompt: "",
          type: "MULTIPLE_CHOICE",
          options: ["", "", "", ""],
          correctAnswerIndex: 0,
          criteriaId: null,
        }]
  );

  const addTask = () => {
    setTasks([...tasks, {
      id: `task-${Date.now()}`,
      prompt: "",
      type: "MULTIPLE_CHOICE",
      options: ["", "", "", ""],
      correctAnswerIndex: 0,
      criteriaId: null,
    }]);
  };

  const removeTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const updateTask = (id: string, updates: Partial<TaskDraft>) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const updateOption = (taskId: string, optionIndex: number, value: string) => {
    setTasks(tasks.map(t => {
      if (t.id === taskId) {
        const newOptions = [...t.options];
        newOptions[optionIndex] = value;
        return { ...t, options: newOptions };
      }
      return t;
    }));
  };

  const handleGenerateAI = async () => {
    if (!aiTopic || !targetCriteriaId) {
      setError("AI сұрағын генерациялау үшін тақырып пен критерийді міндетті түрде таңдаңыз.");
      return;
    }
    setError(null);
    setIsGenerating(true);
    const criteriaName = filteredCriteria.find(c => c.id === targetCriteriaId)?.title;
    const res = await generateQuestionWithAI(
      aiTopic, 
      programType, 
      criteriaName, 
      aiCount, 
      programType === "PISA" ? pisaDomain : (programType === "TIMSS" ? timssDomain : (programType === "PIRLS" ? pirlsDomain : undefined))
    );
    setIsGenerating(false);

    if (res.error) {
      setError(res.error);
      return;
    }

    if (res.success && res.tasks) {
      const newTasks = res.tasks.map((t, i) => ({
        id: `task-${Date.now()}-${i}`,
        prompt: t.prompt,
        type: "MULTIPLE_CHOICE",
        options: t.options,
        correctAnswerIndex: t.correctAnswerIndex,
        criteriaId: targetCriteriaId
      }));
      setTasks([...tasks, ...newTasks]);
      setShowAiPrompt(false);
      setAiTopic("");
      setTargetCriteriaId("");
      setAiCount(10);
    }
  };

  const handleSave = async () => {
    setError(null);
    setIsSubmitting(true);

    // Валидация
    if (!title.trim() || tasks.length === 0) {
      setError("Тест атауы мен ең аз дегенде 1 сұрақ болуы керек.");
      setIsSubmitting(false);
      return;
    }

    for (let i = 0; i < tasks.length; i++) {
      const t = tasks[i];
      if (!t.prompt.trim()) {
        setError(`${i + 1}-сұрақтың мәтінін жазыңыз.`);
        setIsSubmitting(false); return;
      }
      if (t.options.some(o => !o.trim())) {
        setError(`${i + 1}-сұрақтың барлық жауап нұсқаларын толтырыңыз.`);
        setIsSubmitting(false); return;
      }
      if (!t.criteriaId) {
        setError(`${i + 1}-сұраққа бағалау критерийін таңдаңыз.`);
        setIsSubmitting(false); return;
      }
    }

    const payload: CreateAssessmentPayload = {
      title,
      description,
      program_type: programType,
      duration: parseInt(duration, 10) || 45,
      tasks: tasks.map(t => ({
        prompt: t.prompt,
        type: t.type,
        options: t.options,
        correctAnswer: t.options[t.correctAnswerIndex],
        criteriaId: t.criteriaId
      }))
    };

    let result;
    if (initialData) {
      result = await updateAssessmentAction(initialData.id, payload);
    } else {
      result = await createAssessmentAction(payload);
    }
    
    if (result.error) {
      setError(result.error);
      setIsSubmitting(false);
    } else {
      router.push("/teacher/assessments");
    }
  };

  // Тек таңдалған бағдарламаға сай критерийлерді көрсету
  const filteredCriteria = criteriaList.filter(c => c.program_type === programType);

  return (
    <div className="space-y-8">
      {/* Негізгі Ақпарат */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Тест атауы</Label>
          <Input 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            placeholder="Мысалы: Оқу сауаттылығы бойынша 1-тарау" 
          />
        </div>
        
        <div className="space-y-2">
          <Label>Бағдарлама түрі</Label>
          <Select value={programType} onValueChange={(val: string | null) => {
            if (val) {
              setProgramType(val);
              // Бағдарлама ауысса критерийлерді нөлдеу
              setTasks(tasks.map(t => ({...t, criteriaId: null})));
            }
          }}>
            <SelectTrigger><SelectValue/></SelectTrigger>
            <SelectContent>
              <SelectItem value="PISA">PISA</SelectItem>
              <SelectItem value="TIMSS">TIMSS</SelectItem>
              <SelectItem value="PIRLS">PIRLS</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label>Сипаттама (міндетті емес)</Label>
          <Textarea 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            placeholder="Оқушыларға арналған қысқаша нұсқаулық..." 
            className="h-20"
          />
        </div>

        <div className="space-y-2">
          <Label>Ұзақтығы (минут)</Label>
          <Input 
            type="number" 
            value={duration} 
            onChange={(e) => setDuration(e.target.value)} 
            min={5} max={180}
          />
        </div>
      </div>

      <hr className="my-8" />

      {/* Сұрақтар блогы */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Сұрақтар мен Тапсырмалар</h2>
        
        {tasks.map((task, index) => (
          <Card key={task.id} className="relative border-2 border-muted">
            <CardHeader className="flex flex-row items-center justify-between pb-4 space-y-0">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <GripVertical className="size-4 text-muted-foreground cursor-move" />
                Сұрақ №{index + 1}
              </CardTitle>
              {tasks.length > 1 && (
                <Button variant="ghost" size="icon" className="text-destructive h-8 w-8" onClick={() => removeTask(task.id)}>
                  <Trash2 className="size-4" />
                </Button>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              
              {/* Сұрақ мәтіні мен Критерий */}
              <div className="grid md:grid-cols-3 gap-4">
                <div className="md:col-span-2 space-y-2">
                  <Label>Сұрақ / Мәтін</Label>
                  <Textarea 
                    value={task.prompt} 
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateTask(task.id, { prompt: e.target.value })}
                    placeholder="Бұл жерге тапсырманың мәтінін жазыңыз..." 
                  />
                </div>
                <div className="space-y-2">
                  <Label>Бағалау Критерийі</Label>
                  <Select value={task.criteriaId || ""} onValueChange={(val) => updateTask(task.id, { criteriaId: val })}>
                    <SelectTrigger><SelectValue placeholder="Критерий таңдау" /></SelectTrigger>
                    <SelectContent>
                      {filteredCriteria.length === 0 ? (
                        <SelectItem value="empty" disabled>Критерий табылмады</SelectItem>
                      ) : (
                        filteredCriteria.map(c => (
                          <SelectItem key={c.id} value={c.id} className="text-xs">
                            {c.title}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    Сұрақ осы критерий бойынша бағаланады
                  </p>
                </div>
              </div>

              {/* Жауап нұсқалары */}
              <div className="space-y-3 bg-muted/30 p-4 rounded-xl border">
                <Label>Жауап нұсқалары (Дұрыс жауапты белгілеңіз)</Label>
                <div className="grid gap-3 sm:grid-cols-2">
                  {task.options.map((option, optIdx) => (
                    <div key={optIdx} className={`flex items-center gap-3 p-2 rounded-lg border bg-background transition-colors ${task.correctAnswerIndex === optIdx ? "border-primary ring-1 ring-primary/20" : "border-border"}`}>
                      <div 
                        onClick={() => updateTask(task.id, { correctAnswerIndex: optIdx })}
                        className={`flex items-center justify-center size-6 rounded-full border text-xs cursor-pointer font-medium
                          ${task.correctAnswerIndex === optIdx ? "bg-primary text-primary-foreground border-primary" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
                      >
                        {["A", "B", "C", "D"][optIdx]}
                      </div>
                      <Input 
                        value={option}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateOption(task.id, optIdx, e.target.value)}
                        placeholder={`Нұсқа ${["A", "B", "C", "D"][optIdx]}`}
                        className="h-8 text-sm"
                      />
                    </div>
                  ))}
                </div>
              </div>

            </CardContent>
          </Card>
        ))}

        {showAiPrompt && (
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 space-y-4">
            <h3 className="font-medium text-primary flex items-center gap-2">
              <Sparkles className="size-4" /> AI көмегімен жаңа сұрақ құрастыру
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Тақырып немесе мәтін (Прогноз, шарттары)</Label>
                <Input value={aiTopic} onChange={e => setAiTopic(e.target.value)} placeholder="Мысалы: Ғарышты игеру тарихы..." />
              </div>
              <div className="space-y-2">
                <Label>Сұрақ қай критерийге жатады?</Label>
                <Select value={targetCriteriaId} onValueChange={(val: string | null) => val && setTargetCriteriaId(val)}>
                  <SelectTrigger><SelectValue placeholder="Таңдаңыз" /></SelectTrigger>
                  <SelectContent>
                    {filteredCriteria.length === 0 ? (
                      <SelectItem value="empty" disabled>Алдымен Бағдарлама түрін таңдаңыз</SelectItem>
                    ) : (
                      filteredCriteria.map(c => <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>)
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Сұрақ саны</Label>
                <Select value={aiCount.toString()} onValueChange={(v: string | null) => v && setAiCount(parseInt(v))}>
                  <SelectTrigger><SelectValue/></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 сұрақ (Жеке сұрақ)</SelectItem>
                    <SelectItem value="5">5 сұрақ (Қысқа тест)</SelectItem>
                    <SelectItem value="10">10 сұрақ (Толық тест генерациясы)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {programType === "PISA" && (
                <div className="space-y-2 md:col-span-2">
                  <Label>PISA Бағыты (Сауаттылық түрі)</Label>
                  <Select value={pisaDomain} onValueChange={(v: string | null) => v && setPisaDomain(v)}>
                    <SelectTrigger><SelectValue placeholder="Бағытты таңдаңыз" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Барлық бағыттар (Толық Мок Тест)">🌟 Толық Мок Тест (Аралас)</SelectItem>
                      <SelectItem value="Математикалық сауаттылық">📏 Математикалық сауаттылық</SelectItem>
                      <SelectItem value="Оқу сауаттылығы">📚 Оқу сауаттылығы</SelectItem>
                      <SelectItem value="Жаратылыстану-ғылыми сауаттылық">🔬 Жаратылыстану-ғылыми</SelectItem>
                      <SelectItem value="Креативті ойлау">🎨 Креативті ойлау</SelectItem>
                      <SelectItem value="Қаржылық сауаттылық">💰 Қаржылық сауаттылық</SelectItem>
                      <SelectItem value="Жаһандық құзыреттілік">🌍 Жаһандық құзыреттілік</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              {programType === "TIMSS" && (
                <div className="space-y-2 md:col-span-2">
                  <Label>TIMSS Танымдық өлшемі</Label>
                  <Select value={timssDomain} onValueChange={(v: string | null) => v && setTimssDomain(v)}>
                    <SelectTrigger><SelectValue placeholder="Танымдық өлшемді таңдаңыз" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Барлық өлшемдер (Толық Мок Тест)">🌟 Толық Мок Тест (Аралас)</SelectItem>
                      <SelectItem value="Білу (Knowing)">🧠 Білу (Knowing)</SelectItem>
                      <SelectItem value="Қолдану (Applying)">⚙️ Қолдану (Applying)</SelectItem>
                      <SelectItem value="Парасатты талдау (Reasoning)">🧩 Парасатты талдау (Reasoning)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              {programType === "PIRLS" && (
                <div className="space-y-2 md:col-span-2">
                  <Label>PIRLS Оқу процесі (Comprehension Process)</Label>
                  <Select value={pirlsDomain} onValueChange={(v: string | null) => v && setPirlsDomain(v)}>
                    <SelectTrigger><SelectValue placeholder="Оқу процесін таңдаңыз" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Барлық процестер (Толық Мок Тест)">🌟 Толық Мок Тест (Аралас)</SelectItem>
                      <SelectItem value="Ақпаратты табу (Retrieve)">🔍 Ақпаратты табу (Retrieve)</SelectItem>
                      <SelectItem value="Қорытынды жасау (Inferences)">💡 Қорытынды жасау (Inferences)</SelectItem>
                      <SelectItem value="Идеяларды біріктіру (Interpret)">🧩 Идеяларды біріктіру (Interpret)</SelectItem>
                      <SelectItem value="Мәтінді бағалау (Evaluate)">⚖️ Мәтінді бағалау (Evaluate)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" onClick={() => setShowAiPrompt(false)}>Болдырмау</Button>
              <Button onClick={handleGenerateAI} disabled={isGenerating}>
                {isGenerating ? "Ойлануда..." : "Құрастыру"}
              </Button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <Button type="button" variant="outline" onClick={addTask} className="w-full border-dashed">
            <PlusCircle className="size-4 mr-2" /> Қолмен сұрақ қосу
          </Button>
          <Button type="button" variant="secondary" onClick={() => setShowAiPrompt(true)} className="w-full text-primary border border-primary/20 bg-primary/10 hover:bg-primary/20">
            <Sparkles className="size-4 mr-2" /> AI-мен генерациялау
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive text-sm font-medium p-3 rounded-lg border border-destructive/20">
          ⚠️ {error}
        </div>
      )}

      <div className="flex justify-end gap-3 pt-6 border-t mt-8">
        <Button variant="outline" onClick={() => router.push("/teacher/assessments")}>Болдырмау</Button>
        <Button onClick={handleSave} disabled={isSubmitting} className="min-w-[150px]">
          {isSubmitting ? "Сақталуда..." : <><Save className="size-4 mr-2" /> Сақтау мен Аяқтау</>}
        </Button>
      </div>
    </div>
  );
}
