/* All eligible images are bundled; playing never downloads image data. */
(() => {
  const ids=new Set(window.PICTLINGO_BUNDLED_IDS);
  const api={state:{online:false,supported:false},ready:async()=>{
    const Original=window.WordBloomReviewedScenes.Runtime;
    if(!Original.androidWebP) {
      class AndroidRuntime extends Original {
        constructor(options={}) {
          super({...options,makeImageURL:options.makeImageURL || (bytes=>{
            let text='';for(let i=0;i<bytes.length;i+=8192)text+=String.fromCharCode(...bytes.subarray(i,i+8192));
            return 'data:image/webp;base64,'+btoa(text);
          })});
        }
        async loadPack(w) {
          const d=w.androidImage;
          if(!d || d.sourceSha256!==w.image.sha256 || d.path!=='assets/pictlingo/'+d.sha256+'.webp')throw Error('invalid-derivative');
          const response=await this.fetcher(new URL('../../'+d.path,this.location.href).href);
          if(!response.ok)throw Error('image-unavailable');
          return new Uint8Array(await response.arrayBuffer());
        }
        async verifyImage(w,bytes) {
          const d=w.androidImage;
          if(!d || d.sourceSha256!==w.image.sha256 || bytes.length!==d.bytes ||
            String.fromCharCode(...bytes.subarray(0,4))!=='RIFF' || String.fromCharCode(...bytes.subarray(8,12))!=='WEBP' ||
            await this.digest('SHA-256',bytes)!==d.sha256)throw Error('invalid-derivative');
        }
      }
      AndroidRuntime.androidWebP=true;
      window.WordBloomReviewedScenes.Runtime=AndroidRuntime;
    }
    return api;
  },refresh:async()=>{},canPlay:w=>ids.has(w.id),hasSavedScene:w=>ids.has(w.id)};
  window.NicolingoOffline=api;
})();
