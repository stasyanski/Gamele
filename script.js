fetch('images.json')
  .then(response => response.json())
  .then(data => {
    const container = document.getElementById('character-container');

    
      const img = document.createElement('img');
      setInterval(function() {
        let random = Math.floor(Math.random() * data.length);
        console.log(random)
        img.src = data[random].path;
        container.appendChild(img);
        }, 3000);
       
      
  })
  .catch(error => console.error('Error:', error));