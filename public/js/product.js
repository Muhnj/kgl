lucide.createIcons();

function formValidate() {
  let isValid = true;

  // Grab values
  const productname = document.getElementById("productname").value.trim();
  const productType = document.getElementById("productType").value.trim();
  const entryDate = document.getElementById("entryDate").value.trim();
  const tonnage = document.getElementById("tonnage").value.trim();
  const cost = document.getElementById("cost").value.trim();
  const sellingPrice = document.getElementById("sellingPrice").value.trim();
  const dealerName = document.getElementById("dealerName").value.trim();
  const dealerContact = document.getElementById("dealerContact").value.trim();
  const branch = document.getElementById("branch").value.trim();
  const productImage = document.getElementById("productImage").value.trim();
  const notes = document.getElementById("notes").value.trim();

  // Grab error spans
  const productnameError = document.getElementById("productnameError");
  const productTypeError = document.getElementById("productTypeError");
  const entryDateError = document.getElementById("entryDateError");
  const tonnageError = document.getElementById("tonnageError");
  const costError = document.getElementById("costError");
  const sellingPriceError = document.getElementById("sellingPriceError");
  const dealerNameError = document.getElementById("dealerNameError");
  const dealerContactError = document.getElementById("dealerContactError");
  const branchError = document.getElementById("branchError");
  const productImageError = document.getElementById("productImageError");
  const notesError = document.getElementById("notesError");

  // Clear previous errors
  [
    productnameError, productTypeError, entryDateError, tonnageError,
    costError, sellingPriceError, dealerNameError, dealerContactError,
    branchError, productImageError, notesError
  ].forEach(el => el.textContent = "");

  // Validate Product Name
  if (productname === "") {
    productnameError.textContent = "Please select a product name.";
    isValid = false;
  }

  // Validate Product Type
  if (productType === "") {
    productTypeError.textContent = "Please select a product type.";    
    isValid = false;
  }

  // Validate Entry Date
  if (entryDate === "") {
    entryDateError.textContent = "Please provide the entry date.";    
    isValid = false;
  }

  // Validate Tonnage
  if (tonnage === "" || isNaN(tonnage) || Number(tonnage) <= 0) {
    tonnageError.textContent = "Enter a valid tonnage (positive number).";    
    isValid = false;
  }

  // Validate Cost
  if (cost === "" || isNaN(cost) || Number(cost) <= 0) {
    costError.textContent = "Enter a valid cost amount.";
    isValid = false;
  }

  // Validate Selling Price
  if (sellingPrice === "" || isNaN(sellingPrice) || Number(sellingPrice) <= 0) {
    sellingPriceError.textContent = "Enter a valid selling price.";    
    isValid = false;
  }

  // Validate Dealer Name
  if (dealerName === "" || /\d/.test(dealerName) || dealerName.length < 2) {
    dealerNameError.textContent = "Enter a valid dealer name (no numbers, min 2 letters).";    
    isValid = false;
  }

  // Validate Dealer Contact
  if (dealerContact === "" || !/^\d{10,15}$/.test(dealerContact)) {
    dealerContactError.textContent = "Enter a valid dealer contact number (10-15 digits).";   
    isValid = false;
  }

  // Validate Branch
  if (branch === "") {
    branchError.textContent = "Please select a branch.";   
    isValid = false;
  }

  // Validate Product Image (optional)
  if (productImage === "" && !/\.(jpg|jpeg|png|gif)$/i.test(productImage)) {
    productImageError.textContent = "Only image files (jpg, jpeg, png, gif) are allowed.";    
    isValid = false;
  }

  // Validate Notes (optional)
  if (notes === "" && notes.length < 5) {
    notesError.textContent = "Notes must be at least 5 characters if provided.";    
    isValid = false;
  }

  // Return result of form validation
  if (isValid === true) {
    alert("Successfully Submitted!");
    return true;
  } else {
    return false;  // Prevent form submission if invalid
  }
}
document.addEventListener('DOMContentLoaded', () => {
  const dealerSelect = document.getElementById('dealerName');
  const customDealerGroup = document.getElementById('customDealerGroup');
  const customDealerInput = document.getElementById('customDealer');

  dealerSelect.addEventListener('change', () => {
    if (dealerSelect.value === 'Other') {
      customDealerGroup.style.display = 'block';
      customDealerInput.setAttribute('required', 'required');
    } else {
      customDealerGroup.style.display = 'none';
      customDealerInput.removeAttribute('required');
      customDealerInput.value = '';
    }
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  const localDateTime = new Date(now.getTime() - offset * 60000).toISOString().slice(0, 16);
  document.getElementById('entryDate').value = localDateTime;

  const productTypeMap = {
    beans: 'Legume',
    maize: 'Cereal',
    cowpeas: 'Legume',
    gnuts: 'Legume',
    soybeans: 'Legume'
  };

  const productSelect = document.getElementById('productname');
  const typeSelect = document.getElementById('productType');

  productSelect.addEventListener('change', () => {
    const selected = productSelect.value;
    typeSelect.value = productTypeMap[selected] || '';
  });
});
