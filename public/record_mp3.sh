#!/bin/bash
# File: record_mp3.sh

# Nama file sementara
WAV_FILE="temp.wav"
MP3_FILE="output.mp3"

# Durasi rekam (detik)
DURATION=10

echo "Mulai rekam $DURATION detik..."
termux-microphone-record -f $WAV_FILE -l $DURATION

echo "Convert ke MP3..."
ffmpeg -i $WAV_FILE -ac 2 -ar 44100 -b:a 128k $MP3_FILE

echo "Selesai! File MP3: $MP3_FILE"

# Optional: hapus file WAV sementara
rm $WAV_FILE
