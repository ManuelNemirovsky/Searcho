var pluralize = require('pluralize')
const request = require('request');
var vision = require('./vision');
var fs = require('fs');

exports.singlize = function(words){
  console.log('inside singlize' + words);
  // let singlizedWords = words.map(word => pluralize.singular(word))
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

exports.detect = function(ras_ip){
  if (ras_ip.length != 0)
  {
      ask_for_photo(ras_ip)
  }
}
