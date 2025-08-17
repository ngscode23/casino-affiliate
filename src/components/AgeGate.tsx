import { Seo } from "../components/Seo";
<Seo title="Топ-онлайн казино — Casino Watch" description="Честная подборка офферов, 18+." />
export function AgeGate({ onAccept }:{ onAccept:()=>void }){
  return (
    <div style={{position:"fixed",inset:0 as any, zIndex:50, display:"grid", placeItems:"center", background:"rgba(2,6,23,.85)"}}>
      <div className="card" style={{maxWidth:560, width:"100%"}}>
        <h2 style={{fontSize:20, fontWeight:800}}>Вам уже 18?</h2>
        <p style={{color:"#94a3b8"}}>Сайт содержит материалы о ставках. Играйте ответственно.</p>
        <div style={{display:"flex",gap:8, marginTop:12}}>
          <a className="btn" href="https://www.begambleaware.org" target="_blank" rel="noreferrer">Мне нет 18</a>
          <button className="btn primary" onClick={onAccept}>Да, 18+</button>
        </div>
      </div>
    </div>
  );
}
