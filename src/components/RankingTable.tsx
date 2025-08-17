export type Row = { name: string; bonus: string; license: string; payout: string; slug: string };

export function RankingTable({ rows }: { rows: Row[] }) {
  return (
    <table className="w-full text-sm" aria-label="Сравнение казино">
      <thead className="text-left">
        <tr><th>Казино</th><th>Бонус</th><th>Лицензия</th><th>Выплаты</th><th></th></tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.slug} className="border-b">
            <td className="py-2">{r.name}</td>
            <td>{r.bonus}</td>
            <td>{r.license}</td>
            <td>{r.payout}</td>
            <td>
              <a href={`/go/${r.slug}`} rel="sponsored nofollow" className="px-3 py-1 rounded-lg bg-indigo-600 text-white">
                Играть
              </a>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}