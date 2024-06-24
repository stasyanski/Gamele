/* This file contains general
 * scripting for the game
 */

/*
 * ----- GLOBAL VARS (to be cleaned up) -----
 */

// DOM elements
const img                                 = document.createElement("img");
const score                               = document.querySelector(".score");
const choices                             = document.querySelectorAll(".choice");
const container                           = document.querySelector(".character_container");
const start_btn                           = document.querySelector(".start");
const timer_div                           = document.querySelector(".timer");
const left_arrow                          = document.querySelector(".left_arrow");
const extra_lives                         = document.querySelector(".lives");
const right_arrow                         = document.querySelector(".right_arrow");
const enter_button                        = document.querySelector(".enter_bttn");
const darken_bg_var                       = document.querySelector(".darken_bg");
const input_container                     = document.querySelector(".input_container");
const ui_elements_container               = document.querySelector(".ui_elements_container");

// game state variables
let guess                 = 0; // keeps track of the user gusses
let score_num             = 0;
let last_input            = null;
let user_input            = null;
let formatted_name;
let choice_overlay;
let current_choice        = "Infinite"; // current game mode
let answer_enabled        = true; // enables or disables the ability to input a guess

// game mode variables
const gamemode1 = "Best time";
const gamemode2 = "Infinite";
const gamemode3 = "Three lives";

/*
 * ----- INPUT HANDLING, GUESSING, CHECKING ANSWER ETC RELATED FUNCTIONS -----
*/

function input_guess(name) { // name is the exact name of the image, for example " michael_de_santa " but without the extension
  // reset the container after each guess so there wont be div duplicates
  input_container.innerHTML = "";

  // creates a input box, multiple boxes, with a max length of 1, and a size of 1, creates cool effect of the user typing in the boxes
  name.split("").forEach((char, index) => {
    console.log(char, index);
    let element;
    if (char === "_") {
      element = document.createElement("div");
      element.classList.add("input_one_char_spacing");
    } else {
      element = document.createElement("input");
      element.setAttribute("maxlength", "1");
      element.classList.add("input_one_char");
      element.addEventListener("input", (event) => handle_event(event, element, index));
      element.addEventListener("keydown", (event) => handle_event(event, element, index));
    }
    input_container.appendChild(element);
  });
  // focus on the first input box saving the user a few clicks
  if (input_container.firstChild) {
    input_container.firstChild.focus();
  }
}

// gets the user input, joins the inputs from the array of inputs into a string
function get_user_input() {
  return Array.from(input_container.querySelectorAll("input"))
    .map(input => input.value.toUpperCase()).join("");
}

function handle_event(event, element, index) {
  switch (event.type) {
    case "input":
      handle_input_event(element, index);
      break;
    case "keydown":
      handle_keydown_event(event, index);
      break;
  }

  function handle_input_event(element, index) {
    element.value = element.value.toUpperCase(); // convert input to uppercase
    focus_next_input(index);
    console.log("input event")
  }
  
  function handle_keydown_event(event, index) {
    switch (event.key) {
      case "Enter":
        if (answer_enabled) {
          user_input = get_user_input();
          check_answer();
        }
        break;
      case "Delete":
      case "Backspace":
        event.preventDefault(); // prevent default behavior, was causing issues with backspace, unwanted behaviour
        handle_backspace(index);
        break;
      case "ArrowLeft":
        focus_previous_input(index);
        break;
      case "ArrowRight":
        focus_next_input(index);
        break;
    }
    // this if stamenet is used to check if the input is not empty, if it is not empty, it will focus on the next input, fixes the backspace issue
    if (document.querySelectorAll("input")[index].value !== "") {
      focus_next_input(index);
    }
  }
}

function focus_input(index, direction) {
  const increment = direction === "next" ? 1 : -1;
  let input_index = index + increment;
  let target_index = -1; // initialize target_index to -1 indicating no valid target found yet

  // find the next or previous input that can be focused
  while (input_index >= 0 && input_index < input_container.children.length) {
    const child = input_container.children[input_index];
    if (child.tagName === "INPUT" && (!child.disabled || direction === "back")) {
      target_index = input_index; // update target_index with the valid input index
      break; // exit the loop once a valid target is found
    } else if (child.tagName !== "INPUT") {
      // if not an input, try focusing based on color
      if (focus_on_color(input_index, ["red", "orange"])) {
        target_index = input_index; // update target_index with the valid input index
        break; // exit the loop once a valid target is found
      }
    }
    input_index += increment;
  }
    // if a valid target index is found, focus on the target input and move the cursor to the end
  if (target_index !== -1) {
    const target_input = input_container.children[target_index]; // correctly define target_input
    target_input.focus();
    setTimeout(() => {
      const length = target_input.value.length;
      target_input.setSelectionRange(length, length);
    }, 10);
  }

  // if the input is at the start, focus on the last input
  function focus_on_color(start_index, colors) {
    const child = input_container.children[start_index];
    if (child && colors.includes(child.style.backgroundColor)) {
      child.focus();
      return true;
    }
    return false;
  }
}

// these 2 functions are being used to focus on the next or previous input box, skipping over divs
function focus_next_input(index) {
  focus_input(index, "next");
}

function focus_previous_input(index) {
  focus_input(index, "previous");
}


function handle_backspace(index) {
  // if it's the last child, only delete the current value and don't switch focus
  if (input_container.children[index].value !== "") {
    input_container.children[index].value = "";
  } else {
    focus_previous_input(index);
  }
}

function input_movement(direction) {
  // check if there was a last input focused
  if (!last_input) return;
  // get all input elements as an array
  const inputs = Array.from(input_container.querySelectorAll("input"));
  // find the index of the last input focused
  const current_index = inputs.indexOf(last_input);

  let target_index = current_index;
  // determine the direction of movement and find the target index accordingly
  if (direction === "left") {
    target_index = find_target_index(inputs, current_index - 1, -1);
  } else if (direction === "right") {
    target_index = find_target_index(inputs, current_index + 1, 1);
  }

  // if a valid target index is found, focus on the target input and move the cursor to the end
  if (target_index !== -1) {
    inputs[target_index].focus();
    setTimeout(() => {
      const length = inputs[target_index].value.length;
      inputs[target_index].setSelectionRange(length, length);
    }, 10);
  }

  // helper function to find the target index based on direction and step
  function find_target_index(inputs, start_index, step) {
    for (let i = start_index; i >= 0 && i < inputs.length; i += step) {
      // check if the input is not disabled and its background color is acceptable
      if (!inputs[i].disabled && ["", "red", "orange"].includes(inputs[i].style.backgroundColor)) {
        return i;
      }
    }
    return -1; // indicates no valid target was found
  }
}


/*
 * ----- CHECKING ANSWER RELATED FUNCS -----
*/



// if the user has never made a guess automatically assign it to 0
[gamemode1, gamemode2, gamemode3].forEach(function (mode) {
  if (localStorage.getItem(mode) == null) {
    localStorage.setItem(mode, "0");
  }
});

function check_answer() {
  if (!user_input) return; // exit the function early if user_input is null

  // only increments the guess for that specific gamemode
  switch (current_choice.textContent) {
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

function handle_wrong_answer() {
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
  Array.from(input_container.querySelectorAll("input")).forEach((child, index) => {
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
  for (const child of Array.from(input_container.querySelectorAll("input"))) {
    if (child.tagName === "INPUT" && ["red", "orange"].includes(child.style.backgroundColor)) {
      child.focus();
      break; // stops at the first input with red or orange background
    }
  }
}

function handle_correct_answer() {
  // loop through the input container children and check if the user input is correct
  Array.from(input_container.querySelectorAll("input")).forEach((child, index) => {
    
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
    extra_lives.appendChild(life);
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

// addevent listener for gui elements
left_arrow.addEventListener("click", () => input_movement("left"));
right_arrow.addEventListener("click", () => input_movement("right"));
enter_button.addEventListener("click", check_answer);