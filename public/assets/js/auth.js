const form = document.getElementById('loginForm');
const erro = document.getElementById('erro');



//LOGIN
form.addEventListener('submit', async e => {
  e.preventDefault();

  const email = form[0].value;
  const senha = form[1].value;

  const res = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, senha })
  });

  const data = await res.json();

  if (!res.ok) {
    erro.innerText = data.erro;
    return;
  }

  localStorage.setItem('token', data.token);
  window.location.href = 'dashboard.html';
});


//CADASTRO
document.getElementById('btn-cadastro').onclick = () => {
  document.getElementById('form-cadastro').classList.toggle('hidden');
};

document.getElementById('form-cadastro').onsubmit = async (e) => {
  e.preventDefault();

  const data = {
    nome: nome.value,
    email: email.value,
    senha: senha.value,
    setor: setor.value
  };

  const res = await fetch('/api/usuarios', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  const result = await res.json();
  alert(result.mensagem || result.erro);
};



