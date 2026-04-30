"use client"

import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <div className="flex flex-col gap-16 pb-16">
      {/* Hero Section */}
      <section className="bg-primary/5 py-20 px-4 text-center">
        <div className="container mx-auto max-w-4xl space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-primary">
            Бүгін үйрен — ертең жетістікке жет!
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Бастауыш сынып оқушыларының оқу сапасын арттыруға арналған толықтай қазақ тіліндегі веб-платформа.
            Өз біліміңді PISA, TIMSS, PIRLS форматтарында тексер!
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6">
            <Link 
              href="/register" 
              className={cn(buttonVariants({ size: "lg" }), "text-lg px-8 rounded-full shadow-lg")}
            >
              Оқуды бастау
            </Link>
            <Link 
              href="/diagnostic-info" 
              className={cn(buttonVariants({ size: "lg", variant: "outline" }), "text-lg px-8 rounded-full border-primary text-primary hover:bg-primary/10")}
            >
              Диагностикалық тест тапсыру
            </Link>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">Негізгі бағыттар</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-card border rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <div className="h-16 w-16 bg-primary/20 rounded-2xl flex items-center justify-center text-primary text-3xl mb-6 shadow-sm">
              📚
            </div>
            <h3 className="text-2xl font-semibold mb-3 text-primary">PIRLS</h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">Оқу сауаттылығын дамыту. Қысқа мәтіндермен жұмыс жасап, негізгі ойды анықтауды үйренеміз.</p>
            <ul className="space-y-3 text-sm text-foreground/80 mb-8 font-medium">
              <li className="flex items-center gap-2"><span className="text-primary">✓</span> Көркем мәтіндер</li>
              <li className="flex items-center gap-2"><span className="text-primary">✓</span> Ақпараттық мәтіндер</li>
              <li className="flex items-center gap-2"><span className="text-primary">✓</span> Қорытынды жасау</li>
            </ul>
            <Button variant="ghost" className="w-full text-primary hover:bg-primary/10 font-semibold h-12">Толығырақ</Button>
          </div>

          <div className="bg-card border rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <div className="h-16 w-16 bg-secondary/30 rounded-2xl flex items-center justify-center text-secondary-foreground text-3xl mb-6 shadow-sm">
              🧮
            </div>
            <h3 className="text-2xl font-semibold mb-3 text-secondary-foreground">TIMSS</h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">Математика және жаратылыстану дағдыларын дамыту. Логикалық есептер мен заңдылықтарды танимыз.</p>
            <ul className="space-y-3 text-sm text-foreground/80 mb-8 font-medium">
              <li className="flex items-center gap-2"><span className="text-secondary-foreground">✓</span> Арифметика</li>
              <li className="flex items-center gap-2"><span className="text-secondary-foreground">✓</span> Логикалық есептер</li>
              <li className="flex items-center gap-2"><span className="text-secondary-foreground">✓</span> Диаграмма оқу</li>
            </ul>
            <Button variant="ghost" className="w-full text-secondary-foreground hover:bg-secondary/20 font-semibold h-12">Толығырақ</Button>
          </div>

          <div className="bg-card border rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <div className="h-16 w-16 bg-accent/40 rounded-2xl flex items-center justify-center text-accent-foreground text-3xl mb-6 shadow-sm">
              🌍
            </div>
            <h3 className="text-2xl font-semibold mb-3 text-accent-foreground">PISA</h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">Функционалдық сауаттылық. Білімді өмірлік жағдаяттарда қолдану және проблемаларды шешу.</p>
            <ul className="space-y-3 text-sm text-foreground/80 mb-8 font-medium">
              <li className="flex items-center gap-2"><span className="text-accent-foreground">✓</span> Күнделікті жағдайлар</li>
              <li className="flex items-center gap-2"><span className="text-accent-foreground">✓</span> График талдау</li>
              <li className="flex items-center gap-2"><span className="text-accent-foreground">✓</span> Шешім қабылдау</li>
            </ul>
            <Button variant="ghost" className="w-full text-accent-foreground hover:bg-accent/40 font-semibold h-12">Толығырақ</Button>
          </div>
        </div>
      </section>

      {/* Criteria Information Section */}
      <section className="bg-muted/40 py-20 px-4">
        <div className="container mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-4xl font-bold">Критериалды бағалау жүйесі</h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Әрбір тапсырма арнайы критерийлер мен дескрипторлар арқылы бағаланады. Бұл оқушыға нақты қай тақырыптан қателік жібергенін түсінуге көмектеседі.
            </p>
            <ul className="space-y-6">
              <li className="flex items-start gap-4 p-4 rounded-xl bg-background shadow-sm border">
                <div className="bg-primary/20 text-primary p-2 rounded-lg text-lg flex-shrink-0">🎯</div>
                <div>
                  <h4 className="font-bold text-lg">Критерий</h4>
                  <p className="text-muted-foreground mt-1">Оқу мақсатына сәйкес нақтыланады (мысалы: мәтіннің негізгі мазмұнын түсінеді)</p>
                </div>
              </li>
              <li className="flex items-start gap-4 p-4 rounded-xl bg-background shadow-sm border">
                <div className="bg-secondary/30 text-secondary-foreground p-2 rounded-lg text-lg flex-shrink-0">📝</div>
                <div>
                  <h4 className="font-bold text-lg">Дескриптор</h4>
                  <p className="text-muted-foreground mt-1">Шешімге жетелейтін нақты қадамдар немесе сипаттамалар.</p>
                </div>
              </li>
              <li className="flex items-start gap-4 p-4 rounded-xl bg-background shadow-sm border">
                <div className="bg-accent/40 text-accent-foreground p-2 rounded-lg text-lg flex-shrink-0">💡</div>
                <div>
                  <h4 className="font-bold text-lg">Кері байланыс</h4>
                  <p className="text-muted-foreground mt-1">Жіберілген қате бойынша дәл және пайдалы түсіндірме беріледі.</p>
                </div>
              </li>
            </ul>
          </div>
          <div className="bg-card rounded-3xl p-8 border shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-bl-full -z-10" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-secondary/10 rounded-tr-full -z-10" />
            
            <h3 className="text-xl font-bold mb-6 border-b pb-4">Тапсырма бағалауының мысалы</h3>
            {/* Visual representation placeholder */}
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-medium">
                  <span>Негізгі ойды табу</span>
                  <span className="text-secondary-foreground">2/2 ұпай</span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-secondary w-full rounded-full"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-medium">
                  <span>Фактілерді ажырату</span>
                  <span className="text-accent-foreground">1/2 ұпай</span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-accent w-1/2 rounded-full"></div>
                </div>
                <p className="text-xs text-muted-foreground bg-muted p-2 rounded mt-2">
                  Кеңес: Мәтіндегі жанама пікірлерді фактімен шатастырмаңыз.
                </p>
              </div>
              
              <div className="flex justify-between items-center pt-6 border-t font-bold">
                <div className="text-lg">Жалпы нәтиже</div>
                <div className="text-2xl text-primary">75%</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Summary CTA */}
      <section className="container mx-auto px-4 text-center mt-10">
        <div className="bg-gradient-to-br from-primary via-primary to-primary/80 text-primary-foreground rounded-3xl p-12 md:p-20 space-y-8 shadow-2xl relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-48 h-48 bg-black/10 rounded-full blur-2xl" />
          
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight relative z-10">Біліміңді бүгіннен бастап шыңда!</h2>
          <p className="text-xl max-w-2xl mx-auto opacity-90 leading-relaxed relative z-10">
            Оңай тіркеліп, өзіңе қажетті бағытты таңда және жетістіктеріңді бақыла. Мұғалімдер үшін де ыңғайлы аналитикалық панель қолжетімді.
          </p>
          <div className="pt-6 relative z-10">
            <Link 
              href="/register" 
              className={cn(buttonVariants({ size: "lg", variant: "secondary" }), "text-xl px-12 py-7 rounded-full font-bold shadow-xl hover:scale-105 transition-transform")}
            >
              Қазір қосылу
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
