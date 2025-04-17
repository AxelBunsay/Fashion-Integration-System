document.addEventListener('DOMContentLoaded', async () => {
  const tableBody = document.querySelector('#logTable tbody');
  const branchFilter = document.getElementById('branchFilter');
  const dateFilter = document.getElementById('dateFilter');
  const exportCSV = document.getElementById('exportCSV');
  const exportPDF = document.getElementById('exportPDF');
  const chartCanvas = document.getElementById('logChart');
  let allLogs = [];

  // Fetch logs from backend
  const fetchLogs = async () => {
    const res = await fetch('http://localhost:3000/logs');
    allLogs = await res.json();
    renderTable(allLogs);
    renderChart(allLogs);
  };

  function renderTable(logs) {
    tableBody.innerHTML = '';
    logs.forEach(log => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${log.name}</td>
        <td>${new Date(log.timeIn).toLocaleString()}</td>
        <td>${log.branch}</td>
        <td>${log.purpose}</td>
      `;
      tableBody.appendChild(row);
    });
  }

  function applyFilters() {
    const branch = branchFilter.value;
    const date = dateFilter.value;

    let filtered = [...allLogs];

    if (branch !== 'all') {
      filtered = filtered.filter(log => log.branch === branch);
    }

    if (date) {
      filtered = filtered.filter(log => {
        const logDate = new Date(log.timeIn).toISOString().split('T')[0];
        return logDate === date;
      });
    }

    renderTable(filtered);
    renderChart(filtered);
  }

  function downloadCSV() {
    let csv = 'Name,Time In,Branch,Purpose\n';
    const rows = document.querySelectorAll('#logTable tbody tr');
    rows.forEach(row => {
      const cols = row.querySelectorAll('td');
      const rowData = Array.from(cols).map(td => `"${td.innerText}"`).join(',');
      csv += rowData + '\n';
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'customer_logs.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.text('Customer Visit Logs', 20, 10);

    let y = 20;
    document.querySelectorAll('#logTable tbody tr').forEach(row => {
      const cols = Array.from(row.querySelectorAll('td')).map(td => td.innerText);
      doc.text(cols.join(' | '), 20, y);
      y += 10;
    });

    doc.save('customer_logs.pdf');
  }

  function renderChart(data) {
    const branchCounts = {};
    data.forEach(log => {
      branchCounts[log.branch] = (branchCounts[log.branch] || 0) + 1;
    });

    const chartData = {
      labels: Object.keys(branchCounts),
      datasets: [{
        label: 'Visits per Branch',
        data: Object.values(branchCounts),
        backgroundColor: ['#c3b091', '#d8c3a5'],
        borderRadius: 5
      }]
    };

    if (window.myChart) {
      window.myChart.destroy();
    }

    window.myChart = new Chart(chartCanvas, {
      type: 'bar',
      data: chartData,
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            ticks: { stepSize: 1 }
          }
        }
      }
    });
  }

  // Event Listeners
  branchFilter.addEventListener('change', applyFilters);
  dateFilter.addEventListener('change', applyFilters);
  exportCSV.addEventListener('click', downloadCSV);
  exportPDF.addEventListener('click', downloadPDF);

  await fetchLogs();
});