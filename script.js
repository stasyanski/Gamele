// creates a ptag to give user response 

const container = document.getElementById('character-container');
const img = document.createElement('img');
const input = document.createElement('input');
const main = document.querySelector('.score');
input.maxLength = 20;

let score = document.createElement('h4');

    

// dispalys character when user clicks start button 
function characters(){

  input.placeholder = 'guess the character';
  fetch('images.json')
    .then(response => response.json())
    .then(data => {
      // gets the character and places it on the web page
      
      // gets a random Number to display 
      let random = Math.floor(Math.random() * data.length);
    
      img.src = data[random].path;
      container.appendChild(img);
      let source = data[random].name;
      let [name,type] = source.split('.');

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
    score.innerText = 'score: 0';
    console.log('Starting game');

    let startButton = document.querySelector('.start');
    startButton.style.display = 'none';
    characters();

  }
// checks the users answer 
let ptag = document.createElement('p');
container.appendChild(ptag);
function checkAnswer(input,name){
  // sets a limit of characters that can be typed 
  
  
  console.log(name);
  console.log(input.value);
  if(input.value === name){
    
    ptag.textContent = 'Correct';
    let [label,num] =score.innerText.split(':');
    
    
    num = Number(num);
    console.log( num);
    num ++;
    // updates the score 
    score.innerText ='score:' + num;
    ptag.textContent = '';
    input.value = '';

    //  will need to apply score to local storage and make a next button 

    setTimeout(() => {
     
      characters();
      
      

    }, 1000);
  }
  else{
    
    
    
    
    ptag.textContent ='try again';
    let username = prompt('Please enter a username for our leaderboard: ');

    // want to replace username with a input box so it looks more modren 
    setTimeout(() => {
     
      
      location.reload();
      

    }, 2000);
    
  }
}