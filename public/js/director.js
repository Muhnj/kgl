// Initialize all charts
document.addEventListener("DOMContentLoaded", function () {
  // Branch Comparison Chart (Bar)
  const branchCtx = document
    .getElementById("branchComparisonChart")
    .getContext("2d");
  new Chart(branchCtx, {
    type: "bar",
    data: {
      labels: ["Maganjo", "Matugga"],
      datasets: [
        {
          label: "Revenue (UGX)",
          data: [7800000, 5000000],
          backgroundColor: [
            "rgba(52, 152, 219, 0.7)",
            "rgba(155, 89, 182, 0.7)",
          ],
          borderColor: ["rgba(52, 152, 219, 1)", "rgba(155, 89, 182, 1)"],
          borderWidth: 1,
        },
        {
          label: "Sales Count",
          data: [142, 106],
          backgroundColor: [
            "rgba(46, 204, 113, 0.7)",
            "rgba(241, 196, 15, 0.7)",
          ],
          borderColor: ["rgba(46, 204, 113, 1)", "rgba(241, 196, 15, 1)"],
          borderWidth: 1,
          type: "line",
          yAxisID: "y1",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Revenue (UGX)",
          },
        },
        y1: {
          position: "right",
          beginAtZero: true,
          title: {
            display: true,
            text: "Sales Count",
          },
          grid: {
            drawOnChartArea: false,
          },
        },
      },
    },
  });

  // Revenue Pie Chart
  const pieCtx = document.getElementById("revenuePieChart").getContext("2d");
  new Chart(pieCtx, {
    type: "doughnut",
    data: {
      labels: ["Beans", "Grain Maize", "G-nuts", "Soybeans", "Cow peas"],
      datasets: [
        {
          data: [35, 25, 20, 15, 5],
          backgroundColor: [
            "rgba(52, 152, 219, 0.7)",
            "rgba(46, 204, 113, 0.7)",
            "rgba(155, 89, 182, 0.7)",
            "rgba(241, 196, 15, 0.7)",
            "rgba(231, 76, 60, 0.7)",
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "right",
        },
      },
    },
  });

  // Top Products Chart
  const topProductsCtx = document
    .getElementById("topProductsChart")
    .getContext("2d");
  new Chart(topProductsCtx, {
    type: "bar",
    data: {
      labels: ["Beans", "Grain Maize", "G-nuts", "Soybeans", "Cow peas"],
      datasets: [
        {
          label: "Quantity Sold (kg)",
          data: [1250, 980, 750, 520, 300],
          backgroundColor: "rgba(52, 152, 219, 0.7)",
          borderColor: "rgba(52, 152, 219, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
});
