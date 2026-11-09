# Usage: python3 -I scripts/cutout-mascot.py <opaque.png> <out.png>  (needs Pillow; not a repo dependency)
# Removes the opaque near-white background from the mascot PNG.
# Only background reachable from the image border is removed (flood fill), so
# white details inside the artwork (windows, check mark) are kept. Pixels on the
# edge of the removed region are "un-mixed" from white for a soft, halo-free edge.
import sys
from collections import deque
from PIL import Image
src, dst = sys.argv[1], sys.argv[2]
im = Image.open(src).convert("RGBA"); W, H = im.size; px = im.load()
THRESH = 236          # min(r,g,b) above this counts as background white
bg = [[False]*W for _ in range(H)]
q = deque((x, y) for x in range(W) for y in (0, H-1)); q.extend((x, y) for y in range(H) for x in (0, W-1))
while q:
    x, y = q.popleft()
    if bg[y][x] or min(px[x, y][:3]) < THRESH: continue
    bg[y][x] = True
    for nx, ny in ((x+1,y),(x-1,y),(x,y+1),(x,y-1)):
        if 0 <= nx < W and 0 <= ny < H and not bg[ny][nx]: q.append((nx, ny))
# The soft ground shadow: neutral (unsaturated) light greys connected to the
# background. They become translucent black, so the shadow works on any colour.
shadow = [[False]*W for _ in range(H)]
q = deque((x, y) for y in range(H) for x in range(W) if bg[y][x])
neutral = lambda c: max(c[:3]) - min(c[:3]) <= 28 and min(c[:3]) >= 120
while q:
    x, y = q.popleft()
    for nx, ny in ((x+1,y),(x-1,y),(x,y+1),(x,y-1)):
        if 0 <= nx < W and 0 <= ny < H and not bg[ny][nx] and not shadow[ny][nx] and neutral(px[nx, ny]):
            shadow[ny][nx] = True; q.append((nx, ny))
# distance (in px, up to 3) from the background, for the edge band
dist = [[0 if bg[y][x] else 99 for x in range(W)] for y in range(H)]
for d in range(1, 4):
    for y in range(H):
        for x in range(W):
            if dist[y][x] == 99 and any(0<=x+dx<W and 0<=y+dy<H and dist[y+dy][x+dx]==d-1 for dx,dy in ((1,0),(-1,0),(0,1),(0,-1))):
                dist[y][x] = d
out = Image.new("RGBA", (W, H)); op = out.load()
for y in range(H):
    for x in range(W):
        r, g, b, _ = px[x, y]
        if bg[y][x]: op[x, y] = (0, 0, 0, 0); continue
        if shadow[y][x]: op[x, y] = (14, 26, 43, round((255 - min(r, g, b)) * 0.9)); continue
        if dist[y][x] <= 2:
            a = max(0.0, min(1.0, (255 - min(r, g, b)) / 90))
            if a == 0: op[x, y] = (0, 0, 0, 0); continue
            un = lambda c: max(0, min(255, round((c - (1 - a) * 255) / a)))
            op[x, y] = (un(r), un(g), un(b), round(a * 255))
        else:
            op[x, y] = (r, g, b, 255)
out.save(dst, optimize=True)
print("removed", sum(map(sum, bg)), "of", W*H)
