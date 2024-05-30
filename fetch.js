/* Fetching images
 * from a directory (characters)
*/

import { readdir, writeFile } from 'fs';
import { join } from 'path';

const folder_path = 'characters';

readdir(folder_path, (err, files) => {
    if (err) {
        console.error('error reading directory:', err);
        return;
    }

    const data = files.map(file => ({
        name: file,
        path: join(folder_path, file)
    }));

    writeFile('images.json', JSON.stringify(data, null, 2), (err) => {
        if (err) {
            console.error('error writing file:', err);
        }
    });
});