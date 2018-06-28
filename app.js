const express = require('express')
const app = express()
var bodyParser = require('body-parser')
var fs = require('fs');
var speech = require('./speech');
var vision = require('./vision');
var language = require('./language');
var utils = require('./utils');
const request = require('request');
var partsOfText = ""
const fileUpload = require('express-fileupload');
var ras_ip = ""
var start_audio = -1
var start_ip = -1

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(fileUpload());

app.get('/', (req, res) => res.send('Hello World!'))

//search for ip address of the raspberry
app.post('/ip', function (req, res) {
  var end = new Date().getTime()
  if((end - start_ip)/10000 > 1)
  {
    console.log(req.query.ip)
    res.sendStatus(200);
    ras_ip = req.query.ip
  }
  start_ip = end;
})


// gets the audio file from mobile
app.post('/audio', (req, res) =>{
  var end = new Date().getTime()
  console.log((end-start_audio)/10000);
  if((end-start_audio)/10000 > 1)
  {
    speech.recognize(Buffer.from(req.body.data, 'base64'))
    .then(function(text){
      console.log(text);
      audioText = text;
      language.analyze(text).then(function(parts){
        // res.send(parts);
         // let singlized = utils.singlize(parts.map(part=>part.content));
         partsOfText = parts
        // console.log("singlized: " + singlized);
        res.sendStatus(200);
      })
    }).then(utils.detect(ras_ip))
  }
  start_audio = end;
})

// gets the labels from picture
app.post('/detect', (req, res) =>{
  if (!req.files)
    return res.status(400).send('No files were uploaded.');
  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let sampleFile = req.files.media;
  // Use the mv() method to place the file somewhere on your server
  sampleFile.mv('./downloaded.jpg', function(err) {
  if (err)
      return res.status(500).send(err);
      // call detection
  vision.detect('./downloaded.jpg')
  .then(function(labels){
    console.log("The lables from the picture:\n");
    console.log(labels);
    setTimeout(function(){
      console.log('partsOfText '+partsOfText);
      var single = utils.singlize(
          partsOfText.reduce(
            function(filtered_array,x){
              console.log("Entered to the func");
                if(x.tag=='NOUN'){
                  filtered_array.push(x.content)
                }
                return filtered_array
            }, []))[0];
          console.log('single: ' + single);
    utils.compare(labels , single).then(function(ans){
            console.log("got ans " + ans);
            res.send(ans.toString());
          });
    }, 3000)
      })
  });
})

app.listen(3000, () => console.log('Example app listening on port 3000!'))
