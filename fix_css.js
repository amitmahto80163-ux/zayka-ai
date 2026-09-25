const fs = require('fs');
let css = fs.readFileSync('src/app/globals.css', 'utf-8');

const oldCard = `.card {
  background: var(--bg-card);
  border: 1px solid var(--border-soft);
  border-radius: 24px;
  box-shadow: var(--shadow-card);
  transition: box-shadow 0.3s ease, transform 0.2s ease;
}`;

const newCard = `.card {
  background: var(--bg-card);
  border: 1px solid var(--border-soft);
  border-radius: 16px;
  box-shadow: 0 1px 4px rgba(60, 40, 20, 0.04);
  transition: box-shadow 0.3s ease, border-color 0.3s ease;
}`;

const oldHover = `.card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}`;

const newHover = `.card:hover {
  box-shadow: 0 2px 8px rgba(60, 40, 20, 0.06);
  border-color: #E2D3C4;
}

/* Primary/Hero Cards */
.card-primary {
  border-radius: 24px;
  box-shadow: var(--shadow-md);
  border: 1px solid var(--border-soft);
}`;

css = css.replace(oldCard, newCard);
css = css.replace(oldHover, newHover);
fs.writeFileSync('src/app/globals.css', css);
console.log('Done!');
