async function etymo2Next(action="save", correction="", caption=null){
const py="C:\\Users\\haiba\\.cache\\codex-runtimes\\codex-primary-runtime\\dependencies\\python\\python.exe";
const io="D:\\etymolingo\\work\\etymopedia\\codex2\\illustration_batch_io.py";
const stateFile="D:\\etymolingo\\work\\etymopedia\\_illust\\.codex2-generation-state.json";
const run=async mode=>{const r=await tools.exec_command({cmd:"& '"+py+"' '"+io+"' "+mode,max_output_tokens:8000});if(r.exit_code!==0)throw new Error(r.output);return JSON.parse(r.output.trim());};
const write=async value=>{const valueText=JSON.stringify(value,null,2);const r=await tools.exec_command({cmd:"[IO.File]::WriteAllText('"+stateFile+"', @'\n"+valueText+"\n'@, (New-Object Text.UTF8Encoding($false)))",max_output_tokens:100});if(r.exit_code!==0)throw new Error(r.output);};
let state=await run("read");
if(action==="save"&&state.pending){if(!caption)throw new Error("Final image caption and review required before saving");state.pending.caption=caption;await write(state);const saved=await run("save");notify(saved.saved?"保存完了 "+saved.row.batch+"/"+saved.row.name+"（画像・実行プロンプト・日英解説・検品状態）":"語義変化を記録して保留 "+saved.row.name);state=await run("read");}
let row;
if(action==="edit"){if(!state.pending)throw new Error("No pending draft");row=state.pending.row;}else{
const q=await run("queue");if(!q.rows.length){text({status:"codex2の028〜030の生成可能行を処理済み",held:state.held});return;}row=q.rows[0];
}
const actualPrompt=action==="edit"?row.prompt+"\n\nCorrect the attached generated draft only to fulfill the CSV description above: "+correction:row.prompt+"\n\nShared production requirements: Include only the people, characters and objects specified above. Follow every composition detail and exact quantity, and keep the complete composition inside the square. Omit decorative foliage, bags, binoculars, extra tools, and extra characters unless the CSV prompt specifies them.";
const references=action==="edit"?[state.pending.source,"D:\\etymolingo\\assets\\word\\invidious.png"]:["D:\\etymolingo\\assets\\word\\invidious.png"];
state.current={row,actual_prompt:actualPrompt,reference_paths:references,started:Date.now(),editing:action==="edit"};await write(state);
notify((action==="edit"?"保存前の下書きをCSVに合わせて修正中 ":"生成中 ")+row.batch+"/"+row.name+"（"+row.index+"/500）");
let gen;
try{gen=await tools.image_gen__imagegen({prompt:actualPrompt,referenced_image_paths:references,transparent_background:true});}
catch(e){
const error=String(e);
if(error.includes("moderation_blocked")){
state.held=[...new Set([...(state.held||[]),row.batch+"/"+row.name])];
state.hold_records=[...(state.hold_records||[]),{batch:row.batch,index:row.index,name:row.name,actual_prompt:actualPrompt,error,request_id:error.match(/request ID ([a-f\d-]+)/i)?.[1]||null,recorded_at:new Date().toISOString()}];
state.current=null;state.pending=null;await write(state);await run("holdlog");
notify("安全ブロックを記録して保留 "+row.batch+"/"+row.name+"（元のプロンプトから変更せず次へ進みます）");
}
text({error,row});return;
}
const source=gen.output_hint?.match(/ as (C:\\[^\n]+?\.png) by default/)?.[1];if(!source)throw new Error("Native output path missing");
state.pending={row,source,actual_prompt:actualPrompt,reference_paths:references};state.current=null;await write(state);text(row);generatedImage(gen);
const preview=await run("preview");const viewed=await tools.view_image({path:preview.path});image(viewed.image_url);
}
