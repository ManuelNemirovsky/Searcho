const express = require('express')
const app = express()
var bodyParser = require('body-parser')
var fs = require('fs');
var speech = require('./speech');

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.get('/', (req, res) => res.send('Hello World!'))


// gets the audio file from mobile
app.post('/audio', (req, res) =>{
  speech.recognize(req.body.data)
  // console.log(req.body.data);
  res.sendStatus(200);
})

app.listen(3000, () => console.log('Example app listening on port 3000!'))
