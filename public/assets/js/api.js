export async function carregarPedidos() {
  const response = await fetch("assets/data/pedidos.json");
  return await response.json();
}

export async function carregarEventos() {
  const response = await fetch("assets/data/eventos-logistica.json");
  return await response.json();
}
