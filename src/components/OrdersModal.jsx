import { useState } from 'react';
import { supabase } from '../services/api';

export default function OrdersModal({ isOpen, onClose }) {
  const [email, setEmail] = useState('');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    const { data, error } = await supabase
      .from('listas_pedidos_clientes')
      .select('*')
      .eq('cliente_email', email);

    if (error) setError('Erro ao buscar pedidos.');
    else setOrders(data);
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-[200] flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Entrar </h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-white bg-zinc-800 px-4 py-2 rounded-lg text-sm">Fechar</button>
        </div>
        
        <div className="flex gap-2 mb-6">
          <input 
            type="email" placeholder="Digite seu e-mail" className="flex-1 bg-zinc-800 p-3 rounded-xl border border-zinc-700 text-white"
            value={email} onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={fetchOrders} className="bg-yellow-500 px-6 rounded-xl font-bold text-black">Buscar</button>
        </div>

        {loading ? <p>Buscando...</p> : (
          <div className="space-y-4">
            {orders.map((o) => (
              <div key={o.id_pedido} className="bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                <p className="font-bold">{o.filme_titulo} - <span className="text-yellow-500">{o.sala_nome}</span></p>
                <p className="text-sm text-zinc-400">{o.data_sessao} às {o.horario_inicio}</p>
                <p className="text-xs text-zinc-500 mt-2">Pedido: {o.id_pedido}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}