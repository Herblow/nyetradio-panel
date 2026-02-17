#!/bin/bash

# --- 1. CARI LINK OTOMATIS ---
LINK_OTOMATIS=$(grep -o 'https://[a-zA-Z0-9.-]*\.trycloudflare\.com' tunnel.log | tail -n 1)

if [ -z "$LINK_OTOMATIS" ]; then
    echo "❌ ERROR: Link Cloudflare gak ketemu di tunnel.log!"
    exit 1
fi

FINAL_URL="${LINK_OTOMATIS}/live.ogg"

# --- 2. BERSIHIN SAMPAH GIT (FIX ERROR LO) ---
echo "🧹 Membersihkan konflik..."
git add .
git stash clear  # Hapus cache lama biar gak penuh
git checkout index.html # Balikin index ke asal biar bisa disuntik bersih

# --- 3. SUNTIK LINK ---
echo "⏳ Menyuntik link: $FINAL_URL"
sed -i "s|[Cc]onst streamUrl.*|const streamUrl = \"$FINAL_URL\"; //TARGET|g" index.html

# --- 4. PUSH PAKSA ---
echo "📦 Upload ke GitHub..."
git add index.html
git commit -m "Auto Update: $(date +'%H:%M:%S')"
git push origin main --force

echo "🔥 BERES NYET! Cek web lu sekarang."
