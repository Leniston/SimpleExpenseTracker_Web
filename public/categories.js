const apiBase = '../backend/';

function fetchCategories() {
    fetch(apiBase + 'fetch_categories.php')
        .then(res => res.json())
        .then(data => {
            const container = document.getElementById('categories-list');
            const parentSelect = document.getElementById('parent-category');

            container.innerHTML = '';
            parentSelect.innerHTML = '<option value="">Select Category</option>';

            data.forEach(category => {
                parentSelect.innerHTML += `
                    <option value="${category.id}">${category.name}</option>
                `;

                const card = document.createElement('div');
                card.className = 'category-card';
                card.innerHTML = `
                    <h3>${category.name}</h3>
                    <p>${category.description || ''}</p>
                    <div class="subcategories">
                        ${category.subcategories.map(sub => `
                            <div class="subcategory">
                                • ${sub.name}
                                <button class="delete-btn" onclick="deleteSubcategory(${sub.id})">Delete</button>
                            </div>
                        `).join('')}
                    </div>
                    <div class="actions">
                        <button onclick="editCategory(${category.id}, '${category.name}')">Edit</button>
                        <button class="delete-btn" onclick="deleteCategory(${category.id})">Delete</button>
                    </div>
                `;
                container.appendChild(card);
            });
        });
}

document.getElementById('category-form').onsubmit = function(e) {
    e.preventDefault();
    const data = {
        name: document.getElementById('category-name').value,
        description: document.getElementById('category-desc').value
    };

    fetch(apiBase + 'add_category.php', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    })
        .then(res => res.json())
        .then(() => {
            this.reset();
            fetchCategories();
        });
};

document.getElementById('subcategory-form').onsubmit = function(e) {
    e.preventDefault();
    const data = {
        category_id: document.getElementById('parent-category').value,
        name: document.getElementById('subcategory-name').value,
        description: document.getElementById('subcategory-desc').value
    };

    fetch(apiBase + 'add_subcategory.php', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    })
        .then(res => res.json())
        .then(() => {
            this.reset();
            fetchCategories();
        });
};

window.deleteCategory = function(id) {
    if (!confirm('Delete this category and all its subcategories?')) return;
    fetch(apiBase + 'delete_category.php?id=' + id)
        .then(() => fetchCategories());
};

window.deleteSubcategory = function(id) {
    if (!confirm('Delete this subcategory?')) return;
    fetch(apiBase + 'delete_subcategory.php?id=' + id)
        .then(() => fetchCategories());
};

window.editCategory = function(id, currentName) {
    const newName = prompt('Enter new category name:', currentName);
    if (!newName) return;

    fetch(apiBase + 'edit_category.php', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({id, name: newName})
    })
        .then(() => fetchCategories());
};

fetchCategories();