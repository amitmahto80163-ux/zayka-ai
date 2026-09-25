const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'data', 'dishes.ts');
let fileContent = fs.readFileSync(filePath, 'utf-8');
let dataStr = fileContent.substring(fileContent.indexOf('['), fileContent.lastIndexOf(']') + 1);
let dishes;
eval('dishes = ' + dataStr);

const exactMatches = {
  'Butter Chicken': 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800&fit=crop',
  'Dal Makhani': 'https://images.unsplash.com/photo-1708782340380-536df8cf6784?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800&fit=crop',
  'Aloo Paratha': 'https://images.unsplash.com/photo-1668357530437-72a12c660f94?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800&fit=crop',
  'Rajma Chawal': 'https://images.unsplash.com/photo-1788601988466-9f361c34c6cb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800&fit=crop',
  'Palak Paneer': 'https://images.unsplash.com/photo-1589647363585-f4a7d3877b10?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800&fit=crop',
  'Paneer Tikka': 'https://images.unsplash.com/photo-1666001120694-3ebe8fd207be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800&fit=crop',
  'Chole Bhature': 'https://images.unsplash.com/photo-1788602564560-9bcbf0f9acb6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800&fit=crop',
  'Masala Dosa': 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800&fit=crop',
  'Hyderabadi Biryani': 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800&fit=crop'
};

const fallbacks = {
  indian: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&q=80&w=800&h=800',
  chinese: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=800&h=800',
  italian: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&q=80&w=800&h=800',
  healthy: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=800&h=800',
  dessert: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&q=80&w=800&h=800'
};

dishes.forEach(dish => {
  let baseName = dish.name.replace(/^(Healthy|Quick|Homestyle|Spicy|Special)\s+/i, '');
  
  if (exactMatches[dish.name]) {
    dish.image = exactMatches[dish.name];
  } else if (exactMatches[baseName]) {
    dish.image = exactMatches[baseName];
  } else {
    if (dish.tags && dish.tags.includes('dessert')) {
      dish.image = fallbacks.dessert;
    } else {
      dish.image = fallbacks[dish.cuisine] || fallbacks.indian;
    }
  }
});

const updatedContent = fileContent.substring(0, fileContent.indexOf('export const ALL_DISHES = ')) +
                       'export const ALL_DISHES = ' + JSON.stringify(dishes, null, 2) + ';\n';
                       
fs.writeFileSync(filePath, updatedContent);
console.log('Fixed dishes with stable standard Unsplash images!');
