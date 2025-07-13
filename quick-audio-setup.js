const fs = require('fs');
const path = require('path');

// Audio content for each language
const audioContent = {
  languagePrompt: {
    english: "Select language: Press 1 for English, 2 for Hindi, 3 for Tamil, 4 for Kannada.",
    hindi: "भाषा चुनें: अंग्रेजी के लिए 1 दबाएं, हिंदी के लिए 2, तमिल के लिए 3, कन्नड़ के लिए 4 दबाएं।",
    tamil: "மொழியைத் தேர்ந்தெடுக்கவும்: ஆங்கிலத்திற்கு 1 அழுத்தவும், இந்திக்கு 2, தமிழுக்கு 3, கன்னடத்திற்கு 4 அழுத்தவும்.",
    kannada: "ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ: ಇಂಗ್ಲಿಷ್‌ಗಾಗಿ 1 ಒತ್ತಿ, ಹಿಂದಿಗಾಗಿ 2, ತಮಿಳಿಗಾಗಿ 3, ಕನ್ನಡಕ್ಕಾಗಿ 4 ಒತ್ತಿ."
  },
  enterNumber: {
    english: "Enter your waste management number using the keypad.",
    hindi: "कीपैड का उपयोग करके अपना कचरा प्रबंधन नंबर दर्ज करें।",
    tamil: "கீபாட் பயன்படுத்தி உங்கள் கழிவு மேலாண்மை எண்ணை உள்ளிடவும்.",
    kannada: "ಕೀಪ್ಯಾಡ್ ಬಳಸಿ ನಿಮ್ಮ ತ್ಯಾಜ್ಯ ನಿರ್ವಹಣೆ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ."
  },
  ratingPrompt: {
    english: "Rate our service: Press 1 for poor, 2 for fair, 3 for good, 4 for very good, 5 for excellent.",
    hindi: "हमारी सेवा का मूल्यांकन करें: खराब के लिए 1, सामान्य के लिए 2, अच्छा के लिए 3, बहुत अच्छा के लिए 4, उत्कृष्ट के लिए 5 दबाएं।",
    tamil: "எங்கள் சேவையை மதிப்பிடுங்கள்: மோசமானதற்கு 1, நடுத்தரத்திற்கு 2, நல்லதற்கு 3, மிகவும் நல்லதற்கு 4, சிறந்ததற்கு 5 அழுத்தவும்.",
    kannada: "ನಮ್ಮ ಸೇವೆಯನ್ನು ರೇಟ್ ಮಾಡಿ: ಕಳಪೆಗಾಗಿ 1, ಸಾಧಾರಣಕ್ಕಾಗಿ 2, ಉತ್ತಮಕ್ಕಾಗಿ 3, ತುಂಬಾ ಉತ್ತಮಕ್ಕಾಗಿ 4, ಅತ್ಯುತ್ತಮಕ್ಕಾಗಿ 5 ಒತ್ತಿ."
  },
  thankYou: {
    english: "Thank you for your feedback. Your response is important to us. Thank you for using Waste Management Services.",
    hindi: "आपकी प्रतिक्रिया के लिए धन्यवाद। आपकी प्रतिक्रिया हमारे लिए महत्वपूर्ण है। कचरा प्रबंधन सेवाओं का उपयोग करने के लिए धन्यवाद।",
    tamil: "உங்கள் கருத்துக்கு நன்றி. உங்கள் பதில் எங்களுக்கு முக்கியமானது. கழிவு மேலாண்மை சேவைகளைப் பயன்படுத்தியதற்கு நன்றி.",
    kannada: "ನಿಮ್ಮ ಪ್ರತಿಕ್ರಿಯೆಗೆ ಧನ್ಯವಾದಗಳು. ನಿಮ್ಮ ಪ್ರತಿಕ್ರಿಯೆ ನಮಗೆ ಮುಖ್ಯವಾಗಿದೆ. ತ್ಯಾಜ್ಯ ನಿರ್ವಹಣೆ ಸೇವೆಗಳನ್ನು ಬಳಸಿದ್ದಕ್ಕೆ ಧನ್ಯವಾದಗಳು."
  }
};

// Create audio directory if it doesn't exist
const audioDir = path.join(__dirname, 'audio');
if (!fs.existsSync(audioDir)) {
  fs.mkdirSync(audioDir);
}

// Generate text files with content for manual TTS generation
function generateTextFiles() {
  console.log('📝 Generating text files for manual TTS generation...\n');
  
  let fileCount = 0;
  
  for (const [promptType, languages] of Object.entries(audioContent)) {
    for (const [language, text] of Object.entries(languages)) {
      const filename = `${promptType}-${language}.txt`;
      const filePath = path.join(audioDir, filename);
      
      fs.writeFileSync(filePath, text, 'utf8');
      console.log(`✅ Created: ${filename}`);
      fileCount++;
    }
  }
  
  return fileCount;
}

// Generate instructions file
function generateInstructions() {
  const instructions = `
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
`;

  const instructionsPath = path.join(__dirname, 'AUDIO-GENERATION-INSTRUCTIONS.md');
  fs.writeFileSync(instructionsPath, instructions, 'utf8');
  console.log('📋 Created: AUDIO-GENERATION-INSTRUCTIONS.md');
}

// Generate sample URLs for testing
function generateSampleUrls() {
  const sampleUrls = {
    languagePrompt: {
      english: 'https://example.com/audio/language-prompt-english.mp3',
      hindi: 'https://example.com/audio/language-prompt-hindi.mp3',
      tamil: 'https://example.com/audio/language-prompt-tamil.mp3',
      kannada: 'https://example.com/audio/language-prompt-kannada.mp3'
    },
    enterNumber: {
      english: 'https://example.com/audio/enter-number-english.mp3',
      hindi: 'https://example.com/audio/enter-number-hindi.mp3',
      tamil: 'https://example.com/audio/enter-number-tamil.mp3',
      kannada: 'https://example.com/audio/enter-number-kannada.mp3'
    },
    ratingPrompt: {
      english: 'https://example.com/audio/rating-prompt-english.mp3',
      hindi: 'https://example.com/audio/rating-prompt-hindi.mp3',
      tamil: 'https://example.com/audio/rating-prompt-tamil.mp3',
      kannada: 'https://example.com/audio/rating-prompt-kannada.mp3'
    },
    thankYou: {
      english: 'https://example.com/audio/thank-you-english.mp3',
      hindi: 'https://example.com/audio/thank-you-hindi.mp3',
      tamil: 'https://example.com/audio/thank-you-tamil.mp3',
      kannada: 'https://example.com/audio/thank-you-kannada.mp3'
    }
  };

  const sampleUrlsPath = path.join(__dirname, 'sample-audio-urls.json');
  fs.writeFileSync(sampleUrlsPath, JSON.stringify(sampleUrls, null, 2), 'utf8');
  console.log('🔗 Created: sample-audio-urls.json');
  
  return sampleUrls;
}

// Main function
function main() {
  console.log('🚀 Setting up quick audio generation...\n');
  
  const fileCount = generateTextFiles();
  generateInstructions();
  const sampleUrls = generateSampleUrls();
  
  console.log(`\n📊 Summary:`);
  console.log(`✅ Generated ${fileCount} text files in /audio directory`);
  console.log(`📋 Created detailed instructions`);
  console.log(`🔗 Created sample URL structure`);
  
  console.log('\n🎯 Next Steps:');
  console.log('1. Check the /audio folder for text files');
  console.log('2. Read AUDIO-GENERATION-INSTRUCTIONS.md for detailed steps');
  console.log('3. Use free online TTS services to generate audio files');
  console.log('4. Host audio files online');
  console.log('5. Update URLs in server-simple.js');
  console.log('6. Test your native language IVR!');
  
  console.log('\n💡 Quick Start:');
  console.log('- Go to https://translate.google.com');
  console.log('- Copy text from audio/*.txt files');
  console.log('- Generate audio using Google Translate TTS');
  console.log('- Save as MP3 files with the same names');
}

if (require.main === module) {
  main();
}

module.exports = { audioContent, generateTextFiles, generateInstructions }; 