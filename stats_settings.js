/* This file contains stats related
 * scripting for the game
*/

/* This file contains website settings
 *  related scripting for the game
*/

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
        const heading = createHeading('Stats')
        splash.appendChild(heading);
    } else if (arg === 'settings') {
        const heading = createHeading('Settings')
        splash.appendChild(heading);
        // settings content
        // dark_theme = document.createElement('div');
        //creating the dark theme switch
        let input = document.createElement('input');
        let label = document.createElement('label');
        label.classList.add('label');
        label.textContent = 'Dark Theme:';
        input.type = 'checkbox';
        input.role = 'switch';
        input.className = 'dark_theme';
        splash.appendChild(label);
        splash.appendChild(input);




    }

}

// window resize - remove splash
window.addEventListener('resize', () => {
    if (darken_bg.firstChild) {
        document.body.removeChild(darken_bg);
        openSplash(arg);
    }
});