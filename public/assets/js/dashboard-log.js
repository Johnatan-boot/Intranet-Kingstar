let motoristas = [];
let logWhatsapp = [];
let grafico;
let graficoPeriodo;
let mapa;
let marcadorMotorista;
let linhaRota;

const TELEFONE_MOTORISTA_PADRAO = "5511977653883";

const historicoEventos = [];

// ===============================
// KPIs
// ===============================
function atualizarKPIs(lista) {
  document.getElementById("kpiTotal").textContent = lista.length;

  document.getElementById("kpiEntregues").textContent =
    lista.filter(p => p.status === "ENTREGUE").length;

  document.getElementById("kpiAtrasados").textContent =
    lista.filter(p => p.status === "ATRASADO").length;
}

// ===============================
// PLUGIN TEXTO CENTRAL (%)
// ===============================
const centerTextPlugin = {
  id: "centerText",
  beforeDraw(chart) {
    if (!chart.data.datasets.length) return;

    const { width, height, ctx } = chart;
    const total = chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
    const entregues = chart.data.datasets[0].data[0];
    const percentual = total ? Math.round((entregues / total) * 100) : 0;

    ctx.save();
    ctx.font = "bold 26px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#1faa59";
    ctx.fillText(percentual + "%", width / 2, height / 2);
    ctx.restore();
  }
};

// ===============================
// GRÁFICO STATUS
// ===============================
function atualizarGrafico(lista) {
  const entregues = lista.filter(p => p.status === "ENTREGUE").length;
  const transito = lista.filter(p => p.status === "EM_TRANSITO").length;
  const atrasados = lista.filter(p => p.status === "ATRASADO").length;

  const canvas = document.getElementById("graficoStatus");
  if (!canvas) return;

  if (grafico) grafico.destroy();

  grafico = new Chart(canvas.getContext("2d"), {
    type: "doughnut",
    data: {
      labels: ["Entregues", "Em Trânsito", "Atrasados"],
      datasets: [{
        data: [entregues, transito, atrasados],
        backgroundColor: ["#1faa59", "#1e88e5", "#e53935"]
      }]
    },
    options: {
      responsive: true,
      animation: { duration: 1200, easing: "easeOutQuart" },
      plugins: { legend: { position: "bottom" } }
    },
    plugins: [centerTextPlugin]
  });
}

// ===============================
// GRÁFICO POR PERÍODO (5 BARRAS)
// ===============================
function atualizarGraficoPeriodo(lista) {
  const hoje = new Date();

  function contarPeriodo(dias) {
    const limite = new Date();
    limite.setDate(hoje.getDate() - dias);

    return lista.filter(p => {
      const dataPedido = new Date(p.prazo);
      return p.status === "ENTREGUE" && dataPedido >= limite;
    }).length;
  }

  const hojeCount = lista.filter(p =>
    p.status === "ENTREGUE" &&
    new Date(p.prazo).toDateString() === hoje.toDateString()
  ).length;

  const ontem = new Date();
  ontem.setDate(hoje.getDate() - 1);

  const ontemCount = lista.filter(p =>
    p.status === "ENTREGUE" &&
    new Date(p.prazo).toDateString() === ontem.toDateString()
  ).length;

  const ult7 = contarPeriodo(7);
  const ult15 = contarPeriodo(15);
  const ult30 = contarPeriodo(30);

  const canvas = document.getElementById("graficoPeriodo");
  if (!canvas) return;

  if (graficoPeriodo) graficoPeriodo.destroy();

  graficoPeriodo = new Chart(canvas.getContext("2d"), {
    type: "bar",
    data: {
      labels: ["Hoje", "Ontem", "Últ. 7 dias", "Últ. 15 dias", "Últ. 30 dias"],
      datasets: [{
        label: "Entregas Concluídas",
        data: [hojeCount, ontemCount, ult7, ult15, ult30],
        backgroundColor: "#1e88e5",
        borderRadius: 8
      }]
    },
    options: {
      responsive: true,
      animation: { duration: 1200, easing: "easeOutQuart" },
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true } }
    }
  });
}

// ===============================
// TABELA
// ===============================
function calcularAtraso(prazo) {
  return new Date() > new Date(prazo);
}

function renderTabela(lista) {
  const tbody = document.getElementById("tabelaPedidos");
  tbody.innerHTML = "";

  lista.forEach(pedido => {
    const atrasado = calcularAtraso(pedido.prazo);

    const mensagem = encodeURIComponent(
      `Olá motorista,\n\nPedido: ${pedido.id}\nCliente: ${pedido.cliente}\nStatus: ${pedido.status}\nPrazo: ${pedido.prazo}`
    );

    const classeStatus = normalizarStatus(pedido.status);

    tbody.innerHTML += `
      <tr class="${atrasado && pedido.status !== "ENTREGUE" ? "atraso" : ""}">
        <td>${pedido.id}</td>
        <td>${pedido.cliente}</td>
        <td>
          <span class="badge ${pedido.status.toLowerCase()}">
            ${atrasado && pedido.status !== "ENTREGUE" ? "⏰" : ""}
            ${pedido.status}
          </span>
        </td>
        <td>${pedido.prazo}</td>
        <td class="acoes">

          <button class="btn btn-sm btn-success"
            data-bs-toggle="tooltip"
            title="Marcar como entregue"
            onclick="marcarEntregue('${pedido.id}')">
            <i class="bi bi-check-lg"></i>
          </button>

          <button class="btn btn-sm btn-warning"
            data-bs-toggle="tooltip"
            title="Registrar atraso"
            onclick="registrarAtraso('${pedido.id}')">
            <i class="bi bi-exclamation-triangle"></i>
          </button>

          <button class="btn btn-sm btn-primary"
            data-bs-toggle="tooltip"
            title="Visualizar histórico"
            onclick="abrirHistorico('${pedido.id}')">
            <i class="bi bi-clock-history"></i>
          </button>

        <button class="btn btn-sm btn-success"
       data-bs-toggle="tooltip"
      title="Enviar mensagem via WhatsApp"
      onclick="enviarWhatsapp('${pedido.id}')">
      <i class="bi bi-whatsapp"></i>
      </button>



        </td>
      </tr>
    `;
  });

  atualizarKPIs(lista);
  atualizarGrafico(lista);
  atualizarGraficoPeriodo(lista);
  ativarTooltips();
}


// ===============================
// AÇÕES
// ===============================
function marcarEntregue(id) {
  const pedido = pedidos.find(p => p.id === id);
  if (!pedido) return;

  pedido.status = "ENTREGUE";
  registrarEvento(id, "ENTREGUE", "Pedido entregue");
  renderTabela(pedidos);
}

function registrarAtraso(id) {
  const motivo = prompt("Motivo do atraso:");
  if (!motivo) return;

  const pedido = pedidos.find(p => p.id === id);
  if (!pedido) return;

  pedido.status = "ATRASADO";
  registrarEvento(id, "ATRASO", motivo);
  renderTabela(pedidos);
}

function normalizarStatus(status) {
  return status
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove acento
    .replace("_", "-");
}


// ===============================
// TOAST
// ===============================
function showToast(message, type = "primary") {
  const toastEl = document.getElementById("toastNotificacao");
  toastEl.querySelector(".toast-body").textContent = message;
  toastEl.className = `toast align-items-center text-white bg-${type} border-0`;
  new bootstrap.Toast(toastEl, { delay: 3000 }).show();
}

function registrarEvento(pedidoId, tipo, descricao) {
  historicoEventos.push({
    pedidoId,
    tipo,
    descricao,
    data: new Date().toISOString()
  });

  showToast(`Evento registrado: ${tipo}`,
    tipo === "ATRASO" ? "danger" :
    tipo === "ENTREGUE" ? "success" :
    "primary"
  );
}

// ===============================
// MAPA
// ===============================
const baseLat = -23.5505;
const baseLng = -46.6333;

function iniciarMapa() {
  const container = document.getElementById("mapaHistorico");
  if (!container) return;

  if (mapa) mapa.remove();

  mapa = L.map(container).setView([baseLat, baseLng], 11);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap"
  }).addTo(mapa);
}

function carregarMapa(pedido) {
  iniciarMapa();

  const lat = pedido.lat || -23.6200;
  const lng = pedido.lng || -46.7000;

  L.marker([lat, lng])
    .addTo(mapa)
    .bindPopup(`📦 Pedido ${pedido.id}`)
    .openPopup();
}

// ===============================
// HISTÓRICO
// ===============================
function abrirHistorico(pedidoId) {
  const lista = document.getElementById("listaHistorico");
  const titulo = document.getElementById("historicoPedidoId");

  titulo.textContent = pedidoId;
  lista.innerHTML = "";

  const pedido = pedidos.find(p => p.id === pedidoId);
  if (pedido) carregarMapa(pedido);

  historicoEventos
    .filter(e => e.pedidoId === pedidoId)
    .forEach(e => {
      lista.innerHTML += `
        <li class="list-group-item">
          <strong>${e.tipo}</strong><br>
          ${e.descricao}<br>
          <small class="text-muted">
            ${new Date(e.data).toLocaleString()}
          </small>
        </li>
      `;
    });

  const modal = new bootstrap.Modal(
    document.getElementById("modalHistorico")
  );

  modal.show();

  setTimeout(() => {
    if (mapa) mapa.invalidateSize();
  }, 300);
}

// ===============================
// TOOLTIP
// ===============================
function ativarTooltips() {
  document.querySelectorAll('[data-bs-toggle="tooltip"]')
    .forEach(el => new bootstrap.Tooltip(el));
}


//FUNÇÕES CARREGAR MOTORISTAS E HISTÓRICO DE MENSAGENS
async function carregarMotoristas() {
  const response = await fetch("/data/motoristas.json");
  motoristas = await response.json();
}


function buscarMotorista(id) {
  return motoristas.find(m => String(m.id) === String(id));
}


//FUNÇÃO SIMULAÇÃO DE API WHATSAPP
function enviarWhatsapp(pedidoId) {
  const pedido = pedidos.find(p => p.id === pedidoId);
  if (!pedido) return;

  const motorista = buscarMotorista(pedido.motoristaId);
  if (!motorista) {
    showToast("Motorista não encontrado", "danger");
    return;
  }

  const mensagem = encodeURIComponent(
    `Olá ${motorista.nome},\n\nPedido: ${pedido.id}\nCliente: ${pedido.cliente}\nStatus: ${pedido.status}\nPrazo: ${pedido.prazo}`
  );

  logWhatsapp.push({
    pedidoId: pedido.id,
    motoristaId: motorista.id,
    data: new Date().toISOString(),
    mensagem: "Mensagem enviada via WhatsApp"
  });

  registrarEvento(
    pedido.id,
    "WHATSAPP",
    `Mensagem enviada para ${motorista.nome}`
  );

  window.open(
    `https://wa.me/${motorista.telefone}?text=${mensagem}`,
    "_blank"
  );
}





async function carregarLogWhatsapp() {
  const response = await fetch("/data/log-whatsapp.json");
  logWhatsapp = await response.json();
}






// ===============================
// INIT
// ===============================
document.addEventListener("DOMContentLoaded", async function () {
  await carregarMotoristas();
  await carregarLogWhatsapp();
  renderTabela(pedidos);
});

