const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'data', 'dishes.ts');
let fileContent = fs.readFileSync(filePath, 'utf-8');

// Strip out the previous dynamic Pollinations injection at the bottom if it exists
fileContent = fileContent.replace(/\/\/ Dynamically generate accurate dish images[\s\S]*\}\);/, '');

let dataStr = fileContent.substring(fileContent.indexOf('['), fileContent.lastIndexOf(']') + 1);
let dishes;
eval('dishes = ' + dataStr);

async function searchImage(query) {
  try {
    const res = await fetch('https://unsplash.com/napi/search/photos?query=' + encodeURIComponent(query) + '&per_page=1');
    if (!res.ok) return null;
    const data = await res.json();
    let url = data.results[0]?.urls?.regular;
    if (url) {
      return url.split('&ixid=')[0] + '&q=80&w=800&h=800&fit=crop';
    }
  } catch(e) {}
  return null;
}

const fallbacks = {
  indian: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=800&h=800&fit=crop',
  chinese: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=800&h=800&fit=crop',
  italian: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?q=80&w=800&h=800&fit=crop'
};

async function run() {
  console.log('Fetching exact images for ' + dishes.length + ' dishes...');
  
  for (let i = 0; i < dishes.length; i += 10) {
    console.log('Processing ' + i + ' to ' + (i+9) + '...');
    const batch = dishes.slice(i, i + 10);
    await Promise.all(batch.map(async (dish) => {
      let url = await searchImage(dish.name + ' indian food');
      if (!url) url = await searchImage(dish.name);
      if (url) {
         dish.image = url;
      } else {
         dish.image = fallbacks[dish.cuisine] || fallbacks.indian;
      }
    }));
  }
  
  const updatedContent = fileContent.substring(0, fileContent.indexOf('export const ALL_DISHES = ')) +
                         'export const ALL_DISHES = ' + JSON.stringify(dishes, null, 2) + ';\n';
                         
  fs.writeFileSync(filePath, updatedContent);
  console.log('Done updating dishes.ts!');
}
run();
