import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './Components/LoginPage/Login';
import Principal from './Components/Principal/principal';

function App() {
  /*  teste de conexão com backend
  const [mensagem, setMensagem] = useState('');

  useEffect(() => {
    fetch('http://localhost:3001') // endereço do backend
      .then(res => res.text())     // converte a resposta para texto
      .then(data => {
        console.log('Resposta da API:', data);
        setMensagem(data);
      })
      .catch(error => {
        console.error('Erro ao conectar com a API:', error);
      });
  }, []);

  teste de mensagem do backend
  <h1>Frontend React</h1>
      <p>Mensagem do backend:</p>
      <strong>{mensagem}</strong>*/

  return (
    <div className='contView'>
      <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/principal" element={<Principal />} />
        {/* Outras rotas, como dashboard ou estoque, podem ser adicionadas aqui */}
      </Routes>
    </Router>
    </div>
  );
}

export default App;
