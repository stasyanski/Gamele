/* This file contains leaderboard related
 * scripting for the game
*/

// create a darkened bg for the leaderboard, nice effect
let darken_bg = document.createElement('div');
darken_bg.style.display = 'flex';                   // display the reused darken_bg, for consitency
darken_bg.classList.add('darken_bg');

openStats = () => {
    // reference vw to properly set the container size; mobile responsive
    const mobile = 768;
    const tablet = 1024;
    const laptop = 1366;
    const desktop = 1920;
    const large = 2560;

    // get the viewport width
    let vw = window.innerWidth;

    // create the container for the leaderboard
    let container = document.createElement('div');

    // set container size based on viewport size
    if (vw < mobile) {
        container.style.width = '90%';
        container.style.height = '80%';
    } else if (vw < tablet) {
        container.style.width = '80%';
        container.style.height = '70%';
    } else if (vw < laptop) {
        container.style.width = '70%';
        container.style.height = '60%';
    } else if (vw < desktop) {
        container.style.width = '60%';
        container.style.height = '50%';
    } else if (vw < large) {
        container.style.width = '50%';
        container.style.height = '40%';
    } else {
        container.style.width = '40%';
        container.style.height = '30%';
    }

    // style the container   
    container.style.backgroundColor = '#ffffff';
    container.style.padding = '20px';
    container.style.borderRadius = '10px';
    container.style.width = '80%';
    container.style.maxWidth = '500px';
    container.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.3)';
    container.style.animation = 'fadeIn 1s';

    // create the leaderboard
    leaderboard = document.body.appendChild(darken_bg).appendChild(container);
}
