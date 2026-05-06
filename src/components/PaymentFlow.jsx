import React, { useState } from 'react';


const PaymentFlow = ({ total, onFinalize, loading }) => {
    const [step, setStep] = useState('dados'); // dados, metodo, pix, cartao, sucesso
    const [method, setMethod] = useState('');
    const [formData, setFormData] = useState({ nome: '', email: '', cartaoNum: '', cartaoNome: '', validade: '', cvv: '' });

    // Simulação de bandeira de cartão
    const getCardType = (num) => {
        if (num.startsWith('4')) return 'VISA';
        if (num.startsWith('5')) return 'MASTERCARD';
        return 'CARTÃO';
    };

    const handleFinish = () => {
        if (step === 'pix' || step === 'cartao') {
            onFinalize(formData); // Chama a função que salva no Supabase
            setStep('sucesso');
        }
    };

    if (step === 'sucesso') {
        return (
            <div className="text-center py-8 animate-in zoom-in duration-300">
                <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/20">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                </div>
                <h2 className="text-2xl font-black text-white italic">COMPRA CONCLUÍDA!</h2>
                <p className="text-zinc-400 mt-4 px-6">Obrigado pela preferência. Seus ingressos foram enviados para <b>{formData.email}</b>.</p>
            </div>
        );
    }

    return (
        <div className="p-2">
            {/* Passo 1: Dados Pessoais */}
            {step === 'dados' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                    <h3 className="text-white font-bold uppercase text-sm tracking-widest border-b border-zinc-800 pb-2">Seus Dados</h3>
                    <input type="text" placeholder="NOME COMPLETO" className="w-full bg-zinc-800 border-zinc-700 rounded-xl p-3 text-white focus:ring-2 ring-yellow-500 outline-none" onChange={(e) => setFormData({ ...formData, nome: e.target.value })} />
                    <input type="email" placeholder="E-MAIL PARA RECEBER INGRESSO" className="w-full bg-zinc-800 border-zinc-700 rounded-xl p-3 text-white focus:ring-2 ring-yellow-500 outline-none" onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                    <button disabled={!formData.nome || !formData.email} onClick={() => setStep('metodo')} className="w-full bg-yellow-500 text-black font-black py-4 rounded-xl hover:bg-yellow-400 disabled:opacity-50">PRÓXIMO</button>
                </div>
            )}

            {/* Passo 2: Método de Pagamento */}
            {step === 'metodo' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                    <h3 className="text-white font-bold uppercase text-sm tracking-widest border-b border-zinc-800 pb-2">Pagamento: R$ {total.toFixed(2)}</h3>
                    <button onClick={() => { setMethod('pix'); setStep('pix'); }} className="w-full bg-zinc-800 hover:bg-zinc-700 p-5 rounded-2xl flex items-center gap-4 transition-all border border-transparent hover:border-emerald-500 group">
                        <div className="w-10 h-10 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center font-black">X</div>
                        <span className="text-white font-bold uppercase tracking-widest">Pagar com PIX</span>
                    </button>
                    <button onClick={() => { setMethod('cartao'); setStep('cartao'); }} className="w-full bg-zinc-800 hover:bg-zinc-700 p-5 rounded-2xl flex items-center gap-4 transition-all border border-transparent hover:border-blue-500">
                        <div className="w-10 h-10 bg-blue-500/20 text-blue-500 rounded-full flex items-center justify-center">💳</div>
                        <span className="text-white font-bold uppercase tracking-widest">Cartão de Crédito</span>
                    </button>
                </div>
            )}

            {/* Passo 3: PIX */}
            {step === 'pix' && (
                <div className="space-y-6 text-center animate-in fade-in slide-in-from-right-4">
                    {/* IMAGEM DO QRCODE AQUI */}
                    <div className="bg-white p-4 rounded-2xl inline-block shadow-xl">
                        <img
                            src="/pix.jpg"
                            alt="QR Code Pix"
                            className="w-40 h-40 object-contain mx-auto block"
                            style={{ minWidth: '176px', minHeight: '176px' }}
                            onLoad={() => console.log("Imagem carregada com sucesso!")}
                            onError={(e) => {
                                console.error("Erro ao carregar /public/qrcode.jpg");
                                e.target.style.display = 'none'; // Esconde a imagem quebrada
                                e.target.insertAdjacentHTML('afterend', '<div class="text-zinc-400 text-[10px] p-8 border-2 border-dashed border-zinc-200 rounded-lg">QR CODE<br/>NÃO ENCONTRADO<br/>NA PASTA PUBLIC</div>');
                            }}
                        />
                    </div>

                    <div className="text-left">
                        <p className="text-xs text-zinc-500 font-bold mb-2 uppercase tracking-widest text-center">Escaneie ou copie o código</p>
                        <div
                            onClick={() => {
                                navigator.clipboard.writeText("00020126580014BR.GOV.BCB.PIX0136cinemarkpolly-9922-4411-8833-2211520400005303986");
                                alert("Código copiado!");
                            }}
                            className="bg-black/50 p-4 rounded-xl border border-zinc-800 break-all text-[10px] font-mono text-emerald-500 cursor-pointer hover:bg-black/80 active:scale-95 transition-all"
                        >
                            00020126580014BR.GOV.BCB.PIX0136cinemarkpolly-9922-4411-8833-2211520400005303986
                        </div>
                    </div>

                    <button
                        onClick={handleFinish}
                        className="w-full bg-emerald-600 text-white font-black py-4 rounded-xl hover:bg-emerald-500 shadow-lg shadow-emerald-900/20"
                    >
                        JÁ PAGUEI / FINALIZAR
                    </button>
                </div>
            )}
            {/* Passo 3: CARTÃO */}
            {step === 'cartao' && (
                <div className="space-y-3 animate-in fade-in slide-in-from-right-4">
                    <div className="relative">
                        <input type="text" maxLength="16" placeholder="0000 0000 0000 0000" className="w-full bg-zinc-800 border-zinc-700 rounded-xl p-3 text-white focus:ring-2 ring-blue-500 outline-none" onChange={(e) => setFormData({ ...formData, cartaoNum: e.target.value })} />
                        <span className="absolute right-3 top-3 text-[10px] font-black text-blue-500 bg-blue-500/10 px-2 py-1 rounded border border-blue-500/20 uppercase tracking-tighter">
                            {getCardType(formData.cartaoNum)}
                        </span>
                    </div>
                    <input type="text" placeholder="NOME IMPRESSO NO CARTÃO" className="w-full bg-zinc-800 border-zinc-700 rounded-xl p-3 text-white focus:ring-2 ring-blue-500 outline-none uppercase" onChange={(e) => setFormData({ ...formData, cartaoNome: e.target.value })} />
                    <div className="flex gap-3">
                        <input type="text" maxLength="5" placeholder="MM/AA" className="w-2/3 bg-zinc-800 border-zinc-700 rounded-xl p-3 text-white focus:ring-2 ring-blue-500 outline-none" onChange={(e) => setFormData({ ...formData, validade: e.target.value })} />
                        <input type="text" maxLength="3" placeholder="CVV" className="w-1/3 bg-zinc-800 border-zinc-700 rounded-xl p-3 text-white focus:ring-2 ring-blue-500 outline-none" onChange={(e) => setFormData({ ...formData, cvv: e.target.value })} />
                    </div>
                    <button onClick={handleFinish} className="w-full bg-blue-600 text-white font-black py-4 rounded-xl hover:bg-blue-500">FINALIZAR PAGAMENTO</button>
                </div>
            )}
        </div>
    );
};

export default PaymentFlow;