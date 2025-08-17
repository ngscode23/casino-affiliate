import React from "react";
export function CookieBar({ onAccept }:{ onAccept:()=>void }){
  return (
    <div style={{position:"fixed",left:0,right:0,bottom:0,zIndex:40}}>
      <div className="container card" style={{borderTopLeftRadius:16,borderTopRightRadius:16}}>
        <div style={{display:"flex",gap:8,alignItems:"center",justifyContent:"space-between",flexWrap:"wrap"}}>
          <p style={{margin:0}}>Мы используем cookie для аналитики. Продолжая, вы соглашаетесь.</p>
          <button className="btn" onClick={onAccept}>Принять</button>
        </div>
      </div>
    </div>
  );
}
