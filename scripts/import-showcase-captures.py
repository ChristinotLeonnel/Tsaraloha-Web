"""Importe les captures réelles des quatre projets (tools/ui_tests/showcase_captures.ps1 du dépôt TSA) dans le site :
public/images/tsa/screenshots/<projet>-<vue>.webp (taille d'origine) et <projet>-<vue>-960.webp. Seul changement :
le redimensionnement et l'encodage WebP.

python scripts/import-showcase-captures.py <dossier des captures>
"""
import os
import sys

from PIL import Image

SITE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(SITE, "public", "images", "tsa", "screenshots")
MAP = {
    ("ba", "physique"): "ba-physique", ("ba", "aretes"): "ba-aretes", ("ba", "resultats"): "ba-resultats", ("ba", "contraintes"): "ba-contraintes",
    ("mixte", "physique"): "mixte-physique", ("mixte", "aretes"): "mixte-aretes", ("mixte", "resultats"): "mixte-resultats",
    ("mixte", "contraintes"): "mixte-contraintes",
    ("complexe", "physique"): "complexe-physique", ("complexe", "aretes"): "complexe-aretes", ("complexe", "resultats"): "complexe-resultats",
    ("complexe", "contraintes"): "complexe-contraintes",
    ("pont", "physique"): "haubans-physique", ("pont", "aretes"): "haubans-aretes", ("pont", "resultats"): "haubans-resultats",
    ("pont", "effort_normal"): "haubans-effort-normal",
}

src = sys.argv[1]
for (proj, view), name in MAP.items():
    im = Image.open(os.path.join(src, proj, f"{view}.png")).convert("RGB")
    im.save(os.path.join(OUT, f"{name}.webp"), "WEBP", quality=88, method=6)
    im.resize((960, round(im.height * 960 / im.width)), Image.LANCZOS).save(os.path.join(OUT, f"{name}-960.webp"), "WEBP", quality=86, method=6)
    print(name, im.size)
