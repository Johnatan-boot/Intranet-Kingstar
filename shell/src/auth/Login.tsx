import { useState } from "react";
import { api } from "../services/api";
import { comparePassword } from "../utils/crypto";
import { useAuthStore } from "../store/authStore";
import { toast } from "react-toastify";
import "././login.css";
import Register from "./Register";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [showCadastro, setShowCadastro] = useState(false);

  const loginStore = useAuthStore((s) => s.login);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    try {
      const res = await api.get(`/usuarios?email=${email}`);
      const user = res.data[0];

      if (!user) {
        toast.error("Usuário não encontrado");
        return;
      }

      if (!user.ativo) {
        toast.warning("Usuário ainda não aprovado");
        return;
      }

      if (!comparePassword(senha, user.senha)) {
        toast.error("Senha inválida");
        return;
      }

      const fakeToken = btoa(JSON.stringify(user));
      loginStore(user, fakeToken);

      toast.success("Login realizado com sucesso");
      window.location.href = "/";
    } catch {
      toast.error("Erro ao realizar login");
    }
  }

  return (
    <div className="login-page">
      <div className="login-box">

        {/* LOGO KINGSTAR */}
        <img
          src="../../src/assets/img/logokingstar.gif"
          className="logo"
          alt="Kingstar"
        />

        <h1>Kingstar Intranet</h1>

        {/* FORM LOGIN */}
        <form onSubmit={handleLogin} className="d-grid gap-2">
         <input
          type="email"
          placeholder="Email corporativo"
          onChange={(e) => setEmail(e.target.value)}
          required
        />


          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />

          <button className="btn btn-dark">Entrar</button>

          {/* BOTÃO CADASTRO */}
          <button
            type="button"
            className="btn btn-outline-dark"
            onClick={() => setShowCadastro(true)}
          >
            Solicitar Cadastro
          </button>
        </form>

        {/* MODAL CADASTRO */}
        {showCadastro && (
          <Register onClose={() => setShowCadastro(false)} />
        )}
      </div>
    </div>
  );
}
