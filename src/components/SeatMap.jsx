import React from 'react';

const SeatMap = ({ seats, selectedSeat, onSelectSeat }) => {
  // Se o array estiver vazio, mostra um aviso para não ficar a tela preta
  if (!seats || seats.length === 0) {
    return (
      <div className="p-10 text-center border-2 border-dashed border-zinc-800 rounded-xl">
        <p className="text-zinc-500">Aguardando carregamento dos assentos...</p>
        <p className="text-xs text-zinc-600 mt-2">Verifique se existem assentos vinculados a este filme no banco.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center bg-zinc-900 p-6 rounded-3xl border border-zinc-800 w-full">
      <div className="w-full mb-8">
        <div className="w-3/4 h-1 bg-blue-500 mx-auto shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
        <p className="text-center text-[10px] text-zinc-500 mt-2 uppercase">Tela</p>
      </div>

      {/* Grid forçado: Usamos Style inline para garantir que funcione se o Tailwind falhar */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(15, 1fr)',
          gap: '8px',
          width: '100%'
        }}
      >
        {seats.map((seat) => (
          <button
            key={seat.id}
            disabled={seat.status === 'ocupado'}
            onClick={() => onSelectSeat(seat)}
            className={`
              aspect-square flex items-center justify-center rounded-t-lg text-[9px] font-bold transition-all
              ${seat.status === 'ocupado'
                ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                : selectedSeat?.id === seat.id
                  ? 'bg-yellow-400 text-black scale-110'
                  : 'bg-emerald-600 text-white hover:bg-emerald-500'}
            `}
          >
            {seat.fileira}{seat.numero}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SeatMap;