
# 🎙️ Quick Audio Generation Instructions

## 🚀 Method 1: Free Online TTS Services

### Step 1: Use Google Translate TTS
1. Go to https://translate.google.com
2. Select the target language (Hindi, Tamil, Kannada)
3. Copy the text from the generated .txt files
4. Paste in Google Translate
5. Click the speaker icon to hear pronunciation
6. Use browser extension or screen recorder to capture audio

### Step 2: Use Microsoft Edge TTS
1. Open Microsoft Edge browser
2. Go to any webpage
3. Right-click and select "Read aloud"
4. Change voice to Hindi, Tamil, or Kannada
5. Copy text from .txt files and paste in browser
6. Record the audio output

### Step 3: Use Online TTS Tools
- **Natural Reader**: https://www.naturalreaders.com
- **Text2Speech**: https://text2speech.org
- **iSpeech**: https://www.ispeech.org

## 🎯 Method 2: Mobile Apps
- **Google Translate App**: Has excellent TTS for Indian languages
- **Microsoft Translator**: Good quality TTS
- **Voice Aloud Reader**: Android app with multiple languages

## 📁 Required Audio Files
You need to generate these MP3 files:

### Language Selection Prompts:
- language-prompt-english.mp3
- language-prompt-hindi.mp3
- language-prompt-tamil.mp3
- language-prompt-kannada.mp3

### Enter Number Prompts:
- enter-number-english.mp3
- enter-number-hindi.mp3
- enter-number-tamil.mp3
- enter-number-kannada.mp3

### Rating Prompts:
- rating-prompt-english.mp3
- rating-prompt-hindi.mp3
- rating-prompt-tamil.mp3
- rating-prompt-kannada.mp3

### Thank You Messages:
- thank-you-english.mp3
- thank-you-hindi.mp3
- thank-you-tamil.mp3
- thank-you-kannada.mp3

## 🌐 Hosting Options

### Option 1: GitHub Pages (Free)
1. Create a GitHub repository
2. Upload audio files
3. Enable GitHub Pages
4. Use URLs like: https://yourusername.github.io/repo/filename.mp3

### Option 2: Netlify (Free)
1. Create a Netlify account
2. Upload audio files
3. Get public URLs

### Option 3: AWS S3 (Free tier)
1. Create S3 bucket
2. Upload files
3. Make public
4. Use URLs like: https://bucket-name.s3.amazonaws.com/filename.mp3

## 🔧 Next Steps
1. Generate all 16 audio files
2. Host them online
3. Update URLs in server-simple.js
4. Test your IVR!

## 💡 Tips
- Keep audio files under 10 seconds each
- Use MP3 format for compatibility
- Test audio quality on phone calls
- Ensure HTTPS URLs for Twilio compatibility
