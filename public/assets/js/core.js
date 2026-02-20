import { renderTabela } from "./historico.js";
import { carregarPedidos } from "./api.js";

document.addEventListener("DOMContentLoaded", async () => {
  const pedidos = await carregarPedidos();
  renderTabela(pedidos);
});
