import React, { useState, useEffect } from "react";
import './vendas.css';

function Vendas() {
    const [produtos, setProdutos] = useState([]);
    const [total, setTotal] = useState(0);
    const [codigo, setCodigo] = useState("");

    const [cpfSolicitado, setCpfSolicitado] = useState(false);
    const [cpfDigitado, setCpfDigitado] = useState(false);
    const [nomeCliente, setNomeCliente] = useState("Controle");

    const [modoCPF, setModoCPF] = useState(false);
    const [clienteMsg, setClienteMsg] = useState("Controle");
    const [fasePagamento, setFasePagamento] = useState(false);
    const [formaPagamento, setFormaPagamento] = useState("");
    const [esperandoValorRecebido, setEsperandoValorRecebido] = useState(false);
    const [troco, setTroco] = useState(null);

    const [valorPagoTotal, setValorPagoTotal] = useState(0);
    const [valorRestante, setValorRestante] = useState(0);




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
            quantidade: 1,
        };
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            if (modoCPF) {
                // Tratamento do CPF digitado
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

        if (cpfSolicitado && codigo.toLowerCase() === "s") {
            setModoCPF(true);
            setCodigo("");
            return;
        }

        // Só cai aqui se nenhuma das condições acima for verdadeira
        adicionarProduto();
        }
    };


    const handleChange = (e) => {
        let valor = e.target.value;

        if (modoCPF) {
            // Permite apenas números e no máximo 11 caracteres
            valor = valor.replace(/\D/g, '').slice(0, 11);
        }

        setCodigo(valor);
    };

  return (
    <div className="cont-principal">
      <div className="cont-controler">
        <div className={`list-itens-controll ${produtos.length === 0 ? 'visibilidade' : ''}`}>
          {produtos.map((p, i) => (
            <div key={i} className="item-control">
              {p.nome} - Qtd: {p.quantidade} - R$ {p.preco.toFixed(2)}
            </div>
          ))}
        </div>
        <button className={`cancelar ${produtos.length === 0 ? 'visibilidade' : ''}`}>Cancelar</button>
      </div>
      <div className="driver-line"></div>
      <div className="view-nota">
        <div className="infos-client">
          <h4>{clienteMsg}</h4>
        </div>
        <div className={`list-itens ${produtos.length === 0 ? 'visibilidade' : ''}`}>
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
    </div>
  );
}

export default Vendas;
