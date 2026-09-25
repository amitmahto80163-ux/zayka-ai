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
            // Replace ` / width=` with ` width=`
            content = content.replace(/\s*\/\s*width=\{400\}/g, ' width={400}');
            
            // Just in case it created something like `/> />`
            content = content.replace(/\/>\s*\/>/g, '/>');

            fs.writeFileSync(filePath, content);
        }
    }
});
