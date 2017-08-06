var guesses = [];

function addGuess(movie,clientid){
    if(guesses.length == 0){
      guesses.push({
        clientid: clientid,
        movie : movie
     });
     return true;
    }
    else{
      var firstMovieActors = guesses[0].movie.Actors.split(', ');
      var currentActors = movie.Actors.split(', ');
      for(var i = 0;i < firstMovieActors.length;i++){
        for(var j = 0;j < currentActors.length;j++){
          if(currentActors[j] == firstMovieActors[i]){
            guesses.push({
              clientid: clientid,
              movie : movie
            });
            return true;
          }
        }
      }
    }
    return false;
}

function alreadyGuessed(imdbId){
  for (var i = 0; i < guesses.length; i++) {
    if (guesses[i].movie.imdbID == imdbId) {
        return true;
    }
  }
  return false;
}

function calcTotals(){
  var firstPlayer = guesses[0].clientid;
  var firstCount = -1;
  var secondCount = 0;
  var secondPlayer;
  for(var i = 0;i < guesses.length; i++){
    if(guesses[i].clientid == firstPlayer){
      firstCount++;
    }else{
      secondCount++;
    }
  }
  //Subtract one because the initial selection is inluded..
  return {firstId:firstPlayer,firstPoints:firstCount,secondPoints:secondCount}
}
module.exports = {
  calcTotals : calcTotals,
	addGuess : addGuess,
	alreadyGuessed : alreadyGuessed
}