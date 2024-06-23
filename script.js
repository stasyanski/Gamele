/* This file contains general
 * scripting for the game
 */

/*
 * ----- GLOBAL VARS (to be cleaned up) -----
 */

// DOM elements
const img                   = document.createElement("img");
const score                 = document.querySelector(".score");
const choices               = document.querySelectorAll(".choice");
const container             = document.querySelector(".character_container");
const start_btn             = document.querySelector(".start");
const timer_div             = document.querySelector(".timer");
const left_arrow            = document.querySelector(".left_arrow");
const extra_lives           = document.querySelector(".lives");
const right_arrow           = document.querySelector(".right_arrow");
const enter_button          = document.querySelector(".enter_bttn");
const darken_bg_var         = document.querySelector(".darken_bg");
const input_container       = document.querySelector(".input_container");
const ui_elements_container = document.querySelector(".ui_elements_container");

// game state variables
let guess               = 0; // keeps track of the user gusses
let score_num           = 0;
let last_input          = null;
let user_input          = null;
let formatted_name;
let current_choice      = "Infinite"; // current game mode
let answer_enabled      = true; // enables or disables the ability to get an answer right
let choice_overlay;

// game mode variables
const gamemode1 = "Best time";
const gamemode2 = "Infinite";
const gamemode3 = "Three lives";

/*
 * ----- INPUT HANDLING, GUESSING, CHECKING ANSWER ETC RELATED FUNCTIONS -----
*/

function input_guess(name) { // name is the exact name of the image, for example " michael_de_santa " but without the extension
  // reset the container after each guess so there wont be div duplicates
  input_container.innerHTML="";

  // creates a input box, multiple boxes, with a max length of 1, and a size of 1, creates cool effect of the user typing in the boxes
  name.split("").forEach((char, index) => {
    let element;
    if (char === "_") {
      element = document.createElement("div");
      element.classList.add("input_one_char_spacing");
    } else {
      element = document.createElement("input");
      element.setAttribute("size", "1");
      element.setAttribute("maxlength", "1");
      element.setAttribute("type", "text");
      element.classList.add("input_one_char");
      element.oninput = () => handle_input(element, index, name);
      element.onkeydown = (event) => handle_keydown(event, index);
    }
    input_container.appendChild(element);
  });
  // focus on the first input box saving the user a few clicks
  if (input_container.firstChild) {
    input_container.firstChild.focus();
  }
}

// gets the user input, joins the inputs from the array of inputs into a string
function get_user_input () {
  return Array.from(input_container.querySelectorAll("input")) 
  .map(input => input.value.toUpperCase()).join("");
}

function handle_input(element, index) {
  element.value = element.value.toUpperCase(); // convert input to uppercase, for easier comparison
  user_input = get_user_input(); // get the user input with the function
  focus_next_input(index); // focus on the next input
}

function handle_keydown(event, index) {
  if (event.key === "Enter" && answer_enabled) {
    user_input = get_user_input();
    check_answer();
  } else if (event.key === "Delete" || event.key === "Backspace") {
    handle_backspace(index);
  } else if (event.key === "ArrowLeft") {
    focus_previous_input(index);
  } else if (event.key === "ArrowRight") {
    focus_next_input(index);
  } 
}

function focus_next_input(index) {
  // find the next input box, skipping over any divs
  let next_input = index + 1;
  while (
    next_input < input_container.children.length &&
    input_container.children[next_input].tagName !== "INPUT"
  ) {
    next_input++;
  }
  // If there's a next input box, focus on it
  if (next_input < input_container.children.length) {
    input_container.children[next_input].focus();
  } else {
    // If there is no next input box, move to the next one that is red or amber
    for (let i = 0; i < input_container.children.length; i++) {
      let child = input_container.children[i];
      if (
        child.style.backgroundColor === "red" ||
        child.style.backgroundColor === "orange"
      ) {
        child.focus();
        break;
      }
    }
  }
}

function focus_previous_input(index) {
  // find the previous input box, skipping over any divs
  let prev_input = index - 1;
  while (
    prev_input >= 0 &&
    input_container.children[prev_input].tagName !== "INPUT"
  ) {
    prev_input--;
  }
  // if there's a previous input box, focus on it
  if (prev_input >= 0) {
    setTimeout(() => {
      if (
        input_container.children[index].style.backgroundColor !== "red" &&
        input_container.children[index].style.backgroundColor !== "orange"
      ) {
        input_container.children[prev_input].focus();
      }
    }, 5);
  }
}

function handle_backspace(index) {
  focus_previous_input(index);
  // if it's the last child, only delete the current value and don't switch focus
  if (
    index === input_container.children.length - 1 &&
    input_container.children[index].value !== ""
  ) {
    input_container.children[index].value = "";
  } 
}

function input_movement(direction) {
  // getting the last input box that was focused on, for the GUI arrow keys to properly work
  if (!last_input) return;
  const inputs = Array.from(input_container.querySelectorAll("input"));
  const current_index = inputs.indexOf(last_input);

  if (direction === "left" && current_index > 0) {
    // find the previous input that is not disabled and either has no special color or is red/orange
    for (let j = current_index - 1; j >= 0; j--) {
      if (
        !inputs[j].disabled &&
        (inputs[j].style.backgroundColor === "" ||
          inputs[j].style.backgroundColor === "red" ||
          inputs[j].style.backgroundColor === "orange")
      ) {
        inputs[j].focus();
        setTimeout(() => {
          let length = inputs[j].value.length;
          inputs[j].setSelectionRange(length, length);
        }, 10);
        break;
      }
    }
  } else if (direction === "right" && current_index < inputs.length - 1) {
    // find the next input that is not disabled and either has no special color or is red/orange
    for (let j = current_index + 1; j < inputs.length; j++) {
      if (
        !inputs[j].disabled &&
        (inputs[j].style.backgroundColor === "" ||
          inputs[j].style.backgroundColor === "red" ||
          inputs[j].style.backgroundColor === "orange")
      ) {
        inputs[j].focus();
        break;
      }
    }
  }
}

left_arrow.addEventListener("click", () => input_movement("left"));
right_arrow.addEventListener("click", () => input_movement("right"));
enter_button.addEventListener("click", check_answer);











// // creates input guess similar to wordle, helps the user by showing how many letters are in the word, and where spaces are
// function input_guess(name) {  // name is the exact name of the image, for example " michael_de_santa " but without the extension
//   // reset the container for each input_guess call so there wont be duplicates
//   input_container.innerHTML = "";

//   function get_user_input() {
//     // checks the actual elemeents innerHTML to compare to the formatted name, much better and ensure the user input is correct
//     let user_input = "";
//     for (let i = 0; i < input_container.children.length; i++) {
//       if (input_container.children[i].tagName === "INPUT") {
//         user_input += input_container.children[i].value;
//       }
//     }
//     return user_input;
//   }

//   // creates a input box, multiple boxes, with a max length of 1, and a size of 1, creates cool effect of the user typing in the boxes
//   for (let i = 0; i < name.length; i++) {
//     let element;
//     if (name[i] === "_") {
//       element = document.createElement("div");
//       element.classList.add("input_one_char_spacing");
//     } else {
//       element = document.createElement("input");
//       element.size = 1;
//       element.maxLength = 1;
//       element.classList.add("input_one_char");

//       element.addEventListener("input", function () {
//         element.value = element.value.toUpperCase(); // convert input to uppercase, show on user end
//         user_input = get_user_input();

//         if (element.value) {
//           // find the next input box, skipping over any divs
//           let next_input = i + 1;
//           while (
//             next_input < input_container.children.length &&
//             input_container.children[next_input].tagName !== "INPUT"
//           ) {
//             next_input++;
//           }
//           // if there's a next input box, focus on it
//           if (next_input < input_container.children.length) {
//             input_container.children[next_input].focus();
//           } else {
//             // if there is no next input box, move to the next one that is red or amber
//             for (let i = 0; i < input_container.children.length; i++) {
//               let child = input_container.children[i];
//               if (
//                 child.style.backgroundColor === "red" ||
//                 child.style.backgroundColor === "orange"
//               ) {
//                 child.focus();
//                 break;
//               }
//             }
//           }
//         }
//       });

//       input_movement = function input_movement(direction) {
//         // getting the last input box that was focused on, for the gui arrow keys to properly work
//         if (!last_input) return;
//         const inputs = Array.from(input_container.querySelectorAll("input"));
//         const current_index = inputs.indexOf(last_input);

//         if (direction === "left" && current_index > 0) {
//           // find the previous input that is not disabled and either has no special color or is red/orange
//           for (let j = current_index - 1; j >= 0; j--) {
//             if (
//               !inputs[j].disabled &&
//               (inputs[j].style.backgroundColor === "" ||
//                 inputs[j].style.backgroundColor === "red" ||
//                 inputs[j].style.backgroundColor === "orange")
//             ) {
//               inputs[j].focus();
//               setTimeout(() => {
//                 let length = inputs[j].value.length;
//                 inputs[j].setSelectionRange(length, length);
//               }, 10);
//               break;
//             }
//           }
//         } else if (direction === "right" && current_index < inputs.length - 1) {
//           // find the next input that is not disabled and either has no special color or is red/orange
//           for (let j = current_index + 1; j < inputs.length; j++) {
//             if (
//               !inputs[j].disabled &&
//               (inputs[j].style.backgroundColor === "" ||
//                 inputs[j].style.backgroundColor === "red" ||
//                 inputs[j].style.backgroundColor === "orange")
//             ) {
//               inputs[j].focus();
//               break;
//             }
//           }
//         }
//       };

//       // add keydown event listener for Enter, Delete or Backspace
//       element.addEventListener("keydown", function (event) {
//         if (event.key === "Enter" && answer_enabled) {
          
//           user_input = get_user_input();
//           check_answer(formatted_name);
//         } else if (event.key === "Delete" || event.key === "Backspace") {
//           // if it's the last child, only delete the current value and don't switch focus
//           if (
//             i === input_container.children.length - 1 &&
//             input_container.children[i].value !== ""
//           ) {
//             input_container.children[i].value = "";
//           } else {
//             // find the previous input box, skipping over any divs
//             let prev_input = i - 1;
//             while (
//               prev_input >= 0 &&
//               input_container.children[prev_input].tagName !== "INPUT"
//             ) {
//               prev_input--;
//             }
//             // if there's a previous input box, focus on it
//             if (prev_input >= 0) {
//               setTimeout(() => {
//                 if (
//                   input_container.children[i].style.backgroundColor !== "red" &&
//                   input_container.children[i].style.backgroundColor !== "orange"
//                 ) {
//                   input_container.children[prev_input].focus();
//                 }
//                 if (
//                   input_container.children[prev_input].disabled === false &&
//                   input_container.children[i].style.backgroundColor !== "red" &&
//                   input_container.children[i].style.backgroundColor !== "orange"
//                 ) {
//                   // only clears previous value if it's not disabled, if it it leave it alone, prevents deletion of correct values, or red / amber values
//                   input_container.children[prev_input].value = ""; // removes the previous value too
//                 }
//               }, 5);
//             }
//           }
//         } else if (event.key === "ArrowLeft") {
//           // move focus to the left input box on arrowleft
//           input_movement("left");
//         } else if (event.key === "ArrowRight") {
//           // move focus to the right input box on arrowright
//           input_movement("right");
//         }
//       });
//     }
//     input_container.appendChild(element);
//   }
//   const first_element = input_container.children[0];
//   if (first_element) {
//     first_element.focus(); // automatically focuses on the first input box, saving user a few clicks.
//   }
// }

// left_arrow.addEventListener("click", function () {
//   input_movement("left");
// });

// right_arrow.addEventListener("click", function () {
//   input_movement("right");
// });

// // check answer and related functions
// enter_button.addEventListener("click", function () {
//   check_answer();
// });












// if the user has never made a guess automatically assign it to 0
[gamemode1, gamemode2, gamemode3].forEach(function (mode) {
  if (localStorage.getItem(mode) == null) {
    localStorage.setItem(mode, "0");
  }
});

function check_answer() {
  if (!user_input) return; // exit the function early if user_input is null
  
  // only increments the guess for that specific gamemode
  switch(current_choice.textContent) {
    case gamemode1:
      guess_storage(gamemode1);
      break;
    case gamemode2:
      guess_storage(gamemode2);
      break;
    case gamemode3:
      guess_storage(gamemode3);
      break;
  }

  // call function for correct or wrong answer
  if (user_input.toUpperCase() === formatted_name) {
    handle_correct_answer();
  } else if (user_input.length === formatted_name.length) {
    handle_wrong_answer();
  }
}

function guess_storage(gamemode) {
  guess++;
  if (localStorage.getItem(gamemode) == null) {
    localStorage.setItem(gamemode, "0");
  } else if (localStorage.getItem(gamemode) < guess) {
    localStorage.setItem(gamemode, guess);
  }
};

function handle_wrong_answer () {
  if (current_choice.textContent === gamemode3) {
    // remove the last life
    extra_lives.lastElementChild.remove();
    
    // if no lives are left, hide the lives container and end the game
    if (extra_lives.children.length === 0) {
      extra_lives.style.display = "none";
      game_over();
    }
  }
  
  // variables to be used in the function, split into array as we check each character
  const user_input_array = user_input.split(""); 
  const formatted_name_array = formatted_name.split("");
  
  // loop through the input container children and check if the user input is correct
  Array.from(input_container.children).forEach((child, index) => {
    if (child.tagName !== "INPUT") return;

    // check character by character for partial correctness
    if (formatted_name_array[index] === user_input_array[index]) {
      update_element(child, "green", true); // correct character in correct position
    } else if (formatted_name.includes(user_input_array[index])) {
      update_element(child, "orange"); // correct character in wrong position
    } else {
      update_element(child, "red"); // incorrect character
    }
  });

  // focus on the first amber / red box if the user input is incorrect, makes it more intuitive
  for (const child of Array.from(input_container.children)) {
    if (child.tagName === "INPUT" && ["red", "orange"].includes(child.style.backgroundColor)) {
      child.focus();
      break; // stops at the first input with red or orange background
    }
  }
}

function handle_correct_answer() {
  // loop through the input container children and check if the user input is correct
  Array.from(input_container.children).forEach((child, index) => {
    if (child.tagName !== "INPUT") return;
  
    // check if the entire user input matches the formatted name
    if (user_input.toUpperCase() === formatted_name) {
      child.disabled = true; // disable the input field
      setTimeout(() => update_element(child, "green"), index * 150);
      
      // if this is the last iteration, disable all inputs and prepare for the next character
      if (index === input_container.children.length - 1) {
        answer_enabled = false;
        score_num++;
        score.textContent = "SCORE: " + score_num; // update the score text
        setTimeout(display_new_character, input_container.children.length * 200);
      }
    } 
  });
}

// update the element color and the disabled state after a guess is made
function update_element(element, color, disabled = false) {
  if (element) {
    element.style.backgroundColor = color;
    element.disabled = disabled;
  }
}


/*
 * ----- FETCHING FROM STORAGE RELATED FUNCTIONS -----
*/


// fetches the images from the json file
async function fetch_images() {
  try {
    const response = await fetch("images.json");
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching images:", error);
    throw error; // rethrow to handle it in the calling function
  }
}

// gets a random image from the data
function get_random_img(data) {
  const random_index = Math.floor(Math.random() * data.length);
  return data[random_index];
}

// formats the name of the image
function format(name) {
  // replaces all underscores with nothing, as user input will not have spaces
  // (images saved with _ to not cause issues with spaces)
  return name.replace(/_/g, "").toUpperCase(); // changed to replace underscores with spaces for readability and uppercase for comparing
}

// retrieve random character
async function display_new_character() {
  answer_enabled = true; // ensure variables are declared with let or const
  try {
    // fetch image data
    const data = await fetch_images();

    // get a random image to display
    const image = get_random_img(data);

    // ensure img and container are defined or accessible in this scope
    if (!window.img) window.img = new Image(); // create img if it doesn't exist
    if (!window.container) window.container = document.querySelector('#image-container'); // assuming a container with id 'image-container'

    // set the image source and append it to the container
    img.src = image.path;
    if (!img.parentNode) container.appendChild(img); // append only if img is not already appended

    // extract the name and type from the image name
    const [name, type] = image.name.split("."); // split requires two variables to assign to, even if one is not used, avoid error (.png, .webp not needed)

    // format the name
    formatted_name = format(name);

    // call input_guess function with formatted_name and name as params
    input_guess(name); 
  } catch (error) {
    console.error("Error fetching images:", error);
  }
}


/*
 * ----- START GAME AND GAME OVER FUNCTIONS -----
*/


// start game function
function start_game() {
  // hide the splash
  start_btn.style.display = "none";

  // dom elements to be displayed
  [left_arrow, right_arrow, enter_button, score].forEach(
    (element) => (element.style.display = "flex")
  );
  // retrieves a random image from the json file and displays it
  display_new_character();
}

// game over function
function game_over() {
  // disables the ability to check the answer, cant call check answer a lot of times
  answer_enabled = false;
  // makes the splash screen pop up with the game over state
  open_splash("gameover");
}


/*
 * ----- CHOICE OVERLAY FUNCTION -----
*/


// splash screen functions
function splash_screen_func() {
  // create a choice overlay div which overlays depending on user choice, default is infinite
  choice_overlay = document.createElement("div");

  // style the overlay, styling in .css
  choice_overlay.classList.add("choice_overlay");
  document.body.appendChild(choice_overlay);

  // moves the overlay to the clicked button
  function move_overlay(choice) {
    // gets the current choice position so it can be shifted accordingly
    const ch_pos = choice.getBoundingClientRect();

    // moves the choice_overlay position to the clicked button
    choice_overlay.style.display = "block";
    choice_overlay.style.width = `${ch_pos.width}px`;
    choice_overlay.style.height = `${ch_pos.height}px`;
    choice_overlay.style.top = `${ch_pos.top + window.scrollY}px`; // moves overlay to the clicked button
    choice_overlay.style.left = `${ch_pos.left + window.scrollX}px`; // moves overlay to the clicked button

    // update the global variable with the choice of user
    current_choice = choice;
  }

  // move overlay to the clicked button
  choices.forEach((choice) => {
    setTimeout(() => {
      move_overlay(choices[1]); // makes the infinite mode selected by default
      // set the event listener after 1010 ms , wating for the fade in animation in .css applied to finish playing
      choice.addEventListener("click", () => move_overlay(choice));
    }, 1010);
  });
}
splash_screen_func(); // instead of an iife, so we can pass the current_choice variable anywhere


/*
 * ----- GAMEMODE RELATED FUNCTIONS (CREATE TIMER OR LIVES) -----
 */


function add_lives() {
  for (let i = 0; i < 3; i++) {
    const life = document.createElement("li");
    life.textContent = "♡";

    // append the life to the extra_lives div
    extra_lives.style.display = "flex"; // displays the div that contains lives, which are usually hidden
    extra_lives.appendChild(life );
  }
}

function add_timer() {
  // display the timer div
  timer_div.style.display = "flex"; // displays the div that contains timer, which is usually hidden

  // create and append timer label to the timer div
  const timer_label = document.createElement("p");
  timer_div.appendChild(timer_label);
  
  // duration of the timer and end time defined
  const duration = 1 * 60 * 1000 + 59 * 1000 + 99; // 1 minute, 59 seconds, 99 milliseconds
  const end_time = Date.now() + duration;

  let timer = setInterval(() => {
    const now = Date.now();
    const time_left = end_time - now;

    if (time_left <= 0) {
      clearInterval(timer);
      open_splash("best_time");
    }

    const min = Math.floor(time_left / 60000);
    const sec = Math.floor((time_left % 60000) / 1000);
    const ms = Math.floor((time_left % 1000) / 10); 

    let display_mins = String(min).padStart(2, "0");
    let display_sec = String(sec).padStart(2, "0");
    let display_ms = String(ms).padStart(2, "0");

    timer_label.textContent = "TIMER: " + display_mins + "." + display_sec + "." + display_ms;
  }, 10);
}


/*
 * ----- addEventListeners -----
*/


// resumes focus to the last input on focusin to the page event, focus is automatically removed when changing pages or closing browser
document.addEventListener("focusin", function (event) {
  if (event.target.tagName === "INPUT") {
    last_input = event.target;
  }
});

// combined event listener for start_btn click
start_btn.addEventListener("click", () => {
  start_game(); // call start_game function
  darken_bg_var.style.display = "none"; // hide darken_bg
  choice_overlay.style.display = "none"; // hide choice_overlay

  if (current_choice.textContent == gamemode3) {
    add_lives(); // adds the lives to the game, only if the user has selected the three lives mode
  }

  if (current_choice.textContent == gamemode1) {
    add_timer(); // adds the timer to the game, only if the user has selected the best time mode
  }
});

// separate event listener for window resize
window.addEventListener("resize", () => {
  if (current_choice) {
    choice_overlay.style.display = "none"; // hide choice_overlay if current_choice is set on resize
  }
});