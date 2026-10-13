# 画像生成した水墨画（白地）を、ゲームで使える透明PNGにする
#
# 使い方:
#   python tools/ink_import.py art/incoming/fx_ink_splash.png splash          # 白地を透明に → assets/art/splash.png
#   python tools/ink_import.py art/incoming/fx_ink_splash.png splash --split 9 # 9個に切り分け → splash0.png … splash8.png
#   オプション: --max 512（長辺の上限px） --pad 12（切り抜きの余白） --keepcolor（淡彩を残す。既定は墨一色）
#
# 仕組み: 明るさから不透明度を作る（白=透明、墨=不透明）。色は白を引いて元に戻す（滲みの縁が白く浮かない）。
# --split N のときは、つながった墨のかたまりを大きい順に N 個取り出す（しぶきの小さな粒は近いかたまりに含める）。
import argparse, os
import numpy as np
from PIL import Image
from scipy import ndimage

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")


def to_alpha(img: Image.Image, keepcolor: bool) -> Image.Image:
    a = np.asarray(img.convert("RGB")).astype(np.float32) / 255.0
    lum = a.min(axis=2)  # 淡彩も拾えるよう、一番暗いチャンネルで見る
    alpha = np.clip((1.0 - lum - 0.04) / 0.96, 0, 1)  # 紙のわずかなムラは消す
    alpha = alpha ** 0.9
    if keepcolor:
        safe = np.maximum(alpha, 1e-3)[..., None]
        rgb = np.clip((a - (1 - alpha[..., None])) / safe, 0, 1)
    else:
        rgb = np.zeros_like(a) + np.array([0.08, 0.07, 0.07])  # 墨色
    out = np.dstack([rgb, alpha])
    return Image.fromarray((out * 255).astype(np.uint8), "RGBA")


def fit(im: Image.Image, mx: int) -> Image.Image:
    if max(im.size) > mx:
        s = mx / max(im.size)
        im = im.resize((max(1, int(im.width * s)), max(1, int(im.height * s))), Image.LANCZOS)
    return im


def split(im: Image.Image, n: int, pad: int):
    al = np.asarray(im)[..., 3] > 18
    # 近い粒をまとめるために少し太らせてからラベル付け
    grown = ndimage.binary_dilation(al, iterations=max(4, min(im.size) // 60))
    lab, cnt = ndimage.label(grown)
    sizes = ndimage.sum(al, lab, range(1, cnt + 1))
    order = np.argsort(-sizes)[:n]
    boxes = ndimage.find_objects(lab)
    keep = []
    for i in order:
        sl = boxes[i]
        y0, y1 = max(0, sl[0].start - pad), min(im.height, sl[0].stop + pad)
        x0, x1 = max(0, sl[1].start - pad), min(im.width, sl[1].stop + pad)
        keep.append((y0 // 50, x0, im.crop((x0, y0, x1, y1)).copy(), lab[y0:y1, x0:x1] == i + 1))
    keep.sort(key=lambda k: (k[0], k[1]))  # 左上から順に
    out = []
    for _, _, c, m in keep:
        arr = np.asarray(c).copy()
        arr[..., 3] = np.where(m, arr[..., 3], 0)  # 隣のかたまりを消す
        out.append(Image.fromarray(arr, "RGBA"))
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("src")
    ap.add_argument("name")
    ap.add_argument("--split", type=int, default=0)
    ap.add_argument("--max", type=int, default=512)
    ap.add_argument("--pad", type=int, default=12)
    ap.add_argument("--keepcolor", action="store_true")
    ap.add_argument("--out", default=os.path.join(ROOT, "assets", "art"))
    a = ap.parse_args()
    im = to_alpha(Image.open(a.src), a.keepcolor)
    os.makedirs(a.out, exist_ok=True)
    if a.split:
        parts = split(im, a.split, a.pad)
        for i, p in enumerate(parts):
            fit(p, a.max).save(os.path.join(a.out, f"{a.name}{i}.png"))
        print(f"{len(parts)} 個 → {a.out}/{a.name}0..{len(parts) - 1}.png")
    else:
        bb = im.getbbox() or (0, 0, im.width, im.height)
        im = im.crop((max(0, bb[0] - a.pad), max(0, bb[1] - a.pad), min(im.width, bb[2] + a.pad), min(im.height, bb[3] + a.pad)))
        fit(im, a.max).save(os.path.join(a.out, a.name + ".png"))
        print(f"→ {a.out}/{a.name}.png {im.size}")


if __name__ == "__main__":
    main()
