document.addEventListener('DOMContentLoaded', () => {
  let token = localStorage.getItem('token');
  if (!token) window.location.href = '/auth.html';

  let payload;
  try {
    payload = JSON.parse(atob(token.split('.')[1]));
    if (payload.role !== 'ADMIN') {
      alert('Acesso negado! Apenas administradores.');
      window.location.href = '/dashboard.html';
    }
  } catch {
    localStorage.removeItem('token');
    window.location.href = '/auth.html';
  }

  async function carregarUsuariosPendentes() {
    try {
      const res = await fetch('/api/admin/usuarios-pendentes', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Falha ao carregar usuários');
      const usuarios = await res.json();

      const tbody = document.querySelector('tbody');
      tbody.innerHTML = '';
      usuarios.forEach(u => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${u.nome}</td>
          <td>${u.email}</td>
          <td>${u.setor}</td>
          <td><button onclick="aprovar('${u.id}')">Aprovar</button></td>
        `;
        tbody.appendChild(tr);
      });
    } catch (err) {
      console.error(err);
    }
  }

  carregarUsuariosPendentes();

  window.aprovar = async function (id) {
    try {
      const res = await fetch(`/api/admin/usuarios/${id}/ativar`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Falha ao aprovar usuário');
      await res.json();
      carregarUsuariosPendentes(); // recarrega sem dar reload
    } catch (err) {
      console.error(err);
    }
  };
});
