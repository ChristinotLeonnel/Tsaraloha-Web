"""Vidéo de présentation de TSA (≈ 40 s, 16:9) assemblée UNIQUEMENT à partir de ressources réelles :
  - captures de l'application TSA (tools/ui_tests/showcase_captures.ps1 du dépôt TSA) ;
  - logo officiel (public/assets/branding, copié du dépôt TSA) ;
  - pages des notes de calcul PDF produites par TSA (examples/notes du dépôt TSA).
Aucune image de synthèse ne représente un résultat ; aucune musique (pas de piste sous licence disponible) : la vidéo
est muette, sous-titrée (WebVTT français et anglais). Encodage H.264 par ffmpeg (imageio-ffmpeg), repli OpenCV.

python scripts/make-welcome-video.py --captures <dossier des captures> --notes <TSA/examples/notes> [--out public/video]
"""
import argparse
import os
import sys

import cv2
import numpy as np
import pymupdf
from PIL import Image, ImageDraw, ImageFilter, ImageFont

W, H, FPS = 1920, 1080, 30
BG = (11, 18, 32)  # bleu nuit du site (tsa-navy)
SITE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FONT = os.path.join(SITE, "node_modules", "@fontsource-variable", "inter", "files", "inter-latin-wght-normal.woff2")


def font(size, weight=400):
    f = ImageFont.truetype(FONT, size)
    f.set_variation_by_axes([weight])
    return f


def load(path):
    return Image.open(path).convert("RGB")


def fit(img, box=(W, H)):
    """Image entière dans le cadre, centrée sur fond uni."""
    s = min(box[0] / img.width, box[1] / img.height)
    im = img.resize((round(img.width * s), round(img.height * s)), Image.LANCZOS)
    out = Image.new("RGB", box, BG)
    out.paste(im, ((box[0] - im.width) // 2, (box[1] - im.height) // 2))
    return out


def crop_zoom(img, t, start, end):
    """Zoom progressif (rectangles normalisés x0, y0, x1, y1), sortie 16:9."""
    e = 0.5 - 0.5 * np.cos(np.pi * t)
    r = [a + (b - a) * e for a, b in zip(start, end)]
    x0, y0, x1, y1 = r[0] * img.width, r[1] * img.height, r[2] * img.width, r[3] * img.height
    # rectangle ramené au rapport 16:9 autour de son centre
    cx, cy, w = (x0 + x1) / 2, (y0 + y1) / 2, x1 - x0
    h = w * H / W
    box = (cx - w / 2, cy - h / 2, cx + w / 2, cy + h / 2)
    return img.crop(tuple(round(v) for v in box)).resize((W, H), Image.LANCZOS)


def blend(a, b, t):
    return Image.blend(a, b, float(np.clip(t, 0, 1)))


def caption(frame, title, subtitle, alpha):
    """Titre en bas à gauche, encadré semi-opaque."""
    if alpha <= 0:
        return frame
    over = Image.new("RGBA", frame.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(over)
    ft, fs = font(46, 700), font(28, 450)
    tw = d.textlength(title, font=ft)
    sw = d.textlength(subtitle, font=fs) if subtitle else 0
    w = int(max(tw, sw)) + 64
    h = 150 if subtitle else 96
    x, y = 70, H - h - 70
    d.rounded_rectangle((x, y, x + w, y + h), 18, fill=(8, 14, 26, int(205 * alpha)))
    d.rectangle((x, y + 18, x + 6, y + h - 18), fill=(56, 189, 248, int(255 * alpha)))
    d.text((x + 32, y + 22), title, font=ft, fill=(255, 255, 255, int(255 * alpha)))
    if subtitle:
        d.text((x + 32, y + 88), subtitle, font=fs, fill=(186, 213, 240, int(255 * alpha)))
    return Image.alpha_composite(frame.convert("RGBA"), over).convert("RGB")


def envelope(i, n, fade=12):
    return min(1.0, i / fade, (n - 1 - i) / fade) if n > 1 else 1.0


class Writer:
    """H.264 par ffmpeg (paquet imageio-ffmpeg : CRF, yuv420p, faststart pour la lecture web progressive) ; à défaut,
    OpenCV / Media Foundation (débit non réglable, fichiers beaucoup plus lourds)."""

    def __init__(self, path, size, crf):
        self.size = size
        try:
            import subprocess
            import imageio_ffmpeg
            cmd = [imageio_ffmpeg.get_ffmpeg_exe(), "-y", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "rgb24",
                   "-s", f"{size[0]}x{size[1]}", "-r", str(FPS), "-i", "-", "-c:v", "libx264", "-preset", "slow", "-crf", str(crf),
                   "-pix_fmt", "yuv420p", "-movflags", "+faststart", "-an", path]
            self.p = subprocess.Popen(cmd, stdin=subprocess.PIPE)
            self.w = None
        except ImportError:
            self.p = None
            self.w = cv2.VideoWriter(path, cv2.VideoWriter_fourcc(*"avc1"), FPS, size)
            if not self.w.isOpened():
                sys.exit(f"Encodeur H.264 indisponible pour {path}")

    def add(self, img):
        if img.size != self.size:
            img = img.resize(self.size, Image.LANCZOS)
        if self.p:
            self.p.stdin.write(np.asarray(img, dtype=np.uint8).tobytes())
        else:
            self.w.write(cv2.cvtColor(np.asarray(img), cv2.COLOR_RGB2BGR))

    def close(self):
        if self.p:
            self.p.stdin.close()
            if self.p.wait() != 0:
                sys.exit("ffmpeg : échec de l'encodage")
        else:
            self.w.release()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--captures", required=True)
    ap.add_argument("--notes", required=True)
    ap.add_argument("--out", default=os.path.join(SITE, "public", "video"))
    a = ap.parse_args()
    os.makedirs(a.out, exist_ok=True)
    cap = lambda proj, name: load(os.path.join(a.captures, proj, name))
    logo = Image.open(os.path.join(SITE, "public", "assets", "branding", "TSA_light.png")).convert("RGBA")

    frames = []  # (image, sous-titre fr, sous-titre en)
    cues = []    # (début s, fin s, fr, en)

    def seq(n, render, fr, en, title=None, subtitle=None):
        t0 = len(frames) / FPS
        for i in range(n):
            img = render(i / max(n - 1, 1), i)
            if title:
                img = caption(img, title, subtitle, envelope(i, n, 14))
            frames.append(img)
        cues.append((t0, len(frames) / FPS, fr, en))

    # 1. Logo (4 s)
    def intro(t, i):
        img = Image.new("RGB", (W, H), BG)
        a_ = min(1.0, t * 2.2)
        lg = logo.resize((360, 360), Image.LANCZOS)
        lg.putalpha(lg.getchannel("A").point(lambda v: int(v * a_)))
        img.paste(lg, ((W - 360) // 2, 250), lg)
        d = ImageDraw.Draw(img)
        for text, f_, y, col in (("TSA", font(84, 800), 640, (255, 255, 255)),
                                 ("Analyse et calcul de structures", font(40, 450), 750, (148, 197, 235))):
            tw = d.textlength(text, font=f_)
            c = tuple(int(BG[k] + (col[k] - BG[k]) * a_) for k in range(3))
            d.text(((W - tw) / 2, y), text, font=f_, fill=c)
        return img
    seq(4 * FPS, intro, "TSA — analyse et calcul de structures.", "TSA — structural analysis and design.")

    # 2. Modélisation 3D : orbite réelle autour du bâtiment en béton armé (7 s)
    orb = [fit(cap("ba", f"orbite_{k:02d}.png")) for k in range(24)]
    def orbit_render(seqimgs):
        def r(t, i):
            x = t * (len(seqimgs) - 1)
            k = int(np.floor(x))
            return blend(seqimgs[k], seqimgs[min(k + 1, len(seqimgs) - 1)], x - k)
        return r
    seq(7 * FPS, orbit_render(orb), "Modélisation 3D : poteaux, poutres, dalles, voiles, semelles et escaliers.",
        "3D modeling: columns, beams, slabs, walls, footings and stairs.",
        "Modélisation 3D", "Bâtiment R+4 en béton armé — capture réelle de TSA")

    # 3. Matériaux et rendu (6 s) : bâtiment mixte, puis arêtes du bâtiment en L
    m1, m2 = cap("mixte", "physique.png"), cap("complexe", "aretes.png")
    def mat(t, i):
        if t < 0.55:
            return crop_zoom(m1, t / 0.55, (0.0, 0.0, 1.0, 1.0), (0.18, 0.12, 0.92, 0.80))
        b = crop_zoom(m2, (t - 0.55) / 0.45, (0.10, 0.08, 1.0, 0.95), (0.20, 0.12, 0.95, 0.85))
        if t < 0.62:
            return blend(crop_zoom(m1, 1.0, (0.0, 0.0, 1.0, 1.0), (0.18, 0.12, 0.92, 0.80)), b, (t - 0.55) / 0.07)
        return b
    seq(6 * FPS, mat, "Matériaux et rendu : béton coffré, acier peint, galvanisé ; modes texturé, ombré, filaire et léger.",
        "Materials and rendering: formed concrete, painted and galvanized steel; textured, shaded, wireframe and light modes.",
        "Matériaux et rendu", "Finitions d'aspect indépendantes du calcul")

    # 4. Structures avancées : pont à haubans (7 s)
    orbp = [fit(cap("pont", f"orbite_{k:02d}.png")) for k in range(24)]
    seq(7 * FPS, orbit_render(orbp), "Pont à haubans 80 + 180 + 80 m : pylônes en H, 64 haubans, tablier métallique.",
        "Cable-stayed bridge 80 + 180 + 80 m: H pylons, 64 stay cables, steel deck.",
        "Structures avancées", "Pont à haubans — 64 haubans modélisés comme câbles")

    # 5. Analyse (8 s) : résultats F5, contraintes, effort normal dans les haubans
    r1, r2, r3 = fit(cap("pont", "resultats.png")), fit(cap("ba", "contraintes.png")), fit(cap("pont", "effort_normal.png"))
    def ana(t, i):
        parts = [r1, r2, r3]
        x = t * 3
        k = min(int(x), 2)
        cur = parts[k]
        if k < 2 and x - k > 0.85:
            return blend(cur, parts[k + 1], (x - k - 0.85) / 0.15)
        return cur
    seq(8 * FPS, ana, "Calcul OpenSees réel : déformée amplifiée, contraintes normales, efforts dans les haubans.",
        "Real OpenSees analysis: amplified deformed shape, normal stresses, stay cable forces.",
        "Analyse", "Résultats réellement calculés par OpenSees 3.8.0")

    # 6. Notes de calcul (6 s) : pages réelles des PDF produits par TSA
    pdf = pymupdf.open(os.path.join(a.notes, "TSA_Projet_Pont_Haubans_80-180-80m_note_detaillee.pdf"))
    wanted = [0, 1]
    for i, p in enumerate(pdf):
        if i < 3:  # couverture, sommaire et listes : les titres des chapitres y figurent aussi
            continue
        t = p.get_text()
        if "16. Câbles et haubans" in t and len(wanted) < 3:
            wanted.append(i)
        if "17. Vérifications réglementaires" in t and len(wanted) < 4:
            wanted.append(i)
    pages = []
    for i in wanted[:4]:
        pix = pdf[i].get_pixmap(dpi=110)
        pages.append(Image.frombytes("RGB", (pix.width, pix.height), pix.samples))
    def notes(t, i):
        img = Image.new("RGB", (W, H), BG)
        ph, gap = 640, 36
        pw = round(pages[0].width * ph / pages[0].height)
        left = (W - (len(pages) * pw + (len(pages) - 1) * gap)) // 2
        for k, pg in enumerate(pages):
            p = pg.resize((pw, ph), Image.LANCZOS)
            delay = k * 0.12
            e = float(np.clip((t - delay) / 0.25, 0, 1))
            e = 0.5 - 0.5 * np.cos(np.pi * e)
            x = left + k * (pw + gap)
            y = int(110 + (1 - e) * 120)
            shadow = Image.new("RGBA", (p.width + 40, p.height + 40), (0, 0, 0, 0))
            ImageDraw.Draw(shadow).rectangle((20, 20, p.width + 20, p.height + 20), fill=(0, 0, 0, int(140 * e)))
            shadow = shadow.filter(ImageFilter.GaussianBlur(12))
            img.paste(shadow, (x - 14, y - 8), shadow)
            pm = p.convert("RGBA")
            pm.putalpha(int(255 * e))
            img.paste(pm, (x, y), pm)
        return img
    seq(6 * FPS, notes, "Notes de calcul PDF simplifiée et détaillée, produites à partir des résultats réels.",
        "Simplified and detailed PDF design reports, built from the actual results.",
        "Notes de calcul", "PDF paginé : sommaire, câbles, vérifications calculées et non calculées")

    # 7. Conclusion (4 s)
    def outro(t, i):
        img = Image.new("RGB", (W, H), BG)
        lg = logo.resize((240, 240), Image.LANCZOS)
        img.paste(lg, ((W - 240) // 2, 260), lg)
        d = ImageDraw.Draw(img)
        for text, f_, y, col in (("TSA", font(72, 800), 540, (255, 255, 255)),
                                 ("Modéliser · Calculer · Justifier", font(40, 450), 640, (148, 197, 235)),
                                 ("christinotleonnel.github.io/Tsaraloha-Web", font(30, 500), 740, (125, 211, 252))):
            tw = d.textlength(text, font=f_)
            d.text(((W - tw) / 2, y), text, font=f_, fill=col)
        a_ = min(1.0, t * 3, (1 - t) * 3 + 0.25)
        return blend(Image.new("RGB", (W, H), BG), img, a_)
    seq(4 * FPS, outro, "Modéliser, calculer, justifier — avec TSA.", "Model, analyse, justify — with TSA.")

    # Écriture : 1080p, 720p (web), affiche, sous-titres
    full, web = os.path.join(a.out, "tsa-presentation-1080p.mp4"), os.path.join(a.out, "tsa-presentation-720p.mp4")
    w1, w2 = Writer(full, (W, H), 20), Writer(web, (1280, 720), 23)
    for f_ in frames:
        w1.add(f_)
        w2.add(f_)
    w1.close()
    w2.close()
    frames[int(13.5 * FPS)].resize((1280, 720), Image.LANCZOS).save(os.path.join(a.out, "tsa-presentation-poster.jpg"), quality=86)

    def stamp(s):
        return f"{int(s // 3600):02d}:{int(s % 3600 // 60):02d}:{s % 60:06.3f}"
    for lang, idx in (("fr", 2), ("en", 3)):
        with open(os.path.join(a.out, f"tsa-presentation.{lang}.vtt"), "w", encoding="utf-8", newline="\n") as fh:
            fh.write("WEBVTT\n\n")
            for k, c in enumerate(cues, 1):
                fh.write(f"{k}\n{stamp(c[0])} --> {stamp(c[1] - 0.05)}\n{c[idx]}\n\n")
    print(f"{len(frames)} images, {len(frames) / FPS:.1f} s : {full}, {web}")


if __name__ == "__main__":
    main()
