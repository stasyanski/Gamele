/* This file contains stats related
 * scripting for the game
*/

/* This file contains website settings
 *  related scripting for the game
*/


// light switch label and switch 
let lightswitch = document.querySelector('.lightswitch');
let lightinput = document.createElement('input');
let label = document.createElement('label');
lightinput.type = 'checkbox';
lightinput.role = 'switch';
lightinput.className = 'lightswitch'; //ads the light switch class to the input


// set container size based on viewport size, reference vw to properly set the container size; mobile responsive
const viewport_sizes = [
    { max: 768, width: '90%', height: '80%' },         // set the container size based on the viewport size, 768 is mobile
    { max: 1024, width: '80%', height: '70%' },        // 1024 is tablet
    { max: 1366, width: '70%', height: '60%' },        // 1366 is laptop
    { max: 1920, width: '60%', height: '50%' },        // 1920 is desktop
    { max: 2560, width: '50%', height: '40%' },        // 2560 is large
    { max: Infinity, width: '40%', height: '30%' }     // greater than 2560 
]


// create a darkened bg for the splash, nice effect
const darken_bg = document.createElement('div');
darken_bg.classList.add('darken_bg');

// function create line for the close btn
function createLine(rotation) {
    const line = document.createElement('div');
    line.classList.add('line');
    line.style.transform = `rotate(${rotation}deg)`;
    return line;
}



// function create heading for the splash
function createHeading(txt) {
    const heading = document.createElement('h1');
    heading.textContent = txt;
    heading.classList.add('splash_h1_txt');
    return heading;
}



// opens splash, either settings or stats depending on the argument
function openSplash(arg) {
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
    const splash = document.body.appendChild(darken_bg).appendChild(container); // append the container to the darken_bg

    // create the close btn
    const close_container = document.createElement('div');
    close_container.classList.add('close_container');

    // create the lines for the close btn, add event listener and add to splash
    close_container.appendChild(createLine(45));
    close_container.appendChild(createLine(-45));
    close_container.addEventListener('click', () => document.body.removeChild(darken_bg)); // event listener which closes splash by removing darken_bg
    splash.appendChild(close_container);                                    // adds the close button to the splash

    // stats or settings
    if (arg === 'stats') {
        // stats content
        const heading = createHeading('Stats')
        splash.appendChild(heading);
        
    } else if (arg === 'info') {
        // info content
        const heading = createHeading('Info')
        splash.appendChild(heading);

    } else if (arg === 'settings') {
        // settings content
        const heading = createHeading('Settings')
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
        input_switch_div.appendChild(lightinput);
    
        document.querySelector('.lightswitch').addEventListener('change', function () {
    
            if (this.checked) {
                document.getElementsByClassName('lightswitch')[0].checked = true;
    
                document.body.classList.add('light-theme'); //adds the light theme class if the switch is checked 
                localStorage.setItem('light-theme', 1); //saves the users choice 
            } else {
                document.body.classList.remove('light-theme');
                localStorage.setItem('light-theme', 0); //sets local storage to 0 when lightswitch is off
            }
        });
    
        //gets the light switch and applies the theme to it 
        lightswitch = document.querySelector('.lightswitch');
    
        if (localStorage.getItem('light-theme') == 1) {
            lightswitch.checked = true;
            document.body.classList.add('light-theme');
        } else {
            document.body.classList.remove('light-theme');
            lightswitch.checked = false;
        }
    }
}

// window resize - remove splash
window.addEventListener('resize', () => {
    if (darken_bg.firstChild) {
        document.body.removeChild(darken_bg);
        openSplash(arg);
    }
});

//applies the users choice of theme when the page is loaded
(() => {
    if (localStorage.getItem('light-theme') == 1) {
        document.body.classList.add('light-theme');
    } else {
        document.body.classList.remove('light-theme');
    }
})();
