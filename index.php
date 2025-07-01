<?php
// index.php
require_once 'db_config.php'; // Include the database connection file

$message = ''; // Variable to store success or error messages
$edit_transaction_data = null; // Variable to store data of transaction being edited

// Handle form submission for adding a new transaction
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['add_transaction'])) {
    // Sanitize and validate input
    $transaction_date = filter_input(INPUT_POST, 'transaction_date', FILTER_SANITIZE_STRING);
    $amount = filter_input(INPUT_POST, 'amount', FILTER_VALIDATE_FLOAT);
    $transaction_type = filter_input(INPUT_POST, 'transaction_type', FILTER_SANITIZE_STRING);
    $category = filter_input(INPUT_POST, 'category', FILTER_SANITIZE_STRING);
    $description = filter_input(INPUT_POST, 'description', FILTER_SANITIZE_STRING);
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

// Handle form submission for updating an existing transaction
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['update_transaction'])) {
    $id = filter_input(INPUT_POST, 'transaction_id', FILTER_VALIDATE_INT);
    $transaction_date = filter_input(INPUT_POST, 'transaction_date', FILTER_SANITIZE_STRING);
    $amount = filter_input(INPUT_POST, 'amount', FILTER_VALIDATE_FLOAT);
    $transaction_type = filter_input(INPUT_POST, 'transaction_type', FILTER_SANITIZE_STRING);
    $category = filter_input(INPUT_POST, 'category', FILTER_SANITIZE_STRING);
    $description = filter_input(INPUT_POST, 'description', FILTER_SANITIZE_STRING);
    $is_necessary = isset($_POST['is_necessary']) ? 1 : 0;

    if ($id === false || empty($transaction_date) || $amount === false || $amount <= 0 || empty($transaction_type) || empty($category)) {
        $message = "<div class='message error'>Error updating transaction: Invalid input.</div>";
    } else {
        $sql = "UPDATE transactions SET transaction_date = ?, amount = ?, transaction_type = ?, category = ?, description = ?, is_necessary = ? WHERE id = ?";
        if ($stmt = $conn->prepare($sql)) {
            $stmt->bind_param("sdsssi", $transaction_date, $amount, $transaction_type, $category, $description, $is_necessary, $id);
            if ($stmt->execute()) {
                $message = "<div class='message success'>Transaction updated successfully!</div>";
            } else {
                $message = "<div class='message error'>Error updating transaction: " . $stmt->error . "</div>";
            }
            $stmt->close();
        } else {
            $message = "<div class='message error'>Error preparing update query: " . $conn->error . "</div>";
        }
    }
}

// Handle deletion of a transaction
if (isset($_GET['delete_id']) && !empty($_GET['delete_id'])) {
    $id_to_delete = filter_input(INPUT_GET, 'delete_id', FILTER_VALIDATE_INT);

    if ($id_to_delete === false) {
        $message = "<div class='message error'>Invalid transaction ID for deletion.</div>";
    } else {
        $sql_delete = "DELETE FROM transactions WHERE id = ?";
        if ($stmt = $conn->prepare($sql_delete)) {
            $stmt->bind_param("i", $id_to_delete);
            if ($stmt->execute()) {
                $message = "<div class='message success'>Transaction deleted successfully!</div>";
            } else {
                $message = "<div class='message error'>Error deleting transaction: " . $stmt->error . "</div>";
            }
            $stmt->close();
        } else {
            $message = "<div class='message error'>Error preparing delete query: " . $conn->error . "</div>";
        }
    }
    // Redirect to clear the GET parameter after deletion
    header("Location: index.php");
    exit();
}

// Handle editing a transaction (pre-fill form)
if (isset($_GET['edit_id']) && !empty($_GET['edit_id'])) {
    $id_to_edit = filter_input(INPUT_GET, 'edit_id', FILTER_VALIDATE_INT);

    if ($id_to_edit === false) {
        $message = "<div class='message error'>Invalid transaction ID for editing.</div>";
    } else {
        $sql_edit = "SELECT id, transaction_date, amount, transaction_type, category, description, is_necessary FROM transactions WHERE id = ?";
        if ($stmt = $conn->prepare($sql_edit)) {
            $stmt->bind_param("i", $id_to_edit);
            if ($stmt->execute()) {
                $result = $stmt->get_result();
                if ($result->num_rows == 1) {
                    $edit_transaction_data = $result->fetch_assoc();
                } else {
                    $message = "<div class='message error'>Transaction not found for editing.</div>";
                }
            } else {
                $message = "<div class='message error'>Error fetching transaction for editing: " . $stmt->error . "</div>";
            }
            $stmt->close();
        } else {
            $message = "<div class='message error'>Error preparing edit query: " . $conn->error . "</div>";
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
    <title>SimpleExpenseTracker</title>
    <link rel="stylesheet" href="style.css">
    <script src="script.js" defer></script>
</head>
<body>
    <div class="container">
        <h1>SimpleExpenseTracker</h1>

        <nav>
            <ul>
                <li><a href="index.php" class="active">Add/View Transactions</a></li>
                <li><a href="reports.php">Reports</a></li>
                <li><a href="import.php">Import Bank Statement</a></li>
            </ul>
        </nav>

        <?php echo $message; // Display messages ?>

        <section class="add-transaction-section">
            <h2><?php echo $edit_transaction_data ? 'Edit Transaction' : 'Add New Transaction'; ?></h2>
            <form action="index.php" method="post" class="transaction-form" id="transactionForm">
                <?php if ($edit_transaction_data): ?>
                    <input type="hidden" name="transaction_id" value="<?php echo htmlspecialchars($edit_transaction_data['id']); ?>">
                <?php endif; ?>

                <div class="form-group">
                    <label for="transaction_date">Date:</label>
                    <input type="date" id="transaction_date" name="transaction_date" required value="<?php echo htmlspecialchars($edit_transaction_data['transaction_date'] ?? date('Y-m-d')); ?>">
                </div>

                <div class="form-group">
                    <label for="amount">Amount (€):</label>
                    <input type="number" id="amount" name="amount" step="0.01" min="0.01" required placeholder="e.g., 100.50" value="<?php echo htmlspecialchars($edit_transaction_data['amount'] ?? ''); ?>">
                </div>

                <div class="form-group">
                    <label>Type:</label>
                    <div class="radio-group">
                        <input type="radio" id="type_income" name="transaction_type" value="income" required <?php echo ($edit_transaction_data && $edit_transaction_data['transaction_type'] == 'income') ? 'checked' : ''; ?>>
                        <label for="type_income">Income</label>
                        <input type="radio" id="type_expense" name="transaction_type" value="expense" required <?php echo ($edit_transaction_data && $edit_transaction_data['transaction_type'] == 'expense') ? 'checked' : 'checked'; ?>>
                        <label for="type_expense">Expense</label>
                    </div>
                </div>

                <div class="form-group">
                    <label for="category">Category:</label>
                    <select id="category" name="category" required>
                        <option value="">Select a Category</option>
                        <?php
                        $categories = ['Food', 'Transport', 'Utilities', 'Rent', 'Salary', 'Freelance', 'Entertainment', 'Health', 'Shopping', 'Investment', 'Other'];
                        foreach ($categories as $cat) {
                            $selected = ($edit_transaction_data && $edit_transaction_data['category'] == $cat) ? 'selected' : '';
                            echo "<option value=\"{$cat}\" {$selected}>{$cat}</option>";
                        }
                        ?>
                    </select>
                </div>

                <div class="form-group">
                    <label for="description">Description:</label>
                    <textarea id="description" name="description" rows="3" placeholder="e.g., Coffee with John, Monthly salary"><?php echo htmlspecialchars($edit_transaction_data['description'] ?? ''); ?></textarea>
                </div>

                <div class="form-group checkbox-group">
                    <input type="checkbox" id="is_necessary" name="is_necessary" <?php echo ($edit_transaction_data && $edit_transaction_data['is_necessary']) ? 'checked' : ''; ?>>
                    <label for="is_necessary">Necessary Expense?</label>
                </div>

                <button type="submit" name="<?php echo $edit_transaction_data ? 'update_transaction' : 'add_transaction'; ?>">
                    <?php echo $edit_transaction_data ? 'Update Transaction' : 'Add Transaction'; ?>
                </button>
                <?php if ($edit_transaction_data): ?>
                    <button type="button" class="cancel-edit-btn" onclick="window.location.href='index.php'">Cancel Edit</button>
                <?php endif; ?>
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
                                <th>Actions</th> <!-- New column for actions -->
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
                                    <td class="actions-cell">
                                        <a href="index.php?edit_id=<?php echo htmlspecialchars($transaction['id']); ?>" class="action-btn edit-btn">Edit</a>
                                        <button type="button" class="action-btn delete-btn" data-id="<?php echo htmlspecialchars($transaction['id']); ?>">Delete</button>
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

    <!-- Delete Confirmation Modal -->
    <div id="deleteConfirmationModal" class="modal">
        <div class="modal-content">
            <span class="close-button">&times;</span>
            <h2>Confirm Deletion</h2>
            <p>Are you sure you want to delete this transaction?</p>
            <div class="modal-actions">
                <button id="confirmDeleteBtn" class="action-btn delete-btn">Delete</button>
                <button id="cancelDeleteBtn" class="action-btn cancel-btn">Cancel</button>
            </div>
        </div>
    </div>
</body>
</html>
