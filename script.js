/* This file contains general
 * scripting for the game
*/

// creates a ptag to give user response 
const container = document.querySelector('.character-container');
const img = document.createElement('img');
const input = document.createElement('input');
const main = document.querySelector('.score');
let gamover = false;
let keydownEnter = null;
input.maxLength = 20;

const score = document.querySelector('.score_txt');
let dotinterval;  // used to cancel the interval making sure its only called once
let scoreNum;

// game mode varaibles
gamemode1 = 'Best time';
gamemode2 = 'Infinite';
gamemode3 = 'Three lives';

//makes its so you through out the program you can get the current game mode 
let current_choice = null;


// lives selector 
const extralives = document.querySelector('.lives');
// displays character when user clicks start button 
async function characters() {
  input.placeholder = 'guess the character';

  // guess the character animation
  let dotCount = 0;
  dotinterval = setInterval(() => {
    if (dotCount < 3) {
      input.placeholder += '.';
      dotCount++;
    } else {
      input.placeholder = input.placeholder.replace(/\./g, '');
      dotCount = 0;
    }
  }, 630);

  try {
    const response = await fetch('images.json');
    const data = await response.json();

    // gets a random Number to display 
    const random = Math.floor(Math.random() * data.length);

    img.src = data[random].path;
    container.appendChild(img);
    const source = data[random].name;
    const [name, type] = source.split('.');

    const nameSpaces = name.replace(/_/g, ' ');
    console.log(nameSpaces);

    container.appendChild(input);

    //checks to see if the user has pressed enter
    if (keydownEnter) {
      input.removeEventListener('keydown', keydownEnter); //making sure the event listener is removed before adding a new one
    }

    keydownEnter = (event) => {
      if (event.key === 'Enter') {
        console.log(nameSpaces);

        checkAnswer(input, nameSpaces);
      }
    }
    input.addEventListener('keydown', keydownEnter);

  } catch (error) {
    console.error('Error:', error);
  }
}

//start game function 
function startGame() {
  main.appendChild(score);
  console.log('Starting game');
  const displayScore = document.querySelector('.score');
  displayScore.style.display = 'flex';

  const startButton = document.querySelector('.start');
  startButton.style.display = 'none';
  characters();
}

// checks the users answer 
const ptag = document.createElement('p');
container.appendChild(ptag);

function checkAnswer(input, name) {
  
  if (input.value.toLowerCase() === name.toLowerCase() && !gamover) { //makes the values lowercase so easier to compare 
    input.value = '';
    ptag.textContent = 'Correct';
    const scoreText = score.textContent;          // get current text of score
    const scoreArray = scoreText.split(' ');    // split text into an array by space char - becomes something like ['STREAK:', '0']
    scoreNum = parseInt(scoreArray[1]);   // store 2nd element of array as variable - which is the score number
    scoreNum++
    score.textContent = `STREAK: ${scoreNum}`;  // update score text with new score number
    ptag.textContent = ' ';

    //  will need to apply score to local storage and make a next button 
    clearInterval(dotinterval);
    setTimeout(() => {
      characters();
    }, 1000);
  }
  else {
    
    if(current_choice.textContent == gamemode3) {
      (()=>{
        if(extralives.childElementCount == 0) {
          gameover();
        }
        else{
          ptag.textContent = 'Lost a life';
          extralives.lastElementChild.remove();
        }
        
        
        
      })();
    }
    else if (current_choice.textContent == gamemode2){
      ptag.textContent = 'Wrong Answer Try Again!';
    }
    // else{
    //   gameover();
    // }
  }
}
function gameover(){
      gamover = true;
      ptag.textContent = 'Game Over !';
      // CREATES  an input box for the user to enter  their username when they lose 
      input.value = '';
      input.placeholder = 'Enter Username';

      localStorage.setItem(input.value, scoreNum);
      console.log(localStorage.getItem(input.value));
}
document.querySelector('.start').addEventListener('click', startGame);





// modal / startgame splash screen functions
(() => {
  const choices = document.querySelectorAll('.choice');
  const choice_overlay = document.createElement('div');
  

  // style the overlay, styling in .css 
  choice_overlay.classList.add('choice_overlay');
  document.body.appendChild(choice_overlay);

  // moves the overlay to the clicked button
  function move_overlay(choice) {
    const ch_size = choice.getBoundingClientRect();
    
    choice_overlay.style.display = 'block';
    choice_overlay.style.width = `${ch_size.width}px`;
    choice_overlay.style.height = `${ch_size.height}px`;
    choice_overlay.style.top = `${ch_size.top + window.scrollY}px`;      // moves overlay to the clicked button
    choice_overlay.style.left = `${ch_size.left + window.scrollX}px`;    // moves overlay to the clicked button
    current_choice = choice;


  }
  
  // move overlay to the clicked button
  choices.forEach(choice => {
    // makes the infinte game mode the default gamemode
   
    setTimeout(() => {           
      move_overlay(choices[1]);        // makes the infinite mode selected by default
      // set the event listener after 1010 ms , wating for the fadeIn animation in .css applied to modal to finish playing
      choice.addEventListener('click', () => move_overlay (choice));
    }, 1010);
  });

  // window resize - hide overlay, causes twitching when resizing
  window.addEventListener('DOMContentLoaded', () => {
    const modal = document.querySelector(".darken_bg");
    const start = document.querySelector(".start");

    
    modal.style.display = "flex";

    start.addEventListener('click', () => {
      modal.style.display = "none";
      choice_overlay.style.display = 'none';
    });

    // attach resize event listener
    window.addEventListener('resize', () => {
      if (current_choice) {
        choice_overlay.style.display = 'none';
        current_choice = null;
      }
    });
    start.addEventListener('click', () => {
      
      if (current_choice.textContent == gamemode3) {
        console.log("test")
        
        
        for (let i = 0; i < 3; i++) {
          let lives = document.createElement('li');
          extralives.appendChild(lives);
      }
    }
    });
  });
})();




