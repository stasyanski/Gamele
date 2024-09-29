/* This file contains splash related
 * scripting for the game
*/


/* 
 * ----- GLOBAL VARS AND CONSTANTS -----
*/


// DOM elements light switch label and switch 
let input_switch_div;
let light_switch    = document.querySelector('.lightswitch');
let light_input     = document.createElement('input');
let game_modes;
let global_arg      = null; // for reopening the splash with the same content
let splash;

// the light switch input
light_input.type = 'checkbox';
light_input.role = 'switch';
light_input.className = 'lightswitch'; //ads the light switch class to the input

// set container size based on viewport size, reference vw to properly set the container size; mobile responsive
const viewport_sizes = [
    { max: 768, width: '80%', height: 'auto' },         // set the container size based on the viewport size, 768 is mobile
    { max: 1024, width: '60%', height: 'auto' },        // 1024 is tablet
    { max: 1366, width: '40%', height: 'auto' },        // 1366 is laptop
    { max: 1920, width: '25%', height: 'auto' },        // 1920 is desktop
    { max: 2560, width: '22%', height: 'auto' },        // 2560 is large
    { max: Infinity, width: '20%', height: 'auto' }     // greater than 2560 
]


/* 
 * ----- SPLASH RELATED FUNCTIONS -----
*/


// create a darkened bg for the splash, nice effect
const darken_bg = document.createElement('div');
darken_bg.classList.add('darken_bg');

// function create line for the close btn
function create_line(rotation) {
    const line = document.createElement('div');
    line.classList.add('line');
    line.style.transform = `rotate(${rotation}deg)`;
    return line;
}

// function create heading for the splash
function create_heading(txt) {
    const heading = document.createElement('h1');
    heading.textContent = txt;
    heading.classList.add('splash_h1_txt');
    return heading;
}

function create_label(txt) {
    const label = document.createElement('label');
    label.textContent = txt;
    label.classList.add('splash_label_txt');
    return label;
}

function display_guesses() {
    game_modes = [
        { key: gamemode1, label: 'Best time - 120 seconds' },
        { key: gamemode2, label: "Infinite - 3 skips" },
        { key: gamemode3, label: 'Three lives - 3 wrong guesses' }
    ];

    // loop through the game modes and display the stats
    game_modes.forEach(mode => {
        if (localStorage.getItem(mode.key)) {
            const splash_div = document.createElement('div');
            splash_div.classList.add('splash_div');

            const splash_label_container = document.createElement('div');
            splash_label_container.classList.add('splash_label_container');

            const splash_label = document.createElement('label');
            splash_label.classList.add('splash_label');
            splash_label.textContent = mode.label;

            input_switch_div = document.createElement('div');
            input_switch_div.classList.add('splash_label');
            input_switch_div.textContent = localStorage.getItem(mode.key);

            splash_div.appendChild(splash_label_container);
            splash_div.appendChild(input_switch_div);
            splash_label_container.appendChild(splash_label);

            splash.appendChild(splash_div);
        }
    });
}

// opens splash, either settings or stats depending on the argument
function open_splash(arg) {
    // set the global arg to the argument passed
    global_arg = arg;

    // get the viewport width
    const vw = window.innerWidth;

    // create the container for the splash / style the container
    let container = document.createElement('div');
    container.className = 'splash_content';

    // set the container size based on the viewport size, useful for mobile responsiveness
    viewport_sizes.some(size => {
        if (vw < size.max) {
            Object.assign(container.style, {
                width: size.width,
                height: size.height
            });
            return true; // stop iterating
        }
        return false;
    });

    // create the splash and remove the previous splash, allowing only one splash at a time, for reusal
    if (darken_bg.firstChild) {
        darken_bg.removeChild(darken_bg.firstChild);
    }
    splash = document.body.appendChild(darken_bg).appendChild(container); // append the container to the darken_bg

    // create the close btn and add to splash
    const close_btn = create_close_button();
    splash.appendChild(close_btn);

    // add content to the splash based on the argument
    switch (arg) {
        case 'stats':
            add_stats_content(splash);
            break;
        case 'info':
            add_info_content(splash);
            break;
        case 'best_time':
            add_best_time_content(splash, score_num);
            break;
        case 'settings':
            add_settings_content(splash);
            break;
        case 'gameover':
            add_game_over_content(splash);
            break;
    }

    // on resize remove splash, keep it in this function, causes Uncaught DOMException: Node.removeChild: Uncaught ReferenceError
    window.addEventListener('resize', () => {
        if (darken_bg.firstChild && document.body.contains(darken_bg)) {
            document.body.removeChild(darken_bg);
            setTimeout(() => open_splash(global_arg), 100);
        }
    });
}

// used to created the little X button to close the splash
function create_close_button() {
    let close_container = document.createElement('div');
    close_container.className = 'close_container';
    close_container.appendChild(create_line(45));
    close_container.appendChild(create_line(-45));
    close_container.addEventListener('click', () => document.body.removeChild(darken_bg));
    return close_container;
}

// used to create the heading for the splash
function add_stats_content(splash) {
    splash.appendChild(create_heading('Stats'));
    display_guesses();
}

// add info content to the splash
function add_info_content(splash) {
    splash.appendChild(create_heading('Info'));
    const disclaimers = [
        'This project is strictly for educational purposes only, no commercial use is intended, not for profit. Any of the images used are NOT owned by us. This project is open source and can be found on GitHub.',
        'This project is covered by the MIT License.',
        'Repository link: https://github.com/stasyanski/Gamele',
        'Developed with ♡ by stasyanski and kambains226'
    ];
    disclaimers.forEach(disclaimer => {
        const div = document.createElement('div');
        div.className = 'splash_div';
        const label = document.createElement('label');
        label.className = 'splash_label';
        label.textContent = disclaimer;
        div.appendChild(label);
        splash.appendChild(div);
    });
}

// add best time content to the splash
function add_best_time_content(splash, score) {
    const label = create_label(`Your Score: ${score}`);
    splash.appendChild(label);
}

// refactored code for adding settings content to the splash using snake case
function add_settings_content(splash) {
    // helper function to create a div with a specified class name
    function create_div_with_class(class_name) {
        const div = document.createElement('div');
        div.className = class_name;
        return div;
    }

    // helper function to create a label with specified text
    function create_label(text) {
        const label = document.createElement('label');
        label.className = 'splash_label';
        label.textContent = text;
        return label;
    }

    // append 'Settings' heading
    splash.appendChild(create_heading('Settings'));

    // create and append the first settings section
    const settings_div_1 = create_div_with_class('splash_div');
    splash.appendChild(settings_div_1);

    const label_div_1 = create_div_with_class('splash_label_container');
    settings_div_1.appendChild(label_div_1);

    const input_switch_div = create_div_with_class('input_switch_div');
    settings_div_1.appendChild(input_switch_div);

    const light_theme_label = create_label('Light Theme');
    label_div_1.appendChild(light_theme_label);
    // assuming light_input is defined elsewhere
    input_switch_div.appendChild(light_input);

    // create and append the second settings section
    const settings_div_2 = create_div_with_class('splash_div');
    splash.appendChild(settings_div_2);

    const label_div_2 = create_div_with_class('splash_label_container');
    settings_div_2.appendChild(label_div_2);

    const clear_stats_label = create_label('Clear Stats');
    label_div_2.appendChild(clear_stats_label);

    const clear_stats_button = create_div_with_class('clear_stats_div');
    settings_div_2.appendChild(clear_stats_button);

    // setup the clear stats button
    setup_clear_stats_bttn();

    // setup the light switch in the splash
    setup_light_switch();
}

// add game over content to the splash
function add_game_over_content(splash) {
    splash.appendChild(create_heading('Game over!'));
    restart_game(splash);
}

// setup the light switch in the splash
function setup_light_switch() {
    const light_switch = document.querySelector('.lightswitch');
    light_switch.addEventListener('change', function () {
        document.body.classList.toggle('light_theme', this.checked);
        localStorage.setItem('light_theme', this.checked ? 1 : 0);
    });

    if (localStorage.getItem('light_theme') == 1) {
        light_switch.checked = true;
        document.body.classList.add('light_theme');
    } else {
        light_switch.checked = false;
        document.body.classList.remove('light_theme');
    }
}

// setup the clear stats button 
function setup_clear_stats_bttn() {
    const clear_stats_button = document.querySelector('.clear_stats_div');
    clear_stats_button.addEventListener('click', () => {
        if (game_modes !== undefined) {
            game_modes.forEach(mode => {
                localStorage.setItem(mode.key, 0);
            }); 
        }
    });
}


// called by else if arg gameover 
function restart_game(splash) {
    const restart_button = document.createElement('button');
    restart_button.textContent = 'TRY AGAIN';
    restart_button.className = 'start restart'; // combining class addition into one line

    splash.appendChild(restart_button);

    restart_button.addEventListener('click', () => {
        document.body.removeChild(darken_bg); // directly selecting darken_bg to remove
        window.location.reload(); // Using window.location.reload for clarity
    });
}


/* 
 * ----- THEME RELATED FUNCTIONS -----
*/


// applies the users choice of theme when the page is loaded
(() => {
    if (localStorage.getItem('light_theme') == 1) {
        document.body.classList.add('light_theme');
    } else {
        document.body.classList.remove('light_theme');
    }
})();
