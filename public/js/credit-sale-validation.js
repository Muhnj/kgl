document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const fields = [
    "saletonnage",
    "saleDate",
    "saleTime",
    "totalAmount",
    "buyerName",
    "buyerContact",
    "location",
    "nationalId",
    "dueDate",
    "dispatchDate"
  ];

  form.addEventListener("submit", function (e) {
    let isValid = true;

    // Clear all previous error messages
    fields.forEach((field) => {
      const errorSpan = document.querySelector(`#error-${field}`);
      if (errorSpan) errorSpan.textContent = "";
    });

    // Validate each field
    const getValue = (name) => form.elements[name]?.value.trim();

    // Tonnage
    const tonnage = parseFloat(getValue("saletonnage"));
    if (isNaN(tonnage) || tonnage <= 0) {
      showError("saletonnage", "Tonnage must be a positive number");
      isValid = false;
    }

    // Sale Date
    if (!getValue("saleDate")) {
      showError("saleDate", "Sale date is required");
      isValid = false;
    }

    // Sale Time
    if (!getValue("saleTime")) {
      showError("saleTime", "Sale time is required");
      isValid = false;
    }

    // Total Amount
    const totalAmount = parseFloat(getValue("totalAmount"));
    if (isNaN(totalAmount) || totalAmount <= 0) {
      showError("totalAmount", "Total amount must be a positive number");
      isValid = false;
    }

    // Buyer Name
    if (getValue("buyerName").length < 3) {
      showError("buyerName", "Buyer name must be at least 3 characters");
      isValid = false;
    }

    // Buyer Contact
    const contact = getValue("buyerContact");
    if (!/^\+?[0-9]{9,15}$/.test(contact)) {
      showError("buyerContact", "Enter a valid phone number (9–15 digits)");
      isValid = false;
    }

    // Location
    if (getValue("location").length < 3) {
      showError("location", "Location must be at least 3 characters");
      isValid = false;
    }

    // National ID
    const nationalId = getValue("nationalId");
    if (!/^[A-Z0-9]{5,20}$/i.test(nationalId)) {
      showError("nationalId", "Enter a valid national ID (alphanumeric)");
      isValid = false;
    }

    // Due Date
    if (!getValue("dueDate")) {
      showError("dueDate", "Due date is required");
      isValid = false;
    }

    // Dispatch Date
    if (!getValue("dispatchDate")) {
      showError("dispatchDate", "Dispatch date is required");
      isValid = false;
    }

    // Block form submission if any error
    if (!isValid) {
      e.preventDefault();
    }
  });

  function showError(field, message) {
    const errorSpan = document.querySelector(`#error-${field}`);
    if (errorSpan) {
      errorSpan.textContent = message;
    }
  }
});


document.addEventListener('DOMContentLoaded', function () {
  const tonnageInput = document.getElementById('tonnage');
  const priceInput = document.getElementById('sellingPrice');
  const totalAmountInput = document.getElementById('totalAmount');

  // Function to calculate and update total amount
  function updateTotal() {
    const tonnage = parseFloat(tonnageInput.value) || 0;
    const price = parseFloat(priceInput.value) || 0;
    const total = tonnage * price;
    totalAmountInput.value = total.toLocaleString('en-UG', { style: 'currency', currency: 'UGX', minimumFractionDigits: 0 });
  }

  // Add event listeners to recalculate when tonnage or price is changed
  tonnageInput.addEventListener('input', updateTotal);
  priceInput.addEventListener('input', updateTotal);

  // Initialize total amount on page load
  updateTotal();
});