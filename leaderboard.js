// needs to make multiple  leaderboards for different gamemodes 

console.log(localStorage);
const leaderboard = document.querySelector('.leaderboard ol ');


//adding scores through local storage


let leaderboardUser =document.createElement('li');

leaderboard.appendChild(leaderboardUser + localStorage); // adds the username and score and displays them

