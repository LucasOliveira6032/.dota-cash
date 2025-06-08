import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import './principal.css';
import Sidebar from '../SideBar/sideBar';
import { Outlet } from 'react-router-dom';

Modal.setAppElement('#root');

function LayoutSistema() {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [novaSenha, setNovaSenha] = useState('');
  const [senhaConfirmada, setSenhaConfirmada] = useState('');
  const usuarioId = localStorage.getItem('usuarioId');
  const [menuAberto, setMenuAberto] = useState(false);

  const handleLogout = () => {
    localStorage.clear(); // Remove token, id, senhaPadrao etc.
    window.location.href = '/'; // Redireciona para tela de login
  };

  useEffect(() => {
    const precisaTrocar = localStorage.getItem('senhaPadrao') === 'true';
    setMostrarModal(precisaTrocar);
  }, []);

  const trocarSenha = async () => {
    if (novaSenha !== senhaConfirmada) {
      alert('As senhas não coincidem.');
      return;
    }
    if (!novaSenha) {
      alert('Informe a nova senha.');
      return;
    }

    try {
      const resposta = await fetch('http://localhost:3001/trocar-senha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: usuarioId, novaSenha }),
      });

      const dados = await resposta.json();

      if (resposta.ok) {
        alert('Senha trocada com sucesso!');
        localStorage.setItem('senhaPadrao', false);
        setMostrarModal(false);
      } else {
        alert(dados.mensagem || 'Erro ao trocar a senha.');
      }
    } catch (erro) {
      alert('Erro de conexão com o servidor.');
    }
  };

  // Renderiza o modal se o usuário precisar trocar a senha
  if (mostrarModal) {
    return (
      <Modal isOpen={true} className="overlay-modal" contentLabel="Trocar Senha">
        <div className='cont-primeiro-acesso'>
          <h2>Primeiro acesso — Defina uma nova senha</h2>
            <div className='cont-inputs-troca'>
            <input
              type="password"
              placeholder="Nova senha"
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirme a senha"
              value={senhaConfirmada}
              onChange={(e) => setSenhaConfirmada(e.target.value)}
            />
            <button onClick={trocarSenha}>Confirmar</button>
            <button onClick={handleLogout}>Cancelar e sair</button>
          </div>
        </div>
      </Modal>
    );
  }

  // Renderiza a interface normal se não precisar trocar senha
  return (
    <div className="Content_objects">
      <Sidebar />

      <section className="viewTelas">
        <img src="./logo.svg" className="logo" alt="logo-dotta" />
        <div className="usuario-menu">
          <img
            src="./icon_profile.svg"
            alt="logo_user"
            className="icone-usuario"
            onClick={() => setMenuAberto(!menuAberto)}
          />
          {menuAberto && (
            <div className="menu-dropdown">
              <button onClick={handleLogout}>Sair</button>
            </div>
          )}
        </div>
        <Outlet />
      </section>
    </div>
  );
}

export default LayoutSistema;
