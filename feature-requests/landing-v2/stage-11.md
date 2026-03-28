# Stage 11: Hero Video & Poster Asset Production

## Overview

Production of the two static media assets required by Stage 9 (Video Hero):

- `frontend/public/video.webm` — looping screencast of real Buggregator UI (~15s)
- `frontend/public/img.png` — poster image (first frame, shown while video loads)

These assets live in the **main `frontend/` project** (`frontend/public/`), not in the
landing project. The landing (`buggregator.dev/spa-v2`) references them either:
- via a shared CDN / static host after deployment, or
- by copying them into `buggregator.dev/spa-v2/public/` as part of the build process.

**Current state of `frontend/public/`:**
```
frontend/public/
├── bg.jpg         ← existing background
├── favicon/       ← icons
├── manifest.json
└── robots.txt
```

After this stage:
```
frontend/public/
├── video.webm     ← NEW — hero looping screencast
├── img.png        ← NEW — poster / first frame
├── bg.jpg
├── favicon/
...
```

---

## Files

ADD to repository:
- `frontend/public/video.webm` — hero video, WebM/VP9, ≤2MB, 15s loop
- `frontend/public/img.png` — poster image, PNG, ≤150KB, 1280×720

UPDATE Stage 9 asset paths (VideoBackground.vue):
```
OLD: /hero.webm, /hero.mp4, /hero-poster.jpg
NEW: /video.webm, /img.png
```

Note: No MP4 fallback file — WebM is sufficient for all modern browsers
(Chrome, Firefox, Safari 14+, Edge). Older Safari versions get the poster image.

---

## Recording Specification

### What to record

**Source:** Run the real Buggregator frontend from `frontend/` locally.
Use the existing mock data / demo API to trigger events during recording.

**Scenario (15 seconds, seamless loop):**

```
0:00 – 2:00  Sidebar visible, event list empty or with 1-2 old events.
             "Waiting for events..." feel — calm opening.

2:00 – 4:00  Sentry exception card slides in from the top.
             Rose left-stripe. Label "AuthenticationException" readable.
             Card settles. Brief pause.

4:00 – 6:00  SMTP email card slides in.
             Amber left-stripe. Subject visible.

6:00 – 9:00  User (hidden cursor) clicks Profiler in sidebar.
             Call graph tab opens, nodes appear, hottest path highlights.
             Brief moment on the graph — dramatic, colorful.

9:00 – 11:00 Return to event list (click back in sidebar).
             Another Sentry exception arrives.
             List now has 3 cards.

11:00 – 13:00 VarDump card appears at top (sky/blue stripe).

13:00 – 15:00 Slow, gentle upward scroll across the filled event list.
              Fade to near-still. Last frame = first frame composition.
              → Seamless loop.
```

### Recording rules

| Rule | Detail |
|------|--------|
| Resolution | **1280 × 720** (720p) — sufficient given blur overlay |
| Frame rate | 30fps |
| Cursor | **Hidden** — no OS cursor visible in recording |
| Browser chrome | **Hidden** — record content area only, no address bar or tabs |
| OS chrome | **Hidden** — no taskbar, dock, notifications |
| Speed | Record at normal speed; **no slow-mo** |
| Audio | None / muted |
| Loop point | Last frame visually matches first frame (no jump cut) |

**Tools:**
- macOS: QuickTime (crop with ffmpeg after) or Screenflick / CleanMyMac Screen Recorder
- Windows: Xbox Game Bar (Win+G) or OBS
- Linux: OBS or `ffmpeg` with x11grab

---

## Export: video.webm

Single format. WebM/VP9 gives the best size/quality ratio and works in all modern browsers.

### ffmpeg command

```bash
# From raw recording file (MOV or MP4 source):
ffmpeg -i recording.mov \
  -vf "scale=1280:720,fps=30" \
  -c:v libvpx-vp9 \
  -b:v 0 \
  -crf 36 \
  -an \
  -t 15 \
  frontend/public/video.webm
```

**Flag explanations:**
- `-vf scale=1280:720,fps=30` — force resolution and framerate
- `-c:v libvpx-vp9` — VP9 codec (WebM)
- `-b:v 0 -crf 36` — constant quality mode; 36 is good for a blurred background
- `-an` — strip audio track completely
- `-t 15` — trim to exactly 15 seconds

**Target size:** ≤ 2MB for 15s at 1280×720 with CRF 36.
If file is larger, increase CRF to 40–42 (lower quality, smaller file).

### Verify loop

```bash
ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1 frontend/public/video.webm
```

Play in browser and verify no visible jump at the loop point. If there is a jump,
record a slightly longer clip (16-17s) and trim to a visually matching start/end.

---

## Export: img.png

The poster image is shown:
- While `video.webm` is loading (instantly visible)
- On mobile devices (no video autoplay)
- When `prefers-reduced-motion` is active
- If browser doesn't support WebM

### How to create

**Method A — extract from video (recommended):**
```bash
# Extract first frame from the final video.webm:
ffmpeg -i frontend/public/video.webm \
  -vframes 1 \
  -f image2 \
  frontend/public/img.png
```

**Method B — take a screenshot:**
Open Buggregator in browser, set it to the exact state shown at 0:00 of the video
(1-2 events in list, sidebar visible), take a 1280×720 screenshot, save as PNG.

### Optimization

PNG is lossless — the raw export may be 500KB+. Compress before committing:

```bash
# Using pngquant (lossy, excellent results):
pngquant --force --quality=70-85 --output frontend/public/img.png frontend/public/img.png

# Or using optipng (lossless):
optipng -o5 frontend/public/img.png
```

**Target size:** ≤ 150KB. The poster must load fast — it's the first thing the user sees.

### Verify visual match

The poster image must be **visually similar to the first frame of video.webm**.
A jarring difference between poster and video creates a "flash" effect when the video starts.
Best approach: always extract the poster from the video file (Method A above).

---

## Update Stage 9: VideoBackground.vue

Change asset references from the earlier draft paths to the actual file names:

```vue
<!-- VideoBackground.vue — update <video> and <img> src -->

<!-- Video sources: -->
<source src="/video.webm" type="video/webm" />
<!-- No MP4 fallback — WebM supported in all target browsers -->

<!-- Poster image: -->
<video ... poster="/img.png">

<!-- Reduced motion / mobile fallback: -->
<img :src="'/img.png'" alt="" class="video-bg__poster" aria-hidden="true" />
```

Also update `nuxt.config.ts` if there are any explicit `public` asset declarations.

---

## How landing references these files

### Option A — Copy to landing public (simplest)

```bash
# In landing build script or Makefile:
cp frontend/public/video.webm buggregator.dev/spa-v2/public/video.webm
cp frontend/public/img.png    buggregator.dev/spa-v2/public/img.png
```

Add to landing's `.gitignore` (if not committing copies):
```
public/video.webm
public/img.png
```

Add to CI/CD pipeline:
```yaml
# Before `npm run build` in the landing project:
- cp ../../frontend/public/video.webm public/
- cp ../../frontend/public/img.png public/
```

### Option B — CDN / shared static host (scalable)

Both `frontend/` and `buggregator.dev/spa-v2/` serve from the same CDN bucket.
Assets uploaded once, referenced by absolute URL in VideoBackground.vue:

```ts
// nuxt.config.ts
runtimeConfig: {
  public: {
    heroVideoUrl: process.env.HERO_VIDEO_URL || '/video.webm',
    heroPosterUrl: process.env.HERO_POSTER_URL || '/img.png',
  }
}
```

```vue
<!-- VideoBackground.vue -->
<source :src="config.public.heroVideoUrl" type="video/webm" />
<video :poster="config.public.heroPosterUrl" ...>
```

**Recommended:** Option A for simplicity during initial development, Option B for production.

---

## Git Considerations

`video.webm` is a binary file (≤2MB). Whether to commit to git or not:

| Option | Pros | Cons |
|--------|------|------|
| **Commit to git** | Simple, always available, no external deps | Increases repo size by ~2MB; git history grows |
| **Git LFS** | Keeps main repo lean | Requires LFS setup on all clones |
| **Not committed (CI downloads)** | Lean repo | More complex CI; needs hosting for the asset |

**Recommendation:** Commit directly to git for now (`frontend/public/video.webm`).
2MB is acceptable. If the video is re-recorded, old version is replaced — no accumulation.

Add to `.gitattributes` for correct diff behavior:
```
frontend/public/video.webm binary
frontend/public/img.png    binary
```

---

## Checklist

### Video recording
- [ ] Buggregator running locally from `frontend/` with demo events available
- [ ] Cursor hidden during recording
- [ ] Browser and OS chrome hidden (content area only)
- [ ] Scenario followed: empty → Sentry → SMTP → Profiler graph → more events → scroll
- [ ] Recording is 16–17 seconds (extra for trimming loop)
- [ ] Loop point visually matches (first frame ≈ last frame composition)

### video.webm export
- [ ] `ffmpeg` export command run successfully
- [ ] Output: `frontend/public/video.webm`
- [ ] File size: ≤ 2MB (verify with `ls -lh frontend/public/video.webm`)
- [ ] Duration: exactly 15 seconds (verify with `ffprobe`)
- [ ] No audio track (verify in browser devtools: no audio icon in video element)
- [ ] Plays in Chrome, Firefox, Safari 14+ without errors
- [ ] Loop is seamless — no visible jump at loop point

### img.png export
- [ ] Extracted from first frame of `video.webm` using `ffmpeg -vframes 1`
- [ ] Output: `frontend/public/img.png`
- [ ] File size: ≤ 150KB after optimization
- [ ] Resolution: 1280×720
- [ ] Visually matches first frame of video (no flash on video start)
- [ ] Compressed with `pngquant` or `optipng`

### Integration
- [ ] `frontend/public/video.webm` committed to git (or added to LFS)
- [ ] `frontend/public/img.png` committed to git
- [ ] `.gitattributes` updated with `binary` attribute for both files
- [ ] `VideoBackground.vue` updated: `src="/video.webm"`, `poster="/img.png"`
- [ ] Landing build has access to files (copy script or env var approach chosen)
- [ ] Hero renders in browser: poster visible during video load, then video plays
- [ ] On mobile (simulate in devtools): only poster `img.png` shown, no video element
- [ ] `prefers-reduced-motion`: only poster shown, no blur animation

---

## Dependencies

**Requires:**
- Stage 9 spec (VideoBackground.vue component exists to update)
- Running Buggregator instance from `frontend/` for the recording
- `ffmpeg` installed locally

**Enables:**
- Stage 9 Hero section is complete with real assets (not placeholder paths)
- QA can test the full video hero effect

## Notes

- Re-record the video if the Buggregator UI changes significantly (new event types,
  redesigned sidebar, etc.)
- The video intentionally does NOT show the full UI at full readability — it's ambient,
  blurred, darkened. A perfect HD quality screencast is not needed; CRF 36-40 is fine.
- `img.png` uses PNG (lossless) rather than JPG to avoid compression artifacts on the
  sharp UI elements visible in the poster.
- If the video file in `frontend/public/video.webm` is updated, the landing must be
  redeployed (or CDN cache invalidated) to pick up the new version.
