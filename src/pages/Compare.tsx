import { Seo } from "../components/Seo";
import { casinos } from "../data/casinos";
import { CompareTable } from "../components/CompareTable";


export function Compare() {
  return <div>
 <>
      <Seo
        title="Сравнение казино — Casino Watch"
        description="Подробное сравнение онлайн-казино по лицензии, методам оплаты и рейтингу. 18+."
      />
      <section className="space-y-6">
        <h1 className="text-2xl font-bold">Сравнение казино</h1>
        <p className="text-slate-300">
          Таблица с ключевыми характеристиками операторов.
        </p>
        <CompareTable items={casinos} />
      </section>
    </>
  </div>;
}