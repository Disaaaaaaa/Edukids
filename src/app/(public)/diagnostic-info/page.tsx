"use client"

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function DiagnosticInfoPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="bg-card shadow-lg rounded-3xl p-8 md:p-12 border border-border/50">
        <div className="text-center space-y-6 mb-12">
          <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-4">
            <span className="text-5xl">🎯</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Рөлдік диагностикалық тест</h1>
          <p className="text-xl text-muted-foreground">
            Бұл тест сенің біліміңнің бастапқы деңгейін анықтауға көмектеседі. Оның нәтижесі бойынша жүйе саған қандай бағытқа көбірек көңіл бөлу керектігін ұсынады.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-background border border-border/50 shadow-sm rounded-2xl p-6 text-center space-y-3">
            <div className="text-3xl">⏱️</div>
            <h3 className="font-semibold text-lg">Уақыты</h3>
            <p className="text-muted-foreground">Шамамен 15 минут</p>
          </div>
          <div className="bg-background border border-border/50 shadow-sm rounded-2xl p-6 text-center space-y-3">
            <div className="text-3xl">📝</div>
            <h3 className="font-semibold text-lg">Сұрақтар</h3>
            <p className="text-muted-foreground">3 бағыттан түрлі сұрақтар</p>
          </div>
          <div className="bg-background border border-border/50 shadow-sm rounded-2xl p-6 text-center space-y-3">
            <div className="text-3xl">📊</div>
            <h3 className="font-semibold text-lg">Нәтиже</h3>
            <p className="text-muted-foreground">Жылдам кері байланыс</p>
          </div>
        </div>

        <div className="bg-muted/30 rounded-2xl p-6 mb-10 text-sm md:text-base leading-relaxed text-muted-foreground">
          <h4 className="font-bold text-foreground mb-3 text-lg">Қалай өтеді?</h4>
          <ul className="list-disc list-inside space-y-3">
            <li>Тестті бастау үшін жүйеге кіру немесе тіркелу қажет.</li>
            <li>Әр сұрақты мұқият оқып, дұрыс деп санаған жауапты немесе жауаптарды белгіле.</li>
            <li>Уақыт шектеулі емес, бастысы дұрыс түсініп жауап беру.</li>
            <li>Нәтижелер жеке кабинетіңде сақталады.</li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/login" 
            className={cn(buttonVariants({ size: "lg" }), "text-lg px-8 rounded-full")}
          >
            Жүйеге кіріп, тестті бастау
          </Link>
          <Link 
            href="/" 
            className={cn(buttonVariants({ size: "lg", variant: "outline" }), "text-lg px-8 rounded-full")}
          >
            Басты бетке қайту
          </Link>
        </div>
      </div>
    </div>
  );
}
