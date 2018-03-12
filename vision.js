const Promise = require('promise');

// Imports the Google Cloud client library
const vision = require('@google-cloud/vision');


exports.detect = function(img_path){
  // Creates a client
  const client = new vision.ImageAnnotatorClient();

  return new Promise(function(resolve, reject){
    // Performs label detection on the image file
    client
      .labelDetection(img_path)
      .then(results => {
        const labels = results[0].labelAnnotations;
        let sendLabels = [];
        labels.forEach(label => sendLabels.push(label.description));
        resolve(sendLabels);
      })
      .catch(err => {
        console.error('ERROR:', err);
        reject(err);
      });
  }
  );
}
