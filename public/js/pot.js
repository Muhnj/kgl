document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('procurementForm');
    const requiredFields = [
        'productname', 'productType', 'entryDate', 'tonnage', 
        'cost', 'sellingPrice', 'dealerName', 'dealerContact', 'branch'
    ];

    // Remove inline onsubmit handler from HTML
    form.onsubmit = null;

    // Add proper event listeners
    form.addEventListener('submit', handleSubmit);
    form.querySelectorAll('input, select').forEach(field => {
        field.addEventListener('input', handleValidation);
        if (field.tagName === 'SELECT') {
            field.addEventListener('change', handleValidation);
        }
    });

    function handleValidation(e) {
        const field = e.target;
        const errorElement = document.getElementById(`${field.name}Error`);
        validateField(field, errorElement);
    }

    function validateField(field, errorElement) {
        let isValid = true;
        const value = field.value.trim();
        const fieldName = field.labels?.[0]?.textContent || field.name;

        // Clear previous error
        errorElement.textContent = '';
        field.classList.remove('input-error');

        // Required validation
        if (field.required && !value) {
            errorElement.textContent = `${fieldName} is required`;
            isValid = false;
        }

        // Type-specific validation
        if (isValid && value) {
            switch(field.name) {
                case 'tonnage':
                case 'cost':
                case 'sellingPrice':
                    if (isNaN(value) || value <= 0) {
                        errorElement.textContent = `Please enter a valid positive number`;
                        isValid = false;
                    }
                    break;
                
                case 'dealerContact':
                    if (!/^(\+?256|0)[7]\d{8}$/.test(value)) {
                        errorElement.textContent = 'Invalid UG phone number format (e.g. 07XXXXXXXX or +2567XXXXXXXX)';
                        isValid = false;
                    }
                    break;
                
                case 'entryDate':
                    const selectedDate = new Date(value);
                    if (selectedDate > new Date()) {
                        errorElement.textContent = 'Date cannot be in the future';
                        isValid = false;
                    }
                    break;
            }
        }

        if (!isValid) {
            field.classList.add('input-error');
        }

        return isValid;
    }

    function handleSubmit(e) {
        e.preventDefault();
        let formIsValid = true;

        // Validate all required fields
        requiredFields.forEach(fieldName => {
            const field = form.elements[fieldName];
            const errorElement = document.getElementById(`${fieldName}Error`);
            const isValid = validateField(field, errorElement);
            if (!isValid) formIsValid = false;
        });

        // Validate file input
        const fileInput = form.elements.image;
        const fileError = document.getElementById('productImageError');
        if (fileInput.files.length > 0) {
            const validTypes = ['image/jpeg', 'image/png'];
            const maxSize = 2 * 1024 * 1024; // 2MB
            
            if (!validTypes.includes(fileInput.files[0].type)) {
                fileError.textContent = 'Only JPG/PNG files allowed';
                formIsValid = false;
            } else if (fileInput.files[0].size > maxSize) {
                fileError.textContent = 'File size must be less than 2MB';
                formIsValid = false;
            }
        }

        if (formIsValid) {
            // Add loading state
            const submitBtn = form.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<span class="icon" data-lucide="loader"></span> Processing...`;
            lucide.createIcons();

            // Submit the form programmatically
            form.submit();
        } else {
            // Scroll to first error
            const firstError = document.querySelector('.input-error');
            if (firstError) {
                firstError.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }
        }
    }
});