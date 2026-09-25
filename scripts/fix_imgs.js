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
        let modified = false;

        // If it has <img, add import Image from 'next/image';
        if (content.includes('<img ') && !content.includes('next/image')) {
            content = "import Image from 'next/image';\n" + content;
        }

        // Replace <img src={...} ... /> with <Image src={...} width={400} height={400} ... />
        // We'll use a regex that matches <img ... />
        content = content.replace(/<img\s([^>]+)>/g, (match, attrs) => {
            // Avoid adding width/height if it already has it (some might)
            let newAttrs = attrs;
            if (!newAttrs.includes('width=')) {
                newAttrs += ' width={400} height={400}';
            }
            // ensure it closes properly
            if (!newAttrs.endsWith('/')) {
                 newAttrs += ' /';
            }
            modified = true;
            return `<Image ${newAttrs}>`;
        });

        if (modified) {
            fs.writeFileSync(filePath, content);
            console.log('Fixed img in ' + filePath);
        }
    }
});
