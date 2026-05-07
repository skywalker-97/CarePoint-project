const fs = require('fs');
const path = 'frontend/src/assets/assets_frontend/assets.js';
let code = fs.readFileSync(path, 'utf8');
code = code.replace(/fees:\s*(\d+),/g, (match, p1) => `fees: ${parseInt(p1) < 100 ? parseInt(p1) * 10 : p1},`);
fs.writeFileSync(path, code);
console.log('assets updated');
