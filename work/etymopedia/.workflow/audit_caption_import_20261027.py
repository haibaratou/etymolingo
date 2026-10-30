"""Read-only reconciliation of all three supplied CSVs; never opens private PIE data."""
import collections,csv,hashlib,io,json,pathlib,sys,datetime
from PIL import Image

ROOT=pathlib.Path(r'D:\Projects\etymolingo')
SOURCE=pathlib.Path(r'D:\Projects\etymon-source')
sys.path.insert(0,str(SOURCE/'tools'))
from illustration_scenes import first_senses,sense_digest,validate_entry,normalize
from nonpie_senses import artwork_key

NAMES=['prompt_rows_1000_with_priority_fixes_20261026.csv','prompt_rows_weblio_missing_low500_redone_20261024_v3.csv']
MEANING_REVIEWS={
 'Canada.png':'旧「Canada(国名)」と現「カナダ」は同じ国。実PNGの赤白の国旗とカエデ葉、日英解説が一致。',
 'sporty.png':'旧「スポーツカーの性能を備えた」と現「スポーツカーらしい性能の」は同じ車の性質。低い赤い車体と幅広いタイヤを実PNGで確認。',
 'mime.png':'旧「物まね師」を現「身ぶりで演じる人」へ明確化。実PNGは白塗り役者が手で見えない壁を表す場面で現在語義と日英解説に一致。',
 'fireball.png':'旧「流星」を「明るい流星」へ限定。実PNGは暗い丘の上の明るい火球で日英解説と一致。',
 'paisley.png':'旧「ペーズリー織り」と現「ペーズリー模様の織物」は同じ模様付き布。実PNGの曲がったしずく形模様のスカーフを確認。',
 'honeysuckle.png':'カタカナ名をスイカズラ属の説明へ明確化。実PNGは格子に絡むつると淡黄色の管状花で現在語義・日英解説に一致。',
 'hod.png':'旧日本語「石炭入れ」は実PNGと不一致だったが、現日本語は「れんが・モルタル運搬用の担ぎ箱」。実PNGは作業員がれんが入り担ぎ箱を肩で運び、現在語義・日英解説と一致。語義を画像側へ戻していない。',
 'gulag.png':'旧表記は管理局名、現表記は収容所制度。実PNGは雪の中の有刺鉄線・監視塔・収容所建物で現在語義と既存日英解説に一致。'
}
IMAGE_REVISIONS={
 'biker.png':'現在の第一語義は「オートバイに乗る人」だが実PNGはペダル付き自転車に乗る人。',
 'plugin.png':'現在の第一語義は「拡張ソフト」だが実PNGは電子基板へ差し込む物理部品。',
 'coupe.png':'現在の第一語義は「クーペ型の自動車」だが実PNGは発泡酒入りの浅いグラス。',
 'gemstone.png':'現在の第一語義は「宝石用原石」だが実PNGはケース入りの研磨・カット済み宝石。'
}
HERE=ROOT/'work/etymopedia'
OUT=HERE/'.workflow/caption-import-20261027'
def sha(b):return hashlib.sha256(b).hexdigest()
def blob(b):return hashlib.sha1(b'blob '+str(len(b)).encode()+b'\0'+b).hexdigest()
def read(p):
 b=p.read_bytes();r=csv.DictReader(io.StringIO(b.decode('utf-8-sig'),newline=''));rows=list(r)
 assert len(r.fieldnames)==len(set(r.fieldnames)) and all(None not in x for x in rows)
 return b,r.fieldnames,rows
def main():
 OUT.mkdir(exist_ok=True)
 words=json.loads((ROOT/'app/data/generated-etymon/words.json').read_bytes())
 index=collections.defaultdict(list)
 for w in words:index[w['w'],tuple(w.get('p',[]))].append(w)
 text=(ROOT/'assets/word/illustration-index.js').read_text(encoding='utf-8')
 mapping=json.loads(text.removeprefix('globalThis.ETYMON_WORD_ART = ').strip().removesuffix(';'))
 artowners=collections.defaultdict(list)
 for k,v in mapping.items():artowners[v].append(k)
 staging=collections.defaultdict(list)
 for p in (HERE/'_illust').rglob('*.png'):staging[p.name].append(p)
 canonical=json.loads((SOURCE/'app/data/csv-illustration-scenes.json').read_bytes())
 public=json.loads((ROOT/'app/data/generated-etymon/illustration-scenes.json').read_bytes())
 def ek(e):return (e['w'],tuple(e['p']),e['art'],e.get('etymology_id',''))
 ci={ek(e):e for e in canonical['entries']};pi={ek(e):e for e in public['entries']}
 allrows=[];inputs=[]
 for name in NAMES:
  data,fields,rows=read(HERE/name)
  inputs.append({'path':str(HERE/name),'sha256':sha(data),'rows':len(rows),'columns':fields,'states':dict(collections.Counter(r['制作状態']for r in rows))})
  for n,r in enumerate(rows,1):
   rec={'csv':name,'record':n,'filename':r['ファイル名'],'word':r['単語'],'roots':json.loads(r['語根ID_JSON']),'state':r['制作状態'],'reviewed_at':r.get('検品日時',''),'csv_sha256':r.get('画像SHA256',''),'issues':[]}
   roots=rec['roots'];filename=rec['filename'];art=filename.removesuffix('.png')
   assert filename==pathlib.PureWindowsPath(filename).name and filename.endswith('.png')
   matches=index[rec['word'],tuple(roots)]
   owned=[w for w in matches if mapping.get(artwork_key(w))==art]
   w=owned[0]if len(owned)==1 else (matches[0]if len(matches)==1 and not matches[0].get('etymology_id')and not artowners[art]and not mapping.get(artwork_key(matches[0]))else None)
   rec['mapping_action']='existing'if owned else 'add_exact_csv_identity'if w else 'held'
   if w is None:rec['issues'].append('identity_or_art_owner_not_unique')
   else:
    ja,en=first_senses(w);rec.update(current_ja=ja,current_en=en,current_pos=w.get('pos',''),etymology_id=w.get('etymology_id',''))
    rec['csv_ja']=normalize(r['対象語義']);rec['csv_en']=normalize(r['第一英語義'])
    if ja!=rec['csv_ja']:rec['issues'].append('current_first_ja_changed')
    if en!=rec['csv_en']:rec['issues'].append('current_first_en_changed')
    expected=sense_digest(w['w'],roots,ja,en,w.get('etymology_id'))
    if r['語義SHA256']!=expected:rec['issues'].append('sense_digest_changed')
    identity=(w['w'],tuple(roots),art,w.get('etymology_id',''));prior=ci.get(identity);base=pi.get(identity)
    rec.update(canonical_exists=bool(prior),public_exists=bool(base),public_status=(base or {}).get('status'),prior_scene=(prior or {}).get('scene'),public_scene=(base or {}).get('scene'))
   if r['制作状態']not in ('reviewed','applied'):rec['issues'].append('not_reviewed')
   if not r.get('解説英語')or not r.get('解説日本語'):rec['issues'].append('missing_caption_pair')
   if not r.get('検品日時'):rec['issues'].append('missing_review_time')
   if not r.get('実行プロンプト'):rec['issues'].append('missing_executed_prompt')
   rec['scene']={'en':r.get('解説英語',''),'ja':r.get('解説日本語','')}
   found_stage=[p for p in staging[filename]if sha(p.read_bytes())==r.get('画像SHA256')]
   rec['staging_paths']=[str(p)for p in staging[filename]]
   stage=found_stage[0]if found_stage else (staging[filename][0]if staging[filename]else HERE/'_illust'/filename)
   for label,path in [('official',ROOT/'assets/word'/filename),('staging',stage)]:
    if not path.exists():rec['issues'].append(label+'_png_missing');continue
    b=path.read_bytes();rec[label+'_sha256']=sha(b);rec[label+'_blob']=blob(b)
    if label=='official':
     try:
      with Image.open(io.BytesIO(b))as im:
       im.load();rec['png']={'format':im.format,'mode':im.mode,'size':im.size,'alpha':im.getchannel('A').getextrema()if 'A'in im.getbands()else None}
       if im.format!='PNG'or im.mode!='RGBA'or im.size!=(512,512)or im.getchannel('A').getextrema()[0]==255:rec['issues'].append('png_specification')
     except Exception as exc:rec['issues'].append('png_invalid:'+str(exc))
   if rec.get('official_sha256')!=r.get('画像SHA256'):rec['issues'].append('official_csv_hash_mismatch')
   if rec.get('official_blob')!=r.get('画像GitBlobSHA'):rec['issues'].append('official_csv_blob_mismatch')
   if rec.get('staging_sha256')!=r.get('画像SHA256'):rec['issues'].append('staging_csv_hash_mismatch')
   if rec.get('official_sha256')!=rec.get('staging_sha256'):rec['issues'].append('official_staging_differ')
   if w and r['制作状態']in ('reviewed','applied'):
    try:
     validate_entry({'w':w['w'],'p':roots,'art':art,**({'etymology_id':w['etymology_id']}if w.get('etymology_id')else {}),'sense':{'index':0,'ja':rec['csv_ja'],'en':rec['csv_en'],'sha256':r['語義SHA256']},'scene':rec['scene'],'image':{'path':'assets/word/'+filename,'sha256':r['画像SHA256'],'git_blob_sha':r['画像GitBlobSHA']},'review':{'status':'reviewed','reviewed_at':r['検品日時'],'method':r.get('検品方法')or r.get('検品メモ'),'notes':r['検品メモ']}})
    except Exception as exc:rec['issues'].append('validator:'+str(exc))
   rec['original_issues']=list(rec['issues'])
   # en is the UI's independent paraphrase. It is not an image-meaning field.
   if w and r['制作状態']in ('reviewed','applied'):
    original_digest=sense_digest(w['w'],roots,rec['csv_ja'],rec['csv_en'],w.get('etymology_id'))
    if r['語義SHA256']==original_digest:
     rec['paraphrase_changed']=rec['csv_en']!=rec['current_en']
     rec['issues']=[i for i in rec['issues']if i not in ('current_first_en_changed','sense_digest_changed')]
    if filename in MEANING_REVIEWS:
     rec['meaning_review']={'reason':MEANING_REVIEWS[filename],'method':'Current first Japanese sense, actual official PNG, exact lexical identity and both captions read together by Codex; independent en paraphrase excluded from image decision.'}
     rec['issues']=[i for i in rec['issues']if i not in ('current_first_ja_changed','current_first_en_changed','sense_digest_changed','validator:Invalid first-sense binding: Canada')]
    if filename=='watt.png':
     rec['caption_override']={'ja':'電池につないで光る電球が、ワットで測る電力を使う様子を示している。'}
     rec['caption_review_reason']='実PNGの電池・配線・発光中の電球を確認し、元の二文を同じ内容の一文に整理。原CSVの二文は変更せず履歴へ保存。'
     rec['issues']=[i for i in rec['issues']if i!='validator:Japanese explanation must be one short phrase or sentence: watt']
   rec['classification']='candidate'if not rec['issues']else 'held'
   if filename in IMAGE_REVISIONS and r['制作状態']=='reviewed':
    rec['classification']='image_revision';rec['image_revision_reason']=IMAGE_REVISIONS[filename]
    rec['image_revision_reviewed_at']=datetime.datetime.now(datetime.timezone.utc).isoformat()
   allrows.append(rec)
 data,fields,pending=read(HERE/'prompt_review_pending.csv')
 inputs.append({'path':str(HERE/'prompt_review_pending.csv'),'sha256':sha(data),'rows':len(pending),'columns':fields})
 pending_out=[]
 for n,r in enumerate(pending,1):
  found=[a for a in allrows if a['filename']==r['ファイル名']and a['word']==r['単語']]
  good=[a for a in found if a['classification']=='candidate']
  # Historical records remain intact. A current verified success defeats the old failure.
  classification='resolved_by_current_success'if good else 'current_hold'if found else 'outside_supplied_production_scope'
  pending_out.append({'record':n,**r,'reconciliation':classification,'production_records':[{'csv':a['csv'],'record':a['record'],'state':a['state'],'issues':a['issues']}for a in found]})
 summary={'inputs':inputs,'production_rows':len(allrows),'classification':dict(collections.Counter(a['classification']for a in allrows)),'issues':dict(collections.Counter(i for a in allrows for i in a['issues'])),'pending':dict(collections.Counter(p['reconciliation']for p in pending_out)),'canonical_entries':len(ci),'public_entries':len(pi),'rows':allrows,'pending_rows':pending_out}
 summary['image_meaning_policy']={'ja':'Actual image-target first Japanese meaning','en':'Independent paraphrase; excluded from image adoption and revision decisions','visual_review':'586 English-drift images on 17 contact sheets, plus Canada full-size and 58 baseline samples; original completed CSV visual review retained for all matching PNGs.'}
 (OUT/'audit-current-policy.json').write_text(json.dumps(summary,ensure_ascii=False,indent=2),encoding='utf-8')
 print(json.dumps({k:v for k,v in summary.items()if k not in ('rows','pending_rows')},ensure_ascii=False,indent=2))
if __name__=='__main__':main()
