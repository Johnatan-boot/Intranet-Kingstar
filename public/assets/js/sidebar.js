// sidebar.js
document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = '/auth.html';
    return;
  }

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));

    // Exibe menu admin apenas se existir no DOM
    const menuAdmin = document.getElementById('menu-admin');
    if (menuAdmin && payload.role === 'ADMIN') {
      menuAdmin.style.display = 'block';
    }

    // Controle por setor
    const menuLog = document.getElementById('menu-logistica');
    if (menuLog && payload.setor !== 'LOGISTICA') {
      menuLog.style.display = 'none';
    }

  } catch (err) {
    console.error('Erro ao decodificar token:', err);
    localStorage.removeItem('token');
    window.location.href = '/auth.html';
  }
});
