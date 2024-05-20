// creates a ptag to give user response 

const container = document.getElementById('character-container');
const img = document.createElement('img');
const input = document.createElement('input');
const main = document.querySelector('.score');
input.maxLength = 20;

let score = document.querySelector('.score_txt');

// dispalys character when user clicks start button 
function characters() {

  input.placeholder = 'guess the character';

  // guess the character animation
  let dotCount = 0;
  setInterval(() => {
    if (dotCount < 3) {
      input.placeholder += '.';
      dotCount++;
    } else{
      input.placeholder = input.placeholder.replace(/\./g, '');
      dotCount = 0;
    }
  }, 430);

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

        input.addEventListener('keydown', (event) => {
          if (event.key === 'Enter') {
            checkAnswer(input, nameSpaces);
          }
        });

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

  console.log('Starting game');

  let startButton = document.querySelector('.start');
  startButton.style.display = 'none';
  characters();
}

// checks the users answer 
let ptag = document.createElement('p');
container.appendChild(ptag);

function checkAnswer(input, name) {
  // sets a limit of characters that can be typed   
  console.log(name);
  console.log(input.value);
  if (input.value === name) {

    ptag.textContent = 'Correct';
    let scoreText = score.innerText;          // get current text of score
    let scoreArray = scoreText.split(' ');    // split text into an array by space char - becomes something like ['STREAK:', '0']
    let scoreNum = parseInt(scoreArray[1]);   // store 2nd element of array as variable - which is the score number           ^
    scoreNum++
    score.innerText = 'STREAK: ' + scoreNum;  // update score text with new score number
    ptag.textContent = ' ';
    input.value = '';

    //  will need to apply score to local storage and make a next button 

    setTimeout(() => {
      characters();
    }, 1000);
  }
  else {
    ptag.textContent = 'Try again';
  }
}

window.onload = function() {
  var modal = document.getElementById("myModal");
  var okButton = document.getElementById("okButton");

  modal.style.display = "block";

  okButton.onclick = function() {
    modal.style.display = "none";
  }

  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }
}