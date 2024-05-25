/* the fetch.js file is used to fetch the images.json
 * file which contains all filename and paths of the images
*/

fetch('images.json')
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));