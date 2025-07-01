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
                        <button onclick="editTransaction(${JSON.stringify(tx)})">Edit</button>
                        <button onclick="deleteTransaction(${tx.id})">Delete</button>
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
// XLS Import Modal
const xlsBtn = document.getElementById('import-xls-btn');
const xlsModal = document.getElementById('import-xls-modal');
const xlsSubmit = document.getElementById('import-xls-submit');
const xlsCancel = document.getElementById('import-xls-cancel');
const xlsFileInput = document.getElementById('xls-file-input');
const xlsError = document.getElementById('xls-import-error');

xlsBtn.onclick = () => {
    xlsModal.style.display = 'flex';
    xlsFileInput.value = '';
    xlsError.textContent = '';
};

xlsCancel.onclick = () => {
    xlsModal.style.display = 'none';
    xlsError.textContent = '';
};

// Helper to parse European formatted numbers
function parseEuro(str) {
    if (!str || str === '-' || str.trim() === '') return 0;
    // Remove € and spaces, handle commas/dots
    str = str.replace(/[€,\s]/g, '').replace('--', '0');
    return parseFloat(str.replace(',', '.'));
}

// Date helper: convert DD/MM/YYYY to YYYY-MM-DD
function parseDate(d) {
    if (!d) return '';
    const parts = d.split('/');
    if (parts.length !== 3) return d;
    return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
}

xlsSubmit.onclick = () => {
    xlsError.textContent = '';
    if (!xlsFileInput.files.length) {
        xlsError.textContent = 'Please select an XLS or XLSX file.';
        return;
    }

    const file = xlsFileInput.files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const wb = XLSX.read(e.target.result, {type: 'binary'});
            const ws = wb.Sheets[wb.SheetNames[0]];
            const data = XLSX.utils.sheet_to_json(ws, {header:1});
            if (data.length < 2) {
                xlsError.textContent = 'No data found in file.';
                return;
            }
            // Find header indexes
            const headers = data[0].map(h => h && h.toString().toLowerCase().trim());
            const idxDate = headers.indexOf('date');
            const idxDesc = headers.indexOf('description');
            const idxIn = headers.findIndex(h => h && h.includes('money in'));
            const idxOut = headers.findIndex(h => h && h.includes('money out'));

            if (idxDate === -1 || idxDesc === -1 || idxIn === -1 || idxOut === -1) {
                xlsError.textContent = 'Incorrect headers. Expected: Date, Description, Money In, Money Out';
                return;
            }

            // Parse rows
            const transactions = [];
            for (let i = 1; i < data.length; i++) {
                const row = data[i];
                if (!row[idxDate] || !row[idxDesc]) continue; // skip empty
                const moneyIn = parseEuro(row[idxIn]);
                const moneyOut = parseEuro(row[idxOut]);
                let type, amount;
                if (moneyIn > 0) {
                    type = 'income';
                    amount = moneyIn;
                } else if (moneyOut < 0) { // negative for outflow
                    type = 'expense';
                    amount = -moneyOut; // make positive
                } else if (moneyOut > 0) {
                    // Some banks use positive for outflow
                    type = 'expense';
                    amount = moneyOut;
                } else {
                    continue; // skip if no money in or out
                }
                transactions.push({
                    name: row[idxDesc],
                    date: parseDate(row[idxDate]),
                    amount: amount,
                    category: '', // blank, user can edit later
                    type: type,
                    necessity: type === 'income' ? '' : ''
                });
            }

            if (!transactions.length) {
                xlsError.textContent = 'No valid transactions found.';
                return;
            }

            // Send to backend
            fetch(apiBase + 'import_csv.php', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({transactions})
            }).then(res => res.json()).then(resp => {
                if(resp.success){
                    xlsModal.style.display = 'none';
                    fetchTransactions();
                } else {
                    xlsError.textContent = 'Import failed: ' + (resp.error || 'Unknown error');
                }
            });

        } catch (err) {
            xlsError.textContent = 'Error parsing file: ' + err.message;
        }
    };
    reader.readAsBinaryString(file);
};
fetchTransactions();