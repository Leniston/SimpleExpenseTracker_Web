<?php
// index.php
require_once 'db_config.php'; // Include the database connection file

$message = ''; // Variable to store success or error messages

// Handle form submission for adding a new transaction
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['add_transaction'])) {
    // Sanitize and validate input
    $transaction_date = filter_input(INPUT_POST, 'transaction_date', FILTER_SANITIZE_STRING);
    $amount = filter_input(INPUT_POST, 'amount', FILTER_VALIDATE_FLOAT);
    $transaction_type = filter_input(INPUT_POST, 'transaction_type', FILTER_SANITIZE_STRING);
    $category = filter_input(INPUT_POST, 'category', FILTER_SANITIZE_STRING);
    $description = filter_input(INPUT_POST, 'description', FILTER_SANITIZE_STRING);
    // Checkbox returns 'on' if checked, otherwise it's not set in $_POST
    $is_necessary = isset($_POST['is_necessary']) ? 1 : 0;

    // Basic validation
    if (empty($transaction_date) || $amount === false || $amount <= 0 || empty($transaction_type) || empty($category)) {
        $message = "<div class='message error'>Please fill in all required fields correctly. Amount must be a positive number.</div>";
    } else {
        // Prepare an insert statement
        $sql = "INSERT INTO transactions (transaction_date, amount, transaction_type, category, description, is_necessary) VALUES (?, ?, ?, ?, ?, ?)";

        if ($stmt = $conn->prepare($sql)) {
            // Bind variables to the prepared statement as parameters
            $stmt->bind_param("sdsssi", $transaction_date, $amount, $transaction_type, $category, $description, $is_necessary);

            // Attempt to execute the prepared statement
            if ($stmt->execute()) {
                $message = "<div class='message success'>Transaction added successfully!</div>";
            } else {
                $message = "<div class='message error'>Error: Could not execute query: " . $stmt->error . "</div>";
            }

            // Close statement
            $stmt->close();
        } else {
            $message = "<div class='message error'>Error: Could not prepare query: " . $conn->error . "</div>";
        }
    }
}

// Fetch all transactions for display
$transactions = [];
$sql_select = "SELECT id, transaction_date, amount, transaction_type, category, description, is_necessary FROM transactions ORDER BY transaction_date DESC, id DESC";
if ($result = $conn->query($sql_select)) {
    while ($row = $result->fetch_assoc()) {
        $transactions[] = $row;
    }
    $result->free();
} else {
    $message .= "<div class='message error'>Error fetching transactions: " . $conn->error . "</div>";
}

// Close connection
$conn->close();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SimpleExpenseTracker</title> <!-- Updated site title -->
    <link rel="stylesheet" href="style.css">
    <script src="script.js" defer></script>
</head>
<body>
    <div class="container">
        <h1>SimpleExpenseTracker</h1> <!-- Updated main heading -->

        <nav>
            <ul>
                <li><a href="index.php" class="active">Add/View Transactions</a></li>
                <li><a href="reports.php">Reports</a></li>
                <li><a href="import.php">Import Bank Statement</a></li>
            </ul>
        </nav>

        <?php echo $message; // Display messages ?>

        <section class="add-transaction-section">
            <h2>Add New Transaction</h2>
            <form action="index.php" method="post" class="transaction-form" id="transactionForm">
                <div class="form-group">
                    <label for="transaction_date">Date:</label>
                    <input type="date" id="transaction_date" name="transaction_date" required value="<?php echo date('Y-m-d'); ?>">
                </div>

                <div class="form-group">
                    <label for="amount">Amount (€):</label>
                    <input type="number" id="amount" name="amount" step="0.01" min="0.01" required placeholder="e.g., 100.50">
                </div>

                <div class="form-group">
                    <label>Type:</label>
                    <div class="radio-group">
                        <input type="radio" id="type_income" name="transaction_type" value="income" required>
                        <label for="type_income">Income</label>
                        <input type="radio" id="type_expense" name="transaction_type" value="expense" required checked>
                        <label for="type_expense">Expense</label>
                    </div>
                </div>

                <div class="form-group">
                    <label for="category">Category:</label>
                    <select id="category" name="category" required>
                        <option value="">Select a Category</option>
                        <option value="Food">Food</option>
                        <option value="Transport">Transport</option>
                        <option value="Utilities">Utilities</option>
                        <option value="Rent">Rent</option>
                        <option value="Salary">Salary</option>
                        <option value="Freelance">Freelance</option>
                        <option value="Entertainment">Entertainment</option>
                        <option value="Health">Health</option>
                        <option value="Shopping">Shopping</option>
                        <option value="Investment">Investment</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="description">Description:</label>
                    <textarea id="description" name="description" rows="3" placeholder="e.g., Coffee with John, Monthly salary"></textarea>
                </div>

                <div class="form-group checkbox-group">
                    <input type="checkbox" id="is_necessary" name="is_necessary">
                    <label for="is_necessary">Necessary Expense?</label>
                </div>

                <button type="submit" name="add_transaction">Add Transaction</button>
            </form>
        </section>

        <section class="transaction-list-section">
            <h2>All Transactions</h2>
            <?php if (!empty($transactions)): ?>
                <div class="table-responsive">
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Type</th>
                                <th>Amount (€)</th>
                                <th>Category</th>
                                <th>Description</th>
                                <th>Necessary</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($transactions as $transaction): ?>
                                <tr class="<?php echo $transaction['transaction_type']; ?>">
                                    <td><?php echo htmlspecialchars($transaction['transaction_date']); ?></td>
                                    <td><?php echo ucfirst(htmlspecialchars($transaction['transaction_type'])); ?></td>
                                    <td class="amount-cell"><?php echo number_format(htmlspecialchars($transaction['amount']), 2); ?></td>
                                    <td><?php echo htmlspecialchars($transaction['category']); ?></td>
                                    <td><?php echo htmlspecialchars($transaction['description']); ?></td>
                                    <td>
                                        <?php if ($transaction['transaction_type'] == 'expense'): ?>
                                            <?php echo $transaction['is_necessary'] ? 'Yes' : 'No'; ?>
                                        <?php else: ?>
                                            N/A
                                        <?php endif; ?>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>
            <?php else: ?>
                <p>No transactions recorded yet. Add one above!</p>
            <?php endif; ?>
        </section>
    </div>
</body>
</html>
