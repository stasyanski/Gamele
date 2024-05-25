/* This file contains general
 * scripting for the game
*/

// creates a ptag to give user response 
let container     = document.querySelector('.character-container');
const img         = document.createElement('img');
const input       = document.createElement('input');
const main        = document.querySelector('.score');
let gamover       = false;
let keydownEnter  = null;
input.maxLength   = 20;

let score         = document.querySelector('.score_txt');
let dotinterval;  // used to cancel the interval making sure its only called once
let scoreNum;


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
            
            checkAnswer(input, nameSpaces); 
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
  
  if (input.value.toLowerCase() === name.toLowerCase()  && !gamover ) { //makes the values lowercase so easier to compare 
    input.value = '';
    ptag.textContent = 'Correct';
    let scoreText = score.innerText;          // get current text of score
    let scoreArray = scoreText.split(' ');    // split text into an array by space char - becomes something like ['STREAK:', '0']
    scoreNum = parseInt(scoreArray[1]);   // store 2nd element of array as variable - which is the score number           ^
    scoreNum++
    score.innerText = 'STREAK: ' + scoreNum;  // update score text with new score number
    ptag.textContent = ' ';
    

    //  will need to apply score to local storage and make a next button 
    clearInterval(dotinterval);
    setTimeout(() => {
      characters();
    }, 1000);
  }
  else {
    gamover = true;
    ptag.textContent = 'Game Over !';
    // CREATES  an input box for the user to enter  their username when they lose 
    input.value='';
    input.placeholder = 'Enter Username';
     
    localStorage.setItem(input.value,scoreNum);
    console.log(localStorage.getItem(input.value));
    
  }
}
document.querySelector('.start').addEventListener('click', startGame);

// modal / startgame splash screen functions
(() => {
  let choices = document.querySelectorAll('.choice');
  let choice_overlay = document.createElement('div');
  let current_choice = null;

  // style the overlay, can be placed in .css 
  choice_overlay.style.position = 'absolute';
  choice_overlay.style.boxSizing = 'border-box';
  choice_overlay.style.pointerEvents = 'none'; 
  choice_overlay.style.borderRadius = '5px';
  choice_overlay.style.transition = 'top 0.5s, left 0.5s, width 0.5s, height 0.5s';
  choice_overlay.style.boxShadow = 'inset 0 0 10px rgb(150, 150, 150), 0 0 10px rgb(150, 150, 150)';
  choice_overlay.style.zIndex = '1000';
  document.body.appendChild(choice_overlay);

  
  function move_overlay(choice) {
    let ch_size = choice.getBoundingClientRect();
    choice_overlay.style.display = 'block';
    choice_overlay.style.width = ch_size.width + 'px';
    choice_overlay.style.height = ch_size.height + 'px';
    choice_overlay.style.top = (ch_size.top + window.scrollY) + 'px';      // moves overlay to the clicked button
    choice_overlay.style.left = (ch_size.left + window.scrollX) + 'px';    // moves overlay to the clicked button
    current_choice = choice;
  }

  // move overlay to the clicked button
  choices.forEach(choice => {
    setTimeout(() => {                                                     // set the event listener after 1010 ms , wating for the fadeIn animation in .css applied to modal to finish playing
      choice.addEventListener('click', () => move_overlay (choice));
    }, 1010);
  });

  // window resize - hide overlay, causes twitching when resizing
  window.addEventListener('resize', () => {
    if (current_choice) {
      choice_overlay.style.display = 'none';
      current_choice = null;
    }
  });

  // loads the modal on window load and hides it when user clicks start button
  window.onload = () => {
    let modal = document.querySelector(".modal");
    let start = document.querySelector(".start");
  
    modal.style.display = "flex";
  
    start.addEventListener('click', ()=> {
      modal.style.display = "none";
      choice_overlay.style.display = 'none';
    });
  }
})();




