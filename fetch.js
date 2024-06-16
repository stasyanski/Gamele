/* Fetching images
 * from a directory (characters)
*/

const { readdir, writeFile } = require('fs');
const { join } = require('path');
const folder_path = 'characters';

const read_subdirectory = (subdir, callback) => {
  readdir(join(folder_path, subdir), { withFileTypes: true }, (err, entries) => {
    if (err) return callback(err);

    const files = entries.filter(entry => !entry.isDirectory()).map(file => ({
      name: file.name,
      path: join(folder_path, subdir, file.name)
    }));

    callback(null, files);
  });
};

(() => {
  readdir(folder_path, { withFileTypes: true }, (err, entries) => {
    if (err) return console.error('error reading directory:', err);

    const directories = entries.filter(entry => entry.isDirectory()).map(dir => dir.name);
    let all_data = [];
    let directories_processed = 0;

    directories.forEach(subdir => {
      read_subdirectory(subdir, (err, data) => {
        if (err) {
          console.error(`error reading subdirectory: ${subdir}`, err);
        } else {
          all_data = all_data.concat(data);
        }

        directories_processed++;
        if (directories_processed === directories.length) {
          writeFile('images.json', JSON.stringify(all_data, null, 2), err => {
            if (err) console.error('error writing file:', err);
          });
        }
      });
    });
  });
})();