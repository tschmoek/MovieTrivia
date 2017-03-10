
function searchByTitle() {
  var title = document.getElementById("search-bar").value;
  var url = "http://www.omdbapi.com/?t=" + title;
  var xhttp = new XMLHttpRequest();
  xhttp.open("GET", url, false);
  xhttp.send();
  var response = JSON.parse(xhttp.responseText);
  console.log('response: ', response);
  console.log('actors: ', response.Actors);

  var playerTable = document.getElementById('player1-results');
  var row = playerTable.insertRow(playerTable.rows.length);
  var movieTitle = row.insertCell(0);
  var point = row.insertCell(1);
  movieTitle.innerHTML = response.Title;
  point.innerHTML = "1"; //dummy point
}
