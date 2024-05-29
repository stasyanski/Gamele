/* This file contains general
 * scripting for the game
*/

// creates a ptag to give user response 
const container = document.querySelector('.character-container');
const input_container = document.querySelector('.input_container');
const img = document.createElement('img');
const main = document.querySelector('.score');
let input;
let gamover = false;
let keydownEnter = null;
let user_input = null;

const score = document.querySelector('.score_txt');
let dotinterval;  // used to cancel the interval making sure its only called once
let scoreNum = 0;

// game mode varaibles
gamemode1 = 'Best time';
gamemode2 = 'Infinite';
gamemode3 = 'Three lives';

//makes its so you through out the program you can get the current game mode 
let current_choice = null;




// lives selector 
const extralives = document.querySelector('.lives');





// creates input guess similar to wordle, helps the user by showing how many letters are in the word, and where spaces are
function input_guess(name, formatted_name) {
  const input_container = document.querySelector('.input_container');

  // reset the container for each input_guess call so there wont be duplicates
  input_container.innerHTML = '';

  function get_user_input() { // checks the actual elemeents innerHTML to compare to the formatted name, much better and ensure the user input is correct
    let user_input = '';
    for (let i = 0; i < input_container.children.length; i++) {
      if (input_container.children[i].tagName === 'INPUT') {
        user_input += input_container.children[i].value;
        // console.log(user_input);
      }
    }
    return user_input;
  }

  // creates a input box, multiple boxes, with a max length of 1, and a size of 1, creates cool effect of the user typing in the boxes
  for (let i = 0; i < name.length; i++) {
    let element;
    if (name[i] === '_') {
      element = document.createElement('div');
      element.classList.add('input_one_char_spacing');
    } else {
      element = document.createElement('input');
      element.size = 1;
      element.maxLength = 1;
      element.classList.add('input_one_char');

      element.addEventListener('input', function () {
        element.value = element.value.toUpperCase(); // convert input to uppercase, show on user end
        user_input = get_user_input();

        if (element.value) {
          // find the next input box, skipping over any divs
          let nextInput = i + 1;
          while (nextInput < input_container.children.length && input_container.children[nextInput].tagName !== 'INPUT') {
            nextInput++;
          }
          // if there's a next input box, focus on it
          if (nextInput < input_container.children.length) {
            input_container.children[nextInput].focus();
          }
        }
      });

      // add keydown event listener for Enter, Delete or Backspace
      element.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
          if (typeof check_answer === 'function') {
            user_input = get_user_input();
            check_answer(formatted_name);
          }
        } else if (event.key === 'Delete' || event.key === 'Backspace') {
          // find the previous input box, skipping over any divs
          let prev_input = i - 1;
          while (prev_input >= 0 && input_container.children[prev_input].tagName !== 'INPUT') {
            prev_input--;
          }
          // if there's a previous input box, focus on it
          if (prev_input >= 0) {
            setTimeout(() => {
              input_container.children[prev_input].focus();
            }, 5);
          }
        }
      });
    }
    input_container.appendChild(element);
  }
  const first_element = input_container.children[0];
  if (first_element) {
    first_element.focus();  // automatically focuses on the first input box, saving user a few clicks.
  }
}






// check answer stuff, to be improved
const ptag = document.createElement('p');
container.appendChild(ptag);


function check_answer(formatted_name) {
  console.log(user_input, formatted_name)
  if (user_input.toUpperCase() === formatted_name.toUpperCase()) {
   
    for (let i = 0; i < input_container.children.length; i++) {
      if (input_container.children[i].tagName === 'INPUT') {  
                  // checks if its an input type element ( so it doesnt set the invisible divs to green)
       

        input_container.children[i].disabled = true;                    // disables the input boxes which takes off focus as well
        setTimeout(() => {
          input_container.children[i].style.backgroundColor = 'green';  // changes to green with a css transition in .css
        }, i*150);                                                      // every 150 ms, so it looks like a cool effect, and not instant because of i* 150, i gets incremented by 1 every time
      }
    }


    ptag.textContent = 'Correct!';
    scoreNum++;
    score.textContent = `Score: ${scoreNum}`;
    setTimeout(retrieve_characters, input_container.children.length * 200); // slightly longer delay, acting as feedback to the user that they got it right before swtiching 

  } 
  // going to make characters an amber colour if they are correct but in wrong postion

  else if (user_input.length === formatted_name.length) {
    formatted_name = formatted_name.toUpperCase();
    
    let userinput_array = user_input.split('');
    let formatted_name_array = formatted_name.split('');
    console.log(input_container.children.length);

    //adding only the characters to  an array
    
    let index=0; // used to change the index if there is a space 
    for (let i = 0; i < input_container.children.length ; i++) {

      // seeing if a character is correct but in the wrong postion 
      if(input_container.children[i].tagName !== 'INPUT'){
        continue;
      }
      
        if(formatted_name_array[index] === userinput_array[index]){
          input_container.children[i].style.backgroundColor = 'green';
          input_container.children[i].disabled = true;    
          console.log('input_container');
        }
        else if (formatted_name.includes(userinput_array[index])) {
        
        
          input_container.children[i].style.backgroundColor = '#fa9507';
        } 
        else{
        
          input_container.children[i].style.backgroundColor = 'red';
        }
      
    
        index ++;
    

    }
  }
  else {    
    ptag.textContent = 'Incorrect!';
    if (gamemode3 === current_choice.textContent) {
      let lives = extralives.children;
      if (lives.length > 0) {
        lives[0].remove();
      } else {
        game_over();
      }
    }
  }
}

// fetches the images from the json file
async function fetch_images() {
  const response = await fetch('images.json');
  return response.json();
}

// gets a random image from the data
function get_random_img(data) {
  const randomIndex = Math.floor(Math.random() * data.length);
  return data[randomIndex];
}

// formats the name of the image
function format(name) {
  // replaces all underscores with nothing, as user input will not have spaces
  // (images saved with _ to not cause issues with spaces)
  return name.replace(/_/g, '')
}

// retrieve random character  
async function retrieve_characters() {
  try {
    // fetch image data
    const data = await fetch_images();

    // get a random image to display 
    const image = get_random_img(data);

    // set the image source and append it to the container
    img.src = image.path;
    container.appendChild(img);

    // extract the name and type from the image name
    const source = image.name;
    const [name, type] = source.split('.');

    // format the name
    const formatted_name = format(name);

    // call input_guess function with formatted_name and keydownEnter as parameters
    input_guess(name, formatted_name);

  } catch (error) {
    console.error('Error fetching images:', error);
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
  retrieve_characters();
}


function game_over() {
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
      choice.addEventListener('click', () => move_overlay(choice));
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




