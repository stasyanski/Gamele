/* This file contains general
 * scripting for the game
*/


/* 
 * ----- GLOBAL VARS (to be cleaned up) -----
*/


// DOM elements
const container = document.querySelector('.character_container');
const extra_lives = document.querySelector('.lives');
const img = document.createElement('img');
const left_arrow = document.querySelector('.left_arrow');
const right_arrow = document.querySelector('.right_arrow');
const enter_button = document.querySelector('.enter_bttn');
const score = document.querySelector('.score');
const ui_elements_container = document.querySelector('.ui_elements_container');
const input_container = document.querySelector('.input_container');


// game state variables
let lives;
let input;
let guess = 0; // keeps track of the user gusses 
let formatted_name;
let last_input = null;
let input_movement;
let game_over_state = false;
let user_input = null;
let score_num = 0;

let current_choice = null;  // current game mode
let answer_enabled = true;  // enables or disables the ability to get an answer right 

// game mode variables
const gamemode1 = 'Best time';
const gamemode2 = 'Infinite';
const gamemode3 = 'Three lives';


/* 
 * ----- INPUT HANDLING, GUESSING, CHECKING ANSWER ETC RELATED FUNCTIONS -----
*/


// creates input guess similar to wordle, helps the user by showing how many letters are in the word, and where spaces are
function input_guess(name, formatted_name) {
  // reset the container for each input_guess call so there wont be duplicates
  input_container.innerHTML = '';

  function get_user_input() { // checks the actual elemeents innerHTML to compare to the formatted name, much better and ensure the user input is correct
    let user_input = '';
    for (let i = 0; i < input_container.children.length; i++) {
      if (input_container.children[i].tagName === 'INPUT') {
        user_input += input_container.children[i].value;
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
          let next_input = i + 1;
          while (next_input < input_container.children.length && input_container.children[next_input].tagName !== 'INPUT') {
            next_input++;
          }
          // if there's a next input box, focus on it
          if (next_input < input_container.children.length) {
            input_container.children[next_input].focus();
          } else {
            // if there is no next input box, move to the next one that is red or amber
            for (let i = 0; i < input_container.children.length; i++) {
              let child = input_container.children[i];
              if (child.style.backgroundColor === 'red' || child.style.backgroundColor === 'orange') {
                child.focus();
                break;
              }
            }
          }
        }
      });

      input_movement = function input_movement(direction) {
        // getting the last input box that was focused on, for the gui arrow keys to properly work
        if (!last_input) return;
        const inputs = Array.from(input_container.querySelectorAll('input'));
        const current_index = inputs.indexOf(last_input);

        console.log(last_input, current_index, inputs.length)

        if (direction === 'left' && current_index > 0) {
          // find the previous input that is not disabled and either has no special color or is red/orange
          for (let j = current_index - 1; j >= 0; j--) {
            if (!inputs[j].disabled && (inputs[j].style.backgroundColor === '' || inputs[j].style.backgroundColor === 'red' || inputs[j].style.backgroundColor === 'orange')) {
              inputs[j].focus();
              setTimeout(() => {
                let length = inputs[j].value.length;
                inputs[j].setSelectionRange(length, length);
              }, 10);
              break;
            }
          }
        } else if (direction === 'right' && current_index < inputs.length - 1) {
          // find the next input that is not disabled and either has no special color or is red/orange
          for (let j = current_index + 1; j < inputs.length; j++) {
            if (!inputs[j].disabled && (inputs[j].style.backgroundColor === '' || inputs[j].style.backgroundColor === 'red' || inputs[j].style.backgroundColor === 'orange')) {
              inputs[j].focus();
              break;
            }
          }
        }
      }

      // add keydown event listener for Enter, Delete or Backspace
      element.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' && answer_enabled) {
          user_input = get_user_input();
          check_answer(formatted_name);
        } else if (event.key === 'Delete' || event.key === 'Backspace') {
          // if it's the last child, only delete the current value and don't switch focus
          if (i === input_container.children.length - 1 && input_container.children[i].value !== '') {
            input_container.children[i].value = '';
          } else {
            // find the previous input box, skipping over any divs
            let prev_input = i - 1;
            while (prev_input >= 0 && input_container.children[prev_input].tagName !== 'INPUT') {
              prev_input--;
            }
            // if there's a previous input box, focus on it
            if (prev_input >= 0) {
              setTimeout(() => {
                if (input_container.children[i].style.backgroundColor !== 'red' && input_container.children[i].style.backgroundColor !== 'orange') {
                  input_container.children[prev_input].focus();
                }
                if (input_container.children[prev_input].disabled === false && input_container.children[i].style.backgroundColor !== 'red' && input_container.children[i].style.backgroundColor !== 'orange') { // only clears previous value if it's not disabled, if it it leave it alone, prevents deletion of correct values, or red / amber values
                  input_container.children[prev_input].value = ''; // removes the previous value too
                }
              }, 5);
            }
          }
        } else if (event.key === 'ArrowLeft') {
          // move focus to the left input box on arrowleft
          input_movement('left')
        } else if (event.key === 'ArrowRight') {
          // move focus to the right input box on arrowright
          input_movement('right')
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


left_arrow.addEventListener('click', function () {
  input_movement('left');
});

right_arrow.addEventListener('click', function () {
  input_movement('right');
});


// check answer and related functions
enter_button.addEventListener('click', function () {
  check_answer(formatted_name);
});
//if the user has never made a guess automatically assign it to 0
const modes= [gamemode1,gamemode2,gamemode3];

modes.forEach(function (mode) {
  if (localStorage.getItem(mode) == null) {
    localStorage.setItem(mode, '0');
  }
});
function check_answer(formatted_name) {
  // only increments the guess for that specific gamemode
  const guessStorage = (gamemode)=>{
    guess++;
    console.log(localStorage.getItem(gamemode1));
    if (localStorage.getItem(gamemode) == null){
      localStorage.setItem(gamemode,'0');
    }
    else if (localStorage.getItem(gamemode) < guess){
      localStorage.setItem(gamemode,guess);
      display_guesses();//changes the guess label when a new guess has occured

    }

  }

  if (current_choice.textContent === gamemode1) {
    guessStorage(gamemode1);
  }
  else if (current_choice.textContent === gamemode2) {
    guessStorage(gamemode2);
  }
  else if (current_choice.textContent === gamemode3) {
    guessStorage(gamemode3);
  }

  // gets the guess and stores it in local storage

  

  // ensure user_input is not null before proceeding
  if (user_input === null) {
    return; // rxit the function early if user_input is null
  }

  // the main function variables 
  formatted_name = formatted_name.toUpperCase();
  let userinput_array = user_input.split(''); // It's now safe to split user_input
  let formatted_name_array = formatted_name.split('');

  // function to update the element, changes the colour of the input boxes, and disables them if needed, used in the for loop below
  function update_element(element, color, disabled = false) {
    element.style.backgroundColor = color;
    element.disabled = disabled;
  }

  // for loop to go through the input boxes, and check if the user input is correct, and if it is in the correct position
  for (let i = 0, index = 0; i < input_container.children.length; i++) {
    let child = input_container.children[i];
    if (child.tagName !== 'INPUT') continue;

    // checks if the user input is correct, and if it is in the correct position
    if (user_input.toUpperCase() === formatted_name) {
      setTimeout(() => update_element(child, 'green'), i * 150);
    } else if (user_input.length === formatted_name.length) {
      if (formatted_name_array[index] === userinput_array[index]) {
        update_element(child, 'green', true); // disables the input box if the user input is correct          
      } else if (formatted_name.includes(userinput_array[index])) {
        update_element(child, 'orange');
      } else {
        update_element(child, 'red');
      }
      index++;
    }
  }

  // focus on the first amber / red box if the user input is incorrect
  for (let i = 0; i < input_container.children.length; i++) {
    let child = input_container.children[i];
    if (child.tagName !== 'INPUT') continue;
    if (child.style.backgroundColor === 'red' || child.style.backgroundColor === 'orange') {
      child.focus();
      break;          // break ensures no going to next amber/red but stopping on first found element
    }
  }

  // checks if the user input is correct, and if it is in the correct position
  if (user_input.toUpperCase() === formatted_name) {
    answer_enabled = false;

    //disables the user input when right 
    for (let i = 0; i < input_container.children.length; i++) {
      let child = input_container.children[i];
      child.disabled = true;
    }
    score_num++;
    
    
    setTimeout(retrieve_characters, input_container.children.length * 200);
  } else {
    console.log(current_choice.textContent);
    if (gamemode3 === current_choice.textContent) {
      remove_life()
    }
  }
}

// removing a life function from the lives count
const remove_life = () => {
  let lives = extra_lives.children;
  if (lives.length > 1 ) {
    lives[0].remove();
  } else {
    extra_lives.style.display = 'none';
    game_over();
  }
}


/* 
 * ----- FETCHING FROM STORAGE RELATED FUNCTIONS -----
*/


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
  score.textContent = 'SCORE: ' + score_num;
  answer_enabled = true;
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
    formatted_name = format(name);

    // call input_guess function with formatted_name and name as params
    input_guess(name, formatted_name);

  } catch (error) {
    console.error('Error fetching images:', error);
  }
}


/* 
 * ----- START GAME AND GAME OVER FUNCTIONS -----
*/


//start game function 
function start_game() {
  const start_btn = document.querySelector('.start');
  start_btn.style.display = 'none';

  left_arrow.style.display = 'flex';
  right_arrow.style.display = 'flex';
  enter_button.style.display = 'flex';
  score.style.display = 'flex';


  retrieve_characters();
}
function restart_game(splash){
  const restart =document.createElement('button');
  restart.textContent = 'Try Again';
  restart.classList.add('restart');
  restart.classList.add('start');

  splash.appendChild(restart);

  restart.addEventListener('click', function () {
    start_game(); // calls the start function to start the game again
    //need to make splash screen disappaer 
  });
  
}

// game over function
function game_over() {
  game_over_state = true;
  answer_enabled = false;
  // CREATES  an input box for the user to enter  their username when they lose 
  

  //makes the splash screen pop up with the game over state
  open_splash('gameover');

}
document.querySelector('.start').addEventListener('click', start_game);


/* 
 * ----- SPLASH SCREEN FUNCTIONS, INCLUDING SETTINGS, INFO, STATS, ETC. -----
*/


// splash screen functions
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
    current_choice = gamemode2;//makes it so current choice is assinged a value to begin with 
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
        for (let i = 0; i < 3; i++) {

          lives = document.createElement('li');
          lives.textContent = '♡';
          
          extra_lives.style.display = 'flex';
          extra_lives.appendChild(lives);
        }
      }
      
      if (current_choice.textContent == gamemode1) { //starts the best time mode
        let minute = 1;
        let seconds = 59;
        let milliseconds = 99;
        let timer_label = document.querySelector('.timer');
        const user_interface =document.querySelector('.ui_elements_container')
        // timer_label.classList.add('timer');
        user_interface.appendChild(timer_label);
        
        let timer = document.querySelector('.timer');
        timer.style.display = 'flex';//makes the timer appear when its the best time mode
        let time = setInterval(() => {
          milliseconds--;
          if (milliseconds < 0) {
            milliseconds = 99;
            seconds--;
          }
          if (seconds < 0) {
            seconds = 59;
            minute--;
          }

          if (minute == 0 && seconds == 0 && milliseconds == 0) {
            clearInterval(time);
            open_splash('bestTime')
          }

          let display_mins = String(minute).padStart(2, '0');
          let display_sec = String(seconds).padStart(2, '0');
          let display_ms = String(milliseconds).padStart(2, '0');

          timer_label.textContent = 'TIMER: ' + display_mins + '.' + display_sec + "." + display_ms;
        }, 10);
      }
    });
  });
})();

document.addEventListener('focusin', function (event) {
  if (event.target.tagName === 'INPUT') {
    last_input = event.target;
  }
});

