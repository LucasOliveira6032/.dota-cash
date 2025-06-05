import React, { useState, useEffect } from 'react';

const vendasExemplo = [
  { id: 1, data: '2025-06-01', cliente: 'João Silva', total: 150.5, status: 'Concluída', itens: [{ nome: 'Produto A', quantidade: 2, preco: 50 }] },
  { id: 2, data: '2025-06-02', cliente: 'Maria Souza', total: 300, status: 'Cancelada', itens: [{ nome: 'Produto B', quantidade: 3, preco: 100 }] },
  { id: 3, data: '2025-06-03', cliente: 'Carlos Lima', total: 75, status: 'Concluída', itens: [{ nome: 'Produto C', quantidade: 1, preco: 75 }] },
];

function Hist_vendas() {
     
    const [vendas, setVendas] = useState([]);
    const [filtroCliente, setFiltroCliente] = useState('');
    const [modalAberto, setModalAberto] = useState(false);
    const [vendaSelecionada, setVendaSelecionada] = useState(null);
  
    useEffect(() => {
      // Aqui você pode buscar a lista de vendas da API
      setVendas(vendasExemplo);
    }, []);
  
    const filtrarVendas = () => {
      if (!filtroCliente) return vendas;
      return vendas.filter(v => v.cliente.toLowerCase().includes(filtroCliente.toLowerCase()));
    };
  
    const abrirModalDetalhes = (venda) => {
      setVendaSelecionada(venda);
      setModalAberto(true);
    };
  
    const fecharModal = () => {
      setModalAberto(false);
      setVendaSelecionada(null);
    };
  
    const excluirVenda = (id) => {
      if (window.confirm('Tem certeza que deseja excluir esta venda?')) {
        setVendas(prev => prev.filter(v => v.id !== id));
        alert('Venda excluída com sucesso!');
      }
    };
  
    return (
      <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
        <h2>Histórico de Vendas</h2>
  
        <div style={{ marginBottom: '10px' }}>
          <input
            type="text"
            placeholder="Buscar por cliente..."
            value={filtroCliente}
            onChange={(e) => setFiltroCliente(e.target.value)}
            style={{ padding: '6px', width: '250px' }}
          />
        </div>
  
        <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#eee' }}>
              <th>ID</th>
              <th>Data</th>
              <th>Cliente</th>
              <th>Total (R$)</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtrarVendas().map(venda => (
              <tr key={venda.id}>
                <td>{venda.id}</td>
                <td>{new Date(venda.data).toLocaleDateString()}</td>
                <td>{venda.cliente}</td>
                <td>{venda.total.toFixed(2)}</td>
                <td>{venda.status}</td>
                <td>
                  <button onClick={() => abrirModalDetalhes(venda)} style={{ marginRight: '8px' }}>Detalhes</button>
                  <button onClick={() => excluirVenda(venda.id)} style={{ color: 'red' }}>Excluir</button>
                </td>
              </tr>
            ))}
            {filtrarVendas().length === 0 && (
              <tr><td colSpan="6" style={{ textAlign: 'center' }}>Nenhuma venda encontrada</td></tr>
            )}
          </tbody>
        </table>
  
        {modalAberto && vendaSelecionada && (
          <div style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center'
          }}>
            <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '6px', width: '400px', maxHeight: '80vh', overflowY: 'auto' }}>
              <h3>Detalhes da Venda #{vendaSelecionada.id}</h3>
              <p><strong>Cliente:</strong> {vendaSelecionada.cliente}</p>
              <p><strong>Data:</strong> {new Date(vendaSelecionada.data).toLocaleDateString()}</p>
              <p><strong>Status:</strong> {vendaSelecionada.status}</p>
              <p><strong>Total:</strong> R$ {vendaSelecionada.total.toFixed(2)}</p>
              <h4>Itens:</h4>
              <ul>
                {vendaSelecionada.itens.map((item, idx) => (
                  <li key={idx}>{item.nome} - {item.quantidade}x R$ {item.preco.toFixed(2)}</li>
                ))}
              </ul>
              <button onClick={fecharModal}>Fechar</button>
            </div>
          </div>
        )}
      </div>
    );
}

export default Hist_vendas;