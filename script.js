// creates a ptag to give user response 

const container = document.getElementById('character-container');
const img = document.createElement('img');
const input = document.createElement('input');
const main = document.querySelector('.score');

let score = document.createElement('h4');
score.innerHTML = '0';
main.appendChild(score);
    

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

    console.log('Starting game');

    let startButton = document.querySelector('.start');
    startButton.style.display = 'none';
    characters();

  }
// checks the users answer 
let ptag = document.createElement('p');
container.appendChild(ptag);
function checkAnswer(input,name){
 
  
  console.log('aa',name);
  console.log(input.value);
  if(input.value === name){
    
    ptag.textContent = 'Correct';
    num = Number(score.innerText);
    num ++;
    score.innerText =num;
    ptag.textContent = '';
    input.value = '';

    //  will need to apply score to local storage and make a next button 
    setTimeout(() => {
     
      characters();
      
      

    }, 2000);
  }
  else{
    
    
    
    
    ptag.textContent ='try again';
    
  }
}