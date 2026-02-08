document.addEventListener('DOMContentLoaded', () => {
  function showToast(message, type = 'primary') {
    const toastEl = document.getElementById('toastMsg');
    if (!toastEl) return;
    toastEl.className = `toast align-items-center text-white bg-${type} border-0`;
    toastEl.querySelector('.toast-body').innerText = message;
    new bootstrap.Toast(toastEl, { delay: 3000 }).show();
  }

  // --- LOGIN ---
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', async e => {
      e.preventDefault();
      const email = loginForm.querySelector('input[type="email"]').value;
      const senha = loginForm.querySelector('input[type="password"]').value;

      try {
        const res = await fetch('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, senha })
        });

        const data = await res.json();
        if (!res.ok) {
          showToast(data.erro || 'Login falhou', 'danger');
          return;
        }

        // salvar token JWT
        localStorage.setItem('token', data.token);

        const payload = JSON.parse(atob(data.token.split('.')[1]));

        // Redireciona automaticamente baseado na role
        if (payload.role === 'ADMIN') {
          window.location.href = '/admin.html';
        } else {
          window.location.href = '/dashboard.html';
        }

      } catch (err) {
        showToast('Erro de conexão com o servidor', 'danger');
        console.error(err);
      }
    });
  }

  // --- CADASTRO ---
  const formCadastro = document.getElementById('form-cadastro');
  if (formCadastro) {
    formCadastro.addEventListener('submit', async e => {
      e.preventDefault();
      const nome = formCadastro.querySelector('input[placeholder="Nome completo"]').value;
      const email = formCadastro.querySelector('input[placeholder="Email corporativo"]').value;
      const senha = formCadastro.querySelector('input[type="password"]').value;
      const setor = formCadastro.querySelector('select').value;

      try {
        const res = await fetch('/api/usuarios', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nome, email, senha, setor })
        });

        const data = await res.json();
        if (!res.ok) {
          showToast(data.erro || 'Erro ao cadastrar', 'danger');
          return;
        }

        showToast('Cadastro enviado com sucesso! Aguarde aprovação.', 'success');

        // fechar modal
        const modalEl = document.getElementById('modalCadastro');
        const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
        modal.hide();

        formCadastro.reset();
      } catch (err) {
        showToast('Erro de conexão com o servidor', 'danger');
      }
    });
  }
});

function logout() {
  localStorage.removeItem('token');
  window.location.href = '/auth.html';
}
