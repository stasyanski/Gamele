/* This file contains leaderboard related
 * scripting for the game
*/

/* This file contains website settings
 *  related scripting for the game
*/

// create a darkened bg for the leaderboard, nice effect
let darken_bg = document.createElement('div');
darken_bg.style.display = 'flex';                   // display the reused darken_bg, for consitency
darken_bg.classList.add('darken_bg');

function openSplash(arg) {

    // reference vw to properly set the container size; mobile responsive
    const mobile = 768;
    const tablet = 1024;
    const laptop = 1366;
    const desktop = 1920;
    const large = 2560;

    // get the viewport width
    let vw = window.innerWidth;                             // get the viewport width

    // create the container for the leaderboard
    let container = document.createElement('div');

    // set container size based on viewport size
    const viewportSizes = [
        {max: mobile, width: '90%', height: '80%'},         // set the container size based on the viewport size
        {max: tablet, width: '80%', height: '70%'},
        {max: laptop, width: '70%', height: '60%'},
        {max: desktop, width: '60%', height: '50%'},
        {max: large, width: '50%', height: '40%'},
        {max: Infinity, width: '40%', height: '30%'}
    ];
    
    for (let size of viewportSizes) {
        if (vw < size.max) {
            container.style.width = size.width;             // set the container size based on the viewport size
            container.style.height = size.height;
            break;
        }
    }

    // style the container   
    container.classList.add('splash_content');              // add the splash_content class to the container

    // create the leaderboard
    leaderboard = document.body.appendChild(darken_bg).appendChild(container); // append the container to the darken_bg

    // stats or settings
    if (arg === 'stats') {
        // code 
    } else if (arg === 'settings') {
        // code 
    }
}
