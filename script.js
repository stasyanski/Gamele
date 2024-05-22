// creates a ptag to give user response 

let container = document.querySelector('.character-container');
const img = document.createElement('img');
const input = document.createElement('input');
const main = document.querySelector('.score');
let gamover = false;
let keydownEnter = null;
input.maxLength = 20;

let score = document.querySelector('.score_txt');
let dotinterval;
// dispalys character when user clicks start button 
function characters() {
  input.placeholder = 'guess the character';

  // guess the character animation
  let dotCount = 0;
  dotinterval= setInterval(() => {
    if (dotCount < 3) {
      input.placeholder += '.';
      dotCount++;
    } else{
      input.placeholder = input.placeholder.replace(/\./g, '');
      dotCount = 0;
    }
  }, 630);

  fetch('images.json')
      .then(response => response.json())
      .then(data => {
        // gets the character and places it on the web page

        // gets a random Number to display 
        let random = Math.floor(Math.random() * data.length);

        img.src = data[random].path;
        container.appendChild(img);
        let source = data[random].name;
        let [name, type] = source.split('.');

        let nameSpaces = name.replace(/_/g, ' ');
        console.log(nameSpaces);
        // creates input placeholder 

        container.appendChild(input);
        
        //checks to see if the user has pressed enter

        if(keydownEnter){
          input.removeEventListener('keydown',keydownEnter); //making sure the event listener is removed before adding a new one
        }
      
        keydownEnter = (event) => {
          if (event.key === 'Enter') {
            console.log( nameSpaces);

            checkAnswer(input.value.toLowerCase(), nameSpaces.toLowerCase()); //makes the values lowercase so easier to compare 
          }
        }
        input.addEventListener('keydown', keydownEnter);
        

      })
      .catch(error => console.error('Error:', error));
}

//start game function 
function startGame() {
  main.appendChild(score);
  // score.innerText = 'score: 0';
  console.log('Starting game');
  const displayScore = document.querySelector('.score');
  displayScore.style.display = 'flex';



  let startButton = document.querySelector('.start');
  startButton.style.display = 'none';
  characters();
}

// checks the users answer 
let ptag = document.createElement('p');
container.appendChild(ptag);

function checkAnswer(input, name) {
  // sets a limit of characters that can be typed   
  
  
  
  if (input === name ) {

    ptag.textContent = 'Correct';
    let scoreText = score.innerText;          // get current text of score
    let scoreArray = scoreText.split(' ');    // split text into an array by space char - becomes something like ['STREAK:', '0']
    let scoreNum = parseInt(scoreArray[1]);   // store 2nd element of array as variable - which is the score number           ^
    scoreNum++
    score.innerText = 'STREAK: ' + scoreNum;  // update score text with new score number
    ptag.textContent = ' ';
    input = '';

    //  will need to apply score to local storage and make a next button 
    clearInterval(dotinterval);
    setTimeout(() => {
      characters();
    }, 1000);
  }
  else {
    // gamover = true;
    ptag.textContent = 'Game Over !';
    // CREATES  an input box for the user to enter  their username when they lose 
    input.value='';
    input.placeholder = 'Enter Username';
    
  }
}
document.querySelector('.start').addEventListener('click', startGame);

// loads the modal on window load and hides it when user clicks start button
window.onload = function() {
  let modal = document.querySelector(".modal");
  let start = document.querySelector(".start");

  modal.style.display = "flex";

  start.onclick = function() {
    modal.style.display = "none";
  }

  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }
}


