// script.js

document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM Content Loaded.");

    const transactionForm = document.getElementById('transactionForm');
    const deleteButtons = document.querySelectorAll('.delete-btn');
    const deleteConfirmationModal = document.getElementById('deleteConfirmationModal');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
    const closeModalBtn = deleteConfirmationModal.querySelector('.close-button');

    let transactionIdToDelete = null; // To store the ID of the transaction to be deleted

    // Function to show the custom modal
    function showModal(message) {
        console.log("Showing modal with message:", message);
        const modalMessage = deleteConfirmationModal.querySelector('p');
        modalMessage.textContent = message;
        deleteConfirmationModal.style.display = 'flex'; // Use flex to center
    }

    // Function to hide the custom modal
    function hideModal() {
        console.log("Hiding modal.");
        deleteConfirmationModal.style.display = 'none';
    }

    // Override the default alert to use our custom modal (for form validation)
    // For now, we'll revert to original alert for simplicity in this specific case,
    // but the structure for a custom modal is in place.
    window.originalAlert = window.alert; // Store original alert
    window.alert = function(message) {
        console.log("Custom Alert (via console.log):", message);
        // In a a full application, you would display a custom modal here.
        // For quick demo purposes, we'll use the browser's alert for validation messages.
        window.originalAlert(message);
    };


    if (transactionForm) {
        transactionForm.addEventListener('submit', function(event) {
            console.log("Transaction form submitted.");
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
            console.log("Delete button clicked. ID to delete:", transactionIdToDelete);
            showModal('Are you sure you want to delete this transaction?');
        });
    });

    // Confirm deletion
    confirmDeleteBtn.addEventListener('click', function() {
        console.log("Confirm Delete button clicked. Final ID:", transactionIdToDelete);
        if (transactionIdToDelete) {
            // Redirect to PHP script with delete_id parameter
            window.location.href = `index.php?delete_id=${transactionIdToDelete}`;
        }
        hideModal(); // Hide modal even if ID is null (shouldn't happen if triggered by button)
    });

    // Cancel deletion
    cancelDeleteBtn.addEventListener('click', function() {
        console.log("Cancel Delete button clicked.");
        hideModal();
        transactionIdToDelete = null; // Clear the ID
    });

    // Close modal using the 'x' button
    closeModalBtn.addEventListener('click', function() {
        console.log("Close modal 'x' button clicked.");
        hideModal();
        transactionIdToDelete = null;
    });

    // Close modal if user clicks outside of the modal content
    window.addEventListener('click', function(event) {
        if (event.target == deleteConfirmationModal) {
            console.log("Clicked outside modal. Hiding modal.");
            hideModal();
            transactionIdToDelete = null;
        }
    });
});
