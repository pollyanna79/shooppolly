import { useState, useEffect } from 'react'
import { supabase } from './services/api'
import { MdEventSeat } from 'react-icons/md'
import MovieCard from './components/MovieCard'
import SeatMap from './components/SeatMap'
import './App.css'

function App() {
  const [movies, setMovies] = useState([])
  const [selectedMovie, setSelectedMovie] = useState(null)
  const [seats, setSeats] = useState([])
  const [selectedSeat, setSelectedSeat] = useState(null)
  const [loading, setLoading] = useState(true)
  const [sessionDetails, setSessionDetails] = useState(null)

  // 1. Busca os filmes do Supabase ao carregar a página
  useEffect(() => {
    async function getMovies() {
      setLoading(true)
      // Buscamos os filmes e trazemos a sessão mais próxima de cada um
      const { data, error } = await supabase
        .from('filmes')
        .select(`
        *,
        sessoes (
          dia,
          horario_inicio
        )
      `)

      if (error) console.error('Erro ao buscar filmes:', error)
      else setMovies(data)
      setLoading(false)
    }
    getMovies()
  }, [])
  const handleSelectMovie = async (movie) => {
    setSelectedMovie(movie);
    setLoading(true);
    setSelectedSeat(null);
    setSeats([]); // Limpa os assentos para não mostrar os do filme anterior

    try {
      // 1. Busca a sessão (Usando maybeSingle para não dar erro se estiver vazio)
      const { data: sessionData, error: sessError } = await supabase
        .from('sessoes')
        .select(`
        id, dia, horario_inicio,
        salas ( nome )
      `)
        .eq('filme_id', movie.id)
        .order('dia', { ascending: true })
        .order('horario_inicio', { ascending: true })
        .limit(1)
        .maybeSingle(); // <--- MUDANÇA AQUI (Evita o erro PGRST116)

      if (sessError) throw sessError;

      // Se não existir sessão para este filme, paramos por aqui
      if (!sessionData) {
        console.warn("Nenhuma sessão encontrada para este filme.");
        setSessionDetails(null);
        setLoading(false);
        return;
      }

      setSessionDetails(sessionData);

      // 2. Busca os assentos usando o ID da sessão encontrada
      const { data: seatsData, error: seatsError } = await supabase
        .from('visualizacao_filme')
        .select('*')
        .eq('sessao_id', sessionData.id);

      if (seatsError) throw seatsError;

      if (seatsData) {
        const formattedSeats = seatsData.map(item => ({
          id: item.assento_id,
          fileira: item.fileira,
          numero: item.numero,
          status: item.status,
          sessao_id: item.sessao_id
        }));
        setSeats(formattedSeats);
      }

    } catch (error) {
      console.error('Erro detalhado:', error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans">
      {/* HEADER ESTILIZADO */}
      <header className="py-6 px-8 border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-md sticky top-0 z-50">
        <h1 className="text-3xl font-black tracking-tighter logo">
          CINEMARK<span className="text-yellow-500 italic">POLLY</span>
        </h1>
      </header>

      <main className="max-w-7xl mx-auto p-4 sm:p-8">
        {!selectedMovie ? (
          /* TELA 1: LISTA DE FILMES */
          <section className="animate-in fade-in duration-500">
            <h2 className="text-2xl font-bold mb-8 border-l-4 border-yellow-500 pl-4">Filmes em Cartaz</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {movies.map(movie => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  onSelect={() => handleSelectMovie(movie)}
                />
              ))}
            </div>
          </section>
        ) : (
          /* TELA 2: RESERVA */
          <section className="animate-in slide-in-from-right duration-500">
            {/* BOTÃO VOLTAR */}
            <button
              className="flex items-center gap-2 text-zinc-400 hover:text-yellow-500 transition-colors mb-8 group"
              onClick={() => { setSelectedMovie(null); setSelectedSeat(null); }}
            >
              <span className="group-hover:-translate-x-1 transition-transform">←</span> Voltar para a vitrine
            </button>

            <div className="grid lg:grid-cols-3 gap-10 items-start">

              {/* COLUNA DO MAPA (2/3) */}
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h2 className="text-4xl font-black uppercase tracking-tight">{selectedMovie.titulo}</h2>
                  {sessionDetails && (
                    <div className="flex flex-wrap gap-3 mt-3">
                      <span className="bg-zinc-800 px-3 py-1 rounded-full text-xs font-bold text-zinc-300">
                        SALA: {sessionDetails.salas?.nome}
                      </span>
                      <span className="bg-yellow-500/10 border border-yellow-500/20 px-3 py-1 rounded-full text-xs font-bold text-yellow-500">
                        {new Date(sessionDetails.dia).toLocaleDateString('pt-BR')} • {sessionDetails.horario_inicio?.slice(0, 5)}
                      </span>
                    </div>
                  )}
                </div>

                {/* COMPONENTE DO MAPA */}
                <SeatMap
                  seats={seats}
                  selectedSeat={selectedSeat}
                  onSelectSeat={setSelectedSeat}
                />
              </div>

              {/* COLUNA DO RESUMO (1/3) */}
              <aside className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl sticky top-28 shadow-2xl">
                <h3 className="text-xl font-bold mb-6 pb-4 border-b border-zinc-800">Resumo do Pedido</h3>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Filme:</span>
                    <span className="font-medium text-right">{selectedMovie.titulo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Sessão:</span>
                    <span className="font-medium">{sessionDetails?.horario_inicio?.slice(0, 5)}h</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-zinc-950 rounded-xl border border-zinc-800">
                    <span className="text-zinc-500">Assento:</span>
                    <span className="text-2xl font-black text-yellow-500">
                      {selectedSeat ? `${selectedSeat.fileira}${selectedSeat.numero}` : '--'}
                    </span>
                  </div>
                </div>

                {/* BOTÃO DE CONFIRMAÇÃO */}
                <button
                  className={`w-full py-4 rounded-2xl font-bold text-lg transition-all shadow-lg ${selectedSeat
                    ? 'bg-yellow-500 text-black hover:bg-yellow-400 active:scale-95 shadow-yellow-500/20'
                    : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                    }`}
                  disabled={!selectedSeat}
                  onClick={() => alert(`Reserva confirmada! Assento: ${selectedSeat.fileira}${selectedSeat.numero}`)}
                >
                  {selectedSeat ? 'Finalizar Reserva' : 'Selecione um Assento'}
                </button>

                <p className="text-[10px] text-zinc-600 text-center mt-4 uppercase tracking-widest">
                  Sujeito a disponibilidade de sala
                </p>
              </aside>

            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;