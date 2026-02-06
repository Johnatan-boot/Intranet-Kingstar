const tbody = document.getElementById('tabela-estoque');

estoque.forEach(item => {
  const tr = document.createElement('tr');

  let status = 'OK';
  let badge = 'success';

  if (item.quantidade < item.minimo) {
    status = 'Crítico';
    badge = 'danger';
  }

  tr.innerHTML = `
    <td>${item.loja}</td>
    <td>${item.produto}</td>
    <td>${item.quantidade}</td>
    <td>${item.minimo}</td>
    <td><span class="badge ${badge}">${status}</span></td>
  `;

  tbody.appendChild(tr);
});
