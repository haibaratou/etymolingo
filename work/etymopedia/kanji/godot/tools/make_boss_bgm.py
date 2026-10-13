# 決戦（漢詩の怪物・ボス）の BGM: 恐ろしい低音の持続・不協和の金属音・心臓のような太鼓
# 使い方: python tools/make_boss_bgm.py  → assets/sfx/bgm_boss.wav（48秒のループ）
import numpy as np, wave, os
from scipy.signal import lfilter
R = 44100
OUT = os.path.join(os.path.dirname(__file__), '..', 'assets', 'sfx', 'bgm_boss.wav')
rng = np.random.default_rng(13)
SEC = 48.0
n = int(SEC * R)
t = np.arange(n) / R
def lp(x, a): return lfilter([a], [1, -(1 - a)], x)
def env(m, a=.005, d=.3):
    tt = np.arange(m) / R; return np.minimum(1, tt / a) * np.exp(-tt / d)
def add(x, o, k):
    m = min(len(k), len(x) - o)
    if m > 0: x[o:o + m] += k[:m]
x = np.zeros(n)
# 1) 地を這う持続音: 短二度と三全音の不協和（D・E♭・A♭）。ゆっくり唸る
for f, a in [(36.7, .30), (38.9, .22), (51.9, .18), (73.4, .10), (77.8, .08)]:
    wob = 1 + .004 * np.sin(2 * np.pi * rng.uniform(.05, .13) * t + rng.uniform(0, 6))
    x += np.sin(2 * np.pi * f * np.cumsum(wob) / R) * a
x += lp(rng.uniform(-1, 1, n), .003) * .5          # 地鳴りのざわめき
# 全体がゆっくり膨らんでは沈む
x *= .75 + .25 * np.sin(2 * np.pi * t / 12.0 - 1.2)
# 2) 心臓のような太鼓（どくん・どくん）。少しずつ速くなり、ループの頭で戻る
beat = 0.0
while beat < SEC - 1:
    per = 1.25 - .35 * (beat / SEC)
    for off, amp in [(0, 1.0), (.22, .65)]:
        m = int(.9 * R)
        tt = np.arange(m) / R
        k = np.sin(2 * np.pi * (52 * np.exp(-tt * 2.2)) * tt) * env(m, .002, .28) * .9 * amp
        k += lp(rng.uniform(-1, 1, m), .25) * env(m, .001, .03) * .3 * amp
        add(x, int((beat + off) * R), k)
    beat += per
# 3) 金属を擦る悲鳴（弓で擦った銅鑼のような、不協和の高音のうねり）
for i in range(9):
    st = rng.uniform(1, SEC - 7); d = rng.uniform(3.5, 6.5); m = int(d * R)
    tt = np.arange(m) / R
    f0 = rng.choice([622, 698, 932, 1244, 1397])
    gl = f0 * (1 + .03 * np.sin(2 * np.pi * .4 * tt) - .04 * tt / d)
    ph = 2 * np.pi * np.cumsum(gl) / R
    k = (np.sin(ph) + .5 * np.sin(ph * 1.414) + .3 * np.sin(ph * 2.76)) * np.sin(np.pi * tt / d) ** 2
    k *= .045 * (1 + .5 * lp(rng.uniform(-1, 1, m), .01) * 8)
    add(x, int(st * R), k)
# 4) 低い琴を叩きつけるような不協和音（ときどき）
def ks(f, dur, damp=.996):
    m = int(dur * R); N = max(2, int(R / f)); buf = rng.uniform(-1, 1, N); out = np.zeros(m + N)
    for i in range(0, m, N):
        out[i:i + N] = buf; buf = damp * .5 * (buf + np.roll(buf, -1))
    return out[:m]
for st in [4.0, 13.5, 22.0, 31.0, 39.5]:
    for s in [0, 1, 6]:
        f = 73.4 * 2 ** (s / 12)
        add(x, int((st + s * .012) * R), ks(f, 3.0, .9985) * env(int(3.0 * R), .002, 1.4) * .35)
# 5) 遠い銅鑼と、吸い込むような逆再生の唸り（区切りごとに）
for st in [0.0, 12.0, 24.0, 36.0]:
    m = int(4.0 * R); tt = np.arange(m) / R
    g = sum(np.sin(2 * np.pi * f * tt + rng.uniform(0, 6)) * a for f, a in [(65, 1), (98, .6), (139, .5), (185, .35), (277, .2)])
    k = g * env(m, .01, 1.6) * .25
    add(x, int(st * R), k)
    sw = lp(rng.uniform(-1, 1, int(2.0 * R)), .02) * np.linspace(0, 1, int(2.0 * R)) ** 3 * .5
    o = int((st + 12.0 - 2.0) * R)
    if o + len(sw) <= n: add(x, o, sw)
# 継ぎ目をなめらかに
fd = int(1.0 * R)
x[:fd] *= np.linspace(0, 1, fd); x[-fd:] *= np.linspace(1, 0, fd)
x = x / np.max(np.abs(x)) * .85
with wave.open(OUT, 'wb') as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(R)
    w.writeframes((np.clip(x, -1, 1) * 32767 * .9).astype(np.int16).tobytes())
print('wrote', OUT)
