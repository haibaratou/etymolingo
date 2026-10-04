/* A puzzle requires a reviewed sentence pair, its exact sense, and verified PNG bytes. */
((root) => {
  'use strict';
  const normalize = value => String(value || '').normalize('NFKC').replace(/[’‘]/g,"'").replace(/[‐‑]/g,'-').replace(/\s+/g,' ').trim();
  const firstJa = value => normalize(String(value || '').split('、')[0]);
  const firstEn = value => normalize(String(value || '').split(' / ')[0]);
  const hex = bytes => Array.from(new Uint8Array(bytes), x => x.toString(16).padStart(2,'0')).join('');
  const hashPattern = /^[0-9a-f]{64}$/;
  function validRow(word) {
    if (!word || typeof word.id !== 'string' || !word.id || word.updatedArt !== true || word.reviewStatus || typeof word.w !== 'string' || !/^[ぁ-ゔー]{2,14}$/.test(word.w)) return false;
    const e = word.reviewedScene, b = word.sceneBinding;
    if (!e || e.schema !== 1 || e.status !== 'reviewed' || !b || !Array.isArray(e.p)) return false;
    if (word.en !== e.w || word.pic !== e.art || b.w !== e.w || JSON.stringify(b.p) !== JSON.stringify(e.p)) return false;
    if (word.roots && JSON.stringify(word.roots) !== JSON.stringify(e.p)) return false;
    if (!/^[A-Za-z0-9_@-]+$/.test(e.art) || e.sense?.index !== 0 || !hashPattern.test(e.sense.sha256 || '')) return false;
    if (!e.sense.ja || !e.sense.en || firstJa(b.ja) !== e.sense.ja || firstEn(b.en) !== e.sense.en) return false;
    const en = normalize(e.scene?.en), ja = normalize(e.scene?.ja), head = normalize(e.w);
    if (!en || !ja || (en.match(/[\p{L}\p{N}_]+(?:['-][\p{L}\p{N}_]+)*/gu) || []).length > 18) return false;
    const escaped = head.replace(/[.*+?^${}()|[\]\\]/g,'\\$&').replace(/ /g,'\\s+');
    if (!new RegExp('(?<!\\w)'+escaped+'(?!\\w)','i').test(en)) return false;
    if ((en.match(/[.!?](?:["”’])?(?:\s|$)/g)||[]).length>1 || (ja.match(/[。！？]/g)||[]).length>1) return false;
    const bare = en.replace(/[.!?]+$/,'').trim().toLowerCase(), h = head.toLowerCase();
    if ([h,'a '+h,'an '+h,'the '+h,'this is '+h,'this is a '+h,'this is an '+h].includes(bare)) return false;
    if (!hashPattern.test(e.image?.sha256 || '') || !/^[0-9a-f]{40}$/.test(e.image?.git_blob_sha || '')) return false;
    if (e.image.path !== 'assets/word/'+e.art+'.png') return false;
    return word.sceneAsset === 'picture-words/scene-assets/'+e.art+'@'+e.image.sha256+'.js';
  }
  const filterCatalog = words => {
    const ids=new Map(),spellings=new Map();
    for(const w of words) { ids.set(w?.id,(ids.get(w?.id)||0)+1);spellings.set(w?.en,(spellings.get(w?.en)||0)+1); }
    return words.filter(w=>validRow(w) && ids.get(w.id)===1 && spellings.get(w.en)===1);
  };
  function freeze(value) { if (value && typeof value === 'object') { Object.values(value).forEach(freeze); Object.freeze(value); } return value; }
  class Runtime {
    constructor({meta, fetcher = root.fetch?.bind(root), crypto = root.crypto, location = root.location, document = root.document, navigator = root.navigator, offline, assetRoot = root, makeImageURL} = {}) {
      this.meta=meta; this.fetcher=fetcher; this.crypto=crypto; this.location=location; this.document=document; this.navigator=navigator; this.offline=offline; this.assetRoot=assetRoot; this.images=new Map(); this.packs=new Map();
      this.makeImageURL=makeImageURL || (bytes => { let text=''; for(let i=0;i<bytes.length;i+=8192) text+=String.fromCharCode(...bytes.subarray(i,i+8192)); return 'data:image/png;base64,'+root.btoa(text); });
    }
    snapshot() { return this.location.protocol==='file:' || this.navigator?.onLine===false || this.offline?.state?.online===false; }
    async digest(algorithm,bytes) { if (!this.crypto?.subtle) throw new Error('hash-unavailable'); return hex(await this.crypto.subtle.digest(algorithm,bytes)); }
    async checkDataset() {
      const m=this.meta;
      if (m?.schema!==1 || !hashPattern.test(m.sourceWordsSha256||'') || !hashPattern.test(m.scenesSha256||'') || !hashPattern.test(m.indexSha256||'')) return {ok:false,reason:'missing-catalog-provenance'};
      if(this.snapshot()) return {ok:true,mode:'reviewed-snapshot'};
      try {
        const url=new URL('../data/generated-etymon/manifest.json?strictScene=1',this.location.href);
        const response=await this.fetcher(url.href,{cache:'no-store',signal:AbortSignal.timeout(12000)});
        if(!response.ok) return {ok:false,reason:'manifest-unavailable'};
        const live=await response.json();
        if(live.files?.words?.sha256!==m.sourceWordsSha256 || live.files?.illustration_scenes?.sha256!==m.scenesSha256) return {ok:false,reason:'stale-catalog'};
        const indexResponse=await this.fetcher(new URL('../../assets/word/illustration-index.js?strictScene=1',this.location.href).href,{cache:'no-store',signal:AbortSignal.timeout(12000)});
        if(!indexResponse.ok || await this.digest('SHA-256',await indexResponse.arrayBuffer())!==m.indexSha256) return {ok:false,reason:'stale-catalog'};
        return {ok:true,mode:'current'};
      } catch { return {ok:false,reason:'manifest-unavailable'}; }
    }
    canonicalURL(word) { const e=word.reviewedScene; return new URL('../../'+e.image.path+'?strictScene=1&v='+e.image.sha256,this.location.href).href; }
    imageURL(word) { return this.images.get(word.id) || (validRow(word) ? this.canonicalURL(word) : ''); }
    async loadPack(word) {
      const sha=word.reviewedScene.image.sha256;
      if(!this.packs.has(sha)) this.packs.set(sha,new Promise((resolve,reject)=>{
        const existing=this.assetRoot.PICTURE_WORDS_SCENE_ASSETS?.[sha];
        if(existing) { resolve(existing); return; }
        if(!this.document) { reject(new Error('pack-unavailable')); return; }
        const script=this.document.createElement('script'); script.src=new URL(word.sceneAsset,this.location.href).href; script.async=true;
        const timer=setTimeout(()=>{ script.remove(); this.packs.delete(sha); reject(new Error('pack-timeout')); },15000);
        script.onload=()=>{ clearTimeout(timer); script.remove(); const pack=this.assetRoot.PICTURE_WORDS_SCENE_ASSETS?.[sha]; if(pack) resolve(pack); else {this.packs.delete(sha);reject(new Error('pack-missing'));} };
        script.onerror=()=>{clearTimeout(timer);script.remove();this.packs.delete(sha);reject(new Error('pack-unavailable'));};
        this.document.head.append(script);
      }));
      const pack=await this.packs.get(sha);
      if(pack.mime!=='image/png' || typeof pack.base64!=='string' || pack.base64.length>16000000) throw new Error('invalid-pack');
      return Uint8Array.from(root.atob(pack.base64),c=>c.charCodeAt(0));
    }
    async prepare(word) {
      if(!validRow(word)) return {status:'unavailable',reason:'unreviewed-or-invalid-scene'};
      const dataset=await this.checkDataset(); if(!dataset.ok) return {status:'unavailable',reason:dataset.reason};
      try {
        const e=JSON.parse(JSON.stringify(word.reviewedScene));
        const senseBytes=new TextEncoder().encode(JSON.stringify([normalize(e.w),e.p,e.sense.ja,e.sense.en]));
        if(await this.digest('SHA-256',senseBytes)!==e.sense.sha256) return {status:'unavailable',reason:'stale-sense'};
        let bytes;
        if(this.snapshot()) bytes=await this.loadPack(word);
        else { const response=await this.fetcher(this.canonicalURL(word),{cache:'no-store',signal:AbortSignal.timeout(15000)}); if(!response.ok) throw new Error('image-unavailable'); bytes=new Uint8Array(await response.arrayBuffer()); }
        if(bytes.length<8 || [137,80,78,71,13,10,26,10].some((v,i)=>bytes[i]!==v)) throw new Error('invalid-png');
        if(await this.digest('SHA-256',bytes)!==e.image.sha256) return {status:'unavailable',reason:'stale-image'};
        const header=new TextEncoder().encode('blob '+bytes.length+'\0'), gitBytes=new Uint8Array(header.length+bytes.length);gitBytes.set(header);gitBytes.set(bytes,header.length);
        if(await this.digest('SHA-1',gitBytes)!==e.image.git_blob_sha) return {status:'unavailable',reason:'stale-image'};
        const imageURL=this.makeImageURL(bytes);this.images.set(word.id,imageURL);
        return freeze({status:'reviewed',entry:e,imageURL,mode:dataset.mode});
      } catch(error) { return {status:'unavailable',reason:error.message||'image-unavailable'}; }
    }
  }
  async function verifyPackScript(word, text, crypto = root.crypto) {
    if(!validRow(word) || typeof text !== 'string' || text.length > 16000000) throw new Error('invalid-pack');
    const sha=word.reviewedScene.image.sha256;
    const prefix='(window.PICTURE_WORDS_SCENE_ASSETS ||= {})['+JSON.stringify(sha)+'] = ';
    const source=text.trim();
    if(!source.startsWith(prefix) || !source.endsWith(';')) throw new Error('invalid-pack');
    const pack=JSON.parse(source.slice(prefix.length,-1));
    if(pack.mime!=='image/png' || typeof pack.base64!=='string') throw new Error('invalid-pack');
    const bytes=Uint8Array.from(root.atob(pack.base64),c=>c.charCodeAt(0)), runtime=new Runtime({crypto});
    if(bytes.length<8 || [137,80,78,71,13,10,26,10].some((v,i)=>bytes[i]!==v)) throw new Error('invalid-png');
    if(await runtime.digest('SHA-256',bytes)!==sha) throw new Error('stale-image');
    const head=new TextEncoder().encode('blob '+bytes.length+'\0'), all=new Uint8Array(head.length+bytes.length);all.set(head);all.set(bytes,head.length);
    if(await runtime.digest('SHA-1',all)!==word.reviewedScene.image.git_blob_sha) throw new Error('stale-image');
    return true;
  }
  const api={validRow,filterCatalog,Runtime,normalize,verifyPackScript};
  if(typeof module==='object' && module.exports) module.exports=api; else root.WordBloomReviewedScenes=api;
})(typeof window==='undefined'?globalThis:window);
