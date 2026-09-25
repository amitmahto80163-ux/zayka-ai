const fs = require('fs');
let css = fs.readFileSync('src/app/globals.css', 'utf-8');

// Replace Nunito with Playfair in section-title
css = css.replace(
  /\.section-title\s*{\s*font-family:\s*['"]Nunito['"],\s*sans-serif;/g,
  `.section-title {\n  font-family: var(--font-playfair), serif;`
);

// We can also add a utility class for playfair
if (!css.includes('.font-display')) {
  css += `\n\n/* --- Display Font Utility --- */\n.font-display {\n  font-family: var(--font-playfair), serif;\n}\n`;
}

fs.writeFileSync('src/app/globals.css', css);
console.log('globals.css updated with Playfair');
