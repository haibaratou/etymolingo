extends RefCounted
## 漢字クラフトの仕様（作字の字典 data/kanji_db.json を読む）
##
## 字の性能は「素」の足し算で決まる。
##   本体（行動）… 字を組み立てる部品のうち、最初に見つかった素の系統（偏・冠・外側を先に見る）
##   能力値     … 字を葉（素）まで分解し、素の系統ごとに能力値を一つずつ足す
##   格         … 素の数（深く組んだ字ほど格が高く、全体が強くなる）
## 字典は tools/build_kraft_db.py で作る（CHISE IDS と KANJIDIC2 から）。

static var K: Dictionary = {}
static var REC: Dictionary = {}
static var FAM: Dictionary = {}
static var USES: Dictionary = {}
static var NORM: Dictionary = {}
static var ALL: Array = []
## 部品を三つ・四つそろえて作る字（獲 = 犬＋艸＋隹＋又）。鍵は部品を並べ替えて | でつないだもの
static var SETREC: Dictionary = {}
## 魂の字を部品として読むときの言いかえ（草の魂は艸として使える）
const MAT = {"草": "艸", "艹": "艸"}
static var loaded := false

const STATS = ["pow", "area", "rate", "count", "dur", "pierce", "knock"]
const STAT_JP = {"pow": "威力", "area": "範囲", "rate": "速さ", "count": "数", "dur": "持続", "pierce": "貫通", "knock": "押し"}

## 系統: [行動の名前, 説明]。どの系統の素が、どの能力値を上げるかは FAM（字典）にある
const BODY = {
	"波": ["ripple", "水の字を流す", "向いている方へ水の字が波となって流れる。触れた字を軽く押して濡らし、近くの濡れた字へ小さな水の字が伝わる"],
	"炎": ["trail", "火を放つ", "向いている方へ赤い火の字を放つ。字に触れると傷を与え、小さな火がまとわりついて燃やし続ける。触れた場所にも火の字がしばらく残る"],
	"樹": ["tree", "歩いて木の道を育てる", "主人公が歩いた道に木の字が育つ。止まっている間は植えない。林は二つ、森は三つの木を受け継ぐ。道を輪に閉じると、囲んだ字へ木が集まって倒す"],
	"光": ["orbit", "照らす光", "頭上の光から輪が広がる。強化すると向いている方へ光の筋を放つ"],
	"刃": ["blade", "刀の字で斬る", "向いている方を刀と刃の字が弧を描いて薙ぐ。強化すると交差する斬撃になる"],
	"矢": ["arrow", "矢を放つ", "向いている方へ矢を放ち、直線上の字を射抜く"],
	"声": ["shout", "響きの輪", "間をおいて響きの輪を広げ、触れた字をまとめて削る。音は鳴り続けない"],
	"獣": ["beast", "獣の突進", "向いている方へ獣の足跡と爪が走る。噛み傷や角など、部首の性質を受け継ぐ"],
	"岩": ["slam", "岩を落とす", "向いている方に岩を落とし、落下のあと一直線に転がす"],
	"霊": ["aura", "墨を集めて響かせる", "墨を内側へ集め、ひと息置いて外へ響かせる。触れた字を鈍らせる"],
	"人": ["throw", "仲間を助ける", "近くの作字した仲間を短い間励まし、技を速める。助け合いの波に部首の力を宿す"],
	"門": ["wall", "庇う屋根", "主人公を庇う屋根を張り、有限の守りと部首の力を与える。敵を押し返さない"],
}
const FAM_COL = {
	"波": Color(0.16, 0.36, 0.62), "炎": Color(0.80, 0.22, 0.10), "樹": Color(0.20, 0.45, 0.22), "光": Color(0.78, 0.58, 0.10),
	"刃": Color(0.35, 0.35, 0.42), "矢": Color(0.50, 0.30, 0.15), "声": Color(0.62, 0.20, 0.45), "獣": Color(0.55, 0.36, 0.12),
	"岩": Color(0.38, 0.32, 0.26), "霊": Color(0.42, 0.25, 0.62), "人": Color(0.20, 0.20, 0.20), "門": Color(0.12, 0.42, 0.45),
}

static func load_db() -> void:
	if loaded:
		return
	loaded = true
	var f = FileAccess.open("res://data/kanji_db.json", FileAccess.READ)
	if f == null:
		push_error("kanji_db.json がない")
		return
	var d = JSON.parse_string(f.get_as_text())
	K = d.K
	REC = d.REC
	FAM = d.FAM
	NORM = d.NORM
	for key in REC:
		var ab = String(key).split("+")
		for r in REC[key]:
			for c in ab:
				if not USES.has(c):
					USES[c] = []
				if not USES[c].has(r):
					USES[c].append(r)
	for c in K:
		var lv: Array = K[c].get("lv", [])
		if lv.size() >= 3 and lv.size() <= 4 and bool(K[c].get("ally", false)):
			var key: String = set_key(lv)
			if not SETREC.has(key):
				SETREC[key] = []
			SETREC[key].append(c)
	ALL = K.keys()
	ALL.sort_custom(func(a, b): return int(K[a].stk) < int(K[b].stk) if int(K[a].stk) != int(K[b].stk) else a < b)

static func mat(ch: String) -> String:
	return MAT.get(ch, ch)

static func set_key(parts: Array) -> String:
	var a: Array = parts.map(func(x): return mat(String(x)))
	a.sort()
	return "|".join(a)

## 部品をそろえてできる字（二つなら今までの作り方も含む）
static func make_set(parts: Array) -> Array:
	var out: Array = []
	if parts.size() == 2:
		out = make(parts[0], parts[1])
	for r in SETREC.get(set_key(parts), []):
		if not out.has(r):
			out.append(r)
	return out

static func has(ch: String) -> bool:
	return K.has(ch)

## 仲間になれる字: 二つの部品を合わせた字で、部首（なければ意符・部品）に系統がある字だけ。
## 一字だけの字（一・犬・刀…）は材料にしかならない
static func can_ally(ch: String) -> bool:
	return bool(K.get(ch, {}).get("ally", false))

## 能力をくれた部品と、その素（例: 猫 → 犭(犬) から獣）
static func src_of(ch: String) -> Array:
	var k: Dictionary = K.get(ch, {})
	return [String(k.get("src", "")), String(k.get("via", ""))]

## ---- 部首が「効果」、字の意味が「動き」 ----
## 効果: 部首（の系統）が決める。当たった字に何が起きるか・どう見えるか
const EFFECT_JP = {
	"波": "濡らす（濡れた字へ水の字が伝わる）", "炎": "小さな火がまとわりつき燃やし続ける", "樹": "根で絡めて鈍らせる", "光": "光で焼く",
	"刃": "斬る（斬撃が後ろの字へ抜ける）", "矢": "射抜く（後ろの字にも届く）", "声": "響かせて怯ませる", "獣": "噛み傷を残す（あとで裂ける）",
	"岩": "打ちのめして止める", "霊": "祟って鈍らせる", "人": "仲間を励まし技を速める", "門": "一時の守りを得る（回数に限り・押し返さない）",
}
## 部首ごとの効果（獣の系統でも、犬は噛み・虍は爪・鳥はついばむ…と部首で違う）
const RAD_EFFECT = {
	"犬": ["bite", "噛みつく（噛み傷があとで裂ける）"], "犮": ["bite", "噛みつく（噛み傷があとで裂ける）"], "豸": ["bite", "噛みつく（噛み傷があとで裂ける）"],
	"虍": ["claw", "虎の爪で引き裂く（傷があとで裂ける）"], "虎": ["claw", "虎の爪で引き裂く（傷があとで裂ける）"],
	"鳥": ["peck", "ついばむ（すばやく何度も）"], "隹": ["peck", "ついばむ（すばやく何度も）"], "羽": ["peck", "羽で打つ"],
	"虫": ["sting", "刺して痺れさせる"], "魚": ["bubble", "泡で包んで鈍らせる"],
	"馬": ["trample", "体当たりしてひるませる"], "牛": ["horn", "角で打ってひるませる"], "鹿": ["horn", "角で打ってひるませる"], "角": ["horn", "角で打ってひるませる"],
	"羊": ["horn", "角で打ってひるませる"], "豕": ["trample", "突き当たってひるませる"], "毛": ["bubble", "毛でくるんで鈍らせる"], "皮": ["bubble", "皮でくるんで鈍らせる"],
	"龍": ["claw", "龍の爪で引き裂く（傷があとで裂ける）"], "竜": ["claw", "龍の爪で引き裂く（傷があとで裂ける）"],
}
static func eff_of(ch: String) -> String:
	var r: String = rad_of(ch)
	if RAD_EFFECT.has(r):
		return RAD_EFFECT[r][0]
	return String(K.get(ch, {}).get("b", "人"))

static func effect_jp(ch: String) -> String:
	var r: String = rad_of(ch)
	if RAD_EFFECT.has(r):
		return RAD_EFFECT[r][1]
	return String(EFFECT_JP.get(String(K.get(ch, {}).get("b", "人")), ""))

## 動きの土台は部首の継承。確かな字義は作字による方向転換として重ねる。
## 部首・部品の能力値はそのまま残し、字義を勝手な語源説明にしない。
const MOTION_JP = {
	"plant": ["歩いて木の道を育てる", "歩いた道に木の字が等間隔で生え、触れた字を根で絡める。林は二つ、森は三つの木が育ち、道が密になって長く残る。道を輪に閉じると、囲んだ字へ木が集まる。止まっている間は植えない"],
	"blaze": ["赤い火を放つ", "向いている方へ揺らめく赤い火の字を放つ。触れた字に傷を与え、小さな火がまとわりついて燃やし続ける。部品の数を受け継ぎ、Lv3とLv5で火の筋が増える"],
	"tide": ["水の字で波を流す", "向いている方へ水の字が波となって流れ、触れた字を軽く押して濡らす。河・江・洲は三筋の川となり、強化すると流れる水の筋が増える"],
	"thunder": ["雷を落とす", "向いている方に雲の字が現れて力を溜め、予告した場所へ電と雷の字が落ちる。Lv3から電の字が枝分かれする"],
	"snowfall": ["雪の字を降らせる", "向いている方へ小さな雪の字がゆっくり降り、触れた字を鈍らせる。部品の数と強化で雪が降る場所が増える"],
	"rainfall": ["雨の字を降らせる", "向いている方に雲の字を置き、その下で小さな雨の字を降らせる。雨が触れた字に部首の力を伝え、Lv3から雨雲が増える"],
	"cleave": ["刀の字で斬る", "向いている方を刀と刃の字が弧を描いて薙ぐ。部品の数と強化で斬撃が増え、重なって薙ぎ払う"],
	"weave": ["糸の網で絡める", "向いている方へ糸の字を網目に広げ、触れた字の動きを鈍らせる。部品の数と強化で網が増え、Lv3から網目が密になる"],
	"shelter": ["屋根で庇う", "主人公の上に屋根を張り、回数に限りのある守りを与える。敵を押し返さず、触れた字に部首の力を与える"],
	"gust": ["風を吹かす", "向いている方へ、墨を巻き上げる風の帯を通す。部品の数と強化で風筋が増え、扇状に広がる"],
	"boulder": ["岩を転がす", "向いている方に岩を落とし、落下のあと一直線に転がす。部品の数と強化で落とす岩が増える"],
	"rest": ["木陰で休む", "動かずに木陰で休息を溜めると命を一つ取り戻す。動くと溜めた休息が減る。強化すると待ちが短くなり、木陰には部首の力が宿る"],
	"mend": ["命を癒す", "間をあけて命を一つ取り戻す。生の字が集まり、心の字を静かに膨らませる。薬・治療・回復の字の働き"],
	"radiance": ["頭上から照らす", "頭上に光を灯し、光の部品の数を受け継いで輪を重ねる。Lv2から向いている方へ光線を、Lv3から本数を増やして扇状に放つ"],
	"scatter_seed": ["種を蒔く", "向いている方へ種を蒔き、落ちた場所に花や草の茂みを育てる。育った茂みに部首の力が残る"],
	"pounce": ["獣が跳びかかる", "向いている方へ跳びかかり、足跡と爪を残す。部品の数と強化で跳びかかる筋が増える。噛み・角などの違いは部首から受け継ぐ"],
	"flock": ["鳥の群れが飛ぶ", "向いている方へ、鳥の群れが翼を連ねて飛ぶ。Lv3から群れが大きく広がり、ついばむ力を運ぶ"],
	"rally": ["仲間を励ます", "作字した仲間を短い間励まし、技を速める。人の字が広がり、助け合う众の字が脈打つ"],
	"heart_pulse": ["墨を集めて響かせる", "墨を内側へ集め、ひと息置いて外へ響かせる。心や思いの字は、集める間と解き放つ間を持つ"],
	"inscribe": ["墨に力を宿す", "向いている方へ墨の筆跡を刻み、部首の力を宿す。字義専用の技がない字でも、受け継いだ性質は残る"],
	"detonate": ["溜めて爆ぜる", "向いている方で力を溜め、予告した場所を一度に爆ぜさせる。続けて撃てず、次の爆発まで間を置く"],
	"cage": ["囲って捕らえる", "向いている方に有限の囲いを作り、中の字を捕らえる。時間がたつと解け、敵を押し返さない"],
	"haze": ["月の字が朧にかすむ", "薄い月の字が揺れながら主人公について広がり、触れた字へ部首の力を宿す"],
	"calamity": ["水火の災い", "向いている方に水と火の災いを交互に残す。川と火を組む字から、二つの性質が入れ替わる技へ転じる"],
	"aura": ["霊の結界", "主人公のまわりに霊の結界を張る。中の字に部首の力を与え、鈍らせる。押し返さない"],
	"lamp": ["照らす", "字そのものが主人公のそばに灯り、まわりを照らし続ける。照らされた字に効果"],
	"spread": ["広がる", "字そのものがでたらめに飛びまわり、降りた所から災いが次々と広がる"],
	"fall": ["降る", "この字が上から降ってきて、落ちた所にしばらく溜まり、踏んだ字を削りつづける（聖水のように）"],
	"guard": ["守る", "主人公のまわりを巡り、近づいた字の命を削る（押し返さない）"],
	"rush": ["駆ける", "字そのものが駆けて噛みつき・体当たりし、戻る"],
	"rampage": ["暴れる", "字そのものが縦横無尽に暴れまわり、触れた字を大きく弾き飛ばす"],
	"flow": ["流れる", "主人公から字の群れへ、帯になって流れる"],
	"orbit": ["巡る", "字そのものが主人公のまわりを巡って当たる"],
	"burst": ["響く", "まわりへ一気に広がる"],
	"bind": ["縛る", "近くの字に絡みついて動きを止める"],
	"shoot": ["矢を放つ", "向いている方へ一直線に矢を放ち、部首の力で貫く"],
	"river": ["流す", "主人公の足もとから、川の字の三筋のように下へ流れを放ちつづける"],
	"scatter": ["溢れる", "あらゆる方向へ、でたらめにこの字を放つ"],
	"frost": ["凍らせる", "まわりへ大量のこの字を、ゆっくりと放つ。触れた字は凍えて遅くなる"],
	"annihilate": ["滅ぼす奔流", "水と刃と火の力を収束させ、向いている方へ強い奔流を通す。撃ったあとは長く溜め直す"],
	"dragon": ["龍のように", "龍のように連なり、うねりながら主人公のまわりを巡って暴れ、ときに字へ食らいつく"],
	"slash": ["斬る", "主人公のまわりを、一定の間隔で順に斬りつける"],
	"laser": ["照らす", "主人公の頭上に昇り、一定の間隔でまわりに光の結界を張る。強化すると向いている方へ光線を放つ"],
	"garlic": ["寄せつけない", "主人公のまわりにいつも漂い、近づいた字の命を削る（押し返さない）"],
	"": ["", ""],
}
## 意味の転換がない字は、部首の自然な動き。心を灯に、人を投石にしない。
const RAD_MOTION = {
	"刀": "cleave", "刃": "cleave", "戈": "cleave", "斤": "cleave", "矛": "cleave", "殳": "cleave", "戌": "cleave", "戍": "cleave", "戉": "cleave", "辛": "cleave", "干": "cleave", "斧": "cleave",
	"日": "radiance", "光": "radiance", "白": "radiance", "月": "orbit", "夕": "orbit", "雨": "rainfall", "冫": "snowfall", "川": "tide", "風": "gust", "气": "gust",
	"火": "blaze", "木": "plant", "竹": "plant", "艸": "scatter_seed", "禾": "scatter_seed", "米": "scatter_seed", "屮": "scatter_seed",
	"水": "tide", "犬": "pounce", "馬": "pounce", "牛": "pounce", "豕": "pounce", "虎": "pounce", "虍": "pounce", "魚": "tide", "龍": "dragon", "竜": "dragon",
	"弓": "shoot", "矢": "shoot", "口": "burst", "言": "burst", "音": "burst", "糸": "weave", "網": "weave", "网": "weave",
	"宀": "shelter", "門": "shelter", "囗": "shelter", "土": "boulder", "石": "boulder", "山": "boulder", "鳥": "flock", "隹": "flock", "羽": "flock",
	"心": "heart_pulse", "示": "aura", "鬼": "aura", "歹": "aura", "衣": "weave", "巾": "weave",
}
## BODY の識別子は旧処理との互換のため維持。通常の技はここから選ぶ。
const FAMILY_MOTION = {"波": "tide", "炎": "blaze", "樹": "plant", "光": "radiance", "刃": "cleave", "矢": "shoot", "声": "burst", "獣": "pounce", "岩": "boulder", "霊": "heart_pulse", "人": "rally", "門": "shelter"}
## 辞書の短い英語が曖昧な字は、確認した日本語も含めて一字ずつ指定する。
## 順(order)を川、朧(hazy)を龍にするような部品だけの読み替えを避ける。
const MOTION_CH = {"滅": "annihilate", "爆": "detonate", "暴": "detonate", "囚": "cage", "朧": "haze", "災": "calamity", "嵐": "gust", "顺": "rally", "順": "rally", "種": "scatter_seed", "泉": "tide", "露": "rainfall", "洋": "tide", "州": "tide", "洲": "tide", "湧": "tide", "鳳": "flock", "蛍": "radiance", "蘇": "mend", "裁": "cleave", "伏": "shelter"}
const MOTION_GROUPS = {
	"rest": "休憩息",
	"mend": "治療癒医醫薬藥復",
	"plant": "林森杉松柏柳楊桐桂榕椿楠榎椰樹植栽杜桑竹",
	"blaze": "炎燃焚焼燒炊焦燎焰焔",
	"tide": "海潮湖江河川流泳浮漂洗沐浴濯津沖灘滝瀧波涛濤氾",
	"radiance": "明晴朗晃晄暉耀燿照燦旦暁曉曙旭日陽晟皓灯燈燭炬",
	"thunder": "雷電霆",
	"snowfall": "雪霜雹凍冷冰氷",
	"rainfall": "雨雫滴",
	"cleave": "伐斬切剣劍剃削裂断斷刈剖刻",
	"weave": "捕捉縛結絡綱網縄繩紐織縫編拘抱持",
	"shelter": "守護保衛家宅屋庇城壁盾楯砦囲圍蓋覆塞",
	"gust": "風吹飄颯颶飆扇",
	"flock": "鶴鷺鷹鷲鴉烏鳩雀鵬鶏鷄鴨雁燕翔",
	"pounce": "猫狐狼虎乕獅獣獸狩猟狗狛",
	"boulder": "岳峰峯嶺岩巌巖磐礫崖",
	"scatter_seed": "花華咲芽苗播蒔葉草艸蓮菊梅桃杏蘭藤藻蘆芦葦荻",
	"rally": "助佐佑祐輔伴侶援伝傳導率従從会會集協付併合",
	"heart_pulse": "思想念慮考悟悩惱懐懷情意志心恋愛",
}
## 転変は数値の上乗せではなく戦い方の方向転換。組み立ては既存字典のみ。
const TRANSFORMS = {
	"滅": ["滅却の奔流", "濡らす水から、刃と火を収束させて通す一撃へ。連射の代わりに溜め直す"],
	"爆": ["燃焼から爆発へ", "火を残し続ける技から、溜めて一度に爆ぜる技へ"],
	"暴": ["暴発する光", "周期的な光から、力を溜めて爆ぜさせる光へ"],
	"囚": ["守りから捕縛へ", "自分を囲う守りから、前方を囲って字を捕らえる技へ"],
	"朧": ["月光から朧の霧へ", "巡る月の光から、淡く広がり残る霧へ。龍の部品の力も受け継ぐ"],
	"災": ["水火が入れ替わる災い", "火を放つ技から、川と火の性質が入れ替わる領域へ"],
	"嵐": ["山から暴風へ", "岩を落とす技から、前を吹き抜ける風の帯へ"],
	"森": ["木を重ねて森へ", "木を重ねた持続と数の継承で、一本の木から厚い木立を育てる"],
	"休": ["助け合いから休息へ", "人の助け合いに木の持続を重ね、静止して命を取り戻す技へ"],
	"雷": ["雨から雷へ", "雨を降らせ続ける技から、予告して一瞬で落とす雷へ"],
	"伐": ["助け合いから斬撃へ", "人の速さに刃の貫通を重ね、前を薙ぎ払う技へ"],
}
const MOTION_EN = [
	["rest", ["rest", "relax", "repose", "breath", "breathe", "sleep", "nap"]],
	["mend", ["heal", "healing", "cure", "medicine", "medical", "restore", "recover", "recovery", "healthy", "revive", "resuscitate"]],
	["plant", ["forest", "grove", "wood", "woods", "tree", "treetrunk", "treetops", "plant", "planting", "pine", "cedar", "cypress", "oak", "willow", "paulownia", "mulberry", "camphortree", "coconuttree", "lotustree", "zelkovatree", "bamboo", "garden"]],
	["blaze", ["fire", "flame", "burn", "burning", "blaze", "char", "scorch", "ignite", "kindle", "bake", "cook", "hotwater", "heat"]],
	["tide", ["river", "brook", "creek", "canal", "sea", "opensea", "ocean", "lake", "water", "watered", "watersedge", "waterfall", "waterroute", "stream", "flow", "swim", "wave", "current", "pour", "tide", "flood", "inundate", "wash", "bathe", "float", "drift", "overflow", "flush", "gush", "splash", "spill"]],
	["thunder", ["thunder", "lightning", "electricity", "electric", "thunderbolt"]],
	["snowfall", ["snow", "hail", "frost", "ice", "freeze", "frozen", "cold", "cool", "chill", "icicle"]],
	["rainfall", ["rain", "drip", "dew", "raindrop", "shower"]],
	["radiance", ["lamp", "lantern", "torch", "candle", "illuminate", "light", "shine", "glow", "bright", "firefly", "lighthouse", "brilliant", "dawn", "sun", "sunshine", "risingsun", "clearup"]],
	["cleave", ["cut", "cutoff", "whittledown", "slash", "chop", "carve", "sever", "divide", "split", "fell", "mow", "reap", "shave", "trim", "prune", "slice", "behead", "sword", "blade", "axe"]],
	["weave", ["bind", "tie", "tangle", "entangle", "net", "netting", "catch", "trap", "seize", "hold", "capture", "grasp", "rope", "string", "thread", "knot", "weave", "sew", "knit", "wrap", "arrest", "embrace", "hug", "cable"]],
	["shelter", ["protect", "defend", "defense", "guard", "shield", "surround", "fence", "wall", "castle", "fort", "enclose", "shelter", "barrier", "roof", "house", "dwelling", "armor", "armour", "cover", "hide"]],
	["gust", ["wind", "blow", "gust", "breeze", "typhoon", "tempest", "storm", "foldingfan"]],
	["boulder", ["mountain", "mountains", "peak", "summit", "cliff", "hill", "rock", "boulder", "stone", "gravel"]],
	["flock", ["bird", "largebird", "crane", "heron", "eagle", "hawk", "falcon", "dove", "sparrow", "crow", "raven", "phoenix", "chicken", "fowl", "wildduck", "wildgoose", "goose", "duck", "owl", "fly", "flight"]],
	["pounce", ["beast", "animal", "cat", "dog", "hound", "tiger", "fox", "wolf", "lion", "hunt", "hunting", "bite", "run", "rush", "charge", "gallop", "attack", "raid", "assault", "dash", "leap", "jump"]],
	["scatter_seed", ["flower", "blossom", "sprout", "seed", "seedling", "sow", "leaf", "leaves", "grass", "reed", "lotus", "chrysanthemum", "orchid", "wisteria", "peach", "apricot", "ume", "seaweed", "riceplant"]],
	["rally", ["help", "aid", "assist", "support", "accompany", "companion", "cooperation", "lead", "obey", "transmit", "meet", "gather", "collect", "join", "puttogether", "attach", "connect"]],
	["heart_pulse", ["heart", "think", "thought", "concept", "consider", "comprehension", "worry", "feeling", "idea", "intention", "love", "romance", "concentrate", "meditate"]],
	["detonate", ["explode", "explosion", "detonate", "eruption"]],
	["haze", ["hazy", "behazy", "mist", "fog", "cloud", "cloudy", "dim"]],
	["calamity", ["disaster", "calamity"]],
	["spread", ["plague", "epidemic", "curse", "infect", "bewitch"]],
	["orbit", ["loop", "circle", "round", "turn", "rotate", "revolve", "wheel", "spin", "return", "patrol", "around", "times", "whirl", "eddy"]],
	["burst", ["explode", "burst", "shout", "cry", "roar", "bark", "call", "sing", "chirp", "sound", "voice", "yell", "scream", "echo", "howl", "song", "music", "drum", "erupt"]],
	["shoot", ["shoot", "throw", "launch", "release", "shot", "arrow", "fling", "toss", "spit"]],
]

## 部首ごとの色（火は朱、水は藍…）。表にない部首は系統の色
const RAD_COL = {
	"火": Color(0.86, 0.16, 0.08), "赤": Color(0.86, 0.16, 0.08), "黒": Color(0.15, 0.12, 0.12),
	"水": Color(0.12, 0.36, 0.72), "冫": Color(0.35, 0.68, 0.86), "雨": Color(0.32, 0.45, 0.62), "川": Color(0.12, 0.40, 0.70), "氷": Color(0.45, 0.75, 0.90), "風": Color(0.40, 0.58, 0.58),
	"木": Color(0.18, 0.48, 0.20), "艸": Color(0.38, 0.62, 0.22), "竹": Color(0.25, 0.55, 0.32), "禾": Color(0.70, 0.60, 0.22), "米": Color(0.75, 0.68, 0.45),
	"日": Color(0.92, 0.62, 0.08), "月": Color(0.78, 0.74, 0.45), "白": Color(0.62, 0.62, 0.66), "目": Color(0.42, 0.30, 0.62), "青": Color(0.15, 0.42, 0.55), "夕": Color(0.85, 0.42, 0.22),
	"刀": Color(0.40, 0.44, 0.52), "戈": Color(0.36, 0.38, 0.46), "斤": Color(0.42, 0.40, 0.44), "弓": Color(0.55, 0.32, 0.14), "矢": Color(0.50, 0.30, 0.15), "羽": Color(0.48, 0.52, 0.66),
	"口": Color(0.78, 0.18, 0.30), "言": Color(0.55, 0.22, 0.55), "耳": Color(0.72, 0.42, 0.40), "音": Color(0.62, 0.28, 0.56),
	"犬": Color(0.60, 0.38, 0.14), "虍": Color(0.88, 0.52, 0.06), "虎": Color(0.88, 0.52, 0.06), "龍": Color(0.10, 0.45, 0.40), "竜": Color(0.10, 0.45, 0.40), "鹿": Color(0.62, 0.42, 0.22), "馬": Color(0.50, 0.30, 0.12), "鳥": Color(0.25, 0.30, 0.58), "隹": Color(0.30, 0.34, 0.58), "虫": Color(0.45, 0.50, 0.15), "魚": Color(0.15, 0.50, 0.55), "羊": Color(0.70, 0.66, 0.55), "牛": Color(0.45, 0.32, 0.22),
	"土": Color(0.55, 0.40, 0.22), "山": Color(0.30, 0.38, 0.28), "石": Color(0.45, 0.45, 0.45), "金": Color(0.82, 0.66, 0.18), "玉": Color(0.30, 0.62, 0.50), "田": Color(0.55, 0.45, 0.20), "貝": Color(0.72, 0.55, 0.35), "阜": Color(0.48, 0.38, 0.28),
	"示": Color(0.50, 0.25, 0.62), "心": Color(0.82, 0.30, 0.42), "鬼": Color(0.32, 0.12, 0.38), "歹": Color(0.30, 0.22, 0.28),
	"人": Color(0.20, 0.20, 0.20), "手": Color(0.30, 0.24, 0.20), "女": Color(0.75, 0.32, 0.45), "子": Color(0.85, 0.50, 0.35), "力": Color(0.62, 0.25, 0.15), "足": Color(0.35, 0.28, 0.22), "攴": Color(0.40, 0.30, 0.25),
	"宀": Color(0.20, 0.40, 0.45), "門": Color(0.12, 0.42, 0.45), "糸": Color(0.70, 0.20, 0.50), "衣": Color(0.45, 0.30, 0.55), "車": Color(0.35, 0.35, 0.40), "舟": Color(0.30, 0.42, 0.52), "囗": Color(0.20, 0.35, 0.40), "穴": Color(0.25, 0.22, 0.20),
}

static func col_of(ch: String) -> Color:
	var r: String = rad_of(ch)
	if RAD_COL.has(r):
		return RAD_COL[r]
	return FAM_COL.get(String(K.get(ch, {}).get("b", "人")), Color(0.2, 0.2, 0.2))

static func motion_of(ch: String) -> String:
	return String(motion_info(ch).motion)

## 部首の技と字義の転変を、作字台でも検証でも区別できるようにする。
static func motion_info(ch: String) -> Dictionary:
	if MOTION_CH.has(ch):
		return {"motion": MOTION_CH[ch], "source": "character"}
	if ch != "":
		for m in MOTION_GROUPS:
			if String(MOTION_GROUPS[m]).contains(ch):
				return {"motion": m, "source": "character"}
	var en: String = String(K.get(ch, {}).get("en", "")).to_lower()
	if en != "":
		# 完全な語を先に見る。firefly を fire、restaurant を rest と読まない。
		for m in MOTION_EN:
			for w in m[1]:
				if _meaning_word(en, String(w)):
					return {"motion": m[0], "source": "meaning"}
		var normalized: String = en
		for sep in [",", ";", ":", "/", "-", "_", "(", ")", "[", "]", ".", "\t", "\n"]:
			normalized = normalized.replace(sep, " ")
		var tokens: PackedStringArray = normalized.split(" ", false)
		if tokens.size() > 1:
			for m in MOTION_EN:
				for w in m[1]:
					for token in tokens:
						if _meaning_word(token, String(w)):
							return {"motion": m[0], "source": "meaning"}
	var rad: String = rad_of(ch)
	var family: String = String(K.get(ch, {}).get("b", "人"))
	return {"motion": RAD_MOTION.get(rad, FAMILY_MOTION.get(family, "inscribe")), "source": "radical"}

## 英語の活用形も単語単位で読む。複合語の中の部分一致はしない。
static func _meaning_word(token: String, stem: String) -> bool:
	if token == stem or token == stem + "s" or token == stem + "es" or token == stem + "ed" or token == stem + "ing":
		return true
	if stem.ends_with("e") and (token == stem + "d" or token == stem.left(-1) + "ing"):
		return true
	if stem.ends_with("y") and (token == stem.left(-1) + "ies" or token == stem.left(-1) + "ied"):
		return true
	if stem.length() >= 3:
		var doubled: String = stem + stem.right(1)
		if token == doubled + "ing" or token == doubled + "ed":
			return true
	return false

static func meaning_of(ch: String) -> String:
	var k: Dictionary = K.get(ch, {})
	var jp: String = String(k.get("jp", "")).strip_edges()
	var en: String = String(k.get("en", "")).strip_edges()
	return jp if jp != "" else en

## 強化は同じ字を重ねる従来の Lv。数値・レシピの式には手を加えない。
static func growth_of(ch: String, lv: int, count: int = 1) -> Dictionary:
	var current: String = _growth_pattern(ch, lv, count)
	var next: String = _growth_pattern(ch, lv + 1, count)
	if next == current:
		next = "技の速さが上がる"
		if motion_of(ch) == "plant":
			next = "木の道がさらに密になり、長く残る"
		if ["shelter", "annihilate"].has(motion_of(ch)):
			next = "同じ字を重ねて一撃の成長を進める"
	return {"current": current, "next": next}

## 実際の発射数と同じ Lv 段階・部品の C を表示に使う。
## 能力値 C を Lv で勝手に増やすことはしない。
static func _growth_pattern(ch: String, lv: int, count: int) -> String:
	var motion: String = motion_of(ch)
	var level: int = clampi(lv, 1, 6)
	var count0: int = clampi(count, 1, 4)
	var lanes: int = mini(5, (1 if level < 3 else (3 if level < 5 else 5)) + count0 - 1)
	match motion:
		"plant":
			var wood: int = 1
			var leaf_wood: int = 0
			for leaf in K.get(ch, {}).get("lv", []):
				if fam_of(String(leaf)) == "樹":
					leaf_wood += 1
			wood = maxi(wood, leaf_wood)
			return "歩いた道に%dつの木・輪で囲む%s" % [mini(3, wood), "・枝が増える" if level >= 3 else ""]
		"blaze": return "前へ%d筋の火・当たると小さな火がまとわりつく" % lanes
		"tide": return "%d筋の水を流す" % (3 if ["河", "江", "洲", "州", "順", "渓"].has(ch) else lanes)
		"thunder": return "%dか所へ落雷%s" % [lanes, "・雷が枝分かれ" if level >= 3 else ""]
		"snowfall": return "前に%dか所の雪原を作る" % lanes
		"rainfall": return "前に%dか所の雨雲を作る" % lanes
		"cleave": return "%d筋の斬撃で薙ぎ払う" % lanes
		"weave": return "%d枚の網を広げる%s" % [lanes, "・結び目をつなぐ" if level >= 3 else ""]
		"gust": return "前へ%d筋の風を通す" % lanes
		"boulder": return "%d個の岩を落として転がす" % lanes
		"rest": return "%.1f秒の静止で命を戻す・回復後は8秒休む" % maxf(3.0, 6.0 - level * 0.6)
		"shelter": return "%d回の庇護・次まで14秒" % (2 if level >= 3 else 1)
		"radiance":
			var rays: int = 0 if level == 1 else mini(5, count0 + (2 if level >= 3 else 0))
			return "光の輪%d重%s" % [mini(3, count0), "・前方へ%d本の光線" % rays if rays > 0 else ""]
		"pounce": return "%d筋に跳びかかる" % lanes
		"flock": return "%d羽の群れが飛ぶ" % (3 + (4 if level >= 3 else 0) + (2 if level >= 5 else 0) + (count0 - 1) * 2)
		"scatter_seed": return "%d個の種を蒔く" % mini(8, 2 + mini(4, level) + count0 - 1)
		"shoot": return "%d本の矢を放つ" % (1 + mini(2, count - 1) + (2 if level >= 3 else 0))
		"orbit": return "%dつの月光が巡る" % (1 if level < 3 else 3)
		"burst": return "%d重の響きの輪" % (1 if level < 3 else 3)
		"cage": return "%dか所を囲って捕らえる" % lanes
		"calamity": return "%dか所に水火の災いを残す" % (3 + (2 if level >= 3 else 0))
		"annihilate": return "収束する奔流・次まで10秒溜め直す"
	return "部首の力を宿す技"

## 部首（能力をくれた素）。表示用
static func rad_of(ch: String) -> String:
	var v: String = src_of(ch)[1]
	if v == "":
		v = String(K.get(ch, {}).get("rad", ch))
	return String(NORM.get(v, v))

static func fam_of(ch: String) -> String:
	for f in FAM:
		if FAM[f].ch.has(ch):
			return f
	return ""

## A（左・上）＋B（右・下）でできる字。逆の並びも許す
static func make(a: String, b: String) -> Array:
	var out: Array = []
	for r in REC.get(a + "+" + b, []):
		if not out.has(r) and can_ally(r):
			out.append(r)
	for r in REC.get(b + "+" + a, []):
		if not out.has(r) and can_ally(r):
			out.append(r)
	return out

## 字の性能（Lv は同じ字を重ねた数）
static func prof(ch: String, lv := 1) -> Dictionary:
	var k: Dictionary = K.get(ch, {"b": "人", "s": {}, "lv": [ch], "en": "", "jp": "", "op": [], "stk": 0})
	var s = {}
	for st in STATS:
		s[st] = float(k.s.get(st, 0))
	var nf = 0
	for x in k.lv:
		if fam_of(x) != "":
			nf += 1
	var T: float = max(1.0, nf + 0.4 * (k.lv.size() - nf))
	var L: float = float(lv - 1)
	# 脇の部品（本体の素を一つ除いた残り）は、その部品の技が小さく付く
	var rid = {}
	var skipped := false
	for x in k.lv:
		var f: String = fam_of(x)
		if f == "":
			continue
		if f == k.b and not skipped:
			skipped = true
			continue
		rid[f] = int(rid.get(f, 0)) + 1
	var info: Dictionary = motion_info(ch)
	var motion: String = String(info.motion)
	var meaning: String = meaning_of(ch)
	var traits: Array = []
	var inherited: Array = [{"family": k.b, "count": 1, "effect": eff_of(ch), "source": rad_of(ch)}]
	var used_primary := false
	var trait_sources: Dictionary = {}
	for x in k.lv:
		var family: String = fam_of(String(x))
		if family == "":
			continue
		if family == k.b and not used_primary:
			used_primary = true
			continue
		if not trait_sources.has(family):
			trait_sources[family] = String(x)
	for family in rid:
		var inherited_trait: Dictionary = {"family": family, "count": int(rid[family]), "effect": family, "source": String(trait_sources.get(family, family))}
		traits.append(inherited_trait)
		inherited.append(inherited_trait.duplicate())
	# 巛の最終葉は 𡿨 で、系統表にはない。実在の部品「巛」の川属性を見せる。
	# 既存の能力値やレシピは変えず、災の水火の転変にだけ使用する。
	if ch == "災" and k.get("op", []).has("巛"):
		var river_trait: Dictionary = {"family": "波", "count": 1, "effect": "波", "source": "巛"}
		traits.append(river_trait)
		inherited.append(river_trait.duplicate())
	var transform: bool = TRANSFORMS.has(ch)
	var label: String = String(MOTION_JP.get(motion, [motion, ""])[0])
	var note: String = "部首 %s の %s を継承" % [rad_of(ch), label] if String(info.source) == "radical" else "字義「%s」から %s" % [meaning, label]
	var p = {"ch": ch, "body": k.b, "kind": BODY[k.b][0], "s": s, "T": T, "lv": lv, "rid": rid, "motion": motion, "rad": rad_of(ch), "col": col_of(ch), "eff": eff_of(ch),
		"semantic_source": String(info.source), "semantic_label": label, "semantic_note": note, "meaning": meaning, "traits": traits, "inherited": inherited,
		"transform": transform, "transform_label": String(TRANSFORMS[ch][0]) if transform else "", "transform_note": String(TRANSFORMS[ch][1]) if transform else "", "transform_recipe": "+".join(k.get("op", [])) if transform else "",
		"growth_note": "", "growth_next": ""}
	p.P = 1 + int((s.pow + T * 0.5 + L) / 2.0)          # 一撃の HP ダメージ（0 で部品が一つ剥がれる）
	p.A = 1.0 + 0.22 * s.area + 0.04 * (T - 1)           # 届く広さ（倍）
	p.R = 1.0 + 0.22 * s.rate + 0.04 * (T - 1) + 0.12 * L  # 技の速さ（倍）
	p.C = min(8, 1 + int(s.count / 1.5) + (1 if T >= 4 else 0))  # 一度に出る数
	p.D = 1.0 + 0.35 * s.dur                             # 残る時間（倍）
	p.X = 1 + int(s.pierce)                              # 一度に当たる字の数
	p.KN = 60.0 + 80.0 * s.knock                         # 押し返す強さ
	var growth: Dictionary = growth_of(ch, lv, int(p.C))
	p.growth_note = String(growth.current)
	p.growth_next = String(growth.next)
	return p

## 能力値の説明（数値を、ゲームの中の意味にして返す）
static func stat_meaning(p: Dictionary, st: String) -> String:
	match st:
		"pow": return "一撃%dダメージ" % p.P
		"area": return "広さ×%.2f" % p.A
		"rate": return "速さ×%.2f" % p.R
		"count": return "%d個ずつ" % p.C
		"dur": return "残る×%.2f" % p.D
		"pierce": return "%d体まで" % p.X
		"knock": return "押し %d" % int(p.KN)
	return ""
