// Run: node tests/explorer-family-tags.test.cjs
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {resolveFamilyTags}=require('../app/shared/explorer-difficulty-v2.js');
assert.deepEqual(resolveFamilyTags({g:'Wt',gs:[]},'古英語 steam は 熱い物や燃える物から立ちのぼる蒸気'),[],'memo prose must never become language tags');
assert.deepEqual(resolveFamilyTags({g:'G',gs:['G','Wt','G']},''),['G'],'ignore unsupported codes and duplicates');
assert.deepEqual(resolveFamilyTags({g:'L',gs:['Gr','L']},''),['Gr','L'],'keep reviewed hybrid origin');
assert.deepEqual(resolveFamilyTags({g:'',gs:[]},'G L'),['G','L'],'allow only recognized fallback codes');
assert.deepEqual(resolveFamilyTags({g:'',gs:[]},'古英語 steam'),[],'reject arbitrary fallback text');
const src=fs.readFileSync(path.join(__dirname,'../app/shared/explorer-difficulty-v2.js'),'utf8');
const row=src.slice(src.indexOf('function processRow(tr)'),src.indexOf('function processTable(t)'));
assert.ok(row.indexOf('for(const i of removed)')>=0&&row.indexOf('for(const i of removed)')<row.indexOf('renderFamilyTags(tr,w)'),'legacy columns must be removed before adjusted family/meaning/POS index reads');
console.log('Explorer family tags and adjusted column indexing: OK');
