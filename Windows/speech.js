// Imports the Google Cloud client library
const speech = require('@google-cloud/speech');
const fs = require('fs');
const Promise = require('promise');

// Your Google Cloud Platform project ID
const projectId = 'mindful-primer-189620';

// Creates a client
const client = new speech.SpeechClient({
  projectId: projectId,
});

let recognize = function(audioBytes){
  // The audio file's encoding, sample rate in hertz, and BCP-47 language code
  const audio = {
    content: audioBytes,
  };
  const config = {
    encoding: 'AMR_WB',
    sampleRateHertz: 16000,
    languageCode: 'en-US',
  };
  const request = {
    audio: audio,
    config: config,
  };

  return new Promise(function(resolve, reject){
    // Detects speech in the audio file
    client
      .recognize(request)
      .then(data => {
        const response = data[0];
        const transcription = response.results
          .map(result => result.alternatives[0].transcript)
          .join('\n')
        //console.log(`Transcription: ${transcription}`)
        resolve(transcription)
      })
      .catch(err => {
        if(err) reject(err);
        console.error('ERROR:', err);
      })
  }
  );
}


exports.recognize = recognize
