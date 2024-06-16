/* This file contains stats related
 * scripting for the game
*/

/* This file contains website settings
 *  related scripting for the game
*/


/* 
 * ----- GLOBAL VARS AND CONSTANTS -----
*/


// light switch label and switch 
let light_switch = document.querySelector('.lightswitch');
let light_input = document.createElement('input');
let label = document.createElement('label');
light_input.type = 'checkbox';
light_input.role = 'switch';
light_input.className = 'lightswitch'; //ads the light switch class to the input
let splash;
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
    console.log('display_guesses() called');
    const game_modes = [
        { key: gamemode1, label: 'Best time - 120 seconds' },
        { key: gamemode2, label: "Infinite - guess until you're tired" },
        { key: gamemode3, label: 'Three lives - three wrong guesses' }
    ];

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
//when the game is over a restart button will be displayed 

// opens splash, either settings or stats depending on the argument
function open_splash(arg) {
    // get the viewport width
    const vw = window.innerWidth;                             // get the viewport width

    // create the container for the splash / style the container   
    let container = document.createElement('div');
    container.classList.add('splash_content');

    // set the container size based on the viewport size, useful for mobile responsiveness
    for (const size of viewport_sizes) {
        if (vw < size.max) {
            container.style.width = size.width;             // set the container size based on the viewport size
            container.style.height = size.height;
            break;
        }
    }

    // create the splash
    if (darken_bg.firstChild) {
        darken_bg.removeChild(darken_bg.firstChild);       // remove the previous splash, allowing only one splas at a time, for reusal
    }
    splash = document.body.appendChild(darken_bg).appendChild(container); // append the container to the darken_bg

    // create the close btn
    const close_container = document.createElement('div');
    close_container.classList.add('close_container');

    // create the lines for the close btn, add event listener and add to splash
    close_container.appendChild(create_line(45));
    close_container.appendChild(create_line(-45));
    close_container.addEventListener('click', () => document.body.removeChild(darken_bg)); // event listener which closes splash by removing darken_bg
    splash.appendChild(close_container);                                    // adds the close button to the splash

    // stats or settings
    if (arg === 'stats') {
        // stats content
        const heading = create_heading('Stats')
        splash.appendChild(heading);
        //creates the labeles and prints the guesses for each of the modes 
        display_guesses();

    } else if (arg === 'info') {
        // info content
        const heading = create_heading('Info');
        splash.appendChild(heading);
    
        // info disclaimers
        const disclaimers = [
            'This project is strictly for educational purposes only, no commercial use is intended, not for profit. Any of the images used are NOT owned by us. This project is open source and can be found on GitHub.',
            'This project is covered by the MIT License.',
            'Repository link: https://github.com/stasyanski/Gamele',
            'Developed with ♡ by stasyanski and kambains226'
        ];
    
        disclaimers.forEach(disclaimer => {
            const stats_settings_div = document.createElement('div');
            stats_settings_div.classList.add('stats_settings_div');
    
            const left_label_div = document.createElement('div');
            left_label_div.classList.add('left_label_div');
    
            const left_label = document.createElement('label');
            left_label.classList.add('left_label');
            left_label.textContent = disclaimer;
    
            stats_settings_div.appendChild(left_label_div);
            left_label_div.appendChild(left_label);
    
            splash.appendChild(stats_settings_div);
        });

    } else if (arg === 'bestTime') {
        label_txt = 'Your Score:' +  score_num ;
        const label = create_label(label_txt);
        splash.appendChild(label);
    
    } else if (arg === 'settings') {
        // settings content
        const heading = create_heading('Settings')
        splash.appendChild(heading);

        // create the div that stores and organises all settings
        const settings_div = document.createElement('div');
        settings_div.classList.add('stats_settings_div');
        splash.appendChild(settings_div);

        // create the div for the label
        const left_label_div = document.createElement('div');
        left_label_div.classList.add('left_label_div');
        settings_div.appendChild(left_label_div);

        // create the div for the input
        const input_switch_div = document.createElement('div');
        input_switch_div.classList.add('input_switch_div');
        settings_div.appendChild(input_switch_div);

        //creating the light theme switch
        const label = document.createElement('label');
        label.classList.add('left_label');
        label.textContent = 'Light Theme';

        left_label_div.appendChild(label);
        input_switch_div.appendChild(light_input);

        document.querySelector('.lightswitch').addEventListener('change', function () {
            if (this.checked) {
                //changes the colour of the heart depending on the theme 
                // lives_colour('black');
                document.getElementsByClassName('lightswitch')[0].checked = true;
            
                document.body.classList.add('light_theme'); //adds the light theme class if the switch is checked 
                localStorage.setItem('light_theme', 1); //saves the users choice 
            } else {
                document.body.classList.remove('light_theme');
                localStorage.setItem('light_theme', 0); //sets local storage to 0 when light_switch is off
                // lives_colour('white');
            }
        });

        //gets the light switch and applies the theme to it 
        light_switch = document.querySelector('.lightswitch');

        if (localStorage.getItem('light_theme') == 1) {
            light_switch.checked = true;
            document.body.classList.add('light_theme');
        } else {
            document.body.classList.remove('light_theme');
            light_switch.checked = false;
        }
    }
    else if (arg==='gameover') {
        const heading = create_heading('Game over!');
        splash.appendChild(heading);
        restart_game(splash);
    }

    // window resize - remove splash - keep it in this function - causes Uncaught DOMException: Node.removeChild: Uncaught ReferenceError:
    // a timeout is used so that too many calls on every resize event are avoided - causes crashes
    window.addEventListener('resize', () => {
        if (darken_bg.firstChild && document.body.contains(darken_bg)) {
            document.body.removeChild(darken_bg);
            setTimeout(() => open_splash(arg), 100);
        }
    });
}


/* 
 * ----- THEME RELATED FUNCTIONS -----
*/


//applies the users choice of theme when the page is loaded
(() => {
    if (localStorage.getItem('light_theme') == 1) {
        document.body.classList.add('light_theme');
    } else {
        document.body.classList.remove('light_theme');
    }
})();
