const fs = require('fs');
const path = require('path');

// ...existing code...

const updateDocumentation = (filePath, content) => {
  const fullPath = path.join(__dirname, filePath);
  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(`Documentation updated: ${filePath}`);
};

// ...existing code...

module.exports = { updateDocumentation };
