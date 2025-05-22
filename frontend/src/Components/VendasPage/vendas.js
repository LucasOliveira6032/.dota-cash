import React, { useState, useEffect, useRef } from "react";
import './vendas.css';
import Modal from "../Modal/modal"

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

    //variavel mensagem de aviso
    const [mensagemAviso, setMensagemAviso] = useState(null);

    //variaveis lógica para ScrollDown - rolar itens para baixo
    const listItensRef = useRef(null);
    const listItensControllRef = useRef(null);

    //variaveis lógica de cancelamento
    const [itensVenda, setItensVenda] = useState([]);
    const [valorTotal, setValorTotal] = useState(0);
    const [cpfCliente, setCpfCliente] = useState("");
    const [nomeCliente, setNomeCliente] = useState("");
    const [mensagem, setMensagem] = useState("");

    const cancelarVenda = () => {
  // Limpa os produtos adicionados à venda
  setProdutos([]);

  // Limpa outros campos, se existirem:
  setValorTotal(0);
  setCpfCliente("");
  setNomeCliente("");
  setFormaPagamento("");

  // (Opcional) Mostra mensagem de confirmação:
  setMensagem("Venda cancelada com sucesso.");

  // Se houver campos controlados manualmente (inputRefs etc), limpe-os aqui também
};



    const adicionarProduto = () => {
        if (codigo.trim() === "") return;

            const produtoBipado = simularBuscaProduto(codigo);
            const subtotal = produtoBipado.preco * produtoBipado.quantidade;

            setProdutos(prev => [...prev, { ...produtoBipado, subtotal }]);
            setTotal(prev => prev + subtotal);
            setCodigo("");
    };

    const simularBuscaProduto = (codigo) => {
        return {
            codigo,
            nome: "Produto Exemplo",
            preco: 50.00,
            quantidade: 2,
        };
    };

    useEffect(() => {
    if (listItensRef.current) {
        listItensRef.current.scrollTop = listItensRef.current.scrollHeight;
    }
    if (listItensControllRef.current) {
        listItensControllRef.current.scrollTop = listItensControllRef.current.scrollHeight;
    }
}, [produtos]);


    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            if (modoCPF) {
              const cpfValido = validarCPF(codigo);
              if (!cpfValido) {
                mostrarAviso("CPF inválido. Verifique e tente novamente.");
                setCodigo("");
                return;
              }
                
                console.log("CPF digitado:", codigo);
                setClienteMsg(`Cliente não encontrado - ${codigo}`);
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
                    // Pagamento suficiente
                    const valorTroco = novoValorPago - total;
                    setTroco(valorTroco);
                    setEsperandoValorRecebido(false);
                    setValorPagoTotal(0);
                    setValorRestante(0);
                    setFormaPagamento(""); // Limpa forma de pagamento
                } else {
                    // Pagamento parcial
                    const restante = total - novoValorPago;
                    setValorPagoTotal(novoValorPago);
                    setValorRestante(restante);
                    setEsperandoValorRecebido(false);  // Aguarda nova forma
                    setFasePagamento(true);            // Reativa escolha de forma
                }
            }

            setCodigo("");
            return;
        }

        if (fasePagamento) {
            const forma = {
                "1": "Dinheiro",
                "2": "Cartão",
                "3": "Pix",
                "4": "Crédito em haver",
            }[codigo.trim()];

            if (forma) {
                setFormaPagamento((prev) => prev + (prev ? " + " + forma : forma));
                setFasePagamento(false);
                setCodigo("");

                if (forma === "Dinheiro" || valorRestante > 0) {
                    setEsperandoValorRecebido(true);
                } else {
                    // Forma de pagamento não exige entrada de valor, assume pagamento completo
                    const pagamentoFinal = valorRestante || total;
                    const novoValorPago = valorPagoTotal + pagamentoFinal;

                    if (novoValorPago >= total) {
                        setTroco(novoValorPago - total);
                        setValorPagoTotal(0);
                        setValorRestante(0);
                    } else {
                        setValorPagoTotal(novoValorPago);
                        setValorRestante(total - novoValorPago);
                        setFasePagamento(true);
                    }
                }
            }
            return;
        }


        if (codigo.trim() === "") {
            setCpfSolicitado(true);
            return;
        }

        if (cpfSolicitado) {
          const resposta = codigo.trim().toLowerCase();

          if (resposta === "s" || resposta === "sim") {
            setModoCPF(true);
            setCodigo("");
            return;
          }

          if (resposta === "n" || resposta === "nao" || resposta === "não") {
            setCpfSolicitado(false);
            setFasePagamento(true);  // Vai direto para pagamento
            setCodigo("");
            return;
          }
        }


        // Só cai aqui se nenhuma das condições acima for verdadeira
        adicionarProduto();
        }
    };

    const mostrarAviso = (mensagem) => {
      setMensagemAviso(mensagem);
      setTimeout(() => setMensagemAviso(null), 3000); // Esconde após 3s
    };


    function validarCPF(cpf) {
        cpf = cpf.replace(/[^\d]+/g, ''); // Remove tudo que não for número

        if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

        let soma = 0, resto;

        for (let i = 1; i <= 9; i++) soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
        resto = (soma * 10) % 11;
        if ((resto === 10) || (resto === 11)) resto = 0;
        if (resto !== parseInt(cpf.substring(9, 10))) return false;

        soma = 0;
        for (let i = 1; i <= 10; i++) soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
        resto = (soma * 10) % 11;
        if ((resto === 10) || (resto === 11)) resto = 0;

        return resto === parseInt(cpf.substring(10, 11));
}


      
  return (
    <div className="cont-principal">
      <div className="cont-controler">
        <div ref={listItensControllRef} className={`list-itens-controll ${produtos.length === 0 ? 'visibilidade' : ''}`}>
          {produtos.map((p, i) => (
            <div key={i} className="item-control">
              {p.nome} - Qtd: {p.quantidade} - R$ {p.preco.toFixed(2)}
            </div>
          ))}
        </div>
        <button onClick={cancelarVenda} className={`cancelar ${produtos.length === 0 ? 'visibilidade' : ''}`}>Cancelar</button>
        
      </div>
      <div className="driver-line"></div>
      <div className="view-nota">
        <div className="infos-client">
          <h4>{clienteMsg}</h4>
        </div>
        <div ref={listItensRef} className={`list-itens ${produtos.length === 0 ? 'visibilidade' : ''}`}>
          {produtos.map((p, i) => (
            <div key={i} className="item-nota">
              {i + 1}. {p.nome} - Qtd: {p.quantidade} - Unit: R$ {p.preco.toFixed(2)} - Subtotal: R$ {p.subtotal.toFixed(2)}
            </div>
          ))}
        </div>
        <div className="print-view">
          <h3>Total: R$ {total.toFixed(2)}</h3>
          <p>
  {troco !== null
    ? `Troco: R$ ${troco.toFixed(2)}`
    : esperandoValorRecebido
    ? "Insira o valor recebido:"
    : modoCPF
    ? "Digite o CPF:"
    : valorRestante > 0
    ? `Valor restante: R$ ${valorRestante.toFixed(2)} | Escolha nova forma de pagamento: 2-Cartão | 3-Pix | 4-Crédito em haver`
    : fasePagamento
    ? "Forma de pagamento: 1-Dinheiro | 2-Cartão | 3-Pix | 4-Crédito em haver"
    : formaPagamento
    ? `Pagamento com ${formaPagamento}`
    : cpfSolicitado
    ? "Deseja incluir CPF?"
    : "Use o scanner ou digite o código do produto:"}
</p>

        </div>
        <input
          className="scann"
          type="text"
          placeholder={
            modoCPF
              ? "Digite o CPF..."
              : cpfSolicitado
              ? "sim ou não..."
              : "Digite ou leia o código de barras..."
          }
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
