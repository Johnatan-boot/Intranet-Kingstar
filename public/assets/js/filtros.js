document.getElementById("filtroStatus").addEventListener("change", (e) => {
  const status = e.target.value;
  const filtrados = filtrarPorStatus(pedidos, status);

  atualizarKPIs(filtrados);
  renderTabela(filtrados);
});
