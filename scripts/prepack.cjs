const fs = require('fs');

// Back up the GitHub README and replace it with the npm-specific README for publishing
fs.cpSync('README.md', '.readme-github-backup');
fs.cpSync('npm-readme.md', 'README.md');
