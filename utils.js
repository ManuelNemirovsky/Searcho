var pluralize = require('pluralize')

exports.singlize = function(words){
  // let singlizedWords = words.map(word => pluralize.singular(word))
  return words.map(word => pluralize.singular(word));
}


exports.compare = function(lables, noun)
{
  console.log(noun);
  console.log(lables);
  return lables.indexOf(noun.toLowerCase()) >= 0;
}
