const express = require('express')
const app = express()
var bodyParser = require('body-parser')
var fs = require('fs');
var speech = require('./speech');
var vision = require('./vision');
var language = require('./language');
var utils = require('./utils');
var partsOfText = ""
// var multer  = require('multer')
// var upload = multer({ dest: 'uploads/' })
const fileUpload = require('express-fileupload');

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(fileUpload());

app.get('/', (req, res) => res.send('Hello World!'))


// gets the audio file from mobile
app.post('/audio', (req, res) =>{
  speech.recognize(Buffer.from(req.body.data, 'base64'))
  .then(function(text){
    console.log(text);
    audioText = text;
    language.analyze(text).then(function(parts){
      // res.send(parts);
       let singlized = utils.singlize(parts.map(part=>part.content));
       partsOfText = ""
       partsOfText = parts
      console.log("singlized: " + singlized);
    })
    res.sendStatus(200);
  })
})

// gets the audio file from mobile
app.post('/detect', (req, res) =>{
  // fs.writeFile('newImage', req.body.image, function (err) {
  //   if (err) throw err;
  //   console.log("It's saved");
  // });
  //TODO: save image locally, send the path to image to the vision.detect function
  if (!req.files)
    return res.status(400).send('No files were uploaded.');
  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let sampleFile = req.files.sampleFile;

  // Use the mv() method to place the file somewhere on your server
  sampleFile.mv('./uploads/filename.jpg', function(err) {
    if (err)
      return res.status(500).send(err);
      // call detection
      vision.detect('./uploads/filename.jpg')
      .then(function(labels){
        console.log("The lables from the picture:\n");
        console.log(labels);
        res.send(utils.compare(labels , utils.singlize(partsOfText.reduce(function(filtered_array,x){
          if(x.tag=='NOUN'){
            filtered_array.push(x.content)
          }
          return filtered_array
        }, []))[0]));
        // res.sendStatus(200)
        //res.send(labels);
      })


  });
})

app.listen(3000, () => console.log('Example app listening on port 3000!'))
