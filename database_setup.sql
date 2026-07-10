-- Create database
CREATE DATABASE IF NOT EXISTS uvinza_stationery;

-- Use the database
USE uvinza_stationery;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(50) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    role ENUM('admin', 'manager', 'staff') NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create dai (wanayodaiwa) table
CREATE TABLE IF NOT EXISTS dai (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_name VARCHAR(150) NOT NULL,
    amount_due DECIMAL(12,2) NOT NULL DEFAULT 0,
    due_date DATE NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Inasubiri',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS dai_payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    dai_id INT NOT NULL,
    amount_paid DECIMAL(12,2) NOT NULL DEFAULT 0,
    payment_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (dai_id) REFERENCES dai(id) ON DELETE CASCADE
);

-- Create daiwa (ninayodaiwa) table
CREATE TABLE IF NOT EXISTS daiwa (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    amount_due DECIMAL(12,2) NOT NULL DEFAULT 0,
    due_date DATE NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Inasubiri',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS daiwa_payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    daiwa_id INT NOT NULL,
    amount_paid DECIMAL(12,2) NOT NULL DEFAULT 0,
    payment_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (daiwa_id) REFERENCES daiwa(id) ON DELETE CASCADE
);

-- Create mauzo table
CREATE TABLE IF NOT EXISTS sales (
    id INT AUTO_INCREMENT PRIMARY KEY,
    item_name VARCHAR(160) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    price DECIMAL(12,2) NOT NULL DEFAULT 0,
    total DECIMAL(12,2) NOT NULL DEFAULT 0,
    sale_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



-- Create matumizi table
CREATE TABLE IF NOT EXISTS expenses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    amount DECIMAL(12,2) NOT NULL DEFAULT 0,
    expense_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
