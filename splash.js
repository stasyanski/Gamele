/* This file contains splash related
 * scripting for the game
*/


/* 
 * ----- GLOBAL VARS AND CONSTANTS -----
*/


// DOM elements light switch label and switch 
let light_switch = document.querySelector('.lightswitch');
let light_input = document.createElement('input');
let global_arg = null; // for reopening the splash with the same content
let splash;

// the light switch input
light_input.type = 'checkbox';
light_input.role = 'switch';
light_input.className = 'lightswitch'; //ads the light switch class to the input

// set container size based on viewport size, reference vw to properly set the container size; mobile responsive
const viewport_sizes = [
    { max: 768, width: '90%', height: 'auto' },         // set the container size based on the viewport size, 768 is mobile
    { max: 1024, width: '80%', height: 'auto' },        // 1024 is tablet
    { max: 1366, width: '70%', height: 'auto' },        // 1366 is laptop
    { max: 1920, width: '60%', height: 'auto' },        // 1920 is desktop
    { max: 2560, width: '50%', height: 'auto' },        // 2560 is large
    { max: Infinity, width: '40%', height: 'auto' }     // greater than 2560 
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
    const game_modes = [
        { key: gamemode1, label: 'Best time - 120 seconds' },
        { key: gamemode2, label: "Infinite - guess until you're tired" },
        { key: gamemode3, label: 'Three lives - three wrong guesses' }
    ];

    // loop through the game modes and display the stats
    game_modes.forEach(mode => {
        if (localStorage.getItem(mode.key)) {
            const stats_settings_div = document.createElement('div');
            stats_settings_div.classList.add('stats_settings_div');

            const left_label_div = document.createElement('div');
            left_label_div.classList.add('left_label_div');

            const left_label = document.createElement('label');
            left_label.classList.add('left_label');
            left_label.textContent = mode.label;

            const input_switch_div = document.createElement('div');
            input_switch_div.classList.add('left_label');
            input_switch_div.textContent = localStorage.getItem(mode.key);

            stats_settings_div.appendChild(left_label_div);
            stats_settings_div.appendChild(input_switch_div);
            left_label_div.appendChild(left_label);

            splash.appendChild(stats_settings_div);
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
    viewport_sizes.forEach(size => {
        if (vw < size.max) {
            Object.assign(container.style, {
                width: size.width,
                height: size.height
            });
            return;
        }
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
        div.className = 'stats_settings_div';
        const label = document.createElement('label');
        label.className = 'left_label';
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

// add settings content to the splash
function add_settings_content(splash) {
    splash.appendChild(create_heading('Settings'));
    const settings_div = document.createElement('div');
    settings_div.className = 'stats_settings_div';
    splash.appendChild(settings_div);

    const label_div = document.createElement('div');
    label_div.className = 'left_label_div';
    settings_div.appendChild(label_div);

    const input_switch_div = document.createElement('div');
    input_switch_div.className = 'input_switch_div';
    settings_div.appendChild(input_switch_div);

    const label = document.createElement('label');
    label.className = 'left_label';
    label.textContent = 'Light Theme';
    label_div.appendChild(label);
    input_switch_div.appendChild(light_input);

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
