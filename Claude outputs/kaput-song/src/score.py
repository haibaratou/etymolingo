# アターマ・カプト・キャバジーノのうた — 譜面データ（音声と映像で共有）
BPM = 132
E8 = 60.0 / BPM / 2  # 8分音符の秒数

C, Am, F, G, Dm, Em = "C", "Am", "F", "G", "Dm", "Em"

# 1行 = 2小節(8分音符16個)。ev の位置は8分音符単位。
# sing: (位置, かな, 音高, 長さ)   say: (位置, 声, テキスト)
# pop: (位置, 英語, 日本語)        hl: (位置, 部位)   fx: (位置, 種類)
def L(lyric, chords, ev, section, band=True):
    return dict(lyric=lyric, chords=chords, ev=ev, section=section, band=band)


VERSE = [
    L("カプト カプト 意味は「あたま」", [C, Am], [
        ("sing", 0, "かぷと かぷと いみわ あたま",
         "C5 A4 G4 C5 A4 G4 E4 E4 G4 C5 C5 C5", "1 1 2 1 1 2 1 1 2 1 1 2"),
        ("pop", 10, "*kaput-", "= あたま")], "verse"),
    L("あたまのことば ぜんぶ持ってる!", [F, G], [
        ("sing", 0, "あたまの ことば ぜんぶ もってる",
         "C5 B4 A4 G4 A4 G4 E4 G4 G4 G4 A4 r B4 C5", "1 1 1 1 1 1 2 1 1 1 1 1 1 2")], "verse"),
]

def body(lyr, pre, prep, prel, word, part, jp, img, post, postp, postl, chords, sec="body"):
    ev = [("sing", 0, pre, prep, prel),
          ("say", 4, "en-us", word + "!"), ("pop", 4, word.upper(), jp, img), ("fx", 4, "boing"),
          ("sing", 8, post, postp, postl)]
    if part: ev.append(("hl", 0, part))
    return L(lyr, chords, ev, sec)

# 「なんで頭?」を1行ずつ言う
WHY = [
    body("キャベツは CABBAGE! まるい あたま!", "きゃべつわ", "G4 G4 A4 C5", "1 1 1 1", "Cabbage", "head",
         "キャベツ = 頭みたいに まるい", "cabbage", "まるい あたま", "C5 D5 E5 D5 D5 C5", "1 1 1 1 1 3", [C, G]),
    body("ボスは CAPTAIN! ふねの あたま!", "ぼすわ", "G4 A4 C5", "1 1 2", "Captain", "hat",
         "船長 = 船の 頭(リーダー)", "captain", "ふねの あたま", "C5 C5 D5 E5 D5 C5", "1 1 1 1 1 3", [Am, G]),
    body("うでは BICEPS! あたま ふたつ!", "うでわ", "G4 A4 C5", "1 1 2", "Biceps", "arms",
         "力こぶ = 筋肉の 頭(はし)が 2つ", "biceps", "あたま ふたつ", "C5 C5 D5 E5 E5 C5", "1 1 1 1 1 3", [F, C]),
    body("コックは CHEF! だいどこの あたま!", "こっくわ", "G4 r A4 C5", "1 1 1 1", "Chef", None,
         "シェフ = 台所の 頭(料理長)", "chef", "だいどこの あたま", "C5 C5 D5 C5 E5 D5 D5 C5", "1 1 1 1 1 1 1 1", [F, G]),
]

CHORUS = [
    L("キャベツと キャプテン", [C, G], [
        ("sing", 0, "きゃべつと きゃぷてん", "C5 C5 C5 G4 C5 C5 D5 E5", "2 1 1 4 2 1 1 4"),
        ("pop", 0, "CABBAGE", "まるい 頭", "cabbage"), ("pop", 8, "CAPTAIN", "船の 頭", "captain")], "chorus"),
    L("むかしは おなじ!", [Am, F], [
        ("sing", 0, "むかしわ おなじ", "E5 D5 C5 A4 G4 A4 C5", "1 1 1 1 2 2 6"),
        ("pop", 4, "= *kaput-", "どっちも「頭」")], "chorus"),
    L("チーフも シェフも ぜんぶ あたま", [F, G], [
        ("sing", 0, "ちーふも しぇふも ぜんぶ あたま",
         "A4 A4 C5 A4 A4 C5 D5 D5 D5 E5 D5 C5", "2 1 1 2 1 1 1 1 2 1 1 2"),
        ("pop", 0, "CHIEF", "むれの 頭 = 長", "chief"), ("pop", 4, "CHEF", "台所の 頭", "chef")], "chorus"),
    L("アターマ・カプト・キャバジーノ!", [C, C], [
        ("sing", 0, "あたーま かぷと きゃばじーの",
         "G4 C5 C5 A4 C5 D5 E5 D5 E5 C5", "1 2 1 1 1 2 1 1 2 4"),
        ("fx", 14, "boing")], "chorus"),
]

# capital: 首都と資本、そして cattle
CAPITAL = [
    L("くにの あたまの まちは CAPITAL!", [C, Am], [
        ("sing", 0, "くにの あたまの まちわ", "E4 G4 A4 C5 C5 C5 A4 G4 A4 C5", "1 1 1 1 1 1 1 1 1 2"),
        ("say", 11, "en-us", "Capital!"), ("fx", 11, "boing"),
        ("pop", 11, "CAPITAL", "首都 = 国の 頭の まち", "capital")], "capital"),
    L("あたまの おかねも CAPITAL!", [F, G], [
        ("sing", 0, "あたまの おかねも", "C5 B4 A4 G4 A4 B4 C5 D5", "1 1 1 1 1 1 1 2"),
        ("say", 10, "en-us", "Capital!"), ("fx", 10, "boing"),
        ("pop", 10, "CAPITAL", "資本 = 利子より前の「頭」のお金", "money")], "capital"),
    L("むかしの ざいさん いちばんは うし", [Am, Em], [
        ("sing", 0, "むかしの ざいさん いちばんわ うし",
         "E4 E4 G4 E4 A4 A4 G4 E4 C5 C5 B4 A4 G4 A4 C5", "1 1 1 1 1 1 1 1 1 1 1 1 1 1 2"),
        ("pop", 8, "財産 = capitale", "むかしの 財産の 中心は 牛", "treasure")], "capital"),
    L("だから うしは CATTLE! ふたごだよ!", [F, G], [
        ("sing", 0, "だから うしわ", "C5 C5 C5 D5 D5 C5", "1 1 1 1 1 1"),
        ("say", 7, "en-us", "Cattle!"), ("fx", 7, "boing"), ("hl", 7, "body"),
        ("pop", 7, "CATTLE", "牛 = capital と ふたごの ことば", "cattle"),
        ("sing", 10, "ふたごだよ", "E5 D5 C5 D5 C5", "1 1 1 1 2")], "capital"),
]

GERMAN = [
    L("北へいったら K が H に", [Am, Em], [
        ("sing", 0, "きたえ いったら けーが えっちに",
         "E4 G4 A4 G4 r A4 C5 D5 C5 A4 r G4 A4", "1 1 2 1 1 1 1 2 1 1 1 1 2"),
        ("pop", 8, "K → H", "北の家系(ゲルマン)では 音が かわる")], "german"),
    L("HEAD! HEAD! HEAD! HEAD! ヘッドも あたま!", [Am, G], [
        ("say", 0, "en-us", "Head!"), ("say", 2, "en-us", "Head!"),
        ("say", 4, "en-us", "Head!"), ("say", 6, "en-us", "Head!"),
        ("pop", 0, "kaput → HEAD", "おなじ祖先から 英語の 頭そのもの", "head"),
        ("sing", 8, "へっども あたま", "C5 r C5 D5 E5 D5 C5", "1 1 1 1 1 1 2")], "german"),
]

OUTRO = [
    L("さいごの あたまに とどいたら……", [C, G], [
        ("sing", 0, "さいごの あたまに とどいたら",
         "C5 C5 C5 D5 E5 E5 E5 D5 E5 F5 G5 G5 G5", "1 1 1 1 1 1 1 1 1 1 1 1 4"),
        ("fx", 8, "roll")], "outro"),
    L("ACHIEVE! やりとげた!", [C, C], [
        ("say", 0, "en-us", "Achieve!"), ("fx", 0, "fanfare"),
        ("pop", 0, "ACHIEVE!", "達成 = ものごとの 頭(さき)まで とどく", "achieve"),
        ("sing", 6, "やりとげた", "E5 D5 C5 D5 C5", "1 1 1 1 4")], "finale"),
]

HOOK = [dict(l, section="hook") for l in CHORUS[:2]]  # 0秒目からサビ
SONG = HOOK + VERSE + WHY + CHORUS + CAPITAL + GERMAN + CHORUS + OUTRO

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
        lines.append(dict(i=i, t=start, end=start + 16 * E8, lyric=ln["lyric"], chords=ln["chords"],
                          section=ln["section"], band=ln["band"], notes=notes, says=says,
                          pops=pops, hls=hls, fxs=fxs))
        t0 += 16 * E8
    return lines

if __name__ == "__main__":
    tl = timeline()
    print(len(tl), "lines", round(tl[-1]["end"], 1), "sec")
