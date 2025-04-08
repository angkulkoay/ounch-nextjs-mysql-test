
CREATE DATABASE IF NOT EXISTS sample_db;

USE sample_db;

CREATE TABLE IF NOT EXISTS items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT
);

INSERT INTO items (name, description) VALUES 
('Laptop', 'High-performance laptop for work and gaming.'),
('Smartphone', 'Latest generation smartphone with advanced features.'),
('Headphones', 'Noise-cancelling over-ear headphones for immersive audio.'),
('Keyboard', 'Mechanical keyboard for a tactile typing experience.'),
('Mouse', 'Ergonomic wireless mouse for comfortable use.'),
('Monitor', '27-inch 4K monitor for sharp visuals.'),
('Webcam', 'High-definition webcam for video conferencing.'),
('Printer', 'Color inkjet printer for home and office use.'),
('Tablet', 'Lightweight tablet for browsing and entertainment.'),
('Smartwatch', 'Wearable device for tracking fitness and notifications.'),
('Wireless Mouse', 'Another comfortable wireless mouse option.'),
('External Hard Drive', 'Portable storage for backups and files.'),
('Laptop Stand', 'Ergonomic stand to elevate your laptop.'),
('Smartphone Charger', 'Fast charging adapter for your phone.'),
('Wireless Mouse', 'This entry will be ignored due to the duplicate name.');