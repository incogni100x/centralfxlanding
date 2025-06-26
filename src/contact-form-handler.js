// Listens for the DOM to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {

    // --- CONFIGURATION ---
    // IMPORTANT: Replace this with your actual Supabase Edge Function URL
    const EDGE_FUNCTION_URL = 'https://haavtygoipkijmdtyooe.supabase.co/functions/v1/contact-submission';

    // --- FORM ELEMENT SELECTION ---
    const form = document.getElementById('contact-form');
    const submitButton = document.getElementById('contact-submit-btn');
    const submitButtonText = document.getElementById('submit-btn-text');
    const submitSpinner = document.getElementById('submit-spinner');
    const submitButtonIcon = document.getElementById('submit-btn-icon');
    const successMessage = document.getElementById('form-success-message');
    const errorMessage = document.getElementById('form-error-message');

    // --- EVENT LISTENER ---
    // Executes when the form is submitted
    form.addEventListener('submit', async (e) => {
        e.preventDefault(); // Prevents the default browser form submission
        
        // Hide any previous messages
        successMessage.classList.add('hidden');
        errorMessage.classList.add('hidden');

        // Update button to show "Sending..." state
        setSubmitting(true);

        // --- FORM DATA COLLECTION ---
        const formData = new FormData(form);
        const formValues = Object.fromEntries(formData.entries());

        try {
            // --- API REQUEST ---
            const response = await fetch(EDGE_FUNCTION_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    first_name: formValues.firstName,
                    last_name: formValues.lastName,
                    email: formValues.email,
                    phone: formValues.phone || '', // Send phone if it exists, otherwise empty string
                    subject: formValues.subject,
                    message: formValues.message,
                }),
            });
            
            // Throw an error if the network response is not OK
            if (!response.ok) {
                const errorBody = await response.text(); // Read the error response from the server
                throw new Error(`Network response was not ok: ${response.statusText}. Server message: ${errorBody}`);
            }

            // --- SUCCESS HANDLING ---
            showSuccess();

        } catch (error) {
            // --- ERROR HANDLING ---
            console.error('Submission failed:', error);
            showError();
        } finally {
            // --- CLEANUP ---
            // Re-enable the submit button regardless of outcome
            setSubmitting(false);
        }
    });

    // --- UI HELPER FUNCTIONS ---

    /**
     * Toggles the UI to a submitting state (disables button, shows spinner).
     * @param {boolean} isSubmitting - Whether the form is currently submitting.
     */
    function setSubmitting(isSubmitting) {
        submitButton.disabled = isSubmitting;
        if (isSubmitting) {
            submitButtonText.textContent = 'Sending...';
            submitSpinner.classList.remove('hidden');
            submitButtonIcon.classList.add('hidden');
        } else {
            submitButtonText.textContent = 'Send Message';
            submitSpinner.classList.add('hidden');
            submitButtonIcon.classList.remove('hidden');
        }
    }

    /**
     * Displays the success message and resets the form.
     */
    function showSuccess() {
        successMessage.classList.remove('hidden');
        form.reset();
    }

    /**
     * Displays the error message.
     */
    function showError() {
        errorMessage.classList.remove('hidden');
    }
}); 