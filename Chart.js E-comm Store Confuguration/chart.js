var orderData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [{
      label: 'Number of Orders',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
      borderColor: 'rgb(255, 99, 132)',
      borderWidth: 1,
      data: [120, 140, 160, 180, 200, 220, 240, 260, 280, 300, 320, 340]
  }]
};

var salesData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [{
      label: 'Sales (in $)',
      backgroundColor: 'rgba(54, 162, 235, 0.5)',
      borderColor: 'rgb(54, 162, 235)',
      borderWidth: 1,
      data: [1000, 1200, 1400, 1600, 1800, 2000, 2200, 2400, 2600, 2800, 3000, 3200]
  }]
};

var profitData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [{
      label: 'Profit (in $)',
      backgroundColor: 'rgba(75, 192, 192, 0.5)',
      borderColor: 'rgb(75, 192, 192)',
      borderWidth: 1,
      data: [200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300]
  }]
};

var ctxOrder = document.getElementById('orderChart').getContext('2d');
var ctxSales = document.getElementById('salesChart').getContext('2d');
var ctxProfit = document.getElementById('profitChart').getContext('2d');

var orderChart = new Chart(ctxOrder, {
  type: 'line',
  data: orderData
});

var salesChart = new Chart(ctxSales, {
  type: 'bar',
  data: salesData
});

var profitChart = new Chart(ctxProfit, {
  type: 'line',
  data: profitData
});