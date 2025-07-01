<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Category Management</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 2em;
            background-color: #f5f5f5;
        }
        .category-container {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 1em;
            margin: 2em 0;
        }
        .category-card {
            background: white;
            border: 1px solid #ddd;
            padding: 1em;
            border-radius: 4px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .subcategories {
            margin-left: 1em;
            margin-top: 0.5em;
        }
        .subcategory {
            padding: 0.5em 0;
            border-bottom: 1px solid #eee;
        }
        .form-group {
            background: white;
            padding: 1em;
            margin: 1em 0;
            border-radius: 4px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        input, select {
            padding: 0.5em;
            margin: 0.5em;
            border: 1px solid #ddd;
            border-radius: 4px;
        }
        button {
            padding: 0.5em 1em;
            margin: 0.2em;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
        button:hover {
            background: #45a049;
        }
        .delete-btn {
            background: #f44336;
        }
        .delete-btn:hover {
            background: #da190b;
        }
        .nav-links {
            margin-bottom: 2em;
        }
        .nav-links a {
            color: #4CAF50;
            text-decoration: none;
        }
        .nav-links a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
<div class="nav-links">
    <a href="index.php">← Back to Transactions</a>
</div>

<h1>Category Management</h1>

<div class="form-group">
    <h3>Add New Category</h3>
    <form id="category-form">
        <input type="text" id="category-name" placeholder="Category Name" required>
        <input type="text" id="category-desc" placeholder="Description">
        <button type="submit">Add Category</button>
    </form>
</div>

<div class="form-group">
    <h3>Add New Subcategory</h3>
    <form id="subcategory-form">
        <select id="parent-category" required>
            <option value="">Select Category</option>
        </select>
        <input type="text" id="subcategory-name" placeholder="Subcategory Name" required>
        <input type="text" id="subcategory-desc" placeholder="Description">
        <button type="submit">Add Subcategory</button>
    </form>
</div>

<div class="category-container" id="categories-list"></div>

<script src="categories.js"></script>
</body>
</html>