import { useState, useEffect } from 'react'
import { supabase } from './services/api'
import MovieCard from './components/MovieCard'
import SeatMap from './components/SeatMap'
import PurchaseModal from './components/PurchaseModal'
import './App.css'

function App() {
  const [movies, setMovies] = useState([])
  const [selectedMovie, setSelectedMovie] = useState(null)
  const [seats, setSeats] = useState([])
  const [selectedSeat, setSelectedSeat] = useState(null)
  const [loading, setLoading] = useState(true)
  const [sessionDetails, setSessionDetails] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    async function getMovies() {
      setLoading(true)
      const { data, error } = await supabase
        .from('filmes')
        .select(`*, sessoes (dia, horario_inicio)`)
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
    setSeats([]);

    try {
      const { data: sessionData } = await supabase
        .from('sessoes')
        .select(`id, dia, horario_inicio, salas(nome)`)
        .eq('filme_id', movie.id)
        .limit(1)
        .maybeSingle();

      if (!sessionData) return;
      setSessionDetails(sessionData);

      const { data: seatsData } = await supabase
        .from('visualizacao_filme')
        .select('*')
        .eq('sessao_id', sessionData.id);

      if (seatsData) {
        // DEBUG: Veja no console (F12) o que o banco está enviando
        console.log("Dados brutos do banco:");
        console.table(seatsData);

        const formattedSeats = seatsData.map(item => {
          // LÓGICA BLINDADA: 
          // Se o status for 'ocupado' ou 'vendido', ele fica ocupado.
          // CASO CONTRÁRIO (disponivel, nulo, vazio), ele fica LIVRE.
          const isActuallyOccupied = item.status === 'ocupado' || item.status === 'vendido';

          return {
            id: item.assento_id,
            fileira: item.fileira,
            numero: item.numero,
            status: isActuallyOccupied ? 'ocupado' : 'livre', // Aqui garantimos o status
            sessao_id: item.sessao_id
          };
        });

        // Agrupamento por fileiras
        const grouped = formattedSeats.reduce((acc, seat) => {
          if (!acc[seat.fileira]) acc[seat.fileira] = [];
          acc[seat.fileira].push(seat);
          return acc;
        }, {});

        const rowsArray = Object.keys(grouped)
          .sort((a, b) => b.localeCompare(a))
          .map(label => ({
            letra: label,
            assentos: grouped[label].sort((a, b) => a.numero - b.numero)
          }));

        setSeats(rowsArray);
      }
    } catch (error) {
      console.error("Erro ao carregar mapa:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleConfirmReservation = async () => {
    // Verificações de segurança
    if (!selectedSeat || !sessionDetails) {
      alert("Por favor, selecione um assento primeiro.");
      return;
    }

    try {
      setLoading(true);

      // 1. Inserir na tabela public.ingressos
      const { data, error } = await supabase
        .from('ingressos')
        .insert([
          {
            sessao_id: sessionDetails.id, // ID da sessão atual
            assento_id: selectedSeat.id,  // ID do assento (assento_id que veio da View)
            status: 'vendido'             // Status padrão conforme seu banco
            // data_compra é preenchido automaticamente pelo DEFAULT CURRENT_TIMESTAMP
          }
        ])
        .select();

      if (error) throw error;

      // 2. Atualizar o estado local 'seats' para que o assento fique vermelho (ocupado) na hora
      setSeats(prevRows => prevRows.map(row => ({
        ...row,
        assentos: row.assentos.map(s =>
          s.id === selectedSeat.id ? { ...s, status: 'ocupado' } : s
        )
      })));

      // 3. Feedback para o usuário
      alert(`Sucesso! Assento ${selectedSeat.fileira}${selectedSeat.numero} reservado.`);

      // 4. Fechar modal e limpar seleção
      setIsModalOpen(false);
      setSelectedSeat(null);

    } catch (error) {
      console.error("Erro na reserva:", error);
      alert("Erro ao confirmar reserva: " + error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-yellow-500/30">
      <header className="py-6 px-8 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-[100]">
        <h1 className="text-3xl font-black tracking-tighter">
          CINEMARK<span className="text-yellow-500 italic">POLLY</span>
        </h1>
      </header>

      <main className="max-w-7xl mx-auto p-4 sm:p-8">
        {!selectedMovie ? (
          <section className="animate-in fade-in zoom-in-95 duration-500">
            <h2 className="text-2xl font-bold mb-8 border-l-4 border-yellow-500 pl-4">Filmes em Cartaz</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {movies.map(movie => (
                <MovieCard key={movie.id} movie={movie} onSelect={() => handleSelectMovie(movie)} />
              ))}
            </div>
          </section>
        ) : (
          <section className="animate-in slide-in-from-right-10 duration-500">
            <button
              className="mb-8 flex items-center gap-2 text-zinc-400 hover:text-yellow-500 transition-colors group"
              onClick={() => setSelectedMovie(null)}
            >
              <span className="group-hover:-translate-x-1 transition-transform">←</span> Voltar para Filmes
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              {/* MAPA (Esquerda) */}
              <div className="lg:col-span-8 w-full order-2 lg:order-1">
                <div className="mb-8">
                  <h2 className="text-4xl font-black uppercase tracking-tight">{selectedMovie.titulo}</h2>
                  <div className="flex gap-4 mt-2">
                    <span className="text-yellow-500 font-bold px-3 py-1 bg-yellow-500/10 rounded-full border border-yellow-500/20 text-sm">
                      {sessionDetails?.salas?.nome || 'Sala 01'}
                    </span>
                    <span className="text-zinc-400 font-medium px-3 py-1 bg-zinc-800 rounded-full text-sm">
                      {sessionDetails?.horario_inicio?.slice(0, 5)}h
                    </span>
                  </div>
                </div>

                <div className="relative z-10">
                  <SeatMap
                    seats={seats}
                    selectedSeat={selectedSeat}
                    onSelectSeat={setSelectedSeat}
                  />
                </div>
              </div>

              {/* RESUMO (Direita) */}
              <aside className="lg:col-span-4 order-1 lg:order-2 lg:sticky lg:top-32 z-20">
                <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl shadow-2xl shadow-black/50">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <span className="w-2 h-6 bg-yellow-500 rounded-full"></span>
                    Resumo do Pedido
                  </h3>

                  <div className="space-y-6 mb-8">
                    {/* Data */}
                    <div className="flex flex-col gap-1">
                      <span className="text-zinc-500 text-xs uppercase tracking-widest font-bold">Data da Sessão</span>
                      <p className="font-medium">
                        {sessionDetails ? new Date(sessionDetails.dia).toLocaleDateString('pt-BR') : '--/--/----'}
                      </p>
                    </div>

                    {/* Assento Selecionado Card */}
                    <div className="flex flex-col gap-1">
                      <span className="text-zinc-500 text-xs uppercase tracking-widest font-bold">Assento Selecionado</span>
                      <div className={`mt-1 p-5 rounded-2xl border transition-all duration-500 flex justify-between items-center ${selectedSeat
                        ? 'bg-yellow-500/10 border-yellow-500/50 shadow-[0_0_20px_rgba(234,179,8,0.1)]'
                        : 'bg-zinc-950 border-zinc-800'
                        }`}>
                        <span className="text-zinc-500 text-sm font-medium italic">
                          {selectedSeat ? 'Posição:' : 'Aguardando...'}
                        </span>
                        <span className={`text-3xl font-black tracking-tighter ${selectedSeat ? 'text-yellow-500 scale-110' : 'text-zinc-800'} transition-all`}>
                          {selectedSeat ? `${selectedSeat.fileira}${selectedSeat.numero}` : '--'}
                        </span>
                      </div>

                      {selectedSeat && (
                        <p className="text-[10px] text-emerald-500 font-bold mt-2 animate-pulse uppercase tracking-tighter">
                          ✓ Pronto para reservar
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    disabled={!selectedSeat || loading}
                    onClick={() => setIsModalOpen(true)}
                    className={`w-full py-5 rounded-2xl font-black text-lg transition-all active:scale-95 shadow-xl ${selectedSeat
                      ? 'bg-yellow-500 text-black hover:bg-yellow-400'
                      : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                      }`}
                  >
                    {loading ? 'PROCESSANDO...' : 'RESERVAR AGORA'}
                  </button>
                </div>
              </aside>
            </div>
          </section>
        )}
      </main>

      <PurchaseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedMovie={selectedMovie}
        selectedSeat={selectedSeat}
        // Esta é a função que criamos no passo anterior que faz o INSERT no banco
        onConfirm={handleConfirmReservation}
        loading={loading}
      />
    </div>
  );
}
export default App;