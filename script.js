
function characters(){
fetch('images.json')
  .then(response => response.json())
  .then(data => {
    
    const container = document.getElementById('character-container');
    const img = document.createElement('img');
    const input = document.createElement('input');
    
      
    let random = Math.floor(Math.random() * data.length);
  
    img.src = data[random].path;
    container.appendChild(img);
    let source = data[random].name;
    let [name,type] = source.split('.');

    let nameSpaces = name.replace(/_/g, ' ');
    console.log(nameSpaces);
    
    input.placeholder = 'guess the character';
    container.appendChild(input);
    
      
     
  })
  .catch(error => console.error('Error:', error));
}
  function startGame() {

    console.log('Starting game');

    let startButton = document.querySelector('.start');
    startButton.style.display = 'none';
    characters();

  }

  