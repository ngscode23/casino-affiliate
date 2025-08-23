import Section from "@/components/ui/section";
import Card from "@/components/ui/card";
import Button from "@/components/ui/button";
import Seo from "@/components/Seo";
import { useId, useState } from "react";

export default function ContactPage() {
  const fid = useId(), eid = useId(), sid = useId(), mid = useId();
  const [sent, setSent] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <>
      <Seo title="Контакты — CasinoHub" description="Свяжитесь с нами по вопросам контента и сотрудничества." />
      <section className="neon-hero">
        <Section>
          <h1 className="font-extrabold tracking-tight" style={{fontSize: "clamp(28px,4.5vw,46px)"}}>
            Связаться с нами
          </h1>
          <p className="neon-subline mt-2">Вопросы по обзорам, партнёрству или обратной связи?</p>
        </Section>
      </section>

      <Section>
        <Card className="p-6">
          {!sent ? (
            <form onSubmit={onSubmit} className="grid gap-4 sm:max-w-lg">
              <div>
                <label htmlFor={fid} className="text-xs text-[var(--text-dim)]">Имя</label>
                <input id={fid} className="neon-input w-full" required placeholder="Ваше имя" />
              </div>
              <div>
                <label htmlFor={eid} className="text-xs text-[var(--text-dim)]">Email</label>
                <input id={eid} type="email" className="neon-input w-full" required placeholder="you@email.com" />
              </div>
              <div>
                <label htmlFor={sid} className="text-xs text-[var(--text-dim)]">Тема</label>
                <select id={sid} className="neon-input w-full" defaultValue="content">
                  <option value="content">Контент/исправления</option>
                  <option value="partnership">Партнёрство</option>
                  <option value="other">Другое</option>
                </select>
              </div>
              <div>
                <label htmlFor={mid} className="text-xs text-[var(--text-dim)]">Сообщение</label>
                <textarea id={mid} className="neon-input w-full min-h-[120px]" required placeholder="Кратко опишите вопрос" />
              </div>
              <label className="flex items-start gap-2 text-sm">
                <input type="checkbox" required />
                <span>Согласен с <a className="underline" href="/privacy">политикой конфиденциальности</a>.</span>
              </label>
              <Button type="submit">Отправить</Button>
            </form>
          ) : (
            <div className="text-sm text-[var(--text-dim)]">Спасибо! Мы свяжемся с вами.</div>
          )}
        </Card>
      </Section>
    </>
  );
}
