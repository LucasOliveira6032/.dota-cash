import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { FaUser } from 'react-icons/fa';
import './principal.css';
import Sidebar from '../SideBar/sideBar';
import { Outlet } from 'react-router-dom';


Modal.setAppElement('#root'); 

function LayoutSistema() {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [novaSenha, setNovaSenha] = useState('');
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
  


/* Dentro da MAIN
<AnimatePresence mode="wait">
          <motion.div
            key={telaAtual}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderizarTela()}
          </motion.div>
        </AnimatePresence>
*/

  return (
    <div className='Content_objects'>
      <Modal isOpen={mostrarModal} contentLabel="Trocar Senha">
        <h2>Trocar Senha</h2>
        <input
          type="password"
          placeholder="Nova senha"
          value={novaSenha}
          onChange={(e) => setNovaSenha(e.target.value)}
        />
        <button onClick={trocarSenha}>Confirmar</button>
      </Modal>

      <Sidebar/>
      
      <section className='viewTelas'>
          <img src='./logo.svg' className='logo'></img>
          <div className="usuario-menu">
            <img src="./icons/icon_profile.svg" alt='logo_user'
              className="icone-usuario"
              onClick={() => setMenuAberto(!menuAberto)}
            />
            {menuAberto && (
              <div className="menu-dropdown">
                <button onClick={handleLogout}>Sair</button>
              </div>
            )}
          </div>
          <Outlet/> 
      </section>
    </div>
  );
}

export default LayoutSistema;