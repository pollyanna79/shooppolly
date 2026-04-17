import React from 'react';

const SeatMap = ({ seats, selectedSeat, onSelectSeat }) => {
  return (
    <div className="flex flex-col items-center bg-zinc-950 p-6 rounded-3xl border border-zinc-800 shadow-2xl">
      {/* Representação da Tela */}
      <div className="w-full mb-12">
        <div className="w-3/4 h-1.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent mx-auto shadow-[0_8px_20px_rgba(59,130,246,0.4)]"></div>
        <p className="text-center text-[10px] text-zinc-500 mt-3 tracking-[0.8em] uppercase">Tela</p>
      </div>

      {/* Grid de Assentos: 15 colunas */}
      <div className="grid grid-cols-15 gap-2 sm:gap-3">
        {seats.map((seat) => (
          <button
            key={seat.id}
            disabled={seat.status === 'ocupado'}
            onClick={() => onSelectSeat(seat)}
            className={`
              relative w-6 h-6 sm:w-8 sm:h-8 rounded-t-lg text-[9px] font-bold transition-all duration-200
              ${seat.status === 'ocupado' 
                ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed' 
                : selectedSeat?.id === seat.id 
                  ? 'bg-yellow-400 text-black scale-110 shadow-[0_0_15px_rgba(250,204,21,0.6)] z-10' 
                  : 'bg-emerald-600 text-white hover:bg-emerald-400 hover:scale-105'}
            `}
          >
            {/* O conteúdo do botão é a Fileira + Número (ex: E15) */}
            {seat.fileira}{seat.numero}
            
            {/* Detalhe estético do "bracinho" do assento */}
            <div className="absolute -bottom-1 left-0 w-full h-1 bg-black/20 rounded-full"></div>
          </button>
        ))}
      </div>

      {/* Legenda */}
      <div className="flex flex-wrap justify-center gap-6 mt-10 text-[11px] text-zinc-400 border-t border-zinc-800 pt-6 w-full">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-emerald-600 rounded-sm"></span> Disponível
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-zinc-800 rounded-sm"></span> Ocupado
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-yellow-400 rounded-sm shadow-[0_0_5px_rgba(250,204,21,0.5)]"></span> Selecionado
        </div>
      </div>
    </div>
  );
};

export default SeatMap;
