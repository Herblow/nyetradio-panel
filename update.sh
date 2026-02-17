#!/bin/bash

# --- KONFIGURASI ---
# 1. Masukkan link tunnel lu yang baru dapet dari Cloudflare (pake https)
# Contoh: https://ciao-fashion-pray-court.trycloudflare.com
LINK_TUNNEL="MASUKKAN_LINK_TUNNEL_DISINI"

# Tambahkan /; di akhir link biar stream lancar
FINAL_URL="${LINK_TUNNEL}/live.ogg"

# --- PROSES EKSEKUSI ---
echo "⏳ Sedang menyuntik link ke index.html..."

# Perintah sed untuk mencari baris //TARGET dan mengganti isinya
# Ini akan mengganti apapun yang ada di dalam tanda kutip const streamUrl
sed -i "s|const streamUrl = \".*\"; //TARGET|const streamUrl = \"$FINAL_URL\"; //TARGET|g" index.html

echo "🚀 Link tunnel baru: $FINAL_URL"
echo "📦 Mengunggah ke GitHub..."

# --- GIT PROSES ---
git add index.html
git commit -m "Update tunnel: $(date +'%H:%M:%S')"
git push origin main

echo "---------------------------------------"
echo "✅ BERES COK! Silakan refresh link GitHub lu."
echo "---------------------------------------"
