var speech = "Voila! In view humble vaudevillian veteran, cast vicariously as both victim and villain by the vicissitudes of fate. This visage, no mere veneer of vanity, is a vestige of the 'vox populi' now vacant, vanished. However, this valorous visitation of a bygone vexation stands vivified, and has vowed to vanquish these venal and virulent vermin, van guarding vice and vouchsafing the violently vicious and voracious violation of volition. The only verdict is vengeance; a vendetta, held as a votive not in vain, for the value and veracity of such shall one day vindicate the vigilant and the virtuous. Verily this vichyssoise of verbiage veers most verbose, so let me simply add that it's my very good honour to meet you and you may call me V."

/////// Separate text into an array of words
function parseText(text){
  return text.toLowerCase().split(' ');
// .replace(/[^a-z\s]/ig, "")
  // var array = text.split(' ').map(function(element){
  //   var punctuation = ".,!/';"
  //   if (punctuation.indexOf(element[0]) > 0){
  //     return element.substring(1).toLowerCase();
  //   } else if (punctuation.indexOf(element[element.length-1]) > -1){
  //     return element.substring(0, element.length-1).toLowerCase();
  //   } else {
  //     return element.toLowerCase();
  //   }
  // })
  // return array
}



/////// Create object with word pairs
function generateWordPairs(array){
  var pairs = {}
  for (var i=0; i<array.length-1; i++){
    if (pairs[array[i]]){
      pairs[array[i]].push(array[i+1])
    } else {
      pairs[array[i]] = [array[i+1]]
    }
  }
  return pairs;
}




/////// Write a line of a poem

function randomWord(array){
  var randomIndex = Math.floor(Math.random() * array.length)
  return array[randomIndex]
}

function writeLine(object, wordCount){

  //random first word
  var keysArr = Object.keys(object)
  var firstWord = randomWord(keysArr)

  //array of line
  var line = [firstWord]
  var pastWord = firstWord
  for (var i=1; i<wordCount; i++){
    var nextWords = object[pastWord]
    if (nextWords) {
      pastWord = randomWord(nextWords)
    } else {
      pastWord = randomWord(keysArr)
    }
    line.push(pastWord)
  }
  //join the line array to get a string
  return line.join(' ')
}



/////// Generate poem

function generatePoem(corpus, numLines){
  var speechArray = parseText(corpus)
  var wordPairs = generateWordPairs(speechArray)
  var numWords = Math.floor(Math.random() * (6 - 4) + 4)
  var lines = [];

  for (var i=0; i<numLines; i++){
    lines.push(writeLine(wordPairs, numWords))
  }

  return lines
}

export default generatePoem
