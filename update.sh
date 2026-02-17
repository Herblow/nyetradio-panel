#!/bin/bash

# --- Restart Icecast & Tunnel ---
pkill icecast
icecast -c icecast.xml > /dev/null 2>&1 &
pkill cloudflared
rm tunnel.log 2>/dev/null
cloudflared tunnel --url http://127.0.0.1:8000 > tunnel.log 2>&1 &
sleep 10

# --- Ambil Link & Update ---
LINK_BARU=$(grep -o 'https://[a-zA-Z0-9.-]*\.trycloudflare\.com' tunnel.log | tail -n 1)
FINAL_URL="${LINK_BARU}/live.ogg"

# Suntik link & BERSIHIN SAMPAH (Last Update) biar gak ngerusak footer
sed -i "s|[Cc]onst streamUrl.*|const streamUrl = \"$FINAL_URL\"; //TARGET|g" index.html
sed -i '/\/\/ Last Update/d' index.html
sed -i '/\/\/ Update/d' index.html

# --- Push Semua File ---
git add .
git commit -m "Fix Layout and Upload All Pages"
git push origin main --force

echo "🔥 UYEE NYET! Footer kepasang, 404 ilang, radio siap gas!"
