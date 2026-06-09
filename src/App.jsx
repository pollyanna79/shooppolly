import { useState, useEffect } from 'react'
import { supabase } from './services/api'
import MovieCard from './components/MovieCard'
import SeatMap from './components/SeatMap'
import PurchaseModal from './components/PurchaseModal'
import Footer from './components/Footer'
import CinemaLocation from './components/CinemaLocation'
import './App.css'

function App() {
  const [movies, setMovies] = useState([])
  const [selectedMovie, setSelectedMovie] = useState(null)
  const [seats, setSeats] = useState([])
  const [selectedSeat, setSelectedSeat] = useState([])
  const [loading, setLoading] = useState(true)
  const [sessionDetails, setSessionDetails] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [viewLocation, setViewLocation] = useState(false)

  // 1. Carregar filmes ao iniciar
  useEffect(() => {
    async function getMovies() {
      setLoading(true)
      const { data, error } = await supabase
        .from('filmes')
        .select(`*, sessoes (id, dia, horario_inicio)`)
      if (error) console.error('Erro ao buscar filmes:', error)
      else setMovies(data)
      setLoading(false)
    }
    getMovies()
  }, [])

  // 2. Selecionar Filme e Buscar Assentos da View
  const handleSelectMovie = async (movie) => {
    setSelectedMovie(movie)
    setLoading(true)
    setSelectedSeat([]) // Limpa seleção anterior

    try {
      const { data: sessionData } = await supabase
        .from('sessoes')
        .select(`id, dia, horario_inicio, salas(nome)`)
        .eq('filme_id', movie.id)
        .limit(1)
        .maybeSingle()

      if (!sessionData) {
        setSeats([])
        setLoading(false) // CORREÇÃO: Desativa o loading se não houver sessão
        return
      }
      setSessionDetails(sessionData)

      const { data: seatsData, error: seatsError } = await supabase
        .from('visualizacao_filme')
        .select('*')
        .eq('sessao_id', sessionData.id)

      if (seatsError) {
        console.error('Erro do Supabase ao buscar assentos:', seatsError)
        setLoading(false) // CORREÇÃO: Desativa o loading em caso de erro
        return
      }

      if (seatsData && seatsData.length > 0) {
        const formattedSeats = seatsData.map((item) => {
          const assentoId = item.id || item.assento_id
          const fileiraLetra = item.fileira ? String(item.fileira).trim().toUpperCase() : '?'

          return {
            id: assentoId,
            fileira: fileiraLetra,
            numero: Number(item.numero),
            status: String(item.status).toLowerCase() === 'ocupado' ? 'ocupado' : 'livre',
          }
        })

        // Agrupamento por fileiras seguro
        const grouped = formattedSeats.reduce((acc, seat) => {
          if (!acc[seat.fileira]) acc[seat.fileira] = []
          acc[seat.fileira].push(seat)
          return acc
        }, {})

        const rowsArray = Object.keys(grouped)
          .sort((a, b) => b.localeCompare(a))
          .map((label) => ({
            letra: label,
            assentos: grouped[label].sort((a, b) => a.numero - b.numero),
          }))

        setSeats(rowsArray)
      } else {
        console.warn(`A view 'visualizacao_filme' não retornou assentos para a sessão: ${sessionData.id}`)
        setSeats([])
      }
    } catch (err) {
      console.error('Erro inesperado:', err)
    } finally {
      setLoading(false) // CORREÇÃO: Garante que o loading termine aqui
    }
  } // CORREÇÃO: Fechamento da chave da função handleSelectMovie que estava faltando!

  // 3. Gerenciar seleção de assentos individuais
  const handleSelectSeat = (seat) => {
    setSelectedSeat((prev) => {
      const isSelected = prev.some((s) => s.id === seat.id)
      if (isSelected) {
        return prev.filter((s) => s.id !== seat.id)
      }
      return [...prev, seat]
    })
  }

// 4. Confirmar Reserva e Gravar no Banco
 const handleConfirmReservation = async (dadosDoPagamento) => {
  // 1. TRAVA DE SEGURANÇA: Se não houver filme, interrompe antes de qualquer erro
  if (!selectedMovie) {
    alert("Erro: Nenhum filme selecionado.");
    return;
  }

  setLoading(true);
  try {
    // 2. Cálculo seguro do valor
    const precoUnitario = selectedMovie.preco_base || 0;
    const valorFinal = precoUnitario * selectedSeat.length;

    // 3. Inserir na tabela cinema_compras
    const { data: novaCompra, error: compraError } = await supabase
      .from('cinema_compras')
      .insert([
        {
          id_pedido: dadosDoPagamento.id_pedido,
          nome: dadosDoPagamento.nome,
          email: dadosDoPagamento.email,
          pagamento: dadosDoPagamento.pagamento,
          status: 'CONCLUÍDO', // Mudei para CONCLUÍDO conforme seu PaymentFlow
          numero_cartao: dadosDoPagamento.numero_cartao || 0,
          validade: dadosDoPagamento.validade || null,
          valor: valorFinal
        },
      ])
      .select('id'); 

    if (compraError) throw compraError;

    const idGeradoNaCompra = novaCompra[0].id;

    // 4. Inserir na tabela ingressos
    const novasReservas = selectedSeat.map((seat) => ({
      sessao_id: sessionDetails.id,
      assento_id: seat.id,
      status: 'vendido',
      id_cliente: idGeradoNaCompra
    }));

    const { error: ingressoError } = await supabase
      .from('ingressos')
      .insert(novasReservas);

    if (ingressoError) throw ingressoError;

    alert('Reserva concluída com sucesso!');
    setIsModalOpen(false); // Fecha o modal
    setSelectedSeat([]);  // Limpa os assentos
  } catch (error) {
    console.error('Erro ao gravar:', error);
    alert('Erro ao gravar: ' + error.message);
  } finally {
    setLoading(false);
  }
};
  
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-yellow-500/30">
      {/* HEADER */}
      <header className="py-6 px-8 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-[100]">
        <h1
          className="text-3xl font-black tracking-tighter cursor-pointer"
          onClick={() => {
            setViewLocation(false)
            setSelectedMovie(null)
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
        >
          CINEMARK<span className="text-yellow-500 italic">POLLY</span>
        </h1>
      </header>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="max-w-7xl mx-auto p-4 sm:p-8">
        {viewLocation ? (
          <CinemaLocation onBack={() => setViewLocation(false)} />
        ) : (
          <>
            {!selectedMovie ? (
              /* LISTA DE FILMES */
              <section className="animate-in fade-in zoom-in-95 duration-500">
                <h2 className="text-2xl font-bold mb-8 border-l-4 border-yellow-500 pl-4">Filmes em Cartaz</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {movies.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} onSelect={() => handleSelectMovie(movie)} />
                  ))}
                </div>
              </section>
            ) : (
              /* MAPA DE ASSENTOS E RESUMO */
              <section className="animate-in slide-in-from-right-10 duration-500">
                <button
                  className="mb-8 flex items-center gap-2 text-zinc-400 hover:text-yellow-500 transition-colors group"
                  onClick={() => setSelectedMovie(null)}
                >
                  <span className="group-hover:-translate-x-1 transition-transform">←</span> Voltar para Filmes
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                  {/* LADO ESQUERDO: MAPA */}
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
                      {loading ? (
                        <div className="text-center py-20 text-zinc-500 animate-pulse">Carregando mapa de assentos...</div>
                      ) : (
                        <SeatMap
                          seats={seats}
                          selectedSeat={selectedSeat}
                          onSelectSeat={setSelectedSeat} // Mantenha exatamente assim (o gancho direto do useState)
                        />
                      )}
                    </div>
                  </div>

                  {/* LADO DIREITO: RESUMO */}
                  <aside className="lg:col-span-4 order-1 lg:order-2 lg:sticky lg:top-32 z-20">
                    <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl shadow-2xl shadow-black/50">
                      <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <span className="w-2 h-6 bg-yellow-500 rounded-full"></span>
                        Resumo do Pedido
                      </h3>

                      <div className="space-y-6 mb-8">
                        <div className="flex flex-col gap-1">
                          <span className="text-zinc-500 text-xs uppercase tracking-widest font-bold">Assentos Selecionados</span>
                          <div
                            className={`mt-1 p-5 rounded-2xl border transition-all duration-500 flex justify-between items-center ${selectedSeat.length > 0
                              ? 'bg-yellow-500/10 border-yellow-500/50 shadow-[0_0_20px_rgba(234,179,8,0.1)]'
                              : 'bg-zinc-950 border-zinc-800'
                              }`}
                          >
                            <span className="text-zinc-500 text-sm font-medium italic">
                              {selectedSeat.length > 0 ? 'Posições:' : 'Aguardando...'}
                            </span>
                            <span
                              className={`text-xl font-black tracking-tighter ${selectedSeat.length > 0 ? 'text-yellow-500' : 'text-zinc-800'
                                } transition-all`}
                            >
                              {selectedSeat.length > 0
                                ? selectedSeat.map((s) => `${s.fileira}${s.numero}`).join(', ')
                                : '--'}
                            </span>
                          </div>

                          {selectedSeat.length > 0 && (
                            <p className="text-[10px] text-emerald-500 font-bold mt-2 animate-pulse uppercase tracking-tighter">
                              ✓ {selectedSeat.length} assento(s) prontos para reservar
                            </p>
                          )}
                        </div>
                      </div>

                      <button
                        disabled={selectedSeat.length === 0 || loading}
                        onClick={() => setIsModalOpen(true)}
                        className={`w-full py-5 rounded-2xl font-black text-lg transition-all active:scale-95 shadow-xl ${selectedSeat.length > 0
                          ? 'bg-yellow-500 text-black hover:bg-yellow-400'
                          : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                          }`}
                      >
                        {loading ? 'PROCESSANDO...' : `RESERVAR ${selectedSeat.length > 0 ? selectedSeat.length : ''} AGORA`}
                      </button>
                    </div>
                  </aside>
                </div>
              </section>
            )}
          </>
        )}
      </main>

 {isModalOpen && selectedMovie && (
  <PurchaseModal
    isOpen={isModalOpen}
    onClose={() => setIsModalOpen(false)}
    selectedMovie={selectedMovie}
    selectedSeat={selectedSeat}
    onConfirm={handleConfirmReservation}
    loading={loading}
    // Passamos o preço apenas se o objeto existir
    precoBase={selectedMovie.preco_base || 0}
  />
)}

      {/* FOOTER */}
      <Footer
        onShowLocation={() => {
          setViewLocation(true)
          setSelectedMovie(null)
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }}
      />
    </div>
  )
}

export default App;
