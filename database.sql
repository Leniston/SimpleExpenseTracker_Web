CREATE DATABASE IF NOT EXISTS expense_tracker;
USE expense_tracker;

CREATE TABLE IF NOT EXISTS transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    category VARCHAR(100) NOT NULL,
    type ENUM('income', 'expense') NOT NULL,
    necessity ENUM('necessary', 'unnecessary') NOT NULL
);


CREATE TABLE categories (
                            id INT AUTO_INCREMENT PRIMARY KEY,
                            name VARCHAR(100) NOT NULL,
                            description TEXT,
                            created_by VARCHAR(50),
                            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE subcategories (
                               id INT AUTO_INCREMENT PRIMARY KEY,
                               category_id INT NOT NULL,
                               name VARCHAR(100) NOT NULL,
                               description TEXT,
                               created_by VARCHAR(50),
                               created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                               FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- Add some default categories and subcategories
INSERT INTO categories (name, description, created_by) VALUES
                                                           ('Housing', 'Home and housing related expenses', 'Leniston'),
                                                           ('Transportation', 'Transport and vehicle expenses', 'Leniston'),
                                                           ('Food', 'Food and dining expenses', 'Leniston'),
                                                           ('Entertainment', 'Entertainment and leisure', 'Leniston'),
                                                           ('Income', 'All income sources', 'Leniston');

INSERT INTO subcategories (category_id, name, description, created_by) VALUES
                                                                           (1, 'Rent', 'Monthly rent payments', 'Leniston'),
                                                                           (1, 'Utilities', 'Electricity, water, etc.', 'Leniston'),
                                                                           (2, 'Fuel', 'Petrol/Diesel expenses', 'Leniston'),
                                                                           (2, 'Public Transport', 'Bus, train, etc.', 'Leniston'),
                                                                           (3, 'Groceries', 'Supermarket purchases', 'Leniston'),
                                                                           (3, 'Dining Out', 'Restaurants and takeaways', 'Leniston'),
                                                                           (4, 'Movies', 'Cinema and streaming', 'Leniston'),
                                                                           (4, 'Gaming', 'Video games and subscriptions', 'Leniston'),
                                                                           (5, 'Salary', 'Regular employment income', 'Leniston'),
                                                                           (5, 'Bonus', 'Additional work bonuses', 'Leniston');

-- Modify transactions table to use subcategories
ALTER TABLE transactions
    ADD COLUMN category_id INT,
ADD COLUMN subcategory_id INT,
ADD FOREIGN KEY (category_id) REFERENCES categories(id),
ADD FOREIGN KEY (subcategory_id) REFERENCES subcategories(id);