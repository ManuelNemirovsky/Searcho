var pluralize = require('pluralize')
const request = require('request');
var vision = require('./vision');
var fs = require('fs');

//singlize is a process which transmit the word
//to her own natural word.
//the function gets a word and returns the word in her own form
exports.singlize = function(words){
  return words.map(word => pluralize.singular(word));
}

//compares between string and array of strings
//the function gets array of strings and another string and
//returns true or false if the string is inside the array.
exports.compare = function(lables, noun)
{
  return new Promise((resolve, reject ) => {
    var ans = lables.indexOf(noun.toLowerCase()) >= 0

    console.log("resolving compares");
    resolve(ans);
  })
}

//this function is for sending photo request to
//the raspberry. the function gets the ip of the
//raspberry and sends him an http request.
function ask_for_photo(ras_ip){

  return new Promise((resolve, reject ) => {
    url='http://'+ras_ip+':4040/image'
    request.post(url, {encoding: 'binary'}, function(error, response, body) {
      if (error) {
                reject(error);
            } else {
                resolve("SUCCESS");
            }
      });
    })
}

//this function is for calling the ask_for_photo function from the
//app.js to utills. helps us to communicate between the
//app.js to the utils functions.
exports.detect = function(ras_ip){
  if (ras_ip.length != 0)
  {
      ask_for_photo(ras_ip)
  }
}
