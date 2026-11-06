const {test}=require('node:test');
const assert=require('node:assert/strict');
const {OutputPreparation}=require('./pronunciation.js');
const flush=async()=>{await Promise.resolve();await Promise.resolve();};
function setup({blocked=false,timestamps=true}={}){
 const timers=new Map();let id=0,instance;
 class Context{
  constructor(){instance=this;this.state='suspended';this.currentTime=0;this.time=0;this.sampleRate=48000;this.resumes=0;this.stopped=0;this.disconnected=0;this.closes=0;
   if(!timestamps)this.getOutputTimestamp=undefined;}
  createBuffer(channels,frames,sampleRate){assert.equal(channels,1);assert.equal(frames,256);assert.equal(sampleRate,48000);return new Float32Array(frames);}
  createBufferSource(){const c=this;return{connect(){},start(){},stop(){c.stopped++;},disconnect(){c.disconnected++;}};}
  getOutputTimestamp(){return{contextTime:this.time,performanceTime:this.time*1000};}
  resume(){this.resumes++;if(blocked)return new Promise(()=>{});this.state='running';return Promise.resolve();}
  suspend(){this.state='suspended';return Promise.resolve();}
  close(){this.state='closed';this.closes++;return Promise.resolve();}
 }
 const output=new OutputPreparation({Context,timeoutMs:60,setTimer:fn=>{timers.set(++id,fn);return id;},clearTimer:i=>timers.delete(i)});
 const tick=async(time)=>{instance.time=time;instance.currentTime=time;const callbacks=[...timers.values()];timers.clear();callbacks.forEach(fn=>fn());await flush();};
 return{output,timers,tick,context:()=>instance};
}
test('preparation waits for advancing device output timestamp, not resume alone',async()=>{
 const x=setup();let finished=false;const ready=x.output.ensure().then(value=>{finished=true;return value;});
 await flush();assert.equal(finished,false);assert.equal(x.context().resumes,1);
 await x.tick(0);assert.equal(finished,false);
 await x.tick(.02);assert.equal((await ready).outputTimestamp.contextTime,.02);assert.equal(x.timers.size,0);
 assert.equal(x.output.source.loop,true);assert.ok([...x.output.source.buffer].every(v=>v===0));
});
test('concurrent callers share preparation and a later request rechecks fresh output',async()=>{
 const x=setup(),a=x.output.ensure(),b=x.output.ensure();assert.equal(a,b);await flush();await x.tick(.01);await a;
 assert.equal(x.context().resumes,1);let done=false;const c=x.output.ensure().then(()=>done=true);await flush();assert.equal(done,false);
 await x.tick(.01);assert.equal(done,false);await x.tick(.03);await c;assert.equal(x.context().resumes,2);
});
test('autoplay-blocked output times out with retryable NotAllowedError',async()=>{
 const x=setup({blocked:true}),a=x.output.ensure();const rejected=assert.rejects(a,{name:'NotAllowedError'});await flush();await x.tick(0);await x.tick(0);await rejected;
 assert.equal(x.output.pending,null);assert.equal(x.timers.size,0);x.output.close();
});
test('suspend cancels pending callbacks and a later gesture can prepare again',async()=>{
 const x=setup(),a=x.output.ensure();const rejected=assert.rejects(a,{name:'AbortError'});await flush();const stale=[...x.timers.values()][0];
 await x.output.suspend();await rejected;stale();assert.equal(x.timers.size,0);assert.equal(x.context().state,'suspended');
 const b=x.output.ensure();await flush();await x.tick(.03);assert.equal((await b).state,'running');
});
test('close releases the output source and subsequent playback creates a fresh context',async()=>{
 const x=setup(),a=x.output.ensure();await flush();await x.tick(.01);await a;const old=x.context();await x.output.close();
 assert.equal(old.closes,1);assert.equal(old.stopped,1);assert.equal(old.disconnected,1);assert.equal(x.output.context,null);
 const b=x.output.ensure();assert.notEqual(x.context(),old);await flush();await x.tick(.02);await b;
});
test('unsupported output is explicit; a currentTime fallback is labeled without a device timestamp',async()=>{
 assert.deepEqual(await new OutputPreparation({Context:null}).ensure(),{supported:false});
 const x=setup({timestamps:false}),a=x.output.ensure();await flush();await x.tick(.02);assert.equal((await a).outputTimestamp,null);
});
