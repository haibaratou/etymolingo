import json
from pathlib import Path
items=[
('stalker.png','A stalker follows a woman along the street while she walks away, uneasy.','つきまといの男が、警戒する女性の後を通りで追っている。','実画像は不安そうな女性を後ろから追う人物。第一語義に一致。'),
('sympathize.png','A friend tries to sympathize as a woman cries beside him on a bench.','ベンチで泣く女性に、隣の友人が寄り添っている。','実画像は泣く友人を慰める場面。第一語義「commiserate」に一致。'),
('taker.png','The taker receives a warm bowl of soup from a volunteer at the counter.','受け取り手が、配膳台でボランティアから温かいスープの器を受け取っている。','実画像は食事を差し出され受け取る人。対象語義に一致。正本第一英語義は空欄。'),
('tenacious.png','The tenacious hiker persists in tightening a stubborn bootlace.','粘り強いハイカーが、固く結んだ靴ひもを締め直している。','実画像はうまくいかなくても靴ひもを結び続ける様子。第一語義「persistent」に一致。'),
('traceable.png','The traceable footprints lead from the doorway across the dirt.','たどれる足跡が、戸口から土の上へ続いている。','実画像は追跡できる足跡をたどる場面。第一語義に一致。'),
('unrestrained.png','Unrestrained cheering fills the room as a fan leaps before the television.','テレビの前でファンが飛び上がり、思い切り歓声を上げている。','実画像は抑えのない歓喜の反応。第一語義に一致。'),
('xylem.png','The xylem carries water upward through the cut plant stem.','木部が、切り取った植物の茎の中で水を上へ運ぶ。','実画像は植物の茎を通って水が上がる様子。第一語義に一致。'),
('Sardinia.png','Sardinia is an Italian island shown with a mountainous interior and nearby islets.','サルデーニャ島は、山地の広がるイタリアの島として周囲の小島とともに描かれている。','実画像は島と山地、周囲の小島。第一語義に一致。'),
('Tyrone.png','The county of Tyrone shows green hills, fields, homes, and winding lanes.','ティロン県の緑の丘や畑、家々の間を曲がりくねった道が通っている。','実画像はティロン県の田園風景。第一語義に一致。'),
('accursed.png','An accursed chest leaves a frightened man recoiling from what he found inside.','呪われた箱を開けた男性が、中を見ておびえ、身を引いている。','実画像は箱の中身に怯える人物。第一語義に一致。')]
cfg={'batch':24,'items':[{'file':a,'en':b,'ja':c,'note':d} for a,b,c,d in items]}
Path(r'D:\etymolingo\work\etymopedia\codex\_tmp_existing_cfg.json').write_text(json.dumps(cfg,ensure_ascii=False),encoding='utf-8')
