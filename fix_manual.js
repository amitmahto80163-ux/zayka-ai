const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'data', 'dishes.ts');
let fileContent = fs.readFileSync(filePath, 'utf-8');
let dataStr = fileContent.substring(fileContent.indexOf('['), fileContent.lastIndexOf(']') + 1);
let dishes;
eval('dishes = ' + dataStr);

const exactMatches = {
  'Butter Chicken': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Chicken_makhani.jpg/800px-Chicken_makhani.jpg',
  'Dal Makhani': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Dal_Makhani.jpg/800px-Dal_Makhani.jpg',
  'Paneer Tikka': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Paneer_Tikka.jpg/800px-Paneer_Tikka.jpg',
  'Chole Bhature': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Chole_Bhature.jpg/800px-Chole_Bhature.jpg',
  'Aloo Paratha': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Aloo_Paratha_also_known_as_Batatay_Jo_Phulko.jpg/800px-Aloo_Paratha_also_known_as_Batatay_Jo_Phulko.jpg',
  'Rajma Chawal': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Rajma_chawal_in_a_bowl.jpg/800px-Rajma_chawal_in_a_bowl.jpg',
  'Palak Paneer': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Palak_Paneer.jpg/800px-Palak_Paneer.jpg',
  'Mutton Rogan Josh': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Rogan_Josh.jpg/800px-Rogan_Josh.jpg',
  'Chicken Tikka Masala': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Chicken_Tikka_Masala_Curry.jpg/800px-Chicken_Tikka_Masala_Curry.jpg',
  'Matar Paneer': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Matar_Paneer.jpg/800px-Matar_Paneer.jpg',
  'Masala Dosa': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Dosa_and_ghee.jpg/800px-Dosa_and_ghee.jpg',
  'Idli Sambar': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Idli_Sambar.jpg/800px-Idli_Sambar.jpg',
  'Medu Vada': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Medu_vada_with_sambar_and_chutney.jpg/800px-Medu_vada_with_sambar_and_chutney.jpg',
  'Hyderabadi Biryani': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Hyderabadi_Chicken_Biryani.jpg/800px-Hyderabadi_Chicken_Biryani.jpg',
  'Chicken Chettinad': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Chicken_Chettinad.jpg/800px-Chicken_Chettinad.jpg',
  'Lemon Rice': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Lemon_Rice.jpg/800px-Lemon_Rice.jpg',
  'Upma': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Upma.jpg/800px-Upma.jpg',
  'Samosa': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Samosa_in_a_plate.jpg/800px-Samosa_in_a_plate.jpg',
  'Pani Puri': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Pani_Puri_or_Golgappa.jpg/800px-Pani_Puri_or_Golgappa.jpg',
  'Pav Bhaji': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Pav_Bhaji.jpg/800px-Pav_Bhaji.jpg',
  'Vada Pav': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Vada_Pav.jpg/800px-Vada_Pav.jpg',
  'Dhokla': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Dhokla.jpg/800px-Dhokla.jpg',
  'Khaman': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Dhokla.jpg/800px-Dhokla.jpg',
  'Khandvi': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Khandvi.jpg/800px-Khandvi.jpg',
  'Thepla': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Thepla.jpg/800px-Thepla.jpg',
  'Litti Chokha': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Litti_Chokha_of_Bihar.jpg/800px-Litti_Chokha_of_Bihar.jpg',
  'Sarson Ka Saag': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Sarson_Ka_Saag.jpg/800px-Sarson_Ka_Saag.jpg',
  'Makki Ki Roti': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Makki_ki_roti.jpg/800px-Makki_ki_roti.jpg',
  'Kadhai Paneer': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Kadai_Paneer.jpg/800px-Kadai_Paneer.jpg',
  'Malai Kofta': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Malai_Kofta.jpg/800px-Malai_Kofta.jpg',
  'Shahi Paneer': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Shahi_paneer.jpg/800px-Shahi_paneer.jpg',
  'Poha': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Poha%2C_a_snack_made_of_flattened_rice.jpg/800px-Poha%2C_a_snack_made_of_flattened_rice.jpg',
  'Jalebi': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Jalebi_in_a_plate.jpg/800px-Jalebi_in_a_plate.jpg',
  'Gulab Jamun': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Gulab_Jamun_in_a_bowl.jpg/800px-Gulab_Jamun_in_a_bowl.jpg',
  'Rasgulla': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Rasgulla.jpg/800px-Rasgulla.jpg',
  'Kheer': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Kheer.jpg/800px-Kheer.jpg'
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
console.log('Fixed dishes with stable Wikipedia and Unsplash images!');
