const fs = require('fs');
const path = require('path');

function updateDocumentation() {
    const docsPath = path.join(__dirname, 'docs');
    const newDocs = {
        'advancedMetrics.md': 'Documentation for advanced metrics...',
        'alertSystem.md': 'Documentation for alert system...',
        'automatedBackup.md': 'Documentation for automated backup...',
        'permissionSystem.md': 'Documentation for permission system...',
        'localization.md': 'Documentation for localization...'
    };

    for (const [fileName, content] of Object.entries(newDocs)) {
        fs.writeFileSync(path.join(docsPath, fileName), content);
    }

    console.log('Documentation updated successfully.');
}

module.exports = { updateDocumentation };
