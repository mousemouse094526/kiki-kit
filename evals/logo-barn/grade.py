"""Grade iteration runs against eval_metadata.json assertions. Writes grading.json per run."""
import json, os, re, sys, colorsys
from pathlib import Path
from PIL import Image

ITER = Path(sys.argv[1] if len(sys.argv) > 1 else "iteration-1")

def svgs(root):
    return [p for p in root.rglob("*.svg") if "venv" not in p.parts]

def pngs(root):
    return [p for p in root.rglob("*.png") if "venv" not in p.parts]

def mds(root):
    return [p for p in root.rglob("*.md") if "venv" not in p.parts and p.name.lower() != "readme.md"]

def pys(root):
    return [p for p in root.rglob("*.py") if "venv" not in p.parts]

def fills(root):
    out = []
    for p in svgs(root):
        out += re.findall(r'(?:fill|stop-color)[="\':\s]+#([0-9a-fA-F]{6})', p.read_text(errors="ignore"))
    return out

def hue_sat_lum(hx):
    r, g, b = (int(hx[i:i+2], 16)/255 for i in (0, 2, 4))
    h, l, s = colorsys.rgb_to_hls(r, g, b)
    return h*360, s, l

def has_text_elem(root):
    bad = []
    for p in svgs(root):
        if re.search(r'<text[\s>]', p.read_text(errors="ignore")):
            bad.append(p.name)
    return bad

def square_icon(root):
    hits = []
    for p in svgs(root):
        m = re.search(r'viewBox="0 0 (\d+(?:\.\d+)?) (\d+(?:\.\d+)?)"', p.read_text(errors="ignore"))
        if m and m.group(1) == m.group(2) and ("icon" in p.name.lower() or "mark" in p.name.lower() or "profile" in p.name.lower()):
            hits.append(p.name)
    return hits

def dark_light_pair(root):
    names = [p.name.lower() for p in svgs(root)]
    dark = [n for n in names if "dark" in n]
    light = [n for n in names if "dark" not in n]
    return dark, light

def dark_variant_light_mark(root):
    for p in svgs(root):
        if "dark" in p.name.lower():
            fs = re.findall(r'fill[="\':\s]+#([0-9a-fA-F]{6})', p.read_text(errors="ignore"))
            for f in fs:
                _, _, l = hue_sat_lum(f)
                if l > 0.6:
                    return p.name, f
    return None

def biggest_square_png(root):
    # profile-facing assets first — that's what the circular-crop claim is about
    def rank(p):
        n = p.name.lower()
        return (("profile" in n or "avatar" in n or "mark" in n) * 2 + ("logo" in n), Image.open(p).width)
    best = None
    for p in pngs(root):
        try:
            im = Image.open(p)
        except Exception:
            continue
        if im.width == im.height and (best is None or rank(p) > rank(best[0])):
            best = (p, im.width)
    return best

def circle_safe(png_path):
    im = Image.open(png_path).convert("RGBA").resize((512, 512))
    px = im.load()
    corners = [px[2, 2], px[509, 2], px[2, 509], px[509, 509]]
    def close(a, b, tol=30):
        return all(abs(x-y) <= tol for x, y in zip(a[:3], b[:3])) and abs(a[3]-b[3]) <= tol
    bg = corners[0]
    if not all(close(c, bg) for c in corners):
        return False, "corners not uniform (content reaches corners)"
    r2 = 256*256
    outside_content = 0
    for y in range(0, 512, 2):
        for x in range(0, 512, 2):
            if (x-256)**2 + (y-256)**2 > r2 and not close(px[x, y], bg, 40):
                outside_content += 1
    frac = outside_content / (512*512/4)
    return frac < 0.005, f"content-outside-circle fraction={frac:.4f}"

def grade_run(run_dir, meta):
    root = run_dir / "outputs"
    exp = []
    for a in meta["assertions"]:
        t = a["text"]; passed = False; ev = ""
        sv = svgs(root)
        if "at least 3 SVG" in t:
            passed = len(sv) >= 3; ev = f"{len(sv)} svg files"
        elif "<text>" in t:
            bad = has_text_elem(root)
            passed = len(sv) > 0 and not bad
            ev = ("no <text> in " + str(len(sv)) + " svgs") if passed else ("<text> found in: " + ", ".join(bad[:5]) if bad else "no svg files")
        elif "light-background and a dark-background" in t:
            d, l = dark_light_pair(root)
            passed = bool(d) and bool(l); ev = f"dark: {d[:3]}, light: {l[:3]}"
        elif "app-icon asset exists" in t:
            hits = square_icon(root); passed = bool(hits); ev = str(hits[:4])
        elif "concept document" in t:
            m = mds(root); passed = any(p.stat().st_size > 500 for p in m); ev = str([p.name for p in m][:3])
        elif "generator script" in t:
            g = pys(root); passed = bool(g); ev = str([p.name for p in g][:5])
        elif "teal family" in t:
            hues = [hue_sat_lum(f) for f in fills(root)]
            teal = [h for h, s, l in hues if 160 <= h <= 210 and s > 0.2]
            passed = len(teal) >= 2; ev = f"{len(teal)} saturated teal fills of {len(hues)}"
        elif "dark-mode variant exists and its mark is light" in t:
            r = dark_variant_light_mark(root)
            passed = r is not None; ev = f"{r[0]} has light fill #{r[1]}" if r else "no dark file with light fill"
        elif "PNG export exists" in t:
            p = pngs(root); passed = bool(p); ev = f"{len(p)} png files"
        elif "square 1:1 at 512px" in t:
            b = biggest_square_png(root)
            passed = b is not None and b[1] >= 512; ev = f"{b[0].name} {b[1]}px" if b else "no square png"
        elif "palette is warm" in t:
            hues = [hue_sat_lum(f) for f in fills(root)]
            sat = [(h, s, l) for h, s, l in hues if s > 0.15 and 0.1 < l < 0.9]
            warm = [h for h, s, l in sat if h <= 65 or h >= 340]
            passed = bool(sat) and len(warm) / len(sat) >= 0.6
            ev = f"{len(warm)}/{len(sat)} saturated fills are warm-hued"
        elif "inscribed circle" in t:
            b = biggest_square_png(root)
            if b:
                passed, ev = circle_safe(b[0]); ev = f"{b[0].name}: {ev}"
            else:
                passed, ev = False, "no square png to test"
        exp.append({"text": t, "passed": bool(passed), "evidence": ev})
    return exp

for eval_dir in sorted(ITER.iterdir()):
    meta_f = eval_dir / "eval_metadata.json"
    if not meta_f.exists():
        continue
    meta = json.load(open(meta_f))
    for cfg in ("with_skill", "without_skill"):
        run = eval_dir / cfg
        if not (run / "outputs").exists():
            continue
        expectations = grade_run(run, meta)
        json.dump({"expectations": expectations}, open(run / "grading.json", "w"), indent=2, ensure_ascii=False)
        npass = sum(e["passed"] for e in expectations)
        print(f"{eval_dir.name}/{cfg}: {npass}/{len(expectations)}")
