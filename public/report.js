fetch('../backend/report.php')
    .then(res => res.json())
    .then(data => {
        document.getElementById('report-data').innerHTML = `
            <ul>
                <li><strong>Total Income:</strong> $${Number(data.total_income).toFixed(2)}</li>
                <li><strong>Total Expense:</strong> $${Number(data.total_expense).toFixed(2)}</li>
                <li><strong>Balance:</strong> $${Number(data.balance).toFixed(2)}</li>
                <li><strong>Necessary Expenses:</strong> $${Number(data.necessary_expense).toFixed(2)}</li>
                <li><strong>Unnecessary Expenses:</strong> $${Number(data.unnecessary_expense).toFixed(2)}</li>
            </ul>
        `;
    });