const apiBase = '../backend/';

function fetchTransactions() {
    fetch(apiBase + 'fetch_transactions.php')
        .then(res => res.json())
        .then(data => {
            const tbody = document.querySelector('#transactions-table tbody');
            tbody.innerHTML = '';
            data.forEach(tx => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${tx.name}</td>
                    <td>${tx.date}</td>
                    <td>${tx.amount}</td>
                    <td>${tx.category}</td>
                    <td>${tx.type}</td>
                    <td>${tx.necessity}</td>
                    <td>
                        <button onclick='editTransaction(${JSON.stringify(tx)})'>Edit</button>
                        <button onclick='deleteTransaction(${tx.id})'>Delete</button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        });
}

function handleNecessityBox() {
    const type = document.getElementById('type').value;
    const necessity = document.getElementById('necessity');
    if (type === 'income') {
        necessity.value = '';
        necessity.disabled = true;
    } else {
        necessity.disabled = false;
        if (necessity.value === '') necessity.value = 'necessary';
    }
}

document.getElementById('type').addEventListener('change', handleNecessityBox);
window.addEventListener('DOMContentLoaded', handleNecessityBox);

document.getElementById('transaction-form').onsubmit = function(e) {
    e.preventDefault();
    const id = document.getElementById('transaction-id').value;
    const typeValue = document.getElementById('type').value;
    const necessityValue = (typeValue === 'income') ? '' : document.getElementById('necessity').value;
    const data = {
        id,
        name: document.getElementById('name').value,
        date: document.getElementById('date').value,
        amount: parseFloat(document.getElementById('amount').value),
        category: document.getElementById('category').value,
        type: typeValue,
        necessity: necessityValue
    };
    fetch(apiBase + (id ? 'edit_transaction.php' : 'add_transaction.php'), {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    }).then(() => {
        this.reset();
        document.getElementById('transaction-id').value = '';
        fetchTransactions();
        handleNecessityBox();
    });
};

window.editTransaction = function(tx) {
    document.getElementById('transaction-id').value = tx.id;
    document.getElementById('name').value = tx.name;
    document.getElementById('date').value = tx.date;
    document.getElementById('amount').value = tx.amount;
    document.getElementById('category').value = tx.category;
    document.getElementById('type').value = tx.type;
    document.getElementById('necessity').value = tx.necessity;
    handleNecessityBox();
};

window.deleteTransaction = function(id) {
    if (!confirm('Delete this transaction?')) return;
    fetch(apiBase + 'delete_transaction.php?id=' + id)
        .then(() => fetchTransactions());
};

function parseEuro(str) {
    if (!str || str === '-' || String(str).trim() === '') return 0;
    str = String(str).replace(/[€,\s]/g, '').replace('--', '0');
    return parseFloat(str.replace(',', '.'));
}

function parseDate(d) {
    if (!d) return '';
    const parts = String(d).split('/');
    if (parts.length !== 3) return d;
    return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
}

function showUploadStatus(message, isError = false) {
    const status = document.getElementById('upload-status');
    status.textContent = message;
    status.className = isError ? 'error' : 'success';
}

// File upload handling
document.getElementById('csv-upload-btn').onclick = () => {
    document.getElementById('csv-file').click();
};

document.getElementById('csv-file').onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    showUploadStatus('Processing...');

    try {
        const content = await file.text();
        const lines = content.split('\n');
        const txStartIndex = lines.findIndex(line =>
            line.includes('Date') && line.includes('Description') && line.includes('Money In'));

        if (txStartIndex === -1) {
            throw new Error('Invalid PTSB statement format');
        }

        const transactions = [];
        for (let i = txStartIndex + 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line || line.startsWith('This statement')) break;

            const cols = line.split(',');
            if (cols.length < 5 || !cols[0]) continue;

            const date = cols[0].trim();
            const desc = cols[2].trim();
            const moneyIn = cols[3].trim();
            const moneyOut = cols[4].trim();

            let type, amount;
            if (moneyIn && moneyIn !== '-') {
                type = 'income';
                amount = parseEuro(moneyIn);
            } else if (moneyOut && moneyOut !== '-') {
                type = 'expense';
                amount = Math.abs(parseEuro(moneyOut));
            } else {
                continue;
            }

            if (isNaN(amount)) continue;

            transactions.push({
                name: desc,
                date: parseDate(date),
                amount: amount,
                category: '',
                type: type,
                necessity: type === 'income' ? '' : 'necessary'
            });
        }

        if (transactions.length === 0) {
            throw new Error('No valid transactions found');
        }

        const response = await fetch(apiBase + 'import_csv.php', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({transactions})
        });

        const result = await response.json();
        if (!result.success) {
            throw new Error(result.error || 'Import failed');
        }

        showUploadStatus(`Successfully imported ${transactions.length} transactions`);
        fetchTransactions();

    } catch (err) {
        showUploadStatus(err.message, true);
        console.error('Import error:', err);
    }

    e.target.value = '';
};

fetchTransactions();