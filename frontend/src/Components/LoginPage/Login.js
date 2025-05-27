import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { useAuth } from '../../contexts/AuthContext'; // certifique-se de importar isso





function Login() {
  const { login } = useAuth(); // use isso dentro do componente Login
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
      console.log('O Backend está respondendo a aquisição de Login');

      if (resposta.ok) {
        if (dados.trocaSenhaObrigatoria) {
          // senha temporária: salva só o ID, e força troca no LayoutSistema
          localStorage.setItem('usuarioId', dados.usuarioId);
          localStorage.setItem('senhaPadrao', true);
          navigate('/Inicio');
        } else {
          // login completo com token
          login(dados.usuarioId, dados.token);
          localStorage.setItem('senhaPadrao', false);
          navigate('/Inicio');
        }
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
