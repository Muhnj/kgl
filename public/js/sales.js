
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

  tonnageErr.textContent = "";
  saleDateErr.textContent = "";
  buyerNameErr.textContent = "";
  buyerContactErr.textContent = "";
  branchErr.textContent = "";
  agentNameErr.textContent = "";

  let isValid = true;

  if (tonnage === "" || isNaN(tonnage) || Number(tonnage) <= 0) {
    tonnageErr.textContent = "Tonnage must be a positive number.";
    isValid = false;
  }

  if (saleDate === "") {
    saleDateErr.textContent = "Please select the date of sale.";
    isValid = false;
  }

  if (buyerName === "" || buyerName.length < 2 || /\d/.test(buyerName)) {
    buyerNameErr.textContent = "Enter a valid name (min 2 letters, no numbers).";
    isValid = false;
  }

  if (buyerContact === "" || !/^\d{10,15}$/.test(buyerContact)) {
    buyerContactErr.textContent = "Enter a valid contact number (10-15 digits).";
    isValid = false;
  }

  if (branch === "") {
    branchErr.textContent = "Branch is required.";
    isValid = false;
  }

  if (agentName === "") {
    agentNameErr.textContent = "Agent name is required.";
    isValid = false;
  }

  if (isValid === true) {
    alert("Successfully submitted");
    return true;
  } else {
    return false;
  }
}

