function filtrarPorStatus(lista, status) {
  if (!status) return lista;
  return lista.filter(p => p.status === status);
}
