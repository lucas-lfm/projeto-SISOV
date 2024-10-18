document.getElementById('loginForm').addEventListener('submit', async (event) => {
  event.preventDefault();

  const username = document.getElementById('Formlogin_username').value;
  const password = document.getElementById('Formlogin_password').value;

  try {
    const response = await fetch('/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    console.log('Resposta da A  PI:', data);
    
    if (response.ok) {
      alert(data.message);
      // Armazenar apenas o userId no localStorage
      localStorage.setItem('userId', data.userId);
      // Redirecionar para a página do painel
      window.location.href = `../pages/pagina_producao.html?userId=${data.userId}`;
    } else {
      alert(data.message || 'Erro ao fazer login');
    }
  } catch (error) {
    console.error('Erro na solicitação:', error);
    alert('Erro ao se conectar ao servidor.');
  }
});
