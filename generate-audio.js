const fs = require('fs');
const path = require('path');
const { TextToSpeechClient } = require('@google-cloud/text-to-speech');

// Initialize the client
const client = new TextToSpeechClient();

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

// Voice configurations for each language
const voiceConfigs = {
  english: { languageCode: 'en-US', name: 'en-US-Standard-A' },
  hindi: { languageCode: 'hi-IN', name: 'hi-IN-Standard-A' },
  tamil: { languageCode: 'ta-IN', name: 'ta-IN-Standard-A' },
  kannada: { languageCode: 'kn-IN', name: 'kn-IN-Standard-A' }
};

// Create audio directory if it doesn't exist
const audioDir = path.join(__dirname, 'audio');
if (!fs.existsSync(audioDir)) {
  fs.mkdirSync(audioDir);
}

async function generateAudioFile(text, language, filename) {
  try {
    const voiceConfig = voiceConfigs[language];
    
    const request = {
      input: { text: text },
      voice: voiceConfig,
      audioConfig: { 
        audioEncoding: 'MP3',
        sampleRateHertz: 8000,
        speakingRate: 0.8 // Slightly slower for clarity
      }
    };

    console.log(`🎙️ Generating ${filename} for ${language}...`);
    
    const [response] = await client.synthesizeSpeech(request);
    const audioContent = response.audioContent;
    
    const filePath = path.join(audioDir, filename);
    fs.writeFileSync(filePath, audioContent, 'binary');
    
    console.log(`✅ Generated: ${filename}`);
    return filePath;
  } catch (error) {
    console.error(`❌ Error generating ${filename}:`, error.message);
    return null;
  }
}

async function generateAllAudioFiles() {
  console.log('🚀 Starting audio file generation...\n');
  
  const generatedFiles = [];
  
  // Generate all audio files
  for (const [promptType, languages] of Object.entries(audioContent)) {
    for (const [language, text] of Object.entries(languages)) {
      const filename = `${promptType}-${language}.mp3`;
      const filePath = await generateAudioFile(text, language, filename);
      if (filePath) {
        generatedFiles.push({ filename, filePath });
      }
    }
  }
  
  console.log('\n📊 Generation Summary:');
  console.log(`✅ Generated ${generatedFiles.length} audio files`);
  console.log(`📁 Files saved in: ${audioDir}`);
  
  // Create a summary file with file paths
  const summary = {
    generatedFiles: generatedFiles.map(f => f.filename),
    audioDirectory: audioDir,
    totalFiles: generatedFiles.length,
    timestamp: new Date().toISOString()
  };
  
  fs.writeFileSync(
    path.join(__dirname, 'audio-generation-summary.json'), 
    JSON.stringify(summary, null, 2)
  );
  
  console.log('\n📋 Next Steps:');
  console.log('1. Upload these audio files to a web server or cloud storage');
  console.log('2. Update the URLs in server-simple.js with your hosted file URLs');
  console.log('3. Test your IVR with native language support!');
  
  return generatedFiles;
}

// Run the generation
if (require.main === module) {
  generateAllAudioFiles().catch(console.error);
}

module.exports = { generateAllAudioFiles, audioContent }; 