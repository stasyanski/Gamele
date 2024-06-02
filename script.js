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

      // add keydown event listener for Enter, Delete or Backspace
      element.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
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
                  input_container.children[prev_input].value = ''; // removes the previous value too, game breaking bug fixed
                }
              }, 5);
            }
          }
        } else if (event.key === 'ArrowLeft') {
          // move focus to the left input box on arrowleft
          let prev_input = i - 1;
          while (prev_input >= 0 && input_container.children[prev_input].tagName !== 'INPUT') {
            prev_input--;
          }
          // if there's a previous input box, focus on it
          if (prev_input >= 0) {
            input_container.children[prev_input].focus();
          }
        } else if (event.key === 'ArrowRight') {
          // move focus to the right input box on arrowright
          let next_input = i + 1;
          while (next_input < input_container.children.length && input_container.children[next_input].tagName !== 'INPUT') { // same approach as for delete and bacspace
            next_input++;
          }
          // if there's a next input box, focus on it
          if (next_input < input_container.children.length) {
            input_container.children[next_input].focus();
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

  // the main function variables 
  formatted_name = formatted_name.toUpperCase();
  let userinput_array = user_input.split('');
  let formatted_name_array = formatted_name.split('');

  // function to update the element, changes the colour of the input boxes, and disables them if needed, used in the for loop below
  function updateElement(element, color, disabled = false) {
    element.style.backgroundColor = color;
    element.disabled = disabled;
  }

  // for loop to go through the input boxes, and check if the user input is correct, and if it is in the correct position
  for (let i = 0, index = 0; i < input_container.children.length; i++) {
    let child = input_container.children[i];
    if (child.tagName !== 'INPUT') continue;

    // checks if the user input is correct, and if it is in the correct position
    if (user_input.toUpperCase() === formatted_name) {
      setTimeout(() => updateElement(child, 'green'), i * 150);
    } else if (user_input.length === formatted_name.length) {
      if (formatted_name_array[index] === userinput_array[index]) {
        updateElement(child, 'green', true);                                // disables the input box if the user input is correct          
      } else if (formatted_name.includes(userinput_array[index])) {
        updateElement(child, 'orange');
      } else {
        updateElement(child, 'red');
      }
      index++;
    }
  }

  // focus on the first amber / red box if the user input is incorrect
  for (let i = 0; i < input_container.children.length; i++) {
    let child = input_container.children[i];
    if (child.tagName !== 'INPUT') continue;
    console.log(child.style.backgroundColor);
    if (child.style.backgroundColor === 'red' || child.style.backgroundColor === 'orange') {
      child.focus();
      break;          // break ensures no going to next amber/red but stopping on first found element
    }
  }

  // checks if the user input is correct, and if it is in the correct position
  if (user_input.toUpperCase() === formatted_name) {
    ptag.textContent = 'Correct!';
    scoreNum++;
    score.textContent = `Score: ${scoreNum}`;
    setTimeout(retrieve_characters, input_container.children.length * 200);
  } else if (user_input.length !== formatted_name.length) {
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



// game over function
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
        console.log("test")


        for (let i = 0; i < 3; i++) {
          let lives = document.createElement('li');
          extralives.appendChild(lives);
        }
      }

      if (current_choice.textContent ==gamemode1){ //starts the best time mode
        let time =0;
        let timerLabel = document.createElement('span')
        let startTime = Date.now();
        timerLabel.classList.add('timer');
        document.body.appendChild(timerLabel);
        setInterval(() => {
          let elapsedTime = Date.now() - startTime
          console.log(elapsedTime);
          let seconds = Math.floor(elapsedTime / 1000);
          let milliseconds = (elapsedTime % 1000);
          
          
          timerLabel.textContent = seconds + "." + milliseconds ;
        }, 1);
      }
    });
  });
})();




