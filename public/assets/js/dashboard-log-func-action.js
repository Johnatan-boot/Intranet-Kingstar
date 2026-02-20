function marcarEntregue(id) {
  registrarEvento(id, "ENTREGUE", "Pedido entregue com sucesso");
  alert("Pedido marcado como entregue");
}

function registrarAtraso(id) {
  const motivo = prompt("Motivo do atraso:");
  registrarEvento(id, "ATRASO", motivo);
}


//função de exportar csv
function exportarCSV() {
  let csv = "Pedido,Tipo,Descrição,Data\n";

  historicoEventos.forEach(e => {
    csv += `${e.pedidoId},${e.tipo},${e.descricao},${e.data}\n`;
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "historico-logistica.csv";
  link.click();
}
