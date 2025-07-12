# 🎙️ IVR Audio Files

## 📁 Audio Files for Native Language IVR

This folder contains text files with content in native languages (Hindi, Tamil, Kannada, English) that need to be converted to audio files.

## 🚀 Quick Setup Instructions

### Step 1: Generate Audio Files
1. Use Google Translate (https://translate.google.com)
2. Select target language (Hindi, Tamil, Kannada)
3. Copy text from .txt files
4. Click speaker icon to hear pronunciation
5. Record audio and save as .mp3 files

### Step 2: Host on GitHub Pages
1. Create GitHub repository
2. Upload all .mp3 files to this folder
3. Enable GitHub Pages in repository settings
4. Your URLs will be: `https://yourusername.github.io/repo/filename.mp3`

### Step 3: Update Server Code
Replace placeholder URLs in `server-simple.js` with your GitHub Pages URLs.

## 📋 Required Audio Files

- `languagePrompt-english.mp3`
- `languagePrompt-hindi.mp3`
- `languagePrompt-tamil.mp3`
- `languagePrompt-kannada.mp3`
- `enterNumber-english.mp3`
- `enterNumber-hindi.mp3`
- `enterNumber-tamil.mp3`
- `enterNumber-kannada.mp3`
- `ratingPrompt-english.mp3`
- `ratingPrompt-hindi.mp3`
- `ratingPrompt-tamil.mp3`
- `ratingPrompt-kannada.mp3`
- `thankYou-english.mp3`
- `thankYou-hindi.mp3`
- `thankYou-tamil.mp3`
- `thankYou-kannada.mp3`

## 🎯 Priority Files for Quick Demo

For a quick hackathon demo, focus on these 4 files first:
1. `languagePrompt-hindi.mp3` - Hindi language selection
2. `languagePrompt-tamil.mp3` - Tamil language selection
3. `enterNumber-hindi.mp3` - Hindi number entry prompt
4. `thankYou-hindi.mp3` - Hindi thank you message

This will give you a working Hindi IVR demo! 