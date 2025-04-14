const form = document.getElementById('logForm');
const responseMsg = document.getElementById('responseMsg');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = {
    name: form.name.value,
    timeIn: form.timeIn.value,
    branch: form.branch.value,
    purpose: form.purpose.value
  };

  try {
    const res = await fetch('http://localhost:3000/api/logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    const data = await res.json();
    responseMsg.textContent = data.message || 'Log created!';
    form.reset();
  } catch (err) {
    responseMsg.textContent = 'Error submitting log';
  }
});