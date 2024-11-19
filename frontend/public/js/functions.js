function toggleMenu(model) {
    const menu = document.getElementById("menu-lateral");
    const isActive = menu.classList.contains("ativo");
  
    if (isActive) {
      // Se o menu está ativo, então esconde o menu
      menu.classList.remove("ativo");
    } else {
      // Se o menu não está ativo, então mostra o menu
      menu.classList.add("ativo");
    }
  }
  
  function toggleMenu2() {
    const menu = document.getElementById("menu-lateral");
    menu.classList.toggle("show");
}

async function loginReq(event) {
  event.preventDefault(); // Impede o envio padrão do formulário

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  // Limpar qualquer dado antigo no localStorage antes de salvar novos
  localStorage.removeItem('token');
  localStorage.removeItem('userId');

  try {
    // Realizar a requisição de login
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();
    if (data.token) {
      const producerId = data.userId;

      if (producerId) {
        // Salvar token e userId no localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', producerId);

        // Redirecionar para a página desejada
        window.location.href = './pages/pagina_producao.html';
      } else {
        alert('Erro ao obter o ID do produtor');
      }
    } else {
      alert('Login falhou: ' + (data.message || 'Credenciais inválidas'));
    }
  } catch (error) {
    console.error('Erro na solicitação:', error);
    alert('Erro ao conectar ao servidor.');
  }
}

// Adicionar o listener de submit ao formulário
document.getElementById('login-form').addEventListener('submit', loginReq);
