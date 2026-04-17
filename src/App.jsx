import { useState, useEffect } from 'react'
import { supabase } from './services/api'
import MovieCard from './components/MovieCard'
import SeatMap from './components/SeatMap'
import './App.css'

function App() {
  const [movies, setMovies] = useState([])
  const [selectedMovie, setSelectedMovie] = useState(null)
  const [seats, setSeats] = useState([])
  const [selectedSeat, setSelectedSeat] = useState(null)
  const [loading, setLoading] = useState(true)

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

  // 2. Busca os assentos da sessão quando um filme é clicado
 const handleSelectMovie = async (movie) => {
  setSelectedMovie(movie);
  setLoading(true);

  // Buscamos os dados daquela View que criamos no SQL
  const { data, error } = await supabase
    .from('visualizacao_filme')
    .select('*')
    .eq('filme_id', movie.id);

  if (error) {
    console.error('Erro ao buscar assentos:', error);
  } else {
    // Mapeamos para o formato que seu SeatMap espera
    const formattedSeats = data.map(item => ({
      id: item.assento_id,
      fileira: item.fileira,
      numero: item.numero,
      status: item.status === 'vendido' ? 'ocupado' : 'disponivel', // Tradução aqui!
      sessao_id: item.sessao_id
    }));
    setSeats(formattedSeats);
  }
  setLoading(false);
};
  return (
    <div className="app-container">
      <header className="header">
        <h1 className="logo">Cinemark<span>Polly</span></h1>
      </header>

      <main className="content">
        {!selectedMovie ? (
          /* TELA 1: LISTA DE FILMES */
          <section className="movie-grid">
            {movies.map(movie => (
              <MovieCard 
                key={movie.id} 
                movie={movie} 
                onSelect={() => handleSelectMovie(movie)} 
              />
            ))}
          </section>
        ) : (
          /* TELA 2: MAPA DE ASSENTOS */
          <section className="booking-area">
            <button className="back-btn" onClick={() => setSelectedMovie(null)}>
              ← Voltar para Filmes
            </button>
            
            <div className="booking-layout">
              <div className="seats-section">
                <h2>{selectedMovie.titulo}</h2>
                <p className="session-info">Escolha seu lugar (Fileira E é o fundo)</p>
                <SeatMap 
                  seats={seats} 
                  selectedSeat={selectedSeat} 
                  onSelectSeat={setSelectedSeat} 
                />
              </div>

              <div className="summary-section">
                <h3>Resumo</h3>
                <p>Filme: <strong>{selectedMovie.titulo}</strong></p>
                <p>Assento: <strong>{selectedSeat ? `${selectedSeat.fileira}${selectedSeat.numero}` : 'Selecione...'}</strong></p>
                <button 
                  className="confirm-btn" 
                  disabled={!selectedSeat}
                  onClick={() => alert('Compra realizada!')}
                >
                  Confirmar Reserva
                </button>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  )
}

export default App
