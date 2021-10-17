const fs = require('fs');
const licenseList = require('license-list');

async function exe() {
  let fileData = '';

  fileData = `export const LicenseList = \`
  <div>`;

  await new Promise((resolve) => {
    licenseList('.', { dev: false }).then((packages) => {
      for (const element in packages) {
        if (packages[element].licenseFile !== undefined) {
          fileData += `<h3>${packages[element].name}</h3>`;
          fileData += `<div>${packages[element].licenseFile.replace(/\r?\n/g, '<br>').replace(/\\/g, '\\\\').replace(/\`/g, '\\\`')}</div><br>`;
        }
      }
      resolve();
    });
  });

  fileData += '</div>`;';

  fs.writeFile('src/LicenseList.ts', fileData, (err, data) => {
    if (err) console.log(err);
    else console.log('write end');
  });
}

exe();
