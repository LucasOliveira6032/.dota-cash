import React, { useState, useEffect, useRef } from "react";
import './vendas.css';
import axios from 'axios';

function Vendas() {
    const [produtos, setProdutos] = useState([]);
    const [total, setTotal] = useState(0);
    const [codigo, setCodigo] = useState("");
    const [cpfSolicitado, setCpfSolicitado] = useState(false);
    const [modoCPF, setModoCPF] = useState(false);
    const [clienteMsg, setClienteMsg] = useState("Controle");
    const [fasePagamento, setFasePagamento] = useState(false);
    const [formaPagamento, setFormaPagamento] = useState("");
    const [esperandoValorRecebido, setEsperandoValorRecebido] = useState(false);
    const [troco, setTroco] = useState(null);
    const [valorPagoTotal, setValorPagoTotal] = useState(0);
    const [valorRestante, setValorRestante] = useState(0);
    const [mensagemAviso, setMensagemAviso] = useState(null);
    const listItensRef = useRef(null);
    const listItensControllRef = useRef(null);
    const [modoQuantidade, setModoQuantidade] = useState(false);
    const [indiceEdicao, setIndiceEdicao] = useState(null);
    const [modoCreditoDebito, setModoCreditoDebito] = useState(false);
    const [modoParcelamento, setModoParcelamento] = useState(false);
    const [etapaCartao, setEtapaCartao] = useState(""); // '', 'debito', 'credito'
    const [clienteId, setClienteId] = useState(null);
    const [metodoPagamentoSelecionado, setMetodoPagamentoSelecionado] = useState(null);
    const usuarioId = localStorage.getItem("usuarioId");
    const [aguardandoImpressao, setAguardandoImpressao] = useState(false);
    const [cpfCliente, setCpfCliente] = useState("");
    const [nomeCliente, setNomeCliente] = useState("");
    const [verificandoMaquina, setVerificandoMaquina] = useState(false);
    const [modalPixAberto, setModalPixAberto] = useState(false);
    const [vendaId, setVendaId] = useState(null);
    const [qrCodeBase64, setQrCodeBase64] = useState(null);
    const [pagamentoId, setPagamentoId] = useState(null);
    const [intervaloVerificacao, setIntervaloVerificacao] = useState(null);


    const cancelarVenda = () => {

      setProdutos([]);
      setTotal(0);
      setVendaId(null);
      // resetar estados...
      setTroco(null);
      setModoParcelamento(false);
      setEtapaCartao(null);
      setEsperandoValorRecebido(false);
      setModoCPF(false);
      setModoCreditoDebito(false);
      setValorRestante(0);
      setFasePagamento(false);
      setCpfSolicitado(false);
      setModoQuantidade(false);
      setMetodoPagamentoSelecionado(null);

      // (Opcional) Mostra mensagem de confirmação:
      setMensagemAviso("Venda cancelada com sucesso.");
        setTimeout(() => {
    setMensagemAviso("");
  }, 3000);
    };

const adicionarProduto = async () => {
  if (!vendaId) {
  try {
    const res = await fetch("http://localhost:3001/vendas/iniciar", {
      method: "POST",
    });

    const data = await res.json();
    setVendaId(data.vendaId);
    console.log("Venda iniciada com ID:", data.vendaId);
  } catch (err) {
    console.error("Erro ao iniciar venda:", err);
    mostrarAviso("Erro ao iniciar venda.");
    return;
  }
}

  try {
    const codigoLimpo = (codigo || '').trim();

    if (!codigoLimpo) {
      mostrarAviso("Digite um código válido!");
      return;
    }

    const response = await fetch(`http://localhost:3001/produtos/${codigoLimpo}`);

    if (!response.ok) {
      mostrarAviso("Produto não encontrado.");
      return;
    }

    const resultado = await response.json();
    const produto = resultado[0]; // <- Aqui está a chave

    if (!produto) {
      mostrarAviso("Produto não encontrado.");
      return;
    }

    const precoFormatado = parseFloat(produto.preco_venda || 0);

    setProdutos((prevProdutos) => {
      const produtosAtualizados = [...prevProdutos];
      const produtoExistenteIndex = produtosAtualizados.findIndex(p => p.id === produto.id);

      if (produtoExistenteIndex !== -1) {
        const produtoExistente = produtosAtualizados[produtoExistenteIndex];
        const novaQuantidade = produtoExistente.quantidade + 1;
        produtosAtualizados[produtoExistenteIndex] = {
          ...produtoExistente,
          quantidade: novaQuantidade,
          subtotal: precoFormatado * novaQuantidade,
        };
      } else {
        const novoProduto = {
          id: produto.id,
          codigo: produto.codigo_barras,
          nome: produto.nome,
          preco: precoFormatado,
          quantidade: 1,
          subtotal: precoFormatado,
        };
        produtosAtualizados.push(novoProduto);
      }

      const novoTotal = produtosAtualizados.reduce((acc, p) => acc + p.subtotal, 0);
      setTotal(novoTotal);

      return produtosAtualizados;
    });

    setCodigo("");
    console.log("Produto retornado da API:", produto);
  } catch (error) {
    console.error("Erro ao adicionar produto:", error);
    mostrarAviso("Erro ao buscar produto.");
  }
};

    const editarProduto = (index, novaQuantidade) => {
      setProdutos((prevProdutos) => {
      if (novaQuantidade <= 0) return mostrarAviso("Quantidade inválida");
      const atualizados = [...prevProdutos];
      const produto = atualizados[index];
      const novoSubtotal = produto.preco * novaQuantidade;
      atualizados[index] = {
        ...produto,
        quantidade: novaQuantidade,
        subtotal: novoSubtotal,
      };

      // Recalcular o total com base nos produtos atualizados
      const novoTotal = atualizados.reduce(
        (acc, p) => acc + p.subtotal,
        0
      );
      setTotal(novoTotal);

      return atualizados;
      });
    }

    const excluirProduto = (index) => {
      const produtoRemovido = produtos[index];
      const novosProdutos = produtos.filter((_, i) => i !== index);

      if (!produtoRemovido) return mostrarAviso("Produto não encontrado para remover");

      setProdutos(novosProdutos);
      setTotal((prevTotal) => prevTotal - produtoRemovido.subtotal);
    };

    useEffect(() => {
      if (listItensRef.current) {
        listItensRef.current.scrollTop = listItensRef.current.scrollHeight;
      }
      if (listItensControllRef.current) {
        listItensControllRef.current.scrollTop = listItensControllRef.current.scrollHeight;
      }
    }, [produtos]);

    useEffect(() => {
  if (aguardandoImpressao) {
    const timer = setTimeout(() => {
      console.log("Finalizando venda após espera para impressão...");
      finalizarVenda(); // sua função atual
      setAguardandoImpressao(false); // reseta o estado
    }, 3000); // aguarda 3 segundos

    return () => clearTimeout(timer); // limpa timeout se componente for desmontado
  }
}, [aguardandoImpressao]);

    const handleKeyDown = (e) => {
      if (e.key === "Enter") {
        if (verificandoMaquina) return;

        if (modoQuantidade) {
          const qtd = parseInt(codigo);
          if (!isNaN(qtd) && qtd > 0 && indiceEdicao !== null) {
            editarProduto(indiceEdicao, qtd);
            setModoQuantidade(false);
            setIndiceEdicao(null);
            setCodigo("");
          } else {
            setMensagemAviso("Quantidade inválida");
          }
          return;
        }

        if (produtos.length === 0 && codigo === "") {
          mostrarAviso("Nenhum produto adicionado. Escaneie um produto para iniciar.");
          setCpfSolicitado(false);
          setModoCPF(false);
          setFasePagamento(false);
          return;
        }

        if (modoCPF) {
          const cpfValido = validarCPF(codigo);
          if (!cpfValido) {
            mostrarAviso("CPF inválido. Verifique e tente novamente.");
            setCodigo("");
            return;
          }

          setCodigo("");
          setModoCPF(false);
          setCpfSolicitado(false);
          setFasePagamento(true);
          return;
        }

        if (esperandoValorRecebido) {
          const valorRecebido = parseFloat(codigo.replace(",", "."));

          if (!isNaN(valorRecebido)) {
            const novoValorPago = valorPagoTotal + valorRecebido;
            if (novoValorPago >= total) {
              const valorTroco = novoValorPago - total;
              setTroco(valorTroco);
              setEsperandoValorRecebido(false);
              setValorPagoTotal(0);
              setValorRestante(0);
              setFormaPagamento("");
            } else {
              const restante = total - novoValorPago;
              setValorPagoTotal(novoValorPago);
              setValorRestante(restante);
              setEsperandoValorRecebido(false);
              setFasePagamento(true);
            }
          }

          setCodigo("");
          return;
        }

        if (modoParcelamento) {
          const parcelas = parseInt(codigo.trim());
          if (parcelas >= 1 && parcelas <= 10) {
            setFormaPagamento((prev) => prev + (prev ? " + " : "") + `Cartão - Crédito (${parcelas}x)`);
            setModoParcelamento(false);
            setVerificandoMaquina();
            setEtapaCartao("verificando");
            setMensagemAviso("Venda finalizada com sucesso!");
            setCodigo("");

            if (valorRestante > 0) {
              const pagamentoFinal = valorRestante || total;
              const novoValorPago = valorPagoTotal + pagamentoFinal;

              if (novoValorPago >= total) {
                setTroco(novoValorPago - total);
                setValorPagoTotal(null);
                setValorRestante(null);
              } else {
                setValorPagoTotal(novoValorPago);
                setValorRestante(total - novoValorPago);
                setFasePagamento(true);
              }
            }
            finalizarVenda("Crédito");
          }
          return;
        }

        if (modoCreditoDebito) {
          const escolha = (codigo || "").trim();

          if (escolha === "1") {
            setFormaPagamento((prev) => prev + (prev ? " + " : "") + "Cartão - Débito");
            setModoCreditoDebito(false);
            setFasePagamento(false);
            setCodigo("");
            setMetodoPagamentoSelecionado("Debito");
            finalizarVenda("Débito");

          } else if (escolha === "2") {
            setModoCreditoDebito(false);
            setFasePagamento(false);
            setModoParcelamento(true);
            setCodigo("");
            setMetodoPagamentoSelecionado("credito");
          }
          return;
        }

        if (fasePagamento) {
          const valor = (codigo || "").trim();

          if (valor === "2") {
            setModoCreditoDebito(true);
            setCodigo("");
            return;
          }

          const forma = {
            "1": "Dinheiro",
            "3": "Pix",
          }[valor];

          if (!forma) {
            mostrarAviso("Selecione a forma de pagamento!");
            setCodigo("");
            return;
          }

          if (forma === "Dinheiro") {
            if (!esperandoValorRecebido) {
              setEsperandoValorRecebido(true);
              setFormaPagamento("Dinheiro");
              setMetodoPagamentoSelecionado("Dinheiro");
              setCodigo("");
              return;
            }

            const valorTratado = codigo.replace(/[^\d.,]/g, "").trim().replace(",", ".");
            const recebido = parseFloat(valorTratado);

            if (isNaN(recebido) || recebido <= 0) {
              mostrarAviso("Valor inválido. Digite um número maior que zero.");
              setCodigo("");
              return;
            }

            const novoValorPago = Number((valorPagoTotal + recebido).toFixed(2));
            const pagamentoFinalArred = Number(total.toFixed(2));
            const trocoCalculado = Number((novoValorPago - pagamentoFinalArred).toFixed(2));

            if (novoValorPago >= pagamentoFinalArred) {
              setTroco(trocoCalculado > 0 ? trocoCalculado : null);
              setValorPagoTotal(0);
              setValorRestante(0);
              setEsperandoValorRecebido(false);
              setCodigo("");
              setAguardandoImpressao(true);
              setMetodoPagamentoSelecionado("Dinheiro");
              finalizarVenda("Dinheiro");
            } else {
              const valorRestanteArred = Number((pagamentoFinalArred - novoValorPago).toFixed(2));
              setValorPagoTotal(novoValorPago);
              setValorRestante(valorRestanteArred);
              setMensagemAviso(`Faltam R$ ${valorRestanteArred.toFixed(2)}`);
              setCodigo("");
              metodoPagamentoSelecionado("Dinheiro");
            }

            setMetodoPagamentoSelecionado("Dinheiro");
            return;
          }

          if (forma === "Pix") {
            setModalPixAberto(true);
            setMetodoPagamentoSelecionado('Pix');
            return;
          }

          const novoValorPago = Number((valorPagoTotal + total).toFixed(2));
          const totalArred = Number(total.toFixed(2));
          const trocoCalculado = Number((novoValorPago - totalArred).toFixed(2));

          if (novoValorPago >= totalArred) {
            setTroco(trocoCalculado > 0 ? trocoCalculado : null);
            setValorPagoTotal(0);
            setValorRestante(0);
            setMensagemAviso("Venda finalizada com sucesso!");
          } else {
            const valorRestanteArred = Number((totalArred - novoValorPago).toFixed(2));
            setValorPagoTotal(novoValorPago);
            setValorRestante(valorRestanteArred);
            setFasePagamento(true);
          }

          return;
        }

        if ((codigo || "").trim() === "") {
          setCpfSolicitado(true);
          return;
        }

        if (cpfSolicitado) {
          const resposta = (codigo || "").trim().toLowerCase();

          if (resposta === "s" || resposta === "sim") {
            setModoCPF(true);
            setCodigo("");
            return;
          }

          if (resposta === "n" || resposta === "nao" || resposta === "não") {
            setCpfSolicitado(false);
            setFasePagamento(true);
            setCodigo("");
            return;
          }

          mostrarAviso("Digite sim ou não");
          setCodigo("");
          return;
        }

        adicionarProduto();
      }
    };


    const mostrarAviso = (mensagem) => {
      setMensagemAviso(mensagem);
      setTimeout(() => setMensagemAviso(null), 3000); // Esconde após 3s
    };

    async function buscarClientePorCPF(cpf) {
      try {
        const response = await fetch(`http://localhost:3001/clientes/buscar-por-cpf/${cpf}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            setClienteMsg(`Cliente não encontrado - ${cpf}`);
          } else {
            setClienteMsg("Erro ao buscar cliente");
          }
          return null;
        }

        const cliente = await response.json();
        setClienteId(cliente.id);       // guarda o id do cliente no estado
        setNomeCliente(cliente.nome);  // mostra o nome, se quiser
        setClienteMsg(`${cliente.nome} - ${cpf}`);
        return cliente;

      } catch (error) {
        console.error('Erro ao buscar cliente:', error);
        setClienteMsg("Erro de conexão");
        return null;
      }
    }

    async function validarCPF(cpf) {
      cpf = cpf.replace(/[^\d]+/g, '');

      if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
        setClienteMsg("CPF inválido");
        return false;
      }

      let soma = 0, resto;

      for (let i = 1; i <= 9; i++) soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
      resto = (soma * 10) % 11;
      if (resto === 10 || resto === 11) resto = 0;
      if (resto !== parseInt(cpf.substring(9, 10))) {
        setClienteMsg("CPF inválido");
        return false;
      }

      soma = 0;
      for (let i = 1; i <= 10; i++) soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
      resto = (soma * 10) % 11;
      if (resto === 10 || resto === 11) resto = 0;

      const valido = resto === parseInt(cpf.substring(10, 11));

          await buscarClientePorCPF(cpf);

      if (!valido) {
        setClienteMsg("CPF inválido");
        return false;
      }

      // Se CPF válido, faz busca no banco
  
      return;
    }

useEffect(() => {
  if (troco !== null) {
    const timer = setTimeout(() => {
      // Chame sua função para finalizar a venda aqui, ex:
      finalizarVenda();
    }, 5000);

    return () => clearTimeout(timer); // limpa se troco mudar antes dos 5s
  }
}, [troco]);

const finalizarVenda = async (formaPagamento) => {
  
  const metodoFinal = formaPagamento || metodoPagamentoSelecionado || "Desconhecido";

    console.log(metodoFinal);
  if (!metodoFinal || metodoFinal === "Desconhecido") {
    mostrarAviso("Método de pagamento inválido.");
    return;
  }
  try {
    const dadosVenda = {
      venda_id: vendaId,
      cliente_id: clienteId || null,
      total: total,
      metodo_pagamento: formaPagamento || metodoPagamentoSelecionado,
      criado_por: usuarioId,
      produtos: produtos.map((p) => ({
        produto_id: p.id,
        quantidade: p.quantidade,
        preco_unitario: p.preco_venda || p.preco || 0,
      })),
    };

    console.log("Enviando dados da venda:", JSON.stringify(dadosVenda, null, 2));

    const res = await fetch("http://localhost:3001/vendas/finalizar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dadosVenda),
    });

    const data = await res.json();
    console.log("Resposta da venda:", data);
    console.log("Forma de pagamento selecionada:", formaPagamento || metodoPagamentoSelecionado);


    if (data.sucesso) {
      mostrarAviso("Venda concluída com sucesso!");
      setProdutos([]);
      setTotal(0);
      setVendaId(null);
      // resetar estados...
      setTroco(null);
      setModoParcelamento(false);
      setEtapaCartao(null);
      setEsperandoValorRecebido(false);
      setModoCPF(false);
      setModoCreditoDebito(false);
      setValorRestante(0);
      setFasePagamento(false);
      setCpfSolicitado(false);
      setModoQuantidade(false);
      setMetodoPagamentoSelecionado(null);
      console.log("Resposta da venda:", data);
    } else {
      mostrarAviso("Erro ao concluir venda.");
    }
  } catch (error) {
    console.error("Erro ao finalizar venda:", error);
    mostrarAviso("Erro ao finalizar venda.");
  }
};




  return (
    <div className="cont-principal">
      <div className="cont-controler">
        <div ref={listItensControllRef} className={`list-itens-controll ${produtos.length === 0 ? 'visibilidade' : ''}`}>
          {produtos.map((p, i) => (
            <div key={i} className="item-control">
              <button 
                className="buttonEdits"
                onClick={() =>{
                setModoQuantidade(true);
                setIndiceEdicao(i);
                setCodigo("");
              }}> <img src="./icon_edit.svg" alt="edtitar"></img></button>

              {p.nome} - Qtd: {p.quantidade} - R$ Preço: R$ {typeof p.preco === 'number' ? p.preco.toFixed(2) : '0.00'}

              <button className="buttonEdits" onClick={() => excluirProduto(i)}><img src="./icon_trash.svg" alt="excliur"/></button>
            </div>
            
          ))}
          {modalPixAberto && (
            <div className="modal-overlay">
              <div className="modal-pix">
                <h3>Escaneie o QR Code para pagar</h3>
                <img src="/qr-code-exemplo.png" alt="QR Code Pix" />
                <button onClick={() => {
                  setModalPixAberto(false);
                  setVerificandoMaquina();
                  finalizarVenda();
                }}>
                  Pagamento Confirmado
                </button>
              </div>
            </div>
          )}

        </div>
        <button onClick={cancelarVenda} className={`cancelar ${produtos.length === 0 ? 'visibilidade' : ''}`}>Cancelar</button>
        
      </div>
      <div className="driver-line"></div>
      <div className="view-nota">
        <div className="infos-client">
          <h4 className={produtos.length === 0 ? 'visibilidade' : ''}>{clienteMsg}</h4>
        </div>
        <div ref={listItensRef} className={`list-itens ${produtos.length === 0 ? 'visibilidade' : ''}`}>
          {produtos.map((p, i) => (
            <div key={i} className="item-nota">
              {i + 1}. {p.nome} - Qtd: {p.quantidade} - Unit: R$ {typeof p.preco === 'number' ? p.preco.toFixed(2) : '0.00'} - Subtotal: R$ {typeof p.subtotal === 'number' ? p.subtotal.toFixed(2) : '0.00'}
            </div>
          ))}
        </div>
        <div className="print-view">
          <h3 className={produtos.length === 0 ? 'visibilidade' : ''}>Total: R$ {total.toFixed(2)}</h3>
          <p>
            {troco !== null
              ? `Troco: R$ ${troco.toFixed(2)}`
              : verificandoMaquina
              ? "Verificando conexão com a máquina..."
              : modoParcelamento
              ? "Escolha entre as parcelas: 1 - Avista | 2 a 10 - Parcelado"
              : etapaCartao === "debito"
              ? "Verificando conexão com a máquina..."
              : etapaCartao === "credito"
              ? "Escolha entre as parcelas: 1 - Avista | 2 a 10 - Parcelado"
              : esperandoValorRecebido
              ? "Insira o valor recebido:"
              : modoCPF
              ? "Digite o CPF:"
              : modoCreditoDebito
              ? "Escolha: 1 - Débito | 2 - Crédito"
              : valorRestante > 0
              ? `Valor restante: R$ ${valorRestante.toFixed(2)} | Escolha nova forma de pagamento: 2-Cartão | 3-Pix`
              : fasePagamento
              ? "Forma de pagamento: 1-Dinheiro | 2-Cartão | 3-Pix"
              : cpfSolicitado
              ? "Deseja incluir CPF?"
              : modoQuantidade
              ? "Digite a quantidade desejada:"
              : "Use o scanner ou digite o código do produto:"}
          </p>
        </div>
        <input
          className="scann"
          type="text"
          placeholder={
  modoQuantidade
    ? "Digite a quantidade..."
    : modoCPF
    ? "Digite o CPF..."
    : modoParcelamento
    ? "Escolha a forma de parcelamento..."
    : modoCreditoDebito
    ? "Escolha a forma de pagamento..."
    : fasePagamento
    ? "Escolha a forma de pagamento..."
    : cpfSolicitado
    ? "sim ou não..."
    : esperandoValorRecebido
    ? "Digite o valor recebido..."
    : "Digite ou leia o código de barras..."
}
          autoFocus
          value={codigo}
          onChange={(e) => {
            const val = e.target.value;
            if (esperandoValorRecebido) {
              if (/^[0-9.,]*$/.test(val)) setCodigo(val);
            } else {
              setCodigo(val);
            }
          }}
          onKeyDown={handleKeyDown}
        autoComplete="off"
  spellCheck={false}
  autoCorrect="off"
  autoCapitalize="off"
        />

      </div>

      {mensagemAviso && (
        <div className="toast-alert">
          {mensagemAviso}
        </div>
      )}
    </div>
  );
}

export default Vendas;
