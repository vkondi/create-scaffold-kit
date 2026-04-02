const fs = require('fs');

// Restore the GitHub README and remove the temporary backup
fs.cpSync('.readme-github-backup', 'README.md');
fs.rmSync('.readme-github-backup');
