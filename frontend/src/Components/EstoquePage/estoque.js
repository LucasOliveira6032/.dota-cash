import React, { useEffect, useState } from 'react';
import './estoque.css';
import axios from 'axios';

function Estoque(){
  const [produtos, setProdutos] = useState([]);
  const [modalAberto, setModalAberto] = useState(false);

  const carregarProdutos = async () => {
    try {
      const resposta = await axios.get('http://localhost:3001/produtos'); // Ajuste a URL se for diferente
      setProdutos(resposta.data);
      console.log(resposta);
    } catch (erro) {
      console.error('Erro ao buscar produtos:', erro);
    }
  };

  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    preco_custo: '',
    preco_venda: '',
    estoque: '',
    categoria_id: '',
    codigo_barras: '',
    imagem: '',
    criado_por: '', 
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const excluirProduto = async (id) => {
  const confirmar = window.confirm('Tem certeza que deseja excluir este produto?');
  if (!confirmar) return;

  try {
    const resposta = await axios.delete(`http://localhost:3001/produtos/${id}`);
    if (resposta.status === 200) {
      alert('Produto excluído com sucesso!');
      carregarProdutos(); // Atualiza a lista
    }
  } catch (erro) {
    console.error('Erro ao excluir produto:', erro);
    alert('Erro ao excluir produto');
  }
};

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3001/produtos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        alert('Produto incluído com sucesso! ID: ' + data.id);
        setFormData({
          nome: '',
          descricao: '',
          preco_custo: '',
          preco_venda: '',
          estoque: '',
          categoria_id: '',
          codigo_barras: '',
          imagem: '',
          criado_por: '',
        });
        setModalAberto(false);
        carregarProdutos();
      } else {
        alert(data.mensagem || 'Erro ao incluir produto');
      }
    } catch (error) {
      console.error('Erro ao enviar produto:', error);
      alert('Erro na comunicação com o servidor');
    }
  };


  useEffect(() => {
    carregarProdutos();
  }, [])

    return(
      <div className="cont-principal">
         <div className="container">
          <div className="top-bar">
              <input
              type="text"
              placeholder="Pesquise por nome, descrição ou número da venda"
              className="search-input"
              />
              <button className="pesquisar">
                  <img src="./icons/icon_lupa.svg" className="immg_pesquisa" alt="lupa"></img>
              </button>
              <button className="add-button" onClick={() => setModalAberto(true)}>Adicionar Produto</button>
              {modalAberto && (
                <div className="modal-overlay">
                  <div className="modal-pix">
                    <h3>Adicionar Novo Produto</h3>
                    <form onSubmit={handleSubmit} className="form-produto">
                      <input name="nome" placeholder="Nome" value={formData.nome} onChange={handleChange} required />
                      <input name="descricao" placeholder="Descrição" value={formData.descricao} onChange={handleChange} />
                      <input name="preco_custo" placeholder="Preço de Custo" value={formData.preco_custo} onChange={handleChange} />
                      <input name="preco_venda" placeholder="Preço de Venda" value={formData.preco_venda} onChange={handleChange} />
                      <input name="estoque" placeholder="Estoque" value={formData.estoque} onChange={handleChange} />
                      <input name="categoria_id" placeholder="ID Categoria" value={formData.categoria_id} onChange={handleChange} />
                      <input name="codigo_barras" placeholder="Código de Barras" value={formData.codigo_barras} onChange={handleChange} />
                      <input name="imagem" placeholder="URL da Imagem" value={formData.imagem} onChange={handleChange} />
                      <input name="criado_por" placeholder="Criado por" value={formData.criado_por} onChange={handleChange} />

                      <div className="form-buttons">
                        <button type="submit">Salvar</button>
                        <button type="button" onClick={() => setModalAberto(false)}>Cancelar</button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
          </div>

          <table className="product-table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Produto</th>
                <th>Categoria</th>
                <th>Estoque</th>
                <th>Preço Custo</th>
                <th>Preço Venda</th>
                <th>Última Entrada</th>
              </tr>
            </thead>
            <tbody >
              {produtos.map((produto) => (
                <tr key={produto.id} className='linha-produto'>
                  <td>{produto.codigo_barras}</td>
                  <td>{produto.nome}</td>
                  <td>{produto.categoria_id || '---'}</td>
                  <td>{produto.estoque}</td>
                  <td>{Number(produto.preco_custo)?.toFixed(2)}</td>  
                  <td>{Number(produto.preco_venda)?.toFixed(2)}</td>
                  <td className="celula-entrada">
                    <span className="data">{produto.ultima_entrada ? new Date(produto.ultima_entrada).toLocaleDateString() : '---'}</span>
                    <div className="acoes">
                      <button onClick={() => alert('Editar')} className="botao-acao">✏️</button>
                      <button onClick={() => excluirProduto(produto.id)} className="botao-acao">🗑️</button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
}

export default Estoque;