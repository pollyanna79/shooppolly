import React from 'react';

const MovieCard = ({ movie, onSelect }) => {
  const primeiraSessao = movie.sessoes?.[0];
  
  const formatarData = (dataStr) => {
    if (!dataStr) return 'Em breve';
    const [ano, mes, dia] = dataStr.split('-');
    return `${dia}/${mes}`;
  };

  return (
    <div className="flex flex-col gap-3 group">
      {primeiraSessao && (
        <div className="flex flex-col items-center">
          <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Estreia</span>
          <div className="bg-red-600 text-white px-4 py-1 rounded-full shadow-lg flex gap-2 items-center">
            <span className="font-black text-sm">{formatarData(primeiraSessao.dia)}</span>
            <span className="w-1 h-1 bg-white/40 rounded-full"></span>
            <span className="font-medium text-xs">{primeiraSessao.horario_inicio.slice(0, 5)}h</span>
          </div>
        </div>
      )}

      <div 
        onClick={onSelect} 
        className="relative bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden cursor-pointer hover:border-red-500 transition-all duration-500"
      >
        <div className="w-full h-[400px] bg-black flex items-center justify-center">
          <img
            src={movie.capa_url}
            alt={movie.titulo}
            className="w-full h-full object-contain transform group-hover:scale-105 transition-transform"
          />
        </div>
        <div className="p-4 text-center bg-zinc-900">
          <p className="text-red-500 text-[10px] font-bold uppercase mb-1">{movie.categoria}</p>
          <h3 className="text-white font-bold text-lg truncate">{movie.titulo}</h3>
        </div>
      </div>
    </div>
  );
};

// ESSA LINHA É A MAIS IMPORTANTE:
export default MovieCard;
