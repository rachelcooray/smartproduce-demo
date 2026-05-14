"""
Downloads ~25 images per produce class from the Fruits-360 GitHub dataset.
Classes chosen to match the SmartProduce app's produce list.
"""
import os
import urllib.request
import json
import time

BASE = "https://raw.githubusercontent.com/Horea94/Fruit-Images-Dataset/master/Training"

# Map our app class → Fruits-360 folder name(s)
CLASSES = {
    "banana":      ["Banana", "Banana Lady Finger", "Banana Red"],
    "tomato":      ["Tomato 1", "Tomato 2", "Tomato 3", "Tomato 4"],
    "carrot":      ["Carrot"],
    "apple":       ["Apple Red 1", "Apple Red 2", "Apple Granny Smith", "Apple Golden 1"],
    "mango":       ["Mango", "Mango Red"],
    "potato":      ["Potato Red", "Potato Sweet", "Potato White"],
    "onion":       ["Onion Red", "Onion White"],
    "coconut":     ["Cocos"],
    "watermelon":  ["Watermelon"],
    "pineapple":   ["Pineapple"],
    "grape":       ["Grape Blue", "Grape Pink", "Grape White 2"],
    "lemon":       ["Lemon", "Lemon Meyer"],
    "lime":        ["Lime"],
    "avocado":     ["Avocado"],
    "cucumber":    ["Cucumber Ripe", "Cucumber Ripe 2"],
    "brinjal":     ["Eggplant"],
    "corn":        ["Corn", "Corn Husk"],
    "pomegranate": ["Pomegranate"],
    "ginger":      ["Ginger Root"],
    "garlic":      ["Garlic"],
    "beetroot":    ["Beetroot"],
    "pepper":      ["Pepper Red", "Pepper Green", "Pepper Yellow"],
    "papaya":      ["Papaya"],
    "guava":       ["Guava"],
    "kiwi":        ["Kiwi"],
    "pear":        ["Pear"],
    "plum":        ["Plum", "Plum 2", "Plum 3"],
    "peach":       ["Peach", "Peach 2"],
}

IMAGES_PER_CLASS = 25
OUT_DIR = os.path.join(os.path.dirname(__file__), "images")

def list_files(folder):
    """Get file list from GitHub API."""
    api_url = f"https://api.github.com/repos/Horea94/Fruit-Images-Dataset/contents/Training/{urllib.parse.quote(folder)}"
    try:
        req = urllib.request.Request(api_url, headers={"User-Agent": "smartproduce-demo"})
        with urllib.request.urlopen(req, timeout=15) as r:
            return json.loads(r.read())
    except Exception as e:
        print(f"  ⚠ Could not list {folder}: {e}")
        return []

import urllib.parse

def download(label, folders):
    dest = os.path.join(OUT_DIR, label)
    os.makedirs(dest, exist_ok=True)
    existing = len(os.listdir(dest))
    if existing >= IMAGES_PER_CLASS:
        print(f"  ✓ {label}: already have {existing} images")
        return

    collected = existing
    for folder in folders:
        if collected >= IMAGES_PER_CLASS:
            break
        print(f"  Fetching list: {folder}")
        files = list_files(folder)
        for f in files:
            if collected >= IMAGES_PER_CLASS:
                break
            if not f["name"].endswith(".jpg"):
                continue
            fname = f"{label}_{collected:03d}.jpg"
            fpath = os.path.join(dest, fname)
            if os.path.exists(fpath):
                collected += 1
                continue
            try:
                urllib.request.urlretrieve(f["download_url"], fpath)
                collected += 1
                if collected % 5 == 0:
                    print(f"    {collected}/{IMAGES_PER_CLASS}")
            except Exception as e:
                print(f"    ⚠ {f['name']}: {e}")
            time.sleep(0.05)

    print(f"  ✓ {label}: {collected} images")

if __name__ == "__main__":
    print(f"Downloading images to {OUT_DIR}\n")
    for label, folders in CLASSES.items():
        print(f"→ {label}")
        download(label, folders)
    print("\nDone.")
