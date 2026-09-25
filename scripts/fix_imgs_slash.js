const fs = require('fs');
const path = require('path');

function walkSync(currentDirPath, callback) {
    fs.readdirSync(currentDirPath).forEach(function (name) {
        var filePath = path.join(currentDirPath, name);
        var stat = fs.statSync(filePath);
        if (stat.isFile()) {
            callback(filePath, stat);
        } else if (stat.isDirectory()) {
            walkSync(filePath, callback);
        }
    });
}

walkSync('src/app', function(filePath) {
    if (filePath.endsWith('.tsx')) {
        let content = fs.readFileSync(filePath, 'utf8');
        
        if (content.includes('<Image ')) {
            // Fix double slashes: / /> -> />
            content = content.replace(/\/ \/>/g, '/>');
            // Sometimes it might be //>
            content = content.replace(/\/\/>/g, '/>');
            fs.writeFileSync(filePath, content);
        }
    }
});
