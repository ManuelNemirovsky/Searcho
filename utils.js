var pluralize = require('pluralize')

exports.singlize = function(words){
  // let singlizedWords = words.map(word => pluralize.singular(word))
  return words.map(word => pluralize.singular(word));
}
