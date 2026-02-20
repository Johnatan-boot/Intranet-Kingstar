// ===============================
// GUARD DE AUTENTICAÇÃO E SETOR
// ===============================

// decodifica JWT
function decodeToken(token) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}

// verifica expiração
function tokenExpirado(payload) {
  if (!payload || !payload.exp) return true;
  const agora = Math.floor(Date.now() / 1000);
  return payload.exp < agora;
}

// guard principal
function protegerPagina({ setoresPermitidos = [] } = {}) {
  const token = localStorage.getItem("token");

  // sem token
  if (!token) {
    window.location.href = "/auth.html";
    return;
  }

  const payload = decodeToken(token);

  // token inválido ou expirado
  if (!payload || tokenExpirado(payload)) {
    localStorage.removeItem("token");
    alert("Sessão expirada. Faça login novamente.");
    window.location.href = "/auth.html";
    return;
  }

  // ADMIN passa sempre
  if (payload.role === "ADMIN") return;

  // valida setor
  if (
    setoresPermitidos.length &&
    !setoresPermitidos.includes(payload.setor)
  ) {
    alert("Você não tem permissão para acessar esta página.");
    window.location.href = "/dashboard.html";
  }
}
