// Real-time updates using EventSource or WebSocket
document.addEventListener("DOMContentLoaded", function () {
  // Setup event listeners for any produce updates
  const eventSource = new EventSource("/produce-updates");

  eventSource.onmessage = function (event) {
    const updatedProduce = JSON.parse(event.data);
    updateProduceRow(updatedProduce);
  };

  function updateProduceRow(produce) {
    const row = document.querySelector(`tr[data-id="${produce._id}"]`);
    if (row) {
      // Update all cells with new data
      row.cells[1].textContent = produce.productname;
      row.cells[2].innerHTML = `<span class="badge badge-category text-white">${produce.productType}</span>`;
      // ... update other cells similarly
    }
  }
});
