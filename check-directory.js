const fs = require('fs');
const path = require('path');

const requiredDirs = [
  './src',
  './src/dashboard',
  './src/dashboard/public',
  './src/dashboard/views',
  './src/dashboard/routes',
  './src/dashboard/models',
  './public/css',
  './public/js',
  './public/images',
  './config',
  './data'
];

function checkAndCreateDirs() {
  for (const dir of requiredDirs) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Created directory: ${dir}`);
    }
  }
}

checkAndCreateDirs();
