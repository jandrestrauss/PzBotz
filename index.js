const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname);
const outputFilePath = path.join(__dirname, 'INDEX.md');

function scanDirectory(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            fileList = scanDirectory(filePath, fileList);
        } else {
            fileList.push(filePath.replace(directoryPath, '').replace(/\\/g, '/'));
        }
    });
    return fileList;
}

function generateIndex(fileList) {
    let indexContent = '# Project Directory Index\n\n';
    fileList.forEach(file => {
        indexContent += `- [${file}](.${file})\n`;
    });
    return indexContent;
}

const fileList = scanDirectory(directoryPath);
const indexContent = generateIndex(fileList);

fs.writeFileSync(outputFilePath, indexContent, 'utf8');
console.log('Index generated successfully.');
