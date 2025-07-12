# 🎙️ Google Cloud TTS Setup (Best Quality)

## 🎯 Why Google Cloud TTS?
- ✅ **Best pronunciation** for Indian languages
- ✅ **Free tier**: 1 million characters/month
- ✅ **Professional quality** audio
- ✅ **Direct MP3 download**
- ✅ **No recording needed**

## 📋 Step-by-Step Setup

### Step 1: Create Google Cloud Account (Free)
1. Go to: https://console.cloud.google.com
2. Sign in with your Google account
3. Create a new project (free)
4. Enable billing (free tier available)

### Step 2: Enable Text-to-Speech API
1. Go to "APIs & Services" → "Library"
2. Search for "Text-to-Speech API"
3. Click "Enable"

### Step 3: Create Service Account
1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "Service Account"
3. Fill in details and create
4. Click on the service account
5. Go to "Keys" tab
6. Click "Add Key" → "Create New Key"
7. Choose JSON format
8. Download the JSON file

### Step 4: Set Up Environment
1. Save the JSON file in your project folder
2. Set environment variable:
   ```bash
   set GOOGLE_APPLICATION_CREDENTIALS=path/to/your-key.json
   ```

### Step 5: Generate Audio Files
1. Run the generation script:
   ```bash
   node generate-audio.js
   ```

## 🚀 Quick Alternative: Use Google Translate

If you don't want to set up Google Cloud:

### Method 1: Google Translate + Browser Extension
1. **Install browser extension**: "Audio Downloader" or "Save Audio"
2. **Go to**: https://translate.google.com
3. **Select language**: Hindi, Tamil, or Kannada
4. **Paste text** and click speaker
5. **Use extension** to download audio

### Method 2: Google Translate App
1. **Open Google Translate app** on phone
2. **Select language**
3. **Type text** and tap speaker
4. **Screen record** or use app's download feature

### Method 3: Microsoft Edge TTS
1. **Open Microsoft Edge**
2. **Go to any webpage**
3. **Right-click → "Read aloud"**
4. **Change voice** to Hindi, Tamil, or Kannada
5. **Copy text** from your files and paste
6. **Record the audio**

## 🎯 Recommended Approach

**For hackathon (quickest):**
1. Use Google Translate website + browser extension
2. Generate 4 key files (15 minutes)
3. Upload to GitHub Pages
4. Test your IVR

**For professional demo:**
1. Set up Google Cloud TTS
2. Generate all 16 files
3. Professional quality audio
4. Impressive for judges

## 💡 Tips for Better Quality

1. **Use Google Translate** - best for Indian languages
2. **Test audio** on phone before using
3. **Keep files under 10 seconds**
4. **Use HTTPS URLs** for Twilio compatibility

## 🎉 Expected Results

After setup, you'll have:
- ✅ **Authentic Hindi pronunciation**
- ✅ **Clear Tamil speech**
- ✅ **Natural Kannada voice**
- ✅ **Professional quality** for your hackathon 