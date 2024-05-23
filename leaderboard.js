// needs to make multiple  leaderboards for different gamemodes 

console.log(localStorage);
const leaderboard = document.querySelector('.leaderboard ol ');


//adding scores through local storage

// username =prompt('Enter your username');
// score =prompt('Enter your score');

function addScore(username, score) {
    console.log(localStorage.length);
    
    
    // leaderboard.appendChild(leaderboardUser ); // adds the username and score and displays them
    localStorage.setItem(username, score);
    
    // leaderboardUser.textContent = username + ' ' + score;
    
}
// this function si going to get the scores and username from local storage and display them  from highest to lowest
function displayScore() {
    let scores = [];

    for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        console.log(key);
        let value = localStorage.getItem(key);
        // scores.push({ name: key, score: value });
        // console.log(key, value);
        try{
            
            if (isNaN(value)) {
                throw new Error('Not a number');

            }
            else{
                scores.push({ name: key, score: value });
            }
            
            
        }catch(e){
        
            // localStorage.removeItem(key);


        }

        




        
    
    }

    scores.sort((a, b) => b.score - a.score);
    console.log(scores);
    
    
}

// addScore(username, score);
displayScore();
// addScore(username,score);


