import React, { useState } from 'react';

// 1. COMPONENTE DE PAGAMENTO COM AS TRAVAS ATIVAS
const PaymentFlow = ({ total, onFinalize, loading, onClose }) => {
  const [step, setStep] = useState('dados');
  const [method, setMethod] = useState('');
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    cartaoNum: '',
    cartaoNome: '',
    validade: '',
    cvv: ''
  });

  // Funções de limpeza (Filters)
  const apenasLetras = (v) => v.replace(/[^a-zA-ZÀ-ÿ\s]/g, '');
  const apenasNumeros = (v) => v.replace(/\D/g, '');

  const getCardType = (num) => {
    if (num?.startsWith('4')) return 'VISA';
    if (num?.startsWith('5')) return 'MASTERCARD';
    return 'CARTÃO';
  };

  const handleFinish = async () => {
    // --- INÍCIO DAS TRAVAS DE SEGURANÇA ---

    // 1. Normalização para comparação (Remove acentos e espaços extras)
    const limparTexto = (t) => t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toUpperCase();

    const nomeCadastro = limparTexto(formData.nome);
    const nomeNoCartao = limparTexto(formData.cartaoNome);

    if (method === 'cartao') {
      // TRAVA DE NOME DIFERENTE
      if (nomeCadastro !== nomeNoCartao) {
        alert("🚨 SEGURANÇA: O nome no cartão deve ser igual ao nome do comprador (" + formData.nome.toUpperCase() + ")");
        return; // BLOQUEIA O ENVIO
      }

      // TRAVA DE DATA DE VALIDADE
      const [mes, ano] = formData.validade.split('/').map(Number);
      const agora = new Date();
      const anoAtual = agora.getFullYear() % 100; // Ex: 26
      const mesAtual = agora.getMonth() + 1;

      if (!ano || ano < anoAtual || (ano === anoAtual && mes < mesAtual)) {
        alert("🚨 CARTÃO VENCIDO: Verifique a data de validade.");
        return; // BLOQUEIA O ENVIO
      }

      if (formData.cartaoNum.length < 16) {
        alert("🚨 CARTÃO INVÁLIDO: O número deve ter 16 dígitos.");
        return; // BLOQUEIA O ENVIO
      }
    }
    // --- FIM DAS TRAVAS ---

    const novoIdPedido = `Ped-.${Math.floor(1000 + Math.random() * 9000)}`;

    const dadosCompra = {
      id_pedido: novoIdPedido,
      nome: formData.nome,
      email: formData.email,
      pagamento: method.toUpperCase(),
      status: 'CONCLUÍDO'
    };

    try {
      await onFinalize(dadosCompra);
      setStep('sucesso');
      setTimeout(() => {
        if (onClose) onClose();
        else window.location.reload();
      }, 4000);
    } catch (error) {
      console.error("Erro ao finalizar:", error);
    }
  };

  if (step === 'sucesso') {
    return (
      <div className="text-center py-8 animate-in zoom-in duration-300">
        <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-black text-white italic">COMPRA CONCLUÍDA!</h2>
        <p className="text-zinc-400 mt-4 px-6">Enviamos para: <b>{formData.email}</b></p>
      </div>
    );
  }

  return (
    <div className="p-2">
      {step === 'dados' && (
        <div className="space-y-4">
          <h3 className="text-white font-bold text-sm tracking-widest border-b border-zinc-800 pb-2">Seus Dados</h3>
          <input
            type="text"
            placeholder="NOME COMPLETO"
            value={formData.nome}
            className="w-full bg-zinc-800 border-zinc-700 rounded-xl p-3 text-white outline-none focus:ring-2 ring-yellow-500"
            onChange={(e) => setFormData({ ...formData, nome: apenasLetras(e.target.value) })}
          />
          <input
            type="email"
            placeholder="E-MAIL"
            value={formData.email}
            className="w-full bg-zinc-800 border-zinc-700 rounded-xl p-3 text-white outline-none focus:ring-2 ring-yellow-500"
            onChange={(e) => setFormData({ ...formData, email: e.target.value.toLowerCase().trim() })}
          />
          <button
            disabled={!formData.nome || !formData.email}
            onClick={() => setStep('metodo')}
            className="w-full bg-yellow-500 text-black font-black py-4 rounded-xl disabled:opacity-50"
          >
            PRÓXIMO
          </button>
        </div>
      )}

      {step === 'metodo' && (
        <div className="space-y-4">
          <h3 className="text-white font-bold text-sm border-b border-zinc-800 pb-2 text-center">Total: R$ {total.toFixed(2)}</h3>
          <button onClick={() => { setMethod('pix'); setStep('pix'); }} className="w-full bg-zinc-800 p-4 rounded-2xl flex items-center gap-4 text-white font-bold border border-transparent hover:border-emerald-500">
            <span className="w-10 h-10 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center italic">X</span> PIX
          </button>
          <button onClick={() => { setMethod('cartao'); setStep('cartao'); }} className="w-full bg-zinc-800 p-4 rounded-2xl flex items-center gap-4 text-white font-bold border border-transparent hover:border-blue-500">
            <span>💳</span> CARTÃO DE CRÉDITO
          </button>
        </div>
      )}

      {step === 'pix' && (
        <div className="space-y-4 text-center">
          <div className="bg-white p-4 rounded-2xl inline-block">
            {/* Trocamos a div cinza pela imagem real */}
            <img
              src="/pix.jpg"
              alt="QR Code Pix"
              className="w-48 h-48 object-contain"
              onError={(e) => {
                console.error("Erro ao carregar a imagem do Pix");
                e.target.src = "https://via.placeholder.com/200?text=Erro+ao+Carregar";
              }}
            />
          </div>

          <div className="text-sm text-zinc-400">
            <p>Escaneie o código acima para pagar</p>
          </div>

          <button
            onClick={handleFinish}
            disabled={loading}
            className="w-full bg-emerald-600 text-white font-black py-4 rounded-xl hover:bg-emerald-700 transition-colors"
          >
            {loading ? 'PROCESSANDO...' : 'JÁ PAGUEI'}
          </button>

          <button
            onClick={() => setStep('metodo')}
            className="text-zinc-500 text-xs"
          >
            Voltar
          </button>
        </div>
      )}

      {step === 'cartao' && (
        <div className="space-y-3">
          <div className="relative">
            <input
              type="text"
              maxLength="16"
              value={formData.cartaoNum}
              placeholder="NÚMERO DO CARTÃO"
              className="w-full bg-zinc-800 border-zinc-700 rounded-xl p-3 text-white outline-none"
              onChange={(e) => setFormData({ ...formData, cartaoNum: apenasNumeros(e.target.value) })}
            />
            <span className="absolute right-3 top-3 text-[10px] font-black text-blue-500">
              {getCardType(formData.cartaoNum)}
            </span>
          </div>
          <input
            type="text"
            placeholder="NOME NO CARTÃO"
            value={formData.cartaoNome}
            className="w-full bg-zinc-800 border-zinc-700 rounded-xl p-3 text-white outline-none uppercase"
            onChange={(e) => setFormData({ ...formData, cartaoNome: apenasLetras(e.target.value) })}
          />
          <div className="flex gap-3">
            <input
              type="text"
              maxLength="5"
              placeholder="MM/AA"
              value={formData.validade}
              className="w-2/3 bg-zinc-800 border-zinc-700 rounded-xl p-3 text-white outline-none"
              onChange={(e) => {
                let v = apenasNumeros(e.target.value);
                if (v.length >= 3) v = v.slice(0, 2) + '/' + v.slice(2, 4);
                setFormData({ ...formData, validade: v });
              }}
            />
            <input
              type="text"
              maxLength="3"
              placeholder="CVV"
              value={formData.cvv}
              className="w-1/3 bg-zinc-800 border-zinc-700 rounded-xl p-3 text-white outline-none"
              onChange={(e) => setFormData({ ...formData, cvv: apenasNumeros(e.target.value) })}
            />
          </div>
          <button onClick={handleFinish} disabled={loading} className="w-full bg-blue-600 text-white font-black py-4 rounded-xl">
            {loading ? 'PROCESSANDO...' : 'PAGAR AGORA'}
          </button>
        </div>
      )}
    </div>
  );
};

// 2. COMPONENTE PRINCIPAL DO MODAL
const PurchaseModal = ({ isOpen, onClose, selectedMovie, selectedSeat, onConfirm, loading, precoBase }) => {
  const [showPayment, setShowPayment] = useState(false);

  if (!isOpen) return null;

  const seatsArray = Array.isArray(selectedSeat) ? selectedSeat : [];
  
// usamos o precoBase que vem do App.jsx
  const valorTotal = seatsArray.length * (precoBase || 0);

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      <div className="bg-zinc-900 border border-zinc-800 w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl">
        <div className="p-8">
          {!showPayment ? (
            <div className="animate-in fade-in slide-in-from-bottom-4">
              <h2 className="text-2xl font-black text-center text-white italic mb-6 uppercase tracking-tighter">Resumo do Pedido</h2>
              <div className="bg-black/40 rounded-3xl p-6 mb-8 border border-white/5 space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-zinc-500 font-bold text-[10px] uppercase">Filme</span>
                  <span className="text-white font-bold">{selectedMovie?.titulo}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-zinc-500 font-bold text-[10px] uppercase">Assento(s)</span>
                  <span className="text-yellow-500 font-bold">{seatsArray.map(s => `${s.fileira}${s.numero}`).join(', ')}</span>
                </div>
                <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                  <span className="text-zinc-500 font-bold text-[10px] uppercase">Total</span>
                  <span className="text-2xl font-black text-emerald-500">R$ {valorTotal.toFixed(2)}</span>
                </div>
              </div>
              <div className="flex gap-4">
                <button onClick={onClose} className="flex-1 py-4 text-zinc-500 font-bold">CANCELAR</button>
                <button onClick={() => setShowPayment(true)} className="flex-[2] bg-yellow-500 text-black font-black py-4 rounded-2xl">AVANÇAR</button>
              </div>
            </div>
          ) : (
            <PaymentFlow
              total={valorTotal}
              loading={loading}
              onFinalize={onConfirm}
              onClose={onClose}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PurchaseModal;