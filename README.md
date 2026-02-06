# Portal Intranet Kingstar

Objetivo: criar um **portal intranet** para as lojas Kingstar que **gerencie todo o ciclo logístico** (pedido → estoque → transporte → entrega → pós‑entrega) e **mostre inteligência operacional** usando **HTML, CSS e JavaScript** (front‑end), com base preparada para integração futura com APIs/back‑end.

---

## 1) Visão do Produto
<img width="1366" height="768" alt="Captura de tela 2026-02-06 164711" src="https://github.com/user-attachments/assets/9b67eb70-c25d-4c75-8961-fda9fda31451" />
<img width="1366" height="768" alt="Captura de tela 2026-02-06 164610" src="https://github.com/user-attachments/assets/8e849060-e5aa-4791-8633-00fdb6ab5bb2" />
<img width="1366" height="768" alt="Captura de tela 2026-02-06 164536" src="https://github.com/user-attachments/assets/0532e3e0-acf8-4c5d-97da-35e14e231565" />
<img width="1366" height="768" alt="Captura de tela 2026-02-06 164433" src="https://github.com/user-attachments/assets/998690d6-7386-4f46-8952-024f0cb5edcb" />
<img width="1366" height="768" alt="Captura de tela 2026-02-06 164415" src="https://github.com/user-attachments/assets/9b967f3a-5c36-42ee-859b-73f86f58fbe2" />
<img width="1366" height="768" alt="Captura de tela 2026-02-06 164354" src="https://github.com/user-attachments/assets/92e54ad5-5968-48f9-b9a8-5b7aa1741970" />
<img width="1366" height="768" alt="Captura de tela 2026-02-06 164343" src="https://github.com/user-attachments/assets/28f15c6d-5be4-44a8-b4b7-a38ba3e22f91" />

**O que o portal precisa entregar**

* Visão unificada da logística (tempo real ou quase)
* Controle de estoque por loja/CD
* Acompanhamento de pedidos e transferências
* Alertas inteligentes (ruptura, atraso, excesso)
* Dashboards operacionais claros para gestores

**Perfis de usuário**

* 🧑‍💼 Gestor Logístico
* 🏬 Gerente de Loja
* 🚚 Operações / Transporte
* 🧑‍💻 Admin do Sistema

---

## 2) Módulos Principais

### 2.1 Dashboard Operacional (Home)

* KPIs:

  * OTIF (On Time In Full)
  * Pedidos em atraso
  * Nível de estoque crítico
  * Lead time médio
* Gráficos simples (JS puro ou Chart.js futuramente)

### 2.2 Estoque

* Estoque por loja
* Estoque por produto
* Ponto de reposição
* Histórico de movimentações

### 2.3 Pedidos & Transferências

* Criação de pedido
* Status (Criado → Separado → Em trânsito → Entregue)
* Transferência entre lojas

### 2.4 Transporte

* Rotas
* Transportadoras
* SLA por rota
* Atrasos e exceções

### 2.5 Inteligência Operacional

* Regras simples em JS:

  * Se estoque < mínimo → alerta
  * Se pedido atrasado > X horas → alerta
  * Se giro alto → sugestão de reposição

---

## 3) Arquitetura Front‑end (HTML/CSS/JS)

```
/intranet-kingstar
│
├── index.html        # Login
├── dashboard.html    # Home / KPIs
├── estoque.html
├── pedidos.html
├── transporte.html
│
├── /assets
│   ├── /css
│   │   └── style.css
│   ├── /js
│   │   ├── data.js        # Mock de dados
│   │   ├── auth.js
│   │   ├── dashboard.js
│   │   ├── estoque.js
│   │   └── intel.js       # Inteligência operacional
│   └── /img
```

---

## 4) Base Visual (CSS)

**Conceito**: clean, corporativo, rápido

* Cores sugeridas:

  * Azul escuro (confiança)
  * Amarelo/dourado (Kingstar)
  * Cinza claro (background)

```css
:root {
  --primary: #0a1f44;
  --accent: #f5b700;
  --bg: #f4f6f8;
}

body {
  font-family: Arial, sans-serif;
  margin: 0;
  background: var(--bg);
}

.card {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 6px rgba(0,0,0,.1);
}
```

---

## 5) Mock de Dados (data.js)

```js
const estoque = [
  { loja: 'SP-01', produto: 'TV 50', quantidade: 4, minimo: 10 },
  { loja: 'RJ-02', produto: 'Soundbar', quantidade: 18, minimo: 5 }
];

const pedidos = [
  { id: 1001, status: 'Em trânsito', atrasoHoras: 5 },
  { id: 1002, status: 'Entregue', atrasoHoras: 0 }
];
```

---

## 6) Inteligência Operacional (intel.js)

```js
function verificarAlertas() {
  estoque.forEach(item => {
    if (item.quantidade < item.minimo) {
      console.warn(`⚠ Estoque baixo: ${item.produto} na loja ${item.loja}`);
    }
  });

  pedidos.forEach(p => {
    if (p.atrasoHoras > 2) {
      console.warn(`⏰ Pedido ${p.id} está atrasado`);
    }
  });
}

verificarAlertas();
```

---

## 7) Evolução Natural do Projeto

**Fase 1 — MVP (HTML/CSS/JS puro)**

* Layout
* Fluxos principais
* Dados mockados

**Fase 2 — Integração**

* API REST (Node, PHP ou Python)
* Banco de dados
* Autenticação real

**Fase 3 — Inteligência avançada**

* Previsão de demanda
* Ranking de lojas/produtos
* Sugestão automática de reposição

---

## 8) Próximo Passo Técnico

1. Definir **layout do dashboard**
2. Criar **index.html (login)**
3. Montar **dashboard.html com KPIs**

Este documento é a fundação. A partir daqui, evoluímos módulo por módulo.
