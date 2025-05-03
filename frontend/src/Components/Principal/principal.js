import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import './principal.css';


Modal.setAppElement('#root'); 

function Principal() {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [novaSenha, setNovaSenha] = useState('');
  const usuarioId = localStorage.getItem('usuarioId');  



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
      <main className="viewConteudo">
          <h1>Bem Vindo</h1>
      </main>

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
    </div>
  );
}

export default Principal;