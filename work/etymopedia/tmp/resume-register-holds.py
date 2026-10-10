import csv, pathlib, os
b=pathlib.Path('D:/etymolingo/work/etymopedia')
problems={'antimony.png':'日本語は元素アンチモン、第一英語義は輝安鉱stibnite','backlog.png':'日本語は未処理分、第一英語義は炉の奥の薪','caster.png':'プロンプトは車輪、日本語はキャスター、第一英語義は鋳造する人・機械','catfish.png':'日本語はキャットフィッシングの動詞、第一英語義は魚','comp.png':'日本語はタンパク質、第一英語義は無料券','monstrosity.png':'日本語は巨大なもの、第一英語義は動植物の奇形','gusto.png':'日本語は嗜好、第一英語義は熱意','layman.png':'日本語は素人、第一英語義は非聖職者','Sphinx.png':'日本語とプロンプトは像、第一英語義はギリシャ神話の翼ある女性怪物','bilinear.png':'日本語は2本の線、第一英語義は二変数それぞれについて線形','faceless.png':'日本語は顔のない、第一英語義は個性に乏しい','fingering.png':'日本語とプロンプトは指いじり、第一英語義は楽器の運指','relatable.png':'日本語は話すことのできる、第一英語義は因果・論理的に関連付けられる','brainstorm.png':'日本語は突然の妙案、第一英語義は集団で案を出す動詞','candor.png':'日本語は公平無私、第一英語義は正直さ','cavalier.png':'日本語は紳士、第一英語義は尊大で軽んじる態度','noodle.png':'日本語はヌードル、第一英語義は愚かな人'}
p=b/'codex/prompt_rows_027.csv'
with p.open(encoding='utf-8-sig',newline='') as f:
 rd=csv.DictReader(f); fields=rd.fieldnames; rows=list(rd)
with (b/'prompt_review_pending.csv').open(encoding='utf-8-sig',newline='') as f:
 rd=csv.DictReader(f); lf=rd.fieldnames; ledger=list(rd)
can={r['ファイル名']:r for r in csv.DictReader(open('D:/etymon-source/tools/word-art-todo.csv',encoding='utf-8-sig'))}
for r in rows:
 name=r['ファイル名']
 if name not in problems: continue
 assert not (b/'_illust/prompt_rows_027'/name).exists()
 r['制作状態']='needs_revision'; r['要確認理由']=problems[name]+'。正本の語義整合確認待ち'; r['検品メモ']='未生成・語義不一致のため保留'
 existing=next((x for x in ledger if x['ファイル名']==name and x['状態']!='解決済み'),None)
 if existing is None: ledger.append({'ファイル名':name,'単語':can[name]['単語'],'問題':r['要確認理由'],'発見バッチ':'prompt_rows_027画像生成引継ぎ時','状態':'未解決'})
for path,cols,data in [(p,fields,rows),(b/'prompt_review_pending.csv',lf,ledger)]:
 tmp=path.with_suffix('.resume.tmp')
 with tmp.open('w',encoding='utf-8-sig',newline='') as f:
  w=csv.DictWriter(f,fieldnames=cols);w.writeheader();w.writerows(data)
 os.replace(tmp,path)
print('Registered 17 semantic holds; existing ledger entries preserved.')
