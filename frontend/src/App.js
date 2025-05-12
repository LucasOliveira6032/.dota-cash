import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './Components/LoginPage/Login';
import LayoutSistema from './Components/Principal/LayoutSistema';
import Vendas from './Components/VendasPage/vendas';
import HistVendas from './Components/Hist_Vendas/hist_vendas';
import Estoque from './Components/EstoquePage/estoque';
import Relatorios from './Components/RealatoriosPage/relatorios';

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

        <Route path="/Inicio" element={<LayoutSistema />}>
          <Route index element={<Vendas />}/>
          <Route path='Histórico-de-vendas' element={<HistVendas />}/>
          <Route path='Estoque' element={<Estoque />}/>
          <Route path='Relatórios' element={<Relatorios />}/>
        </Route>
        {/* Outras rotas, como dashboard ou estoque, podem ser adicionadas aqui */}
      </Routes>
    </Router>
    </div>
  );
}

export default App;

/*Verificar com o chat, pois quando o path em
<Route path="/Vendas" element={<LayoutSistema />}> 
está apenas com a /, ao iniciar o sistema o acesso 
vai direto para a tela layout sistema e 
não para a pagina de login*/