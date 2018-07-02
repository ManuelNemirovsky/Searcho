const Promise = require('promise');

// Imports the Google Cloud client library
const language = require('@google-cloud/language');

// Instantiates a client
const client = new language.LanguageServiceClient();



//function exportred that receives the text to be analyzed
//returns a promise with object of {}
let analyze = function(text){
  return new Promise(function(resolve, reject){
    const document = {
      content: text,
      type: 'PLAIN_TEXT',
    };

  // Detects the sentiment of the text
  client
  .analyzeSyntax({document: document})
  .then(results => {
    const syntax = results[0];
    let analyzed = [];
    syntax.tokens.forEach(part => {
      analyzed.push({
        tag: part.partOfSpeech.tag,
        content: part.text.content
      });
    });

    resolve(analyzed);
    console.log(analyzed);
  })
    .catch(err => {
      console.error('ERROR:', err);
      reject(err);
    });
  })
}
exports.analyze = analyze;
