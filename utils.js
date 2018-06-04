var pluralize = require('pluralize')
const request = require('request');
var vision = require('./vision');
var fs = require('fs');

function singlize(words){
  // let singlizedWords = words.map(word => pluralize.singular(word))
  return words.map(word => pluralize.singular(word));
}


function compare(lables, noun)
{
  console.log(noun);
  console.log(lables);
  return lables.indexOf(noun.toLowerCase()) >= 0;
}

//code added from notepad
function ask_for_photo(ras_ip){

  return new Promise((resolve, reject ) => {
    url='http://'+ras_ip+':4040/image'
    request.get(url, {encoding: 'binary'}, function(error, response, body) {
      fs.writeFile('downloaded.jpg', body, 'binary', function (err) {});
      if (error) {
                reject(error);
            } else {
                resolve("SUCCESS");
            }
      });
    })
}

exports.detect = function(ras_ip , partsOfText){
  if (ras_ip.length != 0)
  {
      ask_for_photo(ras_ip).then(vision.detect('./downloaded.jpg')
      .then(function(labels){
        console.log("The lables from the picture:\n");
        console.log(labels);
        var answer = compare(labels , singlize(
          partsOfText.reduce(
            function(filtered_array,x){
              console.log("only kesy not key");
                if(x.tag=='NOUN'){
                  filtered_array.push(x.content)
                }
                return filtered_array
            }, []))[0])
        url = 'http://'+ras_ip+':4040/answer'
        console.log(answer);
        request.post(url).form({key:answer.toString()})
      }))
  }
}
