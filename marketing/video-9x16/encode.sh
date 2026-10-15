#!/bin/sh
# Encode les images produites par render.cjs (60 i/s) en MP4 1080x1920 30 i/s.
# Le mélange de 2 images consécutives donne un léger flou de mouvement.
# Usage : sh encode.sh <dossier-images> <sortie.mp4>
set -e
ffmpeg -y -framerate 60 -i "$1/f%05d.png" \
  -f lavfi -i anullsrc=channel_layout=stereo:sample_rate=48000 \
  -vf "tmix=frames=2,fps=30,format=yuv420p" \
  -c:v libx264 -preset slow -crf 16 -profile:v high -level 4.2 \
  -c:a aac -b:a 128k -shortest -t 15 -movflags +faststart "$2"
