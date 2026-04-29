import React from 'react';

const PurchaseModal = ({ isOpen, onClose, selectedMovie, selectedSeat, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-zinc-900 border border-zinc-800 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-white mb-2">Confirmar Reserva?</h2>
          <p className="text-zinc-400 text-sm mb-6">Você está prestes a reservar um lugar para uma experiência incrível.</p>

          <div className="bg-black/40 rounded-2xl p-4 mb-6 text-left border border-white/5">
            <div className="flex justify-between mb-2">
              <span className="text-zinc-500 text-xs uppercase font-bold tracking-wider">Filme</span>
              <span className="text-white font-medium">{selectedMovie?.titulo}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-zinc-500 text-xs uppercase font-bold tracking-wider">Assento</span>
              <span className="text-yellow-400 font-bold">{selectedSeat?.fileira}{selectedSeat?.numero}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-white/5 mt-2">
              <span className="text-zinc-500 text-xs uppercase font-bold tracking-wider">Total</span>
              <span className="text-white font-bold">R$ 35,00</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-xl bg-zinc-800 text-white font-bold hover:bg-zinc-700 transition-colors"
            >
              Cancelar
            </button>

            <button
              onClick={onConfirm}
              // Se você tiver o estado 'loading' passando via props, use-o aqui:
              // disabled={loading} 
              className="flex-1 px-4 py-3 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-500 shadow-lg shadow-emerald-900/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseModal;
