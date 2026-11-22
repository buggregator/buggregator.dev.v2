#!/bin/sh
# The hero X-ray beetle (#6838): both layers from the owner's 1672×941 PNG
# originals, as AVIF + WebP at 960 and 1672 px. The X-ray original is 1 px
# narrower: it is scaled to 1672×941 so the two layers line up.
# Needs ffmpeg with libwebp and libaom-av1. Run, then commit the images:
#   sh scripts/xray-hero-images.sh "<closed.png>" "<xray.png>"
set -eu
out="$(dirname "$0")/../public/img/xray-hero"
mkdir -p "$out"
for pair in "closed:$1" "xray:$2"; do
  name=${pair%%:*}
  src=${pair#*:}
  for w in 960 1672; do
    h=$((941 * w / 1672))
    vf="scale=${w}:${h}:flags=lanczos"
    ffmpeg -loglevel error -y -i "$src" -vf "$vf" -c:v libwebp -quality 78 -compression_level 6 "$out/$name-$w.webp"
    ffmpeg -loglevel error -y -i "$src" -vf "$vf,format=yuv420p" -c:v libaom-av1 -still-picture 1 -crf 32 -b:v 0 -cpu-used 4 "$out/$name-$w.avif"
  done
done
ls -l "$out"
