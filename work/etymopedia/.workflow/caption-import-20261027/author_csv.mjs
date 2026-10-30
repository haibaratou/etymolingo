import fs from 'node:fs/promises';
import {createRequire} from 'node:module';
import {pathToFileURL} from 'node:url';
import crypto from 'node:crypto';
const [input,output,modules]=process.argv.slice(2);
const require=createRequire(import.meta.url);
// The sandbox does not permit Windows junction creation. Resolve the bundled
// runtime's public package entry point without writing to that dependency tree.
const {Workbook}=await import(pathToFileURL(require.resolve('@oai/artifact-tool',{paths:[modules]})).href);
const data=JSON.parse(await fs.readFile(input,'utf8'));
if(data.fields.length!==19)throw Error('The formal template requires exactly 19 columns');
const matrix=[data.fields,...data.rows.map(row=>data.fields.map(field=>row[field]??''))];
const wb=Workbook.create(),sheet=wb.worksheets.add('生成プロンプト');
sheet.getRange(`A1:S${matrix.length}`).values=matrix;
wb.recalculate();
const values=sheet.getRange(`A1:S${matrix.length}`).values;
if(JSON.stringify(values)!==JSON.stringify(matrix))throw Error('Artifact table changed an input cell');
const quote=x=>/[",\r\n]/.test(String(x))?'"'+String(x).replaceAll('"','""')+'"':String(x);
const payload='\ufeff'+values.map(row=>row.map(quote).join(',')).join('\r\n')+'\r\n';
if(data.expected_before_sha256){
 const before=await fs.readFile(output);if(crypto.createHash('sha256').update(before).digest('hex')!==data.expected_before_sha256)throw Error('Another editor changed this task-owned staged CSV');
 const tmp=output+'.stage-tmp';await fs.writeFile(tmp,payload,{encoding:'utf8',flag:'wx'});await fs.rename(tmp,output);
}else await fs.writeFile(output,payload,{encoding:'utf8',flag:'wx'});
console.log(JSON.stringify({path:output,rows:matrix.length-1,columns:19}));
