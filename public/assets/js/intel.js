const listaAlertas = document.getElementById('lista-alertas');

function gerarAlertas() {
  estoque.forEach(item => {
    if (item.quantidade < item.minimo) {
      const li = document.createElement('li');
      li.innerText = `⚠ Estoque crítico: ${item.produto} na loja ${item.loja}`;
      listaAlertas.appendChild(li);
    }
  });

  pedidos.forEach(p => {
    if (p.atrasoHoras > 2) {
      const li = document.createElement('li');
      li.innerText = `⏰ Pedido ${p.id} atrasado (${p.atrasoHoras}h)`;
      listaAlertas.appendChild(li);
    }
  });
}

if (listaAlertas) gerarAlertas();
