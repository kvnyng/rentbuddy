# Brand assets

The mascot is a raster illustration (a 3D clay render), so there is no vector source and no SVG.
Every file here is exported from `mascot.png`. Import single files through the package export,
e.g. `import icon from "@rentbuddy/ui/assets/icons/icon-32.png"`.

| File | Use |
|---|---|
| `mascot.png` (534×534, transparent, artwork centred) | `Logo`, email, OG images |
| `icons/icon-{16,32,48,128}.png` | Extension and Chrome Web Store icons |
| `icons/favicon-32.png` | Web app favicon |

## Transparent background

The original mascot had an opaque white background. It is kept in git history:
`git show 0197f70:packages/ui/src/assets/mascot.png > mascot-opaque.png`.
`scripts/cutout-mascot.py` (Python + Pillow, not a repo dependency) removes it:

```bash
python3 -I packages/ui/scripts/cutout-mascot.py mascot-opaque.png mascot-cut.png
# trim to the artwork, then centre it on a transparent square
magick mascot-cut.png -trim +repage -background none -gravity center -extent 534x534 \
  -strip PNG32:packages/ui/src/assets/mascot.png
```

It flood-fills near-white pixels from the image border, so white details inside the artwork
(windows, check mark) stay. Edge pixels are un-mixed from white for a halo-free edge, and the
light-grey ground shadow becomes translucent ink, so it works on any background.

## Icons

With ImageMagick 7, from `packages/ui/src/assets`:

```bash
for s in 16 32 48 128; do
  magick mascot.png -filter Lanczos -resize ${s}x${s} -strip PNG32:icons/icon-$s.png
done
cp icons/icon-32.png icons/favicon-32.png
```

At 16px the mascot reads as a red-roofed blue house; the face and check mark are lost.
A simplified mark would be needed for a crisper 16px icon.
