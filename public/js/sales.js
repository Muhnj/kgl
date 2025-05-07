function validateSalesForm() {
  let tonnage = document.getElementById("tonnage").value.trim();
  let saleDate = document.getElementById("saleDate").value.trim();
  let buyerName = document.getElementById("buyerName").value.trim();
  let buyerContact = document.getElementById("buyerContact").value.trim();
  let branch = document.getElementById("branch").value.trim();
  let agentName = document.getElementById("agentname").value.trim();

  let tonnageErr = document.getElementById("tonnageError");
  let saleDateErr = document.getElementById("saleDateError");
  let buyerNameErr = document.getElementById("buyerNameError");
  let buyerContactErr = document.getElementById("buyerContactError");
  let branchErr = document.getElementById("branchError");
  let agentNameErr = document.getElementById("agentNameError");

  let isValid = true;

  // Clear previous error messages
  tonnageErr.textContent = "";
  saleDateErr.textContent = "";
  buyerNameErr.textContent = "";
  buyerContactErr.textContent = "";
  branchErr.textContent = "";
  agentNameErr.textContent = "";

  // Tonnage validation
  if (tonnage === "" || isNaN(tonnage) || Number(tonnage) <= 0) {
    tonnageErr.textContent = "Tonnage must be a positive number.";
    isValid = false;
  }

  // Sale Date validation
  if (saleDate === "") {
    saleDateErr.textContent = "Please select the date of sale.";
    isValid = false;
  }

  // Buyer Name validation
  if (buyerName === "" || buyerName.length < 2 || /\d/.test(buyerName)) {
    buyerNameErr.textContent = "Enter a valid name (min 2 letters, no numbers).";
    isValid = false;
  }

  // Buyer Contact validation
  if (buyerContact === "" || !/^\d{10,15}$/.test(buyerContact)) {
    buyerContactErr.textContent = "Enter a valid contact number (10-15 digits).";
    isValid = false;
  }

  // Branch validation
  if (branch === "") {
    branchErr.textContent = "Branch is required.";
    isValid = false;
  }

  // Agent Name validation
  if (agentName === "") {
    agentNameErr.textContent = "Agent name is required.";
    isValid = false;
  }

  return isValid;
}
document.addEventListener('DOMContentLoaded', function () {
  // Set current date and time for the saleDate field
  const now = new Date();
  const formattedDate = now.toISOString().slice(0, 16); // 'YYYY-MM-DDTHH:MM'
  document.getElementById('saleDate').value = formattedDate;

  // Other validation or functionality...
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
