/* Android TextToSpeech adapter. No cloud synthesis or voice model is bundled. */
(() => {
  if(!window.Capacitor?.isNativePlatform())return;
  const native=window.Capacitor.registerPlugin('Pictlingo');
  let voices=[],current=null,serial=0;const listeners=new Set();
  class Utterance { constructor(text){this.text=text;this.rate=1;this.pitch=1;this.lang='en-US';} }
  const synth={paused:false,getVoices:()=>voices,addEventListener:(type,fn)=>{if(type==='voiceschanged')listeners.add(fn);},
    resume(){},cancel(){serial++;current=null;native.stop().catch(()=>{});},
    speak(u){const id=String(++serial);current={id,u};native.speak({id,text:u.text,language:u.lang,rate:u.rate,pitch:u.pitch}).catch(e=>{if(current?.id===id){current=null;u.onerror?.({error:e.message||'synthesis-failed'});}});}
  };
  window.PictlingoNativeSpeech={synth,Utterance};
  const subscribed=native.addListener('speechState',event=>{if(current?.id!==event.id)return;const u=current.u;if(event.state==='start')u.onstart?.();else{current=null;if(event.state==='done')u.onend?.();else u.onerror?.({error:event.error||'synthesis-failed'});}});
  subscribed.then(()=>native.getVoices()).then(result=>{voices=result.voices;listeners.forEach(fn=>fn());}).catch(()=>{});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)synth.cancel();});
  document.addEventListener('DOMContentLoaded',()=>{
    document.getElementById('exitApp')?.addEventListener('click',()=>native.exit());
    document.addEventListener('click',event=>{const a=event.target.closest('a[href]');if(a?.href.startsWith('https://haibaratou.github.io/')){event.preventDefault();native.openExternal({url:a.href});}});
  });
  window.pictlingoBack=()=>{
    const modal=document.getElementById('modal');if(modal?.open){modal.close();return;}
    const launch=document.getElementById('launchScreen');if(launch?.open){native.exit();return;}
    document.getElementById('closeGame')?.click();
  };
})();
