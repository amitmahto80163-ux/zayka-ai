import json
import random

EXACT_IMAGES = {
    "Butter Chicken": "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/41/Butter_Chicken_%26_Butter_Naan_-_Home_-_Chandigarh_-_India_-_0006.jpg/960px-Butter_Chicken_%26_Butter_Naan_-_Home_-_Chandigarh_-_India_-_0006.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail",
    "Dal Makhani": "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/69/Punjabi_style_Dal_Makhani.jpg/960px-Punjabi_style_Dal_Makhani.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail",
    "Paneer Tikka": "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f2/Paneer_tikka.jpg/960px-Paneer_tikka.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail",
    "Chole Bhature": "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9e/Chole_Bhature_from_Nagpur.JPG/960px-Chole_Bhature_from_Nagpur.JPG?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail",
    "Aloo Paratha": "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1e/Triangle_paratha_%28cropped%29.JPG/960px-Triangle_paratha_%28cropped%29.JPG?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail",
    "Rajma Chawal": "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/37/Rajma_Masala_%2832081557778%29.jpg/960px-Rajma_Masala_%2832081557778%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail",
    "Palak Paneer": "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b7/Palakpaneer_Rayagada_Odisha_0009.jpg/960px-Palakpaneer_Rayagada_Odisha_0009.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail",
    "Mutton Rogan Josh": "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/67/Rogan_Josh_Kashmiri.jpg/960px-Rogan_Josh_Kashmiri.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail",
    "Rogan Josh": "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/67/Rogan_Josh_Kashmiri.jpg/960px-Rogan_Josh_Kashmiri.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail",
    "Chicken Tikka Masala": "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/00/Chicken_tikka_masala_%28cropped%29.jpg/960px-Chicken_tikka_masala_%28cropped%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail",
    "Matar Paneer": "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/92/Matar_paneer_dish.jpg/960px-Matar_paneer_dish.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail",
    "Masala Dosa": "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/ba/Masala_Dosa_2023.jpg/960px-Masala_Dosa_2023.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail",
    "Idli Sambar": "https://upload.wikimedia.org/wikipedia/commons/1/11/Idli_Sambar.JPG?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled",
    "Medu Vada": "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1b/Medu_Vada.JPG/960px-Medu_Vada.JPG?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail",
    "Hyderabadi Biryani": "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7c/Hyderabadi_Chicken_Biryani.jpg/960px-Hyderabadi_Chicken_Biryani.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail",
    "Chicken Chettinad": "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/db/Chettinad_Chicken_Fry-Home-AndhraPradesh-005.jpg/960px-Chettinad_Chicken_Fry-Home-AndhraPradesh-005.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail",
    "Lemon Rice": "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f4/Chitranna_and_Payasa.jpg/960px-Chitranna_and_Payasa.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail",
    "Upma": "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/86/A_photo_of_Upma.jpg/960px-A_photo_of_Upma.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail",
    "Appam with Stew": "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c3/Appam_-_%E0%AE%85%E0%AE%AA%E0%AF%8D%E0%AE%AA%E0%AE%AE%E0%AF%8D.jpg/960px-Appam_-_%E0%AE%85%E0%AE%AA%E0%AF%8D%E0%AE%AA%E0%AE%AE%E0%AF%8D.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail",
    "Samosa": "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c4/Samosas%2C_snack_food_at_Wikipedia%27s_16th_Birthday_celebration_in_Chittagong_%2801%29.jpg/960px-Samosas%2C_snack_food_at_Wikipedia%27s_16th_Birthday_celebration_in_Chittagong_%2801%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail",
    "Pani Puri": "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e9/Pani_Puri1.JPG/960px-Pani_Puri1.JPG?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail",
    "Pav Bhaji": "https://upload.wikimedia.org/wikipedia/commons/4/4a/Bambayya_Pav_bhaji.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled",
    "Vada Pav": "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4e/Vada_Pav-Indian_street_food.JPG/960px-Vada_Pav-Indian_street_food.JPG?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail",
    "Aloo Tikki Chaat": "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d1/Aloo_Tikki_served_with_chutneys.jpg/960px-Aloo_Tikki_served_with_chutneys.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail",
    "Bhel Puri": "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/45/Behael_Puri_%286105489342%29.jpg/960px-Behael_Puri_%286105489342%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail",
    "Kathi Roll": "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fc/Kolkata_Rolls.jpg/960px-Kolkata_Rolls.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail",
    "Fish Curry": "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fc/Meen_curry_2_%28cropped%29.JPG/960px-Meen_curry_2_%28cropped%29.JPG?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail",
    "Rasgulla": "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/39/Rasgulla.jpg/960px-Rasgulla.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail",
    "Mishti Doi": "https://upload.wikimedia.org/wikipedia/commons/3/34/Mishti_Doi.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled",
    "Luchi Dum Aloo": "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5d/Puri_-_Digha_-_East_Midnapore_-_2015-05-03_9778.JPG/960px-Puri_-_Digha_-_East_Midnapore_-_2015-05-03_9778.JPG?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail",
    "Dhokla": "https://upload.wikimedia.org/wikipedia/commons/6/65/Dhokla_on_Gujrart.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled",
    "Thepla": "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/74/Thepla_main.jpg/960px-Thepla_main.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail",
    "Undhiyu": "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5e/Undhiyu.jpg/960px-Undhiyu.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail",
    "Khandvi": "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/bf/Gate_of_Khandvi.jpg/960px-Gate_of_Khandvi.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail",
    "Hakka Noodles": "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/cf/On_Hing_Noodle_Shop_in_Tuen_Mun.jpg/960px-On_Hing_Noodle_Shop_in_Tuen_Mun.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail",
    "Chilli Chicken": "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/45/Chicken_Chilli.JPG/960px-Chicken_Chilli.JPG?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail",
    "Veg Manchurian": "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/bb/Chicken_Manchurian_%28Hyderabad_Style%29_%2811960049916%29.jpg/960px-Chicken_Manchurian_%28Hyderabad_Style%29_%2811960049916%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail",
    "Fried Rice": "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c3/Koh_Mak%2C_Thailand%2C_Fried_rice_with_seafood%2C_Thai_fried_rice.jpg/960px-Koh_Mak%2C_Thailand%2C_Fried_rice_with_seafood%2C_Thai_fried_rice.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail",
    "Spring Rolls": "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1e/Spring_Rolls_%283357696061%29.jpg/960px-Spring_Rolls_%283357696061%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail",
    "Gobi Manchurian": "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/bb/Chicken_Manchurian_%28Hyderabad_Style%29_%2811960049916%29.jpg/960px-Chicken_Manchurian_%28Hyderabad_Style%29_%2811960049916%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail",
    "Margherita Pizza": "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/57/Neapolitan_pizza_at_Trappica_%2848701940197%29.jpg/960px-Neapolitan_pizza_at_Trappica_%2848701940197%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail",
    "Pizza Margherita": "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/57/Neapolitan_pizza_at_Trappica_%2848701940197%29.jpg/960px-Neapolitan_pizza_at_Trappica_%2848701940197%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail",
    "Pasta Arrabbiata": "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/cd/Penne_Arrabbiata.jpg/960px-Penne_Arrabbiata.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail",
    "Fettuccine Alfredo": "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/91/Fettuccine_Alfredo_originals.jpg/960px-Fettuccine_Alfredo_originals.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail",
    "Risotto": "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a5/Risotto_with_speck_and_goat_cheese_%286101067436%29.jpg/960px-Risotto_with_speck_and_goat_cheese_%286101067436%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail",
    "Lasagna": "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/ba/Lasagne_-_stonesoup.jpg/960px-Lasagne_-_stonesoup.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail",
    "Tacos": "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/73/001_Tacos_de_carnitas%2C_carne_asada_y_al_pastor.jpg/960px-001_Tacos_de_carnitas%2C_carne_asada_y_al_pastor.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail",
    "Quesadilla": "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/01/Empanada_flor_de_Calabaza.jpg/960px-Empanada_flor_de_Calabaza.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail",
    "Nachos with Salsa": "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/87/Nachos-cheese.jpg/960px-Nachos-cheese.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail",
    "Burrito Bowl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/60/Burrito.JPG/960px-Burrito.JPG?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail",
    "Gulab Jamun": "https://upload.wikimedia.org/wikipedia/commons/c/c1/Gulab-jamun-wallpaper-1.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled",
    "Gajar Ka Halwa": "https://upload.wikimedia.org/wikipedia/commons/c/cb/Cuisine_%28268%29_44.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled",
    "Kheer": "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/46/Kheer.jpg/960px-Kheer.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail",
    "Jalebi": "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/96/Basavanagudi_Kadalekai_Parishe_%282025%29_Bangalore_%2886%29.jpg/960px-Basavanagudi_Kadalekai_Parishe_%282025%29_Bangalore_%2886%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail",
    "Chocolate Brownie": "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/68/Chocolatebrownie.JPG/960px-Chocolatebrownie.JPG?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail",
    "Cheesecake": "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ea/Baked_cheesecake_with_raspberries_and_blueberries.jpg/960px-Baked_cheesecake_with_raspberries_and_blueberries.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail",
    "Masala Chai": "https://upload.wikimedia.org/wikipedia/commons/8/89/Chai_In_Sakora.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled",
    "Veg Biryani": "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5a/%22Hyderabadi_Dum_Biryani%22.jpg/960px-%22Hyderabadi_Dum_Biryani%22.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail",
    "Chicken Biryani": "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5a/%22Hyderabadi_Dum_Biryani%22.jpg/960px-%22Hyderabadi_Dum_Biryani%22.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail",
    "Paneer Butter Masala": "https://upload.wikimedia.org/wikipedia/commons/5/5c/Paneer_Makhani_Veggie.jpeg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled",
    "Shahi Paneer": "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/ad/Shahi_panner.jpg/960px-Shahi_panner.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail",
    "Kadai Paneer": "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/70/Wok-and-karahi-2.jpg/960px-Wok-and-karahi-2.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail",
    "Dal Tadka": "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f5/3_types_of_lentil.png/960px-3_types_of_lentil.png?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail",
    "Poha": "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/80/Poha.jpg/960px-Poha.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail",
    "Dahi Puri": "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/96/Sev_puri_with_sweet_curd.JPG/960px-Sev_puri_with_sweet_curd.JPG?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail",
    "Kachori": "https://upload.wikimedia.org/wikipedia/commons/8/8f/Rajasthani_Raj_Kachori.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled",
    "Pakora": "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/cf/Onion_pakora_-_a.jpg/960px-Onion_pakora_-_a.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail",
    "Momos": "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a1/Momo_nepal.jpg/960px-Momo_nepal.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail",
    "Tandoori Chicken": "https://upload.wikimedia.org/wikipedia/commons/e/e1/Chickentandoori.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled",
    "Naan": "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4e/Annapurna_Naan.jpg/960px-Annapurna_Naan.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail",
    "Garlic Naan": "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4e/Annapurna_Naan.jpg/960px-Annapurna_Naan.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail",
    "Roti": "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/74/2020-05-08_19_34_28_Chapati_being_made_in_a_pan_in_the_Franklin_Farm_section_of_Oak_Hill%2C_Fairfax_County%2C_Virginia.jpg/960px-2020-05-08_19_34_28_Chapati_being_made_in_a_pan_in_the_Franklin_Farm_section_of_Oak_Hill%2C_Fairfax_County%2C_Virginia.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail",
    "Chapati": "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fe/2_Chapati_warm_and_ready_to_be_eaten.jpg/960px-2_Chapati_warm_and_ready_to_be_eaten.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail",
    "Puri": "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/50/Fluffy_Poori_%28cropped%29.JPG/960px-Fluffy_Poori_%28cropped%29.JPG?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail",
    "Bhatura": "https://upload.wikimedia.org/wikipedia/commons/e/e3/Bhatoora.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled",
    "Khichdi": "https://upload.wikimedia.org/wikipedia/commons/6/63/Dall_Khichdi.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled",
    "Bisi Bele Bath": "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/04/Bisi_Bele_Bath_%28Bisibelebath%29.JPG/960px-Bisi_Bele_Bath_%28Bisibelebath%29.JPG?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail",
    "Pongal": "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/21/Ven_pongal_with_sambar_and_chutney.jpg/960px-Ven_pongal_with_sambar_and_chutney.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail",
    "Uttapam": "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c6/Mini_Uttappam.jpg/960px-Mini_Uttappam.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail",
    "Rasmalai": "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/ae/Ras_Malai_2.JPG/960px-Ras_Malai_2.JPG?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail",
    "Kaju Katli": "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/ac/Kaju_katli_sweet.jpg/960px-Kaju_katli_sweet.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail",
    "Laddu": "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c1/Laddu_Sweet.JPG/960px-Laddu_Sweet.JPG?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail",
    "Barfi": "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f1/Almond_Khoa_based_burfi_Mumbai_India_%28cropped%29.jpg/960px-Almond_Khoa_based_burfi_Mumbai_India_%28cropped%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail",
    "Lassi": "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f1/Salt_lassi.jpg/960px-Salt_lassi.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail",
    "Mango Lassi": "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f1/Salt_lassi.jpg/960px-Salt_lassi.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail",
    "Raita": "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/78/Cucumber-raita.jpg/960px-Cucumber-raita.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail",
    "Sushi": "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/60/Sushi_platter.jpg/960px-Sushi_platter.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail",
    "Ramen": "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c3/Shoyu_Ramen%EF%BC%88Tokyo_Ramen%EF%BC%89_-_01.jpg/960px-Shoyu_Ramen%EF%BC%88Tokyo_Ramen%EF%BC%89_-_01.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail",
    "Miso Soup": "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e8/Miso_Soup_001.jpg/960px-Miso_Soup_001.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail",
    "Pad Thai": "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/39/Phat_Thai_kung_Chang_Khien_street_stall.jpg/960px-Phat_Thai_kung_Chang_Khien_street_stall.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail",
    "Kung Pao Chicken": "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c2/Kung-pao-shanghai.jpg/960px-Kung-pao-shanghai.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail",
    "Falafel": "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/57/Falafels_2.jpg/960px-Falafels_2.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail",
    "Hummus": "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/bf/Lebanese_style_hummus.jpg/960px-Lebanese_style_hummus.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail",
    "Shawarma": "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/00/Shawarma_2.jpg/960px-Shawarma_2.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail",
    "Croissant": "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2a/Croissant-Petr_Kratochvil.jpg/960px-Croissant-Petr_Kratochvil.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail",
    "Tiramisu": "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/58/Tiramisu_-_Raffaele_Diomede.jpg/960px-Tiramisu_-_Raffaele_Diomede.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail",
    "Paella": "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ed/01_Paella_Valenciana_original.jpg/960px-01_Paella_Valenciana_original.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail",
    "Churros": "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c6/Chocolate_con_churros_%2827343655726%29.jpg/960px-Chocolate_con_churros_%2827343655726%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail",
    "Guacamole": "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/64/Guacamole_IMGP1271.jpg/960px-Guacamole_IMGP1271.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail",
    "Kimchi": "https://upload.wikimedia.org/wikipedia/commons/f/f8/Various_kimchi.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled",
    "Bibimbap": "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/44/Dolsot-bibimbap.jpg/960px-Dolsot-bibimbap.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail",
    "Pho": "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/52/Bowl_of_Meatball_pho.jpg/960px-Bowl_of_Meatball_pho.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
}

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
        "image": EXACT_IMAGES.get(dish[0] if "dish" in locals() else base[0], "")
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
            "image": EXACT_IMAGES.get(dish[0] if "dish" in locals() else base[0], "")
        })
        id_counter += 1

# Generate the TS content
ts_content = f"// Automatically generated massive dataset with 200+ dishes\n"
ts_content += f"export const ALL_DISHES = {json.dumps(dishes, ensure_ascii=False, indent=2)};\n"

with open("src/data/dishes.ts", "w", encoding="utf-8") as f:
    f.write(ts_content)

print(f"Generated {len(dishes)} dishes in src/data/dishes.ts")
