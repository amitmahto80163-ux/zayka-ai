import json
import random

bases = [
    # North Indian
    ("Butter Chicken", "बटर चिकन", "indian", False, ["dinner", "popular"]),
    ("Dal Makhani", "दाल मखनी", "indian", True, ["dinner", "popular"]),
    ("Paneer Tikka", "पनीर टिक्का", "indian", True, ["starter", "popular"]),
    ("Chole Bhature", "छोले भटूरे", "indian", True, ["lunch", "street"]),
    ("Aloo Paratha", "आलू पराठा", "indian", True, ["breakfast", "popular"]),
    ("Rajma Chawal", "राजमा चावल", "indian", True, ["lunch", "comfort"]),
    ("Palak Paneer", "पालक पनीर", "indian", True, ["dinner", "healthy"]),
    ("Mutton Rogan Josh", "मटन रोगन जोश", "indian", False, ["dinner", "premium"]),
    ("Chicken Tikka Masala", "चिकन टिक्का मसाला", "indian", False, ["dinner", "popular"]),
    ("Matar Paneer", "मटर पनीर", "indian", True, ["dinner", "popular"]),
    
    # South Indian
    ("Masala Dosa", "मसाला डोसा", "indian", True, ["breakfast", "popular"]),
    ("Idli Sambar", "इडली सांबर", "indian", True, ["breakfast", "healthy"]),
    ("Medu Vada", "मेदु वड़ा", "indian", True, ["breakfast", "snack"]),
    ("Hyderabadi Biryani", "हैदराबादी बिरयानी", "indian", False, ["dinner", "premium"]),
    ("Chicken Chettinad", "चिकन चेट्टीनाड", "indian", False, ["dinner", "spicy"]),
    ("Lemon Rice", "लेमन राइस", "indian", True, ["lunch", "quick"]),
    ("Upma", "उपमा", "indian", True, ["breakfast", "healthy"]),
    ("Appam with Stew", "अप्पम और स्टू", "indian", True, ["breakfast", "comfort"]),
    
    # Street Food / Snacks
    ("Samosa", "समोसा", "indian", True, ["snack", "street"]),
    ("Pani Puri", "पानी पूरी", "indian", True, ["snack", "street"]),
    ("Pav Bhaji", "पाव भाजी", "indian", True, ["dinner", "street"]),
    ("Vada Pav", "वड़ा पाव", "indian", True, ["snack", "street"]),
    ("Aloo Tikki Chaat", "आलू टिक्की चाट", "indian", True, ["snack", "street"]),
    ("Bhel Puri", "भेल पूरी", "indian", True, ["snack", "street"]),
    ("Kathi Roll", "काठी रोल", "indian", False, ["snack", "street"]),
    
    # Bengali / East
    ("Fish Curry", "फिश करी", "indian", False, ["dinner", "popular"]),
    ("Rasgulla", "रसगुल्ला", "indian", True, ["dessert", "popular"]),
    ("Mishti Doi", "मिष्टी दोई", "indian", True, ["dessert", "popular"]),
    ("Luchi Dum Aloo", "लूची दम आलू", "indian", True, ["lunch", "comfort"]),
    
    # Gujarati / West
    ("Dhokla", "ढोकला", "indian", True, ["snack", "healthy"]),
    ("Thepla", "थेपला", "indian", True, ["breakfast", "quick"]),
    ("Undhiyu", "उंधियू", "indian", True, ["dinner", "healthy"]),
    ("Khandvi", "खांडवी", "indian", True, ["snack", "healthy"]),
    
    # Indo-Chinese
    ("Hakka Noodles", "हक्का नूडल्स", "chinese", True, ["lunch", "quick"]),
    ("Chilli Chicken", "चिली चिकन", "chinese", False, ["starter", "popular"]),
    ("Veg Manchurian", "वेज मंचूरियन", "chinese", True, ["starter", "popular"]),
    ("Fried Rice", "फ्राइड राइस", "chinese", True, ["lunch", "quick"]),
    ("Spring Rolls", "स्प्रिंग रोल", "chinese", True, ["starter", "snack"]),
    ("Gobi Manchurian", "गोभी मंचूरियन", "chinese", True, ["starter", "popular"]),
    
    # Italian
    ("Margherita Pizza", "मार्गेरिटा पिज़्ज़ा", "italian", True, ["dinner", "popular"]),
    ("Pasta Arrabbiata", "पास्ता अर्राबियाता", "italian", True, ["dinner", "quick"]),
    ("Fettuccine Alfredo", "फेटुसिनी अल्फ्रेडो", "italian", True, ["dinner", "comfort"]),
    ("Risotto", "रिसोट्टो", "italian", True, ["dinner", "premium"]),
    ("Lasagna", "लज़ान्या", "italian", False, ["dinner", "comfort"]),
    
    # Mexican
    ("Tacos", "टैकोस", "mexican", False, ["snack", "popular"]),
    ("Quesadilla", "क्वेसाडिला", "mexican", True, ["snack", "quick"]),
    ("Nachos with Salsa", "नाचोस साल्सा", "mexican", True, ["snack", "popular"]),
    ("Burrito Bowl", "बुरिटो बाउल", "mexican", True, ["lunch", "healthy"]),
    
    # Desserts
    ("Gulab Jamun", "गुलाब जामुन", "indian", True, ["dessert", "popular"]),
    ("Gajar Ka Halwa", "गाजर का हलवा", "indian", True, ["dessert", "comfort"]),
    ("Kheer", "खीर", "indian", True, ["dessert", "comfort"]),
    ("Jalebi", "जलेबी", "indian", True, ["dessert", "street"]),
    ("Chocolate Brownie", "चॉकलेट ब्राउनी", "dessert", True, ["dessert", "popular"]),
    ("Cheesecake", "चीज़केक", "dessert", True, ["dessert", "premium"])
]

# Generate variations to reach ~200 dishes
variations = ["Spicy", "Homestyle", "Restaurant Style", "Healthy", "Quick", "Special"]

dishes = []
id_counter = 1

# Add base dishes
for dish in bases:
    dishes.append({
        "id": f"dish_{id_counter}",
        "name": dish[0],
        "nameHindi": dish[1],
        "cuisine": dish[2],
        "isVeg": dish[3],
        "time": random.choice([15, 20, 30, 45, 60]),
        "calories": random.randint(150, 600),
        "rating": round(random.uniform(4.0, 4.9), 1),
        "tags": dish[4],
        "image": f"https://images.unsplash.com/photo-{random.choice(['1585937421612-70a008356fbe', '1546833999-b9f581a1996d', '1564834724105-918b73d1b9e0', '1473093295043-cdd812d0e601', '1552611052-33e04de081de', '1561336313-0bd5e0b27ec8', '1565299624946-b28f40a0ae38', '1604908176997-125f25cc6f3d', '1567620905732-2d1ec7ab7445'])}?auto=format&fit=crop&q=80&w=600&h=800"
    })
    id_counter += 1

# Add variations to fill up to 200
while len(dishes) < 200:
    base = random.choice(bases)
    var = random.choice(variations)
    name = f"{var} {base[0]}"
    nameHindi = f"{var} {base[1]}"
    
    # Avoid exact duplicates
    if not any(d["name"] == name for d in dishes):
        dishes.append({
            "id": f"dish_{id_counter}",
            "name": name,
            "nameHindi": nameHindi,
            "cuisine": base[2],
            "isVeg": base[3],
            "time": random.choice([10, 15, 20, 30, 45]),
            "calories": random.randint(150, 600),
            "rating": round(random.uniform(4.0, 4.9), 1),
            "tags": base[4] + [var.lower()],
            "image": f"https://images.unsplash.com/photo-{random.choice(['1585937421612-70a008356fbe', '1546833999-b9f581a1996d', '1564834724105-918b73d1b9e0', '1473093295043-cdd812d0e601', '1552611052-33e04de081de', '1561336313-0bd5e0b27ec8', '1565299624946-b28f40a0ae38', '1604908176997-125f25cc6f3d', '1567620905732-2d1ec7ab7445'])}?auto=format&fit=crop&q=80&w=600&h=800"
        })
        id_counter += 1

# Generate the TS content
ts_content = f"// Automatically generated massive dataset with 200+ dishes\n"
ts_content += f"export const ALL_DISHES = {json.dumps(dishes, ensure_ascii=False, indent=2)};\n"

with open("src/data/dishes.ts", "w", encoding="utf-8") as f:
    f.write(ts_content)

print(f"Generated {len(dishes)} dishes in src/data/dishes.ts")
