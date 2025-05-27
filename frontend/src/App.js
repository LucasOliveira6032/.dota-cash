import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './Components/LoginPage/Login';
import LayoutSistema from './Components/Principal/LayoutSistema';
import Vendas from './Components/VendasPage/vendas';
import HistVendas from './Components/Hist_Vendas/hist_vendas';
import Estoque from './Components/EstoquePage/estoque';
import Relatorios from './Components/RealatoriosPage/relatorios';

import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './Components/Auth/PrivateRoute';

function App() {
  return (
    <div className='contView'>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            
            {/* Rota protegida */}
            <Route
              path="/Inicio"
              element={
                <PrivateRoute>
                  <LayoutSistema />
                </PrivateRoute>
              }
            >
              <Route index element={<Vendas />} />
              <Route path="Histórico-de-vendas" element={<HistVendas />} />
              <Route path="Estoque" element={<Estoque />} />
              <Route path="Relatórios" element={<Relatorios />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </div>
  );
}

export default App;
