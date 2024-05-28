/* This file contains general
 * scripting for the game
*/

// creates a ptag to give user response 
const container = document.querySelector('.character-container');
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
  const container = document.querySelector('.input_container');

  // reset the container for each input_guess call so there wont be duplicates
  container.innerHTML = '';

  // reset the user input for each input_guess call
  user_input = '';
  
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
        element.value = element.value.toUpperCase(); // convert input to uppercase
        user_input += element.value; // add the input to the user_input string which will be checked against the correct answer

        if (element.value) {
          // find the next input box, skipping over any divs
          let nextInput = i + 1;
          while (nextInput < container.children.length && container.children[nextInput].tagName !== 'INPUT') {
            nextInput++;
          }
          // if there's a next input box, focus on it
          if (nextInput < container.children.length) {
            container.children[nextInput].focus();
          }
        }
      });

      // add keydown event listener for Enter, when enter is pressed checkes the answer against formatted name
      element.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
          check_answer(formatted_name);
        }
      });

      // add keydown event listener for Delete or Backspace
      element.addEventListener('keydown', function(event) {
        if (event.key === 'Delete' || event.key === 'Backspace') {
          // find the previous input box, skipping over any divs
          let prev_input = i - 1;
          while (prev_input >= 0 && container.children[prev_input].tagName !== 'INPUT') {
            prev_input--;
          }
          // if there's a previous input box, focus on it
          if (prev_input >= 0) {
            setTimeout(() => {
              container.children[prev_input].focus();
            }, 5);
          }
          // remove the last index of user input, to reflect the backspace or delete
          user_input = user_input.slice(0, -1);
        }
      });
    }
    container.appendChild(element);
  }
}

const ptag = document.createElement('p');
container.appendChild(ptag);


function check_answer(formatted_name) {
  console.log(user_input, formatted_name)
  if (user_input.toUpperCase() === formatted_name.toUpperCase()) {
    ptag.textContent = 'Correct!';
    scoreNum++;
    score.textContent = `Score: ${scoreNum}`;
    retrieve_characters();
  } else {    
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




