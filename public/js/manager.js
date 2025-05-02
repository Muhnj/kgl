// Live time update
function updateTime() {
  const now = new Date();
  document.getElementById("liveTime").textContent = now.toLocaleString();
}
setInterval(updateTime, 1000);
updateTime();

// Toggle credit terms based on payment type
document.getElementById("paymentType").addEventListener("change", function () {
  const creditTerms = document.getElementById("creditTerms");
  creditTerms.style.display = this.value === "Credit" ? "block" : "none";
});

// Toggle update credit terms based on payment type
document
  .getElementById("updatePaymentType")
  .addEventListener("change", function () {
    const creditTerms = document.getElementById("updateCreditTerms");
    creditTerms.style.display = this.value === "Credit" ? "block" : "none";
  });

// Save produce function
document.getElementById("saveProduce").addEventListener("click", function () {
  const form = document.getElementById("produceForm");
  if (form.checkValidity()) {
    Swal.fire({
      title: "Success!",
      text: "Produce has been recorded successfully",
      icon: "success",
      confirmButtonText: "OK",
    }).then(() => {
      const modal = bootstrap.Modal.getInstance(
        document.getElementById("produceModal")
      );
      modal.hide();
      form.reset();
    });
  } else {
    form.reportValidity();
  }
});

// Save sale function
document.getElementById("saveSale").addEventListener("click", function () {
  const form = document.getElementById("saleForm");
  if (form.checkValidity()) {
    Swal.fire({
      title: "Success!",
      text: "Sale has been recorded successfully",
      icon: "success",
      confirmButtonText: "OK",
    }).then(() => {
      const modal = bootstrap.Modal.getInstance(
        document.getElementById("saleModal")
      );
      modal.hide();
      form.reset();
    });
  } else {
    form.reportValidity();
  }
});

// Update produce function
document
  .getElementById("updateProduceBtn")
  .addEventListener("click", function () {
    const form = document.getElementById("updateProduceForm");
    if (form.checkValidity()) {
      Swal.fire({
        title: "Success!",
        text: "Produce has been updated successfully",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        const modal = bootstrap.Modal.getInstance(
          document.getElementById("updateProduceModal")
        );
        modal.hide();
        form.reset();
      });
    } else {
      form.reportValidity();
    }
  });

// Update sale function
document.getElementById("updateSaleBtn").addEventListener("click", function () {
  const form = document.getElementById("updateSaleForm");
  if (form.checkValidity()) {
    Swal.fire({
      title: "Success!",
      text: "Sale has been updated successfully",
      icon: "success",
      confirmButtonText: "OK",
    }).then(() => {
      const modal = bootstrap.Modal.getInstance(
        document.getElementById("updateSaleModal")
      );
      modal.hide();
      form.reset();
    });
  } else {
    form.reportValidity();
  }
});

// Show update produce modal with data
function showUpdateProduceModal(productName) {
  // In a real app, you would fetch this data from your API
  const productData = {
    id: "prod123",
    name: productName,
    type: productName === "Grain Maize" ? "Cereal" : "Legume",
    entryDate: "2025-02-10",
    quantity:
      productName === "Grain Maize"
        ? 50
        : productName === "Soybeans"
        ? 68
        : 420,
    cost:
      productName === "Grain Maize"
        ? 2800
        : productName === "Soybeans"
        ? 3000
        : 3000,
    sellingPrice:
      productName === "Grain Maize"
        ? 3500
        : productName === "Soybeans"
        ? 4000
        : 3500,
    dealerName:
      productName === "Grain Maize" ? "Farmers Co-op" : "Agro Dealer Ltd",
    dealerContact: "0755123456",
    branch: "Maganjo",
    notes: "Good quality produce",
  };

  // Populate the form
  document.getElementById("updateProductId").value = productData.id;
  document.getElementById("updateProductName").value = productData.name;
  document.getElementById("updateProductType").value = productData.type;
  document.getElementById("updateEntryDate").value = productData.entryDate;
  document.getElementById("updateQuantity").value = productData.quantity;
  document.getElementById("updateCost").value = productData.cost;
  document.getElementById("updateSellingPrice").value =
    productData.sellingPrice;
  document.getElementById("updateDealerName").value = productData.dealerName;
  document.getElementById("updateDealerContact").value =
    productData.dealerContact;
  document.getElementById("updateBranch").value = productData.branch;
  document.getElementById("updateNotes").value = productData.notes;

  // Show the modal
  const modal = new bootstrap.Modal(
    document.getElementById("updateProduceModal")
  );
  modal.show();
}

// Show update sale modal with data
function showUpdateSaleModal(saleId) {
  // In a real app, you would fetch this data from your API
  const saleData = {
    id: saleId,
    product:
      saleId === "sale1" ? "G-nuts" : saleId === "sale2" ? "Soybeans" : "Beans",
    quantity: saleId === "sale1" ? 150 : saleId === "sale2" ? 200 : 300,
    date: saleId === "sale1" ? "2025-02-15" : "2025-02-14",
    price: saleId === "sale1" ? 5200 : saleId === "sale2" ? 4500 : 3500,
    customerName:
      saleId === "sale1"
        ? "John Smith"
        : saleId === "sale2"
        ? "Sarah Johnson"
        : "David Brown",
    customerContact:
      saleId === "sale1"
        ? "0755111222"
        : saleId === "sale2"
        ? "0755333444"
        : "0755555666",
    branch: "Maganjo",
    paymentType: saleId === "sale1" ? "Cash" : "Credit",
    dueDate: "2025-03-14",
    notes: saleId === "sale1" ? "Paid in full" : "Pending payment",
    completed: false,
  };

  // Populate the form
  document.getElementById("updateSaleId").value = saleData.id;
  document.getElementById("updateSaleProduct").value = saleData.product;
  document.getElementById("updateSaleQuantity").value = saleData.quantity;
  document.getElementById("updateSaleDate").value = saleData.date;
  document.getElementById("updateSalePrice").value = saleData.price;
  document.getElementById("updateCustomerName").value = saleData.customerName;
  document.getElementById("updateCustomerContact").value =
    saleData.customerContact;
  document.getElementById("updateSaleBranch").value = saleData.branch;
  document.getElementById("updatePaymentType").value = saleData.paymentType;
  document.getElementById("updateDueDate").value = saleData.dueDate;
  document.getElementById("updateSaleNotes").value = saleData.notes;
  document.getElementById("updateSaleCompleted").checked = saleData.completed;

  // Show/hide credit terms based on payment type
  const creditTerms = document.getElementById("updateCreditTerms");
  creditTerms.style.display =
    saleData.paymentType === "Credit" ? "block" : "none";

  // Show the modal
  const modal = new bootstrap.Modal(document.getElementById("updateSaleModal"));
  modal.show();
}

// Check for low stock items on page load
document.addEventListener("DOMContentLoaded", function () {
  setTimeout(() => {
    const lowStockItems = [
      { name: "Grain Maize", quantity: 50, threshold: 100 },
      { name: "Soybeans", quantity: 68, threshold: 100 },
    ];

    if (lowStockItems.length > 0) {
      const alertHtml = lowStockItems
        .map(
          (item) =>
            `<div class="mb-2">
              <strong>${item.name}</strong>: ${item.quantity}kg remaining (threshold: ${item.threshold}kg)
            </div>`
        )
        .join("");

      Swal.fire({
        title: "Stock Alert",
        html: `The following items are running low:<br>${alertHtml}`,
        icon: "warning",
        confirmButtonText: "OK",
      });
    }
  }, 1500);
});
// Handle form submission with AJAX and SweetAlert
document.addEventListener('DOMContentLoaded', function() {
  const produceForm = document.getElementById('produceForm');
  
  if (produceForm) {
    produceForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const formData = new FormData(this);
      
      try {
        const response = await fetch('/addition', {
          method: 'POST',
          body: formData
        });
        
        if (response.ok) {
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'Produce added successfully!',
            confirmButtonText: 'OK'
          }).then(() => {
            window.location.reload();
          });
        } else {
          throw new Error('Failed to save produce');
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: error.message,
          confirmButtonText: 'OK'
        });
      }
    });
  }

  // Display flash messages
  const successMsg = document.querySelector('.alert-success');
  const errorMsg = document.querySelector('.alert-danger');
  
  if (successMsg) {
    setTimeout(() => {
      successMsg.style.display = 'none';
    }, 5000);
  }
  
  if (errorMsg) {
    setTimeout(() => {
      errorMsg.style.display = 'none';
    }, 5000);
  }
});