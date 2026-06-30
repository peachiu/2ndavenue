-- ============================================================
--  Migration: Substituir categorias pelas da OLX
--  Uso:  mysql -u secondavenue -p secondavenue < scripts/migrate-categories-olx.sql
-- ============================================================

-- Limpar subcategorias primeiro (sem parent_id)
DELETE FROM listing_tags WHERE listing_id IN (SELECT id FROM listings WHERE category_id IS NOT NULL);
UPDATE listings SET category_id = NULL;
DELETE FROM categories;

-- Level 0 (categorias principais)
INSERT INTO categories (id, slug, name_pt, name_en, icon, parent_id, sort_order) VALUES
    (1,  'roupa',         'Roupa',              'Apparel',            'Shirt',      NULL, 1),
    (2,  'calcado',       'Calçado',            'Footwear',           'Footprints', NULL, 2),
    (3,  'acessorios',    'Acessórios',         'Accessories',        'Watch',      NULL, 3),
    (4,  'tecnologia',    'Tecnologia',         'Tech',               'Monitor',    NULL, 4),
    (5,  'casa',          'Casa e Jardim',      'Home & Garden',      'Sofa',       NULL, 5),
    (6,  'veiculos',      'Veículos',           'Vehicles',           'Car',        NULL, 6),
    (7,  'desporto',      'Desporto e Lazer',   'Sports & Leisure',   'Trophy',     NULL, 7),
    (8,  'media',         'Media e Música',     'Media & Music',      'BookOpen',   NULL, 8),
    (9,  'vintage',       'Vintage e Arte',     'Vintage & Art',      'Palette',    NULL, 9),
    (10, 'bebes',         'Bebés e Crianças',   'Kids & Baby',        'Baby',       NULL, 10),
    (11, 'beleza',        'Beleza e Bem-Estar', 'Beauty & Wellness',  'Sparkles',   NULL, 11),
    (12, 'animais',       'Animais',            'Pets',               'PawPrint',   NULL, 12),
    (13, 'outro',         'Outro',              'Other',              'Package',    NULL, 13);

-- Level 1 (subcategorias)
INSERT INTO categories (slug, name_pt, name_en, parent_id, sort_order) VALUES
    -- Roupa
    ('roupa-tshirts',     'T-shirts e Tops',     'T-shirts & Tops',     1, 1),
    ('roupa-camisas',     'Camisas',             'Shirts',              1, 2),
    ('roupa-calcas',      'Calças',              'Pants',               1, 3),
    ('roupa-saias',       'Saias e Vestidos',    'Skirts & Dresses',    1, 4),
    ('roupa-casacos',     'Casacos e Blazers',   'Coats & Blazers',     1, 5),
    ('roupa-malhas',      'Malhas e Tricô',      'Knitwear',            1, 6),
    ('roupa-fatos',       'Fatos e Macacões',    'Suits & Jumpsuits',   1, 7),
    ('roupa-desporto',    'Roupa de Desporto',   'Activewear',          1, 8),
    ('roupa-interior',    'Roupa Interior',      'Underwear',           1, 9),
    -- Calçado
    ('calcado-tenis',     'Ténis',               'Sneakers',            2, 1),
    ('calcado-botas',     'Botas',               'Boots',               2, 2),
    ('calcado-sapatos',   'Sapatos',             'Shoes',               2, 3),
    ('calcado-sandalias', 'Sandálias',           'Sandals',             2, 4),
    ('calcado-chinelos',  'Chinelos',            'Slippers',            2, 5),
    -- Acessórios
    ('acess-malas',       'Malas e Mochilas',    'Bags & Backpacks',    3, 1),
    ('acess-bijuteria',   'Bijuteria e Joalharia','Jewelry',            3, 2),
    ('acess-relogios',    'Relógios',            'Watches',             3, 3),
    ('acess-oculos',      'Óculos',              'Eyewear',             3, 4),
    ('acess-cintos',      'Cintos',              'Belts',               3, 5),
    ('acess-chapeus',     'Chapéus',             'Hats',                3, 6),
    ('acess-lencos',      'Lenços e Echarpes',   'Scarves',             3, 7),
    -- Tecnologia
    ('tech-telemoveis',   'Telemóveis e Smartphones', 'Phones',          4, 1),
    ('tech-computadores', 'Computadores e Portáteis', 'Computers',       4, 2),
    ('tech-tablets',      'Tablets e E-readers',      'Tablets',         4, 3),
    ('tech-tv',           'TVs e Monitores',           'TVs & Monitors', 4, 4),
    ('tech-audio',        'Áudio e Auscultadores',    'Audio & Headphones',4,5),
    ('tech-consolas',     'Consolas e Videojogos',    'Gaming',          4, 6),
    ('tech-camaras',      'Câmaras e Fotografia',     'Cameras',         4, 7),
    ('tech-wearables',    'Smartwatches e Wearables', 'Wearables',       4, 8),
    -- Casa e Jardim
    ('casa-moveis',       'Móveis',                'Furniture',           5, 1),
    ('casa-decoracao',    'Decoração',             'Decoration',          5, 2),
    ('casa-iluminacao',   'Iluminação',            'Lighting',            5, 3),
    ('casa-texteis',      'Têxteis e Roupa de Cama','Textiles & Bedding', 5, 4),
    ('casa-cozinha',      'Cozinha e Mesa',        'Kitchen & Table',     5, 5),
    ('casa-jardim',       'Jardim e Varanda',      'Garden & Patio',      5, 6),
    ('casa-ferramentas',  'Ferramentas e Bricolage','Tools & DIY',        5, 7),
    -- Veículos
    ('veic-carros',       'Carros',                'Cars',                6, 1),
    ('veic-motas',        'Motas e Scooters',      'Motorcycles',         6, 2),
    ('veic-bicicletas',   'Bicicletas',            'Bicycles',            6, 3),
    ('veic-pecas',        'Peças e Acessórios',    'Parts & Accessories', 6, 4),
    -- Desporto
    ('desp-fitness',      'Fitness e Ginásio',     'Fitness & Gym',       7, 1),
    ('desp-yoga',         'Yoga e Pilates',        'Yoga & Pilates',      7, 2),
    ('desp-camping',      'Campismo e Ar Livre',   'Camping & Outdoors',  7, 3),
    ('desp-aquaticos',    'Desportos Aquáticos',   'Water Sports',        7, 4),
    ('desp-ciclismo',     'Ciclismo',              'Cycling',             7, 5),
    ('desp-inverno',      'Desportos de Inverno',  'Winter Sports',       7, 6),
    -- Media
    ('media-livros',      'Livros e Revistas',     'Books & Magazines',   8, 1),
    ('media-vinil',       'Vinil e CDs',           'Vinyl & CDs',         8, 2),
    ('media-filmes',      'Filmes e DVDs',         'Movies & DVDs',       8, 3),
    ('media-videojogos',  'Videojogos',            'Video Games',         8, 4),
    ('media-instrumentos','Instrumentos Musicais', 'Musical Instruments', 8, 5),
    -- Vintage
    ('vint-mobilia',      'Mobília Vintage',       'Vintage Furniture',   9, 1),
    ('vint-roupa',        'Roupa Vintage',         'Vintage Clothing',    9, 2),
    ('vint-discos',       'Discos e Vinil',        'Records & Vinyl',     9, 3),
    ('vint-brinquedos',   'Brinquedos Antigos',    'Antique Toys',        9, 4),
    ('vint-arte',         'Arte e Quadros',        'Art & Paintings',     9, 5),
    -- Bebés
    ('bebes-roupa',       'Roupa Infantil',        'Kids Clothing',      10, 1),
    ('bebes-brinquedos',  'Brinquedos',            'Toys',               10, 2),
    ('bebes-material',    'Material de Bebé',       'Baby Gear',         10, 3),
    ('bebes-mobilia',     'Mobiliário Infantil',    'Kids Furniture',    10, 4),
    -- Beleza
    ('beleza-maquilhagem','Maquilhagem',            'Makeup',            11, 1),
    ('beleza-skincare',   'Skincare',               'Skincare',          11, 2),
    ('beleza-perfumes',   'Perfumes',               'Perfumes',          11, 3),
    ('beleza-capilar',    'Cuidado Capilar',         'Hair Care',        11, 4),
    -- Animais
    ('anim-acessorios',   'Acessórios para Animais','Pet Accessories',   12, 1),
    ('anim-alimentacao',  'Alimentação',            'Pet Food',          12, 2),
    ('anim-saude',        'Saúde e Higiene',        'Pet Health',        12, 3);
