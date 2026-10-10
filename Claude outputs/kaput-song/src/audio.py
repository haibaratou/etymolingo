import subprocess, os, json, hashlib
import numpy as np, soundfile as sf, pyworld as pw
from scipy.signal import resample_poly, butter, sosfilt
from score import timeline, E8, CHORD_NOTES

SR = 44100
CACHE = "cache"; os.makedirs(CACHE, exist_ok=True)
rng = np.random.default_rng(7)

def espeak(text, voice, speed=150, pitch=50):
    key = hashlib.md5(f"{text}|{voice}|{speed}|{pitch}".encode()).hexdigest()
    path = f"{CACHE}/{key}.wav"
    if not os.path.exists(path):
        subprocess.run(["espeak-ng", "-v", voice, "-s", str(speed), "-p", str(pitch), "-w", path, text],
                       check=True, stderr=subprocess.DEVNULL)
    x, fs = sf.read(path)
    # 無音トリム
    idx = np.where(np.abs(x) > 0.01)[0]
    if len(idx):
        x = x[max(0, idx[0] - 50): idx[-1] + 200]
    return x.astype(np.float64), fs

def hz(m): return 440.0 * 2 ** ((m - 69) / 12)

_world = {}
def analyze(mora):
    if mora not in _world:
        x, fs = espeak(mora, "ja+f4", 170, 60)
        f0, t = pw.dio(x, fs, frame_period=5.0)
        f0 = pw.stonemask(x, f0, t, fs)
        sp = pw.cheaptrick(x, f0, t, fs)
        ap = pw.d4c(x, f0, t, fs)
        _world[mora] = (f0, sp, ap, fs)
    return _world[mora]

def sing(mora, midi_note, dur, prev_midi=None):
    """1モーラを指定音高・長さで歌わせる。戻り値: (音声, 子音の長さ秒)"""
    f0, sp, ap, fs = analyze(mora)
    voiced = np.where(f0 > 0)[0]
    n = len(f0)
    if len(voiced) == 0:
        v0, v1 = n // 3, n - 1
    else:
        v0, v1 = voiced[0], voiced[-1]
    cons = list(range(0, v0))
    vow = np.arange(v0, v1 + 1)
    tail = list(range(v1 + 1, min(n, v1 + 4)))
    target = max(int(dur * 0.92 / 0.005), len(cons) + 6)
    nv = max(target - len(cons) - len(tail), 4)
    vidx = np.clip(np.round(np.linspace(v0, v1, nv)).astype(int), 0, n - 1)
    # 長い音は母音の真ん中付近をループさせる(子音がのびないように)
    if nv > 2 * len(vow) and len(vow) > 6:
        core = np.arange(v0 + len(vow) // 4, v0 + 3 * len(vow) // 4 + 1)
        head = np.arange(v0, core[0])
        reps = (nv - len(head)) // len(core) + 2
        loop = np.concatenate([core, core[::-1]] * reps)[: nv - len(head)]
        vidx = np.concatenate([head, loop])
    idx = np.concatenate([np.array(cons, int), vidx, np.array(tail, int)]).astype(int)
    nf0, nsp, nap = f0[idx].copy(), sp[idx].copy(), ap[idx].copy()
    # 音高を付け替え(ポルタメント+ビブラート)
    tgt = hz(midi_note)
    k = np.arange(len(idx))
    vstart = len(cons)
    curve = np.full(len(idx), tgt)
    if prev_midi is not None:
        glide = min(8, nv)
        curve[vstart:vstart + glide] = hz(prev_midi) * (tgt / hz(prev_midi)) ** np.linspace(0, 1, glide)
    vib_on = np.clip((k - vstart - 30) / 20, 0, 1)
    curve *= 2 ** (vib_on * 0.35 * np.sin(2 * np.pi * 5.5 * k * 0.005) / 12)
    voiced_mask = nf0 > 0
    voiced_mask[vstart:vstart + nv] = True  # 母音部は必ず有声に
    nf0 = np.where(voiced_mask, curve, 0.0)
    nap[vstart:vstart + nv] = np.minimum(nap[vstart:vstart + nv], 0.3)
    y = pw.synthesize(np.ascontiguousarray(nf0), np.ascontiguousarray(nsp), np.ascontiguousarray(nap), fs, 5.0)
    # フェード
    fo = min(len(y), int(fs * 0.03))
    y[-fo:] *= np.linspace(1, 0, fo)
    y = resample_poly(y, SR, fs)
    r = np.sqrt(np.mean(y ** 2)) + 1e-9
    y *= min(0.14 / r, 4.0)
    return y, len(cons) * 0.005

def say(text, voice):
    if voice == "it":
        x, fs = espeak(text, "it", 135, 70)
    else:
        x, fs = espeak(text, "en-us+m3", 140, 75)
    return resample_poly(x, SR, fs)

# ---- 楽器 ----
def env(n, a=0.005, r=0.05, sr=SR):
    e = np.ones(n)
    na, nr = int(a * sr), int(r * sr)
    e[:na] = np.linspace(0, 1, max(na, 1))[:na]
    if nr: e[-nr:] *= np.linspace(1, 0, nr)
    return e

def kick():
    n = int(0.28 * SR); t = np.arange(n) / SR
    f = 50 + 110 * np.exp(-t * 30)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 9) * 0.9

def clap():
    n = int(0.18 * SR); t = np.arange(n) / SR
    sos = butter(2, [900, 4000], "bandpass", fs=SR, output="sos")
    x = sosfilt(sos, rng.standard_normal(n)) * np.exp(-t * 22)
    return x * 0.5

def hat():
    n = int(0.05 * SR); t = np.arange(n) / SR
    sos = butter(2, 7000, "highpass", fs=SR, output="sos")
    return sosfilt(sos, rng.standard_normal(n)) * np.exp(-t * 80) * 0.18

def square(f, dur, duty=0.5, vib=0.0):
    n = int(dur * SR); t = np.arange(n) / SR
    ph = np.cumsum(f * 2 ** (vib * np.sin(2 * np.pi * 5.5 * t) / 12)) / SR
    return np.where((ph % 1) < duty, 1.0, -1.0)

def accordion(fs_, dur):
    n = int(dur * SR); t = np.arange(n) / SR
    y = np.zeros(n)
    for f in fs_:
        for det in (-0.004, 0.004):
            ph = (t * f * (1 + det)) % 1
            y += (2 * ph - 1) * 0.5 + 0.3 * np.where(ph < 0.3, 1, -1)
    sos = butter(2, 2500, "lowpass", fs=SR, output="sos")
    y = sosfilt(sos, y) * (1 + 0.15 * np.sin(2 * np.pi * 7 * t))
    return y * env(n, 0.01, 0.06) / len(fs_)

def bass(f, dur):
    n = int(dur * SR); t = np.arange(n) / SR
    y = square(f, dur, 0.5)
    sos = butter(2, 600, "lowpass", fs=SR, output="sos")
    return sosfilt(sos, y) * np.exp(-t * 3) * env(n, 0.003, 0.03)

def bell(f, dur):
    n = int(dur * SR); t = np.arange(n) / SR
    return (np.sin(2 * np.pi * f * t) + 0.3 * np.sin(2 * np.pi * f * 3.01 * t)) * np.exp(-t * 7)

def boing():
    n = int(0.35 * SR); t = np.arange(n) / SR
    f = 300 + 500 * np.sin(np.pi * t / 0.35) ** 2 * np.exp(-t * 4) + 80 * np.sin(2 * np.pi * 18 * t)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 6) * 0.35

def fanfare():
    # ジャジャーン! (アコーディオン+ベル+シンバル)
    out = np.zeros(int(2.4 * SR))
    for i, m in enumerate([60, 64, 67, 72]):
        x = accordion([hz(m + 12), hz(m)], 0.14)
        s = int(i * 0.09 * SR); out[s:s + len(x)] += x
    x = accordion([hz(72), hz(76), hz(79), hz(84)], 1.8)
    x *= np.exp(-np.arange(len(x)) / SR * 0.8)
    s = int(0.36 * SR); out[s:s + len(x)] += x * 1.3
    for m in (84, 88, 91, 96):
        b = bell(hz(m), 1.5); out[s:s + len(b)] += b * 0.15
    n = int(1.6 * SR); t = np.arange(n) / SR
    sos = butter(2, 5000, "highpass", fs=SR, output="sos")
    out[s:s + n] += sosfilt(sos, rng.standard_normal(n)) * np.exp(-t * 2.5) * 0.25
    return out

def crash():
    n = int(2.2 * SR); t = np.arange(n) / SR
    noise = rng.standard_normal(n) * np.exp(-t * 2.2)
    sos = butter(2, 3000, "lowpass", fs=SR, output="sos")
    boom = np.sin(2 * np.pi * np.cumsum(80 * np.exp(-t * 1.5) + 30) / SR) * np.exp(-t * 2)
    fall = np.sin(2 * np.pi * np.cumsum(900 * np.exp(-t * 1.2) + 60) / SR) * np.exp(-t * 1.0) * 0.4
    return sosfilt(sos, noise) * 0.5 + boom * 0.9 + fall

def roll(dur):
    out = np.zeros(int(dur * SR))
    k = 0
    steps = 16
    for i in range(steps):
        pos = int(i * dur / steps * SR)
        c = clap() * (0.4 + 0.6 * i / steps)
        out[pos:pos + len(c)] += c[: len(out) - pos]
    return out

def add(buf, x, t, gain=1.0):
    s = int(t * SR)
    if s < 0: x = x[-s:]; s = 0
    e = min(len(buf), s + len(x))
    if e > s: buf[s:e] += x[: e - s] * gain

def render():
    tl = timeline()
    total = tl[-1]["end"] + 2.5
    N = int(total * SR)
    drums, music, vox, fx = (np.zeros(N) for _ in range(4))
    K, CL, H = kick(), clap(), hat()
    beat = 2 * E8
    for ln in tl:
        if not ln["band"]:
            continue
        intro = ln["section"] == "intro"
        for bar, ch in enumerate(ln["chords"]):
            bt = ln["t"] + bar * 4 * beat
            notes = CHORD_NOTES[ch]
            for b in range(4):
                t = bt + b * beat
                add(drums, K, t, 0.9 if not intro or ln["i"] == 1 else 0.0)
                if b in (1, 3): add(drums, CL, t, 0.8)
                add(drums, H, t + E8, 1.0)
                # ウンパッ(イタリアの屋台風)
                if b in (0, 2):
                    root = notes[0] - 12 if b == 0 else notes[0] - 12 + 7
                    add(music, bass(hz(root), beat * 0.9), t, 0.45)
                else:
                    add(music, accordion([hz(m + 12) for m in notes], beat * 0.45), t, 0.32)
                    add(music, accordion([hz(m + 12) for m in notes], E8 * 0.6), t + E8, 0.18)
            if ln["section"] in ("chorus", "hook", "finale"):
                arp = [notes[0] + 24, notes[1] + 24, notes[2] + 24, notes[0] + 36]
                for s in range(16):
                    add(music, bell(hz(arp[s % 4]), 0.25), bt + s * beat / 4, 0.06)
    # ボーカル+メロディ重ね
    for ln in tl:
        prev = None
        for nt in ln["notes"]:
            y, cons = sing(nt["mora"], nt["midi"], nt["dur"], prev)
            add(vox, y, nt["t"] - cons, 0.9)
            prev = nt["midi"]
            if ln["band"]:
                lead = square(hz(nt["midi"]), nt["dur"] * 0.85, 0.25, vib=0.2)
                sos = butter(2, 3000, "lowpass", fs=SR, output="sos")
                add(music, sosfilt(sos, lead) * env(len(lead), 0.01, 0.04), nt["t"], 0.05)
        for s in ln["says"]:
            y = say(s["text"], s["voice"])
            g = 1.3 if "Kaput" in s["text"] else 1.0
            add(vox, y / (np.abs(y).max() + 1e-9) * 0.85 * g, s["t"], 1.0)
        for f in ln["fxs"]:
            if f["kind"] == "boing": add(fx, boing(), f["t"])
            elif f["kind"] == "crash": add(fx, crash(), f["t"] + 0.05, 0.9)
            elif f["kind"] == "fanfare": add(fx, fanfare(), f["t"], 1.0)
            elif f["kind"] == "roll": add(fx, roll(8 * E8), f["t"], 0.7)
    vox = vox / (np.abs(vox).max() + 1e-9) * 0.75
    mix = drums * 0.55 + music * 0.6 + vox * 1.0 + fx * 0.8
    # 簡易コンプ&リミッタ
    mix = np.tanh(mix * 1.4) / np.tanh(1.4)
    mix = mix / np.abs(mix).max() * 0.95
    st = np.stack([mix, mix], 1)
    sf.write("song.wav", st, SR)
    sf.write("vox.wav", vox, SR)
    json.dump(tl, open("timeline.json", "w"), ensure_ascii=False, indent=1)
    print("ok", round(total, 1), "s")

if __name__ == "__main__":
    render()
