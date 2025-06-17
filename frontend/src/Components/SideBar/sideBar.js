import React, { useState } from 'react';
import './Sidebar.css'; // CSS separado
import { ReactComponent as CalculadoraIcon } from '../../icons/icon_calculadora.svg';
import { ReactComponent as HistoricoIcon } from '../../icons/icon_hist_vendas.svg';
import { ReactComponent as EstoqueIcon } from '../../icons/icon_estoque.svg';
import { ReactComponent as RelatorioIcon } from '../../icons/icon_relatórios.svg'
import { useNavigate } from 'react-router-dom';
 


const Sidebar = () => {
  const [ativo, setAtivo] = useState(0);
  const navigate = useNavigate(); 

  const botoes = [
    { id: 0, rota: '/Inicio', icon: CalculadoraIcon},
    { id: 1, rota: 'Histórico-de-vendas', icon: HistoricoIcon },
    { id: 2, rota: 'Estoque', icon: EstoqueIcon },  
  ];



  return (
    <aside>
      <nav className="navBar">
        <div className="highlight" style={{ top: `${ativo * 60}px` }} />
        {botoes.map((btn) => {
            const Icon = btn.icon; // Aqui pegamos o componente SVG certo
            return (
              <button
                key={btn.id}
                className={`btn ${ativo === btn.id ? 'ativo' : ''}`}
                onClick={() => {
                  setAtivo(btn.id);
                  navigate(btn.rota);
                }}
              >
                <Icon className="icone" />
              </button>
            );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;