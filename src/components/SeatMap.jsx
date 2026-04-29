import React from 'react';

const SeatMap = ({ seats, selectedSeat, onSelectSeat }) => {
  if (!seats || seats.length === 0) {
    return <div className="text-zinc-500 animate-pulse">Carregando mapa de assentos...</div>;
  }

  return (
    <div className="flex flex-col items-center bg-zinc-900/40 p-8 rounded-3xl border border-zinc-800 w-full shadow-2xl">
      <div className="flex flex-col gap-4 w-full overflow-x-auto pb-4 custom-scrollbar">
        {seats.map((row) => (
          <div key={row.letra} className="flex items-center justify-center gap-3 min-w-max px-6">
            <span className="w-6 text-xs font-black text-zinc-600 uppercase">{row.letra}</span>

            <div className="flex gap-3">
              {row.assentos.map((seat) => {
                // Verificação rigorosa do status
                const isOccupied = seat.status === 'ocupado';
                const isSelected = selectedSeat?.id === seat.id;

                return (
                  <button
                    key={seat.id}
                    // Só desabilita se realmente for ocupado
                    disabled={isOccupied}
                    onClick={() => {
                      console.log("Assento clicado:", seat); // Debug para você ver no F12
                      onSelectSeat(seat);
                    }}
                    className={`group relative transition-all duration-300 ${isOccupied ? 'cursor-not-allowed' : 'cursor-pointer active:scale-90'}`}
                  >
                    <svg
                      width="35"
                      height="35"
                      viewBox="0 0 24 24"
                      className={`transition-all duration-300 ${isOccupied
                        ? 'fill-red-600 stroke-red-800 opacity-40' // Vermelho se ocupado
                        : isSelected
                          ? 'fill-yellow-400 stroke-yellow-600 scale-110' // Amarelo se selecionado
                          : 'fill-emerald-600 stroke-emerald-800 hover:fill-emerald-500' // Verde se livre
                        }`}
                    >
                      <path d="M4 18V9C4 7.34315 5.34315 6 7 6H17C18.6569 6 20 7.34315 20 9V18C20 19.6569 18.6569 21 17 21H7C5.34315 21 4 19.6569 4 18Z" />
                      <path d="M19 13H5" stroke="black" strokeWidth="1" strokeLinecap="round" />
                    </svg>

                    <span className={`absolute inset-0 flex items-center justify-center text-[8px] font-black pointer-events-none ${isOccupied ? 'text-zinc-200' : isSelected ? 'text-black' : 'text-white'
                      }`}>
                      {seat.fileira}{seat.numero}
                    </span>
                  </button>
                );
              })}
            </div>
            <span className="w-6 text-xs font-black text-zinc-600 uppercase text-right">{row.letra}</span>
          </div>
        ))}
      </div>

      {/* Legenda para conferência */}
      <div className="flex gap-6 mt-8">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-emerald-600 rounded-full"></div>
          <span className="text-[10px] text-zinc-400 font-bold uppercase">Livre</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-600 opacity-40 rounded-full"></div>
          <span className="text-[10px] text-zinc-400 font-bold uppercase">Ocupado</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
          <span className="text-[10px] text-zinc-400 font-bold uppercase">Selecionado</span>
        </div>
      </div>
    </div>
  );
};

export default SeatMap;