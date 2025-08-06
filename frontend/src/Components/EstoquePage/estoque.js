import React, { useEffect, useState } from 'react';
import './estoque.css';
import axios from 'axios';

//Pagina pronta

function Estoque(){
  const apiUrl = process.env.REACT_APP_API_URL;
  const [produtos, setProdutos] = useState([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [produtoEditadoId, setProdutoEditadoId] = useState(null);
  const [produtosFiltrados, setProdutosFiltrados] = useState([]);
  const [termoBusca, setTermoBusca] = useState('');
  const usuarioId = localStorage.getItem('usuarioId');

  const carregarProdutos = async () => {
    try {
      const resposta = await axios.get(`${apiUrl}/produtos`);
      setProdutos(resposta.data);
      setProdutosFiltrados(resposta.data); // inicialmente mostra todos
    } catch (erro) {
      console.error('Erro ao buscar produtos:', erro);
    }
  };

  useEffect(() => {
    carregarProdutos();
  }, []);

  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    preco_custo: '',
    preco_venda: '',
    estoque_minimo: '', 
    estoque: '',
    categoria_id: '',
    codigo_barras: '',
    imagem: '',
    criado_por: '', 
  });

  const filtrarProdutos = () => {
    if (!termoBusca) {
      setProdutosFiltrados(produtos);
      return;
    }

    const buscaMinuscula = termoBusca.toLowerCase();

    const filtrados = produtos.filter((produto) => {
      // verifica se o termo está em nome, descrição ou código de barras
      return (
        (produto.nome && produto.nome.toLowerCase().includes(buscaMinuscula)) ||
        (produto.descricao && produto.descricao.toLowerCase().includes(buscaMinuscula)) ||
        (produto.codigo_barras && produto.codigo_barras.toLowerCase().includes(buscaMinuscula))
      );
    });

    setProdutosFiltrados(filtrados);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitBusca = (e) => {
    e.preventDefault();
    filtrarProdutos();
  };


  const excluirProduto = async (id) => {
  const confirmar = window.confirm('Tem certeza que deseja excluir este produto?');
  if (!confirmar) return;

  try {
    const resposta = await axios.delete(`${apiUrl}/produtos/${id}`);
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
    const url = modoEdicao
      ? `${apiUrl}/produtos/${produtoEditadoId}`
      : `S${apiUrl}/produtos`;

    const method = modoEdicao ? 'PUT' : 'POST';

    // Cria um novo objeto com o usuário que criou/alterou
    const dataToSend = { ...formData, criado_por: usuarioId };

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataToSend),  // envia o criado_por aqui
    });

    const data = await response.json();

    if (response.ok) {
      alert(modoEdicao ? 'Produto atualizado com sucesso!' : 'Produto incluído com sucesso!');
      setFormData({
        nome: '',
        descricao: '',
        preco_custo: '',
        preco_venda: '',
        estoque_minimo: '',  
        estoque: '',
        categoria_id: '',
        codigo_barras: '',
        imagem: '',
        criado_por: '', // pode limpar pois enviou separado
      });
      setModalAberto(false);
      setModoEdicao(false);
      setProdutoEditadoId(null);
      carregarProdutos();
      carregarResumo();
    } else {
      alert(data.mensagem || 'Erro ao salvar produto');
    }
  } catch (error) {
    console.error('Erro ao salvar produto:', error);
    alert('Erro na comunicação com o servidor');
  }
};


  const abrirModalEdicao = (produto) => {
  setModoEdicao(true);
  setProdutoEditadoId(produto.id);
  setFormData({
    nome: produto.nome || '',
    descricao: produto.descricao || '',
    preco_custo: produto.preco_custo || '',
    preco_venda: produto.preco_venda || '',
    estoque_minimo: produto.estoque_minimo || '',
    estoque: produto.estoque || '',
    categoria_id: produto.categoria_id || '',
    codigo_barras: produto.codigo_barras || '',
    imagem: produto.imagem || '',
    criado_por: produto.criado_por || '',
  });
  setModalAberto(true);
};

const [resumo, setResumo] = useState({
  totalProdutos: 0,
  totalUnidades: 0,
  valorEstoque: 0,
  baixoEstoque: 0,
  esgotados: 0
});

const carregarResumo = async () => {
  try {
    const resposta = await axios.get(`${apiUrl}/estoque/resumo`);
    setResumo(resposta.data);
  } catch (erro) {
    console.error('Erro ao buscar resumo:', erro);
  }
};


  useEffect(() => {
    carregarProdutos();
    carregarResumo();
  }, [])



  /*Incluir depois no Top-bar
  
            <form className='formulario' onSubmit={handleSubmitBusca}>
              <input
              type="text"
              placeholder="Pesquise por nome, descrição ou código do produto"
              className="search-input"
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
              />
              <button className="pesquisar" type='submit'>
                <img src="../icon_lupa.svg" alt="lupa"></img>
              </button>
            </form>  
   */

    return(
      <div className="cont-principal">
         <div className="container">
          <div className="top-bar">
          
              <button className="add-button" onClick={() => setModalAberto(true)}>Adicionar Produto</button>
              {modalAberto && (
                <div className="modal-overlay">
                  <div className="modal-form">
                    <h3>{modoEdicao ? 'Editar Produto' : 'Adicionar Novo Produto'}</h3>
                    <form onSubmit={handleSubmit} className="form-produto">
                      <div className='cont-inputs'>
                        <input name="nome" placeholder="Nome" value={formData.nome} onChange={handleChange} required />
                        <input name="descricao" placeholder="Descrição" value={formData.descricao} onChange={handleChange} />
                        <input name="preco_custo" placeholder="Preço de Custo" value={formData.preco_custo} onChange={handleChange} />
                        <input name="preco_venda" placeholder="Preço de Venda" value={formData.preco_venda} onChange={handleChange} />
                        <input name="estoque_minimo"  placeholder="Estoque Mínimo"  value={formData.estoque_minimo}  onChange={handleChange}/>
                        <input name="estoque" placeholder="Estoque" value={formData.estoque} onChange={handleChange} />
                        <input name="categoria_id" placeholder="ID Categoria" value={formData.categoria_id} onChange={handleChange} />
                        <input name="codigo_barras" placeholder="Código de Barras" value={formData.codigo_barras} onChange={handleChange} />
                      </div>
                      <div className="form-buttons">
                        <button type="submit">Salvar</button>
                        <button type="button" onClick={() => setModalAberto(false)}>Cancelar</button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
          </div>

          <div className='tabela-container'>
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
                      <td>{produto.nome_categoria || '---'}</td>
                      <td>{produto.estoque}</td>
                      <td>{Number(produto.preco_custo)?.toFixed(2)}</td>  
                      <td>{Number(produto.preco_venda)?.toFixed(2)}</td>
                      <td className="celula-entrada">
                        <span className="data">{produto.ultima_entrada ? new Date(produto.ultima_entrada).toLocaleDateString() : '---'}</span>
                        <div className="acoes">
                          <button onClick={() => abrirModalEdicao(produto)} className="botao-acao">✏️</button>
                          <button onClick={() => excluirProduto(produto.id)} className="botao-acao">🗑️</button>
                        </div>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
          </div>
          
          <div class="dashboard-stats">
            <div class="stat-card">
              <h4>Total de Produtos</h4>
              <p>{resumo.totalProdutos}</p>
            </div>
            <div class="stat-card">
              <h4>Total em Estoque</h4>
              <p>{resumo.totalUnidades} unidades</p>
            </div>
            <div class="stat-card">
              <h4>Valor do Estoque</h4>
              <p>R$ {Number(resumo.valorEstoque).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            </div>
            <div class="stat-card" >
              <h4>Estoque Baixo</h4>
              <p>{resumo.baixoEstoque} produtos</p>
            </div>
            <div class="stat-card">
              <h4>Esgotados</h4>
              <p>{resumo.esgotados} produtos</p>
            </div>
          </div>

        </div>
      </div>
    );
}

export default Estoque;