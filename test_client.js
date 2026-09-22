const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.on('console', msg => console.log('LOG:', msg.text()));
  page.on('pageerror', err => console.log('ERROR:', err.toString()));
  await page.goto('http://localhost:3000/recipe/dish_1', { waitUntil: 'networkidle0' });
  console.log("Puppeteer done.");
  await browser.close();
  process.exit(0);
})();
