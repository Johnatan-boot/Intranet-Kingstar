document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = '/auth.html';
    return;
  }

  let payload;
  try {
    payload = JSON.parse(atob(token.split('.')[1]));
  } catch {
    localStorage.removeItem('token');
    window.location.href = '/auth.html';
    return;
  }

  const sidebar = `
    <nav class="sidebar">
      <div class="sidebar-header">
        <h3>Kingstar</h3>
        <span class="role">${payload.role}</span>
      </div>

      <ul class="menu">
        <li><a href="/dashboard.html">📊 Dashboard</a></li>

        ${payload.role === 'ADMIN' ? `
          <li class="menu-title">Administração</li>
          <li><a href="/admin.html">👥 Gestão de Usuários</a></li>
        ` : ''}

        <li class="menu-title">Logística</li>
        <li><a href="#">🚚 Fretes</a></li>
        <li><a href="#">📦 Estoque</a></li>
        <li><a href="#">🗂 Inventários</a></li>

        <li class="menu-title">Sistema</li>
        <li><a href="#" onclick="logout()">🚪 Sair</a></li>
      </ul>
    </nav>
  `;

  document.getElementById('sidebar-container').innerHTML = sidebar;
});

//FUNÇÃO DE DESLOGAR USUARIO DO SISTEMA
function logout() {
  localStorage.removeItem('token');
  window.location.href = '/auth.html';
}


document.addEventListener("DOMContentLoaded", () => {
  let token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "/auth.html";
    return;
  }

  let payload;
  try {
    payload = JSON.parse(atob(token.split(".")[1]));
    if (payload.role !== "ADMIN") {
      showToast("Acesso negado! Apenas administradores.", "danger");
      window.location.href = "/dashboard.html";
      return;
    }
  } catch {
    localStorage.removeItem("token");
    window.location.href = "/auth.html";
    return;
  }






  //ALERTA 
  function showToast(message, type = "primary") {
    const toastEl = document.getElementById("toastMsg");
    if (!toastEl) return;
    toastEl.className = `toast align-items-center text-white bg-${type} border-0`;
    toastEl.querySelector(".toast-body").innerText = message;
    new bootstrap.Toast(toastEl, { delay: 3000 }).show();
  }

  //CARREGAR USUARIOS PENDENTES NA TABELA
  async function carregarUsuariosPendentes() {
    try {
      const res = await fetch("/api/admin/usuarios-pendentes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Falha ao carregar usuários");
      const usuarios = await res.json();

      const tbody = document.querySelector("tbody");
      tbody.innerHTML = "";
      usuarios.forEach((u) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${u.nome}</td>
          <td>${u.email}</td>
          <td>${u.setor}</td>
          <td><button onclick="aprovar('${u.id}')">Aprovar</button></td>
        `;
        tbody.appendChild(tr);
      });

      if (usuarios.length === 0) {
        showToast("Nenhum usuário pendente no momento.", "info");
      }
    } catch (err) {
      showToast(err.message, "danger");
      console.error(err);
    }
  }

  carregarUsuariosPendentes();

 //APROVAR USUARIOS PENDENTES 
 window.aprovar = async function (id) {
  try {
    const res = await fetch(`/api/admin/usuarios/${id}/ativar`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error("Falha ao aprovar usuário");

    await res.json();

    showToast("Usuário aprovado com sucesso!", "success");
    carregarUsuariosPendentes();

  } catch (err) {
    showToast(err.message, "danger");
    console.error(err);
  }
};

});
