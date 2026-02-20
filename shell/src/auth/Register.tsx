import { useState } from "react";
import { api } from "../services/api";
import { hashPassword } from "../utils/crypto";
import { toast } from "react-toastify";
import "../../src/assets/img/logokingstar.gif";

type RegisterProps = {
  onClose: () => void;
};

export default function Register({ onClose }: RegisterProps) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [setor, setSetor] = useState("");

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();

    try {
      const exists = await api.get(`/usuarios?email=${email}`);

      if (exists.data.length > 0) {
        toast.warning("Já existe um cadastro com este email");
        return;
      }

      await api.post("/usuarios", {
        nome,
        email,
        setor,
        senha: hashPassword(senha),
        role: "USER",
        ativo: false,
      });

      toast.success("Cadastro enviado para aprovação");
      onClose();
    } catch {
      toast.error("Erro ao solicitar cadastro");
    }
  }

  return (
    <div className="modal-backdrop-custom">
      <div className="modal-custom">
        <h5>Solicitar Cadastro</h5>

        <form onSubmit={handleRegister} className="d-grid gap-2">
          <input
            placeholder="Nome completo"
            onChange={(e) => setNome(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Email corporativo"
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <select onChange={(e) => setSetor(e.target.value)} required>
            <option value="">Selecione o setor</option>
            <option value="LOGISTICA">Logística</option>
            <option value="ESTOQUE">Estoque</option>
            <option value="TI">TI</option>
            <option value="RH">RH</option>
          </select>

          <input
            type="password"
            placeholder="Senha"
            onChange={(e) => setSenha(e.target.value)}
            required
          />

          <button className="btn btn-dark">Enviar</button>

          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={onClose}
          >
            Cancelar
          </button>
        </form>
      </div>
    </div>
  );
}
