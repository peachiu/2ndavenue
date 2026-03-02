-- SecondAvenue Seed Data
-- 20 Eclectic Second-Hand Items
-- Using Local Image Assets

INSERT INTO listings (user_id, title, description, price, currency, image_url, category, condition_rating, tags, stock, views) VALUES
(1, 'Vintage 1990s Denim Jacket', 'Classic oversized denim jacket with a beautiful light wash. Brand: Levi\'s, Model: Type III', 85.00, 'EUR', '/images/products/denim_jacket.png', 'apparel', 'Good', 'Vintage, Levi\'s, Denim', 1, 0),
(1, 'Mid-Century Modern Teak Lamp', 'Original 1960s teak table lamp with a hand-woven linen shade. Brand: Danish Design', 120.00, 'EUR', '/images/products/teak_lamp.png', 'home', 'Like New', 'MCM, Lighting, Teak', 1, 0),
(2, 'Canon AE-1 Film Camera', 'Iconic 35mm SLR camera. Fully tested and working. Comes with a 50mm f/1.8 lens. Brand: Canon', 150.00, 'EUR', '/images/products/canon_camera.png', 'tech', 'Good', 'Photography, Film, Canon', 1, 0),
(2, 'Rusty Road Bike - Fixer Upper', '1980s steel frame road bike. Needs some love. Brand: Peugeot', 45.00, 'EUR', '/images/products/road_bike.png', 'vehicles', 'Poor', 'Cycling, Retro, Project', 1, 0),
(3, 'Stack of Vinyl Records', 'A curated selection of 10 jazz and blues records from the 60s and 70s.', 60.00, 'EUR', '/images/products/vinyl_records.png', 'media', 'Fair', 'Music, Vinyl, Jazz', 1, 0),
(3, 'Handmade Ceramic Vase', 'Unique stoneware vase with a speckled matte glaze. Signed by the artist.', 35.00, 'EUR', '/images/products/ceramic_vase.png', 'home', 'Like New', 'Handmade, Ceramic, Art', 1, 0),
(1, 'GameBoy Color - Atomic Purple', 'Classic handheld console. (Temporary fallback image)', 95.00, 'EUR', '/images/products/teak_lamp.png', 'tech', 'Good', 'Gaming, Nintendo, Retro', 1, 0),
(2, 'Corduroy Tote Bag', 'Large olive green corduroy bag. Sturdy and stylish.', 25.00, 'EUR', '/images/products/tote_bag.jpg', 'accessories', 'New', 'Fashion, Sustainable, Bag', 5, 0),
(4, 'Retro Record Player', 'Vintage style record player with a wood finish. Great sound quality.', 180.00, 'EUR', '/images/products/record_player.jpg', 'tech', 'Good', 'Audio, Vinyl, Retro', 1, 0),
(4, 'Vintage Wool Beret', 'Classic black wool beret found in a Parisian thrift store.', 20.00, 'EUR', '/images/products/beret.jpg', 'apparel', 'Good', 'Fashion, Paris, Wool', 1, 0),
(5, 'Oak Coffee Table', 'Solid oak coffee table with minimal profile.', 75.00, 'EUR', '/images/products/coffee_table.jpg', 'home', 'Fair', 'Furniture, Oak, Minimal', 1, 0),
(5, 'Polaroid OneStep 2', 'Modern classic instant camera. i-Type and 600 film compatible.', 80.00, 'EUR', '/images/products/polaroid.jpg', 'tech', 'Like New', 'Polaroid, Camera, Instant', 1, 0),
(1, 'Typewriter - Olivetti Lettera 32', 'Portable typewriter in excellent condition. Metal body. Brand: Olivetti', 140.00, 'EUR', '/images/products/typewriter.jpg', 'tech', 'Good', 'Writing, Vintage, Olivetti', 1, 0),
(2, 'Washed Linen Sheets', 'Set of queen size washed linen sheets in oatmeal. Extremely soft.', 110.00, 'EUR', '/images/products/linen_sheets.jpg', 'home', 'New', 'Bedding, Linen, Home', 2, 0),
(3, 'Film Noir Poster', 'Original 1940s movie poster. Framed behind UV-protective glass.', 200.00, 'EUR', '/images/products/movie_poster.jpg', 'media', 'Fair', 'Decor, Movie, Vintage', 1, 0),
(4, 'Analog Synth - Korg MS-20', 'Classic semi-modular monophonic analog synthesizer. Brand: Korg', 450.00, 'EUR', '/images/products/synth.jpg', 'tech', 'Good', 'Music, Synth, Korg', 1, 0),
(5, 'Chelsea Boots', 'Black leather Chelsea boots with a slim silhouette. Only worn once.', 90.00, 'EUR', '/images/products/boots.jpg', 'apparel', 'Like New', 'Boots, Leather, Fashion', 1, 0),
(1, 'Abstract Oil Painting', 'Large abstract expressionist painting on canvas. Vibrant palette.', 300.00, 'EUR', '/images/products/oil_painting.jpg', 'home', 'New', 'Art, Painting, Decor', 1, 0),
(2, 'Retro Sunglasses', '1970s tortoise shell shades. Very sturdy frames.', 40.00, 'EUR', '/images/products/sunglasses.jpg', 'accessories', 'Good', 'Vintage, Eyewear, Retro', 1, 0),
(3, 'Walnut Desk Organizer', 'Hand-crafted desk tray for pens, watch, and keys.', 30.00, 'EUR', '/images/products/desk_organizer.jpg', 'home', 'New', 'Office, Wood, Handmade', 3, 0);
