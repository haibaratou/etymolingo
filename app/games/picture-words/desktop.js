/* Give desktop browsers a real phone-sized viewport without resizing their tabs. */
(() => {
  const url=new URL(location.href);
  if(window.self!==window.top || url.searchParams.has('phone') || innerWidth<=860)return;
  window.NICOLINGO_PHONE_HOST=true;
  document.documentElement.classList.add('phone-host');
  const host=document.createElement('main');host.className='desktop-phone-host';
  const bar=document.createElement('div');bar.className='desktop-phone-bar';
  const title=document.createElement('strong');title.textContent='ニコリンゴ';
  const open=document.createElement('button');open.type='button';open.textContent='別ウィンドウで開く';
  const note=document.createElement('p');note.className='desktop-phone-note';note.hidden=true;
  let frame, popupWindow;
  open.addEventListener('click',()=>{
    const popupURL=new URL(location.href);popupURL.searchParams.set('phone','1');
    const height=Math.min(840,screen.availHeight-70),width=430;
    const popup=window.open(popupURL.href,'nicolingo-phone',`popup=yes,width=${width},height=${height},resizable=yes,scrollbars=yes`);
    popupWindow=popup;
    note.hidden=!popup;
    if(popup){frame.hidden=true;frame.src='about:blank';note.textContent='別ウィンドウでプレイ中';popup.focus();}
    else {note.hidden=false;note.textContent='別ウィンドウがブロックされました。この画面でも遊べます。';}
  });
  const resume=document.createElement('button');resume.type='button';resume.textContent='この画面に戻す';
  resume.addEventListener('click',()=>{if(popupWindow && !popupWindow.closed)popupWindow.close();if(frame.hidden)frame.src=gameURL.href;frame.hidden=false;note.hidden=true;});
  bar.append(title,open,resume);
  frame=document.createElement('iframe');frame.title='ニコリンゴのゲーム画面';
  const gameURL=new URL(location.href);gameURL.searchParams.set('phone','1');frame.src=gameURL.href;
  host.append(bar,frame,note);document.body.append(host);
})();
