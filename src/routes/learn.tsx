import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, FlaskConical, GraduationCap, RotateCw, Trophy } from "lucide-react";
import { roadmap, flashcards, quiz, labs } from "@/data/learning";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/learn")({
  head: () => ({
    meta: [
      { title: "Learning Center — AWS Cloud Architect Hub" },
      { name: "description", content: "AWS roadmap, flashcards, scenario quizzes, and hands-on lab ideas for aspiring Solutions Architects." },
      { property: "og:title", content: "AWS Learning Center" },
      { property: "og:description", content: "Roadmap, flashcards, quizzes and labs." },
    ],
  }),
  component: LearnPage,
});

function LearnPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="max-w-2xl">
        <div className="text-xs font-semibold uppercase tracking-widest text-accent">
          Learning Center
        </div>
        <h1 className="mt-2 text-4xl font-black tracking-tight">Level up on AWS</h1>
        <p className="mt-3 text-muted-foreground">
          A structured 16-week roadmap paired with active recall: flashcards, quizzes
          and hands-on labs.
        </p>
      </div>

      <Tabs defaultValue="roadmap" className="mt-10">
        <TabsList className="mb-6">
          <TabsTrigger value="roadmap"><GraduationCap className="mr-2 size-4" /> Roadmap</TabsTrigger>
          <TabsTrigger value="flashcards"><RotateCw className="mr-2 size-4" /> Flashcards</TabsTrigger>
          <TabsTrigger value="quiz"><Trophy className="mr-2 size-4" /> Quiz</TabsTrigger>
          <TabsTrigger value="labs"><FlaskConical className="mr-2 size-4" /> Labs</TabsTrigger>
        </TabsList>

        <TabsContent value="roadmap">
          <ol className="relative border-l border-border pl-6">
            {roadmap.map((r) => (
              <li key={r.stage} className="mb-8 last:mb-0">
                <div className="absolute -left-[9px] grid size-4 place-items-center rounded-full border-2 border-background" style={{ background: "var(--gradient-hero)" }} />
                <div className="text-xs font-semibold uppercase tracking-wider text-accent">{r.weeks}</div>
                <h3 className="text-lg font-semibold">{r.stage}</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {r.topics.map((t) => (
                    <span key={t} className="rounded-full border border-border bg-card px-3 py-1 text-xs">{t}</span>
                  ))}
                </div>
              </li>
            ))}
          </ol>
        </TabsContent>

        <TabsContent value="flashcards">
          <Flashcards />
        </TabsContent>

        <TabsContent value="quiz">
          <Quiz />
        </TabsContent>

        <TabsContent value="labs">
          <div className="grid gap-4 sm:grid-cols-2">
            {labs.map((l) => (
              <div key={l.title} className="rounded-2xl border border-border bg-card p-5">
                <div className="flex items-center gap-2">
                  <BookOpen className="size-4 text-accent" />
                  <h3 className="font-semibold">{l.title}</h3>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{l.desc}</p>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Flashcards() {
  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const card = flashcards[i];

  const next = (dir: 1 | -1) => {
    setFlipped(false);
    setI((v) => (v + dir + flashcards.length) % flashcards.length);
  };

  return (
    <div className="mx-auto max-w-xl">
      <div className="text-center text-sm text-muted-foreground">
        Card {i + 1} of {flashcards.length}
      </div>
      <button
        onClick={() => setFlipped((f) => !f)}
        className="mt-3 grid min-h-64 w-full place-items-center rounded-3xl border border-border bg-card p-8 text-center transition-all hover:-translate-y-0.5"
        style={{ boxShadow: "var(--shadow-elegant)" }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={flipped ? "back" : "front"}
            initial={{ opacity: 0, rotateY: -20 }}
            animate={{ opacity: 1, rotateY: 0 }}
            exit={{ opacity: 0, rotateY: 20 }}
            transition={{ duration: 0.2 }}
          >
            <div className="text-xs uppercase tracking-widest text-accent">
              {flipped ? "Answer" : "Question"}
            </div>
            <div className="mt-3 text-xl font-semibold">
              {flipped ? card.back : card.front}
            </div>
            {!flipped ? <div className="mt-4 text-xs text-muted-foreground">Tap to reveal</div> : null}
          </motion.div>
        </AnimatePresence>
      </button>
      <div className="mt-4 flex justify-between">
        <Button variant="outline" onClick={() => next(-1)}>Previous</Button>
        <Button onClick={() => next(1)}>Next</Button>
      </div>
    </div>
  );
}

function Quiz() {
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const q = quiz[i];

  const answer = (idx: number) => {
    if (picked !== null) return;
    setPicked(idx);
    if (idx === q.answer) setScore((s) => s + 1);
  };

  const nextQ = () => {
    setPicked(null);
    if (i + 1 >= quiz.length) {
      setDone(true);
      return;
    }
    setI(i + 1);
  };

  const reset = () => {
    setI(0); setPicked(null); setScore(0); setDone(false);
  };

  if (done) {
    return (
      <div className="mx-auto max-w-xl rounded-3xl border border-border bg-card p-10 text-center" style={{ boxShadow: "var(--shadow-elegant)" }}>
        <Trophy className="mx-auto size-10 text-accent" />
        <div className="mt-3 text-3xl font-black">
          {score} / {quiz.length}
        </div>
        <p className="mt-1 text-muted-foreground">
          {score === quiz.length ? "Perfect score!" : "Nice — review and try again."}
        </p>
        <Button className="mt-6" onClick={reset}>Retake</Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="text-sm text-muted-foreground">Question {i + 1} of {quiz.length} · Score {score}</div>
      <div className="mt-3 rounded-2xl border border-border bg-card p-6" style={{ boxShadow: "var(--shadow-elegant)" }}>
        <h3 className="text-lg font-semibold">{q.q}</h3>
        <div className="mt-4 grid gap-2">
          {q.options.map((opt, idx) => {
            const state =
              picked === null ? "idle"
                : idx === q.answer ? "correct"
                : idx === picked ? "wrong" : "idle";
            return (
              <button
                key={opt}
                onClick={() => answer(idx)}
                className={`rounded-xl border-2 px-4 py-3 text-left text-sm transition-all ${
                  state === "correct" ? "border-green-500 bg-green-500/10"
                  : state === "wrong" ? "border-destructive bg-destructive/10"
                  : "border-border hover:border-primary hover:bg-secondary"
                }`}
              >
                {opt}
              </button>
            );
          })}
        </div>
        {picked !== null ? (
          <div className="mt-4 rounded-lg bg-secondary p-3 text-sm text-muted-foreground">
            {q.explain}
          </div>
        ) : null}
        <div className="mt-4 flex justify-end">
          <Button disabled={picked === null} onClick={nextQ}>
            {i + 1 === quiz.length ? "See results" : "Next"}
          </Button>
        </div>
      </div>
    </div>
  );
}