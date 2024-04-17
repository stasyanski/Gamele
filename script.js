const fs = require('fs');
const path = require('path');

const folderPath = 'characters';

fs.readdir(folderPath, (err, files) => {
    if (err) {
        console.error('Error reading directory:', err);
        return;
    }

    const data = files.map(file => ({
        name: file,
        path: path.join(folderPath, file)
    }));

    fs.writeFile('images.json', JSON.stringify(data, null, 2), (err) => {
        if (err) {
            console.error('Error writing file:', err);
        }
    });
});

