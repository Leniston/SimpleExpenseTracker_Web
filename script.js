// script.js

document.addEventListener('DOMContentLoaded', function() {
    const transactionForm = document.getElementById('transactionForm');
    const deleteButtons = document.querySelectorAll('.delete-btn');
    const deleteConfirmationModal = document.getElementById('deleteConfirmationModal');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
    const closeModalBtn = deleteConfirmationModal.querySelector('.close-button');

    let transactionIdToDelete = null; // To store the ID of the transaction to be deleted

    // Function to show the custom modal
    function showModal(message) {
        const modalMessage = deleteConfirmationModal.querySelector('p');
        modalMessage.textContent = message;
        deleteConfirmationModal.style.display = 'flex'; // Use flex to center
    }

    // Function to hide the custom modal
    function hideModal() {
        deleteConfirmationModal.style.display = 'none';
    }

    // Override the default alert to use our custom modal (for form validation)
    // For now, we'll revert to original alert for simplicity in this specific case,
    // but the structure for a custom modal is in place.
    window.originalAlert = window.alert; // Store original alert
    window.alert = function(message) {
        // In a full application, you would integrate this with your custom modal.
        // For quick demo purposes, we'll use the browser's alert for validation messages.
        window.originalAlert(message);
    };


    if (transactionForm) {
        transactionForm.addEventListener('submit', function(event) {
            const amountInput = document.getElementById('amount');
            const amount = parseFloat(amountInput.value);

            // Basic client-side validation for amount
            if (isNaN(amount) || amount <= 0) {
                alert('Please enter a valid positive amount.');
                event.preventDefault(); // Stop form submission
                amountInput.focus();
                return false;
            }
        });
    }

    // Event listeners for delete buttons
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            transactionIdToDelete = this.dataset.id; // Get the ID from the data-id attribute
            showModal('Are you sure you want to delete this transaction?');
        });
    });

    // Confirm deletion
    confirmDeleteBtn.addEventListener('click', function() {
        if (transactionIdToDelete) {
            // Redirect to PHP script with delete_id parameter
            window.location.href = `index.php?delete_id=${transactionIdToDelete}`;
        }
        hideModal();
    });

    // Cancel deletion
    cancelDeleteBtn.addEventListener('click', function() {
        hideModal();
        transactionIdToDelete = null; // Clear the ID
    });

    // Close modal using the 'x' button
    closeModalBtn.addEventListener('click', function() {
        hideModal();
        transactionIdToDelete = null;
    });

    // Close modal if user clicks outside of the modal content
    window.addEventListener('click', function(event) {
        if (event.target == deleteConfirmationModal) {
            hideModal();
            transactionIdToDelete = null;
        }
    });

    // Handle pre-filling the form for editing
    // This part is mostly handled by PHP, but if we had dynamic content loading,
    // JS would fetch data and populate the form. For now, the PHP handles it on page load.
    // The "Cancel Edit" button is handled by a simple redirect in its onclick attribute in HTML.
});
