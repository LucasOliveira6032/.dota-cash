import React, { useState, useEffect } from 'react';
import './HistoricoVendas.css';
import jsPDF from 'jspdf';
import 'jspdf-autotable';


const Hist_Vendas = () => {
  const [filtroDataInicial, setFiltroDataInicial] = useState('');
  const [filtroDataFinal, setFiltroDataFinal] = useState('');

  const [filtroPagamento, setFiltroPagamento] = useState('');
  const [vendaSelecionada, setVendaSelecionada] = useState(null);
  const [itensVenda, setItensVenda] = useState([]);
  const [vendas, setVendas] = useState([]);


  const carregarDetalhesVenda = async (venda) => {
  setVendaSelecionada(venda);
  try {
    const response = await fetch(`http://localhost:3001/vendas/${venda.id}/detalhes`);
    const data = await response.json();
    console.log("Resposta de /vendas:", data);

    setItensVenda(data.itens);
  } catch (error) {
    console.error("Erro ao carregar detalhes da venda:", error);
  }
};

useEffect(() => {
  const buscarVendas = async () => {
    try {
      const response = await fetch("http://localhost:3001/vendas");
      const data = await response.json();

      console.log("Vendas carregadas:", data);

      if (Array.isArray(data)) {
        setVendas(data);
      } else {
        console.error("O backend não retornou um array:", data);
        setVendas([]);
      }

    } catch (error) {
      console.error("Erro ao buscar vendas:", error);
      setVendas([]);
    }
  };

  buscarVendas();
}, []);


const vendasFiltradas = vendas.filter(venda => {
  const dataVenda = new Date(venda.data);
  const dataInicial = filtroDataInicial ? new Date(filtroDataInicial) : null;
  const dataFinal = filtroDataFinal ? new Date(filtroDataFinal) : null;

  return (
    (!dataInicial || dataVenda >= dataInicial) &&
    (!dataFinal || dataVenda <= dataFinal) &&
    (!filtroPagamento || venda.metodo_pagamento === filtroPagamento)
  );
});

  const handleImprimir = () => {
    alert(`Imprimir venda ID: ${vendaSelecionada.id}`);
  };;

const gerarRelatorioPDF = (vendasFiltradas, filtroDataInicial, filtroDataFinal) => {
  if (!Array.isArray(vendasFiltradas)) {
    console.error("vendasFiltradas não é um array:", vendasFiltradas);
    return;
  }

  const doc = new jsPDF();

  // Cabeçalho (ANTES da tabela)
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('EMPRESA XYZ', 105, 20, null, null, 'center');
  doc.setFontSize(14);
  doc.text('Relatório de Vendas', 105, 30, null, null, 'center');

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const periodoTexto = filtroDataInicial && filtroDataFinal
    ? `Período: ${filtroDataInicial} a ${filtroDataFinal}`
    : 'Período: Todos';
  doc.text(periodoTexto, 105, 38, null, null, 'center');
  doc.text(`Emitido em: ${new Date().toLocaleDateString()}`, 105, 45, null, null, 'center');

  // Dados da tabela
  const dadosTabela = vendasFiltradas.map(venda => [
    venda.id,
    venda.data,
    venda.cliente || '',
    `R$ ${(parseFloat(venda.total) || 0).toFixed(2)}`,
    venda.metodo_pagamento || 'Indefinido'
  ]);

  // Tabela
  doc.autoTable({
    startY: 55, // começa após o cabeçalho
    head: [['ID', 'Data', 'Cliente', 'Total (R$)', 'Pagamento']],
    body: dadosTabela,
    styles: { fontSize: 10 },
    headStyles: { fillColor: [230, 230, 230] }
  });

  // Totais
  const totaisPorMetodo = {};
  let totalGeral = 0;

  vendasFiltradas.forEach(venda => {
    const metodo = venda.metodo_pagamento || 'Indefinido';
    const total = parseFloat(venda.total) || 0;
    totaisPorMetodo[metodo] = (totaisPorMetodo[metodo] || 0) + total;
    totalGeral += total;
  });

  let yAtual = doc.autoTable.previous.finalY + 10;

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Totais por Método de Pagamento:', 14, yAtual);
  yAtual += 7;

  doc.setFont('helvetica', 'normal');
  Object.entries(totaisPorMetodo).forEach(([metodo, total]) => {
    doc.text(`${metodo}:`, 20, yAtual);
    doc.text(`R$ ${total.toFixed(2)}`, 150, yAtual, null, null, 'right');
    yAtual += 6;
  });

  // Total geral
  yAtual += 4;
  doc.setFont('helvetica', 'bold');
  doc.text('Total geral:', 20, yAtual);
  doc.text(`R$ ${totalGeral.toFixed(2)}`, 150, yAtual, null, null, 'right');

  doc.save('relatorio_vendas.pdf');
};



  return (
    <div className={`historico-container ${vendaSelecionada ? 'com-detalhes' : ''}`}>

      <div className="filtros">
        <div>
          <label className='title-text'>Data:</label>
          <input type="date" value={filtroDataInicial} onChange={e => setFiltroDataInicial(e.target.value)} />
          <input type='date' value={filtroDataFinal} onChange={e => setFiltroDataFinal(e.target.value)}/>
        </div>
        <div>
          <label className='title-text'>Metodo de Pagamento:</label>
          <select value={filtroPagamento} onChange={e => setFiltroPagamento(e.target.value)}>
            <option value="">Todos</option>
            <option value="Dinheiro">Dinheiro</option>
            <option value="Crédito">Cartão de Crédito</option>
            <option value="Débito">Cartão de Débito</option>
            <option value="Pix">Pix</option>
          </select>
        </div>
        <div className="imprimir-relatorio">
          <label className="title-text">Relatório de Venda:</label>
          <button className='botao-imprimir' onClick={() => gerarRelatorioPDF(vendasFiltradas, filtroDataInicial, filtroDataFinal)}>Imprimir</button>
        </div>
      </div>

      <div className="conteudo">
        <div className="tabela-vendas-wrapper">
          <table className="tabela-vendas">
            <thead>
              <tr>
                <th className='title-text'>ID</th>
                <th className='title-text'>Data</th>
                <th className='title-text'>Cliente</th>
                <th className='title-text'>Total (R$)</th>
                <th className='title-text'>Pagamento</th>
                <th className='title-text'>Ações</th>
              </tr>
            </thead>
            <tbody>
              {vendasFiltradas.length > 0 ? (
                vendasFiltradas.map(venda => (
                  <tr key={venda.id}>
                    <td>{venda.id}</td>
                    <td>{venda.data}</td>
                    <td>{venda.cliente}</td>
                    <td>{(parseFloat(venda.total) || 0).toFixed(2)}</td>
                    <td>{venda.metodo_pagamento}</td>
                    <td>
                      <button className="botao-detalhes" onClick={() => carregarDetalhesVenda(venda)}>
                        Detalhes
                      </button>

                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">Nenhuma venda encontrada.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {vendaSelecionada && (
          <div className="detalhes-venda">
            <h3 className='title-text'>Detalhes da Venda #{vendaSelecionada.id}</h3>            
            <h4 className='title-text'>Itens da Venda:</h4>
            <table className="tabela-vendas">
              <thead>
                <tr>
                  <th className='title-text'>Produto</th>
                  <th className='title-text'>Qtd</th>
                  <th className='title-text'>Preço Unit.</th>
                  <th className='title-text'>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {itensVenda.length > 0 ? (
                  itensVenda.map((item, index) => (
                    <tr key={index}>
                      <td>{item.nome}</td>
                      <td>{item.quantidade}</td>
                      <td>R$ {(Number(item.preco_unitario) || 0).toFixed(2)}</td>
                      <td>R$ {(parseFloat(item.total) || 0).toFixed(2)}</td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="4">Nenhum item encontrado.</td></tr>
                )}
              </tbody>
            </table>


            <p className='title-text'><strong>Cliente:</strong> {vendaSelecionada.cliente}</p>
            <p className='title-text'><strong>Data:</strong> {vendaSelecionada.data}</p>
            <p className='title-text'><strong>Total:</strong> R$ {(Number(vendaSelecionada.total) || 0).toFixed(2)}</p>
            <p className='title-text'><strong>Pagamento:</strong> {vendaSelecionada.metodo_pagamento}</p>




            <div className="acoes-detalhes">
              <button className="botao-imprimir" onClick={handleImprimir}>Imprimir</button>
            </div>

            <button className="fechar-detalhes" onClick={() => setVendaSelecionada(null)}>Fechar</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Hist_Vendas;
