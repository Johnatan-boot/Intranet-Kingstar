// KPI pedidos em atraso
const atrasos = pedidos.filter(p => p.atrasoHoras > 2).length;
const kpiAtraso = document.getElementById('kpi-atraso');
if (kpiAtraso) {
  kpiAtraso.innerText = atrasos;
}

// KPI estoque crítico
const criticos = estoque.filter(e => e.quantidade < e.minimo).length;
const kpiEstoque = document.getElementById('kpi-estoque');
if (kpiEstoque) {
  kpiEstoque.innerText = criticos;
}

// Tabela pedidos
const tabelaPedidos = document.getElementById('tabela-pedidos');

if (tabelaPedidos) {
  pedidos.forEach(p => {
    let badge = p.atrasoHoras > 2 ? 'danger' : 'success';

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${p.id}</td>
      <td>${p.status}</td>
      <td><span class="badge ${badge}">${p.atrasoHoras}</span></td>
    `;
    tabelaPedidos.appendChild(tr);
  });
}
