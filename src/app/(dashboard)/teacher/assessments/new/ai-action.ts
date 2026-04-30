"use server"

export async function generateQuestionWithAI(topic: string, programType: string, criteriaName?: string, count: number = 1, domainName?: string) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return { error: "OPENAI_API_KEY бапталмаған. AI мүмкіндігін қолдану үшін .env файлына кілтті қосыңыз." };
  }

  const systemPrompt = `Сен кәсіби ұстаз әрі тест құрастырушысың. Бұл балаларды бағалауға арналған білім беру платформасы. Тек қана JSON пішімінде жауап бер.`;
  let domainText = "";
  if (programType === "PISA") {
    if (domainName && domainName.includes("Мок Тест")) {
      domainText = `\nБұл толыққанды PISA Mock-тесті көлеміндегі генерация. Сұрақтар PISA-ның барлық бағыттарын (Математикалық, Оқу, Жаратылыстану, Креативті, Қаржылық сауаттылық) кезектесіп және аралас қамтуы тиіс. Әр сұраққа шынайы өмірлік (real-world) немесе ғылыми стимул мәтін/кейс берілсін.`;
    } else {
      domainText = `\nPISA Бағыты: ${domainName || "Жалпы"}. Бұл сұрақтар PISA халықаралық стандартына сай болуы қатаң талап етіледі:
1. Әр сұрақ нақты өмірлік (real-world) жағдайға, кейске немесе шағын мәтінге (стимул) негізделуі тиіс.
2. Оқушының тек жаттап алған білімін емес, сыни ойлауын, логикасын және ақпаратты талдау дағдысын тексеруі міндетті.
3. Әсіресе ${domainName || "таңдалған бағыт"} бойынша құзыреттіліктерді жан-жақты бағалауы керек.`;
    }
  } else if (programType === "TIMSS") {
    if (domainName && domainName.includes("Мок Тест")) {
      domainText = `\nБұл толыққанды TIMSS Mock-тесті көлеміндегі генерация. Сұрақтар академиялық мектеп бағдарламасына негізделіп, барлық 3 танымдық өлшемді (Білу, Қолдану, Парасатты талдау) тең дәрежеде қамтуы тиіс. Жеңіл фактілерден басталып, күрделі проблемалық (reasoning) есептерге дейін қамтылсын.`;
    } else {
      domainText = `\nTIMSS Танымдық өлшемі (Cognitive Domain): ${domainName || "Жалпы"}. Бұл сұрақтар TIMSS халықаралық стандартына қатаң сай болуы тиіс:
1. Сұрақ мектеп бағдарламасындағы академиялық білімге негізделіп, оқушының "${domainName || "таңдалған өлшем"}" деңгейін тексеруі шарт.
2. Егер "Білу (Knowing)" болса, нақты фактілер, формулалар мен ережелерді еске түсіру сұралсын.
3. Егер "Қолдану (Applying)" болса, теориялық білімді нақты мысалда есептеп шығару тексерілсін.
4. Егер "Парасатты талдау (Reasoning)" болса, күрделі проблемалық жағдаят (problem solving) беріліп, логикалық қорытынды және толықтай анализ жасау талап етілсін.`;
    }
  } else if (programType === "PIRLS") {
    if (domainName && domainName.includes("Мок Тест")) {
      domainText = `\nБұл балаларға арналған толыққанды PIRLS Mock-тесті. Оқушыларға қызықты 1-2 шағын әдеби немесе ақпараттық мәтін (стимул) беріп, сол мәтіндерге қатысты оқу процесінің толық 4 деңгейін де (Ақпаратты табу, Қорытынды жасау, Идеяларды біріктіру, Мәтінді бағалау) аралас қамтитын сұрақтарды құрастыру қажет.`;
    } else {
      domainText = `\nPIRLS Оқу процесі (Comprehension Process): ${domainName || "Жалпы"}. Бұл сұрақтар 4-сынып оқушыларына арналған PIRLS оқу сауаттылығы стандартына сай болуы тиіс:
1. Әр сұраққа міндетті түрде қызықты балаларға арналған шағын әдеби немесе ақпараттық мәтін (стимул) берілсін.
2. Егер "Ақпаратты табу (Retrieve)" болса, мәтінде нақты жазылған детальдарды немесе фактілерді табуды сұраңыз.
3. Егер "Қорытынды жасау (Inferences)" болса, мәтінде тікелей айтылмаса да, логикалық тұрғыдан шығатын жеңіл тұжырымды сұраңыз.
4. Егер "Идеяларды біріктіру (Interpret)" болса, кейіпкердің неліктен олай жасағанын (мотивтерін) немесе жалпы негізгі идеяны түсінуді сұраңыз.
5. Егер "Мәтінді бағалау (Evaluate)" болса, автордың мақсаты немесе мәтіннің ерекшелігі, құрылымы туралы сын көзқарасты сұраңыз.`;
    }
  }

  const userPrompt = `Тақырып: "${topic}". 
Бағдарлама түрі: ${programType}. 
${criteriaName ? `Бағалау критерийі: ${criteriaName}.` : ''}${domainText}

Маған оқушыларға арналған ${count} тест сұрағын (әрқайсысы 4 жауап нұсқасымен) құрастырып бер. Сұрақтар ${programType} форматына сай болуы тиіс.
МЫНДАЙ ҚАТАҢ JSON МАССИВ ФОРМАТЫНДА ТЕК ҚАНА JSON ҚАЙТАР:
{
  "questions": [
    {
      "prompt": "Сұрақтың мәтіні: Егер формат PISA/PIRLS болса міндетті түрде өмірлік/әдеби жағдаят (стимул мәтін), ал TIMSS болса академиялық проблемалық бағыт беріледі...",
      "options": ["А нұсқасы", "Ә нұсқасы", "Б нұсқасы", "В нұсқасы"],
      "correctAnswerIndex": 0
    }
  ]
}`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7
      })
    });

    if (!response.ok) {
        throw new Error(`OpenAI API Error: ${response.statusText}`);
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content;
    
    if (!text) {
        return { error: "AI жауап қайтармады." };
    }

    const parsed = JSON.parse(text);
    return { success: true, tasks: parsed.questions as {prompt: string, options: string[], correctAnswerIndex: number}[] };

  } catch (error) {
    console.error("AI Generation Error:", error);
    return { error: "Сұрақ құрастыру кезінде сервер қатесі түсті. Мүмкін JSON форматы бұзылған шығар. Қайта көріңіз." };
  }
}
