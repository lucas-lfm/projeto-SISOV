document.getElementById('registerForm').addEventListener('submit', async (event) => {
    event.preventDefault();
  
    const newUsername = document.getElementById('newUsername').value;
    const newPassword = document.getElementById('newPassword').value;
  
    const response = await fetch('/api/users/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ newUsername, newPassword }),
    });
  
    const data = await response.json();
    alert(data.message);
  });
  