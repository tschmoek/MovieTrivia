# README #

## OBJECTIVE ## 
Using the OMDb API, create a game that pits two players against each other to test their movie knowledge in realtime.
REQUIREMENTS
* Allow two players to join a game
* A random player starts the game by choosing a movie (prompt)
* X seconds after the prompt movie is displayed, set a timer for Y seconds
* Once the timer is running, allow both players to search for and select movies
* When a player selects a movie, display that movie title in the player's list of guesses
* If a player guesses a movie that has already been guessed, display it differently (e.g. strikethrough)
* A player scores a point if they meet all of the following criteria
* They are the first player to select the movie
* The movie contains at least one common actor or actress (a common actor/actress is an actor/actress that acted in both the prompt movie and one of the guessed movies)
* A player receives a point for each common actor/actress meeting the criteria (e.g. if the prompt movie were You've Got Mail, and a player guessed Joe Verses The Volcano, that player would get two points, one for Tom Hanks, and one for Meg Ryan, since they both appear in both movies)
* Display repeat guesses, but stylize them differently and don't count them towards a player's score
* When the timer runs out, display each players total score and score for the round
* Before continuing with the next round, allow each player to review their guesses and see common actors/actresses for each guessed movie
* After Z number of rounds, display the scores of both players and declare a winner
* You must use the OMDb API to retrieve movie and actor/actress metadata
* Each player must be playing from separate computers
* You must display guesses in realtime for both players on each players' screen
* No help from outside developers (random strangers on the Internet OK)
* You can use any framework, library, language, technology stack, or tools you can find!
## JUDGEMENT CRITERIA ##
* UI / UX
* Eleguence of Code
* Functional (points for each requirement met; different requirements will be weighted differently)
* Creativity
## RESOURCES ## 
* http://www.omdbapi.com/
## TIPS ##
* Choose a leader to help manage the project
* Use git (Bitbucket, Github) and task management software (Trello, etc.)
* Design/sketch your interface before you start
* Get a minimal version working before you add all the features/try to meet all the requirements
## TEAM ##
* Tanner
* Johnny
* Yoojeong
* Gavin
* Cassi
* Jacob C
* Daniel
* Jacob W