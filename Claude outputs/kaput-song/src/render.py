import json, math, subprocess, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter
from score import E8

W, H, FPS = 1080, 1920, 30
tl = json.load(open("timeline.json"))
END = tl[-1]["end"]
TOTAL = END + 2.5
BEAT = 2 * E8

FB = "/usr/share/fonts/opentype/noto/NotoSansCJK-Black.ttc"
_fc = {}
def font(sz):
    if sz not in _fc: _fc[sz] = ImageFont.truetype(FB, sz)
    return _fc[sz]

SEC_COL = {  # 背景2色
    "intro": ("#e8875a", "#f4a77f"), "verse": ("#f2a444", "#f7c06e"), "hook": ("#e8875a", "#ffc94a"),
    "body": ("#7cba62", "#9bd17f"), "chorus": ("#e8875a", "#ffc94a"),
    "german": ("#5aa7e8", "#86c1f0"), "outro": ("#e8875a", "#f4a77f"),
    "kaput": ("#6b6b6b", "#858585"),
}
def rgb(h): h = h.lstrip("#"); return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))

base = Image.open("chara.png").convert("RGBA")
CH = base.resize((1000, 1000), Image.LANCZOS)
shadow = Image.new("RGBA", CH.size, (0, 0, 0, 0))
shadow.putalpha(CH.getchannel("A").point(lambda a: int(a * 0.35)))
shadow = shadow.filter(ImageFilter.GaussianBlur(14))
PARTS = {"hat": [(245, 55, 80)], "head": [(280, 160, 115)], "arms": [(118, 280, 62), (398, 280, 62)],
         "body": [(275, 365, 105)]}

def line_at(t):
    for ln in tl:
        if ln["t"] <= t < ln["end"]: return ln
    return None

def ease_back(x):
    x = min(max(x, 0), 1); c = 1.9
    return 1 + (c + 1) * (x - 1) ** 3 + c * (x - 1) ** 2

def text_c(d, xy, s, sz, fill, stroke=10, sc="#3a2410", anchor="mm"):
    d.text(xy, s, font=font(sz), fill=fill, stroke_width=stroke, stroke_fill=sc, anchor=anchor)

def fit(s, sz, maxw):
    while sz > 30 and font(sz).getlength(s) > maxw: sz -= 4
    return sz

A = "/mnt/user-data/uploads/etymolingo/assets/"
def _sky(w, h, top=(70, 160, 240), bot=(200, 235, 255)):
    g = np.linspace(0, 1, h)[:, None, None]
    arr = (np.array(top)[None, None] * (1 - g) + np.array(bot)[None, None] * g).repeat(w, 1)
    return Image.fromarray(arr.astype(np.uint8))
def _load(name, over=None):
    im = Image.open(A + "ground/" + name).convert("RGBA")
    if over:
        o = Image.open(A + "ground/" + over).convert("RGBA").resize(im.size)
        im.alpha_composite(o)
    sky = _sky(*im.size).convert("RGBA"); sky.alpha_composite(im)
    im = sky.convert("RGB")
    sc = H * 1.08 / im.height
    return im.resize((int(im.width * sc), int(im.height * sc)), Image.LANCZOS)
def _grade(im, mul, add=(0, 0, 0)):
    a = np.asarray(im).astype(np.float32) * np.array(mul) + np.array(add)
    return Image.fromarray(np.clip(a, 0, 255).astype(np.uint8))
BG = {"sea": _load("T_BG_base_sea.png"), "ruin": _load("T_BG_base_ruin.png"),
      "field": _load("T_BG_base_ground.png"), "nyc": _load("T_BG_battle_ruin.png")}
BG["north"] = _grade(_load("T_BG_base_ground.png", "T_BG_base_ground_tree.png"), (0.78, 0.9, 1.12), (20, 25, 40))
BG["dusk"] = _grade(BG["nyc"], (1.05, 0.8, 0.75), (25, 0, 10))
g = BG["nyc"].convert("L").convert("RGB"); BG["gray"] = _grade(g, (0.85, 0.85, 0.9))
SEC_BG = {"capital": "nyc", "finale": "field", "hook": "sea", "chorus": "sea", "verse": "ruin", "body": "field", "german": "north",
          "outro": "dusk", "kaput": "gray", "intro": "sea"}

def sticker(path, size, border=14):
    im = Image.open(path).convert("RGBA").resize((size, size), Image.LANCZOS)
    pad = border + 4
    big = Image.new("RGBA", (size + 2 * pad, size + 2 * pad), (0, 0, 0, 0))
    big.paste(im, (pad, pad), im)
    al = big.getchannel("A").point(lambda v: 255 if v > 40 else 0).filter(ImageFilter.MaxFilter(2 * border + 1))
    out = Image.new("RGBA", big.size, (255, 255, 255, 0)); out.putalpha(al)
    sh = Image.new("RGBA", big.size, (40, 25, 10, 0)); sh.putalpha(al.point(lambda v: v // 3).filter(ImageFilter.GaussianBlur(6)))
    res = Image.new("RGBA", (big.width + 12, big.height + 12), (0, 0, 0, 0))
    res.alpha_composite(sh, (12, 12)); res.alpha_composite(out, (0, 0)); res.alpha_composite(big, (0, 0))
    return res
_stk = {}
def STK_get(name):
    if name and name not in _stk: _stk[name] = sticker(A + f"word/{name}.png", 330)
    return _stk.get(name)
FLOAT = [sticker(A + f"word/{w}.png", 170, 9) for w in
         ("cape", "chapter", "capital", "headphone", "precipitation", "achieve", "chef", "cap")]
SNOW = np.random.default_rng(3).random((70, 3))
CONF = np.random.default_rng(5).random((90, 3))

def background(img, t, sec):
    bg = BG[SEC_BG[sec]]
    span = bg.width - W
    x = span / 2 + span * 0.35 * math.sin(t * 0.12)
    y = (bg.height - H) / 2 + 20 * math.sin(t * 0.5)
    img.paste(bg.crop((int(x), int(y), int(x) + W, int(y) + H)), (0, 0))
    d = ImageDraw.Draw(img, "RGBA")
    if sec in ("hook", "chorus"):   # サビは光の筋
        cx, cy, R, rot = W / 2, 1000, 2400, t * 0.35
        for k in range(12):
            a0 = rot + k * 2 * math.pi / 12; a1 = a0 + math.pi / 24
            d.polygon([(cx, cy), (cx + R * math.cos(a0), cy + R * math.sin(a0)),
                       (cx + R * math.cos(a1), cy + R * math.sin(a1))], fill=(255, 245, 200, 45))
        for j, st in enumerate(FLOAT if camera(t)[0] < 1.3 else []):   # 同じ祖先の単語たちがぷかぷか
            ang = t * 0.25 + j * 2 * math.pi / len(FLOAT)
            fx = W / 2 + 470 * math.cos(ang) - st.width / 2
            fy = 1060 + 370 * math.sin(ang) - st.height / 2
            rs = st.rotate(12 * math.sin(t * 2 + j), resample=Image.BILINEAR, expand=True)
            img.paste(rs, (int(fx), int(fy)), rs)
    if sec == "german":
        for sx_, sy_, sp in SNOW:
            X = (sx_ * W + 40 * math.sin(t + sy_ * 9)) % W
            Y = (sy_ * H + t * (120 + 200 * sp)) % H
            r = 4 + 6 * sp
            d.ellipse([X - r, Y - r, X + r, Y + r], fill=(255, 255, 255, 210))
    # 足もとの影 + 上部を少し暗く(タイトルを読みやすく)
    d.ellipse([W / 2 - 300, 1440, W / 2 + 300, 1510], fill=(30, 20, 10, 70))
    for i in range(0, 300, 6):
        d.rectangle([0, i, W, i + 6], fill=(20, 10, 0, int(110 * (1 - i / 300))))

# ---- カメラ(ズームでメリハリ) ----
def P(x, y): return (130 + x * 820 / 512, 655 + y * 820 / 512)
FOC = {"full": (W / 2, 1100), "head": P(280, 165), "hat": P(245, 60), "arms": P(258, 285),
       "body": P(275, 365), "fore": P(280, 120)}
PART_ZOOM = {"hat": 2.0, "head": 1.8, "arms": 1.4, "body": 1.6}
STATES, PUNCH = [], []   # (t, scale, focus, blend秒) / (t, 強さ)
def build_camera():
    for ln in tl:
        t0, sec = ln["t"], ln["section"]
        at = lambda p: t0 + p * E8
        STATES.append((t0, 1.0, "full", 0.18))
        if sec == "hook" and ln["i"] == 0:
            STATES[-1] = (0.0, 2.0, "head", 0.0)
            STATES.append((at(8), 2.1, "hat", 0.15))
        if sec in ("hook", "chorus", "body"):
            for b in range(8): PUNCH.append((at(2 * b), 0.035))
        for p in ln["pops"]: PUNCH.append((p["t"], 0.10))
        if sec == "verse" and ln["pops"]:
            STATES.append((ln["pops"][0]["t"], 1.4, "head", 0.15))
        if ln["hls"]:
            part = ln["hls"][0]["part"]
            zt = ln["pops"][0]["t"] if ln["pops"] else at(4)
            STATES.append((zt, PART_ZOOM[part], part, 0.15))
            STATES.append((max(at(13), zt + 1.0), 1.0, "full", 0.2))
        elif sec == "body":
            STATES.append((at(4), 1.6, "head", 0.15))
            STATES.append((at(13), 1.0, "full", 0.2))
        if sec == "capital":
            for b in range(8): PUNCH.append((at(2 * b), 0.025))
        if sec == "finale":
            STATES.append((t0, 1.0, "full", 0.05)); PUNCH.append((t0, 0.3))
        if sec == "chorus" and ln["lyric"].startswith("アターマ"):
            STATES.append((at(6), 1.35, "head", 0.15))
        if sec == "german" and ln["lyric"].startswith("HEAD"):
            for j, sc in enumerate((1.25, 1.55, 1.85, 2.2)):
                STATES.append((at(2 * j), sc, "head", 0.06))
            STATES.append((at(8), 1.0, "full", 0.15))
        if sec == "german" and ln["lyric"].startswith("おでこ"):
            STATES.append((at(4), 2.0, "fore", 0.15))
            STATES.append((at(13), 1.0, "full", 0.2))
        if sec == "outro":
            STATES.append((t0, 1.5, "head", 16 * E8))   # ドラムロールでじわじわ寄る
        if sec == "kaput":
            STATES.append((t0, 1.0, "full", 0.05)); PUNCH.append((t0, 0.35))
    STATES.sort(key=lambda s: s[0])
build_camera()

def smooth(x):
    x = min(max(x, 0), 1); return x * x * (3 - 2 * x)

def camera(t):
    prev, cur = (0, 1.0, "full", 0), None
    for st in STATES:
        if st[0] <= t: prev, cur = (cur or prev), st
        else: break
    if cur is None: cur = prev
    k = smooth((t - cur[0]) / cur[3]) if cur[3] > 0 else 1
    s0, f0 = prev[1], FOC[prev[2]]
    s1, f1 = cur[1], FOC[cur[2]]
    s = s0 + (s1 - s0) * k
    fx = f0[0] + (f1[0] - f0[0]) * k; fy = f0[1] + (f1[1] - f0[1]) * k
    for tp, a in PUNCH:
        if 0 <= t - tp < 0.6: s *= 1 + a * math.exp(-(t - tp) / 0.1)
    return s, fx, fy

def apply_camera(img, t):
    s, fx, fy = camera(t)
    if abs(s - 1) < 1e-3: return img
    cw, chh = W / s, H / s
    x0 = min(max(fx - cw / 2, 0), W - cw)
    y0 = min(max(fy - 1100 / s, 0), H - chh)
    return img.resize((W, H), Image.BILINEAR, box=(x0, y0, x0 + cw, y0 + chh))

def frame(fi):
    t = fi / FPS
    ln = line_at(t)
    sec = ln["section"] if ln else "kaput"
    img = Image.new("RGB", (W, H))
    background(img, t, sec)
    d = ImageDraw.Draw(img)

    # --- キャラ ---
    kap_t = next((f["t"] for l in tl for f in l["fxs"] if f["kind"] == "crash"), 1e9)
    ph = (t % BEAT) / BEAT
    bounce = math.exp(-ph * 5)
    sx, sy = 1 + 0.05 * bounce, 1 - 0.06 * bounce
    hop = -40 * math.sin(math.pi * ph) if sec in ("chorus", "body", "hook") else -18 * math.sin(math.pi * ph)
    if sec == "finale":   # やりとげた! 大ジャンプ
        jt = t - ln["t"]
        hop = -260 * abs(math.sin(math.pi * jt / (4 * E8))) * math.exp(-jt * 0.25)
    size = 820
    zoom_part, zx, zy = None, 0, 0
    if ln and ln["hls"] and t >= ln["hls"][0]["t"]:
        zoom_part = ln["hls"][0]["part"]
    rot = 0
    if t >= kap_t:  # KAPUT! 倒れる
        k = min((t - kap_t) / 0.6, 1)
        rot = -95 * ease_back(k) if k < 1 else -95
        hop = 260 * k
        sx = sy = 1
    w_, h_ = int(size * sx), int(size * sy)
    ch = CH.resize((w_, h_), Image.BILINEAR)
    sh = shadow.resize((w_, h_), Image.BILINEAR)
    if rot:
        ch = ch.rotate(rot, resample=Image.BILINEAR, expand=True)
        sh = sh.rotate(rot, resample=Image.BILINEAR, expand=True)
    shake = (0, 0)
    if 0 <= t - kap_t < 0.8:
        a = 30 * (1 - (t - kap_t) / 0.8)
        shake = (int(a * math.sin(t * 90)), int(a * math.cos(t * 77)))
    px = W // 2 - ch.width // 2 + shake[0]
    py = 1475 - ch.height + int(hop) + shake[1] + (h_ - size) // 2 * 0
    img.paste(sh, (px + 18, py + 26), sh)
    img.paste(ch, (px, py), ch)
    d = ImageDraw.Draw(img)

    # 部位ハイライト
    if zoom_part:
        k = (t - ln["hls"][0]["t"]) / 0.3
        pul = 1 + 0.06 * math.sin(t * 12)
        for (x, y, r) in PARTS[zoom_part]:
            X = px + x / 512 * w_
            Y = py + y / 512 * h_
            R = r / 512 * size * ease_back(k) * pul
            for wdt, col in ((26, "#3a2410"), (14, "#fff36b")):
                d.ellipse([X - R, Y - R, X + R, Y + R], outline=col, width=wdt)

    img = apply_camera(img, t)
    d = ImageDraw.Draw(img)

    if ln and ln["section"] == "finale" or t >= END:
        t_f = t - (ln["t"] if ln and ln["section"] == "finale" else END - 16 * E8)
        dd = ImageDraw.Draw(img)
        for (cx_, cy_, sp) in CONF:
            X = (cx_ * W + 60 * math.sin(t * 3 + cy_ * 20)) % W
            Y = -50 + (t_f * (300 + 400 * sp) + cy_ * 600) % (H + 100)
            colr = ["#ff5a5a", "#ffd23f", "#3bc6ff", "#7ee081", "#ff8bd1"][int(sp * 50) % 5]
            a_ = t * 6 + cx_ * 10
            dd.polygon([(X + 14 * math.cos(a_), Y + 8 * math.sin(a_)), (X - 14 * math.cos(a_), Y - 8 * math.sin(a_)),
                        (X - 14 * math.cos(a_) + 6, Y - 8 * math.sin(a_) + 10), (X + 14 * math.cos(a_) + 6, Y + 8 * math.sin(a_) + 10)], fill=colr)

    # --- タイトル ---
    title_sz = 72
    text_c(d, (W // 2, 120), "アターマ・カプト・キャバジーノ", fit("アターマ・カプト・キャバジーノ", title_sz, W - 60), "#ffffff")
    d.rounded_rectangle([W // 2 - 250, 185, W // 2 + 250, 255], 34, fill="#3a2410")
    d.text((W // 2, 220), "*kaput- = あたま", font=font(44), fill="#fff36b", anchor="mm")

    # --- ポップ(英単語) ---
    if ln:
        pops = [p for p in ln["pops"] if t >= p["t"]]
        n = len(pops)
        for j, p in enumerate(pops):
            if not p.get("img"): continue
            k = ease_back((t - p["t"]) / 0.3)
            st = STK_get(p["img"])
            sz_ = max(int(st.width * k * (1 if n == 1 else 0.85)), 2)
            stt = st.resize((sz_, sz_), Image.BILINEAR).rotate((-8 if j == 0 else 8) + 5 * math.sin(t * 6),
                                                               resample=Image.BILINEAR, expand=True)
            cxs = (850 if n == 1 else (200 if j == 0 else 880))
            cys = 1160 if n == 1 else 1020
            img.paste(stt, (int(cxs - stt.width / 2), int(cys - stt.height / 2)), stt)
        for j, p in enumerate(pops):
            k = ease_back((t - p["t"]) / 0.28)
            y0 = 390
            cxp = W // 2 if n == 1 else (W // 4 if j == 0 else 3 * W // 4)
            big = 150 if n == 1 else 110
            sz = fit(p["en"], big, (W - 180) if n == 1 else (W // 2 - 60))
            sz = max(int(sz * k), 1)
            wob = 4 * math.sin(t * 9 + j)
            lay = Image.new("RGBA", (W, 300), (0, 0, 0, 0))
            ld = ImageDraw.Draw(lay)
            col = "#ff3b3b" if p["en"].startswith("KAPUT") else "#fff36b"
            ld.text((cxp, 110), p["en"], font=font(sz), fill=col, stroke_width=max(4, sz // 10),
                    stroke_fill="#3a2410", anchor="mm")
            jsz = max(int(52 * k), 1)
            ld.rounded_rectangle([cxp - font(52).getlength(p["jp"]) / 2 - 26, 200,
                                  cxp + font(52).getlength(p["jp"]) / 2 + 26, 276], 38,
                                 fill=(255, 255, 255, int(235 * min(k, 1))))
            ld.text((cxp, 238), p["jp"], font=font(jsz), fill="#3a2410", anchor="mm")
            lay = lay.rotate(wob, resample=Image.BILINEAR)
            img.paste(lay, (0, y0 - 110), lay)
        d = ImageDraw.Draw(img)

    # --- 歌詞(カラオケ) ---
    if ln:
        evs = [(n_["t"], n_["dur"]) for n_ in ln["notes"]] + [(s["t"], 2 * E8) for s in ln["says"]]
        prog = sum(min(max((t - a) / b, 0), 1) for a, b in evs) / max(len(evs), 1)
        s = ln["lyric"]
        sz = fit(s, 76, W - 120)
        tw = font(sz).getlength(s)
        d.rounded_rectangle([40, 1560, W - 40, 1760], 50, fill="#fffaf0", outline="#3a2410", width=8)
        x0 = (W - tw) / 2
        d.text((x0, 1660), s, font=font(sz), fill="#b9a99a", anchor="lm")
        lay = Image.new("RGBA", (W, 200), (0, 0, 0, 0))
        ImageDraw.Draw(lay).text((x0, 100), s, font=font(sz), fill="#e8562a", anchor="lm")
        cut = int(x0 + tw * prog)
        mask = Image.new("L", (W, 200), 0)
        ImageDraw.Draw(mask).rectangle([0, 0, cut, 200], fill=255)
        img.paste(lay, (0, 1560), Image.composite(lay.getchannel("A"), mask, mask).point(lambda v: v))
        d = ImageDraw.Draw(img)

    # --- エンドカード ---
    if t >= END:
        k = min((t - END) / 0.4, 1)
        ov = Image.new("RGBA", (W, H), (255, 250, 240, int(240 * k)))
        img.paste(ov, (0, 0), ov)
        d = ImageDraw.Draw(img)
        if k > 0.5:
            text_c(d, (W // 2, 330), "*kaput- = あたま", 96, "#e8562a")
            d.text((W // 2, 450), "なんで「頭」なの?", font=font(52), fill="#3a2410", anchor="mm")
            rows = [("cabbage", "キャベツ", "まるくて 頭みたい"), ("captain", "船長", "船の 頭"),
                    ("chief", "長", "むれの 頭"), ("chef", "料理長", "台所の 頭"),
                    ("biceps", "二頭筋", "筋肉の 頭(はし)が 2つ"), ("capital", "首都", "国の 頭の まち"),
                    ("capital", "資本", "利子より前の 頭の お金"), ("cattle", "牛", "むかしの 財産 capitale"),
                    ("head", "あたま", "K→H で 頭そのもの"), ("achieve", "達成", "頭(さき)まで とどく")]
            for j, (en, ja, why) in enumerate(rows):
                y = 560 + j * 92
                if j % 2 == 0: d.rounded_rectangle([50, y - 42, W - 50, y + 42], 20, fill="#fbe8d4")
                d.text((80, y), en, font=font(50), fill="#e8562a", anchor="lm")
                d.text((350, y), ja, font=font(42), fill="#3a2410", anchor="lm")
                d.text((W - 80, y), why, font=font(38), fill="#6b4a2e", anchor="rm")
            d.text((W // 2, 1560), "ぜんぶ おなじ祖先のことば!", font=font(60), fill="#e8562a", anchor="mm")
    return img

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "test":
        for s in map(float, sys.argv[2:]):
            frame(int(s * FPS)).save(f"test_{s:05.1f}.png")
        sys.exit()
    n = int(TOTAL * FPS)
    p = subprocess.Popen(["ffmpeg", "-y", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "rgb24",
                          "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-", "-i", "song.wav",
                          "-c:v", "libx264", "-preset", "medium", "-crf", "24", "-maxrate", "2600k", "-bufsize", "5200k", "-pix_fmt", "yuv420p",
                          "-c:a", "aac", "-b:a", "192k", "-shortest", "-movflags", "+faststart",
                          "kaput_song_v3.mp4"], stdin=subprocess.PIPE)
    for fi in range(n):
        p.stdin.write(frame(fi).tobytes())
        if fi % 300 == 0: print(fi, "/", n, flush=True)
    p.stdin.close(); p.wait()
    print("done")
