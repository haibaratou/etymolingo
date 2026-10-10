# アターマ・カプト・キャバジーノのうた — 譜面データ（音声と映像で共有）
BPM = 132
E8 = 60.0 / BPM / 2  # 8分音符の秒数

C, Am, F, G, Dm, Em = "C", "Am", "F", "G", "Dm", "Em"

# 1行 = 2小節(8分音符16個)。ev の位置は8分音符単位。
# sing: (位置, かな, 音高, 長さ)   say: (位置, 声, テキスト)
# pop: (位置, 英語, 日本語)        hl: (位置, 部位)   fx: (位置, 種類)
def L(lyric, chords, ev, section, band=True, jp=""):
    return dict(lyric=lyric, chords=chords, ev=ev, section=section, band=band, jp=jp)



# ===== 蘊蓄うた: 語源メモ(lexicon.csv / roots.csv)をそのまま歌う =====
import itertools
_SM=set("ゃゅょぁぃぅぇぉ")
def moras(kana):
    out=[]
    for ch in kana:
        if ch==" ": continue
        if (ch in _SM or ch=="ー") and out: out[-1]+=ch
        else: out.append(ch)
    return out
_SHAPES = [[0,0,1,2,1,0],[2,1,0,1,2,3],[0,2,1,3,2,1],[3,2,1,0,1,2],[0,1,2,3,4,3]]
_CH = {"C":["C4","E4","G4","C5","E5","G5"],"Am":["A3","C4","E4","A4","C5","E5"],"F":["F4","A4","C5","F5","A5","C5"],
       "G":["G4","B4","D5","G5","B4","D5"],"Em":["E4","G4","B4","E5","G4","B4"]}
_shape_i = itertools.count()
def auto(kana, chord, total=16, start=0, last=None):
    """かなに自動でメロディを付ける。1モーラ=8分音符、最後の音で残りを埋める"""
    ms = moras(kana); n = len(ms)
    assert n <= total, (kana, n, total)
    sh = _SHAPES[next(_shape_i) % len(_SHAPES)]
    tones = _CH[chord]
    ps = [tones[min(sh[(i // 2) % len(sh)] + (i % 2), len(tones) - 1)] for i in range(n)]
    ps = [("r" if m == "っ" else p) for m, p in zip(ms, ps)]
    if last: ps[-1] = last
    ls = [1] * n; ls[-1] += total - n
    return ("sing", start, kana, " ".join(ps), " ".join(map(str, ls)))

def Fact(lyric, kana, chords, sec, pop=None, say=None, hl=None, jp="", fill=16):
    ev = [auto(kana, chords[0], fill)]
    if say: ev += [("say", say[0], "en-us", say[1]), ("fx", say[0], "boing")]
    if pop: ev.append(("pop",) + pop)
    if hl: ev.append(("hl",) + hl)
    return L(lyric, chords, ev, sec, jp=jp)

CHORUS = [
    L("キャベツと キャプテン", [C, G], [
        ("sing", 0, "きゃべつと きゃぷてん", "C5 C5 C5 G4 C5 C5 D5 E5", "2 1 1 4 2 1 1 4"),
        ("pop", 0, "CABBAGE", "キャベツ", "cabbage"), ("pop", 8, "CAPTAIN", "船長", "captain")], "chorus"),
    L("むかしは おなじ!", [Am, F], [
        ("sing", 0, "むかしわ おなじ", "E5 D5 C5 A4 G4 A4 C5", "1 1 1 1 2 2 6"),
        ("pop", 4, "= *kaput-", "どっちも「頭」")], "chorus"),
    L("チーフも シェフも ぜんぶ あたま", [F, G], [
        ("sing", 0, "ちーふも しぇふも ぜんぶ あたま", "A4 A4 C5 A4 A4 C5 D5 D5 D5 E5 D5 C5", "2 1 1 2 1 1 1 1 2 1 1 2"),
        ("pop", 0, "CHIEF", "長", "chief"), ("pop", 4, "CHEF", "料理長", "chef")], "chorus"),
    L("アターマ・カプト・キャバジーノ!", [C, C], [
        ("sing", 0, "あたーま かぷと きゃばじーの", "G4 C5 C5 A4 C5 D5 E5 D5 E5 C5", "1 2 1 1 1 2 1 1 2 4"),
        ("fx", 14, "boing")], "chorus"),
]
HOOK = [dict(l, section="hook") for l in CHORUS[:2]]

FACTS1 = [
    # head
    Fact("川の源も、コインの表も", "かわの みなもとも こいんの おもても", [C, Am], "verse"),
    Fact("ビールの泡も ぜんぶ HEAD!", "びーるの あわも ぜんぶ", [F, G], "verse", fill=10,
      say=(11, "Head!"), pop=(11, "HEAD", "源・表・泡、ぜんぶ「いちばん上」", "head")),
    # cabbage
    Fact("キャベツは「小さな頭」", "きゃべつわ ちいさな あたま", [C, Am], "body",
      pop=(4, "CABBAGE", "葉が巻いてできた「小さな頭」", "cabbage"), hl=(4, "head")),
    Fact("葉っぱが巻いて 頭になった", "はっぱが まいて あたまに なった", [F, G], "body"),
    # chef / chief
    Fact("シェフと チーフは 同じことば", "しぇふと ちーふわ おなじ ことば", [Am, Em], "body",
      pop=(4, "CHEF = CHIEF", "厨房の「頭」と、群れの「頭」", "chef")),
    Fact("綴りが分かれた だけなんだって", "つづりが わかれた だけなんだって", [F, G], "body"),
]
FACTS2 = [
    # capital
    Fact("首都も 資本も 大文字も", "しゅとも しほんも おおもじも", [C, Am], "capital",
      pop=(0, "CAPITAL", "首都・資本・大文字", "capital")),
    Fact("ぜんぶ もとは「頭の」 CAPITAL!", "ぜんぶ もとわ あたまの", [F, G], "capital", fill=11,
      say=(12, "Capital!")),
    # precipitation
    Fact("雨が降るのは PRECIPITATION", "あめが ふるのわ", [Am, Em], "capital", fill=7,
      say=(8, "Precipitation!"), pop=(8, "PRECIPITATION", "降水", "precipitation")),
    Fact("もとは 頭から 真っ逆さま!", "もとわ あたまから まっさかさま", [F, G], "capital",
      pop=(0, "頭から真っ逆さま", "雨が降る意味は あとから加わった")),
    # cadet / caddie
    Fact("長男は 家の頭", "ちょうなんわ いえの あたま", [C, Am], "german",
      pop=(0, "CADET", "長男が家の頭、次男は「小さな頭」", None)),
    Fact("次男は 小さな頭 CADET!", "じなんわ ちいさな あたま", [F, G], "german", fill=11, say=(12, "Cadet!")),
    Fact("ゴルフの キャディも 同じことば", "ごるふの きゃでぃも おなじ ことば", [Am, G], "german",
      pop=(0, "CADDIE", "cadet がスコットランドでなまった", None)),
    # kerchief
    Fact("ハンカチの 中にも 頭がいる", "はんかちの なかにも あたまが いる", [F, C], "german",
      pop=(0, "HANDKERCHIEF", "kerchief = 頭(chief)を覆うもの", None)),
    # k→h
    L("北の国では K が H に", [Am, Em], [
        ("sing", 0, "きたの くにでわ けーが えっちに", "E4 G4 A4 G4 A4 C5 D5 E5 D5 C5 r G4 A4", "1 1 1 1 1 1 1 2 1 1 1 1 3"),
        ("pop", 8, "K → H", "北の家系(ゲルマン)では 音がずれる")], "german"),
    L("カプトが ヘッドに 変身だ! HEAD!", [F, G], [
        ("sing", 0, "かぷとが へっどに へんしんだ", "C5 C5 C5 A4 D5 r D5 C5 E5 E5 D5 C5 E5", "1 1 1 1 1 1 1 1 1 1 1 1 2"),
        ("say", 14, "en-us", "Head!"), ("pop", 14, "kaput → HEAD", "同じ祖先、べつの顔", "head")], "german"),
]
OUTRO = [
    L("さいごの 頭に とどいたら……", [C, G], [
        ("sing", 0, "さいごの あたまに とどいたら", "C5 C5 C5 D5 E5 E5 E5 D5 E5 F5 G5 G5 G5", "1 1 1 1 1 1 1 1 1 1 1 1 4"),
        ("fx", 8, "roll")], "outro"),
    L("ACHIEVE! やりとげた!", [C, C], [
        ("say", 0, "en-us", "Achieve!"), ("fx", 0, "fanfare"),
        ("pop", 0, "ACHIEVE!", "原義は「頭に届く」", "achieve"),
        ("sing", 6, "やりとげた", "E5 D5 C5 D5 C5", "1 1 1 1 4")], "finale"),
]
SONG = HOOK + FACTS1 + CHORUS + FACTS2 + CHORUS + OUTRO

NOTE = {"C": 0, "D": 2, "E": 4, "F": 5, "G": 7, "A": 9, "B": 11}
def midi(n):
    return 12 * (int(n[-1]) + 1) + NOTE[n[0]] + (1 if "#" in n else 0)

SMALL = set("ゃゅょぁぃぅぇぉ")
def moras(kana):
    out = []
    for ch in kana:
        if ch == " ":
            continue
        if (ch in SMALL or ch == "ー") and out:
            out[-1] += ch
        else:
            out.append(ch)
    return out

CHORD_NOTES = {"C": [48, 52, 55], "G": [43, 47, 50], "Am": [45, 48, 52], "F": [41, 45, 48],
               "Dm": [38, 41, 45], "Em": [40, 43, 47]}

def timeline():
    """全イベントを秒単位で展開"""
    t0, lines = 0.0, []
    for i, ln in enumerate(SONG):
        start = t0
        notes, says, pops, hls, fxs = [], [], [], [], []
        for ev in ln["ev"]:
            kind, pos = ev[0], ev[1]
            ts = start + pos * E8
            if kind == "sing":
                ms, ps, ls = moras(ev[2]), ev[3].split(), [int(x) for x in ev[4].split()]
                assert len(ms) == len(ps) == len(ls), (ln["lyric"], len(ms), len(ps), len(ls), ms)
                t = ts
                for m, p, l in zip(ms, ps, ls):
                    if p != "r" and m != "っ":
                        notes.append(dict(t=t, dur=l * E8, mora=m, midi=midi(p)))
                    t += l * E8
                assert t <= start + 16 * E8 + 1e-6, ln["lyric"]
            elif kind == "say":
                says.append(dict(t=ts, voice=ev[2], text=ev[3]))
            elif kind == "pop":
                pops.append(dict(t=ts, en=ev[2], jp=ev[3], img=ev[4] if len(ev) > 4 else None))
            elif kind == "hl":
                hls.append(dict(t=ts, part=ev[2]))
            elif kind == "fx":
                fxs.append(dict(t=ts, kind=ev[2]))
        lines.append(dict(i=i, t=start, end=start + 16 * E8, lyric=ln["lyric"], jp=ln.get("jp",""), chords=ln["chords"],
                          section=ln["section"], band=ln["band"], notes=notes, says=says,
                          pops=pops, hls=hls, fxs=fxs))
        t0 += 16 * E8
    return lines

if __name__ == "__main__":
    tl = timeline()
    print(len(tl), "lines", round(tl[-1]["end"], 1), "sec")
