import React, { useState } from 'react';

// 1. COMPONENTE DE PAGAMENTO (Colocado aqui para evitar erros de importação)
const PaymentFlow = ({ total, onFinalize, loading }) => {
  const [step, setStep] = useState('dados');
  const [formData, setFormData] = useState({ nome: '', email: '', cartaoNum: '', cartaoNome: '', validade: '', cvv: '' });

  const getCardType = (num) => {
    if (num?.startsWith('4')) return 'VISA';
    if (num?.startsWith('5')) return 'MASTERCARD';
    return 'CARTÃO';
  };

  const handleFinish = () => {
    onFinalize(formData);
    setStep('sucesso');
  };

  if (step === 'sucesso') {
    return (
      <div className="text-center py-8 animate-in zoom-in duration-300">
        <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/20">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
        </div>
        <h2 className="text-2xl font-black text-white italic">COMPRA CONCLUÍDA!</h2>
        <p className="text-zinc-400 mt-4 px-6">Obrigado pela preferência. Seus ingressos foram enviados para <b>{formData.email}</b>.</p>
      </div>
    );
  }

  return (
    <div className="p-2">
      {step === 'dados' && (
        <div className="space-y-4">
          <h3 className="text-white font-bold uppercase text-sm tracking-widest border-b border-zinc-800 pb-2">Seus Dados</h3>
          <input type="text" placeholder="NOME COMPLETO" className="w-full bg-zinc-800 border-zinc-700 rounded-xl p-3 text-white outline-none focus:ring-2 ring-yellow-500" onChange={(e) => setFormData({ ...formData, nome: e.target.value })} />
          <input type="email" placeholder="E-MAIL" className="w-full bg-zinc-800 border-zinc-700 rounded-xl p-3 text-white outline-none focus:ring-2 ring-yellow-500" onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
          <button disabled={!formData.nome || !formData.email} onClick={() => setStep('metodo')} className="w-full bg-yellow-500 text-black font-black py-4 rounded-xl disabled:opacity-50">PRÓXIMO</button>
        </div>
      )}

      {step === 'metodo' && (
        <div className="space-y-4">
          <h3 className="text-white font-bold uppercase text-sm tracking-widest border-b border-zinc-800 pb-2 text-center">R$ {total.toFixed(2)}</h3>
          <button onClick={() => setStep('pix')} className="w-full bg-zinc-800 p-4 rounded-2xl flex items-center gap-4 text-white font-bold border border-transparent hover:border-emerald-500 transition-all">
            <span className="w-10 h-10 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center italic">X</span> PIX
          </button>
          <button onClick={() => setStep('cartao')} className="w-full bg-zinc-800 p-4 rounded-2xl flex items-center gap-4 text-white font-bold border border-transparent hover:border-blue-500 transition-all">
            <span>💳</span> CARTÃO DE CRÉDITO
          </button>
        </div>
      )}

      {step === 'pix' && (
        <div className="space-y-4 text-center">
          <div className="bg-white p-2 rounded-xl inline-block">
            <div className="w-32 h-32 bg-zinc-200 flex items-center justify-center text-zinc-400 text-[10px]">QR CODE PIX</div>
          </div>
          <div className="bg-black/50 p-3 rounded-lg border border-zinc-800 break-all text-[10px] font-mono text-emerald-500">
            00020126580014BR.GOV.BCB.PIX0136cinemarkpolly-9922-4411-8833
          </div>
          <button onClick={handleFinish} className="w-full bg-emerald-600 text-white font-black py-4 rounded-xl">FINALIZAR COMPRA</button>
        </div>
      )}

      {step === 'cartao' && (
        <div className="space-y-3">
          <div className="relative">
            <input type="text" maxLength="16" placeholder="NÚMERO DO CARTÃO" className="w-full bg-zinc-800 border-zinc-700 rounded-xl p-3 text-white outline-none" onChange={(e) => setFormData({ ...formData, cartaoNum: e.target.value })} />
            <span className="absolute right-3 top-3 text-[10px] font-black text-blue-500 bg-blue-500/10 px-2 py-1 rounded">{getCardType(formData.cartaoNum)}</span>
          </div>
          <input type="text" placeholder="NOME NO CARTÃO" className="w-full bg-zinc-800 border-zinc-700 rounded-xl p-3 text-white outline-none uppercase" onChange={(e) => setFormData({ ...formData, cartaoNome: e.target.value })} />
          <div className="flex gap-3">
            <input type="text" placeholder="MM/AA" className="w-2/3 bg-zinc-800 border-zinc-700 rounded-xl p-3 text-white outline-none" />
            <input type="text" placeholder="CVV" className="w-1/3 bg-zinc-800 border-zinc-700 rounded-xl p-3 text-white outline-none" />
          </div>
          <button onClick={handleFinish} className="w-full bg-blue-600 text-white font-black py-4 rounded-xl">PAGAR AGORA</button>
        </div>
      )}
    </div>
  );
};

// 2. COMPONENTE PRINCIPAL DO MODAL
const PurchaseModal = ({ isOpen, onClose, selectedMovie, selectedSeat, onConfirm, loading }) => {
  const [showPayment, setShowPayment] = useState(false);

  if (!isOpen) return null;

  // Proteção contra erro de valor: garante que selectedSeat é um array
  const seatsArray = Array.isArray(selectedSeat) ? selectedSeat : [];
  const valorTotal = seatsArray.length * 25.00;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      <div className="bg-zinc-900 border border-zinc-800 w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl">
        <div className="p-8">
          {!showPayment ? (
            <div className="animate-in fade-in slide-in-from-bottom-4">
              <h2 className="text-2xl font-black text-center text-white italic mb-6 uppercase tracking-tighter">Resumo do Pedido</h2>

              <div className="bg-black/40 rounded-3xl p-6 mb-8 border border-white/5 space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Filme</span>
                  <span className="text-white font-bold">{selectedMovie?.titulo}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Assento(s)</span>
                  <span className="text-yellow-500 font-bold">{seatsArray.map(s => `${s.fileira}${s.numero}`).join(', ')}</span>
                </div>
                <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                  <span className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Total</span>
                  <span className="text-2xl font-black text-emerald-500">R$ {valorTotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex gap-4">
                <button onClick={onClose} className="flex-1 py-4 text-zinc-500 font-bold hover:text-white transition-colors">CANCELAR</button>
                <button
                  disabled={seatsArray.length === 0}
                  onClick={() => setShowPayment(true)}
                  className="flex-[2] bg-yellow-500 text-black font-black py-4 rounded-2xl hover:bg-yellow-400 disabled:opacity-50"
                >
                  PAGAR AGORA
                </button>
              </div>
            </div>
          ) : (
            <PaymentFlow
              total={valorTotal}
              loading={loading}
              onFinalize={onConfirm}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PurchaseModal;