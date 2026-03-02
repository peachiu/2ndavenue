-- SecondAvenue Marketplace Schema
-- Table: products

CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'EUR',
    category VARCHAR(100),
    brand VARCHAR(100),
    model VARCHAR(100),
    condition_rating ENUM('New', 'Like New', 'Good', 'Fair', 'Poor') NOT NULL,
    location VARCHAR(255),
    image_url VARCHAR(512),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
