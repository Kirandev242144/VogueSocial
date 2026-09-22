-- ===================================================
-- VogueSocial MySQL 8.0 Database Schema Definition
-- Database: voguesocial_db
-- ===================================================

CREATE DATABASE IF NOT EXISTS voguesocial_db;
USE voguesocial_db;

-- 1. Profiles / Users Table
CREATE TABLE IF NOT EXISTS profiles (
    id VARCHAR(100) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    store_name VARCHAR(255),
    store_handle VARCHAR(255) UNIQUE,
    role VARCHAR(50) DEFAULT 'merchant',
    description TEXT,
    logo_url VARCHAR(500),
    tryon_credits_total INT DEFAULT 2000,
    tryon_credits_used INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Products Table
CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(100) PRIMARY KEY,
    vendor_id VARCHAR(100) NOT NULL,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    subcategory VARCHAR(100),
    target_audience VARCHAR(50),
    sku VARCHAR(100),
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    sale_price DECIMAL(10,2),
    currency VARCHAR(10) DEFAULT 'USD',
    image_url TEXT,
    back_image_url TEXT,
    stock INT DEFAULT 0,
    status VARCHAR(50) DEFAULT 'live',
    admin_notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vendor_id) REFERENCES profiles(id) ON DELETE CASCADE
);

-- 3. Website Settings Table
CREATE TABLE IF NOT EXISTS website_settings (
    vendor_id VARCHAR(100) PRIMARY KEY,
    status VARCHAR(50) DEFAULT 'draft',
    template VARCHAR(50) DEFAULT 'minimal',
    store_handle VARCHAR(255),
    custom_domain VARCHAR(255),
    domain_status VARCHAR(50) DEFAULT 'not_connected',
    store_name VARCHAR(255),
    tagline VARCHAR(255),
    description TEXT,
    logo_url VARCHAR(500),
    hero_image VARCHAR(500),
    accent_color VARCHAR(20) DEFAULT '#02231c',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vendor_id) REFERENCES profiles(id) ON DELETE CASCADE
);

-- 4. Sample Seed Data for Testing
INSERT INTO profiles (id, email, full_name, store_name, store_handle, role) 
VALUES ('ec9e5c47-4d4a-4998-b4b3-16d228f9615c', 'tom@gmail.com', 'Tom Jenkins', 'New Flick', 'tom', 'merchant')
ON DUPLICATE KEY UPDATE store_name='New Flick';

INSERT INTO website_settings (vendor_id, status, template, store_handle, store_name, tagline, accent_color)
VALUES ('ec9e5c47-4d4a-4998-b4b3-16d228f9615c', 'live', 'minimal', 'tom', 'New Flick', 'Discover your style.', '#02231c')
ON DUPLICATE KEY UPDATE status='live';

INSERT INTO products (id, vendor_id, name, category, price, stock, status, image_url)
VALUES 
('dd8d7fe4-7680-4b0e-8198-67720e00045d', 'ec9e5c47-4d4a-4998-b4b3-16d228f9615c', 'Meta Fitted Cropped Vest', 'tops', 38.00, 20, 'live', '/Shop_images/1/basic2-500x750.jpeg'),
('45082950-2877-438b-abef-9732cdb4dc75', 'ec9e5c47-4d4a-4998-b4b3-16d228f9615c', 'Meta High-Rise Cargo Pants', 'bottoms', 72.00, 20, 'live', '/Shop_images/9/pocketmen1-500x750.jpeg')
ON DUPLICATE KEY UPDATE status='live';
