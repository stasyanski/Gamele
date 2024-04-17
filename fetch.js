// fetch('images.json')
//     .then(response => response.json())
//     .then(data => {
//         data.forEach(image => {
//             let imgTag = `<img src="${image.path}" alt="${image.name}" />`;
//             document.body.innerHTML += imgTag;
//         });
//     })
//     .catch(error => console.error('Error:', error));


fetch('images.json')
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));