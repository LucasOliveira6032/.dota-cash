import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';


function Login() {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [mensagem, setMensagem] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const resposta = await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario, senha }),
      });

      const dados = await resposta.json();
      console.log('Resposta do backend:', dados);

      if (resposta.ok) {
        localStorage.setItem('usuarioId', dados.usuarioId);
        localStorage.setItem('senhaPadrao', dados.trocaSenhaObrigatoria); // salva flag

        navigate('/principal');
      } else {
        setMensagem(dados.mensagem || 'Usuário ou senha inválidos.');
      }
    } catch (erro) {
      console.error('Erro ao tentar login:', erro);
      setMensagem('Erro ao conectar com o servidor: ' + erro.message);
    }
  };

  return (
    <div className="login-container">
      <div className="background-section"></div>
      <div className="login-box">
        <h2>Faça seu login </h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="exemplo5432"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="*******"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
          <div className="forgot-password">Esqueci minha senha</div>
          <button type="submit">Entrar</button>
        </form>
        {mensagem && <p className="mensagem">{mensagem}</p>}
      </div>
    </div>
  );
}

export default Login;
